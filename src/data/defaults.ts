import type { ArtFields, LayoutOption } from '../types'

export const defaultFields: ArtFields = {
  personName: 'Nome da pessoa que veio a falecer',
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
  celebrationDate: 'Data e horário',
  ceremonyPlace: 'Local da cerimônia',
}

export const layoutOptions: LayoutOption[] = [
  {
    id: 'principal',
    name: 'Modelo Principal',
    description: 'Layout oficial São Luiz — cantos, lírios e moldura hexagonal.',
  },
  {
    id: 'setimo',
    name: 'Missa de 7º Dia',
    description: 'Folha de missa — foto arredondada, nome ao lado e dados da cerimônia.',
  },
  {
    id: 'classic',
    name: 'Layout 2 — Clássico',
    description: 'Variação clássica com cantos em curva.',
  },
  {
    id: 'elegant',
    name: 'Layout 3 — Elegante',
    description: 'Foto oval central e tipografia solene.',
  },
  {
    id: 'serene',
    name: 'Layout 4 — Sereno',
    description: 'Faixa superior e foto redonda.',
  },
]
