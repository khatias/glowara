"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction, type ActionState } from "@/lib/auth/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButton";
import { FieldError } from "./FieldError";
import { FormMessage } from "./FormMessage";

const initialState: ActionState = { success: false };

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>პაროლის აღდგენა</CardTitle>
        <CardDescription>
          შეიყვანეთ თქვენი ელ.ფოსტა — გამოგიგზავნებთ აღდგენის ბმულს.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <FormMessage success={state.success} message={state.message} />

          {!state.success && (
            <>
              <div className="space-y-1">
                <Label htmlFor="email">ელ.ფოსტა</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  defaultValue={state.values?.email ?? ""}
                />
                <FieldError message={state.errors?.email} />
              </div>

              <SubmitButton label="აღდგენის ბმულის გაგზავნა" />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Link href="/login" className="text-blue-500 hover:underline">
                  შესვლა
                </Link>
                <Link href="/signup" className="text-blue-500 hover:underline">
                  რეგისტრაცია
                </Link>
              </div>
            </>
          )}

          {/* After success — show only message + back to login */}
          {state.success && (
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-500 hover:underline"
              >
                შესვლის გვერდზე დაბრუნება
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}