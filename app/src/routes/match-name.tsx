import { Link, createFileRoute } from '@tanstack/react-router'
import { sampleParticipants } from '../features/quiz/content'

type MatchNameSearch = {
  q?: string
}

function MatchNamePage() {
  const { q = '' } = Route.useSearch()

  const normalized = q.trim().toLowerCase()
  const matches = sampleParticipants.filter((participant) =>
    participant.toLowerCase().includes(normalized),
  )

  const displayName = q.trim() || 'Guest'

  return (
    <div className="username-screen">
      <h2 className="section-title">Matches for {q || 'your name'}</h2>
      <p className="subtitle">Confirm the right staff profile before starting.</p>

      <section className="leaderboard-list" style={{ width: '100%' }}>
        {matches.length > 0 ? (
          <div className="cluster-grid">
            {matches.map((match) => (
              <article className="leaderboard-item" key={match}>
                <div style={{ flex: 1 }}>
                  <strong>{match}</strong>
                  <p className="helper-text">Profile found. Continue into quiz.</p>
                </div>
                <Link className="button" search={{ name: match }} to="/quiz/$sessionId" params={{ sessionId: `s-${Date.now()}` }}>
                  Continue
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="cluster-grid">
            <article className="leaderboard-item">
              <div style={{ flex: 1 }}>
                <strong>No exact match for &ldquo;{q}&rdquo;</strong>
                <p className="helper-text">
                  You can still continue as a new participant.
                </p>
              </div>
            </article>
            <Link
              className="button"
              search={{ name: displayName }}
              to="/quiz/$sessionId" params={{ sessionId: `s-${Date.now()}` }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Continue as {displayName}
            </Link>
          </div>
        )}
      </section>

      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <Link className="ghost-button" to="/">
          Back
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/match-name')({
  validateSearch: (search: Record<string, unknown>): MatchNameSearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: MatchNamePage,
})
