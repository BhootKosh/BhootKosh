import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Space_Grotesk,
  Libre_Baskerville,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import {
  defaultDescription,
  getMetadataBase,
  getSiteUrl,
  siteJsonLd,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";

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

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e85d04" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${siteName} | Indian Folklore Archive`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Culture",
  keywords: [
    "Indian folklore",
    "Indian ghosts",
    "haunted places India",
    "BhootKosh",
    "mythology",
    "spirits",
    "chudail",
    "regional legends",
  ],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: ["/icon"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName,
    locale: "en_IN",
    url: siteUrl,
    title: `${siteName} | Indian Folklore Archive`,
    description: defaultDescription,
    images: [
      {
        url: toAbsoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "BhootKosh — Indian Folklore Archive",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Indian Folklore Archive`,
    description: defaultDescription,
    images: [toAbsoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Add when you have them:
    // google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd()),
          }}
        />
      </head>
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
