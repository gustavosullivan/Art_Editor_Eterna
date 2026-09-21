import { useLayoutEffect, useRef, type ChangeEvent } from 'react'

type EditableTextProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  ariaLabel: string
  placeholder?: string
  /** Sem a classe global .editable (evita conflito no template) */
  plain?: boolean
  /** Impede digitar além do que cabe no campo (sem scroll) */
  clampOverflow?: boolean
  /** Máximo de linhas visuais (textarea cresce até aqui) */
  maxRows?: number
  /** Input cresce/encolhe na horizontal conforme o texto */
  autoWidth?: boolean
}

function lineHeightPx(el: HTMLElement) {
  const style = getComputedStyle(el)
  const parsed = Number.parseFloat(style.lineHeight)
  if (Number.isFinite(parsed) && style.lineHeight !== 'normal') return parsed
  const fontSize = Number.parseFloat(style.fontSize) || 16
  return fontSize * 1.25
}

function growToContent(el: HTMLTextAreaElement, maxRows: number) {
  const lh = lineHeightPx(el)
  const maxH = lh * maxRows

  el.style.height = 'auto'
  el.scrollTop = 0
  const contentH = el.scrollHeight
  const lines = Math.max(1, Math.min(maxRows, Math.ceil((contentH - 1) / lh)))
  el.style.height = `${lines * lh}px`
  el.scrollTop = 0

  return { contentH, maxH, lh, lines }
}

function growToContentWidth(el: HTMLInputElement) {
  const style = getComputedStyle(el)
  const minW = Number.parseFloat(style.minWidth) || 0
  const maxW = Number.parseFloat(style.maxWidth)
  el.style.width = '0px'
  let next = Math.max(el.scrollWidth + 2, minW || 1)
  if (Number.isFinite(maxW) && maxW > 0) next = Math.min(next, maxW)
  el.style.width = `${next}px`
}

function wouldOverflow(
  el: HTMLInputElement | HTMLTextAreaElement,
  next: string,
  maxRows?: number,
) {
  const previous = el.value
  const selectionStart = el.selectionStart
  const selectionEnd = el.selectionEnd
  const previousHeight = el.style.height
  const previousWidth = el.style.width

  el.value = next

  let overflow = false
  if (maxRows && el instanceof HTMLTextAreaElement) {
    const { contentH, maxH } = growToContent(el, maxRows)
    overflow = contentH > maxH + 1
    el.style.height = previousHeight
    el.scrollTop = 0
  } else {
    overflow =
      el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
  }

  el.value = previous
  el.style.width = previousWidth
  if (selectionStart != null && selectionEnd != null) {
    try {
      el.setSelectionRange(selectionStart, selectionEnd)
    } catch {
      /* ignore */
    }
  }
  return overflow
}

export default function EditableText({
  value,
  onChange,
  className = '',
  multiline = false,
  ariaLabel,
  placeholder,
  plain = false,
  clampOverflow = false,
  maxRows,
  autoWidth = false,
}: EditableTextProps) {
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = fieldRef.current
    if (!el) return
    if (multiline && maxRows && el instanceof HTMLTextAreaElement) {
      growToContent(el, maxRows)
    }
    if (autoWidth && !multiline && el instanceof HTMLInputElement) {
      growToContentWidth(el)
    }
  }, [value, multiline, maxRows, autoWidth])

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const next = event.target.value
    const el = fieldRef.current

    if (
      clampOverflow &&
      !autoWidth &&
      next.length > value.length &&
      el &&
      wouldOverflow(el, next, maxRows)
    ) {
      return
    }

    onChange(next)

    if (maxRows && el instanceof HTMLTextAreaElement) {
      el.value = next
      growToContent(el, maxRows)
    }
    if (autoWidth && el instanceof HTMLInputElement) {
      el.value = next
      growToContentWidth(el)
    }
  }

  const sharedProps = {
    ref: fieldRef as never,
    className: `${plain ? '' : `editable ${multiline ? 'editable--multiline' : ''}`} ${autoWidth ? 'editable--auto-width' : ''} ${className}`.trim(),
    value,
    onChange: handleChange,
    onFocus: () => {
      // Evita scrollIntoView que empurra a arte e corta o topo no editor
      const x = window.scrollX
      const y = window.scrollY
      window.requestAnimationFrame(() => {
        window.scrollTo(x, y)
        const canvas = fieldRef.current?.closest('.editor__canvas')
        if (canvas) canvas.scrollTop = 0
      })
    },
    'aria-label': ariaLabel,
    placeholder,
    spellCheck: true as const,
  }

  if (multiline) {
    return <textarea {...sharedProps} rows={maxRows ? 1 : 2} wrap="soft" />
  }

  return <input type="text" {...sharedProps} />
}
