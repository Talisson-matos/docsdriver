import React from 'react';

interface FieldProps {
  label: string;
  value: string;
  onChange?: (valor: string) => void;
  textarea?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, textarea, readOnly, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value.toUpperCase());
  };

  return (
    <div className={`field ${readOnly ? 'field--readonly' : ''}`}>
      <label className="field__label">{label}</label>
      {textarea ? (
        <textarea
          className="field__textarea"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="field__input"
          type="text"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default Field;
