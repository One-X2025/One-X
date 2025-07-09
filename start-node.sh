#!/bin/bash

echo "🚀 Bootstrapping OneX Node..."
echo "📁 Using genesis configuration: ./genesis/genesis.json"
echo "🧱 Initializing data directory: ./data"

mkdir -p ./data

cp ./genesis/genesis.json ./data/

echo "✅ Node initialized with genesis file."
echo "🕒 Ready for future validator setup & block generation..."
