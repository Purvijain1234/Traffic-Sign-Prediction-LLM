import React from 'react';

/**
 * Traffic Sign Saarthi AI - Vector Illustration System
 * Modern Indian Road-Safety Aesthetic: Linear discipline, colorful storytelling, authentic IRC:67 signs.
 */

interface IllustrationProps {
  className?: string;
  size?: number | string;
}

// 1. Hero Road Illustration: Indian urban road with traffic signs, road markings, auto-rickshaw & city details
export const HeroRoadIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-auto max-h-[420px]' }) => (
  <svg
    viewBox="0 0 920 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Indian Urban Road Scene with Traffic Signs and Vehicles"
  >
    <defs>
      {/* Radiant Dawn Sky Gradient */}
      <linearGradient id="heroSkyGradient" x1="460" y1="0" x2="460" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="0.35" stopColor="#C4B5FD" />
        <stop offset="0.7" stopColor="#FED7AA" />
        <stop offset="1" stopColor="#FDBA74" />
      </linearGradient>

      {/* Dark Mode Sky Gradient */}
      <linearGradient id="heroSkyDark" x1="460" y1="0" x2="460" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0B132B" />
        <stop offset="0.4" stopColor="#151C3E" />
        <stop offset="0.8" stopColor="#1E234C" />
        <stop offset="1" stopColor="#2D234A" />
      </linearGradient>

      {/* Asphalt Highway Gradient with Depth */}
      <linearGradient id="heroRoadGradient" x1="460" y1="200" x2="460" y2="420" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.4" stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>

      {/* Radiant Sun Glow */}
      <radialGradient id="heroSunGlow" cx="460" cy="180" r="170" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF9F43" stopOpacity="0.5" />
        <stop offset="0.5" stopColor="#FF665A" stopOpacity="0.25" />
        <stop offset="1" stopColor="#FF9F43" stopOpacity="0" />
      </radialGradient>

      {/* Streetlight Glow */}
      <radialGradient id="streetGlow" cx="0" cy="0" r="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" stopOpacity="0.6" />
        <stop offset="1" stopColor="#FEF08A" stopOpacity="0" />
      </radialGradient>

      {/* Indian Tricolor Horizon Ribbon */}
      <linearGradient id="tricolorBar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FF9933" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#138808" />
      </linearGradient>
    </defs>

    {/* Sky & Distant Horizon */}
    <rect width="920" height="420" rx="14" fill="url(#heroSkyGradient)" className="dark:hidden" />
    <rect width="920" height="420" rx="14" fill="url(#heroSkyDark)" className="hidden dark:block" />
    
    {/* Radiant Sun Horizon Halo */}
    <circle cx="460" cy="185" r="170" fill="url(#heroSunGlow)" pointerEvents="none" />
    <circle cx="460" cy="175" r="32" fill="#FFFBEB" opacity="0.9" />

    {/* Distant Skyline Silhouette (Delhi/Mumbai Metro Viaduct & Highrises) */}
    <g opacity="0.45" className="text-slate-700 dark:text-slate-400" fill="currentColor">
      <rect x="50" y="130" width="50" height="70" rx="2" />
      <rect x="105" y="115" width="60" height="85" rx="2" />
      <rect x="175" y="145" width="40" height="55" rx="2" />
      <rect x="225" y="125" width="65" height="75" rx="2" />
      <rect x="300" y="155" width="45" height="45" rx="2" />
      <rect x="615" y="120" width="55" height="80" rx="2" />
      <rect x="680" y="140" width="65" height="60" rx="2" />
      <rect x="755" y="110" width="50" height="90" rx="2" />
      <rect x="815" y="145" width="55" height="55" rx="2" />
      {/* Metro Rail Viaduct Pillar line */}
      <rect x="50" y="172" width="820" height="5" fill="#64748B" rx="1" />
      <rect x="150" y="175" width="8" height="25" fill="#475569" />
      <rect x="270" y="175" width="8" height="25" fill="#475569" />
      <rect x="650" y="175" width="8" height="25" fill="#475569" />
      <rect x="770" y="175" width="8" height="25" fill="#475569" />
    </g>

    {/* Lush Green Roadside Foliage (Neem & Gulmohar Trees) */}
    <g>
      <circle cx="345" cy="190" r="16" fill="#059669" />
      <circle cx="365" cy="186" r="19" fill="#10B981" />
      <circle cx="390" cy="190" r="15" fill="#34D399" />
      <circle cx="530" cy="190" r="15" fill="#34D399" />
      <circle cx="555" cy="186" r="19" fill="#10B981" />
      <circle cx="580" cy="190" r="16" fill="#059669" />
    </g>

    {/* Ground Verge / Pavement with Indian Kerb Marking */}
    <rect y="200" width="920" height="220" fill="#CBD5E1" className="dark:fill-[#1E293B]" />

    {/* Indian Asphalt Highway with Deep Perspective */}
    <path
      d="M380 200 L540 200 L745 420 L175 420 Z"
      fill="url(#heroRoadGradient)"
      stroke="#64748B"
      strokeWidth="1.5"
    />

    {/* Highway Yellow Shoulder Borders */}
    <path d="M382 200 L180 420" stroke="#FF9F43" strokeWidth="3" opacity="0.95" />
    <path d="M538 200 L740 420" stroke="#FF9F43" strokeWidth="3" opacity="0.95" />

    {/* Center Dashed White Separation Line */}
    <path
      d="M460 200 L460 215 M460 230 L460 252 M460 272 L460 304 M460 328 L460 368 M460 388 L460 420"
      stroke="#FFFFFF"
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.95"
    />

    {/* Zebra Pedestrian Crossing Strips */}
    <g opacity="0.92">
      <path d="M255 380 L292 380 L287 398 L247 398 Z" fill="#FFFFFF" />
      <path d="M315 380 L352 380 L349 398 L310 398 Z" fill="#FFFFFF" />
      <path d="M375 380 L412 380 L410 398 L373 398 Z" fill="#FFFFFF" />
      <path d="M440 380 L478 380 L478 398 L438 398 Z" fill="#FFFFFF" />
      <path d="M502 380 L540 380 L543 398 L504 398 Z" fill="#FFFFFF" />
      <path d="M568 380 L605 380 L610 398 L571 398 Z" fill="#FFFFFF" />
      <path d="M632 380 L669 380 L677 398 L638 398 Z" fill="#FFFFFF" />
    </g>

    {/* Indian Auto-Rickshaw (Bajaj Classic Saffron/Emerald Green with Headlight Glow) */}
    <g transform="translate(305, 255) scale(0.92)">
      {/* Light pool on asphalt */}
      <ellipse cx="-15" cy="46" rx="20" ry="7" fill="#FEF08A" opacity="0.3" />
      {/* Rickshaw Top / Canopy */}
      <path d="M5 35 L12 10 L38 10 L46 22 L50 35 L47 43 L6 43 Z" fill="#FF9F43" />
      {/* Lower Body Green */}
      <path d="M6 35 L50 35 L48 45 L6 45 Z" fill="#10B981" />
      <rect x="6" y="33" width="44" height="2.5" fill="#FFFFFF" />
      {/* Windshield Glass */}
      <path d="M14 13 L34 13 L37 28 L15 28 Z" fill="#EAF2FF" opacity="0.9" />
      {/* Headlight with Beam */}
      <circle cx="8" cy="33" r="3.5" fill="#FEF08A" />
      {/* Driver & Passenger Silhouette */}
      <circle cx="22" cy="22" r="4.5" fill="#1E293B" />
      {/* Wheels */}
      <circle cx="14" cy="46" r="7.5" fill="#0F172A" />
      <circle cx="14" cy="46" r="3.5" fill="#94A3B8" />
      <circle cx="42" cy="46" r="7.5" fill="#0F172A" />
      <circle cx="42" cy="46" r="3.5" fill="#94A3B8" />
    </g>

    {/* Modern Blue Car on Right Highway Lane */}
    <g transform="translate(525, 270) scale(0.95)">
      {/* Car Body with Royal Blue Gradient */}
      <path d="M4 28 L16 13 L44 13 L58 24 L72 26 L74 36 L2 36 Z" fill="#3867FF" />
      {/* Windows */}
      <path d="M18 15 L42 15 L44 25 L16 25 Z" fill="#EAF2FF" opacity="0.9" />
      {/* Wheels */}
      <circle cx="18" cy="37" r="7.5" fill="#0F172A" />
      <circle cx="18" cy="37" r="3.5" fill="#E2E8F0" />
      <circle cx="58" cy="37" r="7.5" fill="#0F172A" />
      <circle cx="58" cy="37" r="3.5" fill="#E2E8F0" />
      {/* Headlight & Taillight */}
      <rect x="71" y="27" width="3" height="5" fill="#FEF08A" rx="1" />
      <rect x="2" y="27" width="3.5" height="5" fill="#FF4757" rx="1" />
    </g>

    {/* Overhead Road Sign Gantry (NH-48 New Delhi / Jaipur) */}
    <g>
      <rect x="235" y="160" width="7" height="155" fill="#475569" rx="1" />
      <rect x="680" y="160" width="7" height="155" fill="#475569" rx="1" />
      <rect x="235" y="155" width="452" height="9" fill="#334155" rx="2" />
      {/* Tricolor Accent Strip on Gantry Top */}
      <rect x="360" y="117" width="200" height="4" fill="url(#tricolorBar)" rx="1" />
      {/* Green Informatory Highway Board */}
      <rect x="360" y="121" width="200" height="46" rx="5" fill="#047857" stroke="#FFFFFF" strokeWidth="2.5" />
      <text x="460" y="141" fill="#FFFFFF" fontSize="11.5" fontWeight="900" textAnchor="middle" fontFamily="Inter, sans-serif" letterSpacing="0.5">
        NEW DELHI / JAIPUR
      </text>
      <text x="460" y="156" fill="#FEF08A" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">
        NH-48 • SPEED LIMIT 80
      </text>
    </g>

    {/* Signpost 1: Indian STOP Sign (Octagon) with Radiant AI Reticle */}
    <g transform="translate(125, 155)">
      {/* Pole */}
      <rect x="40" y="60" width="6" height="175" fill="#64748B" rx="1" />
      {/* Octagonal STOP Sign */}
      <polygon
        points="26,16 56,16 72,32 72,62 56,78 26,78 10,62 10,32"
        fill="#FF4757"
        stroke="#FFFFFF"
        strokeWidth="4"
      />
      <text x="41" y="52" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="Inter, sans-serif">
        STOP
      </text>
      {/* Saarthi AI Detection Reticle Corners with Glowing Neon Cyan/Blue */}
      <path d="M-4 12 L-4 -4 L12 -4" stroke="#3867FF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M86 -4 L102 -4 L102 12" stroke="#3867FF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M-4 82 L-4 98 L12 98" stroke="#3867FF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M86 98 L102 98 L102 82" stroke="#3867FF" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Confidence Pill with Gradient */}
      <rect x="14" y="-18" width="86" height="20" rx="5" fill="#3867FF" />
      <text x="57" y="-4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
        99.2% STOP
      </text>
    </g>

    {/* Signpost 2: Cautionary SCHOOL AHEAD (Triangle) */}
    <g transform="translate(255, 135)">
      <rect x="22" y="50" width="4" height="115" fill="#64748B" rx="1" />
      <polygon
        points="24,8 48,50 0,50"
        fill="#FFFFFF"
        stroke="#FF4757"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Children Silhouette */}
      <circle cx="18" cy="27" r="3" fill="#101B3F" />
      <path d="M15 32 L21 32 L22 43 L19 43 L18 38 L17 43 L14 43 Z" fill="#101B3F" />
      <circle cx="28" cy="30" r="2.5" fill="#101B3F" />
      <path d="M26 34 L30 34 L31 42 L29 42 L28 38 L27 42 L25 42 Z" fill="#101B3F" />
    </g>

    {/* Signpost 3: SPEED LIMIT 50 (Red Ring) */}
    <g transform="translate(715, 145)">
      <rect x="33" y="62" width="5" height="165" fill="#64748B" rx="1" />
      <circle cx="35" cy="35" r="32" fill="#FFFFFF" stroke="#FF4757" strokeWidth="7" />
      <text x="35" y="45" fill="#101B3F" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="Inter, sans-serif">
        50
      </text>
      <rect x="4" y="74" width="62" height="18" rx="4" fill="#3867FF" />
      <text x="35" y="86" fill="#FFFFFF" fontSize="8.5" fontWeight="800" textAnchor="middle">
        IRC:67 LIMIT
      </text>
    </g>

    {/* Signpost 4: COMPULSORY KEEP LEFT (Blue Disc) */}
    <g transform="translate(820, 170)">
      <rect x="23" y="45" width="4.5" height="125" fill="#64748B" rx="1" />
      <circle cx="25" cy="25" r="24" fill="#3867FF" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M30 15 L18 27 L23 27 L23 35 L16 35 L16 37 L26 37 L26 27 L31 27 Z" fill="#FFFFFF" transform="rotate(-30 25 25)" />
    </g>
  </svg>
);

// 2. Feature 1: Detect Illustration (Vibrant Computer Vision)
export const FeatureDetectIllustration: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fdGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" />
        <stop offset="1" stopColor="#FED7AA" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#fdGrad)" className="dark:fill-[#2A2016]" stroke="#FF9F43" strokeWidth="1.5" />
    {/* Traffic Sign Outline inside */}
    <circle cx="32" cy="32" r="17" fill="#FFFFFF" className="dark:fill-[#0F172A]" stroke="#FF4757" strokeWidth="3.5" />
    <text x="32" y="37" fill="#FF4757" fontSize="13" fontWeight="900" textAnchor="middle">50</text>
    {/* Detection Target Crosshairs */}
    <path d="M2 14 L2 2 L14 2" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 2 L62 2 L62 14" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
    <path d="M2 50 L2 62 L14 62" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 62 L62 62 L62 50" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 3. Feature 2: Understand Illustration (Statutory AI Knowledge)
export const FeatureUnderstandIllustration: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fuGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EAF2FF" />
        <stop offset="1" stopColor="#E0E7FF" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#fuGrad)" className="dark:fill-[#16234D]" stroke="#3867FF" strokeWidth="1.5" />
    {/* AI Brain & Reasoning Nodes */}
    <circle cx="32" cy="24" r="9" fill="#3867FF" />
    <path d="M29 20 L35 24 L29 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="18" y1="41" x2="46" y2="41" stroke="#3867FF" strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="48" x2="42" y2="48" stroke="#7655F7" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="24" r="4" fill="#7655F7" />
    <circle cx="48" cy="24" r="4" fill="#FF9F43" />
    <line x1="20" y1="24" x2="23" y2="24" stroke="#3867FF" strokeWidth="2" strokeDasharray="2 2" />
    <line x1="41" y1="24" x2="44" y2="24" stroke="#FF9F43" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

// 4. Feature 3: Drive Safer Illustration (Road Safety & Fines)
export const FeatureDriveSaferIllustration: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fsGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D1FAE5" />
        <stop offset="1" stopColor="#A7F3D0" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#fsGrad)" className="dark:fill-[#0C3524]" stroke="#10B981" strokeWidth="1.5" />
    {/* Safety Shield */}
    <path d="M32 12 L48 19 C48 35 39 47 32 50 C25 47 16 35 16 19 Z" fill="#10B981" />
    {/* White Checkmark */}
    <path d="M25 31 L30 36 L39 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 5. Workflow Step 1: Upload or Capture (Coral Red Theme)
export const WorkflowUploadIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="8" width="60" height="64" rx="10" fill="#FFF1F2" className="dark:fill-[#2B1720]" stroke="#FF665A" strokeWidth="2" />
    <rect x="18" y="16" width="44" height="32" rx="6" fill="#FEE2E2" className="dark:fill-[#3B1D2A]" />
    <circle cx="40" cy="32" r="10" fill="#FF4757" />
    <circle cx="40" cy="32" r="5" fill="#FFFFFF" />
    {/* Upload Action Pill */}
    <g transform="translate(40, 58)">
      <circle cx="0" cy="0" r="11" fill="#FF665A" />
      <path d="M0 5 L0 -4 M-3 -1 L0 -4 L3 -1" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

// 6. Workflow Step 2: ResNet18 Recognition (Royal Blue Theme)
export const WorkflowRecognitionIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="64" height="64" rx="10" fill="#EFF6FF" className="dark:fill-[#122248]" stroke="#3867FF" strokeWidth="2" strokeDasharray="4 3" />
    {/* STOP Sign */}
    <polygon points="34,20 46,20 55,29 55,41 46,50 34,50 25,41 25,29" fill="#FF4757" stroke="#FFFFFF" strokeWidth="2.5" />
    <text x="40" y="38" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">STOP</text>
    {/* Detection Accuracy Tag */}
    <rect x="14" y="56" width="52" height="15" rx="4" fill="#3867FF" />
    <text x="40" y="67" fill="#FFFFFF" fontSize="8.5" fontWeight="900" textAnchor="middle">87.58% ACC</text>
  </svg>
);

// 7. Workflow Step 3: Statutory AI Explanation (Warm Saffron Theme)
export const WorkflowExplanationIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="8" width="60" height="64" rx="10" fill="#FFFBEB" className="dark:fill-[#2E2413]" stroke="#FF9F43" strokeWidth="2" />
    <rect x="18" y="16" width="28" height="7" rx="3" fill="#FF9F43" />
    <line x1="18" y1="30" x2="62" y2="30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="39" x2="56" y2="39" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="48" x2="50" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    {/* Official Seal / Check */}
    <g transform="translate(54, 56)">
      <circle cx="0" cy="0" r="10" fill="#10B981" />
      <path d="M-3 0 L-1 2 L4 -3" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

// 8. Sign Connected to Explanation Graphic (Vibrant Synapse)
export const SignToExplanationIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-auto max-h-[140px]' }) => (
  <svg viewBox="0 0 540 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="synapseBeam" x1="140" y1="70" x2="210" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3867FF" />
        <stop offset="0.5" stopColor="#7655F7" />
        <stop offset="1" stopColor="#FF9F43" />
      </linearGradient>
    </defs>
    {/* Sign Container (Left) */}
    <rect x="10" y="12" width="135" height="116" rx="10" fill="#FFFFFF" className="dark:fill-[#141E3E]" stroke="#3867FF" strokeWidth="2" />
    <polygon points="65,28 85,28 98,41 98,61 85,74 65,74 52,61 52,41" fill="#FF4757" stroke="#FFFFFF" strokeWidth="2.5" />
    <text x="75" y="55" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">STOP</text>
    <rect x="22" y="86" width="110" height="20" rx="4" fill="#3867FF" />
    <text x="77" y="100" fill="#FFFFFF" fontSize="9.5" fontWeight="800" textAnchor="middle">ResNet18: 99.2%</text>

    {/* Connecting Synapse Data Beam */}
    <path d="M145 70 L205 70" stroke="url(#synapseBeam)" strokeWidth="3.5" strokeDasharray="5 4" />
    <circle cx="175" cy="70" r="16" fill="#7655F7" />
    <path d="M170 66 L175 71 L180 66 M175 66 L175 75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Statutory Explanation Card (Right) */}
    <rect x="210" y="12" width="320" height="116" rx="10" fill="#FFFFFF" className="dark:fill-[#141E3E]" stroke="#7655F7" strokeWidth="2" />
    <rect x="225" y="24" width="125" height="18" rx="4" fill="#7655F7" />
    <text x="287" y="36" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">IRC:67-2022 MANDATE</text>
    <text x="225" y="60" className="fill-slate-800 dark:fill-slate-100" fontSize="10.5" fontWeight="700">
      Driver Action: Full standstill behind stop line.
    </text>
    <text x="225" y="78" fill="#FF9F43" fontSize="9.5" fontWeight="800">
      Motor Vehicles Act Sec 119/184 • Fine ₹1,000–₹5,000
    </text>
    <path d="M225 98 L233 106 L247 92" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
    <text x="254" y="102" fill="#10B981" fontSize="9.5" fontWeight="800">Verified Statutory Precaution Grounded</text>
  </svg>
);

// 9. Camera Viewfinder HUD Overlay (High-Tech Computer Vision Reticle)
export const ViewfinderHudOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
    {/* Top Bar with Status & Corner Reticles */}
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 border-t-3 border-l-3 border-[#3867FF] rounded-tl-lg"></div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[10px] text-white font-mono font-bold shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>CV: 224×224 • RESNET18</span>
      </div>
      <div className="w-8 h-8 border-t-3 border-r-3 border-[#3867FF] rounded-tr-lg"></div>
    </div>

    {/* Center Crosshair Aiming Grid */}
    <div className="relative mx-auto w-36 h-36 sm:w-48 sm:h-48 border border-dashed border-[#3867FF]/40 rounded-2xl flex items-center justify-center">
      <div className="w-6 h-0.5 bg-[#3867FF]/70"></div>
      <div className="h-6 w-0.5 bg-[#3867FF]/70 absolute"></div>
      <div className="w-16 h-16 rounded-full border border-[#FF9F43]/40 absolute"></div>
    </div>

    {/* Bottom Bar with Corner Reticles */}
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 border-b-3 border-l-3 border-[#3867FF] rounded-bl-lg"></div>
      <div className="text-[10px] text-slate-400 font-mono tracking-wider">
        IRC:67-2022 ALIGNMENT
      </div>
      <div className="w-8 h-8 border-b-3 border-r-3 border-[#3867FF] rounded-br-lg"></div>
    </div>
  </div>
);

// 10. Empty Upload State
export const EmptyUploadIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="64" height="64" rx="12" fill="#EAF2FF" className="dark:fill-[#162145]" stroke="#3867FF" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="40" cy="40" r="18" fill="#FFFFFF" className="dark:fill-[#0F172A]" stroke="#3867FF" strokeWidth="2" />
    <circle cx="40" cy="40" r="9" stroke="#FF9F43" strokeWidth="2.5" strokeDasharray="3 2" />
    <path d="M40 26 L40 33 M40 47 L40 54 M26 40 L33 40 M47 40 L54 40" stroke="#3867FF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 11. Camera Permission Graphic
export const CameraPermissionIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="14" y="22" width="52" height="40" rx="8" fill="#EAF2FF" className="dark:fill-[#162145]" stroke="#3867FF" strokeWidth="2" />
    <path d="M30 22 L35 15 L45 15 L50 22 Z" fill="#CBD5E1" className="dark:fill-[#1E293B]" stroke="#3867FF" strokeWidth="2" />
    <circle cx="40" cy="42" r="13" fill="#FFFFFF" className="dark:fill-[#0F172A]" stroke="#3867FF" strokeWidth="2" />
    <circle cx="40" cy="42" r="6" fill="#3867FF" />
  </svg>
);

// 12. Empty Explanation Graphic
export const EmptyExplanationIllustration: React.FC<IllustrationProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="12" y="10" width="56" height="60" rx="10" fill="#FAFAF7" className="dark:fill-[#141E3E]" stroke="#7655F7" strokeWidth="2" />
    <circle cx="40" cy="30" r="12" fill="#EAF2FF" className="dark:fill-[#1E293B]" stroke="#3867FF" strokeWidth="2" strokeDasharray="2 2" />
    <path d="M40 24 L40 32 M40 36 L40 37" stroke="#3867FF" strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="48" x2="58" y2="48" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="56" x2="54" y2="56" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 13. No Detection / Retry Graphic
export const NoDetectionIllustration: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="32" r="26" className="fill-slate-100 dark:fill-slate-800" stroke="#CBD5E1" strokeWidth="2" />
    <path d="M24 24 L40 40 M40 24 L24 40" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 14. Error State Graphic
export const ErrorIllustration: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="32,8 56,20 56,44 32,56 8,44 8,20" fill="#FEE2E2" stroke="#FF4757" strokeWidth="2.5" className="dark:fill-red-950/40" />
    <line x1="32" y1="22" x2="32" y2="36" stroke="#FF4757" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="43" r="2.5" fill="#FF4757" />
  </svg>
);

