import { useEffect, useState } from 'react'
import getCityData, {
  extractFileName,
  getThumb,
} from '@/components/wikidata/fetchWikidata'

export default function useWikidata(placeTitle) {
  const [wikidata, setWikidata] = useState(null)
  useEffect(() => {
    if (!placeTitle) return
    getCityData(placeTitle, false).then((json) => {
      const firstResult = json?.results?.bindings[0],
        wikimediaUrl = firstResult?.pic?.value

      if (!wikimediaUrl) return
      const pictureName = extractFileName(decodeURI(wikimediaUrl))
      const pictureUrl = getThumb(pictureName, 500)
      setWikidata({ pictureName, pictureUrl })
    })
  }, [placeTitle])

  return wikidata
}
