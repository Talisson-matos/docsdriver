import React, { useCallback, useRef, useState } from 'react';
import { extrairDadosXml } from '../utils/xmlParser';
import { DadosXmlExtraidos } from '../types';

interface XmlUploaderSlotProps {
  index: number;
  onExtraido: (dados: DadosXmlExtraidos[]) => void;
}

const XmlUploaderSlot: React.FC<XmlUploaderSlotProps> = ({ index, onExtraido }) => {
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processarArquivos = useCallback(
    async (fileList: FileList | File[]) => {
      const arquivosXml = Array.from(fileList).filter(
        (f) => f.type === 'text/xml' || f.name.toLowerCase().endsWith('.xml')
      );

      if (arquivosXml.length === 0) {
        alert('Selecione arquivos XML válidos.');
        return;
      }

      setCarregando(true);
      try {
        const resultados = await Promise.all(arquivosXml.map(extrairDadosXml));
        onExtraido(resultados);
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Erro ao processar arquivos XML.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    },
    [onExtraido]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processarArquivos(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processarArquivos(e.target.files);
    e.target.value = '';
  };

  return (
    <div
      className="xml-uploader-slot"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <span className="xml-uploader-slot__icon">📎</span>
      <span className="xml-uploader-slot__text">
        {carregando ? 'Processando...' : `Adicionar XML ${index > 0 ? `#${index + 1}` : ''}`}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".xml"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default XmlUploaderSlot;
