// src/utils/format.ts

export const formatAge = (months: number) => {
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths > 0
    ? `${years}a ${remainingMonths}m`
    : `${years} anos`;
};

// ESSA É A FUNÇÃO QUE ESTAVA FALTANDO E CAUSAVA O CRASH
export const calculateHolliday = (weight: number) => {
  let vol = 0;
  if (weight <= 10) {
    vol = weight * 100;
  } else if (weight <= 20) {
    vol = 1000 + (weight - 10) * 50;
  } else {
    vol = 1500 + (weight - 20) * 20;
  }
  return { vol, rate: Math.round(vol / 24) };
};
