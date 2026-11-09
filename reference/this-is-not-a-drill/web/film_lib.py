"""Shared helpers for the chapter shot lists."""
import json
R = lambda n: json.load(open(f'/home/claude/lockdown/web/rooms/{n}.json'))
def empty(n, **k): r = R(n); r['who'] = []; r.update(k); return r
def flat(img, tint=None, filt=None):
    p = {'img': f'art/{img}.png', 'fov': 40, 'h': 1.0, 'pitch': 0, 'horizon': 0.97}
    if tint is not None: p['tint'] = tint
    return {'plate': p, 'who': []}
DARK = 0x8790ad
# the corner huddle: 0 tyler, 1 dong, 2 marcus, 3 priya, 4 kid_a, 5 kid_b, 6 harlow (Tyler sits between Dong and Marcus)
HU = {'dong': (0.165, 0.50), 'tyler': (0.25, 0.49), 'marcus': (0.34, 0.47), 'priya': (0.45, 0.52), 'kid_a': (0.555, 0.52), 'kid_b': (0.66, 0.50), 'harlow': (0.86, 0.49), 'clock': (0.885, 0.17)}
LAPS = [(0.25, 0.66), (0.165, 0.66), (0.34, 0.66), (0.45, 0.68), (0.555, 0.68), (0.66, 0.68), (0.82, 0.72)]
ORDER = ['tyler', 'dong', 'marcus', 'priya', 'kid_a', 'kid_b', 'harlow']
def moods(**m):
    out = []
    for n in ORDER:
        v = m.get(n)
        if v is None: out.append(None)
        elif isinstance(v, dict): out.append(v)
        elif isinstance(v, tuple): out.append({'opts': {'mood': v[0], 'intensity': v[1]}})
        else: out.append({'opts': {'mood': v}})
    return out
def close(name, zoom=2.4, zoom2=None, dy=0.0):
    a = HU[name]; return {'a': {'zoom': zoom, 'aim': [a[0], a[1] + dy]}, 'b': {'zoom': zoom2 or zoom * 1.08, 'aim': [a[0], a[1] + dy]}}
class Film:
    def __init__(self, t0, t1): self.t0, self.t1, self.S = t0, t1, []
    def shot(self, t0, t1, room, **k): self.S.append({'t0': t0, 't1': t1, 'room': room, **k}); return self
    def save(self, name):
        S = self.S
        assert abs(S[0]['t0'] - self.t0) < 1e-6 and abs(S[-1]['t1'] - self.t1) < 1e-6, (S[0]['t0'], S[-1]['t1'])
        for a, b in zip(S, S[1:]): assert abs(a['t1'] - b['t0']) < 1e-6, (a['t1'], b['t0'])
        for s in S: assert s['t1'] > s['t0'], s
        import re, os   # every picture and room the chapter asks for must exist (a missing one used to hang the render)
        miss = [u for u in set(re.findall(r'(?:art|rooms)/[A-Za-z0-9_\-./]+\.(?:png|json)', json.dumps(S))) if not os.path.exists('/home/claude/lockdown/web/' + u)]
        assert not miss, f'missing files: {miss}'
        for s in S:   # a room handed over whole must name everyone in it
            if isinstance(s['room'], dict): assert all(w.get('n') for w in s['room'].get('who', [])), ('unnamed actor', s['t0'])
        json.dump({'t0': self.t0, 't1': self.t1, 'shots': S}, open(f'/home/claude/lockdown/web/film/{name}.json', 'w'), indent=1)
        print(name, len(S), 'shots', round(self.t1 - self.t0, 2), 's')

# ---------- ambience lighting, chosen from the place and whether the lights are on ----------
def _img(shot):
    r = shot['room']
    if isinstance(r, str): r = json.load(open('/home/claude/lockdown/web/' + r))
    return r['plate']['img'].split('/')[-1].replace('.png', '')
def lights(img, t0, t1, dark=False):
    """Light only where something in the picture gives light. The paintings already carry their own daylight (window light on the
    floor, the doorway beam), so nothing is added in daylight. In the dark: the room falls off into shadow, and only visible sources
    glow: the strip of hallway light under a door, a flickering tube in a hallway, the red EXIT sign, a lamp (LAMPS below), a phone."""
    L = lambda **o: dict(o, t0=t0, t1=t1, fadeIn=o.pop('fi', 0.01), fadeOut=o.pop('fo', 0.01), follow=True)
    if img in ('bg_classroom_dark', 'plate_corner_dark'):   # lights off: only the grey daylight through the closed blinds (painted); edges sink into shadow
        return [L(type='pool', x=0.45, y=0.55, rx=60, ry=65, glow=0.0, dark=0.5, blue=25)]
    if 'door_close' in img and (dark or 'covered' in img or img == 'bg_door_close' or 'full' in img):
        return [L(type='pool', x=0.45, y=0.97, rx=38, ry=14, glow=0.18, color='255,220,160', dark=0.4)]   # the hallway light under the door
    if 'hallway_side_dim' in img:   # dim hallway seen side-on: only the ceiling tube, buzzing
        return [L(type='tube', glow=0.0, stable=0.88, alpha=0.4)]
    if 'hallway_dim' in img or 'hallway_floor' in img:
        return [L(type='tube', glow=0.0, stable=0.88, alpha=0.4), L(type='pool', x=0.5, y=0.33, rx=6, ry=8, glow=0.22, color='255,70,60')]   # dying tubes, the EXIT sign
    if img in LAMPS:
        x, y, r = LAMPS[img]; return [L(type='pool', x=x, y=y, rx=r, ry=r * 1.3, glow=0.3, color='255,200,130', dark=0.6)]
    return []
LAMPS = {}   # plate -> (x, y, reach) of a lit lamp, e.g. the bedroom nightstand lamp at night
def add_lighting(F):
    for s in F.S:
        img = _img(s); ov = s.setdefault('overlays', [])
        swap = [e for e in s.get('events', []) if e.get('plate')]
        if swap:   # the lights go off mid-shot: day light until the swap, dark light after
            ts = swap[0]['t']; ov[:0] = lights(img, s['t0'], ts) + lights(swap[0]['plate'].split('/')[-1].replace('.png', ''), ts, s['t1'], dark=True)
        else:
            dark = s.get('tint') == DARK or (isinstance(s['room'], dict) and s['room'].get('tint') == DARK)
            ov[:0] = lights(img, s['t0'], s['t1'], dark)
