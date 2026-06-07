import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    const isOnboarding = pathname === "/dashboard/onboarding";
    const isDashboard = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

    let onboardingCompleted = user?.user_metadata?.onboarding_completed === true;

    if (user && !onboardingCompleted) {
      try {
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .single();

        if (restaurant?.onboarding_completed) {
          onboardingCompleted = true;
        }
      } catch {
        // restaurants table may not exist yet
      }
    }

    if (user && pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = onboardingCompleted ? "/dashboard/home" : "/dashboard/onboarding";
      return NextResponse.redirect(url);
    }

    if (!user && isDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user && isDashboard && !isOnboarding && !onboardingCompleted) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/onboarding";
      return NextResponse.redirect(url);
    }

    if (user && isOnboarding && onboardingCompleted) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/home";
      return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = onboardingCompleted ? "/dashboard/home" : "/dashboard/onboarding";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
