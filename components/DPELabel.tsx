import dpeData from '@/components/DPE.yaml'

import css from './css/convertToJs'
export default function DPELabel({ index }) {
  const { couleur, lettre } = dpeData[+index]
  return (
    <span
      style={css(`
        background: ${couleur};
		width: 1.6rem; 
		padding: 0 .4rem;
		color: black;
		border-radius: .3rem;
      `)}
    >
      {lettre}
    </span>
  )
}
