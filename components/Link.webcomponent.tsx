import useSetSearchParams from './useSetSearchParams.webcomponent'

const WebcoLink = ({ href, children, ...props }) => {
  const params = getSearchParamsAsObject(href)

  const setSearchParams = useSetSearchParams()

  const onClick = (e) => {
    setSearchParams(params, 'push')
    e.preventDefault()
  }
  return (
    <a href={href} {...props} onClick={onClick}>
      {children}
    </a>
  )
}

export default WebcoLink

function getSearchParamsAsObject(url) {
  // Crée un objet URL à partir de la chaîne
  const urlObj = new URL(window.location.protocol + window.location.host + url)

  // Récupère les paramètres de requête
  const searchParams = new URLSearchParams(urlObj.search)

  // Convertit les paramètres en objet
  const params = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })

  console.log('indigo', { url, params })

  return params
}
