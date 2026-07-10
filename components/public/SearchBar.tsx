"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";

export function SearchBar({
  placeholder = "Search the archive…",
  paramName = "q",
}: {
  placeholder?: string;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set(paramName, value.trim());
    else params.delete(paramName);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex w-full max-w-xl gap-2 sm:max-w-md"
    >
      <div className="relative min-w-0 flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          enterKeyHint="search"
          autoComplete="off"
          className="w-full min-h-12 border-[3px] border-ink bg-white py-2.5 pl-10 pr-3 text-base font-medium text-ink placeholder:text-muted shadow-[3px_3px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron sm:min-h-11 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="hidden min-h-11 shrink-0 border-[3px] border-ink bg-saffron px-4 text-xs font-bold uppercase text-white shadow-[3px_3px_0_0_#0a0a0a] sm:inline-flex sm:items-center"
      >
        Search
      </button>
    </form>
  );
}
