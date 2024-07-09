'use client'

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
