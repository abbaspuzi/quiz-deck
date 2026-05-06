import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  cardClass,
  panelClass,
  primaryButtonClass,
  statCardClass,
  subtitleClass,
} from "../lib/ui";

function LeaderboardPage() {
  const leaderboard = useQuery(api.leaderboard.topScores);

  const completedCount = leaderboard?.length ?? 0;
  const avgScore =
    completedCount > 0
      ? Math.round(
          leaderboard!.reduce((sum, r) => sum + r.score, 0) / completedCount,
        )
      : 0;

  const topThree = leaderboard?.slice(0, 3) ?? [];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <section
        className={`${cardClass} grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end`}
      >
        <div className="grid gap-4">
          <div>
            <h1 className="font-display max-w-[11ch] text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.93] tracking-[-0.07em] text-[var(--text-primary)]">
              Leaderboard
            </h1>
            <p className={`${subtitleClass} mt-3 max-w-[48ch]`}>
              Quick look at who is ready. Study in the training deck, then take
              the quiz when you are ready.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <article className={statCardClass}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Completed runs
            </p>
            <p className="font-display mt-2 text-4xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              {completedCount}
            </p>
          </article>
          <article className={statCardClass}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Average score
            </p>
            <p className="font-display mt-2 text-4xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              {avgScore}
            </p>
          </article>
        </div>
      </section>

      {leaderboard === undefined ? (
        <section
          className={`${panelClass} px-4 py-7 text-center text-sm text-[var(--text-secondary)]`}
        >
          Loading live scores...
        </section>
      ) : leaderboard.length === 0 ? (
        <section className={`${panelClass} grid gap-4 px-4 py-7 text-center`}>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              The board is waiting for the first run.
            </h2>
            <p className={`${subtitleClass} mt-2`}>
              Finish a real quiz round to appear here.
            </p>
          </div>
          <Link className="mx-auto w-full sm:w-auto" to="/">
            <span className={primaryButtonClass}>Open quiz</span>
          </Link>
        </section>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            {topThree.map((entry, index) => (
              <article className={cardClass} key={entry._id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Rank {index + 1}
                    </p>
                    <h2 className="font-display mt-2 text-[1.7rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                      {entry.name}
                    </h2>
                  </div>
                  <div className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-[var(--surface)] px-2.5 font-display text-xl font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                    {index + 1}
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Score
                    </p>
                    <p className="font-display mt-2 text-5xl font-semibold tracking-[-0.07em] text-[var(--accent-strong)]">
                      {entry.score}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {entry.accuracy}% acc · +{entry.speedBonus} speed
                    </p>
                  </div>
                  <p className="text-right text-sm leading-6 text-[var(--text-secondary)]">
                    {formatDuration(entry.durationMs)}
                    <br />
                    {formatTimeAgo(new Date(entry.completedAt))}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <section className={panelClass}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Full ranking
                </p>
                <h2 className="font-display mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                  Every completed run
                </h2>
              </div>
              <Link
                className="text-sm font-semibold text-[var(--accent-strong)]"
                to="/"
              >
                Open quiz
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {leaderboard.map((entry, index) => (
                <article
                  className="grid gap-3 rounded-[1.4rem] bg-[var(--surface)] px-3 py-3 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
                  key={entry._id}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-strong)] font-display text-lg font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                      {entry.name}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {entry.accuracy}% accuracy · {formatDuration(entry.durationMs)} ·{' '}
                      {formatTimeAgo(new Date(entry.completedAt))}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-display text-[1.8rem] font-semibold tracking-[-0.06em] text-[var(--accent-strong)]">
                      {entry.score}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      +{entry.speedBonus} speed
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});
