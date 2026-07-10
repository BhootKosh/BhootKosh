"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Map, ScrollText, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/ghosts", label: "Ghosts", icon: BookOpen },
  { href: "/regions", label: "Map", icon: Map },
  { href: "/stories", label: "Stories", icon: ScrollText },
  { href: "/random", label: "Random", icon: Shuffle },
];

/** Android-optimized sticky bottom nav (hidden on large screens) */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-ink bg-gold pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1 pt-1">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm px-1 py-1.5 text-[10px] font-bold uppercase tracking-wide transition active:scale-95",
                  active
                    ? "bg-ink text-gold"
                    : "text-ink/80 hover:bg-white/60"
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={2.4}
                  className={cn(active && "text-gold")}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
