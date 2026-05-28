// src/app.jsx — root composition + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "contemporary",
  "palette": "gold",
  "displayFont": "bigshoulders",
  "cardStyle": "poster",
  "pfLayout": "carousel"
}/*EDITMODE-END*/;

const FONT_MAP = {
  italiana: { display: "'Italiana', serif", weight: 400, tracking: "0.015em", line: 0.95 },
  marcellus: { display: "'Marcellus', serif", weight: 400, tracking: "0.005em", line: 1.05 },
  bigshoulders: { display: "'Big Shoulders Display', sans-serif", weight: 900, tracking: "-0.01em", line: 0.9 },
  cormorant: { display: "'Cormorant Garamond', serif", weight: 500, tracking: "0.005em", line: 1.0 },
  playfair: { display: "'Playfair Display', serif", weight: 500, tracking: "0.005em", line: 1.0 },
};

const STYLE_DEFAULTS = {
  editorial: { displayFont: "italiana", cardStyle: "editorial", pfLayout: "mosaic" },
  luxe: { displayFont: "marcellus", cardStyle: "ticket", pfLayout: "grid" },
  contemporary: { displayFont: "bigshoulders", cardStyle: "poster", pfLayout: "carousel" },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply data-style / data-palette on <body>
  React.useEffect(() => {
    document.body.setAttribute("data-style", t.style);
    document.body.setAttribute("data-palette", t.palette);
  }, [t.style, t.palette]);

  // Apply display font override (after style-variant CSS so it wins)
  React.useEffect(() => {
    const f = FONT_MAP[t.displayFont] || FONT_MAP.italiana;
    document.documentElement.style.setProperty("--font-display", f.display);
    document.documentElement.style.setProperty("--display-weight", f.weight);
    document.documentElement.style.setProperty("--display-tracking", f.tracking);
    document.documentElement.style.setProperty("--display-line", f.line);
  }, [t.displayFont]);

  // When user changes the master style, sync the dependent tweaks too
  const setStyle = (s) => {
    const d = STYLE_DEFAULTS[s] || STYLE_DEFAULTS.editorial;
    setTweak({ style: s, displayFont: d.displayFont, cardStyle: d.cardStyle, pfLayout: d.pfLayout });
  };

  return (
    <>
      <Nav />
      <Hero />
      <Events cardStyle={t.cardStyle} />
      <About />
      <Portfolio defaultLayout={t.pfLayout} />
      <Contact />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Estilo visual" />
        <TweakRadio
          label="Direção"
          value={t.style}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "luxe", label: "Luxe" },
            { value: "contemporary", label: "Modern" },
          ]}
          onChange={setStyle}
        />

        <TweakSection label="Cores" />
        <TweakColor
          label="Acento"
          value={t.palette === "gold" ? "#d4af37" : t.palette === "champagne" ? "#e8d5a2" : t.palette === "copper" ? "#c97b4a" : "#f5f1e8"}
          options={["#d4af37", "#e8d5a2", "#c97b4a", "#f5f1e8"]}
          onChange={(v) => {
            const m = { "#d4af37": "gold", "#e8d5a2": "champagne", "#c97b4a": "copper", "#f5f1e8": "ivory" };
            setTweak("palette", m[v] || "gold");
          }}
        />

        <TweakSection label="Tipografia" />
        <TweakSelect
          label="Fonte dos títulos"
          value={t.displayFont}
          options={[
            { value: "italiana", label: "Italiana — fina" },
            { value: "marcellus", label: "Marcellus — clássica" },
            { value: "bigshoulders", label: "Big Shoulders — bold" },
            { value: "cormorant", label: "Cormorant — elegante" },
            { value: "playfair", label: "Playfair — display" },
          ]}
          onChange={(v) => setTweak("displayFont", v)}
        />

        <TweakSection label="Cards de eventos" />
        <TweakRadio
          label="Formato"
          value={t.cardStyle}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "ticket", label: "Ticket" },
            { value: "poster", label: "Poster" },
          ]}
          onChange={(v) => setTweak("cardStyle", v)}
        />

        <TweakSection label="Fotos (teaser)" />
        <TweakRadio
          label="Layout"
          value={t.pfLayout}
          options={[
            { value: "grid", label: "Grid" },
            { value: "mosaic", label: "Mosaico" },
            { value: "carousel", label: "Carrossel" },
          ]}
          onChange={(v) => setTweak("pfLayout", v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
