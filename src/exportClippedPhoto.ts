/** Paths viewBox 100×120 — mesmos da PhotoUpload / borda dourada */
export const MOLDURA_BORDER =
  'M22 3.4 H78 C84 3.4 90 6.6 93.5 13.2 L97.8 24 C99.5 28.8 100 33.6 100 38.4 V81.6 C100 86.4 99.5 91.2 97.8 96 L93.5 106.8 C90 113.4 84 116.6 78 116.6 H22 C16 116.6 10 113.4 6.5 106.8 L2.2 96 C0.5 91.2 0 86.4 0 81.6 V38.4 C0 33.6 0.5 28.8 2.2 24 L6.5 13.2 C10 6.6 16 3.4 22 3.4 Z'

export const SOFT_HEX_BORDER =
  'M50 2.2 C57.5 2.2 85.5 18.6 92.5 28.2 C98.5 37.8 98.5 82.2 92.5 91.8 C85.5 101.4 57.5 117.8 50 117.8 C42.5 117.8 14.5 101.4 7.5 91.8 C1.5 82.2 1.5 37.8 7.5 28.2 C14.5 18.6 42.5 2.2 50 2.2 Z'

/** Missa 7º Dia — border-radius 24% do lado menor */
const ROUNDED_RADIUS_RATIO = 0.24

function parseImgTransform(img: HTMLElement): { x: number; y: number; scale: number } {
  const t = img.style.transform || ''
  const translate = t.match(/translate\(([-\d.]+)px\s*,\s*([-\d.]+)px\)/)
  const scaleMatch = t.match(/scale\(([-\d.]+)\)/)
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate ? Number(translate[2]) : 0,
    scale: scaleMatch ? Number(scaleMatch[1]) : 1,
  }
}

function drawPhotoIntoClip(
  ctx: CanvasRenderingContext2D,
  hit: HTMLElement,
  img: HTMLImageElement,
) {
  const w = hit.clientWidth
  const h = hit.clientHeight
  const { x, y, scale } = parseImgTransform(img)
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const cover = Math.max(w / iw, h / ih)
  const dw = iw * cover
  const dh = ih * cover
  const ox = (w - dw) / 2
  const oy = (h - dh) / 2

  ctx.translate(w / 2 + x, h / 2 + y)
  ctx.scale(scale, scale)
  ctx.translate(-w / 2, -h / 2)
  ctx.drawImage(img, ox, oy, dw, dh)
}

/**
 * html2canvas ignora clip-path SVG / border-radius alto.
 * Devolve canvas com a foto já recortada.
 */
export function rasterizeClippedPhoto(
  hit: HTMLElement,
  img: HTMLImageElement,
  mode: 'moldura' | 'hexSoft' | 'rounded',
  pixelRatio = 2,
): HTMLCanvasElement | null {
  const w = hit.clientWidth
  const h = hit.clientHeight
  if (w < 1 || h < 1 || !img.naturalWidth || !img.naturalHeight) return null

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * pixelRatio))
  canvas.height = Math.max(1, Math.round(h * pixelRatio))
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  ctx.save()
  if (mode === 'rounded') {
    const radius = Math.min(w, h) * ROUNDED_RADIUS_RATIO
    ctx.beginPath()
    ctx.roundRect(0, 0, w, h, radius)
    ctx.clip()
  } else {
    const borderPath = mode === 'moldura' ? MOLDURA_BORDER : SOFT_HEX_BORDER
    ctx.scale(w / 100, h / 120)
    ctx.clip(new Path2D(borderPath))
    ctx.scale(100 / w, 120 / h)
  }

  drawPhotoIntoClip(ctx, hit, img)
  ctx.restore()

  return canvas
}

/** Aplica fotos já recortadas no clone do html2canvas */
export function applyClippedPhotosToClone(originalRoot: HTMLElement, clonedRoot: HTMLElement) {
  const selector = '.photo-frame--moldura, .photo-frame--hexSoft, .photo-frame--rounded'
  const originals = Array.from(originalRoot.querySelectorAll<HTMLElement>(selector))
  const clones = Array.from(clonedRoot.querySelectorAll<HTMLElement>(selector))

  originals.forEach((frame, index) => {
    const cloneFrame = clones[index]
    if (!cloneFrame) return

    const hit = frame.querySelector<HTMLElement>('.photo-frame__hit')
    const img = hit?.querySelector<HTMLImageElement>('img.photo-frame__img')
    const cloneHit = cloneFrame.querySelector<HTMLElement>('.photo-frame__hit')
    const cloneImg = cloneHit?.querySelector<HTMLImageElement>('img.photo-frame__img, img')
    if (!hit || !img || !cloneHit || !cloneImg) return

    const mode: 'moldura' | 'hexSoft' | 'rounded' = frame.classList.contains(
      'photo-frame--moldura',
    )
      ? 'moldura'
      : frame.classList.contains('photo-frame--rounded')
        ? 'rounded'
        : 'hexSoft'

    const clipped = rasterizeClippedPhoto(hit, img, mode, 2)
    if (!clipped) return

    clipped.className = cloneImg.className
    clipped.style.position = 'absolute'
    clipped.style.inset = '0'
    clipped.style.width = '100%'
    clipped.style.height = '100%'
    clipped.style.maxWidth = 'none'
    clipped.style.transform = 'none'
    clipped.style.objectFit = 'fill'
    clipped.style.display = 'block'
    clipped.style.borderRadius = mode === 'rounded' ? '24%' : '0'
    clipped.style.zIndex = '2'
    cloneImg.replaceWith(clipped)

    cloneHit.style.clipPath = 'none'
    cloneHit.style.setProperty('-webkit-clip-path', 'none')
    cloneHit.style.overflow = 'hidden'
    if (mode === 'rounded') {
      cloneHit.style.borderRadius = '24%'
    } else {
      cloneHit.style.background = 'transparent'
    }
  })
}
