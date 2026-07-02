"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UpgradeButtonProps {
  plan: "lifetime" | "monthly";
  label?: string;
}

export function UpgradeButton({ plan, label }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="w-full">
      {loading ? "Redirecting..." : label ?? "Upgrade to Pro"}
    </Button>
  );
}