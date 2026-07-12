import React, { useState } from 'react';
import './QuickCopyButton.css';

interface QuickCopyButtonProps {
  label: string;
  value: string;
}

const QuickCopyButton: React.FC<QuickCopyButtonProps> = ({ label, value }) => {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch (e) {
      console.error('Falha ao copiar para a área de transferência.', e);
    }
  };

  return (
    <button type="button" className="quick-copy-button" onClick={copiar} title={value}>
      <span>{label}</span>
      <span className="quick-copy-button__icon">{copiado ? '✓' : '📋'}</span>
    </button>
  );
};

export default QuickCopyButton;
