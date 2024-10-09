import Link from 'next/link';
import rules from '@/app/règles/rules'
import { CTAWrapper, CTA } from '../UI';
import { encodeDottedName, encodeSituation, getSituation } from '../publicodes/situationUtils';
import { omit } from '@/components/utils'
import { useSearchParams } from 'next/navigation';

export default function AideCTAs({ 
  dottedName, 
  situation, 
  answeredQuestions,
  setSearchParams,
  expanded
}) {
  const rawSearchParams = useSearchParams(),
  searchParams = Object.fromEntries(rawSearchParams.entries())

  const detailUrl = setSearchParams(
    {
      ...encodeSituation(
        {
          ...getSituation(searchParams, rules),
          ['details']: encodeDottedName(dottedName),
        },
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
  )

  const backUrl = situation && setSearchParams(
    {
      ...encodeSituation(
        omit(['details'], situation),
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
  )

  const addToSynthese = (dottedName) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        "ampleur.synthèse": (searchParams["ampleur.synthèse"] ? 
            searchParams["ampleur.synthèse"] + ',' :  "")  + 
            '"'+encodeDottedName(dottedName)+'"',
      },
      false,
      answeredQuestions,
    )

    setSearchParams(encodedSituation, 'push', false)
  }

  const removeFromSynthese = (dottedName) => {
    const newSynthese = searchParams["ampleur.synthèse"]
                          .split(",")
                          .filter(item => item != '"'+encodeDottedName(dottedName)+'"')
    const encodedSituation = encodeSituation(
      (newSynthese.length > 0 ?
        {
          ...situation,
          "ampleur.synthèse": newSynthese
        } :
        omit(["ampleur . synthèse"], situation)
      ),
      false,
      answeredQuestions,
    )
    
    setSearchParams(encodedSituation, 'push', true)
  }

  const isSelected = searchParams["ampleur.synthèse"]?.split(",").find(item => item === '"'+encodeDottedName(dottedName)+'"')

  return (
    <CTAWrapper $justify="center" css={`
      flex-wrap: wrap;
      flex-direction: ${expanded ? "row": "column"};
      div {
        margin: 0.5rem 0.2rem !important; 
        ${!expanded && "width: 100%;"}
        text-align: center;
      }`
      }>
      <CTA $fontSize="normal" $importance="emptyBackground">
        <Link href={expanded ? backUrl : detailUrl}>
          { expanded ? 
            (<>← Revenir aux aides</>) :
            (<>Voir le détail sur l'aide</>)
          }
        </Link>
      </CTA>
      <CTA css={`
          ${isSelected && `
            background: rgba(190, 242, 197, 0.20);
            border: 1px dashed var(--validColor);
            color: var(--validColor);  
          `}
        `} $fontSize="normal">
        <button
          onClick={() => !isSelected && addToSynthese(dottedName)}>
            { isSelected ? "✔ Ajouté" : "+ Ajouter" } à ma synthèse
        </button>
      </CTA>
      {isSelected && 
        <CTA css={`
          color: #721c24;
          background-color: #f8d7da;
          border: 1px dashed #721c24;
        `} $fontSize="normal">
          <button
            onClick={() => removeFromSynthese(dottedName)}>
              ✖ Retirer de ma synthèse
          </button>
        </CTA>
      }
    </CTAWrapper>
  )
}

