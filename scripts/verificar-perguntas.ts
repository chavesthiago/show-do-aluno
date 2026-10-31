// Confere o banco de perguntas: rode com  npm run verificar
import { CONTEUDOS_PRONTOS, prepararPerguntas } from '../src/dados/catalogo'
import type { Pergunta } from '../src/tipos'

let problemas = 0
let total = 0
const ids = new Set<string>()

function conferir(conteudo: string, p: Pergunta) {
  total++
  const erros: string[] = []
  if (!p.enunciado.trim()) erros.push('enunciado vazio')
  if (p.alternativas.length !== 4) erros.push('não tem 4 alternativas')
  if (new Set(p.alternativas).size !== 4) erros.push(`alternativas repetidas: ${p.alternativas.join(' | ')}`)
  if (p.alternativas.some((a) => !String(a).trim())) erros.push('alternativa vazia')
  if (!(p.correta >= 0 && p.correta <= 3)) erros.push(`correta inválida: ${p.correta}`)
  if (erros.length) {
    problemas++
    console.log(`❌ [${conteudo}] ${p.id} – ${p.enunciado} ${p.destaque ?? ''}\n   ${erros.join('\n   ')}`)
  }
}

for (const c of CONTEUDOS_PRONTOS) {
  if (c.perguntas) {
    for (const p of c.perguntas) {
      if (ids.has(p.id)) {
        problemas++
        console.log(`❌ id repetido: ${p.id}`)
      }
      ids.add(p.id)
      conferir(c.id, p)
    }
  }
  // Prepara 30 partidas de cada conteúdo para testar geradores e embaralhamento
  for (let i = 0; i < 30; i++) {
    const original = c.perguntas
    const preparadas = prepararPerguntas(c, 15)
    if (preparadas.length === 0) {
      problemas++
      console.log(`❌ [${c.id}] não gerou perguntas`)
    }
    preparadas.forEach((p) => {
      conferir(c.id, p)
      if (original) {
        const o = original.find((x) => x.id === p.id)!
        if (o.alternativas[o.correta] !== p.alternativas[p.correta]) {
          problemas++
          console.log(`❌ [${c.id}] embaralhamento trocou a resposta certa de ${p.id}`)
        }
      }
    })
  }
}

console.log(`\n${CONTEUDOS_PRONTOS.length} conteúdos, ${total} perguntas conferidas.`)
if (problemas) {
  console.log(`⚠️  ${problemas} problema(s) encontrado(s).`)
  process.exit(1)
}
console.log('✅ Tudo certo!')
