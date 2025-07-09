#!/bin/bash
echo "🔐 توليد محفظة جديدة..."

PRIVATE_KEY=$(xxd -l 32 -p /dev/urandom)
ADDRESS="0x${PRIVATE_KEY:0:40}"

echo "📥 المفتاح الخاص: $PRIVATE_KEY"
echo "💼 العنوان: $ADDRESS"

# حفظ البيانات داخل wallet.json
echo "{ \"address\": \"$ADDRESS\", \"privateKey\": \"$PRIVATE_KEY\" }" > wallet.json
echo "✅ تم حفظ المحفظة داخل wallet.json"
