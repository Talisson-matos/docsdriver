import { DadosXmlExtraidos } from '../types';
import { formatarData } from './format';

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getCnpjOrCpf(node: Element | null): string {
  const cpf = node?.querySelector('CPF')?.textContent;
  const cnpj = node?.querySelector('CNPJ')?.textContent;
  return cpf || cnpj || 'Não encontrado';
}

function formatarDataEmissao(xmlDoc: Document): string {
  const dhEmi = xmlDoc.querySelector('ide dhEmi')?.textContent;
  const dEmi = xmlDoc.querySelector('ide dEmi')?.textContent;
  const bruto = dhEmi || dEmi;
  if (!bruto) return 'Não encontrado';
  const data = new Date(bruto);
  if (isNaN(data.getTime())) return 'Não encontrado';
  return formatarData(data);
}

function extrairNomeProduto(xmlDoc: Document): string {
  const nomes = Array.from(xmlDoc.querySelectorAll('det prod xProd'))
    .map((el) => el.textContent?.trim())
    .filter((v): v is string => !!v);
  const unicos = Array.from(new Set(nomes));
  return unicos.length > 0 ? unicos.join('; ') : 'Não encontrado';
}

export async function extrairDadosXml(file: File): Promise<DadosXmlExtraidos> {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');

  const erroParse = xmlDoc.querySelector('parsererror');
  if (erroParse) {
    throw new Error(`Arquivo "${file.name}" não é um XML válido.`);
  }

  const emitNode = xmlDoc.querySelector('emit');
  const destNode = xmlDoc.querySelector('dest');
  const retiradaNode = xmlDoc.querySelector('retirada');
  const entregaNode = xmlDoc.querySelector('entrega');

  const cnpjRemetente = getCnpjOrCpf(emitNode);
  const cnpjDestinatario = getCnpjOrCpf(destNode);
  const cnpjTerminalColeta = getCnpjOrCpf(retiradaNode);
  const cnpjTerminalEntrega = getCnpjOrCpf(entregaNode);

  const modFrete = xmlDoc.querySelector('transp modFrete')?.textContent || '9';
  const cnpjPagadorFrete = ['0', '4'].includes(modFrete)
    ? cnpjRemetente
    : modFrete === '1'
    ? cnpjDestinatario
    : 'Não especificado';

  const quantidade = xmlDoc.querySelector('transp vol qVol')?.textContent || 'Não encontrado';
  const pesoLiquidoBruto = xmlDoc.querySelector('transp vol pesoL')?.textContent;
  const pesoBrutoBruto = xmlDoc.querySelector('transp vol pesoB')?.textContent;
  const pesoLiquido = pesoLiquidoBruto || pesoBrutoBruto || 'Não encontrado';
  const pesoBruto = pesoBrutoBruto || pesoLiquidoBruto || 'Não encontrado';

  const dados: DadosXmlExtraidos = {
    id: gerarId(),
    cnpj_pagador_frete: cnpjPagadorFrete,
    cnpj_remetente: cnpjRemetente,
    cnpj_destinatario: cnpjDestinatario,
    ...(cnpjTerminalColeta && cnpjTerminalColeta !== 'Não encontrado'
      ? { cnpj_terminal_coleta: cnpjTerminalColeta }
      : {}),
    ...(cnpjTerminalEntrega && cnpjTerminalEntrega !== 'Não encontrado'
      ? { cnpj_terminal_entrega: cnpjTerminalEntrega }
      : {}),
    serie: xmlDoc.querySelector('ide serie')?.textContent || 'Não encontrado',
    numero_nota: xmlDoc.querySelector('ide nNF')?.textContent || 'Não encontrado',
    data_nota: formatarDataEmissao(xmlDoc),
    chave_acesso:
      xmlDoc.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', '') || 'Não encontrado',
    nome_produto: extrairNomeProduto(xmlDoc),
    quantidade: quantidade.replace('.', ','),
    peso_liquido: pesoLiquido.replace('.', ','),
    peso_bruto: pesoBruto.replace('.', ','),
    valor_nota: xmlDoc.querySelector('ICMSTot vNF')?.textContent?.replace('.', ',') ?? 'Não encontrado',
  };

  return dados;
}
