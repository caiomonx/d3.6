// src/App.tsx
import React, { useState } from 'react';
import { AppProviders } from './context/AppProviders'; // NOVO
import { useGame } from './context/useGame'; // NOVO
import { PatientCard } from './components/patient/PatientCard';
import { PatientHeader } from './components/patient/PatientHeader';
import { StepDiagnosis } from './components/steps/StepDiagnosis';
import { StepPrescription } from './components/steps/StepPrescription';
import { StepSimulation } from './components/steps/StepSimulation';
import { StepReport } from './components/steps/StepReport';
import { StickyBar } from './components/layout/StickyBar';
import { ProtocolModal } from './components/layout/ProtocolModal';
import { Activity, BookOpen } from 'lucide-react';

const GameContent = () => {
  const { step, currentCase } = useGame();
  const [showProtocol, setShowProtocol] = useState(false);

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-medical-bg flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-medical-primary blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Activity className="w-12 h-12 text-medical-primary relative z-10 mx-auto animate-pulse" />
          </div>
          <p className="font-mono text-sm tracking-widest text-gray-500">
            INICIALIZANDO SISTEMA...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>

      <header className="border-b border-white/5 p-4 sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-medical-primary/10 rounded border border-medical-primary/20">
              <Activity className="text-medical-primary" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight font-sans leading-none">
                OSCE <span className="text-medical-primary">SIM</span>
              </h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Protocolo Diarreia Aguda Pediátrica
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProtocol(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Protocolo MS</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[39fr_61fr] gap-8 relative z-10 items-start">
        <section className="w-full">
          <PatientCard />
        </section>

        <section className="w-full flex flex-col">
          <PatientHeader />

          <div className="mt-4 transition-all duration-500">
            {step === 1 && <StepDiagnosis />}
            {step === 2 && <StepPrescription />}
            {step === 2.5 && <StepSimulation />}
            {step === 3 && <StepReport />}
          </div>
        </section>
      </main>

      <StickyBar />
      <ProtocolModal
        isOpen={showProtocol}
        onClose={() => setShowProtocol(false)}
      />
    </div>
  );
};

// MUDANÇA PRINCIPAL: Wrap com AppProviders
export default function App() {
  return (
    <AppProviders>
      <GameContent />
    </AppProviders>
  );
}
