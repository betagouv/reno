'use client'
import rules from '@/app/règles/rules'
import { cardBorder } from '@/components/UI'
import Image from 'next/image'
import styled from 'styled-components'

export default function VisualExplanation({ compute }) {
  const aideNames = rules['aides'].somme,
    aides = aideNames.map((name) => ({ dottedName: name, ...rules[name] }))

  return (
    <Images>
      {aides.map((aide) => {
        const AideContent = () => (
          <Content
            dangerouslySetInnerHTML={{
              __html: aide.descriptionHtml,
            }}
          />
        )
        return (
          <li key={aide.dottedName}>
            <Header>
              <h3 dangerouslySetInnerHTML={{ __html: aide.titreHtml }} />
              <Image
                src={'/' + aide.illustration}
                alt={'Illustration ' + aide.titre}
                width="100"
                height="100"
              />
            </Header>
            {!compute ? (
              <AideContent />
            ) : (
              <details>
                <summary>Qu'est-ce que c'est ?</summary>
                <AideContent />
              </details>
            )}
          </li>
        )
      })}
    </Images>
  )
}
const Content = styled.div`
  height: 19rem;
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  h3 {
    margin: 0;
  }
  margin-bottom: 1rem;
`
const Images = styled.ul`
  padding-left: 0;
  margin-top: 2vh;
  margin-bottom: 2vh;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  @media (max-width: 800px) {
    justify-content: center;
  }
  align-items: center;
  li {
    margin: 0.6rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      max-width: 18rem;
      margin-bottom: 1.6rem;
    }
    ${cardBorder}
  }
  h3 {
    width: 12rem;
    font-weight: 500;
    text-align: center;
  }
  strong {
    color: #000091;
  }
  img {
    width: 6rem;
    height: auto;
  }
`
