import type { ChangeEvent } from 'react'

type EditableTextProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  ariaLabel: string
  placeholder?: string
  /** Sem a classe global .editable (evita conflito no template) */
  plain?: boolean
}

export default function EditableText({
  value,
  onChange,
  className = '',
  multiline = false,
  ariaLabel,
  placeholder,
  plain = false,
}: EditableTextProps) {
  const sharedProps = {
    className: `${plain ? '' : `editable ${multiline ? 'editable--multiline' : ''}`} ${className}`.trim(),
    value,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    'aria-label': ariaLabel,
    placeholder,
    spellCheck: true as const,
  }

  if (multiline) {
    return <textarea {...sharedProps} rows={2} />
  }

  return <input type="text" {...sharedProps} />
}
