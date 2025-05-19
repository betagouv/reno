import styled from 'styled-components'
import DPELabel from './DPELabel'

const spec = {
  etiquette_dpe: { label: '' },
  numero_dpe: { label: 'n°' },
  numero_etage_appartement: { label: 'etage' },
  type_batiment: { label: '', title: 'maison ou appartement' },
  complement_adresse_batiment: { label: 'cmplt' },
}

export default function DpeList({ dpes, startOpen = true }) {
  console.log('plop', startOpen)
  if (!dpes) return

  const etageKey = 'numero_etage_appartement'

  console.log(
    'cyan',
    dpes.map(
      (el) =>
        el[etageKey] +
        ' ' +
        el['type_batiment'] +
        ' | ' +
        el['complement_adresse_logement'],
    ),
    dpes,
  )

  return (
    <details open={startOpen ? 'true' : ''}>
      <summary>Ouvrir la liste des DPE</summary>
      <Wrapper>
        <ol>
          {dpes.map((dpe) => (
            <li key={dpe['numero_dpe']}>
              <ol>
                {Object.entries(spec).map(([k, { label, title }]) => (
                  <li key={k} title={title}>
                    <small>{label}</small>
                    {k === 'etiquette_dpe' ? (
                      <DPELabel label={dpe[k]} />
                    ) : dpe[k] === 'appartement' ? (
                      'appt'
                    ) : (
                      dpe[k]
                    )}
                  </li>
                ))}
              </ol>
              <button
                css={`
                  position: absolute;
                  right: 0;
                  bottom: 0;
                `}
                onClick={() => console.log(dpe)}
              >
                <small>log</small>
              </button>
            </li>
          ))}
        </ol>
      </Wrapper>
    </details>
  )
}

const Wrapper = styled.section`
  ol {
    list-style-type: none;
    padding: 0;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    max-height: 24rem;
    overflow-y: scroll;
  }
  > ol > li {
    margin: 0.3rem 0 0.7rem;
    width: 16rem;
    padding: 0.4rem 0.4rem;
    position: relative;
    li {
      small {
        margin-right: 0.4rem;
        color: gray;
      }
    }
    > ol {
      justify-content: start;
    }
    border: 1px solid lightgray;
  }
`
