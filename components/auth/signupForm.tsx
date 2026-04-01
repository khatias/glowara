"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/lib/auth/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const initialState = {
  success: false,
  message: "",
  errors: {},
};
function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>რეგისტრაცია</CardTitle>
        <CardDescription>შექმენით ანგარიში დასაწყებად.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div>
            <Label htmlFor="fullName">სახელი</Label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              required
              className="mt-1"
            />
            {state?.errors?.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.fullName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">ელ.ფოსტა</Label>
            <Input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1"
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">პაროლი</Label>
            <Input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1"
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">დაადასტურეთ პაროლი</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              className="mt-1"
            />
            {state?.errors?.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="w-full flex items-center justify-center">
            <Button type="submit" disabled={state.success}>
              რეგისტრაცია
            </Button>
          </div>
          <CardDescription className="text-center text-sm text-green-500">
            {state.message}
          </CardDescription>
          <p className="text-sm text-center">
            უკვე გაქვთ ანგარიში?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              შესვლა
            </Link>
          </p>
          <CardFooter>
            <p className="text-sm text-center">
              ღილაკზე დაჭერის შემთხვევაში, თქვენ ეთანხმებით ჩვენს{" "}
              <Link href="/terms" className="text-blue-500 hover:underline">
                წესებს და პირობებს
              </Link>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
