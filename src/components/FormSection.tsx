import React from 'react';
import CopyButton from './CopyButton';
import './FormSection.css';

interface CampoCopiavel {
  label: string;
  value: string;
}

interface FormSectionProps {
  open: boolean;
  onToggle: () => void;
  campos: CampoCopiavel[];
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ open, onToggle, campos, children }) => {
  const camposPreenchidos = campos.filter((c) => c.value && c.value.trim());

  return (
    <div className="form-section">
      {open && <div className="form-section__fields">{children}</div>}

      {camposPreenchidos.length > 0 && (
        <div className="form-section__copy-row">
          {camposPreenchidos.map((c) => (
            <CopyButton key={c.label} label={c.label} value={c.value} />
          ))}
        </div>
      )}

      <button type="button" className="form-section__collapse-bar" onClick={onToggle}>
        {open ? '▲ Ocultar formulário' : '▼ Mostrar formulário'}
      </button>
    </div>
  );
};

export default FormSection;
