import { gcm } from '@noble/ciphers/aes.js';
import { bytesToUtf8, randomBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

const PBKDF2_ITERATIONS = 250_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

function toBase64(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveKey(password: string, salt: Uint8Array) {
  return pbkdf2Async(sha256, password, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: KEY_LENGTH,
  });
}

export async function encryptText(plainText: string, password: string) {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = await deriveKey(password, salt);
  const cipher = gcm(key, iv);
  const ciphertext = cipher.encrypt(utf8ToBytes(plainText));

  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  };
}

export async function decryptText(
  password: string,
  saltBase64: string,
  ivBase64: string,
  ciphertextBase64: string,
) {
  const salt = fromBase64(saltBase64);
  const iv = fromBase64(ivBase64);
  const ciphertext = fromBase64(ciphertextBase64);
  const key = await deriveKey(password, salt);
  const cipher = gcm(key, iv);

  try {
    return bytesToUtf8(cipher.decrypt(ciphertext));
  } catch {
    throw new Error('password');
  }
}
