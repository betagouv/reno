'use client'
import styled from 'styled-components'
import MpaIcon from '@/public/mpa.svg'
import MpgIcon from '@/public/mpg.svg'
import Image from 'next/image'
import rules from '@/app/règles/rules'

export default function VisualExplanation() {
  return (
    <Images>
      <li>
        <h3>
          Ma Prime Rénov' <strong>accompagnée</strong>
        </h3>
        <Image
          src={MpaIcon}
          alt="Illustration du parcours Ma Prime Rénov' accompagnée"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: rules['MPR . accompagnée'].descriptionHtml,
          }}
        />
      </li>
      <li>
        <h3>
          Ma Prime Rénov' <strong>par geste</strong>
        </h3>
        <Image
          src={MpgIcon}
          alt="Illustration du parcours Ma Prime Rénov' par gestes"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: rules['MPR . non accompagnée'].descriptionHtml,
          }}
        />
      </li>
    </Images>
  )
}

const Images = styled.ul`
  padding-left: 0;
  margin-top: 3vh;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      max-width: 20rem;
      margin-bottom: 1.6rem;
    }
    > div {
      height: 18rem;
    }
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
    margin-bottom: 1rem;
  }
`
