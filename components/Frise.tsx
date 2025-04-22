import styled from 'styled-components'
import data from '@/components/frise.yaml'

export default function Frise() {
  return (
    <Container>
      <Timeline>
        {data.map((element) => {
          const position = element.temporel?.signe === 'négatif' 
            ? 'left' 
            : element.temporel?.signe === 'positif' 
              ? 'right' 
              : 'center';
          
          return (
            <TimelineItem key={element.nom} $position={position}>
              <TimelineContent>
                <h3>{element.titre || element.nom}</h3>
                {element.description && <p>{element.description}</p>}
              </TimelineContent>
              <TimelineDot />
            </TimelineItem>
          );
        })}
      </Timeline>
    </Container>
  )
}

const Container = styled.section`
  position: absolute;
  left: 0;
  top: 20vh;
  height: 80vh;
  width: 30vw;
  padding: 2rem;
`

const Timeline = styled.div`
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    background-color: #e0e0e0;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
  }
`

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 2rem;
  width: 100%;
  
  &::after {
    content: '';
    clear: both;
    display: table;
  }
  
  ${props => {
    if (props.$position === 'left') {
      return `
        & > div {
          left: 0;
          text-align: right;
          padding-right: 2rem;
        }
      `;
    } else if (props.$position === 'right') {
      return `
        & > div {
          left: 50%;
          text-align: left;
          padding-left: 2rem;
        }
      `;
    } else {
      return `
        & > div {
          left: 25%;
          width: 50%;
          text-align: center;
        }
      `;
    }
  }}
`

const TimelineContent = styled.div`
  position: relative;
  width: 50%;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    white-space: pre-line;
  }
`

const TimelineDot = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #4a89dc;
  border-radius: 50%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`
