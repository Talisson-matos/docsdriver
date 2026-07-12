import React, { useState } from 'react';
import './LimparNumero.css';

function sanitizarSomenteNumeros(valor: string): string {
  // Remove tudo que não for dígito: letras, pontos, barras, traços, espaços etc.
  return valor.replace(/\D/g, '');
}

const LimparNumero: React.FC = () => {
  const [valor, setValor] = useState('');
  const [copiado, setCopiado] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const limpo = sanitizarSomenteNumeros(e.target.value);
    setValor(limpo);
    if (limpo) {
      try {
        await navigator.clipboard.writeText(limpo);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1500);
        setValor('');
      } catch (err) {
        console.error('Falha ao copiar automaticamente.', err);
        setValor('');
      }
    }
  };

  return (
    <div className="limpar-numero">
      <label className="limpar-numero__label">Limpar número (só dígitos, copia automático)</label>
      <div className="limpar-numero__row">
        <input
          className="limpar-numero__input"
          type="text"
          value={valor}
          onChange={handleChange}
          placeholder="Cole aqui qualquer número com pontos, barras, traços..."
        />
        {copiado && <span className="limpar-numero__copied">✓ copiado</span>}
      </div>
    </div>
  );
};

export default LimparNumero;
