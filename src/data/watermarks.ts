export type WatermarkTune = { x: number; y: number; scale: number }

export const watermarkMoveLimit = 900
export const watermarkScaleMin = 0.25
export const watermarkScaleMax = 6

export function clampWatermark(tune: WatermarkTune): WatermarkTune {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))
  return {
    x: clamp(Math.round(tune.x), -watermarkMoveLimit, watermarkMoveLimit),
    y: clamp(Math.round(tune.y), -watermarkMoveLimit, watermarkMoveLimit),
    scale: clamp(Number(tune.scale.toFixed(2)), watermarkScaleMin, watermarkScaleMax),
  }
}

export const watermarkTunes: Record<'classico' | 'classico7dias', WatermarkTune> = {
  classico: { x: 6, y: -98, scale: 1.75 },
  classico7dias: { x: 6, y: -98, scale: 1.75 },
}

/** Definitivo, definitivo de 7 dias e o modelo 2 */
export const definitivoWatermarkModelo1: WatermarkTune = { x: -232, y: 0, scale: 3.9 }

/** Modelo 2 do definitivo de 7 dias — mesma marca dos outros definitivos */
export const definitivoWatermarkModelo2: WatermarkTune = { x: -232, y: 0, scale: 3.9 }

export function watermarkTransform(tune: WatermarkTune) {
  return `translate(calc(-50% + ${tune.x}px), calc(-50% + ${tune.y}px)) scale(${tune.scale})`
}
