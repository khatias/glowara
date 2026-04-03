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

export async function signupAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ...fromZodError(parsed.error),
      // return values but never return passwords
      values: { fullName: raw.fullName, email: raw.email },
    };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
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
      values: { fullName: raw.fullName, email: raw.email },
    };
  }

  return {
    success: true,
    message: "ანგარიში შეიქმნა. შეამოწმეთ ელ.ფოსტა დასადასტურებლად.",
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
    { redirectTo: `${origin}/reset-password` },
  );

  if (error) {
    console.error("[forgotPasswordAction]", error);
    return {
      success: false,
      message: "შეცდომა. სცადეთ თავიდან.",
    };
  }

  // Always return success — don't reveal whether email exists
  return {
    success: true,
    message: "თუ ანგარიში არსებობს, აღდგენის ბმული გამოგეგზავნებათ.",
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
    console.error("[resetPasswordAction]", error);
    return {
      success: false,
      message: "შეცდომა პაროლის განახლებისას. სცადეთ თავიდან.",
    };
  }

  return {
    success: true,
    message: "პაროლი წარმატებით განახლდა. შეგიძლიათ შეხვიდეთ სისტემაში.",
  };
}
