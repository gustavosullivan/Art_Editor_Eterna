import { useState } from 'react'
import { defaultFields } from './data/defaults'
import EditorScreen from './screens/EditorScreen'
import SplashScreen from './screens/SplashScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import { type AssetOffset } from './components/DraggableAsset'
import {
  defaultPhotoTransform,
  type ArtFields,
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
}

/** Offsets zerados = posição padrão do CSS do Modelo Principal */
const defaultLogoOffset: AssetOffset = { x: 0, y: 0 }
const defaultContactOffset: AssetOffset = { x: 0, y: 0 }

export default function App() {
  const [step, setStep] = useState<Step>('splash')
  const [layoutId, setLayoutId] = useState<LayoutId>('principal')
  const [fields, setFields] = useState<ArtFields>(defaultFields)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoTransform, setPhotoTransform] =
    useState<PhotoTransform>(defaultPhotoTransform)
  const [logoOffset, setLogoOffset] = useState<AssetOffset>(defaultLogoOffset)
  const [contactOffset, setContactOffset] = useState<AssetOffset>(defaultContactOffset)
  const [visibility, setVisibility] = useState(defaultVisibility)

  function updateField<K extends keyof ArtFields>(key: K, value: ArtFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function applyLayoutDefaults() {
    setFields(defaultFields)
    setPhotoTransform(defaultPhotoTransform)
    setLogoOffset(defaultLogoOffset)
    setContactOffset(defaultContactOffset)
    setVisibility(defaultVisibility)
  }

  function resetEdits() {
    applyLayoutDefaults()
  }

  function openLayout(id: LayoutId) {
    setLayoutId(id)
    applyLayoutDefaults()
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
      contactOffset={contactOffset}
      showWakeCard={visibility.wake}
      showBurialCard={visibility.burial}
      showBirthDate={visibility.birth}
      showDeathDate={visibility.death}
      showPersonName={visibility.name}
      showPersonAge={visibility.age}
      showLogo={visibility.logo}
      onFieldChange={updateField}
      onPhotoChange={setPhotoUrl}
      onPhotoTransformChange={setPhotoTransform}
      onLogoOffsetChange={setLogoOffset}
      onContactOffsetChange={setContactOffset}
      onRemoveWakeCard={() => setVisibility((v) => ({ ...v, wake: false }))}
      onRemoveBurialCard={() => setVisibility((v) => ({ ...v, burial: false }))}
      onRemoveBirthDate={() => setVisibility((v) => ({ ...v, birth: false }))}
      onRemoveDeathDate={() => setVisibility((v) => ({ ...v, death: false }))}
      onRemovePersonName={() => setVisibility((v) => ({ ...v, name: false }))}
      onRemovePersonAge={() => setVisibility((v) => ({ ...v, age: false }))}
      onRemoveLogo={() => setVisibility((v) => ({ ...v, logo: false }))}
      onResetEdits={resetEdits}
      onBack={() => setStep('welcome')}
      onChangeLayout={() => setStep('welcome')}
    />
  )
}
