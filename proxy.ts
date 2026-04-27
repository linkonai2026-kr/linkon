import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getBlockedReason, getCanonicalUserProfile } from "@/lib/linkon/users";
import { getSupabasePublicConfig, isSupabaseConfigError } from "@/lib/supabase/config";

const PROTECTED_ROUTES = ["/select-service", "/admin", "/api/auth/token", "/api/admin"];

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  let supabaseConfig: ReturnType<typeof getSupabasePublicConfig>;

  try {
    supabaseConfig = getSupabasePublicConfig();
  } catch (error) {
    if (isSupabaseConfigError(error)) {
      return redirectToLogin(request, "service_unavailable");
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
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  const profile = await getCanonicalUserProfile(user.id);

  if (profile) {
    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      return redirectToLogin(request, blockedReason);
    }

    if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) && profile.role !== "super_admin") {
      return redirectToLogin(request, "admin_required");
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/select-service",
    "/admin/:path*",
    "/api/auth/token/:path*",
    "/api/admin/:path*",
  ],
};
