import EditableText from '../EditableText'
import PhotoUpload from '../PhotoUpload'
import SaoLuizLogo from '../SaoLuizLogo'
import CardIconAsset, { RemovableBlock } from '../CardIconAsset'
import DraggableAsset, { defaultAssetOffset } from '../DraggableAsset'
import type { LayoutProps } from './shared'
import { defaultPhotoTransform } from '../../types'

const asset = (file: string) => `${import.meta.env.BASE_URL}templates/${file}`

/** Canto azul + lírios — asset extraído da arte de referência (superior direito) */
function CornerLilyTR() {
  return (
    <div className="setimo-corner-tr" aria-hidden="true">
      <img
        className="setimo-corner-tr__img"
        src={asset('setimo-corner-tr-full.png')}
        alt=""
        draggable={false}
      />
    </div>
  )
}

/** Canto azul + lírios — mesmo molde do TR (inferior esquerdo) */
function CornerLilyBL() {
  return (
    <div className="setimo-corner-bl" aria-hidden="true">
      <img
        className="setimo-corner-bl__img"
        src={asset('setimo-corner-bl-full-v3.png')}
        alt=""
        draggable={false}
      />
    </div>
  )
}

/** Título igual à referência: MISSA DE + Sétimo Dia + ornamento */
function SetimoTitle() {
  return (
    <header className="setimo-title">
      <p className="setimo-title__eyebrow">MISSA DE</p>
      <h2 className="setimo-title__heading">
        <span className="setimo-title__setimo">Sétimo</span>{' '}
        <span className="setimo-title__dia">
          <span className="setimo-title__d">D</span>
          ia
        </span>
      </h2>
      <div className="setimo-title__ornament" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
    </header>
  )
}

/** Lírios laterais (Principal) + cantos da referência */
function PrincipalDecor() {
  return (
    <div className="setimo-decor" aria-hidden="true">
      <img
        className="setimo-decor__full"
        src={asset('setimo-decor-from-principal.png')}
        alt=""
        draggable={false}
      />
      <CornerLilyTR />
      <CornerLilyBL />
    </div>
  )
}

function Ornament() {
  return (
    <div className="setimo-ornament" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  )
}

/**
 * Missa de 7º Dia (temporário) — fundo em assets + blocos editáveis
 * no mesmo espírito do Modelo Principal.
 */
export default function LayoutSetimoDia({
  fields,
  photoUrl,
  onFieldChange,
  onPhotoChange,
  photoTransform = defaultPhotoTransform,
  onPhotoTransformChange,
  preview = false,
  showWakeCard = true,
  showBurialCard = true,
  showPersonName = true,
  showLogo = true,
  cardsOffset = defaultAssetOffset,
  onCardsOffsetChange,
  onRemoveWakeCard,
  onRemoveBurialCard,
  onRemovePersonName,
  onRemoveLogo,
}: LayoutProps) {
  const canEdit = !preview

  return (
    <article className="art art--setimo">
      <PrincipalDecor />

      <div className="setimo-inner">
        <SetimoTitle />

        <div className="setimo-hero">
          <div className="setimo-hero__photo">
            <PhotoUpload
              photoUrl={photoUrl}
              onChange={onPhotoChange}
              transform={photoTransform}
              onTransformChange={onPhotoTransformChange ?? (() => undefined)}
              variant="rounded"
              preview={preview}
              className="setimo-photo"
            />
          </div>

          <div className="setimo-hero__copy">
            {showPersonName ? (
              preview ? (
                <p className="setimo-name">{fields.personName}</p>
              ) : (
                <RemovableBlock
                  label="nome"
                  interactive={canEdit}
                  className="setimo-name-wrap"
                  onRemove={() => onRemovePersonName?.()}
                >
                  <EditableText
                    value={fields.personName}
                    onChange={(value) => onFieldChange('personName', value)}
                    ariaLabel="Nome da pessoa"
                    className="setimo-name setimo-input"
                    multiline
                    plain
                  />
                </RemovableBlock>
              )
            ) : null}

            <Ornament />

            {preview ? (
              <p className="setimo-note">{fields.memorialNote}</p>
            ) : (
              <EditableText
                value={fields.memorialNote}
                onChange={(value) => onFieldChange('memorialNote', value)}
                ariaLabel="Texto memorial"
                className="setimo-note setimo-input"
                plain
              />
            )}
          </div>
        </div>

        <DraggableAsset
          className="setimo-cards-drag"
          offset={cardsOffset}
          onOffsetChange={(next) => onCardsOffsetChange?.(next)}
          disabled={!canEdit}
          axis="x"
          anchor="start"
          clamp={100}
        >
          <div className="setimo-cards">
            {showWakeCard ? (
              <div className="setimo-card">
                <CardIconAsset
                  kind="clock"
                  label="ícone da data"
                  interactive={canEdit}
                  onRemove={() => onRemoveWakeCard?.()}
                />
                <div className="setimo-card__body">
                  <p className="setimo-card__label">DATA DA CELEBRAÇÃO</p>
                  {preview ? (
                    <p className="setimo-card__value">{fields.celebrationDate}</p>
                  ) : (
                    <EditableText
                      value={fields.celebrationDate}
                      onChange={(value) => onFieldChange('celebrationDate', value)}
                      ariaLabel="Data e horário da celebração"
                      className="setimo-card__value setimo-input"
                      plain
                    />
                  )}
                </div>
              </div>
            ) : null}

            {showBurialCard ? (
              <div className="setimo-card">
                <CardIconAsset
                  kind="pin"
                  label="ícone do local"
                  interactive={canEdit}
                  onRemove={() => onRemoveBurialCard?.()}
                />
                <div className="setimo-card__body">
                  <p className="setimo-card__label">LOCAL DA CERIMÔNIA</p>
                  {preview ? (
                    <p className="setimo-card__value">{fields.ceremonyPlace}</p>
                  ) : (
                    <EditableText
                      value={fields.ceremonyPlace}
                      onChange={(value) => onFieldChange('ceremonyPlace', value)}
                      ariaLabel="Local da cerimônia"
                      className="setimo-card__value setimo-input"
                      plain
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </DraggableAsset>

        <footer className="setimo-footer">
          {showLogo ? (
            <RemovableBlock
              label="logo São Luiz"
              interactive={canEdit}
              className="setimo-logo-wrap"
              onRemove={() => onRemoveLogo?.()}
            >
              <SaoLuizLogo compact className="setimo-logo-asset" />
            </RemovableBlock>
          ) : null}

          <div className="setimo-footer__contact">
            {preview ? (
              <>
                <span>{fields.phone}</span>
                <span className="setimo-footer__dot" aria-hidden="true">
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
                  className="setimo-footer__field setimo-input"
                  plain
                />
                <span className="setimo-footer__dot" aria-hidden="true">
                  •
                </span>
                <EditableText
                  value={fields.website}
                  onChange={(value) => onFieldChange('website', value)}
                  ariaLabel="Site"
                  className="setimo-footer__field setimo-input"
                  plain
                />
              </>
            )}
          </div>
        </footer>
      </div>
    </article>
  )
}
