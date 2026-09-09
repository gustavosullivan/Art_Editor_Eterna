export type LayoutId = 'principal' | 'elegant' | 'setimo'

export type ArtFields = {
  personName: string
  age: string
  birthDate: string
  deathDate: string
  wakeText: string
  burialText: string
  phone: string
  website: string
  /** Texto sob o nome (Missa de 7º Dia) */
  memorialNote: string
  /** Data e horário da celebração */
  celebrationDate: string
  /** Local da cerimônia */
  ceremonyPlace: string
}

export type PhotoTransform = {
  x: number
  y: number
  scale: number
}

export const defaultPhotoTransform: PhotoTransform = {
  x: 0,
  y: 0,
  scale: 1,
}

export type ArtState = ArtFields & {
  photoUrl: string | null
  layoutId: LayoutId
  photoTransform: PhotoTransform
}

export type LayoutOption = {
  id: LayoutId
  name: string
  description: string
}
