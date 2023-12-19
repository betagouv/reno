import index from './règles/index.yaml'
import gestes from './règles/gestes.yaml'

const prefix = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([k, v]) => ['gestes . ' + k, v]),
  )
const rules = { ...index, ...prefix(gestes) }

export default rules
