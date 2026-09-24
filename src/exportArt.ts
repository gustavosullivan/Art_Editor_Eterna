import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { applyClippedPhotosToClone } from './exportClippedPhoto'
import type { ClassicoBorderMode } from './types'

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
  const style = getComputedStyle(target)
  const fromVar =
    style.getPropertyValue('--classico-paper').trim() ||
    style.getPropertyValue('--setimo-paper').trim() ||
    style.getPropertyValue('--invite-paper').trim()
  if (fromVar) return fromVar

  const paper = style.backgroundColor
  if (paper && paper !== 'rgba(0, 0, 0, 0)' && paper !== 'transparent') return paper

  return '#f7f8fa'
}

/** Tira o scale do editor pra html2canvas medir o tamanho natural da arte */
async function withNaturalArtScale<T>(
  target: HTMLElement,
  run: () => Promise<T>,
): Promise<T> {
  const measure = target.closest('.editor__art-measure') as HTMLElement | null
  const shell = target.closest('.editor__art-shell') as HTMLElement | null
  const prevMeasure = measure?.style.transform ?? ''
  const prevShellW = shell?.style.width ?? ''
  const prevShellH = shell?.style.height ?? ''

  if (measure) measure.style.transform = 'none'
  if (shell) {
    shell.style.width = `${target.offsetWidth}px`
    shell.style.height = `${target.offsetHeight}px`
  }

  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await new Promise((resolve) => setTimeout(resolve, 40))

  try {
    return await run()
  } finally {
    if (measure) measure.style.transform = prevMeasure
    if (shell) {
      shell.style.width = prevShellW
      shell.style.height = prevShellH
    }
  }
}

async function captureArt(target: HTMLElement, pixelRatio: number) {
  const exportBg = resolveExportBg(target)
  const originalFields = Array.from(
    target.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="file"]):not([type="range"]), textarea',
    ),
  )

  const width = Math.max(1, Math.ceil(target.offsetWidth))
  const height = Math.max(1, Math.ceil(target.offsetHeight))
  const artRect = target.getBoundingClientRect()
  const watermarkBoxes = Array.from(
    target.querySelectorAll<HTMLElement>(
      '.classico-watermark, .setimo-watermark, .tpl-watermark',
    ),
  ).map((mark) => {
    const box = mark.getBoundingClientRect()
    return {
      left: box.left - artRect.left,
      top: box.top - artRect.top,
      width: box.width,
      height: box.height,
    }
  })

  target.classList.add('is-exporting')
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await new Promise((resolve) => setTimeout(resolve, 50))

  try {
    return await html2canvas(target, {
      backgroundColor: exportBg,
      scale: pixelRatio,
      useCORS: true,
      logging: false,
      allowTaint: true,
      x: 0,
      y: 0,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
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
        element.style.filter = 'none'
        element.style.width = `${width}px`
        element.style.height = `${height}px`
        element.style.maxWidth = 'none'
        element.style.transform = 'none'

        applyClippedPhotosToClone(target, element)

        element
          .querySelectorAll<HTMLElement>(
            '.classico-watermark, .setimo-watermark, .tpl-watermark',
          )
          .forEach((mark, index) => {
            const box = watermarkBoxes[index]
            if (!box) return
            mark.style.transform = 'none'
            mark.style.left = `${box.left}px`
            mark.style.top = `${box.top}px`
            mark.style.width = `${box.width}px`
            mark.style.height = `${box.height}px`
            mark.style.margin = '0'
          })

        element
          .querySelectorAll<HTMLElement>(
            '.classico-watermark__img, .setimo-watermark__img, .tpl-watermark__img',
          )
          .forEach((img) => {
            img.style.mixBlendMode = 'normal'
            const isClassico = img.classList.contains('classico-watermark__img')
            img.style.filter = isClassico
              ? 'brightness(0.72) sepia(0.9) hue-rotate(185deg) saturate(2.8)'
              : 'none'
            img.style.opacity = isClassico ? '0.26' : '0.11'
          })
        element.querySelectorAll<HTMLElement>('.classico-backdrop__wash').forEach((el) => {
          el.style.opacity = '0'
        })

        // Moldura CSS some na captura — pintamos depois no canvas final
        element.querySelectorAll<HTMLElement>('.classico-edge').forEach((el) => {
          el.style.display = 'none'
        })

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

/**
 * Pinta a moldura no canvas final, alinhada à arte (não à faixa do contain).
 * artRect = área onde a arte foi desenhada dentro do canvas.
 */
function paintClassicoBorder(
  canvas: HTMLCanvasElement,
  mode: ClassicoBorderMode,
  artRect?: { x: number; y: number; w: number; h: number },
) {
  if (mode === 'off') return canvas

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const x0 = artRect?.x ?? 0
  const y0 = artRect?.y ?? 0
  const w = artRect?.w ?? canvas.width
  const h = artRect?.h ?? canvas.height
  const shortSide = Math.min(w, h)
  const outer = Math.max(2, Math.min(4, Math.round(shortSide * 0.0026)))
  const inner = Math.max(1, Math.min(3, outer - 1))
  const navy = '#243656'
  const gold = '#d4a84a'
  const g = ctx

  function drawFrame(color: string, inset: number, thickness: number) {
    if (thickness < 1) return
    const i = Math.max(0, inset)
    const t = thickness
    if (w - i * 2 < t * 2 || h - i * 2 < t * 2) return

    g.fillStyle = color
    g.fillRect(x0 + i, y0 + i, w - i * 2, t)
    g.fillRect(x0 + i, y0 + h - i - t, w - i * 2, t)
    g.fillRect(x0 + i, y0 + i + t, t, h - i * 2 - t * 2)
    g.fillRect(x0 + w - i - t, y0 + i + t, t, h - i * 2 - t * 2)
  }

  if (mode === 'combo') {
    drawFrame(navy, 0, outer)
    drawFrame(gold, outer, inner)
  } else if (mode === 'navy') {
    drawFrame(navy, 0, outer)
  } else {
    drawFrame(gold, 0, outer)
  }

  return canvas
}

/** Encaixa a arte no formato social sem cortar nem distorcer (contain) */
function fitToSocial(
  source: HTMLCanvasElement,
  w: number,
  h: number,
  bg: string,
): { canvas: HTMLCanvasElement; artRect: { x: number; y: number; w: number; h: number } } {
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')
  if (!ctx) {
    return { canvas: source, artRect: { x: 0, y: 0, w: source.width, h: source.height } }
  }

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const scale = Math.min(w / source.width, h / source.height)
  const dw = source.width * scale
  const dh = source.height * scale
  const dx = (w - dw) / 2
  const dy = (h - dh) / 2
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, dx, dy, dw, dh)
  return { canvas: out, artRect: { x: dx, y: dy, w: dw, h: dh } }
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = href
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/** Desktop: download direto. Mobile: share nativo (Salvar imagem), com fallback. */
async function saveBlob(blob: Blob, filename: string) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile && typeof navigator.canShare === 'function') {
    const file = new File([blob], filename, { type: blob.type })
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Homenagem São Luiz' })
        return
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(blob)
  try {
    triggerDownload(url, filename)
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 4000)
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
  classicoBorder: ClassicoBorderMode = 'off',
) {
  const slug = fileSlug(personName) || 'sao-luiz'
  const bg = resolveExportBg(target)

  await withNaturalArtScale(target, async () => {
    if (preset === 'pdf') {
      const source = await captureArt(target, 2)
      paintClassicoBorder(source, classicoBorder)
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
      await saveBlob(blob, `homenagem-${slug}.pdf`)
      return
    }

    const size = SOCIAL_SIZES[preset]
    const artW = Math.max(1, target.offsetWidth)
    const artH = Math.max(1, target.offsetHeight)
    const pixelRatio = Math.min(
      3,
      Math.max(2, Math.ceil(Math.max(size.w / artW, size.h / artH))),
    )
    const source = await captureArt(target, pixelRatio)
    const { canvas: social, artRect } = fitToSocial(source, size.w, size.h, bg)
    paintClassicoBorder(social, classicoBorder, artRect)
    const blob = await canvasToBlob(social, 'image/jpeg', 0.92)
    await saveBlob(blob, `homenagem-${slug}-${preset}.jpg`)
  })
}
