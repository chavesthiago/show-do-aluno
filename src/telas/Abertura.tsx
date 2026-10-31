import { motion } from 'framer-motion'
import { Logo } from '../componentes/Logo'
import { useApp } from '../estado/app'
import { destravarAudio, sons } from '../servicos/sons'
import { destravarNarracao } from '../servicos/narracao'

export function Abertura() {
  const irPara = useApp((s) => s.irPara)

  function comecar() {
    // Este toque "libera" som e voz no iPhone/iPad
    destravarAudio()
    destravarNarracao()
    sons.inicio()
    irPara('menu')
  }

  return (
    <main className="tela tela-centro abertura">
      <Logo />
      <motion.p
        className="abertura-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Português e Matemática do jeito mais divertido! 🎉
      </motion.p>
      <motion.button
        className="botao botao-gigante botao-amarelo pulsar"
        onClick={comecar}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileTap={{ scale: 0.92 }}
        autoFocus
      >
        ▶ TOCAR PARA COMEÇAR
      </motion.button>
    </main>
  )
}
