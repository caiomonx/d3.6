import React from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../ui/Card';
import { Droplet, Ban } from 'lucide-react';

export const PlanB = () => {
  const { form, updateForm } = useGame();

  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-medical-primary focus:ring-1 focus:ring-medical-primary outline-none transition-all placeholder:text-gray-600';
  const labelClass =
    'text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider';
  const optionClass = 'bg-[#18181b] text-white py-2';

  return (
    <Card title="Reidratação Oral (TRO)" icon={Droplet}>
      <div className="space-y-6">
        <div className="bg-medical-warning/5 p-5 rounded-2xl border border-medical-warning/20">
          <label className="text-xs text-medical-warning font-bold uppercase mb-2 block tracking-wider">
            Volume Total (4 horas)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={form.sroVolB}
              onChange={(e) => updateForm('sroVolB', e.target.value)}
              className={`${inputClass} border-medical-warning/50 text-white font-mono font-bold text-lg pl-4 pr-12`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
              ml
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            O volume deve ser calculado com base no peso para o período de 4
            horas.
          </p>
        </div>

        {/* ANTIEMÉTICO */}
        <div className="bg-indigo-900/10 p-4 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Ban size={18} />
            </div>
            <label className="font-bold text-white text-sm">
              Antiemético (SOS)
            </label>
          </div>

          <div className="pl-12">
            <select
              value={form.antiDrug}
              onChange={(e) => updateForm('antiDrug', e.target.value)}
              className={`${inputClass} border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="0" className={optionClass}>
                Selecione...
              </option>
              <option value="nada" className={optionClass}>
                Nenhum
              </option>
              <option value="ondansetrona" className={optionClass}>
                Ondansetrona
              </option>
              <option value="metoclopramida" className={optionClass}>
                Metoclopramida (Plasil)
              </option>
              <option value="bromoprida" className={optionClass}>
                Bromoprida
              </option>
              <option value="domperidona" className={optionClass}>
                Domperidona
              </option>
              <option value="dimenidrato" className={optionClass}>
                Dimenidrato (Dramin)
              </option>
              <option value="prometazina" className={optionClass}>
                Prometazina (Fenergan)
              </option>
            </select>
            {form.antiDrug !== '0' && form.antiDrug !== 'nada' && (
              <div className="mt-3 animate-fade-in">
                <label className={labelClass}>Dose (mg)</label>
                <input
                  type="number"
                  placeholder=""
                  value={form.antiDose}
                  onChange={(e) => updateForm('antiDose', e.target.value)}
                  className={`${inputClass} border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
