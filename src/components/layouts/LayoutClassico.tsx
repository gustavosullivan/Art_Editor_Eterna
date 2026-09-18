import EditableText from '../EditableText'
import HexLogoMark from '../HexLogoMark'
import PhotoUpload from '../PhotoUpload'
import SaoLuizLogo from '../SaoLuizLogo'
import {
  DateRow,
  InvitationHeader,
  PersonBlock,
  SetimoTitle,
  type LayoutProps,
} from './shared'
import { defaultPhotoTransform } from '../../types'

export type ClassicoTitleVariant = 'homenagem' | 'setimo'

const asset = (file: string) => `${import.meta.env.BASE_URL}templates/${file}`

function PhoneIcon() {
  return (
    <svg className="classico-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7.2 3.8h2.7l1.2 3.1-1.7 1.1a11.2 11.2 0 0 0 5.6 5.6l1.1-1.7 3.1 1.2v2.7c0 .7-.5 1.3-1.2 1.4A14.6 14.6 0 0 1 5.8 5c.1-.7.7-1.2 1.4-1.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="classico-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4.2 6.8 7.8 6.2 7.8-6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Samambaia decorativa (SVG) */
function FernFrond({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`classico-fern ${className}`.trim()}
      viewBox="0 0 80 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 196 C40 140 40 80 40 18" strokeWidth="1.35" opacity="0.9" />
        <path d="M40 36 C28 30 18 24 10 16" strokeWidth="1.1" />
        <path d="M40 36 C52 30 62 24 70 16" strokeWidth="1.1" />
        <path d="M40 56 C26 50 15 42 6 32" strokeWidth="1.15" />
        <path d="M40 56 C54 50 65 42 74 32" strokeWidth="1.15" />
        <path d="M40 78 C24 72 12 62 4 50" strokeWidth="1.2" />
        <path d="M40 78 C56 72 68 62 76 50" strokeWidth="1.2" />
        <path d="M40 102 C22 96 10 84 3 70" strokeWidth="1.2" />
        <path d="M40 102 C58 96 70 84 77 70" strokeWidth="1.2" />
        <path d="M40 126 C24 120 12 108 5 94" strokeWidth="1.15" />
        <path d="M40 126 C56 120 68 108 75 94" strokeWidth="1.15" />
        <path d="M40 148 C26 143 16 133 8 120" strokeWidth="1.1" />
        <path d="M40 148 C54 143 64 133 72 120" strokeWidth="1.1" />
        <path d="M40 168 C28 164 20 156 14 146" strokeWidth="1" />
        <path d="M40 168 C52 164 60 156 66 146" strokeWidth="1" />
        {/* folhinhas */}
        <path d="M28 34 C22 28 16 22 12 18 C20 24 26 30 28 34Z" fill="currentColor" stroke="none" opacity="0.35" />
        <path d="M52 34 C58 28 64 22 68 18 C60 24 54 30 52 34Z" fill="currentColor" stroke="none" opacity="0.35" />
        <path d="M26 54 C18 46 10 38 8 34 C16 42 24 50 26 54Z" fill="currentColor" stroke="none" opacity="0.32" />
        <path d="M54 54 C62 46 70 38 72 34 C64 42 56 50 54 54Z" fill="currentColor" stroke="none" opacity="0.32" />
        <path d="M24 76 C14 66 6 56 5 52 C13 62 22 72 24 76Z" fill="currentColor" stroke="none" opacity="0.3" />
        <path d="M56 76 C66 66 74 56 75 52 C67 62 58 72 56 76Z" fill="currentColor" stroke="none" opacity="0.3" />
        <path d="M22 100 C12 88 4 76 4 72 C12 84 20 96 22 100Z" fill="currentColor" stroke="none" opacity="0.28" />
        <path d="M58 100 C68 88 76 76 76 72 C68 84 60 96 58 100Z" fill="currentColor" stroke="none" opacity="0.28" />
        <path d="M24 124 C14 112 7 100 6 96 C14 108 22 120 24 124Z" fill="currentColor" stroke="none" opacity="0.25" />
        <path d="M56 124 C66 112 73 100 74 96 C66 108 58 120 56 124Z" fill="currentColor" stroke="none" opacity="0.25" />
      </g>
    </svg>
  )
}

/** Fundo clássico: moldura + lírios + samambaias */
function ClassicoBackdrop() {
  return (
    <div className="classico-backdrop" aria-hidden="true">
      <div className="classico-backdrop__wash" />
      <div className="classico-backdrop__frame" />
      <img
        className="classico-backdrop__lily classico-backdrop__lily--tr"
        src={asset('setimo-flora-tr.png')}
        alt=""
        draggable={false}
      />
      <img
        className="classico-backdrop__lily classico-backdrop__lily--bl"
        src={asset('setimo-lily-left.png')}
        alt=""
        draggable={false}
      />
      <FernFrond className="classico-fern--left" />
      <FernFrond className="classico-fern--right" />
      <FernFrond className="classico-fern--left-soft" />
      <FernFrond className="classico-fern--right-soft" />
    </div>
  )
}

type LayoutClassicoProps = LayoutProps & {
  /** homenagem = clássico; setimo = mesmo layout com título de 7º dia */
  titleVariant?: ClassicoTitleVariant
}

/**
 * Modelo Clássico — título + escrita compartilhados,
 * moldura e cards de data/local iguais ao 7º Dia (sem ícones).
 */
export default function LayoutClassico({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
  showWakeCard = true,
  showBurialCard = true,
  showBirthDate = true,
  showDeathDate = true,
  showLogo = true,
  onRemoveBirthDate,
  onRemoveDeathDate,
  titleVariant = 'homenagem',
}: LayoutClassicoProps) {
  const isSetimoTitle = titleVariant === 'setimo'

  return (
    <article
      className={`art art--classico${isSetimoTitle ? ' art--classico-7dias' : ''}${preview ? ' art--classico-preview' : ''}`}
    >
      <ClassicoBackdrop />

      <div className="classico-watermark" aria-hidden="true">
        <HexLogoMark className="classico-watermark__img" />
      </div>

      <div className="art__inner">
        {isSetimoTitle ? <SetimoTitle /> : <InvitationHeader />}
        <div className="classico-photo">
          <PhotoUpload
            photoUrl={photoUrl}
            onChange={onPhotoChange}
            transform={photoTransform}
            onTransformChange={onPhotoTransformChange ?? (() => undefined)}
            variant="rounded"
            preview={preview}
            className="classico-photo__frame"
          />
        </div>

        <PersonBlock fields={fields} onFieldChange={onFieldChange} preview={preview} />
        <DateRow
          fields={fields}
          onFieldChange={onFieldChange}
          preview={preview}
          showBirthDate={showBirthDate}
          showDeathDate={showDeathDate}
          onRemoveBirthDate={onRemoveBirthDate}
          onRemoveDeathDate={onRemoveDeathDate}
        />

        <div className="classico-cards">
          {showWakeCard ? (
            <div className="classico-card">
              <p className="classico-card__label">DATA DA CELEBRAÇÃO</p>
              {preview ? (
                <p className="classico-card__value">{fields.celebrationDate}</p>
              ) : (
                <EditableText
                  value={fields.celebrationDate}
                  onChange={(value) => onFieldChange('celebrationDate', value)}
                  ariaLabel="Data e horário da celebração"
                  className="classico-card__value"
                  multiline
                  plain
                  maxRows={3}
                  clampOverflow
                />
              )}
            </div>
          ) : null}

          {showBurialCard ? (
            <div className="classico-card">
              <p className="classico-card__label">LOCAL DA CERIMÔNIA</p>
              {preview ? (
                <p className="classico-card__value">{fields.ceremonyPlace}</p>
              ) : (
                <EditableText
                  value={fields.ceremonyPlace}
                  onChange={(value) => onFieldChange('ceremonyPlace', value)}
                  ariaLabel="Local da cerimônia"
                  className="classico-card__value"
                  multiline
                  plain
                  maxRows={3}
                  clampOverflow
                />
              )}
            </div>
          ) : null}
        </div>

        <footer className="classico-footer">
          {showLogo ? <SaoLuizLogo compact className="classico-logo" /> : null}

          <div className="classico-footer__contact">
            {preview ? (
              <>
                <span className="classico-footer__item">
                  <MailIcon />
                  <span>{fields.website}</span>
                </span>
                <span className="classico-footer__item">
                  <PhoneIcon />
                  <span>{fields.phone}</span>
                </span>
              </>
            ) : (
              <>
                <span className="classico-footer__item">
                  <MailIcon />
                  <EditableText
                    value={fields.website}
                    onChange={(value) => onFieldChange('website', value)}
                    ariaLabel="Site / e-mail"
                    className="classico-footer__field"
                    plain
                    clampOverflow
                  />
                </span>
                <span className="classico-footer__item">
                  <PhoneIcon />
                  <EditableText
                    value={fields.phone}
                    onChange={(value) => onFieldChange('phone', value)}
                    ariaLabel="Telefone"
                    className="classico-footer__field"
                    plain
                    clampOverflow
                  />
                </span>
              </>
            )}
          </div>
        </footer>
      </div>
    </article>
  )
}
