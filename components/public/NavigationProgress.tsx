"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top progress bar on client navigations so the site feels responsive
 * even when the next RSC payload takes a moment.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setVisible(true);
    setKey((k) => k + 1);
    const done = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(done);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      key={key}
      className="nav-progress pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-ink/15"
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="nav-progress-bar h-full w-full bg-saffron shadow-[0_0_8px_#e85d04]" />
    </div>
  );
}
