import React, { useEffect, useRef, useState } from 'react';
import { consultarPorChave } from '../utils/consultaDanfeApi';
import { base64ParaBlob, base64ParaTexto, baixarBlob } from '../utils/base64';
import { extrairDadosXml } from '../utils/xmlParser';
import { DadosXmlExtraidos } from '../types';
import './NotaFiscalImport.css';

interface NotaFiscalImportProps {
  onXmlImportado: (dados: DadosXmlExtraidos) => void;
}

function sanitizarChave(valor: string): string {
  // Remove pontos, barras, traços e espaços, mas mantém letras e números
  // (a chave de acesso pode ser alfanumérica desde a NT 2026.004).
  return valor.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

type StatusImportacao = 'idle' | 'carregando' | 'sucesso' | 'erro';

const NotaFiscalImport: React.FC<NotaFiscalImportProps> = ({ onXmlImportado }) => {
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<StatusImportacao>('idle');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const ultimaChaveProcessadaRef = useRef<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limpo = sanitizarChave(e.target.value);
    setValor(limpo);
    if (limpo.length < 44) {
      setStatus('idle');
      setMensagem(null);
    }
  };

  useEffect(() => {
    const importarAutomaticamente = async () => {
      if (valor.length !== 44) return;
      if (ultimaChaveProcessadaRef.current === valor) return;
      ultimaChaveProcessadaRef.current = valor;

      setStatus('carregando');
      setMensagem('Consultando a NF-e...');

      try {
        const resposta = await consultarPorChave(valor);

        // Baixa o DANFE em PDF automaticamente.
        if (resposta.pdf_base64) {
          const blobPdf = base64ParaBlob(resposta.pdf_base64, 'application/pdf');
          baixarBlob(blobPdf, `${resposta.chave || valor}.pdf`);
        }

        // Se o XML vier junto, extrai automaticamente na aba CTe.
        if (resposta.xml_base64) {
          const textoXml = base64ParaTexto(resposta.xml_base64);
          const arquivo = new File([textoXml], `${resposta.chave || valor}.xml`, { type: 'text/xml' });
          const dados = await extrairDadosXml(arquivo);
          onXmlImportado(dados);
          setMensagem('PDF baixado e XML extraído automaticamente na aba CTe.');
        } else {
          setMensagem('PDF baixado. Esta consulta não retornou o XML da nota.');
        }

        setStatus('sucesso');
      } catch (e) {
        setStatus('erro');
        setMensagem(e instanceof Error ? e.message : 'Erro ao importar esta chave.');
      }
    };

    importarAutomaticamente();
  }, [valor, onXmlImportado]);

  return (
    <div className="nf-import">
      <label className="nf-import__label">Importar NFe / XML (cole a chave de 44 caracteres)</label>
      <div className="nf-import__row">
        <input
          className="nf-import__input"
          type="text"
          value={valor}
          onChange={handleChange}
          placeholder="Cole aqui a chave de acesso da NF-e..."
          maxLength={44}
        />
        <span className={`nf-import__contador ${valor.length === 44 ? 'nf-import__contador--ok' : ''}`}>
          {valor.length}/44
        </span>
      </div>

      {status === 'carregando' && <div className="nf-import__msg nf-import__msg--carregando">⏳ {mensagem}</div>}
      {status === 'sucesso' && <div className="nf-import__msg nf-import__msg--sucesso">✓ {mensagem}</div>}
      {status === 'erro' && <div className="nf-import__msg nf-import__msg--erro">⚠ {mensagem}</div>}
    </div>
  );
};

export default NotaFiscalImport;
