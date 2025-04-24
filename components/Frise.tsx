import styled from 'styled-components'
import data from '@/components/frise.yaml'
import rules from '@/app/règles/rules'
import { truncateDescription } from '@/utils/stringUtils'
import { capitalise0 } from './utils'

const temporalRules = Object.entries(rules)
  .filter(([, el]) => el && el.temporel)
  .map(([dottedName, rule]) => ({ ...rule, dottedName }))

const elements = [
  ...data.map((el) => ({ ...el, dottedName: el.nom })),
  ...temporalRules,
]
console.log(
  'cyan frise',
  elements.map((el) => el.dottedName),
)

// Fonction pour vérifier si un élément dépend d'un autre (directement ou indirectement)
const dependsOn = (element, dependency, visited = new Set()) => {
  // Éviter les boucles infinies
  if (visited.has(element.dottedName)) return false
  visited.add(element.dottedName)

  const deps = element.temporel?.dépendances || []

  // Dépendance directe
  if (deps.includes(dependency.dottedName)) return true

  // Dépendance indirecte (transitive)
  return deps.some((depName) => {
    const depElement = elements.find((el) => el.dottedName === depName)
    return depElement && dependsOn(depElement, dependency, visited)
  })
}

const sorted = [...elements].sort((a, b) => {
  // Si A dépend de B, A doit venir après B
  if (dependsOn(a, b)) return 1

  // Si B dépend de A, B doit venir après A
  if (dependsOn(b, a)) return -1

  // Sinon, pas de relation de dépendance
  return 0
})

console.log(
  'cyan frise sorted',
  sorted.map((el) => [el.dottedName, el.temporel?.dépendances?.join(' | ')]),
)

// Composant pour un élément de la timeline
const TimelineElement = ({ element, position }) => {
  const title = element.titre || element.nom
  const description = element.description

  if (position === 'left') {
    return (
      <div>
        <TimelineContent {...{ title, description }} />
        <TimelineDot $position={position} />
        <div style={{ flex: 1 }}></div>
      </div>
    )
  }

  if (position === 'center') {
    return (
      <div>
        <div style={{ flex: 1 }}></div>
        <TimelineDot $position={position} />
        <TimelineContent {...{ title, description }} />
        <div style={{ flex: 1 }}></div>
      </div>
    )
  }

  // position === 'right'
  return (
    <div>
      <div style={{ flex: 1 }}></div>
      <TimelineDot $position={position} />
      <TimelineContent {...{ title, description }} />
    </div>
  )
}

const TimelineContent = ({ title, description = '' }) => {
  const [shortDescription, rest] = truncateDescription(description, 120),
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
        {sorted.map((element) => {
          const position =
            element.temporel?.signe === 'négatif'
              ? 'left'
              : element.temporel?.signe === 'positif'
                ? 'right'
                : 'center'

          return (
            <TimelineItem key={element.dottedName}>
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
  > div {
    display: flex;
    align-items: center;
    min-height: 50px;
    position: relative;
  }

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
  width: 1.3rem;
  height: 1.3rem;
  background-color: ${(p) =>
    p.$position === 'center'
      ? 'var(--color)'
      : p.$position === 'left'
        ? 'orange'
        : 'green'};
  border-radius: 50%;
  z-index: 1;
  margin: 0 10px;
  flex-shrink: 0;
  ${(p) =>
    p.$position === 'center' &&
    ` 
  position: absolute;
  top: -2rem;
  left: calc(50% - 1.3rem);
  z-index: 20
  `}
`
