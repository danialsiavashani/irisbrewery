import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LockScene } from "@/components/auth/LockScene";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthLayout visual={<LockScene />} tagline="Sign in to your sketches.">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <LoginForm />
    </AuthLayout>
  );
}