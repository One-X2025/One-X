#!/bin/bash

echo "🔐 Generating OneX Wallet..."

# Generate private key (simulated)
PRIVATE_KEY=$(openssl rand -hex 32)

# Generate public address (simplified - not production grade)
ADDRESS="0x$(echo $PRIVATE_KEY | cut -c1-40)"

# Save to wallet.json
echo "{" > wallet.json
echo "  \"address\": \"$ADDRESS\"," >> wallet.json
echo "  \"private_key\": \"$PRIVATE_KEY\"" >> wallet.json
echo "}" >> wallet.json

echo "✅ Wallet created:"
echo "📫 Address: $ADDRESS"
