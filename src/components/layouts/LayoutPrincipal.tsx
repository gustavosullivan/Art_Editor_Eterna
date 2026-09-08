import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import type { LayoutProps } from './shared'
import { defaultPhotoTransform } from '../../types'

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18l.9-5.4L4.2 8.9l5.4-.8L12 3.2Z"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3v18M7 8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

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

/**
 * Modelo Principal idêntico ao PNG oficial.
 * Cantos, flora em relevo, hex azul e moldura dourada vêm do asset.
 * Por cima: foto com máscara oficial + inputs.
 */
export default function LayoutPrincipal({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
}: LayoutProps) {
  const templateSrc = `${import.meta.env.BASE_URL}templates/convite-principal.png`

  if (preview) {
    return (
      <article className="art art--principal art--principal-preview">
        <img
          className="art__template"
          src={templateSrc}
          alt="Modelo Principal São Luiz"
          draggable={false}
        />
      </article>
    )
  }

  return (
    <article className="art art--principal">
      <img className="art__template" src={templateSrc} alt="" draggable={false} />

      {/* Branco só em volta da moldura — tapa vazamento da moldura antiga do PNG */}
      <div className="tpl tpl-moldura-clean" aria-hidden="true">
        <svg viewBox="0 0 100 120" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            d="M22 3.4 H78 C84 3.4 90 6.6 93.5 13.2 L97.8 24 C99.5 28.8 100 33.6 100 38.4 V81.6 C100 86.4 99.5 91.2 97.8 96 L93.5 106.8 C90 113.4 84 116.6 78 116.6 H22 C16 116.6 10 113.4 6.5 106.8 L2.2 96 C0.5 91.2 0 86.4 0 81.6 V38.4 C0 33.6 0.5 28.8 2.2 24 L6.5 13.2 C10 6.6 16 3.4 22 3.4 Z"
          />
        </svg>
      </div>

      {/* Moldura principal com borda dourada */}
      <div className="tpl tpl-photo">
        <PhotoUpload
          photoUrl={photoUrl}
          onChange={onPhotoChange}
          transform={photoTransform}
          onTransformChange={onPhotoTransformChange ?? (() => undefined)}
          variant="moldura"
          templateSlot
          className="principal-moldura"
        />
      </div>

      {/* Pinta o texto estático do PNG — mantém só os inputs */}
      <div className="tpl tpl-text-paint" aria-hidden="true" />

      {/* Cobre o texto estático do PNG e coloca inputs */}
      <div className="tpl tpl-person">
        <EditableText
          value={fields.personName}
          onChange={(value) => onFieldChange('personName', value)}
          ariaLabel="Nome da pessoa"
          className="tpl-input tpl-input--name"
          plain
        />
        <div className="tpl-age">
          <span>(</span>
          <EditableText
            value={fields.age}
            onChange={(value) => onFieldChange('age', value)}
            ariaLabel="Idade"
            className="tpl-input tpl-input--age"
            plain
          />
          <span>)</span>
        </div>
      </div>

      <div className="tpl tpl-dates">
        <div className="tpl-dates__item">
          <span className="tpl-dates__icon" aria-hidden="true">
            <StarIcon />
          </span>
          <EditableText
            value={fields.birthDate}
            onChange={(value) => onFieldChange('birthDate', value)}
            ariaLabel="Data de nascimento"
            className="tpl-input tpl-input--date"
            plain
          />
        </div>
        <span className="tpl-dates__sep" aria-hidden="true" />
        <div className="tpl-dates__item">
          <span className="tpl-dates__icon" aria-hidden="true">
            <CrossIcon />
          </span>
          <EditableText
            value={fields.deathDate}
            onChange={(value) => onFieldChange('deathDate', value)}
            ariaLabel="Data de falecimento"
            className="tpl-input tpl-input--date"
            plain
          />
        </div>
      </div>

      <div className="tpl tpl-cards">
        <div className="tpl-card">
          <span className="tpl-card__icon" aria-hidden="true">
            <ClockIcon />
          </span>
          <EditableText
            value={fields.wakeText}
            onChange={(value) => onFieldChange('wakeText', value)}
            ariaLabel="Informações do velório"
            className="tpl-input tpl-input--card"
            multiline
            plain
          />
        </div>
        <div className="tpl-card">
          <span className="tpl-card__icon" aria-hidden="true">
            <PinIcon />
          </span>
          <EditableText
            value={fields.burialText}
            onChange={(value) => onFieldChange('burialText', value)}
            ariaLabel="Informações do sepultamento"
            className="tpl-input tpl-input--card"
            multiline
            plain
          />
        </div>
      </div>

      <div className="tpl tpl-footer">
        <EditableText
          value={fields.phone}
          onChange={(value) => onFieldChange('phone', value)}
          ariaLabel="Telefone"
          className="tpl-input tpl-input--contact"
          plain
        />
        <span className="tpl-footer__dot" aria-hidden="true">
          •
        </span>
        <EditableText
          value={fields.website}
          onChange={(value) => onFieldChange('website', value)}
          ariaLabel="Site"
          className="tpl-input tpl-input--contact"
          plain
        />
      </div>
    </article>
  )
}
