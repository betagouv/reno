import { parse } from 'marked'
import { utils } from 'publicodes'
import Link from 'next/link'
import { List, OrderedList, Wrapper } from './FriendlyObjectViewerUI'
import { capitalise0 } from './utils'

const FriendlyObjectViewer = ({
  data,
  level = 0,
  context,
  searchParams,
  options = { capitalise0: true, keyStyle: '', computePathname },
}) => {
  if (data == null) return null
  const capitaliseOrNot = (s) => s && (options.capitalise0 ? capitalise0(s) : s)
  if (typeof data === 'string') {
    try {
      if (!context) return <span>{capitaliseOrNot(data)}</span>
      const isRule = utils.disambiguateReference(
        context.rules,
        context.dottedName,
        data,
      )

      return (
        <Link href={options.computePathname(utils.encodeRuleName(isRule))}>
          {capitaliseOrNot(data)}
        </Link>
      )
    } catch (e) {
      const Content = <span>{capitaliseOrNot(data)}</span>
      if (level === 0) return <Wrapper>{Content}</Wrapper>
      return Content
    }
  }
  if (typeof data === 'number') return <span>{data}</span>

  const isArray = Object.keys(data).every((key) => Number.isInteger(+key))
  const Level = isArray ? (
    <OrderedList>
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <FriendlyObjectViewer
            data={value}
            level={level + 1}
            context={context}
            options={options}
            searchParams={searchParams}
          />
        </li>
      ))}
    </OrderedList>
  ) : (
    <List>
      {Object.entries(data).map(([key, value]) => {
        if (['description', 'note', 'titre'].includes(key) && value != null) {
          return (
            <li key={key}>
              <span css={options.keyStyle}>{key}&nbsp;:</span>
              <span dangerouslySetInnerHTML={{ __html: parse(value) }}></span>
            </li>
          )
        }

        return typeof value === 'string' || typeof value === 'number' ? (
          <li key={key}>
            <span css={options.keyStyle}>{capitaliseOrNot(key)}&nbsp;:</span>
            <span>
              <FriendlyObjectViewer
                data={value}
                searchParams={searchParams}
                level={level + 1}
                context={context}
                options={options}
              />
            </span>
          </li>
        ) : (
          <li key={key}>
            <div css={options.keyStyle}>{capitaliseOrNot(key)}:</div>
            <div>
              <FriendlyObjectViewer
                data={value}
                level={level + 1}
                searchParams={searchParams}
                context={context}
                options={options}
              />
            </div>
          </li>
        )
      })}
    </List>
  )

  if (level === 0) return <Wrapper>{Level}</Wrapper>
  return Level
}

export default FriendlyObjectViewer
