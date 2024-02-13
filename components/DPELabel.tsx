import dpeData from '@/components/DPE.yaml'

export default function DPELabel({ index }) {
  const { couleur, lettre, 'couleur du texte': textColor } = dpeData[+index]
  return (
    <span
      css={`
        background: ${couleur};
        width: auto;
        display: inline-block;
        text-align: center;
        padding: 0.05rem 0.45rem;
        color: ${textColor || 'black'};
        border-radius: 0.3rem;
      `}
    >
      {lettre}
    </span>
  )
}
