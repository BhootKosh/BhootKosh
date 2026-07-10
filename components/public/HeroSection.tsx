import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative border-b-[3px] border-ink">
      <div className="relative overflow-hidden bg-saffron px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 halftone opacity-25" />
        {/* Decorative offset blocks */}
        <div className="pointer-events-none absolute -right-6 top-8 hidden h-24 w-24 rotate-6 border-[3px] border-ink bg-gold shadow-[6px_6px_0_0_#0a0a0a] lg:block" />
        <div className="pointer-events-none absolute bottom-10 right-16 hidden h-16 w-16 -rotate-3 border-[3px] border-ink bg-accent-cyan shadow-[4px_4px_0_0_#0a0a0a] lg:block" />

        <div className="relative mb-5 flex flex-wrap items-center gap-2">
          <span className="brutal-stamp bg-gold text-ink">Archive</span>
          <span className="chapter-label">Indian Folklore</span>
          <span className="border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_#0a0a0a]">
            Est. research
          </span>
        </div>

        <p className="relative font-display text-xs uppercase tracking-[0.22em] text-ink/80">
          Illustrated spirits · places · legends
        </p>

        <h1 className="relative mt-3 max-w-3xl font-display text-5xl uppercase leading-[0.9] text-ink sm:text-6xl lg:text-8xl">
          Bhoot
          <span className="mt-1 block w-fit border-[3px] border-ink bg-ink px-2 text-gold shadow-[6px_6px_0_0_#f4c430] sm:px-3">
            Kosh
          </span>
        </h1>

        <p className="relative mt-5 max-w-xl border-l-4 border-ink bg-bg-page p-4 font-serif text-base leading-relaxed text-ink shadow-[4px_4px_0_0_#0a0a0a] sm:text-lg">
          The illustrated archive of Indian ghosts, spirits, demons, haunted
          places, and folklore — documented with care across regions and
          traditions.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link href="/ghosts" className="brutal-btn brutal-btn-ghost">
            Explore Ghosts
          </Link>
          <Link href="/random" className="brutal-btn bg-ink text-gold">
            Random Spirit
          </Link>
          <Link href="/regions" className="brutal-btn brutal-btn-secondary">
            Map of India
          </Link>
        </div>

        <div className="relative mt-10 grid max-w-lg grid-cols-3 gap-3">
          {[
            { label: "Spirits", value: "15+", bg: "bg-bg-page" },
            { label: "Places", value: "5+", bg: "bg-accent-cyan" },
            { label: "Focus", value: "Culture", bg: "bg-gold" },
          ].map((s) => (
            <div
              key={s.label}
              className={`border-[3px] border-ink ${s.bg} p-3 text-center shadow-[3px_3px_0_0_#0a0a0a]`}
            >
              <p className="font-display text-xl text-ink sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/65">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
