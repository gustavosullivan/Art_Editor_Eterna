import LayoutClassico from './LayoutClassico'
import type { LayoutProps } from './shared'

/**
 * Modelo Clássico de 7 Dias — cópia do clássico,
 * só o título troca pelo de Missa de Sétimo Dia.
 */
export default function LayoutClassico7Dias(props: LayoutProps) {
  return <LayoutClassico {...props} titleVariant="setimo" />
}
