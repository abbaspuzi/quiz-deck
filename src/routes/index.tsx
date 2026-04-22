import { useState } from "react";
import { useNavigate, createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "../lib/auth-client";
import { quizModes } from "../features/quiz/content";
import type { QuizMode } from "../features/quiz/content";
import {
  cardClass,
  googleButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../lib/ui";

function IndexPage() {
  const navigate = useNavigate({ from: "/" });
  const user = useQuery(api.auth.getCurrentUser);
  const leaderboard = useQuery(api.leaderboard.topScores);
  const [selectedMode, setSelectedMode] =
    useState<QuizMode>("flower-recognise");

  const handleGoogleSignIn = () => {
    void authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleSignOut = () => {
    void authClient.signOut();
  };

  const handleStartQuiz = () => {
    if (!user) {
      handleGoogleSignIn();
      return;
    }

    void navigate({
      to: "/quiz/$sessionId",
      params: { sessionId: `s-${Date.now()}` },
      search: {
        name: user.name ?? "Guest",
        mode: selectedMode === "all" ? undefined : selectedMode,
      },
    });
  };

  const topPreview = leaderboard?.slice(0, 3) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <section className="grid gap-6">
        <section className={cardClass}>
          <div className="grid gap-4">
            <div>
              <h1 className="font-display mt-2 text-[2.2rem] font-semibold tracking-[-0.06em] text-(--text-primary)">
                Learn flowers like flashcards.
              </h1>
              <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                Study first: see a flower and pick the name, or see the name and
                pick the picture.
              </p>
            </div>

            <Link className={primaryButtonClass} to="/training-deck">
              Open training deck
            </Link>
          </div>
        </section>

        <section className={cardClass}>
          <div className="grid gap-4">
            <div>
              <h2 className="font-display mt-2 text-[1.95rem] font-semibold tracking-[-0.06em] text-(--text-primary)">
                {user
                  ? `Ready, ${user.name?.split(" ")[0] ?? "teammate"}?`
                  : "Answer for score"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                {user
                  ? "Pick a quiz mode and start."
                  : "Login is required to answer and join the leaderboard."}
              </p>
            </div>

            <div className="grid gap-3">
              {quizModes.map((mode) => {
                const active = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={
                      active
                        ? "rounded-[1.4rem] border border-(--accent) bg-[color-mix(in_oklab,var(--accent)_12%,white)] p-4 text-left shadow-[0_12px_26px_rgba(192,96,55,0.12)] transition duration-200 ease-out"
                        : "rounded-[1.4rem] border border-(--border-soft) bg-(--surface) p-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--surface-strong)"
                    }
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold tracking-[-0.05em] text-(--text-primary)">
                          {mode.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                          {mode.id === "flower-recognise"
                            ? "Picture quiz."
                            : "Mixed scored quiz."}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {user ? (
              <div className="grid gap-3">
                <button
                  className={primaryButtonClass}
                  type="button"
                  onClick={handleStartQuiz}
                >
                  Start{" "}
                  {selectedMode === "flower-recognise"
                    ? "Picture quiz"
                    : "full quiz"}
                </button>
                <button
                  className={secondaryButtonClass}
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                className={googleButtonClass}
                type="button"
                onClick={handleGoogleSignIn}
              >
                <GoogleMark />
                Continue with Google
              </button>
            )}
          </div>
        </section>
      </section>

      <aside className={cardClass}>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display mt-2 text-[1.6rem] font-semibold tracking-[-0.06em] text-(--text-primary)">
            Leaderboard
          </h2>
          <Link
            className="text-sm font-semibold text-(--accent-strong)"
            to="/leaderboard"
          >
            See all
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {leaderboard === undefined ? (
            <div className="rounded-[1.4rem] bg-(--surface) px-4 py-6 text-center text-sm text-(--text-secondary)">
              Loading scores...
            </div>
          ) : topPreview.length === 0 ? (
            <div className="rounded-[1.4rem] bg-(--surface) px-4 py-6 text-center text-sm text-(--text-secondary)">
              No completed runs yet.
            </div>
          ) : (
            topPreview.map((entry, index) => (
              <article
                className="flex items-center gap-3 rounded-[1.4rem] bg-(--surface) px-4 py-3.5"
                key={entry._id}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--surface-strong) font-display text-lg font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">
                    {entry.name}
                  </p>
                  <p className="mt-0.5 text-xs text-(--text-secondary)">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[1.3rem] font-semibold tracking-[-0.05em] text-(--accent-strong)">
                    {entry.score}%
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
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

export const Route = createFileRoute("/")({
  component: IndexPage,
});
