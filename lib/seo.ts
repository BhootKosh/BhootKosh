import type { Metadata } from "next";

const siteName = "BhootKosh";
const defaultDescription =
  "The illustrated archive of Indian ghosts, spirits, demons, haunted places, and folklore.";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const desc = description || defaultDescription;
  const ogImage = image || `${getSiteUrl()}/images/og-default.svg`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function ghostJsonLd(ghost: {
  name: string;
  summary?: string | null;
  image?: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ghost.name,
    description: ghost.summary || undefined,
    image: ghost.image || undefined,
    url: `${getSiteUrl()}/ghosts/${ghost.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
  };
}

export { siteName, defaultDescription };
