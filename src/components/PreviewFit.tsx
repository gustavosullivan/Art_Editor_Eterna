import { useEffect, useRef, useState, type ReactNode } from 'react'

type PreviewFitProps = {
  children: ReactNode
  resetKey?: string | number
}

export default function PreviewFit({ children, resetKey }: PreviewFitProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 0.5, width: 0, height: 0 })

  useEffect(() => {
    const outer = outerRef.current
    const measure = measureRef.current
    if (!outer || !measure) return

    const update = () => {
      const availableW = Math.max(outer.clientWidth - 12, 1)
      const availableH = Math.max(outer.clientHeight - 12, 1)
      const naturalW = Math.max(measure.scrollWidth, 1)
      const naturalH = Math.max(measure.scrollHeight, 1)
      const scale = Math.min(availableW / naturalW, availableH / naturalH, 1)

      setFit({
        scale,
        width: naturalW * scale,
        height: naturalH * scale,
      })
    }

    update()
    const frame = window.requestAnimationFrame(update)
    const fontsReady = document.fonts?.ready?.then(update)
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    observer.observe(measure)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      void fontsReady
    }
  }, [resetKey, children])

  return (
    <div ref={outerRef} className="carousel__preview">
      <div
        className="carousel__preview-shell"
        style={{ width: fit.width || undefined, height: fit.height || undefined }}
      >
        <div
          ref={measureRef}
          className="carousel__preview-fit"
          style={{ transform: `scale(${fit.scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
