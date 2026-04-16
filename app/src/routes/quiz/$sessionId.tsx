import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import confetti from 'canvas-confetti'
import { api } from '../../../convex/_generated/api'
import { shuffle, highRiskClusters, getQuestionsForMode } from '../../features/quiz/content'
import type { QuizQuestion, QuizMode } from '../../features/quiz/content'

type QuizSearch = {
  name?: string
  mode?: QuizMode
}

type AnswerRecord = {
  questionId: string
  selected: string
  correct: boolean
  cluster: string
}

function QuizSessionPage() {
  const { sessionId } = Route.useParams()
  const { name = 'Guest', mode = 'all' } = Route.useSearch()

  const questions = useMemo(() => shuffle(getQuestionsForMode(mode)), [mode])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  const question: QuizQuestion | undefined = questions[currentIndex]
  const total = questions.length
  const progress = ((currentIndex) / total) * 100
  const isFinished = currentIndex >= total

  const score = answers.filter((a) => a.correct).length
  const scorePercent = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0

  const handleSelect = useCallback(
    (option: string) => {
      if (revealed) return
      setSelected(option)
    },
    [revealed],
  )

  const handleConfirm = useCallback(() => {
    if (!selected || !question) return
    const isCorrect = selected === question.answer
    setRevealed(true)
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selected,
        correct: isCorrect,
        cluster: question.cluster,
      },
    ])
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e91e63', '#ff4081', '#4caf50', '#8bc34a', '#9c27b0'],
      })
    }
  }, [selected, question])

  const handleNext = useCallback(() => {
    setSelected(null)
    setRevealed(false)
    setCurrentIndex((i) => i + 1)
  }, [])

  const submitResult = useMutation(api.leaderboard.submitResult)
  const submitted = useRef(false)

  useEffect(() => {
    if (isFinished && answers.length > 0 && !submitted.current) {
      submitted.current = true

      // Compute cluster scores
      const clusterMap = new Map<string, { correct: number; total: number; title: string }>()
      for (const a of answers) {
        const existing = clusterMap.get(a.cluster) ?? { correct: 0, total: 0, title: '' }
        existing.total++
        if (a.correct) existing.correct++
        const info = highRiskClusters.find((c) => c.id === a.cluster)
        existing.title = info?.title ?? a.cluster
        clusterMap.set(a.cluster, existing)
      }

      submitResult({
        name,
        score: scorePercent,
        totalQuestions: total,
        clusterScores: Array.from(clusterMap.entries()).map(([id, data]) => ({
          clusterId: id,
          clusterTitle: data.title,
          correct: data.correct,
          total: data.total,
        })),
      }).catch(() => {
        // Silently fail - results still shown locally
      })
    }
  }, [isFinished, answers, name, scorePercent, total, submitResult])

  useEffect(() => {
    if (isFinished && answers.length > 0) {
      const duration = 1500
      const end = Date.now() + duration
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#e91e63', '#ff4081', '#9c27b0'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4caf50', '#8bc34a', '#ff9800'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [isFinished, answers.length])

  if (isFinished) {
    return (
      <div className="results-screen">
        <div className="results-header">
          <span className="result-emoji">
            {scorePercent >= 80 ? '🏆' : scorePercent >= 60 ? '💪' : '📚'}
          </span>
          <h2 className="headline">Quiz Complete!</h2>
          <p className="subtitle">
            {name}, you scored {score}/{total} ({scorePercent}%)
          </p>
        </div>

        <div className="result-actions" style={{ justifyContent: 'center' }}>
          <Link
            className="button"
            to="/results/$sessionId"
            params={{ sessionId }}
            search={{ name, answers: JSON.stringify(answers) }}
          >
            View detailed results
          </Link>
        </div>
      </div>
    )
  }

  const clusterInfo = highRiskClusters.find((c) => c.id === question.cluster)

  return (
    <div className="quiz-screen">
      {/* Progress header */}
      <div className="quiz-header">
        <p className="eyebrow">{name} · Session {sessionId.slice(0, 8)}</p>
        <div className="quiz-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-label">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="quiz-score-row">
          <span className="score-pill correct-pill">{score} correct</span>
          <span className="score-pill wrong-pill">
            {answers.length - score} wrong
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="quiz-card">
        <div className="quiz-card-meta">
          <span className="category-badge">{clusterInfo?.title ?? question.cluster}</span>
          <span className="chip">{question.category.replace('-', ' ')}</span>
        </div>

        <p className="quiz-prompt">{question.prompt}</p>

        {/* Single image */}
        {question.image && (
          <div className="quiz-image-container">
            <img src={question.image} alt="Quiz visual" className="quiz-image" />
          </div>
        )}

        {/* Image pair (this or that) */}
        {question.images && (
          <div className="quiz-image-pair">
            <button
              type="button"
              className={`quiz-image-side clickable${selected === 'Left' ? ' selected' : ''}${revealed && 'Left' === question.answer ? ' correct' : ''}${revealed && selected === 'Left' && 'Left' !== question.answer ? ' wrong' : ''}`}
              onClick={() => handleSelect('Left')}
              disabled={revealed}
            >
              <span className="image-label">Left</span>
              <img src={question.images[0]} alt="Option A" className="quiz-image" />
            </button>
            <button
              type="button"
              className={`quiz-image-side clickable${selected === 'Right' ? ' selected' : ''}${revealed && 'Right' === question.answer ? ' correct' : ''}${revealed && selected === 'Right' && 'Right' !== question.answer ? ' wrong' : ''}`}
              onClick={() => handleSelect('Right')}
              disabled={revealed}
            >
              <span className="image-label">Right</span>
              <img src={question.images[1]} alt="Option B" className="quiz-image" />
            </button>
          </div>
        )}

        <div className="quiz-options">
          {question.options.map((option) => {
            let cls = 'quiz-option'
            if (selected === option) cls += ' selected'
            if (revealed) {
              if (option === question.answer) cls += ' correct'
              else if (option === selected) cls += ' wrong'
            }
            return (
              <button
                key={option}
                type="button"
                className={cls}
                onClick={() => handleSelect(option)}
                disabled={revealed}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className={`quiz-feedback ${selected === question.answer ? 'feedback-correct' : 'feedback-wrong'}`}
          >
            <strong>
              {selected === question.answer ? 'Correct!' : 'Not quite.'}
            </strong>
            <p>{question.explain}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="quiz-actions">
          {!revealed ? (
            <button
              type="button"
              className="button"
              disabled={!selected}
              onClick={handleConfirm}
            >
              Confirm answer
            </button>
          ) : (
            <button type="button" className="button" onClick={handleNext}>
              {currentIndex + 1 < total ? 'Next question' : 'See results'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/quiz/$sessionId')({
  validateSearch: (search: Record<string, unknown>): QuizSearch => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    mode: search.mode === 'flower-recognise' ? 'flower-recognise' : undefined,
  }),
  component: QuizSessionPage,
})
