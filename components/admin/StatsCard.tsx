export function StatsCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl uppercase text-ink">{value}</p>
      {hint && (
        <p className="mt-1 text-xs font-bold uppercase text-saffron">{hint}</p>
      )}
    </div>
  );
}
