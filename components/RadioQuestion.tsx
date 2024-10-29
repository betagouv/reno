export default function Input({
  situation,
  name,
  onChange,
  value,
  rule,
  engine,
}) {
  const list = rule['une possibilité parmi'].possibilités

  return list.map((element, index) => {
    const questionParams = engine.getParsedRules()[name + ' . ' + element]
    return (
      <label
        key={element}
        css={`
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
          padding: calc(0.3rem + 0.7vw) calc(0.5rem + 1vw);
          border: 2px solid #dfdff1;
          border-radius: 0.3rem;
          &:hover,
          &:has(input:checked) {
            border: 2px solid #004396;
          }
        `}
      >
        <input
          css={`
            width: 1.4rem;
            height: 1.4rem;
            cursor: pointer;
            margin-right: 0.6rem;
          `}
          type="radio"
          name={element}
          value={element}
          checked={element === value}
          onChange={() => onChange(element)}
        />
        <span>{questionParams ? questionParams.title : element}</span>
      </label>
    )
  })
}
