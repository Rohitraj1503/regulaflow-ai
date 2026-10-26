import React from 'react';
import { motion } from 'framer-motion';

/**
 * Organic Background Botanical & Geometric Shapes.
 * Inspired by Image 3: Soft curved background silhouettes, decorative foliage,
 * and ambient aura behind the central welcome card and illustrated characters.
 */
export default function LoginBackgroundShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      
      {/* Central Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tr from-[#B9F56B]/[0.04] via-[#38BDF8]/[0.03] to-purple-500/[0.03] blur-[140px]" />

      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover opacity-60"
      >
        <defs>
          <linearGradient id="blob-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B9F56B" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="leaf-grad-left" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="leaf-grad-right" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B9F56B" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Big Central Fluid Blob (Image 3 inspired) */}
        <path
          d="M380 220 Q500 120 720 180 Q920 240 880 480 Q840 700 620 720 Q360 740 320 540 Q280 340 380 220 Z"
          fill="url(#blob-grad)"
          className="transition-all"
        />

        {/* Botanical / Stylized Leaves on Left (Behind Left Character) */}
        <g opacity="0.75">
          {/* Main Leaf Stem */}
          <path d="M260 620 Q240 480 280 320" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaf 1 */}
          <ellipse cx="230" cy="520" rx="36" ry="18" transform="rotate(-35 230 520)" fill="url(#leaf-grad-left)" />
          {/* Leaf 2 */}
          <ellipse cx="290" cy="450" rx="42" ry="20" transform="rotate(25 290 450)" fill="url(#leaf-grad-left)" />
          {/* Leaf 3 */}
          <ellipse cx="240" cy="380" rx="38" ry="18" transform="rotate(-20 240 380)" fill="url(#leaf-grad-left)" />
          {/* Leaf 4 */}
          <ellipse cx="280" cy="320" rx="34" ry="16" transform="rotate(15 280 320)" fill="url(#leaf-grad-left)" />
        </g>

        {/* Botanical / Stylized Leaves on Right (Behind Right Character) */}
        <g opacity="0.75">
          {/* Main Leaf Stem */}
          <path d="M940 640 Q960 490 920 330" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaf 1 */}
          <ellipse cx="965" cy="530" rx="38" ry="18" transform="rotate(35 965 530)" fill="url(#leaf-grad-right)" />
          {/* Leaf 2 */}
          <ellipse cx="910" cy="460" rx="42" ry="20" transform="rotate(-25 910 460)" fill="url(#leaf-grad-right)" />
          {/* Leaf 3 */}
          <ellipse cx="955" cy="390" rx="36" ry="17" transform="rotate(20 955 390)" fill="url(#leaf-grad-right)" />
          {/* Leaf 4 */}
          <ellipse cx="915" cy="330" rx="32" ry="15" transform="rotate(-15 915 330)" fill="url(#leaf-grad-right)" />
        </g>

        {/* Subtle Decorative Floating Tech/Geometric Spheres */}
        <circle cx="280" cy="240" r="8" fill="#B9F56B" opacity="0.2" />
        <circle cx="920" cy="260" r="12" fill="#38BDF8" opacity="0.2" />
        <circle cx="600" cy="140" r="6" fill="#C8CBD2" opacity="0.15" />
      </svg>
    </div>
  );
}
