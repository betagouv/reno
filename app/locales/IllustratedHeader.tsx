import useWikidata from '@/components/wikidata/useWikidata'

export default function IllustratedHeader({ placeTitle, imageTitle, imageLink }) {
  const wikidataImage = useWikidata(imageTitle),
    wikidataImageUrl = wikidataImage?.pictureUrl

  return (
    <header
      css={`
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        margin-top: 0.6rem;
      `}
    >
      <img
        src={imageLink ? "/logo-locale/"+imageLink : wikidataImageUrl}
        alt={`Photo emblématique du territoire ${imageTitle}`}
        css={`
          object-fit: cover;
          width: 5rem;
          border-radius: 0.6rem;
          margin-right: 1rem;
          margin-left: 0.4rem;
        `}
      />
      <h2
        css={`
          position: sticky;
          top: 0px;
          margin: 0;
        `}
      >
        {placeTitle}
      </h2>
    </header>
  )
}
