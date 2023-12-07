'use client'
import 'dpeges/dist/style.css'
import dpeGes from 'dpeges'
import { useEffect, useRef } from 'react'

// Voir aussi ce paquet https://github.com/aurelien-f/dpe-generator-js/tree/main

export default function Test() {
  const dpeRef = useRef(null)

  useEffect(() => {
    if (!dpeRef?.current) return
    if (dpeRef.current.innerHTML.includes('dpeGes-bars-container')) return

    dpeGes({
      containerId: 'dpe',
      dpeValue: 56,
      gesValue: 98,
      stickerHeight: 600,
    })
  }, [dpeRef])

  return (
    <div>
      <div id="dpe" ref={dpeRef} onClick={(e) => console.log(e)}></div>
    </div>
  )
}
