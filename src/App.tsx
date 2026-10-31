import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Fundo } from './componentes/Fundo'
import { useApp } from './estado/app'
import { Abertura } from './telas/Abertura'
import { Conteudos } from './telas/Conteudos'
import { Jogo } from './telas/Jogo'
import { Menu } from './telas/Menu'
import { Professor } from './telas/Professor'
import { Resultado } from './telas/Resultado'

const TELAS = {
  abertura: Abertura,
  menu: Menu,
  conteudos: Conteudos,
  jogo: Jogo,
  resultado: Resultado,
  professor: Professor,
}

export default function App() {
  const tela = useApp((s) => s.tela)
  const poucaAnimacao = useApp((s) => s.config.poucaAnimacao)
  const partidaId = useApp((s) => s.partida?.perguntas[0]?.id)
  const TelaAtual = TELAS[tela]

  return (
    // "user": respeita a opção "reduzir movimento" do aparelho
    <MotionConfig reducedMotion={poucaAnimacao ? 'always' : 'user'}>
      <div className={`app ${poucaAnimacao ? 'pouca-animacao' : ''}`}>
        <Fundo />
        <AnimatePresence mode="wait">
          <motion.div
            key={tela === 'jogo' ? `jogo-${partidaId}` : tela}
            className="camada-tela"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.25 }}
          >
            <TelaAtual />
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
