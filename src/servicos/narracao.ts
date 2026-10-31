// Narração com a voz sintética do navegador (Web Speech API).
// Funciona sem internet na maioria dos aparelhos e não tem custo.

let vozEscolhida: SpeechSynthesisVoice | null = null
let ligada = true

const suportado = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Prefere vozes em português do Brasil com melhor qualidade */
function escolherVoz(): void {
  if (!suportado) return
  const vozes = window.speechSynthesis.getVoices()
  const ptBR = vozes.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('pt-br'))
  const pt = vozes.filter((v) => v.lang.toLowerCase().startsWith('pt'))
  const preferidas = ['Luciana', 'Francisca', 'Google português do Brasil', 'Thalita', 'Maria', 'Daniel']
  vozEscolhida =
    ptBR.find((v) => preferidas.some((p) => v.name.includes(p))) ?? ptBR[0] ?? pt[0] ?? null
}

if (suportado) {
  escolherVoz()
  // No Chrome as vozes carregam depois
  window.speechSynthesis.addEventListener?.('voiceschanged', escolherVoz)
}

export function narracaoDisponivel(): boolean {
  return suportado
}

export function definirNarracao(ativa: boolean): void {
  ligada = ativa
  if (!ativa) parar()
}

export function falar(texto: string, forcar = false): void {
  if (!suportado || (!ligada && !forcar) || !texto.trim()) return
  const sintese = window.speechSynthesis
  sintese.cancel()
  if (!vozEscolhida) escolherVoz()
  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  if (vozEscolhida) fala.voice = vozEscolhida
  fala.rate = 0.92
  fala.pitch = 1.05
  sintese.speak(fala)
}

export function parar(): void {
  if (suportado) window.speechSynthesis.cancel()
}

/** No iPhone a voz só funciona depois de um toque: chamar no botão "Começar" */
export function destravarNarracao(): void {
  if (!suportado) return
  const u = new SpeechSynthesisUtterance(' ')
  u.volume = 0
  window.speechSynthesis.speak(u)
}

/** Troca símbolos por palavras para a voz ler direito */
export function textoParaFala(texto: string): string {
  return texto
    .replace(/×/g, ' vezes ')
    .replace(/÷/g, ' dividido por ')
    .replace(/−/g, ' menos ')
    .replace(/\+/g, ' mais ')
    .replace(/R\$\s?0,(\d\d)/g, '$1 centavos')
    .replace(/R\$\s?1,00/g, '1 real')
    .replace(/R\$\s?(\d+),00/g, '$1 reais')
    .replace(/R\$\s?(\d+),(\d\d)/g, '$1 reais e $2 centavos')
    .replace(/_{2,}/g, ' ... ')
    .replace(/—/g, '')
}
