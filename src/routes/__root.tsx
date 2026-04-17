import { useState, useEffect } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <header className="rounded-4xl border border-(--border-soft) bg-[color-mix(in_oklab,var(--surface-strong)_88%,white)] px-4 py-3 shadow-[0_18px_42px_rgba(63,69,90,0.08)] backdrop-blur-sm sm:px-6 sm:py-4">
        {/* Mobile header */}
        <div className="flex items-center justify-between lg:hidden">
          <Link className="inline-flex flex-col" to="/">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
              2026 Mother's Day
            </span>
            <span className="font-display text-[1.1rem] font-semibold tracking-[-0.05em] text-(--text-primary)">
              Bloomthis Training
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-(--text-secondary) transition hover:bg-(--surface-strong)"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mt-3 grid gap-3 border-t border-(--border-soft) pt-3 lg:hidden">
            <nav className="grid gap-1" aria-label="Primary">
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/">
                Home
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/training-deck">
                Training Deck
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/leaderboard">
                Leaderboard
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/">
                {user ? 'Quiz' : 'Start'}
              </Link>
            </nav>
            {user ? (
              <div className="inline-flex min-h-11 items-center rounded-full bg-(--surface) px-4 py-2.5 text-sm font-semibold text-(--text-primary)">
                <span className="max-w-[14rem] truncate">{user.name}</span>
              </div>
            ) : (
              <Link className={ghostButtonClass} to="/">
                Open deck
              </Link>
            )}
          </div>
        )}

        {/* Desktop header */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link className="inline-flex flex-col gap-1" to="/">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
                2026 Mother's Day
              </span>
              <span className="font-display text-[1.65rem] font-semibold tracking-[-0.05em] text-(--text-primary)">
                Bloomthis Product Training Deck
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex flex-wrap gap-2" aria-label="Primary">
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/">
                Home
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/training-deck">
                Training Deck
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/leaderboard">
                Leaderboard
              </Link>
              <Link className={navLinkClass} activeProps={{ className: activeNavLinkClass }} to="/">
                {user ? 'Quiz' : 'Start'}
              </Link>
            </nav>

            {user ? (
              <div className="inline-flex min-h-11 items-center rounded-full bg-(--surface) px-4 py-2.5 text-sm font-semibold text-(--text-primary)">
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
