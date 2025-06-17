import styled from 'styled-components'

export default function NotFound() {
  return (
    <Section>
      <p>
        Nous n'avons pas trouvé d'espace Conseil France Rénov' local pour la
        commune saisie.
      </p>
      <p>
        👉️ Vous pouvez contacter nos téléconseillers pour vous aider dans votre
        démarche :
      </p>
      <Tel>
        <a href="tel:0808800700" title="Contactez-nous par téléphone">
          0 808 800 700
        </a>
        <small>
          <Triangle />
          Service gratuit <br />+ prix appel
        </small>
      </Tel>
      <p>
        <strong>Du lundi au vendredi de 9h à 18h (heure métropolitaine)</strong>
        .
      </p>
    </Section>
  )
}

const Section = styled.section`
  max-width: 30rem;
  margin: 2rem auto 0;
  strong {
    color: var(--color);
  }
`

const Tel = styled.div`
  border: 2px solid #5e5f68;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.6rem;
  margin-bottom: 1.4rem;
  width: 23rem;
  a {
    color: inherit;
  }
  small {
    margin-right: 1rem;
    background: #5e5f68;
    color: white;
    height: 3.6rem;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    position: relative;
  }
`

const Triangle = styled.div`
  position: absolute;
  left: -5px;
  top: 25px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
  transform: rotate(90deg);
`
