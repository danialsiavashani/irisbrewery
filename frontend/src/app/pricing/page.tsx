import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { UpgradeButton } from "@/components/upgrade-button";

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPaid = user?.tier === "paid";

  return (
    <div className="flex flex-1 flex-col items-center gap-10 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Same reliable results on every plan. Upgrade for more generations.
        </p>
      </div>

      <table className="w-full max-w-2xl border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-4 text-left font-medium text-muted-foreground">
              &nbsp;
            </th>
            <th className="p-4 text-center font-semibold">Free</th>
            <th className="rounded-t-xl bg-foreground/5 p-4 text-center font-semibold">
              Pro
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-4 text-muted-foreground">
              Generations per day
            </td>
            <td className="p-4 text-center">3</td>
            <td className="bg-foreground/5 p-4 text-center font-medium">
              50
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-4 text-muted-foreground">Sketch style</td>
            <td className="p-4 text-center">✓</td>
            <td className="bg-foreground/5 p-4 text-center">✓</td>
          </tr>
          <tr className="border-t">
            <td className="p-4 text-muted-foreground">
              Same result, every time
            </td>
            <td className="p-4 text-center">✓</td>
            <td className="bg-foreground/5 p-4 text-center">✓</td>
          </tr>
          <tr className="border-t">
            <td className="p-4 text-muted-foreground">Price</td>
            <td className="p-4 text-center">$0</td>
            <td className="rounded-b-xl bg-foreground/5 p-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">$20 once</span>
                <span className="text-xs text-muted-foreground">
                  or $2/mo
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

   <div className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {!user && (
          <Link href="/register" className="text-sm underline underline-offset-4">
            Sign up free
          </Link>
        )}
        {user && !isPaid && (
          <span className="text-sm text-muted-foreground">You&apos;re on Free</span>
        )}
      </div>
      <div>
        {isPaid ? (
          <span className="text-sm text-muted-foreground">You&apos;re on Pro</span>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <UpgradeButton plan="monthly" label="Go Pro monthly" />
            <UpgradeButton plan="lifetime" label="Go Pro lifetime" />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}