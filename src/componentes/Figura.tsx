// Mostra a figura da pergunta: emoji, vários emojis (para contar) ou foto

function contarSimbolos(texto: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('pt-BR', { granularity: 'grapheme' })
    return [...seg.segment(texto)].filter((s) => s.segment.trim()).length
  }
  return [...texto].length
}

export function ehFoto(imagem?: string): boolean {
  return Boolean(imagem && (imagem.startsWith('data:') || imagem.startsWith('http')))
}

export function Figura({ imagem, tamanho = 'normal' }: { imagem?: string; tamanho?: 'normal' | 'pequena' }) {
  if (!imagem) return null
  if (ehFoto(imagem)) {
    return <img className={`figura figura-foto ${tamanho}`} src={imagem} alt="" draggable={false} />
  }
  const qtd = contarSimbolos(imagem)
  const classe = qtd > 6 ? 'figura-muitas' : qtd > 2 ? 'figura-varias' : ''
  return (
    <div className={`figura ${classe} ${tamanho}`} aria-hidden="true">
      {imagem}
    </div>
  )
}
