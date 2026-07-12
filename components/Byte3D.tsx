"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Cylinder, Box } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Byte3D({ facing, moving }: { facing: number; moving: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none scale-125">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#00ffff" />
        <RobotModel facing={facing} moving={moving} />
      </Canvas>
    </div>
  );
}

function RobotModel({ facing, moving }: { facing: number; moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  // Colors based on pixel art
  const creamColor = "#fdf3e7";
  const darkVisor = "#0a1128";
  const cyanGlow = "#00f0ff";
  const blueAccent = "#0055ff";
  const blueDark = "#0033aa";

  useFrame((state, delta) => {
    if (!group.current) return;

    // Smooth turn towards facing (1 = right, -1 = left)
    const mouseX = (state.pointer.x * Math.PI) / 4;
    const mouseY = (state.pointer.y * Math.PI) / 6;

    const baseTargetY = facing === 1 ? Math.PI / 6 : -Math.PI / 6;
    const targetY = baseTargetY + mouseX * 0.8;
    const targetX = -mouseY * 0.5;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);

    // Tilt forward when moving
    const targetZ = moving ? (facing === 1 ? -0.1 : 0.1) : 0;
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetZ, 4, delta);

    // Blink effect
    const time = state.clock.getElapsedTime();
    if (leftEye.current && rightEye.current && mouth.current) {
      // Blink
      const blink = Math.sin(time * 3) > 0.96 ? 0.1 : 1;
      leftEye.current.scale.y = blink;
      rightEye.current.scale.y = blink;
      // Mouth talking simulation when moving
      mouth.current.scale.x = moving ? 1 + Math.sin(time * 15) * 0.3 : 1;
    }
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <Float speed={moving ? 6 : 3} rotationIntensity={0.1} floatIntensity={0.8}>
        
        {/* === HEAD === */}
        <group position={[0, 0.8, 0]}>
          {/* Main Head Shell */}
          <RoundedBox args={[1.8, 1.4, 1.4]} radius={0.3} smoothness={4}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>

          {/* Top Blue Vent */}
          <RoundedBox args={[0.8, 0.1, 0.6]} radius={0.02} position={[0, 0.72, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[0.6, 0.05, 0.4]} radius={0.02} position={[0, 0.76, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>

          {/* Left Ear/Headphone */}
          <RoundedBox args={[0.15, 0.6, 0.4]} radius={0.05} position={[-0.92, 0, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.3} />
          </RoundedBox>
          
          {/* Right Ear/Headphone */}
          <RoundedBox args={[0.15, 0.6, 0.4]} radius={0.05} position={[0.92, 0, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.3} />
          </RoundedBox>

          {/* Visor Screen */}
          <RoundedBox args={[1.5, 0.9, 0.15]} radius={0.15} position={[0, -0.05, 0.66]}>
            <meshStandardMaterial color={darkVisor} roughness={0.1} metalness={0.5} />
          </RoundedBox>

          {/* Eyes (Cyan Glow) */}
          <RoundedBox ref={leftEye} args={[0.18, 0.35, 0.05]} radius={0.05} position={[-0.35, 0.0, 0.75]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>
          <RoundedBox ref={rightEye} args={[0.18, 0.35, 0.05]} radius={0.05} position={[0.35, 0.0, 0.75]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>

          {/* Mouth (Cyan Line) */}
          <Box ref={mouth} args={[0.2, 0.06, 0.05]} position={[0, -0.25, 0.75]}>
            <meshBasicMaterial color={cyanGlow} />
          </Box>
        </group>

        {/* === NECK === */}
        <Cylinder args={[0.2, 0.2, 0.2]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color={blueAccent} roughness={0.2} />
        </Cylinder>

        {/* === BODY === */}
        <group position={[0, -0.5, 0]}>
          <RoundedBox args={[1.2, 1.0, 0.9]} radius={0.2} smoothness={4}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          
          {/* Chest Code Symbol / Core */}
          <RoundedBox args={[0.4, 0.25, 0.05]} radius={0.02} position={[0, 0, 0.46]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>
        </group>

        {/* === ARMS === */}
        {/* Left Arm */}
        <group position={[-0.75, -0.4, 0]} rotation={[0, 0, -0.2]}>
          <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.1} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.2, 0.26]} radius={0.05} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>
        </group>
        
        {/* Right Arm */}
        <group position={[0.75, -0.4, 0]} rotation={[0, 0, 0.2]}>
          <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.1} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.2, 0.26]} radius={0.05} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>
        </group>

        {/* === LEGS === */}
        {/* Left Leg */}
        <group position={[-0.3, -1.0, 0]}>
          <RoundedBox args={[0.3, 0.4, 0.3]} radius={0.05} position={[0, -0.1, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.35, 0.1, 0.4]} radius={0.02} position={[0, -0.3, 0.05]}>
            <meshStandardMaterial color={blueAccent} roughness={0.2} />
          </RoundedBox>
        </group>

        {/* Right Leg */}
        <group position={[0.3, -1.0, 0]}>
          <RoundedBox args={[0.3, 0.4, 0.3]} radius={0.05} position={[0, -0.1, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.35, 0.1, 0.4]} radius={0.02} position={[0, -0.3, 0.05]}>
            <meshStandardMaterial color={blueAccent} roughness={0.2} />
          </RoundedBox>
        </group>

      </Float>
    </group>
  );
}
