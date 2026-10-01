import DefinitivoWatermark from '../DefinitivoWatermark'
import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import SaoLuizLogo from '../SaoLuizLogo'
import {
  DateRow,
  InvitationHeader,
  SetimoTitle,
  type LayoutProps,
} from './shared'
import { defaultClassicoBorder, defaultPhotoTransform } from '../../types'

export type DefinitivoTitleVariant = 'homenagem' | 'setimo'

function PhoneIcon() {
  return (
    <svg className="definitivo-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
    <svg className="definitivo-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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

type LineFieldProps = {
  value: string
  placeholder: string
  ariaLabel: string
  preview: boolean
  onChange: (value: string) => void
}

function LineField({ value, placeholder, ariaLabel, preview, onChange }: LineFieldProps) {
  if (preview) {
    return <p className={`definitivo-line${value ? '' : ' definitivo-line--placeholder'}`}>{value || placeholder}</p>
  }

  return (
    <EditableText
      value={value}
      onChange={onChange}
      ariaLabel={ariaLabel}
      placeholder={placeholder}
      className="definitivo-line"
      plain
      clampOverflow
    />
  )
}

const handsSrc = `${import.meta.env.BASE_URL}templates/maos-cruz.png`

function HandsRosaryIcon() {
  return (
    <img
      className="definitivo-rosary"
      src={handsSrc}
      alt=""
      draggable={false}
    />
  )
}

type LayoutDefinitivoProps = LayoutProps & {
  /** homenagem = convite; setimo = mesmo layout com título de 7º dia */
  titleVariant?: DefinitivoTitleVariant
}

type Modelo2BodyProps = Pick<
  LayoutProps,
  | 'fields'
  | 'photoUrl'
  | 'onFieldChange'
  | 'onPhotoChange'
  | 'photoTransform'
  | 'onPhotoTransformChange'
  | 'preview'
  | 'showPersonName'
>

/** Modelo 2 do definitivo de 7 dias: foto à esquerda, nome à direita, descrição e terço. */
function Modelo2Body({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
  showPersonName = true,
}: Modelo2BodyProps) {
  return (
    <>
      <div className="definitivo-hero">
        <div className="definitivo-photo">
          <PhotoUpload
            photoUrl={photoUrl}
            onChange={onPhotoChange}
            transform={photoTransform}
            onTransformChange={onPhotoTransformChange ?? (() => undefined)}
            variant="rounded"
            preview={preview}
            className="definitivo-photo__frame"
          />
        </div>

        <div className="definitivo-side">
          {showPersonName ? (
            preview ? (
              <p className={`definitivo-name${fields.personName ? '' : ' definitivo-name--placeholder'}`}>
                {fields.personName || 'Nome'}
              </p>
            ) : (
              <EditableText
                value={fields.personName}
                onChange={(value) => onFieldChange('personName', value)}
                ariaLabel="Nome da pessoa"
                placeholder="Nome"
                className="definitivo-name"
                multiline
                plain
                maxRows={3}
                clampOverflow
              />
            )
          ) : null}

          <div className="definitivo-note">
            <HandsRosaryIcon />
            {preview ? (
              <p className={`definitivo-desc${fields.memorialNote ? '' : ' definitivo-desc--placeholder'}`}>
                {fields.memorialNote || 'Descrição'}
              </p>
            ) : (
              <EditableText
                value={fields.memorialNote}
                onChange={(value) => onFieldChange('memorialNote', value)}
                ariaLabel="Descrição"
                placeholder="Descrição"
                className="definitivo-desc"
                multiline
                plain
                maxRows={4}
                clampOverflow
              />
            )}
          </div>
        </div>
      </div>

      <div className="definitivo-when">
        {preview ? (
          <p className={`definitivo-when__date${fields.celebrationDate ? '' : ' definitivo-when__placeholder'}`}>
            {fields.celebrationDate || 'Data da celebração'}
          </p>
        ) : (
          <EditableText
            value={fields.celebrationDate}
            onChange={(value) => onFieldChange('celebrationDate', value)}
            ariaLabel="Data da celebração"
            placeholder="Data da celebração"
            className="definitivo-when__date"
            plain
            clampOverflow
          />
        )}
        {preview ? (
          <p className={`definitivo-when__time${fields.celebrationTime ? '' : ' definitivo-when__placeholder'}`}>
            {fields.celebrationTime || 'Hora da celebração'}
          </p>
        ) : (
          <EditableText
            value={fields.celebrationTime}
            onChange={(value) => onFieldChange('celebrationTime', value)}
            ariaLabel="Hora da celebração"
            placeholder="Hora da celebração"
            className="definitivo-when__time"
            plain
            clampOverflow
          />
        )}
      </div>
    </>
  )
}

/**
 * Modelo Definitivo — folha azul, moldura retangular em pé,
 * nome, datas, local, data do lugar e rodapé com a logo.
 */
export default function LayoutDefinitivo({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
  showBirthDate = true,
  showDeathDate = true,
  showPersonName = true,
  showLogo = true,
  showTitle = true,
  showContact = true,
  classicoBorder = defaultClassicoBorder,
  onRemoveBirthDate,
  onRemoveDeathDate,
  titleVariant = 'homenagem',
  definitivo7Modelo = 1,
  watermark,
}: LayoutDefinitivoProps) {
  const isSetimoTitle = titleVariant === 'setimo'
  const isModelo2 = isSetimoTitle && definitivo7Modelo === 2

  return (
    <article
      className={`art art--definitivo${isSetimoTitle ? ' art--definitivo-7dias' : ''}${isModelo2 ? ' art--definitivo-m2' : ''}${preview ? ' art--definitivo-preview' : ''}`}
    >
      <div className="definitivo-sheet" aria-hidden="true" />

      <DefinitivoWatermark tune={watermark} />

      {!preview && classicoBorder === 'navy' ? (
        <div className="classico-edge classico-edge--navy" aria-hidden="true" />
      ) : null}

      <div className="art__inner">
        {showTitle ? (isSetimoTitle ? <SetimoTitle /> : <InvitationHeader />) : null}

        {isModelo2 ? (
          <Modelo2Body
            fields={fields}
            photoUrl={photoUrl}
            onFieldChange={onFieldChange}
            onPhotoChange={onPhotoChange}
            photoTransform={photoTransform}
            onPhotoTransformChange={onPhotoTransformChange}
            preview={preview}
            showPersonName={showPersonName}
          />
        ) : (
          <>
            <div className="definitivo-photo">
              <PhotoUpload
                photoUrl={photoUrl}
                onChange={onPhotoChange}
                transform={photoTransform}
                onTransformChange={onPhotoTransformChange ?? (() => undefined)}
                variant="rounded"
                preview={preview}
                className="definitivo-photo__frame"
              />
            </div>

            {showPersonName ? (
              preview ? (
                <p className={`definitivo-name${fields.personName ? '' : ' definitivo-name--placeholder'}`}>
                  {fields.personName || 'Nome'}
                </p>
              ) : (
                <EditableText
                  value={fields.personName}
                  onChange={(value) => onFieldChange('personName', value)}
                  ariaLabel="Nome da pessoa"
                  placeholder="Nome"
                  className="definitivo-name"
                  multiline
                  plain
                  maxRows={2}
                  clampOverflow
                />
              )
            ) : null}

            <DateRow
              fields={fields}
              onFieldChange={onFieldChange}
              preview={preview}
              showBirthDate={showBirthDate}
              showDeathDate={showDeathDate}
              onRemoveBirthDate={onRemoveBirthDate}
              onRemoveDeathDate={onRemoveDeathDate}
              birthPlaceholder="Nascimento"
              deathPlaceholder="Falecimento"
            />

            <div className="definitivo-meta">
              <LineField
                value={fields.ceremonyPlace}
                placeholder="Local do evento"
                ariaLabel="Local do evento"
                preview={preview}
                onChange={(value) => onFieldChange('ceremonyPlace', value)}
              />
              <LineField
                value={fields.celebrationDate}
                placeholder="Data do lugar"
                ariaLabel="Data do lugar"
                preview={preview}
                onChange={(value) => onFieldChange('celebrationDate', value)}
              />
            </div>
          </>
        )}

        <footer className="definitivo-footer">
          {showLogo ? <SaoLuizLogo compact className="definitivo-logo" /> : null}

          {showContact ? (
            <div className="definitivo-footer__contact">
              {preview ? (
                <>
                  <span className="definitivo-footer__item">
                    <MailIcon />
                    <span>{fields.website}</span>
                  </span>
                  <span className="definitivo-footer__sep" aria-hidden="true">
                    |
                  </span>
                  <span className="definitivo-footer__item">
                    <PhoneIcon />
                    <span>{fields.phone}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="definitivo-footer__item">
                    <MailIcon />
                    <EditableText
                      value={fields.website}
                      onChange={(value) => onFieldChange('website', value)}
                      ariaLabel="E-mail"
                      className="definitivo-footer__field"
                      plain
                      clampOverflow
                    />
                  </span>
                  <span className="definitivo-footer__sep" aria-hidden="true">
                    |
                  </span>
                  <span className="definitivo-footer__item">
                    <PhoneIcon />
                    <EditableText
                      value={fields.phone}
                      onChange={(value) => onFieldChange('phone', value)}
                      ariaLabel="Telefone"
                      className="definitivo-footer__field"
                      plain
                      clampOverflow
                    />
                  </span>
                </>
              )}
            </div>
          ) : null}
        </footer>
      </div>
    </article>
  )
}
