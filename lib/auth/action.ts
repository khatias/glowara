"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/auth/validation";

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function fromZodError(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): ActionState {
  const fieldErrors = error.flatten().fieldErrors;
  return {
    success: false,
    errors: Object.fromEntries(
      Object.entries(fieldErrors)
        .filter(([, v]) => v && v.length > 0)
        .map(([k, v]) => [k, v![0]]),
    ),
  };
}

export async function loginAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ...fromZodError(parsed.error),
      values: { email: raw.email },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.error("[loginAction]", error);
    return {
      success: false,
      message:
        error.status === 400
          ? "ელ.ფოსტა ან პაროლი არასწორია."
          : "შეცდომა შესვლის დროს. სცადეთ თავიდან.",
      values: { email: raw.email },
    };
  }

  redirect("/");
}

// lib/auth/action.ts - update signupAction
export async function signupAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: formData.get("role") as string,
  };

  if (!["specialist", "client"].includes(raw.role)) {
    return { success: false, message: "Invalid role selected." };
  }

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...fromZodError(parsed.error),
      values: { fullName: raw.fullName, email: raw.email, role: raw.role },
    };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: raw.role,
      },
      emailRedirectTo: `${origin}/confirm`,
    },
  });

  if (error) {
    console.error("[signupAction]", error);
    return {
      success: false,
      message: error.message.toLowerCase().includes("already registered")
        ? "ამ ელ.ფოსტით ანგარიში უკვე არსებობს."
        : "შეცდომა რეგისტრაციის დროს. სცადეთ თავიდან.",
      values: { fullName: raw.fullName, email: raw.email, role: raw.role },
    };
  }

  return {
    success: true,
    message: "გთხოვთ, დაადასტუროთ ელ-ფოსტა რეგისტრაციის დასასრულებლად.",
  };
}

export async function forgotPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = { email: formData.get("email") as string };
  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return { ...fromZodError(parsed.error), values: { email: raw.email } };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${origin}/callback?next=/reset-password` },
  );

  if (error) {
    console.error("[forgotPasswordAction]", error);
    return { success: false, message: "შეცდომა. სცადეთ თავიდან." };
  }

  // Never reveal whether the email exists
  return {
    success: true,
    message: "თუ ანგარიში არსებობს, აღდგენის ბმული გამოგეგზავნებათ.",
  };
}

export async function resetPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = resetPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    // No values returned — never preserve passwords
    return fromZodError(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    const code = "code" in error ? error.code : undefined;

    if (code === "same_password") {
      return {
        success: false,
        message:
          "ახალი პაროლი არ უნდა ემთხვეოდეს ძველს. გთხოვთ, სცადოთ სხვა პაროლი.",
      };
    }

    if (
      code === "otp_expired" ||
      error.message?.toLowerCase().includes("expired")
    ) {
      return {
        success: false,
        message: "აღდგენის ბმულის ვადა გავიდა. გთხოვთ, თავიდან სცადოთ.",
      };
    }

    return {
      success: false,
      message: "შეცდომა პაროლის განახლებისას. სცადეთ თავიდან.",
    };
  }

  return {
    success: true,
    message: "პაროლი წარმატებით განახლდა. გადამისამართება...",
  };
}
