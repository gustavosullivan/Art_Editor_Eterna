/** URL canônica do editor (funciona em localhost e no GitHub Pages). */
export function appLaunchUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href
}

/** Página do atalho com as logos (hospedada no próprio app). */
export function appLauncherPageUrl() {
  return new URL('abrir.html', appLaunchUrl()).href
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

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1a6eff" />
    <link rel="icon" type="image/png" href="${saoLuizLogo}" />
    <link rel="apple-touch-icon" href="${saoLuizLogo}" />
    <title>Editor de Artes — São Luiz</title>
    <style>
      :root { color-scheme: light; font-family: Manrope, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        background:
          radial-gradient(circle at 50% 18%, rgba(26, 110, 255, 0.16), transparent 42%),
          linear-gradient(165deg, #f7f9fb 0%, #e9eef3 55%, #dde5ee 100%);
        color: #152033;
      }
      .card {
        width: min(22rem, 100%);
        padding: 1.6rem 1.35rem 1.35rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 40px rgba(21, 32, 51, 0.12);
        text-align: center;
      }
      .logo-sao { width: min(7.5rem, 42vw); height: auto; display: block; margin: 0 auto 0.85rem; }
      .logo-elo { width: min(4.8rem, 30vw); height: auto; display: block; margin: 0.85rem auto 0; }
      h1 { margin: 0; font-size: 1.35rem; line-height: 1.2; }
      p { margin: 0.55rem 0 0; color: #5c6573; font-size: 0.92rem; line-height: 1.4; }
      a.btn {
        display: inline-flex; align-items: center; justify-content: center;
        margin-top: 1.1rem; min-height: 2.85rem; padding: 0.7rem 1.15rem;
        border-radius: 10px;
        background: linear-gradient(165deg, #5ba3ff 0%, #1a6eff 55%, #0f5ae0 100%);
        color: #fff; font-weight: 700; letter-spacing: 0.04em; text-decoration: none;
      }
      .brands { margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(21, 32, 51, 0.08); }
    </style>
  </head>
  <body>
    <main class="card">
      <img class="logo-sao" src="${saoLuizLogo}" alt="São Luiz Funerária" />
      <h1>Editor de Artes</h1>
      <p>Abrindo o app da São Luiz Funerária…</p>
      <a class="btn" href="${appUrl}">Abrir agora</a>
      <div class="brands">
        <img class="logo-elo" src="${eloLogo}" alt="Elo Tecnologia" />
      </div>
    </main>
    <script>
      window.setTimeout(function () {
        window.location.replace(${JSON.stringify(appUrl)});
      }, 1600);
    </script>
  </body>
</html>
`
}

/**
 * Atalho com logos São Luiz + Elo.
 * Celular: abre a página do atalho no site (download de arquivo costuma falhar).
 * Desktop: baixa 1 HTML e abre a mesma página com as logos.
 */
export function downloadAppLauncher() {
  const appUrl = appLaunchUrl()
  const launcherPageUrl = appLauncherPageUrl()
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (!isMobile) {
    triggerDownload(
      new Blob([brandedLauncherHtml(appUrl)], { type: 'text/html;charset=utf-8' }),
      'Editor-Sao-Luiz.html',
    )
  }

  window.location.assign(launcherPageUrl)
}
