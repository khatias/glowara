"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type ActionState } from "@/lib/auth/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButton";
import { PasswordInput } from "./PasswordInput";
import { FieldError } from "./FieldError";
import { FormMessage } from "./FormMessage";

const initialState: ActionState = { success: false };

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>რეგისტრაცია</CardTitle>
        <CardDescription>შექმენით ანგარიში დასაწყებად.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Disable form after success so user can't re-submit */}
        <form action={formAction} className="space-y-5">
          <FormMessage success={state.success} message={state.message} />

          {!state.success && (
            <>
              <div className="space-y-1">
                <Label htmlFor="fullName">სახელი და გვარი</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  required
                  defaultValue={state.values?.fullName ?? ""}
                />
                <FieldError message={state.errors?.fullName} />
              </div>

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

              <div className="space-y-1">
                <Label htmlFor="password">პაროლი</Label>
                <PasswordInput
                  name="password"
                  id="password"
                  autoComplete="new-password"
                />
                <FieldError message={state.errors?.password} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">გაიმეორეთ პაროლი</Label>
                <PasswordInput
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
                <FieldError message={state.errors?.confirmPassword} />
              </div>

              <SubmitButton label="რეგისტრაცია" />

              <p className="text-sm text-center text-muted-foreground">
                უკვე გაქვთ ანგარიში?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  შესვლა
                </Link>
              </p>
            </>
          )}
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-center text-muted-foreground w-full">
          რეგისტრაციით ეთანხმებით ჩვენს{" "}
          <Link href="/terms" className="text-blue-500 hover:underline">
            წესებსა და პირობებს
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
