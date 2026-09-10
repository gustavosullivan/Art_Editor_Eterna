import { useEffect, useState } from 'react'
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

/** Posição inicial do Principal (centralizado; Y é o “jeito” padrão) */
const defaultLogoOffset: AssetOffset = { x: 0, y: 0 }
const defaultContactOffset: AssetOffset = { x: 0, y: 0 }

const ASSET_LAYOUT_KEY = 'sao-luiz-art-principal-assets'

type StoredAssetLayout = {
  logo: AssetOffset
  contact: AssetOffset
}

function readStoredAssetLayout(): StoredAssetLayout {
  try {
    const raw = localStorage.getItem(ASSET_LAYOUT_KEY)
    if (!raw) return { logo: defaultLogoOffset, contact: defaultContactOffset }
    const parsed = JSON.parse(raw) as Partial<StoredAssetLayout>
    return {
      logo: {
        x: 0,
        y: Number(parsed.logo?.y) || 0,
      },
      contact: {
        x: 0,
        y: Number(parsed.contact?.y) || 0,
      },
    }
  } catch {
    return { logo: defaultLogoOffset, contact: defaultContactOffset }
  }
}

function writeStoredAssetLayout(logo: AssetOffset, contact: AssetOffset) {
  try {
    const payload: StoredAssetLayout = {
      logo: { x: 0, y: logo.y },
      contact: { x: 0, y: contact.y },
    }
    localStorage.setItem(ASSET_LAYOUT_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota / private mode */
  }
}

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
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    const stored = readStoredAssetLayout()
    setLogoOffset(stored.logo)
    setContactOffset(stored.contact)
    setAssetsReady(true)
  }, [])

  useEffect(() => {
    if (!assetsReady) return
    writeStoredAssetLayout(logoOffset, contactOffset)
  }, [assetsReady, logoOffset, contactOffset])

  function updateField<K extends keyof ArtFields>(key: K, value: ArtFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function resetEdits() {
    setFields(defaultFields)
    setPhotoTransform(defaultPhotoTransform)
    setLogoOffset(defaultLogoOffset)
    setContactOffset(defaultContactOffset)
    setVisibility(defaultVisibility)
    writeStoredAssetLayout(defaultLogoOffset, defaultContactOffset)
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
