import css from '@/components/css/convertToJs'
import { DensityChart } from '@/components/densityGraph/DensityChart'

export default function Geste({
  isPerSingleEquipement,
  isPerSurface,
  geste,
  mean,
  median,
  num,
  numValids,
  min,
  max,
  valids,
  elements,
}) {
  return (
    <li key={geste}>
      <h3>{geste}</h3>
      <div
        style={css`
          display: flex;
          align-items: center;
        `}
      >
        <div>
          {isPerSingleEquipement && (
            <div>
              Prix <strong>par équipement individuel</strong>
            </div>
          )}
          {isPerSurface && (
            <div>
              Prix <strong>par surface</strong>
            </div>
          )}
          <div>Médiane : {format(median)} €</div>
          <div>Moyenne : {format(mean)} €</div>
          <div>Max : {format(max)} €</div>
          <div>Min : {format(min)} €</div>
          <div>
            Nombre : {num} dont {numValids}{' '}
            <details>
              <summary
                style={css`
                  display: inline;
                `}
              >
                valides
              </summary>
              valides (différents de 0 ou de NA)
            </details>
          </div>
        </div>
        {valids && (
          <div>
            <DensityChart width={'300'} height={'250'} data={valids} />
            <details>
              <summary>Voir les entrées</summary>
              <ul>
                {valids.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    </li>
  )
}

export const format = (val) =>
  Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val)
