"use client";

import { QuotaInfo } from "@/hooks/useSketchGenerator";
import { UpgradeButton } from "@/components/upgrade-button";

interface QuotaDisplayProps {
  quota: QuotaInfo;
}

export function QuotaDisplay({ quota }: QuotaDisplayProps) {
  const exceeded = quota.used >= quota.limit;

  return (
    <div className="flex flex-col gap-1 lg:gap-2">
      <p className="text-[10px] text-muted-foreground lg:text-xs">
        {quota.used}/{quota.limit} generations used today
      </p>
      {exceeded && (
        <>
          <p className="text-[10px] text-destructive lg:text-xs">
            Daily limit reached.
          </p>
          <UpgradeButton plan="lifetime" label="Upgrade — $20 lifetime" />
          <UpgradeButton plan="monthly" label="Upgrade — $2/month" />
        </>
      )}
    </div>
  );
}