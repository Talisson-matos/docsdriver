import React from 'react';
import './MainTextarea.css';

interface MainTextareaProps {
  value: string;
  onChange: (valor: string) => void;
  open: boolean;
  onToggleOpen: () => void;
}

const MainTextarea: React.FC<MainTextareaProps> = ({ value, onChange, open, onToggleOpen }) => {
  return (
    <div className="main-textarea">
      {open && (
        <div className="main-textarea__wrap">
          <textarea
            className="main-textarea__field"
            placeholder="Cole ou digite aqui as informações gerais..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
      <button type="button" className="main-textarea__collapse-bar" onClick={onToggleOpen}>
        {open ? '▲ Ocultar quadro de informações' : '▼ Mostrar quadro de informações'}
      </button>
    </div>
  );
};

export default MainTextarea;
