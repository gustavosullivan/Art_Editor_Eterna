import { useState } from 'react'
import { defaultFields, definitivoFields, emptyFields } from './data/defaults'
import {
  definitivoWatermarkModelo1,
  definitivoWatermarkModelo2,
  type WatermarkTune,
} from './data/watermarks'
import {
  historyKindFor,
  loadHistory,
  photoForStorage,
  saveHistory,
  type ArtHistory,
  type HistoryEntry,
} from './history'
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
  type Definitivo7Modelo,
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

function watermarkFor(id: LayoutId, modelo: Definitivo7Modelo): WatermarkTune {
  return id === 'definitivo7dias' && modelo === 2
    ? definitivoWatermarkModelo2
    : definitivoWatermarkModelo1
}

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
  const [definitivo7Modelo, setDefinitivo7Modelo] = useState<Definitivo7Modelo>(1)
  const [definitivoWatermark, setDefinitivoWatermark] = useState<WatermarkTune>(
    definitivoWatermarkModelo1,
  )
  const [history, setHistory] = useState<ArtHistory>(() => loadHistory())

  function updateField<K extends keyof ArtFields>(key: K, value: ArtFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function applyLayoutDefaults(id: LayoutId, modelo: Definitivo7Modelo = definitivo7Modelo) {
    const base =
      id === 'livre'
        ? emptyFields
        : id === 'definitivo' || id === 'definitivo7dias'
          ? definitivoFields
          : defaultFields
    setFields(
      id === 'definitivo7dias' && modelo === 2 ? { ...base, memorialNote: '' } : base,
    )
    setPhotoTransform(defaultPhotoTransform)
    setLogoOffset(defaultLogoOffset)
    setCardsOffset(defaultCardsOffset)
    setClassicoBorder(defaultClassicoBorder)
    setVisibility(defaultVisibility)
    setLivrePieces(defaultLivrePieces())
    setDefinitivoWatermark(watermarkFor(id, modelo))
  }

  function updateLivrePiece(id: LivrePieceId, next: LivrePieceState) {
    setLivrePieces((current) => ({ ...current, [id]: next }))
  }

  function resetEdits() {
    applyLayoutDefaults(layoutId)
  }

  function openHistory(entry: HistoryEntry) {
    setPhotoUrl((current) => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current)
      return entry.photoUrl
    })
    setLayoutId(entry.layoutId)
    setDefinitivo7Modelo(entry.definitivo7Modelo)
    setFields(entry.fields)
    setPhotoTransform(entry.photoTransform)
    setLogoOffset(entry.logoOffset)
    setCardsOffset(entry.cardsOffset)
    setClassicoBorder(entry.classicoBorder)
    setVisibility(entry.visibility)
    setLivrePieces(entry.livrePieces)
    setDefinitivoWatermark(watermarkFor(entry.layoutId, entry.definitivo7Modelo))
    setStep('editor')
  }

  async function rememberDownload() {
    const kind = historyKindFor(layoutId)
    if (!kind) return
    const photoUrlStored = await photoForStorage(photoUrl)
    const entry: HistoryEntry = {
      layoutId,
      definitivo7Modelo,
      fields,
      photoUrl: photoUrlStored,
      photoTransform,
      logoOffset,
      cardsOffset,
      classicoBorder,
      visibility,
      livrePieces,
      savedAt: Date.now(),
    }
    setHistory((current) => saveHistory(current, kind, entry))
  }

  function openLayout(id: LayoutId, modelo: Definitivo7Modelo = 1) {
    const nextModelo = id === 'definitivo7dias' ? modelo : 1
    setDefinitivo7Modelo(nextModelo)
    setLayoutId(id)
    applyLayoutDefaults(id, nextModelo)
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
        definitivo7Modelo={definitivo7Modelo}
        onDefinitivo7ModeloChange={setDefinitivo7Modelo}
        history={history}
        onOpenHistory={openHistory}
      />
    )
  }

  return (
    <EditorScreen
      layoutId={layoutId}
      definitivo7Modelo={definitivo7Modelo}
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
      definitivoWatermark={definitivoWatermark}
      onDefinitivoWatermarkChange={setDefinitivoWatermark}
      onResetEdits={resetEdits}
      onBack={() => setStep('welcome')}
      onChangeLayout={() => setStep('welcome')}
      onDownloaded={rememberDownload}
    />
  )
}
