import css from '@/components/css/convertToJs'

export const trimestres = [1, 2, 3]
export default function TrimestreSelector({ setTrimestre, trimestre }) {
  return (
    <div
      style={css`
        position: sticky;
        top: 0;
        left: 0;
        background: white;
        border: 1px solid #253b71;
        display: inline-block;
        padding: 0.1rem 0.8rem;
      `}
    >
      {trimestres.map((i) => (
        <label
          key={i}
          style={css`
            margin-right: 0.4rem;
          `}
        >
          <input
            type="radio"
            value={i}
            checked={trimestre === i}
            onChange={(e) => setTrimestre(+e.target.value)}
          />
          T{i}
        </label>
      ))}
    </div>
  )
}
