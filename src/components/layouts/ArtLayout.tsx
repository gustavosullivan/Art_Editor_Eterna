import LayoutClassic from './LayoutClassic'
import LayoutElegant from './LayoutElegant'
import LayoutPrincipal from './LayoutPrincipal'
import LayoutSerene from './LayoutSerene'
import LayoutSetimoDia from './LayoutSetimoDia'
import type { LayoutId } from '../../types'
import type { LayoutProps } from './shared'

export default function ArtLayout({
  layoutId,
  ...props
}: LayoutProps & { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'classic':
      return <LayoutClassic {...props} />
    case 'elegant':
      return <LayoutElegant {...props} />
    case 'serene':
      return <LayoutSerene {...props} />
    case 'setimo':
      return <LayoutSetimoDia {...props} />
    case 'principal':
    default:
      return <LayoutPrincipal {...props} />
  }
}