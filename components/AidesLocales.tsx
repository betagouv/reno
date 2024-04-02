export default function AidesLocales() {
  return (
    <section
      css={`
        margin-top: 4vh;
        > p {
          margin-bottom: 1vh;
        }
      `}
    >
      <h3>Les autres aides à la rénovation</h3>
      <p>
        Cette liste est non exhaustive et les montants ne sont pas encore
        validés.
      </p>
      <ol
        css={`
          list-style-type: none;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          li {
            margin: 1rem;
          }
        `}
      >
        {autresAides.map((aide) => (
          <li key={aide.nom}>
            <div
              css={`
                border: 1px solid var(--color);
                width: 14rem;
                height: 16rem;
                padding: 0.2rem 1rem;
                p {
                  margin-bottom: 0.8rem 0;
                  line-height: 1.3rem;
                  small {
                  }
                }
                h4 {
                }
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              `}
            >
              <h4>{aide.nom}</h4>
              <p>
                <small
                  dangerouslySetInnerHTML={{ __html: parse(aide.description) }}
                />
              </p>
              <CTAWrapper
                css={`
                  margin: 0 0 0.6rem 0;
                `}
              >
                <CTA $fontSize="normal" $importance="secondary">
                  <Link href={aide.lien}>En savoir plus</Link>
                </CTA>
              </CTAWrapper>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
