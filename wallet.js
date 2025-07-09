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

async function decryptWallet(password) {
  const saved = JSON.parse(localStorage.getItem("onex_wallet"));
  if (!saved) return null;
  const pk = await decryptPrivateKey(saved.encryptedKey, password);
  return { address: saved.address, privateKey: pk };
}

async function handleCreate() {
  const pass = document.getElementById("newPass").value;
  if (!pass) return alert("⚠️ أدخل كلمة مرور قوية");
  await createWallet(pass);
}

async function handleImport() {
  const pk = document.getElementById("importKey").value;
  const pass = document.getElementById("importPass").value;
  if (!pk || !pass) return alert("⚠️ أدخل المفتاح وكلمة المرور");
  await importWallet(pk, pass);
}

async function handleLogin() {
  const pass = document.getElementById("loginPass").value;
  const result = await decryptWallet(pass);
  document.getElementById("loginResult").textContent = result
    ? `✅ العنوان: ${result.address}`
    : "❌ كلمة مرور خاطئة أو لا توجد محفظة محفوظة";
}

function downloadWallet() {
  const data = localStorage.getItem("onex_wallet");
  if (!data) return alert("⚠️ لا يوجد محفظة محفوظة");
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "onex-wallet.json";
  a.click();
  URL.revokeObjectURL(url);
}

// 💱 حاسبة سعر ONEX
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("amountOnex");
  const output = document.getElementById("converted");

  input.addEventListener("input", async () => {
    const amount = parseFloat(input.value);
    if (!amount || amount <= 0) {
      output.textContent = "0.00";
      return;
    }

    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=onex&vs_currencies=usd");
      const data = await res.json();
      const price = data.onex?.usd || 0.125; // سعر افتراضي لو API فشل
      output.textContent = (amount * price).toFixed(2);
    } catch (e) {
      output.textContent = "0.00";
    }
  });
});
