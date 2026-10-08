"""Replace edge-connected studio (white or leftover gray) with hero white (#ffffff)."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
POSTER = ROOT / "public" / "portrait-full.webp"
MP4 = ROOT / "public" / "hero" / "hero.mp4"
WEBM = ROOT / "public" / "hero" / "hero.webm"
BG = np.array([255, 255, 255], dtype=np.uint8)

def paint(rgb: np.ndarray) -> np.ndarray:
    """Keep the figure; force every other pixel to pure white."""
    px = rgb.astype(np.float32)
    r, g, b = px[:, :, 0], px[:, :, 1], px[:, :, 2]
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    core = (luma < 218) | (sat > 12)
    core = ndimage.binary_closing(core, structure=np.ones((13, 13)))
    lab, n = ndimage.label(core)
    if n:
        sizes = ndimage.sum(core, lab, range(1, n + 1))
        keep = lab == (int(np.argmax(sizes)) + 1)
    else:
        keep = core
    keep = ndimage.binary_fill_holes(ndimage.binary_dilation(keep, iterations=1))
    out = np.full_like(rgb, 255)
    out[keep] = rgb[keep]
    return out

def paint_file(path: Path) -> None:
    im = Image.open(path).convert("RGB")
    Image.fromarray(paint(np.array(im))).save(path)

paint_file(POSTER)
print("poster ok")

td = Path(tempfile.mkdtemp(prefix="hero-frames-"))
try:
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(MP4), str(td / "f%04d.png")], check=True)
    frames = sorted(td.glob("f*.png"))
    print("frames", len(frames))
    for i, f in enumerate(frames, 1):
        paint_file(f)
        if i % 60 == 0 or i == len(frames):
            print("painted", i)
    tmp_mp4 = MP4.with_suffix(".tmp.mp4")
    tmp_webm = WEBM.with_suffix(".tmp.webm")
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-framerate", "24", "-i", str(td / "f%04d.png"),
        "-i", str(MP4), "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "20",
        "-pix_fmt", "yuvj420p", "-color_range", "pc", "-c:a", "copy", "-shortest", str(tmp_mp4),
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-framerate", "24", "-i", str(td / "f%04d.png"),
        "-i", str(MP4), "-map", "0:v", "-map", "1:a?", "-c:v", "libvpx-vp9", "-crf", "32",
        "-b:v", "0", "-c:a", "libopus", "-b:a", "80k", "-shortest", str(tmp_webm),
    ], check=True)
    shutil.move(tmp_mp4, MP4)
    shutil.move(tmp_webm, WEBM)
    print("video ok")
finally:
    shutil.rmtree(td, ignore_errors=True)
