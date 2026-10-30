import type { LayoutOption } from '../types'

/**
 * Modelos clássicos guardados no código, fora da produção.
 * Os componentes continuam em:
 * - src/components/layouts/LayoutClassico.tsx
 * - src/components/layouts/LayoutClassico7Dias.tsx
 * O ArtLayout ainda renderiza se um histórico antigo abrir esses ids.
 * Para voltar ao carrossel, mova estes itens para `layoutOptions` em defaults.ts.
 */
export const archivedLayoutOptions: LayoutOption[] = [
  {
    id: 'classico7dias',
    name: 'Modelo Clássico de 7 Dias',
    description: 'Arquivado — não aparece na escolha de layout.',
  },
  {
    id: 'classico',
    name: 'Modelo Clássico',
    description: 'Arquivado — não aparece na escolha de layout.',
  },
]

export const archivedLayoutIds = archivedLayoutOptions.map((item) => item.id)
