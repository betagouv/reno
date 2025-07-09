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

export function postMessageInit(targetOrigin: string = '*'): void {
  window.parent?.postMessage({ kind: 'mesaidesreno-init' }, targetOrigin)
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

export function postMessageEligibilityDone(
  situation: object | undefined,
  targetOrigin: string = '*',
): void {
  window.parent?.postMessage(
    { kind: 'mesaidesreno-eligibility-done', situation },
    targetOrigin,
  )
}

export function getIframeHostFromEvent(event: MessageEvent): string | null {
  if (event.data.kind === 'mesaidesreno-init') {
    return event.origin
  }

  return null
}
