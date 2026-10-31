import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Figura } from '../componentes/Figura'
import { Modal } from '../componentes/Modal'
import { useApp } from '../estado/app'
import { confeteAcerto } from '../servicos/confete'
import { falar, parar, textoParaFala } from '../servicos/narracao'
import { sons } from '../servicos/sons'

/** Cada alternativa tem cor, letra e forma (ajuda quem tem daltonismo) */
const ESTILOS = [
  { letra: 'A', forma: '▲', classe: 'alt-vermelha' },
  { letra: 'B', forma: '◆', classe: 'alt-azul' },
  { letra: 'C', forma: '●', classe: 'alt-amarela' },
  { letra: 'D', forma: '■', classe: 'alt-verde' },
]

const ELOGIOS = ['MUITO BEM!', 'ARRASOU!', 'ACERTOU!', 'SENSACIONAL!', 'ISSO AÍ!', 'MANDOU BEM!']
const INCENTIVOS = ['QUASE!', 'NÃO FOI DESSA VEZ!', 'TUDO BEM, VAMOS APRENDER!']

export function Jogo() {
  const { partida, config, escolher, revelar, proxima, pular, eliminarDuas, usarAjudaProfessor, irPara } = useApp()
  const [mostrarDica, setMostrarDica] = useState(false)
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [frase, setFrase] = useState('')

  const pergunta = partida?.perguntas[partida.indice]

  const narrarPergunta = useCallback(
    (forcar = false) => {
      if (!pergunta) return
      let texto = pergunta.fala ?? [pergunta.enunciado, pergunta.destaque && !pergunta.destaque.includes('__') ? pergunta.destaque : ''].join(' ')
      if (config.narrarAlternativas || forcar) {
        texto += '. ' + pergunta.alternativas.map((a, i) => `${ESTILOS[i].letra}: ${a}`).join('. ')
      }
      falar(textoParaFala(texto), forcar)
    },
    [pergunta, config.narrarAlternativas],
  )

  // Narra cada nova pergunta
  useEffect(() => {
    if (partida?.fase === 'pergunta') {
      const t = setTimeout(() => narrarPergunta(), 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partida?.indice])

  // Suspense ("Está certo disso?") e depois revela
  useEffect(() => {
    if (partida?.fase !== 'suspense') return
    parar()
    const espera = config.poucaAnimacao ? 600 : 1600
    sons.suspense(espera / 1000)
    const t = setTimeout(revelar, espera)
    return () => clearTimeout(t)
  }, [partida?.fase, config.poucaAnimacao, revelar])

  // Reação ao resultado
  useEffect(() => {
    if (partida?.fase !== 'revelada' || !pergunta) return
    const ultimo = partida.resultados[partida.resultados.length - 1]
    if (ultimo === 'certo') {
      const f = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]
      setFrase(f)
      sons.acerto()
      if (!config.poucaAnimacao) confeteAcerto()
      falar(f.toLowerCase())
    } else if (ultimo === 'errado') {
      const f = INCENTIVOS[Math.floor(Math.random() * INCENTIVOS.length)]
      setFrase(f)
      sons.erro()
      falar(textoParaFala(`${f.toLowerCase()} A resposta certa é: ${pergunta.alternativas[pergunta.correta]}`))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partida?.fase])

  // Teclado: 1-4 ou A-D respondem; Enter/Espaço avança (bom para controle de apresentação)
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (!partida || mostrarDica || confirmarSaida) return
      const tecla = e.key.toLowerCase()
      const mapa: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 }
      if (partida.fase === 'pergunta' && tecla in mapa && mapa[tecla] < pergunta!.alternativas.length) {
        sons.selecionar()
        escolher(mapa[tecla])
      } else if (partida.fase === 'revelada' && (tecla === 'enter' || tecla === ' ' || tecla === 'arrowright' || tecla === 'pagedown')) {
        e.preventDefault()
        avancar()
      } else if (tecla === 'escape') {
        setConfirmarSaida(true)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  })

  if (!partida || !pergunta) return null

  const { fase, escolhida, eliminadas, ajudas, indice, perguntas, pontos, resultados } = partida
  const ultimo = resultados[resultados.length - 1]
  const acertou = fase === 'revelada' && ultimo === 'certo'
  const ehUltima = indice + 1 >= perguntas.length

  function avancar() {
    parar()
    sons.clique()
    proxima()
  }

  function estadoAlternativa(i: number): string {
    if (eliminadas.includes(i)) return 'eliminada'
    if (fase === 'suspense' && escolhida === i) return 'escolhida'
    if (fase === 'revelada') {
      if (i === pergunta!.correta) return 'correta'
      if (i === escolhida) return 'errada'
      return 'apagada'
    }
    return ''
  }

  return (
    <main className={`tela jogo ${config.poucaAnimacao ? 'pouca-animacao' : ''}`}>
      {/* Barra superior */}
      <header className="jogo-topo">
        <button className="botao botao-voltar" onClick={() => setConfirmarSaida(true)} aria-label="Sair do jogo">
          ✖
        </button>
        <div className="jogo-titulo">
          <span>{partida.conteudo.emoji}</span> {partida.conteudo.titulo}
        </div>
        <div className="placar" aria-label={`${pontos} pontos`}>
          <motion.span key={pontos} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
            ⭐ {pontos}
          </motion.span>
        </div>
      </header>

      {/* Progresso: uma bolinha por pergunta */}
      <div className="progresso" aria-label={`Pergunta ${indice + 1} de ${perguntas.length}`}>
        {perguntas.map((_, i) => (
          <span
            key={i}
            className={`bolinha ${i === indice ? 'atual' : ''} ${resultados[i] ?? ''}`}
            aria-hidden="true"
          >
            {resultados[i] === 'certo' ? '✓' : resultados[i] === 'errado' ? '✗' : resultados[i] === 'pulou' ? '»' : i + 1}
          </span>
        ))}
      </div>

      {/* Pergunta */}
      <AnimatePresence mode="wait">
        <motion.section
          key={indice}
          className="pergunta"
          initial={{ x: 300, opacity: 0, rotate: 3 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: -300, opacity: 0, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <div className="pergunta-numero">
            Pergunta {indice + 1} de {perguntas.length}
          </div>
          <div className={`pergunta-conteudo ${pergunta.imagem || pergunta.destaque ? '' : 'sem-figura'}`}>
            {(pergunta.imagem || pergunta.destaque) && (
              <motion.div
                className="pergunta-figura"
                animate={acertou && !config.poucaAnimacao ? { rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.8 }}
              >
                <Figura imagem={pergunta.imagem} />
                {pergunta.destaque && <div className="destaque">{fase === 'revelada' && pergunta.destaque.includes('__') ? pergunta.destaque.replace('__', pergunta.alternativas[pergunta.correta]) : pergunta.destaque}</div>}
              </motion.div>
            )}
            <h2 className="enunciado">{pergunta.enunciado}</h2>
          </div>
          <button className="botao botao-ouvir" onClick={() => narrarPergunta(true)} aria-label="Ouvir a pergunta">
            🔊
          </button>
        </motion.section>
      </AnimatePresence>

      {/* Alternativas */}
      <div className={`alternativas ${pergunta.alternativas.length === 3 ? 'tres' : ''}`} key={'alt-' + indice}>
        {pergunta.alternativas.map((texto, i) => {
          const estado = estadoAlternativa(i)
          return (
            <motion.button
              key={i}
              className={`alternativa ${ESTILOS[i].classe} ${estado}`}
              disabled={fase !== 'pergunta' || estado === 'eliminada'}
              onClick={() => {
                sons.selecionar()
                escolher(i)
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={
                estado === 'errada' && !config.poucaAnimacao
                  ? { x: [0, -14, 14, -10, 10, 0], opacity: 1, scale: 1 }
                  : estado === 'correta' && !config.poucaAnimacao
                    ? { scale: [1, 1.08, 1], opacity: 1 }
                    : { scale: 1, opacity: estado === 'eliminada' ? 0.25 : 1 }
              }
              transition={{ delay: fase === 'pergunta' ? 0.15 + i * 0.07 : 0, duration: 0.5 }}
              whileHover={fase === 'pergunta' && estado !== 'eliminada' ? { scale: 1.03, y: -4 } : undefined}
              whileTap={fase === 'pergunta' ? { scale: 0.95 } : undefined}
            >
              <span className="alt-marca" aria-hidden="true">
                <span className="alt-forma">{ESTILOS[i].forma}</span>
                {ESTILOS[i].letra}
              </span>
              <span className="alt-texto">{texto}</span>
              {estado === 'correta' && <span className="alt-icone">✔</span>}
              {estado === 'errada' && <span className="alt-icone">✖</span>}
            </motion.button>
          )
        })}
      </div>

      {/* Ajudas ou feedback */}
      <div className="rodape-jogo">
        <AnimatePresence mode="wait">
          {fase === 'revelada' ? (
            <motion.div
              key="feedback"
              className={`feedback ${acertou ? 'feedback-certo' : 'feedback-errado'}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
            >
              <span className="feedback-texto">
                {acertou ? '🎉 ' : '💪 '}
                {frase}
                {acertou && <span className="mais-pontos"> +{100 + Math.min(partida.sequencia - 1, 5) * 20}</span>}
              </span>
              <motion.button
                className="botao botao-grande botao-amarelo"
                onClick={avancar}
                autoFocus
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                {ehUltima ? 'VER RESULTADO 🏆' : 'PRÓXIMA ▶'}
              </motion.button>
            </motion.div>
          ) : fase === 'suspense' ? (
            <motion.div key="suspense" className="suspense" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              🥁 Será que está certo?
            </motion.div>
          ) : (
            <motion.div key="ajudas" className="ajudas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BotaoAjuda emoji="⏭️" rotulo="Pular" disponivel={ajudas.pular} aoClicar={() => { sons.pular(); parar(); pular() }} />
              <BotaoAjuda emoji="✂️" rotulo={`Eliminar ${pergunta.alternativas.length - 2}`} disponivel={ajudas.eliminar} aoClicar={() => { sons.ajuda(); eliminarDuas() }} />
              <BotaoAjuda
                emoji="🧑‍🏫"
                rotulo="Ajuda do Professor"
                disponivel={ajudas.professor}
                aoClicar={() => {
                  sons.ajuda()
                  usarAjudaProfessor()
                  setMostrarDica(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mostrarDica && (
          <Modal aoFechar={() => setMostrarDica(false)}>
            <div className="modal-emoji">🧑‍🏫</div>
            <h3>Ajuda do Professor</h3>
            <p className="dica-texto">{pergunta.dica ?? 'Professor(a), dê uma dica para a turma!'}</p>
            {pergunta.dica && (
              <button className="botao botao-link" onClick={() => falar(pergunta.dica!, true)}>
                🔊 Ouvir a dica
              </button>
            )}
            <button className="botao botao-grande botao-verde" onClick={() => setMostrarDica(false)} autoFocus>
              Entendi!
            </button>
          </Modal>
        )}
        {confirmarSaida && (
          <Modal aoFechar={() => setConfirmarSaida(false)}>
            <div className="modal-emoji">🚪</div>
            <h3>Sair do jogo?</h3>
            <p>A pontuação desta partida não será guardada.</p>
            <div className="botoes-lado">
              <button className="botao botao-grande botao-verde" onClick={() => setConfirmarSaida(false)} autoFocus>
                Continuar jogando
              </button>
              <button
                className="botao botao-grande botao-vermelho"
                onClick={() => {
                  parar()
                  irPara('conteudos')
                }}
              >
                Sair
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </main>
  )
}

function BotaoAjuda({ emoji, rotulo, disponivel, aoClicar }: { emoji: string; rotulo: string; disponivel: boolean; aoClicar: () => void }) {
  return (
    <motion.button
      className={`botao botao-ajuda ${disponivel ? '' : 'usada'}`}
      disabled={!disponivel}
      onClick={aoClicar}
      whileHover={disponivel ? { scale: 1.06 } : undefined}
      whileTap={disponivel ? { scale: 0.9 } : undefined}
      aria-label={`${rotulo}${disponivel ? '' : ' (já usada)'}`}
    >
      <span className="ajuda-emoji">{emoji}</span>
      <span className="ajuda-rotulo">{rotulo}</span>
    </motion.button>
  )
}
