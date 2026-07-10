import Link from "next/link";
import Image from "next/image";
import { formatDate, truncate } from "@/lib/utils";

export type StoryCardData = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  coverImage?: string | null;
  createdAt: Date | string;
  region?: { name: string } | null;
};

export function StoryCard({
  story,
  priority = false,
}: {
  story: StoryCardData;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="brutal-card group flex h-full flex-col overflow-hidden bg-white active:scale-[0.99]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b-[3px] border-ink bg-ink">
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            priority={priority}
            className="object-cover transition duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl text-gold">≡</span>
          </div>
        )}
        <span className="absolute left-2 top-2 border-2 border-ink bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
          Story
        </span>
      </div>
      <div className="flex flex-1 flex-col bg-bg-card p-3 sm:p-4">
        <p className="text-[11px] font-bold uppercase text-muted">
          {formatDate(story.createdAt)}
          {story.region ? ` · ${story.region.name}` : ""}
        </p>
        <h3 className="mt-1 font-display text-lg uppercase leading-tight text-ink group-hover:text-saffron">
          {story.title}
        </h3>
        {story.summary && (
          <p className="mt-2 flex-1 font-serif text-sm leading-snug text-ink/85">
            {truncate(story.summary, 120)}
          </p>
        )}
        <span className="mt-3 inline-flex w-fit border-2 border-ink bg-saffron px-2 py-1 text-[10px] font-bold uppercase text-white shadow-[2px_2px_0_0_#0a0a0a]">
          Read story →
        </span>
      </div>
    </Link>
  );
}
