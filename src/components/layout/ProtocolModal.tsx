import React, { useState } from 'react';
import { X, FileText, Stethoscope } from 'lucide-react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Definição das Abas
type TabType = 'sinais' | 'A' | 'B' | 'C';

export const ProtocolModal: React.FC<ProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<TabType>('sinais');

  if (!isOpen) return null;

  const renderTabBtn = (id: TabType, label: string, activeColor: string) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
        tab === id ? activeColor : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18181b] w-full max-w-5xl h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header com Abas */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center bg-black/40 gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {renderTabBtn(
              'sinais',
              'Sinais e Sintomas',
              'bg-blue-500 text-white'
            )}
            {renderTabBtn('A', 'Plano A', 'bg-emerald-500 text-white')}
            {renderTabBtn('B', 'Plano B', 'bg-medical-warning text-black')}
            {renderTabBtn('C', 'Plano C', 'bg-medical-danger text-white')}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Conteúdo da Imagem */}
        <div className="flex-1 overflow-auto p-4 bg-[#09090b] flex justify-center items-start">
          <div className="max-w-4xl w-full">
            {tab === 'sinais' && (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4 sticky top-0 bg-[#09090b]/90 py-2 backdrop-blur-md">
                  Avaliação do Estado de Hidratação
                </h3>

                {/* IMAGEM REAL: Certifique-se que o arquivo 'sinais.png' está na pasta public */}
                <img
                  src="/sinais.png"
                  alt="Quadro de Sinais e Sintomas"
                  className="w-full h-auto rounded-lg shadow-lg border border-white/10"
                  onError={(e) => {
                    // Fallback caso a imagem não exista
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />

                {/* Placeholder caso a imagem falhe */}
                <div className="hidden aspect-[16/9] w-full bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 border-dashed text-gray-500 p-8">
                  <Stethoscope size={48} className="mb-2 opacity-50" />
                  <p className="font-bold">Imagem não encontrada</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Salve o arquivo como <code>public/sinais.png</code>
                  </p>
                </div>
              </div>
            )}

            {tab === 'A' && (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 sticky top-0 bg-[#09090b]/90 py-2 backdrop-blur-md">
                  Plano A - Tratamento Domiciliar
                </h3>

                <img
                  src="/plano_a.png"
                  alt="Fluxograma Plano A"
                  className="w-full h-auto rounded-lg shadow-lg border border-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />

                <div className="hidden aspect-[3/4] w-full bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 border-dashed text-gray-500">
                  <FileText size={48} className="mb-2 opacity-50" />
                  <p>Imagem não encontrada</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Salve como <code>public/plano_a.png</code>
                  </p>
                </div>
              </div>
            )}

            {tab === 'B' && (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 sticky top-0 bg-[#09090b]/90 py-2 backdrop-blur-md">
                  Plano B - TRO no Serviço de Saúde
                </h3>

                <img
                  src="/plano_b.png"
                  alt="Fluxograma Plano B"
                  className="w-full h-auto rounded-lg shadow-lg border border-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />

                <div className="hidden aspect-[3/4] w-full bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 border-dashed text-gray-500">
                  <FileText size={48} className="mb-2 opacity-50" />
                  <p>Imagem não encontrada</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Salve como <code>public/plano_b.png</code>
                  </p>
                </div>
              </div>
            )}

            {tab === 'C' && (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-red-400 mb-4 sticky top-0 bg-[#09090b]/90 py-2 backdrop-blur-md">
                  Plano C - Hidratação Venosa
                </h3>

                <img
                  src="/plano_c.png"
                  alt="Fluxograma Plano C"
                  className="w-full h-auto rounded-lg shadow-lg border border-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />

                <div className="hidden aspect-[3/4] w-full bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 border-dashed text-gray-500">
                  <FileText size={48} className="mb-2 opacity-50" />
                  <p>Imagem não encontrada</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Salve como <code>public/plano_c.png</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Close Button (Bottom) */}
        <button
          onClick={onClose}
          className="md:hidden w-full py-4 bg-white/10 text-white font-bold border-t border-white/10 safe-area-bottom"
        >
          Fechar Protocolo
        </button>
      </div>
    </div>
  );
};
