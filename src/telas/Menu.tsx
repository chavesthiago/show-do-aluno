import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from '../componentes/Logo'
import { useApp } from '../estado/app'
import { sons } from '../servicos/sons'
import { narracaoDisponivel } from '../servicos/narracao'
import { alternarTelaCheia, telaCheiaDisponivel } from '../servicos/telaCheia'

interface EventoInstalar extends Event {
  prompt: () => Promise<void>
}

export function Menu() {
  const { irPara, config, alterarConfig } = useApp()
  const [instalar, setInstalar] = useState<EventoInstalar | null>(null)

  useEffect(() => {
    const aoPoderInstalar = (e: Event) => {
      e.preventDefault()
      setInstalar(e as EventoInstalar)
    }
    window.addEventListener('beforeinstallprompt', aoPoderInstalar)
    return () => window.removeEventListener('beforeinstallprompt', aoPoderInstalar)
  }, [])

  const ir = (tela: 'conteudos' | 'professor') => {
    sons.clique()
    irPara(tela)
  }

  return (
    <main className="tela tela-centro menu">
      <Logo pequeno />

      <div className="menu-botoes">
        <motion.button
          className="botao botao-gigante botao-verde"
          onClick={() => ir('conteudos')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          autoFocus
        >
          🎮 JOGAR
        </motion.button>
        <motion.button
          className="botao botao-grande botao-roxo"
          onClick={() => ir('professor')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
        >
          🧑‍🏫 Área do Professor
        </motion.button>
      </div>

      <div className="menu-opcoes">
        <Alternador rotulo="Sons" emoji={config.som ? '🔊' : '🔇'} ativo={config.som} aoMudar={(v) => alterarConfig({ som: v })} />
        {narracaoDisponivel() && (
          <>
            <Alternador rotulo="Narração" emoji="🗣️" ativo={config.narracao} aoMudar={(v) => alterarConfig({ narracao: v })} />
            <Alternador
              rotulo="Ler alternativas"
              emoji="🔤"
              ativo={config.narrarAlternativas}
              aoMudar={(v) => alterarConfig({ narrarAlternativas: v })}
            />
          </>
        )}
        <Alternador rotulo="Menos animação" emoji="🐢" ativo={config.poucaAnimacao} aoMudar={(v) => alterarConfig({ poucaAnimacao: v })} />
        {telaCheiaDisponivel() && (
          <button className="botao botao-opcao" onClick={() => void alternarTelaCheia()}>
            ⛶ Tela cheia
          </button>
        )}
        {instalar && (
          <button
            className="botao botao-opcao"
            onClick={async () => {
              await instalar.prompt()
              setInstalar(null)
            }}
          >
            📲 Instalar app
          </button>
        )}
      </div>

      <footer className="rodape">
        Professora Luiza | Escola Municipal Sebastião Borges Barreto
        </a>
      </footer>
    </main>
  )
}

function Alternador({ rotulo, emoji, ativo, aoMudar }: { rotulo: string; emoji: string; ativo: boolean; aoMudar: (v: boolean) => void }) {
  return (
    <button
      className={`botao botao-opcao ${ativo ? 'ligado' : 'desligado'}`}
      role="switch"
      aria-checked={ativo}
      onClick={() => {
        aoMudar(!ativo)
        sons.clique()
      }}
    >
      <span>{emoji}</span> {rotulo}
      <span className="interruptor" aria-hidden="true">
        <span />
      </span>
    </button>
  )
}
