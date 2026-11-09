#!/usr/bin/env python3
"""Search and fetch sound effects from the catalog of free (CC0 / CC BY) sounds on GitHub.

    python3 sfx_library.py search door creak                  # best matches, with id, length and licence
    python3 sfx_library.py search scream --cat voice --max 3   # one category, at most 3 s long
    python3 sfx_library.py search meow --cc0                   # CC0 only (no credit needed)
    python3 sfx_library.py cats                                # categories and how many sounds each has
    python3 sfx_library.py kits                                # ready-made kits (horror, doors, footsteps, ...)
    python3 sfx_library.py get OUT_DIR ID [ID ...]             # download, as 44.1 kHz MP3s named by id
    python3 sfx_library.py kit OUT_DIR horror                  # download a whole kit
    python3 sfx_library.py get OUT_DIR ID --name knock         # save one sound under your own name (knock.mp3)

Every download is converted to a 44.1 kHz MP3 (mono stays mono), trimmed of leading silence and peak-normalised to
-3 dBFS, so it drops into a video like any other effect. When a downloaded sound is CC BY, its credit line is added to
OUT_DIR/CREDITS.txt: paste that into the video description. Needs ffmpeg; the catalog (sfx_catalog.csv) is read from
next to this script, or from GitHub when it isn't there.
"""
import argparse, csv, io, json, os, re, subprocess, sys, tempfile, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = 'https://raw.githubusercontent.com/tangdongli1999-lang/Papermorph/claude/hide-and-seek/.claude/skills/sfx-library/'


def load(name):
    p = os.path.join(HERE, name)
    if os.path.exists(p):
        return open(p, encoding='utf-8').read()
    with urllib.request.urlopen(RAW + name, timeout=60) as r:
        return r.read().decode('utf-8')


CAT = list(csv.DictReader(io.StringIO(load('sfx_catalog.csv'))))
BY_ID = {r['id']: r for r in CAT}


def words(s):
    return [w for w in re.split(r'[^a-z0-9]+', s.lower()) if w]


def search(a):
    q = words(' '.join(a.query))
    out = []
    for r in CAT:
        if a.cat and r['category'] != a.cat: continue
        if a.cc0 and r['license'] != 'CC0-1.0': continue
        d = float(r['duration_s'] or 0)
        if a.max and d > a.max: continue
        if a.min and d < a.min: continue
        hay_name, hay = ' '.join(words(r['name'])), ' '.join(words(' '.join([r['name'], r['description'], r['tags'], r['category'], r['pack']])))
        score = 0
        for w in q:
            if re.search(rf'\b{re.escape(w)}', hay_name): score += 3
            elif re.search(rf'\b{re.escape(w)}', hay): score += 1
            else: score -= 2
        if score > 0 or not q: out.append((score, r))
    out.sort(key=lambda x: (-x[0], float(x[1]['duration_s'] or 0)))
    if not out: print('no matches: try fewer or broader words, or `cats` for the categories'); return
    for s, r in out[:a.n]:
        lic = 'CC0' if r['license'] == 'CC0-1.0' else 'CC BY (credit)'
        extra = f"  - {r['description']}" if r['description'] else ''
        print(f"{r['id']:<58} {r['category']:<12} {float(r['duration_s'] or 0):6.2f}s  {lic:<14} {r['pack']}{extra}")
    if len(out) > a.n: print(f'... {len(out) - a.n} more (use -n)')


def get_one(r, out, name=None):
    os.makedirs(out, exist_ok=True)
    dst = os.path.join(out, (name or r['id']) + '.mp3')
    local = os.path.join(HERE, 'synth', r['name'] + '.mp3') if r['pack'] == 'papermorph-synth' else ''
    with tempfile.NamedTemporaryFile(suffix='.' + r['format']) as tmp:
        try:
            if local and os.path.exists(local): tmp.write(open(local, 'rb').read())
            else:
                with urllib.request.urlopen(r['url'], timeout=120) as resp: tmp.write(resp.read())
        except Exception as e:
            print(f"could not download {r['id']}: {e}"); return False
        tmp.flush()
        # trim leading silence, then find the peak and normalise it to -3 dBFS
        pre = 'silenceremove=start_periods=1:start_threshold=-55dB'
        vol = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp.name, '-af', pre + ',volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = re.search(r'max_volume: (-?[\d.]+) dB', vol); gain = -3 - float(m[1]) if m else 0
        r_ = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-af', f'{pre},volume={gain:.2f}dB', '-ar', '44100', '-b:a', '160k', dst])
        if r_.returncode: print(f"could not convert {r['id']}"); return False
    if r['credit']:
        cp = os.path.join(out, 'CREDITS.txt'); have = open(cp).read() if os.path.exists(cp) else ''
        if r['credit'] not in have: open(cp, 'a').write(r['credit'] + '\n')
    print(f"{dst}  ({r['license']})")
    return True


def get(a):
    if a.name and len(a.ids) != 1: sys.exit('--name takes exactly one id')
    bad = [i for i in a.ids if i not in BY_ID]
    if bad: sys.exit('unknown id(s): ' + ', '.join(bad) + ' (find ids with `search`)')
    ok = sum(get_one(BY_ID[i], a.out, a.name) for i in a.ids)
    print(f'{ok} of {len(a.ids)} downloaded')


def kits(a, K=None):
    K = K or json.loads(load('kits.json'))
    if getattr(a, 'kit', None):
        if a.kit not in K: sys.exit('no kit ' + a.kit + '; kits: ' + ', '.join(K))
        ok = sum(get_one(BY_ID[i], a.out) for i in K[a.kit]); print(f'{ok} of {len(K[a.kit])} downloaded'); return
    for k, ids in K.items():
        print(f'{k:<12} {len(ids):3d}  e.g. ' + ', '.join(ids[:4]))


def cats(a):
    from collections import Counter
    for c, n in Counter(r['category'] for r in CAT).most_common(): print(f'{c:<12} {n}')
    print(f'{len(CAT)} sounds')


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sp = p.add_subparsers(dest='cmd', required=True)
s = sp.add_parser('search'); s.add_argument('query', nargs='*'); s.add_argument('--cat'); s.add_argument('--max', type=float); s.add_argument('--min', type=float)
s.add_argument('--cc0', action='store_true'); s.add_argument('-n', type=int, default=25); s.set_defaults(f=search)
g = sp.add_parser('get'); g.add_argument('out'); g.add_argument('ids', nargs='+'); g.add_argument('--name'); g.set_defaults(f=get)
k = sp.add_parser('kit'); k.add_argument('out'); k.add_argument('kit'); k.set_defaults(f=kits)
sp.add_parser('kits').set_defaults(f=kits)
sp.add_parser('cats').set_defaults(f=cats)
a = p.parse_args(); a.f(a)
