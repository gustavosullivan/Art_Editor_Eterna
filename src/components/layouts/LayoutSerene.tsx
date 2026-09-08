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

export default function LayoutSerene({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
}: LayoutProps) {
  return (
    <article className="art art--serene">
      <div className="art__band" aria-hidden="true" />
      <div className="art__inner">
        <InvitationHeader />

        <PhotoUpload
          photoUrl={photoUrl}
          onChange={onPhotoChange}
          transform={photoTransform}
          onTransformChange={onPhotoTransformChange ?? (() => undefined)}
          variant="circle"
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
