import getAppUrl from '@/components/getAppUrl'

export default function DemoIframeRGA() {
  return (
    <section>
      <h1>Démo iframe RGA</h1>
      <iframe
        src={getAppUrl() + '/rga'}
        height="600px"
        width="90%"
        style={{
          margin: '2vh auto',
          display: 'block',
          maxWidth: '1200px',
          border: '2px solid var(--lightColor)',
          borderRadius: '.6rem',
        }}
        allowFullScreen={true}
        data-fullscreen={true}
      />
    </section>
  )
}
