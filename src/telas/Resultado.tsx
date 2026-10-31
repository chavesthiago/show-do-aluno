import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useApp } from '../estado/app'
import { confeteVitoria } from '../servicos/confete'
import { falar } from '../servicos/narracao'
import { sons } from '../servicos/sons'

export function Resultado() {
  const { partida, recordes, config, irPara, iniciarPartida } = useApp()

  const acertos = partida?.resultados.filter((r) => r === 'certo').length ?? 0
  const total = partida?.perguntas.length ?? 0
  const taxa = total ? acertos / total : 0
  const estrelas = taxa >= 0.9 ? 3 : taxa >= 0.6 ? 2 : taxa >= 0.3 ? 1 : 0
  const mensagem = [
    'Todo campeão começa assim. Vamos tentar de novo? 💪',
    'Bom começo! Treinando você vai longe! 🌱',
    'Muito bem! Vocês estão aprendendo muito! 🚀',
    'INCRÍVEL! Vocês são campeões! 🏆',
  ][estrelas]
  const novoRecorde = partida ? recordes[partida.conteudo.id] === partida.pontos && partida.pontos > 0 : false

  useEffect(() => {
    sons.vitoria()
    if (estrelas >= 1 && !config.poucaAnimacao) confeteVitoria()
    falar(`Vocês acertaram ${acertos} de ${total} perguntas! ${mensagem.replace(/[^\p{L}\p{N}\s!.?,]/gu, '')}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!partida) return null

  return (
    <main className="tela tela-centro resultado">
      <motion.h2 className="resultado-titulo" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        Fim de jogo!
      </motion.h2>

      <div className="estrelas-resultado" aria-label={`${estrelas} de 3 estrelas`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`estrela-grande ${i < estrelas ? 'acesa' : ''}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4 + i * 0.35, type: 'spring', stiffness: 200 }}
          >
            ★
          </motion.span>
        ))}
      </div>

      <motion.div className="resultado-cartao" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
        <p className="resultado-acertos">
          Acertos: <strong>{acertos}</strong> de <strong>{total}</strong>
        </p>
        <p className="resultado-pontos">⭐ {partida.pontos} pontos</p>
        {novoRecorde && <p className="novo-recorde">🏆 NOVO RECORDE!</p>}
        <p className="resultado-mensagem">{mensagem}</p>
      </motion.div>

      <div className="botoes-lado">
        <button
          className="botao botao-grande botao-verde"
          onClick={() => {
            sons.inicio()
            iniciarPartida(partida.conteudo, total)
          }}
          autoFocus
        >
          🔁 Jogar de novo
        </button>
        <button className="botao botao-grande botao-azul" onClick={() => irPara('conteudos')}>
          📚 Outro conteúdo
        </button>
        <button className="botao botao-grande botao-roxo" onClick={() => irPara('menu')}>
          🏠 Menu
        </button>
      </div>
    </main>
  )
}
