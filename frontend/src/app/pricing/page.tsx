import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { UpgradeButton } from "@/components/upgrade-button";

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPaid = user?.tier === "paid";

  return (
    <div className="flex flex-1 flex-col items-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Same reliable results on every plan. Upgrade for more generations.
        </p>
      </div>

      <table className="w-full max-w-2xl border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-medium text-muted-foreground">
              &nbsp;
            </th>
            <th className="p-4 text-center font-semibold">Free</th>
            <th className="p-4 text-center font-semibold">Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">
              Generations per day
            </td>
            <td className="p-4 text-center">3</td>
            <td className="p-4 text-center">50</td>
          </tr>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">Styles</td>
            <td className="p-4 text-center">Sketch</td>
            <td className="p-4 text-center">Sketch</td>
          </tr>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">Price</td>
            <td className="p-4 text-center">$0</td>
            <td className="p-4 text-center">
              $20 once or $2/mo
            </td>
          </tr>
          <tr>
            <td className="p-4"></td>
            <td className="p-4 text-center">
              {!user && (
                <Link
                  href="/register"
                  className="text-sm underline underline-offset-4"
                >
                  Sign up free
                </Link>
              )}
              {user && !isPaid && (
                <span className="text-sm text-muted-foreground">
                  Current plan
                </span>
              )}
            </td>
            <td className="p-4">
              {isPaid ? (
                <span className="text-sm text-muted-foreground">
                  You&apos;re on Pro
                </span>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UpgradeButton plan="lifetime" />
                  <UpgradeButton plan="monthly" />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}