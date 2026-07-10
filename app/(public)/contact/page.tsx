import { ContactForm } from "@/components/public/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact the BhootKosh editorial team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <span className="chapter-label">Inbox</span>
      <h1 className="mt-3 font-display text-4xl uppercase text-ink sm:text-5xl">
        Contact
      </h1>
      <p className="mt-3 max-w-2xl font-serif text-sm text-muted sm:text-base">
        Questions about the archive, corrections, or collaboration? Send a
        message below.
      </p>
      <div className="mt-8 max-w-2xl border-[3px] border-ink bg-white p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
