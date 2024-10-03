'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function useIsInIframe() {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsInIframe(true);
    } else {
      setIsInIframe(false);
    }
  }, []);

  return isInIframe;
};

// Certains partenaires souhaitent une version plus compacte du simulateur pour l'afficher en iframe
// On propose cette version en rajoutant ?display=compact dans l'url
export function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false);
  let params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "/");
  useEffect(() => {
    setIsCompact(params.has('display') && params.get('display') == "compact");
    if(params.has('color')) {
      document.documentElement.style.setProperty('--color', `#${params.get('color')}`);
    }
  }, []);

  return isCompact;
}