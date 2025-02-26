'use client'
import { Main, Section } from '@/components/UI'
import Link from 'next/link'
import Image from 'next/image'
import logo404 from '@/public/logo404.png'

export default function PageErreur() {
  return (
    <Main>
      <Section>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
          `}
        >
          <div>
            <h1>Oups, cette page est mal isolée !</h1>
            <p>
              Il semblerait qu'un pont thermique se soit glissé dans notre
              maison… Résultat : cette page s'est évaporée dans la nature !
            </p>
            <p> Ce que vous pouvez faire :</p>
            <ul
              css={`
                li {
                  margin: 0.2rem 0;
                }
              `}
            >
              <li>
                <Link href="/">Retourner sur la page d'accueil</Link> avant que
                trop d'énergie ne se perde.
              </li>
              <li>
                <Link href="/contact">Contacter l'artisan</Link> pour lui
                expliquer votre problème
              </li>
            </ul>
            <br />
            <p>
              💡 En attendant, pensez à bien calfeutrer vos fenêtres et à passer
              au double vitrage, c'est toujours une bonne idée !
            </p>
          </div>
          <div>
            <Image src={logo404} />
          </div>
        </div>
      </Section>
    </Main>
  )
}
