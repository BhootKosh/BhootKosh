import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About BhootKosh",
  description:
    "Learn about BhootKosh’s mission as an educational archive of Indian folklore, ghosts, and regional legends.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <span className="chapter-label">Archive</span>
      <h1 className="mt-3 font-display text-4xl uppercase text-ink sm:text-5xl">
        About BhootKosh
      </h1>
      <p className="mt-3 max-w-2xl border-l-4 border-ink bg-white p-3 font-serif text-sm leading-relaxed text-ink shadow-[3px_3px_0_0_#0a0a0a] sm:text-base">
        An illustrated archive of Indian ghosts, spirits, demons, haunted
        places, and folklore — documented for cultural study.
      </p>

      <div className="prose-archive mt-8 max-w-3xl border-[3px] border-ink bg-white p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
        <p>
          <strong>BhootKosh</strong> is an illustrated archive dedicated to
          Indian ghosts, spirits, demons, haunted places, and folklore. Our
          purpose is cultural and educational: to document regional legends with
          care, clarity, and respect.
        </p>
        <p>
          India&apos;s oral traditions are vast and varied. The same spirit may
          appear under different names across states, languages, and
          communities. Stories shift with retelling. BhootKosh treats this
          plurality as a feature, not a flaw.
        </p>
        <h2>Our principles</h2>
        <ul>
          <li>Respect for living traditions and local communities</li>
          <li>Clear distinction between folklore and verified history</li>
          <li>No sensationalism or exploitative presentation</li>
          <li>Openness to public contributions under editorial review</li>
        </ul>
        <h2>Disclaimer</h2>
        <p>
          Content on BhootKosh is compiled from folklore, oral accounts, and
          published cultural sources for educational purposes. Folklore is not
          scientific fact. Accounts vary by region. Visitors should treat
          haunted-place material as cultural narrative—not travel advice or
          safety guidance.
        </p>
      </div>
    </div>
  );
}
