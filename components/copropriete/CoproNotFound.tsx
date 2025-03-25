import { motion } from 'framer-motion'
export default function CoproNotFound() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 6 }} // Delay the animation by 1 second
      css={`
        margin: 1rem 0;
      `}
    >
      🕵️ Pas trouvé votre copro ? Demandez son immatriculation dans le{' '}
      <a href="https://www.registre-coproprietes.gouv.fr/compte">
        registre national
      </a>
      .
    </motion.section>
  )
}
