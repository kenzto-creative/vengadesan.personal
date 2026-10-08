"""Rebuild hero from the unpainted 768x960 clip: white studio, intact figure."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(r"c:\Projects\vengat portfolio - white\public\hero\hero.mp4")
POSTER = ROOT / "public" / "portrait-full.webp"
MP4 = ROOT / "public" / "hero" / "hero.mp4"
WEBM = ROOT / "public" / "hero" / "hero.webm"
OUT_W, OUT_H = 308, 900


def _center_gap(xs_row: np.ndarray, cx: float, min_gap: int = 20):
    if xs_row.size < 8:
        return None
    d = np.diff(xs_row)
    for i in np.where(d > min_gap)[0]:
        a, b = int(xs_row[i]), int(xs_row[i + 1])
        if a < cx < b:
            return a, b
    return None


def person_keep(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    px = rgb.astype(np.float32)
    r, g, b = px[:, :, 0], px[:, :, 1], px[:, :, 2]
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    core = (luma < 200) | (sat > 16)
    core = ndimage.binary_closing(core, structure=np.ones((11, 11)))
    lab, n = ndimage.label(core)
    if n:
        sizes = ndimage.sum(core, lab, range(1, n + 1))
        core = lab == (int(np.argmax(sizes)) + 1)

    ys, xs = np.where(core)
    if xs.size == 0:
        return np.zeros((h, w), dtype=bool)

    cx = (xs.min() + xs.max()) / 2.0
    y_top, y_bot = int(ys.min()), int(ys.max())

    left = np.full(h, w, np.int32)
    right = np.full(h, -1, np.int32)
    for y in range(h):
        row = np.where(core[y])[0]
        if row.size:
            left[y] = row.min()
            right[y] = row.max()
    valid = right >= 0
    left_f = ndimage.minimum_filter1d(np.where(valid, left, w), size=91)
    right_f = ndimage.maximum_filter1d(np.where(valid, right, 0), size=91)

    crotch = None
    y_lo = int(y_top + 0.55 * (y_bot - y_top))
    y_hi = int(y_top + 0.88 * (y_bot - y_top))
    run = 0
    cand = None
    for y in range(y_lo, y_hi):
        g = _center_gap(np.where(core[y])[0], cx)
        if g:
            run += 1
            if cand is None:
                cand = y
            if run >= 8:
                crotch = cand
                break
        else:
            run = 0
            cand = None
    if crotch is None:
        crotch = int(y_top + 0.68 * (y_bot - y_top))

    keep = np.zeros((h, w), dtype=bool)
    for y in range(y_top, crotch):
        if right_f[y] >= left_f[y]:
            keep[y, left_f[y] : right_f[y] + 1] = True
    for y in range(crotch, y_bot + 1):
        row = np.where(core[y])[0]
        if row.size == 0:
            continue
        d = np.diff(row)
        br = np.where(d > 12)[0]
        starts = np.r_[row[0], row[br + 1]]
        ends = np.r_[row[br], row[-1]]
        for a, b in zip(starts, ends):
            keep[y, max(0, int(a) - 6) : min(w, int(b) + 7)] = True

    xs_grid = np.arange(w)[None, :]
    foot = np.zeros_like(core)
    foot[max(0, y_bot - 85) : y_bot + 1] = core[max(0, y_bot - 85) : y_bot + 1]
    for blob in (foot & (xs_grid < cx), foot & (xs_grid >= cx)):
        dil = ndimage.binary_dilation(blob, structure=np.ones((37, 37)))
        keep |= dil

    keep = ndimage.binary_fill_holes(keep)
    ankle = y_bot - 80
    for y in range(crotch, ankle):
        g = _center_gap(np.where(core[y])[0], cx, 12)
        if g:
            a, b = g
            keep[y, a + 2 : b - 1] = False
    return keep


def crop_box(keep: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.where(keep)
    cx = int(round((xs.min() + xs.max()) / 2))
    x0 = max(0, min(keep.shape[1] - OUT_W, cx - OUT_W // 2))
    y1 = keep.shape[0]
    y0 = max(0, y1 - OUT_H)
    return x0, y0, x0 + OUT_W, y0 + OUT_H


def process(im: Image.Image, box: tuple[int, int, int, int] | None):
    rgb = np.array(im.convert("RGB"))
    keep = person_keep(rgb)
    painted = rgb.copy()
    painted[~keep] = 255
    if box is None:
        box = crop_box(keep)
    x0, y0, x1, y1 = box
    return Image.fromarray(painted[y0:y1, x0:x1]), box


td = Path(tempfile.mkdtemp(prefix="hero-rebuild-"))
try:
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(SRC), str(td / "f%04d.png")],
        check=True,
    )
    frames = sorted(td.glob("f*.png"))
    print("frames", len(frames), "from", SRC)

    preview, box = process(Image.open(frames[min(28, len(frames) - 1)]), None)
    print("crop box", box, "out", preview.size)
    preview.save(ROOT / "public" / "hero" / "preview-rebuild.png")

    for i, f in enumerate(frames, 1):
        out, _ = process(Image.open(f), box)
        out.save(f)
        if i % 60 == 0 or i == len(frames):
            print("painted", i)

    tmp_mp4 = MP4.with_suffix(".tmp.mp4")
    tmp_webm = WEBM.with_suffix(".tmp.webm")
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-framerate", "24", "-i", str(td / "f%04d.png"),
        "-i", str(SRC), "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "18",
        "-pix_fmt", "yuvj420p", "-color_range", "pc", "-c:a", "copy", "-shortest",
        "-movflags", "+faststart", str(tmp_mp4),
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-framerate", "24", "-i", str(td / "f%04d.png"),
        "-i", str(SRC), "-map", "0:v", "-map", "1:a?", "-c:v", "libvpx-vp9", "-crf", "30",
        "-b:v", "0", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "80k", "-shortest",
        str(tmp_webm),
    ], check=True)
    shutil.move(tmp_mp4, MP4)
    shutil.move(tmp_webm, WEBM)
    Image.open(frames[min(36, len(frames) - 1)]).save(POSTER, "WEBP", quality=90)
    print("video ok")
finally:
    shutil.rmtree(td, ignore_errors=True)
