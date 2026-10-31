// Efeitos sonoros criados na hora com a Web Audio API.
// Vantagem: não precisa de arquivos de áudio (nada de direitos autorais)
// e o app fica leve. Os sons são notas musicais simples.

let contexto: AudioContext | null = null
let ligado = true

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!contexto) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    contexto = new AC()
  }
  return contexto
}

/** Chamar em um toque/clique do usuário (necessário no iPhone/iPad) */
export function destravarAudio(): void {
  const c = ctx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  // toca um som mudo para "acordar" o áudio no iOS
  const o = c.createOscillator()
  const g = c.createGain()
  g.gain.value = 0
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.01)
}

export function definirSom(ativo: boolean): void {
  ligado = ativo
}

type Onda = OscillatorType

function nota(freq: number, inicio: number, duracao: number, volume = 0.18, onda: Onda = 'triangle'): void {
  const c = ctx()
  if (!c || !ligado) return
  const t = c.currentTime + inicio
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = onda
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(volume, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duracao)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + duracao + 0.05)
}

// Frequências das notas (Hz)
const DO = 523.25, MI = 659.25, SOL = 783.99, DO2 = 1046.5, RE = 587.33, LA = 880, FA = 698.46

export const sons = {
  clique() {
    nota(880, 0, 0.08, 0.08, 'sine')
  },
  selecionar() {
    nota(660, 0, 0.1, 0.12, 'square')
  },
  acerto() {
    ;[DO, MI, SOL, DO2].forEach((f, i) => nota(f, i * 0.09, 0.35, 0.2))
    nota(DO2 * 1.5, 0.38, 0.5, 0.1, 'sine')
  },
  erro() {
    // som gentil, sem "buzina"
    nota(392, 0, 0.25, 0.15, 'sine')
    nota(330, 0.2, 0.4, 0.15, 'sine')
  },
  suspense(duracao = 1.4) {
    const passos = Math.floor(duracao / 0.12)
    for (let i = 0; i < passos; i++) nota(i % 2 ? 196 : 220, i * 0.12, 0.08, 0.06 + i * 0.006, 'square')
  },
  pular() {
    const c = ctx()
    if (!c || !ligado) return
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(300, t)
    o.frequency.exponentialRampToValueAtTime(1200, t + 0.25)
    g.gain.setValueAtTime(0.12, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
    o.connect(g).connect(c.destination)
    o.start(t)
    o.stop(t + 0.32)
  },
  ajuda() {
    ;[SOL, LA, SOL, DO2].forEach((f, i) => nota(f, i * 0.08, 0.15, 0.12, 'sine'))
  },
  vitoria() {
    const melodia = [DO, MI, SOL, DO2, SOL, DO2]
    const tempos = [0, 0.12, 0.24, 0.36, 0.6, 0.72]
    melodia.forEach((f, i) => nota(f, tempos[i], i === melodia.length - 1 ? 0.9 : 0.2, 0.2))
    nota(FA, 0.6, 0.3, 0.08)
    nota(RE * 2, 0.72, 0.9, 0.08)
  },
  inicio() {
    ;[SOL, DO2].forEach((f, i) => nota(f, i * 0.12, 0.3, 0.16))
  },
}
