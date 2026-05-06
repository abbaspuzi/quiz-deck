import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { sampleParticipants } from '../features/quiz/content'
import { cardClass, primaryButtonClass, secondaryButtonClass, subtitleClass } from '../lib/ui'

type MatchNameSearch = {
  q?: string
}

function MatchNamePage() {
  const navigate = useNavigate({ from: '/match-name' })
  const { q = '' } = Route.useSearch()

  const normalized = q.trim().toLowerCase()
  const matches = sampleParticipants.filter((participant) => participant.toLowerCase().includes(normalized))
  const displayName = q.trim() || 'Guest'

  const handleContinue = (name: string) => {
    void navigate({
      to: '/quiz/$sessionId',
      params: { sessionId: `s-${Date.now()}` },
      search: { name },
    })
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <section className={`${cardClass} grid gap-5`}>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Match teammate
          </p>
          <h1 className="font-display mt-2 text-[2.4rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
            Matches for {q || 'your name'}
          </h1>
          <p className={`${subtitleClass} mt-2`}>Confirm the right profile before starting the training deck.</p>
        </div>

        {matches.length > 0 ? (
          <div className="grid gap-3">
            {matches.map((match) => (
              <article className="flex flex-col gap-3 rounded-[1.4rem] bg-[var(--surface)] p-3 sm:flex-row sm:items-center" key={match}>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-[var(--text-primary)]">{match}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Profile found. Continue into the quiz.</p>
                </div>
                <button className="sm:w-auto" type="button" onClick={() => handleContinue(match)}>
                  <span className={primaryButtonClass}>Continue</span>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 rounded-[1.4rem] bg-[var(--surface)] p-3">
            <div>
              <p className="text-base font-semibold text-[var(--text-primary)]">No exact match for &ldquo;{q}&rdquo;</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                You can still continue as a new participant.
              </p>
            </div>
            <button type="button" onClick={() => handleContinue(displayName)}>
              <span className={primaryButtonClass}>Continue as {displayName}</span>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className={secondaryButtonClass} to="/">
            Back home
          </Link>
        </div>
      </section>
    </div>
  )
}

export const Route = createFileRoute('/match-name')({
  validateSearch: (search: Record<string, unknown>): MatchNameSearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: MatchNamePage,
})
