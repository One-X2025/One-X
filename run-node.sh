#!/bin/bash

echo "🚀 بدء تشغيل شبكة OneX..."

DATADIR="node_data"
GETH="./geth"

if [ ! -f "$GETH" ]; then
  echo "❌ ملف geth غير موجود."
  exit 1
fi

echo "📦 تهيئة البلوك صفر..."
$GETH init genesis.json --datadir $DATADIR

echo "🔐 إنشاء محفظة جديدة..."
$GETH account new --datadir $DATADIR

echo "🔥 بدء التعدين وتشغيل الشبكة..."
$GETH --datadir $DATADIR \
  --networkid 8848 \
  --http \
  --http.addr "0.0.0.0" \
  --http.port 8545 \
  --http.api "eth,net,web3,personal" \
  --mine
