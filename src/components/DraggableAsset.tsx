import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

export type AssetOffset = {
  x: number
  y: number
}

export const defaultAssetOffset: AssetOffset = { x: 0, y: 0 }

type DraggableAssetProps = {
  offset: AssetOffset
  onOffsetChange: (offset: AssetOffset) => void
  disabled?: boolean
  className?: string
  /** Limite do arraste em px (eixo) */
  clamp?: number
  /** `y` = fica centralizado na horizontal, só sobe/desce */
  axis?: 'xy' | 'x' | 'y'
  children: ReactNode
}

function clampValue(value: number, limit: number) {
  return Math.min(limit, Math.max(-limit, value))
}

/**
 * Arrasta o bloco. Ignora clique em input/textarea/botão
 * pra não atrapalhar edição nem o X de excluir.
 */
export default function DraggableAsset({
  offset,
  onOffsetChange,
  disabled = false,
  className = '',
  clamp = 120,
  axis = 'xy',
  children,
}: DraggableAssetProps) {
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)

  const x = axis === 'y' ? 0 : offset.x
  const y = axis === 'x' ? 0 : offset.y

  function isInteractiveTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) return false
    return Boolean(
      target.closest(
        'input, textarea, button, a, [contenteditable="true"], .card-icon-asset__hit, .card-icon-asset__remove, .removable-block__select, .removable-block__remove',
      ),
    )
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0 || isInteractiveTarget(event.target)) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      moved: false,
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) < 3) return
    drag.moved = true

    const nextX = axis === 'y' ? 0 : clampValue(drag.originX + dx, clamp)
    const nextY = axis === 'x' ? 0 : clampValue(drag.originY + dy, clamp)
    onOffsetChange({ x: nextX, y: nextY })
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  return (
    <div
      className={`draggable-asset ${disabled ? '' : 'draggable-asset--active'} ${className}`.trim()}
      style={{
        transform: `translate(calc(-50% + ${x}px), ${y}px)`,
        touchAction: disabled ? undefined : 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  )
}
