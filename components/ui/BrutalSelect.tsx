"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type BrutalOption = {
  value: string;
  label: string;
};

/**
 * Neo-brutal custom dropdown — replaces native OS selects
 * (Windows blue list cannot be styled with CSS).
 */
export function BrutalSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: BrutalOption[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const display = selected?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full min-h-12 items-center justify-between gap-2 border-[3px] border-ink bg-white px-3 py-2.5 text-left text-sm font-bold text-ink shadow-[3px_3px_0_0_#0a0a0a] transition",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]",
          "focus:outline-none focus:ring-2 focus:ring-saffron",
          open && "bg-gold shadow-[1px_1px_0_0_#0a0a0a] translate-x-0.5 translate-y-0.5"
        )}
      >
        <span className={cn(!selected && "text-muted")}>{display}</span>
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="no-scrollbar absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto border-[3px] border-ink bg-white shadow-[5px_5px_0_0_#0a0a0a]"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value || "__all"}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center border-b-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold uppercase tracking-wide last:border-b-0",
                    active
                      ? "bg-ink text-gold"
                      : "bg-white text-ink hover:bg-gold hover:text-ink"
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
