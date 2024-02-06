import dpeData from '@/components/DPE.yaml'
import css from './css/convertToJs'

export default function DPELabel({ index }) {
  const { couleur, lettre, 'couleur du texte': textColor } = dpeData[+index]
  return (
    <span
      style={css(`
        background: ${couleur};
		width: 1.6rem; 
		display: inline-block;
		text-align: center;
		padding: 0 .4rem;
		color: ${textColor || 'black'};
		border-radius: .3rem;
      `)}
    >
      {lettre}
    </span>
  )
}
