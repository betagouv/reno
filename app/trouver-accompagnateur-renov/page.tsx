'use client'

import { useEffect, useState } from 'react'

export default function CarteMAR() {
  const [data, setData] = useState(null)

  const codePostal = '35000',
    codeInsee = '35238'
  useEffect(() => {
    const doFetch = async () => {
      const request = await fetch(
        `/trouver-accompagnateur-renov/api?codePostal=${codePostal}&codeInsee=${codeInsee}`,
      )
      const data = await request.json()

      setData(data)
    }
    doFetch()
  }, [])

  console.log('olive', data)
  if (data) return <div>OK {data.length}</div>
  return <div>Ça télécharge</div>
}
