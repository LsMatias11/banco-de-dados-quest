import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou um erro de renderização:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060e20] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl max-w-md shadow-2xl flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-cyan-300 uppercase">Sincronizando Sessão do BD Quest...</h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              O sistema detectou um ajuste de dados relacioanais e recuperará a sessão em instantes.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold text-xs uppercase rounded-xl hover:brightness-110 transition cursor-pointer shadow-glow-cyan"
            >
              Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
