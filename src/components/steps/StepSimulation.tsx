import React from 'react';
import { useGame } from '../../context/useGame';
import { SimPlanB } from './simulation/SimPlanB';
import { SimPlanC } from './simulation/SimPlanC';

export const StepSimulation = () => {
  const { selectedPlan } = useGame();

  if (selectedPlan === 'B') return <SimPlanB />;
  if (selectedPlan === 'C') return <SimPlanC />;

  return (
    <div className="p-8 border border-white/10 rounded-xl bg-white/5 text-center">
      <h3 className="text-xl font-bold text-white mb-2">
        Simulação não necessária
      </h3>
      <p className="text-gray-400">
        O Plano A não requer monitoramento hospitalar intensivo.
      </p>
    </div>
  );
};
