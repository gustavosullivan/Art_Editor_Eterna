import type { ChangeEvent } from 'react'

type EditableTextProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  ariaLabel: string
  placeholder?: string
}

export default function EditableText({
  value,
  onChange,
  className = '',
  multiline = false,
  ariaLabel,
  placeholder,
}: EditableTextProps) {
  const sharedProps = {
    className: `editable ${multiline ? 'editable--multiline' : ''} ${className}`.trim(),
    value,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    'aria-label': ariaLabel,
    placeholder,
    spellCheck: true as const,
  }

  if (multiline) {
    return <textarea {...sharedProps} rows={3} />
  }

  return <input type="text" {...sharedProps} />
}
