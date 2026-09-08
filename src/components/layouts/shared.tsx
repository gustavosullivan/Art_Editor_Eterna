import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import SaoLuizLogo from '../SaoLuizLogo'
import type { ArtFields, PhotoTransform } from '../../types'

export type LayoutProps = {
  fields: ArtFields
  photoUrl: string | null
  onFieldChange: <K extends keyof ArtFields>(key: K, value: ArtFields[K]) => void
  onPhotoChange: (url: string | null) => void
  photoTransform?: PhotoTransform
  onPhotoTransformChange?: (transform: PhotoTransform) => void
  preview?: boolean
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18l.9-5.4L4.2 8.9l5.4-.8L12 3.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v18M7 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function InvitationHeader() {
  return (
    <header className="invite-header">
      <p className="invite-header__script">Convite para</p>
      <h2 className="invite-header__title">HOMENAGEM</h2>
      <div className="invite-header__ornament" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
    </header>
  )
}

export function DateRow({
  fields,
  onFieldChange,
  preview,
}: Pick<LayoutProps, 'fields' | 'onFieldChange' | 'preview'>) {
  return (
    <div className="invite-dates">
      <div className="invite-dates__item">
        <span className="invite-dates__icon" aria-hidden="true">
          <StarIcon />
        </span>
        {preview ? (
          <span>{fields.birthDate}</span>
        ) : (
          <EditableText
            value={fields.birthDate}
            onChange={(value) => onFieldChange('birthDate', value)}
            ariaLabel="Data de nascimento"
            className="editable--date"
          />
        )}
      </div>
      <span className="invite-dates__sep" aria-hidden="true" />
      <div className="invite-dates__item">
        <span className="invite-dates__icon" aria-hidden="true">
          <CrossIcon />
        </span>
        {preview ? (
          <span>{fields.deathDate}</span>
        ) : (
          <EditableText
            value={fields.deathDate}
            onChange={(value) => onFieldChange('deathDate', value)}
            ariaLabel="Data de falecimento"
            className="editable--date"
          />
        )}
      </div>
    </div>
  )
}

export function InfoCards({
  fields,
  onFieldChange,
  preview,
}: Pick<LayoutProps, 'fields' | 'onFieldChange' | 'preview'>) {
  return (
    <div className="invite-cards">
      <div className="invite-card">
        <span className="invite-card__icon" aria-hidden="true">
          <ClockIcon />
        </span>
        {preview ? (
          <p>{fields.wakeText}</p>
        ) : (
          <EditableText
            value={fields.wakeText}
            onChange={(value) => onFieldChange('wakeText', value)}
            ariaLabel="Informações do velório"
            multiline
            className="editable--card"
          />
        )}
      </div>
      <div className="invite-card">
        <span className="invite-card__icon" aria-hidden="true">
          <PinIcon />
        </span>
        {preview ? (
          <p>{fields.burialText}</p>
        ) : (
          <EditableText
            value={fields.burialText}
            onChange={(value) => onFieldChange('burialText', value)}
            ariaLabel="Informações do sepultamento"
            multiline
            className="editable--card"
          />
        )}
      </div>
    </div>
  )
}

export function InvitationFooter({
  fields,
  onFieldChange,
  preview,
}: Pick<LayoutProps, 'fields' | 'onFieldChange' | 'preview'>) {
  return (
    <footer className="invite-footer">
      <SaoLuizLogo compact />
      <div className="invite-footer__contact">
        {preview ? (
          <>
            <span>{fields.phone}</span>
            <span className="invite-footer__dot" aria-hidden="true">
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
              className="editable--contact"
            />
            <span className="invite-footer__dot" aria-hidden="true">
              •
            </span>
            <EditableText
              value={fields.website}
              onChange={(value) => onFieldChange('website', value)}
              ariaLabel="Site"
              className="editable--contact"
            />
          </>
        )}
      </div>
    </footer>
  )
}

export function PersonBlock({
  fields,
  onFieldChange,
  preview,
}: Pick<LayoutProps, 'fields' | 'onFieldChange' | 'preview'>) {
  return (
    <div className="invite-person">
      {preview ? (
        <>
          <p className="invite-person__name">{fields.personName}</p>
          <p className="invite-person__age">({fields.age})</p>
        </>
      ) : (
        <>
          <EditableText
            value={fields.personName}
            onChange={(value) => onFieldChange('personName', value)}
            ariaLabel="Nome da pessoa"
            className="editable--name"
          />
          <div className="invite-person__age-row">
            <span>(</span>
            <EditableText
              value={fields.age}
              onChange={(value) => onFieldChange('age', value)}
              ariaLabel="Idade"
              className="editable--age"
            />
            <span>)</span>
          </div>
        </>
      )}
    </div>
  )
}

export { PhotoUpload }
