import type { DisciplinaId } from '../tipos'

export interface InfoDisciplina {
  id: DisciplinaId
  nome: string
  emoji: string
  cor: string
}

export const DISCIPLINAS: InfoDisciplina[] = [
  { id: 'portugues', nome: 'Português', emoji: '📚', cor: '#ff4d6d' },
  { id: 'matematica', nome: 'Matemática', emoji: '🔢', cor: '#3a86ff' },
  { id: 'ciencias', nome: 'Ciências', emoji: '🔬', cor: '#2ec4b6' },
  { id: 'historia', nome: 'História', emoji: '🏛️', cor: '#c77dff' },
  { id: 'geografia', nome: 'Geografia', emoji: '🌎', cor: '#06d6a0' },
  { id: 'ingles', nome: 'Inglês', emoji: '🇬🇧', cor: '#f77f00' },
  { id: 'artes', nome: 'Artes', emoji: '🎨', cor: '#ff70a6' },
  { id: 'outra', nome: 'Outra', emoji: '⭐', cor: '#ffbe0b' },
]

export function infoDisciplina(id: DisciplinaId): InfoDisciplina {
  return DISCIPLINAS.find((d) => d.id === id) ?? DISCIPLINAS[DISCIPLINAS.length - 1]
}

export const ANOS = [2, 3, 4, 5, 6, 7]

/** Ex.: [2,3] → "2º e 3º ano"; [4,5,6] → "4º ao 6º ano" */
export function rotuloAnos(anos: number[]): string {
  const a = [...anos].sort((x, y) => x - y)
  if (a.length === 0) return 'Todos os anos'
  if (a.length === 1) return `${a[0]}º ano`
  if (a.length === 2) return `${a[0]}º e ${a[1]}º ano`
  return `${a[0]}º ao ${a[a.length - 1]}º ano`
}
