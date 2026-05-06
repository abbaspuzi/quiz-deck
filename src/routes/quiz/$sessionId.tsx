import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { QuizMode, QuizQuestion } from "../../features/quiz/content";
import {
  getQuestionsForMode,
  highRiskClusters,
  isCorrectSelection,
  shuffle,
} from "../../features/quiz/content";
import { authClient } from "../../lib/auth-client";
import {
  cardClass,
  eyebrowClass,
  googleButtonClass,
  mutedPanelClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtitleClass,
} from "../../lib/ui";

type QuizSearch = {
  name?: string;
  mode?: QuizMode;
};

type AnswerRecord = {
  questionId: string;
  selected: string;
  correct: boolean;
  cluster: string;
  questionMs?: number;
};

function QuizSessionPage() {
  const { sessionId } = Route.useParams();
  const { name = "Guest", mode = "all" } = Route.useSearch();
  const user = useQuery(api.auth.getCurrentUser);

  const questions = useMemo(() => shuffle(getQuestionsForMode(mode)), [mode]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const questionStartRef = useRef<number>(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  const question: QuizQuestion | undefined = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;
  const isFinished = currentIndex >= total;
  const playerName = user?.name ?? name;

  useEffect(() => {
    questionStartRef.current = Date.now();
    setElapsedMs(0);
  }, [currentIndex]);

  useEffect(() => {
    if (isFinished || revealed) return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - questionStartRef.current);
    }, 100);
    return () => window.clearInterval(id);
  }, [currentIndex, isFinished, revealed]);

  const score = answers.filter((a) => a.correct).length;
  const scorePercent = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;

  const confirmAnswer = useCallback(
    (option: string) => {
      if (!question || revealed) return;
      const elapsed = Date.now() - questionStartRef.current;
      const isCorrect = isCorrectSelection(question, option);
      setSelected(option);
      setRevealed(true);
      setElapsedMs(elapsed);
      setAnswers((prev) => [
        ...prev,
        {
          questionId: question.id,
          selected: option,
          correct: isCorrect,
          cluster: question.cluster,
          questionMs: elapsed,
        },
      ]);
    },
    [question, revealed],
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    setCurrentIndex((index) => index + 1);
  }, []);

  const submitResult = useMutation(api.leaderboard.submitResult);
  const submitted = useRef(false);

  const allTimed = answers.length === total && answers.every((a) => a.questionMs !== undefined);

  useEffect(() => {
    if (!isFinished || answers.length === 0 || submitted.current) return;
    if (!allTimed) return;

    submitted.current = true;

    const clusterMap = new Map<string, { correct: number; total: number; title: string }>();
    for (const answer of answers) {
      const existing = clusterMap.get(answer.cluster) ?? {
        correct: 0,
        total: 0,
        title: "",
      };
      existing.total++;
      if (answer.correct) existing.correct++;
      const info = highRiskClusters.find((cluster) => cluster.id === answer.cluster);
      existing.title = info?.title ?? answer.cluster;
      clusterMap.set(answer.cluster, existing);
    }

    submitResult({
      name: playerName,
      correct: score,
      totalQuestions: total,
      questionResults: answers.map((a) => ({
        ms: a.questionMs ?? 0,
        correct: a.correct,
      })),
      clusterScores: Array.from(clusterMap.entries()).map(([id, data]) => ({
        clusterId: id,
        clusterTitle: data.title,
        correct: data.correct,
        total: data.total,
      })),
    }).catch(() => {
      // Results still render locally when submission fails.
    });
  }, [answers, isFinished, playerName, score, submitResult, total, allTimed]);

  if (!user) {
    return (
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <section className={`${cardClass} grid gap-4 px-4 py-6 text-center`}>
          <div>
            <h1 className="font-display text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-[var(--text-primary)]">
              This quiz deck is for signed-in teammates.
            </h1>
            <p className={`${subtitleClass} mt-3 max-w-[56ch] mx-auto`}>
              Sign in first so your answers and score are tracked correctly. You can still browse
              the leaderboard without an account.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <button
              className={googleButtonClass}
              type="button"
              onClick={() =>
                void authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
            >
              <GoogleMark />
              Continue with Google
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className={secondaryButtonClass} to="/leaderboard">
              Open leaderboard
            </Link>
            <Link className={secondaryButtonClass} to="/">
              Back home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (isFinished) {
    const totalDurationMs = answers.reduce((sum, a) => sum + (a.questionMs ?? 0), 0);
    const perQuestionCap = total > 0 ? MAX_SPEED_BONUS / total : 0;
    const rawSpeedBonus = answers.reduce((sum, a) => {
      if (!a.correct) return sum;
      const ms = a.questionMs ?? 0;
      const ratio = Math.max(0, 1 - ms / SCORE_TARGET_MS_PER_QUESTION);
      return sum + ratio * perQuestionCap;
    }, 0);
    const speedBonus =
      answers.length > 0 ? Math.min(MAX_SPEED_BONUS, Math.round(rawSpeedBonus)) : 0;
    const finalScore = scorePercent + speedBonus;
    const avgPerQuestionMs = total > 0 ? totalDurationMs / total : 0;
    const finishTone =
      finalScore >= 120
        ? {
            emoji: "🏆",
            ring: "var(--success)",
            surface: "var(--success-soft)",
          }
        : finalScore >= 80
          ? {
              emoji: "💪",
              ring: "var(--warning)",
              surface: "var(--warning-soft)",
            }
          : {
              emoji: "📚",
              ring: "var(--accent-strong)",
              surface: "color-mix(in oklab, var(--accent) 16%, white)",
            };
    const dialFillDeg = Math.min(360, (finalScore / 150) * 360);

    return (
      <div className="mx-auto grid w-full max-w-3xl gap-4">
        <section className={`${cardClass} grid gap-5`}>
          <div className="text-center">
            <p className={eyebrowClass}>Round complete</p>
            <h1 className="font-display mt-1 text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              Nice work, {playerName.split(" ")[0] ?? "teammate"}.
            </h1>
          </div>

          <div
            className="grid place-items-center rounded-[1.8rem] p-4"
            style={{ background: finishTone.surface }}
          >
            <div
              className="relative grid h-[12rem] w-[12rem] place-items-center rounded-full"
              style={{
                background: `conic-gradient(${finishTone.ring} ${dialFillDeg}deg, color-mix(in oklab, var(--surface) 92%, white) 0deg)`,
              }}
            >
              <div className="absolute h-[9.6rem] w-[9.6rem] rounded-full bg-[var(--surface-strong)]" />
              <div className="relative flex flex-col items-center leading-none">
                <span className="text-3xl">{finishTone.emoji}</span>
                <span className="font-display mt-2 text-[2.6rem] font-semibold tracking-[-0.07em] text-[var(--text-primary)]">
                  {finalScore}
                </span>
                <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  final score
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-[var(--text-secondary)]">
              out of 150 (accuracy + speed)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <article className="rounded-[1.2rem] bg-[var(--surface)] px-3 py-3 text-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Accuracy
              </p>
              <p className="font-display mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {scorePercent}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {score}/{total}
              </p>
            </article>
            <article className="rounded-[1.2rem] bg-[var(--surface)] px-3 py-3 text-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Speed
              </p>
              <p className="font-display mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                +{speedBonus}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">of {MAX_SPEED_BONUS}</p>
            </article>
            <article className="rounded-[1.2rem] bg-[var(--surface)] px-3 py-3 text-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Time
              </p>
              <p className="font-display mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {formatRoundDuration(totalDurationMs)}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {avgPerQuestionMs > 0 ? `${(avgPerQuestionMs / 1000).toFixed(1)}s/q` : "—"}
              </p>
            </article>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Link
              to="/results/$sessionId"
              params={{ sessionId }}
              search={{
                name: playerName,
                answers: JSON.stringify(answers),
                questionResults: JSON.stringify(
                  answers.map((a) => ({
                    ms: a.questionMs ?? 0,
                    correct: a.correct,
                  })),
                ),
              }}
            >
              <span className={primaryButtonClass}>View quiz recap</span>
            </Link>
            <Link className={secondaryButtonClass} to="/leaderboard">
              See leaderboard
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!question) return null;

  const imageOptions = question.images ?? null;

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-2 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:items-start">
      {/* Mobile compact nav */}
      <aside className="lg:hidden">
        <section className={`${cardClass} grid gap-2.5 px-3 py-2.5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-(--text-primary)">
              Q{currentIndex + 1}/{total}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-(--success)">{score} correct</span>
              <span className="text-xs font-semibold text-(--danger)">
                {answers.length - score} missed
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-4xl bg-(--surface-strong)">
            <div
              className="h-full rounded-full bg-(--accent-strong) transition-[width] duration-300 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>
      </aside>

      {/* Desktop full sidebar */}
      <aside className="hidden lg:grid gap-4 lg:sticky lg:top-8">
        <section className={`${cardClass} grid gap-3`}>
          <div>
            <p className={eyebrowClass}>
              {playerName} · Session {sessionId.slice(0, 8)}
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-(--surface) p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-(--text-primary)">
                Question {currentIndex + 1} of {total}
              </span>
              <span className="text-sm font-semibold tabular-nums text-(--text-secondary)">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--surface-strong)">
              <div
                className="h-full rounded-full bg-[var(--accent-strong)] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <article className={mutedPanelClass}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Correct
              </p>
              <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                {score}
              </p>
            </article>
            <article className={mutedPanelClass}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Missed
              </p>
              <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                {answers.length - score}
              </p>
            </article>
          </div>
        </section>
      </aside>

      <section className={`${cardClass} grid gap-5`}>
        <div className="grid grid-cols-5 items-center gap-3">
          <div className="col-span-4">
            <h2 className="font-display text-balance text-xl font-semibold leading-tight tracking-[-0.05em] text-(--text-primary)">
              {question.prompt}
            </h2>
          </div>
          <div className="col-span-1 flex justify-end">
            <QuestionTimer elapsedMs={elapsedMs} totalQuestions={total} />
          </div>
        </div>

        {question.image && (
          <div className="mx-auto overflow-hidden rounded-[1.6rem] bg-(--surface) p-2">
            <img
              src={question.image}
              alt="Quiz visual"
              className="mx-auto max-h-[min(16rem,32vh)] w-auto max-w-full rounded-[1.2rem] object-contain"
            />
          </div>
        )}

        {imageOptions ? (
          <div className="grid gap-4 grid-cols-2">
            {(["Left", "Right"] as const).map((side, index) => {
              const selectedThis = selected === side;
              const correctThis = isCorrectSelection(question, side);
              const incorrectSelected = revealed && selectedThis && !correctThis;

              let cardTone = "border-[var(--border-soft)] bg-[var(--surface)]";
              if (revealed && correctThis)
                cardTone = "border-[var(--success)] bg-[var(--success-soft)]";
              if (incorrectSelected) cardTone = "border-[var(--danger)] bg-[var(--danger-soft)]";

              return (
                <button
                  key={side}
                  type="button"
                  className={`group grid gap-2.5 rounded-[1.75rem] border p-2.5 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--surface-strong) ${cardTone}`}
                  onClick={() => confirmAnswer(side)}
                  disabled={revealed}
                >
                  <img
                    src={imageOptions[index]}
                    alt={`${side} option`}
                    className="w-full rounded-[1.25rem] max-h-[min(16rem,34vh)] object-contain"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3">
            {question.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = isCorrectSelection(question, option);
              const isIncorrectSelected = revealed && isSelected && !isCorrect;

              let optionTone =
                "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-primary)]";
              if (revealed && isCorrect) {
                optionTone =
                  "border-[var(--success)] bg-[var(--success-soft)] text-[var(--text-primary)]";
              }
              if (isIncorrectSelected) {
                optionTone =
                  "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--text-primary)]";
              }

              return (
                <button
                  key={option}
                  type="button"
                  className={`w-full rounded-[1.4rem] border px-3 py-3 text-left text-sm font-semibold leading-6 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] ${optionTone}`}
                  onClick={() => confirmAnswer(option)}
                  disabled={revealed}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {revealed && (
          <div
            className="rounded-[1.5rem] px-3 py-3"
            style={{
              background: (selected ? isCorrectSelection(question, selected) : false)
                ? "var(--success-soft)"
                : "color-mix(in oklab, var(--accent) 10%, white)",
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              {selected && isCorrectSelection(question, selected) ? "Correct" : "Review note"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-primary)]">{question.explain}</p>
          </div>
        )}

        {revealed && (
          <div className="flex flex-col">
            <button
              type="button"
              className={`${primaryButtonClass} sm:flex-1`}
              onClick={handleNext}
            >
              {currentIndex + 1 < total ? "Next question" : "See results"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

const QUESTION_TARGET_MS = 30_000;
const SCORE_TARGET_MS_PER_QUESTION = 15_000;
const MAX_SPEED_BONUS = 100;

function formatRoundDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function QuestionTimer({ elapsedMs }: { elapsedMs: number; totalQuestions: number }) {
  const cap = 10;
  const ratio = Math.max(0, 1 - elapsedMs / QUESTION_TARGET_MS);
  const bonus = ratio * cap;
  const fillPercent = Math.min(100, (elapsedMs / QUESTION_TARGET_MS) * 100);
  const expired = ratio === 0;
  const fillColor = expired ? "var(--text-muted)" : "var(--accent-strong)";

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - fillPercent / 100);

  return (
    <div
      className="relative aspect-square h-17 w-17"
      role="img"
      aria-label={`Time elapsed ${(elapsedMs / 1000).toFixed(1)} seconds`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="var(--surface-strong)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={fillColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 100ms linear, stroke 200ms ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span
          className="font-display text-base font-semibold tabular-nums tracking-[-0.04em]"
          style={{
            color: expired ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {(elapsedMs / 1000).toFixed(1)}s
        </span>
        <span
          className="mt-0.5 text-[0.6rem] font-semibold tabular-nums"
          style={{ color: fillColor }}
        >
          {expired ? "0" : `+${bonus.toFixed(1)}`}
        </span>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export const Route = createFileRoute("/quiz/$sessionId")({
  validateSearch: (search: Record<string, unknown>): QuizSearch => ({
    name: typeof search.name === "string" ? search.name : undefined,
    mode: search.mode === "flower-recognise" ? "flower-recognise" : undefined,
  }),
  component: QuizSessionPage,
});
