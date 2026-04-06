import { z } from "zod";

const emailSchema = z.email().trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან ")
  .max(72, "პაროლი ძალიან გრძელია ")
  .regex(/\d/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს ")
  .regex(/[A-Z]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს ")
  .regex(/[a-z]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ პატარა ასოს ");

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "სახელი ძალიან მოკლეა")
  .max(100, "სახელი ძალიან გრძელია");

const passwordConfirmationFields = {
  password: passwordSchema,
  confirmPassword: z.string(),
};

const passwordsMatch = (data: {
  password: string;
  confirmPassword: string;
}) => data.password === data.confirmPassword;

const passwordConfirmationError = {
  path: ["confirmPassword"],
  message: "პაროლები არ ემთხვევა",
};

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო")
    .max(72, "პაროლი ძალიან გრძელია"),
});

export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    ...passwordConfirmationFields,
  })
  .refine(passwordsMatch, passwordConfirmationError);

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    ...passwordConfirmationFields,
  })
  .refine(passwordsMatch, passwordConfirmationError);