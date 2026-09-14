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

  // Mede o conteúdo com altura livre (sem scroll interno)
  el.style.height = 'auto'
  el.scrollTop = 0
  const contentH = el.scrollHeight
  const lines = Math.max(1, Math.min(maxRows, Math.ceil((contentH - 1) / lh)))
  el.style.height = `${lines * lh}px`
  el.scrollTop = 0

  return { contentH, maxH, lh, lines }
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

  el.value = next

  let overflow = false
  if (maxRows && el instanceof HTMLTextAreaElement) {
    const { contentH, maxH } = growToContent(el, maxRows)
    // Só bloqueia se precisar de mais linhas do que o máximo
    overflow = contentH > maxH + 1
    el.style.height = previousHeight
    el.scrollTop = 0
  } else {
    overflow =
      el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
  }

  el.value = previous
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
}: EditableTextProps) {
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = fieldRef.current
    if (!el || !multiline || !maxRows || !(el instanceof HTMLTextAreaElement)) return
    growToContent(el, maxRows)
  }, [value, multiline, maxRows])

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const next = event.target.value
    const el = fieldRef.current

    if (clampOverflow && next.length > value.length && el && wouldOverflow(el, next, maxRows)) {
      return
    }

    onChange(next)

    if (maxRows && el instanceof HTMLTextAreaElement) {
      el.value = next
      growToContent(el, maxRows)
    }
  }

  const sharedProps = {
    ref: fieldRef as never,
    className: `${plain ? '' : `editable ${multiline ? 'editable--multiline' : ''}`} ${className}`.trim(),
    value,
    onChange: handleChange,
    'aria-label': ariaLabel,
    placeholder,
    spellCheck: true as const,
  }

  if (multiline) {
    return <textarea {...sharedProps} rows={maxRows ? 1 : 2} wrap="soft" />
  }

  return <input type="text" {...sharedProps} />
}
