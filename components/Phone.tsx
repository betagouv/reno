// Taken from here https://devicescss.xyz/phones.html#samsung-galaxy-s8
import css from '@/components/css/convertToJs'
export default function Phone({ iframeSrc }) {
  return (
    <div
      className="device device-galaxy-s8 device-blue"
      style={css`
        transform: scale(0.6);
      `}
    >
      <div className="device-frame">
        <iframe
          className="device-screen"
          src={iframeSrc}
          style={css`
            max-height: 828px;
            max-width: 380px;
          `}
        />
      </div>
      <div className="device-stripe"></div>
      <div className="device-header"></div>
      <div className="device-sensors"></div>
      <div className="device-btns"></div>
      <div className="device-power"></div>
    </div>
  )
}
