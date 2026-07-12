# Painel de Operações (CTe / MDFe / CTRB / SM)

App Vite + React + TypeScript para preenchimento rápido dos formulários de CTe, MDFe, CTRB e SM, com extração automática de dados de XML de NF-e.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## Build de produção

```bash
npm run build
npm run preview
```

## O que o app faz

- **Textarea principal**: campo grande no topo para anotações livres.
- **Abas CTe / MDFe / CTRB / SM**: cada uma com seu formulário próprio. Só uma aba fica visível por vez, mas os dados de todas ficam salvos automaticamente no `localStorage` do navegador — trocar de aba não apaga nada.
- **Maiúsculas automáticas**: tudo que é digitado nos campos de texto é convertido para MAIÚSCULO automaticamente.
- **Botões de copiar**: para cada campo preenchido, aparece um botão que copia o valor (em maiúsculo) para a área de transferência.
- **Barra de recolher**: abaixo de cada formulário há uma barrinha para esconder/mostrar o formulário e economizar espaço na tela.
- **Limpar número**: campo simples que, ao colar qualquer texto, remove tudo que não for dígito (letras, pontos, barras, traços, espaços) e copia o resultado automaticamente para a área de transferência.
- **Importar NFe / XML (integração com a API do ConsultaDANFE)**: campo único para colar a chave de acesso (44 caracteres — aceita letras e números, conforme a NT 2026.004 de chave alfanumérica; a formatação com pontos/barras/traços/espaços é limpa automaticamente). Assim que a chave chega a 44 caracteres, a importação acontece sozinha, sem precisar clicar em nada:
  - Consulta `POST https://consultadanfe.com/api/v1/consulta`.
  - Baixa o DANFE em PDF automaticamente (`pdf_base64` decodificado).
  - Se a resposta trouxer o XML (`xml_base64`), ele é decodificado e extraído automaticamente na aba CTe — some direto na sanfona de arquivos, sem precisar subir manualmente.
  - Mensagens de status (consultando / sucesso / erro) aparecem abaixo do campo.
  - Requer internet e que a chave esteja dentro da janela aceita pela API (mês atual, ou mês anterior até o dia 15). Para notas fora dessa janela, a API sugere o endpoint `/api/v1/danfe` com upload do XML — não implementado aqui, pois o app já tem upload manual de XML na aba CTe.
  - ⚠️ **Sobre bloqueio de CORS**: a `consultadanfe.com` não devolve os headers de CORS esperados no preflight, então o navegador bloqueia a chamada direta. Por isso:
    - **Em desenvolvimento** (`npm run dev`), o app já passa pela proxy configurada em `vite.config.ts` (`server.proxy`) — a chamada acontece dentro do processo do Vite, sem CORS envolvido. Não precisa fazer nada, já funciona rodando `npm run dev`.
    - **Em produção** (build estático hospedado em algum lugar), esse "servidor no meio" não existe mais. Incluí um proxy pronto em `api/consulta.js`, no formato de função serverless da Vercel (qualquer arquivo em `/api` na raiz vira uma rota automaticamente ao publicar na Vercel). Se você publicar lá, troque a URL de produção em `src/utils/consultaDanfeApi.ts` de `https://consultadanfe.com/api/v1/consulta` para `/api/consulta`. Se usar outra hospedagem (Netlify, servidor Node próprio, etc.), a lógica do arquivo é a mesma — só adaptar a "casca" da função para a plataforma escolhida.
    - **Se aparecer HTTP 403** mesmo com o proxy: o servidor da consultadanfe.com pode ter alguma proteção contra tráfego que não parece vir de um navegador de verdade (Cloudflare/WAF). Tanto o proxy de desenvolvimento (`vite.config.ts`) quanto o de produção (`api/consulta.js`) já enviam `Origin`, `Referer` e `User-Agent` imitando uma chamada feita a partir do próprio site deles, o que resolve a maioria desses bloqueios. Se ainda assim continuar dando 403 depois disso, a mensagem de erro agora mostra um trecho da resposta bruta do servidor — copie e cole pra mim que ajusto, ou reporte pra `contato@consultadanfe.com` se for um bloqueio persistente do lado deles.
- **Extração de XML (aba CTe)**: botão "Adicionar XML" (arraste e solte ou clique para escolher arquivos) extrai automaticamente do XML da NF-e:
  - CNPJ/CPF pagador do frete, remetente, destinatário, terminal de coleta/entrega
  - Série, número, data de emissão, chave de acesso, nome do(s) produto(s)
  - Quantidade, peso líquido, peso bruto, valor da nota
  - Botão **+** cria mais um botão "Adicionar XML" para organizar importações em lote.
  - Totais automáticos de Valor da Nota, Peso Líquido e Peso Bruto somando todos os XMLs importados.
- **Campos espelhados**: Cavalo (MDFe) e Motorista/Cavalo/Reboque/2º Reboque/Dolly (SM) repetem automaticamente o que foi preenchido na aba CTe.
- **Aba SM**:
  - Botão "Gerar Previsão" calcula Previsão de Início (agora + 2 horas) e Previsão de Término (início + 2 dias), no formato `DD/MM/AAAA HH:MM:SS`.
  - Peso é somado automaticamente a partir dos XMLs importados na aba CTe.
  - Série e Número são preenchidos automaticamente com os dados do primeiro XML importado.
- **Limpar Tudo**: botão no final da página que apaga todas as informações (com confirmação) e reinicia o app.

## Observações sobre suposições feitas

- A "Previsão de Início/Término" não é recalculada sozinha o tempo todo (isso mudaria a cada segundo); ela é gerada quando você clica no botão "Gerar Previsão", usando a data/hora exata daquele momento.
- Quando uma NF-e tem mais de um produto, o campo "Nome do Produto" junta os nomes únicos separados por "; ".
- Peso Líquido e Peso Bruto são lidos de campos separados do XML (`pesoL` e `pesoB`); se um dos dois não existir, o outro é usado como substituto.
