"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/ghosts", label: "Ghosts" },
  { href: "/regions", label: "Regions" },
  { href: "/types", label: "Types" },
  { href: "/haunted-places", label: "Places" },
  { href: "/stories", label: "Stories" },
  { href: "/submit", label: "Submit" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-gold">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden border-[3px] border-ink bg-saffron shadow-[3px_3px_0_0_#0a0a0a]">
            <Image
              src="/images/logo.svg"
              alt="BhootKosh"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <div>
            <span className="font-display text-lg uppercase leading-none tracking-tight text-ink sm:text-xl">
              BhootKosh
            </span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">
              Indian Folklore Archive
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-[2px] border-ink px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#0a0a0a]",
                  active
                    ? "bg-ink text-gold"
                    : "bg-bg-page text-ink hover:bg-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/random"
            className="ml-1 border-[3px] border-ink bg-saffron px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]"
          >
            Random
          </Link>
        </nav>

        <button
          type="button"
          className="border-[3px] border-ink bg-bg-page p-2 text-ink shadow-[3px_3px_0_0_#0a0a0a] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t-[3px] border-ink bg-bg-page px-3 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-[2px] border-ink px-3 py-2.5 text-sm font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a]",
                  pathname.startsWith(link.href)
                    ? "bg-ink text-gold"
                    : "bg-white text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/random"
              onClick={() => setOpen(false)}
              className="border-[3px] border-ink bg-saffron px-3 py-2.5 text-center text-sm font-bold uppercase text-white shadow-[3px_3px_0_0_#0a0a0a]"
            >
              Random Spirit
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
