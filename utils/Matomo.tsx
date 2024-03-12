import Script from 'next/script'

const MATOMO_URL = 'https://stats.beta.gouv.fr'
const MATOMO_SITE_ID = 101

export default function Matomo() {
  return (
    <Script id="matomo" strategy="afterInteractive">
      {`
var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="${MATOMO_URL}";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
`}
    </Script>
  )
}
