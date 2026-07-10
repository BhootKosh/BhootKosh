import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
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
      "img",
      "hr",
      "code",
      "pre",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "title"],
  });
}

/** Convert plain text paragraphs to simple HTML if content is not already HTML */
export function ensureHtml(content: string | null | undefined): string {
  if (!content) return "";
  if (content.includes("<") && content.includes(">")) {
    return sanitizeHtml(content);
  }
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return paragraphs;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
