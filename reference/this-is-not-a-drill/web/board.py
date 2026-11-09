"""Storyboard sheet for a chapter: one frame per shot, with the narration it covers and its sound cues.
usage: python3 board.py N frames_dir out_prefix   -> out_prefix_1.jpg, _2.jpg ... (12 shots per page)"""
import json, sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont
c, fdir, outp = sys.argv[1], sys.argv[2], sys.argv[3]
F = json.load(open(f'/home/claude/lockdown/web/film/ch{c}.json')); S = json.load(open(f'/home/claude/lockdown/web/film/ch{c}_sfx.json'))
W = json.load(open('/home/claude/lockdown/vo/words.json')); words = [w for k in W for w in W[k]]
fb = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; fr = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BIG, MED, SM = ImageFont.truetype(fb, 22), ImageFont.truetype(fr, 19), ImageFont.truetype(fr, 16)
TW, TH, PAD, TXT = 560, 315, 18, 150
cols, rows = 3, 4
shots = F['shots']
names = {'step1': 'step', 'step2': 'step', 'step3': 'step', 'sneakers_c': 'sneakers squeak', 'heels_c': 'heels click', 'boots_c': 'boots thud', 'knocks3_c': '3 soft knocks',
         'handle_down': 'handle pressed down', 'recede': 'footsteps walk away', 'relief_cry': 'relief crying', 'pa_on': 'speaker on', 'pa_off': 'speaker off'}
def m(t): t -= 0; return f'{int(t // 60)}:{t % 60:05.2f}'
pages = [shots[i:i + cols * rows] for i in range(0, len(shots), cols * rows)]
for pi, pg in enumerate(pages):
    img = Image.new('RGB', (cols * (TW + PAD) + PAD, rows * (TH + TXT + PAD) + PAD + 50), '#16171c'); d = ImageDraw.Draw(img)
    d.text((PAD, 14), f'Chapter {c} storyboard - page {pi + 1}/{len(pages)}', font=BIG, fill='#ffd84a')
    for k, s in enumerate(pg):
        si = shots.index(s); x, y = PAD + (k % cols) * (TW + PAD), 50 + PAD + (k // cols) * (TH + TXT + PAD)
        f = int(((s['t0'] + s['t1']) / 2 - F['t0']) * 30 + 0.5); p = f'{fdir}/f{f:05d}.jpg'
        if os.path.exists(p): img.paste(Image.open(p).resize((TW, TH)), (x, y))
        d.rectangle([x, y, x + 70, y + 28], fill='#000'); d.text((x + 6, y + 3), f'#{si + 1}', font=BIG, fill='#fff')
        line = ' '.join(w[2] for w in words if s['t0'] - 0.05 <= w[0] < s['t1'] - 0.05)
        d.text((x, y + TH + 6), f'{m(s["t0"])}-{m(s["t1"])}', font=SM, fill='#9aa0b4')
        yy = y + TH + 26
        for ln in textwrap.wrap(f'"{line}"' if line else '(no narration)', 52)[:3]: d.text((x, yy), ln, font=MED, fill='#fff'); yy += 23
        cues = []
        for t, n, v in S['sfx']:
            if s['t0'] <= t < s['t1']:
                nm = names.get(n, n.replace('_', ' '))
                if nm not in cues: cues.append(nm)
        if cues: d.text((x, yy + 2), ('SFX: ' + ', '.join(cues))[:62], font=SM, fill='#7fd6a6')
    img.save(f'{outp}_{pi + 1}.jpg', quality=88)
print(len(pages), 'pages')
