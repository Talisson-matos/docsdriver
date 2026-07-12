import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Evita bloqueio de CORS em desenvolvimento: o servidor do Vite repassa
      // a chamada para a API do ConsultaDANFE por trás dos panos (server-to-server,
      // sem CORS envolvido). Em produção (build estático) isso não existe mais —
      // veja o aviso no README sobre a necessidade de um proxy/servidor também em produção.
      '/consultadanfe-api': {
        target: 'https://consultadanfe.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/consultadanfe-api/, ''),
        configure: (proxy) => {
          // Alguns provedores bloqueiam (403) requisições que não parecem vir de um
          // navegador real (sem Origin/Referer/User-Agent "normais"). Preenchemos esses
          // headers manualmente para o proxy se comportar como uma chamada feita a
          // partir do próprio site da consultadanfe.com.
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://consultadanfe.com');
            proxyReq.setHeader('Referer', 'https://consultadanfe.com/api');
            proxyReq.setHeader(
              'User-Agent',
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            );
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Accept-Language', 'pt-BR,pt;q=0.9');
          });
        },
      },
    },
  },
})
