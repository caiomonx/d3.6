// src/context/AppProviders.tsx
import React from 'react';
import { CaseProvider } from './CaseContext';
import { FormProvider } from './FormContext';
import { SimulationProvider } from './SimulationContext';
import { NavigationProvider } from './NavigationContext';
import { FeedbackProvider } from './FeedbackContext';

/**
 * Provider combinado que encapsula todos os contextos
 * Ordem importa: contextos mais externos não dependem dos internos
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NavigationProvider>
      <CaseProvider>
        <FormProvider>
          <SimulationProvider>
            <FeedbackProvider>{children}</FeedbackProvider>
          </SimulationProvider>
        </FormProvider>
      </CaseProvider>
    </NavigationProvider>
  );
};
