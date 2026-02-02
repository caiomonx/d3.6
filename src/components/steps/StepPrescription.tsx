import React from 'react';
import { useGame } from '../../context/useGame';
import { Button } from '../ui/Button';
import { Pill } from 'lucide-react';

// Importação dos Módulos de Plano
import { PlanA } from './prescription/PlanA';
import { PlanB } from './prescription/PlanB';
import { PlanC } from './prescription/PlanC';

export const StepPrescription = () => {
  const { selectedPlan, form, updateForm, setStep, setSimState } = useGame();

  const handleFinish = () => {
    if (selectedPlan === 'A') {
      setStep(3);
    } else {
      setStep(2.5);
      setSimState('loading');
    }
  };

  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-medical-primary focus:ring-1 focus:ring-medical-primary outline-none transition-all placeholder:text-gray-600';
  const labelClass =
    'text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider';
  const optionClass = 'bg-[#18181b] text-white py-2';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Renderização Condicional dos Módulos */}
      {selectedPlan === 'A' && <PlanA />}
      {selectedPlan === 'B' && <PlanB />}
      {selectedPlan === 'C' && <PlanC />}

      {/* === ANTIBIÓTICO (MÓDULO DE DESTAQUE - COMUM A TODOS) === */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div
          className={`p-5 rounded-3xl border transition-all duration-300 ${
            form.abxCheck
              ? 'bg-rose-900/10 border-rose-500/40 shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]'
              : 'bg-white/5 border-white/5'
          }`}
        >
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <div
              className={`p-2 rounded-lg transition-colors ${
                form.abxCheck
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              <Pill size={20} />
            </div>
            <input
              type="checkbox"
              checked={form.abxCheck}
              onChange={(e) => updateForm('abxCheck', e.target.checked)}
              className="w-5 h-5 rounded accent-rose-500 bg-black/50 border-white/20"
            />
            <div>
              <span
                className={`font-bold block ${
                  form.abxCheck ? 'text-white' : 'text-gray-400'
                }`}
              >
                Prescrever Antibiótico
              </span>
              {form.abxCheck && (
                <span className="text-[10px] text-rose-400 uppercase tracking-widest font-bold">
                  Uso Restrito
                </span>
              )}
            </div>
          </label>
          {form.abxCheck && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in pl-14">
              <div>
                <label className={labelClass}>Justificativa</label>
                <select
                  value={form.abxIndication}
                  onChange={(e) => updateForm('abxIndication', e.target.value)}
                  className={`${inputClass} border-rose-500/30 focus:border-rose-500 focus:ring-rose-500`}
                >
                  <option value="" className={optionClass}>
                    Selecione...
                  </option>
                  <option value="disenteria" className={optionClass}>
                    Disenteria Febril
                  </option>
                  <option value="colera" className={optionClass}>
                    Cólera Grave
                  </option>
                  <option value="giardia" className={optionClass}>
                    Giardíase Confirmada
                  </option>
                  <option value="ameba" className={optionClass}>
                    Amebíase Confirmada
                  </option>
                  <option value="sepse" className={optionClass}>
                    Sepse
                  </option>
                  <option value="otite" className={optionClass}>
                    Otite Média Aguda
                  </option>
                  <option value="itu" className={optionClass}>
                    Infecção Urinária
                  </option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Droga</label>
                <select
                  value={form.abxDrug}
                  onChange={(e) => updateForm('abxDrug', e.target.value)}
                  className={`${inputClass} border-rose-500/30 focus:border-rose-500 focus:ring-rose-500`}
                >
                  <option value="0" className={optionClass}>
                    Selecione...
                  </option>
                  <option value="cipro" className={optionClass}>
                    Ciprofloxacino
                  </option>
                  <option value="ceftriaxona" className={optionClass}>
                    Ceftriaxona
                  </option>
                  <option value="azitromicina" className={optionClass}>
                    Azitromicina
                  </option>
                  <option value="metronidazol" className={optionClass}>
                    Metronidazol
                  </option>
                  <option value="amoxicilina" className={optionClass}>
                    Amoxicilina
                  </option>
                  <option value="amox_clav" className={optionClass}>
                    Amoxicilina + Clavulanato
                  </option>
                  <option value="cefalexina" className={optionClass}>
                    Cefalexina
                  </option>
                  <option value="levofloxacino" className={optionClass}>
                    Levofloxacino
                  </option>
                  <option value="penicilina" className={optionClass}>
                    Penicilina Benzatina
                  </option>
                </select>
              </div>

              {/* DOSE */}
              <div className="md:col-span-2">
                <label className={labelClass}>Dose (mg/kg/dia)</label>
                <input
                  type="number"
                  placeholder="Ex: 50"
                  value={form.abxDoseInput || ''}
                  onChange={(e) => updateForm('abxDoseInput', e.target.value)}
                  className={`${inputClass} border-rose-500/30 focus:border-rose-500 focus:ring-rose-500 font-bold`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          variant="secondary"
          onClick={() => setStep(1)}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button onClick={handleFinish} className="w-full py-4 text-lg">
          {selectedPlan === 'A' ? 'Finalizar Caso' : 'Iniciar Supervisão'}
        </Button>
      </div>
    </div>
  );
};
