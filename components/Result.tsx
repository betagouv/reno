import css from '@/components/css/convertToJs'
export default function Result({ value, currentQuestion }) {
  return (
    <div
      style={css`
        padding: 1rem;
        width: 12rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow:
          rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
          rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
          rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
      `}
    >
      <strong>{value}</strong>
      <div>Estimation {currentQuestion ? '' : ' finale'}&nbsp;</div>
    </div>
  )
}
