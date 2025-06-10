//import React from 'react'
// a dummy component used to test the export of our simulator to a Web component
import Link from 'next/link'

import useSetSearchParams from '@/components/useSetSearchParams'
import styled from 'styled-components'
import { useSearchParams } from './useSearchParams.webcomponents'

export default function Dummy({ name }) {
  const setSearchParams = useSetSearchParams()
  const searchParams = useSearchParams()
  const page = searchParams.page
  return (
    <section style={{ border: '2px solid blue', width: '400px' }}>
      Simulation
      {page}
      {!page && (
        <Link href={setSearchParams({ page: 'simulation' }, 'url')}>
          Estimer mes aides
        </Link>
      )}
      {page === 'simulation' && <div>Première question</div>}
    </section>
  )
}

const Wrapper = styled.section`
  border: 2px solid blue;
`
