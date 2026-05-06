import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicConfig, isSupabaseConfigError } from "@/lib/supabase/config";
import { linkonEnv } from "@/lib/linkon/env";

const PROTECTED_PAGE_ROUTES = ["/select-service", "/admin"];
const PROTECTED_REDIRECT_API_ROUTES = ["/api/auth/token"];
const PROTECTED_JSON_API_ROUTES = ["/api/admin"];

function pathStartsWith(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isProtectedPath(pathname: string) {
  return (
    pathStartsWith(pathname, PROTECTED_PAGE_ROUTES) ||
    pathStartsWith(pathname, PROTECTED_REDIRECT_API_ROUTES) ||
    pathStartsWith(pathname, PROTECTED_JSON_API_ROUTES)
  );
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathStartsWith(pathname, PROTECTED_JSON_API_ROUTES);
}

function shouldReturnJson(pathname: string) {
  return pathStartsWith(pathname, PROTECTED_JSON_API_ROUTES);
}

function isBootstrapSuperAdmin(email: string | undefined | null) {
  const superAdminEmail = linkonEnv.superAdminEmail();
  return Boolean(email && superAdminEmail && email.trim().toLowerCase() === superAdminEmail);
}

function redirectToLogin(request: NextRequest, error?: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";

  if (error) {
    loginUrl.searchParams.set("error", error);
  } else {
    loginUrl.searchParams.set("redirect", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  }

  return NextResponse.redirect(loginUrl);
}

function deny(request: NextRequest, status: 401 | 403 | 503, message: string, error?: string) {
  if (shouldReturnJson(request.nextUrl.pathname)) {
    return NextResponse.json({ error: message, code: error }, { status });
  }

  return redirectToLogin(request, error);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  let supabaseConfig: ReturnType<typeof getSupabasePublicConfig>;

  try {
    supabaseConfig = getSupabasePublicConfig();
  } catch (error) {
    if (isSupabaseConfigError(error)) {
      return deny(request, 503, "Supabase authentication is not configured.", "service_unavailable");
    }

    throw error;
  }

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return deny(request, 401, "Sign-in is required.");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, account_status, deleted_at")
    .eq("id", user.id)
    .maybeSingle();

  const accountStatus = typeof profile?.account_status === "string" ? profile.account_status : "active";
  const deletedAt = typeof profile?.deleted_at === "string" ? profile.deleted_at : null;

  if (accountStatus === "suspended") {
    return deny(request, 403, "This account is suspended.", "account_suspended");
  }

  if (accountStatus === "deleted" || deletedAt) {
    return deny(request, 403, "This account is deleted.", "account_deleted");
  }

  if (isAdminPath(pathname) && profile?.role !== "super_admin" && !isBootstrapSuperAdmin(user.email)) {
    return deny(request, 403, "Super admin access is required.", "admin_required");
  }

  return response;
}

export const config = {
  matcher: [
    "/select-service/:path*",
    "/admin/:path*",
    "/api/auth/token/:path*",
    "/api/admin/:path*",
  ],
};
