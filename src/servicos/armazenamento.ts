// Guarda dados no próprio navegador (localStorage).
// Tudo fica no aparelho do professor: nada é enviado para a internet.

const PREFIXO = 'show-do-aluno:'

export function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave)
    return bruto ? (JSON.parse(bruto) as T) : padrao
  } catch {
    return padrao
  }
}

export function gravar<T>(chave: string, valor: T): boolean {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
    return true
  } catch {
    // pode falhar se o armazenamento estiver cheio (muitas fotos) ou bloqueado
    return false
  }
}
