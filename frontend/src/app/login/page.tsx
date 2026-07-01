import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
        <LoginForm />
      </div>
    </div>
  );
}