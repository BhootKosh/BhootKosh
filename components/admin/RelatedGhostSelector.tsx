"use client";

export function RelatedGhostSelector({
  ghosts,
  selected,
  onChange,
  excludeId,
}: {
  ghosts: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  excludeId?: string;
}) {
  const list = ghosts.filter((g) => g.id !== excludeId);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-muted">Related ghosts</label>
      <div className="max-h-40 space-y-1 overflow-y-auto border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] p-2">
        {list.length === 0 && (
          <p className="text-xs text-muted">No other ghosts available.</p>
        )}
        {list.map((g) => (
          <label
            key={g.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-muted hover:bg-bg-card"
          >
            <input
              type="checkbox"
              checked={selected.includes(g.id)}
              onChange={() => toggle(g.id)}
              className="accent-gold"
            />
            {g.name}
          </label>
        ))}
      </div>
    </div>
  );
}
