import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

const TARGET_MS_PER_QUESTION = 15_000
const MAX_SPEED_BONUS = 50

function calculateScore(
  correct: number,
  totalQuestions: number,
  questionResults: { ms: number; correct: boolean }[],
) {
  const accuracy =
    totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0
  const perQuestionCap = totalQuestions > 0 ? MAX_SPEED_BONUS / totalQuestions : 0
  const rawSpeed = questionResults.reduce((sum, r) => {
    if (!r.correct) return sum
    const ratio = Math.max(0, 1 - r.ms / TARGET_MS_PER_QUESTION)
    return sum + ratio * perQuestionCap
  }, 0)
  const speedBonus = Math.min(MAX_SPEED_BONUS, Math.round(rawSpeed))
  const durationMs = questionResults.reduce((sum, r) => sum + r.ms, 0)
  return { accuracy, speedBonus, score: accuracy + speedBonus, durationMs }
}

/** Save a completed quiz result to the leaderboard */
export const submitResult = mutation({
  args: {
    name: v.string(),
    correct: v.number(),
    totalQuestions: v.number(),
    questionResults: v.array(
      v.object({
        ms: v.number(),
        correct: v.boolean(),
      }),
    ),
    clusterScores: v.array(
      v.object({
        clusterId: v.string(),
        clusterTitle: v.string(),
        correct: v.number(),
        total: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const normalizedName = args.name.trim().toLowerCase()

    let participant = await ctx.db
      .query('participants')
      .withIndex('by_normalized_name', (q) => q.eq('normalizedName', normalizedName))
      .first()

    if (!participant) {
      const id = await ctx.db.insert('participants', {
        name: args.name.trim(),
        normalizedName,
      })
      participant = (await ctx.db.get(id))!
    }

    const { accuracy, speedBonus, score, durationMs } = calculateScore(
      args.correct,
      args.totalQuestions,
      args.questionResults,
    )

    const now = Date.now()
    const sessionId = await ctx.db.insert('quizSessions', {
      participantId: participant._id,
      status: 'completed',
      startedAt: now - durationMs,
      completedAt: now,
      score,
      accuracy,
      durationMs,
      speedBonus,
      clusterScores: args.clusterScores.map((c) => ({
        clusterId: c.clusterId,
        score: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
      })),
    })

    return sessionId
  },
})

/** Get the top scores for the leaderboard */
export const topScores = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query('quizSessions')
      .withIndex('by_status', (q) => q.eq('status', 'completed'))
      .order('desc')
      .collect()

    const results = await Promise.all(
      sessions.map(async (session) => {
        const participant = await ctx.db.get(session.participantId)
        return {
          _id: session._id,
          name: participant?.name ?? 'Unknown',
          score: session.score ?? 0,
          accuracy: session.accuracy ?? session.score ?? 0,
          durationMs: session.durationMs ?? 0,
          speedBonus: session.speedBonus ?? 0,
          completedAt: session.completedAt ?? session.startedAt,
          clusterScores: session.clusterScores ?? [],
        }
      }),
    )

    // Sort by composite score desc, then by faster duration, then by earlier completion
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.durationMs !== b.durationMs) return a.durationMs - b.durationMs
      return a.completedAt - b.completedAt
    })

    return results.slice(0, 20)
  },
})
