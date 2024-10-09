import { count } from "console";
import Link from "next/link";
import { CTAWrapper, CTA } from "../UI";
import rules from "@/app/règles/rules";
import { encodeSituation, getSituation } from "../publicodes/situationUtils";

     
export default function VoirSynthese({ answeredQuestions, setSearchParams, searchParams  }) {
  
  const count = searchParams["ampleur.synthèse"]?.split(',').length
  const syntheseUrl = setSearchParams(
    {
      ...encodeSituation(
        {
          ...getSituation(searchParams, rules),
          ['details']: "synthese",
        },
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
  )

  return count >= 1 &&
        <CTAWrapper
          css={`
              position: fixed;
              z-index: 1000;
              text-align: center;
              bottom: 0;
              left: 0;
              width: 100%;
              margin: 0;
              background: white;
              padding: 1rem 0;
              --shadow-color: 180deg 2% 61%;
              --shadow-elevation-medium: 0px -0.4px 0.5px hsl(var(--shadow-color) /
                      0.36),
                0px -1.2px 1.3px -0.8px hsl(var(--shadow-color) / 0.36),
                0.1px -2.9px 3.3px -1.7px hsl(var(--shadow-color) / 0.36),
                0.2px -7.1px 8px -2.5px hsl(var(--shadow-color) / 0.36);

              box-shadow: var(--shadow-elevation-medium);
              > div {
                width: 90%;
                margin: 0 auto !important;
              }
            
          `}
        >
          <CTA $importance={count === 0 ? 'inactive' : 'primary'}>
            <Link href={syntheseUrl}>({count}) Voir ma synthèse →</Link>
          </CTA>
        </CTAWrapper>
}