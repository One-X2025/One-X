package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("🚀 OneX Node Starting...")
	fmt.Printf("🕒 Time: %s\n", time.Now().Format(time.RFC1123))
	fmt.Println("✅ Network: OneX PoS initialized.")
	// Future: Add wallet, staking, block validation logic here
}
