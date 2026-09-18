import LayoutClassico from './LayoutClassico'
import LayoutClassico7Dias from './LayoutClassico7Dias'
import LayoutPrincipal from './LayoutPrincipal'
import LayoutSetimoDia from './LayoutSetimoDia'
import type { LayoutId } from '../../types'
import type { LayoutProps } from './shared'

export default function ArtLayout({
  layoutId,
  ...props
}: LayoutProps & { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'classico7dias':
      return <LayoutClassico7Dias {...props} />
    case 'classico':
      return <LayoutClassico {...props} />
    case 'setimo':
      return <LayoutSetimoDia {...props} />
    case 'principal':
    default:
      return <LayoutPrincipal {...props} />
  }
}
