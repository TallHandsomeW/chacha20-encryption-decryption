/**
 * chacha20.js
 * Implementasi Algoritma ChaCha20 (RFC 8439)
 * Mata Kuliah: Sistem Keamanan
 * Universitas Maritim Raja Ali Haji - 2025/2026
 *
 * Referensi: D.J. Bernstein (2008), RFC 8439
 */

"use strict";

// ─── Helper: rotasi kiri 32-bit ───────────────────────────────────────────────
function rotl32(v, n) {
  return ((v << n) | (v >>> (32 - n))) >>> 0;
}

// ─── Quarter Round ────────────────────────────────────────────────────────────
// Operasi inti ChaCha20: a,b,c,d adalah indeks state[16]
function quarterRound(s, a, b, c, d) {
  s[a] = (s[a] + s[b]) >>> 0; s[d] ^= s[a]; s[d] = rotl32(s[d], 16);
  s[c] = (s[c] + s[d]) >>> 0; s[b] ^= s[c]; s[b] = rotl32(s[b], 12);
  s[a] = (s[a] + s[b]) >>> 0; s[d] ^= s[a]; s[d] = rotl32(s[d],  8);
  s[c] = (s[c] + s[d]) >>> 0; s[b] ^= s[c]; s[b] = rotl32(s[b],  7);
}

// ─── ChaCha20 Block Function ──────────────────────────────────────────────────
// key      : Uint8Array 32 byte
// nonce    : Uint8Array 12 byte
// counter  : Number (32-bit)
// returns  : Uint8Array 64 byte (keystream block)
function chacha20Block(key, nonce, counter) {
  // Konstanta "expand 32-byte k"
  const SIGMA = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];

  const k = new DataView(key.buffer, key.byteOffset);
  const n = new DataView(nonce.buffer, nonce.byteOffset);

  // Inisialisasi state 16 kata 32-bit
  const init = new Uint32Array([
    SIGMA[0], SIGMA[1], SIGMA[2], SIGMA[3],
    k.getUint32(0,  true), k.getUint32(4,  true),
    k.getUint32(8,  true), k.getUint32(12, true),
    k.getUint32(16, true), k.getUint32(20, true),
    k.getUint32(24, true), k.getUint32(28, true),
    counter >>> 0,
    n.getUint32(0, true), n.getUint32(4, true), n.getUint32(8, true),
  ]);

  const s = new Uint32Array(init);

  // 20 putaran (10 putaran column + 10 putaran diagonal)
  for (let i = 0; i < 10; i++) {
    // Column rounds
    quarterRound(s, 0, 4,  8, 12);
    quarterRound(s, 1, 5,  9, 13);
    quarterRound(s, 2, 6, 10, 14);
    quarterRound(s, 3, 7, 11, 15);
    // Diagonal rounds
    quarterRound(s, 0, 5, 10, 15);
    quarterRound(s, 1, 6, 11, 12);
    quarterRound(s, 2, 7,  8, 13);
    quarterRound(s, 3, 4,  9, 14);
  }

  // Tambahkan state awal ke state akhir (mod 2^32)
  for (let i = 0; i < 16; i++) {
    s[i] = (s[i] + init[i]) >>> 0;
  }

  // Serialize ke little-endian bytes
  const out = new Uint8Array(64);
  const dv  = new DataView(out.buffer);
  for (let i = 0; i < 16; i++) {
    dv.setUint32(i * 4, s[i], true);
  }
  return out;
}

// ─── ChaCha20 Encrypt / Decrypt ───────────────────────────────────────────────
// Enkripsi dan dekripsi identik (XOR simetris)
// key      : Uint8Array 32 byte
// nonce    : Uint8Array 12 byte
// data     : Uint8Array (plaintext atau ciphertext)
// counterStart : Number (default 1 sesuai RFC 8439)
// returns  : Uint8Array
function chacha20Crypt(key, nonce, data, counterStart = 1) {
  const out = new Uint8Array(data.length);
  let offset = 0;

  for (let blockIdx = 0; offset < data.length; blockIdx++) {
    const keystream = chacha20Block(key, nonce, (counterStart + blockIdx) >>> 0);
    const chunk = Math.min(64, data.length - offset);
    for (let i = 0; i < chunk; i++) {
      out[offset + i] = data[offset + i] ^ keystream[i];
    }
    offset += chunk;
  }
  return out;
}

// ─── Utilitas Konversi ────────────────────────────────────────────────────────

// String UTF-8 → Uint8Array
function strToBytes(str) {
  return new TextEncoder().encode(str);
}

// Uint8Array → String UTF-8
function bytesToStr(bytes) {
  return new TextDecoder().decode(bytes);
}

// Uint8Array → Hex string
function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hex string → Uint8Array
function hexToBytes(hex) {
  hex = hex.replace(/\s+/g, '');
  if (hex.length % 2 !== 0) throw new Error('Panjang hex tidak valid.');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = parseInt(hex.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Karakter hex tidak valid.');
    out[i] = byte;
  }
  return out;
}

// Generate nonce acak 12 byte
function generateNonce() {
  const n = new Uint8Array(12);
  crypto.getRandomValues(n);
  return n;
}

// Validasi key: harus 32 byte (64 karakter hex)
function parseKey(hexKey) {
  const clean = hexKey.replace(/\s+/g, '');
  if (clean.length !== 64) throw new Error('Key harus 64 karakter hex (32 byte).');
  return hexToBytes(clean);
}

// Validasi nonce: harus 12 byte (24 karakter hex)
function parseNonce(hexNonce) {
  const clean = hexNonce.replace(/\s+/g, '');
  if (clean.length !== 24) throw new Error('Nonce harus 24 karakter hex (12 byte).');
  return hexToBytes(clean);
}

// ─── API Publik ───────────────────────────────────────────────────────────────

/**
 * Enkripsi pesan teks
 * @param {string} plaintext  - Pesan asli
 * @param {string} hexKey     - Key 64 karakter hex
 * @param {string} hexNonce   - Nonce 24 karakter hex (atau kosong untuk auto-generate)
 * @returns {{ ciphertext: string, nonce: string }}
 */
function encrypt(plaintext, hexKey, hexNonce) {
  const key   = parseKey(hexKey);
  const nonce = hexNonce && hexNonce.replace(/\s+/g, '').length > 0
    ? parseNonce(hexNonce)
    : generateNonce();

  const ptBytes  = strToBytes(plaintext);
  const ctBytes  = chacha20Crypt(key, nonce, ptBytes);

  return {
    ciphertext : bytesToHex(ctBytes),
    nonce      : bytesToHex(nonce),
  };
}

/**
 * Dekripsi ciphertext
 * @param {string} hexCiphertext - Ciphertext dalam hex
 * @param {string} hexKey        - Key 64 karakter hex
 * @param {string} hexNonce      - Nonce 24 karakter hex
 * @returns {{ plaintext: string }}
 */
function decrypt(hexCiphertext, hexKey, hexNonce) {
  const key    = parseKey(hexKey);
  const nonce  = parseNonce(hexNonce);
  const ctBytes = hexToBytes(hexCiphertext.replace(/\s+/g, ''));
  const ptBytes = chacha20Crypt(key, nonce, ctBytes);

  return { plaintext: bytesToStr(ptBytes) };
}

/**
 * Generate key acak 32 byte (hex)
 * @returns {string}
 */
function generateKey() {
  const k = new Uint8Array(32);
  crypto.getRandomValues(k);
  return bytesToHex(k);
}

/**
 * Generate nonce acak 12 byte (hex)
 * @returns {string}
 */
function generateNonceHex() {
  return bytesToHex(generateNonce());
}