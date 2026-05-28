// src/events.jsx — Próximos eventos cards (3 estilos) — dados lidos do cms.json

const DEFAULT_EVENTOS = [
  { id:"ev1", nome:"Sunset Beats Litoral",    dia:"15", mes:"Jun", ano:"2026", dataFull:"15 de Junho · Sábado",  local:"Arena Guarujá — SP",    atracao:"DJ convidado + Open Sunset",  tag:"Festival" },
  { id:"ev2", nome:"Noite Sertaneja Premium", dia:"22", mes:"Jun", ano:"2026", dataFull:"22 de Junho · Sábado",  local:"Espaço Litoral Eventos", atracao:"Dupla sertaneja ao vivo",     tag:"Show"     },
  { id:"ev3", nome:"Baile do Litoral",        dia:"06", mes:"Jul", ano:"2026", dataFull:"06 de Julho · Sábado",  local:"Praia Club Santos",      atracao:"Funk, eletrônico e convidados", tag:"Festa"  },
  { id:"ev4", nome:"Festival Verão Litoral",  dia:"20", mes:"Jul", ano:"2026", dataFull:"20 de Julho · Sábado",  local:"Marina · Área Externa",  atracao:"Shows ao vivo + DJs",         tag:"Festival" },
];

// ID canônico por evento — todos os estilos de card usam o mesmo slot
function evImgId(ev) { return `ev-img-${ev.id}`; }

function EventCardA({ ev }) {
  return (
    <article className="card-A">
      <div className="art">
        <image-slot id={evImgId(ev)} shape="rect" placeholder={`Arte de ${ev.nome}`}></image-slot>
      </div>
      <div className="body">
        <div className="date-row">
          <span>{ev.dataFull}</span><span className="sep"></span><span>{ev.tag}</span>
        </div>
        <h3>{ev.nome}</h3>
        <div className="meta"><span className="lbl">Local</span><span>{ev.local}</span></div>
        <div className="meta"><span className="lbl">Atração</span><span>{ev.atracao}</span></div>
        <div className="foot">
          <a href={ev.link || "#contato"} target={ev.link ? "_blank" : "_self"} rel="noopener noreferrer">
            Garantir ingresso <span>→</span>
          </a>
          <span style={{ color:"var(--ink-mute)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase" }}>{ev.dia}.{ev.mes}</span>
        </div>
      </div>
    </article>
  );
}

function EventCardB({ ev }) {
  return (
    <article className="card-B">
      <div className="stub">
        <div className="day">{ev.dia}</div>
        <div className="mo">{ev.mes}</div>
        <div className="yr">{ev.ano}</div>
      </div>
      <div className="body">
        <div className="art-mini">
          <image-slot id={evImgId(ev)} shape="rect" placeholder={`Arte ${ev.nome}`}></image-slot>
        </div>
        <h3>{ev.nome}</h3>
        <div className="meta">
          <div><b>Local · </b>{ev.local}</div>
          <div><b>Atração · </b>{ev.atracao}</div>
        </div>
        <div className="foot">
          <span>{ev.tag}</span>
          <a href={ev.link || "#contato"} target={ev.link ? "_blank" : "_self"} rel="noopener noreferrer">Ingresso →</a>
        </div>
      </div>
    </article>
  );
}

function EventCardC({ ev }) {
  return (
    <article className="card-C">
      <image-slot id={evImgId(ev)} shape="rect" placeholder={`Arte de ${ev.nome}`}></image-slot>
      <div className="badge">{ev.tag}</div>
      <div className="overlay"></div>
      <div className="info">
        <div className="date">{ev.dataFull}</div>
        <h3>{ev.nome}</h3>
        <div className="meta">{ev.local} · {ev.atracao}</div>
        {ev.link && (
          <a
            href={ev.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:12,
              fontSize:10, letterSpacing:".2em", textTransform:"uppercase",
              color:"var(--gold)", fontWeight:600 }}
          >
            Ingressos →
          </a>
        )}
      </div>
    </article>
  );
}

function Events({ cardStyle }) {
  const [eventos, setEventos] = React.useState(DEFAULT_EVENTOS);

  React.useEffect(() => {
    fetch('cms.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => { if (d.eventos && d.eventos.length) setEventos(d.eventos); })
      .catch(() => {});
  }, []);

  const Card = cardStyle === "ticket" ? EventCardB : cardStyle === "poster" ? EventCardC : EventCardA;
  const gridStyle = cardStyle === "poster"
    ? { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }
    : null;

  return (
    <section className="sec" id="eventos">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <div className="eyebrow"><span className="dot"></span>Agenda 2026</div>
            <h2 className="display">Próximos eventos</h2>
            <p>
              Confira os próximos eventos que vão movimentar o litoral. Shows, festas, experiências
              exclusivas e atrações especiais em uma programação feita para quem busca diversão,
              música boa e momentos inesquecíveis.
            </p>
          </div>
          <div className="right">
            <span>{eventos.length.toString().padStart(2,'0')} eventos confirmados</span>
          </div>
        </div>

        <div className={cardStyle === "poster" ? "" : "events-grid"}
             style={gridStyle ? { ...gridStyle } : undefined}>
          {eventos.map(ev => <Card key={ev.id} ev={ev} />)}
        </div>
      </div>

      <style>{`
        @media (max-width:880px){ [style*="repeat(4"] { grid-template-columns:repeat(2,1fr) !important } }
        @media (max-width:520px){ [style*="repeat(4"] { grid-template-columns:1fr !important } }
      `}</style>
    </section>
  );
}

Object.assign(window, { Events });
