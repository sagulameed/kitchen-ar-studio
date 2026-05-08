import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-kitchen.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-20 px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="font-display text-xl lg:text-2xl tracking-wide">
          Atelier <span className="text-brass">Cuisine</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#collections" className="hover:text-foreground transition">Collections</a>
          <a href="#process" className="hover:text-foreground transition">Process</a>
          <a href="#ar" className="hover:text-foreground transition">AR Preview</a>
        </nav>
        <Link to="/configurator">
          <Button className="bg-gradient-brass text-brass-foreground hover:opacity-90 shadow-glow">
            Start Designing
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] overflow-hidden">
        <img
          src={heroImg}
          alt="Modern walnut kitchen with brass detailing and marble worktop"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.4em] text-brass mb-6">
              Modular Kitchens · Configurator · AR
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
              Designed in 3D.<br />
              <span className="italic text-brass">Lived in reality.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Compose your modular kitchen module by module. Swap finishes in real time,
              then preview the result at full scale in your own home with augmented reality.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/configurator">
                <Button size="lg" className="bg-gradient-brass text-brass-foreground hover:opacity-90 shadow-glow h-12 px-8">
                  Open Configurator →
                </Button>
              </Link>
              <a href="#process">
                <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:bg-accent">
                  How it works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            ["240+", "Modular pieces"],
            ["12", "Signature finishes"],
            ["AR", "Full-scale preview"],
            ["48h", "Quote turnaround"],
          ].map(([k, v]) => (
            <div key={v} className="px-6 py-8 text-center">
              <div className="font-display text-3xl md:text-4xl text-brass">{k}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="px-6 lg:px-16 py-24 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-[0.4em] text-brass mb-4">The Process</div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            From first module to finished room — without leaving your sofa.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              t: "Compose",
              d: "Drop in base cabinets, tall pantries, islands and appliances. Rotate and arrange in real time.",
            },
            {
              n: "02",
              t: "Curate",
              d: "Swap between smoked walnut, ivory lacquer, matte black and more. Pair with marble or concrete worktops.",
            },
            {
              n: "03",
              t: "Project in AR",
              d: "Send your design to your phone and place the kitchen at full scale in your kitchen — before a single panel is cut.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-border bg-card/40 p-8 hover:border-brass/60 transition shadow-luxe"
            >
              <div className="font-display text-brass text-sm tracking-[0.3em]">{s.n}</div>
              <h3 className="font-display text-2xl mt-3 mb-3">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="px-6 lg:px-16 py-24 bg-card/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-brass mb-4">Signature Collections</div>
              <h2 className="font-display text-4xl md:text-5xl">Three worlds, infinite kitchens.</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "Noir", c: "Matte black, brushed brass, dramatic stone.", bg: "linear-gradient(135deg,#1a1a1a,#3a2a1a)" },
              { n: "Sienna", c: "Smoked walnut, calacatta marble, warm amber.", bg: "linear-gradient(135deg,#5a3826,#c9a274)" },
              { n: "Ivoire", c: "Lacquered ivory, oak block, brushed nickel.", bg: "linear-gradient(135deg,#ece4d3,#b88a5a)" },
            ].map((col) => (
              <div key={col.n} className="group rounded-xl overflow-hidden border border-border shadow-luxe">
                <div className="h-72 relative" style={{ background: col.bg }}>
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
                </div>
                <div className="p-6 bg-background">
                  <h3 className="font-display text-2xl">{col.n}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{col.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AR CTA */}
      <section id="ar" className="px-6 lg:px-16 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-brass mb-6">Augmented Reality</div>
          <h2 className="font-display text-5xl md:text-6xl leading-tight mb-8">
            See it in <span className="italic text-brass">your</span> space.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Scan a QR code with your phone and walk around your future kitchen at 1:1 scale.
            Open drawers visually, judge the finishes against your light, your floor, your walls.
          </p>
          <Link to="/configurator">
            <Button size="lg" className="bg-gradient-brass text-brass-foreground hover:opacity-90 shadow-glow h-14 px-10 text-base">
              Start Your Design
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Atelier Cuisine — Crafted modular kitchens
      </footer>
    </div>
  );
}
