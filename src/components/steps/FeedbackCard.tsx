import React, { useState } from 'react';
import { DetailedFeedback } from '../../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Book,
  Lightbulb,
  AlertCircle,
  Award,
} from 'lucide-react';

interface FeedbackCardProps {
  item: DetailedFeedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  // Cores baseadas em correção e severidade
  const getColors = () => {
    if (item.isCorrect) {
      return {
        bg: 'bg-emerald-900/10',
        border: 'border-emerald-500',
        text: 'text-emerald-400',
        icon: 'text-emerald-500',
      };
    }

    switch (item.severity) {
      case 'critical':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-600',
          text: 'text-red-400',
          icon: 'text-red-500',
        };
      case 'severe':
        return {
          bg: 'bg-orange-900/10',
          border: 'border-orange-500',
          text: 'text-orange-400',
          icon: 'text-orange-500',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-900/10',
          border: 'border-amber-500',
          text: 'text-amber-400',
          icon: 'text-amber-500',
        };
      default:
        return {
          bg: 'bg-red-900/10',
          border: 'border-red-500',
          text: 'text-red-400',
          icon: 'text-red-500',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`${colors.bg} rounded-2xl border-l-4 ${colors.border} overflow-hidden transition-all duration-300 hover:translate-x-1`}
    >
      {/* HEADER */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {item.category}
            </span>
            {!item.isCorrect && item.severity && (
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  item.severity === 'critical'
                    ? 'bg-red-500/20 text-red-300'
                    : item.severity === 'severe'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {item.severity === 'critical'
                  ? 'Erro Crítico'
                  : item.severity === 'severe'
                  ? 'Erro Grave'
                  : 'Atenção'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-lg font-black ${colors.text}`}>
                {item.points}/{item.maxPoints}
              </div>
            </div>
            {item.isCorrect ? (
              <CheckCircle2 size={24} className={colors.icon} />
            ) : (
              <XCircle size={24} className={colors.icon} />
            )}
          </div>
        </div>

        <h4 className="font-bold text-white text-lg mb-3">{item.title}</h4>
        <p className={`text-sm leading-relaxed mb-4 ${colors.text}`}>
          {item.rationale.shortExplanation}
        </p>

        {/* COMPARAÇÃO LADO A LADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Sua Conduta */}
          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} className="text-gray-400" />
              <span className="text-[10px] uppercase text-gray-400 font-bold">
                Sua Conduta
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">
              {item.userConduct.description}
            </p>
            <p
              className={`font-bold ${
                item.isCorrect ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {item.userConduct.value}
            </p>
          </div>

          {/* Ideal */}
          <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-blue-400" />
              <span className="text-[10px] uppercase text-blue-400 font-bold">
                Padrão Ouro
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">
              {item.idealConduct.description}
            </p>
            <p className="font-bold text-blue-400">{item.idealConduct.value}</p>
            {item.idealConduct.calculation && (
              <p className="text-[10px] text-gray-500 mt-2 font-mono border-t border-white/10 pt-1">
                {item.idealConduct.calculation}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} /> Menos Detalhes
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Entender o Raciocínio
            </>
          )}
        </button>
      </div>

      {/* ÁREA EXPANDIDA - SEM REFERÊNCIAS */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in bg-black/20 pt-4 border-t border-white/5">
          {/* Raciocínio */}
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Book size={16} className="text-medical-primary" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-medical-primary">
                Fundamentação Clínica
              </h5>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.rationale.clinicalReasoning}
            </p>
          </div>

          {/* Impacto do Erro */}
          {item.rationale.errorImpact && (
            <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-red-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Por que isso é um erro?
                </h5>
              </div>
              <p className="text-sm text-red-200 leading-relaxed">
                {item.rationale.errorImpact}
              </p>
            </div>
          )}

          {/* Como Melhorar */}
          <div className="bg-amber-900/10 p-4 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-amber-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Dicas Práticas
              </h5>
            </div>
            <ul className="space-y-2">
              {item.rationale.howToImprove.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
