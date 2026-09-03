import React, { forwardRef } from 'react';
import { Product, PrintPlacement, LogoConfig } from '../types';

interface ProductMockupCanvasProps {
  product: Product;
  colorHex: string;
  placement: PrintPlacement;
  logo: LogoConfig;
  showPrintGuides?: boolean;
  isDarkStudio?: boolean;
  className?: string;
  onSelectPlacement?: (placement: PrintPlacement) => void;
}

export const ProductMockupCanvas = forwardRef<SVGSVGElement, ProductMockupCanvasProps>(
  (
    {
      product,
      colorHex,
      placement,
      logo,
      showPrintGuides = false,
      isDarkStudio = false,
      className = '',
    },
    ref
  ) => {
    // Determine if garment color is dark for optimal lighting contrasts
    const isDarkGarment = () => {
      const hex = colorHex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    };

    const isDark = isDarkGarment();

    // Unique filter IDs for SVG scopes
    const textureFilterId = `fabric-noise-${product.id}`;
    const shadowFilterId = `shadow-${product.id}`;
    const embroideryFilterId = `embroidery-${product.id}`;

    // Placement coordinates in SVG viewBox (0 0 1000 1000)
    const boxX = (placement.box.left / 100) * 1000;
    const boxY = (placement.box.top / 100) * 1000;
    const boxW = (placement.box.width / 100) * 1000;
    const boxH = (placement.box.height / 100) * 1000;

    // Logo transformation inside the placement box
    const centerX = boxX + boxW / 2 + (logo.offsetX / 100) * (boxW / 2);
    const centerY = boxY + boxH / 2 + (logo.offsetY / 100) * (boxH / 2);

    const logoBaseSize = Math.min(boxW, boxH) * 0.85;
    const logoDrawW = logoBaseSize * logo.scale;
    const logoDrawH = logoBaseSize * logo.scale;

    // CSS mix-blend-mode for realistic fabric integration
    let blendModeStyle: React.CSSProperties['mixBlendMode'] = 'normal';
    if (logo.blendMode === 'multiply') {
      blendModeStyle = isDark ? 'screen' : 'multiply';
    } else if (logo.blendMode === 'screen') {
      blendModeStyle = 'screen';
    } else if (logo.blendMode === 'overlay') {
      blendModeStyle = 'overlay';
    }

    return (
      <svg
        ref={ref}
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full select-none ${className}`}
        style={{
          background: isDarkStudio ? '#09090b' : '#f4f4f5',
          transition: 'background 0.3s ease',
        }}
      >
        <defs>
          {/* Ambient dropshadow */}
          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="25" stdDeviation="35" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Fabric weave grain */}
          <filter id={textureFilterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0 0 0 0.12 0"
            />
            <feBlend mode="multiply" in="SourceGraphic" result="blend" />
          </filter>

          {/* Realistic Embroidery Thread Bump Effect */}
          <filter id={embroideryFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="-1" dy="-1" stdDeviation="1" floodColor="#ffffff" floodOpacity="0.3" />
          </filter>

          {/* Lighting Gradients */}
          <linearGradient id={`fold-highlight-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isDark ? '0.08' : '0.2'} />
            <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
            <stop offset="70%" stopColor="#000000" stopOpacity={isDark ? '0.25' : '0.1'} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={isDark ? '0.04' : '0.12'} />
          </linearGradient>

          <linearGradient id={`rim-light-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isDark ? '0.15' : '0.35'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. PRODUCT BASE SILHOUETTES */}

        {/* T-SHIRT */}
        {product.renderType === 'tshirt' && (
          <g id="tshirt-model" filter={`url(#${shadowFilterId})`}>
            {/* Main Tee Body & Sleeves */}
            <path
              d="M340,120 Q500,180 660,120 L860,250 L780,380 L690,320 L690,880 Q500,910 310,880 L310,320 L220,380 L140,250 Z"
              fill={colorHex}
            />

            {/* Subtle Fabric Folds and Creases */}
            <path
              d="M310,320 Q360,420 370,620 Q350,750 310,880"
              fill="none"
              stroke="#000000"
              strokeWidth="12"
              opacity={isDark ? '0.22' : '0.08'}
            />
            <path
              d="M690,320 Q640,420 630,620 Q650,750 690,880"
              fill="none"
              stroke="#000000"
              strokeWidth="12"
              opacity={isDark ? '0.22' : '0.08'}
            />
            {/* Center chest soft highlight */}
            <ellipse cx="500" cy="450" rx="180" ry="240" fill={`url(#fold-highlight-${product.id})`} />

            {/* Realistic Ribbed Crewneck Collar */}
            <path
              d="M375,130 Q500,240 625,130 Q500,165 375,130 Z"
              fill={colorHex}
              stroke={isDark ? '#3f3f46' : '#cbd5e1'}
              strokeWidth="3"
            />
            <path
              d="M390,135 Q500,225 610,135"
              fill="none"
              stroke={isDark ? '#000000' : '#94a3b8'}
              strokeWidth="5"
              opacity="0.4"
            />
            {/* Collar Inner Back */}
            <path
              d="M400,132 Q500,105 600,132 Q500,122 400,132 Z"
              fill="#000000"
              opacity={isDark ? '0.6' : '0.25'}
            />
            {/* Hem bottom stitch */}
            <path
              d="M315,865 Q500,895 685,865"
              fill="none"
              stroke={isDark ? '#ffffff' : '#000000'}
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.25"
            />
          </g>
        )}

        {/* HOODIE */}
        {product.renderType === 'hoodie' && (
          <g id="hoodie-model" filter={`url(#${shadowFilterId})`}>
            {/* Hoodie Body & Arms */}
            <path
              d="M330,140 Q500,170 670,140 L880,270 L800,430 L710,360 L705,870 Q500,900 295,870 L290,360 L200,430 L120,270 Z"
              fill={colorHex}
            />

            {/* Kangaroo Pocket */}
            <path
              d="M360,630 L640,630 L670,780 Q500,810 330,780 Z"
              fill={colorHex}
              stroke={isDark ? '#000000' : '#a1a1aa'}
              strokeWidth="4"
              opacity="0.8"
            />
            {/* Kangaroo pocket side openings */}
            <path d="M360,630 Q390,700 330,780" fill="none" stroke="#000000" strokeWidth="8" opacity="0.35" />
            <path d="M640,630 Q610,700 670,780" fill="none" stroke="#000000" strokeWidth="8" opacity="0.35" />

            {/* Voluminous Double Hood */}
            <path
              d="M330,140 C340,50 430,30 500,30 C570,30 660,50 670,140 C610,210 390,210 330,140 Z"
              fill={colorHex}
              stroke={isDark ? '#3f3f46' : '#d4d4d8'}
              strokeWidth="4"
            />
            {/* Inner Hood Cavity Shadow */}
            <ellipse cx="500" cy="140" rx="90" ry="40" fill="#000000" opacity={isDark ? '0.7' : '0.35'} />

            {/* Drawstrings */}
            <path d="M470,165 Q465,240 455,320" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <rect x="451" y="315" width="8" height="18" rx="2" fill="#d4d4d8" />
            <path d="M530,165 Q535,250 545,335" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <rect x="541" y="330" width="8" height="18" rx="2" fill="#d4d4d8" />

            {/* Torso Depth Shadow */}
            <ellipse cx="500" cy="450" rx="190" ry="200" fill={`url(#fold-highlight-${product.id})`} />
          </g>
        )}

        {/* DAD HAT / BASEBALL CAP */}
        {product.renderType === 'cap' && (
          <g id="cap-model" filter={`url(#${shadowFilterId})`}>
            {/* Crown Panels (Front Arc) */}
            <path
              d="M260,520 C240,280 400,200 500,200 C600,200 760,280 740,520 Z"
              fill={colorHex}
            />
            {/* 6-Panel Seam Lines */}
            <path d="M500,205 Q500,360 500,520" fill="none" stroke="#000000" strokeWidth="4" opacity={isDark ? '0.4' : '0.15'} />
            <path d="M500,205 Q400,320 310,500" fill="none" stroke="#000000" strokeWidth="4" opacity={isDark ? '0.4' : '0.15'} />
            <path d="M500,205 Q600,320 690,500" fill="none" stroke="#000000" strokeWidth="4" opacity={isDark ? '0.4' : '0.15'} />

            {/* Top Button */}
            <circle cx="500" cy="205" r="16" fill={colorHex} stroke="#000000" strokeWidth="3" opacity="0.8" />

            {/* Curved Visor / Brim */}
            <path
              d="M200,520 C200,520 280,680 500,680 C720,680 800,520 800,520 C750,560 640,610 500,610 C360,610 250,560 200,520 Z"
              fill={colorHex}
            />
            {/* Visor Underside Shadow */}
            <path
              d="M200,520 C250,560 360,610 500,610 C640,610 750,560 800,520 C730,500 620,490 500,490 C380,490 270,500 200,520 Z"
              fill="#000000"
              opacity={isDark ? '0.6' : '0.3'}
            />
            {/* Visor Topstitch Rows */}
            <path d="M250,560 C330,640 500,650 750,560" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" opacity="0.25" />
            <path d="M270,580 C350,655 500,665 730,580" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" opacity="0.25" />
          </g>
        )}

        {/* CERAMIC MUG */}
        {product.renderType === 'mug' && (
          <g id="mug-model" filter={`url(#${shadowFilterId})`}>
            {/* Big Curved Handle */}
            <path
              d="M650,330 C790,330 830,450 830,530 C830,620 770,710 650,710"
              fill="none"
              stroke={colorHex}
              strokeWidth="60"
              strokeLinecap="round"
            />
            <path
              d="M650,330 C790,330 830,450 830,530 C830,620 770,710 650,710"
              fill="none"
              stroke="#000000"
              strokeWidth="20"
              opacity="0.15"
              strokeLinecap="round"
            />

            {/* Cylinder Mug Body */}
            <rect x="250" y="270" width="450" height="520" rx="30" fill={colorHex} />

            {/* Mug Top Rim Oval & Coffee Cavity */}
            <ellipse cx="475" cy="270" rx="225" ry="50" fill={colorHex} stroke={isDark ? '#3f3f46' : '#e4e4e7'} strokeWidth="4" />
            <ellipse cx="475" cy="270" rx="200" ry="38" fill="#1c1917" />
            {/* Dark Coffee Fill & Reflection */}
            <ellipse cx="475" cy="275" rx="190" ry="30" fill="#29180d" />
            <ellipse cx="430" cy="270" rx="40" ry="8" fill="#ffffff" opacity="0.25" />

            {/* Glossy Ceramic Highlight Stripe */}
            <rect x="290" y="300" width="40" height="460" rx="20" fill="#ffffff" opacity={isDark ? '0.12' : '0.4'} />
            <rect x="630" y="300" width="30" height="460" rx="15" fill="#000000" opacity="0.15" />
          </g>
        )}

        {/* CANVAS TOTE BAG */}
        {product.renderType === 'tote' && (
          <g id="tote-model" filter={`url(#${shadowFilterId})`}>
            {/* Two Long Shoulder Straps */}
            <path
              d="M370,400 C370,120 440,80 500,80 C560,80 630,120 630,400"
              fill="none"
              stroke={colorHex}
              strokeWidth="42"
              strokeLinecap="square"
            />
            {/* Strap Stitch Lines */}
            <path
              d="M370,400 C370,120 440,80 500,80 C560,80 630,120 630,400"
              fill="none"
              stroke={isDark ? '#ffffff' : '#000000'}
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.3"
            />

            {/* Tote Main Body */}
            <path
              d="M240,360 L760,360 L720,880 Q500,900 280,880 Z"
              fill={colorHex}
            />
            {/* Reinforced Top Hem Band */}
            <rect x="235" y="360" width="530" height="45" fill={colorHex} stroke={isDark ? '#ffffff' : '#000000'} strokeWidth="2" opacity="0.2" />

            {/* Bottom Gusset Corner Folds */}
            <path d="M280,880 L350,830 L650,830 L720,880" fill="none" stroke="#000000" strokeWidth="4" opacity="0.2" />

            {/* Natural Canvas Weave Texture Overlay */}
            <rect
              x="240"
              y="360"
              width="520"
              height="520"
              fill={`url(#fold-highlight-${product.id})`}
            />
          </g>
        )}

        {/* FRAMED ART PRINT */}
        {product.renderType === 'poster' && (
          <g id="poster-model" filter={`url(#${shadowFilterId})`}>
            {/* Solid Wood Outer Frame */}
            <rect x="200" y="120" width="600" height="760" rx="12" fill="#27272a" />
            <rect x="200" y="120" width="600" height="760" rx="12" fill="none" stroke="#52525b" strokeWidth="4" />

            {/* Off-White Museum Matting */}
            <rect x="235" y="155" width="530" height="690" fill="#fafafa" />

            {/* Paper Print Inset Base */}
            <rect x="280" y="200" width="440" height="600" fill={colorHex} stroke="#e4e4e7" strokeWidth="2" />

            {/* Glass Glare Highlight */}
            <polygon points="200,120 400,120 700,880 500,880" fill="#ffffff" opacity="0.05" />
          </g>
        )}

        {/* 2. PRINT ZONE GUIDE BOUNDING BOX (Shows when user toggles or inspects) */}
        {showPrintGuides && (
          <g id="print-guide-box">
            <rect
              x={boxX}
              y={boxY}
              width={boxW}
              height={boxH}
              fill="rgba(59, 130, 246, 0.05)"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              rx="6"
            />
            {/* Corner Crosshairs */}
            <path
              d={`M${boxX - 10},${boxY} L${boxX + 20},${boxY} M${boxX},${boxY - 10} L${boxX},${boxY + 20}
                  M${boxX + boxW - 20},${boxY} L${boxX + boxW + 10},${boxY} M${boxX + boxW},${boxY - 10} L${boxX + boxW},${boxY + 20}
                  M${boxX - 10},${boxY + boxH} L${boxX + 20},${boxY + boxH} M${boxX},${boxY + boxH - 20} L${boxX},${boxY + boxH + 10}
                  M${boxX + boxW - 20},${boxY + boxH} L${boxX + boxW + 10},${boxY + boxH} M${boxX + boxW},${boxY + boxH - 20} L${boxX + boxW},${boxY + boxH + 10}`}
              stroke="#3b82f6"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Dimension Tag Badge */}
            <rect
              x={boxX}
              y={Math.max(10, boxY - 32)}
              width="230"
              height="28"
              rx="6"
              fill="#1e40af"
            />
            <text
              x={boxX + 12}
              y={Math.max(30, boxY - 13)}
              fill="#ffffff"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="14"
              fontWeight="bold"
            >
              {placement.dimensionsInches.width}&quot; × {placement.dimensionsInches.height}&quot; (300 DPI)
            </text>
          </g>
        )}

        {/* 3. USER LOGO PLACEMENT */}
        {logo.dataUrl && (
          <g
            id="placed-logo-group"
            transform={`translate(${centerX}, ${centerY}) rotate(${logo.rotation})`}
            filter={logo.embroideryStitchEffect ? `url(#${embroideryFilterId})` : undefined}
            style={{ mixBlendMode: blendModeStyle }}
          >
            <image
              href={logo.dataUrl}
              x={-logoDrawW / 2}
              y={-logoDrawH / 2}
              width={logoDrawW}
              height={logoDrawH}
              preserveAspectRatio="xMidYMid meet"
              opacity={logo.opacity ?? 1}
            />
          </g>
        )}
      </svg>
    );
  }
);

ProductMockupCanvas.displayName = 'ProductMockupCanvas';
