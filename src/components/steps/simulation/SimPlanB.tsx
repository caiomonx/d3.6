import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { VitalMonitor, VitalSigns } from './VitalMonitor';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const SimPlanB = () => {
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
    hr: 138,
    rr: 40,
    sbp: 95,
    dbp: 60,
    sat: 96,
  });
  const animationRef = useRef<number>();

  const resolveOutcome = (currentStage: number, actionTaken: string) => {
    if (!currentCase) return { type: 'bad', text: 'Erro.' };
    const w = currentCase.weight;
    const baseOutcome = currentCase.eventOutcome;

    if (currentStage === 0) {
      const vol = parseFloat(form.sroVolB || '0');
      if (vol > w * 100 * 1.5)
        return {
          type: 'critical',
          text: '⚠️ Edema periorbital (Sobrecarga). Suspender SRO.',
        };
      if (vol < w * 50 * 0.8)
        return {
          type: 'bad',
          text: '⚠️ Volume insuficiente. Sinais de desidratação mantidos.',
        };
      if (baseOutcome === 'vomit') {
        if (form.antiDrug === 'ondansetrona')
          return {
            type: 'good',
            text: '✅ Vômitos cessaram. Paciente hidratando.',
          };
        return { type: 'bad', text: '⚠️ Vômitos persistentes impedem a TRO.' };
      }
      return { type: 'good', text: '✅ Paciente hidratado e calmo.' };
    }
    // Lógica Pós-Intervenção
    if (actionTaken === 'ondansetrona')
      return { type: 'good', text: '✅ Vômitos controlados.' };
    if (actionTaken === 'sng')
      return { type: 'good', text: '✅ Gastróclise eficaz.' };
    if (actionTaken === 'planoc')
      return { type: 'good', text: '✅ Acesso venoso garantido.' };
    return { type: 'bad', text: '⚠️ Conduta ineficaz.' };
  };

  useEffect(() => {
    if (simState === 'loading') {
      const outcome = resolveOutcome(stage, currentAction);

      let target: VitalSigns;
      if (outcome.type === 'good')
        target = { hr: 110, rr: 28, sbp: 100, dbp: 60, sat: 99 };
      else if (outcome.type === 'critical')
        target = { hr: 160, rr: 55, sbp: 80, dbp: 40, sat: 92 };
      else target = { hr: 135, rr: 42, sbp: 90, dbp: 55, sat: 95 };

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
    if (currentAction) updateForm('simAction', currentAction); // SALVA AÇÃO PARA FEEDBACK

    if (
      ['alta', 'manter', 'raiox', 'planoc', 'sedacao'].includes(currentAction)
    ) {
      setStep(3);
      return;
    }
    setStage((prev) => prev + 1);
    setSimState('loading');
    setTempOutcome(null);
  };

  const isGood = tempOutcome?.type === 'good';
  const selectClass =
    'w-full bg-[#18181b] border border-white/10 rounded-xl p-4 text-white mb-6 focus:border-medical-primary outline-none transition-all cursor-pointer font-sans';
  const optionClass = 'bg-[#18181b] text-white py-3';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <VitalMonitor vitals={vitals} active={simState === 'loading'} />
      {simState === 'done' && tempOutcome && (
        <Card className="animate-fade-in border-t-4 border-t-medical-primary">
          <div
            className={`p-6 mb-4 rounded-xl border-l-4 ${
              isGood
                ? 'bg-emerald-950/30 border-emerald-500'
                : 'bg-rose-950/30 border-rose-500'
            }`}
          >
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
                  <option value="alta" className={optionClass}>
                    Alta para casa com SRO
                  </option>
                  <option value="manter" className={optionClass}>
                    Manter em observação
                  </option>
                  <option value="raiox" className={optionClass}>
                    Solicitar Raio-X
                  </option>
                </>
              ) : (
                <>
                  <option value="ondansetrona" className={optionClass}>
                    Prescrever Ondansetrona
                  </option>
                  <option value="sng" className={optionClass}>
                    Passar Sonda (SNG)
                  </option>
                  <option value="planoc" className={optionClass}>
                    Converter para Venoso (Plano C)
                  </option>
                  <option value="sedacao" className={optionClass}>
                    Sedar paciente
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
          AVALIANDO TOLERÂNCIA ORAL...
        </div>
      )}
    </div>
  );
};
