import { Link, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { api } from '../../convex/_generated/api'
import { ghostButtonClass } from '../lib/ui'

const navLinkClass =
  'inline-flex min-h-11 items-center justify-center rounded-full border border-transparent px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition duration-200 ease-out hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]'

const activeNavLinkClass = `${navLinkClass} border-[var(--border-soft)] bg-[var(--surface-strong)] text-[var(--text-primary)] shadow-[0_10px_20px_rgba(63,69,90,0.06)]`

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const user = useQuery(api.auth.getCurrentUser)

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <header className="rounded-[2rem] border border-[var(--border-soft)] bg-[color:color-mix(in_oklab,var(--surface-strong)_88%,white)] px-4 py-4 shadow-[0_18px_42px_rgba(63,69,90,0.08)] backdrop-blur-sm sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link className="inline-flex flex-col gap-1" to="/">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                2026 Mother's Day
              </span>
              <span className="font-display text-[1.35rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[1.65rem]">
                Bloomthis Product Training Deck
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <nav className="flex flex-wrap gap-2" aria-label="Primary">
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/">
                Home
              </Link>
              <Link
                className={navLinkClass}
                activeProps={{ className: activeNavLinkClass }}
                to="/training-deck"
              >
                Training Deck
              </Link>
              <Link
                className={navLinkClass}
                activeProps={{ className: activeNavLinkClass }}
                to="/leaderboard"
              >
                Leaderboard
              </Link>
              <Link
                className={navLinkClass}
                activeProps={{ className: activeNavLinkClass }}
                to="/"
              >
                {user ? 'Quiz' : 'Start'}
              </Link>
            </nav>

            {user ? (
              <div className="inline-flex min-h-11 items-center rounded-full bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <span className="max-w-[14rem] truncate">{user.name}</span>
              </div>
            ) : (
              <Link className={ghostButtonClass} to="/">
                Open deck
              </Link>
            )}
          </div>
        </div>
      </header>

      <main key={pathname} className="flex-1 py-6 sm:py-8">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
