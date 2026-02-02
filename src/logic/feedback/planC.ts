import { CaseStudy, GameFormState, DetailedFeedback } from '../../types';
import { calculateHolliday } from '../../utils/format';

export const evaluatePlanC = (
  c: CaseStudy,
  form: GameFormState
): { items: DetailedFeedback[]; fatal: boolean } => {
  const items: DetailedFeedback[] = [];
  let fatal = false;

  const solExp = form.ivSol;
  const vol1 = parseFloat(form.v1 || '0');
  const vol2 = parseFloat(form.v2 || '0');

  // 1. EXPANSÃO (40 Pontos)
  const isInfant = c.ageMonths < 12;
  const targetV1 = Math.round(c.weight * 30);
  const targetV2 = Math.round(c.weight * 70);

  const ruleText = isInfant
    ? `30ml/kg (${targetV1}ml) + 70ml/kg (${targetV2}ml)`
    : `30ml/kg (${targetV1}ml) + 70ml/kg (${targetV2}ml)`;

  const isSolCorrect = ['sf09', 'ringer'].includes(solExp);
  const isV1Correct = Math.abs(vol1 - targetV1) < targetV1 * 0.15;
  const isV2Correct = Math.abs(vol2 - targetV2) < targetV2 * 0.15;

  if (isSolCorrect && isV1Correct && isV2Correct) {
    items.push({
      category: 'Expansão Volêmica',
      isCorrect: true,
      points: 40,
      maxPoints: 40,
      title: 'Volumes de Expansão',
      userConduct: {
        description: 'Prescrição',
        value: `${vol1}ml + ${vol2}ml`,
      },
      idealConduct: { description: 'Calculado', value: ruleText },
      rationale: {
        shortExplanation: 'Volumes exatos.',
        clinicalReasoning: `Cálculo: ${c.weight}kg x 30ml = ${targetV1}ml (Fase 1).`,
        howToImprove: [],
      },
    });
  } else {
    items.push({
      category: 'Expansão Volêmica',
      isCorrect: false,
      points: isSolCorrect ? 20 : 0,
      maxPoints: 40, // 50% se acertou só o soro
      title: 'Erro na Expansão',
      userConduct: {
        description: 'Sua prescrição',
        value: `${vol1}ml + ${vol2}ml`,
      },
      idealConduct: { description: 'Ideal', value: ruleText },
      rationale: {
        shortExplanation: 'Volume ou solução incorretos.',
        clinicalReasoning: `Regra para ${c.weight}kg: 30ml/kg (${targetV1}ml) seguido de 70ml/kg (${targetV2}ml).`,
        errorImpact: 'Glicosado é PROIBIDO na expansão.',
      },
      severity: isSolCorrect ? 'moderate' : 'critical',
    });
    if (!isSolCorrect) fatal = true;
  }

  // 2. MANUTENÇÃO (30 Pontos)
  const userMaint = parseFloat(form.maintVol || '0');
  const { vol: holVol } = calculateHolliday(c.weight);

  // Cálculo detalhado para o rationale
  let mathExpl = '';
  if (c.weight <= 10) mathExpl = `${c.weight} x 100 = ${holVol}`;
  else if (c.weight <= 20)
    mathExpl = `1000 + (${c.weight - 10} x 50) = ${holVol}`;
  else mathExpl = `1500 + (${c.weight - 20} x 20) = ${holVol}`;

  if (Math.abs(userMaint - holVol) < holVol * 0.15) {
    items.push({
      category: 'Manutenção',
      isCorrect: true,
      points: 30,
      maxPoints: 30,
      title: 'Holliday-Segar',
      userConduct: { description: 'Volume', value: `${userMaint}ml` },
      idealConduct: { description: 'Calculado', value: `${holVol}ml` },
      rationale: {
        shortExplanation: 'Cálculo correto.',
        clinicalReasoning: `Regra: ${mathExpl}.`,
        howToImprove: [],
      },
    });
  } else {
    items.push({
      category: 'Manutenção',
      isCorrect: false,
      points: 0,
      maxPoints: 30,
      title: 'Erro de Cálculo',
      userConduct: { description: 'Seu volume', value: `${userMaint}ml` },
      idealConduct: { description: 'Calculado', value: `${holVol}ml` },
      rationale: {
        shortExplanation: 'Cálculo incorreto.',
        clinicalReasoning: `Para ${c.weight}kg: ${mathExpl}ml/dia.`,
        howToImprove: ['Revise a regra 100/50/20'],
      },
      severity: 'moderate',
    });
  }

  // 3. SIMULAÇÃO (30 Pontos) - Mantido
  const simAction = form.simAction;
  const isSimCorrect =
    simAction === 'manutencao' ||
    simAction === 'repetir' ||
    simAction === 'trocar';

  if (simAction && isSimCorrect) {
    items.push({
      category: 'Simulação',
      isCorrect: true,
      points: 30,
      maxPoints: 30,
      title: 'Decisão Clínica',
      userConduct: { description: 'Ação', value: 'Correta' },
      idealConduct: { description: 'Ideal', value: 'Manutenção/Repetir' },
      rationale: {
        shortExplanation: 'Manejo correto.',
        clinicalReasoning: 'Reação adequada aos sinais vitais.',
        howToImprove: [],
      },
    });
  } else if (simAction) {
    items.push({
      category: 'Simulação',
      isCorrect: false,
      points: 0,
      maxPoints: 30,
      title: 'Decisão Clínica',
      userConduct: { description: 'Ação', value: simAction },
      idealConduct: { description: 'Ideal', value: 'Expandir' },
      rationale: {
        shortExplanation: 'Conduta inadequada.',
        clinicalReasoning: 'No choque, priorize volume.',
        howToImprove: [],
      },
      severity: 'severe',
    });
  }

  return { items, fatal };
};
