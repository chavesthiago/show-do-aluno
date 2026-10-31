import { motion } from 'framer-motion'

const CORES = ['#ffbe0b', '#ff4d6d', '#3a86ff', '#06d6a0', '#c77dff', '#fb5607']

export function Logo({ pequeno = false }: { pequeno?: boolean }) {
  const linha1 = 'SHOW DO'.split('')
  const linha2 = 'ALUNO'.split('')
  return (
    <h1 className={`logo ${pequeno ? 'logo-pequeno' : ''}`} aria-label="Show do Aluno">
      <span className="logo-linha" aria-hidden="true">
        {linha1.map((letra, i) => (
          <motion.span
            key={i}
            className="logo-letra"
            initial={{ y: -80, opacity: 0, rotate: -20 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 14 }}
          >
            {letra === ' ' ? ' ' : letra}
          </motion.span>
        ))}
      </span>
      <span className="logo-linha logo-grande" aria-hidden="true">
        {linha2.map((letra, i) => (
          <motion.span
            key={i}
            className="logo-letra"
            style={{ color: CORES[i % CORES.length] }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ y: -10, rotate: i % 2 ? 8 : -8 }}
            transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 400, damping: 10 }}
          >
            {letra}
          </motion.span>
        ))}
      </span>
    </h1>
  )
}
