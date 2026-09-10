import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import CardIconAsset, { RemovableBlock } from '../CardIconAsset'
import SaoLuizLogo from '../SaoLuizLogo'
import DraggableAsset, { defaultAssetOffset } from '../DraggableAsset'
import type { LayoutProps } from './shared'
import { defaultPhotoTransform } from '../../types'

/**
 * Modelo Principal idêntico ao PNG oficial.
 */
export default function LayoutPrincipal({
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
  showPersonName = true,
  showPersonAge = true,
  showLogo = true,
  logoOffset = defaultAssetOffset,
  contactOffset = defaultAssetOffset,
  onLogoOffsetChange,
  onContactOffsetChange,
  onRemoveWakeCard,
  onRemoveBurialCard,
  onRemoveBirthDate,
  onRemoveDeathDate,
  onRemovePersonName,
  onRemovePersonAge,
  onRemoveLogo,
}: LayoutProps) {
  const templateSrc = `${import.meta.env.BASE_URL}templates/convite-principal.png`
  const canEdit = !preview

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

      <div className="tpl tpl-moldura-clean" aria-hidden="true">
        <svg viewBox="0 0 100 120" preserveAspectRatio="none">
          <path
            fill="#efeff1"
            d="M22 3.4 H78 C84 3.4 90 6.6 93.5 13.2 L97.8 24 C99.5 28.8 100 33.6 100 38.4 V81.6 C100 86.4 99.5 91.2 97.8 96 L93.5 106.8 C90 113.4 84 116.6 78 116.6 H22 C16 116.6 10 113.4 6.5 106.8 L2.2 96 C0.5 91.2 0 86.4 0 81.6 V38.4 C0 33.6 0.5 28.8 2.2 24 L6.5 13.2 C10 6.6 16 3.4 22 3.4 Z"
          />
        </svg>
      </div>

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

      <div className="tpl tpl-text-paint" aria-hidden="true" />
      {/* Cobre os cards antigos do PNG (permanece mesmo após remover com X) */}
      <div className="tpl tpl-cards-paint" aria-hidden="true" />
      <div className="tpl tpl-burial-paint" aria-hidden="true" />
      {/* Cobre a logo do PNG + área do rodapé */}
      <div className="tpl tpl-logo-paint" aria-hidden="true" />
      <div className="tpl tpl-contact-paint" aria-hidden="true" />

      <div className="tpl tpl-person">
        {showPersonName ? (
          <RemovableBlock
            label="nome"
            interactive={canEdit}
            className="tpl-person__name-wrap"
            onRemove={() => onRemovePersonName?.()}
          >
            <EditableText
              value={fields.personName}
              onChange={(value) => onFieldChange('personName', value)}
              ariaLabel="Nome da pessoa"
              className="tpl-input tpl-input--name"
              plain
            />
          </RemovableBlock>
        ) : null}

        {showPersonAge ? (
          <RemovableBlock
            label="idade"
            interactive={canEdit}
            className="tpl-person__age-wrap"
            onRemove={() => onRemovePersonAge?.()}
          >
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
          </RemovableBlock>
        ) : null}
      </div>

      <div className="tpl tpl-dates">
        {showBirthDate ? (
          <div className="tpl-dates__item">
            <CardIconAsset
              kind="star"
              tone="date"
              label="estrela / nascimento"
              interactive={canEdit}
              onRemove={() => onRemoveBirthDate?.()}
            />
            <EditableText
              value={fields.birthDate}
              onChange={(value) => onFieldChange('birthDate', value)}
              ariaLabel="Data de nascimento"
              className="tpl-input tpl-input--date"
              plain
            />
          </div>
        ) : null}

        {showBirthDate && showDeathDate ? (
          <span className="tpl-dates__sep" aria-hidden="true" />
        ) : null}

        {showDeathDate ? (
          <div className="tpl-dates__item">
            <CardIconAsset
              kind="cross"
              tone="date"
              label="cruz / falecimento"
              interactive={canEdit}
              onRemove={() => onRemoveDeathDate?.()}
            />
            <EditableText
              value={fields.deathDate}
              onChange={(value) => onFieldChange('deathDate', value)}
              ariaLabel="Data de falecimento"
              className="tpl-input tpl-input--date"
              plain
            />
          </div>
        ) : null}
      </div>

      <div className="tpl tpl-cards">
        {showWakeCard ? (
          <div className="tpl-card">
            <CardIconAsset
              kind="clock"
              label="ícone do velório"
              interactive={canEdit}
              onRemove={() => onRemoveWakeCard?.()}
            />
            <EditableText
              value={fields.wakeText}
              onChange={(value) => onFieldChange('wakeText', value)}
              ariaLabel="Informações do velório"
              className="tpl-input tpl-input--card"
              multiline
              plain
            />
          </div>
        ) : null}

        {showBurialCard ? (
          <div className="tpl-card">
            <CardIconAsset
              kind="pin"
              label="ícone do sepultamento"
              interactive={canEdit}
              onRemove={() => onRemoveBurialCard?.()}
            />
            <EditableText
              value={fields.burialText}
              onChange={(value) => onFieldChange('burialText', value)}
              ariaLabel="Informações do sepultamento"
              className="tpl-input tpl-input--card"
              multiline
              plain
            />
          </div>
        ) : null}
      </div>

      {showLogo ? (
        <DraggableAsset
          className="tpl tpl-logo"
          offset={logoOffset}
          onOffsetChange={(next) => onLogoOffsetChange?.(next)}
          disabled={!canEdit}
          clamp={140}
          axis="y"
        >
          <RemovableBlock
            label="logo São Luiz"
            interactive={canEdit}
            className="tpl-logo__block"
            onRemove={() => onRemoveLogo?.()}
          >
            <SaoLuizLogo compact className="tpl-logo__asset" />
          </RemovableBlock>
        </DraggableAsset>
      ) : null}

      <DraggableAsset
        className="tpl tpl-footer"
        offset={contactOffset}
        onOffsetChange={(next) => onContactOffsetChange?.(next)}
        disabled={!canEdit}
        clamp={140}
        axis="y"
      >
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
      </DraggableAsset>
    </article>
  )
}
