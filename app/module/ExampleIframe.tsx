import css from '@/components/css/convertToJs'

export default function ExampleIframe() {
  return (
    <iframe
      src="/module/integration?DPE.actuel=6&logement.ann%C3%A9e+de+construction=1955&logement.commune=88160"
      style={css(`
        ${mobileIframeStyle}
      `)}
    />
  )
}
export const mobileIframeStyle = `
              border: none;
              border-radius: 0.4rem;
              margin: 3rem auto;
              height: 750px;
              width: 370px;
              max-width: 90vw;
              --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);

`
