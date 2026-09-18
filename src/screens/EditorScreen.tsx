import { useRef, useState } from 'react'
import ArtLayout from '../components/layouts/ArtLayout'
import EditorArtFit from '../components/EditorArtFit'
import ExportSheet from '../components/ExportSheet'
import { layoutOptions } from '../data/defaults'
import { exportArt, type ExportPreset } from '../exportArt'
import type { AssetOffset } from '../components/DraggableAsset'
import type { ArtFields, LayoutId, PhotoTransform } from '../types'

type EditorScreenProps = {
  layoutId: LayoutId
  fields: ArtFields
  photoUrl: string | null
  photoTransform: PhotoTransform
  logoOffset: AssetOffset
  cardsOffset: AssetOffset
  showWakeCard: boolean
  showBurialCard: boolean
  showBirthDate: boolean
  showDeathDate: boolean
  showPersonName: boolean
  showPersonAge: boolean
  showLogo: boolean
  onFieldChange: <K extends keyof ArtFields>(key: K, value: ArtFields[K]) => void
  onPhotoChange: (url: string | null) => void
  onPhotoTransformChange: (transform: PhotoTransform) => void
  onLogoOffsetChange: (offset: AssetOffset) => void
  onCardsOffsetChange: (offset: AssetOffset) => void
  onRemoveWakeCard: () => void
  onRemoveBurialCard: () => void
  onRemoveBirthDate: () => void
  onRemoveDeathDate: () => void
  onRemovePersonName: () => void
  onRemovePersonAge: () => void
  onRemoveLogo: () => void
  onResetEdits: () => void
  onBack: () => void
  onChangeLayout: () => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function EditorScreen({
  layoutId,
  fields,
  photoUrl,
  photoTransform,
  logoOffset,
  cardsOffset,
  showWakeCard,
  showBurialCard,
  showBirthDate,
  showDeathDate,
  showPersonName,
  showPersonAge,
  showLogo,
  onFieldChange,
  onPhotoChange,
  onPhotoTransformChange,
  onLogoOffsetChange,
  onCardsOffsetChange,
  onRemoveWakeCard,
  onRemoveBurialCard,
  onRemoveBirthDate,
  onRemoveDeathDate,
  onRemovePersonName,
  onRemovePersonAge,
  onRemoveLogo,
  onResetEdits,
  onBack,
  onChangeLayout,
}: EditorScreenProps) {
  const artRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    if (photoUrl?.startsWith('blob:')) URL.revokeObjectURL(photoUrl)
    onPhotoChange(url)
    onPhotoTransformChange({ x: 0, y: 0, scale: 1 })
  }

  async function handleExport(preset: ExportPreset) {
    const target = artRef.current?.querySelector('.art') as HTMLElement | null
    if (!target || downloading) return

    setDownloading(true)
    try {
      await exportArt(target, preset, fields.personName)
      setExportOpen(false)
    } catch (error) {
      console.error(error)
      window.alert('Não foi possível baixar a arte. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  const layoutName =
    layoutOptions.find((item) => item.id === layoutId)?.name ?? 'Editar arte'
  const emptyTip =
    layoutId === 'classico7dias'
      ? layoutName
      : 'Toque na moldura para adicionar a foto.'

  return (
    <main className="editor">
      <header className="editor__bar">
        <button type="button" className="editor__bar-btn" onClick={onBack}>
          Voltar
        </button>
        <p className="editor__bar-title">{layoutName}</p>
        <button type="button" className="editor__bar-btn" onClick={onChangeLayout}>
          Layouts
        </button>
      </header>

      <div className="editor__canvas" ref={artRef}>
        <EditorArtFit resetKey={layoutId}>
          <ArtLayout
            layoutId={layoutId}
            fields={fields}
            photoUrl={photoUrl}
            photoTransform={photoTransform}
            logoOffset={logoOffset}
            cardsOffset={cardsOffset}
            onFieldChange={onFieldChange}
            onPhotoChange={onPhotoChange}
            onPhotoTransformChange={onPhotoTransformChange}
            onLogoOffsetChange={onLogoOffsetChange}
            onCardsOffsetChange={onCardsOffsetChange}
            showWakeCard={showWakeCard}
            showBurialCard={showBurialCard}
            showBirthDate={showBirthDate}
            showDeathDate={showDeathDate}
            showPersonName={showPersonName}
            showPersonAge={showPersonAge}
            showLogo={showLogo}
            onRemoveWakeCard={onRemoveWakeCard}
            onRemoveBurialCard={onRemoveBurialCard}
            onRemoveBirthDate={onRemoveBirthDate}
            onRemoveDeathDate={onRemoveDeathDate}
            onRemovePersonName={onRemovePersonName}
            onRemovePersonAge={onRemovePersonAge}
            onRemoveLogo={onRemoveLogo}
          />
        </EditorArtFit>
      </div>

      <div className="editor__footer">
        <div className={`editor__photo-slot${photoUrl ? '' : ' editor__photo-slot--empty'}`}>
          {photoUrl ? (
            <div className="editor__photo-tools">
              <button
                type="button"
                className="editor__tool-btn"
                onClick={() =>
                  onPhotoTransformChange({
                    ...photoTransform,
                    scale: clamp(photoTransform.scale - 0.1, 1, 3),
                  })
                }
                aria-label="Diminuir"
              >
                −
              </button>
              <input
                className="editor__tool-slider"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={photoTransform.scale}
                onChange={(event) =>
                  onPhotoTransformChange({
                    ...photoTransform,
                    scale: Number(event.target.value),
                  })
                }
                aria-label="Zoom da foto"
              />
              <button
                type="button"
                className="editor__tool-btn"
                onClick={() =>
                  onPhotoTransformChange({
                    ...photoTransform,
                    scale: clamp(photoTransform.scale + 0.1, 1, 3),
                  })
                }
                aria-label="Aumentar"
              >
                +
              </button>
              <div className="editor__tool-actions">
                <button type="button" className="editor__tool-link" onClick={() => fileRef.current?.click()}>
                  Trocar
                </button>
                <button
                  type="button"
                  className="editor__tool-link"
                  onClick={() => onPhotoTransformChange({ x: 0, y: 0, scale: 1 })}
                >
                  Centralizar
                </button>
                <button
                  type="button"
                  className="editor__tool-link editor__tool-link--undo"
                  onClick={onResetEdits}
                >
                  Desfazer
                </button>
              </div>
            </div>
          ) : (
            <div className="editor__photo-tools editor__photo-tools--empty">
              <p
                className={`editor__tip${layoutId === 'classico7dias' ? ' editor__tip--title' : ''}`}
              >
                {emptyTip}
              </p>
              <div className="editor__tool-actions">
                <button
                  type="button"
                  className="editor__tool-link editor__tool-link--undo"
                  onClick={onResetEdits}
                >
                  Desfazer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="editor__mobile-dock">
          <button type="button" className="editor__glass-btn" onClick={onBack}>
            Voltar
          </button>
          <button type="button" className="editor__glass-btn" onClick={onResetEdits}>
            Desfazer
          </button>
        </div>

        <input
          ref={fileRef}
          className="photo-frame__input"
          type="file"
          accept="image/*"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <button
          type="button"
          className="editor__download"
          onClick={() => setExportOpen(true)}
          disabled={downloading}
        >
          {downloading ? 'Gerando…' : 'Baixar arte'}
        </button>
      </div>

      <ExportSheet
        open={exportOpen}
        busy={downloading}
        onClose={() => {
          if (!downloading) setExportOpen(false)
        }}
        onSelect={handleExport}
      />
    </main>
  )
}
