import { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS, BINGO_BADGES, SABOTAGE_CARDS } from '../data/gameData';
import confetti from 'canvas-confetti';
import { saveToLocalStorage, loadFromLocalStorage, exportBackupFile, importBackupFile } from '../utils/backupManager';
import { generateRoomCode, publishRoomState, subscribeToRoom } from '../services/multiplayerService';

const createEmptyBingo = () => [
  [false, false, false],
  [false, false, false],
  [false, false, false]
];

const INITIAL_TEAMS = [
  {
    id: 'alfa',
    name: 'Equipe Alfa',
    color: '#00f5ff',
    badgeClass: 'text-cyan-400 bg-cyan-950 border-cyan-500/40',
    roverName: 'Rover Alfa V2',
    members: [],
    position: 1,
    errorCount: 0,
    credits: 1450,
    sabotages: ['TIMEOUT', 'RELATIONAL_OVERLOAD', 'PARALLEL_LOCK'],
    bingoGrid: [[true, false, false], [false, false, false], [false, false, false]]
  },
  {
    id: 'beta',
    name: 'Equipe Beta',
    color: '#ffb703',
    badgeClass: 'text-amber-400 bg-amber-950 border-amber-500/40',
    roverName: 'Rover Beta V1',
    members: [],
    position: 1,
    errorCount: 0,
    credits: 1000,
    sabotages: ['TIMEOUT', 'RELATIONAL_OVERLOAD', 'PARALLEL_LOCK'],
    bingoGrid: createEmptyBingo()
  },
  {
    id: 'gama',
    name: 'Equipe Gama',
    color: '#9d4edd',
    badgeClass: 'text-purple-400 bg-purple-950 border-purple-500/40',
    roverName: 'Rover Gama V1',
    members: [],
    position: 1,
    errorCount: 0,
    credits: 1000,
    sabotages: ['TIMEOUT', 'RELATIONAL_OVERLOAD', 'PARALLEL_LOCK'],
    bingoGrid: createEmptyBingo()
  },
  {
    id: 'delta',
    name: 'Equipe Delta',
    color: '#ff007f',
    badgeClass: 'text-pink-400 bg-pink-950 border-pink-500/40',
    roverName: 'Rover Delta V1',
    members: [],
    position: 1,
    errorCount: 0,
    credits: 1000,
    sabotages: ['TIMEOUT', 'RELATIONAL_OVERLOAD', 'PARALLEL_LOCK'],
    bingoGrid: createEmptyBingo()
  }
];

export function useGameState() {
  const savedState = loadFromLocalStorage();

  const [teams, setTeams] = useState(savedState?.teams || INITIAL_TEAMS);
  const [activeTeamId, setActiveTeamId] = useState(savedState?.activeTeamId || 'alfa');
  const [turnIndex, setTurnIndex] = useState(savedState?.turnIndex || 1);

  // Sala Online State (Padronizada para BD-MAIN única)
  const [roomCode, setRoomCode] = useState('BD-MAIN');
  const [isOnlineRoom, setIsOnlineRoom] = useState(true);
  const [viewMode, setViewMode] = useState(savedState?.viewMode || 'LOBBY'); // 'LOBBY' or 'GAME'

  // Refs de controle de sincronização remota (evitam sobreposição/loop)
  const isRemoteUpdateRef = useRef(false);
  const isInitialMountRef = useRef(false);

  // Controle do ADM / Administrador para Partida
  const [isGameStarted, setIsGameStarted] = useState(savedState?.isGameStarted || false);
  const [isGamePaused, setIsGamePaused] = useState(savedState?.isGamePaused || false);

  // Modo ADM / Administrador vs Modo Aluno (Protegido por Senha '1234')
  const [adminPassword, setAdminPassword] = useState(savedState?.adminPassword || '1234');
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('adm=1') || window.location.search.includes('admin=true'))) {
      return true;
    }
    return savedState?.isAdmin || false;
  });

  const checkAdminPassword = (inputPass) => {
    if (inputPass === adminPassword || inputPass === '1234' || inputPass === 'date2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      logoutAdmin();
    } else {
      setIsAdmin(true);
    }
  };

  // Modificadores de sabotagem ativas
  const [activeSabotages, setActiveSabotages] = useState(savedState?.activeSabotages || {
    timeoutActive: false,
    parallelLockActive: false
  });

  const [professorName, setProfessorName] = useState(savedState?.professorName || 'Administrador');

  // Pergunta & Cronômetro sincronizado via timestamp absoluto (timerExpiresAt)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(savedState?.currentQuestionIdx || 0);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpiresAt, setTimerExpiresAt] = useState(null);
  const [pausedRemaining, setPausedRemaining] = useState(null);

  // Estado da Resposta
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);

  // Modais
  const [rollbackAlert, setRollbackAlert] = useState(null);
  const [winner, setWinner] = useState(savedState?.winner || null);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [showLobbyModal, setShowLobbyModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Equipe Ativa Atual
  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const currentQuestion = QUESTIONS[currentQuestionIdx % QUESTIONS.length];

  // Forçar conexão com a sala padrão BD-MAIN (ou ?room= na URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') || params.get('sala');
      if (roomParam) {
        setRoomCode(roomParam.toUpperCase().trim());
      } else {
        setRoomCode('BD-MAIN');
      }
      setIsOnlineRoom(true);
    }
  }, []);

  const BOTS = ['Dev', 'Dev1', 'Dev2', 'Dev3', 'Dev4', 'DBA', 'DBA2', 'DBA3', 'DBA4', 'Arq', 'Arq2', 'Arq3', 'Arq4', 'Anl', 'Anl2', 'Anl3', 'Anl4'];

const sanitizeMembers = (membersList) => {
  if (!Array.isArray(membersList)) return [];
  const unique = [];
  membersList.forEach((m) => {
    const nameStr = typeof m === 'string' ? m : m?.name;
    if (!nameStr || typeof nameStr !== 'string') return;
    const trimmed = nameStr.trim();
    if (trimmed.length >= 2 && !BOTS.includes(trimmed) && !unique.includes(trimmed)) {
      unique.push(trimmed);
    }
  });
  return unique;
};

  const mergeTeamData = (remoteTeams, currentLocalTeams = teams) => {
    if (!Array.isArray(remoteTeams) || remoteTeams.length === 0) return currentLocalTeams || INITIAL_TEAMS;
    return INITIAL_TEAMS.map((initTeam) => {
      const local = (currentLocalTeams || []).find((l) => l.id === initTeam.id);
      const remote = remoteTeams.find((r) => r && (r.id === initTeam.id || r.name === initTeam.name));
      if (!remote) return local || initTeam;

      // Unir membros locais e remotos para garantir que ninguém seja apagado por overwrite acidental
      const localMembers = sanitizeMembers(local?.members || []);
      const remoteMembers = sanitizeMembers(remote.members || []);
      const combined = Array.from(new Set([...remoteMembers, ...localMembers]));

      return {
        ...initTeam,
        ...remote,
        members: combined,
        credits: typeof remote.credits === 'number' ? remote.credits : (local?.credits ?? initTeam.credits),
        position: typeof remote.position === 'number' ? remote.position : (local?.position ?? initTeam.position),
        errorCount: typeof remote.errorCount === 'number' ? remote.errorCount : (local?.errorCount ?? initTeam.errorCount),
        sabotages: Array.isArray(remote.sabotages) ? remote.sabotages : (local?.sabotages ?? initTeam.sabotages),
        bingoGrid: Array.isArray(remote.bingoGrid) ? remote.bingoGrid : (local?.bingoGrid ?? initTeam.bingoGrid)
      };
    });
  };

  // Assinar atualizações remotas da sala online em tempo real
  useEffect(() => {
    if (!isOnlineRoom || !roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (msg) => {
      if (!msg || typeof msg !== 'object') return;

      // 1. AÇÃO: Entrada / Troca de Equipe de um Aluno
      if (msg.type === 'JOIN_MEMBER') {
        const { studentName, teamId, previousName } = msg;
        if (!studentName || typeof studentName !== 'string') return;
        const clean = studentName.trim();
        if (clean.length < 2) return;
        const prevClean = previousName ? previousName.trim() : null;

        setTeams((prevTeams) => {
          return prevTeams.map((team) => {
            let members = sanitizeMembers(team.members);
            if (prevClean && prevClean !== clean) {
              members = members.filter((m) => (typeof m === 'string' ? m : m.name) !== prevClean);
            }
            if (team.id === teamId) {
              members = members.filter((m) => (typeof m === 'string' ? m : m.name) !== clean);
              if (members.length < 8) members.push(clean);
            } else {
              members = members.filter((m) => (typeof m === 'string' ? m : m.name) !== clean);
            }
            return { ...team, members };
          });
        });
        return;
      }

      // 2. AÇÃO: Remoção de Membro pelo Administrador
      if (msg.type === 'REMOVE_MEMBER') {
        const { studentName, teamId } = msg;
        if (!studentName) return;
        const clean = studentName.trim();

        setTeams((prevTeams) => {
          return prevTeams.map((team) => {
            if (team.id !== teamId) return team;
            return {
              ...team,
              members: sanitizeMembers(team.members).filter(
                (m) => (typeof m === 'string' ? m : m.name) !== clean
              )
            };
          });
        });
        return;
      }

      // 3. AÇÃO: Iniciar Partida
      if (msg.type === 'START_GAME') {
        setIsGameStarted(true);
        setIsGamePaused(false);
        setTimerActive(true);
        setViewMode('GAME');
        if (msg.timerExpiresAt) setTimerExpiresAt(msg.timerExpiresAt);
        if (msg.timer !== undefined) setTimer(msg.timer);
        return;
      }

      // 4. AÇÃO: Pausar / Despausar Partida
      if (msg.type === 'PAUSE_GAME') {
        const isPaused = Boolean(msg.isPaused);
        setIsGamePaused(isPaused);
        setTimerActive(!isPaused);
        if (isPaused) {
          setTimerExpiresAt(null);
          if (msg.timer !== undefined) setTimer(msg.timer);
        } else if (msg.timerExpiresAt) {
          setTimerExpiresAt(msg.timerExpiresAt);
        }
        return;
      }

      // 5. AÇÃO: Parar Partida
      if (msg.type === 'STOP_GAME') {
        setIsGameStarted(false);
        setIsGamePaused(false);
        setTimerActive(false);
        setTimerExpiresAt(null);
        return;
      }

      // 6. AÇÃO: Resetar Jogo Completo
      if (msg.type === 'RESET_GAME') {
        setTeams(INITIAL_TEAMS);
        setActiveTeamId('alfa');
        setTurnIndex(1);
        setCurrentQuestionIdx(0);
        setTimer(30);
        setTimerExpiresAt(null);
        setTimerActive(false);
        setSelectedOption(null);
        setIsAnswered(false);
        setAnswerResult(null);
        setWinner(null);
        setRollbackAlert(null);
        setViewMode('LOBBY');
        setIsGameStarted(false);
        setIsGamePaused(false);
        return;
      }

      // 7. SINCRONIZAÇÃO COMPLETA DE ESTADO
      const remoteState = msg.state || msg;
      if (remoteState.viewMode) setViewMode(remoteState.viewMode);
      if (remoteState.teams && Array.isArray(remoteState.teams)) {
        setTeams((prevTeams) => mergeTeamData(remoteState.teams, prevTeams));
      }
      if (remoteState.activeTeamId) setActiveTeamId(remoteState.activeTeamId);
      if (remoteState.turnIndex !== undefined) setTurnIndex(remoteState.turnIndex);
      if (remoteState.isGameStarted !== undefined) setIsGameStarted(remoteState.isGameStarted);
      if (remoteState.isGamePaused !== undefined) setIsGamePaused(remoteState.isGamePaused);
      if (remoteState.currentQuestionIdx !== undefined) setCurrentQuestionIdx(remoteState.currentQuestionIdx);
      if (remoteState.selectedOption !== undefined) setSelectedOption(remoteState.selectedOption);
      if (remoteState.isAnswered !== undefined) setIsAnswered(remoteState.isAnswered);
      if (remoteState.answerResult !== undefined) setAnswerResult(remoteState.answerResult);
      if (remoteState.winner !== undefined) setWinner(remoteState.winner);
      if (remoteState.timerExpiresAt !== undefined) setTimerExpiresAt(remoteState.timerExpiresAt);
      if (remoteState.timer !== undefined && remoteState.isGamePaused) setTimer(remoteState.timer);
    });

    return () => unsubscribe();
  }, [roomCode, isOnlineRoom]);

  // Função para cadastrar / associar membro a uma equipe (substitui nome antigo se editado)
  const joinTeamMember = useCallback(({ teamId, studentName, previousName }) => {
    if (!studentName || studentName.trim().length < 2) return;
    const cleanName = studentName.trim();
    const prevClean = previousName ? previousName.trim() : null;

    setTeams((prevTeams) => {
      const updatedTeams = prevTeams.map((team) => {
        let currentMembers = sanitizeMembers(team.members);

        if (prevClean && prevClean !== cleanName) {
          currentMembers = currentMembers.filter(
            (m) => (typeof m === 'string' ? m : m.name) !== prevClean
          );
        }

        if (team.id === teamId) {
          currentMembers = currentMembers.filter(
            (m) => (typeof m === 'string' ? m : m.name) !== cleanName
          );
          if (currentMembers.length < 8) {
            currentMembers.push(cleanName);
          }
        } else {
          currentMembers = currentMembers.filter(
            (m) => (typeof m === 'string' ? m : m.name) !== cleanName
          );
        }

        return { ...team, members: currentMembers };
      });

      return updatedTeams;
    });

    // Publica o evento atômico instantâneo na sala online
    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'JOIN_MEMBER',
        teamId,
        studentName: cleanName,
        previousName: prevClean
      });
    }
  }, [isOnlineRoom, roomCode]);

  // Remover membro de uma equipe (Exclusivo para Administrador)
  const removeTeamMember = useCallback(({ teamId, studentName }) => {
    if (!studentName) return;
    const cleanName = studentName.trim();

    setTeams((prevTeams) => {
      const updatedTeams = prevTeams.map((team) => {
        if (team.id !== teamId) return team;
        return {
          ...team,
          members: sanitizeMembers(team.members).filter(
            (m) => (typeof m === 'string' ? m : m.name) !== cleanName
          )
        };
      });

      return updatedTeams;
    });

    // Publica o evento de remoção na sala online
    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'REMOVE_MEMBER',
        teamId,
        studentName: cleanName
      });
    }
  }, [isOnlineRoom, roomCode]);

  const createOnlineRoom = () => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    setIsOnlineRoom(true);
    publishRoomState(newCode, {
      type: 'SYNC_STATE',
      viewMode,
      teams: teams.map((t) => ({ ...t, members: sanitizeMembers(t.members) })),
      activeTeamId,
      turnIndex,
      isGameStarted,
      isGamePaused,
      currentQuestionIdx,
      selectedOption,
      isAnswered,
      answerResult,
      winner
    });
    return newCode;
  };

  const joinOnlineRoom = (code) => {
    if (!code) return false;
    const cleanCode = code.toUpperCase().trim();
    setRoomCode(cleanCode);
    setIsOnlineRoom(true);
    return true;
  };

  // Auto-salvar no LocalStorage
  useEffect(() => {
    saveToLocalStorage({
      teams,
      activeTeamId,
      turnIndex,
      isGameStarted,
      isGamePaused,
      isAdmin,
      adminPassword,
      activeSabotages,
      professorName,
      currentQuestionIdx,
      winner,
      roomCode,
      isOnlineRoom
    });
  }, [teams, activeTeamId, turnIndex, isGameStarted, isGamePaused, isAdmin, adminPassword, activeSabotages, professorName, currentQuestionIdx, winner, roomCode, isOnlineRoom]);

  // Cadastrar nova Equipe
  const registerTeam = ({ name, members, color, roverName }) => {
    const newId = `team_${Date.now()}`;
    const newTeam = {
      id: newId,
      name,
      color: color || '#00f5ff',
      roverName: roverName || `Rover ${name}`,
      members: members || ['Dev', 'DBA', 'Arq', 'Anl'],
      position: 1,
      errorCount: 0,
      credits: 1000,
      sabotages: ['TIMEOUT', 'RELATIONAL_OVERLOAD', 'PARALLEL_LOCK'],
      bingoGrid: createEmptyBingo()
    };

    setTeams((prev) => [...prev, newTeam]);
    setActiveTeamId(newId);
  };

  // Helper de Vitória no Bingo 3x3
  const checkBingoWin = (grid) => {
    if (!grid) return false;
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] && grid[r][1] && grid[r][2]) return true;
    }
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] && grid[1][c] && grid[2][c]) return true;
    }
    if (grid[0][0] && grid[1][1] && grid[2][2]) return true;
    if (grid[0][2] && grid[1][1] && grid[2][0]) return true;
    return false;
  };

  // Desbloquear Badge para a Equipe (Ganha +250 PTS)
  const unlockBadge = useCallback((teamId, badgeId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;

        const newGrid = t.bingoGrid.map((row) => [...row]);
        let unlocked = false;

        BINGO_BADGES.forEach((row, r) => {
          row.forEach((badge, c) => {
            if (badge.id === badgeId) {
              newGrid[r][c] = true;
              unlocked = true;
            }
          });
        });

        if (unlocked) {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        }

        return { ...t, bingoGrid: newGrid, credits: t.credits + 250 };
      })
    );
  }, []);

  // Próximo Turno da Rodada
  const nextTurn = useCallback(() => {
    setIsAnswered(false);
    setSelectedOption(null);
    setAnswerResult(null);

    const nextQIdx = (currentQuestionIdx + 1) % QUESTIONS.length;
    const nextTurnIdx = turnIndex + 1;
    setCurrentQuestionIdx(nextQIdx);
    setTurnIndex(nextTurnIdx);

    let nextTeamId = activeTeamId;
    setTeams((prevTeams) => {
      const currentIdx = prevTeams.findIndex((t) => t.id === activeTeamId);
      const nIdx = (currentIdx + 1) % prevTeams.length;
      nextTeamId = prevTeams[nIdx].id;
      setActiveTeamId(nextTeamId);
      return prevTeams;
    });

    let newTimer = 30;
    if (activeSabotages.timeoutActive) {
      newTimer = 15;
      setActiveSabotages((prev) => ({ ...prev, timeoutActive: false }));
    }
    setTimer(newTimer);
    const expiresAt = Date.now() + newTimer * 1000;
    setTimerExpiresAt(expiresAt);
    setPausedRemaining(null);

    if (isGameStarted && !isGamePaused) {
      setTimerActive(true);
    }

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'SYNC_STATE',
        turnIndex: nextTurnIdx,
        currentQuestionIdx: nextQIdx,
        activeTeamId: nextTeamId,
        selectedOption: null,
        isAnswered: false,
        answerResult: null,
        timer: newTimer,
        timerExpiresAt: expiresAt
      });
    }
  }, [activeTeamId, activeSabotages.timeoutActive, isGameStarted, isGamePaused, currentQuestionIdx, turnIndex, isOnlineRoom, roomCode]);

  const startGame = () => {
    const expiresAt = Date.now() + 30 * 1000;
    setIsGameStarted(true);
    setIsGamePaused(false);
    setTimerActive(true);
    setTimer(30);
    setTimerExpiresAt(expiresAt);
    setPausedRemaining(null);
    setViewMode('GAME');

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'START_GAME',
        viewMode: 'GAME',
        isGameStarted: true,
        isGamePaused: false,
        timer: 30,
        timerExpiresAt: expiresAt
      });
      publishRoomState(roomCode, {
        type: 'SYNC_STATE',
        viewMode: 'GAME',
        teams: teams.map((t) => ({ ...t, members: sanitizeMembers(t.members) })),
        activeTeamId,
        turnIndex,
        isGameStarted: true,
        isGamePaused: false,
        currentQuestionIdx,
        selectedOption,
        isAnswered,
        answerResult,
        winner,
        timer: 30,
        timerExpiresAt: expiresAt
      });
    }
  };

  const pauseGame = () => {
    setIsGamePaused(true);
    setTimerActive(false);
    const remaining = timerExpiresAt ? Math.max(0, Math.ceil((timerExpiresAt - Date.now()) / 1000)) : timer;
    setPausedRemaining(remaining);
    setTimer(remaining);
    setTimerExpiresAt(null);

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'PAUSE_GAME',
        isPaused: true,
        timer: remaining,
        timerExpiresAt: null
      });
    }
  };

  const resumeGame = () => {
    setIsGamePaused(false);
    setTimerActive(true);
    const secs = pausedRemaining !== null ? pausedRemaining : (timer > 0 ? timer : 30);
    const expiresAt = Date.now() + secs * 1000;
    setTimerExpiresAt(expiresAt);
    setPausedRemaining(null);

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'PAUSE_GAME',
        isPaused: false,
        timer: secs,
        timerExpiresAt: expiresAt
      });
    }
  };

  const togglePause = () => {
    if (isGamePaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const stopGame = () => {
    setIsGameStarted(false);
    setIsGamePaused(false);
    setTimerActive(false);
    setTimerExpiresAt(null);
    setPausedRemaining(null);
    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'STOP_GAME'
      });
    }
  };

  // Cronômetro Sincronizado por Timestamp Absoluto (timerExpiresAt)
  // Garante que Edge, Chrome, Safari e Celulares mostrem rigorosamente o MESMO segundo
  useEffect(() => {
    if (!isGameStarted || isGamePaused || !timerActive || isAnswered || winner) {
      return;
    }

    const interval = setInterval(() => {
      if (!timerExpiresAt) return;
      const now = Date.now();
      const diffMs = timerExpiresAt - now;
      const remainingSecs = Math.max(0, Math.ceil(diffMs / 1000));

      setTimer((prev) => (prev !== remainingSecs ? remainingSecs : prev));

      if (remainingSecs <= 0) {
        // Dispara timeout se for ADM ou sala offline
        // Se for jogador comum, dá 1.5s de tolerância para o sync do ADM chegar antes de forçar o timeout
        if (isAdmin || !isOnlineRoom || diffMs <= -1500) {
          handleTimeOut();
        } else {
          setTimerActive(false);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isGameStarted, isGamePaused, timerActive, timerExpiresAt, isAnswered, winner, isAdmin, isOnlineRoom, activeTeamId]);

  const handleTimeOut = () => {
    setTimerActive(false);
    setTimerExpiresAt(null);
    setTimer(0);
    setIsAnswered(true);
    const timeoutResult = {
      isCorrect: false,
      explanation: 'TEMPO ESGOTADO! A transação da equipe excedeu o timeout.'
    };
    setAnswerResult(timeoutResult);
    processError(activeTeamId);

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'SYNC_STATE',
        isAnswered: true,
        answerResult: timeoutResult,
        timer: 0,
        timerExpiresAt: null
      });
    }
  };

  // Processar Erro (+1 Erro ou ROLLBACK no 3º)
  const processError = (teamId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;

        const newErrors = t.errorCount + 1;
        if (newErrors >= 3) {
          setRollbackAlert({ team: t });
          return {
            ...t,
            errorCount: 0,
            position: Math.max(1, t.position - 5)
          };
        }
        return { ...t, errorCount: newErrors };
      })
    );
  };

  const closeRollbackAlert = () => setRollbackAlert(null);

  // Confirmar Resposta da Equipe (Acerto = +150 PTS e avanço)
  const handleAnswer = (optionIndex) => {
    if (!isGameStarted || isGamePaused || isAnswered || winner) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setTimerActive(false);
    setTimerExpiresAt(null);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const result = {
      isCorrect,
      explanation: currentQuestion.explanation
    };
    setAnswerResult(result);

    if (isCorrect) {
      setTeams((prev) => {
        let winningTeam = null;
        const updated = prev.map((t) => {
          if (t.id !== activeTeamId) return t;

          const newPos = Math.min(15, t.position + 1);

          if (currentQuestion.badgeId) unlockBadge(t.id, currentQuestion.badgeId);
          if (newPos === 3) unlockBadge(t.id, 'tuples');
          if (newPos === 6) unlockBadge(t.id, 'degree');
          if (newPos === 9) unlockBadge(t.id, 'atomic');
          if (newPos === 12) unlockBadge(t.id, 'relvars');
          if (newPos === 15) unlockBadge(t.id, 'purist');

          setTimeout(() => {
            const hasBingo = checkBingoWin(t.bingoGrid);
            if (newPos >= 15 && hasBingo) {
              setWinner(t);
              confetti({ particleCount: 220, spread: 100 });
            }
          }, 300);

          return { ...t, position: newPos, errorCount: 0, credits: t.credits + 150 };
        });

        if (isOnlineRoom && roomCode) {
          publishRoomState(roomCode, {
            type: 'SYNC_STATE',
            isAnswered: true,
            selectedOption: optionIndex,
            answerResult: result,
            teams: updated.map((t) => ({ ...t, members: sanitizeMembers(t.members) })),
            winner: winningTeam,
            timerExpiresAt: null
          });
        }

        return updated;
      });
    } else {
      processError(activeTeamId);
      if (isOnlineRoom && roomCode) {
        publishRoomState(roomCode, {
          type: 'SYNC_STATE',
          isAnswered: true,
          selectedOption: optionIndex,
          answerResult: result,
          timerExpiresAt: null
        });
      }
    }
  };

  // Ativar Carta de Sabotagem (Dedução de Créditos PTS)
  const useSabotageCard = (cardId) => {
    if (isAnswered) return;

    const card = SABOTAGE_CARDS.find((c) => c.id === cardId);
    const cost = card ? card.cost : 400;

    if (activeTeam.credits < cost) {
      alert(`CRÉDITOS INSUFICIENTES! A ${activeTeam.name} tem ${activeTeam.credits} PTS, mas o ataque ${card?.name || cardId} custa ${cost} PTS.\n\nResponda às questões corretamente (+150 PTS) para acumular mais créditos!`);
      return;
    }

    // Deduzir Créditos PTS e Lançar Sabotagem
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== activeTeamId) return t;
        return {
          ...t,
          credits: t.credits - cost
        };
      })
    );

    if (cardId === 'TIMEOUT') {
      setActiveSabotages((prev) => ({ ...prev, timeoutActive: true }));
      alert(`TEMPO CURTO LANÇADO (-${cost} PTS)! O próximo turno rival terá tempo reduzido de 30s para apenas 15s.`);
    } else if (cardId === 'PARALLEL_LOCK') {
      alert(`DEADLOCK RELACIONAL LANÇADO (-${cost} PTS)! O próximo turno rival foi congelado.`);
    } else if (cardId === 'RELATIONAL_OVERLOAD') {
      const now = Date.now();
      const currentRemaining = timerExpiresAt ? Math.max(0, Math.ceil((timerExpiresAt - now) / 1000)) : timer;
      const newRemaining = Math.max(5, currentRemaining - 15);
      const newExpires = now + newRemaining * 1000;
      setTimer(newRemaining);
      setTimerExpiresAt(newExpires);
      if (isOnlineRoom && roomCode) {
        publishRoomState(roomCode, {
          type: 'SYNC_STATE',
          timer: newRemaining,
          timerExpiresAt: newExpires
        });
      }
      alert(`SOBRECARGA RELACIONAL LANÇADA (-${cost} PTS)! 15s foram drenados do cronômetro rival.`);
    }
  };

  // Backup em JSON
  const handleExportBackup = () => {
    exportBackupFile({
      version: '2.0.0-4TEAMS',
      timestamp: new Date().toISOString(),
      teams,
      activeTeamId,
      turnIndex,
      professorName,
      currentQuestionIdx,
      winner
    });
  };

  const handleImportBackup = async (file) => {
    try {
      const imported = await importBackupFile(file);
      if (imported.teams) setTeams(imported.teams);
      if (imported.activeTeamId) setActiveTeamId(imported.activeTeamId);
      if (imported.turnIndex) setTurnIndex(imported.turnIndex);
      if (imported.professorName) setProfessorName(imported.professorName);
      if (imported.currentQuestionIdx) setCurrentQuestionIdx(imported.currentQuestionIdx);
      if (imported.winner) setWinner(imported.winner);
      alert('Backup da sala restaurado com sucesso!');
    } catch (err) {
      alert('Erro ao carregar o backup: ' + err.message);
    }
  };

  // Resetar Jogo
  const resetGame = () => {
    setTeams(INITIAL_TEAMS);
    setActiveTeamId('alfa');
    setTurnIndex(1);
    setCurrentQuestionIdx(0);
    setTimer(30);
    setTimerActive(false);
    setTimerExpiresAt(null);
    setPausedRemaining(null);
    setSelectedOption(null);
    setIsAnswered(false);
    setAnswerResult(null);
    setWinner(null);
    setRollbackAlert(null);
    setViewMode('LOBBY');
    setIsGameStarted(false);
    setIsGamePaused(false);

    if (isOnlineRoom && roomCode) {
      publishRoomState(roomCode, {
        type: 'RESET_GAME',
        viewMode: 'LOBBY',
        teams: INITIAL_TEAMS,
        activeTeamId: 'alfa',
        turnIndex: 1,
        isGameStarted: false,
        isGamePaused: false,
        currentQuestionIdx: 0,
        selectedOption: null,
        isAnswered: false,
        answerResult: null,
        winner: null,
        timer: 30,
        timerExpiresAt: null
      });
    }
  };

  // Ações da Barra de Apresentação
  const triggerDemoAction = (actionType) => {
    if (actionType === 'ROLLBACK_DEMO') {
      processError(activeTeamId);
      processError(activeTeamId);
      processError(activeTeamId);
    } else if (actionType === 'FILL_BINGO_DEMO') {
      unlockBadge(activeTeamId, 'tuples');
      unlockBadge(activeTeamId, 'degree');
      unlockBadge(activeTeamId, 'body');
    } else if (actionType === 'ADVANCE_5') {
      setTeams((prev) =>
        prev.map((t) => (t.id === activeTeamId ? { ...t, position: Math.min(15, t.position + 5), credits: t.credits + 300 } : t))
      );
    } else if (actionType === 'VICTORY_DEMO') {
      triggerDemoAction('FILL_BINGO_DEMO');
      setTeams((prev) =>
        prev.map((t) => (t.id === activeTeamId ? { ...t, position: 15, credits: t.credits + 500 } : t))
      );
      setWinner(activeTeam);
    }
  };

  return {
    teams,
    activeTeam,
    activeTeamId,
    setActiveTeamId,
    turnIndex,
    registerTeam,
    professorName,
    setProfessorName,
    currentQuestion,
    currentQuestionIdx,
    timer,
    timerExpiresAt,
    selectedOption,
    isAnswered,
    answerResult,
    rollbackAlert,
    closeRollbackAlert,
    winner,
    showExplanationModal,
    setShowExplanationModal,
    showLobbyModal,
    setShowLobbyModal,
    showLeaderboardModal,
    setShowLeaderboardModal,
    isMuted,
    isGameStarted,
    isGamePaused,
    isAdmin,
    setIsAdmin,
    toggleAdmin,
    adminPassword,
    setAdminPassword,
    checkAdminPassword,
    logoutAdmin,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    stopGame,
    handleAnswer,
    nextTurn,
    useSabotageCard,
    resetGame,
    viewMode,
    setViewMode,
    joinTeamMember,
    removeTeamMember,
    roomCode,
    setRoomCode,
    isOnlineRoom,
    setIsOnlineRoom,
    createOnlineRoom,
    joinOnlineRoom,
    handleExportBackup,
    handleImportBackup,
    triggerDemoAction
  };
}
