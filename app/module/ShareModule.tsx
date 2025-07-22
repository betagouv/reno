export default function ShareModule({ titre }) {
  return (
    <div className="fr-mt-5v">
      <a
        className="fr-link fr-icon-code-s-slash-line fr-link--icon-left"
        href={`/integration?module=${encodeURIComponent('/module/' + titre)}`}
      >
        Intégrer ce widget à mon site
      </a>
    </div>
  )
}
