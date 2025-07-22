'use client'
import { PageBlock } from '@/components/UI'
import Link from 'next/link'
import logo404 from '@/public/logo404.png'
import { HeaderWrapper } from '@/app/LandingUI'

export default function PageErreur({ codeErreur }) {
  return (
    <PageBlock>
      <HeaderWrapper
        image={{
          src: logo404,
          alt: 'logo maison avec déperdition thermique',
        }}
      >
        <h1>Oups, cette page est mal isolée !</h1>
        <p>
          Il semblerait qu'un pont thermique se soit glissé dans notre maison…
          (Erreur {codeErreur})
        </p>
        <p> Résultat : cette page s'est évaporée dans la nature !</p>
        <p> Ce que vous pouvez faire :</p>
        <ul
          css={`
            li {
              margin: 0.2rem 0;
            }
          `}
        >
          <li>
            <Link href="/">Retourner sur la page d'accueil</Link> avant que trop
            d'énergie ne se perde.
          </li>
          <li>
            <Link href="/contact">Contactez-nous</Link>. Un artisan du code vous
            viendra en aide.
          </li>
        </ul>
        <br />
        <p>
          💡 En attendant, pensez à bien calfeutrer vos fenêtres et à passer au
          double vitrage, c'est toujours une bonne idée !
        </p>
      </HeaderWrapper>
    </PageBlock>
  )
}
