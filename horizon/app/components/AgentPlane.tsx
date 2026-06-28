"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface AgentPlaneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  agentName: string;
  agentColor: string;
  agentRole: string;
  agentId: number;
  status: string;
  liveUrl: string | null;
  isActive: boolean;
}

export function AgentPlane({
  position,
  rotation,
  agentName,
  agentColor,
  agentRole,
  agentId,
  status,
  liveUrl,
  isActive,
}: AgentPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + position[0]) * 0.04;

    if (glowRef.current) {
      const scale = isActive ? 1.02 + Math.sin(t * 2) * 0.008 : 1.02;
      glowRef.current.scale.set(scale, scale, 1);
    }
  });

  const borderColor = useMemo(
    () => new THREE.Color(agentColor),
    [agentColor]
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[2.08, 1.33]} />
        <meshBasicMaterial
          color={borderColor}
          transparent
          opacity={isActive ? 0.35 : 0.1}
        />
      </mesh>

      {/* Screen plane background */}
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 1.25]} />
        <meshStandardMaterial
          color="#0a0b0f"
          emissive={agentColor}
          emissiveIntensity={0.05}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Live stream iframe overlay */}
      <Html
        transform
        position={[0, 0, 0.01]}
        scale={0.3}
        distanceFactor={3}
        className="pointer-events-none"
      >
        <div className="w-[640px] h-[400px] bg-[#0a0b0f] rounded overflow-hidden relative">
          {liveUrl ? (
            <iframe
              src={liveUrl}
              className="w-full h-full border-none pointer-events-none"
              title={`Agent ${agentId} Stream`}
              allow="autoplay"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center font-mono gap-2"
              style={{ color: agentColor }}
            >
              <div
                className="w-8 h-8 rounded-full border-2 animate-[spin_1s_linear_infinite]"
                style={{
                  borderColor: `${agentColor}40`,
                  borderTopColor: agentColor,
                }}
              />
              <span className="text-[10px] opacity-70">
                {agentRole} source · standby
              </span>
            </div>
          )}
        </div>
      </Html>

      {/* Scanline overlay */}
      {isActive && (
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[2, 1.25]} />
          <meshBasicMaterial color={agentColor} transparent opacity={0.03} />
        </mesh>
      )}

      {/* Label */}
      <Html
        position={[0, -0.78, 0]}
        center
        distanceFactor={6}
        className="pointer-events-none"
      >
        <div className="font-mono text-center whitespace-nowrap">
          <div
            className="text-[10px] uppercase tracking-[2px] flex items-center justify-center gap-1.5"
            style={{
              color: agentColor,
              textShadow: `0 0 8px ${agentColor}40`,
            }}
          >
            <span className="font-bold">{agentName}</span>
            {isActive && (
              <span
                className="inline-block w-[5px] h-[5px] rounded-full animate-[pulse-opacity_1.5s_infinite]"
                style={{
                  backgroundColor: agentColor,
                  boxShadow: `0 0 6px ${agentColor}`,
                }}
              />
            )}
          </div>

          {!isActive && (
            <div
              className="mt-[3px] text-[7px] tracking-[1.5px] uppercase font-medium"
              style={{ color: `${agentColor}70` }}
            >
              {agentRole}
            </div>
          )}

          {isActive && (
            <div className="mt-[3px] flex items-center justify-center gap-1.5">
              <span
                className="text-[7px] tracking-[1.5px] uppercase font-medium"
                style={{ color: `${agentColor}90` }}
              >
                {agentRole} · {status}
              </span>
              <div
                className="w-8 h-[2px] rounded-[1px] overflow-hidden"
                style={{ background: `${agentColor}15` }}
              >
                <div
                  className="w-[60%] h-full rounded-[1px] animate-[pulse-opacity_2s_infinite]"
                  style={{ background: agentColor }}
                />
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
