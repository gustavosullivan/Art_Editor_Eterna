import { useEffect, useId, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { PhotoTransform } from '../types'
import HexMarkWatermark from './HexMarkWatermark'

type PhotoUploadProps = {
  photoUrl: string | null
  onChange: (url: string | null) => void
  transform: PhotoTransform
  onTransformChange: (transform: PhotoTransform) => void
  variant?: 'hex' | 'hexSoft' | 'oval' | 'circle' | 'rounded' | 'moldura'
  className?: string
  preview?: boolean
  templateSlot?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Hexágono vertical com cantos bem arredondados (outros layouts).
 */
const SOFT_HEX_PATH =
  'M0.50 0.018 C0.575 0.018 0.855 0.155 0.925 0.235 C0.985 0.315 0.985 0.685 0.925 0.765 C0.855 0.845 0.575 0.982 0.50 0.982 C0.425 0.982 0.145 0.845 0.075 0.765 C0.015 0.685 0.015 0.315 0.075 0.235 C0.145 0.155 0.425 0.018 0.50 0.018 Z'

const SOFT_HEX_BORDER =
  'M50 2.2 C57.5 2.2 85.5 18.6 92.5 28.2 C98.5 37.8 98.5 82.2 92.5 91.8 C85.5 101.4 57.5 117.8 50 117.8 C42.5 117.8 14.5 101.4 7.5 91.8 C1.5 82.2 1.5 37.8 7.5 28.2 C14.5 18.6 42.5 2.2 50 2.2 Z'

/**
 * Moldura principal — octógono alongado com TOPO E BASE RETOS
 * (cantos chanfrados suaves), igual à arte oficial.
 */
const MOLDURA_PATH =
  'M0.22 0.028 H0.78 C0.84 0.028 0.90 0.055 0.935 0.11 L0.978 0.20 C0.995 0.24 1 0.28 1 0.32 V0.68 C1 0.72 0.995 0.76 0.978 0.80 L0.935 0.89 C0.90 0.945 0.84 0.972 0.78 0.972 H0.22 C0.16 0.972 0.10 0.945 0.065 0.89 L0.022 0.80 C0.005 0.76 0 0.72 0 0.68 V0.32 C0 0.28 0.005 0.24 0.022 0.20 L0.065 0.11 C0.10 0.055 0.16 0.028 0.22 0.028 Z'

const MOLDURA_BORDER =
  'M22 3.4 H78 C84 3.4 90 6.6 93.5 13.2 L97.8 24 C99.5 28.8 100 33.6 100 38.4 V81.6 C100 86.4 99.5 91.2 97.8 96 L93.5 106.8 C90 113.4 84 116.6 78 116.6 H22 C16 116.6 10 113.4 6.5 106.8 L2.2 96 C0.5 91.2 0 86.4 0 81.6 V38.4 C0 33.6 0.5 28.8 2.2 24 L6.5 13.2 C10 6.6 16 3.4 22 3.4 Z'

export default function PhotoUpload({
  photoUrl,
  onChange,
  transform,
  onTransformChange,
  variant = 'hex',
  className = '',
  preview = false,
  templateSlot = false,
}: PhotoUploadProps) {
  const inputId = useId()
  const clipId = useId().replace(/:/g, '')
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
  const isSoftHex = variant === 'hexSoft'
  const isMoldura = variant === 'moldura'

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
    onTransformChange({ x: 0, y: 0, scale: 1 })
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

  const hitStyle =
    isSoftHex || isMoldura
      ? {
          clipPath: `url(#frame-clip-${clipId})`,
          WebkitClipPath: `url(#frame-clip-${clipId})`,
        }
      : undefined

  const frameBody = (
    <>
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
      ) : isMoldura ? (
        <span className="photo-frame__placeholder photo-frame__placeholder--moldura">
          {!preview ? (
            <span className="photo-frame__plus" aria-hidden="true">
              +
            </span>
          ) : null}
          <span>{preview ? 'Foto' : 'Toque para adicionar foto'}</span>
        </span>
      ) : templateSlot ? (
        <span className="photo-frame__ghost" aria-hidden="true" />
      ) : (
        <>
          {isSoftHex ? null : <HexMarkWatermark className="photo-frame__watermark" />}
          <span className="photo-frame__placeholder">
            {!preview ? (
              <span className="photo-frame__plus" aria-hidden="true">
                +
              </span>
            ) : null}
            <span>{preview ? 'Foto' : 'Toque para adicionar foto'}</span>
            {!preview ? <span className="photo-frame__hint">Galeria ou arquivos</span> : null}
          </span>
        </>
      )}
    </>
  )

  return (
    <div
      className={`photo-frame photo-frame--${variant} ${preview ? 'photo-frame--preview' : ''} ${templateSlot ? 'photo-frame--template' : ''} ${className}`.trim()}
    >
      {isSoftHex || isMoldura ? (
        <svg width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={`frame-clip-${clipId}`} clipPathUnits="objectBoundingBox">
              <path d={isMoldura ? MOLDURA_PATH : SOFT_HEX_PATH} />
            </clipPath>
          </defs>
        </svg>
      ) : null}

      {preview ? (
        <div className="photo-frame__hit photo-frame__hit--static" style={hitStyle}>
          {frameBody}
        </div>
      ) : (
        <>
          <div
            ref={frameRef}
            className={`photo-frame__hit ${photoUrl ? 'photo-frame__hit--photo' : ''}`}
            style={hitStyle}
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
            {frameBody}
          </div>

          <input
            id={inputId}
            ref={inputRef}
            className="photo-frame__input"
            type="file"
            accept="image/*"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          {photoUrl && !templateSlot ? (
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
                  onClick={() => onTransformChange({ x: 0, y: 0, scale: 1 })}
                >
                  Centralizar
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {isSoftHex && !templateSlot ? (
        <svg className="photo-frame__gold-border" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
          <path
            d={SOFT_HEX_BORDER}
            fill="none"
            stroke="#c4a46a"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}

      {isMoldura ? (
        <svg className="photo-frame__gold-border photo-frame__gold-border--moldura" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
          <path
            d={MOLDURA_BORDER}
            fill="none"
            stroke="#c4a46a"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  )
}
