"""Burned-in captions for the whole film, as an .ass subtitle file.
At most 10 words on screen, cut at sentence ends and commas; the word being spoken turns yellow (timed by the forced alignment in vo/words.json);
Dong's lines are white, every other voice (the thing, Mom, the deputy, Priya...) red.
usage: python captions.py out.ass [chapter_starts.json]
  chapter_starts.json (written by merge.py) maps each chapter to where it really starts in the joined video, so captions stay on the word
  even if a chapter's video is a frame longer or shorter than its slot in the voice-over."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
W = json.load(open(os.path.join(ROOT, 'vo', 'words.json')))
LINES = {l['id']: l for l in json.load(open(os.path.join(ROOT, 'web', 'lines_t.json')))}
CH = {}   # chapter number -> (t0 in the voice-over, t0 in the joined video)
for c in range(1, 7):
    f = json.load(open(os.path.join(ROOT, 'web', 'film', f'ch{c}.json'))); CH[c] = [f['t0'], f['t0']]
if len(sys.argv) > 2:
    for c, t in json.load(open(sys.argv[2])).items(): CH[int(c)][1] = t
def to_video(t):
    c = max(k for k in CH if CH[k][0] <= t + 1e-6); return CH[c][1] + (t - CH[c][0])
def ts(t): t = max(0, t); return f'{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}'
WHITE, RED, YELLOW = '&H00FFFFFF', '&H003B3BFF', '&H0000E6FF'   # ASS colours are &HAABBGGRR
def esc(s): return s.replace('{', '(').replace('}', ')').replace('\\', '/')
ev = []
for lid in sorted(W, key=lambda k: W[k][0][0]):
    words = W[lid]; base = WHITE if LINES.get(lid, {}).get('who', 'DONG') == 'DONG' else RED
    groups, g = [], []   # caption groups: at most 10 words, a break after . ? ! and after a comma once there are 4+ words
    for w in words:
        g.append(w)
        if len(g) >= 10 or re.search(r'[.?!…]["”]?$', w[2]) or (w[2].endswith(',') and len(g) >= 4): groups.append(g); g = []
    if g: groups.append(g)
    for gi, g in enumerate(groups):
        end_g = g[-1][1] + 0.25
        if gi + 1 < len(groups): end_g = min(end_g, groups[gi + 1][0][0])
        for i, w in enumerate(g):
            a = w[0]; b = g[i + 1][0] if i + 1 < len(g) else end_g
            if i == 0 and gi > 0: a = max(a, groups[gi - 1][-1][1])
            txt = ' '.join((f'{{\\c{YELLOW}}}{esc(x[2])}{{\\c{base}}}' if j == i else esc(x[2])) for j, x in enumerate(g))
            ev.append((to_video(a), to_video(b), base, txt))
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,4,1,2,140,140,70,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(sys.argv[1], 'w', encoding='utf-8') as f:
    f.write(head)
    for a, b, base, txt in ev:
        if b > a: f.write(f'Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{{\\c{base}}}{txt}\n')
print(len(ev), 'caption events ->', sys.argv[1])
