import Link from "next/link";

export function SectionHeader({
  title,
  href,
  linkLabel = "View all",
  subtitle,
  chapter,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  subtitle?: string;
  chapter?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-ink pb-4">
      <div className="min-w-0">
        {chapter && (
          <span className="chapter-label mb-2 inline-block">{chapter}</span>
        )}
        <h2 className="font-display text-2xl uppercase text-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl font-serif text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="brutal-btn brutal-btn-ghost !min-h-10 !px-3 !py-2 !text-[11px]"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
