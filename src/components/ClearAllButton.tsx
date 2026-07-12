import React from 'react';
import './ClearAllButton.css';

interface ClearAllButtonProps {
  onClear: () => void;
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ onClear }) => {
  return (
    <div className="clear-all">
      <button type="button" className="clear-all__button" onClick={onClear}>
        🗑 Limpar Tudo
      </button>
    </div>
  );
};

export default ClearAllButton;
