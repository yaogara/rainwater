const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_IMAGES_DIR = path.join(PUBLIC_DIR, 'images', 'blog');

if (!fs.existsSync(BLOG_IMAGES_DIR)) {
  fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true });
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 12 High-Utility Image Specifications
const IMAGES = [
  {
    filename: 'og-default.webp',
    isRoot: true,
    category: 'VERIFIED DIRECTORY & KNOWLEDGE BASE',
    title: 'Rainwater Directory',
    subtitle: 'Find Certified Installers, Local Rainfall Normals & 50-State Water Laws',
    tagline: 'ASPE / ARCSA Compliance • Zero Fabrication Policy • Primary Statutes',
    badge: 'NATIONAL DIRECTORY',
    accentColor: '#14b8a6', // teal
    secondaryColor: '#0ea5e9', // cyan
    iconType: 'directory',
  },
  {
    filename: 'is-it-illegal-to-collect-rainwater-state-by-state.webp',
    category: 'STATUTORY LEGAL GUIDE (2026)',
    title: 'Is It Illegal to Collect Rainwater?',
    subtitle: 'Complete 50-State Statutory Reference Matrix & Western Water Rights',
    tagline: 'Colorado 110-Gal Cap • Texas Tax Exemption • Utah 2,500-Gal Registration',
    badge: '50-STATE MATRIX',
    accentColor: '#38bdf8', // sky blue
    secondaryColor: '#6366f1', // indigo
    iconType: 'legal',
  },
  {
    filename: 'how-to-choose-an-installer.webp',
    category: 'BUYER\'S GUIDE & VETTING PROTOCOL',
    title: 'How to Choose a Rainwater Installer',
    subtitle: '10-Point Contractor Vetting Checklist & Turnkey System Costs',
    tagline: 'ARCSA AP Credentials • Backflow Certification • Sizing & Pricing',
    badge: 'CONTRACTOR GUIDE',
    accentColor: '#10b981', // emerald
    secondaryColor: '#14b8a6', // teal
    iconType: 'installer',
  },
  {
    filename: 'can-you-drink-rainwater-cdc-science.webp',
    category: 'WATER QUALITY & PUBLIC HEALTH',
    title: 'Can You Drink Rainwater?',
    subtitle: 'CDC Health Guidelines, Microbiological Risks & Potable Treatment Trains',
    tagline: 'NSF 55 Class A UV • 5-Micron Filtration • Activated Carbon Purification',
    badge: 'HEALTH & SCIENCE',
    accentColor: '#06b6d4', // cyan
    secondaryColor: '#3b82f6', // blue
    iconType: 'filtration',
  },
  {
    filename: 'choose-right-downspout-diverter-rain-barrels.webp',
    category: 'COMPONENTS & HARDWARE',
    title: 'Choosing the Right Downspout Diverter',
    subtitle: 'Mechanics, First-Flush Bypass & Overflow Management for Rain Barrels',
    tagline: 'Debris Screening • Gutter Size Compatibility • Automatic Shutoff Valves',
    badge: 'HARDWARE GUIDE',
    accentColor: '#f59e0b', // amber
    secondaryColor: '#ea580c', // orange
    iconType: 'diverter',
  },
  {
    filename: 'cistern-systems-101-underground-water-tanks.webp',
    category: 'ENGINEERING & STORAGE',
    title: 'Underground Water Cisterns 101',
    subtitle: 'Excavation Engineering, Buoyancy Anchoring & Submersible Pump Layouts',
    tagline: 'Poly vs Concrete vs Fiberglass • Freeze-Proof Depths • Access Risers',
    badge: 'STORAGE ENGINEERING',
    accentColor: '#8b5cf6', // purple
    secondaryColor: '#6366f1', // indigo
    iconType: 'cistern',
  },
  {
    filename: 'complete-rainwater-collection-system-guide.webp',
    category: 'SYSTEM DESIGN ARCHITECTURE',
    title: 'Complete Rainwater Collection Guide',
    subtitle: 'Roof-to-Tap Architectural Blueprint: Catchment, Pre-Filtration & Pumping',
    tagline: 'Runoff Sizing Formulas • Multi-Stage Treatment • Indoor Fixture Plumbing',
    badge: 'CORE PILLAR',
    accentColor: '#0284c7', // light blue
    secondaryColor: '#0d9488', // teal
    iconType: 'system',
  },
  {
    filename: 'diy-rain-barrel-systems-garden.webp',
    category: 'DIY & HOMEOWNER TUTORIAL',
    title: 'DIY Rain Barrel Systems for Gardens',
    subtitle: 'Step-by-Step Assembly, Cinder Block Elevation & Gravity Drip Lines',
    tagline: 'Brass Spigot Fitting • Overflow Routing • Mosquito Vector Screening',
    badge: 'HOMEOWNER GUIDE',
    accentColor: '#84cc16', // lime
    secondaryColor: '#10b981', // emerald
    iconType: 'diy',
  },
  {
    filename: 'off-grid-water-storage-ideas.webp',
    category: 'RESILIENCE & HOMESTEADING',
    title: 'Off-Grid Water Storage Systems',
    subtitle: '8 Reliable Setups for Remote Homesteads, Cabin Water & Fire Defense',
    tagline: 'Solar Booster Pumps • Gravity-Fed Storage • Freeze-Proofing Runbooks',
    badge: 'HOMESTEAD WATER',
    accentColor: '#d97706', // amber
    secondaryColor: '#b45309', // deep amber
    iconType: 'offgrid',
  },
  {
    filename: 'rainwater-vs-tap-water.webp',
    category: 'WATER QUALITY ANALYSIS',
    title: 'Rainwater vs. Tap Water',
    subtitle: 'Chemical Composition, Mineral Hardness & Environmental Impact',
    tagline: 'TDS Testing • Free Chlorine Neutrality • Plant & Garden Bio-Response',
    badge: 'COMPARISON',
    accentColor: '#0ea5e9', // sky blue
    secondaryColor: '#22c55e', // green
    iconType: 'comparison',
  },
  {
    filename: 'top-10-water-storage-tanks-100-to-5000-gallons.webp',
    category: 'EQUIPMENT BENCHMARKS',
    title: 'Top 10 Rainwater Storage Tanks',
    subtitle: '100 to 5,000 Gallon Capacity, Material Durability & Price Comparison',
    tagline: 'UV-Stabilized Poly • Corrugated Coated Steel • Slimline Space Savers',
    badge: 'TANK BENCHMARKS',
    accentColor: '#6366f1', // indigo
    secondaryColor: '#0284c7', // blue
    iconType: 'tanks',
  },
  {
    filename: 'ultimate-guide-whole-house-water-filtration.webp',
    category: 'TREATMENT & SANITATION',
    title: 'Whole-House Rainwater Filtration',
    subtitle: 'Multi-Barrier Engineering: Sediment, Carbon Block & NSF 55 Class A UV',
    tagline: '20-Micron Prefilter • Lead & Heavy Metal Reduction • Pathogen Disinfection',
    badge: 'PURIFICATION GUIDE',
    accentColor: '#0d9488', // teal
    secondaryColor: '#3b82f6', // blue
    iconType: 'wholehouse',
  },
];

function getDiagramSvg(type, accent, secondary) {
  switch (type) {
    case 'legal':
      return `
        <!-- Scale of Justice / Legal Matrix -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <path d="M 60,60 L 320,60" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
          <line x1="190" y1="40" x2="190" y2="300" stroke="${secondary}" stroke-width="4" stroke-linecap="round" />
          <circle cx="190" cy="40" r="14" fill="${accent}" />
          <!-- Left Pan -->
          <line x1="80" y1="60" x2="50" y2="150" stroke="#94a3b8" stroke-width="2" />
          <line x1="80" y1="60" x2="110" y2="150" stroke="#94a3b8" stroke-width="2" />
          <path d="M 40,150 Q 80,180 120,150 Z" fill="${accent}" fill-opacity="0.7" />
          <!-- Right Pan -->
          <line x1="300" y1="60" x2="270" y2="130" stroke="#94a3b8" stroke-width="2" />
          <line x1="300" y1="60" x2="330" y2="130" stroke="#94a3b8" stroke-width="2" />
          <path d="M 260,130 Q 300,160 340,130 Z" fill="${secondary}" fill-opacity="0.7" />
          <!-- Base -->
          <path d="M 140,300 L 240,300" stroke="${secondary}" stroke-width="8" stroke-linecap="round" />
          <!-- Badges -->
          <rect x="40" y="220" width="130" height="40" rx="8" fill="#1e293b" stroke="${accent}" stroke-width="1.5" />
          <text x="105" y="246" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">50 STATES LEGAL</text>
          <rect x="210" y="220" width="130" height="40" rx="8" fill="#1e293b" stroke="${secondary}" stroke-width="1.5" />
          <text x="275" y="246" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">TAX REBATES</text>
        </g>
      `;
    case 'installer':
      return `
        <!-- Contractor / ARCSA AP Vetting Badge -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <circle cx="190" cy="120" r="64" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="3" />
          <path d="M 160,120 L 180,140 L 225,95" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
          <text x="190" y="220" fill="#f8fafc" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle">ARCSA AP ACCREDITED</text>
          <text x="190" y="245" fill="#94a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">ASSE 1044 / UPC CH. 16 STANDARDS</text>
          <!-- Checklist Items -->
          <rect x="40" y="270" width="300" height="48" rx="10" fill="#1e293b" />
          <circle cx="65" cy="294" r="8" fill="${accent}" />
          <text x="85" y="299" fill="#f8fafc" font-size="13" font-weight="600" font-family="sans-serif">10-Point Technical Verification</text>
        </g>
      `;
    case 'filtration':
    case 'wholehouse':
      return `
        <!-- Multi-Stage Filtration Train -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Filter 1 -->
          <rect x="50" y="70" width="60" height="180" rx="8" fill="#1e293b" stroke="${accent}" stroke-width="2.5" />
          <text x="80" y="165" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" transform="rotate(-90 80 165)">20-MICRON</text>
          <!-- Filter 2 -->
          <rect x="140" y="70" width="60" height="180" rx="8" fill="#1e293b" stroke="${accent}" stroke-width="2.5" />
          <text x="170" y="165" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" transform="rotate(-90 170 165)">5-MICRON</text>
          <!-- UV Chamber -->
          <rect x="230" y="60" width="80" height="200" rx="12" fill="#0f172a" stroke="${secondary}" stroke-width="3" />
          <line x1="270" y1="80" x2="270" y2="240" stroke="#a855f7" stroke-width="10" stroke-linecap="round" opacity="0.85" />
          <text x="270" y="280" fill="#a855f7" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">NSF 55 UV</text>
          <!-- Manifold Pipe -->
          <path d="M 20,100 L 350,100" stroke="#38bdf8" stroke-width="6" fill="none" opacity="0.6" />
          <text x="190" y="325" fill="#38bdf8" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">99.99% PATHOGEN DISINFECTION</text>
        </g>
      `;
    case 'diverter':
      return `
        <!-- Gutter Downspout & Diverter Mechanism -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Downspout Pipe -->
          <rect x="80" y="40" width="50" height="260" fill="#334155" rx="4" />
          <!-- Diverter Box -->
          <rect x="65" y="110" width="80" height="90" rx="10" fill="#1e293b" stroke="${accent}" stroke-width="3" />
          <!-- Bypass Hose -->
          <path d="M 145,155 Q 220,155 240,190" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" />
          <!-- Rain Barrel -->
          <rect x="220" y="180" width="120" height="130" rx="18" fill="#1e293b" stroke="${secondary}" stroke-width="2.5" />
          <text x="280" y="250" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">RAIN BARREL</text>
          <!-- First Flush Tag -->
          <rect x="40" y="270" width="130" height="36" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
          <text x="105" y="293" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">FIRST FLUSH</text>
        </g>
      `;
    case 'cistern':
      return `
        <!-- Underground Cistern Cross-Section -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Ground Surface Line -->
          <line x1="30" y1="90" x2="350" y2="90" stroke="#854d0e" stroke-width="6" stroke-linecap="round" />
          <text x="70" y="75" fill="#a16207" font-size="12" font-weight="bold" font-family="sans-serif">GRADE LEVEL</text>
          <!-- Access Riser -->
          <rect x="160" y="90" width="60" height="50" fill="#1e293b" stroke="${accent}" stroke-width="2" />
          <rect x="150" y="85" width="80" height="12" rx="4" fill="${secondary}" />
          <!-- Buried Tank -->
          <rect x="60" y="140" width="260" height="160" rx="30" fill="#1e293b" stroke="${accent}" stroke-width="3" />
          <!-- Water inside -->
          <path d="M 62,200 Q 190,195 318,200 L 318,270 Q 190,295 62,270 Z" fill="${secondary}" fill-opacity="0.3" />
          <!-- Submersible Pump -->
          <rect x="175" y="230" width="30" height="50" rx="6" fill="${accent}" />
          <text x="190" y="325" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">HEAVY-DUTY STRUCTURAL CISTERN</text>
        </g>
      `;
    case 'system':
      return `
        <!-- Roof-to-Tap Complete System -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Roof Line -->
          <path d="M 40,110 L 150,50 L 260,110" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
          <!-- Gutter -->
          <path d="M 260,110 L 280,110 L 280,180" fill="none" stroke="${secondary}" stroke-width="5" />
          <!-- Storage Tank -->
          <rect x="250" y="180" width="90" height="110" rx="14" fill="#1e293b" stroke="${secondary}" stroke-width="2.5" />
          <!-- Filtration Pump -->
          <rect x="130" y="230" width="80" height="60" rx="8" fill="#1e293b" stroke="${accent}" stroke-width="2" />
          <!-- Arrow Pipe -->
          <path d="M 250,260 L 210,260" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
          <path d="M 130,260 L 70,260 L 70,180" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
          <text x="190" y="325" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">ROOF-TO-TAP HARVESTING FLOW</text>
        </g>
      `;
    case 'diy':
      return `
        <!-- Dual DIY Rain Barrels -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Cinder Block Foundation -->
          <rect x="70" y="250" width="240" height="40" rx="4" fill="#475569" stroke="#64748b" stroke-width="2" />
          <!-- Barrel 1 -->
          <rect x="85" y="110" width="95" height="140" rx="18" fill="#1e293b" stroke="${accent}" stroke-width="3" />
          <!-- Barrel 2 -->
          <rect x="200" y="110" width="95" height="140" rx="18" fill="#1e293b" stroke="${secondary}" stroke-width="3" />
          <!-- Link Pipe -->
          <rect x="175" y="210" width="30" height="12" fill="#38bdf8" />
          <!-- Spigot -->
          <circle cx="95" cy="225" r="7" fill="#eab308" />
          <line x1="95" y1="225" x2="75" y2="225" stroke="#eab308" stroke-width="4" stroke-linecap="round" />
          <text x="190" y="325" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">ELEVATED GRAVITY FEED RIG</text>
        </g>
      `;
    case 'offgrid':
      return `
        <!-- Off-Grid Water Station -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Big Poly Tank -->
          <rect x="50" y="110" width="140" height="160" rx="24" fill="#14532d" stroke="${accent}" stroke-width="3" />
          <text x="120" y="195" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">2,500 GAL</text>
          <!-- Solar Panel Stand -->
          <polygon points="240,110 320,110 300,160 220,160" fill="#1e3a8a" stroke="${secondary}" stroke-width="2" />
          <!-- Solar Pole -->
          <line x1="270" y1="160" x2="270" y2="250" stroke="#64748b" stroke-width="6" />
          <!-- Booster Pump -->
          <rect x="250" y="230" width="60" height="40" rx="6" fill="#1e293b" stroke="${secondary}" stroke-width="2" />
          <text x="190" y="325" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">SOLAR-POWERED WATER SECURITY</text>
        </g>
      `;
    case 'comparison':
      return `
        <!-- Rainwater vs Tap Water Split Graphic -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- Left: Pure Rainwater -->
          <rect x="40" y="80" width="140" height="190" rx="14" fill="#0284c7" fill-opacity="0.2" stroke="${accent}" stroke-width="2.5" />
          <text x="110" y="115" fill="${accent}" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle">RAINWATER</text>
          <text x="110" y="150" fill="#f8fafc" font-size="12" font-family="sans-serif" text-anchor="middle">TDS: 10-25 ppm</text>
          <text x="110" y="180" fill="#f8fafc" font-size="12" font-family="sans-serif" text-anchor="middle">Chlorine: 0 mg/L</text>
          <text x="110" y="210" fill="#f8fafc" font-size="12" font-family="sans-serif" text-anchor="middle">pH: 5.5 - 6.5</text>
          <text x="110" y="240" fill="#4ade80" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">✓ Soil Friendly</text>
          <!-- Right: Municipal Tap -->
          <rect x="200" y="80" width="140" height="190" rx="14" fill="#334155" fill-opacity="0.4" stroke="#64748b" stroke-width="2" />
          <text x="270" y="115" fill="#94a3b8" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle">TAP WATER</text>
          <text x="270" y="150" fill="#cbd5e1" font-size="12" font-family="sans-serif" text-anchor="middle">TDS: 150-400 ppm</text>
          <text x="270" y="180" fill="#cbd5e1" font-size="12" font-family="sans-serif" text-anchor="middle">Chlorine: 1-4 mg/L</text>
          <text x="270" y="210" fill="#cbd5e1" font-size="12" font-family="sans-serif" text-anchor="middle">pH: 7.2 - 8.5</text>
          <text x="270" y="240" fill="#f87171" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">× Mineral Scale</text>
          <text x="190" y="325" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">CHEMICAL &amp; MINERAL BENCHMARK</text>
        </g>
      `;
    case 'tanks':
      return `
        <!-- Tank Capacity Comparison Lineup -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <!-- 100 Gal Slimline -->
          <rect x="40" y="160" width="35" height="110" rx="8" fill="#1e293b" stroke="${accent}" stroke-width="2" />
          <text x="57" y="290" fill="#94a3b8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">100G</text>
          <!-- 500 Gal Poly -->
          <rect x="90" y="130" width="55" height="140" rx="14" fill="#1e293b" stroke="${accent}" stroke-width="2.5" />
          <text x="117" y="290" fill="#94a3b8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">500G</text>
          <!-- 1500 Gal Poly -->
          <rect x="160" y="100" width="75" height="170" rx="20" fill="#1e293b" stroke="${secondary}" stroke-width="2.5" />
          <text x="197" y="290" fill="#94a3b8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">1,500G</text>
          <!-- 5000 Gal Steel -->
          <rect x="250" y="70" width="95" height="200" rx="14" fill="#1e293b" stroke="#f59e0b" stroke-width="3" />
          <line x1="250" y1="120" x2="345" y2="120" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4" />
          <line x1="250" y1="170" x2="345" y2="170" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4" />
          <line x1="250" y1="220" x2="345" y2="220" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4" />
          <text x="297" y="290" fill="#f59e0b" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">5,000G</text>
          <text x="190" y="328" fill="#f8fafc" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">RESIDENTIAL TO RANCH SCALING</text>
        </g>
      `;
    default: // directory / hero
      return `
        <!-- Rainwater Directory Hero Shield / Compass -->
        <g transform="translate(740, 160)">
          <rect x="0" y="0" width="380" height="360" rx="24" fill="#0f172a" fill-opacity="0.85" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
          <circle cx="190" cy="140" r="70" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2.5" />
          <!-- Water Drop in Center -->
          <path d="M 190,95 C 170,135 150,155 150,175 A 40,40 0 0,0 230,175 C 230,155 210,135 190,95 Z" fill="${secondary}" />
          <text x="190" y="250" fill="#f8fafc" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle">VERIFIED DIRECTORY</text>
          <text x="190" y="275" fill="#94a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">168 CONTRACTORS • 126 CITIES</text>
          <rect x="60" y="295" width="260" height="34" rx="8" fill="#1e293b" />
          <text x="190" y="317" fill="${accent}" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">50-STATE REGULATORY DATABASE</text>
        </g>
      `;
  }
}

function buildSvg(item) {
  const { title, subtitle, tagline, category, badge, accentColor, secondaryColor, iconType } = item;
  const safeCategory = escapeXml(category);
  const safeBadge = escapeXml(badge);
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeTagline = escapeXml(tagline);
  const diagram = getDiagramSvg(iconType, accentColor, secondaryColor);

  return `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#09141c" />
        <stop offset="60%" stop-color="#0e2330" />
        <stop offset="100%" stop-color="#081721" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accentColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.35" />
      </pattern>
      <!-- Water Drop Pattern -->
      <pattern id="rain" width="60" height="60" patternUnits="userSpaceOnUse">
        <line x1="10" y1="10" x2="20" y2="40" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.12" stroke-linecap="round" />
        <line x1="40" y1="20" x2="48" y2="45" stroke="${secondaryColor}" stroke-width="1.2" stroke-opacity="0.12" stroke-linecap="round" />
      </pattern>
    </defs>

    <!-- Background Layer -->
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    <rect width="100%" height="100%" fill="url(#rain)" />

    <!-- Ambient Glow Circles -->
    <circle cx="200" cy="180" r="280" fill="${accentColor}" fill-opacity="0.08" />
    <circle cx="950" cy="340" r="320" fill="${secondaryColor}" fill-opacity="0.09" />

    <!-- Brand Header -->
    <g transform="translate(80, 75)">
      <!-- Logo Icon -->
      <circle cx="20" cy="20" r="20" fill="${accentColor}" fill-opacity="0.2" />
      <path d="M 20,10 C 13,18 7,24 7,28 A 13,13 0 0,0 33,28 C 33,24 27,18 20,10 Z" fill="${accentColor}" />
      <text x="50" y="27" fill="#f8fafc" font-size="20" font-weight="bold" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" letter-spacing="0.5">Rainwater Directory</text>
      <text x="250" y="27" fill="#64748b" font-size="16" font-family="sans-serif">•</text>
      <text x="265" y="27" fill="#94a3b8" font-size="14" font-weight="600" font-family="sans-serif" letter-spacing="1.5">${safeCategory}</text>
    </g>

    <!-- Content Left Column -->
    <g transform="translate(80, 160)">
      <!-- Category Badge -->
      <rect x="0" y="0" width="${badge.length * 11 + 32}" height="32" rx="16" fill="url(#badgeGrad)" fill-opacity="0.2" stroke="${accentColor}" stroke-width="1.5" />
      <text x="16" y="21" fill="${accentColor}" font-size="12" font-weight="bold" font-family="sans-serif" letter-spacing="1.5">${safeBadge}</text>

      <!-- Main Headline -->
      <text x="0" y="85" fill="#ffffff" font-size="44" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" letter-spacing="-0.8">
        ${safeTitle}
      </text>

      <!-- Subtitle Description -->
      <text x="0" y="145" fill="#cbd5e1" font-size="20" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
        ${safeSubtitle}
      </text>

      <!-- Tagline Feature Highlights -->
      <g transform="translate(0, 205)">
        <rect x="0" y="0" width="580" height="54" rx="12" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="1.5" />
        <circle cx="28" cy="27" r="7" fill="${accentColor}" />
        <text x="48" y="32" fill="#f1f5f9" font-size="14" font-weight="600" font-family="sans-serif">
          ${safeTagline}
        </text>
      </g>
    </g>

    <!-- Diagram / Illustration Right Column -->
    ${diagram}

    <!-- Bottom Footer Brand Anchor -->
    <g transform="translate(80, 600)">
      <line x1="0" y1="0" x2="1040" y2="0" stroke="#334155" stroke-opacity="0.6" stroke-width="1" />
      <text x="0" y="30" fill="#94a3b8" font-size="13" font-weight="600" font-family="sans-serif" letter-spacing="1">
        RAINWATERDIRECTORY.COM
      </text>
      <text x="210" y="30" fill="#64748b" font-size="13" font-family="sans-serif">•</text>
      <text x="225" y="30" fill="#cbd5e1" font-size="13" font-weight="500" font-family="sans-serif">
        FACT-CHECKED &amp; CODE-VERIFIED GUIDES
      </text>
      <text x="1040" y="30" fill="${accentColor}" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="end">
        STANDARDS: ARCSA / ASPE 63 / UPC CH. 16
      </text>
    </g>
  </svg>
  `;
}

async function generateAll() {
  console.log('Generating 12 high-resolution 1200x675 WebP images...');

  for (const item of IMAGES) {
    const targetPath = item.isRoot
      ? path.join(PUBLIC_DIR, 'images', item.filename)
      : path.join(BLOG_IMAGES_DIR, item.filename);

    const svgString = buildSvg(item);
    const svg = Buffer.from(svgString);
    await sharp(svg)
      .webp({ quality: 90, effort: 6 })
      .toFile(targetPath);

    const stats = fs.statSync(targetPath);
    console.log(`✓ Generated ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  console.log('All 12 images generated successfully.');
}

generateAll().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
