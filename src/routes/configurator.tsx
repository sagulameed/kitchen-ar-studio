import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  KitchenScene,
  FINISHES,
  WORKTOPS,
  MODULE_CATALOG,
  type Finish,
  type Worktop,
  type KitchenModule,
  type ModuleKind,
} from "@/components/configurator/KitchenScene";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/configurator")({
  component: ConfiguratorPage,
});

const STARTER: KitchenModule[] = [
  { id: "m1", kind: "tall", x: -3, z: -1.5, width: 1 },
  { id: "m2", kind: "base", x: -1.5, z: -1.5, width: 2 },
  { id: "m3", kind: "appliance", x: 0, z: -1.5, width: 1 },
  { id: "m4", kind: "base", x: 1.5, z: -1.5, width: 2 },
  { id: "m5", kind: "wall", x: -1.5, z: -1.5, width: 2 },
  { id: "m6", kind: "wall", x: 1.5, z: -1.5, width: 2 },
  { id: "m7", kind: "island", x: 0, z: 1, width: 3 },
];

function ConfiguratorPage() {
  const [modules, setModules] = useState<KitchenModule[]>(STARTER);
  const [finish, setFinish] = useState<Finish>("walnut");
  const [worktop, setWorktop] = useState<Worktop>("marble");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totalPrice = useMemo(() => {
    return modules.reduce((sum, m) => {
      const cat = MODULE_CATALOG.find((c) => c.kind === m.kind && c.width === m.width)
        ?? MODULE_CATALOG.find((c) => c.kind === m.kind);
      return sum + (cat?.price ?? 0);
    }, 0);
  }, [modules]);

  const finishMultiplier = finish === "matte-black" || finish === "sage" ? 1.08 : 1;
  const worktopAdd = worktop === "marble" ? 1800 : worktop === "concrete" ? 900 : 600;
  const grandTotal = Math.round(totalPrice * finishMultiplier + worktopAdd);

  function addModule(kind: ModuleKind, width: number) {
    const id = `m${Date.now()}`;
    setModules((prev) => [
      ...prev,
      { id, kind, width, x: prev.length % 2 === 0 ? 2.5 : -2.5, z: 2 },
    ]);
    setSelectedId(id);
  }

  function deleteSelected() {
    if (!selectedId) return;
    setModules((prev) => prev.filter((m) => m.id !== selectedId));
    setSelectedId(null);
  }

  function rotateSelected() {
    if (!selectedId) return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === selectedId ? { ...m, rotation: ((m.rotation ?? 0) + Math.PI / 2) % (Math.PI * 2) } : m
      )
    );
  }

  function moveSelected(dx: number, dz: number) {
    if (!selectedId) return;
    setModules((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, x: m.x + dx, z: m.z + dz } : m))
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-wide">
          Atelier <span className="text-brass">Cuisine</span>
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
          Live Configurator
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] min-h-[calc(100vh-65px)]">
        {/* Scene */}
        <div className="relative bg-gradient-dark">
          <KitchenScene
            modules={modules}
            finish={finish}
            worktop={worktop}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {/* Floating controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 text-xs">
            <div className="rounded-md bg-card/80 backdrop-blur px-3 py-2 border border-border/60 text-muted-foreground">
              Drag to orbit · Scroll to zoom · Click a module to select
            </div>
          </div>

          {selectedId && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 rounded-lg bg-card/90 backdrop-blur border border-border p-1.5 shadow-luxe">
              <Button size="sm" variant="ghost" onClick={() => moveSelected(-0.5, 0)}>←</Button>
              <Button size="sm" variant="ghost" onClick={() => moveSelected(0, -0.5)}>↑</Button>
              <Button size="sm" variant="ghost" onClick={() => moveSelected(0, 0.5)}>↓</Button>
              <Button size="sm" variant="ghost" onClick={() => moveSelected(0.5, 0)}>→</Button>
              <Button size="sm" variant="ghost" onClick={rotateSelected}>↻</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={deleteSelected}>
                Delete
              </Button>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Button
              className="bg-gradient-brass text-brass-foreground hover:opacity-90 shadow-glow"
              onClick={() => alert("AR mode requires a mobile device with AR support. We'll email you a shareable AR link with your saved configuration.")}
            >
              📱 View in AR
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="border-l border-border/60 bg-card/40 overflow-y-auto max-h-[calc(100vh-65px)]">
          <div className="p-6 space-y-8">
            <section>
              <h3 className="font-display text-lg mb-3">Modules</h3>
              <div className="grid grid-cols-2 gap-2">
                {MODULE_CATALOG.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => addModule(cat.kind, cat.width)}
                    className="text-left rounded-md border border-border bg-background/40 hover:border-brass hover:bg-accent/40 transition p-3"
                  >
                    <div className="text-sm font-medium">{cat.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{cat.description}</div>
                    <div className="text-xs text-brass mt-1.5">€{cat.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-display text-lg mb-3">Cabinet Finish</h3>
              <div className="grid grid-cols-5 gap-2">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id)}
                    className={`group relative aspect-square rounded-md border-2 transition ${
                      finish === f.id ? "border-brass shadow-glow" : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: f.swatch }}
                    title={f.label}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {FINISHES.find((f) => f.id === finish)?.label}
              </div>
            </section>

            <section>
              <h3 className="font-display text-lg mb-3">Worktop</h3>
              <div className="space-y-2">
                {WORKTOPS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWorktop(w.id)}
                    className={`w-full flex items-center gap-3 rounded-md border p-2.5 transition ${
                      worktop === w.id ? "border-brass bg-accent/40" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-sm border border-border/60"
                      style={{ backgroundColor: w.swatch }}
                    />
                    <div className="text-sm">{w.label}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-background/60 p-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Modules</span>
                <span>{modules.length}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Worktop</span>
                <span>+€{worktopAdd.toLocaleString()}</span>
              </div>
              <div className="border-t border-border/60 my-3" />
              <div className="flex justify-between items-end">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Estimated total</span>
                <span className="font-display text-3xl text-brass">€{grandTotal.toLocaleString()}</span>
              </div>
              <Button className="w-full mt-4 bg-gradient-brass text-brass-foreground hover:opacity-90">
                Request Quote
              </Button>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
