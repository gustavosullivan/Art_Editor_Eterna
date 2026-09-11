type EloLogoProps = {
  className?: string
}

const src = `${import.meta.env.BASE_URL}templates/elo-logo-hd.png`

/**
 * Marca Elo — asset HD da foto (upscale + fundo removido).
 */
export default function EloLogo({ className = '' }: EloLogoProps) {
  return (
    <div
      className={`elo-logo ${className}`.trim()}
      role="img"
      aria-label="Elo Tecnologia"
    >
      <img
        className="elo-logo__img"
        src={src}
        alt=""
        draggable={false}
      />
    </div>
  )
}
