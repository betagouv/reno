'use client'
import { useState } from 'react'
import APIDemoRest from './APIDemoRest'
import { TabHeader, TabHeaders, TabPanel, Tabs } from '@/components/UI'

export default function APIDemo({type}) {
  const [method, setMethod] = useState('POST');

  return (
    <>
      <Tabs>
        <TabHeaders
          css={`border: 1px solid #ddd;border-top: 0px;background: white;`}
          role="tablist" 
          aria-label="Démonstrations des API"
        >
          <TabHeader role="presentation">
            <button
              id="tabpanel-post"
              tabIndex={method === 'POST' ? 0 : -1}
              role="tab"
              aria-selected={method === 'POST'}
              aria-controls="tabpanel-post"
              onClick={() => setMethod('POST')}
            >
              Méthode POST
            </button>
          </TabHeader>
          <TabHeader role="presentation">
            <button
              id="tabpanel-get"
              tabIndex={method === 'GET' ? 0 : -1}
              role="tab"
              aria-selected={method === 'GET'}
              aria-controls="tabpanel-get"
              onClick={() => setMethod('GET')}
            >
              Méthode GET
            </button>
          </TabHeader>
        </TabHeaders>
        <TabPanel
          id={`tabpanel-${method}`}
          role="tabpanel"
          aria-labelledby="tabpanel-${method}"
        >
          <APIDemoRest {...{type, method}} />
        </TabPanel>
      </Tabs>
    </>
  )
}
