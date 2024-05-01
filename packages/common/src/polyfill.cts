const isBrowser = typeof window !== 'undefined';

// @ts-ignore
export const WebSocket = isBrowser ? window.WebSocket : require('ws');
