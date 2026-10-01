import HexLogoMark from './HexLogoMark'
import {
  definitivoWatermarkModelo1,
  watermarkTransform,
  type WatermarkTune,
} from '../data/watermarks'

type DefinitivoWatermarkProps = {
  tune?: WatermarkTune
}

export default function DefinitivoWatermark({
  tune = definitivoWatermarkModelo1,
}: DefinitivoWatermarkProps) {
  return (
    <div
      className="definitivo-watermark"
      aria-hidden="true"
      style={{ transform: watermarkTransform(tune) }}
    >
      <HexLogoMark className="definitivo-watermark__img" />
    </div>
  )
}
