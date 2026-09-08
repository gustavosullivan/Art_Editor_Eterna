import {
  DateRow,
  InfoCards,
  InvitationFooter,
  InvitationHeader,
  PersonBlock,
  PhotoUpload,
  type LayoutProps,
} from './shared'
import { defaultPhotoTransform } from '../../types'

export default function LayoutClassic({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
}: LayoutProps) {
  return (
    <article className="art art--classic">
      <div className="art__corner art__corner--tr" aria-hidden="true" />
      <div className="art__corner art__corner--bl" aria-hidden="true" />
      <div className="art__lilies" aria-hidden="true" />

      <div className="art__inner">
        <InvitationHeader />

        <PhotoUpload
          photoUrl={photoUrl}
          onChange={onPhotoChange}
          transform={photoTransform}
          onTransformChange={onPhotoTransformChange ?? (() => undefined)}
          variant="hex"
          preview={preview}
        />

        <PersonBlock fields={fields} onFieldChange={onFieldChange} preview={preview} />
        <DateRow fields={fields} onFieldChange={onFieldChange} preview={preview} />
        <InfoCards fields={fields} onFieldChange={onFieldChange} preview={preview} />
        <InvitationFooter fields={fields} onFieldChange={onFieldChange} preview={preview} />
      </div>
    </article>
  )
}
