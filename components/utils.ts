export const sortBy = (f) => (list) =>
  list.sort((a, b) => {
    const fa = f(a),
      fb = f(b)
    return fa < fb ? -1 : fa > fb ? 1 : 0
  })

export const capitalise0 = (s) => s[0].toUpperCase() + s.slice(1)
export function omit(givenKeys, obj) {
  const keys = [...givenKeys]
  if (!keys.length) {
    return obj
  }
  const { [keys.pop()]: omitted, ...rest } = obj

  return omit(keys, rest)
}

export const transformObject = (transformer) => (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => transformer(k, v)))

export const debounce = <F extends (...args: any[]) => void>(
  waitFor: number,
  fn: F,
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), waitFor)
  }
}
