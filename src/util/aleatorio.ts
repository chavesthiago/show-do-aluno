// Funções de sorteio usadas no jogo e nos geradores de perguntas

/** Número inteiro entre min e max (inclusive) */
export function inteiro(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Escolhe um item qualquer da lista */
export function escolher<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)]
}

/** Devolve uma cópia embaralhada da lista */
export function embaralhar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/**
 * Monta 4 alternativas numéricas: a resposta certa + 3 "parecidas".
 * Devolve as alternativas (como texto) e a posição da correta.
 */
export function alternativasNumericas(
  resposta: number,
  opcoes: { espalhar?: number; minimo?: number; formatar?: (n: number) => string; candidatos?: number[] } = {},
): { alternativas: [string, string, string, string]; correta: number } {
  const { espalhar = 5, minimo = 0, formatar = (n) => String(n), candidatos = [] } = opcoes
  const erradas = new Set<number>()
  for (const c of embaralhar(candidatos)) {
    if (erradas.size >= 3) break
    const formatoOk = Number.isInteger(c) || !Number.isInteger(resposta)
    if (c !== resposta && c >= minimo && formatoOk && Number.isFinite(c)) erradas.add(c)
  }
  let tentativas = 0
  while (erradas.size < 3 && tentativas < 200) {
    tentativas++
    const delta = inteiro(1, espalhar) * (Math.random() < 0.5 ? -1 : 1)
    const n = resposta + delta
    if (n !== resposta && n >= minimo) erradas.add(n)
  }
  // garantia final (caso raro)
  let extra = resposta + espalhar + 1
  while (erradas.size < 3) erradas.add(extra++)

  const todas = embaralhar([resposta, ...erradas].slice(0, 4))
  return {
    alternativas: todas.map(formatar) as [string, string, string, string],
    correta: todas.indexOf(resposta),
  }
}

/** Monta 4 alternativas de texto (certa + 3 erradas) em ordem aleatória */
export function alternativasTexto(
  certa: string,
  erradas: string[],
): { alternativas: [string, string, string, string]; correta: number } {
  const unicas = [...new Set(erradas.filter((e) => e !== certa))]
  const tres = embaralhar(unicas).slice(0, 3)
  const todas = embaralhar([certa, ...tres])
  return { alternativas: todas as [string, string, string, string], correta: todas.indexOf(certa) }
}
