import { useLayoutEffect, useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

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
  /** Remede a caixa quando o tamanho da letra muda (layout criar) */
  remeasureKey?: string | number
  /** Inclui padding na altura. Usado só nos campos de 3 linhas do definitivo. */
  measurePadding?: boolean
  /** Quebra só no espaço. O textarea nativo parte a palavra no meio. */
  wrapWords?: boolean
}

function lineHeightPx(el: HTMLElement) {
  const style = getComputedStyle(el)
  const parsed = Number.parseFloat(style.lineHeight)
  if (Number.isFinite(parsed) && style.lineHeight !== 'normal') return parsed
  const fontSize = Number.parseFloat(style.fontSize) || 16
  return fontSize * 1.25
}

function verticalExtras(el: HTMLElement) {
  const style = getComputedStyle(el)
  return (
    (Number.parseFloat(style.paddingTop) || 0) +
    (Number.parseFloat(style.paddingBottom) || 0) +
    (Number.parseFloat(style.borderTopWidth) || 0) +
    (Number.parseFloat(style.borderBottomWidth) || 0)
  )
}

function growToContent(el: HTMLElement, maxRows: number, measurePadding = false) {
  const previousMax = el.style.maxHeight
  el.style.maxHeight = 'none'
  const lh = lineHeightPx(el)
  const extras = measurePadding ? verticalExtras(el) : 0
  const maxH = lh * maxRows + extras

  el.style.height = 'auto'
  el.scrollTop = 0
  const contentH = el.scrollHeight
  const lines = Math.max(1, Math.min(maxRows, Math.ceil((contentH - extras - 1) / lh)))
  el.style.height = `${Math.ceil(lines * lh + extras)}px`
  el.style.maxHeight = previousMax
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
  measurePadding = false,
) {
  const previous = el.value
  const selectionStart = el.selectionStart
  const selectionEnd = el.selectionEnd
  const previousHeight = el.style.height
  const previousWidth = el.style.width

  el.value = next

  let overflow = false
  if (maxRows && el instanceof HTMLTextAreaElement) {
    const { contentH, maxH } = growToContent(el, maxRows, measurePadding)
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

function plainText(el: HTMLElement) {
  return (el.textContent ?? '').replace(/\u00a0/g, ' ')
}

function caretOffset(el: HTMLElement) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !el.contains(selection.anchorNode)) return null
  const range = selection.getRangeAt(0)
  const before = range.cloneRange()
  before.selectNodeContents(el)
  before.setEnd(range.endContainer, range.endOffset)
  return before.toString().length
}

function restoreCaret(el: HTMLElement, offset: number) {
  const selection = window.getSelection()
  if (!selection) return
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let remaining = offset
  let node = walker.nextNode()
  while (node) {
    const length = node.textContent?.length ?? 0
    if (remaining <= length) {
      const range = document.createRange()
      range.setStart(node, remaining)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      return
    }
    remaining -= length
    node = walker.nextNode()
  }
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function wouldOverflowBlock(el: HTMLElement, next: string, maxRows: number | undefined, measurePadding: boolean) {
  const previous = el.textContent ?? ''
  const previousHeight = el.style.height
  el.textContent = next
  let overflow = false
  if (maxRows) {
    const { contentH, maxH } = growToContent(el, maxRows, measurePadding)
    overflow = contentH > maxH + 1
    el.style.height = previousHeight
    el.scrollTop = 0
  }
  el.textContent = previous
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
  remeasureKey,
  measurePadding = false,
  wrapWords = false,
}: EditableTextProps) {
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = fieldRef.current
    if (!el) return
    if (wrapWords && el instanceof HTMLDivElement && plainText(el) !== value) {
      const caret = document.activeElement === el ? caretOffset(el) : null
      el.textContent = value
      if (caret != null) restoreCaret(el, Math.min(caret, value.length))
    }
    if (multiline && maxRows && !(el instanceof HTMLInputElement)) {
      growToContent(el, maxRows, measurePadding)
    }
    if (autoWidth && !multiline && el instanceof HTMLInputElement) {
      growToContentWidth(el)
    }
  }, [value, multiline, maxRows, autoWidth, remeasureKey, measurePadding, wrapWords])

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const next = event.target.value
    const el = fieldRef.current

    if (
      clampOverflow &&
      !autoWidth &&
      next.length > value.length &&
      el &&
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
      wouldOverflow(el, next, maxRows, measurePadding)
    ) {
      return
    }

    onChange(next)

    if (maxRows && el instanceof HTMLTextAreaElement) {
      el.value = next
      growToContent(el, maxRows, measurePadding)
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

  function rejectPlainEdit(el: HTMLDivElement, next: string) {
    const caret = caretOffset(el)
    const added = next.length - value.length
    el.textContent = value
    if (caret != null) restoreCaret(el, Math.max(0, caret - added))
  }

  function handlePlainInput() {
    const el = fieldRef.current
    if (!(el instanceof HTMLDivElement)) return
    const next = plainText(el)
    if (
      clampOverflow &&
      !autoWidth &&
      next.length > value.length &&
      wouldOverflowBlock(el, next, maxRows, measurePadding)
    ) {
      rejectPlainEdit(el, next)
      return
    }
    onChange(next)
    if (maxRows) growToContent(el, maxRows, measurePadding)
  }

  function handlePlainPaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain').replace(/\r\n/g, '\n')
    document.execCommand('insertText', false, text)
  }

  function handlePlainKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    document.execCommand('insertText', false, '\n')
  }

  if (wrapWords && multiline) {
    return (
      <div
        ref={fieldRef as never}
        className={sharedProps.className}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        spellCheck
        suppressContentEditableWarning
        onInput={handlePlainInput}
        onPaste={handlePlainPaste}
        onKeyDown={handlePlainKeyDown}
        onFocus={sharedProps.onFocus}
      />
    )
  }

  if (multiline) {
    return <textarea {...sharedProps} rows={maxRows ? 1 : 2} wrap="soft" />
  }

  return <input type="text" {...sharedProps} />
}
