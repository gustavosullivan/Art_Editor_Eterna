type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null
let listening = false

/** URL canônica do editor (funciona em localhost e no GitHub Pages). */
export function appLaunchUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href
}

/** Página para instalar o atalho na tela inicial. */
export function appLauncherPageUrl() {
  return new URL('abrir.html', appLaunchUrl()).href
}

export function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  const swUrl = new URL('sw.js', appLaunchUrl()).href
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(() => undefined)
  })
}

/** Guarda o evento nativo de “Instalar app” do Chrome/Android. */
export function listenForInstallPrompt() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredInstallPrompt = event as BeforeInstallPromptEvent
  })
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
  })
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

function brandedLauncherHtml(appUrl: string) {
  const saoLuizLogo = new URL('logo-sao-luiz.png', appUrl).href
  const eloLogo = new URL('templates/elo-badge.png', appUrl).href
  const installPage = new URL('abrir.html', appUrl).href

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1a6eff" />
    <link rel="icon" type="image/png" href="${saoLuizLogo}" />
    <title>Editor de Artes — São Luiz</title>
    <style>
      body {
        margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.25rem;
        font-family: Manrope, system-ui, sans-serif; color: #152033;
        background: linear-gradient(165deg, #f7f9fb 0%, #e9eef3 55%, #dde5ee 100%);
      }
      .card {
        width: min(22rem, 100%); padding: 1.5rem; border-radius: 18px; text-align: center;
        background: rgba(255,255,255,.95); box-shadow: 0 18px 40px rgba(21,32,51,.12);
      }
      img { max-width: 7rem; height: auto; }
      a {
        display: inline-flex; margin-top: 1rem; min-height: 2.75rem; padding: .7rem 1.1rem;
        border-radius: 10px; background: #1a6eff; color: #fff; font-weight: 700; text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <img src="${saoLuizLogo}" alt="São Luiz Funerária" />
      <h1>Editor de Artes</h1>
      <p>Abra e use Instalar app / Adicionar à tela inicial.</p>
      <a href="${installPage}">Instalar atalho</a>
      <div style="margin-top:1rem"><img src="${eloLogo}" alt="Elo Tecnologia" style="max-width:4.5rem" /></div>
    </main>
  </body>
</html>`
}

/**
 * Celular: tenta instalar o app na tela inicial (atalho no menu).
 * Se o navegador não deixar, abre a página com o passo a passo.
 * Desktop: baixa um HTML de atalho e também abre a página de instalação.
 */
export async function downloadAppLauncher() {
  if (isStandalone()) {
    window.location.assign(appLaunchUrl())
    return
  }

  if (deferredInstallPrompt) {
    try {
      await deferredInstallPrompt.prompt()
      await deferredInstallPrompt.userChoice
      deferredInstallPrompt = null
      return
    } catch {
      /* cai no guia */
    }
  }

  if (isMobile()) {
    window.location.assign(appLauncherPageUrl())
    return
  }

  triggerDownload(
    new Blob([brandedLauncherHtml(appLaunchUrl())], { type: 'text/html;charset=utf-8' }),
    'Editor-Sao-Luiz.html',
  )
  window.location.assign(appLauncherPageUrl())
}
