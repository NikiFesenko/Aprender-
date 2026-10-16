import React from 'react';

interface SvgProps {
  type: 'cafe' | 'train' | 'library' | 'hospital' | 'court' | 'market';
  className?: string;
}

export const SvgIllustrations: React.FC<SvgProps> = ({ type, className = 'w-full h-full' }) => {
  switch (type) {
    case 'cafe':
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cafeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#311042" />
            </linearGradient>
            <linearGradient id="coffeeSteam" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Table & Warm Atmosphere */}
          <rect width="500" height="320" rx="16" fill="url(#cafeBg)" />
          <ellipse cx="250" cy="270" rx="200" ry="35" fill="#0f172a" opacity="0.6" />

          {/* Saucer */}
          <ellipse cx="250" cy="235" rx="110" ry="22" fill="#94a3b8" />
          <ellipse cx="250" cy="232" rx="100" ry="18" fill="url(#cupGrad)" />

          {/* Cup Body */}
          <path d="M 175 140 L 190 225 Q 250 240 310 225 L 325 140 Z" fill="url(#cupGrad)" stroke="#64748b" strokeWidth="2" />
          
          {/* Coffee Surface */}
          <ellipse cx="250" cy="140" rx="75" ry="16" fill="#3e1f0e" />
          <ellipse cx="250" cy="140" rx="66" ry="12" fill="#582a12" />
          <ellipse cx="245" cy="138" rx="40" ry="7" fill="#b45309" opacity="0.4" />

          {/* Cup Handle */}
          <path d="M 315 155 Q 365 170 355 205 Q 345 220 305 210" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
          <path d="M 315 155 Q 365 170 355 205 Q 345 220 305 210" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

          {/* Dynamic Steaming Vapor Curls (Indicating "muy caliente") */}
          <g filter="url(#glow)">
            <path d="M 225 120 Q 215 90 230 70 Q 245 50 235 30" fill="none" stroke="url(#coffeeSteam)" strokeWidth="6" strokeLinecap="round">
              <animate attributeName="d" dur="3s" repeatCount="indefinite" values="
                M 225 120 Q 215 90 230 70 Q 245 50 235 30;
                M 225 120 Q 235 90 220 70 Q 210 50 225 30;
                M 225 120 Q 215 90 230 70 Q 245 50 235 30" />
            </path>
            <path d="M 255 115 Q 270 85 255 60 Q 240 40 250 20" fill="none" stroke="url(#coffeeSteam)" strokeWidth="7" strokeLinecap="round">
              <animate attributeName="d" dur="3.5s" repeatCount="indefinite" values="
                M 255 115 Q 270 85 255 60 Q 240 40 250 20;
                M 255 115 Q 245 85 260 60 Q 270 40 260 20;
                M 255 115 Q 270 85 255 60 Q 240 40 250 20" />
            </path>
            <path d="M 280 125 Q 295 95 285 75 Q 275 55 290 35" fill="none" stroke="url(#coffeeSteam)" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Visual Badge Cue */}
          <rect x="20" y="20" width="135" height="32" rx="16" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#f43f5e" />
          <text x="50" y="41" fill="#fda4af" fontSize="13" fontWeight="bold" fontFamily="sans-serif">ALTA TEMP 🔥</text>
        </svg>
      );

    case 'market':
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="marketBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="appleRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="crateWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          <rect width="500" height="320" rx="16" fill="url(#marketBg)" />

          {/* Wooden Market Crate */}
          <rect x="80" y="170" width="340" height="110" rx="6" fill="url(#crateWood)" stroke="#451a03" strokeWidth="3" />
          <line x1="80" y1="210" x2="420" y2="210" stroke="#451a03" strokeWidth="4" />
          <line x1="80" y1="245" x2="420" y2="245" stroke="#451a03" strokeWidth="4" />

          {/* Red Apples in Basket (Femenino plural: Manzanas Rojas) */}
          {/* Apple 1 */}
          <g>
            <circle cx="170" cy="145" r="38" fill="url(#appleRed)" />
            <ellipse cx="155" cy="130" rx="10" ry="16" fill="#fca5a5" opacity="0.6" transform="rotate(-25 155 130)" />
            <path d="M 170 110 Q 175 95 185 92" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 183 95 Q 200 90 202 102 Q 192 108 183 95" fill="#22c55e" />
          </g>

          {/* Apple 2 */}
          <g>
            <circle cx="250" cy="135" r="42" fill="url(#appleRed)" />
            <ellipse cx="235" cy="118" rx="11" ry="18" fill="#fca5a5" opacity="0.6" transform="rotate(-25 235 118)" />
            <path d="M 250 96 Q 255 80 266 78" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 264 82 Q 282 78 284 90 Q 273 96 264 82" fill="#22c55e" />
          </g>

          {/* Apple 3 */}
          <g>
            <circle cx="330" cy="148" r="36" fill="url(#appleRed)" />
            <ellipse cx="318" cy="135" rx="9" ry="15" fill="#fca5a5" opacity="0.6" transform="rotate(-25 318 135)" />
            <path d="M 330 114 Q 334 100 344 98" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 342 101 Q 358 97 360 108 Q 350 114 342 101" fill="#22c55e" />
          </g>

          {/* Label Badge */}
          <rect x="20" y="20" width="160" height="32" rx="16" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#10b981" />
          <text x="50" y="41" fill="#6ee7b7" fontSize="13" fontWeight="bold" fontFamily="sans-serif">FEM. PLURAL (-AS)</text>
        </svg>
      );

    case 'train':
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="trainBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="trainSilver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          <rect width="500" height="320" rx="16" fill="url(#trainBg)" />

          {/* Platform Floor & Safety Line */}
          <polygon points="0,220 500,220 500,320 0,320" fill="#334155" />
          <rect x="0" y="235" width="500" height="12" fill="#eab308" />

          {/* Train Tracks */}
          <line x1="0" y1="210" x2="500" y2="210" stroke="#64748b" strokeWidth="6" />
          <line x1="0" y1="195" x2="500" y2="195" stroke="#475569" strokeWidth="4" />

          {/* Modern Train Nose & Cabin */}
          <path d="M 60 110 Q 220 105 380 120 Q 460 135 480 185 L 480 205 L 60 205 Z" fill="url(#trainSilver)" stroke="#0284c7" strokeWidth="3" />
          
          {/* Train Cockpit Window */}
          <path d="M 390 125 Q 445 138 460 165 L 400 165 Z" fill="#0284c7" opacity="0.9" stroke="#38bdf8" strokeWidth="2" />

          {/* Passenger Windows */}
          <rect x="90" y="130" width="50" height="35" rx="6" fill="#0284c7" opacity="0.8" />
          <rect x="160" y="130" width="50" height="35" rx="6" fill="#0284c7" opacity="0.8" />
          <rect x="230" y="130" width="50" height="35" rx="6" fill="#0284c7" opacity="0.8" />
          <rect x="300" y="130" width="50" height="35" rx="6" fill="#0284c7" opacity="0.8" />

          {/* Red Aerodynamic Stripe */}
          <path d="M 60 178 L 475 178" stroke="#ef4444" strokeWidth="8" />

          {/* Station Clock */}
          <circle cx="430" cy="55" r="28" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
          <line x1="430" y1="55" x2="430" y2="38" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="430" y1="55" x2="445" y2="55" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />

          {/* Status Badge */}
          <rect x="20" y="20" width="165" height="32" rx="16" fill="#0ea5e9" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#0ea5e9" />
          <text x="50" y="41" fill="#7dd3fc" fontSize="13" fontWeight="bold" fontFamily="sans-serif">LLEGADA INMEDIATA ⏱️</text>
        </svg>
      );

    case 'hospital':
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hospBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>

          <rect width="500" height="320" rx="16" fill="url(#hospBg)" />

          {/* Consultation Desk */}
          <rect x="60" y="210" width="380" height="80" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

          {/* Doctor Silhouette with White Coat */}
          <circle cx="210" cy="110" r="32" fill="#fed7aa" />
          <path d="M 140 210 L 160 155 Q 210 145 260 155 L 280 210 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Stethoscope */}
          <path d="M 190 155 Q 210 200 230 155" fill="none" stroke="#0284c7" strokeWidth="4" />
          <circle cx="210" cy="195" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

          {/* Prescription Board / Rx Symbol */}
          <rect x="290" y="160" width="90" height="110" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="320" y="152" width="30" height="12" rx="3" fill="#64748b" />
          <line x1="305" y1="185" x2="365" y2="185" stroke="#ef4444" strokeWidth="3" />
          <line x1="305" y1="205" x2="355" y2="205" stroke="#64748b" strokeWidth="2" />
          <line x1="305" y1="225" x2="360" y2="225" stroke="#64748b" strokeWidth="2" />
          <line x1="305" y1="245" x2="340" y2="245" stroke="#64748b" strokeWidth="2" />

          {/* Badge Cue */}
          <rect x="20" y="20" width="180" height="32" rx="16" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#38bdf8" />
          <text x="50" y="41" fill="#bae6fd" fontSize="13" fontWeight="bold" fontFamily="sans-serif">SUBJUNTIVO CLÍNICO 🩺</text>
        </svg>
      );

    case 'court':
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="courtBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>

          <rect width="500" height="320" rx="16" fill="url(#courtBg)" />

          {/* Judicial Bench */}
          <polygon points="50,230 450,230 470,300 30,300" fill="#451a03" stroke="#78350f" strokeWidth="3" />

          {/* Balance Scales of Justice */}
          {/* Base & Pillar */}
          <rect x="242" y="90" width="16" height="140" rx="4" fill="url(#brassGold)" />
          <ellipse cx="250" cy="225" rx="35" ry="10" fill="url(#brassGold)" />
          
          {/* Beam */}
          <line x1="160" y1="105" x2="340" y2="105" stroke="url(#brassGold)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="250" cy="105" r="8" fill="#fde047" />

          {/* Left Pan */}
          <line x1="170" y1="105" x2="155" y2="155" stroke="#ca8a04" strokeWidth="2" />
          <line x1="170" y1="105" x2="185" y2="155" stroke="#ca8a04" strokeWidth="2" />
          <path d="M 145 155 Q 170 180 195 155 Z" fill="url(#brassGold)" />

          {/* Right Pan */}
          <line x1="330" y1="105" x2="315" y2="155" stroke="#ca8a04" strokeWidth="2" />
          <line x1="330" y1="105" x2="345" y2="155" stroke="#ca8a04" strokeWidth="2" />
          <path d="M 305 155 Q 330 180 355 155 Z" fill="url(#brassGold)" />

          {/* Badge Cue */}
          <rect x="20" y="20" width="180" height="32" rx="16" fill="#eab308" fillOpacity="0.2" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#eab308" />
          <text x="50" y="41" fill="#fef08a" fontSize="13" fontWeight="bold" fontFamily="sans-serif">REGISTRO JURÍDICO ⚖️</text>
        </svg>
      );

    case 'library':
    default:
      return (
        <svg viewBox="0 0 500 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="libBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <radialGradient id="lampGlow" cx="70%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="500" height="320" rx="16" fill="url(#libBg)" />
          <rect width="500" height="320" fill="url(#lampGlow)" />

          {/* Wooden Scholar Desk */}
          <rect x="40" y="210" width="420" height="85" rx="6" fill="#3f2e1a" stroke="#713f12" strokeWidth="2" />

          {/* Stack of Leatherbound Books */}
          <rect x="90" y="175" width="120" height="22" rx="3" fill="#831843" stroke="#4a044e" strokeWidth="2" />
          <rect x="95" y="152" width="110" height="23" rx="3" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
          <rect x="100" y="130" width="95" height="22" rx="3" fill="#065f46" stroke="#022c22" strokeWidth="2" />

          {/* Antique Green Banker Lamp */}
          <rect x="340" y="200" width="40" height="10" rx="3" fill="#b45309" />
          <line x1="360" y1="200" x2="360" y2="120" stroke="#b45309" strokeWidth="5" />
          <path d="M 330 120 Q 360 100 390 120 Z" fill="#15803d" stroke="#166534" strokeWidth="3" />
          <ellipse cx="360" cy="120" rx="30" ry="6" fill="#fef08a" opacity="0.9" />

          {/* Open Manuscript */}
          <polygon points="215,200 250,195 285,200 280,215 250,210 220,215" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <line x1="225" y1="204" x2="245" y2="202" stroke="#78350f" strokeWidth="1" />
          <line x1="255" y1="202" x2="275" y2="204" stroke="#78350f" strokeWidth="1" />

          {/* Badge Cue */}
          <rect x="20" y="20" width="190" height="32" rx="16" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="6" fill="#a855f7" />
          <text x="50" y="41" fill="#d8b4fe" fontSize="13" fontWeight="bold" fontFamily="sans-serif">FILOSÓFICO C1 📜</text>
        </svg>
      );
  }
};
