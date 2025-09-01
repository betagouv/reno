'use client'
import styled from 'styled-components'
import Image from 'next/image'

export const HeaderWrapper = ({ children, image }) => {
  return (
    <div className="fr-my-7w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
      <div className="fr-py-0 fr-col-12 fr-col-md-6">{children}</div>
      <div className="fr-col-12 fr-col-md-3">
        {image.src ? (
          <Image
            src={image.src}
            alt={image.alt}
            className="fr-responsive-img"
          />
        ) : (
          image
        )}
      </div>
    </div>
  )
}
