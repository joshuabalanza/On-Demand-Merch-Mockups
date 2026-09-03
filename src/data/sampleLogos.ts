// Preset vector sample logos encoded for instant preview
export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

const svgToDataUrl = (svgString: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: "nordic-peak",
    name: "Summit Outfitters",
    category: "Outdoors / Heritage",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="200" r="180" fill="none" stroke="#18181b" stroke-width="8" stroke-dasharray="4 8"/>
        <polygon points="200,60 330,300 70,300" fill="none" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
        <polygon points="200,120 280,270 120,270" fill="#18181b" opacity="0.15"/>
        <line x1="200" y1="60" x2="200" y2="300" stroke="#18181b" stroke-width="8"/>
        <path d="M140,240 Q200,200 260,240" fill="none" stroke="#18181b" stroke-width="8"/>
        <text x="200" y="345" font-family="system-ui, sans-serif" font-size="22" font-weight="900" letter-spacing="8" text-anchor="middle" fill="#18181b">SUMMIT</text>
        <text x="200" y="370" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="4" text-anchor="middle" fill="#52525b">EXPEDITION &amp; CO.</text>
      </svg>
    `),
  },
  {
    id: "roastery-co",
    name: "Aroma Artisanal Coffee",
    category: "Cafe / Food & Beverage",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect x="25" y="25" width="350" height="350" rx="40" fill="none" stroke="#27272a" stroke-width="10"/>
        <path d="M150,140 C150,80 250,80 250,140 C250,210 150,220 150,270 L250,270" fill="none" stroke="#d97706" stroke-width="14" stroke-linecap="round"/>
        <circle cx="200" cy="200" r="15" fill="#d97706"/>
        <text x="200" y="315" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="800" letter-spacing="3" text-anchor="middle" fill="#27272a">AROMA</text>
        <text x="200" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="6" text-anchor="middle" fill="#71717a">ROASTERY EST. 1994</text>
      </svg>
    `),
  },
  {
    id: "cyber-pulse",
    name: "HyperWave Labs",
    category: "Streetwear / Tech",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
        </defs>
        <circle cx="200" cy="180" r="110" fill="none" stroke="url(#cyberGrad)" stroke-width="16"/>
        <polygon points="170,120 270,180 170,240" fill="url(#cyberGrad)"/>
        <line x1="80" y1="280" x2="320" y2="280" stroke="#0f172a" stroke-width="6"/>
        <text x="200" y="325" font-family="'JetBrains Mono', monospace" font-size="26" font-weight="900" letter-spacing="6" text-anchor="middle" fill="#0f172a">HYPERWAVE</text>
        <text x="200" y="355" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" letter-spacing="4" text-anchor="middle" fill="#64748b">PROTOCOL 0.9</text>
      </svg>
    `),
  },
  {
    id: "botanical-wild",
    name: "Wild Fern Botanical",
    category: "Eco / Lifestyle",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <path d="M200,60 Q260,160 200,260 Q140,160 200,60 Z" fill="#059669" opacity="0.85"/>
        <path d="M200,100 C150,140 160,200 200,240 C240,200 250,140 200,100 Z" fill="none" stroke="#064e3b" stroke-width="6"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="#059669" stroke-width="4" stroke-dasharray="12 6"/>
        <text x="200" y="320" font-family="serif" font-size="26" font-style="italic" font-weight="700" text-anchor="middle" fill="#064e3b">Wild &amp; Free</text>
        <text x="200" y="350" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="4" text-anchor="middle" fill="#047857">ORGANIC LIVING</text>
      </svg>
    `),
  },
  {
    id: "minimal-geometric",
    name: "Nexus Studio",
    category: "Minimalist / Brand",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect x="120" y="90" width="160" height="160" transform="rotate(45 200 170)" fill="#18181b"/>
        <rect x="140" y="110" width="120" height="120" transform="rotate(45 200 170)" fill="#fafafa"/>
        <circle cx="200" cy="170" r="28" fill="#e11d48"/>
        <text x="200" y="320" font-family="'Syne', sans-serif" font-size="28" font-weight="800" letter-spacing="6" text-anchor="middle" fill="#18181b">NEXUS</text>
        <text x="200" y="348" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" letter-spacing="5" text-anchor="middle" fill="#71717a">DESIGN ARCHIVE</text>
      </svg>
    `),
  },
];
