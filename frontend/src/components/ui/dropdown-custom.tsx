"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
}

interface DropdownCustomProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function DropdownCustom({
  trigger,
  items,
  align = "right",
}: DropdownCustomProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemClass = (variant?: string) =>
    `block w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
      variant === "destructive" ? "text-destructive" : "text-foreground"
    }`;

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[160px] rounded-md border bg-background shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className={itemClass(item.variant)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={itemClass(item.variant)}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}