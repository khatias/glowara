import React from "react";
import { ForgotPasswordForm } from "@/components/auth/forgotPasswordForm";
import { Suspense } from "react";
function page() {
  return (
    <Suspense fallback={<div>იტვირთება...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

export default page;
