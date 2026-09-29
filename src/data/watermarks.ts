export type WatermarkTune = { x: number; y: number; scale: number }

export const watermarkTunes: Record<'classico' | 'classico7dias', WatermarkTune> = {
  classico: { x: 6, y: -98, scale: 1.75 },
  classico7dias: { x: 6, y: -98, scale: 1.75 },
}

export function watermarkTransform(tune: WatermarkTune) {
  return `translate(calc(-50% + ${tune.x}px), calc(-50% + ${tune.y}px)) scale(${tune.scale})`
}
