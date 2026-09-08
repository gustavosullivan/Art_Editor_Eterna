import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import ArtLayout from '../components/layouts/ArtLayout'
import type { ArtFields, LayoutId, PhotoTransform } from '../types'

type EditorScreenProps = {
  layoutId: LayoutId
  fields: ArtFields
  photoUrl: string | null
  photoTransform: PhotoTransform
  onFieldChange: <K extends keyof ArtFields>(key: K, value: ArtFields[K]) => void
  onPhotoChange: (url: string | null) => void
  onPhotoTransformChange: (transform: PhotoTransform) => void
  onBack: () => void
  onChangeLayout: () => void
}

export default function EditorScreen({
  layoutId,
  fields,
  photoUrl,
  photoTransform,
  onFieldChange,
  onPhotoChange,
  onPhotoTransformChange,
  onBack,
  onChangeLayout,
}: EditorScreenProps) {
  const artRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    const target = artRef.current?.querySelector('.art') as HTMLElement | null
    if (!target || downloading) return

    setDownloading(true)
    target.classList.add('is-exporting')

    try {
      const canvas = await html2canvas(target, {
        backgroundColor: '#fbfbfb',
        scale: Math.min(3, window.devicePixelRatio > 1 ? 2.5 : 2),
        useCORS: true,
        logging: false,
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
        <p className="editor__bar-title">Editar arte</p>
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
          onFieldChange={onFieldChange}
          onPhotoChange={onPhotoChange}
          onPhotoTransformChange={onPhotoTransformChange}
        />
      </div>

      <div className="editor__footer">
        <p className="editor__tip">
          Arraste a foto para posicionar. Use − / + ou o dedo (pinça) para redimensionar.
        </p>
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
