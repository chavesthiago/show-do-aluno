import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Modal({ children, aoFechar, largo = false }: { children: ReactNode; aoFechar?: () => void; largo?: boolean }) {
  return (
    <motion.div
      className="modal-fundo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={aoFechar}
    >
      <motion.div
        className={`modal ${largo ? 'modal-largo' : ''}`}
        role="dialog"
        aria-modal="true"
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
