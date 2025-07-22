import '@/components/phone.css'
import Phone from '@/components/Phone'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function Smartphone() {
  return (
    <>
      <StartDsfrOnHydration />
      <Phone iframeSrc={'/module/integration'} />
    </>
  )
}
