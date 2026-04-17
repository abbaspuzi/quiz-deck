import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  participants: defineTable({
    name: v.string(),
    normalizedName: v.string(),
    aliases: v.optional(v.array(v.string())),
  }).index('by_normalized_name', ['normalizedName']),

  quizSessions: defineTable({
    participantId: v.id('participants'),
    status: v.union(v.literal('started'), v.literal('completed'), v.literal('abandoned')),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    score: v.optional(v.number()),
    clusterScores: v.optional(v.array(v.object({
      clusterId: v.string(),
      score: v.number(),
    }))),
  }).index('by_status', ['status']),

  answers: defineTable({
    sessionId: v.id('quizSessions'),
    questionId: v.string(),
    clusterId: v.string(),
    selectedAnswer: v.string(),
    isCorrect: v.boolean(),
    responseTimeMs: v.optional(v.number()),
    answeredAt: v.number(),
  }).index('by_session', ['sessionId']),
})
