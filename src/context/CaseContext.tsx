// src/context/CaseContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { casesDB } from '../data/cases';
import { CaseStudy } from '../types';

interface CaseContextType {
  currentCase: CaseStudy | null;
  nextCase: () => void;
  resetDeck: () => void;
  revealedVitals: string[];
  revealVital: (key: string) => void;
}

const CaseContext = createContext<CaseContextType>({} as CaseContextType);

// Hook personalizado para usar o contexto
export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext deve ser usado dentro de CaseProvider');
  }
  return context;
};

// Provider do contexto
export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Parse seguro do localStorage
  const safeParse = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Erro ao ler ${key} do localStorage:`, e);
      return fallback;
    }
  };

  // Estados
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(() =>
    safeParse('osce_currentCase', null)
  );
  const [revealedVitals, setRevealedVitals] = useState<string[]>(() =>
    safeParse('osce_revealedVitals', [])
  );

  // Ref para controlar casos disponíveis (não precisa re-renderizar)
  const availableIds = useRef<number[]>([]);

  // Função para resetar o baralho de casos
  const resetDeck = () => {
    availableIds.current = casesDB.map((c) => c.id);
  };

  // Função para carregar próximo caso
  const nextCase = () => {
    // Se acabaram os casos, reseta o baralho
    if (availableIds.current.length === 0) {
      resetDeck();
    }

    // Pega um caso aleatório
    const randomIndex = Math.floor(Math.random() * availableIds.current.length);
    const caseId = availableIds.current[randomIndex];

    // Remove o caso da lista de disponíveis
    availableIds.current.splice(randomIndex, 1);

    // Busca o caso no banco de dados
    const newCase = casesDB.find((c) => c.id === caseId);

    if (newCase) {
      setCurrentCase(newCase);
      setRevealedVitals([]); // Reseta exame físico para novo caso
      window.scrollTo(0, 0); // Volta pro topo da página
    }
  };

  // Função para revelar vital no exame físico
  const revealVital = (key: string) => {
    setRevealedVitals((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (!safePrev.includes(key)) {
        return [...safePrev, key];
      }
      return safePrev;
    });
  };

  // Persistência no localStorage
  useEffect(() => {
    if (currentCase) {
      localStorage.setItem('osce_currentCase', JSON.stringify(currentCase));
    }
    localStorage.setItem('osce_revealedVitals', JSON.stringify(revealedVitals));
  }, [currentCase, revealedVitals]);

  // Inicialização: carrega primeiro caso se não houver nenhum
  useEffect(() => {
    resetDeck(); // Inicializa o baralho

    if (!currentCase) {
      nextCase();
    } else {
      // Remove o caso atual da lista de disponíveis
      const idx = availableIds.current.indexOf(currentCase.id);
      if (idx > -1) {
        availableIds.current.splice(idx, 1);
      }
    }
  }, []);

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        nextCase,
        resetDeck,
        revealedVitals: Array.isArray(revealedVitals) ? revealedVitals : [],
        revealVital,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};
