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
      <ul
        css={`
          padding-left: 0 !important;
        `}
      >
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
