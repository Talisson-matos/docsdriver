// Converte um número pt-BR (vírgula decimal, sem separador de milhar vindo do XML) para float.
export function parseNumeroPtBr(valor: string | undefined): number {
  if (!valor) return 0;
  const limpo = valor.replace(/[^\d,.-]/g, '').replace(',', '.');
  const num = parseFloat(limpo);
  return isNaN(num) ? 0 : num;
}

// Formata um número para exibição no padrão pt-BR (vírgula decimal, 2 casas).
export function formatarNumeroPtBr(valor: number): string {
  return valor.toFixed(2).replace('.', ',');
}

function doisDigitos(n: number): string {
  return n.toString().padStart(2, '0');
}

// Formata uma data no padrão DD/MM/AAAA HH:MM:SS
export function formatarDataHora(data: Date): string {
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const ano = data.getFullYear();
  const hora = doisDigitos(data.getHours());
  const min = doisDigitos(data.getMinutes());
  const seg = doisDigitos(data.getSeconds());
  return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
}

// Formata apenas a data (DD/MM/AAAA), usado para a data de emissão da nota.
export function formatarData(data: Date): string {
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Calcula a previsão de início (agora + 2 horas) e término (início + 2 dias).
export function calcularPrevisoes(): { inicio: string; termino: string } {
  const agora = new Date();
  const inicio = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
  const termino = new Date(inicio.getTime() + 2 * 24 * 60 * 60 * 1000);
  return {
    inicio: formatarDataHora(inicio),
    termino: formatarDataHora(termino),
  };
}
