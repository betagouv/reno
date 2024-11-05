import { writeFileSync } from 'fs'
import json from '@/app/règles/rules'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'

const engine = new Publicodes(rules)

const filename = 'mesaidesreno.model.json' // this is a standard for the publicodes import tool https://github.com/publicodes/tools
const publicDestinationPath = './public/' + 'modèle.json'
const destinationPath = './public/' + filename

export default function writePublicodesJson() {
  writeFileSync(destinationPath, JSON.stringify(json))
  console.log(
    `✅ ${publicDestinationPath} generated, to be available on the web at mesaidesreno.beta.gouv.fr/modèle.json`,
  )
  console.log(`✅ ${destinationPath} generated, for the NPM package`)

  // The rest is taken from https://github.com/publicodes/model-template/blob/main/build.js

  // Generate an index.js file to export the model
  writeFileSync(
    'index.js',
    `import rules from "./${destinationPath}" assert { type: "json" };

export default rules;
`,
  )
  console.log(`✅ index.js generated`)

  // Generate an index.d.ts file to export the model types
  // where each rule name is a case in the DottedName type
  let indexDTypes = Object.keys(engine.getParsedRules()).reduce(
    (acc, dottedName) => acc + `| "${dottedName}"\n`,
    `import { Rule } from "publicodes";

export type DottedName = 
`,
  )

  indexDTypes += `
declare let rules: Record<DottedName, Rule>

export default rules;
`

  writeFileSync('index.d.ts', indexDTypes)
  console.log(`✅ index.d.ts generated`)
}
