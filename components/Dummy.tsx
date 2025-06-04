//import React from 'react'
// a dummy component used to test the export of our simulator to a Web component
import Link from 'next/link'

import useSetSearchParams from './useSetSearchParams'

export default function Dummy({ name }) {
  //const setSearchParams = useSetSearchParams()
  return (
    <div>
      salut {name}
      <Link href="/plop">plop</Link>
    </div>
  )
}
