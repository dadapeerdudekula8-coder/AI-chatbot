"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Bot } from "lucide-react";

export type AssistantCoreState = "idle" | "hover" | "thinking" | "responding";

interface AIAssistantCoreProps {
  state?: AssistantCoreState;
  className?: string;
  size?: number;
  interactive?: boolean;
}

export function AIAssistantCore({
  state = "idle",
  className = "",
  size = 280,
  interactive = true,
}: AIAssistantCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (webglSupported === false || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanLight.position.set(3, 3, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 2.5, 20);
    violetLight.position.set(-3, -3, 3);
    scene.add(violetLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 2, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. Central Quantum AI Core (Dual Layer: Geodesic Wireframe + Inner Pulsing Core)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 3);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x031738,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer crystalline wireframe lattice
    const outerGeo = new THREE.IcosahedronGeometry(1.28, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const outerWireframe = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerWireframe);

    // 4. Concentric Holographic Energy Rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Ring 1 (Cyan)
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ringGroup.add(ring1);

    // Ring 2 (Electric Violet)
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.022, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    // Ring 3 (Magenta / Pink accent)
    const ring3Geo = new THREE.TorusGeometry(2.85, 0.018, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xec4899,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.9,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    ringGroup.add(ring3);

    // 5. Quantum Data Satellite Nodes orbiting the rings
    const satellites: Array<{ mesh: THREE.Mesh; angle: number; radius: number; speed: number; plane: "xy" | "xz" | "yz" }> = [];
    const satGeo = new THREE.OctahedronGeometry(0.09, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(satGeo, satMat);
      const radius = 1.85 + (i % 3) * 0.5;
      const angle = (i * Math.PI) / 3;
      const plane = i % 3 === 0 ? "xy" : i % 3 === 1 ? "xz" : "yz";
      satellites.push({
        mesh,
        angle,
        radius,
        speed: 0.015 + (i % 3) * 0.01,
        plane,
      });
      scene.add(mesh);
    }

    // 6. Surrounding Quantum Particle Cloud / Nebula
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x22d3ee);
    const violetColor = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const mixed = cyanColor.clone().lerp(violetColor, Math.random());
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Pointer Movement Tracking
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetTiltX = y * 0.45;
      targetTiltY = x * 0.55;
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let isRunning = true;

    const onVisibilityChange = () => {
      isRunning = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isRunning) return;

      const elapsed = clock.getElapsedTime();
      const currentState = stateRef.current;

      // Speed multipliers based on state
      let speedMult = 1.0;
      let coreScale = 1.0;

      if (currentState === "thinking") {
        speedMult = 3.2;
        coreScale = 1.08 + Math.sin(elapsed * 12) * 0.05;
        innerMat.emissive.setHex(0x00f0ff);
        innerMat.emissiveIntensity = 2.0;
      } else if (currentState === "responding") {
        speedMult = 1.6;
        coreScale = 1.03 + Math.sin(elapsed * 3) * 0.03;
        innerMat.emissive.setHex(0x38bdf8);
        innerMat.emissiveIntensity = 1.2;
      } else if (isHovered) {
        speedMult = 1.5;
        innerMat.emissive.setHex(0x0284c7);
        innerMat.emissiveIntensity = 1.0;
      } else {
        innerMat.emissive.setHex(0x0284c7);
        innerMat.emissiveIntensity = 0.8;
      }

      // Smooth pointer tilt interpolation
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      // Gentle floating sinusoidal bobbing
      const floatY = Math.sin(elapsed * 1.6) * 0.12;
      coreGroup.position.y = floatY;
      ringGroup.position.y = floatY;

      // Rotation of Core
      coreGroup.rotation.x = currentTiltX + elapsed * 0.15 * speedMult;
      coreGroup.rotation.y = currentTiltY + elapsed * 0.25 * speedMult;
      outerWireframe.rotation.y = -elapsed * 0.2 * speedMult;
      innerCore.scale.set(coreScale, coreScale, coreScale);

      // Independent Holographic Ring Rotations
      ring1.rotation.z += 0.01 * speedMult;
      ring1.rotation.x += 0.005 * speedMult;

      ring2.rotation.y += 0.012 * speedMult;
      ring2.rotation.z += 0.008 * speedMult;

      ring3.rotation.x += 0.009 * speedMult;
      ring3.rotation.y += 0.014 * speedMult;

      ringGroup.rotation.x = currentTiltX * 0.6;
      ringGroup.rotation.y = currentTiltY * 0.6;

      // Orbiting Satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed * speedMult;
        if (sat.plane === "xy") {
          sat.mesh.position.set(
            Math.cos(sat.angle) * sat.radius,
            Math.sin(sat.angle) * sat.radius + floatY,
            Math.sin(sat.angle * 2) * 0.3
          );
        } else if (sat.plane === "xz") {
          sat.mesh.position.set(
            Math.cos(sat.angle) * sat.radius,
            floatY,
            Math.sin(sat.angle) * sat.radius
          );
        } else {
          sat.mesh.position.set(
            Math.sin(sat.angle * 2) * 0.2,
            Math.sin(sat.angle) * sat.radius + floatY,
            Math.cos(sat.angle) * sat.radius
          );
        }
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Particle Nebula gentle rotation
      particleSystem.rotation.y = elapsed * 0.04 * speedMult;
      particleSystem.rotation.x = Math.sin(elapsed * 0.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, size, interactive]);

  // CSS 3D Fallback if WebGL is unavailable or during SSR
  if (webglSupported === false) {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Outer CSS 3D Rotating Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin-slow shadow-[0_0_25px_rgba(6,182,212,0.4)]" />
          <div
            className="absolute -inset-4 rounded-full border-2 border-dashed border-violet-400/30 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "14s" }}
          />
          <div
            className="absolute -inset-8 rounded-full border border-pink-500/20 animate-spin-slow"
            style={{ animationDuration: "25s" }}
          />
          {/* Glowing Central AI Orb */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-700 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.6)] animate-pulse">
            <Bot className="w-12 h-12 text-white drop-shadow-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="3D Procedural AI Assistant Hologram"
    />
  );
}
