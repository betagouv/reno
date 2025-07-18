import styled from 'styled-components'
import { BlueEm } from '@/app/LandingUI'
import { useEffect, useState } from 'react'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'

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
            <Checkbox
              options={[
                {
                  label: 'Tester le redimensionnement automatique',
                  nativeInputProps: {
                    name: 'checkboxes-1',
                    value: noScroll,
                    onChange: () => setNoScroll(!noScroll),
                  },
                },
              ]}
            />
            <p>
              Cela nécessite ce petit bout de code Javascript à ajouter de votre
              côté sur votre page hôte.
            </p>
            <Highlight>
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
            </Highlight>
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
              l'utilisateur dans quel but vous le faites et comment peut-il
              supprimer ces données; 2) nous devons recueillir le consentement
              de l'utilisateur avant d'envoyer ses données depuis notre domaine
              vers le votre.
            </p>
            <Checkbox
              options={[
                {
                  label: "Tester le renvoie de données à l'hôte",
                  nativeInputProps: {
                    name: 'checkboxes-2',
                    value: sendUserDataOption,
                    onChange: () => setSendUserDataOption(!sendUserDataOption),
                  },
                },
              ]}
            />
            <p className="fr-mt-5v">
              Deux étapes sont nécessaires :<br /> 1) activer l'option dans
              l'iframe via le paramètre d'URL <strong>?sendDataToHost</strong> ;
              <br />
              2) implémenter la fonction qui écoute cet événement chez vous,
              dont voici un exemple :
            </p>
            <Highlight>
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
              <p>
                Voici un exemple de{' '}
                <a
                  rel="noopener external"
                  className="fr-link"
                  href="https://codesandbox.io/p/sandbox/5t55w6"
                >
                  bac à sable
                </a>{' '}
                qui capte les données.
              </p>
            </Highlight>
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
