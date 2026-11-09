"""Check a finished chapter: length, audio, and every shot's first/middle/last frame (no unexpected black frames).
usage: python3 check_ch.py N   -> prints problems, writes review sheets to the scratchpad"""
import json, subprocess, sys, numpy as np
from PIL import Image, ImageDraw
c = sys.argv[1]; S = '/tmp/claude-0/-home-claude/a503243c-0075-5a09-a7fe-3293ae2b09ae/scratchpad'
F = json.load(open(f'/home/claude/lockdown/web/film/ch{c}.json')); mp4 = f'/home/claude/lockdown/out/this-is-not-a-drill-ch{c}.mp4'
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout)
want = F['t1'] - F['t0']; probs = []
if abs(dur - want) > 0.15: probs.append(f'duration {dur:.2f}s, expected {want:.2f}s')
vol = subprocess.run(['ffmpeg', '-v', 'info', '-i', mp4, '-af', 'volumedetect', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
mv = [l for l in vol.splitlines() if 'mean_volume' in l]
print('audio', mv[0].split('] ')[-1] if mv else 'MISSING'); 
if not mv: probs.append('no audio')
fr = sorted(f for f in __import__('os').listdir(f'{S}/ch{c}f')); n = round(want * 30)
if len(fr) != n: probs.append(f'{len(fr)} frames rendered, expected {n}')
def black_intended(t, sh):
    for o in sh.get('overlays', []):
        if o['type'] in ('black', 'clock', 'chat') and o['t0'] - 0.05 <= t <= o['t1'] + 0.05 and o.get('alpha', 1) > 0.9: return True
    return bool(sh.get('clip'))
thumbs = []
for i, sh in enumerate(F['shots']):
    for t in (sh['t0'] + 0.04, (sh['t0'] + sh['t1']) / 2, sh['t1'] - 0.05):
        f = min(n - 1, int(round((t - F['t0']) * 30))); im = Image.open(f'{S}/ch{c}f/f{f:05d}.jpg')
        m = np.asarray(im.resize((96, 54))).mean()
        if m < 9 and not black_intended(t, sh): probs.append(f'shot {i} at {t:.2f}s is black (mean {m:.1f})')
        if t == (sh['t0'] + sh['t1']) / 2: thumbs.append((i, sh['t0'], im))
W, H, cols = 480, 270, 5; rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new('RGB', (W * cols, H * rows)); d = ImageDraw.Draw(sheet)
for k, (i, t0, im) in enumerate(thumbs): sheet.paste(im.resize((W, H)), ((k % cols) * W, (k // cols) * H)); d.text(((k % cols) * W + 5, (k // cols) * H + 5), f'{i} {t0:.1f}', fill='yellow')
sheet.save(f'{S}/final_ch{c}.jpg', quality=82)
print(f'ch{c}: {dur:.2f}s, {len(fr)} frames, {len(F["shots"])} shots;', 'PROBLEMS:' if probs else 'no problems found', *probs, sep='\n  ')
