"use client"

import { createContext, useContext, useState, useEffect } from 'react';

export const IframeContext = createContext({});

export function useIframe() { return useContext(IframeContext) };

export default function IframeProvider({ children }) {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (client-side)
      if (window.self !== window.top) {
        setIsInIframe(true);
      } else {
        setIsInIframe(false);
      }
    }
  }, []);

  return (
    <IframeContext.Provider value={isInIframe}>
      {children}
    </IframeContext.Provider>
  );
};
