'use client'
import styled from 'styled-components'
import MpaIcon from '@/public/mpa.svg'
import MpgIcon from '@/public/mpg.svg'
import Image from 'next/image'
import rules from '@/app/règles/rules'
import { cardBorder } from '@/components/UI'

export default function VisualExplanation() {
  return (
    <Images>
      <li>
        <Header>
          <h3>
            Ma Prime Rénov' <strong>accompagnée</strong>
          </h3>
          <Image
            src={MpaIcon}
            alt="Illustration du parcours Ma Prime Rénov' accompagnée"
          />
        </Header>
        <Content
          dangerouslySetInnerHTML={{
            __html: rules['MPR . accompagnée'].descriptionHtml,
          }}
        />
      </li>
      <li>
        <Header>
          <h3>
            Ma Prime Rénov' <strong>par&nbsp;geste</strong>
          </h3>
          <Image
            src={MpgIcon}
            alt="Illustration du parcours Ma Prime Rénov' par gestes"
          />
        </Header>
        <Content
          dangerouslySetInnerHTML={{
            __html: rules['MPR . non accompagnée'].descriptionHtml,
          }}
        />
      </li>
    </Images>
  )
}
const Content = styled.div`
  height: 18rem;
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
  justify-content: space-between;
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
      max-width: 20rem;
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
