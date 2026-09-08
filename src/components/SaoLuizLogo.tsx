type SaoLuizLogoProps = {
  compact?: boolean
  className?: string
}

export default function SaoLuizLogo({ compact = false, className = '' }: SaoLuizLogoProps) {
  return (
    <div
      className={`brand-logo ${compact ? 'brand-logo--compact' : ''} ${className}`.trim()}
      role="img"
      aria-label="São Luiz Funerária"
    >
      <svg
        className="brand-logo__mark"
        viewBox="0 0 90 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M31 6 L56.98 21 L56.98 51 L31 66 L5.02 51 L5.02 21 Z" />
        <path d="M59 6 L84.98 21 L84.98 51 L59 66 L33.02 51 L33.02 21 Z" />
      </svg>

      <div className="brand-logo__text">
        <span className="brand-logo__name">SÃO LUIZ</span>
        <span className="brand-logo__rule" aria-hidden="true" />
        <span className="brand-logo__tag">FUNERÁRIA</span>
      </div>
    </div>
  )
}
