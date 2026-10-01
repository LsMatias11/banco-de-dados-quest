import React, { useEffect, useState, useRef } from 'react';
import { Skull, ShieldAlert, Zap, X, Clock, Cpu, Lock } from 'lucide-react';

export default function SabotageNotification({
  alert,
  studentName,
  teams,
  onClose
}) {
  if (!alert) return null;

  const [progress, setProgress] = useState(100);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Determinar qual é a equipe do aluno atual
  const cleanStudent = (studentName || '').trim().toLowerCase();
  const currentTeam = cleanStudent && teams
    ? teams.find((t) =>
        (t.members || []).some((m) => {
          const mName = typeof m === 'string' ? m : m?.name;
          return mName?.trim().toLowerCase() === cleanStudent;
        })
      )
    : null;

  const isAttacker = currentTeam?.id === alert.sourceTeamId;
  const isVictim = currentTeam?.id === alert.targetTeamId;

  // Identificador estável do alerta atual para não reiniciar o timer a cada render
  const alertKey = alert.timestamp || alert.cardId || 'sabotage';

  // Auto-fechar após 5 segundos com barra de progresso suave contínua
  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000;
    setProgress(100);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        if (onCloseRef.current) {
          onCloseRef.current();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [alertKey]);

  // Ícone específico da carta
  const getCardIcon = (cardId) => {
    if (cardId === 'TIMEOUT') return <Clock className="w-5 h-5 text-amber-400" />;
    if (cardId === 'RELATIONAL_OVERLOAD') return <Cpu className="w-5 h-5 text-pink-400" />;
    return <Lock className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md pointer-events-auto">
      <div
        className={`rounded-2xl p-4 shadow-2xl border-2 backdrop-blur-xl relative overflow-hidden transition-all transform animate-fade-in ${
          isVictim
            ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.45)] ring-2 ring-red-400/50'
            : isAttacker
            ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.45)] ring-2 ring-cyan-400/50'
            : 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isVictim
                  ? 'bg-red-500/20 border-red-400 text-red-400 animate-pulse'
                  : isAttacker
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-purple-500/20 border-purple-400 text-purple-300'
              }`}
            >
              {isVictim ? (
                <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce" />
              ) : isAttacker ? (
                <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              ) : (
                getCardIcon(alert.cardId)
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`font-display text-xs font-black uppercase tracking-wider ${
                    isVictim
                      ? 'text-red-400 animate-pulse'
                      : isAttacker
                      ? 'text-cyan-300'
                      : 'text-purple-300'
                  }`}
                >
                  {isVictim
                    ? '⚠️ VOCÊ FOI SABOTADO!'
                    : isAttacker
                    ? '⚔️ SABOTAGEM LANÇADA COM SUCESSO!'
                    : '⚡ ALERTA DE SABOTAGEM NA ARENA'}
                </span>
              </div>

              <p className="text-xs text-white leading-relaxed font-sans">
                {isVictim ? (
                  <>
                    A <strong className="text-amber-300 font-bold">{alert.sourceTeamName}</strong> ativou{' '}
                    <strong className="text-red-300 underline font-bold">{alert.cardName}</strong> contra a sua equipe (
                    <strong className="text-white font-bold">{alert.targetTeamName}</strong>)!
                  </>
                ) : isAttacker ? (
                  <>
                    Sua equipe (<strong className="text-cyan-300 font-bold">{alert.sourceTeamName}</strong>) usou{' '}
                    <strong className="text-emerald-300 underline font-bold">{alert.cardName}</strong> contra a{' '}
                    <strong className="text-white font-bold">{alert.targetTeamName}</strong>!
                  </>
                ) : (
                  <>
                    A <strong className="text-amber-300 font-bold">{alert.sourceTeamName}</strong> usou{' '}
                    <strong className="text-purple-300 underline font-bold">{alert.cardName}</strong> contra a{' '}
                    <strong className="text-white font-bold">{alert.targetTeamName}</strong>!
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de progresso do timer da notificação */}
        <div className="w-full bg-slate-950/80 h-1 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full transition-all duration-75 ${
              isVictim ? 'bg-red-500' : isAttacker ? 'bg-cyan-400' : 'bg-purple-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
