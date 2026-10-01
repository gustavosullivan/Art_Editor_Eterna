import type { AssetOffset } from './components/DraggableAsset'
import { defaultLivrePieces, livrePieceIds, type LivrePieces } from './livreLayout'
import {
  defaultClassicoBorder,
  defaultPhotoTransform,
  type ArtFields,
  type ClassicoBorderMode,
  type Definitivo7Modelo,
  type LayoutId,
  type PhotoTransform,
} from './types'

export type HistoryKind = 'setimo' | 'convite'

export type HistoryVisibility = {
  wake: boolean
  burial: boolean
  birth: boolean
  death: boolean
  name: boolean
  age: boolean
  logo: boolean
  title: boolean
  contact: boolean
}

export type HistoryEntry = {
  layoutId: LayoutId
  definitivo7Modelo: Definitivo7Modelo
  fields: ArtFields
  photoUrl: string | null
  photoTransform: PhotoTransform
  logoOffset: AssetOffset
  cardsOffset: AssetOffset
  classicoBorder: ClassicoBorderMode
  visibility: HistoryVisibility
  livrePieces: LivrePieces
  savedAt: number
}

export type ArtHistory = {
  setimo: HistoryEntry | null
  convite: HistoryEntry | null
}

const STORAGE_KEY = 'art-editor.history.v1'

const layoutIds: LayoutId[] = [
  'definitivo7dias',
  'definitivo',
  'classico7dias',
  'classico',
  'principal',
  'setimo',
  'livre',
]

const setimoLayouts: LayoutId[] = ['definitivo7dias', 'classico7dias', 'setimo']
const conviteLayouts: LayoutId[] = ['definitivo', 'classico', 'principal', 'livre']

const fieldKeys: (keyof ArtFields)[] = [
  'personName',
  'age',
  'birthDate',
  'deathDate',
  'wakeText',
  'burialText',
  'phone',
  'website',
  'memorialNote',
  'celebrationLabel',
  'celebrationDate',
  'celebrationTime',
  'ceremonyLabel',
  'ceremonyPlace',
]

const borders: ClassicoBorderMode[] = ['combo', 'navy', 'gold', 'off']

export function historyKindFor(layoutId: LayoutId): HistoryKind | null {
  if (setimoLayouts.includes(layoutId)) return 'setimo'
  if (conviteLayouts.includes(layoutId)) return 'convite'
  return null
}

export function loadHistory(): ArtHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { setimo: null, convite: null }
    const parsed = JSON.parse(raw) as Partial<ArtHistory>
    return {
      setimo: readEntry(parsed.setimo),
      convite: readEntry(parsed.convite),
    }
  } catch {
    return { setimo: null, convite: null }
  }
}

export function saveHistory(current: ArtHistory, kind: HistoryKind, entry: HistoryEntry): ArtHistory {
  const next: ArtHistory = { ...current, [kind]: entry }
  const payload = JSON.stringify(next)
  try {
    localStorage.setItem(STORAGE_KEY, payload)
    return next
  } catch {
    const slim: ArtHistory = {
      setimo: next.setimo ? { ...next.setimo, photoUrl: null } : null,
      convite: next.convite ? { ...next.convite, photoUrl: null } : null,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
      return slim
    } catch {
      return current
    }
  }
}

/** Reduz a foto para caber no armazenamento do navegador (GitHub Pages incluso). */
export async function photoForStorage(url: string | null): Promise<string | null> {
  if (!url) return null
  try {
    const img = await loadImage(url)
    const maxSide = 900
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height))
    const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale))
    const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.72)
  } catch {
    return null
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('foto'))
    img.src = src
  })
}

function readEntry(value: unknown): HistoryEntry | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Partial<HistoryEntry>
  if (!source.layoutId || !layoutIds.includes(source.layoutId)) return null
  const fields = readFields(source.fields)
  if (!fields) return null

  return {
    layoutId: source.layoutId,
    definitivo7Modelo: source.definitivo7Modelo === 2 ? 2 : 1,
    fields,
    photoUrl: typeof source.photoUrl === 'string' && source.photoUrl.startsWith('data:') ? source.photoUrl : null,
    photoTransform: readTransform(source.photoTransform),
    logoOffset: readOffset(source.logoOffset),
    cardsOffset: readOffset(source.cardsOffset),
    classicoBorder: source.classicoBorder && borders.includes(source.classicoBorder) ? source.classicoBorder : defaultClassicoBorder,
    visibility: readVisibility(source.visibility),
    livrePieces: readLivrePieces(source.livrePieces),
    savedAt: typeof source.savedAt === 'number' ? source.savedAt : 0,
  }
}

function readFields(value: unknown): ArtFields | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Record<string, unknown>
  const fields = {} as ArtFields
  for (const key of fieldKeys) {
    fields[key] = typeof source[key] === 'string' ? source[key] : ''
  }
  return fields
}

function readTransform(value: unknown): PhotoTransform {
  if (!value || typeof value !== 'object') return { ...defaultPhotoTransform }
  const source = value as Partial<PhotoTransform>
  return {
    x: numberOr(source.x, 0),
    y: numberOr(source.y, 0),
    scale: numberOr(source.scale, 1),
  }
}

function readOffset(value: unknown): AssetOffset {
  if (!value || typeof value !== 'object') return { x: 0, y: 0 }
  const source = value as Partial<AssetOffset>
  return { x: numberOr(source.x, 0), y: numberOr(source.y, 0) }
}

function readVisibility(value: unknown): HistoryVisibility {
  const source = value && typeof value === 'object' ? (value as Partial<HistoryVisibility>) : {}
  return {
    wake: source.wake !== false,
    burial: source.burial !== false,
    birth: source.birth !== false,
    death: source.death !== false,
    name: source.name !== false,
    age: source.age !== false,
    logo: source.logo !== false,
    title: source.title !== false,
    contact: source.contact !== false,
  }
}

function readLivrePieces(value: unknown): LivrePieces {
  const base = defaultLivrePieces()
  if (!value || typeof value !== 'object') return base
  const source = value as Partial<LivrePieces>
  for (const id of livrePieceIds) {
    const piece = source[id]
    if (!piece) continue
    base[id] = {
      x: numberOr(piece.x, 0),
      y: numberOr(piece.y, 0),
      scale: Math.min(2, Math.max(0.6, numberOr(piece.scale, 1))),
    }
  }
  return base
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}
