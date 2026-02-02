// src/context/SimulationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationLog } from '../types';

interface SimulationContextType {
  simState: 'idle' | 'loading' | 'done';
  setSimState: (state: 'idle' | 'loading' | 'done') => void;
  simHistory: SimulationLog[];
  addSimStep: (log: SimulationLog) => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType>(
  {} as SimulationContextType
);

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error(
      'useSimulationContext deve ser usado dentro de SimulationProvider'
    );
  }
  return context;
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const safeParse = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Erro ao ler ${key}:`, e);
      return fallback;
    }
  };

  const [simState, setSimState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [simHistory, setSimHistory] = useState<SimulationLog[]>(() =>
    safeParse('osce_simHistory', [])
  );

  // Adiciona um passo na história da simulação
  const addSimStep = (log: SimulationLog) => {
    setSimHistory((prev) => [...prev, log]);
  };

  // Reseta a simulação
  const resetSimulation = () => {
    setSimState('idle');
    setSimHistory([]);
  };

  // Persistência
  useEffect(() => {
    localStorage.setItem('osce_simHistory', JSON.stringify(simHistory));
  }, [simHistory]);

  return (
    <SimulationContext.Provider
      value={{
        simState,
        setSimState,
        simHistory,
        addSimStep,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
