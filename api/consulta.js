// Proxy server-side para a API do ConsultaDANFE.
//
// Por que isso existe: o navegador bloqueia chamadas diretas de
// https://SEU-DOMINIO para https://consultadanfe.com por causa de CORS
// (a API não devolve os headers de Access-Control-Allow-Origin esperados
// no preflight). A solução é sempre fazer essa chamada de um servidor,
// não do navegador — este arquivo é esse servidor.
//
// Pronto para uso na Vercel: qualquer arquivo dentro da pasta /api na raiz
// do projeto vira automaticamente uma função serverless em /api/<nome>.
// Se você usa outra hospedagem (Netlify Functions, Cloudflare Workers,
// um Node/Express próprio etc.), a lógica abaixo é a mesma: receber o
// POST do front-end, repassar para a consultadanfe.com, devolver a resposta.
//
// Depois de publicado, ajuste ENDPOINT_CONSULTA em
// src/utils/consultaDanfeApi.ts (bloco de produção) para apontar pra
// "/api/consulta" em vez da URL direta da consultadanfe.com.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', message: 'Use POST.' });
    return;
  }

  try {
    const upstream = await fetch('https://consultadanfe.com/api/v1/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Alguns provedores bloqueiam (403) chamadas server-to-server que não
        // parecem vir de um navegador real. Preenchemos esses headers manualmente.
        Origin: 'https://consultadanfe.com',
        Referer: 'https://consultadanfe.com/api',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      body: JSON.stringify(req.body || {}),
    });

    const corpoTexto = await upstream.text();

    // Repassa os headers X-* documentados pela API (rate limit, error code, etc.)
    upstream.headers.forEach((valor, chave) => {
      if (chave.toLowerCase().startsWith('x-')) {
        res.setHeader(chave, valor);
      }
    });

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(corpoTexto);
  } catch (erro) {
    res.status(502).json({
      error: 'proxy_falhou',
      message: 'Não foi possível contatar a API do ConsultaDANFE a partir do servidor.',
    });
  }
}
