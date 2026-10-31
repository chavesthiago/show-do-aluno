import type { Conteudo, ConteudoSalvo, Pergunta } from '../tipos'
import { embaralhar } from '../util/aleatorio'
import { conteudosFamilias } from './portugues/familias'
import { conteudosLinguagem } from './portugues/linguagem'
import { conteudosMatematica } from './matematica'

/** Conteúdos que já vêm com o jogo */
export const CONTEUDOS_PRONTOS: Conteudo[] = [
  ...conteudosLinguagem.slice(0, 1), // Vogais primeiro
  ...conteudosFamilias,
  ...conteudosLinguagem.slice(1),
  ...conteudosMatematica,
]

export function conteudoDoProfessor(c: ConteudoSalvo): Conteudo {
  return { ...c, doProfessor: true }
}

/** Quantas perguntas o conteúdo oferece (geradores: ilimitado) */
export function totalDePerguntas(c: Conteudo): number | 'ilimitado' {
  return c.gerar ? 'ilimitado' : (c.perguntas?.length ?? 0)
}

/**
 * Prepara a partida: sorteia as perguntas e embaralha as alternativas,
 * ajustando o índice da resposta correta.
 */
export function prepararPerguntas(c: Conteudo, quantidade: number): Pergunta[] {
  const base = c.gerar ? c.gerar(quantidade) : embaralhar(c.perguntas ?? []).slice(0, quantidade)
  return base.map((p) => {
    const ordem = embaralhar([0, 1, 2, 3])
    return {
      ...p,
      alternativas: ordem.map((i) => p.alternativas[i]) as Pergunta['alternativas'],
      correta: ordem.indexOf(p.correta),
    }
  })
}
