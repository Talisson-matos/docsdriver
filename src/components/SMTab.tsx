import React from 'react';
import { CTeData, MDFeData, SMData, XmlState } from '../types';
import { calcularPrevisoes, formatarNumeroPtBr, parseNumeroPtBr } from '../utils/format';
import Field from './Field';
import FormSection from './FormSection';
import './SMTab.css';

interface SMTabProps {
  data: SMData;
  onChange: (novo: SMData) => void;
  cte: CTeData;
  mdfe: MDFeData;
  xml: XmlState;
}

const SMTab: React.FC<SMTabProps> = ({ data, onChange, cte, mdfe, xml }) => {
  const set = <K extends keyof SMData>(campo: K, valor: SMData[K]) => {
    onChange({ ...data, [campo]: valor });
  };

  const gerarPrevisoes = () => {
    const { inicio, termino } = calcularPrevisoes();
    onChange({ ...data, previsaoInicio: inicio, previsaoTermino: termino });
  };

  const pesoTotal = xml.items.reduce((acc, it) => acc + parseNumeroPtBr(it.peso_liquido), 0);
  const pesoTotalTexto = xml.items.length > 0 ? `${formatarNumeroPtBr(pesoTotal)} kg` : '';

  const valorTotal = xml.items.reduce((acc, it) => acc + parseNumeroPtBr(it.valor_nota), 0);
  const valorTotalTexto = xml.items.length > 0 ? `R$ ${formatarNumeroPtBr(valorTotal)}` : '';

  const primeiroXml = xml.items[0];
  const serie = primeiroXml?.serie || '';
  const numero = primeiroXml?.numero_nota || '';

  return (
    <div className="tab-content">
      <FormSection
        open={data.formOpen}
        onToggle={() => set('formOpen', !data.formOpen)}
        campos={[
          { label: 'Motorista', value: cte.motorista },
          { label: 'Cavalo', value: cte.cavalo },
          { label: 'Reboque', value: cte.reboque },
          { label: '2º Reboque', value: cte.segundoReboque },
          { label: 'Dolly', value: cte.dolly },
          { label: 'Previsão de Início', value: data.previsaoInicio },
          { label: 'Previsão de Término', value: data.previsaoTermino },
          { label: 'Destino', value: mdfe.rota },
          { label: 'Peso', value: pesoTotalTexto },
          { label: 'Valor', value: valorTotalTexto },
          { label: 'Série', value: serie },
          { label: 'Número', value: numero },
        ]}
      >
        <Field label="Motorista (repetido da aba CTe)" value={cte.motorista} readOnly placeholder="Preencha na aba CTe" />
        <Field label="Cavalo (repetido da aba CTe)" value={cte.cavalo} readOnly placeholder="Preencha na aba CTe" />
        <Field label="Reboque (repetido da aba CTe)" value={cte.reboque} readOnly placeholder="Preencha na aba CTe" />
        <Field label="2º Reboque (repetido da aba CTe)" value={cte.segundoReboque} readOnly placeholder="Preencha na aba CTe" />
        <Field label="Dolly (repetido da aba CTe)" value={cte.dolly} readOnly placeholder="Preencha na aba CTe" />

        <div className="field">
          <label className="field__label">Previsão de Início</label>
          <input className="field__input" type="text" value={data.previsaoInicio} readOnly placeholder="Clique em Gerar" />
        </div>
        <div className="field">
          <label className="field__label">Previsão de Término</label>
          <input className="field__input" type="text" value={data.previsaoTermino} readOnly placeholder="Clique em Gerar" />
        </div>
        <div className="field">
          <label className="field__label">&nbsp;</label>
          <button type="button" className="sm-tab__gerar-btn" onClick={gerarPrevisoes}>
            🕒 Gerar Previsão (início agora +2h / término +2 dias)
          </button>
        </div>

        <Field label="Destino (repetido da Rota, aba MDFe)" value={mdfe.rota} readOnly placeholder="Preencha a Rota na aba MDFe" />
        <Field label="Peso (somatório dos XMLs)" value={pesoTotalTexto} readOnly placeholder="Adicione XMLs na aba CTe" />
        <Field label="Valor (somatório dos XMLs)" value={valorTotalTexto} readOnly placeholder="Adicione XMLs na aba CTe" />
        <Field label="Série (do 1º XML)" value={serie} readOnly placeholder="Adicione XMLs na aba CTe" />
        <Field label="Número (do 1º XML)" value={numero} readOnly placeholder="Adicione XMLs na aba CTe" />
      </FormSection>
    </div>
  );
};

export default SMTab;
