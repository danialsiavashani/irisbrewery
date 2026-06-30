import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold">Forgot your password?</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
        <ForgotPasswordForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}