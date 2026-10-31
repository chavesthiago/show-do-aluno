// Fundo de "palco de programa de TV": holofotes e estrelinhas

const ESTRELAS = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  atraso: (i % 6) * 0.7,
  tamanho: 6 + ((i * 7) % 10),
}))

export function Fundo() {
  return (
    <div className="fundo" aria-hidden="true">
      <div className="holofote holofote-esq" />
      <div className="holofote holofote-dir" />
      {ESTRELAS.map((e, i) => (
        <span
          key={i}
          className="estrelinha"
          style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${e.atraso}s`, width: e.tamanho, height: e.tamanho }}
        />
      ))}
      <div className="palco" />
    </div>
  )
}
