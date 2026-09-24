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
import { watermarkTransform } from '../../data/watermarks'
import { defaultClassicoBorder, defaultPhotoTransform } from '../../types'

export type ClassicoTitleVariant = 'homenagem' | 'setimo'

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

/** Fundo clássico limpo — só wash suave */
function ClassicoBackdrop() {
  return (
    <div className="classico-backdrop" aria-hidden="true">
      <div className="classico-backdrop__wash" />
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
  classicoBorder = defaultClassicoBorder,
  onRemoveBirthDate,
  onRemoveDeathDate,
  titleVariant = 'homenagem',
  watermark,
}: LayoutClassicoProps) {
  const isSetimoTitle = titleVariant === 'setimo'

  return (
    <article
      className={`art art--classico${isSetimoTitle ? ' art--classico-7dias' : ''}${preview ? ' art--classico-preview' : ''}`}
    >
      <ClassicoBackdrop />

      {!preview && classicoBorder !== 'off' ? (
        <div
          className={`classico-edge classico-edge--${classicoBorder}`}
          aria-hidden="true"
        >
          {classicoBorder === 'combo' ? (
            <span className="classico-edge__inner" />
          ) : null}
        </div>
      ) : null}

      <div
        className="classico-watermark"
        aria-hidden="true"
        style={
          watermark
            ? {
                transform: watermarkTransform(watermark),
              }
            : undefined
        }
      >
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
              {preview ? (
                <p className="classico-card__label">{fields.celebrationLabel}</p>
              ) : (
                <EditableText
                  value={fields.celebrationLabel}
                  onChange={(value) => onFieldChange('celebrationLabel', value)}
                  ariaLabel="Título do card de data"
                  className="classico-card__label"
                  plain
                  clampOverflow
                />
              )}
              {preview ? (
                <p
                  className={`classico-card__value${fields.celebrationDate.length > 18 ? ' classico-card__value--compact' : ''}`}
                >
                  {fields.celebrationDate}
                </p>
              ) : (
                <EditableText
                  value={fields.celebrationDate}
                  onChange={(value) => onFieldChange('celebrationDate', value)}
                  ariaLabel="Data e horário da celebração"
                  className={`classico-card__value${fields.celebrationDate.length > 18 ? ' classico-card__value--compact' : ''}`}
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
              {preview ? (
                <p className="classico-card__label">{fields.ceremonyLabel}</p>
              ) : (
                <EditableText
                  value={fields.ceremonyLabel}
                  onChange={(value) => onFieldChange('ceremonyLabel', value)}
                  ariaLabel="Título do card de local"
                  className="classico-card__label"
                  plain
                  clampOverflow
                />
              )}
              {preview ? (
                <p
                  className={`classico-card__value${fields.ceremonyPlace.length > 18 ? ' classico-card__value--compact' : ''}`}
                >
                  {fields.ceremonyPlace}
                </p>
              ) : (
                <EditableText
                  value={fields.ceremonyPlace}
                  onChange={(value) => onFieldChange('ceremonyPlace', value)}
                  ariaLabel="Local da cerimônia"
                  className={`classico-card__value${fields.ceremonyPlace.length > 18 ? ' classico-card__value--compact' : ''}`}
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
                <span className="classico-footer__sep" aria-hidden="true">
                  |
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
                <span className="classico-footer__sep" aria-hidden="true">
                  |
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
