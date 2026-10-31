// Exportar e importar conteúdos do professor (arquivo .json)
// e reduzir fotos antes de salvar.

import type { ConteudoSalvo, DisciplinaId, Pergunta } from '../tipos'

interface ArquivoShow {
  app: 'show-do-aluno'
  versao: 1
  exportadoEm: string
  conteudos: ConteudoSalvo[]
}

function nomeDeArquivo(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function exportarConteudos(conteudos: ConteudoSalvo[], titulo?: string): void {
  const dados: ArquivoShow = { app: 'show-do-aluno', versao: 1, exportadoEm: new Date().toISOString(), conteudos }
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `show-do-aluno-${nomeDeArquivo(titulo ?? 'conteudos')}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const DISCIPLINAS_VALIDAS: DisciplinaId[] = ['portugues', 'matematica', 'ciencias', 'historia', 'geografia', 'ingles', 'artes', 'outra']

function perguntaValida(p: unknown): p is Pergunta {
  const q = p as Pergunta
  return (
    typeof q?.enunciado === 'string' &&
    Array.isArray(q.alternativas) &&
    (q.alternativas.length === 3 || q.alternativas.length === 4) &&
    q.alternativas.every((a) => typeof a === 'string') &&
    Number.isInteger(q.correta) &&
    q.correta >= 0 &&
    q.correta < q.alternativas.length
  )
}

/** Lê o arquivo e devolve só os conteúdos válidos */
export async function lerArquivoDeConteudos(arquivo: File): Promise<ConteudoSalvo[]> {
  const texto = await arquivo.text()
  const dados = JSON.parse(texto) as Partial<ArquivoShow>
  const lista = Array.isArray(dados.conteudos) ? dados.conteudos : []
  return lista
    .filter((c) => typeof c?.titulo === 'string' && Array.isArray(c.perguntas))
    .map((c) => ({
      id: typeof c.id === 'string' ? c.id : 'prof-' + Math.random().toString(36).slice(2),
      titulo: c.titulo.slice(0, 60),
      disciplina: DISCIPLINAS_VALIDAS.includes(c.disciplina) ? c.disciplina : 'outra',
      anos: Array.isArray(c.anos) ? c.anos.filter((a) => Number.isInteger(a)) : [],
      emoji: typeof c.emoji === 'string' ? c.emoji : '⭐',
      descricao: typeof c.descricao === 'string' ? c.descricao : undefined,
      perguntas: c.perguntas.filter(perguntaValida),
      atualizadoEm: new Date().toISOString(),
    }))
}

/** Reduz a foto para no máximo 480px (fica leve para salvar no aparelho) */
export function reduzirImagem(arquivo: File, maximo = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(arquivo)
    img.onload = () => {
      const escala = Math.min(1, maximo / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível abrir a imagem'))
    }
    img.src = url
  })
}
