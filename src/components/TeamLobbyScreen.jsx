import React, { useState, useRef } from 'react';
import { Database, Terminal, Users, CheckCircle2, ShieldCheck, Info, Satellite, Volume2, VolumeX, BookOpen, HelpCircle, User, Lock, Crown, Globe, ArrowRight, Sparkles } from 'lucide-react';
import AdminAuthModal from './AdminAuthModal';
import OnlineRoomModal from './OnlineRoomModal';

const TEAMS_DATA = [
  {
    id: 'alfa',
    name: 'Equipe Alfa',
    color: '#00f5ff',
    bgBadge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    btnSelected: 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.5)] font-bold',
    btnUnselected: 'bg-slate-900 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950',
    roverTag: 'ROVER CIANO',
    members: [],
    maxSlots: 8
  },
  {
    id: 'beta',
    name: 'Equipe Beta',
    color: '#ffb95f',
    bgBadge: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    btnSelected: 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(255,185,95,0.5)] font-bold',
    btnUnselected: 'bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950',
    roverTag: 'ROVER ÂMBAR',
    members: [],
    maxSlots: 8
  },
  {
    id: 'gama',
    name: 'Equipe Gama',
    color: '#a855f7',
    bgBadge: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    btnSelected: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] font-bold',
    btnUnselected: 'bg-slate-900 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-white',
    roverTag: 'ROVER ROXO',
    members: [],
    maxSlots: 8
  },
  {
    id: 'delta',
    name: 'Equipe Delta',
    color: '#ff007f',
    bgBadge: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
    btnSelected: 'bg-pink-500 text-white shadow-[0_0_15px_rgba(255,0,127,0.5)] font-bold',
    btnUnselected: 'bg-slate-900 border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white',
    roverTag: 'ROVER MAGENTA',
    members: [],
    maxSlots: 8
  }
];

export default function TeamLobbyScreen({
  activeTeamId,
  setActiveTeamId,
  studentName,
  setStudentName,
  onEnterArena,
  isMuted,
  setIsMuted,
  onOpenRules,
  isAdmin,
  toggleAdmin,
  adminPassword,
  setAdminPassword,
  checkAdminPassword,
  logoutAdmin,
  roomCode,
  isOnlineRoom,
  createOnlineRoom,
  joinOnlineRoom,
  teams,
  joinTeamMember,
  removeTeamMember
}) {
  const [nameInput, setNameInput] = useState(studentName || '');
  const [courseInput, setCourseInput] = useState('Ciência da Computação');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const prevNameRef = useRef(studentName || '');
  const nameInputRef = useRef(null);

  const displayTeams = TEAMS_DATA.map((staticTeam) => {
    const dynamicTeam = (teams || []).find((t) => t.id === staticTeam.id) || staticTeam;
    return {
      ...staticTeam,
      ...dynamicTeam,
      members: dynamicTeam.members || []
    };
  });

  const totalSlotsUsed = displayTeams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  const totalSlotsAvailable = 32 - totalSlotsUsed;

  const currentCleanName = (nameInput || studentName || '').trim();

  // Verifica em qual equipe o aluno está atualmente registrado
  const userCurrentTeam = currentCleanName
    ? displayTeams.find((t) =>
        (t.members || []).some((m) => {
          const mName = typeof m === 'string' ? m : m?.name;
          return mName?.toLowerCase() === currentCleanName.toLowerCase();
        })
      )
    : null;

  // Função central para entrar / associar-se a uma equipe
  const handleJoinTeam = (teamId) => {
    const cleanName = nameInput.trim();
    if (!cleanName || cleanName.length < 2) {
      setFeedbackMsg('⚠️ Digite seu nome / alias acima (mínimo 2 letras) para entrar na equipe!');
      if (nameInputRef.current) nameInputRef.current.focus();
      return;
    }

    setActiveTeamId(teamId);
    if (setStudentName) setStudentName(cleanName);

    if (joinTeamMember) {
      joinTeamMember({
        teamId,
        studentName: cleanName,
        previousName: prevNameRef.current
      });
      prevNameRef.current = cleanName;
    }

    const teamObj = displayTeams.find((t) => t.id === teamId);
    setFeedbackMsg(`✓ Conectado na ${teamObj?.name || 'Equipe'} como "${cleanName}"!`);
  };

  // Botão principal de ação no rodapé
  const handleMainAction = () => {
    // Se for o Administrador/Professor, inicia a partida para todo mundo
    if (isAdmin) {
      setFeedbackMsg('🚀 INICIANDO PARTIDA: Transição para a Arena Overworld...');
      setTimeout(() => {
        onEnterArena();
      }, 400);
      return;
    }

    // Se for um Aluno e ainda não entrou em uma equipe
    if (!userCurrentTeam) {
      const cleanName = nameInput.trim();
      if (!cleanName || cleanName.length < 2) {
        setFeedbackMsg('⚠️ Digite seu nome / alias no campo acima e confirme sua equipe!');
        if (nameInputRef.current) nameInputRef.current.focus();
        return;
      }
      handleJoinTeam(activeTeamId);
      return;
    }

    // Se o Aluno já estiver conectado na equipe, avisa que está aguardando o professor
    setFeedbackMsg(`⏳ Você já está na ${userCurrentTeam.name}! Aguarde o Professor / ADM iniciar a partida.`);
  };

  const getInitials = (str) => {
    if (!str) return 'AL';
    const parts = str.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-on-surface font-sans antialiased bg-[#060e20] selection:bg-cyan-400 selection:text-slate-950">
      
      {/* 1. TOPBAR DE NAVEGAÇÃO WEB OFICIAL */}
      <header className="w-full bg-[#070e22]/95 border-b border-cyan-400/20 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-2.5 shadow-2xl">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          
          {/* Esquerda: Marca e Ícone Cilíndrico de Banco */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.35)] shrink-0">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl uppercase text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  BD Quest
                </span>
                <span className="font-mono text-[10px] bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  REL-OS v2.4
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400 font-medium">
                C.J. Date • Capítulo 6 – Teoria Relacional & Relações
              </span>
            </div>
          </div>

          {/* Centro: Status de Rede e Telemetria */}
          <div className="hidden xl:flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-1.5 rounded-full font-mono text-xs text-slate-300 shadow-inner">
            <button
              onClick={() => setShowRoomModal(true)}
              className="flex items-center gap-2 hover:text-cyan-300 transition cursor-pointer"
              title="Clique para gerenciar a sala online"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-bold tracking-wide">SALA: {roomCode || 'BD-MAIN'}</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-bold">{totalSlotsUsed} ALUNOS CONECTADOS</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">SYNC: 100% ONLINE</span>
          </div>

          {/* Direita: Controles Utilitários */}
          <div className="flex items-center gap-2">
            
            {/* Botão de Sala Online Interativa */}
            <button
              onClick={() => setShowRoomModal(true)}
              className="h-9 px-3 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer bg-emerald-950/90 border-emerald-400/60 text-emerald-300 hover:bg-emerald-900 shadow-sm"
              type="button"
              title="Gerenciar Sala Online (Compartilhe o código com a turma)"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="font-bold uppercase tracking-wider">{roomCode || 'BD-MAIN'}</span>
            </button>

            {/* Alternar Modo ADM */}
            <button
              onClick={() => {
                if (isAdmin) {
                  if (logoutAdmin) logoutAdmin();
                  setFeedbackMsg('🔒 Modo Administrador desativado.');
                } else {
                  setShowAuthModal(true);
                }
              }}
              className={`h-9 px-3 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                isAdmin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold border-white/40 shadow-glow-emerald'
                  : 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-amber-950'
              }`}
              type="button"
            >
              {isAdmin ? <Crown className="w-4 h-4 text-slate-950" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span className="uppercase font-bold">{isAdmin ? '👑 ADM ATIVO' : '🔒 MODO ADM'}</span>
            </button>

            {/* Mudo SFX */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              type="button"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="font-mono text-xs hidden md:inline font-bold">Audio: {isMuted ? 'MUTE' : 'ON'}</span>
            </button>

            {/* Regras */}
            <button
              onClick={onOpenRules}
              className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              type="button"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs hidden sm:inline uppercase">Regras</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. GRID PRINCIPAL DESKTOP WIDESCREEN (2 COLUNAS LADO A LADO) */}
      <main className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 py-5 flex-1 flex flex-col gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          
          {/* COLUNA ESQUERDA: Terminal de Acesso do Aluno (~45%) */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col gap-5">
              
              {/* Brilho Sci-Fi Ambiente */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Cabeçalho do Card Esquerdo */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-sm font-bold uppercase text-white tracking-tight">
                    TERMINAL DE ACESSO DO ALUNO
                  </h2>
                </div>
                <span className="font-mono text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  AUTENTICAÇÃO RELACIONAL
                </span>
              </div>

              {/* Identificação do Estudante Principal */}
              <div className="flex flex-col gap-5 relative z-10 py-2">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-slate-400 flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider">SEU NOME / ALIAS</span>
                    <span className="text-cyan-400 font-bold">DIGITE E CONFIRME</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      <User className="absolute left-3.5 text-cyan-400 w-5 h-5" />
                      <input
                        ref={nameInputRef}
                        className="w-full bg-[#0a1224] text-white font-sans text-base pl-11 pr-4 py-3 rounded-xl border border-cyan-400/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition shadow-inner font-semibold tracking-wide"
                        placeholder="Ex: Carlos Codd"
                        type="text"
                        value={nameInput}
                        onChange={(e) => {
                          setNameInput(e.target.value);
                          if (setStudentName) setStudentName(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleJoinTeam(activeTeamId);
                          }
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJoinTeam(activeTeamId)}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-glow-cyan active:scale-95 transition cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>CONFIRMAR</span>
                    </button>
                  </div>
                </div>

                {/* Card de Perfil & Status de Autenticação */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 border border-cyan-400/40 flex items-center justify-center font-display text-cyan-300 font-bold text-sm shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                        {getInitials(nameInput)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-sm font-bold text-white tracking-wide">
                          {nameInput || 'Estudante (Digite seu nome)'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {userCurrentTeam ? `Integrado à ${userCurrentTeam.name}` : 'Aguardando seleção de equipe'}
                        </span>
                      </div>
                    </div>
                    {userCurrentTeam ? (
                      <span className="font-mono text-[10px] bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> CONECTADO
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] bg-amber-400/15 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                        PENDENTE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 font-mono text-[11px]">
                    <div className="flex flex-col gap-0.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Credencial Académica</span>
                      <span className="text-cyan-200 font-semibold truncate">{courseInput}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Sua Equipe Atual</span>
                      <span className="text-emerald-400 font-semibold truncate">
                        {userCurrentTeam ? userCurrentTeam.name : 'Nenhuma (Selecione ao lado)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nota de Instrução */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">
                    Seu nome aparecerá em tempo real nos celulares e computadores de todos os colegas da turma.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* COLUNA DIREITA: Seleção de Facção / Equipes (~55%) */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col gap-4">
              
              {/* Brilho Sci-Fi Ambiente Âmbar/Magenta */}
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Cabeçalho do Card Direito */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-sm uppercase text-white font-bold tracking-tight">
                    SELEÇÃO DE FACÇÃO / EQUIPE
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">SLOTS DISPONÍVEIS:</span>
                  <span className="font-mono text-xs bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    {totalSlotsAvailable}/32
                  </span>
                </div>
              </div>

              {/* LISTA DE 4 CARDS DE EQUIPES (Alfa, Beta, Gama, Delta) */}
              <div className="flex flex-col gap-3.5 relative z-10">
                {displayTeams.map((team) => {
                  const isSelected = activeTeamId === team.id;
                  const maxSlots = team.maxSlots || 8;
                  const currentMembers = team.members || [];
                  const freeSlots = Math.max(0, maxSlots - currentMembers.length);

                  // Verifica se este usuário específico já é membro desta equipe
                  const isUserMemberOfThisTeam = currentCleanName && currentMembers.some((m) => {
                    const mName = typeof m === 'string' ? m : m?.name;
                    return mName?.toLowerCase() === currentCleanName.toLowerCase();
                  });

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleJoinTeam(team.id)}
                      className={`team-card p-4 rounded-xl flex flex-col gap-3 transition cursor-pointer relative ${
                        isUserMemberOfThisTeam
                          ? 'bg-gradient-to-r from-[#0d2e28] via-[#0b1e1f] to-[#071318] border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                          : isSelected
                          ? 'bg-gradient-to-r from-[#0d2238] via-[#0b172a] to-[#07101f] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                          : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full shadow"
                            style={{ backgroundColor: team.color }}
                          />
                          <h3 className="font-display text-base font-bold text-white uppercase tracking-wide">
                            {team.name}
                          </h3>
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${team.bgBadge}`}>
                            {team.roverTag}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-950 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                            {freeSlots} VAGAS LIVRES
                          </span>
                          {isUserMemberOfThisTeam ? (
                            <span className="font-mono text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-glow-emerald">
                              <CheckCircle2 className="w-3 h-3 text-slate-950" /> VOCÊ ESTÁ AQUI
                            </span>
                          ) : isSelected ? (
                            <span className="font-mono text-[10px] bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              SELECIONADA
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-300 font-bold">
                            Membros Conectados ({currentMembers.length}/{maxSlots}):
                          </span>
                        </div>

                        {currentMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentMembers.map((mem, idx) => {
                              const nameStr = typeof mem === 'string' ? mem : mem.name || 'Aluno';
                              const isMe = currentCleanName && nameStr.toLowerCase() === currentCleanName.toLowerCase();
                              return (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-lg border shadow-sm font-bold ${
                                    isMe
                                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-glow-emerald/30'
                                      : 'bg-slate-950 border-cyan-400/40 text-cyan-200'
                                  }`}
                                >
                                  <User className={`w-3 h-3 ${isMe ? 'text-emerald-400' : 'text-cyan-400'}`} />
                                  <span>{nameStr} {isMe && '(Você)'}</span>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (removeTeamMember) {
                                          removeTeamMember({ teamId: team.id, studentName: nameStr });
                                        }
                                      }}
                                      className="w-4 h-4 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center font-bold text-xs transition ml-1 cursor-pointer"
                                      title={`Remover ${nameStr} da ${team.name}`}
                                    >
                                      ×
                                    </button>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-slate-500 italic">
                            NENHUM JOGADOR CONECTADO NESTA EQUIPE
                          </span>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinTeam(team.id);
                            }}
                            className={`px-4 py-2 rounded-lg font-display text-xs uppercase font-bold tracking-wider shadow flex items-center gap-1.5 transition active:scale-95 ${
                              isUserMemberOfThisTeam
                                ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-emerald cursor-default'
                                : isSelected
                                ? team.btnSelected
                                : team.btnUnselected
                            }`}
                          >
                            {isUserMemberOfThisTeam ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                                <span>SUA EQUIPE (CONECTADO)</span>
                              </>
                            ) : (
                              <span>JUNTAR-SE À {team.name.split(' ')[1]?.toUpperCase() || 'EQUIPE'}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CARD DE REGRAS E PARÂMETROS DA PARTIDA */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3 relative z-10">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-white font-bold">Parâmetros da Partida:</strong> 15 Nós Relacionais interligados no Overworld • Vitória por Bingo 3x3 (Linha, Coluna ou Diagonal) • Sabotagens de uso único ativadas.
                </p>
              </div>

            </div>
          </section>
        </div>

        {/* 3. BARRA DE AÇÃO INFERIOR & CALL TO ACTION WIDESCREEN */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <button
            onClick={handleMainAction}
            className={`w-full py-4 px-6 font-display text-base uppercase font-black tracking-wider rounded-xl shadow-2xl flex items-center justify-center gap-3 transition border active:scale-[0.99] cursor-pointer ${
              isAdmin
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:brightness-110'
                : userCurrentTeam
                ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-emerald-300 border-emerald-400/50 shadow-inner'
                : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-slate-950 border-cyan-200 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:brightness-110'
            }`}
            type="button"
          >
            {isAdmin ? (
              <>
                <Satellite className="w-6 h-6 text-slate-950" />
                <span>INICIAR PARTIDA & ABRIR ARENA PARA TODOS OS ALUNOS</span>
                <span className="font-mono text-xs bg-slate-950/20 border border-slate-950/30 px-2.5 py-1 rounded text-slate-950 ml-1 font-bold">
                  [MODO PROFESSOR]
                </span>
              </>
            ) : userCurrentTeam ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                <span>VOCÊ ESTÁ NA {userCurrentTeam.name.toUpperCase()} • AGUARDANDO O PROFESSOR INICIAR A ARENA...</span>
              </>
            ) : (
              <>
                <Users className="w-6 h-6 text-slate-950" />
                <span>CONFIRMAR NOME E ENTRAR NA EQUIPE</span>
                <span className="font-mono text-xs bg-slate-950/20 border border-slate-950/30 px-2.5 py-1 rounded text-slate-950 ml-1 font-bold">
                  [PRESS ENTER]
                </span>
              </>
            )}
          </button>

          {/* Feedback de Conexão */}
          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-400 font-mono text-xs text-center text-cyan-300 animate-pulse">
              {feedbackMsg}
            </div>
          )}
        </div>
      </main>

      {/* 4. RODAPÉ DESKTOP COM TELEMETRIA */}
      <footer className="w-full border-t border-slate-800 bg-[#060e20] px-4 lg:px-8 py-3 text-slate-400 font-mono text-xs">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">SALA ONLINE: {roomCode || 'BD-MAIN'}</span>
            <span className="text-slate-600">•</span>
            <span>BD QUEST REL-OS v2.4</span>
          </div>
          <div className="flex items-center gap-3">
            <span>MULTIPLAYER STREAM v8</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LATÊNCIA &lt; 50ms
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Autenticação ADM */}
      {showAuthModal && (
        <AdminAuthModal
          isAdmin={isAdmin}
          toggleAdmin={toggleAdmin}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          checkAdminPassword={checkAdminPassword}
          logoutAdmin={logoutAdmin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Modal de Sala Online Interativa */}
      {showRoomModal && (
        <OnlineRoomModal
          isOpen={showRoomModal}
          onClose={() => setShowRoomModal(false)}
          roomCode={roomCode || 'BD-MAIN'}
          isOnlineRoom={isOnlineRoom}
          createOnlineRoom={createOnlineRoom}
          joinOnlineRoom={joinOnlineRoom}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
