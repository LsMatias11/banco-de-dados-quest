import React, { useState } from 'react';
import { Trophy, Search, Award, Skull, X } from 'lucide-react';

export default function LeaderboardPanel({ isOpen, onClose, players, activePlayerId, setActivePlayerId }) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');

  const sortedPlayers = [...players].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    const bBadges = b.bingoGrid ? b.bingoGrid.flat().filter(Boolean).length : 0;
    const aBadges = a.bingoGrid ? a.bingoGrid.flat().filter(Boolean).length : 0;
    if (bBadges !== aBadges) return bBadges - aBadges;
    return a.errorCount - b.errorCount;
  });

  const filteredPlayers = sortedPlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-arcade-darkest/90 backdrop-blur-xl animate-fade-in">
      <div className="arcade-panel rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-pop-in border-2 border-amber-400/60">
        
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-glow-gold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                Classificação da Turma <span className="text-xs text-amber-300 font-mono font-bold">({players.length}/50)</span>
              </h2>
              <p className="text-[11px] text-slate-300 font-mono">
                Ranking em tempo real baseado no avanço nos Nós & Badges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-arcade-darkest border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar aluno por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-arcade-darkest border border-white/15 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none font-sans"
          />
        </div>

        {/* Tabela de 50 Jogadores */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-mono">
              Nenhum estudante encontrado com o termo de busca.
            </div>
          ) : (
            filteredPlayers.map((p) => {
              const isSelected = activePlayerId === p.id;
              const badgeCount = p.bingoGrid ? p.bingoGrid.flat().filter(Boolean).length : 0;
              const rank = sortedPlayers.findIndex((sp) => sp.id === p.id) + 1;

              let rankBadge = `${rank}º`;
              let rankStyle = "bg-arcade-darkest text-slate-400 border-white/10";

              if (rank === 1) {
                rankBadge = "🥇 1º";
                rankStyle = "bg-gradient-to-tr from-amber-600 to-yellow-300 text-slate-950 border-amber-300 font-black shadow-glow-gold";
              } else if (rank === 2) {
                rankBadge = "🥈 2º";
                rankStyle = "bg-slate-300 text-slate-950 border-white font-black";
              } else if (rank === 3) {
                rankBadge = "🥉 3º";
                rankStyle = "bg-amber-800 text-amber-100 border-amber-600 font-bold";
              }

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePlayerId(p.id);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 via-arcade-card to-arcade-deep border-arcade-cyan shadow-glow-cyan/30 text-white font-bold'
                      : 'bg-arcade-darkest/60 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center font-display text-xs shrink-0 ${rankStyle}`}>
                      {rankBadge}
                    </span>

                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                      style={{ backgroundColor: p.color || '#00f5ff' }}
                    />

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold truncate text-white">{p.name}</h4>
                        {isSelected && (
                          <span className="text-[9px] font-display font-black px-2 py-0.2 rounded bg-arcade-cyan text-slate-950 uppercase">
                            SEU ROVER
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        Matrícula: {p.matricula}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-arcade-cyan font-bold">
                      Nó #{p.position}/15
                    </span>

                    <span className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {badgeCount}/9
                    </span>

                    {p.errorCount > 0 && (
                      <span className={`px-2 py-1 rounded-xl border font-bold flex items-center gap-1 ${
                        p.errorCount === 2 ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <Skull className="w-3.5 h-3.5 text-rose-400" />
                        {p.errorCount}/3
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Clique no aluno para selecionar a vez dele</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black uppercase text-xs"
          >
            Fechar Ranking
          </button>
        </div>

      </div>
    </div>
  );
}
