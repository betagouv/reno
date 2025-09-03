import { Component, Prop, h } from '@stencil/core'
import Dummy from './components/Dummy'

@Component({
  tag: 'my-test',
  //styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() name: string

  render() {
    return <Dummy name={this.name} />
  }
}
