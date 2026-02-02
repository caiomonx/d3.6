import React from 'react';
import { Activity, ChevronRight, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/useGame';
import { Card } from '../ui/Card';
import { InteractiveExam } from './InteractiveExam';

export const PatientCard = () => {
  const { currentCase, nextCase } = useGame();

  if (!currentCase) return null;

  return (
    <div className="sticky top-24 space-y-6 animate-slide-up">
      <Card
        title="Prontuário Médico"
        icon={Activity}
        className="shadow-2xl border-t-4 border-t-medical-primary"
      >
        {/* Anamnese */}
        <div className="mb-6 pl-1">
          <h3 className="text-medical-primary text-xs font-bold uppercase tracking-widest mb-2">
            Anamnese
          </h3>
          {/* FONTE AUMENTADA AQUI (text-base) */}
          <p className="text-base text-gray-200 leading-relaxed font-sans font-medium border-l-2 border-white/10 pl-4">
            {currentCase.history}
          </p>
        </div>

        <div className="w-full h-px bg-white/10 mb-6"></div>

        {/* Exame Físico Interativo */}
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity size={14} /> Exame Físico
        </h4>

        <InteractiveExam />

        {/* Contexto Clínico & Alergias */}
        <div className="space-y-2 mt-6">
          <div className="bg-medical-warning/5 border border-medical-warning/20 p-3 rounded-xl flex gap-3">
            <AlertCircle
              className="text-medical-warning shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <strong className="text-medical-warning text-xs font-bold uppercase block mb-1 tracking-wider">
                Contexto Clínico
              </strong>
              <p className="text-xs text-gray-400 leading-relaxed">
                {currentCase.context}
              </p>
            </div>
          </div>

          <div className="bg-rose-900/10 border border-rose-500/20 p-3 rounded-xl flex gap-3 items-center">
            <div className="text-[10px] uppercase font-bold text-rose-500 tracking-wider shrink-0">
              Alergias:
            </div>
            <div className="text-xs text-rose-200 font-bold">
              {currentCase.allergies}
            </div>
          </div>
        </div>

        <button
          onClick={nextCase}
          className="w-full mt-6 py-4 border border-dashed border-white/10 hover:border-medical-primary/50 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-medical-primary transition-all rounded-xl hover:bg-medical-primary/5 flex items-center justify-center gap-2 group"
        >
          Carregar Novo Caso{' '}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </Card>
    </div>
  );
};
