// Conteúdos de Português com perguntas escritas à mão.
// Regra: a PRIMEIRA alternativa é sempre a correta.
// O jogo embaralha as alternativas na hora de mostrar.

import type { Conteudo, Pergunta } from '../../tipos'

function embaralharLista<T>(l: T[]): void {
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[l[i], l[j]] = [l[j], l[i]]
  }
}

type Item = [enunciado: string, alternativas: [string, string, string, string], extras?: Partial<Pergunta>]

function montar(prefixo: string, itens: Item[], padrao: Partial<Pergunta> = {}): Pergunta[] {
  return itens.map(([enunciado, alternativas, extras], i) => ({
    id: `${prefixo}-${i + 1}`,
    enunciado,
    alternativas,
    correta: 0,
    ...padrao,
    ...extras,
  }))
}

const FIGURAS_VOGAIS: [emoji: string, nome: string, vogal: string][] = [
  ['🐝', 'ABELHA', 'A'],
  ['🐘', 'ELEFANTE', 'E'],
  ['🏝️', 'ILHA', 'I'],
  ['🥚', 'OVO', 'O'],
  ['🍇', 'UVA', 'U'],
  ['🚌', 'ÔNIBUS', 'O'],
  ['🦅', 'ÁGUIA', 'A'],
  ['🐻', 'URSO', 'U'],
  ['⛪', 'IGREJA', 'I'],
  ['⭐', 'ESTRELA', 'E'],
  ['🫒', 'AZEITONA', 'A'],
  ['🐑', 'OVELHA', 'O'],
]

const vogais = montar(
  'vogais',
  FIGURAS_VOGAIS.map(([emoji, nome, vogal]): Item => {
    const outras = ['A', 'E', 'I', 'O', 'U'].filter((v) => v !== vogal)
    embaralharLista(outras)
    return [
      'Com qual vogal começa o nome desta figura?',
      [vogal, outras[0], outras[1], outras[2]],
      { imagem: emoji, dica: `O nome da figura é ${nome}!` },
    ]
  }),
  { dificuldade: 1 },
)

const rimas = montar(
  'rimas',
  [
    ['Qual palavra rima com GATO?', ['PATO', 'BOLA', 'CASA', 'LUA'], { imagem: '🐱' }],
    ['Qual palavra rima com JANELA?', ['PANELA', 'CADEIRA', 'PORTA', 'SAPATO'], { imagem: '🪟' }],
    ['Qual palavra rima com MÃO?', ['PÃO', 'PÉ', 'BOCA', 'DEDO'], { imagem: '✋' }],
    ['Qual palavra rima com BOLA?', ['COLA', 'BOLO', 'BALA', 'BULE'], { imagem: '⚽' }],
    ['Qual palavra rima com CHÃO?', ['AVIÃO', 'CHUVA', 'CHAVE', 'CASA'], { imagem: '✈️' }],
    ['Qual palavra rima com AMOR?', ['FLOR', 'AMIGO', 'MAR', 'ROSA'], { imagem: '🌸' }],
    ['Qual palavra rima com CANETA?', ['BORBOLETA', 'CADERNO', 'LÁPIS', 'LIVRO'], { imagem: '🖊️' }],
    ['Qual palavra rima com ANEL?', ['PAPEL', 'ANJO', 'ANTA', 'NUVEM'], { imagem: '💍' }],
    ['Qual palavra rima com RATO?', ['PRATO', 'RUA', 'ROSA', 'RIO'], { imagem: '🐭' }],
    ['Qual palavra rima com BALEIA?', ['SEREIA', 'BALDE', 'BANANA', 'PEIXE'], { imagem: '🐳' }],
    ['Qual palavra rima com LUA?', ['RUA', 'LUZ', 'LOBO', 'SOL'], { imagem: '🌙' }],
    ['Qual palavra rima com CORAÇÃO?', ['LIMÃO', 'CORUJA', 'COPO', 'CAMA'], { imagem: '❤️' }],
  ],
  { dica: 'Palavras que rimam terminam com o mesmo som. Fale as duas em voz alta!', dificuldade: 1 },
)

const antonimos = montar(
  'antonimos',
  [
    ['Qual é o contrário de GRANDE?', ['PEQUENO', 'ALTO', 'GORDO', 'FORTE'], { imagem: '🐘' }],
    ['Qual é o contrário de ALTO?', ['BAIXO', 'GRANDE', 'LONGE', 'CHEIO'], { imagem: '🦒' }],
    ['Qual é o contrário de QUENTE?', ['FRIO', 'MORNO', 'SECO', 'CLARO'], { imagem: '🔥' }],
    ['Qual é o contrário de FELIZ?', ['TRISTE', 'ALEGRE', 'CONTENTE', 'CALMO'], { imagem: '😀' }],
    ['Qual é o contrário de ABERTO?', ['FECHADO', 'VAZIO', 'LIMPO', 'ESCURO'], { imagem: '🚪' }],
    ['Qual é o contrário de DIA?', ['NOITE', 'TARDE', 'SOL', 'MANHÃ'], { imagem: '☀️' }],
    ['Qual é o contrário de CHEIO?', ['VAZIO', 'LOTADO', 'PESADO', 'GRANDE'], { imagem: '🥛' }],
    ['Qual é o contrário de RÁPIDO?', ['DEVAGAR', 'VELOZ', 'LIGEIRO', 'FORTE'], { imagem: '🐇' }],
    ['Qual é o contrário de CLARO?', ['ESCURO', 'BRANCO', 'BRILHANTE', 'LIMPO'], { imagem: '💡' }],
    ['Qual é o contrário de PERTO?', ['LONGE', 'JUNTO', 'AO LADO', 'DENTRO'], { imagem: '📍' }],
    ['Qual é o contrário de LIMPO?', ['SUJO', 'LAVADO', 'CHEIROSO', 'NOVO'], { imagem: '🧼' }],
    ['Qual é o contrário de SUBIR?', ['DESCER', 'PULAR', 'CORRER', 'ANDAR'], { imagem: '🪜' }],
  ],
  { dica: 'O contrário é a palavra com o sentido oposto.', dificuldade: 1 },
)

const sinonimos = montar(
  'sinonimos',
  [
    ['Qual palavra tem o mesmo sentido de ALEGRE?', ['CONTENTE', 'TRISTE', 'ZANGADO', 'CANSADO'], { imagem: '😄' }],
    ['Qual palavra tem o mesmo sentido de BONITO?', ['BELO', 'FEIO', 'VELHO', 'CHATO'], { imagem: '🌺' }],
    ['Qual palavra tem o mesmo sentido de RÁPIDO?', ['VELOZ', 'LENTO', 'PARADO', 'CALMO'], { imagem: '🏎️' }],
    ['Qual palavra tem o mesmo sentido de CASA?', ['LAR', 'RUA', 'PRAÇA', 'ESCOLA'], { imagem: '🏡' }],
    ['Qual palavra tem o mesmo sentido de COMEÇAR?', ['INICIAR', 'TERMINAR', 'PARAR', 'ACABAR'], { imagem: '🏁' }],
    ['Qual palavra tem o mesmo sentido de MEDO?', ['PAVOR', 'CORAGEM', 'ALEGRIA', 'CALMA'], { imagem: '😱' }],
    ['Qual palavra tem o mesmo sentido de FALAR?', ['DIZER', 'CALAR', 'OUVIR', 'ESCUTAR'], { imagem: '🗣️' }],
    ['Qual palavra tem o mesmo sentido de ENORME?', ['GIGANTE', 'PEQUENO', 'MIÚDO', 'BAIXO'], { imagem: '🦕' }],
    ['Qual palavra tem o mesmo sentido de ESPERTO?', ['INTELIGENTE', 'BOBO', 'PREGUIÇOSO', 'LENTO'], { imagem: '🦉' }],
    ['Qual palavra tem o mesmo sentido de AJUDAR?', ['AUXILIAR', 'ATRAPALHAR', 'ESQUECER', 'BRIGAR'], { imagem: '🤝' }],
  ],
  { dica: 'Sinônimos são palavras diferentes que querem dizer a mesma coisa.', dificuldade: 2 },
)

const plural = montar(
  'plural',
  [
    ['Qual é o plural de FLOR?', ['FLORES', 'FLORS', 'FLORIS', 'FLORÃO'], { imagem: '🌼' }],
    ['Qual é o plural de PÃO?', ['PÃES', 'PÃOS', 'PÕES', 'PÃOES'], { imagem: '🍞' }],
    ['Qual é o plural de LIMÃO?', ['LIMÕES', 'LIMÃOS', 'LIMÃES', 'LIMONS'], { imagem: '🍋' }],
    ['Qual é o plural de ANIMAL?', ['ANIMAIS', 'ANIMALS', 'ANIMALES', 'ANIMAUS'], { imagem: '🐾' }],
    ['Qual é o plural de LÁPIS?', ['LÁPIS', 'LÁPISES', 'LÁPIZES', 'LÁPISS'], { imagem: '✏️' }],
    ['Qual é o plural de MÃO?', ['MÃOS', 'MÕES', 'MÃES', 'MANS'], { imagem: '🙌' }],
    ['Qual é o plural de PAPEL?', ['PAPÉIS', 'PAPELS', 'PAPELES', 'PAPÉS'], { imagem: '📄' }],
    ['Qual é o plural de NARIZ?', ['NARIZES', 'NARIZS', 'NARIS', 'NARIZIS'], { imagem: '👃' }],
    ['Qual é o plural de CÃO?', ['CÃES', 'CÃOS', 'CÕES', 'CAINS'], { imagem: '🐶' }],
    ['Qual é o plural de ANEL?', ['ANÉIS', 'ANELS', 'ANELES', 'ANÉS'], { imagem: '💍' }],
    ['Qual é o plural de LEÃO?', ['LEÕES', 'LEÃOS', 'LEÃES', 'LEONS'], { imagem: '🦁' }],
    ['Qual é o plural de MAR?', ['MARES', 'MARS', 'MARIS', 'MARÕES'], { imagem: '🌊' }],
  ],
  { dica: 'Plural é quando falamos de mais de um. Pense: um... dois...', dificuldade: 2 },
)

const ortografia = montar(
  'ortografia',
  [
    ['Qual palavra está escrita corretamente?', ['CASA', 'CAZA', 'KASA', 'KAZA'], { imagem: '🏠' }],
    ['Qual palavra está escrita corretamente?', ['CHUVA', 'XUVA', 'CHUVVA', 'XUVVA'], { imagem: '🌧️' }],
    ['Qual palavra está escrita corretamente?', ['CABEÇA', 'CABESSA', 'CABESA', 'CABEÇSA'], { imagem: '🙂' }],
    ['Qual palavra está escrita corretamente?', ['PASSARINHO', 'PASARINHO', 'PAÇARINHO', 'PASSARINIO'], { imagem: '🐦' }],
    ['Qual palavra está escrita corretamente?', ['AÇÚCAR', 'ASSÚCAR', 'ASÚCAR', 'ASSUCAR'], { imagem: '🍬' }],
    ['Qual palavra está escrita corretamente?', ['XÍCARA', 'CHÍCARA', 'XICCARA', 'CHÍQUARA'], { imagem: '☕' }],
    ['Qual palavra está escrita corretamente?', ['ENGRAÇADO', 'INGRAÇADO', 'ENGRASSADO', 'ENGRAÇADU'], { imagem: '😂' }],
    ['Qual palavra está escrita corretamente?', ['ÁRVORE', 'ÁRVOLE', 'ÁRVURI', 'ÁRVORI'], { imagem: '🌳' }],
    ['Qual palavra está escrita corretamente?', ['HOJE', 'OJE', 'HOGE', 'OGE'], { imagem: '📅' }],
    ['Qual palavra está escrita corretamente?', ['GIRAFA', 'JIRAFA', 'GIRRAFA', 'JIRRAFA'], { imagem: '🦒' }],
    ['Qual palavra está escrita corretamente?', ['PEIXE', 'PEICHE', 'PEXE', 'PEIXI'], { imagem: '🐟' }],
    ['Qual palavra está escrita corretamente?', ['MENINO', 'MININO', 'MENINU', 'MINÍNO'], { imagem: '👦' }],
  ],
  { dica: 'Leia cada palavra devagar e pense em como ela aparece nos livros.', dificuldade: 2 },
)

const pontuacao = montar(
  'pontuacao',
  [
    ['Qual sinal usamos no final de uma pergunta?', ['?  Interrogação', '!  Exclamação', '.  Ponto final', ',  Vírgula']],
    ['Qual sinal mostra surpresa, alegria ou espanto?', ['!  Exclamação', '?  Interrogação', '.  Ponto final', ':  Dois-pontos']],
    ['Qual sinal termina uma frase que apenas conta algo?', ['.  Ponto final', '?  Interrogação', '!  Exclamação', '—  Travessão']],
    ['Qual sinal separa os itens de uma lista?', [',  Vírgula', '.  Ponto final', '?  Interrogação', '!  Exclamação']],
    ['Qual sinal mostra a fala de um personagem em um diálogo?', ['—  Travessão', ',  Vírgula', '.  Ponto final', '?  Interrogação']],
    ['Qual sinal vem antes de uma lista ou explicação?', [':  Dois-pontos', '?  Interrogação', '!  Exclamação', '.  Ponto final']],
    ['Que sinal completa a frase: "Que dia lindo___"', ['!', '?', ',', ':'], { fala: 'Que sinal completa a frase: Que dia lindo!' }],
    ['Que sinal completa a frase: "Onde você mora___"', ['?', '!', ',', ':'], { fala: 'Que sinal completa a frase: Onde você mora?' }],
    ['Que sinal completa a frase: "Ana, Pedro e Lucas foram ao parque___"', ['.', '?', ',', ':']],
    ['Qual frase está pontuada corretamente?', ['Qual é o seu nome?', 'Qual é o seu nome.', 'Qual, é o seu nome', 'Qual é? o seu nome']],
  ],
  { imagem: '✍️', dica: 'Leia a frase em voz alta e preste atenção na entonação.', dificuldade: 2 },
)

const classes = montar(
  'classes',
  [
    ['Na frase "O gato pulou o muro", qual palavra é um VERBO?', ['PULOU', 'GATO', 'MURO', 'O'], { imagem: '🐈' }],
    ['Qual destas palavras é um SUBSTANTIVO?', ['MESA', 'BONITO', 'CORRER', 'RAPIDAMENTE'], { imagem: '🪑' }],
    ['Qual destas palavras é um ADJETIVO?', ['AZUL', 'CASA', 'PULAR', 'ONTEM'], { imagem: '🎨' }],
    ['Qual destas palavras é um SUBSTANTIVO PRÓPRIO?', ['MARIA', 'MENINA', 'CIDADE', 'BOLA'], { imagem: '👧' }],
    ['Na frase "A menina alegre cantou", qual é o ADJETIVO?', ['ALEGRE', 'MENINA', 'CANTOU', 'A'], { imagem: '🎤' }],
    ['Qual palavra indica uma AÇÃO?', ['CORRER', 'CAMINHO', 'VERDE', 'FELIZ'], { imagem: '🏃' }],
    ['Qual destas palavras é um ARTIGO?', ['O', 'CASA', 'PULAR', 'BELO'], { imagem: '🔤' }],
    ['Na frase "Ela comprou duas maçãs", qual palavra é um NUMERAL?', ['DUAS', 'ELA', 'COMPROU', 'MAÇÃS'], { imagem: '🍎' }],
    ['Qual destas palavras é um PRONOME?', ['NÓS', 'NUVEM', 'NADAR', 'NOVO'], { imagem: '👥' }],
    ['Qual é o coletivo de ABELHAS?', ['ENXAME', 'CARDUME', 'MATILHA', 'REBANHO'], { imagem: '🐝' }],
    ['Qual é o coletivo de PEIXES?', ['CARDUME', 'ENXAME', 'ALCATEIA', 'BANDO'], { imagem: '🐠' }],
    ['Qual é o coletivo de LOBOS?', ['ALCATEIA', 'CARDUME', 'REBANHO', 'ENXAME'], { imagem: '🐺' }],
  ],
  { dica: 'Substantivo dá nome, adjetivo dá qualidade e verbo indica ação.', dificuldade: 3 },
)

const silabas = montar(
  'silabas',
  [
    ['Quantas sílabas tem a palavra BORBOLETA?', ['4', '3', '5', '2'], { imagem: '🦋' }],
    ['Quantas sílabas tem a palavra SOL?', ['1', '2', '3', '4'], { imagem: '☀️' }],
    ['Qual é a separação correta de CACHORRO?', ['CA-CHOR-RO', 'CA-CHO-RRO', 'CAC-HOR-RO', 'CA-CHORR-O'], { imagem: '🐕' }],
    ['Qual é a separação correta de PÁSSARO?', ['PÁS-SA-RO', 'PÁ-SSA-RO', 'PÁSS-A-RO', 'PA-SSAR-O'], { imagem: '🐦' }],
    ['Qual palavra é MONOSSÍLABA (tem uma sílaba)?', ['PÉ', 'PATO', 'SAPATO', 'ESCOLA'], { imagem: '🦶' }],
    ['Qual palavra é TRISSÍLABA (tem três sílabas)?', ['JANELA', 'CASA', 'SOL', 'BORBOLETA'], { imagem: '🪟' }],
    ['Qual palavra é OXÍTONA (a sílaba mais forte é a última)?', ['CAFÉ', 'MESA', 'LÂMPADA', 'ÁRVORE'], { imagem: '☕' }],
    ['Qual palavra é PAROXÍTONA (a sílaba mais forte é a penúltima)?', ['CADERNO', 'JACARÉ', 'PÁSSARO', 'ÔNIBUS'], { imagem: '📓' }],
    ['Qual palavra é PROPAROXÍTONA (a sílaba mais forte é a antepenúltima)?', ['MÁGICO', 'CANETA', 'SOFÁ', 'JANELA'], { imagem: '🎩' }],
    ['Qual palavra está acentuada corretamente?', ['ÔNIBUS', 'MÊSA', 'CANÊTA', 'JANÉLA'], { imagem: '🚌' }],
  ],
  { dica: 'Bata palmas para cada pedacinho da palavra.', dificuldade: 3 },
)

export const conteudosLinguagem: Conteudo[] = [
  { id: 'vogais', titulo: 'Vogais', disciplina: 'portugues', anos: [2], emoji: '🅰️', descricao: 'A · E · I · O · U', bncc: 'EF01LP / EF02LP', perguntas: vogais },
  { id: 'rimas', titulo: 'Rimas', disciplina: 'portugues', anos: [2, 3], emoji: '🎶', descricao: 'Palavras com o mesmo som final', bncc: 'EF12LP07', perguntas: rimas },
  { id: 'antonimos', titulo: 'Contrários', disciplina: 'portugues', anos: [2, 3, 4], emoji: '↔️', descricao: 'Antônimos', bncc: 'EF35LP', perguntas: antonimos },
  { id: 'plural', titulo: 'Singular e plural', disciplina: 'portugues', anos: [3, 4], emoji: '👯', bncc: 'EF04LP', perguntas: plural },
  { id: 'ortografia', titulo: 'Ortografia', disciplina: 'portugues', anos: [3, 4, 5], emoji: '📝', descricao: 'Palavras escritas do jeito certo', bncc: 'EF03LP01', perguntas: ortografia },
  { id: 'pontuacao', titulo: 'Pontuação', disciplina: 'portugues', anos: [3, 4, 5], emoji: '❓', descricao: '. , ? ! : —', bncc: 'EF03LP07', perguntas: pontuacao },
  { id: 'sinonimos', titulo: 'Sinônimos', disciplina: 'portugues', anos: [4, 5], emoji: '🔁', bncc: 'EF35LP', perguntas: sinonimos },
  { id: 'classes', titulo: 'Classes de palavras', disciplina: 'portugues', anos: [4, 5, 6], emoji: '🏷️', descricao: 'Substantivo, adjetivo, verbo...', bncc: 'EF05LP / EF06LP', perguntas: classes },
  { id: 'silabas', titulo: 'Sílabas e acentuação', disciplina: 'portugues', anos: [4, 5, 6, 7], emoji: '👏', descricao: 'Separação e sílaba tônica', bncc: 'EF04LP / EF07LP', perguntas: silabas },
]
