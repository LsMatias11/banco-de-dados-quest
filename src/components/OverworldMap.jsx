import React from 'react';
import { MAP_NODES } from '../data/gameData';
import { Award } from 'lucide-react';

export default function OverworldMap({ teams, activeTeam }) {
  // Coordenadas exatas em SVG (viewBox 0 0 600 480)
  const nodeCoords = {
    1: { x: 80, y: 65, label: '1' },
    2: { x: 190, y: 65, label: '2' },
    3: { x: 300, y: 65, label: '★3', isBadge: true, title: 'Tuplas' },
    4: { x: 410, y: 65, label: '4' },
    5: { x: 520, y: 65, label: '5' },

    6: { x: 520, y: 225, label: '★6', isBadge: true, title: 'Aridade' },
    7: { x: 410, y: 225, label: '7' },
    8: { x: 300, y: 225, label: '8' },
    9: { x: 190, y: 225, label: '★9', isBadge: true, title: '1FN-BCNF' },
    10: { x: 80, y: 225, label: '10' },

    11: { x: 80, y: 385, label: '11' },
    12: { x: 190, y: 385, label: '★12', isBadge: true, title: 'RelVars' },
    13: { x: 300, y: 385, label: '13' },
    14: { x: 410, y: 385, label: '14' },
    15: { x: 520, y: 385, label: 'FINISH', isFinish: true }
  };

  const pathD = "M 80,65 L 520,65 C 590,65 590,225 520,225 L 80,225 C 10,225 10,385 80,385 L 520,385";

  // Agrupar equipes por nó
  const teamsByNode = {};
  (teams || []).forEach((team) => {
    const pos = Math.min(15, Math.max(1, team.position || 1));
    if (!teamsByNode[pos]) teamsByNode[pos] = [];
    teamsByNode[pos].push(team);
  });

  return (
    <section className="lg:col-span-5 flex flex-col gap-4" data-purpose="overworld-tactical-map">
      <div className="glass-panel rounded-3xl p-4 lg:p-5 border-cyan-500/40 shadow-2xl relative flex flex-col justify-between flex-1 overflow-hidden min-h-[440px] lg:min-h-[660px] bg-slate-900/90">
        
        {/* Glow ambient background */}
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-arcade-cyan/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-arcade-magenta/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-arcade-cyan shadow-glow-cyan animate-pulse"></div>
            <div>
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                MAPA OVERWORLD SCI-FI
                <span className="text-[10px] font-mono text-arcade-cyan bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  4 ROVERS DE EQUIPES
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 font-bold shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              BADGES (3, 6, 9, 12, 15)
            </span>
          </div>
        </div>

        {/* 4 Section Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-mono font-bold my-2 relative z-10">
          <div className="px-2 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center gap-1 truncate shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>S1: Álgebra (1-5)
          </div>
          <div className="px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center gap-1 truncate shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>S2: Normal (6-10)
          </div>
          <div className="px-2 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center gap-1 truncate shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>S3: RelVars (11-14)
          </div>
          <div className="px-2 py-1 rounded-lg bg-pink-950/70 border border-pink-500/40 text-pink-300 flex items-center gap-1 truncate shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>S4: Commit (15)
          </div>
        </div>

        {/* SVG Tabletop Canvas */}
        <div className="relative w-full flex-1 min-h-[350px] lg:min-h-[480px] bg-arcade-darkest/95 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-inner flex items-center justify-center p-2">
          
          <svg className="w-full h-full max-h-[520px]" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="mapGlowGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00f5ff"></stop>
                <stop offset="35%" stopColor="#ffb703"></stop>
                <stop offset="70%" stopColor="#9d4edd"></stop>
                <stop offset="100%" stopColor="#ff007f"></stop>
              </linearGradient>
            </defs>

            {/* Grid background dots */}
            <pattern id="gridDots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="#00f5ff" opacity="0.15" />
            </pattern>
            <rect width="600" height="480" fill="url(#gridDots)" />

            {/* Landmarks Text Pins */}
            <g fontFont="Space Mono" fontSize="9" fontWeight="bold">
              <text x="490" y="32" fill="#38bdf8" opacity="0.8">🏛️ Pilar de Codd</text>
              <text x="25" y="195" fill="#f59e0b" opacity="0.8">⚠️ Anomalia 2FN</text>
              <text x="490" y="355" fill="#c084fc" opacity="0.8">⚡ Fenda Deadlock</text>
              <text x="25" y="455" fill="#f43f5e" opacity="0.8">🔬 Reator WAL ACID</text>
            </g>

            {/* Main Neon Serpentine Path Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#1e293b"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#00f5ff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="10 6"
              className="filter drop-shadow-[0_0_10px_rgba(0,245,255,0.9)]"
            />

            {/* Render ALL 15 Nodes */}
            {MAP_NODES.map((node) => {
              const info = nodeCoords[node.id];
              if (!info) return null;

              if (info.isFinish) {
                return (
                  <g key={node.id} transform={`translate(${info.x}, ${info.y})`}>
                    <rect x="-24" y="-24" width="48" height="48" rx="14" fill="url(#mapGlowGradient)" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                    <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontFamily="Orbitron" fontSize="9" fontWeight="900">COMMIT</text>
                    <text x="0" y="10" textAnchor="middle" fill="#ffd166" fontFamily="Space Mono" fontSize="8" fontWeight="bold">★15 FINISH</text>
                  </g>
                );
              }

              if (info.isBadge) {
                return (
                  <g key={node.id} transform={`translate(${info.x}, ${info.y})`}>
                    <rect x="-20" y="-20" width="40" height="40" rx="12" fill="#f59e0b" stroke="#fff" strokeWidth="2" className="filter drop-shadow-[0_0_10px_rgba(255,183,3,0.8)]" />
                    <text x="0" y="4" textAnchor="middle" fill="#050713" fontFamily="Orbitron" fontSize="12" fontWeight="900">{info.label}</text>
                    <text x="0" y="28" textAnchor="middle" fill="#ffd166" fontFamily="Space Mono" fontSize="9" fontWeight="bold">{info.title}</text>
                  </g>
                );
              }

              return (
                <g key={node.id} transform={`translate(${info.x}, ${info.y})`}>
                  <rect x="-18" y="-18" width="36" height="36" rx="10" fill="#121a3b" stroke="#334155" strokeWidth="1.5" />
                  <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontFamily="Orbitron" fontSize="11" fontWeight="bold">{node.id}</text>
                </g>
              );
            })}

            {/* RENDERIZAR OS ROVERS FUTURISTAS CENTRADOS PARA TODAS AS EQUIPES NO MAPA */}
            {Object.entries(teamsByNode).map(([nodeId, teamsAtThisNode]) => {
              const info = nodeCoords[nodeId];
              if (!info) return null;

              return teamsAtThisNode.map((team, index) => {
                const isCurrent = activeTeam?.id === team.id;
                return (
                  <FuturisticRover
                    key={team.id}
                    team={team}
                    isCurrent={isCurrent}
                    x={info.x}
                    y={info.y}
                    offsetIndex={index}
                    totalAtNode={teamsAtThisNode.length}
                  />
                );
              });
            })}

          </svg>
        </div>

        {/* Map Bottom Status Widgets */}
        <div className="mt-3 pt-2.5 border-t border-cyan-500/20 grid grid-cols-3 gap-2 text-xs relative z-10">
          <div className="bg-arcade-darkest/70 border border-cyan-500/30 rounded-xl p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
            <div className="min-w-0">
              <div className="text-[8px] font-mono text-slate-400 uppercase">Motor ACID</div>
              <div className="text-[11px] font-display font-bold text-emerald-300 truncate">100% Estável</div>
            </div>
          </div>

          <div className="bg-arcade-darkest/70 border border-cyan-500/30 rounded-xl p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-arcade-cyan shrink-0"></div>
            <div className="min-w-0">
              <div className="text-[8px] font-mono text-slate-400 uppercase">Rovers Ativos</div>
              <div className="text-[11px] font-display font-bold text-cyan-300 truncate">4 Equipes no Nó {activeTeam?.position || 1}</div>
            </div>
          </div>

          <div className="bg-arcade-darkest/70 border border-amber-500/30 rounded-xl p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></div>
            <div className="min-w-0">
              <div className="text-[8px] font-mono text-slate-400 uppercase">Próximo Checkpoint</div>
              <div className="text-[11px] font-display font-bold text-amber-300 truncate">Nó 3 (Tuplas)</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Componente do Carrinho/Rover Futurista 100% Centralizado Simetricamente
function FuturisticRover({ team, isCurrent, x, y, offsetIndex, totalAtNode }) {
  // Quando múltiplas equipes estão no mesmo nó (ex: Nó 1 no início), organiza em um arranjo 2x2 sem sobrepor
  let offsetX = 0;
  let offsetY = 0;

  if (totalAtNode > 1) {
    // Grade 2x2 simétrica em torno do nó
    const offsets = [
      { x: -14, y: -14 },
      { x: 14, y: -14 },
      { x: -14, y: 14 },
      { x: 14, y: 14 }
    ];
    const pos = offsets[offsetIndex % 4];
    offsetX = pos.x;
    offsetY = pos.y;
  }

  const teamColor = team.color || '#00f5ff';

  return (
    <g
      transform={`translate(${x + offsetX}, ${y + offsetY})`}
      className="transition-all duration-700 ease-out z-30 pointer-events-auto"
    >
      {/* Glow de pulso se for a equipe ativa */}
      {isCurrent && (
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="none"
          stroke={teamColor}
          strokeWidth="2"
          opacity="0.7"
          className="animate-ping"
        />
      )}

      {/* Container Card 3D Perfeitamente Centralizado em (0, 0) */}
      <rect
        x="-22"
        y="-22"
        width="44"
        height="44"
        rx="12"
        fill="#070b1a"
        stroke={teamColor}
        strokeWidth={isCurrent ? "2.5" : "1.5"}
        className={`filter ${isCurrent ? 'drop-shadow-[0_0_12px_rgba(0,245,255,0.9)]' : 'drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]'}`}
      />

      {/* VETOR DO CARRINHO FUTURISTA 100% CENTRALIZADO SIMETRICAMENTE EM (0,0) */}
      <g className={isCurrent ? "rover-anim" : ""}>
        {/* Rastro de luz de propulsão sci-fi */}
        <ellipse cx="0" cy="11" rx="9" ry="2.5" fill={teamColor} opacity="0.45" className="animate-pulse" />

        {/* Lataria Principal do Rover */}
        <path
          d="M -9 5 C -10 0, -7.5 -4.5, -4.5 -5.5 L 4.5 -5.5 C 7.5 -4.5, 10 0, 9 5 L 7.5 9 C 7 10, 5 10.5, 3 10.5 L -3 10.5 C -5 10.5, -7 10, -7.5 9 Z"
          fill="#0a142c"
          stroke={teamColor}
          strokeWidth="1.6"
        />

        {/* Cabine de Vidro Futurista */}
        <path
          d="M -4.5 -5.5 L -2.5 -9.5 C -2 -10.5, -0.5 -11, 0.5 -11 L 0.5 -11 C 1.5 -11, 3 -10.5, 3.5 -9.5 L 5.5 -5.5 Z"
          fill={teamColor}
          fillOpacity="0.5"
          stroke={teamColor}
          strokeWidth="1.2"
        />

        {/* Asas laterais Mag-Lev */}
        <rect x="-12" y="-1" width="3" height="7" rx="1" fill={teamColor} opacity="0.9" />
        <rect x="9" y="-1" width="3" height="7" rx="1" fill={teamColor} opacity="0.9" />

        {/* Farol LED Dianteiro */}
        <line x1="-5.5" y1="7.5" x2="5.5" y2="7.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

        {/* Antena com Sinalizador Pulsante */}
        <line x1="4.5" y1="-10" x2="7.5" y2="-14" stroke={teamColor} strokeWidth="1.5" />
        <circle cx="7.5" cy="-14" r="2" fill="#ff007f" className="animate-ping" />
      </g>

      {/* Pill Badge do Nome da Equipe em Cima do Rover */}
      <g transform="translate(0, -32)">
        <rect
          x="-42"
          y="-9"
          width="84"
          height="16"
          rx="8"
          fill={teamColor}
          stroke="#ffffff"
          strokeWidth="1"
          className="shadow-md"
        />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fill="#050713"
          fontFamily="Orbitron"
          fontSize="7.5"
          fontWeight="900"
        >
          {team.name.toUpperCase()}
        </text>
      </g>
    </g>
  );
}
