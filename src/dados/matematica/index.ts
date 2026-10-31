// Conteúdos de Matemática.
// A maioria usa "geradores": a cada partida o jogo cria contas novas,
// então as perguntas nunca se repetem do mesmo jeito.

import type { Conteudo, Pergunta } from '../../tipos'
import { alternativasNumericas, alternativasTexto, escolher, inteiro } from '../../util/aleatorio'

type Gerador = () => Omit<Pergunta, 'id'>

/** Repete o gerador até ter a quantidade pedida, sem repetir enunciados */
function criarConteudo(prefixo: string, gerador: Gerador) {
  return (quantidade: number): Pergunta[] => {
    const vistos = new Set<string>()
    const lista: Pergunta[] = []
    let tentativas = 0
    while (lista.length < quantidade && tentativas < quantidade * 30) {
      tentativas++
      const p = gerador()
      const chave = p.enunciado + (p.destaque ?? '') + (p.imagem ?? '')
      if (vistos.has(chave)) continue
      vistos.add(chave)
      lista.push({ ...p, id: `${prefixo}-${lista.length + 1}-${Date.now()}` })
    }
    return lista
  }
}

const FRUTAS = ['🍎', '🍌', '🍓', '🍊', '🍇', '🍐', '⭐', '🎈', '🐟', '🌸', '⚽', '🐥']
const NOMES = ['Ana', 'Pedro', 'Lucas', 'Júlia', 'Davi', 'Laura', 'Miguel', 'Sofia', 'Gabriel', 'Helena', 'Arthur', 'Alice']

/** 3/4 → "três quartos"; 1/2 → "um meio" */
function fracaoPorExtenso(num: number, den: number): string {
  const numeros = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco']
  const partes: Record<number, string> = { 2: 'meio', 3: 'terço', 4: 'quarto', 5: 'quinto', 10: 'décimo' }
  const parte = partes[den] ?? `${den} avos`
  return `${numeros[num] ?? num} ${parte}${num > 1 && partes[den] ? 's' : ''}`
}

function reais(valor: number): string {
  return 'R$ ' + valor.toFixed(2).replace('.', ',')
}

// ---------- 2º ano ----------

const contagem: Gerador = () => {
  const n = inteiro(3, 12)
  const emoji = escolher(FRUTAS)
  return {
    enunciado: 'Quantos desenhos há na figura?',
    imagem: emoji.repeat(n),
    ...alternativasNumericas(n, { espalhar: 3, minimo: 1 }),
    dica: 'Conte apontando um por um, bem devagar.',
    dificuldade: 1,
  }
}

const vizinhos: Gerador = () => {
  const n = inteiro(5, 99)
  const depois = Math.random() < 0.5
  const resposta = depois ? n + 1 : n - 1
  return {
    enunciado: depois ? `Qual número vem logo DEPOIS do ${n}?` : `Qual número vem logo ANTES do ${n}?`,
    destaque: depois ? `${n}, ?` : `?, ${n}`,
    ...alternativasNumericas(resposta, { candidatos: [n, depois ? n - 1 : n + 1, n + 10, n - 10], minimo: 0 }),
    dica: depois ? 'Depois é o número que vem em seguida, um a mais.' : 'Antes é o número que vem primeiro, um a menos.',
    dificuldade: 1,
  }
}

const parImpar: Gerador = () => {
  const querPar = Math.random() < 0.5
  const certo = inteiro(1, 49) * 2 + (querPar ? 0 : 1)
  const erradas = new Set<number>()
  while (erradas.size < 3) erradas.add(inteiro(1, 49) * 2 + (querPar ? 1 : 0))
  const r = alternativasTexto(String(certo), [...erradas].map(String))
  return {
    enunciado: querPar ? 'Qual destes números é PAR?' : 'Qual destes números é ÍMPAR?',
    imagem: querPar ? '👫' : '🧍',
    ...r,
    dica: 'Números pares terminam em 0, 2, 4, 6 ou 8.',
    dificuldade: 1,
  }
}

const adicao20: Gerador = () => {
  const a = inteiro(1, 10)
  const b = inteiro(1, 10)
  const emoji = escolher(FRUTAS)
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${a} mais ${b}?`,
    destaque: `${a} + ${b}`,
    imagem: a + b <= 12 ? emoji.repeat(a) + ' ➕ ' + emoji.repeat(b) : undefined,
    ...alternativasNumericas(a + b, { espalhar: 3, minimo: 0, candidatos: [a + b + 1, a + b - 1, Math.abs(a - b)] }),
    dica: 'Comece pelo número maior e conte para frente.',
    dificuldade: 1,
  }
}

const subtracao20: Gerador = () => {
  const a = inteiro(5, 20)
  const b = inteiro(1, a)
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${a} menos ${b}?`,
    destaque: `${a} − ${b}`,
    ...alternativasNumericas(a - b, { espalhar: 3, minimo: 0, candidatos: [a + b, a - b + 1] }),
    dica: 'Comece no número maior e conte para trás.',
    dificuldade: 1,
  }
}

// ---------- 3º ano ----------

const adicaoSub100: Gerador = () => {
  if (Math.random() < 0.5) {
    const a = inteiro(10, 60)
    const b = inteiro(5, 39)
    return {
      enunciado: 'Quanto é?',
      fala: `Quanto é ${a} mais ${b}?`,
      destaque: `${a} + ${b}`,
      ...alternativasNumericas(a + b, { espalhar: 10, candidatos: [a + b + 10, a + b - 10, a + b + 1] }),
      dica: 'Some primeiro as dezenas e depois as unidades.',
      dificuldade: 2,
    }
  }
  const a = inteiro(30, 99)
  const b = inteiro(5, a - 5)
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${a} menos ${b}?`,
    destaque: `${a} − ${b}`,
    ...alternativasNumericas(a - b, { espalhar: 10, candidatos: [a - b + 10, a - b - 10, a - b + 1] }),
    dica: 'Tire primeiro as dezenas e depois as unidades.',
    dificuldade: 2,
  }
}

const dobroMetade: Gerador = () => {
  const tipo = escolher(['dobro', 'triplo', 'metade'] as const)
  if (tipo === 'metade') {
    const n = inteiro(2, 25) * 2
    return {
      enunciado: `Qual é a METADE de ${n}?`,
      imagem: '🍫',
      ...alternativasNumericas(n / 2, { espalhar: 3, minimo: 1, candidatos: [n * 2, n / 2 + 1] }),
      dica: 'Metade é dividir em duas partes iguais.',
      dificuldade: 2,
    }
  }
  const n = inteiro(2, 15)
  const fator = tipo === 'dobro' ? 2 : 3
  return {
    enunciado: `Qual é o ${tipo.toUpperCase()} de ${n}?`,
    imagem: tipo === 'dobro' ? '✌️' : '🔱',
    ...alternativasNumericas(n * fator, { espalhar: 4, minimo: 1, candidatos: [n + fator, n * (fator === 2 ? 3 : 2)] }),
    dica: tipo === 'dobro' ? 'Dobro é somar o número com ele mesmo.' : 'Triplo é somar o número três vezes.',
    dificuldade: 2,
  }
}

const tabuada: Gerador = () => {
  const a = inteiro(2, 10)
  const b = inteiro(1, 10)
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${a} vezes ${b}?`,
    destaque: `${a} × ${b}`,
    ...alternativasNumericas(a * b, { minimo: 0, candidatos: [a * (b + 1), a * (b - 1), (a + 1) * b, a + b] }),
    dica: `Pense em ${b} grupos de ${a}.`,
    dificuldade: 2,
  }
}

const problemas: Gerador = () => {
  const nome = escolher(NOMES)
  const tipo = inteiro(1, 4)
  if (tipo === 1) {
    const a = inteiro(5, 40)
    const b = inteiro(3, 30)
    return {
      enunciado: `${nome} tinha ${a} figurinhas e ganhou mais ${b}. Com quantas ficou?`,
      imagem: '🃏',
      ...alternativasNumericas(a + b, { espalhar: 6, candidatos: [Math.abs(a - b)] }),
      dica: 'Ganhar é juntar: é uma conta de mais.',
      dificuldade: 2,
    }
  }
  if (tipo === 2) {
    const a = inteiro(10, 40)
    const b = inteiro(2, a - 2)
    return {
      enunciado: `Havia ${a} pássaros em uma árvore. ${b} voaram. Quantos ficaram?`,
      imagem: '🐦',
      ...alternativasNumericas(a - b, { espalhar: 5, candidatos: [a + b] }),
      dica: 'Se alguns foram embora, a conta é de menos.',
      dificuldade: 2,
    }
  }
  if (tipo === 3) {
    const a = inteiro(2, 9)
    const b = inteiro(2, 9)
    return {
      enunciado: `Cada caixa tem ${a} lápis. Quantos lápis há em ${b} caixas?`,
      imagem: '✏️',
      ...alternativasNumericas(a * b, { candidatos: [a + b, a * (b + 1)] }),
      dica: 'Grupos iguais: use a multiplicação.',
      dificuldade: 3,
    }
  }
  const b = inteiro(2, 6)
  const q = inteiro(2, 8)
  return {
    enunciado: `${nome} dividiu ${b * q} balas igualmente entre ${b} amigos. Quantas cada um recebeu?`,
    imagem: '🍬',
    ...alternativasNumericas(q, { espalhar: 3, minimo: 1, candidatos: [b * q - b] }),
    dica: 'Dividir igualmente é uma conta de divisão.',
    dificuldade: 3,
  }
}

const dinheiro: Gerador = () => {
  const tipo = inteiro(1, 3)
  if (tipo === 1) {
    const a = inteiro(2, 20)
    const b = inteiro(1, 15)
    return {
      enunciado: `Um lanche custa ${reais(a)} e um suco custa ${reais(b)}. Quanto custam os dois juntos?`,
      imagem: '🥪🧃',
      ...alternativasNumericas(a + b, { espalhar: 4, minimo: 1, formatar: reais, candidatos: [Math.abs(a - b)] }),
      dica: 'Junte os dois valores.',
      dificuldade: 2,
    }
  }
  if (tipo === 2) {
    const nota = escolher([10, 20, 50])
    const preco = inteiro(2, nota - 1)
    return {
      enunciado: `Paguei um brinquedo de ${reais(preco)} com uma nota de ${reais(nota)}. Quanto recebi de troco?`,
      imagem: '🧸💵',
      ...alternativasNumericas(nota - preco, { espalhar: 4, minimo: 1, formatar: reais, candidatos: [nota + preco] }),
      dica: 'Troco é o que sobra: valor pago menos o preço.',
      dificuldade: 2,
    }
  }
  const moedas = inteiro(2, 8)
  const valor = escolher([0.5, 0.25, 0.1])
  const total = Math.round(moedas * valor * 100) / 100
  const errados = [moedas * 0.5, moedas * 0.25, moedas * 0.1, moedas * 1].map((v) => Math.round(v * 100) / 100).filter((v) => v !== total)
  const r = alternativasTexto(reais(total), errados.map(reais))
  return {
    enunciado: `Quanto valem ${moedas} moedas de ${reais(valor)}?`,
    imagem: '🪙'.repeat(Math.min(moedas, 8)),
    ...r,
    dica: 'Some o valor de cada moeda.',
    dificuldade: 3,
  }
}

// ---------- 4º e 5º anos ----------

const divisao: Gerador = () => {
  const b = inteiro(2, 10)
  const q = inteiro(1, 10)
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${b * q} dividido por ${b}?`,
    destaque: `${b * q} ÷ ${b}`,
    ...alternativasNumericas(q, { espalhar: 3, minimo: 0, candidatos: [q + 1, q - 1, b] }),
    dica: `Pense: ${b} vezes quanto dá ${b * q}?`,
    dificuldade: 2,
  }
}

const fracoes: Gerador = () => {
  if (Math.random() < 0.5) {
    const total = escolher([4, 5, 6, 8, 10])
    const comidos = inteiro(1, total - 1)
    const certa = `${comidos}/${total}`
    const r = alternativasTexto(certa, [`${total}/${comidos}`, `${total - comidos}/${total}`, `${comidos}/${total + 1}`, `${comidos}/${total - comidos}`])
    return {
      enunciado: `Uma pizza foi dividida em ${total} pedaços iguais. Comi ${comidos}. Que fração da pizza eu comi?`,
      imagem: '🍕',
      ...r,
      dica: 'Embaixo vai o total de pedaços; em cima, os pedaços que comi.',
      dificuldade: 3,
    }
  }
  const [num, den] = escolher([
    [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4], [1, 10],
  ] as const)
  const k = inteiro(2, 10)
  const n = den * k // n sempre divide certinho pelo denominador
  const resposta = num * k
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${fracaoPorExtenso(num, den)} de ${n}?`,
    destaque: `${num}/${den} de ${n}`,
    imagem: '🍫',
    ...alternativasNumericas(resposta, { espalhar: 3, minimo: 1, candidatos: [k, n - resposta, n / num] }),
    dica: `Divida ${n} por ${den} e depois multiplique por ${num}.`,
    dificuldade: 3,
  }
}

const decimais: Gerador = () => {
  const a = inteiro(1, 9) + inteiro(1, 9) / 10
  const b = inteiro(1, 9) + inteiro(1, 9) / 10
  const soma = Math.round((a + b) * 10) / 10
  const fmt = (n: number) => n.toFixed(1).replace('.', ',')
  const errados = [soma + 1, soma - 0.1, soma + 0.1, Math.round((soma - 1) * 10) / 10, soma + 10].map((v) => Math.round(v * 10) / 10).filter((v) => v > 0)
  const r = alternativasTexto(fmt(soma), errados.map(fmt))
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${fmt(a)} mais ${fmt(b)}?`,
    destaque: `${fmt(a)} + ${fmt(b)}`,
    ...r,
    dica: 'Some os décimos com os décimos e os inteiros com os inteiros. Vírgula embaixo de vírgula!',
    dificuldade: 3,
  }
}

// ---------- 6º e 7º anos ----------

const porcentagem: Gerador = () => {
  const p = escolher([10, 20, 25, 50, 75])
  const base = escolher(p === 25 || p === 75 ? [20, 40, 80, 100, 200] : [10, 20, 30, 40, 50, 60, 80, 100, 200, 500])
  const r = (p * base) / 100
  return {
    enunciado: 'Quanto é?',
    fala: `Quanto é ${p} por cento de ${base}?`,
    destaque: `${p}% de ${base}`,
    imagem: '💯',
    ...alternativasNumericas(r, { espalhar: 5, minimo: 1, candidatos: [base / 10, base / 2, base - r, p] }),
    dica: p === 50 ? '50% é a metade.' : p === 25 ? '25% é a quarta parte.' : '10% é dividir por 10.',
    dificuldade: 3,
  }
}

const expressoes: Gerador = () => {
  const a = inteiro(1, 20)
  const b = inteiro(2, 9)
  const c = inteiro(2, 9)
  if (Math.random() < 0.5) {
    return {
      enunciado: 'Qual é o resultado da expressão?',
      fala: `Qual é o resultado de ${a} mais ${b} vezes ${c}?`,
      destaque: `${a} + ${b} × ${c}`,
      ...alternativasNumericas(a + b * c, { candidatos: [(a + b) * c, a + b + c, a * b + c] }),
      dica: 'Primeiro a multiplicação, depois a adição!',
      dificuldade: 3,
    }
  }
  return {
    enunciado: 'Qual é o resultado da expressão?',
    fala: `Qual é o resultado de abre parênteses ${a} mais ${b} fecha parênteses vezes ${c}?`,
    destaque: `(${a} + ${b}) × ${c}`,
    ...alternativasNumericas((a + b) * c, { candidatos: [a + b * c, a + b + c] }),
    dica: 'Resolva primeiro o que está dentro dos parênteses.',
    dificuldade: 3,
  }
}

const potencias: Gerador = () => {
  const base = inteiro(2, 10)
  const exp = base <= 5 ? inteiro(2, 3) : 2
  const sobrescrito = exp === 2 ? '²' : '³'
  return {
    enunciado: 'Quanto vale a potência?',
    fala: `Quanto é ${base} elevado a ${exp}?`,
    destaque: `${base}${sobrescrito}`,
    ...alternativasNumericas(base ** exp, { candidatos: [base * exp, base + exp, base ** (exp === 2 ? 3 : 2)] }),
    dica: `Multiplique o ${base} por ele mesmo ${exp} vezes.`,
    dificuldade: 3,
  }
}

const inteiros: Gerador = () => {
  const a = inteiro(-10, 10)
  const b = inteiro(-10, 10)
  const fmt = (n: number) => (n < 0 ? `(${n})` : String(n))
  const soma = Math.random() < 0.5
  const resposta = soma ? a + b : a - b
  return {
    enunciado: 'Quanto é?',
    destaque: `${a} ${soma ? '+' : '−'} ${fmt(b)}`,
    imagem: '🌡️',
    ...alternativasNumericas(resposta, { minimo: -100, candidatos: [-resposta, soma ? a - b : a + b, resposta + 2] }),
    dica: 'Pense em um termômetro: números negativos ficam abaixo do zero.',
    dificuldade: 3,
  }
}

const equacoes: Gerador = () => {
  const x = inteiro(1, 15)
  if (Math.random() < 0.5) {
    const a = inteiro(1, 20)
    return {
      enunciado: 'Qual é o valor de x?',
      destaque: `x + ${a} = ${x + a}`,
      imagem: '⚖️',
      ...alternativasNumericas(x, { minimo: 0, candidatos: [x + a + a, x + 1, a] }),
      dica: `Que número somado com ${a} dá ${x + a}?`,
      dificuldade: 3,
    }
  }
  const a = inteiro(2, 9)
  return {
    enunciado: 'Qual é o valor de x?',
    destaque: `${a}x = ${a * x}`,
    imagem: '⚖️',
    ...alternativasNumericas(x, { minimo: 0, candidatos: [a * x - a, x + 1, a] }),
    dica: `${a} vezes qual número dá ${a * x}?`,
    dificuldade: 3,
  }
}

// ---------- Perguntas fixas ----------

type Fixa = [enunciado: string, alternativas: [string, string, string, string], imagem?: string, dica?: string]

function fixas(prefixo: string, itens: Fixa[]): Pergunta[] {
  return itens.map(([enunciado, alternativas, imagem, dica], i) => ({
    id: `${prefixo}-${i + 1}`,
    enunciado,
    alternativas,
    correta: 0,
    imagem,
    dica,
    dificuldade: 2,
  }))
}

const geometria = fixas('geometria', [
  ['Quantos lados tem um triângulo?', ['3', '4', '5', '6'], '🔺', 'TRI quer dizer três.'],
  ['Quantos lados tem um quadrado?', ['4', '3', '5', '6'], '🟥'],
  ['Quantos lados tem um pentágono?', ['5', '4', '6', '8'], '⬟', 'PENTA quer dizer cinco.'],
  ['Quantos lados tem um hexágono?', ['6', '5', '8', '4'], '⬢', 'HEXA quer dizer seis, como no hexacampeão!'],
  ['A placa de PARE tem a forma de um octógono. Quantos lados ela tem?', ['8', '6', '10', '5'], '🛑', 'OCTO quer dizer oito, como o polvo de 8 braços.'],
  ['Uma bola tem a forma de qual sólido?', ['ESFERA', 'CUBO', 'CILINDRO', 'CONE'], '⚽'],
  ['Um dado tem a forma de qual sólido?', ['CUBO', 'ESFERA', 'CONE', 'PIRÂMIDE'], '🎲'],
  ['A casquinha de sorvete lembra qual sólido?', ['CONE', 'CUBO', 'CILINDRO', 'ESFERA'], '🍦'],
  ['Uma lata lembra qual sólido?', ['CILINDRO', 'CONE', 'CUBO', 'PIRÂMIDE'], '🥫'],
  ['Quantas faces tem um cubo?', ['6', '4', '8', '12'], '🎲', 'Conte os lados de um dado: cada lado é uma face.'],
  ['Quantas arestas tem um cubo?', ['12', '6', '8', '10'], '🧊'],
  ['Quantos vértices (cantos) tem um retângulo?', ['4', '3', '5', '6'], '▭'],
  ['Qual figura não tem lados nem cantos?', ['CÍRCULO', 'TRIÂNGULO', 'QUADRADO', 'RETÂNGULO'], '⭕'],
  ['Um ângulo reto mede quantos graus?', ['90°', '45°', '180°', '360°'], '📐', 'É o ângulo do canto de um caderno.'],
  ['Quantos graus tem uma volta completa?', ['360°', '180°', '90°', '100°'], '🔄'],
])

const medidas = fixas('medidas', [
  ['Quantos dias tem uma semana?', ['7', '5', '10', '30'], '📅'],
  ['Quantos meses tem um ano?', ['12', '10', '7', '24'], '🗓️'],
  ['Quantas horas tem um dia?', ['24', '12', '60', '7'], '🕛'],
  ['Quantos minutos tem uma hora?', ['60', '100', '30', '24'], '⏰'],
  ['Quantos segundos tem um minuto?', ['60', '100', '30', '24'], '⏱️'],
  ['Meia hora tem quantos minutos?', ['30', '15', '50', '60'], '🕧'],
  ['Qual mês vem depois de março?', ['ABRIL', 'MAIO', 'FEVEREIRO', 'JUNHO'], '🌱'],
  ['Um metro tem quantos centímetros?', ['100', '10', '1000', '50'], '📏'],
  ['Um quilograma tem quantos gramas?', ['1000', '100', '10', '500'], '⚖️'],
  ['Um litro tem quantos mililitros?', ['1000', '100', '10', '500'], '🧴'],
  ['Qual instrumento mede a temperatura?', ['TERMÔMETRO', 'RÉGUA', 'BALANÇA', 'RELÓGIO'], '🌡️'],
  ['O que usamos para medir o comprimento de um lápis?', ['RÉGUA', 'BALANÇA', 'TERMÔMETRO', 'RELÓGIO'], '✏️'],
  ['Uma década tem quantos anos?', ['10', '100', '12', '5'], '🎂'],
])

// ---------- Lista de conteúdos ----------

export const conteudosMatematica: Conteudo[] = [
  { id: 'contagem', titulo: 'Contagem', disciplina: 'matematica', anos: [2], emoji: '🍎', descricao: 'Contar figuras até 12', bncc: 'EF02MA01', gerar: criarConteudo('contagem', contagem) },
  { id: 'vizinhos', titulo: 'Antes e depois', disciplina: 'matematica', anos: [2], emoji: '🔜', descricao: 'Antecessor e sucessor', bncc: 'EF02MA01', gerar: criarConteudo('vizinhos', vizinhos) },
  { id: 'par-impar', titulo: 'Par ou ímpar', disciplina: 'matematica', anos: [2, 3], emoji: '👫', bncc: 'EF02MA', gerar: criarConteudo('par-impar', parImpar) },
  { id: 'adicao-20', titulo: 'Adição até 20', disciplina: 'matematica', anos: [2], emoji: '➕', bncc: 'EF02MA05', gerar: criarConteudo('adicao-20', adicao20) },
  { id: 'subtracao-20', titulo: 'Subtração até 20', disciplina: 'matematica', anos: [2], emoji: '➖', bncc: 'EF02MA05', gerar: criarConteudo('subtracao-20', subtracao20) },
  { id: 'adicao-sub-100', titulo: 'Mais e menos até 100', disciplina: 'matematica', anos: [3], emoji: '🧮', bncc: 'EF03MA05', gerar: criarConteudo('adicao-sub-100', adicaoSub100) },
  { id: 'dobro-metade', titulo: 'Dobro, triplo e metade', disciplina: 'matematica', anos: [3], emoji: '✌️', bncc: 'EF03MA07', gerar: criarConteudo('dobro-metade', dobroMetade) },
  { id: 'tabuada', titulo: 'Tabuada', disciplina: 'matematica', anos: [3, 4], emoji: '✖️', bncc: 'EF03MA07 / EF04MA06', gerar: criarConteudo('tabuada', tabuada) },
  { id: 'dinheiro', titulo: 'Sistema monetário', disciplina: 'matematica', anos: [2, 3, 4], emoji: '💰', descricao: 'Compras, troco e moedas', bncc: 'EF03MA24', gerar: criarConteudo('dinheiro', dinheiro) },
  { id: 'problemas', titulo: 'Probleminhas', disciplina: 'matematica', anos: [3, 4, 5], emoji: '🧩', descricao: 'Situações do dia a dia', bncc: 'EF03MA06', gerar: criarConteudo('problemas', problemas) },
  { id: 'medidas', titulo: 'Medidas e tempo', disciplina: 'matematica', anos: [2, 3, 4, 5], emoji: '⏰', bncc: 'EF03MA17 / EF04MA20', perguntas: medidas },
  { id: 'geometria', titulo: 'Geometria', disciplina: 'matematica', anos: [2, 3, 4, 5], emoji: '🔷', descricao: 'Figuras planas e sólidos', bncc: 'EF02MA14 / EF05MA16', perguntas: geometria },
  { id: 'divisao', titulo: 'Divisão', disciplina: 'matematica', anos: [4, 5], emoji: '➗', bncc: 'EF04MA07', gerar: criarConteudo('divisao', divisao) },
  { id: 'fracoes', titulo: 'Frações', disciplina: 'matematica', anos: [4, 5, 6], emoji: '🍕', bncc: 'EF04MA09 / EF05MA03', gerar: criarConteudo('fracoes', fracoes) },
  { id: 'decimais', titulo: 'Números decimais', disciplina: 'matematica', anos: [5, 6], emoji: '🔟', bncc: 'EF05MA07', gerar: criarConteudo('decimais', decimais) },
  { id: 'porcentagem', titulo: 'Porcentagem', disciplina: 'matematica', anos: [5, 6, 7], emoji: '💯', bncc: 'EF05MA06 / EF06MA13', gerar: criarConteudo('porcentagem', porcentagem) },
  { id: 'expressoes', titulo: 'Expressões numéricas', disciplina: 'matematica', anos: [6], emoji: '🧠', bncc: 'EF06MA03', gerar: criarConteudo('expressoes', expressoes) },
  { id: 'potencias', titulo: 'Potências', disciplina: 'matematica', anos: [6, 7], emoji: '🚀', bncc: 'EF06MA', gerar: criarConteudo('potencias', potencias) },
  { id: 'inteiros', titulo: 'Números inteiros', disciplina: 'matematica', anos: [7], emoji: '🌡️', descricao: 'Positivos e negativos', bncc: 'EF07MA04', gerar: criarConteudo('inteiros', inteiros) },
  { id: 'equacoes', titulo: 'Equações', disciplina: 'matematica', anos: [7], emoji: '⚖️', descricao: 'Descubra o valor de x', bncc: 'EF07MA18', gerar: criarConteudo('equacoes', equacoes) },
]

