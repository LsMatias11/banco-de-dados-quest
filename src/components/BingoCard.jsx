import React from 'react';
import { BINGO_BADGES } from '../data/gameData';
import { Award, Check, Lock, Layers, Database, Atom, Variable, RefreshCw, ShieldCheck, Zap, Code } from 'lucide-react';

const ICON_MAP = {
  Boxes: Layers,
  Layers: Layers,
  Database: Database,
  Atom: Atom,
  Variable: Variable,
  RefreshCw: RefreshCw,
  ShieldCheck: ShieldCheck,
  Zap: Zap,
  Code: Code
};

export default function BingoCard({ bingoGrid, activeTeam }) {
  const unlockedCount = bingoGrid ? bingoGrid.flat().filter(Boolean).length : 0;
  const teamName = activeTeam?.name || 'Equipe Alfa';

  return (
    <div className="mt-4 pt-3 border-t border-pink-500/20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-display font-bold uppercase text-slate-200 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          BINGO 3×3 ({unlockedCount}/9)
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 rounded border border-emerald-500/40">
          1 Linha p/ Win
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {BINGO_BADGES.map((row, rIdx) =>
          row.map((badge, cIdx) => {
            const isUnlocked = bingoGrid && bingoGrid[rIdx] && bingoGrid[rIdx][cIdx];
            const tileNumber = rIdx * 3 + cIdx + 1;
            const TileIcon = ICON_MAP[badge.icon] || Award;

            if (isUnlocked) {
              return (
                <div
                  key={badge.id}
                  className="relative group overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950/90 to-arcade-darkest/95 border border-emerald-400 p-2 flex flex-col items-center justify-between shadow-glow-cyan/20 transition-all hover:border-emerald-300 hover:scale-[1.03]"
                >
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full blur-[2px] opacity-70 animate-pulse"></div>
                  <div className="w-full flex items-center justify-between mb-1">
                    <span className="text-[8px] font-mono font-black text-emerald-400 tracking-wider">[{tileNumber}]</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[9px] font-black">
                      ✓
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center my-0.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(6,214,160,0.6)]">
                    <TileIcon className="w-3.5 h-3.5" />
                  </div>

                  <span className="text-[9px] font-display font-black text-white text-center leading-tight truncate w-full">
                    {badge.name}
                  </span>
                  <span className="text-[7px] font-mono font-bold text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-400/50 mt-1 uppercase">
                    ★ {teamName.slice(0, 7)}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={badge.id}
                className="relative group overflow-hidden rounded-xl bg-arcade-darkest/80 border border-white/10 hover:border-cyan-500/40 p-2 flex flex-col items-center justify-between transition-all hover:scale-[1.02]"
              >
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-[8px] font-mono font-bold text-slate-400">[{tileNumber}]</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                    <Lock className="w-2 h-2" />
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-arcade-card/60 border border-cyan-500/20 flex items-center justify-center my-0.5 text-cyan-300/80 group-hover:text-cyan-300 transition">
                  <TileIcon className="w-3.5 h-3.5" />
                </div>

                <span className="text-[9px] font-display font-bold text-slate-300 text-center leading-tight truncate w-full">
                  {badge.name}
                </span>
                <span className="text-[7px] font-mono text-slate-500 mt-1">
                  {badge.section}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
