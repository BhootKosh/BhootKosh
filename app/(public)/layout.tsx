import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1 px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
        <div className="book-page relative mx-auto max-w-6xl overflow-hidden">
          <div className="pointer-events-none absolute inset-0 halftone" />
          <div className="relative text-ink">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
