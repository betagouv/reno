'use client'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function HorizontalImages({ images }) {
  return (
    <Container>
      {images.map(({ src, alt }) => (
        <img key={src} src={src} alt={alt} />
      ))}
    </Container>
  )
}
