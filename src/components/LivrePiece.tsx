import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { LivrePieceId, LivrePieceState } from '../livreLayout'

type LivrePieceProps = {
  id: LivrePieceId
  label: string
  piece: LivrePieceState
  selected: boolean
  stretch?: boolean
  onSelect: () => void
  onChange: (next: LivrePieceState) => void
  onRemove: () => void
  onDragActive: (active: boolean) => void
  children: ReactNode
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Bloco do layout criado do zero: toque mostra o contorno,
 * arraste move, "..." ajusta o tamanho do texto.
 * left/top e a escala ficam no elemento, então o download captura o mesmo lugar.
 */
export default function LivrePiece({
  id,
  label,
  piece,
  selected,
  stretch = false,
  onSelect,
  onChange,
  onRemove,
  onDragActive,
  children,
}: LivrePieceProps) {
  const [sizeOpen, setSizeOpen] = useState(false)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    originScale: number
    visual: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    if (!selected) setSizeOpen(false)
  }, [selected])

  function bumpScale(delta: number) {
    const next = Math.round((piece.scale + delta) * 10) / 10
    onChange({ ...piece, scale: clamp(next, 0.6, 2) })
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('button')) return

    const onField = Boolean(target.closest('input, textarea'))
    if (onField && selected) return

    if (onField) event.preventDefault()
    onSelect()

    const art = event.currentTarget.closest('.art') as HTMLElement | null
    const visual = art && art.offsetWidth > 0 ? art.getBoundingClientRect().width / art.offsetWidth : 1

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: piece.x,
      originY: piece.y,
      originScale: piece.scale,
      visual: visual || 1,
      moved: false,
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = (event.clientX - drag.startX) / drag.visual
    const dy = (event.clientY - drag.startY) / drag.visual
    if (!drag.moved && Math.hypot(dx, dy) < 6) return

    if (!drag.moved) {
      drag.moved = true
      onDragActive(true)
    }

    const art = event.currentTarget.closest('.art') as HTMLElement | null
    const limitX = art ? art.offsetWidth * 0.42 : 160
    const limitY = art ? art.offsetHeight * 0.4 : 220

    onChange({
      x: clamp(drag.originX + dx, -limitX, limitX),
      y: clamp(drag.originY + dy, -limitY, limitY),
      scale: drag.originScale,
    })
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (drag.moved) onDragActive(false)
    dragRef.current = null
  }

  return (
    <div
      data-piece={id}
      className={`livre-piece${stretch ? ' livre-piece--stretch' : ''}${selected ? ' is-selected' : ''}`}
      style={{
        left: piece.x,
        top: piece.y,
        ['--char-scale' as string]: piece.scale,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}

      {selected ? (
        <>
          <button
            type="button"
            className="livre-piece__more no-export"
            aria-label={`Tamanho do texto de ${label}`}
            aria-expanded={sizeOpen}
            onClick={(event) => {
              event.stopPropagation()
              setSizeOpen((open) => !open)
            }}
          >
            …
          </button>
          <button
            type="button"
            className="livre-piece__remove no-export"
            aria-label={`Excluir ${label}`}
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
          >
            ×
          </button>
          {sizeOpen ? (
            <div className="livre-piece__size no-export" role="group" aria-label="Tamanho do caractere">
              <button type="button" onClick={() => bumpScale(-0.1)} aria-label="Diminuir texto">
                A−
              </button>
              <span>{Math.round(piece.scale * 100)}%</span>
              <button type="button" onClick={() => bumpScale(0.1)} aria-label="Aumentar texto">
                A+
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
