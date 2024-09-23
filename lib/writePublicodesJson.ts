import { writeFileSync } from 'fs'
import json from '@/app/règles/rules'

export default function writePublicodesJson() {
  return writeFileSync('./public/mesaidesreno.json', JSON.stringify(json))
}
