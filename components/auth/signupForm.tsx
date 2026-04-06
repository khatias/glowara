"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Scissors, User } from "lucide-react";
import clsx from "clsx";
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

type Role = "specialist" | "client";

const roles: {
  value: Role;
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    value: "specialist",
    icon: <Scissors className="w-6 h-6" />,
    title: "სპეციალისტი",
    description: "ვმართავ ბიზნესს",
  },
  {
    value: "client",
    icon: <User className="w-6 h-6" />,
    title: "კლიენტი",
    description: "ვეძებ სპეციალისტს",
  },
];

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [selectedRole, setSelectedRole] = useState<Role>(
    (state.values?.role as Role) ?? "specialist",
  );

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>რეგისტრაცია</CardTitle>
        <CardDescription>შექმენით ანგარიში დასაწყებად.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <FormMessage success={state.success} message={state.message} />

          {!state.success && (
            <>
              {/* Role selector */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={clsx(
                        "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-center transition-all",
                        selectedRole === role.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      )}
                    >
                      {role.icon}
                      <div>
                        <div className="font-semibold text-sm">
                          {role.title}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Hidden field that gets submitted */}
                <input type="hidden" name="role" value={selectedRole} />
              </div>

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
