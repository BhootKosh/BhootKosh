import type { Metadata } from "next";

const siteName = "BhootKosh";
const defaultDescription =
  "The illustrated archive of Indian ghosts, spirits, demons, haunted places, and folklore — documented for cultural study across regions and traditions.";

const FALLBACK_SITE_URL = "https://bhoot-kosh.vercel.app";
const DEFAULT_OG_PATH = "/opengraph-image";
const DEFAULT_KEYWORDS = [
  "Indian folklore",
  "Indian ghosts",
  "bhoot",
  "chudail",
  "haunted places India",
  "Indian mythology",
  "spirits of India",
  "BhootKosh",
  "folklore archive",
  "regional legends",
  "yakshi",
  "preta",
  "rakshasa",
];

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

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Strip HTML for meta descriptions */
export function plainText(htmlOrText: string | null | undefined, max = 160) {
  if (!htmlOrText) return defaultDescription;
  const text = htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = toAbsoluteUrl(path || "/");
  const desc = plainText(description || defaultDescription, 200);
  // Prefer page image; fall back to dynamic OG route (Discord/Twitter friendly PNG)
  const ogImage = toAbsoluteUrl(image || DEFAULT_OG_PATH);
  const fullTitle = title.includes(siteName) ? title : title;

  return {
    metadataBase: getMetadataBase(),
    title: fullTitle,
    description: desc,
    applicationName: siteName,
    authors: [{ name: siteName, url: getSiteUrl() }],
    creator: siteName,
    publisher: siteName,
    category: "Culture",
    keywords: DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: image?.match(/\.(jpg|jpeg|png|webp)$/i)
            ? undefined
            : "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
      creator: "@bhootkosh",
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
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
  };
}

export function siteJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: siteName,
        description: defaultDescription,
        inLanguage: "en-IN",
        publisher: { "@id": `${base}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${base}/ghosts?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: siteName,
        url: base,
        description: defaultDescription,
        logo: {
          "@type": "ImageObject",
          url: `${base}/images/logo.svg`,
          width: 128,
          height: 128,
        },
        image: `${base}/opengraph-image`,
        sameAs: [],
      },
      {
        "@type": "WebPage",
        "@id": `${base}/#webpage`,
        url: base,
        name: `${siteName} | Indian Folklore Archive`,
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": `${base}/#organization` },
        description: defaultDescription,
        inLanguage: "en-IN",
      },
    ],
  };
}

export function ghostJsonLd(ghost: {
  name: string;
  summary?: string | null;
  image?: string | null;
  slug: string;
  updatedAt?: Date | string | null;
}) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ghost.name,
    description: plainText(ghost.summary, 200),
    image: ghost.image ? toAbsoluteUrl(ghost.image) : `${base}/opengraph-image`,
    url: `${base}/ghosts/${ghost.slug}`,
    mainEntityOfPage: `${base}/ghosts/${ghost.slug}`,
    dateModified: ghost.updatedAt
      ? new Date(ghost.updatedAt).toISOString()
      : undefined,
    author: { "@type": "Organization", name: siteName, url: base },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: base,
      logo: {
        "@type": "ImageObject",
        url: `${base}/images/logo.svg`,
      },
    },
    inLanguage: "en-IN",
  };
}

export function placeJsonLd(place: {
  name: string;
  legend?: string | null;
  location?: string | null;
  state?: string | null;
  image?: string | null;
  slug: string;
}) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    description: plainText(place.legend, 200),
    image: place.image ? toAbsoluteUrl(place.image) : undefined,
    url: `${base}/haunted-places/${place.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.location || undefined,
      addressRegion: place.state || undefined,
      addressCountry: "IN",
    },
  };
}

export function storyJsonLd(story: {
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  slug: string;
  createdAt?: Date | string | null;
}) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: plainText(story.summary, 200),
    image: story.coverImage
      ? toAbsoluteUrl(story.coverImage)
      : `${base}/opengraph-image`,
    url: `${base}/stories/${story.slug}`,
    datePublished: story.createdAt
      ? new Date(story.createdAt).toISOString()
      : undefined,
    author: { "@type": "Organization", name: siteName, url: base },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: base,
    },
    inLanguage: "en-IN",
  };
}

export { siteName, defaultDescription, DEFAULT_OG_PATH };
