"use client";

export function TagSelector({
  tags,
  selected,
  onChange,
}: {
  tags: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-ink">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 && (
          <p className="text-xs text-muted">No tags yet. Create tags first.</p>
        )}
        {tags.map((tag) => {
          const active = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className={`border-2 border-ink px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
                active
                  ? "bg-ink text-gold"
                  : "bg-white text-ink hover:bg-gold"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
