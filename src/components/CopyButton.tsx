import React, { useState } from 'react';
import './CopyButton.css';

interface CopyButtonProps {
  label: string;
  value: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ label, value }) => {
  const [copiado, setCopiado] = useState(false);

  if (!value || !value.trim()) return null;

  const valorMaiusculo = value.toUpperCase();

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valorMaiusculo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch (e) {
      console.error('Falha ao copiar para a área de transferência.', e);
    }
  };

  return (
    <button type="button" className="copy-button" onClick={copiar} title={`Copiar ${label}`}>
      <span className="copy-button__label">{label}</span>
      <span className="copy-button__value">{valorMaiusculo}</span>
      <span className="copy-button__icon">{copiado ? '✓' : '📋'}</span>
    </button>
  );
};

export default CopyButton;
