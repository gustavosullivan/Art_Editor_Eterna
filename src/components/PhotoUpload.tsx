import { useEffect, useId, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { PhotoTransform } from '../types'

type PhotoUploadProps = {
  photoUrl: string | null
  onChange: (url: string | null) => void
  transform: PhotoTransform
  onTransformChange: (transform: PhotoTransform) => void
  variant?: 'hex' | 'oval' | 'circle'
  className?: string
  preview?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function PhotoUpload({
  photoUrl,
  onChange,
  transform,
  onTransformChange,
  variant = 'hex',
  className = '',
  preview = false,
}: PhotoUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef(transform)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)
  const pinchRef = useRef<{
    distance: number
    scale: number
  } | null>(null)

  transformRef.current = transform

  useEffect(() => {
    const node = frameRef.current
    if (!node || preview || !photoUrl) return

    function distance(touches: TouchList) {
      const [a, b] = [touches[0], touches[1]]
      const dx = a.clientX - b.clientX
      const dy = a.clientY - b.clientY
      return Math.hypot(dx, dy)
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        pinchRef.current = {
          distance: distance(event.touches),
          scale: transformRef.current.scale,
        }
        dragRef.current = null
      }
    }

    function onTouchMove(event: TouchEvent) {
      if (event.touches.length !== 2 || !pinchRef.current) return
      event.preventDefault()
      const nextDistance = distance(event.touches)
      const ratio = nextDistance / Math.max(pinchRef.current.distance, 1)
      onTransformChange({
        ...transformRef.current,
        scale: clamp(pinchRef.current.scale * ratio, 1, 3),
      })
    }

    function onTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) pinchRef.current = null
    }

    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', onTouchEnd)
    node.addEventListener('touchcancel', onTouchEnd)

    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', onTouchEnd)
      node.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [photoUrl, preview, onTransformChange])

  function handleFile(file: File | undefined) {
    if (preview || !file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    if (photoUrl?.startsWith('blob:')) URL.revokeObjectURL(photoUrl)
    onChange(url)
    onTransformChange({ x: 0, y: 0, scale: 1.15 })
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (preview || !photoUrl || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    onTransformChange({
      ...transform,
      x: clamp(drag.originX + dx, -140, 140),
      y: clamp(drag.originY + dy, -140, 140),
    })
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  function bumpScale(delta: number) {
    onTransformChange({
      ...transform,
      scale: clamp(transform.scale + delta, 1, 3),
    })
  }

  return (
    <div
      className={`photo-frame photo-frame--${variant} ${preview ? 'photo-frame--preview' : ''} ${className}`.trim()}
    >
      {preview ? (
        <div className="photo-frame__hit photo-frame__hit--static">
          <span className="photo-frame__placeholder">
            <span className="photo-frame__plus" aria-hidden="true">
              +
            </span>
            <span>Foto</span>
          </span>
        </div>
      ) : (
        <>
          <div
            ref={frameRef}
            className={`photo-frame__hit ${photoUrl ? 'photo-frame__hit--photo' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={() => {
              if (!photoUrl) inputRef.current?.click()
            }}
            role={photoUrl ? 'presentation' : 'button'}
            tabIndex={photoUrl ? -1 : 0}
            onKeyDown={(event) => {
              if (!photoUrl && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                inputRef.current?.click()
              }
            }}
            aria-label={photoUrl ? 'Arrastar para posicionar a foto' : 'Adicionar foto'}
          >
            {photoUrl ? (
              <img
                className="photo-frame__img"
                src={photoUrl}
                alt="Foto da homenagem"
                draggable={false}
                style={{
                  transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                }}
              />
            ) : (
              <span className="photo-frame__placeholder">
                <span className="photo-frame__plus" aria-hidden="true">
                  +
                </span>
                <span>Toque para adicionar foto</span>
                <span className="photo-frame__hint">Galeria ou arquivos</span>
              </span>
            )}
          </div>

          <input
            id={inputId}
            ref={inputRef}
            className="photo-frame__input"
            type="file"
            accept="image/*"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          {photoUrl ? (
            <div className="photo-frame__tools no-export">
              <div className="photo-frame__zoom">
                <button
                  type="button"
                  className="photo-frame__tool-btn"
                  onClick={() => bumpScale(-0.12)}
                  aria-label="Diminuir foto"
                >
                  −
                </button>
                <input
                  className="photo-frame__slider"
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={transform.scale}
                  onChange={(event) =>
                    onTransformChange({
                      ...transform,
                      scale: Number(event.target.value),
                    })
                  }
                  aria-label="Redimensionar foto"
                />
                <button
                  type="button"
                  className="photo-frame__tool-btn"
                  onClick={() => bumpScale(0.12)}
                  aria-label="Aumentar foto"
                >
                  +
                </button>
              </div>
              <div className="photo-frame__actions">
                <button
                  type="button"
                  className="photo-frame__change"
                  onClick={() => inputRef.current?.click()}
                >
                  Trocar
                </button>
                <button
                  type="button"
                  className="photo-frame__change"
                  onClick={() => onTransformChange({ x: 0, y: 0, scale: 1.15 })}
                >
                  Centralizar
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
