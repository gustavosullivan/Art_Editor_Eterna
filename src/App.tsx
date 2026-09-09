import { useState } from 'react'
import { defaultFields } from './data/defaults'
import EditorScreen from './screens/EditorScreen'
import SplashScreen from './screens/SplashScreen'
import WelcomeScreen from './screens/WelcomeScreen'
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
}

export default function App() {
  const [step, setStep] = useState<Step>('splash')
  const [layoutId, setLayoutId] = useState<LayoutId>('principal')
  const [fields, setFields] = useState<ArtFields>(defaultFields)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoTransform, setPhotoTransform] =
    useState<PhotoTransform>(defaultPhotoTransform)
  const [visibility, setVisibility] = useState(defaultVisibility)

  function updateField<K extends keyof ArtFields>(key: K, value: ArtFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function resetEdits() {
    setFields(defaultFields)
    setPhotoTransform(defaultPhotoTransform)
    setVisibility(defaultVisibility)
  }

  if (step === 'splash') {
    return <SplashScreen onEnter={() => setStep('welcome')} />
  }

  if (step === 'welcome') {
    return (
      <WelcomeScreen
        onBack={() => setStep('splash')}
        onConfirm={(id) => {
          setLayoutId(id)
          setStep('editor')
        }}
      />
    )
  }

  return (
    <EditorScreen
      layoutId={layoutId}
      fields={fields}
      photoUrl={photoUrl}
      photoTransform={photoTransform}
      showWakeCard={visibility.wake}
      showBurialCard={visibility.burial}
      showBirthDate={visibility.birth}
      showDeathDate={visibility.death}
      showPersonName={visibility.name}
      showPersonAge={visibility.age}
      onFieldChange={updateField}
      onPhotoChange={setPhotoUrl}
      onPhotoTransformChange={setPhotoTransform}
      onRemoveWakeCard={() => setVisibility((v) => ({ ...v, wake: false }))}
      onRemoveBurialCard={() => setVisibility((v) => ({ ...v, burial: false }))}
      onRemoveBirthDate={() => setVisibility((v) => ({ ...v, birth: false }))}
      onRemoveDeathDate={() => setVisibility((v) => ({ ...v, death: false }))}
      onRemovePersonName={() => setVisibility((v) => ({ ...v, name: false }))}
      onRemovePersonAge={() => setVisibility((v) => ({ ...v, age: false }))}
      onResetEdits={resetEdits}
      onBack={() => setStep('welcome')}
      onChangeLayout={() => setStep('welcome')}
    />
  )
}
