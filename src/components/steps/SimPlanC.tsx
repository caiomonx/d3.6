import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../../context/useGame';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VitalMonitor, VitalSigns } from './VitalMonitor';
import { ArrowRight } from 'lucide-react';

export const SimPlanC = () => {
  const {
    form,
    updateForm,
    simState,
    setSimState,
    addSimStep,
    setStep,
    currentCase,
  } = useGame();

  const [currentAction, setCurrentAction] = useState('');
  const [stage, setStage] = useState(0);
  const [tempOutcome, setTempOutcome] = useState<{
    type: string;
    text: string;
  } | null>(null);

  const [vitals, setVitals] = useState<VitalSigns>({
    hr: 165,
    rr: 55,
    sbp: 60,
    dbp: 35,
    sat: 92,
  });
  const animationRef = useRef<number>();

  const selectClass =
    'w-full bg-[#18181b] border border-white/10 rounded-xl p-4 text-white mb-6 focus:border-medical-primary outline-none transition-all appearance-none cursor-pointer hover:border-white/20 font-sans';
  const optionClass = 'bg-[#18181b] text-white py-3';

  const resolveOutcome = (currentStage: number, actionTaken: string) => {
    if (!currentCase) return { type: 'bad', text: 'Erro.' };
    const w = currentCase.weight;
    const baseOutcome = currentCase.eventOutcome;

    if (currentStage === 0) {
      const sol = form.ivSol;
      const target = Math.round(w * 30);
      const v1 = parseFloat(form.v1 || '0');

      if (['sg5', 'ad', 'sg50', 'sg10'].includes(sol))
        return {
          type: 'critical',
          text: '⚠️ PIORA NEUROLÓGICA AGUDA: Hiponatremia.',
        };
      if (Math.abs(v1 - target) > target * 0.3)
        return { type: 'bad', text: '⚠️ Perfusão ainda lentificada.' };
      if (baseOutcome === 'shock')
        return { type: 'bad', text: '⚠️ Choque mantido após 1ª expansão.' };
      return { type: 'good', text: '✅ Melhora do nível de consciência.' };
    }

    if (currentStage >= 1) {
      if (actionTaken === 'repetir')
        return { type: 'good', text: '✅ Estabilização hemodinâmica.' };
      if (actionTaken === 'trocar')
        return { type: 'good', text: '✅ Solução corrigida.' };
      if (actionTaken === 'manutencao' && tempOutcome?.type !== 'good')
        return { type: 'critical', text: '⚠️ Choque Irreversível.' };
    }
    return { type: 'neutral', text: '...' };
  };

  useEffect(() => {
    if (simState === 'loading') {
      const outcome = resolveOutcome(stage, currentAction);

      let target: VitalSigns;
      if (outcome.type === 'good')
        target = { hr: 110, rr: 28, sbp: 100, dbp: 60, sat: 99 };
      else if (outcome.type === 'critical')
        target = { hr: 180, rr: 60, sbp: 50, dbp: 30, sat: 85 };
      else target = { hr: 155, rr: 50, sbp: 70, dbp: 45, sat: 94 };

      const duration = 4000;
      const startTime = performance.now();
      const startVitals = { ...vitals };

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = (t: number) => t * (2 - t);
        setVitals({
          hr: Math.round(
            startVitals.hr + (target.hr - startVitals.hr) * ease(progress)
          ),
          rr: Math.round(
            startVitals.rr + (target.rr - startVitals.rr) * ease(progress)
          ),
          sbp: Math.round(
            startVitals.sbp + (target.sbp - startVitals.sbp) * ease(progress)
          ),
          dbp: Math.round(
            startVitals.dbp + (target.dbp - startVitals.dbp) * ease(progress)
          ),
          sat: Math.round(
            startVitals.sat + (target.sat - startVitals.sat) * ease(progress)
          ),
        });
        if (progress < 1) animationRef.current = requestAnimationFrame(animate);
        else {
          setTempOutcome(outcome);
          setSimState('done');
          setCurrentAction('');
        }
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [simState]);

  const handleAction = () => {
    if (!tempOutcome) return;
    addSimStep({
      stage,
      outcomeType: tempOutcome.type,
      outcomeText: tempOutcome.text,
      userAction: currentAction || 'initial_eval',
    });
    if (currentAction) updateForm('simAction', currentAction);

    if (
      ['manutencao', 'alta', 'furosemida', 'adrenalina'].includes(
        currentAction
      ) ||
      (tempOutcome.type === 'good' && stage > 0)
    ) {
      setStep(3);
      return;
    }
    setStage((prev) => prev + 1);
    setSimState('loading');
    setTempOutcome(null);
  };

  const isGood = tempOutcome?.type === 'good';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <VitalMonitor vitals={vitals} active={simState === 'loading'} />
      {simState === 'done' && tempOutcome && (
        <Card className="animate-fade-in border-t-4 border-t-medical-primary">
          <div className="p-6 mb-4 bg-white/5 rounded-xl">
            <h3
              className={`font-bold text-lg mb-1 ${
                isGood ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isGood ? 'Evolução Favorável' : 'Alerta Clínico'}
            </h3>
            <p className="text-gray-200">{tempOutcome.text}</p>
          </div>
          <div>
            <label className="text-xs text-medical-primary uppercase font-bold block mb-3">
              Próximo Passo
            </label>
            <select
              value={currentAction}
              onChange={(e) => setCurrentAction(e.target.value)}
              className={selectClass}
            >
              <option value="" className={optionClass}>
                Selecione...
              </option>
              {isGood ? (
                <>
                  <option value="manutencao" className={optionClass}>
                    Iniciar Manutenção
                  </option>
                  <option value="alta" className={optionClass}>
                    Alta Hospitalar
                  </option>
                  <option value="furosemida" className={optionClass}>
                    Prescrever Furosemida
                  </option>
                </>
              ) : (
                <>
                  <option value="repetir" className={optionClass}>
                    Repetir Expansão
                  </option>
                  <option value="adrenalina" className={optionClass}>
                    Iniciar Adrenalina
                  </option>
                  <option value="trocar" className={optionClass}>
                    Trocar para SF 0.9%
                  </option>
                  <option value="manutencao" className={optionClass}>
                    Seguir para Manutenção
                  </option>
                </>
              )}
            </select>
            <Button
              onClick={handleAction}
              disabled={!currentAction}
              className="w-full py-5 text-lg"
            >
              Confirmar
            </Button>
          </div>
        </Card>
      )}
      {simState === 'loading' && (
        <div className="text-center animate-pulse pt-8 text-medical-primary">
          EXPANSÃO EM CURSO...
        </div>
      )}
    </div>
  );
};
