import styled from 'styled-components'

export default function MapLegend() {
  return (
    <Aside>
      <p>
        <strong>Risque argile</strong>
      </p>
      <LegendItem color="red">Fort</LegendItem>
      <LegendItem color="orange">Moyen</LegendItem>
      <LegendItem color="yellow">Faible</LegendItem>
    </Aside>
  )
}

const Aside = styled.aside`
  position: absolute;
  bottom: 4.5rem;
  left: 1rem;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
`

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    background-color: ${({ color }) => color};
    margin-right: 5px;
  }
`
