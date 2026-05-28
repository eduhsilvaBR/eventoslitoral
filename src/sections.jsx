// src/sections.jsx — Nav, Hero, About, Contact, Footer
const { useEffect, useState, useRef } = React;

const PROXIMO_DEFAULT = {
  nome: "Sunset Beats Litoral",
  dataFull: "15 Jun · Sáb",
  local: "Arena Guarujá — SP",
  tag: "Festival",
};

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" aria-label="Eventos Litoral">
          <img className="nav-logo" src="LOGO.png" alt="Eventos Litoral" />
        </a>
        <div className="nav-links">
          <a href="#eventos">Eventos</a>
          <a href="#sobre">Sobre</a>
          <a href="fotos.html">Fotos</a>
          <a href="#contato">Contato</a>
        </div>
        <a href="#contato" className="nav-cta">Contratar</a>
      </div>
    </nav>
  );
}

function Hero() {
  const canvasRef = useRef(null);
  const [proximo, setProximo] = React.useState(PROXIMO_DEFAULT);

  useEffect(() => {
    fetch('cms.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => { if (d.proximo && d.proximo.nome) setProximo(d.proximo); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = 0, H = 0;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      r: Math.random() * 1.4 + 0.3,
      vy: Math.random() * 0.45 + 0.08,
      vx: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.55 + 0.08,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.018 + 0.004,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        p.phase += p.phaseSpeed;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;

        const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.phase));

        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${alpha})`;
        ctx.fill();

        // soft glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(212,175,55,${alpha * 0.28})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>

      {/* particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="rgba(212,175,55,0.08)" />
        <path d="M0,80 C240,110 480,40 720,80 C960,110 1200,40 1440,80" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
      </svg>

      <div className="hero-inner">
        <div className="hero-mark">
          <span className="line"></span>
          <span>Litoral · SP · Desde 2018</span>
          <span className="line"></span>
        </div>

        <h1 className="display hero-title">
          Os melhores<br/>
          eventos do <em>litoral</em><br/>
          começam aqui.
        </h1>

        <p className="hero-sub">
          Shows, festivais e experiências exclusivas produzidas com excelência — música, atmosfera e momentos que ficam para sempre.
        </p>

        <div className="hero-ctas">
          <a href="#eventos" className="btn btn-gold">
            Ver próximos eventos <span className="arrow">→</span>
          </a>
          <a href="fotos.html" className="btn btn-ghost">
            Fotos
          </a>
        </div>

        <div className="hero-meta">
          <div className="m"><b>+120</b><span>Eventos produzidos</span></div>
          <div className="m"><b>50k</b><span>Pessoas impactadas</span></div>
          <div className="m"><b>7</b><span>Anos no litoral</span></div>
        </div>

        {/* próximo evento — card com flyer */}
        <div className="hero-next">
          <div className="hero-ev-card">
            <div className="hero-ev-label">
              <span className="hero-ev-dot"></span>
              Próximo Evento
            </div>
            <div className="hero-ev-body">
              <div className="hero-ev-img">
                <image-slot id="hero-ev-flyer" shape="rect" placeholder="Flyer do evento"></image-slot>
              </div>
              <div className="hero-ev-info">
                <span className="hero-ev-tag">{proximo.tag}</span>
                <h3 className="hero-ev-name display">{proximo.nome}</h3>
                <div className="hero-ev-details">
                  <span>{proximo.dataFull}</span>
                  <span className="hero-ev-sep">·</span>
                  <span className="hero-ev-local">{proximo.local}</span>
                </div>
                <a
                  href={proximo.link || "#eventos"}
                  target={proximo.link ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="btn btn-gold hero-ev-cta"
                >
                  Garantir ingresso <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="sobre">
      <div className="container about-grid">
        <div>
          <div className="eyebrow"><span className="dot"></span>Sobre a Eventos Litoral</div>
          <h2 className="display">Música, atmosfera e produção que faz a noite acontecer.</h2>
          <p>
            Há mais de sete anos transformamos o litoral paulista em palco de experiências marcantes. Da concepção
            à execução, cuidamos de cada detalhe: estrutura, sonorização, line-up, ambientação e segurança — para
            que você só precise viver o momento.
          </p>
          <p>
            Trabalhamos com shows de grande porte, festas premium, festivais a beira-mar e eventos corporativos
            sob medida. Cada projeto é único; o padrão de qualidade, sempre o mesmo.
          </p>

          <div className="about-stats">
            <div className="s"><b>120+</b><span>Produções</span></div>
            <div className="s"><b>50k</b><span>Público</span></div>
            <div className="s"><b>40+</b><span>Artistas</span></div>
          </div>
        </div>

        <div className="about-img">
          <image-slot id="about-photo" shape="rect" placeholder="Foto da equipe / bastidor"></image-slot>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-inner">
        <div className="eyebrow"><span className="dot"></span>Vamos conversar</div>
        <h2 className="display">Pronto para o próximo evento inesquecível?</h2>
        <p>
          Conte com a Eventos Litoral para produzir, divulgar e realizar a sua próxima experiência.
          Shows, festas privadas, ativações de marca e eventos corporativos.
        </p>

        <div className="contact-cta">
          <a href="https://www.instagram.com/eventoslitoraloficial/" target="_blank" rel="noopener" className="btn btn-gold">
            Falar no Instagram <span className="arrow">→</span>
          </a>
          <a href="#eventos" className="btn btn-ghost">Ver eventos</a>
        </div>

        <a href="https://www.instagram.com/eventoslitoraloficial/" target="_blank" rel="noopener" className="ig-card">
          <span className="ic">IG</span>
          <span className="txt">
            <b>@eventoslitoraloficial</b>
            <span>Instagram oficial</span>
          </span>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container ft">
        <img className="ft-logo" src="LOGO.png" alt="Eventos Litoral" />
        <div className="ft-meta">
          © {new Date().getFullYear()} Eventos Litoral · Litoral Paulista · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, About, Contact, Footer });
