import { DensityChart } from '@/components/densityGraph/DensityChart'
import { useState } from 'react'
import { keyPrice } from './Couts'

const trimestres = [1, 2, 3]
export default function FilterableChart({ data }) {
  const [trimestre, setTrimestre] = useState(3)
  return (
    <div>
      <DensityChart
        width={'300'}
        height={'250'}
        data={data
          .filter((el) => el.trimestre === trimestre)
          .map((el) => el[keyPrice])}
      />
      <div>
        {trimestres.map((i) => (
          <label>
            <input
              type="radio"
              value={i}
              checked={trimestre === i}
              onChange={(e) => setTrimestre(e.target.value)}
            />
            {i}
          </label>
        ))}
      </div>
    </div>
  )
}
