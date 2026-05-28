// src/portfolio.jsx — Fotos teaser: preview + link para fotos.html

const PREVIEW_ITEMS = [
  { id: 0, label: "Shows ao Vivo" },
  { id: 1, label: "Festivais" },
  { id: 2, label: "Festas Premium" },
  { id: 3, label: "Bastidores" },
  { id: 4, label: "Sunset Sessions" },
  { id: 5, label: "Eventos Especiais" },
];

function Portfolio({ defaultLayout }) {
  return (
    <section className="sec" id="portfolio" style={{ background: "linear-gradient(180deg, #08070a 0%, #0a0a0a 100%)" }}>
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <div className="eyebrow"><span className="dot"></span>Galeria</div>
            <h2 className="display">Momentos que viraram história.</h2>
            <p>
              Shows, festivais, festas premium e bastidores — uma coleção de registros que
              documentam cada experiência que a Eventos Litoral já proporcionou.
            </p>
          </div>
          <div className="right">
            <a href="fotos.html" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--gold)", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase" }}>
              Ver galeria completa <span style={{ display: "inline-block", transition: "transform .2s" }}>→</span>
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PREVIEW_ITEMS.map((item) => (
            <a
              key={item.id}
              href="fotos.html"
              style={{
                position: "relative",
                aspectRatio: "4/3",
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                display: "block",
                textDecoration: "none",
              }}
              className="pf-preview-cell"
            >
              <image-slot id={`pf-prev-${item.id}`} shape="rect" placeholder={item.label}></image-slot>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,.8) 100%)",
                pointerEvents: "none",
              }}></div>
              <span style={{
                position: "absolute", bottom: 16, left: 18, right: 18,
                fontFamily: "var(--font-display)", fontWeight: "var(--display-weight)",
                fontSize: 18, color: "var(--ink)", letterSpacing: ".01em",
              }}>{item.label}</span>
            </a>
          ))}
        </div>

        <style>{`
          @media (max-width: 880px) { .pf-preview-cell { aspect-ratio: 3/2 !important } }
          @media (max-width: 880px) { #portfolio .sec-head + div { grid-template-columns: repeat(2,1fr) !important } }
          @media (max-width: 520px) { #portfolio .sec-head + div { grid-template-columns: 1fr !important } }

          .pf-preview-cell { transition: transform .35s ease, border-color .3s }
          .pf-preview-cell:hover { transform: translateY(-4px); border-color: rgba(212,175,55,.4) !important }
        `}</style>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a href="fotos.html" className="btn btn-ghost">
            Ver todas as fotos <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Portfolio });
