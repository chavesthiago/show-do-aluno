import confetti from 'canvas-confetti'

const CORES = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#06d6a0']

export function confeteAcerto(): void {
  void confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 }, colors: CORES, disableForReducedMotion: true })
}

export function confeteVitoria(): void {
  const fim = Date.now() + 1800
  const rodar = () => {
    void confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors: CORES, disableForReducedMotion: true })
    void confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors: CORES, disableForReducedMotion: true })
    if (Date.now() < fim) requestAnimationFrame(rodar)
  }
  rodar()
}
