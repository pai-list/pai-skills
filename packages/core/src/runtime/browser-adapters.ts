// Browser runtime adapters

export function getCrypto() {
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
    return window.crypto;
  }
  throw new Error('crypto not available in browser without polyfill');
}

export function getSetTimeout() {
  if (typeof window !== 'undefined' && typeof window.setTimeout !== 'undefined') {
    return window.setTimeout;
  }
  throw new Error('setTimeout not available in browser');
}

export function getRequire() {
  throw new Error('require is not available in browser');
}
