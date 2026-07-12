import React from 'react';
import { CTRBData } from '../types';
import Field from './Field';
import FormSection from './FormSection';

interface CTRBTabProps {
  data: CTRBData;
  onChange: (novo: CTRBData) => void;
}

const CTRBTab: React.FC<CTRBTabProps> = ({ data, onChange }) => {
  const set = <K extends keyof CTRBData>(campo: K, valor: CTRBData[K]) => {
    onChange({ ...data, [campo]: valor });
  };

  return (
    <div className="tab-content">
      <FormSection
        open={data.formOpen}
        onToggle={() => set('formOpen', !data.formOpen)}
        campos={[
          { label: 'Liberação', value: data.liberacao },
          { label: 'Conta Bancária', value: data.contaBancaria },
          { label: 'Frete Terceiro', value: data.freteTerceiro },
        ]}
      >
        <Field label="Liberação" value={data.liberacao} onChange={(v) => set('liberacao', v)} />
        <Field label="Conta Bancária" value={data.contaBancaria} onChange={(v) => set('contaBancaria', v)} />
        <Field label="Frete Terceiro" value={data.freteTerceiro} onChange={(v) => set('freteTerceiro', v)} />
      </FormSection>
    </div>
  );
};

export default CTRBTab;
