import React from 'react';
import { CTeData, XmlState } from '../types';
import Field from './Field';
import FormSection from './FormSection';
import XmlSection from './XmlSection';

interface CTeTabProps {
  data: CTeData;
  onChange: (novo: CTeData) => void;
  xml: XmlState;
  onXmlChange: (novo: XmlState) => void;
}

const CTeTab: React.FC<CTeTabProps> = ({ data, onChange, xml, onXmlChange }) => {
  const set = <K extends keyof CTeData>(campo: K, valor: CTeData[K]) => {
    onChange({ ...data, [campo]: valor });
  };

  return (
    <div className="tab-content">
      <FormSection
        open={data.formOpen}
        onToggle={() => set('formOpen', !data.formOpen)}
        campos={[
          { label: 'Motorista', value: data.motorista },
          { label: 'Cavalo', value: data.cavalo },
          { label: 'Reboque', value: data.reboque },
          { label: 'Segundo Reboque', value: data.segundoReboque },
          { label: 'Dolly', value: data.dolly },
          { label: 'Número do Pedido', value: data.numeroPedido },
          { label: 'Frete', value: data.frete },
          { label: 'Observações', value: data.observacoes },
        ]}
      >
        <Field label="Motorista" value={data.motorista} onChange={(v) => set('motorista', v)} />
        <Field label="Cavalo" value={data.cavalo} onChange={(v) => set('cavalo', v)} />
        <Field label="Reboque" value={data.reboque} onChange={(v) => set('reboque', v)} />
        <Field label="Segundo Reboque" value={data.segundoReboque} onChange={(v) => set('segundoReboque', v)} />
        <Field label="Dolly" value={data.dolly} onChange={(v) => set('dolly', v)} />
        <Field label="Número do Pedido" value={data.numeroPedido} onChange={(v) => set('numeroPedido', v)} />
        <Field label="Frete" value={data.frete} onChange={(v) => set('frete', v)} />
        <Field label="Observações" value={data.observacoes} onChange={(v) => set('observacoes', v)} textarea />
      </FormSection>

      <div className="tab-content__block-title">Notas Fiscais (XML)</div>
      <XmlSection xml={xml} onChange={onXmlChange} />
    </div>
  );
};

export default CTeTab;
