// src/context/FeedbackContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { FeedbackItem } from '../types';

interface Report {
  score: number;
  items: FeedbackItem[];
}

interface FeedbackContextType {
  report: Report | null;
  setReport: (report: Report | null) => void;
  hintUsed: boolean;
  useHint: () => void;
  resetFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType>(
  {} as FeedbackContextType
);

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error(
      'useFeedbackContext deve ser usado dentro de FeedbackProvider'
    );
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [report, setReport] = useState<Report | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

  const useHint = () => {
    setHintUsed(true);
  };

  const resetFeedback = () => {
    setReport(null);
    setHintUsed(false);
  };

  return (
    <FeedbackContext.Provider
      value={{
        report,
        setReport,
        hintUsed,
        useHint,
        resetFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
