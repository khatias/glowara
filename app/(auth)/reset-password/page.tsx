import React from "react";
import { ResetPasswordForm } from "@/components/auth/resetPasswordForm";
import { Suspense } from "react";
function page() {
  return (
    <Suspense fallback={<div>იტვირთება...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default page;
