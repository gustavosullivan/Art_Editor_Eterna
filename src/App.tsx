import { useState } from 'react'
import { defaultFields, emptyFields } from './data/defaults'
import EditorScreen from './screens/EditorScreen'
import SplashScreen from './screens/SplashScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import { type AssetOffset } from './components/DraggableAsset'
import { defaultLivrePieces, type LivrePieceId, type LivrePieceState, type LivrePieces } from './livreLayout'
import {
  defaultClassicoBorder,
  defaultPhotoTransform,
  type ArtFields,
  type ClassicoBorderMode,
  type LayoutId,
  type PhotoTransform,
} from './types'

type Step = 'splash' | 'welcome' | 'editor'

const defaultVisibility = {
  wake: true,
  burial: true,
  birth: true,
  death: true,
  name: true,
  age: true,
  logo: true,
  title: true,
  contact: true,
}

const defaultLogoOffset: AssetOffset = { x: 0, y: 0 }
const defaultCardsOffset: AssetOffset = { x: 0, y: 0 }

export default function App() {
  const [step, setStep] = useState<Step>('splash')
  const [layoutId, setLayoutId] = useState<LayoutId>('classico7dias')
  const [fields, setFields] = useState<ArtFields>(defaultFields)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoTransform, setPhotoTransform] =
    useState<PhotoTransform>(defaultPhotoTransform)
  const [logoOffset, setLogoOffset] = useState<AssetOffset>(defaultLogoOffset)
  const [cardsOffset, setCardsOffset] = useState<AssetOffset>(defaultCardsOffset)
  const [classicoBorder, setClassicoBorder] =
    useState<ClassicoBorderMode>(defaultClassicoBorder)
  const [visibility, setVisibility] = useState(defaultVisibility)
  const [livrePieces, setLivrePieces] = useState<LivrePieces>(defaultLivrePieces)

  function updateField<K extends keyof ArtFields>(key: K, value: ArtFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function applyLayoutDefaults(id: LayoutId) {
    setFields(id === 'livre' ? emptyFields : defaultFields)
    setPhotoTransform(defaultPhotoTransform)
    setLogoOffset(defaultLogoOffset)
    setCardsOffset(defaultCardsOffset)
    setClassicoBorder(defaultClassicoBorder)
    setVisibility(defaultVisibility)
    setLivrePieces(defaultLivrePieces())
  }

  function updateLivrePiece(id: LivrePieceId, next: LivrePieceState) {
    setLivrePieces((current) => ({ ...current, [id]: next }))
  }

  function resetEdits() {
    applyLayoutDefaults(layoutId)
  }

  function openLayout(id: LayoutId) {
    setLayoutId(id)
    applyLayoutDefaults(id)
    setStep('editor')
  }

  if (step === 'splash') {
    return <SplashScreen onEnter={() => setStep('welcome')} />
  }

  if (step === 'welcome') {
    return (
      <WelcomeScreen
        onBack={() => setStep('splash')}
        onConfirm={openLayout}
        onCreate={() => openLayout('livre')}
      />
    )
  }

  return (
    <EditorScreen
      layoutId={layoutId}
      fields={fields}
      photoUrl={photoUrl}
      photoTransform={photoTransform}
      logoOffset={logoOffset}
      cardsOffset={cardsOffset}
      classicoBorder={classicoBorder}
      showWakeCard={visibility.wake}
      showBurialCard={visibility.burial}
      showBirthDate={visibility.birth}
      showDeathDate={visibility.death}
      showPersonName={visibility.name}
      showPersonAge={visibility.age}
      showLogo={visibility.logo}
      showTitle={visibility.title}
      showContact={visibility.contact}
      livrePieces={livrePieces}
      onLivrePieceChange={updateLivrePiece}
      onFieldChange={updateField}
      onPhotoChange={setPhotoUrl}
      onPhotoTransformChange={setPhotoTransform}
      onLogoOffsetChange={setLogoOffset}
      onCardsOffsetChange={setCardsOffset}
      onClassicoBorderChange={setClassicoBorder}
      onRemoveWakeCard={() => setVisibility((v) => ({ ...v, wake: false }))}
      onRemoveBurialCard={() => setVisibility((v) => ({ ...v, burial: false }))}
      onRemoveBirthDate={() => setVisibility((v) => ({ ...v, birth: false }))}
      onRemoveDeathDate={() => setVisibility((v) => ({ ...v, death: false }))}
      onRemovePersonName={() => setVisibility((v) => ({ ...v, name: false }))}
      onRemovePersonAge={() => setVisibility((v) => ({ ...v, age: false }))}
      onRemoveLogo={() => setVisibility((v) => ({ ...v, logo: false }))}
      onRemoveTitle={() => setVisibility((v) => ({ ...v, title: false }))}
      onRemoveContact={() => setVisibility((v) => ({ ...v, contact: false }))}
      onResetEdits={resetEdits}
      onBack={() => setStep('welcome')}
      onChangeLayout={() => setStep('welcome')}
    />
  )
}
