import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const joinedDate = new Date(user.date_joined).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPro = user.tier === "paid";
  const limit = isPro ? 50 : 3;
  const used = user.generations_used_today;
  const remaining = Math.max(0, limit - used);
  const pct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">

      {/* Left pane — account details */}
      <div className="flex w-full md:w-1/2 flex-col gap-6 overflow-y-auto border-r p-6 md:p-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account details</p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Username</p>
            <p className="text-sm">{user.username}</p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isPro ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}>
                {isPro ? "Pro" : "Free"}
              </span>
              <span className="text-xs text-muted-foreground md:hidden">
                {used}/{limit} generations today
              </span>
              {!isPro && (
                <Link href="/pricing" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Upgrade
                </Link>
              )}
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Member since</p>
            <p className="text-sm">{joinedDate}</p>
          </div>
        </div>

        <Button variant="outline" className="w-full" disabled>
          Manage Billing — coming soon
        </Button>
      </div>

      {/* Right pane — usage stats (desktop only) */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center gap-8 p-10">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Today's usage</p>
          <p className="text-sm text-muted-foreground">{used} of {limit} generations used</p>
        </div>

        {/* Circular progress */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-48 h-48 -rotate-90">
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/40"
            />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
              className="text-foreground transition-all duration-500"
            />
          </svg>
          <div className="absolute flex flex-col items-center gap-1">
            <span className="text-3xl font-semibold">{pct}%</span>
            <span className="text-xs text-muted-foreground">used</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium">{remaining} generation{remaining !== 1 ? "s" : ""} remaining</p>
          <p className="text-xs text-muted-foreground">Resets at midnight</p>
          {!isPro && (
            <Link href="/pricing" className="mt-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground">
              Upgrade for {50 - limit} more per day →
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}