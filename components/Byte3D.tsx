"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Cylinder, Box } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Byte3D({ facing, moving, spinTrigger = 0 }: { facing: number; moving: boolean; spinTrigger?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none scale-125">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#00ffff" />
        <RobotModel facing={facing} moving={moving} spinTrigger={spinTrigger} />
      </Canvas>
    </div>
  );
}

function RobotModel({ facing, moving, spinTrigger }: { facing: number; moving: boolean; spinTrigger: number }) {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const targetSpin = useRef(0);
  const prevSpinTrigger = useRef(spinTrigger);

  // Colors
  const creamColor = "#fdf3e7";
  const darkVisor = "#0a1128";
  const cyanGlow = "#00f0ff";
  const blueAccent = "#0055ff";
  const blueDark = "#0033aa";

  useFrame((state, delta) => {
    if (!group.current) return;

    // Detect spin trigger
    if (spinTrigger !== prevSpinTrigger.current) {
      targetSpin.current += Math.PI * 2;
      prevSpinTrigger.current = spinTrigger;
    }

    // Smooth turn towards facing (1 = right, -1 = left)
    const mouseX = (state.pointer.x * Math.PI) / 4;
    const mouseY = (state.pointer.y * Math.PI) / 6;

    const baseTargetY = facing === 1 ? Math.PI / 6 : -Math.PI / 6;
    const targetY = baseTargetY + mouseX * 0.8 + targetSpin.current;
    const targetX = -mouseY * 0.5;

    // Apply rotation
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);

    // Tilt forward when moving
    const targetZ = moving ? (facing === 1 ? -0.1 : 0.1) : 0;
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetZ, 4, delta);

    const time = state.clock.getElapsedTime();

    // Eyes and mouth blink / talk
    if (leftEye.current && rightEye.current && mouth.current) {
      const blink = Math.sin(time * 3) > 0.96 ? 0.1 : 1;
      leftEye.current.scale.y = blink;
      rightEye.current.scale.y = blink;
      mouth.current.scale.x = moving ? 1 + Math.sin(time * 15) * 0.3 : 1;
    }

    // Core pulsing effect
    if (core.current) {
      const pulse = 1 + Math.sin(time * 4) * 0.1;
      core.current.scale.set(pulse, pulse, pulse);
    }

    // Arms wave when idle
    if (leftArm.current && rightArm.current) {
      if (moving) {
        // Dragging animation
        leftArm.current.rotation.x = Math.sin(time * 10) * 0.5;
        rightArm.current.rotation.x = Math.sin(time * 10 + Math.PI) * 0.5;
      } else {
        // Idle happy wave every 10 seconds
        const waveCycle = time % 10;
        if (waveCycle < 2) {
          leftArm.current.rotation.z = -0.2 + Math.sin(time * 20) * 0.3;
          rightArm.current.rotation.z = 0.2 - Math.sin(time * 20) * 0.3;
        } else {
          leftArm.current.rotation.x = THREE.MathUtils.damp(leftArm.current.rotation.x, 0, 4, delta);
          rightArm.current.rotation.x = THREE.MathUtils.damp(rightArm.current.rotation.x, 0, 4, delta);
          leftArm.current.rotation.z = THREE.MathUtils.damp(leftArm.current.rotation.z, -0.2, 4, delta);
          rightArm.current.rotation.z = THREE.MathUtils.damp(rightArm.current.rotation.z, 0.2, 4, delta);
        }
      }
    }
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <Float speed={moving ? 6 : 3} rotationIntensity={0.1} floatIntensity={0.8}>
        
        {/* === HEAD === */}
        <group position={[0, 0.8, 0]}>
          <RoundedBox args={[1.8, 1.4, 1.4]} radius={0.3} smoothness={4}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>

          <RoundedBox args={[0.8, 0.1, 0.6]} radius={0.02} position={[0, 0.72, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[0.6, 0.05, 0.4]} radius={0.02} position={[0, 0.76, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>

          <RoundedBox args={[0.15, 0.6, 0.4]} radius={0.05} position={[-0.92, 0, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.6, 0.4]} radius={0.05} position={[0.92, 0, 0]}>
            <meshStandardMaterial color={blueAccent} roughness={0.3} />
          </RoundedBox>

          <RoundedBox args={[1.5, 0.9, 0.15]} radius={0.15} position={[0, -0.05, 0.66]}>
            <meshStandardMaterial color={darkVisor} roughness={0.1} metalness={0.5} />
          </RoundedBox>

          <RoundedBox ref={leftEye} args={[0.18, 0.35, 0.05]} radius={0.05} position={[-0.35, 0.0, 0.75]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>
          <RoundedBox ref={rightEye} args={[0.18, 0.35, 0.05]} radius={0.05} position={[0.35, 0.0, 0.75]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>

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
          
          {/* Glowing Core */}
          <RoundedBox ref={core} args={[0.4, 0.25, 0.05]} radius={0.02} position={[0, 0, 0.46]}>
            <meshBasicMaterial color={cyanGlow} />
          </RoundedBox>
        </group>

        {/* === ARMS === */}
        <group ref={leftArm} position={[-0.75, -0.4, 0]} rotation={[0, 0, -0.2]}>
          <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.1} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.2, 0.26]} radius={0.05} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>
        </group>
        
        <group ref={rightArm} position={[0.75, -0.4, 0]} rotation={[0, 0, 0.2]}>
          <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.1} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.2, 0.26]} radius={0.05} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={blueDark} roughness={0.2} />
          </RoundedBox>
        </group>

        {/* === LEGS === */}
        <group position={[-0.3, -1.0, 0]}>
          <RoundedBox args={[0.3, 0.4, 0.3]} radius={0.05} position={[0, -0.1, 0]}>
            <meshStandardMaterial color={creamColor} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.35, 0.1, 0.4]} radius={0.02} position={[0, -0.3, 0.05]}>
            <meshStandardMaterial color={blueAccent} roughness={0.2} />
          </RoundedBox>
        </group>

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
