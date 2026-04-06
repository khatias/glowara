"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { resetPasswordAction, type ActionState } from "@/lib/auth/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButton";
import { PasswordInput } from "./PasswordInput";
import { FieldError } from "./FieldError";
import { FormMessage } from "./FormMessage";

const initialState: ActionState = { success: false };

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);
  const router = useRouter();

  // Auto-redirect to login 3s after success
  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(() => router.push("/login"), 3000);
    return () => clearTimeout(timer);
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>ახალი პაროლის დაყენება</CardTitle>
        <CardDescription>
          შეიყვანეთ ახალი პაროლი თქვენი ანგარიშისთვის.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <FormMessage success={state.success} message={state.message} />

          {!state.success && (
            <>
              <div className="space-y-1">
                <Label htmlFor="password">ახალი პაროლი</Label>
                <PasswordInput
                  name="password"
                  id="password"
                  autoComplete="new-password"
                />
                <FieldError message={state.errors?.password} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">გაიმეორეთ ახალი პაროლი</Label>
                <PasswordInput
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
                <FieldError message={state.errors?.confirmPassword} />
              </div>

              <SubmitButton label="პაროლის შეცვლა" />

              <p className="text-sm text-center text-muted-foreground">
                გახსოვთ პაროლი?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  შესვლა
                </Link>
              </p>
            </>
          )}

          {/* After success — countdown redirect notice */}
          {state.success && (
            <p className="text-sm text-center text-muted-foreground">
              გადამისამართება შესვლის გვერდზე...{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                გადასვლა ახლა
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}