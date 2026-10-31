// Tipos principais do Show do Aluno

export type DisciplinaId =
  | 'portugues'
  | 'matematica'
  | 'ciencias'
  | 'historia'
  | 'geografia'
  | 'ingles'
  | 'artes'
  | 'outra'

export interface Pergunta {
  id: string
  /** Texto da pergunta mostrado na tela */
  enunciado: string
  /** Texto lido pela narração (quando diferente do enunciado) */
  fala?: string
  /** Emoji, texto curto (ex.: "__TO") ou imagem (data:... ou https://...) */
  imagem?: string
  /** Texto grande que aparece junto da figura (ex.: "__TO", "7 + 5") */
  destaque?: string
  /** Sempre 4 alternativas */
  alternativas: [string, string, string, string]
  /** Índice da alternativa correta (0 a 3) */
  correta: number
  /** Dica usada na "Ajuda do Professor" */
  dica?: string
  /** 1 = fácil, 2 = médio, 3 = difícil */
  dificuldade?: 1 | 2 | 3
}

export interface Conteudo {
  id: string
  titulo: string
  disciplina: DisciplinaId
  /** Anos escolares indicados (2 = 2º ano ... 7 = 7º ano) */
  anos: number[]
  emoji: string
  descricao?: string
  /** Habilidade da BNCC relacionada (referência para o professor) */
  bncc?: string
  /** Conteúdos fixos têm a lista pronta de perguntas */
  perguntas?: Pergunta[]
  /** Conteúdos de Matemática geram perguntas novas a cada partida */
  gerar?: (quantidade: number) => Pergunta[]
  /** true quando foi criado pelo professor na Área do Professor */
  doProfessor?: boolean
}

/** Formato salvo no aparelho e usado em exportação/importação */
export interface ConteudoSalvo {
  id: string
  titulo: string
  disciplina: DisciplinaId
  anos: number[]
  emoji: string
  descricao?: string
  perguntas: Pergunta[]
  atualizadoEm: string
}
