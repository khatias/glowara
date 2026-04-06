import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/reset-password";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?message=Missing recovery code", request.url)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?message=Recovery link is invalid or expired", request.url)
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}