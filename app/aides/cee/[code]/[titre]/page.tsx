import PageCEE from '@/components/cee/PageCEE'
import { Metadata } from 'next'
import rules from '@/app/règles/rules'

export async function generateMetadata(
  { params }
): Promise<Metadata> {

  const rule = Object.keys(rules).filter((rule) => rules[rule] && rules[rule].code == params.code)[0]

  return {
    title: "CEE - "+rules[rule].code +" : "+rules[rule].titre,
    description: "Calculateur de la prime CEE "+rules[rule].code+" pour "+rules[rule].titre,
  }
}

export default function CeeCode({ params }: { params: { code: string } }) {

  return (
    <PageCEE {...{params}} />
  )
}
