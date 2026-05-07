import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { buildTrainingDeck, shuffle } from "../features/quiz/content";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "../lib/ui";

function TrainingDeckPage() {
  const cards = useMemo(() => shuffle(buildTrainingDeck()), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(0);

  const card = cards[currentIndex];
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  const reveal = (choice: string) => {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= cards.length) {
      setCurrentIndex(0);
      setSelected(null);
      setRevealed(false);
      setCompleted(0);
      return;
    }

    setCompleted((value) => value + 1);
    setCurrentIndex((value) => value + 1);
    setSelected(null);
    setRevealed(false);
  };

  if (!card) return null;

  const cardSurfaceTone =
    card.kind === "image-to-name"
      ? "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-strong)_94%,white),color-mix(in_oklab,var(--surface)_88%,white))]"
      : "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-strong)_96%,white),color-mix(in_oklab,var(--surface)_84%,white))]";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <section className={`${cardClass} grid gap-5 ${cardSurfaceTone}`}>
        <div className="flex flex-col gap-3 rounded-[1.4rem] bg-(--surface) p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm leading-6 text-(--text-secondary)">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:min-w-[16rem]">
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-(--text-secondary)">
              <span>{completed} studied</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--surface-strong)">
              <div
                className="h-full rounded-full bg-(--accent-strong) transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <h1 className="font-display text-balance text-xl font-semibold leading-[0.98] tracking-[-0.06em] text-(--text-primary)">
            {card.prompt}
          </h1>
        </div>

        {card.kind === "image-to-name" ? (
          <>
            {card.image && (
              <div className="overflow-hidden rounded-[1.6rem] bg-(--surface) p-2">
                <img
                  src={card.image}
                  alt={card.answer}
                  className="mx-auto aspect-4/5 max-h-80 w-full rounded-[1.2rem] object-contain object-center rouded"
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {card.textOptions?.map((option) => {
                const isSelected = selected === option;
                const isCorrect = option === card.answer;
                const tone =
                  revealed && isCorrect
                    ? "border-[var(--success)] bg-[var(--success-soft)]"
                    : revealed && isSelected
                      ? "border-[var(--danger)] bg-[var(--danger-soft)]"
                      : !revealed && isSelected
                        ? "border-[var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_10%,white)]"
                        : "border-[var(--border-soft)] bg-(--surface)";

                return (
                  <button
                    key={option}
                    type="button"
                    className={`grid w-full gap-3 rounded-[1.4rem] border px-3 py-3 text-left text-[1.08rem] font-semibold leading-8 text-(--text-primary) transition duration-200 ease-out hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--surface-strong) sm:text-[1.18rem] ${tone}`}
                    onClick={() => reveal(option)}
                    disabled={revealed}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {card.imageOptions?.map((option) => {
              const isSelected = selected === option.name;
              const isCorrect = option.name === card.answer;
              const tone =
                revealed && isCorrect
                  ? "border-[var(--success)] bg-[var(--success-soft)]"
                  : revealed && isSelected
                    ? "border-[var(--danger)] bg-[var(--danger-soft)]"
                    : !revealed && isSelected
                      ? "border-[var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_10%,white)]"
                      : "border-[var(--border-soft)] bg-(--surface)";

              return (
                <button
                  key={`${card.id}-${option.name}`}
                  type="button"
                  className={`grid gap-3 rounded-3xl border p-1 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--surface-strong) ${tone}`}
                  onClick={() => reveal(option.name)}
                  disabled={revealed}
                >
                  <img
                    src={option.image}
                    alt={option.name}
                    className="aspect-square max-h-40 w-full rounded-[1.2rem] object-contain object-center sm:aspect-4/5 sm:max-h-[min(16rem,34vh)]"
                  />
                </button>
              );
            })}
          </div>
        )}

        {revealed && (
          <div
            className="rounded-3xl border border-[color:color-mix(in_oklab,var(--border-soft)_88%,white)] px-3 py-3"
            style={{
              background:
                selected === card.answer
                  ? "var(--success-soft)"
                  : "color-mix(in oklab, var(--accent) 10%, white)",
            }}
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Answer
            </p>
            <p className="mt-2 text-[1.08rem] font-semibold leading-8 text-[var(--text-primary)] sm:text-[1.18rem]">
              {selected === card.answer ? "Correct" : `Correct answer: ${card.answer}`}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-primary)]">{card.explain}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className={`${primaryButtonClass} sm:flex-1`}
            disabled={!revealed}
            onClick={handleNext}
          >
            {currentIndex + 1 < cards.length ? "Next card" : "Restart deck"}
          </button>
          <Link className={`${secondaryButtonClass} sm:w-auto`} to="/">
            Back home
          </Link>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/training-deck")({
  component: TrainingDeckPage,
});
