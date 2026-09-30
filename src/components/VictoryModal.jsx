import React from 'react';
import { Trophy, Award, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

export default function VictoryModal({ winner, onReset, studentData, bingoGrid }) {
  if (!winner) return null;

  const winnerName = winner === 'P1' ? studentData.p1Name : studentData.p2Name;
  const winnerMat = winner === 'P1' ? studentData.p1Mat : studentData.p2Mat;
  const badgesUnlocked = bingoGrid[winner].flat().filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-cyan-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-cyan-500/30 text-center relative overflow-hidden animate-pop-in">
        
        {/* Luz ambiente dourada/cyan */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />

        {/* Ícone de Troféu */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 mx-auto mb-5 shadow-xl shadow-amber-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
            <Trophy className="w-11 h-11 animate-bounce" />
          </div>
        </div>

        {/* Título de Vitória */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
            GRANDE VENDEDOR!
          </h2>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <p className="text-xs font-mono text-slate-400 mb-6">
          Requisitos Cumpridos: Nó 15 (FINISH) + Cartela Bingo 3×3 Completa
        </p>

        {/* Card do Campeão */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 text-left font-mono text-xs text-slate-300 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Campeão do Desafio:</span>
            <span className="font-extrabold text-cyan-400 text-sm">{winnerName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Matrícula:</span>
            <span className="font-bold text-slate-200">{winnerMat}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Badges Teóricas Conquistadas:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {badgesUnlocked}/9 Badges
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Avaliação do Mentor:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado com Louvor (Date Cap. 6)
            </span>
          </div>
        </div>

        {/* Botão Jogar Novamente */}
        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Jogar Novamente / Nova Partida
        </button>
      </div>
    </div>
  );
}
