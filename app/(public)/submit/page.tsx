import { SubmitForm } from "@/components/public/SubmitForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Submit a Legend",
  description:
    "Share a local Indian ghost story or folklore legend with the BhootKosh archive for editorial review.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <span className="chapter-label">Contribute</span>
      <h1 className="mt-3 font-display text-4xl uppercase text-ink sm:text-5xl">
        Submit a Legend
      </h1>
      <p className="mt-3 max-w-2xl border-l-4 border-ink bg-gold/30 p-3 font-serif text-sm leading-relaxed text-ink shadow-[3px_3px_0_0_#0a0a0a] sm:text-base">
        Know a local spirit, haunted place, or family folklore account? Share it
        for review. Editors assess cultural accuracy before anything is
        published.
      </p>
      <div className="mt-8 max-w-2xl border-[3px] border-ink bg-white p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
        <SubmitForm />
      </div>
    </div>
  );
}
