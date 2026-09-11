import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import ArtLayout from '../components/layouts/ArtLayout'
import PreviewFit from '../components/PreviewFit'
import { defaultFields, layoutOptions } from '../data/defaults'
import type { LayoutId } from '../types'

type WelcomeScreenProps = {
  onConfirm: (layoutId: LayoutId) => void
  onBack: () => void
}

function slideOffset(index: number, active: number, total: number) {
  let delta = index - active
  const half = Math.floor(total / 2)
  if (delta > half) delta -= total
  if (delta < -half) delta += total
  return delta
}

export default function WelcomeScreen({ onConfirm, onBack }: WelcomeScreenProps) {
  const [index, setIndex] = useState(0)
  const selected = layoutOptions[index]
  const total = layoutOptions.length
  const swipeRef = useRef<{ x: number; y: number; active: boolean } | null>(null)
  const swipedRef = useRef(false)

  function go(delta: number) {
    setIndex((current) => (current + delta + total) % total)
  }

  function onSwipeStart(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    swipedRef.current = false
    swipeRef.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onSwipeEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start?.active) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.15) return

    swipedRef.current = true
    go(dx < 0 ? 1 : -1)
  }

  function onSlideClick(i: number, offset: number) {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    if (offset !== 0) setIndex(i)
  }

  return (
    <main className="welcome">
      <div className="welcome__atmosphere" aria-hidden="true" />

      <header className="welcome__header">
        <h1 className="welcome__title">Bem-vindo</h1>
        <p className="welcome__subtitle">
          Escolha o layout do convite. O Modelo Principal é o oficial da São Luiz.
        </p>
      </header>

      <section className="carousel" aria-label="Escolha de layout">
        <div className="carousel__stage">
          <button
            type="button"
            className="carousel__nav carousel__nav--prev"
            onClick={() => go(-1)}
            aria-label="Layout anterior"
          >
            ‹
          </button>

          <div className="carousel__card">
            <div
              className="carousel__scene"
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
              onPointerCancel={() => {
                swipeRef.current = null
              }}
            >
              <div className="carousel__track">
                {layoutOptions.map((option, i) => {
                  const offset = slideOffset(i, index, total)
                  const role =
                    offset === 0 ? 'center' : offset < 0 ? 'left' : 'right'
                  const abs = Math.abs(offset)
                  if (abs > 1) return null

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`carousel__slide carousel__slide--${role}`}
                      style={{ '--slide-offset': offset } as CSSProperties}
                      onClick={() => onSlideClick(i, offset)}
                      aria-label={option.name}
                      aria-current={offset === 0 ? 'true' : undefined}
                      tabIndex={offset === 0 ? -1 : 0}
                    >
                      <div className="carousel__slide-face">
                        <PreviewFit resetKey={`${option.id}-${offset === 0}`}>
                          <ArtLayout
                            layoutId={option.id}
                            fields={defaultFields}
                            photoUrl={null}
                            onFieldChange={() => undefined}
                            onPhotoChange={() => undefined}
                            preview
                          />
                        </PreviewFit>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="carousel__meta">
              <p className="carousel__name">{selected.name}</p>
              <p className="carousel__desc">{selected.description}</p>
            </div>
          </div>

          <button
            type="button"
            className="carousel__nav carousel__nav--next"
            onClick={() => go(1)}
            aria-label="Próximo layout"
          >
            ›
          </button>
        </div>

        <div className="carousel__dots" role="tablist" aria-label="Layouts">
          {layoutOptions.map((option, i) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`carousel__dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={option.name}
            />
          ))}
        </div>
      </section>

      <div className="welcome__actions">
        <button type="button" className="link-back" onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="splash__cta welcome__ok"
          onClick={() => onConfirm(selected.id)}
        >
          OK
        </button>
      </div>
    </main>
  )
}
