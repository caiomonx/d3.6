import { CaseStudy, GameFormState, DetailedFeedback } from '../../types';
import { getDrugName, getOndansetronText } from './utils';

export const evaluatePlanB = (
  c: CaseStudy,
  form: GameFormState
): { items: DetailedFeedback[] } => {
  const items: DetailedFeedback[] = [];

  // 1. VOLUME TRO (30 Pontos)
  const vol = parseFloat(form.sroVolB || '0');
  const minV = Math.round(c.weight * 50);
  const maxV = Math.round(c.weight * 100);
  const avgV = Math.round(c.weight * 75);

  if (vol >= minV * 0.8 && vol <= maxV * 1.2) {
    items.push({
      category: 'Prescrição',
      isCorrect: true,
      points: 30,
      maxPoints: 30,
      title: 'Volume de TRO',
      userConduct: { description: 'Seu cálculo', value: `${vol}ml` },
      idealConduct: {
        description: 'Faixa 50-100ml/kg',
        value: `${minV} a ${maxV}ml`,
      },
      rationale: {
        shortExplanation: 'Volume adequado.',
        clinicalReasoning: `Para ${c.weight}kg, calculamos entre 50-100ml/kg. A média é ${avgV}ml.`,
        howToImprove: [],
      },
    });
  } else {
    items.push({
      category: 'Prescrição',
      isCorrect: false,
      points: 0,
      maxPoints: 30,
      title: 'Volume Inadequado',
      userConduct: { description: 'Seu cálculo', value: `${vol}ml` },
      idealConduct: {
        description: 'Faixa 50-100ml/kg',
        value: `${minV} a ${maxV}ml`,
      },
      rationale: {
        shortExplanation:
          vol < minV ? 'Volume insuficiente.' : 'Risco de sobrecarga.',
        clinicalReasoning: `O cálculo padrão é 75ml/kg x ${c.weight}kg = ${avgV}ml.`,
        howToImprove: ['Use 75ml/kg como média inicial'],
      },
      severity: 'moderate',
    });
  }

  // 2. ANTIEMÉTICO (40 Pontos - Com Pontuação Parcial)
  const idealData = getOndansetronText(c.weight); // { dose: 4, text: "4mg", math: "Peso..." }
  const userAntiDose = parseFloat(form.antiDose || '0');
  const userDrug = form.antiDrug;
  const hasVomit =
    c.eventOutcome === 'vomit' || c.history.toLowerCase().includes('vômito');

  // ACERTO TOTAL
  if (
    userDrug === 'ondansetrona' &&
    Math.abs(userAntiDose - idealData.dose) <= 1.5
  ) {
    items.push({
      category: 'Manejo de Vômitos',
      isCorrect: true,
      points: 40,
      maxPoints: 40,
      title: 'Antiemético',
      userConduct: {
        description: 'Prescrição',
        value: `Ondansetrona ${userAntiDose}mg`,
      },
      idealConduct: { description: 'Dose Ideal', value: idealData.text },
      rationale: {
        shortExplanation: 'Dose e droga corretas.',
        clinicalReasoning: idealData.math, // Exibe "Peso X * Y = Z"
        howToImprove: [],
      },
    });
  }
  // ACERTO PARCIAL (Droga certa, dose errada)
  else if (userDrug === 'ondansetrona') {
    items.push({
      category: 'Manejo de Vômitos',
      isCorrect: false,
      points: 20,
      maxPoints: 40,
      title: 'Erro de Dose',
      userConduct: {
        description: 'Prescrição',
        value: `Ondansetrona ${userAntiDose}mg`,
      },
      idealConduct: { description: 'Dose Ideal', value: idealData.text },
      rationale: {
        shortExplanation: 'Dose incorreta.',
        clinicalReasoning: `Você acertou a droga, mas errou a dose. ${idealData.math}`,
        howToImprove: [],
      },
      severity: 'moderate',
    });
  }
  // ERRO / OMISSÃO
  else if (hasVomit) {
    items.push({
      category: 'Manejo de Vômitos',
      isCorrect: false,
      points: 0,
      maxPoints: 40,
      title: 'Falha Terapêutica',
      userConduct: {
        description: 'Conduta',
        value: userDrug === 'nada' ? 'Nenhum' : getDrugName(userDrug),
      },
      idealConduct: {
        description: 'Ideal',
        value: `Ondansetrona ${idealData.text}`,
      },
      rationale: {
        shortExplanation: 'Necessário antiemético.',
        clinicalReasoning:
          'Vômitos persistentes impedem a TRO. Ondansetrona é a escolha segura.',
        howToImprove: [],
      },
      severity: 'severe',
    });
  } else {
    // Bônus se não prescreveu sem precisar
    items.push({
      category: 'Uso Racional',
      isCorrect: true,
      points: 40,
      maxPoints: 40,
      title: 'Antiemético',
      userConduct: { description: 'Conduta', value: 'Não prescreveu' },
      idealConduct: { description: 'Ideal', value: 'Não prescrever' },
      rationale: {
        shortExplanation: 'Correto.',
        clinicalReasoning: 'Sem vômitos incoercíveis, não medicar.',
        howToImprove: [],
      },
    });
  }

  // 3. FLUXOGRAMA (30 Pontos) - Mantido simplificado para focar na dose acima
  const simAction = form.simAction;
  if (simAction) {
    const isAltaCorrect = simAction === 'alta' && c.eventOutcome !== 'vomit';
    const isOndanCorrect =
      (simAction === 'ondansetrona' || form.antiDrug === 'ondansetrona') &&
      c.eventOutcome === 'vomit';

    if (isAltaCorrect || isOndanCorrect) {
      items.push({
        category: 'Simulação',
        isCorrect: true,
        points: 30,
        maxPoints: 30,
        title: 'Decisão Clínica',
        userConduct: { description: 'Ação', value: simAction },
        idealConduct: {
          description: 'Ideal',
          value: isAltaCorrect ? 'Alta' : 'Ondansetrona',
        },
        rationale: {
          shortExplanation: 'Conduta correta.',
          clinicalReasoning: 'Reação adequada à evolução.',
          howToImprove: [],
        },
      });
    } else {
      items.push({
        category: 'Simulação',
        isCorrect: false,
        points: 0,
        maxPoints: 30,
        title: 'Erro de Decisão',
        userConduct: { description: 'Ação', value: simAction },
        idealConduct: {
          description: 'Ideal',
          value: c.eventOutcome === 'vomit' ? 'Ondansetrona' : 'Alta',
        },
        rationale: {
          shortExplanation: 'Conduta inadequada.',
          clinicalReasoning: 'Analise o desfecho clínico.',
          howToImprove: [],
        },
        severity: 'moderate',
      });
    }
  }

  return { items };
};
