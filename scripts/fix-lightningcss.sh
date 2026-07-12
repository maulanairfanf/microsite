#!/bin/bash
# Fix native modules for macOS arm64 Node.js with x64 runtime

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Fix lightningcss - create symlink from x64 to arm64
LIGHTNING_CSS_DIR="$SCRIPT_DIR/node_modules/lightningcss"
OXIDE_X64_DIR="$SCRIPT_DIR/node_modules/@tailwindcss/oxide-darwin-x64"

cd "$LIGHTNING_CSS_DIR"
rm -f lightningcss.darwin-arm64.node 2>/dev/null
if [ -f "$OXIDE_X64_DIR/tailwindcss-oxide.darwin-x64.node" ]; then
    ln -sf ../@tailwindcss/oxide-darwin-x64/tailwindcss-oxide.darwin-x64.node lightningcss.darwin-arm64.node
fi

# Fix Prisma - regenerate if needed
cd "$SCRIPT_DIR"
rm -rf node_modules/.prisma 2>/dev/null
npx prisma generate 2>&1 | tail -3