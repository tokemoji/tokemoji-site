#!/usr/bin/env bash
set -euo pipefail

# Generate image via Gemini Imagen 3 and save to file.
# Reads API key from OpenClaw auth-profiles (profile: google:default).
# Usage: ./generate_nano_banana.sh <output_path> "<prompt>"

PROFILE="/data/.openclaw/agents/main/agent/auth-profiles.json"
if [ ! -f "$PROFILE" ]; then
  echo "ERROR: Auth profile not found at $PROFILE" >&2
  exit 1
fi

API_KEY=$(jq -r '.profiles["google:default"].key // empty' "$PROFILE")
if [ -z "$API_KEY" ] || [ "$API_KEY" = "null" ]; then
  echo "ERROR: Google API key not found in profile" >&2
  exit 1
fi

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <output_path> <prompt>" >&2
  exit 1
fi

OUT="$1"
PROMPT="$2"

# Ensure output directory exists
mkdir -p "$(dirname "$OUT")"

# Imagen 3 model endpoint
ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=$API_KEY"

# Build JSON payload using jq for safe escaping
PAYLOAD=$(jq -n --arg p "$PROMPT" '{"prompt":{"text":$p},"aspectRatio":"16:9","sampleCount":1}')

# Call API
RESPONSE=$(curl -sS -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD") || { echo "ERROR: curl failed" >&2; exit 1; }

# Extract image bytes (base64)
IMAGE_B64=$(echo "$RESPONSE" | jq -r '.candidates[0].image?.bytes // empty')
if [ -z "$IMAGE_B64" ] || [ "$IMAGE_B64" = "null" ]; then
  echo "ERROR: No image in response. Full response:" >&2
  echo "$RESPONSE" | jq . >&2
  exit 1
fi

# Decode to file
echo "$IMAGE_B64" | base64 -d > "$OUT"
echo "Saved image to $OUT"
