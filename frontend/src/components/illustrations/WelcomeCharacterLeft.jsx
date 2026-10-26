import React from 'react';
import { motion } from 'framer-motion';

/**
 * Left Illustrated Character: Friendly professional welcoming the user.
 * Inspired by Image 3: Standing, leaning gesture toward the welcome panel.
 * Uses high-quality SVG vectors harmonious with RegulaFlow AI's smoky & lime palette.
 */
export default function WelcomeCharacterLeft({ className = '' }) {
  return (
    <motion.div
      className={`relative select-none pointer-events-none ${className}`}
      initial={{ x: -70, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      {/* Subtle gentle idle breathing animation */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 260 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]"
        >
          {/* Character Ground Shadow on Floor */}
          <ellipse cx="145" cy="404" rx="60" ry="10" fill="rgba(0,0,0,0.48)" />

          {/* Left Leg (Back) */}
          <path
            d="M135 250 L115 385 L95 390 L120 250 Z"
            fill="#7036DB"
          />
          {/* Left Shoe */}
          <ellipse cx="96" cy="392" rx="15" ry="6" fill="#181A20" />
          <path d="M92 390 Q96 386 106 389" stroke="#B9F56B" strokeWidth="1.8" strokeLinecap="round" />

          {/* Right Leg (Front - In stride / leaning) */}
          <path
            d="M150 250 L175 380 L195 386 L168 250 Z"
            fill="#8A4FFF"
          />
          {/* Right Leg Shadow */}
          <path
            d="M156 250 L175 380 L184 384 L168 250 Z"
            fill="#6B28CC"
          />
          {/* Right Shoe */}
          <ellipse cx="192" cy="388" rx="15" ry="6.5" fill="#181A20" />
          <path d="M188 386 Q193 382 201 385" stroke="#B9F56B" strokeWidth="1.8" strokeLinecap="round" />

          {/* Torso / Upper Body (Raspberry Pink) */}
          <path
            d="M125 155 Q145 150 170 155 Q165 210 160 255 Q140 255 125 255 Z"
            fill="#FF4D6D"
          />
          {/* Torso Side Shadow */}
          <path
            d="M125 155 Q135 190 132 255 L125 255 Z"
            fill="#D92850"
          />

          {/* Right Arm (Reaching toward card - welcoming leaning pose) */}
          <path
            d="M165 160 Q195 165 220 170 Q240 172 250 170 L248 182 Q230 185 200 180 Q170 178 160 175 Z"
            fill="#FF4D6D"
          />
          {/* Right Arm Under-shadow */}
          <path
            d="M170 178 Q200 180 230 185 L248 182 Q230 180 200 176 Z"
            fill="#D92850"
          />
          {/* Right Hand resting / welcoming */}
          <path
            d="M248 170 Q258 171 258 178 Q258 184 248 183 Z"
            fill="#FFDFC4"
          />

          {/* Left Arm (Relaxed at side) */}
          <path
            d="M128 160 Q112 185 108 220 L118 222 Q122 190 136 168 Z"
            fill="#D92850"
          />
          {/* Left Hand */}
          <circle cx="112" cy="226" r="6" fill="#FFDFC4" />

          {/* Neck */}
          <rect x="140" y="132" width="12" height="18" rx="4" fill="#FFDFC4" />
          <path d="M140 142 L152 142 L152 146 L140 146 Z" fill="#F0B892" />

          {/* Head & Face */}
          <ellipse cx="147" cy="120" rx="15" ry="17" fill="#FFDFC4" />

          {/* Simplified Facial Features */}
          <ellipse cx="152" cy="118" rx="1.8" ry="2.2" fill="#20222A" />
          {/* Gentle Smile */}
          <path d="M148 126 Q153 130 157 127" stroke="#A85A38" strokeWidth="1.5" strokeLinecap="round" />

          {/* Flowing Blonde/Amber Hair (Image 3 Style) */}
          <path
            d="M132 115 Q125 95 145 92 Q162 90 165 106 Q168 116 160 128 Q155 138 152 150 Q145 155 138 148 Q130 135 128 122 Z"
            fill="#F5A623"
          />
          {/* Front bangs / sweep highlight */}
          <path
            d="M140 98 Q152 95 160 108 Q154 114 144 108 Z"
            fill="#FFD152"
          />
          <path
            d="M136 112 Q144 106 150 114"
            stroke="#FFE07A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Modern Digital Badge / ID Lanyard with RegulaFlow Lime Accent */}
          <path d="M142 153 L146 172 L148 172 L152 153" stroke="#B9F56B" strokeWidth="1.6" fill="none" />
          <rect x="142" y="172" width="10" height="14" rx="2" fill="#111215" stroke="#B9F56B" strokeWidth="1.2" />
          <circle cx="147" cy="177" r="1.5" fill="#B9F56B" />

          {/* Decorative Sparkles near hand */}
          <circle cx="245" cy="155" r="2.5" fill="#B9F56B" />
          <path d="M235 145 L237 149 L241 151 L237 153 L235 157 L233 153 L229 151 L233 149 Z" fill="#B9F56B" opacity="0.85" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
