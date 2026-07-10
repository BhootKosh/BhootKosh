"use client";

import { useState } from "react";

export function ShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "border-2 border-ink bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#0a0a0a]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-display text-[10px] uppercase text-ink">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        X / Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        Facebook
      </a>
      <button type="button" onClick={copy} className={`${btn} bg-gold`}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
