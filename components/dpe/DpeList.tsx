import styled from 'styled-components'

export default function DpeList({ dpes }) {
  if (!dpes) return
  return (
    <Wrapper>
      <ol>
        {dpes.slice(0, 6).map((dpe) => (
          <li key={dpe['N°DPE']}>
            <ol>
              {[
                'numero_dpe',
                'numero_etage_appartement',
                'etiquette_dpe',
                'type_batiment',
                'complement_adresse_batiment',
              ].map((k) => (
                <li key={k}>
                  <small>{k}</small>
                  {dpe[k]}
                </li>
              ))}
            </ol>
            <button onClick={() => console.log(dpe)}>log</button>
          </li>
        ))}
      </ol>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  ol {
    list-style-type: none;
    padding: 0;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  > ol > li {
    margin: 0.3rem 0 0.7rem;
    width: 16rem;
  }
  small {
    margin-right: 0.4rem;
    color: gray;
  }
`
