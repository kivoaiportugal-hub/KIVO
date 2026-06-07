import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
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
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isDashboard = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (!user && isDashboard) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard/assistant", request.url));
    }

    return response;
  } catch {
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
