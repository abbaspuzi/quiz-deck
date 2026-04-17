import { useState } from 'react'
import { useNavigate, createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { authClient } from '../lib/auth-client'
import { quizModes } from '../features/quiz/content'
import type { QuizMode } from '../features/quiz/content'
import {
  badgeClass,
  cardClass,
  googleButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
  statCardClass,
  subtitleClass,
} from '../lib/ui'

function IndexPage() {
  const navigate = useNavigate({ from: '/' })
  const user = useQuery(api.auth.getCurrentUser)
  const leaderboard = useQuery(api.leaderboard.topScores)
  const [selectedMode, setSelectedMode] = useState<QuizMode>('flower-recognise')

  const handleGoogleSignIn = () => {
    const loginQuery = selectedMode === 'flower-recognise' ? '?mode=flower-recognise' : ''
    void authClient.signIn.social({
      provider: 'google',
      callbackURL: `/login${loginQuery}`,
    })
  }

  const handleSignOut = () => {
    void authClient.signOut()
  }

  const handleStartQuiz = () => {
    if (!user) {
      void navigate({
        to: '/login',
        search: { mode: selectedMode === 'flower-recognise' ? selectedMode : undefined },
      })
      return
    }

    void navigate({
      to: '/quiz/$sessionId',
      params: { sessionId: `s-${Date.now()}` },
      search: { name: user.name ?? 'Guest', mode: selectedMode === 'all' ? undefined : selectedMode },
    })
  }

  const topPreview = leaderboard?.slice(0, 3) ?? []
  const averageScore =
    leaderboard && leaderboard.length > 0
      ? Math.round(leaderboard.reduce((sum, item) => sum + item.score, 0) / leaderboard.length)
      : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.9fr)] lg:items-start">
      <section className="grid gap-6">
        <div className={`${cardClass} overflow-hidden`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="grid gap-5">
              <div className="flex flex-wrap gap-2">
                <span className={badgeClass}>Public leaderboard</span>
                <span className={badgeClass}>Login to play</span>
              </div>

              <div className="grid gap-4">
                <h1 className="font-display max-w-[10ch] text-balance text-[clamp(2.7rem,6vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-[var(--text-primary)]">
                  Learn flowers fast. Beat the board.
                </h1>
                <p className="max-w-[62ch] text-pretty text-[1rem] leading-7 text-[var(--text-secondary)] sm:text-[1.05rem]">
                  A bright training deck for event teams to practise flower recognition, product recall,
                  and quality control under pressure. Browse the leaderboard freely, then sign in when you
                  are ready to run the quiz.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="sm:w-auto" type="button" onClick={handleStartQuiz}>
                  <span className={primaryButtonClass}>{user ? 'Start training round' : 'Login to play'}</span>
                </button>
                <Link className={secondaryButtonClass} to="/dashboard">
                  View leaderboard
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-[var(--surface)] p-4 sm:p-5">
              <div className={statCardClass}>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Best for
                </p>
                <p className="mt-2 font-display text-[1.4rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                  Left / right sprint
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Fast image rounds that train quick visual recognition before event day.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={statCardClass}>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Players
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    {leaderboard?.length ?? 0}
                  </p>
                </div>
                <div className={statCardClass}>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Average
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    {averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Join the team deck',
              copy: 'Log in with Google so scores are tied to the right teammate before the event rush starts.',
            },
            {
              title: 'Pick your mode',
              copy: 'Run a quick left or right recognition sprint or switch to the full deck for broader recall.',
            },
            {
              title: 'Climb the leaderboard',
              copy: 'Every completed run lands on the public board so teams can compare readiness at a glance.',
            },
          ].map((item) => (
            <article className={statCardClass} key={item.title}>
              <p className="font-display text-[1.05rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="grid gap-6">
        <section className={cardClass}>
          <div className="grid gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Ready to train
              </p>
              <h2 className="font-display mt-2 text-[1.95rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                {user ? `Welcome back, ${user.name?.split(' ')[0] ?? 'teammate'}` : 'Join the challenge'}
              </h2>
              <p className={`${subtitleClass} mt-2`}>
                {user
                  ? 'Pick the quiz style that matches your prep session, then jump straight into the deck.'
                  : 'Leaderboard access stays public. Logging in only unlocks gameplay and score submission.'}
              </p>
            </div>

            <div className="grid gap-3">
              {quizModes.map((mode) => {
                const active = selectedMode === mode.id
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={
                      active
                        ? 'rounded-[1.4rem] border border-[var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_12%,white)] p-4 text-left shadow-[0_12px_26px_rgba(192,96,55,0.12)] transition duration-200 ease-out'
                        : 'rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-strong)]'
                    }
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                          {mode.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                          {mode.id === 'flower-recognise'
                            ? 'Two photos, one decision. Ideal for fast event warm-ups.'
                            : mode.description}
                        </p>
                      </div>
                      <span
                        className={
                          active
                            ? 'mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--accent-strong)] px-2 text-xs font-bold text-[var(--accent-contrast)]'
                            : 'mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--surface-strong)] px-2 text-xs font-bold text-[var(--text-muted)]'
                        }
                      >
                        {mode.id === 'flower-recognise' ? 'L/R' : 'All'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {user ? (
              <div className="grid gap-3">
                <button className={primaryButtonClass} type="button" onClick={handleStartQuiz}>
                  Start {selectedMode === 'flower-recognise' ? 'left / right sprint' : 'full quiz'}
                </button>
                <button className={secondaryButtonClass} type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <button className={googleButtonClass} type="button" onClick={handleGoogleSignIn}>
                  <GoogleMark />
                  Continue with Google
                </button>
                <Link
                  className={secondaryButtonClass}
                  to="/login"
                  search={{ mode: selectedMode === 'flower-recognise' ? selectedMode : undefined }}
                >
                  Open login screen
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className={cardClass}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Live preview
              </p>
              <h2 className="font-display mt-2 text-[1.6rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                Today&apos;s leaderboard
              </h2>
            </div>
            <Link className="text-sm font-semibold text-[var(--accent-strong)]" to="/dashboard">
              See all
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {leaderboard === undefined ? (
              <div className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                Loading scores...
              </div>
            ) : topPreview.length === 0 ? (
              <div className="rounded-[1.4rem] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                No completed runs yet. Be the first name on the board.
              </div>
            ) : (
              topPreview.map((entry, index) => (
                <article
                  className="flex items-center gap-3 rounded-[1.4rem] bg-[var(--surface)] px-4 py-3.5"
                  key={entry._id}
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-strong)] font-display text-lg font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{entry.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[1.3rem] font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                      {entry.score}%
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </aside>
    </div>
  )
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
  )
}

export const Route = createFileRoute('/')({
  component: IndexPage,
})
