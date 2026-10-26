import React from 'react';
import { motion } from 'framer-motion';

/**
 * Right Illustrated Character: Seated/crouching professional beside a laptop.
 * Inspired directly by Image 3: Sitting on the lower right of the card,
 * in a thoughtful pose looking toward the card, with an open laptop beside him.
 * Matches the flat, clean vector style, scale, and color harmony of WelcomeCharacterLeft.
 */
export default function WelcomeCharacterRight({ className = '' }) {
  return (
    <motion.div
      className={`relative select-none pointer-events-none ${className}`}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      {/* Gentle idle breathing animation */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      >
        <svg
          viewBox="0 0 280 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]"
        >
          {/* Ground Floor Shadow */}
          <ellipse cx="140" cy="346" rx="90" ry="10" fill="rgba(0,0,0,0.5)" />

          {/* ========================================================= */}
          {/* OPEN LAPTOP ON THE FLOOR (Beside character, facing card) */}
          {/* ========================================================= */}
          <g>
            {/* Screen Back Glow on Floor */}
            <ellipse cx="62" cy="336" rx="35" ry="8" fill="rgba(185,245,107,0.18)" />

            {/* Laptop Base (Flat on floor) */}
            <path
              d="M26 332 L94 332 L85 344 L16 344 Z"
              fill="#222630"
              stroke="#323846"
              strokeWidth="1.2"
            />
            {/* Trackpad */}
            <rect x="44" y="337" width="18" height="5" rx="1" fill="#14161C" />

            {/* Laptop Display (Angled upward facing toward character) */}
            <path
              d="M28 258 L86 252 L94 332 L36 332 Z"
              fill="#1C1F26"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Glowing Screen Bezel & Surface */}
            <path
              d="M32 262 L82 256 L90 328 L40 328 Z"
              fill="#0F1713"
            />
            {/* Ambient Screen Light Fill */}
            <path
              d="M33 264 L80 258 L88 326 L41 326 Z"
              fill="#132B1C"
            />

            {/* Regulatory Intelligence Code Lines on Screen */}
            <line x1="42" y1="274" x2="74" y2="270" stroke="#B9F56B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="44" y1="284" x2="68" y2="281" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="46" y1="294" x2="78" y2="291" stroke="#F1F5F9" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
            <line x1="48" y1="304" x2="64" y2="302" stroke="#B9F56B" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="80" cy="270" r="2.2" fill="#B9F56B" />

            {/* Glowing Screen Aura */}
            <circle cx="60" cy="290" r="14" fill="#B9F56B" opacity="0.12" />
          </g>

          {/* ========================================================= */}
          {/* CROUCHING / KNEELING PROFESSIONAL (Image 3 inspired) */}
          {/* ========================================================= */}

          {/* Left Leg (Folded on the ground) */}
          <path
            d="M142 226 Q115 260 96 298 Q86 324 116 336 L154 336 Q146 295 152 242 Z"
            fill="#7036DB"
          />
          {/* Left Leg Shading */}
          <path
            d="M110 300 Q100 320 118 334 L144 334 Q135 295 140 260 Z"
            fill="#5622B3"
          />
          {/* Left Shoe */}
          <ellipse cx="120" cy="338" rx="18" ry="7" fill="#181A20" />
          <path d="M112 336 Q120 332 130 336" stroke="#B9F56B" strokeWidth="1.8" strokeLinecap="round" />

          {/* Right Leg (Raised bent knee pose - prominent in Image 3) */}
          <path
            d="M160 216 Q194 228 212 265 Q222 298 206 334 L180 334 Q194 296 178 262 Q166 238 148 222 Z"
            fill="#8A4FFF"
          />
          {/* Right Leg Shadow */}
          <path
            d="M188 280 Q200 305 188 332 L176 332 Q188 298 178 268 Z"
            fill="#6B28CC"
          />
          {/* Right Shoe */}
          <ellipse cx="196" cy="336" rx="18" ry="7" fill="#181A20" />
          <path d="M188 334 Q196 330 206 334" stroke="#B9F56B" strokeWidth="1.8" strokeLinecap="round" />

          {/* Torso (Leaning forward toward laptop & login card) */}
          <path
            d="M142 132 Q174 126 190 142 Q176 196 160 236 Q138 230 126 214 Q132 168 142 132 Z"
            fill="#38BDF8"
          />
          {/* Torso Depth Shading (Under right arm & waist) */}
          <path
            d="M158 170 Q168 198 158 234 Q142 228 132 216 Q138 180 146 160 Z"
            fill="#0284C7"
          />

          {/* White T-shirt collar peek */}
          <path d="M144 133 L154 150 L166 133 Z" fill="#F8FAFC" />

          {/* Left Arm (Reaching down typing on the laptop keyboard) */}
          <path
            d="M142 144 Q116 174 94 220 L80 286 L94 288 L112 232 Q132 190 152 158 Z"
            fill="#38BDF8"
          />
          <path
            d="M92 240 L80 286 L94 288 L104 250 Z"
            fill="#0284C7"
          />
          {/* Left Hand typing on laptop keys */}
          <circle cx="82" cy="289" r="6.5" fill="#FFDFC4" />

          {/* Right Arm (Resting elbow on knee, hand supporting chin - Image 3 pose) */}
          {/* Upper Arm going down to knee */}
          <path
            d="M184 142 Q208 178 198 224 L174 214 Q186 178 172 152 Z"
            fill="#0284C7"
          />
          {/* Forearm bent upward toward chin */}
          <path
            d="M198 220 L162 166 L152 172 L186 226 Z"
            fill="#38BDF8"
          />
          {/* Right Hand at cheek/chin in thoughtful reflection */}
          <circle cx="156" cy="164" r="7" fill="#FFDFC4" />

          {/* Neck */}
          <rect x="146" y="116" width="13" height="18" rx="4" fill="#FFDFC4" />
          <path d="M146 126 L159 126 L159 132 L146 132 Z" fill="#F0B892" />

          {/* Head & Face (Facing left toward laptop & card) */}
          <ellipse cx="148" cy="104" rx="16" ry="18" fill="#FFDFC4" />

          {/* Facial Profile Features */}
          {/* Eye (Focused, looking down at laptop/form) */}
          <ellipse cx="140" cy="102" rx="2" ry="2.4" fill="#1E222B" />
          {/* Eyebrow */}
          <path d="M137 96 Q142 94 146 96" stroke="#2D323E" strokeWidth="1.5" strokeLinecap="round" />
          {/* Friendly Thoughtful Smile */}
          <path d="M136 112 Q141 116 146 113" stroke="#A85A38" strokeWidth="1.6" strokeLinecap="round" />

          {/* Modern Dark Textured Hair */}
          <path
            d="M134 102 Q128 85 146 82 Q164 80 167 95 Q165 106 162 112 Q156 94 146 93 Q138 95 134 102 Z"
            fill="#20242D"
          />
          {/* Hair Side Burn & Trim Detail */}
          <path
            d="M152 90 Q158 84 165 87"
            stroke="#3B4252"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Small Decorative Floating Tech Particles */}
          <circle cx="76" cy="246" r="2.5" fill="#B9F56B" />
          <path d="M214 186 L216 190 L220 192 L216 194 L214 198 L212 194 L208 192 L212 190 Z" fill="#38BDF8" opacity="0.75" />
          <circle cx="226" cy="162" r="2" fill="#B9F56B" opacity="0.8" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
