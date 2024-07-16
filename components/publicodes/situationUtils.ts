export const encodeDottedName = (decoded) => decoded.replace(/\s\.\s/g, '.')
export const decodeDottedName = (encoded) => encoded.replace(/\./g, ' . ')

const entriesFromSearchParams = (searchParams, rules) =>
  Object.entries(searchParams || {})
    .map(([k, v]) => {
      const decoded = decodeDottedName(k)
      return [decoded, v, rules[decoded]]
    })
    .filter(([k, v, rule]) => rule !== undefined)

export const getAnsweredQuestions = (searchParams, rules) =>
  entriesFromSearchParams(searchParams, rules)
    .filter(([k, v]) => v.endsWith(validValueMark))
    .map(([k, v]) => k)

export const getSituation = (searchParams, rules) => {
  const parsedSituation = Object.fromEntries(
    entriesFromSearchParams(searchParams, rules)
      .filter(([k, v]) => v !== '∅')
      .map(([k, v, rule]) => {
        const stringValue = v.endsWith(validValueMark) ? v.slice(0, -1) : v

        // Remove trailing zeros for numeric values
        // TODO this is brittle : some values can be numeric without an explicité yaml unit, it can be defined on the go in the value itself like blabla: 23 dogs
        const isNumberRule =
          rule.unité || typeof rule['par défaut'] === 'number'
        const value =
          isNumberRule && stringValue.match(/^0+\d+?/g)
            ? stringValue.replace(/^0+/g, '')
            : stringValue

        return [k, value]
      }),
  ) //should be changed to clearly handle defaultValues
  return parsedSituation
}

export const encodeValue = (value) => {
  if (value == null) return '∅'

  if (typeof value === 'string') return value
  if (typeof value === 'number') return value

  if (value.valeur != null) return value.valeur //TODO units should be handled, this is dangerous
  if (value.nodeKind === 'constant' && typeof value.nodeValue === 'number')
    return value.nodeValue
  if (value.nodeKind === 'unité' && typeof value.rawNode === 'string')
    return value.rawNode

  console.log('ENCODEVALUE', value)
  throw new Error('Unhandled value format')
}

export const encodeSituation = (situation, doEncodeValue = false, valid = []) =>
  Object.fromEntries(
    Object.entries(situation).map(([k, v]) => [
      encodeDottedName(k),
      v === undefined
        ? v
        : (doEncodeValue ? encodeValue(v) : v) +
          (valid.includes(k) ? validValueMark : ''),
    ]),
  )

export const validValueMark = '*'
