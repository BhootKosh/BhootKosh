"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/ghosts", label: "Ghosts" },
  { href: "/admin/haunted-places", label: "Haunted Places" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/regions", label: "Regions" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r-[3px] border-ink bg-ink text-cream">
      <div className="border-b-[3px] border-gold/40 px-4 py-5">
        <Link
          href="/admin"
          className="font-display text-xl uppercase text-gold"
        >
          BhootKosh
        </Link>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cream/60">
          Admin
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1.5 p-3">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "border-2 border-ink px-3 py-2 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#f4c430] transition",
                active
                  ? "bg-gold text-ink"
                  : "bg-bg-elevated text-cream hover:bg-saffron hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t-[3px] border-gold/40 p-3">
        <Link
          href="/"
          className="block border-2 border-gold/50 px-3 py-2 text-xs font-bold uppercase text-gold hover:bg-gold hover:text-ink"
        >
          ← Public site
        </Link>
      </div>
    </aside>
  );
}
