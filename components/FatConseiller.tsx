import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import conseillerIcon from '@/public/conseiller.png'
import Image from 'next/image'
import FatConseillerCTA from './FatConseillerCTA'
import { CTAWrapper } from './UI'
import { FatConseillerWrapper } from './FatConseillerUI'

export default function FatConseiller({ situation, margin, titre, texte }) {
  return (
    <FatConseillerWrapper $margin={margin}>
      <h3>{titre}</h3>
      <div dangerouslySetInnerHTML={{ __html: texte }} />
      <details>
        <summary>
          <div>
            <Image
              src={conseillerIcon}
              alt="illustration espace conseiller France Rénov'"
            />
            <div>
              <h3>
                Contacter votre conseiller <span>France&nbsp;Rénov'</span>
              </h3>
              <ul>
                {' '}
                {[
                  'Service indépendant, neutre et gratuit !',
                  'Conseils personnalisés pour votre projet',
                ].map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <CTAWrapper
                $justify="center"
                style={{
                  marginBottom: '0',
                }}
              >
                <FatConseillerCTA />
              </CTAWrapper>
            </div>
          </div>
        </summary>
        <section>
          <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
        </section>
      </details>
    </FatConseillerWrapper>
  )
}
