import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard/home";

  if (code) {
    const supabaseResponse = NextResponse.next({ request });
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
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = `${origin}${next}`;
      const redirectResponse = NextResponse.redirect(redirectUrl, 302);

      // Copy all cookies from supabaseResponse to redirectResponse
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
