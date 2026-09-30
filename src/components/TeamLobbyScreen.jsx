import React, { useState } from 'react';
import { Database, Terminal, Users, CheckCircle2, ShieldCheck, Info, Satellite, Volume2, VolumeX, BookOpen, HelpCircle, User, Lock, Crown, Globe } from 'lucide-react';
import AdminAuthModal from './AdminAuthModal';
import OnlineRoomModal from './OnlineRoomModal';

const TEAMS_DATA = [
  {
    id: 'alfa',
    name: 'Equipe Alfa',
    color: '#00f5ff',
    bgBadge: 'bg-primary-container/20 border-primary-container/40 text-primary-container',
    btnSelected: 'bg-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(0,240,255,0.5)] font-bold',
    btnUnselected: 'bg-surface-container-highest border border-primary-container/40 text-primary hover:bg-primary-container hover:text-slate-950',
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
    btnUnselected: 'bg-surface-container-highest border border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950',
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
    btnUnselected: 'bg-surface-container-highest border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-white',
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
    btnUnselected: 'bg-surface-container-highest border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white',
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
  joinTeamMember
}) {
  const [nameInput, setNameInput] = useState(studentName || '');
  const [courseInput, setCourseInput] = useState('Ciência da Computação');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

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

  const handleSelectTeam = (teamId) => {
    setActiveTeamId(teamId);
    if (setStudentName && nameInput.trim()) {
      setStudentName(nameInput.trim());
    }
    if (joinTeamMember && nameInput.trim()) {
      joinTeamMember({ teamId, studentName: nameInput.trim() });
    }
  };

  const handleConnect = () => {
    if (!isAdmin) {
      setShowAuthModal(true);
      setFeedbackMsg('🔒 Apenas o Administrador pode avançar da tela inicial para a arena! Autentique-se com a senha.');
      return;
    }

    if (setStudentName) setStudentName(nameInput.trim() || 'Estudante Sem Nome');
    if (joinTeamMember && nameInput.trim()) {
      joinTeamMember({ teamId: activeTeamId, studentName: nameInput.trim() });
    }
    setFeedbackMsg(`TRANSAÇÃO ACID INICIADA: Autenticando com o servidor de instância relacional de ${nameInput.trim() || 'Estudante'}...`);
    
    setTimeout(() => {
      setFeedbackMsg('✓ CONEXÃO ESTABELECIDA COM SUCESSO. Entrando na Arena Overworld...');
      setTimeout(() => {
        onEnterArena();
      }, 500);
    }, 800);
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
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-semibold tracking-wide">SALA ONLINE: {roomCode || 'BD-MAIN'}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{displayTeams.length} EQUIPES CONECTADAS</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">SYNC: 100%</span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <span>PING: 24ms</span>
            </div>
          </div>

          {/* Direita: Controles Utilitários */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRoomModal(true)}
              className={`h-9 px-3 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                isOnlineRoom
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-glow-emerald/30 font-bold'
                  : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
              }`}
              type="button"
            >
              <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="uppercase font-bold">{isOnlineRoom ? `SALA: ${roomCode}` : '🌐 CONECTAR SALA'}</span>
            </button>

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

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              type="button"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="font-mono text-xs hidden md:inline font-bold">Audio: {isMuted ? 'MUTE' : 'ON'}</span>
            </button>

            <button
              onClick={onOpenRules}
              className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              type="button"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs hidden sm:inline uppercase">Regras</span>
            </button>

            <button
              onClick={handleConnect}
              className="h-9 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-400/30 text-cyan-300 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
              type="button"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs uppercase font-bold">Entrar como Convidado</span>
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
                    <span className="font-bold uppercase tracking-wider">NOME DO ESTUDANTE / ALIAS</span>
                    <span className="text-cyan-400 font-bold">OBRIGATÓRIO</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-cyan-400 w-5 h-5" />
                    <input
                      className="w-full bg-[#0a1224] text-white font-sans text-base pl-11 pr-4 py-3.5 rounded-xl border border-cyan-400/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition shadow-inner font-semibold tracking-wide"
                      placeholder="Ex: Carlos Codd"
                      type="text"
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value);
                        if (setStudentName) setStudentName(e.target.value);
                        if (joinTeamMember && e.target.value.trim()) {
                          joinTeamMember({ teamId: activeTeamId, studentName: e.target.value });
                        }
                      }}
                    />
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
                          {nameInput || 'Estudante (Sem nome)'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">ID: 2026-REL-8841</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> AUTORIZADO
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 font-mono text-[11px]">
                    <div className="flex flex-col gap-0.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Credencial Académica</span>
                      <span className="text-cyan-200 font-semibold truncate">{courseInput}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Permissão ACID</span>
                      <span className="text-emerald-400 font-semibold">Nível 3 (Full DML)</span>
                    </div>
                  </div>
                </div>

                {/* Nota de Instrução */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">
                    Seu alias será exibido para todos os membros da equipe no mapa relacional do Overworld.
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

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team.id)}
                      className={`team-card p-4 rounded-xl flex flex-col gap-3 transition cursor-pointer relative ${
                        isSelected
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
                          {isSelected && (
                            <span className="font-mono text-[10px] bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              SUA EQUIPE
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-3 pt-1 border-t border-slate-800">
                        {/* Avatares dos Membros */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-2 overflow-hidden">
                            {currentMembers.length > 0 ? (
                              currentMembers.map((mem, idx) => {
                                const nameStr = typeof mem === 'string' ? mem : mem.name || 'Aluno';
                                return (
                                  <div
                                    key={idx}
                                    className="w-7 h-7 rounded-full bg-slate-950 border border-cyan-400/40 flex items-center justify-center font-mono text-cyan-300 text-[10px] font-bold shadow"
                                    title={nameStr}
                                  >
                                    {getInitials(nameStr)}
                                  </div>
                                );
                              })
                            ) : (
                              <span className="font-mono text-[11px] text-slate-500 italic">
                                NENHUM JOGADOR NA EQUIPE
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-300 font-bold">
                            {currentMembers.length}/{maxSlots} Cadastrados
                          </span>
                        </div>

                        {/* Botão de Seleção de Equipe */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTeam(team.id);
                          }}
                          className={`px-4 py-2 rounded-lg font-display text-xs uppercase font-bold tracking-wider shadow flex items-center gap-1.5 transition active:scale-95 ${
                            isSelected ? team.btnSelected : team.btnUnselected
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-slate-950" />
                              <span>EQUIPE SELECIONADA</span>
                            </>
                          ) : (
                            <span>JUNTAR-SE À {team.name.split(' ')[1]?.toUpperCase() || 'EQUIPE'}</span>
                          )}
                        </button>
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
            onClick={handleConnect}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:brightness-110 active:scale-[0.99] text-slate-950 font-display text-base uppercase font-black tracking-wider rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3 transition border border-cyan-200 cursor-pointer"
            type="button"
          >
            <Satellite className="w-6 h-6 text-slate-950" />
            <span>CONECTAR AO OVERWORLD & ENTRAR NA ARENA</span>
            <span className="font-mono text-xs bg-slate-950/20 border border-slate-950/30 px-2.5 py-1 rounded text-slate-950 ml-1 font-bold">
              [PRESS ENTER]
            </span>
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
            <span className="text-white font-medium">TRANSAÇÃO SEGURA ACID</span>
            <span className="text-slate-600">•</span>
            <span>BD QUEST REL-OS v2.4</span>
          </div>
          <div className="flex items-center gap-3">
            <span>PROTOCOLO DATE-1990</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LATÊNCIA 24ms
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

      {/* Modal de Gerenciamento de Sala Online */}
      <OnlineRoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        roomCode={roomCode}
        isOnlineRoom={isOnlineRoom}
        createOnlineRoom={createOnlineRoom}
        joinOnlineRoom={joinOnlineRoom}
        isAdmin={isAdmin}
      />
    </div>
  );
}
