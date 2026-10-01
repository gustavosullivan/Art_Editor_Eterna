import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import HistoryModal from '../components/HistoryModal'
import ArtLayout from '../components/layouts/ArtLayout'
import PreviewFit from '../components/PreviewFit'
import { defaultFields, definitivoFields, layoutOptions } from '../data/defaults'
import {
  definitivoWatermarkModelo1,
  definitivoWatermarkModelo2,
  watermarkTunes,
} from '../data/watermarks'
import type { ArtHistory, HistoryEntry } from '../history'
import type { Definitivo7Modelo, LayoutId } from '../types'

type WelcomeScreenProps = {
  onConfirm: (layoutId: LayoutId, definitivo7Modelo?: Definitivo7Modelo) => void
  onCreate: () => void
  onBack: () => void
  definitivo7Modelo: Definitivo7Modelo
  onDefinitivo7ModeloChange: (modelo: Definitivo7Modelo) => void
  history: ArtHistory
  onOpenHistory: (entry: HistoryEntry) => void
}

function slideOffset(index: number, active: number, total: number) {
  let delta = index - active
  const half = Math.floor(total / 2)
  if (delta > half) delta -= total
  if (delta < -half) delta += total
  return delta
}

export default function WelcomeScreen({
  onConfirm,
  onCreate,
  onBack,
  definitivo7Modelo,
  onDefinitivo7ModeloChange,
  history,
  onOpenHistory,
}: WelcomeScreenProps) {
  const [index, setIndex] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
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

  function onSwipeMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeRef.current
    if (!start?.active) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      event.preventDefault()
    }
  }

  function onSwipeEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start?.active) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.1) return

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

      <button type="button" className="welcome__history" onClick={() => setHistoryOpen(true)}>
        Histórico
      </button>

      <header className="welcome__header">
        <h1 className="welcome__title">Escolha o layout</h1>
        <p className="welcome__subtitle">Deslize ou use as setas para ver os modelos.</p>
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
              onPointerMove={onSwipeMove}
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
                        <PreviewFit
                          resetKey={`${option.id}-${option.id === 'definitivo7dias' ? definitivo7Modelo : 1}-${offset === 0}`}
                        >
                          <ArtLayout
                            layoutId={option.id}
                            definitivo7Modelo={
                              option.id === 'definitivo7dias' ? definitivo7Modelo : 1
                            }
                            fields={
                              option.id === 'definitivo' || option.id === 'definitivo7dias'
                                ? option.id === 'definitivo7dias' && definitivo7Modelo === 2
                                  ? { ...definitivoFields, memorialNote: '' }
                                  : definitivoFields
                                : defaultFields
                            }
                            photoUrl={null}
                            onFieldChange={() => undefined}
                            onPhotoChange={() => undefined}
                            preview
                            watermark={
                              option.id === 'classico' || option.id === 'classico7dias'
                                ? watermarkTunes[option.id]
                                : option.id === 'definitivo'
                                  ? definitivoWatermarkModelo1
                                  : option.id === 'definitivo7dias'
                                    ? definitivo7Modelo === 2
                                      ? definitivoWatermarkModelo2
                                      : definitivoWatermarkModelo1
                                    : undefined
                            }
                          />
                        </PreviewFit>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              className={`carousel__meta${selected.id === 'definitivo7dias' ? ' carousel__meta--modelos' : ''}`}
            >
              <p className="carousel__name">{selected.name}</p>
              {selected.id === 'definitivo7dias' ? (
                <div className="modelo-switch" role="group" aria-label="Modelo">
                  <span className="modelo-switch__label">Modelo</span>
                  <button
                    type="button"
                    className={`modelo-switch__ball${definitivo7Modelo === 1 ? ' is-active' : ''}`}
                    aria-pressed={definitivo7Modelo === 1}
                    onClick={() => onDefinitivo7ModeloChange(1)}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className={`modelo-switch__ball${definitivo7Modelo === 2 ? ' is-active' : ''}`}
                    aria-pressed={definitivo7Modelo === 2}
                    onClick={() => onDefinitivo7ModeloChange(2)}
                  >
                    2
                  </button>
                </div>
              ) : null}
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
        <button type="button" className="welcome__create" onClick={onCreate}>
          Criar
        </button>
        <button
          type="button"
          className="splash__cta welcome__ok"
          onClick={() =>
            onConfirm(
              selected.id,
              selected.id === 'definitivo7dias' ? definitivo7Modelo : 1,
            )
          }
        >
          OK
        </button>
      </div>

      <HistoryModal
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onOpen={(entry) => {
          setHistoryOpen(false)
          onOpenHistory(entry)
        }}
      />
    </main>
  )
}
