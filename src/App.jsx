import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Award, Trophy, Coins } from 'lucide-react';

import Header from './components/Header';
import MobileNav from './components/MobileNav';
import QuizPanel from './components/QuizPanel';
import OverworldMap from './components/OverworldMap';
import SabotagePanel from './components/SabotagePanel';
import BingoCard from './components/BingoCard';
import TeamLobbyScreen from './components/TeamLobbyScreen';

import RollbackModal from './components/RollbackModal';
import VictoryModal from './components/VictoryModal';
import ExplanationModal from './components/ExplanationModal';
import LeaderboardPanel from './components/LeaderboardPanel';
import DemoBar from './components/DemoBar';

export default function App() {
  const gameState = useGameState();
  const [viewMode, setViewMode] = useState('LOBBY'); // 'LOBBY' or 'GAME'
  const [activeMobileTab, setActiveMobileTab] = useState('quiz');
  const [showDemoBar, setShowDemoBar] = useState(false);
  const [studentName, setStudentName] = useState('Lucas Silva');

  const {
    teams,
    activeTeam,
    activeTeamId,
    setActiveTeamId,
    turnIndex,
    registerTeam,
    professorName,
    setProfessorName,
    currentQuestion,
    timer,
    selectedOption,
    isAnswered,
    answerResult,
    rollbackAlert,
    closeRollbackAlert,
    winner,
    showExplanationModal,
    setShowExplanationModal,
    showLeaderboardModal,
    setShowLeaderboardModal,
    isMuted,
    setIsMuted,
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
  } = gameState;

  const studentData = {
    p1Name: studentName || activeTeam?.name || 'Lucas Silva',
    p1Mat: activeTeam?.roverName || 'Rover Alfa V2',
    professor: professorName
  };

  // Se estiver na tela inicial de Seleção de Equipe (Lobby)
  if (viewMode === 'LOBBY') {
    return (
      <TeamLobbyScreen
        activeTeamId={activeTeamId}
        setActiveTeamId={setActiveTeamId}
        studentName={studentName}
        setStudentName={setStudentName}
        onEnterArena={() => setViewMode('GAME')}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenRules={() => setShowExplanationModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#03050c] sci-grid text-slate-100 flex flex-col font-sans selection:bg-arcade-magenta selection:text-white pb-16 md:pb-0">
      
      {/* Top Header */}
      <Header
        activeTeam={activeTeam}
        teamsCount={teams?.length || 4}
        turnIndex={turnIndex}
        onOpenLobby={() => setViewMode('LOBBY')}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onReset={resetGame}
        showDemoBar={showDemoBar}
        setShowDemoBar={setShowDemoBar}
        isGameStarted={isGameStarted}
        isGamePaused={isGamePaused}
        isAdmin={isAdmin}
        toggleAdmin={toggleAdmin}
        onStartGame={startGame}
        onTogglePause={togglePause}
        onStopGame={stopGame}
      />

      {/* Demo Control Bar */}
      {showDemoBar && (
        <DemoBar
          onDemoAction={triggerDemoAction}
          studentData={studentData}
          setStudentData={(fn) => {
            const updated = fn(studentData);
            if (updated.professor) setProfessorName(updated.professor);
          }}
        />
      )}

      {/* MOBILE QUICK SCOREBOARD & ADM BANNER */}
      <div className="lg:hidden bg-slate-950/90 border-b border-cyan-500/20 px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-display font-bold text-white uppercase text-[11px]">
            {activeTeam?.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-lg border border-cyan-500/30 text-[10px]">
            <Coins className="w-3 h-3 text-cyan-400" />
            <span>{activeTeam?.credits || 1000} PTS</span>
          </div>

          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="flex items-center gap-1 font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-500/30 text-[10px]"
          >
            <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>RANKING</span>
          </button>
        </div>
      </div>

      {/* MAIN GAMING TABLETOP GRID */}
      <main className="max-w-[1920px] mx-auto w-full p-3 lg:p-5 flex-1 flex flex-col">
        
        {/* LAYOUT DESKTOP: Grid 3 Colunas Sci-Fi AAA (MD em diante) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 lg:gap-5 flex-1 min-h-[720px]">
          
          {/* Coluna 1: Quiz & Desafio Teórico (4 Colunas) */}
          <div className="lg:col-span-4 h-full">
            <QuizPanel
              currentQuestion={currentQuestion}
              timer={timer}
              selectedOption={selectedOption}
              isAnswered={isAnswered}
              answerResult={answerResult}
              currentPlayer={activeTeam?.name}
              onAnswer={handleAnswer}
              onNextTurn={nextTurn}
              setShowExplanationModal={setShowExplanationModal}
              isGameStarted={isGameStarted}
              isGamePaused={isGamePaused}
              isAdmin={isAdmin}
              onStartGame={startGame}
              onTogglePause={togglePause}
            />
          </div>

          {/* Coluna 2: Mapa Overworld Sci-Fi (5 Colunas Centerpiece) */}
          <div className="lg:col-span-5 h-full">
            <OverworldMap
              teams={teams}
              activeTeam={activeTeam}
            />
          </div>

          {/* Coluna 3: Arsenal de Sabotagens & Mini-Bingo 3x3 (3 Colunas) */}
          <div className="lg:col-span-3 h-full">
            <SabotagePanel
              sabotageCards={{ P1: activeTeam?.sabotages || [] }}
              activeTeam={activeTeam}
              isAnswered={isAnswered}
              onUseSabotage={useSabotageCard}
            />
          </div>

        </div>

        {/* LAYOUT TABLET E MOBILE (< 1024px): Navegação por Abas Flutuantes */}
        <div className="lg:hidden space-y-4">
          {activeMobileTab === 'quiz' && (
            <div className="min-h-[500px]">
              <QuizPanel
                currentQuestion={currentQuestion}
                timer={timer}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                answerResult={answerResult}
                currentPlayer={activeTeam?.name}
                onAnswer={handleAnswer}
                onNextTurn={nextTurn}
                setShowExplanationModal={setShowExplanationModal}
                isGameStarted={isGameStarted}
                isGamePaused={isGamePaused}
                isAdmin={isAdmin}
                onStartGame={startGame}
                onTogglePause={togglePause}
              />
            </div>
          )}

          {activeMobileTab === 'map' && (
            <div className="min-h-[440px]">
              <OverworldMap
                teams={teams}
                activeTeam={activeTeam}
              />
            </div>
          )}

          {activeMobileTab === 'bingo' && (
            <div className="min-h-[480px] glass-panel-magenta rounded-3xl p-4 bg-slate-900/95 border-2 border-pink-500/40 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-pink-500/20 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <Award className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-black uppercase text-white tracking-wider">
                      BINGO RELACIONAL (CAP. 6)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Conquistas da {activeTeam?.name} (Desbloqueie +250 PTS por selo)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded-xl border border-cyan-400/40">
                  {activeTeam?.name}
                </span>
              </div>
              <BingoCard
                bingoGrid={activeTeam?.bingoGrid || []}
                activeTeam={activeTeam}
              />
            </div>
          )}

          {activeMobileTab === 'sabotage' && (
            <div className="min-h-[500px]">
              <SabotagePanel
                sabotageCards={{ P1: activeTeam?.sabotages || [] }}
                activeTeam={activeTeam}
                isAnswered={isAnswered}
                onUseSabotage={useSabotageCard}
              />
            </div>
          )}
        </div>

      </main>

      {/* Navegação Inferior para Celular */}
      <MobileNav
        activeTab={activeMobileTab}
        setActiveTab={setActiveMobileTab}
        errorCount={activeTeam?.errorCount || 0}
      />

      {/* SYSTEM MODALS */}
      <RollbackModal
        rollbackAlert={rollbackAlert}
        onClose={closeRollbackAlert}
        studentData={{ p1Name: rollbackAlert?.team?.name, p2Name: '' }}
      />

      <VictoryModal
        winner={winner ? 'P1' : null}
        onReset={resetGame}
        studentData={{ p1Name: winner?.name, p1Mat: winner?.roverName }}
        bingoGrid={{ P1: winner?.bingoGrid || [] }}
      />

      <ExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        currentQuestion={currentQuestion}
        answerResult={answerResult}
      />

      <LeaderboardPanel
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        players={teams}
        activePlayerId={activeTeamId}
        setActivePlayerId={setActiveTeamId}
      />

    </div>
  );
}
