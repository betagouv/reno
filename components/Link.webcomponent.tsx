import useSetSearchParams from './useSetSearchParams.webcomponent'

const WebcoLink = ({ href, children, ...props }) => {
  // This link component is particular : it avoids refreshing the page. It's like calling setSearchParams with the push option, but keeps the <a with its href for HTML standards, accessibility and SEO.
  // This link component, used in Webco mode, cannot change the path ! A webco is typically integrated on a source page with a path : rewriting this path would kill the webco.
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

  const path1 = urlObj.pathname,
    path2 = window.location.pathname
  if (path1 !== path2) {
    console.log(path1, path2)
    /* Maybe we should block this one day
    throw new Error(
      'The webco attempted to change the path via a <Link componnt. It should not, see doc above.',
    )
	*/
  }

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
