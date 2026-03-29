#!/usr/bin/env python3
"""Compose a clean Tokemoji 'Emotion of the Week' competition poster.

Why: Gemini sometimes redraws coins / garbles lettering. This script keeps coins EXACT
by compositing real coin PNGs on top of an AI-generated background.

Usage:
  ../.venv_pil/bin/python scripts/compose_eow_poster.py \
    --bg src/assets/img/eow_comp_bg.png \
    --out src/assets/img/eow_competition_poster_clean.png \
    --fear src/assets/img/emojis/fear-coin-clean.png \
    --greed src/assets/img/emojis/greed-coin-clean.png \
    --love src/assets/img/emojis/love-coin-clean.png \
    --hate src/assets/img/emojis/hate-coin-clean.png
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def load_font(size: int) -> ImageFont.FreeTypeFont:
    # DejaVu is usually available on Linux images.
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size=size)
    return ImageFont.load_default()


def paste_coin(canvas: Image.Image, coin_path: Path, center_xy: tuple[int, int], size: int, tilt_deg: float = 0.0):
    coin = Image.open(coin_path).convert("RGBA")
    coin = coin.resize((size, size), Image.Resampling.LANCZOS)
    if tilt_deg:
        coin = coin.rotate(tilt_deg, resample=Image.Resampling.BICUBIC, expand=True)
    x = center_xy[0] - coin.size[0] // 2
    y = center_xy[1] - coin.size[1] // 2
    canvas.alpha_composite(coin, (x, y))


def draw_badge(draw: ImageDraw.ImageDraw, xywh, text: str, bg, fg, radius=18, font=None):
    x, y, w, h = xywh
    # rounded rect
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=bg, outline=(0, 0, 0, 200), width=4)
    if font:
        tw, th = draw.textbbox((0, 0), text, font=font)[2:]
    else:
        tw, th = draw.textbbox((0, 0), text)[2:]
    tx = x + (w - tw) / 2
    ty = y + (h - th) / 2 - 2
    draw.text((tx, ty), text, font=font, fill=fg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bg", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--fear", required=True)
    ap.add_argument("--greed", required=True)
    ap.add_argument("--love", required=True)
    ap.add_argument("--hate", required=True)
    ap.add_argument("--season", default="1")
    ap.add_argument("--week", default="1")
    ap.add_argument("--pool", default="1,000,000")
    args = ap.parse_args()

    bg = Image.open(args.bg).convert("RGBA")
    W, H = bg.size

    # Add slight dark overlay for readability
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 70))
    bg = Image.alpha_composite(bg, overlay)

    draw = ImageDraw.Draw(bg)

    title_font = load_font(88)
    sub_font = load_font(40)
    badge_font = load_font(36)

    # Badges (top)
    draw_badge(draw, (70, 40, 420, 72), "COMPETITION LIVE", bg=(255, 208, 0, 255), fg=(20, 20, 20, 255), radius=18, font=badge_font)
    draw_badge(draw, (W - 560, 40, 490, 72), f"POOL: {args.pool} TOKENS", bg=(20, 20, 20, 230), fg=(255, 208, 0, 255), radius=18, font=badge_font)

    # Title
    title = "EMOTION OF THE WEEK"
    tw = draw.textbbox((0, 0), title, font=title_font)[2]
    draw.text(((W - tw) / 2, 150), title, font=title_font, fill=(255, 208, 0, 255), stroke_width=6, stroke_fill=(0, 0, 0, 220))

    # Subtitle
    subtitle = f"SEASON {args.season}  •  WEEK {args.week}"
    sw = draw.textbbox((0, 0), subtitle, font=sub_font)[2]
    draw.text(((W - sw) / 2, 260), subtitle, font=sub_font, fill=(255, 255, 255, 255), stroke_width=4, stroke_fill=(0, 0, 0, 220))

    # VS
    vs_font = load_font(120)
    draw.text(((W - draw.textbbox((0, 0), "VS", font=vs_font)[2]) / 2, 470), "VS", font=vs_font, fill=(255, 208, 0, 255), stroke_width=8, stroke_fill=(0, 0, 0, 230))

    # Coins layout
    coin_big = int(min(W, H) * 0.28)  # ~300
    coin_small = int(min(W, H) * 0.22)

    paste_coin(bg, Path(args.fear), (int(W * 0.28), int(H * 0.54)), coin_big, tilt_deg=-8)
    paste_coin(bg, Path(args.greed), (int(W * 0.72), int(H * 0.54)), coin_big, tilt_deg=8)
    paste_coin(bg, Path(args.love), (int(W * 0.40), int(H * 0.80)), coin_small, tilt_deg=-6)
    paste_coin(bg, Path(args.hate), (int(W * 0.60), int(H * 0.80)), coin_small, tilt_deg=6)

    # Footer hint
    foot = "Be active on X • Do daily quests • Win weekly"
    ff = load_font(34)
    fw = draw.textbbox((0, 0), foot, font=ff)[2]
    draw.text(((W - fw) / 2, H - 80), foot, font=ff, fill=(255, 255, 255, 230), stroke_width=3, stroke_fill=(0, 0, 0, 200))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out, format="PNG")
    print(f"Saved: {out}")


if __name__ == "__main__":
    main()
