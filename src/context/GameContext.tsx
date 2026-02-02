import React, { createContext, useContext, useState, ReactNode } from 'react';
import { casesDB } from '../data/cases';
import { CaseStudy, PlanType, SimulationLog, FeedbackItem } from '../types';
import { useFormContext } from './FormContext';

interface GameContextData {
  step: number;
  setStep: (step: number) => void;
  currentCaseId: number;
  currentCase: CaseStudy | undefined;
  nextCase: () => void;
  selectedPlan: PlanType | '';
  setSelectedPlan: (plan: PlanType | '') => void;

  // Simulation State
  simState: 'idle' | 'loading' | 'done';
  setSimState: (s: 'idle' | 'loading' | 'done') => void;
  simLog: SimulationLog[];
  addSimStep: (log: SimulationLog) => void;
  setSimLog: (logs: SimulationLog[]) => void; // Importante para o reset

  // Feedback State
  feedback: {
    isCorrect: boolean;
    message: string;
    detailedFeedback?: string;
  } | null;
  setFeedback: (f: any) => void;

  revealedVitals: string[];
  revealVital: (key: string) => void;
  resetGame: () => void;
  form: any;
  updateForm: any;
}

const GameContext = createContext<GameContextData>({} as GameContextData);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { form, updateForm, resetForm, selectedPlan, setSelectedPlan } =
    useFormContext();

  const [step, setStep] = useState(1);
  const [currentCaseId, setCurrentCaseId] = useState(1);
  const [simState, setSimState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [simLog, setSimLog] = useState<SimulationLog[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [revealedVitals, setRevealedVitals] = useState<string[]>([]);

  const currentCase = casesDB.find((c) => c.id === currentCaseId);

  const addSimStep = (log: SimulationLog) => {
    setSimLog((prev) => [...prev, log]);
  };

  const revealVital = (key: string) => {
    if (!revealedVitals.includes(key)) {
      setRevealedVitals((prev) => [...prev, key]);
    }
  };

  const resetGame = () => {
    setStep(1);
    setSimState('idle');
    setSimLog([]);
    setFeedback(null);
    setRevealedVitals([]);
    setSelectedPlan('');
    resetForm();
  };

  const nextCase = () => {
    if (currentCaseId < casesDB.length) {
      setCurrentCaseId((prev) => prev + 1);
      resetGame();
    } else {
      // Fim do jogo (loop ou tela final)
      setCurrentCaseId(1);
      resetGame();
    }
  };

  return (
    <GameContext.Provider
      value={{
        step,
        setStep,
        currentCaseId,
        currentCase,
        nextCase,
        selectedPlan,
        setSelectedPlan,
        simState,
        setSimState,
        simLog,
        addSimStep,
        setSimLog, // Agora exposto
        feedback,
        setFeedback,
        revealedVitals,
        revealVital,
        resetGame,
        form,
        updateForm,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
