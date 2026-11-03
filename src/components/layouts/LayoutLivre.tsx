import EditableText from '../EditableText'
import SaoLuizLogo from '../SaoLuizLogo'
import { officialContact } from '../../data/defaults'
import type { LayoutProps } from './shared'
import { defaultClassicoBorder } from '../../types'

function PhoneIcon() {
  return (
    <svg className="aviso-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
    <svg className="aviso-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
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

/**
 * Layout de aviso — título + conteúdo, logo e contato oficial.
 * Sem blocos soltos: estrutura fixa para não deformar.
 */
export default function LayoutLivre({
  fields,
  onFieldChange,
  preview = false,
  classicoBorder = defaultClassicoBorder,
}: LayoutProps) {
  const website = fields.website || officialContact.website
  const phone = fields.phone || officialContact.phone

  return (
    <article className={`art art--aviso${preview ? ' art--aviso-preview' : ''}`}>
      <div className="aviso-sheet" aria-hidden="true" />

      {!preview && classicoBorder === 'navy' ? (
        <div className="classico-edge classico-edge--navy" aria-hidden="true" />
      ) : null}

      <div className="art__inner aviso-inner">
        <div className="aviso-copy">
          {preview ? (
            <p className="aviso-title">{fields.memorialNote || 'Título'}</p>
          ) : (
            <EditableText
              value={fields.memorialNote}
              onChange={(value) => onFieldChange('memorialNote', value)}
              ariaLabel="Título do aviso"
              placeholder="Título"
              className="aviso-title"
              multiline
              plain
              maxRows={4}
              clampOverflow
              wrapWords
              maxLength={80}
            />
          )}

          {preview ? (
            <p className="aviso-body">{fields.homageText || 'Conteúdo'}</p>
          ) : (
            <EditableText
              value={fields.homageText}
              onChange={(value) => onFieldChange('homageText', value)}
              ariaLabel="Conteúdo do aviso"
              placeholder="Conteúdo"
              className="aviso-body"
              multiline
              plain
              maxRows={15}
              clampOverflow
              wrapWords
              maxLength={150}
            />
          )}
        </div>

        <footer className="aviso-footer">
          <SaoLuizLogo compact className="aviso-logo" />

          <div className="aviso-footer__contact">
            {preview ? (
              <>
                <span className="aviso-footer__item">
                  <MailIcon />
                  <span>{website}</span>
                </span>
                <span className="aviso-footer__sep" aria-hidden="true">
                  |
                </span>
                <span className="aviso-footer__item aviso-footer__item--phone">
                  <PhoneIcon />
                  <span>{phone}</span>
                </span>
              </>
            ) : (
              <>
                <span className="aviso-footer__item">
                  <MailIcon />
                  <EditableText
                    value={website}
                    onChange={(value) => onFieldChange('website', value)}
                    ariaLabel="Site / e-mail"
                    placeholder="Site"
                    className="aviso-footer__field aviso-footer__field--email"
                    plain
                    autoWidth
                  />
                </span>
                <span className="aviso-footer__sep" aria-hidden="true">
                  |
                </span>
                <span className="aviso-footer__item aviso-footer__item--phone">
                  <PhoneIcon />
                  <EditableText
                    value={phone}
                    onChange={(value) => onFieldChange('phone', value)}
                    ariaLabel="Telefone"
                    placeholder="Telefone"
                    className="aviso-footer__field aviso-footer__field--phone"
                    plain
                    autoWidth
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
