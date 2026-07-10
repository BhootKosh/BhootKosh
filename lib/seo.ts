import type { Metadata } from "next";

const siteName = "BhootKosh";
const defaultDescription =
  "The illustrated archive of Indian ghosts, spirits, demons, haunted places, and folklore.";

const FALLBACK_SITE_URL = "https://bhoot-kosh.vercel.app";

/**
 * Always returns a valid absolute origin (no trailing slash).
 * Never throws — invalid env must not 500 the whole site.
 */
export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    FALLBACK_SITE_URL,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    let value = String(raw).trim().replace(/\/$/, "");
    if (!value) continue;
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
    }
    try {
      const u = new URL(value);
      if (u.protocol === "http:" || u.protocol === "https:") {
        return `${u.protocol}//${u.host}`;
      }
    } catch {
      /* try next candidate */
    }
  }

  return FALLBACK_SITE_URL;
}

export function getMetadataBase(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
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
  const url = toAbsoluteUrl(path || "/");
  const desc = description || defaultDescription;
  const ogImage = toAbsoluteUrl(image || "/images/og-default.svg");

  return {
    metadataBase: getMetadataBase(),
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
    image: ghost.image ? toAbsoluteUrl(ghost.image) : undefined,
    url: `${getSiteUrl()}/ghosts/${ghost.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
  };
}

export { siteName, defaultDescription };
