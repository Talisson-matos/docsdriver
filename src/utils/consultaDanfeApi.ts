export interface ConsultaDanfeResposta {
  status: string;
  chave: string;
  tipo: string;
  pdf_base64: string;
  xml_base64?: string;
  recovery?: boolean;
  info?: string;
}

interface ConsultaDanfeErro {
  error?: string;
  message?: string;
}

// Em desenvolvimento (npm run dev), passamos pelo proxy configurado em vite.config.ts
// (server.proxy) para evitar o bloqueio de CORS do navegador — a chamada real acontece
// servidor-a-servidor dentro do próprio processo do Vite, então não existe preflight.
//
// Em produção (build estático), não existe mais esse servidor "no meio", então uma
// chamada direta do navegador para https://consultadanfe.com pode ser bloqueada por CORS
// dependendo da configuração do lado deles. Se isso acontecer no seu ambiente de produção,
// será necessário publicar um pequeno proxy (uma função serverless, por exemplo) que faça
// essa chamada por você e a sirva no mesmo domínio do app. Veja o README para um exemplo.
const ENDPOINT_CONSULTA = import.meta.env.DEV
  ? '/consultadanfe-api/consulta'
  : 'https://consultadanfe.com/api/v1/consulta';

// Consulta uma NF-e pela chave de acesso (44 caracteres) e retorna PDF + XML em base64.
// Doc: https://consultadanfe.com/api#endpoints
export async function consultarPorChave(chave: string): Promise<ConsultaDanfeResposta> {
  let resp: Response;
  try {
    resp = await fetch(ENDPOINT_CONSULTA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chave }),
    });
  } catch (e) {
    throw new Error(
      'Não foi possível conectar à API do ConsultaDANFE (rede ou bloqueio de CORS). ' +
        'Em produção isso costuma exigir um proxy server-side — veja o README.'
    );
  }

  if (!resp.ok) {
    const codigoErro = resp.headers.get('X-Error-Code');

    if (resp.status === 429) {
      const retryAfter = resp.headers.get('Retry-After');
      throw new Error(
        retryAfter
          ? `Limite de consultas atingido. Tente novamente em ${retryAfter}s.`
          : 'Limite de consultas atingido. Tente novamente em instantes.'
      );
    }

    let mensagem = `Falha na consulta (HTTP ${resp.status})`;
    const corpoTexto = await resp.text();
    try {
      const corpo = JSON.parse(corpoTexto) as ConsultaDanfeErro;
      if (corpo?.message) {
        mensagem = corpo.message;
      } else if (corpo?.error) {
        mensagem = corpo.error;
      }
    } catch {
      // Corpo não era JSON (ex: página de bloqueio de um firewall/WAF). Mostra um
      // trecho bruto pra ajudar a diagnosticar em vez de esconder a informação.
      if (corpoTexto) {
        mensagem += `: ${corpoTexto.slice(0, 200).replace(/\s+/g, ' ').trim()}`;
      }
    }

    if (codigoErro && !mensagem.includes(codigoErro)) {
      mensagem += ` (${codigoErro})`;
    }

    throw new Error(mensagem);
  }

  const dados = (await resp.json()) as ConsultaDanfeResposta;

  if (dados.status !== 'ok') {
    throw new Error(dados.info || `Resposta inesperada da API: status "${dados.status}".`);
  }

  return dados;
}
