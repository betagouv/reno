import { writeFileSync } from 'fs'
import json from '@/app/règles/rules'

const filename = 'mesaidesreno.model.json' // this is a standard for the publicodes import tool https://github.com/publicodes/tools
export default function writePublicodesJson() {
  return writeFileSync('./public/' + filename, JSON.stringify(json))
}
