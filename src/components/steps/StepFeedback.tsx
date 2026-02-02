import React, { useMemo } from 'react';
import { useGame } from '../../context/useGame';
import { Button } from '../ui/Button';
import { generateReport } from '../../logic/feedback';
import {
  Trophy,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  AlertOctagon,
} from 'lucide-react';

export const StepFeedback = () => {
  const { currentCase, form, selectedPlan, simLog, nextCase, resetGame } =
    useGame();

  // Cálculo Seguro do Relatório
  const report = useMemo(() => {
    if (!currentCase) return null;

    try {
      // Pega o último resultado da simulação com segurança
      const lastSimOutcome =
        simLog && simLog.length > 0
          ? simLog[simLog.length - 1].outcomeType
          : undefined;

      return generateReport(currentCase, form, selectedPlan, lastSimOutcome);
    } catch (error) {
      console.error('Erro fatal ao gerar relatório:', error);
      return 'ERROR';
    }
  }, [currentCase, form, selectedPlan, simLog]);

  // Renderização de Erro (Fallback UI)
  if (report === 'ERROR') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 animate-fade-in">
        <AlertOctagon size={48} className="text-rose-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Erro no Cálculo de Feedback
        </h3>
        <p className="text-gray-400 mb-6">
          Ocorreu um problema ao processar suas respostas.
        </p>
        <Button onClick={resetGame} variant="secondary">
          Reiniciar Caso
        </Button>
      </div>
    );
  }

  // Renderização de Loading
  if (!currentCase || !report) {
    return (
      <div className="text-center p-10 text-white animate-pulse">
        <p>Gerando relatório...</p>
      </div>
    );
  }

  const { score, items } = report;
  const scoreColor =
    score >= 80
      ? 'text-emerald-400'
      : score >= 50
      ? 'text-amber-400'
      : 'text-rose-400';
  const progressColor =
    score >= 80
      ? 'bg-emerald-500'
      : score >= 50
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-slide-up">
      {/* SCORE HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 border border-white/10 mb-6 relative group">
          <Trophy size={40} className={scoreColor} />
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>

        <h2 className="text-5xl font-black text-white tracking-tighter mb-2">
          {score}%{' '}
          <span className="text-2xl text-gray-500 font-medium">
            de Precisão
          </span>
        </h2>

        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mt-4 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* FEEDBACK ITEMS */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border flex gap-4 items-start transition-all duration-500 ${
              item.isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`mt-1 p-1 rounded-full ${
                item.isCorrect
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/20 text-rose-500'
              }`}
            >
              {item.isCorrect ? (
                <CheckCircle size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-widest opacity-70 text-white">
                  {item.category}
                </span>
                {!item.isCorrect && (
                  <span className="text-xs font-mono text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                    Sua escolha: {item.userValue}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                {item.explanation}
              </p>
              {!item.isCorrect && (
                <div className="text-xs text-emerald-400 font-mono mt-2 flex items-center gap-2">
                  <ArrowRight size={12} /> Correto: {item.correctValue}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CLINICAL PEARL */}
      {currentCase.tip && (
        <div className="mt-8 p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={100} />
          </div>
          <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">
            Clinical Pearl
          </h4>
          <p className="text-white text-lg font-medium italic">
            "{currentCase.tip}"
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-10 justify-center">
        <Button
          variant="secondary"
          onClick={resetGame}
          className="w-full md:w-auto"
        >
          <RotateCcw size={18} className="mr-2" /> Reiniciar Caso
        </Button>
        <Button
          onClick={nextCase}
          className="w-full md:w-auto px-8 shadow-xl shadow-emerald-500/20"
        >
          Próximo Caso <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
