import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { KeyScene } from "@/components/auth/KeyScene";

export default function ResetPasswordPage() {
  return (
    <AuthLayout visual={<KeyScene />} tagline="Set a new key.">
      <h1 className="mb-6 text-2xl font-semibold">Reset your password</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}