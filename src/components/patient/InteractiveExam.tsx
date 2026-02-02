import React, { useMemo } from 'react';
import { useGame } from '../../context/useGame';
import {
  AlertCircle,
  ScanEye,
  Activity as ActivityIcon,
  CheckCircle2,
} from 'lucide-react';

export const InteractiveExam = () => {
  const { currentCase, revealVital, revealedVitals } = useGame();

  if (!currentCase) return null;

  const handleZoneClick = (vitalsToReveal: string[]) => {
    vitalsToReveal.forEach((v) => revealVital(v));
  };

  const vitalsOrder = [
    'geral',
    'olhos',
    'lagrimas',
    'boca',
    'sede',
    'pulso',
    'prega',
    'perda',
  ];
  const labels: Record<string, string> = {
    geral: 'Estado Geral',
    olhos: 'Olhos',
    lagrimas: 'Lágrimas',
    boca: 'Boca',
    sede: 'Sede',
    pulso: 'Pulso',
    prega: 'Sinal da Prega',
    perda: 'Perda Ponderal',
  };

  const requiredVitals = [
    'olhos',
    'lagrimas',
    'boca',
    'sede',
    'pulso',
    'prega',
  ];

  const isExamComplete = useMemo(() => {
    return requiredVitals.every((v) => revealedVitals.includes(v));
  }, [revealedVitals]);

  // ZONAS DE CLIQUE (HOTSPOTS)
  const hotspots = [
    {
      label: 'Olhos',
      vitals: ['olhos', 'lagrimas'],
      style: { top: '28%', left: '30%', width: '40%', height: '12%' },
    },
    {
      label: 'Boca',
      vitals: ['boca', 'sede'],
      style: { top: '41%', left: '42%', width: '16%', height: '8%' },
    },
    {
      label: 'Abdome (Prega)',
      vitals: ['prega'],
      style: {
        top: '60%',
        left: '39%',
        width: '22%',
        height: '15%',
        borderRadius: '50%',
      },
    },
    {
      label: 'Pulso D',
      vitals: ['pulso'],
      style: {
        top: '68%',
        left: '22%',
        width: '15%',
        height: '15%',
        borderRadius: '50%',
      },
    },
    {
      label: 'Pulso E',
      vitals: ['pulso'],
      style: {
        top: '68%',
        right: '22%',
        width: '15%',
        height: '15%',
        borderRadius: '50%',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center transition-all duration-700">
      {/* === ÁREA DO AVATAR === */}
      <div
        className={`relative w-fit max-w-[280px] md:max-w-[380px] select-none group transition-all duration-700 ease-in-out overflow-hidden ${
          isExamComplete
            ? 'max-h-0 opacity-0 scale-95 mb-0'
            : 'max-h-[500px] opacity-100 scale-100'
        }`}
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#151518]">
          <img
            src="/avatar_exame.png"
            alt="Paciente"
            className="block w-full h-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />

          <div className="hidden w-[280px] h-[350px] bg-[#151518] flex-col items-center justify-center text-gray-500 p-4 text-center">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-bold">Imagem não encontrada</p>
          </div>

          <div className="absolute top-4 left-0 w-full text-center pointer-events-none z-30 transition-opacity duration-300 group-hover:opacity-0">
            <span className="bg-black/80 text-medical-primary text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md uppercase tracking-widest font-bold shadow-lg inline-flex items-center gap-2 border border-medical-primary/30">
              <ScanEye size={12} /> Toque para Examinar
            </span>
          </div>

          {hotspots.map((spot, idx) => (
            <div
              key={idx}
              className="absolute z-20 cursor-pointer"
              style={spot.style}
              onClick={() => handleZoneClick(spot.vitals)}
              title={`Examinar ${spot.label}`}
            >
              <div className="w-full h-full rounded-full hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 border border-transparent hover:border-white/50"></div>
            </div>
          ))}
        </div>
      </div>

      {isExamComplete && (
        <div className="animate-fade-in bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} /> Exame Físico Completo
        </div>
      )}

      {/* === LISTA DE EXAME FÍSICO === */}
      <div className="w-full max-w-xl bg-black/20 rounded-2xl border border-white/5 p-6 transition-all duration-500">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <ActivityIcon size={14} className="text-medical-primary" />
          Registro Clínico
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {vitalsOrder.map((key) => {
            const isAlwaysVisible = key === 'geral' || key === 'perda';
            const isRevealed = isAlwaysVisible || revealedVitals.includes(key);
            const value =
              currentCase.vitals[key as keyof typeof currentCase.vitals];

            return (
              <div
                key={key}
                className={`flex items-center justify-between text-sm px-4 py-3 rounded-xl transition-all duration-500 border ${
                  isRevealed
                    ? 'bg-white/5 border-white/10 translate-x-0'
                    : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <span
                  className={`font-bold uppercase text-[11px] tracking-wider shrink-0 w-1/3 ${
                    isRevealed ? 'text-medical-primary' : 'text-gray-600'
                  }`}
                >
                  {labels[key]}
                </span>

                {/* FONTE REDUZIDA AQUI (text-xs) */}
                <span
                  className={`flex-1 font-mono font-medium text-right break-words ml-4 text-xs leading-relaxed ${
                    isRevealed ? 'text-white' : 'text-gray-600 italic'
                  }`}
                >
                  {isRevealed ? value : 'Examinar...'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
