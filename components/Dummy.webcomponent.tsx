import React from 'react';
import ReactDOM from 'react-dom';
import Dummy from './Dummy';

class DummyWebComponent extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'World';
    ReactDOM.render(<Dummy name={name} />, this);
  }
}

customElements.define('dummy-webcomponent', DummyWebComponent);
