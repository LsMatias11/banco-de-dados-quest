import React, { useRef, useState } from 'react';
import { Database, UserPlus, Trophy, Download, Upload, RotateCcw, Sparkles, Volume2, VolumeX, LogOut, HelpCircle, Play, Pause, Square, Lock, Crown, Globe } from 'lucide-react';
import AdminAuthModal from './AdminAuthModal';
import OnlineRoomModal from './OnlineRoomModal';

export default function Header({
  activeTeam,
  teamsCount,
  turnIndex,
  onOpenLobby,
  onOpenLeaderboard,
  onExportBackup,
  onImportBackup,
  isMuted,
  setIsMuted,
  onReset,
  showDemoBar,
  setShowDemoBar,
  isGameStarted,
  isGamePaused,
  isAdmin,
  toggleAdmin,
  adminPassword,
  setAdminPassword,
  checkAdminPassword,
  logoutAdmin,
  onStartGame,
  onTogglePause,
  onStopGame,
  roomCode,
  isOnlineRoom,
  createOnlineRoom,
  joinOnlineRoom,
  onRemoveMember
}) {
  const fileInputRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportBackup(file);
    }
  };

  const unlockedStars = activeTeam?.bingoGrid ? activeTeam.bingoGrid.flat().filter(Boolean).length : 0;

  return (
    <header className="w-full border-b border-cyan-500/30 bg-arcade-deep/95 backdrop-blur-2xl sticky top-0 z-50 px-3 lg:px-6 py-2.5 transition-all shadow-2xl">
      {/* Holographic Top Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] holo-glow"></div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Edition Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-arcade-magenta via-arcade-violet to-arcade-cyan blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-b from-arcade-card to-arcade-darkest border border-cyan-400/60 flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6 text-arcade-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl lg:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-arcade-cyan drop-shadow-[0_2px_12px_rgba(0,245,255,0.5)]">
                BD QUEST
              </h1>
              <span className="font-display text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 border border-purple-400/50 shadow-sm tracking-widest">
                C.J. DATE EDITION
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 font-bold">
                RELATIONAL ODYSSEY
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
              <span className="text-arcade-gold font-bold">Cap. 6</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 truncate">Teoria Relacional & Relações Formais</span>
            </p>
          </div>
        </div>

        {/* Active Team & Crew Pod (4 Membros) */}
        <div className="flex items-center gap-2.5 bg-arcade-darkest/80 border border-cyan-500/40 rounded-2xl px-3 py-1.5 shadow-inner">
          {/* Team Avatar */}
          <div
            className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-glow-cyan/30 border border-white/20"
            style={{ backgroundColor: activeTeam?.color || '#00f5ff' }}
          >
            <span className="font-display font-black text-xs text-slate-950">
              {activeTeam?.name?.split(' ')?.[1]?.[0] || 'α'}
            </span>
          </div>

          {/* Crew Details */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wide font-display">
                {activeTeam?.name || 'Equipe Alfa'} <span className="text-[10px] font-sans font-medium text-emerald-400">(Seu Time)</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            {/* Members Chips */}
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {(activeTeam?.members || []).length > 0 ? (
                activeTeam.members.map((m, i) => {
                  const nameStr = typeof m === 'string' ? m : m?.name || 'Aluno';
                  return (
                    <span
                      key={i}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-bold inline-flex items-center gap-1"
                    >
                      <span>{nameStr}</span>
                      {isAdmin && onRemoveMember && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveMember({ teamId: activeTeam.id, studentName: nameStr });
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center font-bold text-[9px] transition ml-0.5 cursor-pointer"
                          title={`Remover ${nameStr}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="text-[9px] font-mono text-slate-500 italic">Sem integrantes ainda</span>
              )}
              <span className="text-[9px] text-slate-400 font-mono ml-1 hidden sm:inline">• {activeTeam?.roverName}</span>
            </div>
          </div>
        </div>

        {/* CONTROLES EXCLUSIVOS DE ADM / PROFESSOR (Visíveis apenas quando isAdmin for verdadeiro) */}
        {isAdmin && (
          <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 rounded-2xl px-3 py-1 shadow-md animate-fadeIn">
            {!isGameStarted ? (
              <button
                onClick={onStartGame}
                className="px-3 py-1.5 rounded-xl font-display font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-teal-300 hover:to-emerald-400 shadow-glow-emerald border border-white/50 active:scale-95 transition flex items-center gap-1.5"
                title="Iniciar Partida como ADM"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>INICIAR</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onTogglePause}
                  className={`px-3 py-1.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 ${
                    isGamePaused
                      ? 'text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 shadow-glow-emerald border border-white/50'
                      : 'text-amber-300 bg-amber-950 border border-amber-400/50 hover:bg-amber-900'
                  }`}
                  title={isGamePaused ? 'Continuar Partida' : 'Pausar Partida'}
                >
                  {isGamePaused ? <Play className="w-3.5 h-3.5 fill-slate-950" /> : <Pause className="w-3.5 h-3.5 fill-amber-300" />}
                  <span>{isGamePaused ? 'RETOMAR' : 'PAUSAR'}</span>
                </button>

                <button
                  onClick={onStopGame}
                  className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 flex items-center justify-center transition"
                  title="Parar / Reiniciar Partida ADM"
                >
                  <Square className="w-3.5 h-3.5 fill-red-400" />
                </button>
              </div>
            )}

            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider text-slate-300 bg-slate-950 border border-white/10 hidden xl:inline">
              {!isGameStarted ? 'AGUARDANDO ADM' : isGamePaused ? 'PAUSADO' : 'EM ANDAMENTO'}
            </span>
          </div>
        )}

        {/* Placar & Conquistas Centrais */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Relational Stars */}
          <div
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-950/60 to-arcade-surface border border-amber-400/50 rounded-2xl px-3 py-1 shadow-sm cursor-pointer hover:scale-105 transition"
            title="Ver Ranking das 4 Equipes"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-glow-gold/30">
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
            </div>
            <div>
              <div className="text-[8px] font-mono uppercase text-amber-300/80 font-bold">ESTRELAS</div>
              <span className="text-xs font-display font-black text-amber-300">★ {unlockedStars} <span className="text-slate-400 text-[10px] font-sans">/ 9</span></span>
            </div>
          </div>

          {/* Transaction Credits */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/60 to-arcade-surface border border-cyan-400/50 rounded-2xl px-3 py-1 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-arcade-cyan/20 border border-arcade-cyan text-arcade-cyan flex items-center justify-center font-mono font-bold text-[10px]">
              ₮
            </div>
            <div>
              <div className="text-[8px] font-mono uppercase text-cyan-300/80 font-bold">CRÉDITOS</div>
              <span className="text-xs font-display font-black text-cyan-300">{activeTeam?.credits || 1450} <span className="text-slate-400 text-[9px] font-sans">PTS</span></span>
            </div>
          </div>

          {/* Turn Status */}
          <div className="flex items-center gap-2 bg-arcade-card/80 border border-purple-400/40 rounded-2xl px-3 py-1 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-arcade-cyan animate-pulse"></div>
            <div>
              <div className="text-[8px] font-mono uppercase text-purple-300 font-bold">TURNO {turnIndex}/12</div>
              <span className="text-xs font-tech font-bold text-white">Vez da {activeTeam?.name}</span>
            </div>
          </div>
        </div>

        {/* Global Controls & Match Status */}
        <div className="flex items-center gap-2">
          {/* Botão de Alternar Modo ADM (Abre Modal de Autenticação) */}
          <button
            onClick={() => setShowAuthModal(true)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition active:scale-95 ${
              isAdmin
                ? 'bg-amber-950/90 text-amber-300 border border-amber-400/60 shadow-glow-gold/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-white'
            }`}
            title={isAdmin ? 'Modo ADM Ativo (Clique para gerenciar ou sair)' : 'Autenticar no Modo Administrador'}
          >
            {isAdmin ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isAdmin ? 'ADM' : 'JOGADOR'}</span>
          </button>

          {/* Interactive Online Room Button */}
          <button
            onClick={() => setShowRoomModal(true)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold transition border cursor-pointer ${
              isOnlineRoom
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-glow-emerald/30'
                : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
            }`}
            title="Gerenciar Sala Online (Multiplayer em Tempo Real)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{isOnlineRoom ? `SALA ONLINE: ${roomCode}` : '🌐 CONECTAR SALA ONLINE'}</span>
          </button>

          {/* Ferramentas de ADM: Backup JSON e Modo Turbo (Visíveis apenas quando isAdmin) */}
          {isAdmin && (
            <>
              {/* Snapshot Save */}
              <button
                onClick={onExportBackup}
                className="w-8 h-8 rounded-xl bg-arcade-surface border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-arcade-cyan transition"
                title="Salvar Backup JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Restore JSON */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-xl bg-arcade-surface border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-arcade-cyan transition"
                title="Carregar Backup JSON"
              >
                <Upload className="w-4 h-4" />
              </button>

              {/* Turbo Demo Toggle */}
              <button
                onClick={() => setShowDemoBar(!showDemoBar)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                  showDemoBar ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-arcade-surface border-cyan-500/30 text-slate-300 hover:text-amber-300'
                }`}
                title="Modo Turbo / Apresentação"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Mute audio */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-xl bg-arcade-surface border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-arcade-cyan transition"
            title="Áudio / SFX"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Leave / Lobby CTA */}
          <button
            onClick={onOpenLobby}
            className="px-3.5 py-1.5 text-xs font-display font-bold text-white bg-gradient-to-r from-arcade-magenta to-arcade-purple rounded-xl border border-pink-400/50 shadow-glow-magenta/30 hover:shadow-glow-magenta/60 transition active:scale-95 flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="">Lobby</span>
          </button>
        </div>

      </div>

      {/* MODAL DE AUTENTICAÇÃO E SENHA DO ADM */}
      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isAdmin={isAdmin}
        checkAdminPassword={checkAdminPassword}
        logoutAdmin={logoutAdmin}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
      />

      {/* MODAL DE GERENCIAMENTO DE SALA ONLINE */}
      <OnlineRoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        roomCode={roomCode}
        isOnlineRoom={isOnlineRoom}
        createOnlineRoom={createOnlineRoom}
        joinOnlineRoom={joinOnlineRoom}
        isAdmin={isAdmin}
      />
    </header>
  );
}
