import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { HeroAnimation } from "@/components/hero/HeroAnimation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <HeroAnimation />
        <h1 className="text-3xl font-semibold tracking-tight">Iris Brewery</h1>
       <p className="text-muted-foreground">
        Turn any photo into art you can actually control. No prompts, no
        luck, just reliable results, every time.
      </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}