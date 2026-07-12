export type TabId = 'CTe' | 'MDFe' | 'CTRB' | 'SM' | 'Docs';

export interface CTeData {
  motorista: string;
  cavalo: string;
  reboque: string;
  segundoReboque: string;
  dolly: string;
  numeroPedido: string;
  frete: string;
  observacoes: string;
  formOpen: boolean;
}

export interface MDFeData {
  docAntt: string;
  numeroManifesto: string;
  eixos: string;
  rota: string;
  formOpen: boolean;
}

export interface CTRBData {
  liberacao: string;
  contaBancaria: string;
  freteTerceiro: string;
  formOpen: boolean;
}

export interface SMData {
  previsaoInicio: string;
  previsaoTermino: string;
  formOpen: boolean;
}

export interface DocsData {
  numeroCTe: string;
  formOpen: boolean;
}

export interface DadosXmlExtraidos {
  id: string;
  cnpj_pagador_frete: string;
  cnpj_remetente: string;
  cnpj_destinatario: string;
  cnpj_terminal_coleta?: string;
  cnpj_terminal_entrega?: string;
  serie: string;
  numero_nota: string;
  data_nota: string;
  chave_acesso: string;
  nome_produto: string;
  quantidade: string;
  peso_liquido: string;
  peso_bruto: string;
  valor_nota: string;
}

export interface XmlState {
  uploaderCount: number;
  items: DadosXmlExtraidos[];
  formOpen: boolean;
}

export interface AppState {
  mainText: string;
  mainTextOpen: boolean;
  activeTab: TabId;
  cte: CTeData;
  mdfe: MDFeData;
  ctrb: CTRBData;
  sm: SMData;
  docs: DocsData;
  xml: XmlState;
}

export const CAMPO_LABELS: Record<string, string> = {
  cnpj_pagador_frete: 'CNPJ/CPF Pagador do Frete',
  cnpj_remetente: 'CNPJ/CPF Remetente',
  cnpj_destinatario: 'CNPJ/CPF Destinatário',
  cnpj_terminal_coleta: 'CNPJ/CPF Terminal de Coleta',
  cnpj_terminal_entrega: 'CNPJ/CPF Terminal de Entrega',
  serie: 'Série',
  numero_nota: 'Número da Nota',
  data_nota: 'Data da Nota',
  chave_acesso: 'Chave de Acesso',
  nome_produto: 'Nome do Produto',
  quantidade: 'Quantidade',
  peso_liquido: 'Peso Líquido',
  peso_bruto: 'Peso Bruto',
  valor_nota: 'Valor da Nota',
};

// Order in which extracted fields are displayed for each XML result.
export const CAMPO_ORDEM: (keyof DadosXmlExtraidos)[] = [
  'cnpj_pagador_frete',
  'cnpj_remetente',
  'cnpj_destinatario',
  'cnpj_terminal_coleta',
  'cnpj_terminal_entrega',
  'serie',
  'numero_nota',
  'data_nota',
  'chave_acesso',
  'nome_produto',
  'quantidade',
  'peso_liquido',
  'peso_bruto',
  'valor_nota',
];

export function criarEstadoInicial(): AppState {
  return {
    mainText: '',
    mainTextOpen: true,
    activeTab: 'CTe',
    cte: {
      motorista: '',
      cavalo: '',
      reboque: '',
      segundoReboque: '',
      dolly: '',
      numeroPedido: '',
      frete: '',
      observacoes: '',
      formOpen: true,
    },
    mdfe: {
      docAntt: '',
      numeroManifesto: '',
      eixos: '',
      rota: '',
      formOpen: true,
    },
    ctrb: {
      liberacao: '',
      contaBancaria: '',
      freteTerceiro: '',
      formOpen: true,
    },
    sm: {
      previsaoInicio: '',
      previsaoTermino: '',
      formOpen: true,
    },
    docs: {
      numeroCTe: '',
      formOpen: true,
    },
    xml: {
      uploaderCount: 1,
      items: [],
      formOpen: true,
    },
  };
}
