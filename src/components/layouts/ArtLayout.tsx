import LayoutClassico from './LayoutClassico'
import LayoutClassico7Dias from './LayoutClassico7Dias'
import LayoutDefinitivo from './LayoutDefinitivo'
import LayoutDefinitivo7Dias from './LayoutDefinitivo7Dias'
import LayoutLivre from './LayoutLivre'
import LayoutPrincipal from './LayoutPrincipal'
import LayoutSetimoDia from './LayoutSetimoDia'
import type { LayoutId } from '../../types'
import type { LayoutProps } from './shared'

export default function ArtLayout({
  layoutId,
  ...props
}: LayoutProps & { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'definitivo':
      return <LayoutDefinitivo {...props} />
    case 'definitivo7dias':
      return <LayoutDefinitivo7Dias {...props} />
    case 'classico7dias':
      return <LayoutClassico7Dias {...props} />
    case 'classico':
      return <LayoutClassico {...props} />
    case 'setimo':
      return <LayoutSetimoDia {...props} />
    case 'livre':
      return <LayoutLivre {...props} />
    case 'principal':
    default:
      return <LayoutPrincipal {...props} />
  }
}
