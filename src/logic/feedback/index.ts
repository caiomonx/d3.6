import { CaseStudy, GameFormState, DetailedFeedback } from '../../types';
import { evaluateDiagnosis } from './diagnosis';
import { evaluatePlanA } from './planA';
import { evaluatePlanB } from './planB';
import { evaluatePlanC } from './planC';

export const generateReport = (
  c: CaseStudy,
  form: GameFormState,
  plan: string,
  outcomeType: string | undefined
): { score: number; items: DetailedFeedback[] } => {
  let allItems: DetailedFeedback[] = [];
  let isFatal = false;

  // 1. AVALIAR DIAGNÓSTICO
  const diagResult = evaluateDiagnosis(c, plan);
  allItems = [...allItems, ...diagResult.items];
  if (diagResult.fatal) isFatal = true;

  // 2. AVALIAR CONDUTA (A, B ou C)
  let planResult;
  if (plan === 'A') {
    planResult = evaluatePlanA(c, form);
  } else if (plan === 'B') {
    planResult = evaluatePlanB(c, form);
  } else {
    // Para o Plano C (e outros se necessário), passamos outcomeType se afetar a conduta
    planResult = evaluatePlanC(c, form);
    if (planResult.fatal) isFatal = true;
  }

  // Adiciona itens do plano específico
  allItems = [...allItems, ...planResult.items];

  // 3. CÁLCULO MATEMÁTICO (NORMALIZAÇÃO)
  // Soma todos os pontos ganhos e todos os pontos possíveis de todos os itens gerados
  const totalEarned = allItems.reduce((acc, item) => acc + item.points, 0);
  const totalPossible = allItems.reduce((acc, item) => acc + item.maxPoints, 0);

  // Evita divisão por zero
  let finalScore =
    totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  // Regra de Ouro: Erro Fatal (ex: Mandar chocado pra casa) zera a nota
  if (isFatal) finalScore = 0;

  return { score: finalScore, items: allItems };
};
