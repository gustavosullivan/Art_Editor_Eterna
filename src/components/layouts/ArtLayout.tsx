import LayoutElegant from './LayoutElegant'
import LayoutPrincipal from './LayoutPrincipal'
import LayoutSetimoDia from './LayoutSetimoDia'
import type { LayoutId } from '../../types'
import type { LayoutProps } from './shared'

export default function ArtLayout({
  layoutId,
  ...props
}: LayoutProps & { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'elegant':
      return <LayoutElegant {...props} />
    case 'setimo':
      return <LayoutSetimoDia {...props} />
    case 'principal':
    default:
      return <LayoutPrincipal {...props} />
  }
}
