#!/usr/bin/env python3
"""Build the seamless looping hero clip, portrait still and OG image.
Usage: python3 scripts/build-hero-assets.py [source.mp4]
Needs: ffmpeg (libx264, libvpx-vp9, libopus, libwebp) and numpy.
Crop values were measured on the 1280x720 source (person centred at x~640).
Change CROP if you re-record: (w, h, x, y) with a 4:5 ratio.
"""
import subprocess, sys, tempfile, wave, os
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else "intro.mp4"
CROP = (576, 720, 352, 0)          # w:h:x:y  -> 4:5 head-to-toe
OUT_W = 768                        # scaled width (height = 960)
T, F = 10.0, 0.5                   # clip length used, cross-fade length
SR = 48000
OUT = "public/hero"
run = lambda c: subprocess.run(c, check=True)

def read_audio():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-t", str(T), "-f", "f32le",
                          "-ac", "2", "-ar", str(SR), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)

def loop_audio(a):
    n = int(F * SR)
    body, head = a[n:int(T * SR)].copy(), a[:n]
    t = np.linspace(0, np.pi / 2, n, dtype=np.float32)[:, None]   # equal-power fade
    body[-n:] = body[-n:] * np.cos(t) + head * np.sin(t)
    return body

def write_wav(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())

def vf():
    w, h, x, y = CROP
    base = f"crop={w}:{h}:{x}:{y},scale={OUT_W}:-2,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,format=yuv420p"
    off = T - 2 * F
    return (f"[0:v]trim=0:{T},setpts=PTS-STARTPTS,{base},split[a][b];"
            f"[a]trim=start={F}:end={T},setpts=PTS-STARTPTS[A];"
            f"[b]trim=0:{F},setpts=PTS-STARTPTS[B];"
            f"[A][B]xfade=transition=fade:duration={F}:offset={off},format=yuv420p[v]")

def main():
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "loop.wav")
        write_wav(wav, loop_audio(read_audio()))
        common = ["ffmpeg", "-v", "error", "-y", "-i", SRC, "-i", wav, "-filter_complex", vf(),
                  "-map", "[v]", "-map", "1:a", "-shortest"]
        run(common + ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
                      "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", f"{OUT}/hero.mp4"])
        run(common + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-c:a", "libopus",
                      "-b:a", "80k", f"{OUT}/hero.webm"])
        w, h, x, y = CROP
        pre = f"crop={w}:{h}:{x}:{y},colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"
        # head-to-shirt portrait from a clear frame (t=5s)
        run(["ffmpeg", "-v", "error", "-y", "-ss", "5", "-i", SRC, "-frames:v", "1", "-vf",
             f"{pre},crop=iw*0.62:ih*0.50:iw*0.19:ih*0.04,scale=480:600", "public/portrait-bust.webp"])
        run(["ffmpeg", "-v", "error", "-y", "-ss", "5", "-i", SRC, "-frames:v", "1", "-vf",
             f"{pre},scale=-2:630,pad=1200:630:(ow-iw)/2:0:white", "-q:v", "3", "public/og.jpg"])
    print("done ->", OUT)

if __name__ == "__main__":
    main()
