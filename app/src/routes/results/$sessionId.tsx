import { useMemo } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { highRiskClusters } from '../../features/quiz/content'
import {
  badgeClass,
  cardClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtitleClass,
} from '../../lib/ui'

type AnswerRecord = {
  questionId: string
  selected: string
  correct: boolean
  cluster: string
}

type ResultsSearch = {
  name?: string
  answers?: string
}

function ResultsPage() {
  const { sessionId } = Route.useParams()
  const { name = 'Guest', answers: answersRaw } = Route.useSearch()

  const answers: AnswerRecord[] = useMemo(() => {
    if (!answersRaw) return []
    try {
      return JSON.parse(answersRaw) as AnswerRecord[]
    } catch {
      return []
    }
  }, [answersRaw])

  const totalCorrect = answers.filter((a) => a.correct).length
  const totalQuestions = answers.length
  const scorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const clusterScores = useMemo(() => {
    return highRiskClusters.map((cluster) => {
      const clusterAnswers = answers.filter((a) => a.cluster === cluster.id)
      const correct = clusterAnswers.filter((a) => a.correct).length
      const total = clusterAnswers.length
      const percent = total > 0 ? Math.round((correct / total) * 100) : -1
      return { ...cluster, correct, total, percent }
    })
  }, [answers])

  const weakClusters = clusterScores.filter((cluster) => cluster.total > 0 && cluster.percent < 75)

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
              Complete a quiz round first, then come back for the full score breakdown.
            </p>
          </div>
          <Link className="mx-auto w-full sm:w-auto" to="/">
            <span className={primaryButtonClass}>Go to start</span>
          </Link>
        </section>
      </div>
    )
  }

  const performanceTone =
    scorePercent >= 80
      ? {
          badge: 'High accuracy',
          emoji: '🏆',
          ring: 'var(--success)',
          surface: 'var(--success-soft)',
        }
      : scorePercent >= 60
        ? {
            badge: 'Solid progress',
            emoji: '💪',
            ring: 'var(--warning)',
            surface: 'var(--warning-soft)',
          }
        : {
            badge: 'Needs another round',
            emoji: '📚',
            ring: 'var(--accent-strong)',
            surface: 'color-mix(in oklab, var(--accent) 16%, white)',
          }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
      <section className={`${cardClass} grid gap-6`}>
        <div className="flex flex-wrap gap-2">
          <span className={badgeClass}>{performanceTone.badge}</span>
          <span className={badgeClass}>Session {sessionId.slice(0, 8)}</span>
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Score summary
          </p>
          <h1 className="font-display mt-2 text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[var(--text-primary)]">
            {name}&apos;s result card
          </h1>
          <p className={`${subtitleClass} mt-3`}>
            Review the clusters that felt sharp and the ones that need another drill before the event.
          </p>
        </div>

        <div className="grid place-items-center rounded-[2rem] p-6" style={{ background: performanceTone.surface }}>
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
                {scorePercent}%
              </span>
            </div>
          </div>
          <p className="mt-5 text-center text-base leading-7 text-[var(--text-secondary)]">
            {totalCorrect} correct answers out of {totalQuestions} questions.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link className={primaryButtonClass} to="/">
            Try another round
          </Link>
          <Link className={secondaryButtonClass} to="/dashboard">
            View leaderboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6">
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
      </section>
    </div>
  )
}

export const Route = createFileRoute('/results/$sessionId')({
  validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    answers: typeof search.answers === 'string' ? search.answers : undefined,
  }),
  component: ResultsPage,
})
