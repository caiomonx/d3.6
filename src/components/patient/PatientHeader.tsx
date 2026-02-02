import React from 'react';
import { Clock, Scale } from 'lucide-react'; // Removido ícone User
import { useGame } from '../../context/useGame';
import { formatAge } from '../../utils/format';

export const PatientHeader = () => {
  const { currentCase } = useGame();

  if (!currentCase) return null;

  return (
    // Removido o ícone de avatar circular que ficava aqui
    <div className="flex flex-col items-center justify-center mb-8 animate-slide-up relative z-10">
      {/* Nome e ID (Agora é o primeiro elemento) */}
      <div className="text-center mb-6">
        <h2 className="text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
          {currentCase.name}
        </h2>
        <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-white/5 text-gray-400 border border-white/10 uppercase tracking-[0.2em]">
          Caso Clínico #{currentCase.id}
        </span>
      </div>

      {/* Badges de Dados Antropométricos */}
      <div className="flex items-center justify-center gap-4 animate-fade-in">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#18181b] rounded-2xl border border-white/10 shadow-xl group hover:border-medical-primary/30 transition-all hover:-translate-y-1">
          <div className="p-1.5 bg-medical-primary/10 rounded-lg">
            <Clock
              size={16}
              className="text-medical-primary group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-bold text-gray-500 leading-none mb-1">
              Idade
            </span>
            <span className="text-lg font-bold text-white leading-none font-mono">
              {formatAge(currentCase.ageMonths)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#18181b] rounded-2xl border border-white/10 shadow-xl group hover:border-medical-primary/30 transition-all hover:-translate-y-1">
          <div className="p-1.5 bg-medical-primary/10 rounded-lg">
            <Scale
              size={16}
              className="text-medical-primary group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-bold text-gray-500 leading-none mb-1">
              Peso
            </span>
            <span className="text-lg font-bold text-white leading-none font-mono">
              {currentCase.weight}kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
