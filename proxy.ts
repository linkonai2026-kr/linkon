import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getBlockedReason, getCanonicalUserProfile } from "@/lib/linkon/users";

// 인증이 필요한 라우트
const PROTECTED_ROUTES = ["/select-service", "/admin", "/api/auth/token", "/api/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  const profile = await getCanonicalUserProfile(user.id);

  if (profile) {
    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", blockedReason);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (profile.role !== "super_admin") {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("error", "admin_required");
        return NextResponse.redirect(loginUrl);
      }
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
