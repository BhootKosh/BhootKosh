"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Shuffle } from "lucide-react";

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

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-gold/95 backdrop-blur-sm supports-[backdrop-filter]:bg-gold/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden border-[3px] border-ink bg-saffron shadow-[3px_3px_0_0_#0a0a0a] transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_0_#0a0a0a] sm:h-11 sm:w-11">
            <Image
              src="/images/logo.svg"
              alt="BhootKosh"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <div className="min-w-0">
            <span className="font-display text-base uppercase leading-none tracking-tight text-ink sm:text-xl">
              BhootKosh
            </span>
            <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70 sm:block">
              Indian Folklore Archive
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1.5 xl:flex">
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
            className="ml-1 inline-flex items-center gap-1.5 border-[3px] border-ink bg-saffron px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]"
          >
            <Shuffle size={14} />
            Random
          </Link>
        </nav>

        {/* Tablet quick links */}
        <nav className="hidden items-center gap-1 md:flex xl:hidden">
          {links.slice(0, 4).map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-2 border-ink px-2 py-1.5 text-[11px] font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a]",
                  active ? "bg-ink text-gold" : "bg-bg-page text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border-[3px] border-ink bg-bg-page p-2 text-ink shadow-[3px_3px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="backdrop-enter fixed inset-0 z-40 bg-ink/50 xl:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="drawer-enter fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col border-l-[3px] border-ink bg-bg-page shadow-[-6px_0_0_0_#0a0a0a] xl:hidden">
            <div className="flex items-center justify-between border-b-[3px] border-ink bg-gold px-4 py-3">
              <p className="font-display text-sm uppercase text-ink">Menu</p>
              <button
                type="button"
                className="border-2 border-ink bg-white p-2 shadow-[2px_2px_0_0_#0a0a0a]"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 pb-24">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-[2px] border-ink px-3 py-3 text-sm font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a] transition active:scale-[0.98]",
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
                className="mt-2 flex items-center justify-center gap-2 border-[3px] border-ink bg-saffron px-3 py-3 text-center text-sm font-bold uppercase text-white shadow-[3px_3px_0_0_#0a0a0a]"
              >
                <Shuffle size={16} />
                Random Spirit
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="border-2 border-ink bg-accent-cyan px-3 py-3 text-center text-sm font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]"
              >
                Contact
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
