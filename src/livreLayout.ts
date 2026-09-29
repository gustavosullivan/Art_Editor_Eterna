export const livrePieceIds = [
  'title',
  'name',
  'age',
  'birth',
  'death',
  'cardDate',
  'cardPlace',
  'logo',
  'contact',
] as const

export type LivrePieceId = (typeof livrePieceIds)[number]

export type LivrePieceState = {
  x: number
  y: number
  /** Multiplicador do tamanho do texto */
  scale: number
}

export type LivrePieces = Record<LivrePieceId, LivrePieceState>

const idle: LivrePieceState = { x: 0, y: 0, scale: 1 }

export function defaultLivrePieces(): LivrePieces {
  return {
    title: { ...idle },
    name: { ...idle },
    age: { ...idle },
    birth: { ...idle },
    death: { ...idle },
    cardDate: { ...idle },
    cardPlace: { ...idle },
    logo: { ...idle },
    contact: { ...idle },
  }
}
