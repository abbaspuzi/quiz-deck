import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

function DashboardPage() {
  const leaderboard = useQuery(api.leaderboard.topScores)

  const completedCount = leaderboard?.length ?? 0
  const avgScore =
    completedCount > 0
      ? Math.round(
          leaderboard!.reduce((sum, r) => sum + r.score, 0) / completedCount,
        )
      : 0

  return (
    <div className="dashboard-screen">
      <div className="header">
        <h2>Leaderboard</h2>
        <p className="subtitle">Live quiz results from the team</p>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <article className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{completedCount}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Avg score</p>
          <p className="stat-value">{avgScore}%</p>
        </article>
      </div>

      {/* Leaderboard list */}
      <section className="leaderboard-list">
        <h3 className="section-title">Top Scores</h3>
        {leaderboard === undefined ? (
          <div className="loading-state">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="empty-state">
            <p>No results yet.</p>
            <p className="helper-text">Complete the quiz to appear here!</p>
          </div>
        ) : (
          <div className="leaderboard-items">
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              const isTopThree = rank <= 3
              const rankDisplay =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`

              const date = new Date(entry.completedAt)
              const timeAgo = formatTimeAgo(date)

              return (
                <article
                  className={`leaderboard-item${isTopThree ? ' top-three' : ''}`}
                  key={entry._id}
                >
                  <span className="rank">{rankDisplay}</span>
                  <div className="player-info">
                    <span className="player-name">{entry.name}</span>
                    <span className="player-date">{timeAgo}</span>
                  </div>
                  <div className="player-score">
                    <span className="score-percent">{entry.score}%</span>
                    {entry.clusterScores.length > 0 && (
                      <span className="score-detail">
                        {entry.clusterScores.length} clusters
                      </span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
