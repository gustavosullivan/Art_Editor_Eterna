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

        // Moldura: esconde no clone e redesenha no canvas (extremidades fiéis)
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

/** Redesenha a moldura clássica nas extremidades do canvas (export fiel) */
function burnClassicoEdge(canvas: HTMLCanvasElement, art: HTMLElement) {
  const edge = art.querySelector('.classico-edge')
  if (!edge) return canvas

  let mode: 'combo' | 'navy' | 'gold' | null = null
  if (edge.classList.contains('classico-edge--combo')) mode = 'combo'
  else if (edge.classList.contains('classico-edge--navy')) mode = 'navy'
  else if (edge.classList.contains('classico-edge--gold')) mode = 'gold'
  if (!mode) return canvas

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const w = canvas.width
  const h = canvas.height
  const artW = Math.max(1, art.offsetWidth)
  const unit = w / artW
  const navy = '#152a52'
  const gold = '#d4a84a'

  function strokeFrame(color: string, insetCss: number, widthCss: number) {
    const line = Math.max(1, widthCss * unit)
    const inset = insetCss * unit
    ctx!.strokeStyle = color
    ctx!.lineWidth = line
    ctx!.lineJoin = 'miter'
    const half = line / 2
    ctx!.strokeRect(
      inset + half,
      inset + half,
      Math.max(0, w - inset * 2 - line),
      Math.max(0, h - inset * 2 - line),
    )
  }

  ctx.save()
  if (mode === 'combo') {
    strokeFrame(navy, 0, 2.5)
    strokeFrame(gold, 2.5, 2)
  } else if (mode === 'navy') {
    strokeFrame(navy, 0, 3)
  } else {
    strokeFrame(gold, 0, 3)
  }
  ctx.restore()
  return canvas
}

/** Preenche o canvas social no tamanho exato (mesma proporção 4:5 — sem faixa nem corte) */
function fitToSocial(
  source: HTMLCanvasElement,
  w: number,
  h: number,
  bg: string,
) {
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')
  if (!ctx) return source

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  // Proporção já alinhada na captura — escala direto pro pixel size do preset
  ctx.drawImage(source, 0, 0, w, h)
  return out
}

/** Força a arte na proporção do preset social antes de capturar */
async function withSocialAspect<T>(
  target: HTMLElement,
  size: { w: number; h: number },
  run: () => Promise<T>,
): Promise<T> {
  const prev = {
    aspectRatio: target.style.aspectRatio,
    width: target.style.width,
    height: target.style.height,
    maxWidth: target.style.maxWidth,
  }

  const baseW = Math.max(1, Math.round(target.offsetWidth))
  const baseH = Math.max(1, Math.round((baseW * size.h) / size.w))

  target.style.aspectRatio = 'unset'
  target.style.maxWidth = 'none'
  target.style.width = `${baseW}px`
  target.style.height = `${baseH}px`

  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await new Promise((resolve) => setTimeout(resolve, 40))

  try {
    return await run()
  } finally {
    target.style.aspectRatio = prev.aspectRatio
    target.style.width = prev.width
    target.style.height = prev.height
    target.style.maxWidth = prev.maxWidth
  }
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
      // cai no download se o share falhar
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
) {
  const slug = fileSlug(personName) || 'sao-luiz'
  const bg = resolveExportBg(target)

  await withNaturalArtScale(target, async () => {
    if (preset === 'pdf') {
      const source = await captureArt(target, 2)
      burnClassicoEdge(source, target)
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
    await withSocialAspect(target, size, async () => {
      const artW = Math.max(1, target.offsetWidth)
      const artH = Math.max(1, target.offsetHeight)
      // Captura com resolução suficiente pro formato final
      const pixelRatio = Math.min(
        4,
        Math.max(2, Math.ceil(Math.max(size.w / artW, size.h / artH) * 1.05)),
      )
      const source = await captureArt(target, pixelRatio)
      burnClassicoEdge(source, target)
      const social = fitToSocial(source, size.w, size.h, bg)
      const blob = await canvasToBlob(social, 'image/jpeg', 0.92)
      await saveBlob(blob, `homenagem-${slug}-${preset}.jpg`)
    })
  })
}