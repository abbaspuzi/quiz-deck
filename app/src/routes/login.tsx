import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { authClient } from '../lib/auth-client'
import {
  badgeClass,
  cardClass,
  googleButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtitleClass,
} from '../lib/ui'

type LoginSearch = {
  mode?: 'flower-recognise'
}

function LoginPage() {
  const navigate = useNavigate({ from: '/login' })
  const user = useQuery(api.auth.getCurrentUser)
  const { mode } = Route.useSearch()

  const handleGoogleSignIn = () => {
    void authClient.signIn.social({
      provider: 'google',
      callbackURL: mode ? `/login?mode=${mode}` : '/login',
    })
  }

  const handleStart = () => {
    if (!user) return
    void navigate({
      to: '/quiz/$sessionId',
      params: { sessionId: `s-${Date.now()}` },
      search: { name: user.name ?? 'Guest', mode },
    })
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center">
      <section className={`${cardClass} grid gap-6`}>
        <div className="flex flex-wrap gap-2">
          <span className={badgeClass}>Login required to answer</span>
          <span className={badgeClass}>Leaderboard stays public</span>
        </div>

        <div className="grid gap-4">
          <h1 className="font-display max-w-[12ch] text-balance text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[0.93] tracking-[-0.07em] text-[var(--text-primary)]">
            Step in, train fast, and post a score.
          </h1>
          <p className="max-w-[60ch] text-pretty text-[1rem] leading-7 text-[var(--text-secondary)] sm:text-[1.05rem]">
            Sign in before you start the quiz so each result lands on the right teammate. The experience is
            tuned for quick event prep: visual decisions, instant feedback, and a shared leaderboard the team
            can watch fill up.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['1', 'Use Google to join the deck'],
            ['2', mode ? 'Start directly in the left / right sprint' : 'Choose your training mode'],
            ['3', 'Finish a round and appear on the public board'],
          ].map(([step, copy]) => (
            <div className="rounded-[1.4rem] bg-[var(--surface)] p-4" key={step}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-strong)] font-display text-lg font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                {step}
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className={`${cardClass} grid gap-5`}>
        {user ? (
          <>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Signed in
              </p>
              <h2 className="font-display mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                Ready, {user.name?.split(' ')[0] ?? 'teammate'}?
              </h2>
              <p className={`${subtitleClass} mt-2`}>
                Your scores can now be tracked. Jump into the deck when you are ready.
              </p>
            </div>

            <button className={primaryButtonClass} type="button" onClick={handleStart}>
              Start {mode === 'flower-recognise' ? 'left / right sprint' : 'training round'}
            </button>
            <Link className={secondaryButtonClass} to="/dashboard">
              View leaderboard first
            </Link>
          </>
        ) : (
          <>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Team login
              </p>
              <h2 className="font-display mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                Join with your work Google account.
              </h2>
              <p className={`${subtitleClass} mt-2`}>
                This keeps the board clean and makes every run traceable during event prep.
              </p>
            </div>

            <button className={googleButtonClass} type="button" onClick={handleGoogleSignIn}>
              <GoogleMark />
              Continue with Google
            </button>

            <div className="rounded-[1.4rem] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
              You can still explore the public leaderboard without logging in.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={`${secondaryButtonClass} flex-1`} to="/dashboard">
                Open leaderboard
              </Link>
              <Link className={`${secondaryButtonClass} flex-1`} to="/">
                Back home
              </Link>
            </div>
          </>
        )}
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

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    mode: search.mode === 'flower-recognise' ? 'flower-recognise' : undefined,
  }),
  component: LoginPage,
})
