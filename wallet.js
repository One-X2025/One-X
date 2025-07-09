// wallet.js

async function hashPassword(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("OneX-Salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptPrivateKey(privateKey, password) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await hashPassword(password);
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(privateKey)
  );
  return {
    cipher: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: Array.from(iv)
  };
}

async function decryptPrivateKey(cipherObj, password) {
  const { cipher, iv } = cipherObj;
  const key = await hashPassword(password);
  const buffer = Uint8Array.from(atob(cipher), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    buffer
  );
  return new TextDecoder().decode(decrypted);
}

function generatePrivateKey() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getAddressFromPrivateKey(pk) {
  return '0x' + pk.slice(0, 40);
}

async function createWallet(password) {
  const pk = generatePrivateKey();
  const address = getAddressFromPrivateKey(pk);
  const encrypted = await encryptPrivateKey(pk, password);
  localStorage.setItem("onex_wallet", JSON.stringify({
    address,
    encryptedKey: encrypted
  }));
  alert("✅ تم إنشاء المحفظة:\n" + address);
}

async function importWallet(pk, password) {
  const address = getAddressFromPrivateKey(pk);
  const encrypted = await encryptPrivateKey(pk, password);
  localStorage.setItem("onex_wallet", JSON.stringify({
    address,
    encryptedKey: encrypted
  }));
  alert("🔑 تم استيراد المحفظة:\n" + address);
}

async function getDecryptedKey(password) {
  const saved = JSON.parse(localStorage.getItem("onex_wallet"));
  if (!saved) return null;
  return await decryptPrivateKey(saved.encryptedKey, password);
}
