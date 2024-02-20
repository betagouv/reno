'use client'

import { useEffect, useRef, useState } from 'react'
import useAddMap from './useAddMap'

export default function CarteMAR() {
  const [data, setData] = useState(null)
  const [location, setLocation] = useState(null)
  const mapContainerRef = useRef(null)

  const codePostal = '35000',
    codeInsee = '35238'
  useEffect(() => {
    return
    const doFetch = async () => {
      const request = await fetch(
        `/trouver-accompagnateur-renov/api?codePostal=${codePostal}&codeInsee=${codeInsee}`,
      )
      const data = await request.json()

      setData(data)
    }
    doFetch()
  }, [])

  const map = useAddMap(mapContainerRef, setLocation)

  console.log('olive', data)
  return (
    <div>
      <div ref={mapContainerRef} />
    </div>
  )
}
