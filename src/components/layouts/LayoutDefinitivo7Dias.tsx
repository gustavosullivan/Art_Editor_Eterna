import LayoutDefinitivo from './LayoutDefinitivo'
import type { LayoutProps } from './shared'

/**
 * Modelo Definitivo de 7 Dias — mesma folha do definitivo,
 * só o título troca pelo de Missa de Sétimo Dia.
 */
export default function LayoutDefinitivo7Dias(props: LayoutProps) {
  return <LayoutDefinitivo {...props} titleVariant="setimo" />
}
