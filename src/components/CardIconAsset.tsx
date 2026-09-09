import { useState, type ReactNode } from 'react'

export type CardIconKind = 'clock' | 'pin' | 'star' | 'cross'

type CardIconAssetProps = {
  kind: CardIconKind
  label: string
  onRemove: () => void
  interactive?: boolean
  tone?: 'card' | 'date'
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7.25V12.1l3.1 2.05"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 20.6s5.35-4.7 5.35-8.9a5.35 5.35 0 1 0-10.7 0c0 4.2 5.35 8.9 5.35 8.9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.1" r="1.85" fill="currentColor" />
    </svg>
  )
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18l.9-5.4L4.2 8.9l5.4-.8L12 3.2Z"
      />
    </svg>
  )
}

function CrossGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3.2v17.6M7.2 8.2h9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

const glyphs: Record<CardIconKind, () => ReactNode> = {
  clock: ClockGlyph,
  pin: PinGlyph,
  star: StarGlyph,
  cross: CrossGlyph,
}

/** Asset de ícone — clique seleciona; X remove o bloco */
export default function CardIconAsset({
  kind,
  label,
  onRemove,
  interactive = true,
  tone = 'card',
}: CardIconAssetProps) {
  const [selected, setSelected] = useState(false)
  const Glyph = glyphs[kind]

  return (
    <span
      className={`card-icon-asset card-icon-asset--${kind} card-icon-asset--${tone} ${selected && interactive ? 'is-selected' : ''}`}
    >
      <span className="card-icon-asset__face" aria-hidden="true">
        <Glyph />
      </span>

      {interactive ? (
        <>
          <button
            type="button"
            className="card-icon-asset__hit no-export"
            aria-label={selected ? `${label} selecionado` : `Selecionar ${label}`}
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation()
              setSelected((current) => !current)
            }}
          />
          {selected ? (
            <button
              type="button"
              className="card-icon-asset__remove no-export"
              aria-label={`Excluir ${label}`}
              onClick={(event) => {
                event.stopPropagation()
                onRemove()
              }}
            >
              ×
            </button>
          ) : null}
        </>
      ) : null}
    </span>
  )
}

type RemovableBlockProps = {
  label: string
  onRemove: () => void
  interactive?: boolean
  className?: string
  children: ReactNode
}

/** Título / idade — toque no canto seleciona; X exclui (inputs continuam editáveis) */
export function RemovableBlock({
  label,
  onRemove,
  interactive = true,
  className = '',
  children,
}: RemovableBlockProps) {
  const [selected, setSelected] = useState(false)

  return (
    <div
      className={`removable-block ${selected && interactive ? 'is-selected' : ''} ${className}`.trim()}
    >
      {children}

      {interactive ? (
        <>
          <button
            type="button"
            className="removable-block__select no-export"
            aria-label={selected ? `${label} selecionado` : `Selecionar ${label}`}
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation()
              setSelected((current) => !current)
            }}
          />
          {selected ? (
            <button
              type="button"
              className="removable-block__remove no-export"
              aria-label={`Excluir ${label}`}
              onClick={(event) => {
                event.stopPropagation()
                onRemove()
              }}
            >
              ×
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
