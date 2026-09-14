const src = `${import.meta.env.BASE_URL}templates/hex-logo-mark.png`

type HexLogoMarkProps = {
  className?: string
}

/** Marca dos hexágonos entrelaçados — asset de fundo. */
export default function HexLogoMark({ className = '' }: HexLogoMarkProps) {
  return (
    <img
      className={`hex-logo-mark ${className}`.trim()}
      src={src}
      alt=""
      draggable={false}
    />
  )
}
