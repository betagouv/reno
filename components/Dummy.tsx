//import React from 'react'
// a dummy component used to test the export of our simulator to a Web component
import Link from 'next/link'

import useSetSearchParams from '@/components/useSetSearchParams'
import styled from 'styled-components'
import { useSearchParams } from './useSearchParams.webcomponents'

export default function Dummy({ name }) {
  const setSearchParams = useSetSearchParams()
  const searchParams = useSearchParams()
  const { page, q1, q2 } = searchParams
  return (
    <section style={{ border: '2px solid blue', width: '400px' }}>
      <h1
        onClick={() => {
          document.querySelector('body').style = 'background: chartreuse'
        }}
      >
        Simulateuru
      </h1>
      {page}
      {!page && (
        <Link href={setSearchParams({ page: 'simulation' }, 'url')}>
          Estimer mes aides
        </Link>
      )}

      {page === 'simulation' && (
        <div>
          Première question{' '}
          <button onClick={() => setSearchParams({ q1: 'ok' })}>OK</button>
        </div>
      )}
      {q1 === 'ok' && (
        <div>
          Deuxième question{' '}
          <button onClick={() => setSearchParams({ q2: 'ok' })}>OK</button>
        </div>
      )}
      {q2 === 'ok' && (
        <div>
          Éligibilité
          <div>1 milliard</div>
        </div>
      )}
    </section>
  )
}

const Wrapper = styled.section`
  border: 2px solid blue;
`
