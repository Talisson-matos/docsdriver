import React, { useState } from 'react';
import { CAMPO_LABELS, CAMPO_ORDEM, DadosXmlExtraidos, XmlState } from '../types';
import { formatarNumeroPtBr, parseNumeroPtBr } from '../utils/format';
import XmlUploaderSlot from './XmlUploaderSlot';
import CopyButton from './CopyButton';
import './XmlSection.css';

interface XmlSectionProps {
  xml: XmlState;
  onChange: (novo: XmlState) => void;
}

const XmlSection: React.FC<XmlSectionProps> = ({ xml, onChange }) => {
  const [itemAbertoId, setItemAbertoId] = useState<string | null>(null);

  const adicionarResultados = (novos: DadosXmlExtraidos[]) => {
    onChange({ ...xml, items: [...xml.items, ...novos] });
    if (novos.length > 0) setItemAbertoId(novos[0].id);
  };

  const removerItem = (id: string) => {
    onChange({ ...xml, items: xml.items.filter((it) => it.id !== id) });
    setItemAbertoId((atual) => (atual === id ? null : atual));
  };

  const adicionarUploader = () => {
    onChange({ ...xml, uploaderCount: xml.uploaderCount + 1 });
  };

  const alternarItem = (id: string) => {
    setItemAbertoId((atual) => (atual === id ? null : id));
  };

  const alternarFormOpen = () => {
    onChange({ ...xml, formOpen: !xml.formOpen });
  };

  const totalValor = xml.items.reduce((acc, it) => acc + parseNumeroPtBr(it.valor_nota), 0);
  const totalPesoLiquido = xml.items.reduce((acc, it) => acc + parseNumeroPtBr(it.peso_liquido), 0);
  const totalPesoBruto = xml.items.reduce((acc, it) => acc + parseNumeroPtBr(it.peso_bruto), 0);

  const itemAberto = xml.items.find((it) => it.id === itemAbertoId) || null;

  return (
    <div className="xml-section">
      {xml.formOpen && (
        <div className="xml-section__body">
          <div className="xml-section__uploaders">
            {Array.from({ length: xml.uploaderCount }).map((_, i) => (
              <XmlUploaderSlot key={i} index={i} onExtraido={adicionarResultados} />
            ))}
            <button type="button" className="xml-section__add-slot" onClick={adicionarUploader} title="Adicionar outro botão de importação">
              +
            </button>
          </div>

          {xml.items.length === 0 ? (
            <div className="xml-section__empty">Nenhum XML processado ainda.</div>
          ) : (
            <>
              <div className="xml-section__totals">
                <div className="xml-total">
                  <span className="xml-total__label">Total Valor da Nota</span>
                  <span className="xml-total__value">R$ {formatarNumeroPtBr(totalValor)}</span>
                </div>
                <div className="xml-total">
                  <span className="xml-total__label">Total Peso Líquido</span>
                  <span className="xml-total__value">{formatarNumeroPtBr(totalPesoLiquido)} kg</span>
                </div>
                <div className="xml-total">
                  <span className="xml-total__label">Total Peso Bruto</span>
                  <span className="xml-total__value">{formatarNumeroPtBr(totalPesoBruto)} kg</span>
                </div>
              </div>

              <div className="xml-section__accordion-tabs">
                {xml.items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`xml-accordion-tab ${itemAbertoId === item.id ? 'xml-accordion-tab--active' : ''}`}
                    onClick={() => alternarItem(item.id)}
                  >
                    <span>Arquivo {i + 1}</span>
                    <span
                      className="xml-accordion-tab__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removerItem(item.id);
                      }}
                      title="Remover este item"
                    >
                      ✕
                    </span>
                  </button>
                ))}
              </div>

              {itemAberto && (
                <div className="xml-result">
                  <div className="xml-result__grid">
                    {CAMPO_ORDEM.filter((campo) => itemAberto[campo]).map((campo) => (
                      <CopyButton key={campo} label={CAMPO_LABELS[campo]} value={String(itemAberto[campo])} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <button type="button" className="xml-section__collapse-bar" onClick={alternarFormOpen}>
        {xml.formOpen ? '▲ Ocultar formulário' : '▼ Mostrar formulário'}
      </button>
    </div>
  );
};

export default XmlSection;
