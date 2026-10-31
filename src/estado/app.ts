// Estado central do aplicativo (Zustand).
// Aqui ficam: tela atual, configurações, partida em andamento,
// recordes e os conteúdos criados pelo professor.

import { create } from 'zustand'
import type { Conteudo, ConteudoSalvo, Pergunta } from '../tipos'
import { ler, gravar } from '../servicos/armazenamento'
import { prepararPerguntas } from '../dados/catalogo'
import { definirSom } from '../servicos/sons'
import { definirNarracao } from '../servicos/narracao'

export type Tela = 'abertura' | 'menu' | 'conteudos' | 'jogo' | 'resultado' | 'professor'

export interface Config {
  som: boolean
  narracao: boolean
  /** lê pergunta e alternativas automaticamente */
  narrarAlternativas: boolean
  poucaAnimacao: boolean
}

export type Resultado = 'certo' | 'errado' | 'pulou'

export interface Partida {
  conteudo: Conteudo
  perguntas: Pergunta[]
  indice: number
  pontos: number
  sequencia: number
  resultados: Resultado[]
  ajudas: { pular: boolean; eliminar: boolean; professor: boolean }
  eliminadas: number[]
  escolhida: number | null
  fase: 'pergunta' | 'suspense' | 'revelada'
}

interface Estado {
  tela: Tela
  config: Config
  partida: Partida | null
  recordes: Record<string, number>
  conteudosProfessor: ConteudoSalvo[]

  irPara: (tela: Tela) => void
  alterarConfig: (mudanca: Partial<Config>) => void

  iniciarPartida: (conteudo: Conteudo, quantidade: number) => void
  escolher: (indice: number) => void
  revelar: () => void
  proxima: () => void
  pular: () => void
  eliminarDuas: () => void
  usarAjudaProfessor: () => void

  salvarConteudo: (c: ConteudoSalvo) => boolean
  excluirConteudo: (id: string) => void
  importarConteudos: (lista: ConteudoSalvo[]) => number
}

const CONFIG_PADRAO: Config = {
  som: true,
  narracao: true,
  narrarAlternativas: false,
  poucaAnimacao: false,
}

const configInicial = { ...CONFIG_PADRAO, ...ler<Partial<Config>>('config', {}) }
definirSom(configInicial.som)
definirNarracao(configInicial.narracao)

export const PONTOS_POR_ACERTO = 100

export const useApp = create<Estado>((set, get) => ({
  tela: 'abertura',
  config: configInicial,
  partida: null,
  recordes: ler('recordes', {}),
  conteudosProfessor: ler('conteudos-professor', []),

  irPara: (tela) => set({ tela }),

  alterarConfig: (mudanca) => {
    const config = { ...get().config, ...mudanca }
    definirSom(config.som)
    definirNarracao(config.narracao)
    gravar('config', config)
    set({ config })
  },

  iniciarPartida: (conteudo, quantidade) => {
    const perguntas = prepararPerguntas(conteudo, quantidade)
    if (perguntas.length === 0) return
    set({
      tela: 'jogo',
      partida: {
        conteudo,
        perguntas,
        indice: 0,
        pontos: 0,
        sequencia: 0,
        resultados: [],
        ajudas: { pular: true, eliminar: true, professor: true },
        eliminadas: [],
        escolhida: null,
        fase: 'pergunta',
      },
    })
  },

  escolher: (indice) => {
    const p = get().partida
    if (!p || p.fase !== 'pergunta' || p.eliminadas.includes(indice)) return
    set({ partida: { ...p, escolhida: indice, fase: 'suspense' } })
  },

  revelar: () => {
    const p = get().partida
    if (!p || p.fase !== 'suspense' || p.escolhida === null) return
    const certa = p.perguntas[p.indice].correta === p.escolhida
    const sequencia = certa ? p.sequencia + 1 : 0
    const bonus = certa ? Math.min(sequencia - 1, 5) * 20 : 0
    set({
      partida: {
        ...p,
        fase: 'revelada',
        sequencia,
        pontos: p.pontos + (certa ? PONTOS_POR_ACERTO + bonus : 0),
        resultados: [...p.resultados, certa ? 'certo' : 'errado'],
      },
    })
  },

  proxima: () => {
    const p = get().partida
    if (!p) return
    if (p.indice + 1 >= p.perguntas.length) {
      // fim de jogo: atualiza recorde
      const recordes = { ...get().recordes }
      if ((recordes[p.conteudo.id] ?? 0) < p.pontos) {
        recordes[p.conteudo.id] = p.pontos
        gravar('recordes', recordes)
      }
      set({ tela: 'resultado', recordes })
      return
    }
    set({ partida: { ...p, indice: p.indice + 1, escolhida: null, eliminadas: [], fase: 'pergunta' } })
  },

  pular: () => {
    const p = get().partida
    if (!p || !p.ajudas.pular || p.fase !== 'pergunta') return
    set({
      partida: {
        ...p,
        ajudas: { ...p.ajudas, pular: false },
        resultados: [...p.resultados, 'pulou'],
        fase: 'revelada',
        escolhida: null,
      },
    })
    get().proxima()
  },

  eliminarDuas: () => {
    const p = get().partida
    if (!p || !p.ajudas.eliminar || p.fase !== 'pergunta') return
    const correta = p.perguntas[p.indice].correta
    const erradas = [0, 1, 2, 3].filter((i) => i !== correta).sort(() => Math.random() - 0.5).slice(0, 2)
    set({ partida: { ...p, eliminadas: erradas, ajudas: { ...p.ajudas, eliminar: false } } })
  },

  usarAjudaProfessor: () => {
    const p = get().partida
    if (!p || !p.ajudas.professor || p.fase !== 'pergunta') return
    set({ partida: { ...p, ajudas: { ...p.ajudas, professor: false } } })
  },

  salvarConteudo: (c) => {
    const lista = get().conteudosProfessor.filter((x) => x.id !== c.id)
    const nova = [{ ...c, atualizadoEm: new Date().toISOString() }, ...lista]
    const ok = gravar('conteudos-professor', nova)
    if (ok) set({ conteudosProfessor: nova })
    return ok
  },

  excluirConteudo: (id) => {
    const nova = get().conteudosProfessor.filter((x) => x.id !== id)
    gravar('conteudos-professor', nova)
    set({ conteudosProfessor: nova })
  },

  importarConteudos: (lista) => {
    const atuais = get().conteudosProfessor
    const ids = new Set(atuais.map((c) => c.id))
    const novos = lista.map((c) => (ids.has(c.id) ? { ...c, id: novoId() } : c))
    const resultado = [...novos, ...atuais]
    if (!gravar('conteudos-professor', resultado)) return 0
    set({ conteudosProfessor: resultado })
    return novos.length
  },
}))

export function novoId(): string {
  return 'prof-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
