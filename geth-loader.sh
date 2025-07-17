#!/bin/bash

echo "🚀 تحميل geth.b64 للمشروع OneX..."
curl -LJO https://onedigitalchain.github.io/geth.b64

echo "📦 فك التشفير..."
base64 -d geth.b64 > geth
chmod +x geth

echo "🎯 تشغيل الشبكة..."
bash run-node.sh
