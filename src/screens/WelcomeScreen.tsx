import { useState } from 'react'
import ArtLayout from '../components/layouts/ArtLayout'
import PreviewFit from '../components/PreviewFit'
import { defaultFields, layoutOptions } from '../data/defaults'
import type { LayoutId } from '../types'

type WelcomeScreenProps = {
  onConfirm: (layoutId: LayoutId) => void
  onBack: () => void
}

export default function WelcomeScreen({ onConfirm, onBack }: WelcomeScreenProps) {
  const [index, setIndex] = useState(0)
  const selected = layoutOptions[index]

  function go(delta: number) {
    setIndex((current) => (current + delta + layoutOptions.length) % layoutOptions.length)
  }

  return (
    <main className="welcome">
      <div className="welcome__atmosphere" aria-hidden="true" />

      <header className="welcome__header">
        <p className="welcome__eyebrow">São Luiz Funerária</p>
        <h1 className="welcome__title">Bem-vindo</h1>
        <p className="welcome__subtitle">
          Escolha um dos 3 layouts para montar o convite de homenagem.
        </p>
      </header>

      <section className="carousel" aria-label="Escolha de layout">
        <div className="carousel__stage">
          <button
            type="button"
            className="carousel__nav"
            onClick={() => go(-1)}
            aria-label="Layout anterior"
          >
            ‹
          </button>

          <div className="carousel__card">
            <PreviewFit resetKey={selected.id}>
              <ArtLayout
                layoutId={selected.id}
                fields={defaultFields}
                photoUrl={null}
                onFieldChange={() => undefined}
                onPhotoChange={() => undefined}
                preview
              />
            </PreviewFit>
            <div className="carousel__meta">
              <p className="carousel__name">{selected.name}</p>
              <p className="carousel__desc">{selected.description}</p>
            </div>
          </div>

          <button
            type="button"
            className="carousel__nav"
            onClick={() => go(1)}
            aria-label="Próximo layout"
          >
            ›
          </button>
        </div>

        <div className="carousel__dots" role="tablist" aria-label="Layouts">
          {layoutOptions.map((option, i) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`carousel__dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={option.name}
            />
          ))}
        </div>
      </section>

      <div className="welcome__actions">
        <button type="button" className="link-back" onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="splash__cta welcome__ok"
          onClick={() => onConfirm(selected.id)}
        >
          OK
        </button>
      </div>
    </main>
  )
}
