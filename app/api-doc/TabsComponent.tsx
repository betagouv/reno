"use client"
import React, { useState } from 'react';
import { Tabs, TabHeaders, TabHeader, TabPanel } from '@/components/UI';
import APIDemo from './APIDemo';

export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState('tabpanel-accompagne');

  return (
    <Tabs>
      <TabHeaders role="tablist" aria-label="Liste des API">
        <TabHeader role="presentation">
          <button
            id="tabpanel-accompagne"
            tabIndex={activeTab === 'tabpanel-accompagne' ? 0 : -1}
            role="tab"
            aria-selected={activeTab === 'tabpanel-accompagne'}
            aria-controls="tabpanel-accompagne"
            onClick={() => setActiveTab('tabpanel-accompagne')}
          >
            Parcours accompagné
          </button>
        </TabHeader>
        <TabHeader role="presentation">
          <button
            id="tabpanel-geste"
            tabIndex={activeTab === 'tabpanel-geste' ? 0 : -1}
            role="tab"
            aria-selected={activeTab === 'tabpanel-geste'}
            aria-controls="tabpanel-geste"
            onClick={() => setActiveTab('tabpanel-geste')}
          >
            Parcours par geste
          </button>
        </TabHeader>
        <TabHeader role="presentation">
          <button
            id="tabpanel-copro"
            tabIndex={activeTab === 'tabpanel-copro' ? 0 : -1}
            role="tab"
            aria-selected={activeTab === 'tabpanel-copro'}
            aria-controls="tabpanel-copro"
            onClick={() => setActiveTab('tabpanel-copro')}
          >
            Copropriété
          </button>
        </TabHeader>
      </TabHeaders>
      {activeTab === 'tabpanel-accompagne' && (
        <TabPanel
            id="tabpanel-accompagne"
            role="tabpanel"
            aria-labelledby="tabpanel-accompagne"
        >
            <APIDemo 
                type="mpra"
                titre="MaPrimeRénov' - Parcours accompagnée"
            />
        </TabPanel>
      )}
      {activeTab === 'tabpanel-geste' && (
        <TabPanel
            id="tabpanel-geste"
            role="tabpanel"
            aria-labelledby="tabpanel-geste"
        >
            <APIDemo
                type="mprg"
                titre="MaPrimeRénov' - Parcours geste" 
            />
        </TabPanel>
      )}
      {activeTab === 'tabpanel-copro' && (
        <TabPanel
            id="tabpanel-copro"
            role="tabpanel"
            aria-labelledby="tabpanel-copro"
            tabIndex="0"
            hidden={activeTab !== 'tabpanel-copro'}
        >
            <APIDemo
                type="copropriete"
                titre="MaPrimeRénov' - Parcours Copropriété"
            />
        </TabPanel>
      )}
    </Tabs>
  );
}
