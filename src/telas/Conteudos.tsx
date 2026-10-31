import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Modal } from '../componentes/Modal'
import { ANOS, DISCIPLINAS, infoDisciplina, rotuloAnos } from '../dados/disciplinas'
import { CONTEUDOS_PRONTOS, conteudoDoProfessor, totalDePerguntas } from '../dados/catalogo'
import { useApp } from '../estado/app'
import { sons } from '../servicos/sons'
import type { Conteudo, DisciplinaId } from '../tipos'

export function Conteudos() {
  const { irPara, iniciarPartida, conteudosProfessor, recordes } = useApp()
  const [disciplina, setDisciplina] = useState<DisciplinaId | 'todas' | 'professor'>('todas')
  const [ano, setAno] = useState<number | null>(null)
  const [escolhido, setEscolhido] = useState<Conteudo | null>(null)

  const todos = useMemo(
    () => [...conteudosProfessor.filter((c) => c.perguntas.length > 0).map(conteudoDoProfessor), ...CONTEUDOS_PRONTOS],
    [conteudosProfessor],
  )

  const disciplinasComConteudo = DISCIPLINAS.filter((d) => todos.some((c) => c.disciplina === d.id))

  const filtrados = todos.filter((c) => {
    if (disciplina === 'professor' && !c.doProfessor) return false
    if (disciplina !== 'todas' && disciplina !== 'professor' && c.disciplina !== disciplina) return false
    if (ano !== null && c.anos.length > 0 && !c.anos.includes(ano)) return false
    return true
  })

  return (
    <main className="tela conteudos">
      <header className="cabecalho">
        <button className="botao botao-voltar" onClick={() => irPara('menu')} aria-label="Voltar">
          ⬅
        </button>
        <h2>Escolha o conteúdo</h2>
      </header>

      <div className="filtros">
        <div className="chips" role="tablist" aria-label="Disciplina">
          <Chip ativo={disciplina === 'todas'} aoClicar={() => setDisciplina('todas')}>
            ✨ Todas
          </Chip>
          {disciplinasComConteudo.map((d) => (
            <Chip key={d.id} ativo={disciplina === d.id} cor={d.cor} aoClicar={() => setDisciplina(d.id)}>
              {d.emoji} {d.nome}
            </Chip>
          ))}
          {conteudosProfessor.length > 0 && (
            <Chip ativo={disciplina === 'professor'} aoClicar={() => setDisciplina('professor')}>
              🧑‍🏫 Do professor
            </Chip>
          )}
        </div>
        <div className="chips chips-anos" aria-label="Ano escolar">
          <Chip ativo={ano === null} aoClicar={() => setAno(null)}>
            Todos os anos
          </Chip>
          {ANOS.map((a) => (
            <Chip key={a} ativo={ano === a} aoClicar={() => setAno(a)}>
              {a}º ano
            </Chip>
          ))}
        </div>
      </div>

      <motion.div className="grade-conteudos" layout>
        <AnimatePresence>
          {filtrados.map((c, i) => {
            const info = infoDisciplina(c.disciplina)
            const total = totalDePerguntas(c)
            return (
              <motion.button
                key={c.id}
                className="cartao-conteudo"
                style={{ '--cor': info.cor } as React.CSSProperties}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sons.selecionar()
                  setEscolhido(c)
                }}
              >
                {c.doProfessor && <span className="selo-professor">🧑‍🏫 Professor</span>}
                <span className="cartao-emoji">{c.emoji}</span>
                <span className="cartao-titulo">{c.titulo}</span>
                {c.descricao && <span className="cartao-descricao">{c.descricao}</span>}
                <span className="cartao-rodape">
                  <span>{rotuloAnos(c.anos)}</span>
                  <span>{total === 'ilimitado' ? '∞ perguntas' : `${total} ${total === 1 ? 'pergunta' : 'perguntas'}`}</span>
                </span>
                {recordes[c.id] ? <span className="cartao-recorde">🏆 {recordes[c.id]}</span> : null}
              </motion.button>
            )
          })}
        </AnimatePresence>
        {filtrados.length === 0 && <p className="vazio">Nenhum conteúdo para este filtro. 🙈</p>}
      </motion.div>

      <AnimatePresence>
        {escolhido && (
          <EscolherQuantidade
            conteudo={escolhido}
            aoFechar={() => setEscolhido(null)}
            aoComecar={(qtd) => {
              sons.inicio()
              iniciarPartida(escolhido, qtd)
            }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function Chip({ ativo, cor, aoClicar, children }: { ativo: boolean; cor?: string; aoClicar: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`chip ${ativo ? 'chip-ativo' : ''}`}
      style={cor ? ({ '--cor': cor } as React.CSSProperties) : undefined}
      aria-pressed={ativo}
      onClick={() => {
        sons.clique()
        aoClicar()
      }}
    >
      {children}
    </button>
  )
}

function EscolherQuantidade({ conteudo, aoFechar, aoComecar }: { conteudo: Conteudo; aoFechar: () => void; aoComecar: (qtd: number) => void }) {
  const total = totalDePerguntas(conteudo)
  const opcoes = [5, 10, 15].filter((n) => total === 'ilimitado' || n < total)
  const info = infoDisciplina(conteudo.disciplina)
  return (
    <Modal aoFechar={aoFechar}>
      <div className="modal-emoji">{conteudo.emoji}</div>
      <h3>{conteudo.titulo}</h3>
      <p className="modal-info">
        {info.emoji} {info.nome} · {rotuloAnos(conteudo.anos)}
        {conteudo.bncc && <span className="bncc"> · BNCC {conteudo.bncc}</span>}
      </p>
      <p>Quantas perguntas?</p>
      <div className="opcoes-quantidade">
        {opcoes.map((n) => (
          <button key={n} className="botao botao-grande botao-azul" onClick={() => aoComecar(n)}>
            {n}
          </button>
        ))}
        {total !== 'ilimitado' && (
          <button className="botao botao-grande botao-azul" onClick={() => aoComecar(total)}>
            Todas ({total})
          </button>
        )}
      </div>
      <button className="botao botao-link" onClick={aoFechar}>
        Cancelar
      </button>
    </Modal>
  )
}
