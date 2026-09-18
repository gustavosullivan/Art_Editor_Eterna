import { useEffect } from 'react'
import { exportPresets, type ExportPreset } from '../exportArt'

type ExportSheetProps = {
  open: boolean
  busy: boolean
  onClose: () => void
  onSelect: (preset: ExportPreset) => void
}

export default function ExportSheet({
  open,
  busy,
  onClose,
  onSelect,
}: ExportSheetProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const previousTouch = document.body.style.touchAction
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width
    const scrollY = window.scrollY

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouch
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, busy, onClose])

  if (!open) return null

  return (
    <div className="export-sheet" role="dialog" aria-modal="true" aria-labelledby="export-sheet-title">
      <button
        type="button"
        className="export-sheet__backdrop"
        aria-label="Fechar"
        onClick={busy ? undefined : onClose}
        disabled={busy}
      />

      <div className="export-sheet__panel">
        <div className="export-sheet__handle" aria-hidden="true" />
        <header className="export-sheet__header">
          <h2 id="export-sheet-title" className="export-sheet__title">
            Baixar arte
          </h2>
          <p className="export-sheet__subtitle">
            Escolha o formato para salvar ou publicar.
          </p>
        </header>

        <div className="export-sheet__options">
          {exportPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`export-sheet__option export-sheet__option--${preset.id}`}
              onClick={() => onSelect(preset.id)}
              disabled={busy}
            >
              <span className="export-sheet__option-icon" aria-hidden="true">
                {preset.id === 'pdf' ? 'PDF' : preset.id === 'instagram' ? 'IG' : 'FB'}
              </span>
              <span className="export-sheet__option-copy">
                <span className="export-sheet__option-title">{preset.title}</span>
                <span className="export-sheet__option-sub">{preset.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="export-sheet__cancel"
          onClick={onClose}
          disabled={busy}
        >
          {busy ? 'Gerando…' : 'Cancelar'}
        </button>
      </div>
    </div>
  )
}
