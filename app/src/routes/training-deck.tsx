import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { authClient } from '../lib/auth-client'
import { buildTrainingDeck, highRiskClusters, shuffle } from '../features/quiz/content'
import {
  badgeClass,
  cardClass,
  eyebrowClass,
  googleButtonClass,
  mutedPanelClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtitleClass,
} from '../lib/ui'

function TrainingDeckPage() {
  const user = useQuery(api.auth.getCurrentUser)
  const cards = useMemo(() => shuffle(buildTrainingDeck()), [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [completed, setCompleted] = useState(0)

  const card = cards[currentIndex]
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0

  const reveal = (choice: string) => {
    if (revealed) return
    setSelected(choice)
    setRevealed(true)
  }

  const handleNext = () => {
    if (currentIndex + 1 >= cards.length) {
      setCurrentIndex(0)
      setSelected(null)
      setRevealed(false)
      setCompleted(0)
      return
    }

    setCompleted((value) => value + 1)
    setCurrentIndex((value) => value + 1)
    setSelected(null)
    setRevealed(false)
  }

  if (!card) return null

  const clusterInfo = highRiskClusters.find((cluster) => cluster.id === card.cluster)
  const cardModeLabel = card.kind === 'image-to-name' ? 'Image to name' : 'Name to image'
  const cardSurfaceTone =
    card.kind === 'image-to-name'
      ? 'bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-strong)_94%,white),color-mix(in_oklab,var(--surface)_88%,white))]'
      : 'bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-strong)_96%,white),color-mix(in_oklab,var(--surface)_84%,white))]'

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:items-start">
      <aside className="grid gap-4 lg:sticky lg:top-8">
        <section className={`${cardClass} grid gap-5`}>
          <div>
            <p className={eyebrowClass}>Training deck</p>
            <h1 className="font-display mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
              Learn the flowers first.
            </h1>
            <p className={`${subtitleClass} mt-2`}>
              Flashcard mode. No score, no pressure, just recognition practice from the documented flower set.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[var(--text-secondary)]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-[var(--accent-strong)] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <article className={mutedPanelClass}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Mode
              </p>
              <p className="font-display mt-2 text-2xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">{cardModeLabel}</p>
            </article>
            <article className={mutedPanelClass}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Cards studied
              </p>
              <p className="font-display mt-2 text-2xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                {completed}
              </p>
            </article>
          </div>

          <div className="grid gap-3">
            <Link className={secondaryButtonClass} to="/leaderboard">
              View leaderboard
            </Link>
            {user ? (
              <Link className={primaryButtonClass} to="/quiz/$sessionId" params={{ sessionId: `s-${Date.now()}` }} search={{ name: user.name ?? 'Guest', mode: 'flower-recognise' }}>
                Start real quiz
              </Link>
            ) : (
              <button
                className={googleButtonClass}
                type="button"
                onClick={() =>
                  void authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/',
                  })
                }
              >
                <GoogleMark />
                Login for the quiz
              </button>
            )}
          </div>
        </section>
      </aside>

      <section className="relative grid gap-5">
        <div className="pointer-events-none absolute inset-x-8 top-5 hidden h-full rounded-[2rem] border border-[var(--border-soft)] bg-[color:color-mix(in_oklab,var(--surface)_78%,white)] lg:block" />
        <div className="pointer-events-none absolute inset-x-4 top-2 hidden h-full rounded-[2rem] border border-[var(--border-soft)] bg-[color:color-mix(in_oklab,var(--surface)_70%,white)] lg:block" />

        <div className={`${cardClass} relative z-10 grid gap-5 ${cardSurfaceTone}`}>
          <div className="flex flex-wrap gap-2">
          <span className={badgeClass}>{clusterInfo?.title ?? card.cluster}</span>
          <span className={badgeClass}>{card.category.replace('-', ' ')}</span>
          <span className={badgeClass}>Flashcard</span>
          </div>

          <div className="grid gap-5 rounded-[1.8rem] border border-[color:color-mix(in_oklab,var(--border-soft)_90%,white)] bg-[color:color-mix(in_oklab,var(--surface-strong)_96%,white)] p-4 shadow-[0_16px_36px_rgba(63,69,90,0.06)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={eyebrowClass}>Card front</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Study first, then reveal the answer.</p>
              </div>
              <div className="inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-3 font-display text-lg font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {currentIndex + 1}
              </div>
            </div>

            <div className="grid gap-3">
              <p className={eyebrowClass}>Prompt</p>
              <h2 className="font-display text-balance text-[clamp(1.95rem,3.9vw,3rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--text-primary)]">
                {card.prompt}
              </h2>
            </div>

            {card.kind === 'image-to-name' ? (
              <>
                {card.image && (
                  <div className="overflow-hidden rounded-[1.6rem] bg-[var(--surface)] p-3">
                    <img
                      src={card.image}
                      alt={card.answer}
                      className="max-h-[min(24rem,45vh)] w-full rounded-[1.2rem] object-contain"
                    />
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  {card.textOptions?.map((option, index) => {
                    const isSelected = selected === option
                    const isCorrect = option === card.answer
                    const tone =
                      revealed && isCorrect
                        ? 'border-[var(--success)] bg-[var(--success-soft)]'
                        : revealed && isSelected
                          ? 'border-[var(--danger)] bg-[var(--danger-soft)]'
                          : !revealed && isSelected
                            ? 'border-[var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_10%,white)]'
                            : 'border-[var(--border-soft)] bg-[var(--surface)]'

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`grid w-full gap-3 rounded-[1.4rem] border px-4 py-4 text-left text-sm font-semibold leading-6 text-[var(--text-primary)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] ${tone}`}
                        onClick={() => reveal(option)}
                        disabled={revealed}
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-strong)] text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {card.imageOptions?.map((option, index) => {
                  const isSelected = selected === option.name
                  const isCorrect = option.name === card.answer
                  const tone =
                    revealed && isCorrect
                      ? 'border-[var(--success)] bg-[var(--success-soft)]'
                      : revealed && isSelected
                        ? 'border-[var(--danger)] bg-[var(--danger-soft)]'
                        : !revealed && isSelected
                          ? 'border-[var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_10%,white)]'
                          : 'border-[var(--border-soft)] bg-[var(--surface)]'

                  return (
                    <button
                      key={`${card.id}-${option.name}`}
                      type="button"
                      className={`grid gap-3 rounded-[1.5rem] border p-3 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] ${tone}`}
                      onClick={() => reveal(option.name)}
                      disabled={revealed}
                    >
                      <div className="flex items-center justify-between gap-3 px-1 pt-1">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-strong)] text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          Picture {index + 1}
                        </span>
                      </div>
                      <img
                        src={option.image}
                        alt={option.name}
                        className="max-h-[min(16rem,34vh)] w-full rounded-[1.2rem] object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {revealed && (
            <div
              className="rounded-[1.5rem] border border-[color:color-mix(in_oklab,var(--border-soft)_88%,white)] px-4 py-4"
              style={{
                background:
                  selected === card.answer ? 'var(--success-soft)' : 'color-mix(in oklab, var(--accent) 10%, white)',
              }}
            >
              <p className={eyebrowClass}>Card back</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                {selected === card.answer ? 'Correct' : `Correct answer: ${card.answer}`}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-primary)]">{card.explain}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className={`${primaryButtonClass} sm:flex-1`} disabled={!revealed} onClick={handleNext}>
              {currentIndex + 1 < cards.length ? 'Next card' : 'Restart deck'}
            </button>
            <Link className={`${secondaryButtonClass} sm:w-auto`} to="/">
              Back home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export const Route = createFileRoute('/training-deck')({
  component: TrainingDeckPage,
})
