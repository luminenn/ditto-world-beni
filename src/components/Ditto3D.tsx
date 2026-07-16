import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { AccessoryKey } from "./DittoAccessories";

const DITTO_COLOR = "#D484D1";
const DITTO_DEEP = "#B25FB0";
const INK = "#3A2148";

/** Face texture drawn on a canvas — simple wide dot eyes + line mouth. */
function useFaceTexture() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    // transparent background
    ctx.clearRect(0, 0, size, size);
    // eyes
    ctx.fillStyle = INK;
    const eyeY = size * 0.44;
    const eyeR = size * 0.045;
    ctx.beginPath();
    ctx.arc(size * 0.38, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(size * 0.62, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    // little sparkle in eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(size * 0.39, eyeY - eyeR * 0.35, eyeR * 0.35, 0, Math.PI * 2);
    ctx.arc(size * 0.63, eyeY - eyeR * 0.35, eyeR * 0.35, 0, Math.PI * 2);
    ctx.fill();
    // mouth (subtle wavy line)
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    const mx = size * 0.5;
    const my = size * 0.56;
    const w = size * 0.09;
    ctx.moveTo(mx - w, my);
    ctx.quadraticCurveTo(mx - w * 0.5, my + 10, mx, my);
    ctx.quadraticCurveTo(mx + w * 0.5, my + 10, mx + w, my);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

type Impulse = { local: THREE.Vector3; time: number; strength: number };

function DittoBlob({
  accessories,
  onPointer,
}: {
  accessories: AccessoryKey[];
  onPointer: (p: ThreeEvent<PointerEvent>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const faceTex = useFaceTexture();

  // Build a soft blob geometry (slightly squashed sphere)
  const { geometry, basePositions } = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 96, 96);
    // squash into blob (wider than tall)
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // flatten bottom slightly, widen middle
      const ny = y * 0.78 - 0.05 * Math.max(0, -y);
      const bulge = 1 + 0.06 * Math.cos(y * Math.PI);
      pos.setXYZ(i, x * bulge, ny, z * bulge);
    }
    g.computeVertexNormals();
    const base = new Float32Array(pos.array as Float32Array);
    return { geometry: g, basePositions: base };
  }, []);

  const impulses = useRef<Impulse[]>([]);
  const [hovering, setHovering] = useState(false);

  // Global gentle idle bob
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.03;
      groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.03;
    }

    // Update impulses & deform geometry
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const now = performance.now();
    // decay/remove old impulses
    impulses.current = impulses.current.filter((imp) => now - imp.time < 1200);

    for (let i = 0; i < pos.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      let dx = 0,
        dy = 0,
        dz = 0;

      for (const imp of impulses.current) {
        const age = (now - imp.time) / 1000; // seconds
        // spring envelope: elastic damped oscillation
        const env = Math.exp(-age * 3.2) * Math.cos(age * 12);
        const vx = bx - imp.local.x;
        const vy = by - imp.local.y;
        const vz = bz - imp.local.z;
        const dist2 = vx * vx + vy * vy + vz * vz;
        const falloff = Math.exp(-dist2 * 6); // gaussian radius
        const push = imp.strength * env * falloff;
        // push inward at impulse point
        const nlen = Math.sqrt(dist2) || 1;
        dx += (-vx / nlen) * -push; // toward impulse -> inward
        dy += (-vy / nlen) * -push;
        dz += (-vz / nlen) * -push;

        // volume-preserving bulge outward at ring around it
        const ring = Math.exp(-Math.pow(Math.sqrt(dist2) - 0.55, 2) * 14);
        const bulge = imp.strength * env * ring * 0.5;
        const blen = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        dx += (bx / blen) * bulge;
        dy += (by / blen) * bulge;
        dz += (bz / blen) * bulge;
      }

      arr[i * 3] = bx + dx;
      arr[i * 3 + 1] = by + dy;
      arr[i * 3 + 2] = bz + dz;
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // subtle overall squish on hold: none — but let's keep delta usable
    void delta;
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Convert world point to local blob space
    const local = meshRef.current.worldToLocal(e.point.clone());
    impulses.current.push({
      local,
      time: performance.now(),
      strength: 0.22,
    });
    onPointer(e);
  };

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovering(true)}
        onPointerOut={() => setHovering(false)}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={DITTO_COLOR}
          roughness={0.35}
          metalness={0}
          clearcoat={0.6}
          clearcoatRoughness={0.35}
          sheen={0.6}
          sheenColor={"#ffd8f2"}
          sheenRoughness={0.5}
        />
      </mesh>
      {/* Belly highlight */}
      <mesh position={[0, -0.05, 0.75]} scale={[0.55, 0.32, 0.05]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={"#F3B8E4"} transparent opacity={0.35} />
      </mesh>
      {/* Face decal plane (billboard-ish flat plane hugging front) */}
      <mesh position={[0, 0.05, 0.94]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial map={faceTex} transparent depthWrite={false} />
      </mesh>

      {/* Accessories, each in Ditto's local space */}
      {accessories.map((k, i) => (
        <Accessory3D key={`${k}-${i}`} kind={k} index={i} />
      ))}

      {/* cursor cue */}
      <group visible={hovering} />
    </group>
  );
}

function Accessory3D({ kind, index }: { kind: AccessoryKey; index: number }) {
  const wobble = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!wobble.current) return;
    const t = state.clock.getElapsedTime();
    wobble.current.rotation.z = Math.sin(t * 2 + index) * 0.04;
  });

  if (kind === "hat") {
    return (
      <group ref={wobble} position={[0, 0.9, 0]}>
        {/* brim */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.06, 48]} />
          <meshStandardMaterial color={"#3A2148"} roughness={0.5} />
        </mesh>
        {/* crown */}
        <mesh castShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.5, 48]} />
          <meshStandardMaterial color={"#2E1B3A"} roughness={0.55} />
        </mesh>
        {/* band */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.355, 0.355, 0.08, 48]} />
          <meshStandardMaterial color={"#EC7CD2"} roughness={0.5} />
        </mesh>
      </group>
    );
  }
  if (kind === "glasses") {
    return (
      <group ref={wobble} position={[0, 0.12, 0.86]}>
        {[-0.28, 0.28].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <torusGeometry args={[0.2, 0.035, 20, 40]} />
            <meshStandardMaterial color={INK} roughness={0.4} />
          </mesh>
        ))}
        {/* bridge */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 12]} />
          <meshStandardMaterial color={INK} />
        </mesh>
        {/* lenses */}
        {[-0.28, 0.28].map((x) => (
          <mesh key={`l${x}`} position={[x, 0, 0.005]}>
            <circleGeometry args={[0.18, 32]} />
            <meshPhysicalMaterial
              color={"#FBFAFF"}
              transmission={0.6}
              transparent
              opacity={0.55}
              roughness={0.05}
            />
          </mesh>
        ))}
      </group>
    );
  }
  // scarf
  return (
    <group ref={wobble} position={[0, -0.55, 0]}>
      <mesh>
        <torusGeometry args={[0.7, 0.11, 24, 64]} />
        <meshStandardMaterial color={"#EC7CD2"} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, -0.35, 0.55]} rotation={[0.4, 0.2, 0.2]}>
        <boxGeometry args={[0.18, 0.5, 0.06]} />
        <meshStandardMaterial color={"#C9A8E8"} roughness={0.55} />
      </mesh>
    </group>
  );
}

function DragRotate({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const dom = gl.domElement;
    const down = (e: PointerEvent) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      target.current.y += dx * 0.008;
      target.current.x += dy * 0.006;
      target.current.x = Math.max(-0.6, Math.min(0.6, target.current.x));
      last.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => (dragging.current = false);
    dom.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      dom.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame(() => {
    cur.current.x += (target.current.x - cur.current.x) * 0.12;
    cur.current.y += (target.current.y - cur.current.y) * 0.12;
    if (group.current) {
      group.current.rotation.x = cur.current.x;
      group.current.rotation.y = cur.current.y;
    }
  });

  return <group ref={group}>{children}</group>;
}

export function Ditto3D({ accessories }: { accessories: AccessoryKey[] }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.2, 3.6], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <color attach="background" args={["#00000000"]} />
      {/* Warm studio lighting */}
      <ambientLight intensity={0.55} color={"#FFF4EC"} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.4}
        color={"#FFE4CC"}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, 1]} intensity={0.5} color={"#F4C2D7"} />
      <pointLight position={[0, -2, 2]} intensity={0.35} color={"#E2B2FE"} />

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.4} />
        <DragRotate>
          <DittoBlob accessories={accessories} onPointer={() => {}} />
        </DragRotate>
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.35}
          scale={5}
          blur={2.4}
          far={2}
          color={"#4A2C5B"}
        />
      </Suspense>
    </Canvas>
  );
}
