import { CaseStudy, DetailedFeedback } from '../../types';
import { getPlanDescription } from './utils';

// ... (Mantenha as funções auxiliares getDiagnosticReasoning, etc. igual ao anterior)
// Vou focar na função exportada evaluateDiagnosis para economizar espaço,
// assumindo que as auxiliares estão lá. Se não tiverem, me avise.

function getDiagnosticReasoning(c: CaseStudy, plan: string): string {
  // ... (mesma lógica anterior)
  return c.correctPlan === plan
    ? 'Diagnóstico correto.'
    : 'Diagnóstico incorreto.';
}

function getDiagnosticImpact(user: string, correct: string): string {
  return 'Impacto do erro no prognóstico.';
}

function getErrorSeverity(user: string, correct: string): any {
  return 'critical';
}

export const evaluateDiagnosis = (
  c: CaseStudy,
  plan: string
): { items: DetailedFeedback[]; fatal: boolean } => {
  const items: DetailedFeedback[] = [];
  let fatal = false;
  const isCorrect = plan === c.correctPlan;

  // PESO DA QUESTÃO: 30 Pontos
  const MAX_POINTS = 30;

  if (isCorrect) {
    items.push({
      category: 'Diagnóstico',
      isCorrect: true,
      points: MAX_POINTS,
      maxPoints: MAX_POINTS,
      title: 'Classificação de Risco',
      userConduct: { description: 'Sua Classificação', value: `Plano ${plan}` },
      idealConduct: {
        description: 'Gabarito',
        value: `Plano ${c.correctPlan}`,
      },
      rationale: {
        shortExplanation: 'Classificação correta.',
        clinicalReasoning: `Os sinais vitais indicam ${getPlanDescription(
          c.correctPlan
        )}.`,
        howToImprove: [],
      },
    });
  } else {
    // Erro Fatal: Trocar A por C
    if (
      (plan === 'A' && c.correctPlan === 'C') ||
      (plan === 'C' && c.correctPlan === 'A')
    ) {
      fatal = true;
    }

    items.push({
      category: 'Diagnóstico',
      isCorrect: false,
      points: 0,
      maxPoints: MAX_POINTS,
      title: 'Classificação de Risco',
      userConduct: { description: 'Sua Classificação', value: `Plano ${plan}` },
      idealConduct: { description: 'Correto', value: `Plano ${c.correctPlan}` },
      rationale: {
        shortExplanation: 'Erro de estadiamento.',
        clinicalReasoning: `O paciente apresenta quadro de ${getPlanDescription(
          c.correctPlan
        )}.`,
        errorImpact: 'Conduta inadequada para a gravidade.',
        howToImprove: ['Reveja os critérios do Ministério da Saúde.'],
      },
      severity: fatal ? 'critical' : 'severe',
    });
  }

  // Removemos o 'score' do retorno, pois o index.ts calcula tudo
  return { items, fatal };
};
