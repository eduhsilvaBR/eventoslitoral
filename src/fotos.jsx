// src/fotos.jsx — Galeria com Interactive List + Lightbox + Viewer

const { useState, useRef, useEffect: useEff } = React;

const ALBUMS_DEFAULT = [
  { id:1, slug:"shows-ao-vivo",      title:"Shows ao Vivo",       category:"Música",         year:"2025", count:"48 fotos" },
  { id:2, slug:"festivais",          title:"Festivais",           category:"Festival",       year:"2025", count:"64 fotos" },
  { id:3, slug:"festas-premium",     title:"Festas Premium",      category:"Entretenimento", year:"2024", count:"36 fotos" },
  { id:4, slug:"sunset-sessions",    title:"Sunset Sessions",     category:"Especial",       year:"2024", count:"31 fotos" },
  { id:5, slug:"bastidores",         title:"Bastidores",          category:"Making Of",      year:"2023", count:"28 fotos" },
  { id:6, slug:"eventos-especiais",  title:"Eventos Especiais",   category:"Corporativo",    year:"2023", count:"22 fotos" },
  { id:7, slug:"beira-mar",          title:"Beira-Mar",           category:"Open Air",       year:"2022", count:"40 fotos" },
  { id:8, slug:"colecao-2022",       title:"Coleção 2022",        category:"Arquivo",        year:"2022", count:"55 fotos" },
];

const PER_ALBUM = 12;

function pad(n) { return String(n).padStart(2, "0"); }

function getSlotUrl(slotsData, id) {
  const v = slotsData[id];
  if (!v) return null;
  const u = typeof v === 'string' ? v : v.u;
  return u && /^data:image\//i.test(u) ? u : null;
}

function albumPhotos(slotsData, slug) {
  const out = [];
  for (let i = 0; i < PER_ALBUM; i++) {
    const id = `fotos-album-${slug}-${i}`;
    const url = getSlotUrl(slotsData, id);
    if (url) out.push({ id, url, idx: i });
  }
  return out;
}

/* ── SINGLE PHOTO VIEWER ─────────────────────────────────── */
function Viewer({ photos, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const photo = photos[idx];

  useEff(() => {
    function onKey(e) {
      if (e.key === 'Escape')       onClose();
      if (e.key === 'ArrowRight')   setIdx(i => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft')    setIdx(i => (i - 1 + photos.length) % photos.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos.length]);

  if (!photo) return null;

  return (
    <div className="lb-viewer" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lb-viewer-close" onClick={onClose}>✕</button>

      {photos.length > 1 && (
        <button className="lb-viewer-nav lb-viewer-prev"
          onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}>‹</button>
      )}

      <div className="lb-viewer-img-wrap">
        <img src={photo.url} alt="" className="lb-viewer-img" />
      </div>

      {photos.length > 1 && (
        <button className="lb-viewer-nav lb-viewer-next"
          onClick={() => setIdx(i => (i + 1) % photos.length)}>›</button>
      )}

      <div className="lb-viewer-counter">{idx + 1} / {photos.length}</div>
    </div>
  );
}

/* ── LIGHTBOX (álbum) ────────────────────────────────────── */
function Lightbox({ album, slotsData, onClose }) {
  const [viewerIdx, setViewerIdx] = useState(null);
  const photos = albumPhotos(slotsData, album.slug);

  useEff(() => {
    function onKey(e) { if (e.key === 'Escape' && viewerIdx === null) onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx]);

  return (
    <div className="lb-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lb-inner">
        {/* header */}
        <div className="lb-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              <span className="dot"></span>{album.category} · {album.year}
            </div>
            <h2 className="display lb-title">{album.title}</h2>
          </div>
          <button className="lb-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* grid */}
        {photos.length > 0 ? (
          <div className="lb-grid">
            {photos.map((p, i) => (
              <div key={p.id} className="lb-cell" onClick={() => setViewerIdx(i)}>
                <img src={p.url} alt="" className="lb-cell-img" />
                <div className="lb-cell-hover"><span>↗</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="lb-empty">
            <span>Nenhuma foto adicionada ainda.</span>
            <span style={{ fontSize:12, marginTop:8, color:'var(--ink-mute)' }}>
              Adicione fotos no painel admin → Galeria → {album.title}
            </span>
          </div>
        )}
      </div>

      {/* viewer fullscreen */}
      {viewerIdx !== null && (
        <Viewer
          photos={photos}
          startIdx={viewerIdx}
          onClose={() => setViewerIdx(null)}
        />
      )}
    </div>
  );
}

/* ── PÁGINA PRINCIPAL ────────────────────────────────────── */
function FotosPage() {
  const [active, setActive]       = useState(null);   // hover
  const [openAlbum, setOpenAlbum] = useState(null);   // lightbox
  const [albums, setAlbums]       = useState(ALBUMS_DEFAULT);
  const [slotsData, setSlotsData] = useState({});
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const containerRef              = useRef(null);

  // Dados CMS
  useEff(() => {
    fetch('cms.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => { if (d.albums && d.albums.length) setAlbums(d.albums); })
      .catch(() => {});
  }, []);

  // Slots de imagem (para lightbox)
  useEff(() => {
    fetch('.image-slots.state.json?_=' + Date.now())
      .then(r => r.json())
      .then(setSlotsData)
      .catch(() => {});
  }, []);

  // Travar scroll quando lightbox aberto
  useEff(() => {
    document.body.style.overflow = openAlbum ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openAlbum]);

  function handleMouseMove(e) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const albObj = openAlbum ? albums.find(a => a.slug === openAlbum) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="index.html" aria-label="Eventos Litoral">
            <img className="nav-logo" src="LOGO.png" alt="Eventos Litoral" />
          </a>
          <div className="nav-links">
            <a href="index.html#eventos">Eventos</a>
            <a href="index.html#sobre">Sobre</a>
            <a href="fotos.html" style={{ color:"var(--gold)" }}>Fotos</a>
            <a href="index.html#contato">Contato</a>
          </div>
          <button className="nav-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span style={menuOpen ? {transform:'rotate(45deg) translate(5px,5px)'} : {}}></span>
            <span style={menuOpen ? {opacity:0} : {}}></span>
            <span style={menuOpen ? {transform:'rotate(-45deg) translate(5px,-5px)'} : {}}></span>
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <a href="index.html#eventos" onClick={() => setMenuOpen(false)}>Eventos</a>
        <a href="index.html#sobre"   onClick={() => setMenuOpen(false)}>Sobre</a>
        <a href="fotos.html"         onClick={() => setMenuOpen(false)} style={{ color:"var(--gold)" }}>Fotos</a>
        <a href="index.html#contato" onClick={() => setMenuOpen(false)}>Contato</a>
      </div>

      {/* HEADER */}
      <div className="fotos-header">
        <div className="container">
          <div className="fotos-header-inner">
            <div>
              <div className="eyebrow"><span className="dot"></span>Galeria de Fotos</div>
              <h1 className="display fotos-title">
                Cada frame,<br/><em>uma história.</em>
              </h1>
            </div>
            <div className="fotos-header-meta">
              <span className="fotos-total">{albums.reduce((s, a) => s + parseInt(a.count), 0)}+</span>
              <span style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--ink-mute)" }}>fotografias</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hairline" />

      {/* INTERACTIVE LIST */}
      <div
        className="il-wrapper"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActive(null)}
      >
        {/* imagem flutuante no cursor */}
        <div
          className="il-cursor-img"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            opacity: active !== null ? 1 : 0,
          }}
        >
          {albums.map(alb => (
            <div key={alb.id} className="il-cursor-img-item"
              style={{ opacity: active === alb.id ? 1 : 0, transition:"opacity .35s ease" }}>
              <image-slot id={`fotos-cursor-${alb.slug}`} shape="rect" placeholder={alb.title}
                style={{ width:"100%", height:"100%", display:"block" }}></image-slot>
            </div>
          ))}
        </div>

        <div className="container">
          <ul className="il-list">
            {albums.map((alb, i) => (
              <li
                key={alb.id}
                className={`il-item${active === alb.id ? " il-item--active" : ""}${active !== null && active !== alb.id ? " il-item--dim" : ""}`}
                onMouseEnter={() => setActive(alb.id)}
                onClick={() => setOpenAlbum(alb.slug)}
                style={{ cursor: "pointer" }}
              >
                <span className="il-num">{pad(i + 1)}</span>
                <span className="il-title">{alb.title}</span>
                <span className="il-rule"></span>
                <span className="il-meta">
                  <span className="il-cat">{alb.category}</span>
                  <span className="il-sep">·</span>
                  <span className="il-year">{alb.year}</span>
                  <span className="il-sep">·</span>
                  <span className="il-count">{alb.count}</span>
                </span>
                <span className="il-arrow">→</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="container ft">
          <img className="ft-logo" src="LOGO.png" alt="Eventos Litoral" />
          <div className="ft-meta">
            © {new Date().getFullYear()} Eventos Litoral · Litoral Paulista · Todos os direitos reservados
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {albObj && (
        <Lightbox
          album={albObj}
          slotsData={slotsData}
          onClose={() => setOpenAlbum(null)}
        />
      )}
    </>
  );
}

Object.assign(window, { FotosPage });
