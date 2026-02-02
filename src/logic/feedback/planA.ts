import { CaseStudy, GameFormState, DetailedFeedback } from '../../types';
import {
  getSROName,
  getDrugName,
  getAntibioticRationale,
  getAntibioticErrorImpact,
  getAntibioticTips,
  getZincText,
} from './utils';

export const evaluatePlanA = (
  c: CaseStudy,
  form: GameFormState
): { items: DetailedFeedback[] } => {
  const items: DetailedFeedback[] = [];

  // 1. HIDRATAÇÃO
  const vol = parseFloat(form.sroVolA || '0');
  let minVol = 0;
  let volumeText = '';

  if (c.ageMonths < 12) {
    minVol = 50;
    volumeText = '50-100 ml';
  } else if (c.ageMonths <= 120) {
    minVol = 100;
    volumeText = '100-200 ml';
  } else {
    minVol = 200;
    volumeText = 'Livre demanda';
  }

  const isSROCorrect = ['sus', 'pedialyte'].includes(form.sroBrand);
  const isVolCorrect =
    c.ageMonths > 120 ? true : form.sroOrient === 'reposicao' && vol >= minVol;

  if (isSROCorrect && isVolCorrect) {
    items.push({
      category: 'Hidratação Oral',
      isCorrect: true,
      points: 25,
      maxPoints: 25,
      title: 'Reposição Domiciliar',
      userConduct: {
        description: 'Sua conduta',
        value: `${getSROName(form.sroBrand)}: ${vol}ml após perdas`,
      },
      idealConduct: {
        description: 'Padrão Ouro',
        value: `SRO OMS: ${volumeText}`,
      },
      rationale: {
        shortExplanation: 'Volume e líquido corretos.',
        clinicalReasoning: 'Reposição volume-a-volume previne desidratação.',
        howToImprove: [],
      },
    });
  } else {
    items.push({
      category: 'Hidratação Oral',
      isCorrect: false,
      points: 0,
      maxPoints: 25,
      title: 'Erro na Reposição',
      userConduct: {
        description: 'Sua conduta',
        value: `${getSROName(form.sroBrand)} (${vol}ml)`,
      },
      idealConduct: {
        description: 'Padrão Ouro',
        value: `SRO OMS: ${volumeText}`,
      },
      rationale: {
        shortExplanation: 'Líquido ou volume inadequados.',
        clinicalReasoning: 'Água pura ou refrigerantes não repõem eletrólitos.',
        howToImprove: ['Use SRO após cada evacuação'],
      },
      severity: 'moderate',
    });
  }

  // 2. ZINCO (Pontuação Parcial)
  if (c.ageMonths < 60) {
    const targetZ = c.ageMonths < 6 ? 10 : 20;
    const zincIdealText = getZincText(c.ageMonths);
    const userZ = parseFloat(form.zincDose || '0');

    if (form.zincCheck) {
      if (userZ === targetZ) {
        items.push({
          category: 'Suplementação',
          isCorrect: true,
          points: 25,
          maxPoints: 25,
          title: 'Zinco',
          userConduct: { description: 'Dose', value: `${userZ}mg` },
          idealConduct: { description: 'Ideal', value: zincIdealText },
          rationale: {
            shortExplanation: 'Dose correta.',
            clinicalReasoning: `Idade ${c.ageMonths} meses exige ${targetZ}mg.`,
            howToImprove: [],
          },
        });
      } else {
        items.push({
          category: 'Suplementação',
          isCorrect: false,
          points: 12,
          maxPoints: 25, // ~50%
          title: 'Dose de Zinco',
          userConduct: { description: 'Sua dose', value: `${userZ}mg` },
          idealConduct: { description: 'Ideal', value: zincIdealText },
          rationale: {
            shortExplanation: 'Dose incorreta.',
            clinicalReasoning: `Você acertou a indicação, mas errou a dose. O correto é ${targetZ}mg.`,
            howToImprove: [],
          },
          severity: 'minor',
        });
      }
    } else {
      items.push({
        category: 'Suplementação',
        isCorrect: false,
        points: 0,
        maxPoints: 25,
        title: 'Omissão de Zinco',
        userConduct: { description: 'Conduta', value: 'Não prescreveu' },
        idealConduct: { description: 'Ideal', value: zincIdealText },
        rationale: {
          shortExplanation: 'Esqueceu o Zinco.',
          clinicalReasoning: 'Obrigatório para < 5 anos.',
          howToImprove: [],
        },
        severity: 'moderate',
      });
    }
  }

  // 3. ANTIBIÓTICO (Pontuação Parcial)
  const needAbx = c.abxIndication !== 'none';
  if (needAbx) {
    const userDose = parseFloat(form.abxDoseInput || '0');
    const target = c.abxDoseTarget;

    if (form.abxCheck && form.abxDrug === c.abxDrug) {
      const isDoseCorrect = Math.abs(userDose - target) <= target * 0.2;

      if (isDoseCorrect) {
        items.push({
          category: 'Antibiótico',
          isCorrect: true,
          points: 50,
          maxPoints: 50,
          title: 'Tratamento Etiológico',
          userConduct: {
            description: 'Prescrição',
            value: `${getDrugName(form.abxDrug)} ${userDose}mg/kg`,
          },
          idealConduct: {
            description: 'Ideal',
            value: `${getDrugName(c.abxDrug)} ${target}mg/kg`,
          },
          rationale: {
            shortExplanation: 'Perfeito.',
            clinicalReasoning: getAntibioticRationale(c.abxIndication),
            howToImprove: [],
          },
        });
      } else {
        items.push({
          category: 'Antibiótico',
          isCorrect: false,
          points: 25,
          maxPoints: 50, // 50%
          title: 'Erro de Dose',
          userConduct: { description: 'Sua dose', value: `${userDose}mg/kg` },
          idealConduct: { description: 'Ideal', value: `${target}mg/kg` },
          rationale: {
            shortExplanation: 'Dose errada.',
            clinicalReasoning: `Droga correta, mas a dose alvo é ${target}mg/kg.`,
            howToImprove: getAntibioticTips(c.abxIndication),
          },
          severity: 'moderate',
        });
      }
    } else {
      items.push({
        category: 'Antibiótico',
        isCorrect: false,
        points: 0,
        maxPoints: 50,
        title: 'Falha Terapêutica',
        userConduct: {
          description: 'Conduta',
          value: form.abxCheck ? getDrugName(form.abxDrug) : 'Omissão',
        },
        idealConduct: {
          description: 'Necessário',
          value: getDrugName(c.abxDrug),
        },
        rationale: {
          shortExplanation: 'Tratamento incorreto.',
          clinicalReasoning: `Caso de ${c.abxIndication}.`,
          errorImpact: getAntibioticErrorImpact(c.abxIndication, false),
          howToImprove: [],
        },
        severity: 'severe',
      });
    }
  } else {
    // Se prescreveu sem precisar
    if (form.abxCheck) {
      items.push({
        category: 'Antibiótico',
        isCorrect: false,
        points: 0,
        maxPoints: 50,
        title: 'Uso Indevido',
        userConduct: {
          description: 'Erro',
          value: `Prescreveu ${getDrugName(form.abxDrug)}`,
        },
        idealConduct: { description: 'Ideal', value: 'Não Prescrever' },
        rationale: {
          shortExplanation: 'Desnecessário.',
          clinicalReasoning: 'Diarreia aguda é geralmente viral.',
          errorImpact: 'Resistência bacteriana.',
          howToImprove: [],
        },
        severity: 'moderate',
      });
    } else {
      items.push({
        category: 'Uso Racional',
        isCorrect: true,
        points: 50,
        maxPoints: 50,
        title: 'Antibiótico',
        userConduct: { description: 'Conduta', value: 'Não Prescreveu' },
        idealConduct: { description: 'Ideal', value: 'Não Prescrever' },
        rationale: {
          shortExplanation: 'Correto.',
          clinicalReasoning: 'Evitou uso desnecessário.',
          howToImprove: [],
        },
      });
    }
  }

  return { items };
};
