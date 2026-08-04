// Node.js runtime adapters for browser-compatible modules

// crypto module
export function getCrypto() {
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
    return window.crypto;
  }
  return require('crypto');
}

// setTimeout
export function getSetTimeout() {
  if (typeof window !== 'undefined' && typeof window.setTimeout !== 'undefined') {
    return window.setTimeout;
  }
  return require('timers').setTimeout;
}

// require
export function getRequire() {
  if (typeof require !== 'undefined') {
    return require;
  }
  throw new Error('require not available in browser environment');
}
