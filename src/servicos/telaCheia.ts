// Tela cheia: funciona no Android, tablets e computadores.
// No iPhone o navegador não permite; lá, instale o app na tela inicial.

type ElementoComWebkit = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }
type DocumentoComWebkit = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> }

export function telaCheiaDisponivel(): boolean {
  const el = document.documentElement as ElementoComWebkit
  return Boolean(el.requestFullscreen || el.webkitRequestFullscreen)
}

export function estaEmTelaCheia(): boolean {
  const d = document as DocumentoComWebkit
  return Boolean(d.fullscreenElement || d.webkitFullscreenElement)
}

export async function alternarTelaCheia(): Promise<void> {
  const d = document as DocumentoComWebkit
  const el = document.documentElement as ElementoComWebkit
  try {
    if (estaEmTelaCheia()) {
      await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.())
    } else {
      await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())
    }
  } catch {
    /* o navegador recusou: ignorar */
  }
}
