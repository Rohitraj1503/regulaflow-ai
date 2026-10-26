import React, { useRef, useState, useEffect } from 'react';

/**
 * 3D Regulatory Network with robust WebGL & 2D fallback.
 * Visualizes Regulations, Institutions, Applications, Documents, Compliance, and Inspections.
 * Smoky glassmorphic aesthetic with lime-green accent, restrained animation, and no overlapping KPI cards.
 */
export default function NetworkGlobe3D() {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[440px] sm:h-[480px] rounded-3xl glass-card overflow-hidden flex items-center justify-center border border-white/10"
    >
      {/* Background ambient light orbs inside glass frame */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-[#B9F56B]/[0.035] blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-white/[0.025] blur-[90px] pointer-events-none"></div>

      {hasWebGL ? (
        <ThreeScene />
      ) : (
        <CanvasFallback />
      )}

      {/* Meaningful Regulatory Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Node 1: Regulations (Top left) */}
        <div className="absolute top-[16%] left-[24%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-white/30 flex items-center justify-center shadow-glass-highlight">
            <span className="w-2 h-2 rounded-full bg-[#C8CBD2]"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#C8CBD2] font-semibold text-[11px] backdrop-blur-md">
            Regulations
          </span>
        </div>

        {/* Node 2: Institutions (Top right) */}
        <div className="absolute top-[20%] right-[18%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-[#B9F56B]/60 flex items-center justify-center shadow-[0_0_10px_rgba(185,245,107,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#B9F56B] animate-pulse"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#F5F5F5] font-semibold text-[11px] backdrop-blur-md">
            Institutions
          </span>
        </div>

        {/* Node 3: Applications (Center left) */}
        <div className="absolute top-[48%] left-[12%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-[#B9F56B] flex items-center justify-center shadow-[0_0_12px_rgba(185,245,107,0.35)]">
            <span className="w-2 h-2 rounded-full bg-[#B9F56B]"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#F5F5F5] font-semibold text-[11px] backdrop-blur-md">
            Applications
          </span>
        </div>

        {/* Node 4: Documents (Center right) */}
        <div className="absolute top-[50%] right-[12%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-white/30 flex items-center justify-center shadow-glass-highlight">
            <span className="w-2 h-2 rounded-full bg-[#C8CBD2]"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#C8CBD2] font-semibold text-[11px] backdrop-blur-md">
            Documents
          </span>
        </div>

        {/* Node 5: Compliance (Bottom left) */}
        <div className="absolute bottom-[22%] left-[26%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-[#B9F56B]/60 flex items-center justify-center shadow-[0_0_10px_rgba(185,245,107,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#B9F56B]"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#F5F5F5] font-semibold text-[11px] backdrop-blur-md">
            Compliance
          </span>
        </div>

        {/* Node 6: Inspections (Bottom right) */}
        <div className="absolute bottom-[20%] right-[24%] flex items-center gap-1.5 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-[#111215] border border-white/30 flex items-center justify-center shadow-glass-highlight">
            <span className="w-2 h-2 rounded-full bg-[#A5EA54]"></span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#111215]/80 border border-white/15 text-[#C8CBD2] font-semibold text-[11px] backdrop-blur-md">
            Inspections
          </span>
        </div>

      </div>

      {/* Network Connectivity Legend (Discreet and compact) */}
      <div className="absolute bottom-3 left-4 pointer-events-none">
        <span className="text-[10px] font-mono text-[#A5A5AD]/80">
          Regulatory Topology Network
        </span>
      </div>
    </div>
  );
}

function ThreeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationId;
    let renderer, scene, camera;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    import('three').then((THREE) => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.z = 24;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Central Globe Wireframe in cool smoky gray
      const sphereGeo = new THREE.SphereGeometry(7, 20, 20);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x2A2E38,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      // Network Nodes (Floating particles with connections)
      const particleCount = 28;
      const positions = new Float32Array(particleCount * 3);
      const particleNodes = [];

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 7.5 + (Math.random() * 1.5);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particleNodes.push(new THREE.Vector3(x, y, z));
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Glowing nodes: mix of lime and silver
      const particleMat = new THREE.PointsMaterial({
        color: 0xB9F56B,
        size: 0.35,
        transparent: true,
        opacity: 0.75,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Connecting Synapse Lines
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xB9F56B,
        transparent: true,
        opacity: 0.14,
      });

      const lineGeo = new THREE.BufferGeometry();
      const linePositions = [];

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dist = particleNodes[i].distanceTo(particleNodes[j]);
          if (dist < 4.8) {
            linePositions.push(particleNodes[i].x, particleNodes[i].y, particleNodes[i].z);
            linePositions.push(particleNodes[j].x, particleNodes[j].y, particleNodes[j].z);
          }
        }
      }

      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const networkLines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(networkLines);

      // Orbital outer rings
      const ringGeo1 = new THREE.RingGeometry(9.5, 9.55, 64);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xC8CBD2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 2.8;
      scene.add(ring1);

      // Subtle, restrained animation loop
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        if (!prefersReducedMotion) {
          sphere.rotation.y += 0.0015;
          particleSystem.rotation.y += 0.0015;
          networkLines.rotation.y += 0.0015;
          ring1.rotation.z += 0.001;
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!canvas.parentElement) return;
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    });
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

function CanvasFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-36 h-36 rounded-full border border-white/20 flex items-center justify-center relative animate-spin-slow">
        <div className="w-24 h-24 rounded-full border border-[#B9F56B]/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#B9F56B]/10 border border-[#B9F56B]"></div>
        </div>
      </div>
      <p className="text-xs text-[#A5A5AD] mt-4 font-mono">Regulatory Topology Network</p>
    </div>
  );
}
