export type WatermarkTune = { x: number; y: number; scale: number }

export const watermarkTunes: Record<'classico' | 'classico7dias', WatermarkTune> = {
  classico: { x: 6, y: -98, scale: 1.75 },
  classico7dias: { x: 6, y: -98, scale: 1.75 },
}

/** Definitivo e definitivo de 7 dias, modelo 1 */
export const definitivoWatermarkModelo1: WatermarkTune = { x: -164, y: -100, scale: 2.8 }

/** Somente o modelo 2 do definitivo de 7 dias */
export const definitivoWatermarkModelo2: WatermarkTune = { x: -101, y: -86, scale: 2.8 }

export function watermarkTransform(tune: WatermarkTune) {
  return `translate(calc(-50% + ${tune.x}px), calc(-50% + ${tune.y}px)) scale(${tune.scale})`
}
