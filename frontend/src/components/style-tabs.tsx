"use client";

import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { ChevronDown } from "lucide-react";

interface StyleOption {
  id: string;
  label: string;
  enabled: boolean;
}

const STYLE_OPTIONS: StyleOption[] = [
  { id: "sketch", label: "Sketch", enabled: true },
  { id: "watercolor", label: "Watercolor", enabled: false },
  { id: "oil_paint", label: "Oil Paint", enabled: false },
  { id: "cartoon", label: "Cartoon", enabled: false },
  { id: "more", label: "More soon", enabled: false },
];

interface StyleTabsProps {
  activeStyle: string;
  onStyleChange: (style: string) => void;
}

export function StyleTabs({ activeStyle, onStyleChange }: StyleTabsProps) {
  const active = STYLE_OPTIONS.find((s) => s.id === activeStyle);

  const items = STYLE_OPTIONS.map((style) => ({
    label: style.label,
    onClick: style.enabled ? () => onStyleChange(style.id) : undefined,
    variant: undefined,
    disabled: !style.enabled,
  }));

  return (
    <DropdownCustom
      trigger={
        <div className="flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer hover:border-ring transition-colors">
          <span>{active?.label ?? "Style"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      }
      items={items}
      align="left"
    />
  );
}