/**
 * Serverless-safe HTML helpers (no jsdom / isomorphic-dompurify).
 * isomorphic-dompurify crashes on Vercel serverless (FUNCTION_INVOCATION_FAILED).
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "hr",
  "code",
  "pre",
  "span",
]);

const VOID_TAGS = new Set(["br", "hr"]);

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeAttrs(tag: string, rawAttrs: string): string {
  if (tag !== "a") return "";

  const hrefMatch = rawAttrs.match(
    /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i
  );
  const href = (hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "").trim();

  // Only allow safe http(s) / relative / mailto / anchor links
  if (
    !href ||
    /^(javascript|data|vbscript):/i.test(href) ||
    (!/^https?:\/\//i.test(href) &&
      !href.startsWith("/") &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:"))
  ) {
    return "";
  }

  return ` href="${escapeHtml(href)}" rel="noopener noreferrer" target="_blank"`;
}

/**
 * Strip scripts/events and drop disallowed tags. Keeps simple archive HTML.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";

  try {
    let html = String(dirty);

    // Remove dangerous blocks entirely
    html = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
      .replace(/<embed[\s\S]*?>/gi, "")
      .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript:/gi, "");

    // Process tags
    html = html.replace(
      /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
      (full, rawTag: string, rawAttrs: string) => {
        const tag = rawTag.toLowerCase();
        const isClose = full.startsWith("</");

        if (!ALLOWED_TAGS.has(tag)) {
          return "";
        }

        if (isClose) {
          if (VOID_TAGS.has(tag)) return "";
          return `</${tag}>`;
        }

        if (VOID_TAGS.has(tag)) {
          return `<${tag} />`;
        }

        const attrs = sanitizeAttrs(tag, rawAttrs || "");
        return `<${tag}${attrs}>`;
      }
    );

    return html;
  } catch {
    // Never crash the page render over sanitization
    return escapeHtml(String(dirty));
  }
}

/** Convert plain text paragraphs to simple HTML if content is not already HTML */
export function ensureHtml(content: string | null | undefined): string {
  if (!content) return "";
  try {
    if (content.includes("<") && content.includes(">")) {
      return sanitizeHtml(content);
    }
    return content
      .split(/\n\n+/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
      .join("");
  } catch {
    return `<p>${escapeHtml(String(content))}</p>`;
  }
}
