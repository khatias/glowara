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

type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function fromZodError(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): ActionState {
  return {
    success: false,
    errors: error.flatten().fieldErrors,
  };
}

export async function loginAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/app");
}

export async function signupAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    console.log("Signup error:", error);
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message:
      "თქვენი ანგარიში შექმნილია. გთხოვთ, შეამოწმოთ თქვენი ელ.ფოსტა ანგარიშის დასადასტურებლად.",
  };
}

export async function forgotPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${origin}/reset-password`,
    },
  );

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message:
      "პაროლის აღდგენის ელ.ფოსტა გაგზავნილია. გთხოვთ, შეამოწმოთ თქვენი ელ.ფოსტა.",
  };
}

export async function resetPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "პაროლი წარმატებით განახლდა.  შეგიძლიათ შეხვიდეთ სისტემაში.",
  };
}
