import React, { useState } from 'react';
import { Sparkles, Skull, Award, FastForward, Trophy, Edit3, Check } from 'lucide-react';

export default function DemoBar({ onDemoAction, studentData, setStudentData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [p1NameInput, setP1NameInput] = useState(studentData.p1Name);
  const [p1MatInput, setP1MatInput] = useState(studentData.p1Mat);
  const [profInput, setProfInput] = useState(studentData.professor);

  const handleSaveStudent = () => {
    setStudentData((prev) => ({
      ...prev,
      p1Name: p1NameInput || prev.p1Name,
      p1Mat: p1MatInput || prev.p1Mat,
      professor: profInput || prev.professor
    }));
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-y border-amber-500/40 px-4 py-2 text-xs font-mono animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Título da Barra Demo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-bold text-amber-300">
            Painel de Apresentação Acadêmica (Simulações Rápida):
          </span>
        </div>

        {/* Botões de Ação Instantânea para Apresentação */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simular Rollback */}
          <button
            onClick={() => onDemoAction('ROLLBACK_DEMO')}
            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 flex items-center gap-1 transition-all"
            title="Simula 3 erros acumulados e dispara o aviso de ROLLBACK"
          >
            <Skull className="w-3.5 h-3.5 text-red-400" />
            Simular Rollback
          </button>

          {/* Desbloquear Bingo */}
          <button
            onClick={() => onDemoAction('FILL_BINGO_DEMO')}
            className="px-2.5 py-1 rounded bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 flex items-center gap-1 transition-all"
            title="Preenche uma linha do Bingo para demonstrar desbloqueios"
          >
            <Award className="w-3.5 h-3.5 text-violet-400" />
            Liberar Linha Bingo
          </button>

          {/* Avançar 5 Casas */}
          <button
            onClick={() => onDemoAction('ADVANCE_5')}
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 transition-all"
            title="Avança 5 nós no mapa Overworld"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            Avançar +5 Casas
          </button>

          {/* Simular Vitória */}
          <button
            onClick={() => onDemoAction('VICTORY_DEMO')}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-all"
            title="Demonstra o modal festivo de vitória final"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Simular Vitória
          </button>

          {/* Editar Dados do Aluno */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            {isEditing ? 'Fechar Edição' : 'Editar Seu Nome'}
          </button>
        </div>
      </div>

      {/* Form de Edição de Nome/Matrícula */}
      {isEditing && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Seu Nome / Aluno"
            value={p1NameInput}
            onChange={(e) => setP1NameInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
          />
          <input
            type="text"
            placeholder="Sua Matrícula"
            value={p1MatInput}
            onChange={(e) => setP1MatInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Professor / Mentor"
              value={profInput}
              onChange={(e) => setProfInput(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 flex-1"
            />
            <button
              onClick={handleSaveStudent}
              className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
