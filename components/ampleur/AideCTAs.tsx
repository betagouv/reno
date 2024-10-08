import Link from 'next/link';
import { CTAWrapper, CTA } from '../UI';
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils';
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
          ...situation,
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
        "synthese": (searchParams.synthese ? searchParams.synthese + ',' :  "")  + encodeDottedName(dottedName),
      },
      false,
      answeredQuestions,
    )

    setSearchParams(encodedSituation, 'push', false)
  }

  const isSelected = searchParams.synthese?.includes(encodeDottedName(dottedName))
  return (
    <CTAWrapper $justify="center" css={`flex-wrap: wrap;`}>
      <CTA css={`margin: 0.5rem 0.2rem !important;`} $fontSize="normal" $importance="emptyBackground">
        <Link href={expanded ? backUrl : detailUrl}>
          { expanded ? 
            (<>← Revenir aux aides</>) :
            (<>Voir le détail sur l'aide</>)
          }
        </Link>
      </CTA>
      <CTA css={`
          margin: 0.5rem 0.2rem;
          ${isSelected && `
            background: rgba(190, 242, 197, 0.20);
            border: 1px dashed var(--validColor);
            color: var(--validColor);  
          `}
        `} $fontSize="normal">
        <button
          onClick={() => addToSynthese(dottedName)}>{ isSelected ? "✔ Ajouté" : "+ Ajouter" } à ma synthèse</button>
      </CTA>
    </CTAWrapper>
  )
}

