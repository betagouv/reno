import { Fieldset } from '../BooleanMosaicUI'
import Geste from '../Geste'
import { Card } from '../UI'

export default function GestesPreview({
  rules,
  dottedNames,
  engine,
  situation,
}) {
  return (
    <Fieldset>
      <ul>
        {dottedNames.map((dottedName) => (
          <li key={dottedName}>
            <Card>
              <Geste
                {...{
                  rules,
                  dottedName,
                  engine,
                  situation: { ...situation, [dottedName]: 'oui' },
                  expanded: false,
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
    </Fieldset>
  )
}
