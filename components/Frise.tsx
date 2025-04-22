import styled from 'styled-components'
import data from '@/components/frise.yaml'

export default function Frise() {
  return (
    <Container>
      <ol>
        {data.map((element) => (
          <li key={element.nom}>{element.titre || element.nom}</li>
        ))}
      </ol>
    </Container>
  )
}

const Container = styled.section`
  position: absolute;
  left: 0;
  top: 20vh;
  height: 80vh;
  width: 30vw;
`
