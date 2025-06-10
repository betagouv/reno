import React from 'react'
import { createRoot } from 'react-dom/client'
import Dummy from './Dummy'
import { StyleSheetManager } from 'styled-components'
import '@/app/globals.css'

class DummyWebComponent extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'World'

    // Create a ShadowDOM
    const dom = this.attachShadow({ mode: 'closed' })

    // create a slot where we will attach the StyleSheetManager

    const styleSlot = document.createElement('section')

    // append the styleSlot inside the shadow

    dom.appendChild(styleSlot)

    // Create a mount element
    const mountPoint = document.createElement('div')

    styleSlot.appendChild(mountPoint)

    const root = createRoot(mountPoint)
    root.render(
      <StyleSheetManager target={styleSlot}>
        <Dummy name={name} />
      </StyleSheetManager>,
    )
  }
}

customElements.define('dummy-webcomponent', DummyWebComponent)
