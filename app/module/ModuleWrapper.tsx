import marianne from '@/public/marianne-sans-devise.svg'
import FooterModule from '@/app/module/FooterModule'
import Image from 'next/image'

export const ModuleWrapper = ({ children, title }) => (
  <div
    css={`
      border: 2px solid var(--color);
      border-radius: 0.3rem;
      max-width: 600px;
      height: 100vh;
      padding: 1rem;
      scrollbar-color: var(--color) transparent;
      scrollbar-width: thin;
      &::-webkit-scrollbar {
        width: 3px; /* Mostly for vertical scrollbars */
        height: 0px; /* Mostly for horizontal scrollbars */
      }

      &::-webkit-scrollbar-thumb {
        /* Foreground */
        background: var(--color);
      }
      &::-webkit-scrollbar-track {
        /* Background */
        background: transparent;
      }
      @media (min-width: 400px) {
        padding: 1rem 1.6rem;
      }

      overflow: auto;
      > div {
        header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          img {
            width: 5rem;
            height: auto;
          }
        }

        h1 {
          font-size: 120%;
          line-height: 1.5rem;
          margin-bottom: 0;
        }
      }
    `}
  >
    <div>
      <header>
        <Image src={marianne} alt="Logo de la République Française" />
        <h1>{title}</h1>
      </header>
      <div className="fr-mb-5v">{children}</div>
      <FooterModule />
    </div>
  </div>
)
