export type PlanType = 'A' | 'B' | 'C';

export interface Vitals {
  geral: string;
  olhos: string;
  lagrimas: string;
  boca: string;
  sede: string;
  pulso: string;
  prega: string;
  perda: string;
}

export interface CaseStudy {
  id: number;
  name: string;
  ageMonths: number;
  weight: number;
  history: string;
  vitals: Vitals;
  context: string;
  allergies: string;
  correctPlan: PlanType;
  abxIndication: string;
  abxDrug: string;
  abxDoseTarget: number;
  tip: string;
  eventOutcome?: 'success' | 'vomit' | 'shock';
}

export interface SimulationLog {
  stage: number;
  outcomeType: string;
  outcomeText: string;
  userAction: string;
}

export interface GameFormState {
  zincCheck: boolean;
  zincDose: string;
  zincDays: string;
  sroOrient: string;
  sroVolA: string;
  sroBrand: string;
  probCheck: boolean;
  probStrain: string;
  sroVolB: string;
  antiDrug: string;
  antiDose: string;
  ivSol: string;
  v1: string;
  t1: string;
  v2: string;
  t2: string;
  maintVol: string;
  maintSol: string;
  repVol: string;
  repSol: string;
  kclVol: string;
  abxCheck: boolean;
  abxIndication: string;
  abxDrug: string;
  abxDoseInput: string;
  simAction: string;
}

// Interface Simples (Legado/Compatibilidade)
export interface FeedbackItem {
  category: string;
  isCorrect: boolean;
  title: string;
  userValue: string | number;
  correctValue: string | number;
  explanation: string;
  mathDetail?: string;
}

// === A CORREÇÃO CRÍTICA ESTÁ AQUI ===
// Interface Complexa usada pelo FeedbackCard.tsx e pela nova lógica
export interface DetailedFeedback {
  category: string;
  isCorrect: boolean;
  title: string;
  points: number;
  maxPoints: number;
  severity?: 'minor' | 'moderate' | 'severe' | 'critical';
  userConduct: {
    description: string;
    value: string | number;
  };
  idealConduct: {
    description: string;
    value: string | number;
    calculation?: string;
  };
  rationale: {
    shortExplanation: string;
    clinicalReasoning: string;
    errorImpact?: string;
    howToImprove: string[];
  };
}
