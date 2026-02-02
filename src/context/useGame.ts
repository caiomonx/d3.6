// src/context/useGame.ts
import { useCaseContext } from './CaseContext';
import { useFormContext } from './FormContext';
import { useSimulationContext } from './SimulationContext';
import { useNavigationContext } from './NavigationContext';
import { useFeedbackContext } from './FeedbackContext';
import { useCaseContext as useCases } from './CaseContext';
import { useFormContext as useForms } from './FormContext';

/**
 * Hook unificado que combina todos os contextos
 * Mantém compatibilidade com código antigo que usa useGame()
 */
export const useGame = () => {
  const caseContext = useCaseContext();
  const formContext = useFormContext();
  const simContext = useSimulationContext();
  const navContext = useNavigationContext();
  const feedbackContext = useFeedbackContext();

  // Função nextCase melhorada que reseta tudo
  const nextCase = () => {
    caseContext.nextCase();
    formContext.resetForm();
    simContext.resetSimulation();
    navContext.resetNavigation();
    feedbackContext.resetFeedback();
  };

  return {
    // Case Context
    currentCase: caseContext.currentCase,
    nextCase,
    revealedVitals: caseContext.revealedVitals,
    revealVital: caseContext.revealVital,

    // Form Context
    form: formContext.form,
    updateForm: formContext.updateForm,
    selectedPlan: formContext.selectedPlan,
    setSelectedPlan: formContext.setSelectedPlan,

    // Simulation Context
    simState: simContext.simState,
    setSimState: simContext.setSimState,
    simHistory: simContext.simHistory,
    addSimStep: simContext.addSimStep,

    // Navigation Context
    step: navContext.step,
    setStep: navContext.setStep,

    // Feedback Context
    report: feedbackContext.report,
    setReport: feedbackContext.setReport,
    hintUsed: feedbackContext.hintUsed,
    useHint: feedbackContext.useHint,
  };
};
