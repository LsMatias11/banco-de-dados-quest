import React, { useState } from 'react';
import { Wifi, Copy, Check, X, Globe, Radio, Sparkles, ArrowRight } from 'lucide-react';

export default function OnlineRoomModal({
  isOpen,
  onClose,
  roomCode,
  isOnlineRoom,
  createOnlineRoom,
  joinOnlineRoom,
  isAdmin
}) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleCreateNewRoom = () => {
    const newCode = createOnlineRoom();
    setFeedback(`🚀 Sala ${newCode} criada com sucesso! Compartilhe o código ou link com os alunos.`);
  };

  const handleJoinRoom = (e) => {
    e?.preventDefault();
    if (!inputCode.trim()) {
      setFeedback('⚠️ Por favor, digite o código da sala.');
      return;
    }
    const success = joinOnlineRoom(inputCode);
    if (success) {
      setFeedback(`✓ Conectado à sala ${inputCode.toUpperCase()}!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const roomLink = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    : `https://matias11.netlify.app?room=${roomCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(roomLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-cyan-400/50 p-6 shadow-2xl shadow-cyan-500/20">
        
        {/* Glow corner */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-glow-cyan shrink-0">
            <Globe className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="font-display text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              SALA MULTIPLAYER ONLINE
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Sincronize projetores, notebooks e celulares em tempo real!
            </p>
          </div>
        </div>

        {/* Active Status Badge */}
        {isOnlineRoom && (
          <div className="mb-5 p-4 rounded-2xl bg-slate-950 border border-emerald-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CONECTADO NA SALA:</div>
                <div className="text-xl font-display font-black text-white tracking-widest text-emerald-300">
                  {roomCode}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-400/40 hover:bg-emerald-950 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Copiar apenas o código da sala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIADO!' : 'CÓDIGO'}</span>
              </button>

              <button
                onClick={copyLinkToClipboard}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/40 hover:bg-cyan-950 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Copiar link completo com a sala para enviar aos alunos"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'LINK COPIADO!' : 'LINK'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-4">
          
          {/* Option A: Entrar em Sala Existente */}
          <form onSubmit={handleJoinRoom} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>ENTRAR EM UMA SALA EXISTENTE (ALUNOS)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Ex: BD-8841"
                className="flex-1 bg-slate-900 text-white font-mono text-sm uppercase px-4 py-2.5 rounded-xl border border-cyan-400/40 focus:border-cyan-400 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-glow-cyan active:scale-95 transition cursor-pointer"
              >
                <span>CONECTAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Option B: Criar Nova Sala (ADM / Professor) */}
          {isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-display font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  CRIAR NOVA SALA PARA A TURMA
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Gera um novo código de sala para apresentar no projetor.
                </p>
              </div>

              <button
                onClick={handleCreateNewRoom}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider shadow-glow-gold border border-white/40 active:scale-95 transition cursor-pointer shrink-0"
              >
                CRIAR SALA
              </button>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-400/50 font-mono text-xs text-center text-cyan-300 animate-fade-in">
              {feedback}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
