import { createRoot } from 'react-dom/client'
import PlusValueModule from './module/PlusValue'

class DummyWebComponent extends HTMLElement {
  connectedCallback() {
    //const name = this.getAttribute('name') || 'World'

    // Create a ShadowDOM
    const dom = this.attachShadow({ mode: 'open' })

    // Create a mount element
    const mountPoint = document.createElement('div')

    dom.appendChild(mountPoint)

    const root = createRoot(mountPoint)
    root.render(<PlusValueModule type="module" />)
  }
}

customElements.define('plusvalue', DummyWebComponent)
