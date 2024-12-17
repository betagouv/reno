'use client'

import { useState } from 'react'

export default function NPMExampleProject() {
  const [isOpen, setOpen] = useState()
  if (!isOpen)
    return (
      <button onClick={() => setOpen(true)}>
        ⚙️ Afficher l'example CodeSandbox
      </button>
    )
  return (
    <iframe
      src="https://codesandbox.io/p/devbox/reno-demo-xzs68w?embed=1&file=%2Fapp%2Fpage.tsx"
      css="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden; "
      title="reno-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  )
}
