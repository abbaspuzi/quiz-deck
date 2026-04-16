import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="logo-container">
              <span className="heart">💐</span>
            </div>
            <p className="eyebrow">BloomThis Mother&apos;s Day</p>
            <h1 className="brand-title">Product Quiz</h1>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <Link className="nav-link" activeProps={{ className: 'nav-link active' }} to="/">
              Start
            </Link>
<Link
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
              to="/dashboard"
            >
              Dashboard
            </Link>
          </nav>
        </header>

        <main className="page" key={pathname}>
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
