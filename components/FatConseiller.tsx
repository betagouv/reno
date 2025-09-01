import conseillerIcon from '@/public/conseiller.png'
import Image from 'next/image'
import { FatConseillerWrapper } from './FatConseillerUI'
import BlocConseiller from './BlocConseiller'

export default function FatConseiller({ margin, titre, texte }) {
  return (
    <>
      <h3>{titre}</h3>
      <div dangerouslySetInnerHTML={{ __html: texte }} />
      <FatConseillerWrapper $margin={margin}>
        <Image
          src={conseillerIcon}
          alt="illustration Espace conseil France Rénov'"
        />
        <div>
          <h3>
            Contacter votre conseiller <span>France&nbsp;Rénov'</span>
          </h3>
          <ul>
            <li>Service indépendant, neutre et gratuit !</li>
            <li>Conseils personnalisés pour votre projet</li>
          </ul>
          <BlocConseiller />
        </div>
      </FatConseillerWrapper>
    </>
  )
}
