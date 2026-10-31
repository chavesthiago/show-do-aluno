// Área do Professor: criar, editar, jogar, exportar e importar
// conteúdos com perguntas próprias. Tudo é salvo no aparelho.

import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Figura } from '../componentes/Figura'
import { Modal } from '../componentes/Modal'
import { conteudoDoProfessor } from '../dados/catalogo'
import { ANOS, DISCIPLINAS, infoDisciplina, rotuloAnos } from '../dados/disciplinas'
import { novoId, useApp } from '../estado/app'
import { exportarConteudos, lerArquivoDeConteudos, reduzirImagem } from '../servicos/arquivos'
import { sons } from '../servicos/sons'
import type { ConteudoSalvo, Pergunta } from '../tipos'

const EMOJIS_RAPIDOS = [
  '⭐', '📚', '🔢', '🔬', '🌎', '🏛️', '🎨', '🇬🇧', '🐶', '🐱', '🦁', '🐸', '🌳', '🌸', '☀️', '🌙',
  '🌧️', '🍎', '🍌', '🥕', '🚗', '🚀', '⚽', '🎵', '❤️', '💧', '🔥', '🧠', '🦷', '🏠', '🗺️', '⏰',
]

const EXEMPLO: Omit<ConteudoSalvo, 'id' | 'atualizadoEm'> = {
  titulo: 'Animais (exemplo)',
  disciplina: 'ciencias',
  anos: [2, 3],
  emoji: '🐾',
  descricao: 'Exemplo criado para mostrar como funciona',
  perguntas: [
    { id: 'ex-1', enunciado: 'Qual destes animais vive na água?', imagem: '🌊', alternativas: ['PEIXE', 'CACHORRO', 'GATO', 'GALINHA'], correta: 0, dica: 'Ele tem nadadeiras!' },
    { id: 'ex-2', enunciado: 'Qual animal bota ovos?', imagem: '🥚', alternativas: ['CACHORRO', 'GALINHA', 'VACA', 'CAVALO'], correta: 1 },
    { id: 'ex-3', enunciado: 'Quantas patas tem uma aranha?', imagem: '🕷️', alternativas: ['4', '6', '8', '10'], correta: 2, dica: 'É o dobro de 4.' },
  ],
}

type Aviso = { texto: string; tipo: 'ok' | 'erro' } | null

export function Professor() {
  const { irPara, conteudosProfessor, salvarConteudo, excluirConteudo, importarConteudos, iniciarPartida } = useApp()
  const [editando, setEditando] = useState<ConteudoSalvo | null>(null)
  const [excluir, setExcluir] = useState<ConteudoSalvo | null>(null)
  const [aviso, setAviso] = useState<Aviso>(null)
  const entradaArquivo = useRef<HTMLInputElement>(null)

  function mostrarAviso(texto: string, tipo: 'ok' | 'erro' = 'ok') {
    setAviso({ texto, tipo })
    setTimeout(() => setAviso(null), 3500)
  }

  function novo() {
    sons.clique()
    setEditando({ id: novoId(), titulo: '', disciplina: 'portugues', anos: [], emoji: '⭐', perguntas: [], atualizadoEm: '' })
  }

  async function importar(arquivo: File | undefined) {
    if (!arquivo) return
    try {
      const lista = await lerArquivoDeConteudos(arquivo)
      if (lista.length === 0) {
        mostrarAviso('Este arquivo não tem conteúdos do Show do Aluno.', 'erro')
        return
      }
      const qtd = importarConteudos(lista)
      if (qtd) mostrarAviso(`✅ ${qtd} conteúdo(s) importado(s)!`)
      else mostrarAviso('Não foi possível salvar. O armazenamento pode estar cheio.', 'erro')
    } catch {
      mostrarAviso('Arquivo inválido. Use um arquivo .json exportado pelo Show do Aluno.', 'erro')
    } finally {
      if (entradaArquivo.current) entradaArquivo.current.value = ''
    }
  }

  if (editando) {
    return (
      <EditorConteudo
        inicial={editando}
        aoCancelar={() => setEditando(null)}
        aoSalvar={(c) => {
          if (salvarConteudo(c)) {
            setEditando(null)
            mostrarAviso('✅ Conteúdo salvo!')
          } else {
            mostrarAviso('Não foi possível salvar. Tente usar fotos menores ou menos fotos.', 'erro')
          }
        }}
      />
    )
  }

  return (
    <main className="tela professor">
      <header className="cabecalho">
        <button className="botao botao-voltar" onClick={() => irPara('menu')} aria-label="Voltar">
          ⬅
        </button>
        <h2>🧑‍🏫 Área do Professor</h2>
      </header>

      <section className="painel">
        <p className="painel-intro">
          Crie seus próprios conteúdos com perguntas e respostas. Eles aparecem na tela <strong>Jogar</strong> com o selo{' '}
          <strong>Professor</strong>. Tudo fica salvo <strong>neste aparelho e neste navegador</strong>. Para levar para outro
          aparelho, use <strong>Exportar</strong> e depois <strong>Importar</strong>.
        </p>
        <div className="botoes-lado">
          <button className="botao botao-grande botao-verde" onClick={novo}>
            ➕ Novo conteúdo
          </button>
          <button className="botao botao-grande botao-azul" onClick={() => entradaArquivo.current?.click()}>
            📥 Importar arquivo
          </button>
          {conteudosProfessor.length > 1 && (
            <button className="botao botao-grande botao-roxo" onClick={() => exportarConteudos(conteudosProfessor, 'todos')}>
              📤 Exportar todos
            </button>
          )}
          <input
            ref={entradaArquivo}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => void importar(e.target.files?.[0])}
          />
        </div>
      </section>

      {conteudosProfessor.length === 0 ? (
        <section className="painel vazio-professor">
          <div className="modal-emoji">📝</div>
          <p>Você ainda não criou nenhum conteúdo.</p>
          <button
            className="botao botao-link"
            onClick={() => {
              salvarConteudo({ ...EXEMPLO, id: novoId(), atualizadoEm: '' })
              mostrarAviso('Exemplo criado! Toque em Editar para ver como funciona.')
            }}
          >
            ✨ Criar um conteúdo de exemplo
          </button>
        </section>
      ) : (
        <div className="lista-professor">
          {conteudosProfessor.map((c) => {
            const info = infoDisciplina(c.disciplina)
            return (
              <motion.article key={c.id} className="item-professor" layout style={{ '--cor': info.cor } as React.CSSProperties}>
                <span className="item-emoji">{c.emoji}</span>
                <div className="item-info">
                  <strong>{c.titulo}</strong>
                  <span>
                    {info.emoji} {info.nome} · {rotuloAnos(c.anos)} · {c.perguntas.length} pergunta(s)
                  </span>
                </div>
                <div className="item-acoes">
                  <button
                    className="botao botao-pequeno botao-verde"
                    disabled={c.perguntas.length === 0}
                    title={c.perguntas.length === 0 ? 'Adicione perguntas para jogar' : 'Jogar'}
                    onClick={() => {
                      sons.inicio()
                      iniciarPartida(conteudoDoProfessor(c), c.perguntas.length)
                    }}
                  >
                    ▶ Jogar
                  </button>
                  <button className="botao botao-pequeno botao-azul" onClick={() => setEditando(c)}>
                    ✏️ Editar
                  </button>
                  <button className="botao botao-pequeno botao-roxo" onClick={() => exportarConteudos([c], c.titulo)}>
                    📤 Exportar
                  </button>
                  <button className="botao botao-pequeno botao-vermelho" onClick={() => setExcluir(c)}>
                    🗑️
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {excluir && (
          <Modal aoFechar={() => setExcluir(null)}>
            <div className="modal-emoji">🗑️</div>
            <h3>Excluir “{excluir.titulo}”?</h3>
            <p>As {excluir.perguntas.length} perguntas serão apagadas deste aparelho. Se quiser guardar, exporte antes.</p>
            <div className="botoes-lado">
              <button className="botao botao-grande botao-verde" onClick={() => setExcluir(null)} autoFocus>
                Cancelar
              </button>
              <button
                className="botao botao-grande botao-vermelho"
                onClick={() => {
                  excluirConteudo(excluir.id)
                  setExcluir(null)
                  mostrarAviso('Conteúdo excluído.')
                }}
              >
                Excluir
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <Aviso aviso={aviso} />
    </main>
  )
}

function Aviso({ aviso }: { aviso: Aviso }) {
  return (
    <AnimatePresence>
      {aviso && (
        <motion.div
          className={`aviso aviso-${aviso.tipo}`}
          role="status"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          {aviso.texto}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------- Editor do conteúdo ----------------

function EditorConteudo({ inicial, aoSalvar, aoCancelar }: { inicial: ConteudoSalvo; aoSalvar: (c: ConteudoSalvo) => void; aoCancelar: () => void }) {
  const [c, setC] = useState<ConteudoSalvo>(inicial)
  const [perguntaEditada, setPerguntaEditada] = useState<{ pergunta: Pergunta; indice: number } | null>(null)
  const [erro, setErro] = useState('')

  const alterar = (mudanca: Partial<ConteudoSalvo>) => setC((atual) => ({ ...atual, ...mudanca }))

  function salvar() {
    if (!c.titulo.trim()) {
      setErro('Dê um nome para o conteúdo.')
      return
    }
    aoSalvar({ ...c, titulo: c.titulo.trim() })
  }

  function novaPergunta() {
    setPerguntaEditada({
      indice: -1,
      pergunta: { id: novoId(), enunciado: '', alternativas: ['', '', '', ''], correta: 0 },
    })
  }

  function mover(i: number, direcao: -1 | 1) {
    const lista = [...c.perguntas]
    const j = i + direcao
    if (j < 0 || j >= lista.length) return
    ;[lista[i], lista[j]] = [lista[j], lista[i]]
    alterar({ perguntas: lista })
  }

  return (
    <main className="tela professor">
      <header className="cabecalho">
        <button className="botao botao-voltar" onClick={aoCancelar} aria-label="Voltar sem salvar">
          ⬅
        </button>
        <h2>{inicial.titulo ? 'Editar conteúdo' : 'Novo conteúdo'}</h2>
        <button className="botao botao-grande botao-verde botao-salvar" onClick={salvar}>
          💾 Salvar
        </button>
      </header>

      <section className="painel formulario">
        <label className="campo">
          <span>Nome do conteúdo</span>
          <input
            value={c.titulo}
            maxLength={60}
            placeholder="Ex.: Animais do Brasil"
            onChange={(e) => {
              alterar({ titulo: e.target.value })
              setErro('')
            }}
          />
        </label>
        {erro && <p className="erro">{erro}</p>}

        <div className="campo">
          <span>Ícone</span>
          <div className="emoji-linha">
            <input
              className="entrada-emoji"
              value={c.emoji}
              maxLength={8}
              aria-label="Ícone (emoji)"
              onChange={(e) => alterar({ emoji: e.target.value })}
            />
            <div className="emojis-rapidos">
              {EMOJIS_RAPIDOS.slice(0, 16).map((e) => (
                <button key={e} className={`emoji-opcao ${c.emoji === e ? 'ativo' : ''}`} onClick={() => alterar({ emoji: e })}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="campo">
          <span>Disciplina</span>
          <div className="chips">
            {DISCIPLINAS.map((d) => (
              <button
                key={d.id}
                className={`chip ${c.disciplina === d.id ? 'chip-ativo' : ''}`}
                style={{ '--cor': d.cor } as React.CSSProperties}
                aria-pressed={c.disciplina === d.id}
                onClick={() => alterar({ disciplina: d.id })}
              >
                {d.emoji} {d.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <span>Anos indicados (pode marcar vários)</span>
          <div className="chips">
            {ANOS.map((a) => {
              const marcado = c.anos.includes(a)
              return (
                <button
                  key={a}
                  className={`chip ${marcado ? 'chip-ativo' : ''}`}
                  aria-pressed={marcado}
                  onClick={() => alterar({ anos: marcado ? c.anos.filter((x) => x !== a) : [...c.anos, a].sort() })}
                >
                  {a}º ano
                </button>
              )
            })}
          </div>
        </div>

        <label className="campo">
          <span>Descrição (opcional)</span>
          <input value={c.descricao ?? ''} maxLength={80} placeholder="Ex.: Habitat e alimentação" onChange={(e) => alterar({ descricao: e.target.value })} />
        </label>
      </section>

      <section className="painel">
        <div className="titulo-secao">
          <h3>Perguntas ({c.perguntas.length})</h3>
          <button className="botao botao-grande botao-verde" onClick={novaPergunta}>
            ➕ Adicionar pergunta
          </button>
        </div>
        {c.perguntas.length === 0 && <p className="vazio">Nenhuma pergunta ainda. Toque em “Adicionar pergunta”.</p>}
        <ol className="lista-perguntas">
          {c.perguntas.map((p, i) => (
            <li key={p.id} className="item-pergunta">
              <span className="item-numero">{i + 1}</span>
              {p.imagem && <Figura imagem={p.imagem} tamanho="pequena" />}
              <div className="item-info">
                <strong>{p.enunciado}</strong>
                <span>
                  {p.destaque && `${p.destaque} · `}✔ {p.alternativas[p.correta]}
                </span>
              </div>
              <div className="item-acoes">
                <button className="botao botao-icone" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir">
                  ⬆
                </button>
                <button className="botao botao-icone" onClick={() => mover(i, 1)} disabled={i === c.perguntas.length - 1} aria-label="Descer">
                  ⬇
                </button>
                <button className="botao botao-pequeno botao-azul" onClick={() => setPerguntaEditada({ pergunta: p, indice: i })}>
                  ✏️ Editar
                </button>
                <button
                  className="botao botao-pequeno botao-vermelho"
                  aria-label="Apagar pergunta"
                  onClick={() => alterar({ perguntas: c.perguntas.filter((_, j) => j !== i) })}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ol>
        {c.perguntas.length > 0 && (
          <button className="botao botao-grande botao-verde botao-salvar-baixo" onClick={salvar}>
            💾 Salvar conteúdo
          </button>
        )}
      </section>

      <AnimatePresence>
        {perguntaEditada && (
          <EditorPergunta
            inicial={perguntaEditada.pergunta}
            aoCancelar={() => setPerguntaEditada(null)}
            aoSalvar={(p) => {
              const lista = [...c.perguntas]
              if (perguntaEditada.indice >= 0) lista[perguntaEditada.indice] = p
              else lista.push(p)
              alterar({ perguntas: lista })
              setPerguntaEditada(null)
            }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

// ---------------- Editor da pergunta ----------------

const CORES_ALT = ['alt-vermelha', 'alt-azul', 'alt-amarela', 'alt-verde']
const LETRAS = ['A', 'B', 'C', 'D']

function EditorPergunta({ inicial, aoSalvar, aoCancelar }: { inicial: Pergunta; aoSalvar: (p: Pergunta) => void; aoCancelar: () => void }) {
  // O editor sempre mostra 4 campos; a pergunta salva com 3 fica com o último vazio
  const [p, setP] = useState<Pergunta>(() => ({ ...inicial, alternativas: [...inicial.alternativas, '', '', '', ''].slice(0, 4) as Pergunta['alternativas'] }))
  const [erro, setErro] = useState('')
  const entradaFoto = useRef<HTMLInputElement>(null)

  const alterar = (mudanca: Partial<Pergunta>) => {
    setP((atual) => ({ ...atual, ...mudanca }))
    setErro('')
  }

  function alterarAlternativa(i: number, texto: string) {
    const alternativas = [...p.alternativas] as Pergunta['alternativas']
    alternativas[i] = texto
    alterar({ alternativas })
  }

  async function escolherFoto(arquivo: File | undefined) {
    if (!arquivo) return
    try {
      alterar({ imagem: await reduzirImagem(arquivo) })
    } catch {
      setErro('Não foi possível usar esta imagem.')
    }
  }

  function salvar() {
    const preenchidas = p.alternativas.map((a) => a.trim())
    // A última (D) pode ficar em branco: aí a pergunta tem só 3 alternativas
    const alternativas = (preenchidas[3] ? preenchidas : preenchidas.slice(0, 3)) as Pergunta['alternativas']
    if (!p.enunciado.trim()) return setErro('Escreva a pergunta.')
    if (alternativas.some((a) => !a)) return setErro('Preencha as alternativas A, B e C (a D é opcional).')
    if (p.correta >= alternativas.length) return setErro('A resposta certa não pode ser uma alternativa em branco.')
    if (new Set(alternativas.map((a) => a.toLowerCase())).size < alternativas.length) return setErro('As alternativas precisam ser diferentes.')
    aoSalvar({
      ...p,
      enunciado: p.enunciado.trim(),
      alternativas,
      dica: p.dica?.trim() || undefined,
      imagem: p.imagem?.trim() || undefined,
      // "___" ou "____" viram "__", que o jogo troca pela resposta certa
      destaque: p.destaque?.trim().replace(/_{2,}/g, '__') || undefined,
    })
  }

  return (
    <Modal largo>
      <h3>{inicial.enunciado ? 'Editar pergunta' : 'Nova pergunta'}</h3>
      <div className="formulario">
        <label className="campo">
          <span>Pergunta</span>
          <textarea
            value={p.enunciado}
            rows={2}
            maxLength={180}
            placeholder="Ex.: Qual é o maior planeta do Sistema Solar?"
            onChange={(e) => alterar({ enunciado: e.target.value })}
            autoFocus
          />
        </label>

        <div className="campo">
          <span>Figura (opcional): escolha um emoji ou envie uma foto</span>
          <div className="emoji-linha">
            <div className="previa-figura">{p.imagem ? <Figura imagem={p.imagem} tamanho="pequena" /> : <span className="sem-figura">sem figura</span>}</div>
            <div className="emojis-rapidos">
              {EMOJIS_RAPIDOS.map((e) => (
                <button key={e} className={`emoji-opcao ${p.imagem === e ? 'ativo' : ''}`} onClick={() => alterar({ imagem: e })}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="botoes-lado esquerda">
            <input
              className="entrada-emoji"
              placeholder="Cole um emoji"
              value={p.imagem && !p.imagem.startsWith('data:') && !p.imagem.startsWith('http') ? p.imagem : ''}
              maxLength={24}
              onChange={(e) => alterar({ imagem: e.target.value })}
            />
            <button className="botao botao-pequeno botao-azul" onClick={() => entradaFoto.current?.click()}>
              📷 Enviar foto
            </button>
            {p.imagem && (
              <button className="botao botao-pequeno botao-vermelho" onClick={() => alterar({ imagem: undefined })}>
                Remover figura
              </button>
            )}
            <input ref={entradaFoto} type="file" accept="image/*" hidden onChange={(e) => void escolherFoto(e.target.files?.[0])} />
          </div>
        </div>

        <label className="campo">
          <span>Texto em destaque (opcional): aparece grande junto da figura. Use __ para a parte que falta</span>
          <input
            value={p.destaque ?? ''}
            maxLength={20}
            placeholder="Ex.: __LEIA, CA__LO, 3 + 4"
            onChange={(e) => alterar({ destaque: e.target.value })}
          />
          {p.destaque?.includes('__') && (
            <small className="explicacao-destaque">Na hora da resposta, o __ é trocado pela alternativa certa.</small>
          )}
        </label>

        <div className="campo">
          <span>Alternativas: toque no círculo da resposta certa (deixe a D em branco para ter só 3)</span>
          <div className="editor-alternativas">
            {p.alternativas.map((a, i) => (
              <div key={i} className={`editor-alt ${CORES_ALT[i]} ${p.correta === i ? 'marcada' : ''}`}>
                <button
                  className="marcar-correta"
                  aria-label={`Marcar alternativa ${LETRAS[i]} como correta`}
                  aria-pressed={p.correta === i}
                  onClick={() => alterar({ correta: i })}
                >
                  {p.correta === i ? '✔' : LETRAS[i]}
                </button>
                <input value={a} maxLength={60} placeholder={i === 3 ? 'Alternativa D (opcional)' : `Alternativa ${LETRAS[i]}`} onChange={(e) => alterarAlternativa(i, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <label className="campo">
          <span>Dica para a “Ajuda do Professor” (opcional)</span>
          <input value={p.dica ?? ''} maxLength={140} placeholder="Ex.: Ele tem anéis bem grandes!" onChange={(e) => alterar({ dica: e.target.value })} />
        </label>

        {erro && <p className="erro">{erro}</p>}
        <div className="botoes-lado">
          <button className="botao botao-grande botao-vermelho" onClick={aoCancelar}>
            Cancelar
          </button>
          <button className="botao botao-grande botao-verde" onClick={salvar}>
            ✔ Salvar pergunta
          </button>
        </div>
      </div>
    </Modal>
  )
}
