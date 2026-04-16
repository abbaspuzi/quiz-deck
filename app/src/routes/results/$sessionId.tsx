import { useMemo } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { highRiskClusters } from '../../features/quiz/content'

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
  const scorePercent =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const clusterScores = useMemo(() => {
    return highRiskClusters.map((cluster) => {
      const clusterAnswers = answers.filter((a) => a.cluster === cluster.id)
      const correct = clusterAnswers.filter((a) => a.correct).length
      const total = clusterAnswers.length
      const percent = total > 0 ? Math.round((correct / total) * 100) : -1
      return { ...cluster, correct, total, percent }
    })
  }, [answers])

  const weakClusters = clusterScores.filter(
    (c) => c.total > 0 && c.percent < 75,
  )

  const ringClass =
    scorePercent >= 80 ? 'great' : scorePercent >= 60 ? 'okay' : 'needs-work'

  const emoji =
    scorePercent >= 80 ? '🏆' : scorePercent >= 60 ? '💪' : '📚'

  if (totalQuestions === 0) {
    return (
      <div className="results-screen">
        <div className="results-header">
          <span className="result-emoji">🤔</span>
          <h2 className="headline">No results yet</h2>
          <p className="subtitle">
            Complete the quiz first to see your scorecard.
          </p>
        </div>
        <div className="result-actions" style={{ justifyContent: 'center' }}>
          <Link className="button" to="/">
            Go to start
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="results-screen">
      <div className="results-header">
        <span className="result-emoji">{emoji}</span>
        <h2 className="headline">Scorecard for {name}</h2>
        <p className="subtitle">Session {sessionId.slice(0, 8)}</p>
      </div>

      <div className="score-card">
        <div
          className={`score-ring ${ringClass}`}
          style={{ '--angle': `${(scorePercent / 100) * 360}deg` } as React.CSSProperties}
        >
          <span>{scorePercent}%</span>
        </div>
        <p className="score-text">
          {totalCorrect} of {totalQuestions} correct
        </p>
      </div>

      <section className="results-list" style={{ width: '100%' }}>
        <h3 className="section-title">Cluster Breakdown</h3>
        <div className="cluster-grid">
          {clusterScores
            .filter((c) => c.total > 0)
            .map((cluster) => (
              <div className="cluster-result" key={cluster.id}>
                <div className="cluster-result-info">
                  <span className="cluster-result-name">{cluster.title}</span>
                  <span className="cluster-result-detail">
                    {cluster.correct}/{cluster.total} correct
                  </span>
                </div>
                <span
                  className="score-percent"
                  style={{
                    color:
                      cluster.percent >= 80
                        ? 'var(--success)'
                        : cluster.percent >= 60
                          ? 'var(--warning)'
                          : 'var(--accent)',
                  }}
                >
                  {cluster.percent}%
                </span>
              </div>
            ))}
        </div>
      </section>

      {weakClusters.length > 0 && (
        <section className="recovery-section">
          <h3 className="section-title">Recovery Tips</h3>
          {weakClusters.map((cluster) => (
            <div className="recovery-tip" key={cluster.id}>
              <strong>{cluster.title}</strong>
              {cluster.focus}
            </div>
          ))}
        </section>
      )}

      <div className="result-actions" style={{ justifyContent: 'center' }}>
        <Link className="button" to="/">
          Try again
        </Link>
        <Link className="ghost-button" to="/dashboard">
          Dashboard
        </Link>
      </div>
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
