import MarSearch from './MarSearch'

export default async function MarPage(props) {
  const searchParams = await props.searchParams
  return <MarSearch searchParams={searchParams} />
}
