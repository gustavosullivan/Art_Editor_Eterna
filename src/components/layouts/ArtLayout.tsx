import LayoutClassic from './LayoutClassic'
import LayoutElegant from './LayoutElegant'
import LayoutSerene from './LayoutSerene'
import type { LayoutId } from '../../types'
import type { LayoutProps } from './shared'

export default function ArtLayout({
  layoutId,
  ...props
}: LayoutProps & { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'elegant':
      return <LayoutElegant {...props} />
    case 'serene':
      return <LayoutSerene {...props} />
    case 'classic':
    default:
      return <LayoutClassic {...props} />
  }
}
