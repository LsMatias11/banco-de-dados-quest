import React, { useState } from 'react';
import { UserPlus, Sparkles, Check, Database, X, Shield, Users } from 'lucide-react';

const TEAM_PRESETS = [
  { id: 'alfa', name: 'Equipe Alfa', color: '#00f5ff', roverName: 'Rover Alfa V2', members: [] },
  { id: 'beta', name: 'Equipe Beta', color: '#ffb703', roverName: 'Rover Beta V1', members: [] },
  { id: 'gama', name: 'Equipe Gama', color: '#9d4edd', roverName: 'Rover Gama V1', members: [] },
  { id: 'delta', name: 'Equipe Delta', color: '#ff007f', roverName: 'Rover Delta V1', members: [] }
];

export default function LobbyModal({ isOpen, onClose, onRegisterTeam, teams, activeTeamId, setActiveTeamId }) {
  if (!isOpen) return null;

  const [teamName, setTeamName] = useState('');
  const [roverName, setRoverName] = useState('');
  const [membersInput, setMembersInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const members = membersInput.trim()
      ? membersInput.split(',').map((m) => m.trim())
      : [];

    onRegisterTeam({
      name: teamName.trim(),
      roverName: roverName.trim() || `Rover ${teamName.trim()}`,
      members,
      color: '#00f5ff'
    });

    setTeamName('');
    setRoverName('');
    setMembersInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-arcade-darkest/90 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel border-2 border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-pop-in bg-slate-900/95">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-arcade-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-arcade-magenta to-arcade-cyan p-0.5 flex items-center justify-center shadow-glow-cyan">
              <div className="w-full h-full bg-arcade-darkest rounded-xl flex items-center justify-center text-arcade-cyan">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-display font-black text-white tracking-wider uppercase">
                Lobby das Equipes <span className="text-arcade-cyan font-mono">({teams.length}/4 Teams)</span>
              </h2>
              <p className="text-[11px] text-slate-300 font-mono">
                Batalha em Grupo — 4 Integrantes por Time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-arcade-darkest border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista das 4 Equipes Ativas */}
        <div className="mb-5">
          <h3 className="text-xs font-display font-extrabold text-slate-200 mb-2.5 uppercase tracking-wider flex items-center justify-between">
            <span>Equipes em Disputa ({teams.length}):</span>
            <span className="text-[10px] font-mono text-arcade-cyan">Clique para Passar a Vez</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {teams.map((t) => {
              const isSelected = activeTeamId === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setActiveTeamId(t.id);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950 to-arcade-card border-arcade-cyan text-white font-bold shadow-glow-cyan/30 ring-1 ring-cyan-400/40'
                      : 'bg-arcade-darkest/80 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-xs font-black font-display truncate">{t.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 truncate">
                    Rover: {t.roverName}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1 truncate">
                    Membros: {t.members ? t.members.join(', ') : '4 Integrantes'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form para Criar Nova Equipe */}
        <form onSubmit={handleSubmit} className="space-y-3.5 border-t border-white/10 pt-4">
          <h4 className="text-xs font-display font-black uppercase text-slate-200">
            Cadastrar Nova Equipe Customizada
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-300 mb-1">
                Nome da Equipe *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Equipe Ômega"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-arcade-darkest border border-white/15 focus:border-arcade-cyan rounded-xl px-3 py-2 text-xs text-white outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-300 mb-1">
                Nome do Rover
              </label>
              <input
                type="text"
                placeholder="Ex: Rover Ômega V1"
                value={roverName}
                onChange={(e) => setRoverName(e.target.value)}
                className="w-full bg-arcade-darkest border border-white/15 focus:border-arcade-cyan rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-300 mb-1">
              4 Membros (separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="Dev1, DBA, Arquiteto, Analista"
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              className="w-full bg-arcade-darkest border border-white/15 focus:border-arcade-cyan rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-arcade-cyan via-teal-300 to-arcade-emerald text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-glow-cyan transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Equipe na Sala
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Formato: 4 Equipes em Competição
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-arcade-card hover:bg-arcade-surface text-slate-300 text-xs font-mono font-bold"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
