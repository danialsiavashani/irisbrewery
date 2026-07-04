import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { KeyScene } from "@/components/auth/KeyScene";
import Link from "next/link";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthLayout visual={<KeyScene />} tagline="Get your key to Iris Brewery.">
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}