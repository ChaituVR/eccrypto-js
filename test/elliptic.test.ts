import * as ellipticLib from '../src/lib/elliptic';
import {
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY,
  TEST_SHARED_KEY,
  compare,
  TEST_PUBLIC_KEY_COMPRESSED,
  getTestMessageToSign,
} from './common';

const privateKey = Buffer.from(TEST_PRIVATE_KEY, 'hex');
const expectedPublicKey = Buffer.from(TEST_PUBLIC_KEY, 'hex');
const expectedPublicKeyLength = 65;
const expectedPublicKeyCompressed = Buffer.from(
  TEST_PUBLIC_KEY_COMPRESSED,
  'hex'
);
const expectedPublicKeyCompressedLength = 33;
const expectedSharedKey = Buffer.from(TEST_SHARED_KEY, 'hex');
const expectedSharedKeyLength = 32;

describe('Elliptic', () => {
  it('should get public key successfully', () => {
    const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    expect(publicKey).toBeTruthy();
    expect(compare(publicKey, expectedPublicKey)).toBeTruthy();
    expect(publicKey.length === expectedPublicKeyLength).toBeTruthy();
  });

  it('should get public key compressed successfully', () => {
    const publicKeyCompressed = ellipticLib.ellipticGetPublicCompressed(
      privateKey
    );
    expect(publicKeyCompressed).toBeTruthy();
    expect(
      compare(publicKeyCompressed, expectedPublicKeyCompressed)
    ).toBeTruthy();
    expect(
      publicKeyCompressed.length === expectedPublicKeyCompressedLength
    ).toBeTruthy();
  });

  it('should compress public key successfully', () => {
    const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    const publicKeyCompressed = ellipticLib.ellipticCompress(publicKey);
    expect(
      compare(publicKeyCompressed, expectedPublicKeyCompressed)
    ).toBeTruthy();
  });

  it('should decompress public key successfully', () => {
    const publicKeyCompressed = ellipticLib.ellipticGetPublicCompressed(
      privateKey
    );
    const publicKey = ellipticLib.ellipticDecompress(publicKeyCompressed);
    expect(compare(publicKey, expectedPublicKey)).toBeTruthy();
  });

  it('should derive shared key successfully', () => {
    const sharedKey = ellipticLib.ellipticDerive(
      ellipticLib.ellipticGetPublic(privateKey),
      privateKey
    );
    expect(sharedKey).toBeTruthy();
    expect(compare(sharedKey, expectedSharedKey)).toBeTruthy();
    expect(sharedKey.length === expectedSharedKeyLength).toBeTruthy();
  });

  it('should sign successfully with DER signatures', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey);
    expect(sig).toBeTruthy();
  });

  it('should verify DER signatures successfully', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey);
    const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    await ellipticLib.ellipticVerify(sig, msg, publicKey);
  });

  it('should throw when recovering from DER signatures', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey);
    // const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    expect(() => ellipticLib.ellipticRecover(sig, msg)).toThrow(
      'Cannot recover from DER signatures'
    );
  });

  it('should sign successfully with RSV signatures', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey, true);
    expect(sig).toBeTruthy();
  });

  it('should verify RSV signatures successfully', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey);
    const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    await ellipticLib.ellipticVerify(sig, msg, publicKey);
  });

  it('should recover RSV signatures successfully', async () => {
    const { msg } = await getTestMessageToSign();
    const sig = ellipticLib.ellipticSign(msg, privateKey, true);
    const publicKey = ellipticLib.ellipticGetPublic(privateKey);
    const recovered = ellipticLib.ellipticRecover(sig, msg);
    expect(compare(publicKey, recovered)).toBeTruthy();
  });
});
