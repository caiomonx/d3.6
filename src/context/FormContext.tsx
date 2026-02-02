import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameFormState, PlanType } from '../types';

interface FormContextType {
  form: GameFormState;
  updateForm: (field: keyof GameFormState, value: any) => void;
  resetForm: () => void;
  selectedPlan: PlanType | '';
  setSelectedPlan: (plan: PlanType | '') => void;
}

const FormContext = createContext<FormContextType>({} as FormContextType);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext deve ser usado dentro de FormProvider');
  }
  return context;
};

// Estado Inicial Atualizado
const initialFormState: GameFormState = {
  zincCheck: false,
  zincDose: '',
  zincDays: '',
  sroOrient: '',
  sroVolA: '',
  sroBrand: '',
  probCheck: false,
  probStrain: '',
  sroVolB: '',
  antiDrug: '',
  antiDose: '',
  ivSol: '',
  v1: '',
  t1: '',
  v2: '',
  t2: '',
  maintVol: '',
  maintSol: '',
  repVol: '',
  repSol: '',
  kclVol: '',
  abxCheck: false,
  abxIndication: '',
  abxDrug: '',
  abxDoseInput: '',

  // CORREÇÃO
  simAction: '',
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Parser Seguro para evitar tela preta por cache antigo
  const safeParse = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      // Merge para garantir que campos novos existam
      return { ...fallback, ...parsed };
    } catch (e) {
      console.error(`Erro ao ler ${key}:`, e);
      return fallback;
    }
  };

  const [form, setForm] = useState<GameFormState>(() =>
    safeParse('osce_form', initialFormState)
  );

  const [selectedPlan, setSelectedPlan] = useState<PlanType | ''>(() => {
    const saved = localStorage.getItem('osce_selectedPlan');
    return (saved as PlanType) || '';
  });

  const updateForm = (field: keyof GameFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedPlan('');
    localStorage.removeItem('osce_form');
    localStorage.removeItem('osce_selectedPlan');
  };

  useEffect(() => {
    localStorage.setItem('osce_form', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem('osce_selectedPlan', selectedPlan);
  }, [selectedPlan]);

  return (
    <FormContext.Provider
      value={{
        form,
        updateForm,
        resetForm,
        selectedPlan,
        setSelectedPlan,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
