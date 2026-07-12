import { useEffect, useState } from 'react';
import { AppState, criarEstadoInicial } from '../types';

const STORAGE_KEY = 'logistica-app-state-v1';

function carregarEstado(): AppState {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return criarEstadoInicial();
    const salvo = JSON.parse(bruto);
    // Mescla com o estado inicial para cobrir campos novos em versões futuras.
    const inicial = criarEstadoInicial();
    return {
      ...inicial,
      ...salvo,
      cte: { ...inicial.cte, ...salvo.cte },
      mdfe: { ...inicial.mdfe, ...salvo.mdfe },
      ctrb: { ...inicial.ctrb, ...salvo.ctrb },
      sm: { ...inicial.sm, ...salvo.sm },
      docs: { ...inicial.docs, ...salvo.docs },
      xml: { ...inicial.xml, ...salvo.xml },
    };
  } catch (e) {
    console.error('Falha ao carregar estado salvo, iniciando vazio.', e);
    return criarEstadoInicial();
  }
}

export function useAppState(): [AppState, React.Dispatch<React.SetStateAction<AppState>>, () => void] {
  const [state, setState] = useState<AppState>(carregarEstado);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Falha ao salvar estado no localStorage.', e);
    }
  }, [state]);

  const limparTudo = () => {
    const confirmado = window.confirm(
      'Tem certeza que deseja limpar TODAS as informações preenchidas? Essa ação não pode ser desfeita.'
    );
    if (!confirmado) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(criarEstadoInicial());
  };

  return [state, setState, limparTudo];
}
