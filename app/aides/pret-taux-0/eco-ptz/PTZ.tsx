import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import Image from 'next/image'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'
import EligibilityEcoPTZ from '@/components/module/EligibilityEcoPTZ'
import ShareModule from '@/app/module/ShareModule'

export default function PTZ() {
  const dottedName = 'PTZ'

  return (
    <>
      <h2>L'éco-prêt à taux zéro ou éco-PTZ</h2>
      <div
        css={`
          display: flex;
          gap: 1rem;
        `}
      >
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].descriptionHtml,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName]['informationsUtilesHtml'],
            }}
          />
        </div>
        <div>
          <Image
            src={'/' + rules[dottedName]['icône']}
            alt="logo éco-PTZ"
            width="100"
            height="100"
          />
        </div>
      </div>
      <Card>
        <EligibilityEcoPTZ
          {...{
            dottedName,
          }}
        />
      </Card>
      <ShareModule titre="eco-ptz" />
      <h3>Comment cela fonctionne?</h3>
      <div
        css={`
          table {
            border-collapse: collapse;
            margin-bottom: 1rem;
            td,
            th {
              border: 1px solid black;
              text-align: center;
              padding: 0.5rem;
            }
            td {
              white-space: nowrap;
            }
          }
        `}
        dangerouslySetInnerHTML={{
          __html: parse(rules[dottedName]['description détaillé']),
        }}
      />
      <FatConseiller
        {...{
          situation: {},
          margin: 'small',
          titre: 'Comment toucher cette aide ?',
          texte: rules[dottedName].commentFaireHtml,
        }}
      />
    </>
  )
}
