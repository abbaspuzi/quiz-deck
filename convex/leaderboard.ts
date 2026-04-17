import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

/** Save a completed quiz result to the leaderboard */
export const submitResult = mutation({
  args: {
    name: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
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

    // Find or create participant
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

    // Create a quiz session
    const now = Date.now()
    const sessionId = await ctx.db.insert('quizSessions', {
      participantId: participant._id,
      status: 'completed',
      startedAt: now,
      completedAt: now,
      score: args.score,
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

    // Join with participants to get names
    const results = await Promise.all(
      sessions.map(async (session) => {
        const participant = await ctx.db.get(session.participantId)
        return {
          _id: session._id,
          name: participant?.name ?? 'Unknown',
          score: session.score ?? 0,
          completedAt: session.completedAt ?? session.startedAt,
          clusterScores: session.clusterScores ?? [],
        }
      }),
    )

    // Sort by score descending, then by completion time ascending
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.completedAt - b.completedAt
    })

    return results.slice(0, 20)
  },
})
