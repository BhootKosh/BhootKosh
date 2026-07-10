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
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border-[3px] border-ink bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-ink placeholder:text-muted shadow-[3px_3px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron"
      />
    </form>
  );
}
