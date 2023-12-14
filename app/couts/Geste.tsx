import css from '@/components/css/convertToJs'
import { DensityChart } from '@/components/densityGraph/DensityChart'
import { isValidMontant, keyPrice } from './Couts'

export default function Geste({
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
        <div>
          <DensityChart
            width={'300'}
            height={'250'}
            data={elements
              .filter((el) => isValidMontant(el[keyPrice]))
              .map((el) => el[keyPrice])}
          />
          <details>
            <summary>Voir les entrées</summary>
            <ul>
              {elements.map((el, i) => (
                <li key={i}>{el[keyPrice]}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </li>
  )
}

const format = (val) =>
  Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val)
