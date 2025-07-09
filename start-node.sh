#!/bin/bash
echo "🚀 بدء تشغيل عقدة OneX..."

CONFIG="config.yaml"
GENESIS=$(grep genesis_file $CONFIG | awk '{print $2}')
DATA=$(grep data_dir $CONFIG | awk '{print $2}')
PORT=$(grep port $CONFIG | awk '{print $2}')

mkdir -p $DATA
echo "📦 تحميل Genesis: $GENESIS"
echo "🟢 تشغيل العقدة على المنفذ $PORT"

# (محاكاة تشغيل — استبدل بالأمر الفعلي لاحقًا)
echo "✅ تمت تهيئة البيانات داخل $DATA"
echo "🌐 العقدة تعمل الآن على المنفذ $PORT"
