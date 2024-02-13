export default function Input({ situation, onChange, value, rule, engine }) {
  const list = rule['une possibilité parmi'].possibilités

  return list.map((element, index) => {
    return (
      <label
        key={element}
        css={`
          cursor: pointer;
          width: 14rem;
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
        `}
      >
        <input
          css={`
            width: 1.4rem;
            height: 1.4rem;
            cursor: pointer;
            margin-right: 0.4rem;
          `}
          type="radio"
          name={element}
          value={element}
          checked={element === value}
          onChange={() => onChange(element)}
        />
        {element}
      </label>
    )
  })
}
