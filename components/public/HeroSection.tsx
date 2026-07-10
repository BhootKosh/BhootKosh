import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative border-b-[3px] border-ink">
      <div className="relative overflow-hidden bg-saffron px-4 py-8 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 halftone opacity-25" />
        <div className="pointer-events-none absolute -right-6 top-8 hidden h-24 w-24 rotate-6 border-[3px] border-ink bg-gold shadow-[6px_6px_0_0_#0a0a0a] lg:block" />
        <div className="pointer-events-none absolute bottom-10 right-16 hidden h-16 w-16 -rotate-3 border-[3px] border-ink bg-accent-cyan shadow-[4px_4px_0_0_#0a0a0a] lg:block" />

        <div className="relative mb-4 flex flex-wrap items-center gap-2 sm:mb-5">
          <span className="brutal-stamp bg-gold text-ink">Archive</span>
          <span className="chapter-label">Indian Folklore</span>
          <span className="hidden border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_#0a0a0a] sm:inline-flex">
            Est. research
          </span>
        </div>

        <p className="relative font-display text-[10px] uppercase tracking-[0.18em] text-ink/80 sm:text-xs sm:tracking-[0.22em]">
          Illustrated spirits · places · legends
        </p>

        <h1 className="relative mt-2 max-w-3xl font-display text-[2.75rem] uppercase leading-[0.9] text-ink sm:mt-3 sm:text-6xl lg:text-8xl">
          Bhoot
          <span className="mt-1 block w-fit border-[3px] border-ink bg-ink px-2 text-gold shadow-[5px_5px_0_0_#f4c430] sm:px-3 sm:shadow-[6px_6px_0_0_#f4c430]">
            Kosh
          </span>
        </h1>

        <p className="relative mt-4 max-w-xl border-l-4 border-ink bg-bg-page p-3 font-serif text-sm leading-relaxed text-ink shadow-[4px_4px_0_0_#0a0a0a] sm:mt-5 sm:p-4 sm:text-base sm:text-lg">
          The illustrated archive of Indian ghosts, spirits, demons, haunted
          places, and folklore — documented with care across regions and
          traditions.
        </p>

        <div className="relative mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
          <Link
            href="/ghosts"
            className="brutal-btn brutal-btn-ghost w-full sm:w-auto"
          >
            Explore Ghosts
          </Link>
          <Link
            href="/random"
            className="brutal-btn w-full bg-ink text-gold sm:w-auto"
          >
            Random Spirit
          </Link>
          <Link
            href="/regions"
            className="brutal-btn brutal-btn-secondary w-full sm:w-auto"
          >
            Map of India
          </Link>
        </div>

        <div className="relative mt-8 grid max-w-lg grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
          {[
            { label: "Spirits", value: "15+", bg: "bg-bg-page" },
            { label: "Places", value: "5+", bg: "bg-accent-cyan" },
            { label: "Focus", value: "Culture", bg: "bg-gold" },
          ].map((s) => (
            <div
              key={s.label}
              className={`border-[3px] border-ink ${s.bg} p-2 text-center shadow-[3px_3px_0_0_#0a0a0a] sm:p-3`}
            >
              <p className="font-display text-lg text-ink sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/65 sm:mt-1 sm:text-[10px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
