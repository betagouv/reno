import styled from 'styled-components'

export default function MapLegend() {
  return (
    <Aside>
      <p>
        <strong>Risque argile</strong>
      </p>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        `}
      >
        <div
          css={`
            width: 20px;
            height: 20px;
            background-color: red;
            margin-right: 5px;
          `}
        ></div>
        <span>Fort</span>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        `}
      >
        <div
          css={`
            width: 20px;
            height: 20px;
            background-color: orange;
            margin-right: 5px;
          `}
        ></div>
        <span>Moyen</span>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={`
            width: 20px;
            height: 20px;
            background-color: yellow;
            margin-right: 5px;
          `}
        ></div>
        <span>Faible</span>
      </div>
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
