import { useState } from 'react'
import MapLegend from './MapLegend'

export default function MapBlock({ mapContainerRef }) {
  const [fullscreenMap, setFullscreenMap] = useState(false)
  return (
    <section
      css={`
        position: relative;
        max-width: ${fullscreenMap ? '95%' : '36rem'};
        border-radius: 0.3rem;
        height: 100%;

        margin-top: 1rem;
        > button {
          position: absolute;
          top: 0.4rem;
          left: 0.4rem;
          background: white;
          height: 1.8rem;
          border-radius: 5px;
          > img {
            width: 1.2rem;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}
    >
      <div
        ref={mapContainerRef}
        css={`
          width: 100%;
          min-height: 500px;
          height: 100%;
        `}
      />
      <button
        onClick={() => setFullscreenMap((fullscreenMap) => !fullscreenMap)}
      >
        <img
          src={
            fullscreenMap ? '/fullscreen-line.svg' : '/fullscreen-exit-line.svg'
          }
          width="10"
          height="10"
          alt="Icône plein écran"
        />
      </button>
      <MapLegend />
    </section>
  )
}
