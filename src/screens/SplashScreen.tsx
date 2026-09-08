import SaoLuizLogo from '../components/SaoLuizLogo'

type SplashScreenProps = {
  onEnter: () => void
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <main className="splash">
      <div className="splash__atmosphere" aria-hidden="true" />
      <div className="splash__glow" aria-hidden="true" />

      <div className="splash__shell">
        <div className="splash__content">
          <p className="splash__eyebrow">Editor de Artes</p>

          <div className="splash__brand">
            <SaoLuizLogo />
          </div>

          <div className="splash__copy">
            <h1 className="splash__title">Editor de Artes</h1>
            <p className="splash__subtitle">
              Crie artes com a identidade da São Luiz Funerária.
            </p>
          </div>
        </div>

        <div className="splash__actions">
          <button type="button" className="splash__cta" onClick={onEnter}>
            Entrar
          </button>
        </div>
      </div>
    </main>
  )
}
