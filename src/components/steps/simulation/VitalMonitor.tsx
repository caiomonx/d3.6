import React from 'react';
import { Activity, Heart, Wind, Droplets } from 'lucide-react';

export type VitalSigns = {
  hr: number;
  rr: number;
  sbp: number;
  dbp: number;
  sat: number;
};

interface VitalMonitorProps {
  vitals: VitalSigns;
  active: boolean;
}

export const VitalMonitor = ({ vitals, active }: VitalMonitorProps) => {
  return (
    <div className="bg-black border-4 border-[#1a1a1a] rounded-xl p-4 md:p-6 mb-6 shadow-2xl relative overflow-hidden animate-slide-up">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
        <span
          className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 ${
            active ? 'text-medical-primary animate-pulse' : 'text-gray-600'
          }`}
        >
          <Activity size={14} />{' '}
          {active
            ? 'MONITORAMENTO EM TEMPO REAL'
            : 'SINAIS VITAIS - ÚLTIMA LEITURA'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Heart size={10} /> FC
          </span>
          <span
            className={`text-4xl md:text-5xl font-mono font-black text-emerald-400 ${
              active ? 'animate-pulse-fast' : ''
            }`}
          >
            {vitals.hr}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Activity size={10} /> PNI
          </span>
          <span className="text-3xl md:text-4xl font-mono font-bold text-rose-400">
            {vitals.sbp}/{vitals.dbp}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Droplets size={10} /> SpO2
          </span>
          <span className="text-4xl md:text-5xl font-mono font-black text-sky-400">
            {vitals.sat}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Wind size={10} /> FR
          </span>
          <span className="text-4xl md:text-5xl font-mono font-black text-amber-400">
            {vitals.rr}
          </span>
        </div>
      </div>
    </div>
  );
};
