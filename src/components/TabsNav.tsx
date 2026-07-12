import React from 'react';
import { TabId } from '../types';
import './TabsNav.css';

interface TabsNavProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const ABAS: TabId[] = ['CTe', 'MDFe', 'CTRB', 'SM', 'Docs'];

const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onChange }) => {
  return (
    <div className="tabs-nav">
      {ABAS.map((aba) => (
        <button
          key={aba}
          type="button"
          className={`tabs-nav__button ${activeTab === aba ? 'tabs-nav__button--active' : ''}`}
          onClick={() => onChange(aba)}
        >
          {aba}
        </button>
      ))}
    </div>
  );
};

export default TabsNav;
