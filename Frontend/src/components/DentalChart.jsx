import React, { useState } from 'react';

const PATHS = {
  molar: "M505 939 c-76 -19 -84 -19 -161 -4 -65 12 -87 13 -108 4 -14 -7 -26 -15 -26 -18 0 -3 -11 -19 -25 -35 -54 -63 -57 -149 -10 -332 16 -59 26 -128 26 -169 1 -134 37 -252 92 -303 55 -52 84 -10 94 133 7 106 17 107 27 4 8 -69 35 -129 61 -129 29 0 47 47 54 142 6 93 6 93 18 -31 14 -146 26 -168 70 -135 28 22 46 53 22 39 -8 -5 -11 -4 -6 1 5 5 14 9 20 9 7 0 23 27 36 60 20 50 26 85 32 210 5 112 12 165 28 209 15 42 21 83 21 145 0 117 -15 146 -100 189 -35 17 -69 32 -75 31 -5 0 -46 -9 -90 -20z m132 -7 c7 -4 -30 -16 -85 -26 -74 -14 -105 -16 -132 -8 -35 10 -35 10 0 11 19 1 58 8 85 15 57 16 114 19 132 8z m-318 -6 c-2 -2 -26 -6 -54 -10 -34 -4 -45 -3 -35 4 14 9 99 15 89 6z m54 -13 c-7 -2 -21 -2 -30 0 -10 3 -4 5 12 5 17 0 24 -2 18 -5z m352 -37 c36 -45 38 -197 6 -294 -11 -32 -22 -74 -26 -94 -5 -26 -11 -35 -21 -31 -11 4 -14 -14 -14 -100 0 -58 -4 -117 -10 -132 -6 -15 -6 -24 -1 -20 30 18 16 -46 -15 -70 -7 -5 -14 -17 -16 -25 -4 -18 -23 -40 -36 -40 -12 0 -20 29 -27 105 -11 111 -28 210 -42 237 -16 34 -44 50 -64 37 -20 -13 -31 -11 -23 4 4 6 4 9 0 5 -4 -3 -8 -10 -8 -15 0 -4 -9 -25 -20 -46 -16 -32 -34 -128 -43 -227 -3 -35 -25 -100 -34 -100 -14 0 -48 45 -68 90 -28 62 -36 87 -25 75 6 -5 12 -19 15 -30 3 -11 4 0 2 25 -4 63 12 158 35 203 20 37 20 37 -8 37 -73 1 -86 22 -113 192 -16 108 -9 173 25 206 24 24 33 27 99 26 39 0 106 -4 147 -8 54 -5 90 -3 130 8 76 20 130 14 155 -18z m-457 -428 c10 15 11 15 5 -3 -3 -11 -10 -25 -15 -31 -4 -6 -6 -19 -2 -28 4 -9 1 -16 -6 -16 -7 0 -10 -7 -6 -17 4 -9 3 -37 -1 -62 -7 -44 -7 -45 -14 -16 -4 17 -7 68 -8 114 -1 82 -1 84 17 63 17 -19 19 -19 30 -4z m247 -157 c-8 -137 -12 -166 -30 -181 -23 -19 -43 27 -62 144 -15 103 -15 110 2 142 21 39 53 48 78 21 15 -17 17 -33 12 -126z m185 84 c0 -25 -4 -45 -10 -45 -11 0 -14 73 -3 83 11 12 13 8 13 -38z m-5 -111 c-3 -46 -10 -62 -21 -51 -4 4 -1 13 5 21 7 8 10 20 6 26 -6 9 2 50 10 50 2 0 2 -20 0 -46z",
  premolar: "M490 1871 c-33 -15 -92 -33 -132 -40 -235 -39 -261 -365 -55 -704 72 -119 136 -342 189 -660 99 -595 175 -493 328 443 12 77 53 208 90 290 158 354 93 638 -148 641 -40 0 -94 13 -122 29 -62 36 -76 36 -150 1z m202 -61 c54 -28 132 -60 173 -71 55 -15 78 -34 87 -71 41 -161 -78 -567 -166 -568 -62 0 -93 -186 -117 -701 -6 -150 -52 -291 -75 -232 -8 21 -6 30 6 23 11 -7 20 -3 20 8 0 11 -8 24 -17 30 -20 12 -39 135 -56 352 -11 145 -61 331 -118 441 -15 30 -23 58 -18 64 6 5 -12 24 -39 42 -89 58 -183 338 -169 503 7 75 12 82 98 110 51 17 123 50 160 75 88 56 111 56 231 -5z M680 1701 c-40 -26 -49 -361 -9 -361 33 0 58 150 44 270 -6 55 -1 92 13 98 12 5 13 9 2 10 -11 1 -33 -7 -50 -17z M529 1145 c3 -23 20 -33 48 -29 24 4 43 -3 43 -15 0 -11 -9 -21 -20 -21 -11 0 -20 -10 -20 -23 0 -13 16 -8 39 12 21 19 48 29 60 22 11 -7 21 -4 21 8 0 11 -16 21 -35 22 -19 0 -52 13 -74 30 -51 38 -69 37 -62 -6z",
  canine: "M156 929 l-79 -81 6 -57 c3 -31 24 -102 47 -161 37 -92 46 -131 72-315 29 -204 41 -255 64 -262 21 -7 34 50 64 278 25 191 35 242 60 302 36 87 56 173 46 210 -9 39 -144 167 -176 167 -18 0 -46 -22 -104 -81z m194 -4 l73-76 -6 -59 c-8 -88 -54 -200 -89 -214 l-27 -12 -4 -178 c-3 -114 -8 -181 -16-189 -8 -8 -11 -6 -12 9 0 19 -1 19 -8 -1 -7 -17 -9 -14 -14 15 -3 19 -11 80-16 135 -6 55 -13 120 -15 145 -3 25 -5 51 -5 58 -1 6 -9 12 -19 12 -34 0-112 220 -95 267 9 24 151 163 167 163 7 0 45 -34 86 -75z",
  incisor: "M896 3655 c-10 -7 -43 -17 -72 -21 -30 -3 -71 -15 -91 -25 -21 -11 -43 -19 -50 -19 -7 0 -13 -5 -13 -11 0 -5 -13 -15 -30 -20 -16 -6 -30 -15 -30 -20 0 -5 -8 -13 -17 -16 -9 -4 -36 -27 -60 -52 l-44 -46 3 -275 c3 -237 6 -279 20 -304 10 -17 17 -48 16 -71 -1 -50 38 -192 61 -225 10 -14 22 -41 26 -60 4 -19 11 -40 16 -46 17 -21 59 -105 59 -118 0 -8 7 -19 15 -26 8 -7 20 -31 26 -54 6 -22 16 -50 23 -61 7 -11 18 -49 25 -85 7 -36 17 -70 21 -75 5 -6 12 -46 16 -90 3 -44 13 -95 20 -114 8 -18 17 -72 20 -120 3 -47 12 -106 19 -131 7 -25 16 -97 19 -160 3 -63 10 -131 16 -150 6 -19 17 -118 26 -220 8 -102 21 -225 29 -274 8 -49 15 -120 15 -158 0 -40 7 -84 16 -106 8 -20 18 -70 21 -109 4 -43 11 -78 19 -84 8 -6 14 -22 14 -34 0 -21 38 -78 65 -97 36 -26 99 27 124 104 7 21 17 40 22 43 5 4 9 23 9 43 0 20 9 56 19 79 11 23 23 68 26 100 4 32 14 70 21 85 8 15 14 53 14 85 0 39 7 71 20 96 14 26 20 56 20 101 0 36 9 90 20 126 11 34 20 84 20 109 0 46 20 208 40 326 5 33 10 83 10 111 0 28 7 73 15 100 9 27 18 94 22 149 3 55 12 109 18 120 7 11 15 55 18 97 3 46 12 86 21 100 9 12 16 36 16 53 1 16 8 48 16 70 8 22 21 65 29 95 7 30 21 69 29 85 9 17 16 42 16 56 0 15 7 32 15 39 8 7 17 28 21 49 4 20 12 43 19 51 7 8 15 36 18 63 4 26 13 57 21 70 7 12 16 48 20 80 3 32 13 74 21 92 23 57 26 437 3 462 -10 11 -18 24 -18 30 0 18 -89 101 -117 108 -14 3 -38 15 -51 26 -14 10 -32 19 -41 19 -9 0 -26 6 -37 14 -11 8 -38 17 -60 21 -21 4 -61 13 -88 21 -71 20 -483 19 -510 -1z m623 -126 c137 -45 211 -93 211 -138 0 -9 7 -29 15 -44 11 -21 12 -39 5 -75 -4 -26 -12 -108 -16 -182 -4 -87 -12 -142 -20 -155 -8 -11 -14 -38 -15 -60 -1 -111 -29 -159 -45 -78 -10 55 -28 60 -32 9 -2 -25 3 -41 19 -57 26 -26 22 -82 -11 -154 -11 -24 -20 -53 -20 -65 0 -11 -6 -23 -14 -26 -8 -3 -18 -24 -22 -47 -3 -23 -13 -51 -20 -62 -8 -11 -14 -29 -14 -40 0 -19 -31 -131 -51 -182 -5 -13 -17 -23 -27 -23 -11 0 -27 -9 -37 -20 -10 -11 -26 -20 -35 -20 -36 0 -44 -26 -25 -76 13 -34 15 -58 10 -92 -33 -219 -49 -477 -31 -513 20 -40 20 -68 1 -75 -25 -10 -38 -82 -31 -178 6 -71 4 -92 -8 -105 -9 -10 -16 -47 -19 -106 -7 -115 -22 -225 -41 -295 -9 -30 -16 -67 -16 -81 0 -15 -7 -33 -16 -40 -12 -10 -15 -24 -10 -59 4 -33 2 -52 -9 -65 -8 -11 -15 -34 -15 -52 0 -20 -10 -43 -27 -62 l-28 -30 0 69 c0 62 2 70 23 79 31 15 31 61 -1 61 -13 0 -29 -6 -35 -12 -21 -21 -28 4 -35 111 -4 54 -14 120 -22 147 -9 29 -18 103 -20 181 -3 72 -10 144 -16 160 -29 71 -46 950 -19 977 35 35 -54 104 -92 70 -15 -14 -18 -13 -32 13 -8 16 -22 35 -30 42 -9 8 -16 21 -16 31 0 10 -7 23 -15 30 -8 7 -15 24 -15 39 0 14 -9 40 -20 56 -11 17 -20 37 -20 46 0 9 -9 28 -20 42 -11 14 -23 39 -26 56 -4 17 -12 36 -20 42 -7 6 -16 27 -20 48 -4 20 -12 43 -19 51 -7 8 -16 38 -20 65 -4 28 -13 57 -20 65 -7 8 -15 52 -18 98 -4 45 -12 92 -19 105 -21 37 -24 372 -4 420 21 48 83 117 106 117 9 0 28 9 42 19 14 11 49 23 79 27 30 3 68 12 84 20 40 18 105 22 320 19 l180 -1 134 -45z M1670 3024 c-10 -26 -4 -70 11 -80 5 -3 9 20 9 50 0 61 -5 69 -20 30z M1582 2958 c5 -35 48 -38 48 -4 0 21 -5 26 -26 26 -21 0 -25 -4 -22 -22z M1542 2781 c-17 -10 -33 -70 -26 -98 6 -24 19 -30 29 -13 3 6 15 10 26 10 20 0 26 15 9 25 -5 3 -10 21 -10 40 0 37 -9 48 -28 36z M1521 2561 c-13 -24 -14 -61 -3 -61 16 0 44 38 40 56 -5 25 -25 28 -37 5z M1257 2463 c-20 -19 -6 -61 23 -72 34 -12 40 -40 10 -48 -33 -9 -20 -38 18 -41 l33 -3 -7 63 c-9 87 -45 134 -77 101z M1105 2050 c-10 -17 -1 -22 40 -22 34 0 53 7 44 16 -12 12 -77 17 -84 6z",
};

const CONFIG = {
  molar:    { viewBox: "0 0 800 700", translate: 1000, scale: "w-14", cx: 500, cy: 500 },
  premolar: { viewBox: "0 0 1100 2000", translate: 2000, scale: "w-11", cx: 500, cy: 1000 },
  canine:   { viewBox: "0 0 600 1000",  translate: 1000, scale: "w-10", cx: 300, cy: 500 },
  incisor:  { viewBox: "80 200 1800 3800", translate: 3800, scale: "w-9", cx: 900, cy: 2000 }
};

const STATUS_COLORS = {
  healthy: { fill: "#ffffff", stroke: "#7ea0cfff" },
  decay: { fill: "#fee2e2", stroke: "#ef4444" },
  fractured: { fill: "#ffedd5", stroke: "#f97316" },
  missing: { fill: "#f3f4f6", stroke: "#9ca3af" },
  filled: { fill: "#fef3c7", stroke: "#f59e0b" },
  rct_treated: { fill: "#f5f3ff", stroke: "#8b5cf6" },
  crowned: { fill: "#fce7f3", stroke: "#ec4899" },
  implanted: { fill: "#e0e7ff", stroke: "#6366f1" },
  braced: { fill: "#f8fafc", stroke: "#64748b" },
  cleaned: { fill: "#f0f9ff", stroke: "#0ea5e9" },
  extracted: { fill: "#f3f4f6", stroke: "#9ca3af" },
  veneered: { fill: "#ecfdf5", stroke: "#10b981" },
  whitened: { fill: "#faf5ff", stroke: "#c084fc" }
};

const PROCEDURES = [
  { 
    id: 'cleaning', 
    name: 'Teeth Cleaning', 
    allowedTargets: 'arch', 
    surfaceBased: false, 
    color: '#0ea5e9',
    description: 'Professional dental cleaning and polishing',
    requiresStatus:null,
    changesStatus: 'cleaned',
    badgeColor: 'bg-blue-100 text-blue-800',
    isRemovable: false
  },
  { 
    id: 'filling', 
    name: 'Filling', 
    allowedTargets: 'single', 
    surfaceBased: true,
    allowedSurfaces: [true, true, true], 
    color: '#f59e0b',
    description: 'Dental restoration for cavities',
    requiresStatus: ['decay', 'fractured'],
    changesStatus: 'filled',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    isRemovable: true,
    removalName: 'Filling Removal',
    removalChangesTo: 'healthy'
  },
  { 
    id: 'rct', 
    name: 'Root Canal', 
    allowedTargets: 'single', 
    surfaceBased: false,
    color: '#8b5cf6',
    description: 'Endodontic treatment',
    requiresStatus: ['decay', 'fractured', 'filled'],
    changesStatus: 'rct_treated',
    badgeColor: 'bg-purple-100 text-purple-800',
    isRemovable: false
  },
  { 
    id: 'crown', 
    name: 'Crown', 
    allowedTargets: 'single', 
    surfaceBased: true,
    allowedSurfaces: [true, true, true], 
    color: '#ec4899',
    description: 'Dental crown placement',
    requiresStatus: ['decay', 'fractured', 'filled', 'rct_treated'],
    changesStatus: 'crowned',
    badgeColor: 'bg-pink-100 text-pink-800',
    isRemovable: true,
    removalName: 'Crown Removal',
    removalChangesTo: 'filled'
  },
  { 
    id: 'veneer', 
    name: 'Veneer', 
    allowedTargets: 'multiple', 
    surfaceBased: true,
    allowedTeeth: [6,7,8,9,10,11,22,23,24,25,26,27], 
    color: '#06b6d4',
    description: 'Porcelain veneer with color matching',
    requiresStatus: ['healthy', 'filled', 'whitened', 'crowned', 'rct_treated','cleaned'],
    requiresColorMatch: true,
    changesStatus: 'veneered',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    isRemovable: true,
    removalName: 'Veneer Removal',
    removalChangesTo: 'healthy'
  },
  { 
    id: 'implant', 
    name: 'Implant', 
    allowedTargets: 'single', 
    surfaceBased: false,
    requiresStatus: ['missing', 'extracted'],
    color: '#6366f1',
    description: 'Dental implant placement',
    changesStatus: 'implanted',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    isRemovable: false
  },
  { 
    id: 'extraction', 
    name: 'Extraction', 
    allowedTargets: 'single', 
    surfaceBased: false,
    color: '#ef4444',
    description: 'Tooth extraction',
    requiresStatus: ['decay', 'fractured', 'filled'],
    changesStatus: 'extracted',
    badgeColor: 'bg-red-100 text-red-800',
    isRemovable: false
  },
  { 
    id: 'ortho', 
    name: 'Orthodontic', 
    allowedTargets: 'arch', 
    surfaceBased: false,
    color: '#10b981',
    description: 'Braces or aligners treatment',
    requiresStatus: ['healthy', 'filled', 'crowned', 'rct_treated', 'veneered'],
    changesStatus: 'braced',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    isRemovable: true,
    removalName: 'Braces Removal',
    removalChangesTo: 'healthy'
  },
  { 
    id: 'repair', 
    name: 'Tooth Repair', 
    allowedTargets: 'single', 
    surfaceBased: true,
    color: '#f97316',
    description: 'Repair fractured or damaged tooth',
    requiresStatus: ['fractured'],
    changesStatus: 'filled',
    badgeColor: 'bg-orange-100 text-orange-800',
    isRemovable: true,
    removalName: 'Repair Removal',
    removalChangesTo: 'fractured'
  },
  { 
    id: 'whitening', 
    name: 'Teeth Whitening', 
    allowedTargets: 'arch', 
    surfaceBased: false,
    color: '#c084fc',
    description: 'Professional teeth whitening',
    requiresStatus: ['healthy', 'filled', 'crowned', 'rct_treated', 'veneered', 'braced', 'cleaned'],
    changesStatus: 'whitened',
    badgeColor: 'bg-purple-100 text-purple-800',
    isRemovable: false
  },
  { 
    id: 'braces_removal', 
    name: 'Braces Removal', 
    allowedTargets: 'arch', 
    surfaceBased: false,
    color: '#94a3b8',
    description: 'Remove orthodontic braces',
    requiresStatus: ['braced'],
    changesStatus: 'healthy',
    badgeColor: 'bg-slate-100 text-slate-800',
    isRemovable: false,
    isRemovalProcedure: true,
    removesProcedure: 'ortho'
  },
  { 
    id: 'veneer_removal', 
    name: 'Veneer Removal', 
    allowedTargets: 'multiple', 
    surfaceBased: true,
    allowedTeeth: [6,7,8,9,10,11,22,23,24,25,26,27], 
    color: '#0891b2',
    description: 'Remove dental veneers',
    requiresStatus: ['veneered'],
    changesStatus: 'healthy',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    isRemovable: false,
    isRemovalProcedure: true,
    removesProcedure: 'veneer'
  },
  { 
    id: 'filling_removal', 
    name: 'Filling Removal', 
    allowedTargets: 'single', 
    surfaceBased: true,
    color: '#d97706',
    description: 'Remove dental filling',
    requiresStatus: ['filled'],
    changesStatus: 'healthy',
    badgeColor: 'bg-amber-100 text-amber-800',
    isRemovable: false,
    isRemovalProcedure: true,
    removesProcedure: 'filling'
  },
  { 
    id: 'crown_removal', 
    name: 'Crown Removal', 
    allowedTargets: 'single', 
    surfaceBased: true,
    color: '#db2777',
    description: 'Remove dental crown',
    requiresStatus: ['crowned'],
    changesStatus: 'filled',
    badgeColor: 'bg-pink-100 text-pink-800',
    isRemovable: false,
    isRemovalProcedure: true,
    removesProcedure: 'crown'
  }
];

const SURFACE_LABELS = ['M', 'B', 'D'];
const TOOTH_SURFACES = {
  molar: ['Occlusal', 'Buccal', 'Distal'],
  premolar: ['Occlusal', 'Buccal', 'Distal'],
  canine: ['Incisal', 'Labial', 'Distal'],
  incisor: ['Incisal', 'Labial', 'Distal']
};

const TOOTH_SHADES = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4'
];

const getToothType = (id) => {
  if ([6, 11, 22, 27].includes(id)) return 'canine';
  if (id <= 3 || (id >= 14 && id <= 19) || id >= 30) return 'molar';
  if ((id >= 7 && id <= 10) || (id >= 23 && id <= 26)) return 'incisor';
  return 'premolar';
};

const ArchTreatmentIndicator = ({ arch, treatments }) => {
  if (!treatments || treatments.length === 0) return null;
  
  const getTreatmentColor = (treatment) => {
    const procedure = PROCEDURES.find(p => p.changesStatus === treatment || p.id === treatment);
    return procedure ? procedure.color : '#6b7280';
  };
  
  return (
    <div className="flex items-center gap-2 ml-2">
      {treatments.map((treatment, idx) => (
        <div 
          key={idx}
          className="text-xs font-medium px-2 py-1 rounded-full border"
          style={{ 
            backgroundColor: `${getTreatmentColor(treatment)}20`,
            color: getTreatmentColor(treatment),
            borderColor: getTreatmentColor(treatment)
          }}
        >
          {treatment === 'cleaned' ? 'Cleaned' :
           treatment === 'braced' ? 'Braces' :
           treatment === 'whitened' ? 'Whitened' : treatment}
        </div>
      ))}
    </div>
  );
};

const TimelineEvent = ({ event }) => {
  const getEventIcon = (type) => {
    switch(type) {
      case 'applied': return 'A';
      case 'removed': return 'R';
      default: return 'N';
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'applied': return 'bg-green-100 border-green-200 text-green-800';
      case 'removed': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not recorded';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${getEventColor(event.type)}`}>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border">
        <span className="font-bold">{getEventIcon(event.type)}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{event.procedureName}</h4>
          <span className="text-xs text-gray-600">{formatDate(event.date)}</span>
        </div>
        <div className="text-sm mt-1">
          <span className={`px-2 py-0.5 rounded text-xs ${event.type === 'removed' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
            {event.type === 'applied' ? 'Applied' : 'Removed'}
          </span>
          {event.duration && (
            <span className="ml-2 text-xs text-gray-600">
              Duration: {event.duration}
            </span>
          )}
          {event.shade && (
            <span className="ml-2 text-xs text-gray-600">
              Shade: {event.shade}
            </span>
          )}
        </div>
        {event.notes && (
          <p className="text-xs mt-2 text-gray-600">{event.notes}</p>
        )}
        {event.removalReason && (
          <p className="text-xs mt-1 text-yellow-700">Reason: {event.removalReason}</p>
        )}
        {event.appliedDate && event.type === 'removed' && (
          <p className="text-xs mt-1 text-gray-500">
            Originally applied: {new Date(event.appliedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

const Tooth = ({ 
  id, 
  data, 
  active, 
  onClick, 
  onRightClick,
  isUpper, 
  selectedForProcedure,
  selectionMode
}) => {
  const type = getToothType(id);
  const cfg = CONFIG[type];
  const maxPD = Math.max(...data.pd);
  const statusColor = STATUS_COLORS[data.status] || STATUS_COLORS.healthy;
  
  const STROKE_MAP = {
    molar: { active: 28, idle: 18 },
    premolar: { active: 32, idle: 22 },
    canine: { active: 30, idle: 20 },
    incisor: { active: 34, idle: 24 },
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onRightClick(id);
  };

  const getSelectionStyle = () => {
    if (!selectedForProcedure) return '';
    if (selectionMode === 'single') return 'ring-2 ring-yellow-500 ring-offset-1';
    if (selectionMode === 'multiple') return 'ring-2 ring-purple-500 ring-offset-1';
    if (selectionMode === 'arch') return 'ring-2 ring-green-500 ring-offset-1';
    return '';
  };

  const getHistoryBadges = () => {
    const badges = [];
    const archTreatments = ['cleaned', 'braced', 'whitened'];
    
    if (data.status !== 'healthy' && !archTreatments.includes(data.status)) {
      const procedure = PROCEDURES.find(p => p.changesStatus === data.status);
      badges.push({
        text: data.status === 'filled' ? 'FL' : 
              data.status === 'rct_treated' ? 'RC' : 
              data.status === 'crowned' ? 'CR' : 
              data.status === 'implanted' ? 'IM' : 
              data.status === 'extracted' ? 'EX' : 
              data.status === 'veneered' ? 'VN' : 
              data.status.charAt(0).toUpperCase(),
        color: procedure?.badgeColor || 'bg-gray-100 text-gray-800'
      });
    }

    const hasRecentRemoval = data.timelineHistory?.some(event => 
      event.type === 'removed' && 
      new Date() - new Date(event.date) < 30 * 24 * 60 * 60 * 1000
    );

    if (hasRecentRemoval) {
      badges.push({
        text: 'R',
        color: 'bg-yellow-100 text-yellow-800',
        title: 'Treatment recently removed'
      });
    }

    if (data.procedureHistory && data.procedureHistory.length > 0) {
      const nonArchProcedures = data.procedureHistory.filter(proc => 
        !['cleaning', 'orthodontic', 'whitening'].includes(proc.toLowerCase())
      );
      const recentProcedures = nonArchProcedures.slice(-2);
      
      recentProcedures.forEach(proc => {
        const procedure = PROCEDURES.find(p => p.name === proc);
        if (procedure && procedure.changesStatus !== data.status) {
          badges.push({
            text: proc === 'Filling' ? 'FL' : 
                  proc === 'Root Canal' ? 'RC' : 
                  proc === 'Crown' ? 'CR' : 
                  proc === 'Implant' ? 'IM' : 
                  proc === 'Extraction' ? 'EX' : 
                  proc === 'Veneer' ? 'VN' : 
                  proc === 'Tooth Repair' ? 'RP' : proc.substring(0, 2).toUpperCase(),
            color: procedure.badgeColor || 'bg-gray-100 text-gray-800'
          });
        }
      });
    }

    return badges;
  };

  const historyBadges = getHistoryBadges();

  return (
    <div 
      onClick={() => onClick(id)}
      onContextMenu={handleContextMenu}
      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200
        ${active ? 'z-30 scale-110' : 'hover:scale-105 hover:opacity-100'}
        ${data.status === 'missing' || data.status === 'extracted' ? 'opacity-70' : 'opacity-100'}
        ${getSelectionStyle()}`}
    >
      {historyBadges.length > 0 && (
        <div className="absolute -top-1 -right-1 z-20 flex gap-0.5">
          {historyBadges.slice(0, 3).map((badge, idx) => (
            <div key={idx} className={`text-[8px] font-bold px-1 py-0.5 rounded ${badge.color}`} title={badge.title}>
              {badge.text}
            </div>
          ))}
        </div>
      )}

      <div className="h-4 mb-1 flex items-center gap-1">
        {data.mobility > 0 && (
          <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 rounded">M{data.mobility}</span>
        )}
        {data.status === 'missing' && (
          <span className="text-[9px] font-bold bg-gray-400 text-white px-1.5 rounded">X</span>
        )}
        {data.status === 'fractured' && (
          <span className="text-[9px] font-bold bg-orange-600 text-white px-1.5 rounded">F</span>
        )}
        {data.status === 'decay' && (
          <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 rounded">D</span>
        )}
      </div>

      <div className={`relative ${cfg.scale} h-24 ${!isUpper ? 'rotate-180' : ''}`}>
        <svg viewBox={cfg.viewBox} className="w-full h-full overflow-visible">
          <g transform={`translate(0, ${cfg.translate}) scale(1, -1)`}>
            <path
              d={PATHS[type]}
              fill={statusColor.fill}
              stroke={active ? "#3b82f6" : statusColor.stroke}
              strokeWidth={active ? STROKE_MAP[type].active : STROKE_MAP[type].idle}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            
            {maxPD > 0 && (
              <rect 
                x={cfg.cx - 150} 
                y={cfg.cy - 100} 
                width="300" 
                height={maxPD * 100} 
                rx="30"
                fill={maxPD >= 4 ? '#ef4444' : maxPD >= 3 ? '#f59e0b' : '#10b981'}
                fillOpacity="0.15"
              />
            )}
            
            {data.status === 'decay' && (
              <circle cx={cfg.cx} cy={cfg.cy} r="80" fill="#ef4444" fillOpacity="0.2" />
            )}
            
            {data.status === 'fractured' && (
              <>
                <path 
                  d={`M${cfg.cx-40},${cfg.cy-30} L${cfg.cx+40},${cfg.cy+40}`}
                  stroke="#f97316"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path 
                  d={`M${cfg.cx-30},${cfg.cy+20} L${cfg.cx+30},${cfg.cy-40}`}
                  stroke="#f97316"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </>
            )}
            
            {(data.status === 'missing' || data.status === 'extracted') && (
              <>
                <rect x={cfg.cx-60} y={cfg.cy-60} width="120" height="120" rx="10" fill="#9ca3af" fillOpacity="0.2" />
                <line x1={cfg.cx-40} y1={cfg.cy-40} x2={cfg.cx+40} y2={cfg.cy+40} stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
                <line x1={cfg.cx+40} y1={cfg.cy-40} x2={cfg.cx-40} y2={cfg.cy+40} stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
              </>
            )}
            
            {data.status === 'implanted' && (
              <>
                <rect x={cfg.cx-20} y={cfg.cy-60} width="40" height="120" rx="5" fill="#6366f1" fillOpacity="0.3" />
                <circle cx={cfg.cx} cy={cfg.cy} r="15" fill="#6366f1" fillOpacity="0.5" />
              </>
            )}
            
            {data.status === 'rct_treated' && (
              <path 
                d={`M${cfg.cx-40},${cfg.cy-40} L${cfg.cx+40},${cfg.cy+40} M${cfg.cx+40},${cfg.cy-40} L${cfg.cx-40},${cfg.cy+40}`}
                stroke="#8b5cf6"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}
            
            {data.status === 'crowned' && (
              <rect x={cfg.cx-60} y={cfg.cy-60} width="120" height="120" rx="15" fill="#ec4899" fillOpacity="0.2" />
            )}
            
            {data.status === 'braced' && (
              <>
                <rect x={cfg.cx-12} y={cfg.cy-45} width="24" height="8" rx="2" fill="#94a3b8" opacity="0.9" />
                <rect x={cfg.cx-12} y={cfg.cy+37} width="24" height="8" rx="2" fill="#94a3b8" opacity="0.9" />
                <rect x={cfg.cx-8} y={cfg.cy-40} width="16" height="2" fill="#ffffff" opacity="0.8" />
                <rect x={cfg.cx-8} y={cfg.cy+42} width="16" height="2" fill="#ffffff" opacity="0.8" />
                <line x1={cfg.cx} y1={cfg.cy-41} x2={cfg.cx} y2={cfg.cy+43} stroke="#64748b" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              </>
            )}
            
            {data.status === 'filled' && data.selectedSurfaces && (
              <>
                {data.selectedSurfaces[0] && <circle cx={cfg.cx} cy={cfg.cy-20} r="12" fill="#f59e0b" opacity="0.6" />}
                {data.selectedSurfaces[1] && <circle cx={cfg.cx+25} cy={cfg.cy} r="12" fill="#f59e0b" opacity="0.6" />}
                {data.selectedSurfaces[2] && <circle cx={cfg.cx-25} cy={cfg.cy} r="12" fill="#f59e0b" opacity="0.6" />}
              </>
            )}
            
            {data.status === 'veneered' && (
              <rect x={cfg.cx-70} y={cfg.cy-70} width="140" height="140" rx="20" fill="#06b6d4" fillOpacity="0.1" />
            )}
            
            {data.status === 'whitened' && (
              <circle cx={cfg.cx} cy={cfg.cy} r="70" fill="#c084fc" fillOpacity="0.1" />
            )}
          </g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {data.bleeding.map((b, i) => b && (
            <div key={i} className="w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
          ))}
        </div>
      </div>

      <div className={`mt-3 flex flex-col items-center ${!isUpper ? 'flex-col-reverse' : ''}`}>
        <span className={`text-[10px] font-bold ${active ? 'text-blue-600' : 'text-gray-500'}`}>
          {id}
        </span>
        <div className="flex bg-white border border-gray-200 rounded shadow-sm mt-1 overflow-hidden">
          {data.pd.map((val, i) => (
            <div key={i} className={`w-3.5 h-4.5 flex items-center justify-center text-[9px] font-bold border-r border-gray-100 last:border-0
              ${val >= 4 ? 'bg-red-500 text-white' : 
                val >= 3 ? 'bg-yellow-500 text-white' : 
                'bg-green-500 text-white'}`}>
              {val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SurfaceSelector = ({ toothId, data, onSurfaceToggle, toothType }) => {
  const surfaces = TOOTH_SURFACES[toothType] || ['Surface 1', 'Surface 2', 'Surface 3'];
  
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-2">Surfaces for Tooth {toothId}</h4>
      <div className="grid grid-cols-3 gap-2">
        {surfaces.map((label, idx) => (
          <button
            key={idx}
            onClick={() => onSurfaceToggle(toothId, idx)}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center
              ${data.selectedSurfaces?.[idx] 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-base font-bold mb-1">{SURFACE_LABELS[idx]}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ColorMatchingSelector = ({ selectedShade, onShadeChange }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-2">Color Matching</h4>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tooth Shade</label>
          <select
            value={selectedShade}
            onChange={(e) => onShadeChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200"
          >
            <option value="">Select shade</option>
            {TOOTH_SHADES.map(shade => (
              <option key={shade} value={shade}>{shade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Shade Preview</label>
          <div className="flex items-center gap-3">
            <div 
              className="w-16 h-8 rounded border border-gray-300"
              style={{ 
                backgroundColor: selectedShade ? 
                  (selectedShade.startsWith('A') ? '#FFF8F0' : 
                   selectedShade.startsWith('B') ? '#FFF0F0' : 
                   selectedShade.startsWith('C') ? '#F0FFF0' : '#F0F0FF') : '#FFFFFF'
              }}
            />
            <span className="text-sm text-gray-600">{selectedShade || 'No shade selected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchSelector = ({ selectedArch, onArchChange }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-2">Select Arch</h4>
      <div className="grid grid-cols-2 gap-2">
        {['Upper', 'Lower', 'Both'].map(arch => (
          <button
            key={arch}
            onClick={() => onArchChange(arch.toLowerCase())}
            className={`p-3 rounded-lg border transition-colors flex flex-col items-center justify-center
              ${selectedArch === arch.toLowerCase() 
                ? 'bg-blue-100 border-blue-400 text-blue-800' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-sm font-medium">{arch} Jaw</span>
            <span className="text-xs text-gray-500 mt-1">
              {arch === 'Upper' ? 'Teeth 1-16' : 
               arch === 'Lower' ? 'Teeth 17-32' : 
               'All teeth'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const RemovalNotes = ({ notes, onNotesChange, onSkip }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-2">Removal Documentation</h4>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Document reason for removal (optional but recommended)"
        className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 resize-none mb-3"
      />
      <div className="flex justify-between">
        <button
          onClick={onSkip}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          Skip Documentation
        </button>
        <div className="text-xs text-gray-500 text-right">
          <p>Recommended for clinical records</p>
        </div>
      </div>
    </div>
  );
};

const DentalChart = () => {
  const [activeTooth, setActiveTooth] = useState(11);
  const [activeTab, setActiveTab] = useState('measurements');
  const [activeProcedure, setActiveProcedure] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [surfaceSelection, setSurfaceSelection] = useState({});
  const [selectedShade, setSelectedShade] = useState('');
  const [selectedArch, setSelectedArch] = useState('');
  const [clinicalNote, setClinicalNote] = useState('');
  const [removalNotes, setRemovalNotes] = useState('');
  const [skipRemovalNotes, setSkipRemovalNotes] = useState(false);
  const [soapData, setSoapData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [chartData, setChartData] = useState(() => {
    const initialData = {};
    for (let i = 1; i <= 32; i++) {
      initialData[i] = {
        pd: [2, 2, 2],
        bleeding: [false, false, false],
        mobility: 0,
        status: 'healthy',
        procedureHistory: [],
        timelineHistory: [],
        selectedSurfaces: null,
        clinicalNote: '',
        soapNotes: null,
        toothShade: null,
        lastCleaned: null,
        nextAppointment: null,
        diagnosis: '',
        prognosis: '',
        treatmentPlan: '',
        removalHistory: []
      };
    }
    return initialData;
  });

  const [archTreatments, setArchTreatments] = useState({
    upper: [],
    lower: []
  });

  const showNotification = (message, type = 'info') => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} shadow-lg z-50 transition-opacity duration-300`;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="ml-3">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  };

  const handleToothClick = (id) => {
    setActiveTooth(id);
    
    if (activeProcedure) {
      if (activeProcedure.isRemovalProcedure) {
        const procedureToRemove = PROCEDURES.find(p => p.id === activeProcedure.removesProcedure);
        const targetStatus = procedureToRemove?.changesStatus;
        
        if (!targetStatus || chartData[id].status !== targetStatus) {
          showNotification(`${activeProcedure.name} can only be applied to teeth with ${procedureToRemove?.name}`, 'warning');
          return;
        }
      } else if (activeProcedure.requiresStatus && !activeProcedure.requiresStatus.includes(chartData[id].status)) {
        const allowedStatuses = activeProcedure.requiresStatus.map(s => 
          s === 'filled' ? 'filled/restored' :
          s === 'rct_treated' ? 'root canal treated' :
          s === 'crowned' ? 'crowned' :
          s === 'implanted' ? 'implanted' :
          s === 'braced' ? 'braced' :
          s === 'cleaned' ? 'cleaned' :
          s === 'extracted' ? 'extracted' :
          s === 'veneered' ? 'veneered' :
          s === 'whitened' ? 'whitened' : s
        ).join(', ');
        showNotification(`${activeProcedure.name} can only be applied to teeth with status: ${allowedStatuses}`, 'warning');
        return;
      }

      if (activeProcedure.allowedTeeth && !activeProcedure.allowedTeeth.includes(id)) {
        showNotification(`${activeProcedure.name} cannot be applied to tooth ${id}`, 'warning');
        return;
      }

      if (activeProcedure.allowedTargets === 'single') {
        setSelectedTeeth([id]);
      } else if (activeProcedure.allowedTargets === 'multiple') {
        setSelectedTeeth(prev => 
          prev.includes(id) 
            ? prev.filter(toothId => toothId !== id)
            : [...prev, id]
        );
      }
    }
  };

  const handleToothRightClick = (id) => {
    setActiveTooth(id);
    setActiveTab('measurements');
  };

  const toggleSurfaceSelection = (toothId, surfaceIdx) => {
    if (!activeProcedure?.surfaceBased) return;

    setSurfaceSelection(prev => {
      const toothSurfaces = prev[toothId] || [false, false, false];
      const newSurfaces = [...toothSurfaces];
      newSurfaces[surfaceIdx] = !newSurfaces[surfaceIdx];
      
      return {
        ...prev,
        [toothId]: newSurfaces
      };
    });
  };

  const applyProcedure = () => {
    if (!activeProcedure) return;
    
    let teethToApply = [...selectedTeeth];
    
    if (activeProcedure.allowedTargets === 'arch' && selectedArch) {
      if (selectedArch === 'upper') {
        teethToApply = Array.from({ length: 16 }, (_, i) => i + 1);
        if (activeProcedure.isRemovalProcedure) {
          if (activeProcedure.removesProcedure === 'ortho') {
            setArchTreatments(prev => ({
              ...prev,
              upper: prev.upper.filter(t => t !== 'braced')
            }));
          }
        } else if (!archTreatments.upper.includes(activeProcedure.changesStatus)) {
          setArchTreatments(prev => ({
            ...prev,
            upper: [...prev.upper, activeProcedure.changesStatus]
          }));
        }
      } else if (selectedArch === 'lower') {
        teethToApply = Array.from({ length: 16 }, (_, i) => i + 17);
        if (activeProcedure.isRemovalProcedure) {
          if (activeProcedure.removesProcedure === 'ortho') {
            setArchTreatments(prev => ({
              ...prev,
              lower: prev.lower.filter(t => t !== 'braced')
            }));
          }
        } else if (!archTreatments.lower.includes(activeProcedure.changesStatus)) {
          setArchTreatments(prev => ({
            ...prev,
            lower: [...prev.lower, activeProcedure.changesStatus]
          }));
        }
      } else if (selectedArch === 'both') {
        teethToApply = Array.from({ length: 32 }, (_, i) => i + 1);
        if (activeProcedure.isRemovalProcedure) {
          if (activeProcedure.removesProcedure === 'ortho') {
            setArchTreatments(prev => ({
              upper: prev.upper.filter(t => t !== 'braced'),
              lower: prev.lower.filter(t => t !== 'braced')
            }));
          }
        } else {
          if (!archTreatments.upper.includes(activeProcedure.changesStatus)) {
            setArchTreatments(prev => ({
              upper: [...prev.upper, activeProcedure.changesStatus],
              lower: [...prev.lower, activeProcedure.changesStatus]
            }));
          }
        }
      }
    }

    if (teethToApply.length === 0) {
      showNotification('Please select teeth or an arch first', 'warning');
      return;
    }

    const invalidTeeth = teethToApply.filter(toothId => {
      if (activeProcedure.requiresStatus && !activeProcedure.requiresStatus.includes(chartData[toothId].status)) {
        return true;
      }
      if (activeProcedure.allowedTeeth && !activeProcedure.allowedTeeth.includes(toothId)) {
        return true;
      }
      return false;
    });

    if (invalidTeeth.length > 0) {
      showNotification(`Cannot apply ${activeProcedure.name} to teeth: ${invalidTeeth.join(', ')}. Check requirements.`, 'warning');
      return;
    }

    const newData = { ...chartData };
    const now = new Date();
    const currentDate = now.toISOString();
    
    teethToApply.forEach(toothId => {
      const currentHistory = newData[toothId].procedureHistory || [];
      const timelineHistory = newData[toothId].timelineHistory || [];
      const removalHistory = newData[toothId].removalHistory || [];
      
      if (activeProcedure.isRemovalProcedure) {
        const originalProcedure = PROCEDURES.find(p => p.id === activeProcedure.removesProcedure);
        
        const originalApplication = timelineHistory.find(event => 
          event.type === 'applied' && event.procedureName === originalProcedure.name
        );
        
        let duration = null;
        if (originalApplication && originalApplication.date) {
          const originalDate = new Date(originalApplication.date);
          const durationMs = now - originalDate;
          const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
          const months = Math.floor(days / 30);
          const years = Math.floor(months / 12);
          
          if (years > 0) {
            duration = `${years} year${years > 1 ? 's' : ''}`;
          } else if (months > 0) {
            duration = `${months} month${months > 1 ? 's' : ''}`;
          } else {
            duration = `${days} day${days > 1 ? 's' : ''}`;
          }
        }
        
        const removalEvent = {
          type: 'removed',
          procedureName: originalProcedure.name,
          date: currentDate,
          removalReason: removalNotes || (skipRemovalNotes ? 'No documentation provided' : 'Routine removal'),
          shade: newData[toothId].toothShade,
          appliedDate: originalApplication?.date,
          duration: duration
        };
        
        timelineHistory.push(removalEvent);
        removalHistory.push(removalEvent);
        
        let newStatus = activeProcedure.changesStatus || 'healthy';
        
        if (activeProcedure.id === 'braces_removal') {
          newStatus = 'healthy';
        }
        
        if (activeProcedure.id === 'veneer_removal') {
          newStatus = 'healthy';
          newData[toothId].toothShade = null;
        }
        
        if (activeProcedure.id === 'filling_removal') {
          newStatus = 'healthy';
          newData[toothId].selectedSurfaces = null;
        }
        
        if (activeProcedure.id === 'crown_removal') {
          newStatus = 'filled';
        }
        
        newData[toothId] = {
          ...newData[toothId],
          status: newStatus,
          timelineHistory: timelineHistory,
          removalHistory: removalHistory,
          lastUpdated: currentDate
        };
        
      } else {
        const updatedHistory = [...currentHistory, activeProcedure.name];
        
        timelineHistory.push({
          type: 'applied',
          procedureName: activeProcedure.name,
          date: currentDate,
          notes: clinicalNote || '',
          shade: selectedShade,
          surfaces: surfaceSelection[toothId]
        });
        
        let newStatus = activeProcedure.changesStatus || chartData[toothId].status;
        if (activeProcedure.id === 'extraction') {
          newStatus = 'missing';
        }
        
        if (activeProcedure.id === 'implant' && (chartData[toothId].status === 'missing' || chartData[toothId].status === 'extracted')) {
          newStatus = 'implanted';
        }
        
        if (activeProcedure.id === 'cleaning') {
          newData[toothId].lastCleaned = new Date().toLocaleDateString();
        }
        
        newData[toothId] = {
          ...newData[toothId],
          status: newStatus,
          procedureHistory: updatedHistory,
          timelineHistory: timelineHistory,
          lastUpdated: currentDate
        };

        if (activeProcedure.surfaceBased) {
          newData[toothId].selectedSurfaces = surfaceSelection[toothId] || [false, false, false];
        }

        if (activeProcedure.requiresColorMatch && selectedShade) {
          newData[toothId].toothShade = selectedShade;
        }
      }
    });

    setChartData(newData);
    setSelectedTeeth([]);
    setSurfaceSelection({});
    setSelectedShade('');
    setSelectedArch('');
    setRemovalNotes('');
    setSkipRemovalNotes(false);
    
    showNotification(`${activeProcedure.name} applied to ${teethToApply.length} teeth`, 'success');
  };

  const saveClinicalNote = () => {
    setChartData(prev => ({
      ...prev,
      [activeTooth]: {
        ...prev[activeTooth],
        clinicalNote,
        lastUpdated: new Date().toISOString()
      }
    }));
    showNotification('Clinical note saved', 'success');
  };

  const saveSOAPNotes = () => {
    setChartData(prev => ({
      ...prev,
      [activeTooth]: {
        ...prev[activeTooth],
        soapNotes: { ...soapData },
        lastUpdated: new Date().toISOString()
      }
    }));
    showNotification('SOAP notes saved', 'success');
  };

  const getProcedureAbbr = (name) => {
    const abbrs = {
      'Teeth Cleaning': 'CL',
      'Filling': 'FL',
      'Root Canal': 'RC',
      'Crown': 'CR',
      'Veneer': 'VN',
      'Implant': 'IM',
      'Extraction': 'EX',
      'Orthodontic': 'BR',
      'Tooth Repair': 'RP',
      'Teeth Whitening': 'WH',
      'Braces Removal': 'BRM',
      'Veneer Removal': 'VRM',
      'Filling Removal': 'FRM',
      'Crown Removal': 'CRM'
    };
    return abbrs[name] || name.substring(0, 2);
  };

  const getTreatmentTimeline = () => {
    const timeline = chartData[activeTooth].timelineHistory || [];
    if (timeline.length === 0) return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2 text-gray-300">📋</div>
        <p>No treatment history recorded</p>
      </div>
    );
    
    const sortedTimeline = [...timeline].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return (
      <div className="space-y-3">
        {sortedTimeline.map((event, idx) => (
          <TimelineEvent key={idx} event={event} />
        ))}
      </div>
    );
  };

  const getAvailableRemovals = () => {
    const currentStatus = chartData[activeTooth].status;
    const removals = [];
    
    if (currentStatus === 'braced') {
      removals.push(PROCEDURES.find(p => p.id === 'braces_removal'));
    }
    if (currentStatus === 'veneered') {
      removals.push(PROCEDURES.find(p => p.id === 'veneer_removal'));
    }
    if (currentStatus === 'filled') {
      removals.push(PROCEDURES.find(p => p.id === 'filling_removal'));
    }
    if (currentStatus === 'crowned') {
      removals.push(PROCEDURES.find(p => p.id === 'crown_removal'));
    }
    
    return removals.filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clinical Dental Chart System</h1>
          <p className="text-gray-600 text-sm mt-1">Complete dental treatment tracking with procedure management</p>
        </header>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('measurements')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === 'measurements' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Measurements
                </button>
                <button
                  onClick={() => setActiveTab('procedures')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === 'procedures' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Treatment Planning
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === 'notes' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Clinical Notes
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === 'history' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  Treatment History
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-gray-700">Upper Jaw (Maxillary)</h3>
                    <ArchTreatmentIndicator arch="upper" treatments={archTreatments.upper} />
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Teeth 1-16
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map(id => (
                    <Tooth
                      key={id}
                      id={id}
                      data={chartData[id]}
                      active={activeTooth === id}
                      onClick={handleToothClick}
                      onRightClick={handleToothRightClick}
                      isUpper={true}
                      selectedForProcedure={selectedTeeth.includes(id)}
                      selectionMode={activeProcedure?.allowedTargets}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-gray-700">Lower Jaw (Mandibular)</h3>
                    <ArchTreatmentIndicator arch="lower" treatments={archTreatments.lower} />
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Teeth 17-32
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 16 }, (_, i) => i + 17).map(id => (
                    <Tooth
                      key={id}
                      id={id}
                      data={chartData[id]}
                      active={activeTooth === id}
                      onClick={handleToothClick}
                      onRightClick={handleToothRightClick}
                      isUpper={false}
                      selectedForProcedure={selectedTeeth.includes(id)}
                      selectionMode={activeProcedure?.allowedTargets}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Status Legend</h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ 
                          backgroundColor: colors.fill, 
                          borderColor: colors.stroke 
                        }}
                      />
                      <span className="text-xs text-gray-600 capitalize">
                        {status === 'rct_treated' ? 'Root Canal' :
                         status === 'crowned' ? 'Crown' :
                         status === 'implanted' ? 'Implant' :
                         status === 'braced' ? 'Braces' :
                         status === 'extracted' ? 'Extracted' :
                         status === 'veneered' ? 'Veneer' :
                         status === 'whitened' ? 'Whitened' : status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p><strong>Note:</strong> Arch-based treatments (Cleaning, Braces, Whitening) are shown next to jaw labels.</p>
                  <p><strong>R:</strong> Indicates treatment was recently removed (shown in history panel)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-96 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">Tooth {activeTooth}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {getToothType(activeTooth).toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className="text-sm font-medium capitalize">
                    {chartData[activeTooth].status === 'rct_treated' ? 'Root Canal Treated' :
                     chartData[activeTooth].status === 'crowned' ? 'Crowned' :
                     chartData[activeTooth].status === 'implanted' ? 'Implanted' :
                     chartData[activeTooth].status === 'braced' ? 'Braced' :
                     chartData[activeTooth].status === 'extracted' ? 'Extracted' :
                     chartData[activeTooth].status === 'veneered' ? 'Veneered' :
                     chartData[activeTooth].status === 'whitened' ? 'Whitened' : chartData[activeTooth].status}
                  </span>
                </div>
                {chartData[activeTooth].toothShade && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shade:</span>
                    <span className="text-sm font-medium">{chartData[activeTooth].toothShade}</span>
                  </div>
                )}
                {chartData[activeTooth].lastCleaned && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Cleaned:</span>
                    <span className="text-sm font-medium">{chartData[activeTooth].lastCleaned}</span>
                  </div>
                )}
                {chartData[activeTooth].mobility > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mobility:</span>
                    <span className="text-sm font-medium">M{chartData[activeTooth].mobility}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">PD Readings:</span>
                  <div className="flex gap-1">
                    {chartData[activeTooth].pd.map((val, i) => (
                      <span key={i} className={`text-xs font-bold px-1.5 py-0.5 rounded
                        ${val >= 4 ? 'bg-red-500 text-white' : 
                          val >= 3 ? 'bg-yellow-500 text-white' : 
                          'bg-green-500 text-white'}`}>
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Procedures: {chartData[activeTooth].procedureHistory?.length || 0}
                    {chartData[activeTooth].removalHistory?.length > 0 && (
                      <span className="ml-2 text-yellow-600">({chartData[activeTooth].removalHistory.length} removed)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 max-h-[600px] overflow-y-auto">
              {activeTab === 'measurements' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Measurements</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Pocket Depth (mm)</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="relative">
                          <input 
                            type="number" 
                            min="0" 
                            max="10"
                            step="0.5"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-center font-bold text-lg 
                              focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200
                              hover:border-gray-300"
                            value={chartData[activeTooth].pd[i]}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setChartData(prev => ({
                                ...prev,
                                [activeTooth]: { 
                                  ...prev[activeTooth], 
                                  pd: prev[activeTooth].pd.map((v, idx) => idx === i ? val : v) 
                                }
                              }));
                            }}
                          />
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 bg-gray-100 rounded">
                            {['M', 'B', 'D'][i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                      <select
                        value={chartData[activeTooth].status}
                        onChange={(e) => setChartData(prev => ({
                          ...prev,
                          [activeTooth]: { ...prev[activeTooth], status: e.target.value }
                        }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200"
                      >
                        {Object.entries(STATUS_COLORS).map(([key]) => (
                          <option key={key} value={key} className="capitalize">
                            {key === 'rct_treated' ? 'Root Canal Treated' :
                             key === 'crowned' ? 'Crowned' :
                             key === 'implanted' ? 'Implanted' :
                             key === 'braced' ? 'Braces' :
                             key === 'extracted' ? 'Extracted' :
                             key === 'veneered' ? 'Veneer' :
                             key === 'whitened' ? 'Whitened' : key}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Mobility</label>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map(level => (
                          <button
                            key={level}
                            onClick={() => setChartData(prev => ({
                              ...prev,
                              [activeTooth]: { ...prev[activeTooth], mobility: level }
                            }))}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200
                              ${chartData[activeTooth].mobility === level 
                                ? 'bg-red-50 border-red-300 text-red-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                          >
                            M{level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Bleeding Points</label>
                    <div className="flex gap-2">
                      {['M', 'B', 'D'].map((label, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const newBleeding = [...chartData[activeTooth].bleeding];
                            newBleeding[i] = !newBleeding[i];
                            setChartData(prev => ({
                              ...prev,
                              [activeTooth]: { ...prev[activeTooth], bleeding: newBleeding }
                            }));
                          }}
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1
                            ${chartData[activeTooth].bleeding[i] 
                              ? 'bg-red-50 border-red-300 text-red-700' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                        >
                          {label} {chartData[activeTooth].bleeding[i] && <span className="text-red-500">•</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setChartData(prev => ({
                        ...prev,
                        [activeTooth]: { 
                          ...prev[activeTooth], 
                          bleeding: [false, false, false],
                          lastCleaned: new Date().toLocaleDateString()
                        }
                      }))}
                      className="py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      Mark as Cleaned
                    </button>
                    <button
                      onClick={() => {
                        const newStatus = chartData[activeTooth].status === 'missing' ? 'healthy' : 'missing';
                        setChartData(prev => ({
                          ...prev,
                          [activeTooth]: { ...prev[activeTooth], status: newStatus }
                        }));
                      }}
                      className="py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      {chartData[activeTooth].status === 'missing' ? 'Mark Present' : 'Mark Missing'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'procedures' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Treatment Planning</h3>
                  
                  {getAvailableRemovals().length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-bold text-yellow-800 mb-2">Available Removal Procedures</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableRemovals().map(proc => (
                          <button
                            key={proc.id}
                            onClick={() => {
                              setActiveProcedure(proc);
                              setSelectedTeeth([activeTooth]);
                              setRemovalNotes('');
                              setSkipRemovalNotes(false);
                            }}
                            className="px-3 py-1.5 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-medium rounded-lg hover:bg-yellow-200 transition-all duration-200"
                          >
                            {proc.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Select Procedure</label>
                    <div className="grid grid-cols-5 gap-1 mb-4">
                      {PROCEDURES.map(proc => (
                        <button
                          key={proc.id}
                          onClick={() => {
                            setActiveProcedure(proc);
                            setSelectedTeeth([]);
                            setSurfaceSelection({});
                            setSelectedArch('');
                            setSelectedShade('');
                            setRemovalNotes('');
                            setSkipRemovalNotes(false);
                          }}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-colors duration-200
                            ${activeProcedure?.id === proc.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'}`}
                          style={activeProcedure?.id === proc.id ? { 
                            borderColor: proc.color,
                            backgroundColor: `${proc.color}15`
                          } : {}}
                          title={`${proc.description}\nRequires: ${proc.requiresStatus ? proc.requiresStatus.map(s => 
                            s === 'filled' ? 'filled/restored' :
                            s === 'rct_treated' ? 'root canal treated' :
                            s === 'crowned' ? 'crowned' :
                            s === 'implanted' ? 'implanted' :
                            s === 'braced' ? 'braces' :
                            s === 'cleaned' ? 'cleaned' :
                            s === 'extracted' ? 'extracted' :
                            s === 'veneered' ? 'veneered' :
                            s === 'whitened' ? 'whitened' : s
                          ).join(', ') : 'Any status'}`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                               style={{ 
                                 backgroundColor: `${proc.color}20`, 
                                 color: proc.color 
                               }}>
                            {getProcedureAbbr(proc.name)}
                          </div>
                          <span className="text-[10px] text-gray-700 text-center leading-tight">
                            {proc.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeProcedure && (
                    <>
                      <div className="p-3 rounded-lg mb-3" style={{ 
                        backgroundColor: `${activeProcedure.color}10`,
                        border: `1px solid ${activeProcedure.color}30`
                      }}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">{activeProcedure.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{activeProcedure.description}</p>
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" 
                               style={{ 
                                 backgroundColor: `${activeProcedure.color}20`, 
                                 color: activeProcedure.color 
                               }}>
                            {activeProcedure.isRemovalProcedure ? 'Removal' :
                             activeProcedure.allowedTargets === 'arch' ? 'Arch-based' : 
                             activeProcedure.allowedTargets === 'multiple' ? 'Multi-tooth' : 
                             'Single tooth'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Requires:</strong> {activeProcedure.requiresStatus ? 
                            activeProcedure.requiresStatus.map(s => 
                              s === 'filled' ? 'filled/restored' :
                              s === 'rct_treated' ? 'root canal treated' :
                              s === 'crowned' ? 'crowned' :
                              s === 'implanted' ? 'implanted' :
                              s === 'braced' ? 'braces' :
                              s === 'cleaned' ? 'cleaned' :
                              s === 'extracted' ? 'extracted' :
                              s === 'veneered' ? 'veneered' :
                              s === 'whitened' ? 'whitened' : s
                            ).join(', ') : 'Any status'}
                        </div>
                      </div>

                      {activeProcedure.isRemovalProcedure && (
                        <RemovalNotes
                          notes={removalNotes}
                          onNotesChange={setRemovalNotes}
                          onSkip={() => setSkipRemovalNotes(true)}
                        />
                      )}

                      {activeProcedure.allowedTargets === 'arch' && (
                        <ArchSelector
                          selectedArch={selectedArch}
                          onArchChange={setSelectedArch}
                        />
                      )}

                      {activeProcedure.requiresColorMatch && !activeProcedure.isRemovalProcedure && (
                        <ColorMatchingSelector
                          selectedShade={selectedShade}
                          onShadeChange={setSelectedShade}
                        />
                      )}

                      {activeProcedure.surfaceBased && activeProcedure.allowedTargets !== 'arch' && (
                        <SurfaceSelector
                          toothId={activeTooth}
                          data={chartData[activeTooth]}
                          onSurfaceToggle={toggleSurfaceSelection}
                          toothType={getToothType(activeTooth)}
                        />
                      )}

                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {activeProcedure.allowedTargets === 'arch' ? 'Selected Arch:' : 'Selected Teeth:'}
                        </div>
                        {activeProcedure.allowedTargets === 'arch' && selectedArch ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedArch === 'upper' && Array.from({ length: 16 }, (_, i) => i + 1).slice(0, 8).map(id => (
                              <div key={id} className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                <span className="text-xs font-bold text-green-700">{id}</span>
                              </div>
                            ))}
                            {selectedArch === 'lower' && Array.from({ length: 16 }, (_, i) => i + 17).slice(0, 8).map(id => (
                              <div key={id} className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                <span className="text-xs font-bold text-green-700">{id}</span>
                              </div>
                            ))}
                            {selectedArch === 'both' && Array.from({ length: 32 }, (_, i) => i + 1).slice(0, 8).map(id => (
                              <div key={id} className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                <span className="text-xs font-bold text-green-700">{id}</span>
                              </div>
                            ))}
                          </div>
                        ) : selectedTeeth.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedTeeth.map(id => (
                              <div key={id} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                <span className="text-xs font-bold text-blue-700">{id}</span>
                                {activeProcedure.surfaceBased && surfaceSelection[id] && (
                                  <div className="flex gap-0.5">
                                    {surfaceSelection[id].map((selected, idx) => selected && (
                                      <span key={idx} className="text-[9px] font-bold bg-yellow-500 text-white px-1 rounded">
                                        {SURFACE_LABELS[idx]}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <button
                                  onClick={() => setSelectedTeeth(prev => prev.filter(t => t !== id))}
                                  className="text-xs text-red-500 hover:text-red-700 ml-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            {activeProcedure.allowedTargets === 'arch' 
                              ? 'Select an arch above' 
                              : 'Click teeth on the chart to select'}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={applyProcedure}
                          disabled={(activeProcedure.allowedTargets === 'arch' && !selectedArch) || 
                                   (activeProcedure.allowedTargets !== 'arch' && selectedTeeth.length === 0)}
                          className="flex-1 py-2 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ 
                            backgroundColor: activeProcedure.isRemovalProcedure ? '#f59e0b' : activeProcedure.color 
                          }}
                        >
                          {activeProcedure.isRemovalProcedure ? 'Remove Procedure' : `Apply ${activeProcedure.name}`}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeeth([]);
                            setSurfaceSelection({});
                            setSelectedArch('');
                            setSelectedShade('');
                            setRemovalNotes('');
                            setSkipRemovalNotes(false);
                          }}
                          className="px-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Clinical Notes</h3>
                  
                  <div className="space-y-3">
                    {['Subjective', 'Objective', 'Assessment', 'Plan'].map((section, index) => {
                      const key = section.toLowerCase();
                      return (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">{section}</label>
                          <textarea
                            value={soapData[key]}
                            onChange={(e) => setSoapData(prev => ({
                              ...prev,
                              [key]: e.target.value
                            }))}
                            placeholder={`${section} notes...`}
                            className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 resize-none"
                          />
                        </div>
                      );
                    })}
                    
                    <button
                      onClick={saveSOAPNotes}
                      className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      Save SOAP Notes
                    </button>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">General Clinical Note</label>
                    <textarea
                      value={clinicalNote}
                      onChange={(e) => setClinicalNote(e.target.value)}
                      placeholder="Additional clinical observations, patient concerns, follow-up instructions..."
                      className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 resize-none"
                    />
                    <button
                      onClick={saveClinicalNote}
                      className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 mt-2"
                    >
                      Save Clinical Note
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Treatment Timeline - Tooth {activeTooth}</h3>
                  
                  <div className="space-y-4">
                    {getTreatmentTimeline()}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Current Status Summary</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>Status:</strong> <span className="capitalize">{chartData[activeTooth].status}</span></div>
                        {chartData[activeTooth].toothShade && <div><strong>Shade:</strong> {chartData[activeTooth].toothShade}</div>}
                        {chartData[activeTooth].lastCleaned && <div><strong>Last Cleaning:</strong> {chartData[activeTooth].lastCleaned}</div>}
                        {chartData[activeTooth].lastUpdated && (
                          <div><strong>Last Updated:</strong> {new Date(chartData[activeTooth].lastUpdated).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (window.confirm('Reset this tooth to healthy state? This will clear all treatment history.')) {
                            setChartData(prev => ({
                              ...prev,
                              [activeTooth]: {
                                pd: [2, 2, 2],
                                bleeding: [false, false, false],
                                mobility: 0,
                                status: 'healthy',
                                procedureHistory: [],
                                timelineHistory: [],
                                removalHistory: [],
                                selectedSurfaces: null,
                                clinicalNote: '',
                                soapNotes: null,
                                toothShade: null,
                                lastCleaned: null,
                                nextAppointment: null,
                                diagnosis: '',
                                prognosis: '',
                                treatmentPlan: ''
                              }
                            }));
                            setArchTreatments(prev => ({
                              upper: prev.upper.filter(t => {
                                const toothId = activeTooth;
                                const isUpper = toothId <= 16;
                                return !(isUpper && chartData[toothId].status === 'braced' || chartData[toothId].status === 'cleaned' || chartData[toothId].status === 'whitened');
                              }),
                              lower: prev.lower.filter(t => {
                                const toothId = activeTooth;
                                const isLower = toothId >= 17;
                                return !(isLower && chartData[toothId].status === 'braced' || chartData[toothId].status === 'cleaned' || chartData[toothId].status === 'whitened');
                              })
                            }));
                          }
                        }}
                        className="py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200"
                      >
                        Reset Tooth History
                      </button>
                      <button
                        onClick={() => {
                          const timeline = chartData[activeTooth].timelineHistory || [];
                          if (timeline.length === 0) {
                            showNotification('No history to export', 'info');
                            return;
                          }
                          
                          const exportText = `Tooth ${activeTooth} Treatment History\n\n` +
                            timeline.map(event => {
                              const date = new Date(event.date).toLocaleString();
                              return `${date} - ${event.type === 'applied' ? 'Applied' : 'Removed'}: ${event.procedureName}\n` +
                                     (event.notes ? `   Notes: ${event.notes}\n` : '') +
                                     (event.removalReason ? `   Removal Reason: ${event.removalReason}\n` : '') +
                                     (event.shade ? `   Shade: ${event.shade}\n` : '') +
                                     (event.duration ? `   Duration: ${event.duration}\n` : '');
                            }).join('\n');
                          
                          const blob = new Blob([exportText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `tooth-${activeTooth}-history-${new Date().toISOString().split('T')[0]}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          showNotification('History exported successfully', 'success');
                        }}
                        className="py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                      >
                        Export History
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p><span className="font-medium text-gray-600">Click</span> to select tooth / apply treatment</p>
          <p><span className="font-medium text-gray-600">Right-click</span> to open measurements panel</p>
          <p><span className="font-medium text-gray-600">Removal procedures</span> available for braces, veneers, fillings, and crowns</p>
          <p><span className="font-medium text-gray-600">R</span> indicates recently removed procedures in history</p>
        </div>
      </div>
    </div>
  );
};

export default DentalChart;