'use client'

import { useEffect, useState } from 'react'

export default function NPM() {
  const [data, setData] = useState()

  useEffect(() => {
    const doFetch = async () => {
      const request = await fetch('https://registry.npmjs.org/mesaidesreno')
      const json = await request.json()
      setData(json)
    }
    doFetch()
  }, [])
  return (
    <section>
      <div
        css={`
          background: linear-gradient(
            139deg,
            #fb8817,
            #ff4b01,
            #c12127,
            #e02aff
          );
          height: 1rem;
          width: 100%;
          border-top-left-radius: 0.4rem;
          border-top-right-radius: 0.4rem;
        `}
      ></div>
      <div
        css={`
          background: white;
          border: 2px solid #c12127;
          border-top: none;
          padding: 0.6rem 1rem;
          h4 {
            display: flex;
            align-items: center;
            svg {
              margin-right: 0.6rem;
            }
            margin: 0.6rem 0;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
        `}
      >
        <a href="https://www.npmjs.com/mesaidesreno">
          <h4>
            <NpmLogo />
            mesaidesreno
          </h4>
        </a>
        {data && <div>Dernière version : v{data['dist-tags'].latest}</div>}
      </div>
    </section>
  )
}

const NpmLogo = () => (
  <svg
    height="32"
    width="32"
    viewBox="0 0 700 700"
    fill="#c12127"
    aria-hidden="true"
  >
    <polygon fill="#c12127" points="0,700 700,700 700,0 0,0"></polygon>
    <polygon
      fill="#ffffff"
      points="150,550 350,550 350,250 450,250 450,550 550,550 550,150 150,150 "
    ></polygon>
  </svg>
)
