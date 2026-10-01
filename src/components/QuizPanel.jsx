import React from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Play, Pause, ShieldAlert, Lock, Clock } from 'lucide-react';

export default function QuizPanel({
  currentQuestion,
  timer,
  selectedOption,
  isAnswered,
  answerResult,
  eliminatedOptions = [],
  currentPlayer,
  activeTeam,
  studentName,
  onAnswer,
  onNextTurn,
  setShowExplanationModal,
  isGameStarted,
  isGamePaused,
  isAdmin,
  onStartGame,
  onTogglePause
}) {
  const maxTime = 30;
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Verifica se o jogador atual pertence à equipe que está no turno
  const cleanStudent = (studentName || '').trim().toLowerCase();
  const isMemberOfActiveTeam = Boolean(
    cleanStudent &&
    activeTeam?.members?.some((m) => {
      const mName = typeof m === 'string' ? m : m?.name;
      return mName?.trim().toLowerCase() === cleanStudent;
    })
  );

  // Somente o jogador da equipe ativa (ou o ADM) pode responder
  const canTeamAnswer = isMemberOfActiveTeam || isAdmin;

  return (
    <section className="h-full flex flex-col" data-purpose="quiz-interface">
      <div className="glass-panel rounded-3xl p-5 lg:p-6 flex flex-col justify-between flex-1 relative overflow-hidden border-cyan-500/40 bg-slate-900/90 h-full">
        
        {/* Ambient corner glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-arcade-cyan/15 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* Active Team Prominent Badge */}
          <div className="mb-3.5 p-2.5 rounded-xl bg-slate-950 border border-cyan-400/40 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">TURNO ATUAL:</span>
              <span className="font-display font-black text-xs text-white uppercase tracking-wider">
                {currentPlayer || 'Equipe Alfa'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-md uppercase">
              RESPONDENDO AGORA
            </span>
          </div>

          {/* ADM Control Bar & Status Banner */}
          {!isGameStarted ? (
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-arcade-darkest border-2 border-emerald-400 shadow-glow-emerald/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black animate-pulse">
                  <Play className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-display font-black text-white uppercase tracking-wider">
                    SALA AGUARDANDO O ADMINISTRADOR
                  </h4>
                  <p className="text-[10px] text-emerald-300 font-medium">
                    {isAdmin ? "A partida está pronta com 4 equipes. Clique para começar!" : "O Administrador irá iniciar a partida em breve. Analise o mapa!"}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={onStartGame}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-glow-emerald border border-white/50 active:scale-95 transition flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>INICIAR PARTIDA</span>
                </button>
              )}
            </div>
          ) : isGamePaused ? (
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-arcade-darkest border-2 border-amber-400 shadow-glow-gold/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Pause className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-display font-black text-amber-300 uppercase tracking-wider">
                    PARTIDA PAUSADA PELO ADMINISTRADOR
                  </h4>
                  <p className="text-[10px] text-slate-300 font-medium">
                    {isAdmin ? "Cronômetro congelado. Clique para retornar ao jogo." : "O cronômetro está pausado para explicações teóricas."}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={onTogglePause}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-glow-gold border border-white/50 active:scale-95 transition flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>CONTINUAR PARTIDA</span>
                </button>
              )}
            </div>
          ) : null}

          {/* Duel Header & Timer HUD */}
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/20 mb-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-400/50 text-arcade-cyan shadow-glow-cyan/20">
                  {currentQuestion.section} • MODELO RELACIONAL
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-arcade-purple/60 to-arcade-violet/50 border border-purple-400/40 text-purple-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
                  Badge em Disputa
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-display font-black text-white">
                ★ <span className="">{currentQuestion.badgeAssociated || 'Mestre das Tuplas'}</span>
              </div>
            </div>

            {/* Circular Sci-Fi Reactor Timer */}
            <div className="flex items-center gap-3">
              {isAdmin && isGameStarted && (
                <button
                  onClick={onTogglePause}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition shadow-md ${
                    isGamePaused
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-glow-emerald'
                      : 'bg-amber-950/80 text-amber-300 border-amber-400/50 hover:bg-amber-900'
                  }`}
                  title={isGamePaused ? 'Continuar Partida' : 'Pausar Partida'}
                >
                  {isGamePaused ? <Play className="w-4 h-4 fill-slate-950" /> : <Pause className="w-4 h-4 fill-amber-300" />}
                </button>
              )}

              {/* Circular Sci-Fi Reactor Timer (High-DPI Vector, Sem Borda Quadrada) */}
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 bg-slate-950/90 border transition-all duration-300 shadow-inner ${
                  timer > 15
                    ? 'border-cyan-400/50 shadow-[0_0_16px_rgba(0,245,255,0.3)]'
                    : timer > 7
                    ? 'border-amber-400/50 shadow-[0_0_16px_rgba(255,183,3,0.3)]'
                    : 'border-red-500 shadow-[0_0_20px_rgba(255,23,68,0.45)] animate-pulse'
                }`}
              >
                <svg className="w-full h-full -rotate-90 p-1 overflow-visible" viewBox="0 0 100 100">
                  {/* Trilha de fundo */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#0b172a"
                    strokeWidth="8"
                  />
                  {/* Trilha de progresso nítida */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={timer > 15 ? "#00f5ff" : timer > 7 ? "#ffb703" : "#ff1744"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 - (Math.max(0, timer) / maxTime) * 251.3}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className={`font-display font-black text-xs sm:text-sm tracking-tight leading-none ${
                      timer > 15
                        ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]'
                        : timer > 7
                        ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(255,183,3,0.8)]'
                        : 'text-red-400 drop-shadow-[0_0_10px_rgba(255,23,68,0.9)] animate-pulse'
                    }`}
                  >
                    {timer}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Prompt Banner */}
          <div className="mb-4 bg-slate-950 rounded-2xl p-4 border-2 border-cyan-400/50 shadow-lg relative">
            <div className="flex items-center gap-1.5 text-[9px] font-display font-extrabold uppercase tracking-widest text-arcade-cyan mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-arcade-magenta"></span>
              DESAFIO TEÓRICO FORMAL
            </div>
            <h2 className="text-sm lg:text-base font-bold text-white leading-snug tracking-tight">
              {currentQuestion.question}
            </h2>

            {currentQuestion.codeSnippet && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 my-3 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{currentQuestion.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Status do Turno: Quem tem permissão de responder */}
          {isGameStarted && !isGamePaused && !isAnswered && (
            <div className={`mb-3 p-3 rounded-xl border flex items-center justify-between gap-2.5 text-xs font-mono shadow-sm transition ${
              isMemberOfActiveTeam
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-glow-cyan/20 ring-1 ring-cyan-400/40'
                : isAdmin
                ? 'bg-purple-950/80 border-purple-400/60 text-purple-200'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {isMemberOfActiveTeam ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                    <span className="font-bold uppercase tracking-wider text-cyan-300">
                      🎯 É a vez da sua equipe ({activeTeam?.name})! Escolha sua resposta abaixo.
                    </span>
                  </>
                ) : isAdmin ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-bold text-purple-200">
                      👑 MODO ADM: Aguardando resposta da {activeTeam?.name || 'Equipe'}.
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Turno exclusivo da <strong className="text-white font-bold">{activeTeam?.name}</strong>. Apenas integrantes dela podem responder!
                    </span>
                  </>
                )}
              </div>
              {cleanStudent && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 shrink-0 hidden sm:inline">
                  Você: {studentName}
                </span>
              )}
            </div>
          )}

          {/* 4 Tactical Answer Modules */}
          <div className="space-y-2.5" data-purpose="answer-choices">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;
              const isEliminated = Array.isArray(eliminatedOptions) && eliminatedOptions.includes(idx);
              const canInteract = isGameStarted && !isGamePaused && !isAnswered && canTeamAnswer && timer > 0 && !isEliminated;

              let cardStyle = "border-slate-700 bg-slate-900/90 hover:border-cyan-400 hover:bg-arcade-surface/60 text-slate-200";
              let btnLetterStyle = "bg-arcade-card border-cyan-400/40 text-cyan-300 group-hover:text-white group-hover:border-cyan-300";

              if (isEliminated) {
                cardStyle = "border-dashed border-red-500/40 bg-slate-950/75 text-slate-500 opacity-40 line-through cursor-not-allowed pointer-events-none";
                btnLetterStyle = "bg-red-950/80 border-red-500/40 text-red-400 line-through";
              } else if (!isGameStarted || isGamePaused) {
                cardStyle = "border-slate-800 bg-slate-950/60 text-slate-400 opacity-75 cursor-not-allowed";
              } else if (timer <= 0 && !isAnswered) {
                cardStyle = "border-red-900/60 bg-red-950/30 text-red-400/80 opacity-60 cursor-not-allowed";
              } else if (!canTeamAnswer && !isAnswered) {
                cardStyle = "border-slate-800 bg-slate-950/50 text-slate-500 opacity-60 cursor-not-allowed";
              } else if (isAnswered) {
                if (isCorrectAnswer) {
                  cardStyle = "border-2 border-emerald-400 bg-gradient-to-r from-emerald-950 via-slate-900 to-arcade-deep shadow-glow-emerald ring-1 ring-emerald-300 text-white font-bold";
                  btnLetterStyle = "bg-gradient-to-tr from-emerald-400 via-arcade-emerald to-teal-300 text-slate-950 font-black shadow-glow-emerald";
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = "border-2 border-red-500 bg-red-950/50 text-red-200 animate-shake";
                  btnLetterStyle = "bg-red-500 text-white font-black";
                } else {
                  cardStyle = "border-slate-800 bg-slate-950/40 text-slate-600 opacity-40";
                }
              } else if (isSelected) {
                cardStyle = "border-2 border-cyan-400 bg-gradient-to-r from-cyan-950 via-slate-900 to-arcade-deep shadow-glow-cyan ring-1 ring-cyan-300 text-white font-bold";
                btnLetterStyle = "bg-gradient-to-tr from-cyan-400 via-arcade-cyan to-teal-300 text-slate-950 font-black shadow-glow-cyan";
              }

              return (
                <label
                  key={idx}
                  onClick={() => canInteract && onAnswer(idx, studentName)}
                  className={`group relative flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border transition cursor-pointer shadow-md ${cardStyle}`}
                >
                  <input className="sr-only" name="tuplas_question" type="radio" checked={isSelected} readOnly />
                  <div className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-display font-black shrink-0 transition ${btnLetterStyle}`}>
                    {optionLetters[idx]}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold leading-relaxed pt-0.5 block">
                      {optionText}
                    </span>
                  </div>

                  {isEliminated && (
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/90 border border-red-500/40 px-2 py-0.5 rounded shrink-0 self-center not-italic tracking-wider">
                      ❌ ELIMINADA
                    </span>
                  )}
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 self-center" />
                  )}
                </label>
              );
            })}
          </div>

          {/* Result Feedback Banner com Quem Respondeu */}
          {isAnswered && (
            <div className={`mt-3 p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in ${
              selectedOption === currentQuestion.correctIndex
                ? 'bg-emerald-950/85 border-emerald-400 text-emerald-200 shadow-glow-emerald/20'
                : 'bg-red-950/85 border-red-500 text-red-200 shadow-glow-red/20'
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                {selectedOption === currentQuestion.correctIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                ) : answerResult?.isTimeout ? (
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                )}
                <div className="text-xs">
                  <strong className="font-bold text-white uppercase block">
                    {selectedOption === currentQuestion.correctIndex
                      ? '🎉 RESPOSTA CORRETA!'
                      : answerResult?.isTimeout
                      ? '⏰ TEMPO ESGOTADO! RESPOSTA INCORRETA'
                      : '❌ RESPOSTA INCORRETA!'}
                  </strong>
                  <span>
                    {selectedOption === currentQuestion.correctIndex
                      ? `A equipe ${answerResult?.teamName || currentPlayer || 'ativa'} acertou a questão e avançou no Overworld!`
                      : answerResult?.isTimeout
                      ? `O tempo limite de 30 segundos expirou antes da resposta. A opção correta era: `
                      : `A equipe ${answerResult?.teamName || currentPlayer || 'ativa'} errou. A opção correta era: `}
                    {selectedOption !== currentQuestion.correctIndex && (
                      <strong className="text-emerald-300 font-mono font-bold">{optionLetters[currentQuestion.correctIndex]}</strong>
                    )}
                  </span>
                </div>
              </div>

              {/* Tag visual de quem respondeu a pergunta */}
              <div className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-400/30 text-slate-300 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-inner">
                <span className="text-cyan-400 font-bold">
                  {answerResult?.isTimeout ? '⏱️ Status:' : '👤 Respondido por:'}
                </span>
                <span className="text-white font-bold tracking-wide">
                  {answerResult?.answeredBy || (studentName ? studentName.trim() : (currentPlayer || 'Jogador'))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Confirmation CTA */}
        <div className="mt-4 pt-3.5 border-t border-cyan-500/20 flex items-center justify-between gap-3">
          {isAnswered ? (
            <button
              onClick={() => setShowExplanationModal(true)}
              className="text-[11px] font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 rounded-xl transition shadow-glow-cyan/20 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Fundamentação Date</span>
            </button>
          ) : (
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl cursor-not-allowed opacity-60" title="Responda a questão para liberar a explicação">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Fundamentação (Bloqueado)</span>
            </div>
          )}

          {isAnswered ? (
            isAdmin ? (
              <button
                onClick={onNextTurn}
                className="relative group px-6 py-2.5 rounded-2xl font-display text-xs font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-arcade-emerald via-arcade-cyan to-teal-300 hover:from-teal-300 hover:to-arcade-emerald shadow-glow-cyan transition-all transform active:scale-95 flex items-center gap-2.5 border border-white/40 cursor-pointer"
              >
                <span>Próximo Turno</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center gap-2 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Aguardando o ADM passar para a próxima pergunta...</span>
              </div>
            )
          ) : !isGameStarted ? (
            <button
              onClick={onStartGame}
              className="relative group px-6 py-2.5 rounded-2xl font-display text-xs font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 shadow-glow-emerald transition-all transform active:scale-95 flex items-center gap-2.5 border border-white/40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>INICIAR PARTIDA</span>
            </button>
          ) : (
            <button
              disabled={selectedOption === null || isGamePaused || !canTeamAnswer || timer <= 0}
              onClick={() => selectedOption !== null && canTeamAnswer && timer > 0 && onAnswer(selectedOption, studentName)}
              className={`relative group px-6 py-2.5 rounded-2xl font-display text-xs font-black tracking-wider uppercase text-slate-950 transition-all transform flex items-center gap-2.5 border border-white/40 ${
                selectedOption !== null && !isGamePaused && canTeamAnswer && timer > 0
                  ? 'bg-gradient-to-r from-arcade-emerald via-arcade-cyan to-teal-300 hover:from-teal-300 hover:to-arcade-emerald shadow-glow-cyan cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60 border-slate-700'
              }`}
            >
              <span>
                {timer <= 0
                  ? '⏰ TEMPO ESGOTADO'
                  : !canTeamAnswer
                  ? `AGUARDANDO A ${(activeTeam?.name || 'OUTRA EQUIPE').toUpperCase()}`
                  : 'CONFIRMAR DECISÃO DA EQUIPE'}
              </span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
