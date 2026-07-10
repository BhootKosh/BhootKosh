import { Suspense } from "react";
import { Footer } from "@/components/public/Footer";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";
import { Navbar } from "@/components/public/Navbar";
import { NavigationProgress } from "@/components/public/NavigationProgress";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="has-mobile-nav flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar />
      <main className="relative flex-1 px-0 py-0 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        <div className="book-page relative mx-auto max-w-6xl overflow-hidden sm:border-[3px]">
          <div className="pointer-events-none absolute inset-0 halftone" />
          <div className="relative text-ink">{children}</div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
