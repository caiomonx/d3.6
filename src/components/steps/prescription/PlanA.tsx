import React from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../ui/Card';
import { Droplet, ShieldCheck, Sprout, Baby } from 'lucide-react';

export const PlanA = () => {
  const { form, updateForm } = useGame();

  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-medical-primary focus:ring-1 focus:ring-medical-primary outline-none transition-all placeholder:text-gray-600';
  const labelClass =
    'text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider';
  const optionClass = 'bg-[#18181b] text-white py-2';

  return (
    <Card title="Terapia Domiciliar" icon={Baby}>
      <div className="space-y-8">
        {/* 1. HIDRATAÇÃO */}
        <div className="bg-medical-primary/5 p-6 rounded-3xl border border-medical-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Droplet size={100} />
          </div>
          <h4 className="text-medical-primary font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 relative z-10">
            <Droplet size={16} fill="currentColor" className="opacity-50" />{' '}
            Reidratação Oral (Principal)
          </h4>
          <div className="grid md:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className={labelClass}>Tipo de SRO</label>
              <select
                value={form.sroBrand}
                onChange={(e) => updateForm('sroBrand', e.target.value)}
                className={`${inputClass} border-medical-primary/30`}
              >
                <option value="0" className={optionClass}>
                  Selecione...
                </option>
                <option value="sus" className={optionClass}>
                  SRO SUS (Padrão OMS)
                </option>
                <option value="pedialyte" className={optionClass}>
                  Pedialyte / Hidrafix 45/90
                </option>
                <option value="gatorade" className={optionClass}>
                  Isotônico (Gatorade/Powerade)
                </option>
                <option value="coco" className={optionClass}>
                  Água de Coco
                </option>
                <option value="caseiro" className={optionClass}>
                  Soro Caseiro
                </option>
                <option value="refrigerante" className={optionClass}>
                  Refrigerante sem gás
                </option>
                <option value="agua" className={optionClass}>
                  Apenas Água Pura
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Orientação de Volume</label>
              <select
                value={form.sroOrient}
                onChange={(e) => updateForm('sroOrient', e.target.value)}
                className={`${inputClass} border-medical-primary/30`}
              >
                <option value="0" className={optionClass}>
                  Selecione...
                </option>
                <option value="livre" className={optionClass}>
                  Livre Demanda
                </option>
                <option value="reposicao" className={optionClass}>
                  Repor Perdas (após evacuação)
                </option>
                <option value="jejum" className={optionClass}>
                  Suspender líquidos (Jejum)
                </option>
                <option value="restricao" className={optionClass}>
                  Restringir a 50% do basal
                </option>
              </select>
            </div>
          </div>
          {form.sroOrient === 'reposicao' && (
            <div className="animate-fade-in mt-4 relative z-10">
              <label className={labelClass}>
                Volume Estimado após evacuação (ml)
              </label>
              <input
                type="number"
                placeholder=""
                value={form.sroVolA}
                onChange={(e) => updateForm('sroVolA', e.target.value)}
                className={`${inputClass} border-medical-primary/50 bg-black/60 font-bold`}
              />
            </div>
          )}
        </div>

        {/* 2. SUPLEMENTAÇÃO */}
        <div className="space-y-3">
          {/* ZINCO */}
          <div className="bg-emerald-900/10 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <ShieldCheck size={18} />
              </div>
              <input
                type="checkbox"
                checked={form.zincCheck}
                onChange={(e) => updateForm('zincCheck', e.target.checked)}
                className="w-5 h-5 rounded accent-emerald-500 bg-black/50 border-white/20"
              />
              <span className="font-bold text-white text-sm">
                Suplementação de Zinco
              </span>
            </label>
            {form.zincCheck && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in pl-12">
                <div>
                  <label className={labelClass}>Dose (mg)</label>
                  <input
                    type="number"
                    value={form.zincDose}
                    onChange={(e) => updateForm('zincDose', e.target.value)}
                    className={`${inputClass} border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Dias</label>
                  <input
                    type="number"
                    value={form.zincDays}
                    onChange={(e) => updateForm('zincDays', e.target.value)}
                    className={`${inputClass} border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* PROBIÓTICO */}
          <div className="bg-amber-900/10 p-4 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Sprout size={18} />
              </div>
              <input
                type="checkbox"
                checked={form.probCheck}
                onChange={(e) => updateForm('probCheck', e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 bg-black/50 border-white/20"
              />
              <span className="font-bold text-white text-sm">Probiótico</span>
            </label>
            {form.probCheck && (
              <div className="animate-fade-in pl-12">
                <label className={labelClass}>Cepa Comercial</label>
                <select
                  value={form.probStrain}
                  onChange={(e) => updateForm('probStrain', e.target.value)}
                  className={`${inputClass} border-amber-500/30 focus:border-amber-500 focus:ring-amber-500`}
                >
                  <option value="0" className={optionClass}>
                    Selecione...
                  </option>
                  <option value="reuteri" className={optionClass}>
                    L. reuteri (Colikids / BioGaia)
                  </option>
                  <option value="boulardii" className={optionClass}>
                    S. boulardii (Floratil / Repoflor)
                  </option>
                  <option value="rhamnosus" className={optionClass}>
                    L. rhamnosus GG (Culturelle)
                  </option>
                  <option value="clausii" className={optionClass}>
                    B. clausii (Enterogermina)
                  </option>
                  <option value="kombucha" className={optionClass}>
                    Kombucha Artesanal
                  </option>
                  <option value="yakult" className={optionClass}>
                    Leite Fermentado (Yakult)
                  </option>
                  <option value="kefir" className={optionClass}>
                    Kefir de Leite
                  </option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
