import type { ArtFields, LayoutOption } from '../types'
import { archivedLayoutOptions } from './archivedLayouts'

/** Arte em branco — criar do zero */
export const emptyFields: ArtFields = {
  personName: 'digite o nome',
  age: '',
  birthDate: '',
  deathDate: '',
  wakeText: '',
  burialText: '',
  phone: '(54) 3312-26',
  website: 'www.lucianocogo.com.br',
  memorialNote: '',
  celebrationLabel: '',
  celebrationDate: '',
  celebrationTime: '',
  ceremonyLabel: '',
  ceremonyPlace: '',
}

export const defaultFields: ArtFields = {
  personName: 'digite o nome',
  age: '95 anos',
  birthDate: '30/06/1931',
  deathDate: '28/08/2026',
  wakeText:
    'Início do velório dia 28/08/2026 às 09:00hs na Capela Ametista do Memorial Vera Cruz',
  burialText:
    'Sepultamento dia 28/08/2026 às 16:30 no cemitério de Nossa Senhora das Graças',
  phone: '(54) 3312-26',
  website: 'www.lucianocogo.com.br',
  memorialNote: 'Inserir texto',
  celebrationLabel: 'DATA DA CELEBRAÇÃO',
  celebrationDate: 'Data e horário',
  celebrationTime: '',
  ceremonyLabel: 'LOCAL DA CERIMÔNIA',
  ceremonyPlace: 'Local da cerimônia',
}

/** Campos dos layouts definitivos — local e data começam vazios, com placeholder */
export const definitivoFields: ArtFields = {
  ...defaultFields,
  ceremonyPlace: '',
  celebrationDate: '',
  celebrationTime: '',
}

/** Layouts visíveis na produção (carrossel). Clássicos: ver archivedLayouts.ts */
export const layoutOptions: LayoutOption[] = [
  {
    id: 'definitivo',
    name: 'Modelo Definitivo',
    description: '',
  },
  {
    id: 'definitivo7dias',
    name: 'Modelo Definitivo de 7 Dias',
    description: '',
  },
  {
    id: 'principal',
    name: 'Modelo Principal',
    description: '',
  },
  {
    id: 'setimo',
    name: 'Missa de 7º Dia',
    description: '',
  },
]

/** Produção + arquivos clássicos (histórico / nome no editor). */
export const allLayoutOptions: LayoutOption[] = [
  ...layoutOptions,
  ...archivedLayoutOptions,
]
