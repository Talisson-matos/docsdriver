import React from 'react';
import { useAppState } from './utils/storage';
import { CTeData, CTRBData, DadosXmlExtraidos, DocsData, MDFeData, SMData, TabId, XmlState } from './types';
import MainTextarea from './components/MainTextarea';
import NotaFiscalImport from './components/NotaFiscalImport';
import LimparNumero from './components/LimparNumero';
import TabsNav from './components/TabsNav';
import CTeTab from './components/CTeTab';
import MDFeTab from './components/MDFeTab';
import CTRBTab from './components/CTRBTab';
import SMTab from './components/SMTab';
import DocsTab from './components/DocsTab';
import ClearAllButton from './components/ClearAllButton';
import './App.css';

const App: React.FC = () => {
  const [state, setState, limparTudo] = useAppState();

  const setMainText = (mainText: string) => setState((prev) => ({ ...prev, mainText }));
  const setMainTextOpen = (mainTextOpen: boolean) => setState((prev) => ({ ...prev, mainTextOpen }));
  const setActiveTab = (activeTab: TabId) => setState((prev) => ({ ...prev, activeTab }));
  const setCte = (cte: CTeData) => setState((prev) => ({ ...prev, cte }));
  const setMdfe = (mdfe: MDFeData) => setState((prev) => ({ ...prev, mdfe }));
  const setCtrb = (ctrb: CTRBData) => setState((prev) => ({ ...prev, ctrb }));
  const setSm = (sm: SMData) => setState((prev) => ({ ...prev, sm }));
  const setDocs = (docs: DocsData) => setState((prev) => ({ ...prev, docs }));
  const setXml = (xml: XmlState) => setState((prev) => ({ ...prev, xml }));

  // Recebe um XML já extraído pela importação via API e adiciona à lista da aba CTe.
  const handleXmlImportado = (dados: DadosXmlExtraidos) => {
    setState((prev) => ({
      ...prev,
      xml: { ...prev.xml, items: [...prev.xml.items, dados], formOpen: true },
      activeTab: 'CTe',
    }));
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Painel de Operações</h1>
        <span className="app__subtitle">CTe · MDFe · CTRB · SM · Docs</span>
      </header>

      <main className="app__main">
        <LimparNumero />

        <NotaFiscalImport onXmlImportado={handleXmlImportado} />

        <MainTextarea
          value={state.mainText}
          onChange={setMainText}
          open={state.mainTextOpen}
          onToggleOpen={() => setMainTextOpen(!state.mainTextOpen)}
        />

        <TabsNav activeTab={state.activeTab} onChange={setActiveTab} />

        {state.activeTab === 'CTe' && (
          <CTeTab data={state.cte} onChange={setCte} xml={state.xml} onXmlChange={setXml} />
        )}
        {state.activeTab === 'MDFe' && (
          <MDFeTab data={state.mdfe} onChange={setMdfe} cavaloCTe={state.cte.cavalo} />
        )}
        {state.activeTab === 'CTRB' && <CTRBTab data={state.ctrb} onChange={setCtrb} />}
        {state.activeTab === 'SM' && (
          <SMTab data={state.sm} onChange={setSm} cte={state.cte} mdfe={state.mdfe} xml={state.xml} />
        )}
        {state.activeTab === 'Docs' && (
          <DocsTab data={state.docs} onChange={setDocs} cte={state.cte} mdfe={state.mdfe} />
        )}

        <ClearAllButton onClear={limparTudo} />
      </main>
    </div>
  );
};

export default App;
