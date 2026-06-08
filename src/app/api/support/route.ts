import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { restaurant_id, subject, message } = await request.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Store support request as an alert
  await admin.from("alerts").insert({
    restaurant_id: restaurant_id || user.id,
    type: "support_request",
    title: subject,
    message: message,
    severity: "info",
    read: false,
    metadata: { user_email: user.email, user_id: user.id },
  });

  return NextResponse.json({ success: true });
}
