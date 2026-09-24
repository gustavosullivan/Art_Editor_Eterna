import type { ArtFields, LayoutOption } from '../types'

export const defaultFields: ArtFields = {
  personName: 'Claudina Danielli',
  age: '95 anos',
  birthDate: '30/06/1931',
  deathDate: '28/08/2026',
  wakeText:
    'Início do velório dia 28/08/2026 às 09:00hs na Capela Ametista do Memorial Vera Cruz',
  burialText:
    'Sepultamento dia 28/08/2026 às 16:30 no cemitério de Nossa Senhora das Graças',
  phone: '54 3312.2688',
  website: 'www.lucianocogo.com.br',
  memorialNote: 'Inserir texto',
  celebrationLabel: 'DATA DA CELEBRAÇÃO',
  celebrationDate: 'Data e horário',
  ceremonyLabel: 'LOCAL DA CERIMÔNIA',
  ceremonyPlace: 'Local da cerimônia',
}

export const layoutOptions: LayoutOption[] = [
  {
    id: 'classico7dias',
    name: 'Modelo Clássico de 7 Dias',
    description: '',
  },
  {
    id: 'classico',
    name: 'Modelo Clássico',
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
