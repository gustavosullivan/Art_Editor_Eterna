import { useState, type PointerEvent as ReactPointerEvent } from 'react'
import EditableText from '../EditableText'
import LivrePiece from '../LivrePiece'
import SaoLuizLogo from '../SaoLuizLogo'
import { defaultLivrePieces, type LivrePieceId } from '../../livreLayout'
import type { LayoutProps } from './shared'
import { defaultClassicoBorder } from '../../types'

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
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.2 6.8 7.8 6.2 7.8-6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

/**
 * Arte em branco — blocos soltos, com arraste e tamanho de texto.
 */
export default function LayoutLivre({
  fields,
  onFieldChange,
  preview = false,
  showWakeCard = true,
  showBurialCard = true,
  showBirthDate = true,
  showDeathDate = true,
  showPersonName = true,
  showPersonAge = true,
  showLogo = true,
  showTitle = true,
  showContact = true,
  classicoBorder = defaultClassicoBorder,
  livrePieces = defaultLivrePieces(),
  onLivrePieceChange,
  onRemoveWakeCard,
  onRemoveBurialCard,
  onRemoveBirthDate,
  onRemoveDeathDate,
  onRemovePersonName,
  onRemovePersonAge,
  onRemoveLogo,
  onRemoveTitle,
  onRemoveContact,
}: LayoutProps) {
  const [selectedId, setSelectedId] = useState<LivrePieceId | null>(null)
  const [dragging, setDragging] = useState(false)
  const canEdit = !preview

  function changePiece(id: LivrePieceId, next: (typeof livrePieces)[LivrePieceId]) {
    onLivrePieceChange?.(id, next)
  }

  function onArtPointerDown(event: ReactPointerEvent<HTMLElement>) {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('.livre-piece')) return
    setSelectedId(null)
  }

  function pieceProps(id: LivrePieceId, label: string, onRemove?: () => void, stretch = false) {
    return {
      id,
      label,
      stretch,
      piece: livrePieces[id],
      selected: canEdit && selectedId === id,
      onSelect: () => setSelectedId(id),
      onChange: (next: (typeof livrePieces)[LivrePieceId]) => changePiece(id, next),
      onRemove: () => {
        setSelectedId(null)
        onRemove?.()
      },
      onDragActive: setDragging,
    }
  }

  return (
    <article
      className={`art art--classico art--livre${preview ? ' art--classico-preview' : ''}${dragging ? ' is-guiding' : ''}`}
      onPointerDown={canEdit ? onArtPointerDown : undefined}
    >
      {dragging ? <div className="livre-guides no-export" aria-hidden="true" /> : null}

      {!preview && classicoBorder !== 'off' ? (
        <div className={`classico-edge classico-edge--${classicoBorder}`} aria-hidden="true">
          {classicoBorder === 'combo' ? <span className="classico-edge__inner" /> : null}
        </div>
      ) : null}

      <div className="art__inner">
        {showTitle ? (
          <LivrePiece {...pieceProps('title', 'título', onRemoveTitle, true)}>
            {preview ? (
              <p className="livre-title__text">{fields.memorialNote || 'Título'}</p>
            ) : (
              <EditableText
                value={fields.memorialNote}
                onChange={(value) => onFieldChange('memorialNote', value)}
                ariaLabel="Título"
                placeholder="Título"
                className="livre-title__field"
                multiline
                plain
                maxRows={3}
                clampOverflow
              />
            )}
          </LivrePiece>
        ) : null}

        {showPersonName ? (
          <LivrePiece {...pieceProps('name', 'nome', onRemovePersonName, true)}>
            {preview ? (
              <p className="invite-person__name">{fields.personName || 'Nome'}</p>
            ) : (
              <EditableText
                value={fields.personName}
                onChange={(value) => onFieldChange('personName', value)}
                ariaLabel="Nome da pessoa"
                placeholder="Nome"
                className="editable--name"
                multiline
                plain
                maxRows={3}
                clampOverflow
              />
            )}
          </LivrePiece>
        ) : null}

        {showPersonAge ? (
          <LivrePiece {...pieceProps('age', 'idade', onRemovePersonAge)}>
            {preview ? (
              <p className="invite-person__age">{fields.age || 'Idade'}</p>
            ) : (
              <EditableText
                value={fields.age}
                onChange={(value) => onFieldChange('age', value)}
                ariaLabel="Idade"
                placeholder="Idade"
                className="editable--age"
                autoWidth
              />
            )}
          </LivrePiece>
        ) : null}

        {showBirthDate || showDeathDate ? (
          <div className="invite-dates">
            {showBirthDate ? (
              <LivrePiece {...pieceProps('birth', 'nascimento', onRemoveBirthDate)}>
                <div className="invite-dates__item">
                  <span className="invite-dates__icon" aria-hidden="true">
                    <StarIcon />
                  </span>
                  {preview ? (
                    <span className="invite-dates__value">{fields.birthDate || 'Nascimento'}</span>
                  ) : (
                    <EditableText
                      value={fields.birthDate}
                      onChange={(value) => onFieldChange('birthDate', value)}
                      ariaLabel="Data de nascimento"
                      placeholder="Nascimento"
                      className="editable--date"
                      autoWidth
                    />
                  )}
                </div>
              </LivrePiece>
            ) : null}

            {showBirthDate && showDeathDate ? <span className="invite-dates__sep" aria-hidden="true" /> : null}

            {showDeathDate ? (
              <LivrePiece {...pieceProps('death', 'falecimento', onRemoveDeathDate)}>
                <div className="invite-dates__item">
                  <span className="invite-dates__icon" aria-hidden="true">
                    <CrossIcon />
                  </span>
                  {preview ? (
                    <span className="invite-dates__value">{fields.deathDate || 'Falecimento'}</span>
                  ) : (
                    <EditableText
                      value={fields.deathDate}
                      onChange={(value) => onFieldChange('deathDate', value)}
                      ariaLabel="Data de falecimento"
                      placeholder="Falecimento"
                      className="editable--date"
                      autoWidth
                    />
                  )}
                </div>
              </LivrePiece>
            ) : null}
          </div>
        ) : null}

        {showWakeCard || showBurialCard ? (
          <div className="classico-cards">
            {showWakeCard ? (
              <LivrePiece {...pieceProps('cardDate', 'primeiro texto', onRemoveWakeCard, true)}>
                <div className="classico-card">
                  {preview ? (
                    <p className="classico-card__label">{fields.celebrationLabel || 'Título'}</p>
                  ) : (
                    <EditableText
                      value={fields.celebrationLabel}
                      onChange={(value) => onFieldChange('celebrationLabel', value)}
                      ariaLabel="Título do primeiro texto"
                      placeholder="Título"
                      className="classico-card__label"
                      plain
                      clampOverflow
                    />
                  )}
                  {preview ? (
                    <p className="classico-card__value">{fields.celebrationDate || 'Texto'}</p>
                  ) : (
                    <EditableText
                      value={fields.celebrationDate}
                      onChange={(value) => onFieldChange('celebrationDate', value)}
                      ariaLabel="Texto do primeiro bloco"
                      placeholder="Texto"
                      className="classico-card__value"
                      multiline
                      plain
                      maxRows={3}
                      clampOverflow
                    />
                  )}
                </div>
              </LivrePiece>
            ) : null}

            {showBurialCard ? (
              <LivrePiece {...pieceProps('cardPlace', 'segundo texto', onRemoveBurialCard, true)}>
                <div className="classico-card">
                  {preview ? (
                    <p className="classico-card__label">{fields.ceremonyLabel || 'Título'}</p>
                  ) : (
                    <EditableText
                      value={fields.ceremonyLabel}
                      onChange={(value) => onFieldChange('ceremonyLabel', value)}
                      ariaLabel="Título do segundo texto"
                      placeholder="Título"
                      className="classico-card__label"
                      plain
                      clampOverflow
                    />
                  )}
                  {preview ? (
                    <p className="classico-card__value">{fields.ceremonyPlace || 'Texto'}</p>
                  ) : (
                    <EditableText
                      value={fields.ceremonyPlace}
                      onChange={(value) => onFieldChange('ceremonyPlace', value)}
                      ariaLabel="Texto do segundo bloco"
                      placeholder="Texto"
                      className="classico-card__value"
                      multiline
                      plain
                      maxRows={3}
                      clampOverflow
                    />
                  )}
                </div>
              </LivrePiece>
            ) : null}
          </div>
        ) : null}

        {showLogo || showContact ? (
          <footer className="classico-footer">
            {showLogo ? (
              <LivrePiece {...pieceProps('logo', 'logo', onRemoveLogo)}>
                <SaoLuizLogo compact className="classico-logo" />
              </LivrePiece>
            ) : null}

            {showContact ? (
              <LivrePiece {...pieceProps('contact', 'contato', onRemoveContact)}>
                <div className="classico-footer__contact">
                  {preview ? (
                    <>
                      <span className="classico-footer__item">
                        <MailIcon />
                        <span>{fields.website || 'Site'}</span>
                      </span>
                      <span className="classico-footer__sep" aria-hidden="true">
                        |
                      </span>
                      <span className="classico-footer__item">
                        <PhoneIcon />
                        <span>{fields.phone || 'Telefone'}</span>
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
                          placeholder="Site"
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
                          placeholder="Telefone"
                          className="classico-footer__field"
                          plain
                          clampOverflow
                        />
                      </span>
                    </>
                  )}
                </div>
              </LivrePiece>
            ) : null}
          </footer>
        ) : null}
      </div>
    </article>
  )
}
