import Link from "next/link";
import { getSessionSafe } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/public/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSessionSafe();

  let totalGhosts = 0;
  let totalPlaces = 0;
  let totalStories = 0;
  let pendingSubmissions = 0;
  let published = 0;
  let drafts = 0;
  let recentGhosts: {
    id: string;
    name: string;
    status: string;
    updatedAt: Date;
  }[] = [];
  let recentSubmissions: {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
  }[] = [];

  try {
    const [
      g,
      p,
      s,
      pending,
      publishedGhosts,
      draftGhosts,
      publishedPlaces,
      draftPlaces,
      publishedStories,
      draftStories,
      rg,
      rs,
    ] = await Promise.all([
      prisma.ghost.count(),
      prisma.hauntedPlace.count(),
      prisma.story.count(),
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.ghost.count({ where: { status: "PUBLISHED" } }),
      prisma.ghost.count({ where: { status: "DRAFT" } }),
      prisma.hauntedPlace.count({ where: { status: "PUBLISHED" } }),
      prisma.hauntedPlace.count({ where: { status: "DRAFT" } }),
      prisma.story.count({ where: { status: "PUBLISHED" } }),
      prisma.story.count({ where: { status: "DRAFT" } }),
      prisma.ghost.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.submission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, status: true, createdAt: true },
      }),
    ]);
    totalGhosts = g;
    totalPlaces = p;
    totalStories = s;
    pendingSubmissions = pending;
    published = publishedGhosts + publishedPlaces + publishedStories;
    drafts = draftGhosts + draftPlaces + draftStories;
    recentGhosts = rg;
    recentSubmissions = rs;
  } catch {
    /* empty */
  }

  return (
    <>
      <AdminHeader title="Dashboard" email={session?.user?.email} />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard label="Ghosts" value={totalGhosts} />
          <StatsCard label="Haunted places" value={totalPlaces} />
          <StatsCard label="Stories" value={totalStories} />
          <StatsCard
            label="Pending submissions"
            value={pendingSubmissions}
            hint="Awaiting review"
          />
          <StatsCard label="Published entries" value={published} />
          <StatsCard label="Draft entries" value={drafts} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base uppercase text-ink">
                Recent ghosts
              </h2>
              <Link
                href="/admin/ghosts"
                className="border-2 border-ink bg-gold px-2 py-1 text-[10px] font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a]"
              >
                Manage
              </Link>
            </div>
            <ul className="space-y-2">
              {recentGhosts.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between gap-3 border-b-2 border-ink/10 py-2 text-sm last:border-0"
                >
                  <Link
                    href={`/admin/ghosts/${g.id}/edit`}
                    className="font-bold text-ink hover:text-saffron"
                  >
                    {g.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={g.status} />
                    <span className="text-xs font-medium text-muted">
                      {formatDate(g.updatedAt)}
                    </span>
                  </div>
                </li>
              ))}
              {recentGhosts.length === 0 && (
                <li className="text-sm font-medium text-muted">No ghosts yet.</li>
              )}
            </ul>
          </section>

          <section className="border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base uppercase text-ink">
                Recent submissions
              </h2>
              <Link
                href="/admin/submissions"
                className="border-2 border-ink bg-saffron px-2 py-1 text-[10px] font-bold uppercase text-white shadow-[2px_2px_0_0_#0a0a0a]"
              >
                Review
              </Link>
            </div>
            <ul className="space-y-2">
              {recentSubmissions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 border-b-2 border-ink/10 py-2 text-sm last:border-0"
                >
                  <span className="font-bold text-ink">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="border-2 border-ink bg-bg-page px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                      {s.status}
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {formatDate(s.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
              {recentSubmissions.length === 0 && (
                <li className="text-sm font-medium text-muted">
                  No submissions yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
