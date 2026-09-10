import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import ArtLayout from '../components/layouts/ArtLayout'
import { layoutOptions } from '../data/defaults'
import { applyClippedPhotosToClone } from '../exportClippedPhoto'
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
  const [downloading, setDownloading] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    if (photoUrl?.startsWith('blob:')) URL.revokeObjectURL(photoUrl)
    onPhotoChange(url)
    onPhotoTransformChange({ x: 0, y: 0, scale: 1 })
  }

  async function handleDownload() {
    const target = artRef.current?.querySelector('.art') as HTMLElement | null
    if (!target || downloading) return

    setDownloading(true)
    target.classList.add('is-exporting')

    // espera o browser aplicar o CSS de exportação
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    await new Promise((resolve) => setTimeout(resolve, 50))

    const originalFields = Array.from(
      target.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="file"]):not([type="range"]), textarea'),
    )

    try {
      const canvas = await html2canvas(target, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (_clonedDoc, element) => {
          element.classList.add('is-exporting')

          // html2canvas ignora clip-path SVG da moldura — foto já recortada
          applyClippedPhotosToClone(target, element)

          // html2canvas falha com <input>/<textarea> — troca por texto estático
          const clonedFields = Array.from(
            element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
              'input:not([type="file"]):not([type="range"]), textarea',
            ),
          )

          clonedFields.forEach((cloneEl, index) => {
            const original = originalFields[index]
            if (!original) return
            const cs = window.getComputedStyle(original)
            const isArea = original.tagName === 'TEXTAREA'
            const replacement = _clonedDoc.createElement(isArea ? 'div' : 'span')
            replacement.className = original.className
            replacement.textContent = original.value

            replacement.style.display = isArea ? 'block' : 'inline-block'
            replacement.style.boxSizing = 'border-box'
            replacement.style.border = 'none'
            replacement.style.background = 'transparent'
            replacement.style.outline = 'none'
            replacement.style.boxShadow = 'none'
            replacement.style.padding = '0'
            replacement.style.margin = '0'
            replacement.style.resize = 'none'
            replacement.style.fontFamily = cs.fontFamily
            replacement.style.fontSize = cs.fontSize
            replacement.style.fontWeight = cs.fontWeight
            replacement.style.fontStyle = cs.fontStyle
            replacement.style.letterSpacing = cs.letterSpacing
            replacement.style.lineHeight = cs.lineHeight
            replacement.style.color = cs.color
            replacement.style.textAlign = cs.textAlign as string
            replacement.style.width = `${original.offsetWidth}px`
            replacement.style.minHeight = `${Math.max(original.offsetHeight, 1)}px`
            replacement.style.whiteSpace = isArea ? 'pre-wrap' : 'pre'
            replacement.style.wordBreak = isArea ? 'break-word' : 'normal'
            replacement.style.overflow = 'hidden'
            replacement.style.verticalAlign = 'baseline'

            cloneEl.replaceWith(replacement)
          })

          element
            .querySelectorAll('.no-export, .photo-frame__tools, .photo-frame__placeholder, .photo-frame__input')
            .forEach((node) => {
              ;(node as HTMLElement).style.display = 'none'
            })
        },
      })

      const slug = fields.personName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()

      const link = document.createElement('a')
      link.download = `homenagem-${slug || 'sao-luiz'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error(error)
      window.alert('Não foi possível baixar a arte. Tente novamente.')
    } finally {
      target.classList.remove('is-exporting')
      setDownloading(false)
    }
  }

  return (
    <main className="editor">
      <header className="editor__bar">
        <button type="button" className="editor__bar-btn" onClick={onBack}>
          Voltar
        </button>
        <p className="editor__bar-title">
          {layoutOptions.find((item) => item.id === layoutId)?.name ?? 'Editar arte'}
        </p>
        <button type="button" className="editor__bar-btn" onClick={onChangeLayout}>
          Layouts
        </button>
      </header>

      <div className="editor__canvas" ref={artRef}>
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
      </div>

      <div className="editor__footer">
        <div className="editor__photo-slot">
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
              <button type="button" className="editor__tool-link" onClick={onResetEdits}>
                Desfazer
              </button>
            </div>
          ) : (
            <div className="editor__photo-tools editor__photo-tools--empty">
              <p className="editor__tip">Toque na moldura para adicionar a foto.</p>
              <button type="button" className="editor__tool-link" onClick={onResetEdits}>
                Desfazer
              </button>
            </div>
          )}
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
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Gerando…' : 'Baixar arte'}
        </button>
      </div>
    </main>
  )
}
