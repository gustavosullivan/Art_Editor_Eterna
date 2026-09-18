import { useEffect, useRef, useState, type ReactNode } from 'react'

type EditorArtFitProps = {
  children: ReactNode
  resetKey?: string | number
}

/**
 * Escala a arte dinamicamente para caber no canvas do editor
 * (mobile/desktop), sem alterar o tamanho natural do .art no export.
 */
export default function EditorArtFit({ children, resetKey }: EditorArtFitProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, width: 0, height: 0 })

  useEffect(() => {
    const outer = outerRef.current
    const measure = measureRef.current
    if (!outer || !measure) return

    const update = () => {
      const availableW = Math.max(outer.clientWidth - 4, 1)
      const availableH = Math.max(outer.clientHeight - 4, 1)
      const art = measure.querySelector('.art') as HTMLElement | null
      const naturalW = Math.max(art?.offsetWidth || measure.scrollWidth, 1)
      const naturalH = Math.max(
        art?.offsetHeight || art?.scrollHeight || measure.scrollHeight,
        1,
      )
      const scale = Math.min(availableW / naturalW, availableH / naturalH, 1)

      setFit({
        scale,
        width: naturalW * scale,
        height: naturalH * scale,
      })
    }

    update()
    const frame = window.requestAnimationFrame(() => {
      update()
      window.requestAnimationFrame(update)
    })
    const fontsReady = document.fonts?.ready?.then(update)
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    observer.observe(measure)
    const art = measure.querySelector('.art')
    if (art) observer.observe(art)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      void fontsReady
    }
  }, [resetKey, children])

  return (
    <div ref={outerRef} className="editor__art-fit">
      <div
        className="editor__art-shell"
        style={{ width: fit.width || undefined, height: fit.height || undefined }}
      >
        <div
          ref={measureRef}
          className="editor__art-measure"
          style={{ transform: `scale(${fit.scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
