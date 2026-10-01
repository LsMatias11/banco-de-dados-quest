import React from 'react';
import { SABOTAGE_CARDS } from '../data/gameData';
import { Clock, Cpu, Lock, Zap, ShieldAlert, AlertTriangle, Coins, Sparkles } from 'lucide-react';
import BingoCard from './BingoCard';

const CARD_THEMES = {
  TIMEOUT: {
    border: 'border-2 border-amber-500/50 hover:border-amber-400 bg-gradient-to-r from-amber-950/60 to-arcade-darkest/95 shadow-glow-gold/20',
    iconBg: 'bg-amber-500/20 border border-amber-400 text-amber-300',
    badge: 'text-amber-300 bg-amber-950 border-amber-400/50',
    btn: 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 border-amber-300 shadow-glow-gold',
    tag: 'DEBUFF TEMPORAL',
    icon: Clock
  },
  PARALLEL_LOCK: {
    border: 'border-2 border-cyan-400/50 hover:border-cyan-300 bg-gradient-to-r from-cyan-950/60 to-arcade-darkest/95 shadow-glow-cyan/20',
    iconBg: 'bg-cyan-500/20 border border-cyan-400 text-cyan-300',
    badge: 'text-cyan-300 bg-cyan-950 border-cyan-400/50',
    btn: 'bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-arcade-cyan text-slate-950 border-cyan-200 shadow-glow-cyan',
    tag: 'BLOQUEIO DE TURNO',
    icon: Lock
  },
  RELATIONAL_OVERLOAD: {
    border: 'border-2 border-pink-500/50 hover:border-pink-400 bg-gradient-to-r from-pink-950/60 to-arcade-darkest/95 shadow-glow-magenta/20',
    iconBg: 'bg-pink-500/20 border border-pink-400 text-pink-300',
    badge: 'text-pink-300 bg-pink-950 border-pink-500/50',
    btn: 'bg-gradient-to-r from-arcade-magenta to-pink-500 hover:from-pink-400 hover:to-arcade-magenta text-white border-pink-300 shadow-glow-magenta',
    tag: 'AJUDA TÁTICA (50/50)',
    icon: Sparkles
  }
};

export default function SabotagePanel({
  activeTeam,
  studentName,
  isAdmin,
  isGameStarted = true,
  isGamePaused = false,
  isAnswered = false,
  onUseSabotage
}) {
  const currentCredits = activeTeam?.credits || 1000;

  // Verifica se o aluno logado pertence à equipe que está no turno ativo
  const cleanStudent = (studentName || '').trim().toLowerCase();
  const isMemberOfActiveTeam = Boolean(
    cleanStudent &&
    activeTeam?.members?.some((m) => {
      const mName = typeof m === 'string' ? m : m?.name;
      return mName?.trim().toLowerCase() === cleanStudent;
    })
  );

  const isMyTeamTurn = isMemberOfActiveTeam || isAdmin;
  const canSabotage = isMyTeamTurn && isGameStarted && !isGamePaused && !isAnswered;

  return (
    <section className="h-full flex flex-col gap-4" data-purpose="tactical-combat-panel">
      <div className="glass-panel-magenta rounded-3xl p-4 lg:p-5 shadow-2xl flex flex-col justify-between bg-slate-900/90 h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-pink-500/20 mb-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-arcade-magenta to-arcade-violet flex items-center justify-center shadow-glow-magenta/30">
                  <Zap className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-white">
                  LOJA DE SABOTAGENS
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-medium pl-9">
                Compre ataques táticos usando seus Créditos PTS
              </p>
            </div>
            <div className="flex items-center gap-1 bg-cyan-950 border border-cyan-400/50 px-2.5 py-1 rounded-xl font-mono text-xs text-cyan-300 font-bold shadow-glow-cyan/20">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentCredits} PTS</span>
            </div>
          </div>

          {/* Turno da Equipe Status Banner */}
          <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
            {isMyTeamTurn ? (
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SUA VEZ DE JOGAR ({activeTeam?.name?.toUpperCase()})
              </span>
            ) : (
              <span className="font-mono text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                AGUARDANDO A {activeTeam?.name?.toUpperCase()}
              </span>
            )}
            <span className="text-[9px] font-mono text-slate-400 uppercase">
              {isMyTeamTurn ? 'SABOTAGEM LIBERADA' : 'BLOQUEADO'}
            </span>
          </div>

          {/* Cards List com Preço em Créditos */}
          <div className="space-y-2.5">
            {SABOTAGE_CARDS.map((card) => {
              const theme = CARD_THEMES[card.id] || CARD_THEMES.TIMEOUT;
              const CardIcon = theme.icon;
              const cost = card.cost || 400;
              const canAfford = currentCredits >= cost;

              return (
                <div
                  key={card.id}
                  className={`p-3 rounded-2xl border-2 transition group flex flex-col justify-between gap-2.5 ${
                    canAfford && canSabotage
                      ? `${theme.border}`
                      : 'bg-arcade-darkest/40 border-white/5 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Top: Ícone, Nome da Carta e Tag */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition ${
                      canAfford && canSabotage ? theme.iconBg : 'bg-slate-900 text-slate-600'
                    }`}>
                      <CardIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-white font-display tracking-wide uppercase truncate">
                        {card.name}
                      </h4>
                      <span className={`inline-block text-[8px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider ${theme.badge}`}>
                        {theme.tag}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Descrição com 100% de largura (sem textão espremido) */}
                  <p className="text-[11px] text-slate-300 leading-normal font-medium">
                    {card.desc}
                  </p>

                  {/* Bottom: Botão de Ação Alinhado e com largura total (sem tampar título) */}
                  <button
                    disabled={!canAfford || !canSabotage}
                    onClick={() => canSabotage && canAfford && onUseSabotage(card.id, studentName)}
                    className={`w-full py-2 px-3 rounded-xl font-display font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-md ${
                      canAfford && canSabotage
                        ? theme.btn
                        : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                    }`}
                    title={
                      !isMyTeamTurn
                        ? `Apenas a equipe que está no turno (${activeTeam?.name}) pode lançar cartas!`
                        : !canAfford
                        ? `Precisa de ${cost} PTS`
                        : `Comprar por ${cost} PTS`
                    }
                  >
                    {!isMyTeamTurn
                      ? 'TURNO ADVERSÁRIO'
                      : canAfford
                      ? (card.isHelp ? `USAR AJUDA (-${cost} PTS)` : `LANÇAR (-${cost} PTS)`)
                      : `CRÉDITOS INSUFICIENTES (${cost} PTS)`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mini Bingo 3x3 Grid Integrado */}
          <BingoCard
            bingoGrid={activeTeam?.bingoGrid || []}
            activeTeam={activeTeam}
          />
        </div>
      </div>
    </section>
  );
}
