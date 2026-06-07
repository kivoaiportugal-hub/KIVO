import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const onboardingCompleted = user?.user_metadata?.onboarding_completed === true;
  const isOnboarding = pathname === "/dashboard/onboarding";

  // Redirect authenticated users from root to dashboard (or onboarding)
  if (user && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = onboardingCompleted ? "/dashboard/home" : "/dashboard/onboarding";
    return NextResponse.redirect(url);
  }

  // Protected routes: redirect to login if not authenticated
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect to onboarding if not completed (but allow onboarding route itself)
  if (user && pathname.startsWith("/dashboard") && !isOnboarding && !onboardingCompleted) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/onboarding";
    return NextResponse.redirect(url);
  }

  // Redirect away from onboarding if already completed
  if (user && isOnboarding && onboardingCompleted) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/home";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = onboardingCompleted ? "/dashboard/home" : "/dashboard/onboarding";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
