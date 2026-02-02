import { CaseStudy } from '../../types';

// Helper para formatar idade
export function formatAge(m: number) {
  return m < 12 ? `${m} meses` : `${Math.floor(m / 12)} anos`;
}

export function getPlanDescription(plan: string): string {
  const map: Record<string, string> = {
    A: 'Hidratação Adequada',
    B: 'Desidratação Leve/Moderada',
    C: 'Desidratação Grave/Choque',
  };
  return map[plan] || plan;
}

export function getSROName(brand: string): string {
  const map: Record<string, string> = {
    sus: 'SRO (Padrão OMS)',
    pedialyte: 'SRO Comercial (Pedialyte)',
    gatorade: 'Isotônico Esportivo (Inadequado)',
    coco: 'Água de Coco (Inadequado)',
    caseiro: 'Soro Caseiro',
    agua: 'Água Pura (Inadequado)',
    refrigerante: 'Refrigerante (Inadequado)',
  };
  return map[brand] || brand || 'Não especificado';
}

export function getDrugName(drug: string): string {
  const map: Record<string, string> = {
    cipro: 'Ciprofloxacino',
    azitromicina: 'Azitromicina',
    metronidazol: 'Metronidazol',
    ceftriaxona: 'Ceftriaxona',
    amoxicilina: 'Amoxicilina',
    amox_clav: 'Amoxicilina + Clavulanato',
    cefalexina: 'Cefalexina',
    levofloxacino: 'Levofloxacino',
    penicilina: 'Penicilina Benzatina',
    ondansetrona: 'Ondansetrona',
    metoclopramida: 'Metoclopramida',
    bromoprida: 'Bromoprida',
    domperidona: 'Domperidona',
    dimenidrato: 'Dimenidrato',
    prometazina: 'Prometazina',
    nada: 'Nenhum',
  };
  return map[drug] || drug;
}

// === NOVOS HELPERS DE CÁLCULO E TEXTO ===

export function getZincText(ageMonths: number): string {
  return ageMonths < 6 ? '10mg (1x/dia)' : '20mg (1x/dia)';
}

export function getOndansetronText(weight: number): {
  dose: number;
  text: string;
  math: string;
} {
  let dose = 0;
  let text = '';
  let math = '';

  if (weight <= 10) {
    dose = Number((weight * 0.15).toFixed(1));
    text = `~${dose}mg`;
    math = `Peso ${weight}kg x 0,15mg/kg = ${dose}mg.`;
  } else if (weight <= 30) {
    dose = 4;
    text = '4mg (Dose fixa)';
    math = `Peso ${weight}kg (Faixa 10-30kg) = Dose fixa de 4mg.`;
  } else {
    dose = 8;
    text = '8mg (Dose fixa)';
    math = `Peso ${weight}kg (>30kg) = Dose fixa de 8mg.`;
  }
  return { dose, text, math };
}

export function getAntibioticRationale(indication: string): string {
  const map: Record<string, string> = {
    disenteria:
      'Disenteria Febril (Sangue + Febre) sugere Shigella. Ciprofloxacino é a droga de escolha.',
    colera:
      'Cólera Grave (choque + diarreia profusa) exige antibiótico para reduzir perdas.',
    giardia:
      'Giardíase causa diarreia persistente e má absorção. Metronidazol é o padrão.',
    ameba:
      'Amebíase Invasiva (Trofozoítos + Disenteria) exige Metronidazol em dose alta.',
  };
  return map[indication] || 'Indicação baseada na etiologia suspeita.';
}

export function getAntibioticErrorImpact(
  indication: string,
  prescribed: boolean
): string {
  if (!prescribed)
    return 'Doença prolongada, risco de complicações sistêmicas (Bacteremia, SHU).';
  return 'Dose incorreta leva à falha terapêutica ou toxicidade.';
}

export function getAntibioticTips(indication: string): string[] {
  const map: Record<string, string[]> = {
    disenteria: ['Cipro 15mg/kg a cada 12h', 'Uso por 3 dias'],
    colera: ['Azitromicina dose única 20mg/kg'],
    giardia: ['Metronidazol 15mg/kg/dia por 5-7 dias'],
    ameba: ['Metronidazol 30-50mg/kg/dia por 10 dias'],
  };
  return map[indication] || ['Calcule a dose pelo peso'];
}
