import { revalidateTag } from "next/cache";

/** Invalidate public archive caches after admin mutations. */
export function revalidateArchive(
  ...tags: Array<"home" | "ghosts" | "places" | "stories" | "regions" | string>
) {
  const unique = new Set(
    tags.length ? tags : ["home", "ghosts", "places", "stories", "regions"]
  );
  for (const tag of unique) {
    try {
      // Next.js 16 requires a cache life profile for revalidateTag
      revalidateTag(tag, "max");
    } catch {
      /* ignore in non-request contexts */
    }
  }
}
