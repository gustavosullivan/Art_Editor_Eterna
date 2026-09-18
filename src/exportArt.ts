import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { applyClippedPhotosToClone } from './exportClippedPhoto'

export type ExportPreset = 'pdf' | 'instagram' | 'facebook'

export const exportPresets: {
  id: ExportPreset
  title: string
  subtitle: string
}[] = [
  {
    id: 'pdf',
    title: 'PDF',
    subtitle: 'Arquivo pronto para imprimir, sem borda branca',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    subtitle: '1080 × 1350 · post vertical (4:5)',
  },
  {
    id: 'facebook',
    title: 'Facebook',
    subtitle: '1200 × 1500 · post vertical',
  },
]

const SOCIAL_SIZES: Record<Exclude<ExportPreset, 'pdf'>, { w: number; h: number }> = {
  instagram: { w: 1080, h: 1350 },
  facebook: { w: 1200, h: 1500 },
}

function fileSlug(personName: string) {
  return personName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function resolveExportBg(target: HTMLElement) {
  const paper =
    getComputedStyle(target).backgroundColor ||
    getComputedStyle(target).getPropertyValue('--classico-paper') ||
    '#efeff1'
  return paper && paper !== 'rgba(0, 0, 0, 0)' && paper !== 'transparent'
    ? paper
    : '#efeff1'
}

async function captureArt(target: HTMLElement) {
  const exportBg = resolveExportBg(target)
  const originalFields = Array.from(
    target.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="file"]):not([type="range"]), textarea',
    ),
  )

  target.classList.add('is-exporting')
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await new Promise((resolve) => setTimeout(resolve, 50))

  try {
    return await html2canvas(target, {
      backgroundColor: exportBg,
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      x: 0,
      y: 0,
      width: Math.ceil(target.offsetWidth),
      height: Math.ceil(target.offsetHeight),
      scrollX: 0,
      scrollY: 0,
      onclone: (_clonedDoc, element) => {
        element.classList.add('is-exporting')
        element.style.boxShadow = 'none'
        element.style.margin = '0'
        element.style.outline = 'none'
        element.style.border = 'none'
        element.style.overflow = 'hidden'
        element.style.backgroundColor = exportBg

        applyClippedPhotosToClone(target, element)

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
          .querySelectorAll(
            '.no-export, .photo-frame__tools, .photo-frame__placeholder, .photo-frame__input',
          )
          .forEach((node) => {
            ;(node as HTMLElement).style.display = 'none'
          })
      },
    })
  } finally {
    target.classList.remove('is-exporting')
  }
}

/** Encaixa a arte no tamanho social, preenchendo o fundo com a cor do papel */
function fitToSocial(source: HTMLCanvasElement, w: number, h: number, bg: string) {
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')
  if (!ctx) return source

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const scale = Math.min(w / source.width, h / source.height)
  const dw = source.width * scale
  const dh = source.height * scale
  const dx = (w - dw) / 2
  const dy = (h - dh) / 2
  ctx.drawImage(source, dx, dy, dw, dh)
  return out
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = href
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function saveBlob(blob: Blob, filename: string, title: string) {
  const file = new File([blob], filename, { type: blob.type })

  try {
    if (
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({ files: [file], title })
      return
    }
  } catch (error) {
    // usuário cancelou o share — não cai no fallback
    if (error instanceof DOMException && error.name === 'AbortError') return
  }

  const url = URL.createObjectURL(blob)
  try {
    triggerDownload(url, filename)
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 2500)
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Falha ao gerar imagem'))
      },
      type,
      quality,
    )
  })
}

export async function exportArt(
  target: HTMLElement,
  preset: ExportPreset,
  personName: string,
) {
  const slug = fileSlug(personName) || 'sao-luiz'
  const bg = resolveExportBg(target)
  const source = await captureArt(target)

  if (preset === 'pdf') {
    const w = source.width
    const h = source.height
    const pdf = new jsPDF({
      orientation: h >= w ? 'portrait' : 'landscape',
      unit: 'px',
      format: [w, h],
      hotfixes: ['px_scaling'],
      compress: true,
    })
    const dataUrl = source.toDataURL('image/jpeg', 0.92)
    pdf.addImage(dataUrl, 'JPEG', 0, 0, w, h, undefined, 'FAST')
    const blob = pdf.output('blob')
    await saveBlob(blob, `homenagem-${slug}.pdf`, 'Homenagem São Luiz')
    return
  }

  const size = SOCIAL_SIZES[preset]
  const social = fitToSocial(source, size.w, size.h, bg)
  const blob = await canvasToBlob(social, 'image/jpeg', 0.92)
  await saveBlob(blob, `homenagem-${slug}-${preset}.jpg`, 'Homenagem São Luiz')
}
