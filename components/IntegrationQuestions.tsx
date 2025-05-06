import styled from 'styled-components'
import { IframeCodeWrapper } from './Integration'
import { BlueEm } from '@/app/LandingUI'
import { useEffect, useState } from 'react'

export default function IntegrationQuestions({
  noScroll = null,
  setNoScroll = null,
  sendUserDataOption = null,
  setSendUserDataOption = null,
}) {
  const [dataReceived, setDataReceived] = useState(null)
  useEffect(() => {
    if (!sendUserDataOption) return

    const handleMesAidesRenoUserData = function (evt) {
      if (evt.data.kind === 'mesaidesreno-eligibility-done') {
        console.log('mesaidesreno-eligibility-done event received !')
        console.log(evt.data)
        setDataReceived(evt.data)
        // faire quelque chose avec en respectant la loi
      }
    }

    window.addEventListener('message', handleMesAidesRenoUserData)

    return () => {
      window.removeEventListener('message', handleMesAidesRenoUserData)
    }
  }, [sendUserDataOption, setDataReceived])
  return (
    <Wrapper>
      <details>
        <summary>
          Besoin d'un tutoriel pour l'intégration dans votre outil de gestion de
          contenu (Wordpress ou autre CMS) ?
        </summary>
        <div>
          <p>
            Certains outils vous permettent de coller le bloc HTML ci-dessus
            directement dans un article, et ça fonctionne.
          </p>
          <p>
            Pour d'autres, il faut intégrer un bloc spécial pour y intégrer ce
            bout de code. C'est le cas de Wordpress : ajoutez un "bloc HTML
            personnalisé" à partir de l'outil d'insertion de blocs.
          </p>
          <iframe
            width="560"
            height="315"
            css={`
              display: block;
              margin: 1rem auto;
            `}
            src="https://www.youtube.com/embed/FkmPfbuDOrA?si=e_o_FEOkOePT2iLl"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </details>
      {noScroll != null && setNoScroll && (
        <details>
          <summary>Comment cacher la barre de défilement verticale ?</summary>
          <div>
            <p>
              Si vous désirez supprimer la barre de défilement verticale, ce
              n'est pas nécessaire mais c'est possible : l'iframe prendra alors
              une hauteur dynamique en fonction de chaque page.
            </p>
            <label
              css={`
                display: flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.6rem 0;
              `}
            >
              <input
                type="checkbox"
                value={noScroll}
                onChange={() => setNoScroll(!noScroll)}
              />
              <span>Tester le redimensionnement automatique</span>
            </label>
            <p>
              Cela nécessite ce petit bout de code Javascript à ajouter de votre
              côté sur votre page hôte.
            </p>
            <IframeCodeWrapper>
              <code>{` 

<script>
    const handleHeightChange = function (evt) {
      if (evt.data.kind === 'mesaidesreno-resize-height') {
        document.querySelector('iframe#mesaidesreno').current.style.height = evt.data.value + 'px'
      }
    }

    window.addEventListener('message', handleHeightChange)
	</script>
					  `}</code>
            </IframeCodeWrapper>
          </div>
        </details>
      )}
      {sendUserDataOption != null && setSendUserDataOption && (
        <details>
          <summary>Comment récupérer les saisies de l'utilisateur ?</summary>
          <div>
            <p>
              Si vous désirez utiliser les saisies que l'utilisateur aura faites
              sur l'iframe mesaidesreno.beta.gouv.fr, lors de son arrivée sur
              l'écran d'éligibilité des aides, vous devrez 1) le justifier dans
              vos conditions d'utilisation conformément au RGPD, en expliquant à
              l'utilisateur dans quel but vous le faitent et comment peut-il
              supprimer ces données; 2) nous devons recueuillir le consentement
              de l'utilisateur avant d'envoyer ses données depuis notre domaine
              vers le votre.
            </p>
            <label
              css={`
                display: flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.6rem 0;
              `}
            >
              <input
                type="checkbox"
                value={sendUserDataOption}
                onChange={() => setSendUserDataOption(!sendUserDataOption)}
              />
              <span>Tester le renvoie de données à l'hôte</span>
            </label>
            <p>
              Deux étapes sont nécessaires : 1) activer l'option dans l'iframe
              via le paramètre d'URL<BlueEm>?sendDataToHost</BlueEm> ; 2)
              implémenter la fonction qui écoute cet événement chez vous, dont
              voici un exemple :
            </p>
            <IframeCodeWrapper>
              <code>{` 

<script>
    const handleMesAidesRenoUserData = function (evt) {
      if (evt.data.kind === 'mesaidesreno-eligibility-done') {
	  // faire quelque chose avec en respectant la loi
      }
    }

    window.addEventListener('message', handleMesAidesRenoUserData)
	</script>
					  `}</code>
            </IframeCodeWrapper>
            {dataReceived && (
              <section>
                ✅ données reçues depuis l'iframe : ouvrez la console pour les
                inspecter
              </section>
            )}
          </div>
        </details>
      )}
    </Wrapper>
  )
}
const Wrapper = styled.div`
  margin-top: 1.8rem;
  details {
    margin: 0.2rem 0;
    summary {
      margin-bottom: 0.8rem;
    }
    summary + * {
      margin-left: 1rem;
    }
  }
`
