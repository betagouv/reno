import Image from 'next/image'
import calendarIcon from '@/public/calendar.svg'
import styled from 'styled-components'

export default function PaymentTypeBlock({ children }) {
  return (
    <div
      css={`
        margin: 2vh 0;
        header {
          display: flex;
          align-items: center;
          img {
            width: 2rem;
            height: auto;
            margin-right: 0.2rem;
          }
          h4 {
            margin: 0;
            font-weight: 500;

            color: #0359bf;
          }
          margin: 0 0 0.4rem;
        }
        > div {
          width: fit-content;
          p {
            margin: 0;
          }
          border: 1px solid #c3c3dd;
          border-radius: 0.4rem;
          padding: 0.4rem 0.6rem;
          background: #dfdff1;
          ol {
            list-style-type: disc;
            li {
              margin: 0.2rem 0;
            }
          }
        }
      `}
    >
      <header>
        <Image src={calendarIcon} alt="icône calendrier de paiement" />
        <h4>Calendrier de paiement</h4>
      </header>
      <div>{children}</div>
    </div>
  )
}
export const PaymentType = styled.strong`
  color: var(--darkColor0);
  text-decoration: underline;
  text-decoration-color: var(--darkColor0);
  padding: 0rem 0.1rem;
  white-space: nowrap;
`
