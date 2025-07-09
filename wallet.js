// wallet.js

// توليد مفتاح خاص (عشوائي)
function generatePrivateKey() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// توليد عنوان (مبسط: أول 40 رقم من المفتاح)
function getAddressFromPrivateKey(pk) {
  return '0x' + pk.slice(0, 40);
}

// إنشاء المحفظة
function createWallet(password) {
  const privateKey = generatePrivateKey();
  const address = getAddressFromPrivateKey(privateKey);

  const walletData = {
    address,
    privateKey,
    password
  };

  localStorage.setItem('onex_wallet', JSON.stringify(walletData));
  alert('✅ تم إنشاء المحفظة!\nالعنوان: ' + address);
}

// استيراد محفظة
function importWallet(privateKey, password) {
  if (!privateKey || !password) return alert("⚠️ يرجى إدخال البيانات");
  const address = getAddressFromPrivateKey(privateKey);
  const walletData = { address, privateKey, password };
  localStorage.setItem('onex_wallet', JSON.stringify(walletData));
  alert('🔑 تم استيراد المحفظة: ' + address);
}
