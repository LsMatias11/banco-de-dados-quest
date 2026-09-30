import React from 'react';
import { BookOpen, X, CheckCircle2, FileText } from 'lucide-react';

export default function ExplanationModal({ isOpen, onClose, currentQuestion, answerResult }) {
  if (!isOpen || !currentQuestion) return null;

  const isCorrect = answerResult?.isCorrect;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-pop-in">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-950 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Fundamentação Teórica — C. J. Date
            </h3>
            <p className="text-[10px] text-cyan-400 font-mono">
              {currentQuestion.section} — 8ª Edição
            </p>
          </div>
        </div>

        {/* Status de Acerto/Erro */}
        {answerResult && (
          <div className={`p-2.5 rounded-xl border mb-3 flex items-center gap-2 font-mono text-xs ${
            isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`} />
            <span>{isCorrect ? 'Resposta Exata segundo o Modelo Relacional!' : 'Incorreto ou Divergente da Teoria de Date.'}</span>
          </div>
        )}

        {/* Enunciado Resumido */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            <strong className="text-slate-100">Questão:</strong> {currentQuestion.question}
          </p>
        </div>

        {/* Explicação Científica do C. J. Date */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 mb-5 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-bold border-b border-slate-800 pb-1.5">
            <FileText className="w-3.5 h-3.5" />
            Explicação Explicitada no Livro:
          </div>
          <p className="text-slate-300">{currentQuestion.explanation}</p>
        </div>

        {/* Botão Entendi */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wider transition-all"
        >
          Entendido / Voltar ao Jogo
        </button>
      </div>
    </div>
  );
}
