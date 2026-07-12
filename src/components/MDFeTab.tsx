import React from 'react';
import { MDFeData } from '../types';
import Field from './Field';
import FormSection from './FormSection';
import './MDFeTab.css';

interface MDFeTabProps {
  data: MDFeData;
  onChange: (novo: MDFeData) => void;
  cavaloCTe: string;
}

const MDFeTab: React.FC<MDFeTabProps> = ({ data, onChange, cavaloCTe }) => {
  const set = <K extends keyof MDFeData>(campo: K, valor: MDFeData[K]) => {
    onChange({ ...data, [campo]: valor });
  };

  return (
    <div className="tab-content">
      <FormSection
        open={data.formOpen}
        onToggle={() => set('formOpen', !data.formOpen)}
        campos={[
          { label: 'Doc ANTT', value: data.docAntt },
          { label: 'Nº Manifesto', value: data.numeroManifesto },
          { label: 'Cavalo', value: cavaloCTe },
          { label: 'Eixos', value: data.eixos },
          { label: 'Rota', value: data.rota },
        ]}
      >
        <Field label="Doc ANTT" value={data.docAntt} onChange={(v) => set('docAntt', v)} />
        <Field label="Nº Manifesto" value={data.numeroManifesto} onChange={(v) => set('numeroManifesto', v)} />
        <Field label="Cavalo (repetido da aba CTe)" value={cavaloCTe} readOnly placeholder="Preencha na aba CTe" />
        <Field label="Eixos" value={data.eixos} onChange={(v) => set('eixos', v)} />
        <Field label="Rota" value={data.rota} onChange={(v) => set('rota', v)} />

        <div className="field">
          <label className="field__label">&nbsp;</label>
          <button
            type="button"
            className="mdfe-tab__antt-btn"
            onClick={() =>
              window.open('https://frete-antt-production.up.railway.app/', '_blank', 'noopener,noreferrer')
            }
          >
            🚚 Consultar Frete ANTT
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default MDFeTab;
