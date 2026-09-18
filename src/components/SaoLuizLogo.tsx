type SaoLuizLogoProps = {
  compact?: boolean
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}logo-sao-luiz.png?v=3`

export default function SaoLuizLogo({ compact = false, className = '' }: SaoLuizLogoProps) {
  return (
    <div
      className={`brand-logo brand-logo--asset ${compact ? 'brand-logo--compact' : ''} ${className}`.trim()}
      role="img"
      aria-label="São Luiz Funerária"
    >
      <img
        className="brand-logo__img"
        src={logoSrc}
        alt="São Luiz Funerária"
        draggable={false}
      />
    </div>
  )
}
