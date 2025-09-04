import getAppUrl from '@/components/getAppUrl'
import styled from 'styled-components'

export default function DemoIframeRGA() {
  return (
    <section>
      <h1>Démo iframe RGA</h1>
      <iframe
        src={getAppUrl() + '/rga'}
        width="700px"
        height="600px"
        style={{ margin: '2vh auto', display: 'block' }}
      />
    </section>
  )
}
