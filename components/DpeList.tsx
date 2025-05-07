import styled from 'styled-components'

export default function DpeList({ dpes }) {
  if (!dpes) return
  return (
    <Wrapper>
      <ol>
        {dpes.map((dpe) => (
          <li key={dpe['N°DPE']}>
            <ol>
              {[
                'N°DPE',
                'N°_étage_appartement',
                'Etiquette_DPE',
                'Type_bâtiment',
                "Complément_d'adresse_logement",
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
  }
  > ol > li {
    margin: 0.3rem 0 0.7rem;
  }
  small {
    margin-right: 0.4rem;
    color: gray;
  }
`
