import React, { useState } from 'react';
import { Lock, Crown, KeyRound, Check, X, ShieldAlert, LogOut, Sparkles } from 'lucide-react';

export default function AdminAuthModal({
  isOpen,
  onClose,
  isAdmin,
  checkAdminPassword,
  logoutAdmin,
  adminPassword,
  setAdminPassword
}) {
  const [inputPassword, setInputPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e?.preventDefault();
    if (checkAdminPassword(inputPassword)) {
      setErrorMsg('');
      setInputPassword('');
      setSuccessMsg('Autenticação com Sucesso! Modo Professor Ativo.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg('Senha incorreta! Apenas o Professor/ADM pode gerenciar a partida.');
    }
  };

  const handleChangePassword = (e) => {
    e?.preventDefault();
    if (!newPassInput || newPassInput.trim().length < 3) {
      setErrorMsg('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }
    setAdminPassword(newPassInput.trim());
    setNewPassInput('');
    setIsChangingPass(false);
    setErrorMsg('');
    setSuccessMsg('Nova senha de ADM salva com sucesso!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 p-6 shadow-2xl shadow-amber-500/10">
        
        {/* Glow corner ambient */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-glow-gold/40 shrink-0">
            {isAdmin ? <Crown className="w-6 h-6 fill-slate-950" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-display text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              {isAdmin ? 'PAINEL DE SEGURANÇA ADM' : 'AUTENTICAÇÃO DE PROFESSOR'}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {isAdmin
                ? 'Você está autenticado no Modo Administrador.'
                : 'Insira a senha de ADM para liberar os controles da partida.'}
            </p>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGGED IN AS ADMIN */}
        {isAdmin ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/40 text-xs font-medium text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Modo ADM Ativo (Senha: <b>{adminPassword}</b>)</span>
              </div>
              <span className="text-[9px] font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold">
                AUTENTICADO
              </span>
            </div>

            {!isChangingPass ? (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsChangingPass(true)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alterar Senha de ADM</span>
                </button>

                <button
                  onClick={() => {
                    logoutAdmin();
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-500/40 transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair (Bloquear)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-300">
                  Nova Senha de Administrador:
                </label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Ex: 5678 ou minhaSenha"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-400/50 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPass(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-glow-gold"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* NOT LOGGED IN - LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Senha de Administrador / PIN:</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">(Padrão: 1234)</span>
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Digite a senha (ex: 1234)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-400 transition"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-glow-gold border border-white/40 active:scale-95 transition flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>DESBLOQUEAR ADM</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
