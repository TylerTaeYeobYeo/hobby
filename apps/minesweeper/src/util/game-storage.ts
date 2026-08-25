// Obfuscates saved game state so a casual look at localStorage doesn't reveal
// mine locations. This is NOT cryptographic security — it's client-side data
// the player owns, just XOR-scrambled to discourage peeking for hints.
const CIPHER_KEY = "minesweeper-save-v1";

const xorBytes = (bytes: Uint8Array): Uint8Array => {
  const keyBytes = new TextEncoder().encode(CIPHER_KEY);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

export const encodeGameState = (data: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  return bytesToBase64(xorBytes(bytes));
};

export const decodeGameState = <T>(encoded: string): T | null => {
  try {
    const bytes = xorBytes(base64ToBytes(encoded));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
};
