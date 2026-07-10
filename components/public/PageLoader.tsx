export function PageLoader({ label = "Loading archive…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
      <div
        className="h-12 w-12 animate-spin border-[3px] border-ink border-t-saffron bg-gold shadow-[3px_3px_0_0_#0a0a0a]"
        aria-hidden
      />
      <p className="font-display text-xs uppercase tracking-[0.16em] text-ink">
        {label}
      </p>
      <div className="h-1.5 w-40 overflow-hidden border-2 border-ink bg-white shadow-[2px_2px_0_0_#0a0a0a]">
        <div className="h-full w-1/2 animate-pulse bg-saffron" />
      </div>
    </div>
  );
}
