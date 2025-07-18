import PageCEE from '@/components/cee/PageCEE'
import { Metadata } from 'next'
import rules from '@/app/règles/rules'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params

  const rule = Object.keys(rules).filter(
    (rule) => rules[rule] && rules[rule].code == params.code,
  )[0]

  return {
    title: 'Aide CEE - ' + rules[rule].code + ' : ' + rules[rule].titre,
    description:
      'Calculateur de la prime CEE ' +
      rules[rule].code +
      ' pour ' +
      rules[rule].titre,
  }
}

export default async function CeeCode(props) {
  const params = await props.params

  return (
    <>
      <StartDsfrOnHydration />
      <PageCEE {...{ params }} />
    </>
  )
}
