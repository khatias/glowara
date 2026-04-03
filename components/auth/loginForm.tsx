"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/auth/action";
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

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>შესვლა</CardTitle>
        <CardDescription>
          შეიყვანეთ თქვენი მონაცემები შესასვლელად.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <FormMessage success={state.success} message={state.message} />

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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">პაროლი</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-500 hover:underline"
              >
                დაგავიწყდათ პაროლი?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
            />
            <FieldError message={state.errors?.password} />
          </div>

          <SubmitButton label="შესვლა" />

          <p className="text-sm text-center text-muted-foreground">
            ჯერ არ გაქვთ ანგარიში?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              რეგისტრაცია
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
