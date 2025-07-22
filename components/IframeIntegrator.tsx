'use client'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import getAppUrl from '@/components/getAppUrl'
import useIsInIframe from '@/components/useIsInIframe'

export default function IframeIntegrator({ iframeUrl }) {
  const isInIframe = useIsInIframe()
  const iframeCode = `
        <iframe src="${getAppUrl() + iframeUrl}" style="width: 720px; height: 800px;  margin: 3rem auto; display: block; border: .2rem solid black; border-radius: 1rem;"></iframe>`
  return (
    !isInIframe && (
      <>
        <h3 className="fr-mt-5v">Intégrer ce simulateur à votre site</h3>
        <p>
          Voici <strong>le code à intégrer</strong> dans votre HTML ou votre
          contenu Wordpress :
        </p>

        <Highlight>
          <code
            css={`
              word-break: break-all;
            `}
          >
            {iframeCode}
          </code>
        </Highlight>
        <h3>Le résultat</h3>
        <div
          css={`
            text-align: center;
            background: radial-gradient(
              circle,
              rgba(0, 0, 145, 0.2) 0%,
              rgba(0, 212, 255, 0) 60%,
              rgba(0, 212, 255, 0) 100%
            );
          `}
          dangerouslySetInnerHTML={{ __html: iframeCode }}
        ></div>
      </>
    )
  )
}
