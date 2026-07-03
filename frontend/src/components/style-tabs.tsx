"use client";

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
  return (
    <div className="grid h-full grid-cols-2 gap-1.5">
      {STYLE_OPTIONS.map((style) => (
        <button
          key={style.id}
          type="button"
          disabled={!style.enabled}
          onClick={() => style.enabled && onStyleChange(style.id)}
          className={`rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
            activeStyle === style.id
              ? "border-foreground bg-foreground text-background"
              : style.enabled
                ? "border-border hover:border-ring"
                : "border-border text-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}