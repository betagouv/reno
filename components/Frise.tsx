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
            <TimelineItem key={element.nom}>
              {position === 'left' && (
                <>
                  <TimelineContent>
                    <h3>{element.titre || element.nom}</h3>
                    {element.description && <p>{element.description}</p>}
                  </TimelineContent>
                  <TimelineDot />
                  <div style={{ flex: 1 }}></div>
                </>
              )}
              
              {position === 'center' && (
                <>
                  <div style={{ flex: 1 }}></div>
                  <TimelineDot />
                  <TimelineContent style={{ textAlign: 'center' }}>
                    <h3>{element.titre || element.nom}</h3>
                    {element.description && <p>{element.description}</p>}
                  </TimelineContent>
                  <div style={{ flex: 1 }}></div>
                </>
              )}
              
              {position === 'right' && (
                <>
                  <div style={{ flex: 1 }}></div>
                  <TimelineDot />
                  <TimelineContent>
                    <h3>{element.titre || element.nom}</h3>
                    {element.description && <p>{element.description}</p>}
                  </TimelineContent>
                </>
              )}
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
  margin-bottom: 3rem;
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 50px;
  
  &::after {
    content: '';
    clear: both;
    display: table;
  }
`

const TimelineContent = styled.div`
  position: relative;
  width: 45%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
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
  width: 20px;
  height: 20px;
  background-color: #4a89dc;
  border-radius: 50%;
  z-index: 1;
  margin: 0 10px;
  flex-shrink: 0;
`
