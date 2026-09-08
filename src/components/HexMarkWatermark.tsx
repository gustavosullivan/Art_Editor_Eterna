import { useId } from 'react'

/** Marca dos hexágonos entrelaçados (padrão São Luiz) */
export default function HexMarkWatermark({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const leftGrad = `hexMarkLeft-${uid}`
  const rightGrad = `hexMarkRight-${uid}`
  const shadow = `hexMarkShadow-${uid}`

  return (
    <svg
      className={`hex-mark ${className}`.trim()}
      viewBox="0 0 120 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={leftGrad} x1="12%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#8fd0f8" />
          <stop offset="40%" stopColor="#4fb0ea" />
          <stop offset="100%" stopColor="#2b93d6" />
        </linearGradient>
        <linearGradient id={rightGrad} x1="12%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#4a78d8" />
          <stop offset="45%" stopColor="#1f52b8" />
          <stop offset="100%" stopColor="#143f9a" />
        </linearGradient>
        <filter id={shadow} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="1.4" dy="2.4" stdDeviation="1.8" floodColor="#0b1b3a" floodOpacity="0.3" />
        </filter>
      </defs>

      <g
        fill="none"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${shadow})`}
      >
        {/* Esquerdo — ciano */}
        <path
          stroke={`url(#${leftGrad})`}
          d="M38 8 L63.98 23 L63.98 53 L38 68 L12.02 53 L12.02 23 Z"
        />

        {/* Direito — azul royal */}
        <path
          stroke={`url(#${rightGrad})`}
          d="M70 8 L95.98 23 L95.98 53 L70 68 L44.02 53 L44.02 23 Z"
        />

        {/* Entrelaçamento: baixo do esquerdo por cima */}
        <path stroke={`url(#${leftGrad})`} d="M63.98 53 L38 68 L12.02 53" />
        {/* Entrelaçamento: lado direito do esquerdo no meio */}
        <path stroke={`url(#${leftGrad})`} d="M63.98 38 L63.98 53" />
        {/* Topo do direito por cima no cruzamento superior */}
        <path stroke={`url(#${rightGrad})`} d="M44.02 23 L70 8 L95.98 23" />
        <path stroke={`url(#${rightGrad})`} d="M44.02 23 L44.02 38" />
      </g>
    </svg>
  )
}
