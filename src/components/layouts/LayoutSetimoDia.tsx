import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import SaoLuizLogo from '../SaoLuizLogo'
import type { LayoutProps } from './shared'
import { defaultPhotoTransform } from '../../types'

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="2.2" fill="currentColor" />
    </svg>
  )
}

/** Folhagem em linha nos cantos navy — estilo da arte São Luiz */
function CornerFlora({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      className={`setimo-flora ${mirror ? 'setimo-flora--mirror' : ''}`}
      viewBox="0 0 240 210"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="rgba(196, 214, 230, 0.62)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M42 178 C58 125 102 72 162 38" />
        <path d="M68 182 C86 132 124 88 172 62" />
        <path d="M30 148 C54 105 96 68 138 50" />
        <path d="M102 58 C114 40 136 26 158 20" />
        <path d="M128 50 C142 34 164 26 184 28" />
        <path d="M82 98 C72 78 62 60 72 44" />
        <path d="M114 90 C126 70 148 56 170 52" />
        <path d="M58 130 C48 110 38 90 48 70" />
        <ellipse cx="156" cy="34" rx="11" ry="17" transform="rotate(-30 156 34)" />
        <ellipse cx="178" cy="50" rx="10" ry="15" transform="rotate(16 178 50)" />
        <ellipse cx="136" cy="56" rx="9" ry="14" transform="rotate(-42 136 56)" />
        <ellipse cx="76" cy="68" rx="8" ry="13" transform="rotate(28 76 68)" />
        <ellipse cx="104" cy="48" rx="9" ry="14" transform="rotate(-12 104 48)" />
        <ellipse cx="188" cy="72" rx="8" ry="13" transform="rotate(40 188 72)" />
        <path d="M158 38 C170 48 182 64 184 82" />
        <path d="M172 62 C184 78 192 98 190 118" />
        <path d="M148 70 C156 82 164 98 162 114" />
      </g>
    </svg>
  )
}

/** Lírios sutis no papel (marca d'água) */
function LilyWatermark() {
  return (
    <svg
      className="setimo-lilies"
      viewBox="0 0 420 520"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <g
        fill="none"
        stroke="var(--setimo-navy)"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.14"
      >
        <path d="M210 420 C205 340 170 280 120 230" />
        <path d="M210 420 C215 340 250 280 300 230" />
        <path d="M210 420 C210 350 210 300 210 250" />
        <path d="M120 230 C95 200 80 165 95 140 C115 155 135 180 145 210 C138 195 125 175 120 230Z" />
        <path d="M300 230 C325 200 340 165 325 140 C305 155 285 180 275 210 C282 195 295 175 300 230Z" />
        <path d="M210 250 C185 210 175 170 195 145 C210 165 225 190 230 225 C220 200 210 180 210 250Z" />
        <path d="M95 140 C88 118 98 95 118 88" />
        <path d="M325 140 C332 118 322 95 302 88" />
        <path d="M195 145 C190 120 205 98 225 95" />
        <ellipse cx="150" cy="300" rx="18" ry="42" transform="rotate(-25 150 300)" />
        <ellipse cx="270" cy="310" rx="18" ry="42" transform="rotate(22 270 310)" />
        <ellipse cx="95" cy="360" rx="14" ry="34" transform="rotate(-40 95 360)" />
        <ellipse cx="325" cy="370" rx="14" ry="34" transform="rotate(38 325 370)" />
      </g>
    </svg>
  )
}

function Ornament() {
  return (
    <div className="setimo-ornament" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  )
}

/**
 * Layout Missa de Sétimo Dia — 100% código, fiel ao modelo de folha.
 */
export default function LayoutSetimoDia({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
}: LayoutProps) {
  return (
    <article className="art art--setimo">
      <LilyWatermark />

      <div className="setimo-corner setimo-corner--tr" aria-hidden="true">
        <CornerFlora />
      </div>
      <div className="setimo-corner setimo-corner--bl" aria-hidden="true">
        <CornerFlora mirror />
      </div>

      <div className="setimo-inner">
        <header className="setimo-header">
          <p className="setimo-header__eyebrow">MISSA DE</p>
          <h2 className="setimo-header__title">Sétimo Dia</h2>
          <Ornament />
        </header>

        <div className="setimo-hero">
          <div className="setimo-hero__photo">
            <PhotoUpload
              photoUrl={photoUrl}
              onChange={onPhotoChange}
              transform={photoTransform}
              onTransformChange={onPhotoTransformChange ?? (() => undefined)}
              variant="rounded"
              preview={preview}
              className="setimo-photo"
            />
          </div>

          <div className="setimo-hero__copy">
            {preview ? (
              <p className="setimo-name">{fields.personName}</p>
            ) : (
              <EditableText
                value={fields.personName}
                onChange={(value) => onFieldChange('personName', value)}
                ariaLabel="Nome da pessoa"
                className="setimo-name setimo-input"
                multiline
                plain
              />
            )}

            <Ornament />

            {preview ? (
              <p className="setimo-note">{fields.memorialNote}</p>
            ) : (
              <EditableText
                value={fields.memorialNote}
                onChange={(value) => onFieldChange('memorialNote', value)}
                ariaLabel="Texto memorial"
                className="setimo-note setimo-input"
                plain
              />
            )}
          </div>
        </div>

        <div className="setimo-cards">
          <div className="setimo-card">
            <span className="setimo-card__icon" aria-hidden="true">
              <ClockIcon />
            </span>
            <div className="setimo-card__body">
              <p className="setimo-card__label">DATA DA CELEBRAÇÃO</p>
              {preview ? (
                <p className="setimo-card__value">{fields.celebrationDate}</p>
              ) : (
                <EditableText
                  value={fields.celebrationDate}
                  onChange={(value) => onFieldChange('celebrationDate', value)}
                  ariaLabel="Data e horário da celebração"
                  className="setimo-card__value setimo-input"
                  plain
                />
              )}
            </div>
          </div>

          <div className="setimo-card">
            <span className="setimo-card__icon" aria-hidden="true">
              <PinIcon />
            </span>
            <div className="setimo-card__body">
              <p className="setimo-card__label">LOCAL DA CERIMÔNIA</p>
              {preview ? (
                <p className="setimo-card__value">{fields.ceremonyPlace}</p>
              ) : (
                <EditableText
                  value={fields.ceremonyPlace}
                  onChange={(value) => onFieldChange('ceremonyPlace', value)}
                  ariaLabel="Local da cerimônia"
                  className="setimo-card__value setimo-input"
                  plain
                />
              )}
            </div>
          </div>
        </div>

        <footer className="setimo-footer">
          <SaoLuizLogo compact />
          <div className="setimo-footer__contact">
            {preview ? (
              <>
                <span>{fields.phone}</span>
                <span className="setimo-footer__dot" aria-hidden="true">
                  •
                </span>
                <span>{fields.website}</span>
              </>
            ) : (
              <>
                <EditableText
                  value={fields.phone}
                  onChange={(value) => onFieldChange('phone', value)}
                  ariaLabel="Telefone"
                  className="setimo-footer__field setimo-input"
                  plain
                />
                <span className="setimo-footer__dot" aria-hidden="true">
                  •
                </span>
                <EditableText
                  value={fields.website}
                  onChange={(value) => onFieldChange('website', value)}
                  ariaLabel="Site"
                  className="setimo-footer__field setimo-input"
                  plain
                />
              </>
            )}
          </div>
        </footer>
      </div>
    </article>
  )
}
