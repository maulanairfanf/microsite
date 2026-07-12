#!/bin/bash
# Dev script: fix native modules + kill old next dev + clean lock + run dev

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Fix native modules (lightningcss + Prisma)
bash "$SCRIPT_DIR/scripts/fix-lightningcss.sh"

# 2. Kill any existing next dev processes
pkill -f "next dev" 2>/dev/null
sleep 1

# 3. Remove stale lock file
rm -f "$SCRIPT_DIR/.next/dev/lock" 2>/dev/null

# 4. Run next dev directly
cd "$SCRIPT_DIR"
./node_modules/.bin/next dev