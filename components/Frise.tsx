import styled from 'styled-components'
import data from '@/components/frise.yaml'
import rules from '@/app/règles/rules'
import { truncateDescription } from '@/utils/stringUtils'
import { capitalise0 } from './utils'

const rulesList = Object.values(rules)
const temporalRules = rulesList.filter((el) => el && el.temporel)
console.log('cyan frise', temporalRules)

const elements = [...data, ...temporalRules]

// Composant pour un élément de la timeline
const TimelineElement = ({ element, position }) => {
  const title = element.titre || element.nom
  const description = element.description

  if (position === 'left') {
    return (
      <>
        <TimelineContent {...{ title, description }} />
        <TimelineDot />
        <div style={{ flex: 1 }}></div>
      </>
    )
  }

  if (position === 'center') {
    return (
      <>
        <div style={{ flex: 1 }}></div>
        <TimelineDot />
        <TimelineContent {...{ title, description }} />
        <div style={{ flex: 1 }}></div>
      </>
    )
  }

  // position === 'right'
  return (
    <>
      <div style={{ flex: 1 }}></div>
      <TimelineDot />
      <TimelineContent {...{ title, description }} />
    </>
  )
}

const TimelineContent = ({ title, description = '' }) => {
  const [shortDescription, rest] = truncateDescription(description, 200),
    truncated = rest != null
  return (
    <TimelineContentWrapper>
      <h3>{capitalise0(title)}</h3>
      {description !== '' &&
        (truncated ? (
          <details>
            <summary>{shortDescription}...</summary>
            {rest}
          </details>
        ) : (
          <p>{description}</p>
        ))}
    </TimelineContentWrapper>
  )
}

export default function Frise() {
  return (
    <Container>
      <Timeline>
        {elements.map((element) => {
          const position =
            element.temporel?.signe === 'négatif'
              ? 'left'
              : element.temporel?.signe === 'positif'
                ? 'right'
                : 'center'

          return (
            <TimelineItem key={element.nom}>
              <TimelineElement element={element} position={position} />
            </TimelineItem>
          )
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
  width: 40vw;
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
    background-color: #d7d7f7;
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

const TimelineContentWrapper = styled.div`
  z-index: 10;
  position: relative;
  width: 45%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);

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
