import React from 'react';
import { CTeData, DocsData, MDFeData } from '../types';
import Field from './Field';
import FormSection from './FormSection';
import QuickCopyButton from './QuickCopyButton';
import './DocsTab.css';

interface DocsTabProps {
  data: DocsData;
  onChange: (novo: DocsData) => void;
  cte: CTeData;
  mdfe: MDFeData;
}

const DocsTab: React.FC<DocsTabProps> = ({ data, onChange, cte, mdfe }) => {
  const set = <K extends keyof DocsData>(campo: K, valor: DocsData[K]) => {
    onChange({ ...data, [campo]: valor });
  };

  const motorista = cte.motorista;
  const numeroCTe = data.numeroCTe;
  const numeroManifesto = mdfe.numeroManifesto;

  const linhas = [
    { tipo: 'CTe', numero: numeroCTe },
    { tipo: 'MDFe', numero: numeroManifesto },
    { tipo: 'CTRB', numero: numeroCTe },
    { tipo: 'VALE PEDÁGIO', numero: numeroCTe },
    { tipo: 'GNRE', numero: numeroCTe },
  ];

  const camposCopiaveis = linhas
    .filter((l) => motorista && l.numero)
    .map((l) => ({
      label: l.tipo,
      value: `(${l.tipo} ${l.numero}) • ${motorista}`,
    }));

  const solicitacaoAdiantamento = `Solicitação Adiantamento: CTe Nº ${numeroCTe} | Motorista: ${motorista} | Operação: .`;

  return (
    <div className="tab-content">
      <FormSection open={data.formOpen} onToggle={() => set('formOpen', !data.formOpen)} campos={camposCopiaveis}>
        <Field
          label="Número Manifesto (repetido da aba MDFe)"
          value={numeroManifesto}
          readOnly
          placeholder="Preencha na aba MDFe"
        />
        <Field label="Nº CTe" value={numeroCTe} onChange={(v) => set('numeroCTe', v)} />
      </FormSection>

      {(!motorista || !numeroCTe) && (
        <p className="tab-content__hint">
          Preencha o Motorista na aba CTe e o Nº CTe acima para gerar os botões de cópia acima.
        </p>
      )}

      <div className="tab-content__block-title">Mensagens Rápidas</div>
      <div className="docs-tab__quick-buttons">
        {motorista && numeroCTe && (
          <QuickCopyButton label="Solicitação Adiantamento" value={solicitacaoAdiantamento} />
        )}
        <QuickCopyButton label="💰 Adiantamento Realizado" value="💰 : Adiantamento Realizado." />
        <QuickCopyButton label="⚠️ Pagamento Pendente" value="⚠️ : Pagamento Pendente." />
        <QuickCopyButton label="📈 Planilha Atualizada" value="📈 : Planilha Atualizada." />
      </div>
    </div>
  );
};

export default DocsTab;
