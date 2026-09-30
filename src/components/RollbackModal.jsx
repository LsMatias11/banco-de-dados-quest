import React from 'react';
import { Skull, AlertOctagon, RotateCcw } from 'lucide-react';

export default function RollbackModal({ rollbackAlert, onClose, studentData }) {
  if (!rollbackAlert) return null;

  const playerLabel = rollbackAlert.player === 'P1'
    ? studentData.p1Name
    : studentData.p2Name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-red-500/20 text-center relative overflow-hidden animate-pop-in">
        
        {/* Luz vermelha pulsante de emergência */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Ícone de alerta de sistema */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-400 glow-red animate-bounce">
          <AlertOctagon className="w-10 h-10" />
        </div>

        {/* Título de Alerta Crítico */}
        <h2 className="text-xl font-extrabold text-red-400 tracking-wider font-mono uppercase mb-1">
          TRANSACTION ROLLED BACK!
        </h2>
        <p className="text-xs font-mono text-red-300/80 mb-4">
          Falha Crítica no Sistema (3 Erros Acumulados)
        </p>

        {/* Descrição do Efeito do Rollback */}
        <div className="bg-slate-950 border border-red-500/30 rounded-xl p-4 mb-5 text-left font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Jogador Afetado:</span>
            <span className="font-bold text-red-400">{playerLabel} ({rollbackAlert.player})</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Penalidade de Transação:</span>
            <span className="font-bold text-red-400 font-mono">-5 Casas no Mapa</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estado de Erros:</span>
            <span className="font-bold text-emerald-400">Resetado para 0/3</span>
          </div>
        </div>

        {/* Botão de Confirmação */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold text-sm font-mono tracking-wider shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Continuar Partida
        </button>
      </div>
    </div>
  );
}
