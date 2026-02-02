import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/useGame';
import { DetailedFeedback } from '../../types';
// Agora que você deletou o arquivo feedback.ts, isso importará da PASTA feedback/index.ts
import { generateReport } from '../../logic/feedback';
import { Button } from '../ui/Button';
import {
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { FeedbackCard } from './FeedbackCard';

export const StepReport = () => {
  const { currentCase, selectedPlan, form, nextCase, simHistory } = useGame();
  const [report, setReport] = useState<{
    score: number;
    items: DetailedFeedback[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCase) return;

    try {
      // Proteção contra simHistory undefined
      const history = simHistory || [];
      const outcomeType =
        history.length > 0
          ? history[history.length - 1].outcomeType
          : undefined;

      const result = generateReport(
        currentCase,
        form,
        selectedPlan,
        outcomeType
      );
      setReport(result);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError('Falha ao calcular resultados. Verifique o console.');
    }
  }, [currentCase, selectedPlan, form, simHistory]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-white space-y-4">
        <AlertTriangle size={48} className="text-red-500" />
        <h3 className="text-xl font-bold">Erro no Sistema</h3>
        <p className="text-gray-400">{error}</p>
        <Button onClick={nextCase} variant="secondary">
          Reiniciar
        </Button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-white text-center mt-20 space-y-4 flex flex-col items-center">
        <div className="animate-spin w-10 h-10 border-4 border-medical-primary border-t-transparent rounded-full"></div>
        <p className="font-mono text-sm tracking-widest text-gray-500">
          CORRIGINDO...
        </p>
      </div>
    );
  }

  // ... (RESTANTE DO SEU CÓDIGO DE RENDERIZAÇÃO: getScoreColor, return, etc. Mantenha igual ao que você me mandou)
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excelente! Raciocínio Impecável';
    if (score >= 80) return 'Muito Bom! Conduta Segura';
    if (score >= 70) return 'Bom! Aprovado';
    if (score >= 50) return 'Atenção aos Detalhes';
    return 'Requer Revisão Urgente';
  };

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      {/* HEADER - Score Global */}
      <div className="text-center relative py-6">
        <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-[#1A1B1E] to-[#0A0A0A] border-8 border-gray-800 shadow-2xl relative mb-6">
          <div
            className={`absolute inset-0 rounded-full opacity-10 animate-pulse ${
              report.score >= 60 ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          ></div>
          <div className="relative z-10 text-center">
            <span
              className={`text-7xl font-black tracking-tighter ${getScoreColor(
                report.score
              )}`}
            >
              {report.score}
            </span>
            <span className="text-gray-600 text-2xl font-bold block -mt-2">
              %
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {getScoreMessage(report.score)}
        </h2>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-white/5 w-fit mx-auto px-4 py-1.5 rounded-full border border-white/5">
          {report.score >= 70 ? (
            <>
              <TrendingUp size={16} className="text-emerald-500" />
              <span>Você demonstrou segurança clínica</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-500" />
              <span>Identificamos pontos críticos de melhoria</span>
            </>
          )}
        </div>
      </div>

      {/* FEEDBACK DETALHADO */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Info size={16} className="text-medical-primary" />
          Análise por Tópico
        </h3>

        {report.items.map((item, idx) => (
          <FeedbackCard key={idx} item={item} />
        ))}
      </div>

      {/* PÉROLA CLÍNICA */}
      <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4 items-start">
        <div className="p-2 bg-blue-500/20 rounded-lg shrink-0 text-blue-400 mt-1">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-blue-400 font-bold uppercase text-xs mb-2 tracking-wider">
            💎 Pérola do Caso
          </h4>
          <p className="text-gray-300 font-medium text-sm leading-relaxed">
            {currentCase?.tip}
          </p>
        </div>
      </div>

      {/* BOTÃO PRÓXIMO CASO */}
      <Button
        onClick={nextCase}
        className="w-full py-5 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-white text-black hover:bg-gray-200"
      >
        <RefreshCw className="mr-2 h-5 w-5" />
        Carregar Novo Caso
      </Button>
    </div>
  );
};
