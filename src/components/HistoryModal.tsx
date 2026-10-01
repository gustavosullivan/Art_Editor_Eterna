import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { layoutOptions } from '../data/defaults'
import type { ArtHistory, HistoryEntry } from '../history'

type HistoryModalProps = {
  open: boolean
  history: ArtHistory
  onClose: () => void
  onOpen: (entry: HistoryEntry) => void
}

export default function HistoryModal({ open, history, onClose, onOpen }: HistoryModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-modal-title">
      <button type="button" className="history-modal__backdrop" aria-label="Fechar histórico" onClick={onClose} />
      <div className="history-modal__panel">
        <h2 id="history-modal-title" className="history-modal__title">
          Histórico
        </h2>
        <div className="history-modal__actions">
          <HistoryButton label="7 dias" entry={history.setimo} onOpen={onOpen} />
          <HistoryButton label="Convite" entry={history.convite} onOpen={onOpen} />
        </div>
        <button type="button" className="history-modal__close" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>,
    document.body,
  )
}

function HistoryButton({
  label,
  entry,
  onOpen,
}: {
  label: string
  entry: HistoryEntry | null
  onOpen: (entry: HistoryEntry) => void
}) {
  const detail = entry ? layoutLabel(entry) : 'Nenhum salvo ainda'
  return (
    <button
      type="button"
      className="history-modal__item"
      disabled={!entry}
      onClick={() => {
        if (entry) onOpen(entry)
      }}
    >
      <span className="history-modal__item-label">{label}</span>
      <span className="history-modal__item-detail">{detail}</span>
    </button>
  )
}

function layoutLabel(entry: HistoryEntry) {
  if (entry.layoutId === 'livre') return 'Novo layout'
  if (entry.layoutId === 'definitivo7dias' && entry.definitivo7Modelo === 2) {
    return 'Modelo Definitivo de 7 Dias · 2'
  }
  return layoutOptions.find((item) => item.id === entry.layoutId)?.name ?? 'Layout salvo'
}
