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
}

export const layoutOptions: LayoutOption[] = [
  {
    id: 'classic',
    name: 'Layout 1 — Clássico',
    description: 'Foto hexagonal, cantos em curva e cartões dourados.',
  },
  {
    id: 'elegant',
    name: 'Layout 2 — Elegante',
    description: 'Foto oval central, moldura fina e tipografia solene.',
  },
  {
    id: 'serene',
    name: 'Layout 3 — Sereno',
    description: 'Faixa superior, foto redonda e blocos limpos.',
  },
]
