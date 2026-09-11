import { useState } from 'react'
import DraggableAsset, {
  defaultAssetOffset,
  type AssetOffset,
} from '../components/DraggableAsset'
import EloLogo from '../components/EloLogo'

type SplashScreenProps = {
  onEnter: () => void
}

const PHONE = '54 3312.2688'
const WEBSITE = 'www.lucianocogo.com.br'
const badge = (file: string) => `${import.meta.env.BASE_URL}templates/${file}`

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [eloOffset, setEloOffset] = useState<AssetOffset>(defaultAssetOffset)
  const [contactOffset, setContactOffset] = useState<AssetOffset>(defaultAssetOffset)

  return (
    <main className="splash">
      <div className="splash__atmosphere" aria-hidden="true" />
      <div className="splash__grid" aria-hidden="true" />
      <div className="splash__veil" aria-hidden="true" />
      <div className="splash__glow splash__glow--gold" aria-hidden="true" />
      <div className="splash__glow splash__glow--blue" aria-hidden="true" />
      <div className="splash__spark splash__spark--a" aria-hidden="true" />
      <div className="splash__spark splash__spark--b" aria-hidden="true" />
      <div className="splash__spark splash__spark--c" aria-hidden="true" />

      <div className="splash__frame" aria-hidden="true">
        <span className="splash__corner splash__corner--tl" />
        <span className="splash__corner splash__corner--tr" />
        <span className="splash__corner splash__corner--bl" />
        <span className="splash__corner splash__corner--br" />
      </div>

      <div className="splash__shell">
        <div className="splash__content">
          <div className="splash__hero">
            <p className="splash__kicker">São Luiz Funerária</p>

            <div className="splash__brand-stack">
              <DraggableAsset
                className="splash__elo-drag"
                offset={eloOffset}
                onOffsetChange={setEloOffset}
                clamp={60}
                anchor="start"
              >
                <div className="splash__elo-stage">
                  <EloLogo />
                </div>
              </DraggableAsset>

              <div className="splash__ornament" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>

              <h1 className="splash__title">
                <span className="splash__title-line">Editor</span>
                <span className="splash__title-line splash__title-line--accent">
                  de Artes
                </span>
              </h1>
            </div>

            <p className="splash__credit">
              Desenvolvido por Elo Tecnologia · Sulli Digital Solutions
            </p>
          </div>
        </div>

        <div className="splash__actions">
          <button type="button" className="splash__cta" onClick={onEnter}>
            <span className="splash__cta-label">Entrar</span>
            <span className="splash__cta-shine" aria-hidden="true" />
          </button>

          <DraggableAsset
            className="splash__contact-drag"
            offset={contactOffset}
            onOffsetChange={setContactOffset}
            clamp={40}
            anchor="start"
          >
            <div className="splash__contact" aria-label="Telefone e site">
              <a className="splash__contact-link" href={`tel:+55${PHONE.replace(/\D/g, '')}`}>
                {PHONE}
              </a>
              <span className="splash__contact-dot" aria-hidden="true">
                •
              </span>
              <a
                className="splash__contact-link"
                href={`https://${WEBSITE}`}
                target="_blank"
                rel="noreferrer"
              >
                {WEBSITE}
              </a>
            </div>
          </DraggableAsset>
        </div>
      </div>

      <div className="splash__brand-badges" aria-label="Marcas">
        <img
          className="splash__brand-badge splash__brand-badge--elo"
          src={badge('elo-badge.png?v=3')}
          alt="Elo Tecnologia"
          draggable={false}
        />
        <img
          className="splash__brand-badge splash__brand-badge--sully"
          src={badge('sully-badge.png?v=4')}
          alt="Sully Digital Solutions"
          draggable={false}
        />
      </div>
    </main>
  )
}
