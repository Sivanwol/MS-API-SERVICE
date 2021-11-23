export const EncodingSettings = {
  digest: process.env.ALGORITHM,
  iterations: 10,
  encryptionKey: process.env.ENCRYPTION_KEY,
  salt: process.env.SALT,
}
