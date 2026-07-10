import type { Metadata } from "next";
import {
  Archivo_Black,
  Space_Grotesk,
  Libre_Baskerville,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { defaultDescription, getSiteUrl, siteName } from "@/lib/seo";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display-loaded",
  display: "swap",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteName} | Indian Folklore Archive`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="grain-overlay antialiased"
        style={
          {
            fontFamily: "var(--font-sans-loaded), system-ui, sans-serif",
            ["--font-display" as string]:
              "var(--font-display-loaded), Impact, sans-serif",
            ["--font-sans" as string]:
              "var(--font-sans-loaded), system-ui, sans-serif",
            ["--font-serif" as string]:
              "var(--font-serif-loaded), Georgia, serif",
          } as React.CSSProperties
        }
        suppressHydrationWarning
      >
        {children}
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: "#fffdf8",
              border: "3px solid #0a0a0a",
              boxShadow: "4px 4px 0 0 #0a0a0a",
              color: "#0a0a0a",
            },
          }}
        />
      </body>
    </html>
  );
}
