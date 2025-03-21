/**
 * Check if the current page is being rendered inside an iframe.
 *
 * @param params - search params used to force the iframe detection if specified.
 *
 * @note The hook {@link useIsInIframe} should be used inside a React component
 * instead of this function.
 */
export function isInIframe(params?: URLSearchParams): boolean {
  const hasIframeParam =
    params?.has('iframe') && params?.get('iframe') == 'true'

  return (
    hasIframeParam ||
    (typeof window !== 'undefined' && window.self !== window.top)
  )
}

export function postMessageResizeHeight(
  value: number,
  targetOrigin: string = '*',
): void {
  window.parent?.postMessage(
    { kind: 'mesaidesreno-resize-height', value },
    targetOrigin,
  )
}

export function postMessageSimulationDone(targetOrigin: string = '*'): void {
  window.parent?.postMessage(
    { kind: 'mesaidesreno-simulation-done' },
    targetOrigin,
  )
}
