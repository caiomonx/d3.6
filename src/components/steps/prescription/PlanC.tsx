import React from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../ui/Card';
import { Syringe, Calculator, Droplets, FlaskConical } from 'lucide-react';

export const PlanC = () => {
  const { form, updateForm } = useGame();

  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-medical-primary focus:ring-1 focus:ring-medical-primary outline-none transition-all placeholder:text-gray-600';
  const labelClass =
    'text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider';
  const optionClass = 'bg-[#18181b] text-white py-2';

  return (
    <div className="space-y-8">
      {/* FASE 1: EXPANSÃO RÁPIDA */}
      <Card
        title="Fase 1: Expansão Rápida"
        icon={Syringe}
        className="border-medical-danger/30 bg-medical-danger/5"
      >
        <div className="mb-4">
          <label className={labelClass}>Fluido de Expansão</label>
          <select
            value={form.ivSol}
            onChange={(e) => updateForm('ivSol', e.target.value)}
            className={`${inputClass} bg-black/60`}
          >
            <option value="0" className={optionClass}>
              Selecione...
            </option>
            <option value="sf09" className={optionClass}>
              Soro Fisiológico 0.9%
            </option>
            <option value="ringer" className={optionClass}>
              Ringer Lactato
            </option>
            <option value="sg5" className={optionClass}>
              Soro Glicosado 5%
            </option>
            <option value="sg10" className={optionClass}>
              Soro Glicosado 10%
            </option>
            <option value="ad" className={optionClass}>
              Água Destilada
            </option>
            <option value="hes" className={optionClass}>
              Amido (Voluven/HES)
            </option>
            <option value="albumina" className={optionClass}>
              Albumina Humana
            </option>
            <option value="salina3" className={optionClass}>
              Salina Hipertônica 3%
            </option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vol 1 (ml)</label>
            <input
              type="number"
              value={form.v1}
              onChange={(e) => updateForm('v1', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tempo 1 (min)</label>
            <input
              type="number"
              value={form.t1}
              onChange={(e) => updateForm('t1', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Vol 2 (ml)</label>
            <input
              type="number"
              value={form.v2}
              onChange={(e) => updateForm('v2', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tempo 2 (min)</label>
            <input
              type="number"
              value={form.t2}
              onChange={(e) => updateForm('t2', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {/* FASE 2: MANUTENÇÃO (Sem KCl) */}
      <Card title="Fase 2: Manutenção" icon={Calculator}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vol. Holliday (ml)</label>
            <input
              type="number"
              value={form.maintVol}
              onChange={(e) => updateForm('maintVol', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Solução</label>
            <select
              value={form.maintSol}
              onChange={(e) => updateForm('maintSol', e.target.value)}
              className={`${inputClass} text-xs`}
            >
              <option value="0" className={optionClass}>
                ...
              </option>
              <option value="sg_sf_4_1" className={optionClass}>
                SG5% + SF0.9% (4:1)
              </option>
              <option value="sg_sf_1_1" className={optionClass}>
                SG5% + SF0.9% (1:1)
              </option>
              <option value="sf09" className={optionClass}>
                SF 0.9% Puro
              </option>
              <option value="sg5" className={optionClass}>
                SG 5% Puro
              </option>
              <option value="ringer" className={optionClass}>
                Ringer Lactato
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* FASE 3: REPOSIÇÃO (NOVO) */}
      <Card title="Fase 3: Reposição (Perdas)" icon={Droplets}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Volume (ml/dia)</label>
            <input
              type="number"
              value={form.repVol}
              onChange={(e) => updateForm('repVol', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Solução</label>
            <select
              value={form.repSol}
              onChange={(e) => updateForm('repSol', e.target.value)}
              className={`${inputClass} text-xs`}
            >
              <option value="0" className={optionClass}>
                ...
              </option>
              <option value="sg_sf_1_1" className={optionClass}>
                SG5% + SF0.9% (1:1)
              </option>
              <option value="sg_sf_4_1" className={optionClass}>
                SG5% + SF0.9% (4:1)
              </option>
              <option value="sf09" className={optionClass}>
                SF 0.9% Puro
              </option>
              <option value="ringer" className={optionClass}>
                Ringer Lactato
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* FASE 4: KCl (NOVO - Minimalista) */}
      <Card title="Fase 4: Reposição de KCl" icon={FlaskConical}>
        <div>
          <label className={labelClass}>Volume de KCl 10% (ml)</label>
          <input
            type="number"
            value={form.kclVol}
            onChange={(e) => updateForm('kclVol', e.target.value)}
            className={`${inputClass} border-purple-500/30 focus:border-purple-500 focus:ring-purple-500`}
          />
        </div>
      </Card>
    </div>
  );
};
