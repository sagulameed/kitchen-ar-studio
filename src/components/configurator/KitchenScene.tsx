import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Bounds } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export type Finish = "oak" | "walnut" | "matte-black" | "ivory" | "sage";
export type Worktop = "marble" | "concrete" | "oak-block";
export type ModuleKind = "base" | "tall" | "wall" | "island" | "appliance";

export interface KitchenModule {
  id: string;
  kind: ModuleKind;
  x: number; // grid units
  z: number;
  width: number; // units (1 unit = 0.6m)
  rotation?: number;
}

const FINISH_COLORS: Record<Finish, string> = {
  oak: "#c9a274",
  walnut: "#5a3826",
  "matte-black": "#1a1a1a",
  ivory: "#ece4d3",
  sage: "#8a9a82",
};

const WORKTOP_COLORS: Record<Worktop, string> = {
  marble: "#ece9e2",
  concrete: "#9a9892",
  "oak-block": "#b88a5a",
};

const UNIT = 0.6;

function Cabinet({
  module,
  finish,
  worktop,
  selected,
  onSelect,
}: {
  module: KitchenModule;
  finish: Finish;
  worktop: Worktop;
  selected: boolean;
  onSelect: () => void;
}) {
  const color = FINISH_COLORS[finish];
  const wt = WORKTOP_COLORS[worktop];
  const w = module.width * UNIT;
  const d = 0.6;
  let h = 0.9;
  if (module.kind === "tall") h = 2.2;
  if (module.kind === "wall") h = 0.7;
  if (module.kind === "island") h = 0.9;
  if (module.kind === "appliance") h = 0.9;

  const yBase = module.kind === "wall" ? 1.6 : 0;

  return (
    <group
      position={[module.x * UNIT, yBase, module.z * UNIT]}
      rotation={[0, module.rotation ?? 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={module.kind === "appliance" ? "#2a2a2a" : color}
          roughness={module.kind === "appliance" ? 0.3 : 0.55}
          metalness={module.kind === "appliance" ? 0.7 : 0.05}
        />
      </mesh>
      {/* worktop */}
      {(module.kind === "base" || module.kind === "island" || module.kind === "appliance") && (
        <mesh position={[0, h + 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.04, 0.04, d + 0.04]} />
          <meshStandardMaterial color={wt} roughness={0.35} metalness={0.05} />
        </mesh>
      )}
      {/* handle / detail */}
      {module.kind !== "appliance" && (
        <mesh position={[0, h - 0.05, d / 2 + 0.005]}>
          <boxGeometry args={[w * 0.6, 0.015, 0.01]} />
          <meshStandardMaterial color="#c9a35a" metalness={0.9} roughness={0.25} />
        </mesh>
      )}
      {/* selection outline */}
      {selected && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 0.06, h + 0.06, d + 0.06]} />
          <meshBasicMaterial color="#e0b870" wireframe />
        </mesh>
      )}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#2a2724" roughness={0.9} />
    </mesh>
  );
}

function BackWall() {
  return (
    <mesh position={[0, 1.5, -1.2]} receiveShadow>
      <planeGeometry args={[12, 3]} />
      <meshStandardMaterial color="#3a342f" roughness={1} />
    </mesh>
  );
}

export function KitchenScene({
  modules,
  finish,
  worktop,
  selectedId,
  onSelect,
}: {
  modules: KitchenModule[];
  finish: Finish;
  worktop: Worktop;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const fog = useMemo(() => new THREE.Fog("#1a1816", 8, 20), []);
  return (
    <Canvas
      shadows
      camera={{ position: [4.5, 3.2, 4.5], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
      onCreated={({ scene }) => {
        scene.fog = fog;
        scene.background = new THREE.Color("#1a1816");
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#f0c890" />
      <Environment preset="apartment" />
      <Floor />
      <BackWall />
      <Bounds fit clip observe margin={1.4}>
        <group>
          {modules.map((m) => (
            <Cabinet
              key={m.id}
              module={m}
              finish={finish}
              worktop={worktop}
              selected={selectedId === m.id}
              onSelect={() => onSelect(m.id)}
            />
          ))}
        </group>
      </Bounds>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.55} blur={2.4} scale={14} far={4} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}

export const FINISHES: { id: Finish; label: string; swatch: string }[] = [
  { id: "oak", label: "Natural Oak", swatch: FINISH_COLORS.oak },
  { id: "walnut", label: "Smoked Walnut", swatch: FINISH_COLORS.walnut },
  { id: "matte-black", label: "Matte Black", swatch: FINISH_COLORS["matte-black"] },
  { id: "ivory", label: "Ivory Lacquer", swatch: FINISH_COLORS.ivory },
  { id: "sage", label: "Sage Green", swatch: FINISH_COLORS.sage },
];

export const WORKTOPS: { id: Worktop; label: string; swatch: string }[] = [
  { id: "marble", label: "Calacatta Marble", swatch: WORKTOP_COLORS.marble },
  { id: "concrete", label: "Polished Concrete", swatch: WORKTOP_COLORS.concrete },
  { id: "oak-block", label: "Oak Butcher Block", swatch: WORKTOP_COLORS["oak-block"] },
];

export const MODULE_CATALOG: {
  kind: ModuleKind;
  label: string;
  width: number;
  price: number;
  description: string;
}[] = [
  { kind: "base", label: "Base Cabinet", width: 1, price: 890, description: "60cm storage cabinet" },
  { kind: "base", label: "Wide Drawer Base", width: 2, price: 1490, description: "120cm soft-close drawers" },
  { kind: "tall", label: "Tall Pantry", width: 1, price: 1890, description: "Floor-to-ceiling storage" },
  { kind: "wall", label: "Wall Cabinet", width: 2, price: 740, description: "Upper storage" },
  { kind: "island", label: "Kitchen Island", width: 3, price: 3200, description: "Central worktop island" },
  { kind: "appliance", label: "Built-in Oven", width: 1, price: 2100, description: "Pyrolytic, smart" },
];
