import React from 'react';
import { useGame } from '../../context/useGame';
import { formatAge } from '../../utils/format';
import { User, Clock, Scale, RefreshCw } from 'lucide-react';

export const StickyBar = () => {
  const { currentCase, nextCase } = useGame();

  if (!currentCase) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 animate-slide-up flex justify-center px-2 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto glass-panel px-4 sm:px-8 py-2 sm:py-3 rounded-full flex justify-between items-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border-white/10 gap-2 sm:gap-8 w-[95%] sm:w-fit backdrop-blur-xl bg-[#18181b]/70 transition-all duration-500">
        {/* Informações do Paciente */}
        {/* Mobile: flex-1 para centralizar na barra larga. Desktop: flex-none para ficar compacto. */}
        <div className="flex items-center gap-2 sm:gap-6 flex-1 sm:flex-none justify-center overflow-hidden">
          {/* Nome */}
          <div
            className="flex items-center gap-1.5 text-gray-200 shrink-0"
            title="Nome"
          >
            <User size={14} className="text-medical-primary sm:w-4 sm:h-4" />
            <span className="font-sans font-bold text-xs sm:text-sm truncate max-w-[70px] sm:max-w-[150px]">
              {currentCase.name}
            </span>
          </div>

          <div className="w-px h-3 sm:h-4 bg-white/20 shrink-0"></div>

          {/* Idade */}
          <div
            className="flex items-center gap-1.5 text-gray-200 shrink-0"
            title="Idade"
          >
            <Clock size={14} className="text-medical-primary sm:w-4 sm:h-4" />
            <span className="font-mono text-xs sm:text-sm whitespace-nowrap">
              {formatAge(currentCase.ageMonths)}
            </span>
          </div>

          <div className="w-px h-3 sm:h-4 bg-white/20 shrink-0"></div>

          {/* Peso */}
          <div
            className="flex items-center gap-1.5 text-gray-200 shrink-0"
            title="Peso"
          >
            <Scale size={14} className="text-medical-primary sm:w-4 sm:h-4" />
            <span className="font-mono text-xs sm:text-sm whitespace-nowrap">
              {currentCase.weight}kg
            </span>
          </div>
        </div>

        {/* Botão Novo Caso */}
        <button
          onClick={nextCase}
          className="shrink-0 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-2 sm:px-5 sm:py-2 rounded-full transition-all border border-white/10 hover:border-medical-primary/50 group flex items-center gap-2"
          title="Carregar Novo Caso"
        >
          <RefreshCw
            size={16}
            className="group-hover:rotate-180 transition-transform duration-500 text-medical-primary"
          />
          <span className="hidden md:inline text-sm font-medium tracking-wide">
            Novo Caso
          </span>
        </button>
      </div>
    </div>
  );
};
