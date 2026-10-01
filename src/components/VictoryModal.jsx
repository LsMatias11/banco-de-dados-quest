import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Award, RotateCcw, CheckCircle2, Sparkles, Share2, 
  FileText, Star, X, Check, ArrowRight, ShieldCheck, Zap, Database
} from 'lucide-react';
import { BINGO_BADGES } from '../data/gameData';

export default function VictoryModal({ winner, teams = [], onReset }) {
  if (!winner) return null;

  const [copied, setCopied] = useState(false);
  const [showPedagogicalReport, setShowPedagogicalReport] = useState(false);

  // Disparo de celebração ao abrir
  useEffect(() => {
    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 }
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.4 }
        });
      }, 700);
      return () => clearTimeout(timer);
    } catch (e) {}
  }, []);

  const triggerConfettiBurst = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  // Normalização da equipe campeã
  const winningTeam = typeof winner === 'object' ? winner : teams.find((t) => t.id === winner) || teams[0] || {};
  const winningGrid = winningTeam.bingoGrid || [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ];

  // Identificar linhas/colunas/diagonais completas no Bingo
  const isWinningCell = (r, c) => {
    if (!winningGrid[r] || !winningGrid[r][c]) return false;
    const rowFull = winningGrid[r][0] && winningGrid[r][1] && winningGrid[r][2];
    const colFull = winningGrid[0][c] && winningGrid[1][c] && winningGrid[2][c];
    const diag1 = r === c && winningGrid[0][0] && winningGrid[1][1] && winningGrid[2][2];
    const diag2 = r + c === 2 && winningGrid[0][2] && winningGrid[1][1] && winningGrid[2][0];
    return rowFull || colFull || diag1 || diag2;
  };

  // Badges conquistados pelo campeão
  const badgesUnlockedCount = winningGrid.flat().filter(Boolean).length;

  // Ordenação de equipes para o placar consolidado (1º a 4º)
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.id === winningTeam.id) return -1;
    if (b.id === winningTeam.id) return 1;
    if (b.position !== a.position) return b.position - a.position;
    return (b.credits || 0) - (a.credits || 0);
  });

  // MVPs / Membros em destaque
  const rawMembers = winningTeam.members && winningTeam.members.length > 0
    ? winningTeam.members.map((m) => (typeof m === 'string' ? m : m.name))
    : ['Lucas Silva', 'Mariana Costa', 'Carlos Eduardo'];

  const mvps = [
    { name: rawMembers[0] || 'Líder Relacional', rank: '1º', medal: 'OURO', score: '100% DE PRECISÃO', badge: 'Mestre das Tuplas & Círculo Perfeito' },
    { name: rawMembers[1] || 'Arquiteto de Dados', rank: '2º', medal: 'PRATA', score: '91.6% DE PRECISÃO', badge: 'Especialista em Normalização & 1FN' },
    { name: rawMembers[2] || 'Engenheiro ACID', rank: '3º', medal: 'BRONZE', score: '83.3% DE PRECISÃO', badge: 'Guardião ACID & Transações' }
  ];

  const handleShare = () => {
    const text = `🏆 Vitória Relacional no BD Quest!\nA Equipe ${winningTeam.name || 'Alfa'} conquistou o 1º Lugar com ${winningTeam.credits || 2850} PTS e completou o Bingo Relacional (C.J. Date)!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/92 backdrop-blur-2xl selection:bg-pink-500 selection:text-white antialiased animate-fade-in">
      {/* AURORA & GLOW BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Sunburst Giratório */}
        <div 
          className="absolute w-[1200px] h-[1200px] opacity-25 pointer-events-none animate-spin"
          style={{ 
            animationDuration: '32s',
            background: 'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(0, 245, 255, 0.4) 20deg 35deg, transparent 35deg 60deg, rgba(255, 209, 102, 0.5) 60deg 75deg, transparent 75deg 100deg, rgba(255, 0, 127, 0.4) 100deg 115deg, transparent 115deg 150deg, rgba(0, 245, 255, 0.45) 150deg 165deg, transparent 165deg 200deg, rgba(255, 209, 102, 0.5) 200deg 215deg, transparent 215deg 250deg, rgba(255, 0, 127, 0.4) 250deg 265deg, transparent 265deg 300deg, rgba(0, 245, 255, 0.45) 300deg 315deg, transparent 315deg 360deg)' 
          }} 
        />
        {/* Aurora Cósmica Pulsante */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-amber-400/25 to-pink-500/20 blur-[120px] animate-pulse" />
      </div>

      {/* CONTAINER PRINCIPAL DO MODAL */}
      <div className="relative z-10 w-full max-w-6xl my-auto rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 border-2 border-cyan-400/70 shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Borda Superior Holográfica Neon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-amber-300 via-pink-500 to-cyan-400 animate-pulse" />

        {/* ========================================================================= */}
        {/* HEADER / BANNER DE VITÓRIA & TROFÉU C.J. DATE                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center relative z-10 pt-1 pb-3">
          
          {/* Troféu Monumental 3D */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Halo de Luz e Energia */}
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/35 to-cyan-400/30 blur-3xl animate-pulse pointer-events-none" />
            
            <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center filter drop-shadow-[0_0_35px_rgba(255,209,102,0.9)] animate-bounce" style={{ animationDuration: '3.6s' }}>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="coreDatabaseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#dbfcff" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#00f5ff" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#006970" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#002022" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="goldLuxPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="18%" stopColor="#fff2b2" />
                    <stop offset="42%" stopColor="#ffd166" />
                    <stop offset="70%" stopColor="#e5a100" />
                    <stop offset="88%" stopColor="#a16207" />
                    <stop offset="100%" stopColor="#451a03" />
                  </linearGradient>
                  <linearGradient id="darkMetalPlinth" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#090d1f" />
                    <stop offset="30%" stopColor="#1d2440" />
                    <stop offset="50%" stopColor="#2e3a63" />
                    <stop offset="70%" stopColor="#1d2440" />
                    <stop offset="100%" stopColor="#060914" />
                  </linearGradient>
                  <linearGradient id="cyanRingGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="50%" stopColor="#7df4ff" />
                    <stop offset="100%" stopColor="#0099b8" />
                  </linearGradient>
                  <linearGradient id="goldWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffae0" />
                    <stop offset="30%" stopColor="#ffd166" />
                    <stop offset="75%" stopColor="#ca8a04" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>

                {/* Feixes e faíscas cósmicas */}
                <g opacity="0.75">
                  <path d="M110 5 L110 215" stroke="rgba(255,209,102,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M5 110 L215 110" stroke="rgba(0,245,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                  <polygon points="110,4 113,14 123,17 113,20 110,30 107,20 97,17 107,14" fill="#ffd166" opacity="0.9" />
                  <polygon points="32,70 34,76 40,78 34,80 32,86 30,80 24,78 30,76" fill="#00f5ff" opacity="0.85" />
                  <polygon points="188,72 190,78 196,80 190,82 188,88 186,82 180,80 186,78" fill="#ffd166" opacity="0.85" />
                </g>

                {/* Anéis Orbitais Tridimensionais */}
                <g>
                  <ellipse cx="110" cy="96" rx="98" ry="34" stroke="url(#cyanRingGlow)" strokeWidth="2.2" strokeDasharray="10 6" transform="rotate(-16 110 96)" opacity="0.85" />
                  <ellipse cx="110" cy="96" rx="88" ry="26" stroke="#ffd166" strokeWidth="1.8" strokeDasharray="6 4" transform="rotate(18 110 96)" opacity="0.8" />
                  <circle cx="24" cy="78" r="4.5" fill="#00f5ff" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="194" cy="116" r="4" fill="#ffd166" stroke="#ffffff" strokeWidth="1.5" />
                </g>

                {/* Asas Geométricas do Troféu */}
                <g>
                  <path d="M62 52 C32 46 16 78 34 116 C44 136 64 140 76 132 C78 128 72 120 64 116 C48 108 38 88 56 68 C64 58 72 56 76 56 Z" fill="url(#goldWingGrad)" stroke="#fff7d6" strokeWidth="1.5" />
                  <path d="M48 76 C40 92 46 108 58 114" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M158 52 C188 46 204 78 186 116 C176 136 156 140 144 132 C142 128 148 120 156 116 C172 108 182 88 164 68 C156 58 148 56 144 56 Z" fill="url(#goldWingGrad)" stroke="#fff7d6" strokeWidth="1.5" />
                  <path d="M172 76 C180 92 174 108 162 114" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                </g>

                {/* Cálice Principal em Ouro 3D */}
                <g>
                  <path d="M66 40 C66 40 62 108 110 134 C158 108 154 40 154 40 C140 45 125 48 110 48 C95 48 80 45 66 40 Z" fill="url(#goldLuxPrimary)" stroke="#ffffff" strokeWidth="2" />
                  <ellipse cx="110" cy="40" rx="44" ry="11" fill="url(#goldLuxPrimary)" stroke="#ffffff" strokeWidth="2" />
                  <ellipse cx="110" cy="40" rx="37" ry="7.5" fill="#171f33" stroke="#ffd166" strokeWidth="1.5" />
                  <path d="M74 46 C75 88 100 120 110 126 C120 120 145 88 146 46" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
                </g>

                {/* Holográfico Central: Banco de Dados Relacional R[A] */}
                <g transform="translate(85, 56)">
                  <circle cx="25" cy="32" r="26" fill="url(#coreDatabaseGlow)" />
                  <ellipse cx="25" cy="18" rx="20" ry="6" fill="#002022" stroke="#00f5ff" strokeWidth="1.8" />
                  <ellipse cx="25" cy="18" rx="14" ry="3.8" fill="#00f0ff" opacity="0.6" />
                  <path d="M5 18 V28 C5 31.3 14 34 25 34 C36 34 45 31.3 45 28 V18" fill="none" stroke="#00f5ff" strokeWidth="1.8" />
                  <path d="M5 28 C5 31.3 14 34 25 34 C36 34 45 31.3 45 28" fill="#0b1326" fillOpacity="0.7" />
                  <path d="M5 28 V38 C5 41.3 14 44 25 44 C36 44 45 41.3 45 38 V28" fill="none" stroke="#00f5ff" strokeWidth="1.8" />
                  <path d="M5 38 C5 41.3 14 44 25 44 C36 44 45 41.3 45 38" fill="#070b1a" fillOpacity="0.8" />
                  <text x="25" y="33" fill="#ffffff" fontFamily="sans-serif" fontSize="10.5" fontWeight="900" textAnchor="middle">R[A]</text>
                </g>

                {/* Haste e Nó de Conexão */}
                <g>
                  <path d="M102 134 L118 134 L122 160 L98 160 Z" fill="url(#goldLuxPrimary)" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="96" y="143" width="28" height="6" rx="3" fill="#00f5ff" stroke="#ffffff" strokeWidth="1" />
                </g>

                {/* Base Monumental & Placa Gravada */}
                <g>
                  <polygon points="84,160 136,160 146,174 74,174" fill="url(#goldLuxPrimary)" stroke="#ffd166" strokeWidth="1.5" />
                  <polygon points="68,174 152,174 162,198 58,198" fill="url(#darkMetalPlinth)" stroke="#ffd166" strokeWidth="2" />
                  <rect x="50" y="198" width="120" height="14" rx="4" fill="#070b1a" stroke="#ffd166" strokeWidth="2" />
                  <rect x="54" y="179" width="112" height="14" rx="3" fill="#050814" stroke="#00f5ff" strokeWidth="1" />
                  <text x="110" y="189" fill="#00f5ff" fontFamily="monospace" fontSize="6.2" fontWeight="bold" letterSpacing="0.8" textAnchor="middle">
                    C.J. DATE 2026 • RELATIONAL MASTER
                  </text>
                </g>

                {/* Estrela Soberana no Topo */}
                <g>
                  <polygon points="110,8 115,22 129,23 118,32 122,46 110,38 98,46 102,32 91,23 105,22" fill="url(#goldLuxPrimary)" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="110" cy="26" r="3" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>

          {/* Badge de Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold shadow-lg shadow-emerald-900/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MISSION ACCOMPLISHED: PROTOCOLO COMMIT 100% EXECUTADO
          </div>

          {/* Título Monumental */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 via-cyan-300 to-white drop-shadow-[0_4px_25px_rgba(255,209,102,0.65)]">
            VITÓRIA RELACIONAL!
          </h2>

          {/* Card da Equipe Campeã */}
          <div className="mt-2.5 flex items-center justify-center gap-3 flex-wrap">
            <div 
              className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-2 px-5 py-2 rounded-2xl shadow-lg"
              style={{ borderColor: winningTeam.color || '#00f5ff' }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black text-lg shadow-md"
                style={{ backgroundColor: winningTeam.color || '#00f5ff' }}
              >
                {winningTeam.name ? winningTeam.name.charAt(winningTeam.name.length - 1) : '👑'}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  Equipe Vencedora do Torneio
                </div>
                <div className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  🏆 {winningTeam.name || 'Equipe Alfa'}
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-400/50">
                    1º LUGAR
                  </span>
                </div>
              </div>
            </div>

            {/* Rover da Equipe */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-amber-400/50 text-amber-300 font-mono text-xs shadow-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{winningTeam.roverName || 'Rover Principal'} • Posição: Nó #15 (Final)</span>
            </div>
          </div>

          {/* Gatilho da Vitória */}
          <div className="mt-3 text-xs sm:text-sm text-cyan-200 bg-slate-950/80 border border-cyan-500/40 rounded-xl px-4 py-1.5 flex items-center gap-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>GATILHO DA VITÓRIA:</strong> BINGO RELACIONAL COMPLETO! Linha/Coluna de Badges concluída com sucesso no Nó 15.
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GRID CENTRAL: 3 COLUNAS CONSOLIDADAS                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 relative z-10">

          {/* COLUNA 1: PLACAR FINAL CONSOLIDADO (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/40 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/30 mb-3">
                <h3 className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  PLACAR FINAL CONSOLIDADO
                </h3>
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  {teams.length} EQUIPES
                </span>
              </div>

              <div className="space-y-2">
                {sortedTeams.map((team, idx) => {
                  const isFirst = idx === 0;
                  const badgesCount = (team.bingoGrid || []).flat().filter(Boolean).length;
                  return (
                    <div
                      key={team.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                        isFirst
                          ? 'bg-gradient-to-r from-amber-950/70 via-cyan-950/60 to-slate-900 border-amber-400/90 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shadow-sm ${
                          isFirst
                            ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {idx + 1}º
                        </span>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            {team.name}
                            {isFirst && (
                              <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/40">
                                CAMPEÃ 👑
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {badgesCount} Badges • Nó #{team.position || 1}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-black text-base ${isFirst ? 'text-amber-300' : 'text-slate-300'}`}>
                          {team.credits || 1000}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block leading-none">PTS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Nó Alvo: <strong className="text-white">15 (FINISH)</strong></span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Consenso ACID 100%
              </span>
            </div>
          </div>

          {/* COLUNA 2: BINGO DECISIVO 3x3 (3 cols) */}
          <div className="lg:col-span-3 bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/40 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/30 mb-2">
                <h3 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  BINGO DECISIVO
                </h3>
                <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/50 font-bold">
                  {badgesUnlockedCount}/9 BADGES
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Cartela 3×3 da equipe campeã:</p>

              {/* Grid 3x3 Mini Bingo */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                {BINGO_BADGES.map((row, r) =>
                  row.map((badge, c) => {
                    const isUnlocked = winningGrid[r] && winningGrid[r][c];
                    const winningGlow = isWinningCell(r, c);

                    return (
                      <div
                        key={badge.id}
                        className={`rounded-lg p-1.5 sm:p-2 flex flex-col items-center justify-center text-center transition ${
                          isUnlocked
                            ? winningGlow
                              ? 'bg-emerald-950/90 border-2 border-emerald-400 shadow-[0_0_12px_rgba(6,214,160,0.5)]'
                              : 'bg-emerald-950/50 border border-emerald-500/50'
                            : 'bg-slate-950/80 border border-slate-800 opacity-60'
                        }`}
                      >
                        <span className="text-[8px] font-mono font-bold text-slate-300 leading-tight truncate w-full">
                          {badge.name.split(' ')[0]}
                        </span>
                        <span className={`text-[9px] font-black mt-0.5 ${isUnlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ OK' : 'livre'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-400/40 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Linha Vencedora Validada
              </span>
            </div>
          </div>

          {/* COLUNA 3: MVPs INDIVIDUAIS & RECOMPENSAS (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/40 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/30 mb-3">
                <h3 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                  <span className="text-amber-400">🏆</span>
                  MVPs DA PARTIDA
                </h3>
                <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/50 uppercase">
                  DESTAQUES
                </span>
              </div>

              {/* Lista de MVPs */}
              <div className="space-y-2">
                {mvps.map((mvp, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-amber-400/70 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                          idx === 0
                            ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {mvp.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-[12px]">{mvp.name}</span>
                            <span className="text-[8px] font-mono font-bold text-amber-300 bg-amber-950 px-1 rounded border border-amber-500/40">
                              {mvp.medal}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300">{winningTeam.name || 'Alfa'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block">{mvp.score}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                      <span className="text-[9px] font-mono text-slate-400 truncate">{mvp.badge}</span>
                      <div className="w-14 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shrink-0">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-amber-300 h-full"
                          style={{ width: idx === 0 ? '100%' : idx === 1 ? '91%' : '83%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recompensas Acadêmicas */}
            <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-400/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <div>
                  <div className="text-[11px] font-bold text-purple-200">+1.200 XP Acadêmico</div>
                  <div className="text-[9px] font-mono text-slate-400">Badge C.J. Date Master liberada</div>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-400/50">
                NÍVEL 8
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRA INFERIOR DE AÇÕES & BOTÕES INTERATIVOS                              */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            {/* Compartilhar */}
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'COPIADO! 📋' : 'COMPARTILHAR VITÓRIA'}</span>
            </button>

            {/* Relatório Pedagógico */}
            <button
              onClick={() => setShowPedagogicalReport(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-400/60 hover:border-purple-300 text-purple-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-purple-300" />
              <span>RELATÓRIO PEDAGÓGICO</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Chuva de Confetes */}
            <button
              onClick={triggerConfettiBurst}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-400/50 hover:border-amber-300 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <span>🎉 Confetes</span>
            </button>

            {/* Nova Partida / Lobby */}
            <button
              onClick={onReset}
              className="px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-amber-300 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 flex items-center gap-2 border border-white/60"
            >
              <span>NOVA PARTIDA / LOBBY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL SECUNDÁRIO: RELATÓRIO PEDAGÓGICO C.J. DATE & ACID                  */}
      {/* ========================================================================= */}
      {showPedagogicalReport && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl max-w-lg w-full p-6 text-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowPedagogicalReport(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500 text-purple-300">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Relatório Pedagógico C.J. Date</h3>
                <p className="text-xs font-mono text-purple-300">Capítulo 6 • O Modelo Relacional</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Conceitos Teóricos Consolidados:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Tuplas são imutáveis e atributos não possuem ordem física.</li>
                  <li>RelVars (Relation Variables) armazenam relações mutáveis via atribuição.</li>
                  <li>1FN é um princípio natural: todos os valores de atributos são atômicos.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Transações ACID Concluídas:</span>
                <span className="font-bold text-emerald-400">100% Sem Inconsistência</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Equipe Campeã:</span>
                <span className="font-bold text-amber-300">{winningTeam.name || 'Equipe Alfa'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPedagogicalReport(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase transition"
            >
              Fechar Relatório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
