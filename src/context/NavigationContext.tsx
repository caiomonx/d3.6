// src/context/NavigationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
  step: number;
  setStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>(
  {} as NavigationContextType
);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      'useNavigationContext deve ser usado dentro de NavigationProvider'
    );
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('osce_step');
    return saved ? parseInt(saved) : 1;
  });

  const goToNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const resetNavigation = () => {
    setStep(1);
  };

  // Persistência
  useEffect(() => {
    localStorage.setItem('osce_step', step.toString());
  }, [step]);

  return (
    <NavigationContext.Provider
      value={{
        step,
        setStep,
        goToNextStep,
        goToPreviousStep,
        resetNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
