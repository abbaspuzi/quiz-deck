import { useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  cardClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtitleClass,
} from "../../lib/ui";

type AnswerRecord = {
  questionId: string;
  selected: string;
  correct: boolean;
  cluster: string;
};

type ResultsSearch = {
  name?: string;
  answers?: string;
  questionTimings?: string;
};

const TARGET_MS_PER_QUESTION = 15_000;
const MAX_SPEED_BONUS = 50;

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function ResultsPage() {
  const {
    name = "Guest",
    answers: answersRaw,
    questionTimings: timingsRaw,
  } = Route.useSearch();

  const answers: AnswerRecord[] = useMemo(() => {
    if (!answersRaw) return [];
    try {
      return JSON.parse(answersRaw) as AnswerRecord[];
    } catch {
      return [];
    }
  }, [answersRaw]);

  const questionTimings: number[] = useMemo(() => {
    if (!timingsRaw) return [];
    try {
      const parsed = JSON.parse(timingsRaw);
      return Array.isArray(parsed)
        ? parsed.map((n) => (typeof n === "number" ? n : 0))
        : [];
    } catch {
      return [];
    }
  }, [timingsRaw]);

  const totalCorrect = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const perQuestionCap =
    totalQuestions > 0 ? MAX_SPEED_BONUS / totalQuestions : 0;
  const rawSpeed = questionTimings.reduce((sum, ms) => {
    const ratio = Math.max(0, 1 - ms / TARGET_MS_PER_QUESTION);
    return sum + ratio * perQuestionCap;
  }, 0);
  const speedBonus =
    questionTimings.length > 0
      ? Math.min(MAX_SPEED_BONUS, Math.round(rawSpeed))
      : 0;
  const durationMs = questionTimings.reduce((sum, ms) => sum + ms, 0);
  const finalScore = accuracy + speedBonus;
  const avgPerQuestionMs = totalQuestions > 0 ? durationMs / totalQuestions : 0;
  const scorePercent = accuracy;

  if (totalQuestions === 0) {
    return (
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <section className={`${cardClass} grid gap-4 px-6 py-8 text-center`}>
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface)] text-4xl">
            🤔
          </div>
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              No results yet
            </h1>
            <p className={`${subtitleClass} mt-2`}>
              Complete a quiz round first, then come back for the full score
              breakdown.
            </p>
          </div>
          <Link className="mx-auto w-full sm:w-auto" to="/">
            <span className={primaryButtonClass}>Go to start</span>
          </Link>
        </section>
      </div>
    );
  }

  const performanceTone =
    scorePercent >= 80
      ? {
          badge: "High accuracy",
          emoji: "🏆",
          ring: "var(--success)",
          surface: "var(--success-soft)",
        }
      : scorePercent >= 60
        ? {
            badge: "Solid progress",
            emoji: "💪",
            ring: "var(--warning)",
            surface: "var(--warning-soft)",
          }
        : {
            badge: "Needs another round",
            emoji: "📚",
            ring: "var(--accent-strong)",
            surface: "color-mix(in oklab, var(--accent) 16%, white)",
          };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
      <section className={`${cardClass} grid gap-6`}>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Score summary
          </p>
          <h1 className="font-display mt-2 text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[var(--text-primary)]">
            {name}&apos;s result card
          </h1>
          <p className={`${subtitleClass} mt-3`}>
            Review the clusters that felt sharp and the ones that need another
            drill before the event.
          </p>
        </div>

        <div
          className="grid place-items-center rounded-[2rem] p-6"
          style={{ background: performanceTone.surface }}
        >
          <div
            className="relative flex h-[15rem] w-[15rem] items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${performanceTone.ring} ${(scorePercent / 100) * 360}deg, color-mix(in oklab, var(--surface) 92%, white) 0deg)`,
            }}
          >
            <div className="absolute h-[11.7rem] w-[11.7rem] rounded-full bg-[var(--surface-strong)]" />
            <div className="relative text-center">
              <span className="block text-5xl">{performanceTone.emoji}</span>
              <span className="font-display mt-2 block text-[3.2rem] font-semibold tracking-[-0.08em] text-[var(--text-primary)]">
                {finalScore}
              </span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                final score
              </span>
            </div>
          </div>
          <p className="mt-5 text-center text-base leading-7 text-[var(--text-secondary)]">
            {totalCorrect} correct out of {totalQuestions} ·{" "}
            {durationMs > 0 ? formatDuration(durationMs) : "—"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <article className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-4 text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Accuracy
            </p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              {accuracy}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">of 100</p>
          </article>
          <article className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-4 text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Speed bonus
            </p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              +{speedBonus}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              of {MAX_SPEED_BONUS}
            </p>
          </article>
          <article className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-4 text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Avg / question
            </p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              {avgPerQuestionMs > 0
                ? `${(avgPerQuestionMs / 1000).toFixed(1)}s`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              target {TARGET_MS_PER_QUESTION / 1000}s
            </p>
          </article>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link className={primaryButtonClass} to="/">
            Back home
          </Link>
          <Link className={secondaryButtonClass} to="/leaderboard">
            View leaderboard
          </Link>
        </div>
      </section>

      {/* <section className="grid gap-6">
        <section className={panelClass}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Breakdown
              </p>
              <h2 className="font-display mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                Cluster performance
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {clusterScores
              .filter((cluster) => cluster.total > 0)
              .map((cluster) => {
                const tone =
                  cluster.percent >= 80
                    ? { bg: 'var(--success-soft)', fg: 'var(--success)' }
                    : cluster.percent >= 60
                      ? { bg: 'var(--warning-soft)', fg: 'var(--warning)' }
                      : { bg: 'color-mix(in oklab, var(--accent) 12%, white)', fg: 'var(--accent-strong)' }

                return (
                  <article
                    className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-4"
                    key={cluster.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-[var(--text-primary)]">{cluster.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                          {cluster.correct}/{cluster.total} correct
                        </p>
                      </div>
                      <div
                        className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold"
                        style={{ background: tone.bg, color: tone.fg }}
                      >
                        {cluster.percent}%
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
        </section>

        {weakClusters.length > 0 && (
          <section className={panelClass}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Focus next
            </p>
            <h2 className="font-display mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              Recovery notes
            </h2>

            <div className="mt-5 grid gap-3">
              {weakClusters.map((cluster) => (
                <article
                  className="rounded-[1.4rem] bg-[color:color-mix(in_oklab,var(--accent)_10%,white)] px-4 py-4"
                  key={cluster.id}
                >
                  <p className="text-base font-semibold text-[var(--text-primary)]">{cluster.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{cluster.focus}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section> */}
    </div>
  );
}

export const Route = createFileRoute("/results/$sessionId")({
  validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
    name: typeof search.name === "string" ? search.name : undefined,
    answers: typeof search.answers === "string" ? search.answers : undefined,
    questionTimings:
      typeof search.questionTimings === "string"
        ? search.questionTimings
        : undefined,
  }),
  component: ResultsPage,
});
