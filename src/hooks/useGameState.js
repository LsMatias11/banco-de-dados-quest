import { useState, useEffect, useCallback } from 'react';
import { QUESTIONS, BINGO_BADGES, SABOTAGE_CARDS } from '../data/gameData';
import confetti from 'canvas-confetti';
import { saveToLocalStorage, loadFromLocalStorage, exportBackupFile, importBackupFile } from '../utils/backupManager';

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
    members: ['Dev1', 'DBA', 'Arq', 'Anl'],
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
    members: ['Dev2', 'DBA2', 'Arq2', 'Anl2'],
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
    members: ['Dev3', 'DBA3', 'Arq3', 'Anl3'],
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
    members: ['Dev4', 'DBA4', 'Arq4', 'Anl4'],
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

  // Controle do ADM / Professor para Partida
  const [isGameStarted, setIsGameStarted] = useState(savedState?.isGameStarted || false);
  const [isGamePaused, setIsGamePaused] = useState(savedState?.isGamePaused || false);

  // Modo ADM / Professor vs Modo Aluno (Leitura automática via URL ?adm=1 ou botão 🔒 ADM)
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('adm=1') || window.location.search.includes('admin=true'))) {
      return true;
    }
    return savedState?.isAdmin || false;
  });

  const toggleAdmin = () => setIsAdmin((prev) => !prev);

  // Modificadores de sabotagem ativas
  const [activeSabotages, setActiveSabotages] = useState(savedState?.activeSabotages || {
    timeoutActive: false,
    parallelLockActive: false
  });

  const [professorName, setProfessorName] = useState(savedState?.professorName || 'Prof. C. J. Date');

  // Pergunta & Cronômetro (30s por padrão)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(savedState?.currentQuestionIdx || 0);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

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

  // Auto-salvar no LocalStorage
  useEffect(() => {
    saveToLocalStorage({
      teams,
      activeTeamId,
      turnIndex,
      isGameStarted,
      isGamePaused,
      isAdmin,
      activeSabotages,
      professorName,
      currentQuestionIdx,
      winner
    });
  }, [teams, activeTeamId, turnIndex, isGameStarted, isGamePaused, isAdmin, activeSabotages, professorName, currentQuestionIdx, winner]);

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

    setCurrentQuestionIdx((prev) => (prev + 1) % QUESTIONS.length);
    setTurnIndex((prev) => prev + 1);

    setTeams((prevTeams) => {
      const currentIdx = prevTeams.findIndex((t) => t.id === activeTeamId);
      const nextIdx = (currentIdx + 1) % prevTeams.length;
      setActiveTeamId(prevTeams[nextIdx].id);
      return prevTeams;
    });

    if (activeSabotages.timeoutActive) {
      setTimer(15); // Reduz de 30s para 15s!
      setActiveSabotages((prev) => ({ ...prev, timeoutActive: false }));
    } else {
      setTimer(30);
    }

    if (isGameStarted && !isGamePaused) {
      setTimerActive(true);
    }
  }, [activeTeamId, activeSabotages.timeoutActive, isGameStarted, isGamePaused]);

  // Funções de Controle do ADM / Professor
  const startGame = () => {
    setIsGameStarted(true);
    setIsGamePaused(false);
    setTimerActive(true);
  };

  const pauseGame = () => {
    setIsGamePaused(true);
    setTimerActive(false);
  };

  const resumeGame = () => {
    setIsGamePaused(false);
    setTimerActive(true);
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
  };

  // Cronômetro (só roda se a partida foi iniciada pelo ADM e NÃO está pausada)
  useEffect(() => {
    let interval = null;
    if (isGameStarted && !isGamePaused && timerActive && timer > 0 && !isAnswered && !winner) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (isGameStarted && !isGamePaused && timer === 0 && !isAnswered && !winner) {
      handleTimeOut();
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isGamePaused, timerActive, timer, isAnswered, winner]);

  const handleTimeOut = () => {
    setTimerActive(false);
    setIsAnswered(true);
    setAnswerResult({
      isCorrect: false,
      explanation: 'TEMPO ESGOTADO! A transação da equipe excedeu o timeout.'
    });
    processError(activeTeamId);
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

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setAnswerResult({
      isCorrect,
      explanation: currentQuestion.explanation
    });

    if (isCorrect) {
      setTeams((prev) =>
        prev.map((t) => {
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
        })
      );
    } else {
      processError(activeTeamId);
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
      setTimer((prev) => Math.max(5, prev - 15));
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
    setTimerActive(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setAnswerResult(null);
    setWinner(null);
    setRollbackAlert(null);
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
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    stopGame,
    handleAnswer,
    nextTurn,
    useSabotageCard,
    resetGame,
    handleExportBackup,
    handleImportBackup,
    triggerDemoAction
  };
}
