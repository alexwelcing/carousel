#!/usr/bin/env bash
# One-command tailored packet for a single lead.
# Usage: npm run packet:one -- <slug>   (or: bash scripts/packet-one.sh <slug>)
# Composes roles from leads.json, generates only this slug's PDFs, validates them.
set -euo pipefail
SLUG="${1:?usage: packet-one.sh <slug>}"
export TSX_TSCONFIG_PATH=./tsconfig.app.json
echo "▸ compose"
npx tsx scripts/compose-roles.ts
echo "▸ generate ($SLUG)"
ONLY_SLUG="$SLUG" npx tsx scripts/generate-resumes.tsx
echo "▸ validate ($SLUG)"
ONLY_SLUG="$SLUG" npx tsx scripts/validate-resume-packets.ts || true
echo "▸ output:"
ls -la "public/resumes/${SLUG}.pdf" "public/resumes/${SLUG}-light.pdf" 2>/dev/null || true
ls -la "public/cover-letters/${SLUG}.pdf" 2>/dev/null || true
