import {
  DateRow,
  InfoCards,
  InvitationFooter,
  PersonBlock,
  PhotoUpload,
  type LayoutProps,
} from './shared'
import { defaultPhotoTransform } from '../../types'

/**
 * Modelo principal:
 * - Fundo = PNG original (cantos azuis, lírios, título)
 * - Por cima = foto hex + inputs do Layout 2 (sem cobrir cantos)
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

  return (
    <article className="art art--principal">
      <img
        className="art__template"
        src={templateSrc}
        alt={preview ? 'Modelo Principal São Luiz' : ''}
        draggable={false}
      />

      {/* Título, cantos e flores ficam no PNG. Aqui só foto + textos editáveis. */}
      <div className="principal-edit">
        <div className="principal-slot principal-slot--photo">
          <PhotoUpload
            photoUrl={photoUrl}
            onChange={onPhotoChange}
            transform={photoTransform}
            onTransformChange={onPhotoTransformChange ?? (() => undefined)}
            variant="hex"
            preview={preview}
          />
        </div>

        <div className="principal-slot principal-slot--person">
          <PersonBlock fields={fields} onFieldChange={onFieldChange} preview={preview} />
        </div>

        <div className="principal-slot principal-slot--dates">
          <DateRow fields={fields} onFieldChange={onFieldChange} preview={preview} />
        </div>

        <div className="principal-slot principal-slot--cards">
          <InfoCards fields={fields} onFieldChange={onFieldChange} preview={preview} />
        </div>

        <div className="principal-slot principal-slot--footer">
          <InvitationFooter fields={fields} onFieldChange={onFieldChange} preview={preview} />
        </div>
      </div>
    </article>
  )
}
