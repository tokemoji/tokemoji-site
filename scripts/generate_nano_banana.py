#!/usr/bin/env python3
"""Tokemoji "Nano Banana" image generator (Gemini image).

This uses the Google GenAI SDK with the API key stored in OpenClaw auth profiles.

Usage:
  ./scripts/generate_nano_banana.py --out src/assets/img/eow_s1.png --aspect 16:9 --prompt "..."

Notes:
- Does NOT store or print API keys.
- Model is currently: gemini-2.5-flash-image
"""

import argparse
import json
from pathlib import Path

from google import genai
from google.genai import types

AUTH_PROFILES = Path("/data/.openclaw/agents/main/agent/auth-profiles.json")
MODEL = "gemini-2.5-flash-image"


def load_api_key() -> str:
    data = json.loads(AUTH_PROFILES.read_text())
    key = data["profiles"]["google:default"].get("key")
    if not key:
        raise SystemExit(f"Missing google:default key in {AUTH_PROFILES}")
    return key


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, help="Output path (png)")
    ap.add_argument("--aspect", default="16:9", help="Aspect ratio, e.g. 16:9")
    ap.add_argument("--prompt", required=True, help="Text prompt")
    args = ap.parse_args()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    key = load_api_key()
    client = genai.Client(api_key=key)

    resp = client.models.generate_content(
        model=MODEL,
        contents=args.prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=args.aspect,
            ),
        ),
    )

    # Find first inline image part
    for cand in resp.candidates or []:
        content = getattr(cand, "content", None)
        if not content:
            continue
        for part in content.parts or []:
            blob = getattr(part, "inline_data", None)
            if blob and getattr(blob, "data", None):
                out_path.write_bytes(blob.data)
                print(f"Saved: {out_path} ({blob.mime_type})")
                return

    raise SystemExit("No image returned by model.")


if __name__ == "__main__":
    main()
