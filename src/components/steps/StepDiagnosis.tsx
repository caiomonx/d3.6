import React from 'react';
import { useGame } from '../../context/useGame';
import { PlanType } from '../../types';
import { Button } from '../ui/Button';
import {
  ChevronRight,
  Thermometer,
  Activity,
  AlertOctagon,
  Lock,
} from 'lucide-react';

export const StepDiagnosis = () => {
  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    currentCase,
    revealedVitals,
  } = useGame();

  const requiredVitals = [
    'olhos',
    'lagrimas',
    'boca',
    'sede',
    'pulso',
    'prega',
  ];
  const isExamComplete = requiredVitals.every((vital) =>
    revealedVitals.includes(vital)
  );

  const plans: {
    id: PlanType;
    riskLabel: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'A',
      riskLabel: 'RISCO BAIXO',
      title: 'Sem Sinais de Desidratação',
      subtitle: 'Tratamento Domiciliar',
      icon: Activity,
      color: 'emerald',
    },
    {
      id: 'B',
      riskLabel: 'RISCO MÉDIO',
      title: 'Terapia de Reidratação Oral',
      subtitle: 'Tratamento em Unidade de Saúde',
      icon: Thermometer,
      color: 'amber',
    },
    {
      id: 'C',
      riskLabel: 'RISCO ALTO',
      title: 'Desidratação Grave ou Choque',
      subtitle: 'Hidratação Venosa Hospitalar',
      icon: AlertOctagon,
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in py-2">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans">
            Estadiamento Clínico
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-mono uppercase tracking-wider">
            Protocolo MS • Classificação de Risco
          </p>
        </div>
      </div>

      {/* Cards de Seleção */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.id;
          const Icon = p.icon;

          const colorClasses = {
            emerald: isSelected
              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]'
              : 'border-white/5 bg-[#18181b] hover:border-emerald-500/50 hover:bg-emerald-950/10 text-gray-500',
            amber: isSelected
              ? 'border-amber-500 bg-amber-950/30 text-amber-400 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]'
              : 'border-white/5 bg-[#18181b] hover:border-amber-500/50 hover:bg-amber-950/10 text-gray-500',
            rose: isSelected
              ? 'border-rose-500 bg-rose-950/30 text-rose-400 shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]'
              : 'border-white/5 bg-[#18181b] hover:border-rose-500/50 hover:bg-rose-950/10 text-gray-500',
          };

          const activeClass =
            colorClasses[p.color as keyof typeof colorClasses];

          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`
                relative group p-6 rounded-2xl border transition-all duration-300 ease-out 
                flex flex-col justify-between h-64 text-left overflow-hidden
                ${activeClass}
              `}
            >
              {/* Background Gradient Sutil */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Topo: Ícone + Label de Risco */}
              <div className="relative z-10 w-full flex justify-between items-start">
                <Icon
                  size={24}
                  className={isSelected ? 'animate-pulse' : 'opacity-50'}
                />
                <span className="font-mono text-[10px] uppercase border border-current px-2 py-0.5 rounded opacity-50 tracking-wider">
                  {p.riskLabel}
                </span>
              </div>

              {/* Conteúdo Central (ELEVADO com mb-10) */}
              <div className="relative z-10 w-full mt-auto mb-10">
                <span className="text-sm font-bold uppercase tracking-widest block mb-1 leading-tight">
                  {p.title}
                </span>
                <span className="text-xs opacity-60 leading-relaxed block">
                  {p.subtitle}
                </span>
              </div>

              {/* Letra Grande de Fundo (Subtle Gravity) */}
              <span
                className={`
                absolute text-[160px] font-black leading-none tracking-tighter transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none pointer-events-none
                ${
                  isSelected
                    ? 'opacity-20 -bottom-2 right-8 scale-100' // Selected
                    : 'opacity-[0.05] -bottom-6 right-4 scale-95 group-hover:opacity-10 group-hover:-bottom-4 group-hover:right-5' // Unselected
                }
              `}
              >
                {p.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botão de Ação Centralizado */}
      <div className="pt-8 flex justify-center w-full">
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedPlan || !isExamComplete}
          className={`
            transition-all duration-500 text-lg px-12 py-4 w-full md:w-auto md:min-w-[400px]
            ${
              !selectedPlan || !isExamComplete
                ? 'opacity-50 grayscale cursor-not-allowed bg-white/5 border-white/10 hover:bg-white/5 hover:border-white/10 text-gray-500'
                : 'shadow-2xl shadow-emerald-500/30'
            }
          `}
        >
          {!isExamComplete ? (
            <span className="flex items-center justify-center gap-3">
              <Lock size={18} className="text-gray-400" /> Conclua o Exame
              Físico
            </span>
          ) : !selectedPlan ? (
            <span className="text-gray-300">
              Selecione o Grau de Desidratação
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Confirmar Estadiamento <ChevronRight className="ml-2" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
