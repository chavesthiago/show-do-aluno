// Famílias silábicas (BNCC EF01LP / EF02LP02 – segmentar palavras em sílabas e
// identificar sílabas iniciais). As perguntas são montadas a partir de uma
// lista de palavras com figura. Para incluir palavras, basta editar a lista.

import type { Conteudo, Pergunta } from '../../tipos'
import { alternativasTexto, embaralhar } from '../../util/aleatorio'

interface Palavra {
  palavra: string
  emoji: string
}

const VOGAIS = ['A', 'E', 'I', 'O', 'U']

export const FAMILIAS: Record<string, Palavra[]> = {
  B: [
    { palavra: 'BOLA', emoji: '⚽' },
    { palavra: 'BANANA', emoji: '🍌' },
    { palavra: 'BOLO', emoji: '🎂' },
    { palavra: 'BEBÊ', emoji: '👶' },
    { palavra: 'BALEIA', emoji: '🐳' },
    { palavra: 'BOTA', emoji: '👢' },
    { palavra: 'BICICLETA', emoji: '🚲' },
    { palavra: 'BALÃO', emoji: '🎈' },
    { palavra: 'BÚSSOLA', emoji: '🧭' },
  ],
  C: [
    { palavra: 'CASA', emoji: '🏠' },
    { palavra: 'CAVALO', emoji: '🐴' },
    { palavra: 'COELHO', emoji: '🐰' },
    { palavra: 'CAMA', emoji: '🛏️' },
    { palavra: 'COBRA', emoji: '🐍' },
    { palavra: 'CAMELO', emoji: '🐫' },
    { palavra: 'CORAÇÃO', emoji: '❤️' },
    { palavra: 'CENOURA', emoji: '🥕' },
    { palavra: 'CEBOLA', emoji: '🧅' },
    { palavra: 'CEREJA', emoji: '🍒' },
  ],
  D: [
    { palavra: 'DADO', emoji: '🎲' },
    { palavra: 'DENTE', emoji: '🦷' },
    { palavra: 'DEDO', emoji: '☝️' },
    { palavra: 'DINOSSAURO', emoji: '🦕' },
    { palavra: 'DOCE', emoji: '🍬' },
    { palavra: 'DIAMANTE', emoji: '💎' },
    { palavra: 'DINHEIRO', emoji: '💵' },
  ],
  F: [
    { palavra: 'FOGO', emoji: '🔥' },
    { palavra: 'FOCA', emoji: '🦭' },
    { palavra: 'FADA', emoji: '🧚' },
    { palavra: 'FOGUETE', emoji: '🚀' },
    { palavra: 'FOLHA', emoji: '🍃' },
    { palavra: 'FEIJÃO', emoji: '🫘' },
    { palavra: 'FITA', emoji: '🎀' },
  ],
  G: [
    { palavra: 'GATO', emoji: '🐱' },
    { palavra: 'GALO', emoji: '🐓' },
    { palavra: 'GALINHA', emoji: '🐔' },
    { palavra: 'GOTA', emoji: '💧' },
    { palavra: 'GORILA', emoji: '🦍' },
    { palavra: 'GELO', emoji: '🧊' },
    { palavra: 'GIRAFA', emoji: '🦒' },
  ],
  L: [
    { palavra: 'LUA', emoji: '🌙' },
    { palavra: 'LEÃO', emoji: '🦁' },
    { palavra: 'LIMÃO', emoji: '🍋' },
    { palavra: 'LOBO', emoji: '🐺' },
    { palavra: 'LÁPIS', emoji: '✏️' },
    { palavra: 'LATA', emoji: '🥫' },
    { palavra: 'LIVRO', emoji: '📖' },
    { palavra: 'LUVA', emoji: '🧤' },
    { palavra: 'LAGARTA', emoji: '🐛' },
  ],
  M: [
    { palavra: 'MAÇÃ', emoji: '🍎' },
    { palavra: 'MACACO', emoji: '🐒' },
    { palavra: 'MALA', emoji: '🧳' },
    { palavra: 'MELANCIA', emoji: '🍉' },
    { palavra: 'MILHO', emoji: '🌽' },
    { palavra: 'MOTO', emoji: '🏍️' },
    { palavra: 'MOCHILA', emoji: '🎒' },
    { palavra: 'MÚSICA', emoji: '🎵' },
  ],
  N: [
    { palavra: 'NAVIO', emoji: '🚢' },
    { palavra: 'NARIZ', emoji: '👃' },
    { palavra: 'NUVEM', emoji: '☁️' },
    { palavra: 'NEVE', emoji: '❄️' },
    { palavra: 'NOVE', emoji: '9️⃣' },
    { palavra: 'NOVELO', emoji: '🧶' },
  ],
  P: [
    { palavra: 'PATO', emoji: '🦆' },
    { palavra: 'PIPOCA', emoji: '🍿' },
    { palavra: 'PIRULITO', emoji: '🍭' },
    { palavra: 'PERA', emoji: '🍐' },
    { palavra: 'PAPAGAIO', emoji: '🦜' },
    { palavra: 'PIPA', emoji: '🪁' },
    { palavra: 'PUDIM', emoji: '🍮' },
    { palavra: 'PIANO', emoji: '🎹' },
  ],
  R: [
    { palavra: 'RATO', emoji: '🐭' },
    { palavra: 'RELÓGIO', emoji: '⌚' },
    { palavra: 'RAPOSA', emoji: '🦊' },
    { palavra: 'ROSA', emoji: '🌹' },
    { palavra: 'RIO', emoji: '🏞️' },
    { palavra: 'RUA', emoji: '🛣️' },
    { palavra: 'RINOCERONTE', emoji: '🦏' },
  ],
  S: [
    { palavra: 'SAPO', emoji: '🐸' },
    { palavra: 'SAPATO', emoji: '👞' },
    { palavra: 'SINO', emoji: '🔔' },
    { palavra: 'SUCO', emoji: '🧃' },
    { palavra: 'SOFÁ', emoji: '🛋️' },
    { palavra: 'SEREIA', emoji: '🧜‍♀️' },
    { palavra: 'SACOLA', emoji: '🛍️' },
  ],
  T: [
    { palavra: 'TOMATE', emoji: '🍅' },
    { palavra: 'TELEFONE', emoji: '☎️' },
    { palavra: 'TIGRE', emoji: '🐯' },
    { palavra: 'TUBARÃO', emoji: '🦈' },
    { palavra: 'TELEVISÃO', emoji: '📺' },
    { palavra: 'TOMADA', emoji: '🔌' },
    { palavra: 'TESOURA', emoji: '✂️' },
  ],
  V: [
    { palavra: 'VACA', emoji: '🐮' },
    { palavra: 'VELA', emoji: '🕯️' },
    { palavra: 'VIOLÃO', emoji: '🎸' },
    { palavra: 'VOVÓ', emoji: '👵' },
    { palavra: 'VIOLINO', emoji: '🎻' },
    { palavra: 'VASSOURA', emoji: '🧹' },
  ],
}

/** Remove acentos: "BÚ" → "BU" */
function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Primeira sílaba (todas as palavras da lista começam com consoante + vogal) */
export function silabaInicial(palavra: string): string {
  return semAcento(palavra.slice(0, 2))
}

/** Sílabas com o mesmo som (não podem aparecer juntas como certa e errada) */
const MESMO_SOM: Record<string, string> = { CE: 'SE', CI: 'SI', SE: 'CE', SI: 'CI' }

function somParecido(a: string, b: string): boolean {
  return a === b || MESMO_SOM[a] === b
}

const TODAS_AS_PALAVRAS = Object.values(FAMILIAS).flat()

function perguntasDaFamilia(letra: string): Pergunta[] {
  const lista = FAMILIAS[letra]
  const silabasDaFamilia = VOGAIS.map((v) => letra + v)
  const perguntas: Pergunta[] = []

  lista.forEach((p, i) => {
    const silaba = silabaInicial(p.palavra)
    const outrasSilabas = silabasDaFamilia.filter((s) => s !== silaba)

    // Tipo 1 – olhar a figura e escolher a sílaba inicial
    const t1 = alternativasTexto(silaba, outrasSilabas)
    perguntas.push({
      id: `fam-${letra}-${i}-figura`,
      enunciado: 'Com qual sílaba começa o nome desta figura?',
      imagem: p.emoji,
      ...t1,
      dica: `Fale bem devagar o nome da figura e preste atenção no primeiro pedacinho.`,
      dificuldade: 1,
    })

    // Tipo 2 – ler as palavras e achar a que começa com a sílaba
    const erradas = embaralhar(
      TODAS_AS_PALAVRAS.filter((o) => !somParecido(silabaInicial(o.palavra), silaba)).filter(
        (o) => silabaInicial(o.palavra)[1] === silaba[1] || Math.random() < 0.3,
      ),
    ).map((o) => o.palavra)
    const t2 = alternativasTexto(p.palavra, erradas)
    perguntas.push({
      id: `fam-${letra}-${i}-palavra`,
      enunciado: `Qual palavra começa com ${silaba}?`,
      ...t2,
      dica: `Procure a palavra que começa com as letras ${silaba.split('').join(' e ')}.`,
      dificuldade: 2,
    })

    // Tipo 3 – completar a palavra com a sílaba que falta
    const t3 = alternativasTexto(silaba, outrasSilabas)
    perguntas.push({
      id: `fam-${letra}-${i}-completar`,
      enunciado: 'Qual sílaba completa a palavra?',
      imagem: p.emoji,
      destaque: '__' + p.palavra.slice(2),
      ...t3,
      dica: 'Olhe a figura e leia a palavra inteira com cada sílaba.',
      dificuldade: 2,
    })
  })
  return perguntas
}

const CORES_EMOJI: Record<string, string> = {
  B: '🎈', C: '🏠', D: '🎲', F: '🚀', G: '🐱', L: '🦁', M: '🐒', N: '☁️', P: '🦆', R: '🐭', S: '🐸', T: '🍅', V: '🐮',
}

export const conteudosFamilias: Conteudo[] = Object.keys(FAMILIAS).map((letra) => ({
  id: `familia-${letra.toLowerCase()}`,
  titulo: `Família do ${letra}`,
  disciplina: 'portugues',
  anos: [2, 3],
  emoji: CORES_EMOJI[letra] ?? '🔤',
  descricao: VOGAIS.map((v) => letra + v).join(' · '),
  bncc: 'EF02LP02',
  perguntas: perguntasDaFamilia(letra),
}))
