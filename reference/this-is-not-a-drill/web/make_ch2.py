"""Chapter 2 (1:47-3:59), storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch2.json (picture) and film/ch2_sfx.json (sound cues [time, sound, volume] and beds)."""
import json
from film_lib import *
F = Film(107.0, 239.0); SFX = []
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
def flatwho(img, who, tint=None):
    r = flat(img, tint); r['who'] = who; r['tint'] = tint if tint is not None else 0xffffff; return r
WARM = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
HFRONT = {'pos': [1.45, 0, 0], 'wall': 1.5}          # Ms. Harlow crouches in front of the class (same as Chapter 1)
HALLDIM = 0x8a93ad                                    # the hallway with the lights down
SIL = 0x0d0f15                                       # whoever is out there: only ever a dark shape from the knees down
DOOR = lambda img='plate_door_close_covered': withplate('door_close', img, who=[])
def feet(n, x0, v=0.80, pace=0.55, tint=SIL, extra=None):
    """legs only: someone walking past in the dim hallway, the camera down at floor level"""
    w = [{'n': n, 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': pace}, 'at': [x0, v]}] + (extra or [])
    return withplate('hallway_side', 'bg_hallway_side_dim', who=w, tint=tint)
def huddle(**m):
    out = moods(**m); h = out[6]
    out[6] = {**(h or {}), **HFRONT}
    return out
SCARED = dict(tyler=('shake', 1.2), dong=('shiver', 1.3), marcus='lookaround', priya='shock', kid_a=('shake', 1.3), kid_b='rock', harlow={'opts': {'mood': 'shake', 'intensity': 0.8}})
LISTEN = dict(tyler=('shake', 1.0), dong=('shiver', 1.1), marcus='lookaround', priya='glance', kid_a='lookaround', kid_b='glance', harlow={'opts': {'mood': 'lookaround'}})
FROZEN = dict(tyler=('shake', 2.0), dong=('shiver', 1.6), marcus='shock', priya='shock', kid_a='terror', kid_b=('shake', 1.6), harlow={'opts': {'mood': 'shock'}})

# 107.0 "They weren't running." - a dark shape's legs walking slowly past, nowhere near a run
F.shot(107.0, 107.99, feet('deputy', 0.22, pace=0.5), cam={'a': {'zoom': 2.6, 'aim': [0.3, 0.70]}, 'b': {'zoom': 2.6, 'aim': [0.4, 0.70]}})
for t in (107.15, 107.75): sfx(t, 'step2', 0.7)
# 107.99 "That's what scared me." - Dong, terrified
F.shot(107.99, 109.49, 'rooms/corner_dark.json', who=huddle(**SCARED), cam=close('dong', 2.6, 3.0))
# 109.49 "In every drill they tell you what to listen for," - everybody listening hard
F.shot(109.49, 112.02, 'rooms/corner_dark.json', who=huddle(**LISTEN), cam={'a': {'zoom': 1.05}, 'b': {'zoom': 1.2, 'aim': [0.45, 0.52]}})
# 112.02 "and nobody ever told us about this." - Dong and Tyler, eyes on the door
F.shot(112.02, 114.39, 'rooms/corner_dark.json', who=huddle(**{**LISTEN, 'dong': ('shiver', 1.3), 'tyler': ('shake', 1.3)}), cam={'a': {'zoom': 2.2, 'aim': [0.21, 0.5]}, 'b': {'zoom': 2.4, 'aim': [0.21, 0.5]}})
# 114.39 "Slow." 115.26 "Even." - one step, then the next, each landing on its word
F.shot(114.39, 115.9, feet('deputy', 0.30, pace=0.45), cam={'a': {'zoom': 3.0, 'aim': [0.36, 0.72]}, 'b': {'zoom': 3.1, 'aim': [0.42, 0.72]}})
sfx(114.42, 'step1', 1.1); sfx(115.28, 'step3', 1.1)
# 115.9 "Like somebody walking to their car on a Sunday." - a dad strolling to his car in the sunshine
SUN = flatwho('bg_sunday_driveway', [{'n': 'parent_a', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.6}, 'at': [0.22, 0.86], 'face': {'mouth': 'grin'}}])
SUN['plate'].update(h=1.5, horizon=0.56)
F.shot(115.9, 118.68, SUN, filter=WARM, cam={'a': {'zoom': 1.12, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.25, 'aim': [0.5, 0.58]}}, overlays=[{'type': 'flash', 't0': 115.9, 't1': 116.3, 'fadeIn': 0.01, 'fadeOut': 0.4, 'alpha': 0.7}])
sfx(115.9, 'whoosh', 0.5); sfx(117.3, 'keys', 0.5)
# 118.68 "And there was something else, something I didn't understand until later." - Dong, working it out
F.shot(118.68, 122.6, 'rooms/corner_dark.json', who=huddle(**{**LISTEN, 'dong': 'glance'}), cam=close('dong', 2.2, 2.9))
sfx(119.0, 'riser', 0.3)
# 122.6 "Every few steps, the footsteps changed." - the shape's legs again
F.shot(122.6, 124.81, feet('deputy', 0.18, pace=0.5), cam={'a': {'zoom': 2.6, 'aim': [0.26, 0.70]}, 'b': {'zoom': 2.6, 'aim': [0.38, 0.70]}})
for t in (122.9, 123.95): sfx(t, 'step2', 0.8)
# 124.81 "Sneakers squeaking on the floor." 126.46 "Then heels, clicking." 127.89 "Then heavy work boots." - the same walk, three different pairs of shoes
for t0, t1, n, snd in [(124.81, 126.46, 'tyler', 'sneakers_c'), (126.46, 127.89, 'district', 'heels_c'), (127.89, 129.2, 'deputy', 'boots_c')]:
    F.shot(t0, t1, feet(n, 0.30, pace=0.55, tint=0x7a8199), cam={'a': {'zoom': 3.2, 'aim': [0.33, 0.73]}, 'b': {'zoom': 3.2, 'aim': [0.41, 0.73]}})
    sfx(t0 + 0.02, snd, 1.3)
# 129.2 "Like whoever it was couldn't decide who they wanted to be." - the legs flicker between the three as it walks
CYC = feet('tyler', 0.30, pace=0.55, tint=0x7a8199, extra=[{'n': 'district', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.55}, 'at': [0.30, 0.80], 'hidden': 1},
                                                          {'n': 'deputy', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.55}, 'at': [0.30, 0.80], 'hidden': 1}])
ev = []
for k, t in enumerate([129.55, 129.85, 130.15, 130.4, 130.62, 130.82]):
    a, b = k % 3, (k + 1) % 3; ev += [{'t': t, 'i': a, 'hide': 1}, {'t': t, 'i': b, 'show': 1}]
F.shot(129.2, 131.04, CYC, events=ev, cam={'a': {'zoom': 3.2, 'aim': [0.33, 0.73]}, 'b': {'zoom': 3.2, 'aim': [0.40, 0.73]}})
for t, s in zip([129.55, 129.85, 130.15, 130.4, 130.62, 130.82], ['heels_c', 'boots_c', 'sneakers_c'] * 2): sfx(t, s, 0.0)   # (picture only; the sound below)
sfx(129.3, 'step1', 0.7); sfx(129.85, 'step3', 0.7); sfx(130.4, 'step2', 0.7); sfx(130.82, 'step1', 0.7)
F.shot(131.04, 132.16, 'rooms/corner_dark.json', who=huddle(**{**SCARED, 'dong': ('shiver', 1.6)}), cam=close('dong', 2.8, 3.1))
# 132.16 "Then the doors." - the hallway, its row of classroom doors
F.shot(132.16, 133.24, withplate('hallway_side', 'bg_hallway_side_dim', who=[], tint=HALLDIM), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.35, 0.5]}})
sfx(132.2, 'hit', 0.4)
# each locked door gets tried: the lever jerks down against the lock and snaps back
def rattle(t, n=8):
    return [{'t': round(t + k * 0.045, 3), 'plate': f'art/{{door}}_lv{a}.png'} for k, a in enumerate([6, 12, 18, 12, 18, 6, 12, 0][:n])]
def door_shot(t0, t1, num, tries, cam):
    d = f'plate_door_hall_{num}'; evs = []
    for tt in tries: evs += [dict(e, plate=e['plate'].replace('{door}', d)) for e in rattle(tt)]
    F.shot(t0, t1, flatwho(f'{d}_lv0', [], tint=0x30364a), plateTint=0x30364a, events=evs, cam=cam)
# 133.24 "Room 208, the handle rattled. Two tries, then nothing."
door_shot(133.24, 137.33, '208', [135.05, 136.15], {'a': {'zoom': 1.0, 'aim': [0.6, 0.45]}, 'b': {'zoom': 1.6, 'aim': [0.63, 0.58]}})
sfx(134.65, 'rattle', 1.5)
# 137.33 "Room 210. Rattle, rattle."
door_shot(137.33, 139.98, '210', [138.2, 138.86], {'a': {'zoom': 1.3, 'aim': [0.62, 0.5]}, 'b': {'zoom': 1.7, 'aim': [0.63, 0.58]}})
sfx(137.8, 'rattle', 1.5); sfx(138.46, 'rattle', 0.0)
SFX[-1] = [138.86 - 0.4, 'rattle', 1.2]
# 139.98 "Room 212, right next door." - and the camera slides on towards ours
door_shot(139.98, 142.17, '212', [140.6], {'a': {'zoom': 1.6, 'aim': [0.63, 0.56]}, 'b': {'zoom': 1.2, 'aim': [0.75, 0.5]}})
sfx(140.2, 'rattle', 1.5)
# 142.17 "And then the footsteps stopped right outside ours." - from inside: the strip of light under our door, then two shadows in it
F.shot(142.17, 144.67, DOOR(), events=[{'t': 143.15, 'plate': 'art/bg_door_close_full.png'}], cam={'a': {'zoom': 1.3, 'aim': [0.45, 0.72]}, 'b': {'zoom': 1.9, 'aim': [0.45, 0.82]}})
for k, t in enumerate([142.25, 142.7, 143.13]): sfx(t, ['step1', 'step2', 'step3'][k], 1.0 + 0.3 * k)
sfx(143.2, 'hit', 0.5)
# 144.67 "The handle went down, slowly, all the way to the lock, and stayed there." - our lever, pressed from outside
HEV = [{'t': round(145.13 + k * (2.09 / 18), 3), 'plate': f'art/bg_handle_inside_lv{-2 * (k + 1)}.png'} for k in range(18)]
F.shot(144.67, 148.61, flat('bg_handle_inside_lv0', tint=0x4f566e), plateTint=0x4f566e, events=HEV, cam={'a': {'zoom': 1.3, 'aim': [0.6, 0.6]}, 'b': {'zoom': 1.55, 'aim': [0.62, 0.66]}, 'ease': 'linear'})
sfx(144.6, 'handle_down', 1.6); sfx(147.25, 'click', 0.7)
# 148.61 "Nobody breathed." - the whole class frozen
F.shot(148.61, 149.92, 'rooms/corner_dark.json', who=huddle(**{**FROZEN, 'harlow': {'opts': {'mood': 'still'}}}), cam={'a': {'zoom': 1.02}, 'b': {'zoom': 1.04}})
# 149.92 "Tyler had both hands over his mouth." - Tyler, both hands clamped over his mouth
F.shot(149.92, 152.13, 'rooms/corner_dark.json', who=[{'card': 'hands_mouth', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 1.4}}] + huddle(**FROZEN)[1:],
       cam=close('tyler', 2.4, 2.7))
# 152.13 "And then three knocks. Soft. Polite." - knock, knock, knock: one on each word
F.shot(152.13, 155.8, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.48]}, 'b': {'zoom': 1.35, 'aim': [0.45, 0.48]}, 'kicks': [152.97, 153.51, 154.1], 'kick': 0.9})
sfx(152.71, 'knocks3_c', 2.5)
# 155.8 THING (in Dawes's voice, through the door): "Ms. Harlow? It's Principal Dawes."
F.shot(155.8, 158.47, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.35, 'aim': [0.45, 0.45]}, 'b': {'zoom': 1.8, 'aim': [0.45, 0.42]}, 'ease': 'linear'})
# 158.47 "It's okay. It's over." - faces lift: hope
HOPE = huddle(tyler='glance', dong={'opts': {'mood': 'calm'}, 'face': {'brows': 'up'}}, marcus='calm', priya='glance', kid_a='calm', kid_b='calm', harlow={'opts': {'mood': 'lookup'}})
F.shot(158.47, 160.38, 'rooms/corner_dark.json', who=HOPE, cam={'a': {'zoom': 1.1, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.25, 'aim': [0.55, 0.5]}})
# 160.38 "You can all come out now."
F.shot(160.38, 162.68, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.45, 0.44]}})
# 162.68 "It was him." - Dong lets himself breathe
F.shot(162.68, 163.84, 'rooms/corner_dark.json', who=HOPE, cam=close('dong', 2.6, 2.8))
# 163.84 "Same voice, same tired, warm, dad voice that reads the lunch menu every morning." - Dawes at his mic, reading the menu (warm memory)
F.shot(163.84, 169.54, room('office', who=[{'n': 'dawes', 'at': [0.86, 0.87], 'card': 'menu', 'clip': 'huddle', 'opts': {'mood': 'still'}}]), filter=WARM,
       cam={'a': {'zoom': 1.3, 'aim': [0.75, 0.5]}, 'b': {'zoom': 2.0, 'aim': [0.84, 0.42]}},
       overlays=[{'type': 'flash', 't0': 163.84, 't1': 164.2, 'fadeIn': 0.01, 'fadeOut': 0.36, 'alpha': 0.8}, {'type': 'flash', 't0': 169.2, 't1': 169.54, 'fadeIn': 0.3, 'fadeOut': 0.01, 'alpha': 0.8}])
sfx(163.84, 'whoosh', 0.5); sfx(164.0, 'pa_chime', 0.4)
# 169.54 "A couple of girls actually started crying, the good kind of crying." - two girls laugh-crying with relief
REL_M = dict(tyler='calm', dong='calm', marcus='calm', priya='calm', kid_a='relief', kid_b='relief', harlow={'opts': {'mood': 'calm'}}); REL = huddle(**REL_M)
F.shot(169.54, 172.94, 'rooms/corner_dark.json', who=REL, cam={'a': {'zoom': 1.6, 'aim': [0.6, 0.5]}, 'b': {'zoom': 1.9, 'aim': [0.61, 0.5]}})
sfx(169.7, 'relief_cry', 1.1)
# 172.94 "Ms. Harlow let out this breath like she'd been holding it for six minutes," - her shoulders drop
F.shot(172.94, 176.48, 'rooms/corner_dark.json', who=REL[:6] + [{'opts': {'mood': 'calm'}, 'face': {'eyes': 'closed'}, **HFRONT}],
       events=[{'t': 174.6, 'i': 6, 'face': {'eyes': 'open'}}], cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.6, 'aim': [0.79, 0.52]}})
sfx(173.55, 'exhale', 1.4)
# 176.48 "and she stood up, smoothed her skirt like she always does before parent night, and started toward the door."
STAND = REL[:6] + [{'card': None, 'view': 'side', 'facing': 1, 'clip': 'sit', 'opts': {'dur': 0.01}, **HFRONT}]
F.shot(176.48, 182.56, 'rooms/corner_dark.json', who=STAND,
       events=[{'t': 176.82, 'i': 6, 'play': 'stand'}, {'t': 177.41, 'i': 6, 'play': 'smooth', 'opts': {'dur': 1.6}}, {'t': 179.1, 'i': 6, 'play': 'idle'},
               {'t': 180.4, 'i': 6, 'view': 'side'}, {'t': 180.4, 'i': 6, 'facing': 1}, {'t': 180.45, 'i': 6, 'play': 'walk', 'opts': {'pace': 0.55}}],
       cam={'a': {'zoom': 1.4, 'aim': [0.78, 0.48]}, 'b': {'zoom': 1.4, 'aim': [0.9, 0.48]}})
sfx(176.9, 'cloth', 0.6); sfx(177.5, 'cloth', 0.5)
for k in range(3): sfx(180.7 + k * 0.62, 'step2', 0.35)
# 182.56 Priya: "He has keys." - she mouths it, shaking
F.shot(182.56, 185.08, 'rooms/corner_dark.json', who=huddle(**{**REL_M, 'priya': {'opts': {'mood': 'shake', 'intensity': 1.2}, 'lip': 'c2_08', 'lipGain': 1.6}, 'kid_a': 'calm', 'kid_b': 'calm', 'harlow': {'hidden': 1}}),
       cam=close('priya', 2.5, 2.7))
# 185.08 "Priya grabbed her sleeve." - her hand shoots up and grabs Ms. Harlow's sleeve
GRAB = huddle(tyler='calm', dong='glance', marcus='calm', kid_a='calm', kid_b='calm', harlow={'card': None, 'view': 'side', 'facing': -1, 'clip': 'idle', 'face': {'eyes': 'wide', 'brows': 'worried'}})
GRAB[3] = {'card': 'grab', 'clip': 'huddle', 'opts': {'mood': 'still'}}
GRAB[6] = {**GRAB[6], 'pos': [0.3, 0, -2.9], 'wall': None}
F.shot(185.08, 186.06, 'rooms/corner_dark.json', who=GRAB, cam={'a': {'zoom': 1.5, 'aim': [0.5, 0.42]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.42]}})
sfx(185.12, 'cloth', 0.9); sfx(185.15, 'hit', 0.35)
# 186.06 "'He has keys,' she whispered." - Priya, close, whispering it up at her
F.shot(186.06, 187.82, 'rooms/corner_dark.json', who=huddle(**{**REL_M, 'priya': {'opts': {'mood': 'shake', 'intensity': 1.0}, 'lip': 'c2_09', 'lipSpans': [[186.06, 186.95]], 'lipGain': 1.6}, 'kid_a': 'calm', 'kid_b': 'calm', 'harlow': {'hidden': 1}}),
       cam=close('priya', 2.8, 3.0, dy=-0.02))
# 187.82 "Principal Dawes has a master key to every room in the building." - the MASTER key ring
F.shot(187.82, 191.32, flat('bg_master_keys'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.6, 'aim': [0.62, 0.55]}, 'ease': 'linear'})
sfx(188.0, 'keys', 0.9)
# 191.32 "If it was really over," - Dong; 192.47 "why was he knocking?" - the shadows under our door
F.shot(191.32, 192.47, 'rooms/corner_dark.json', who=huddle(**SCARED), cam=close('dong', 2.6, 2.9))
F.shot(192.47, 193.72, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.6]}, 'b': {'zoom': 1.9, 'aim': [0.45, 0.75]}})
sfx(192.5, 'riser', 0.55)
# 193.72 the speaker crackles on
F.shot(193.72, 194.42, flat('bg_intercom', tint=0x262b3a), cam={'a': {'zoom': 1.9, 'aim': [0.47, 0.47]}, 'b': {'zoom': 2.1, 'aim': [0.47, 0.47]}})
sfx(193.8, 'pa_on', 1.2)
# 194.42 Dawes, on the intercom, terrified: "Do not open the door. Do not open the door for anyone." 197.82 "Including me."
DW = lambda **k: room('office', who=[{'n': 'dawes', 'at': [0.86, 0.87], 'clip': 'standScared', 'opts': {'mood': 'shake', 'intensity': 1.6}, 'lip': 'c2_10', 'lipGain': 2.2, 'face': {'eyes': 'wide', 'brows': 'worried', 'sweat': 1}, **k}])
F.shot(194.42, 197.82, DW(), cam={'a': {'zoom': 1.4, 'aim': [0.76, 0.5]}, 'b': {'zoom': 2.1, 'aim': [0.85, 0.40]}, 'shake': 1.2})
F.shot(197.82, 199.64, DW(), cam={'a': {'zoom': 2.6, 'aim': [0.86, 0.36]}, 'b': {'zoom': 2.9, 'aim': [0.86, 0.35]}, 'shake': 1.5})
# 199.64 "The intercom."
F.shot(199.64, 200.41, flat('bg_intercom', tint=0x262b3a), cam={'a': {'zoom': 1.7, 'aim': [0.47, 0.47]}, 'b': {'zoom': 1.9, 'aim': [0.47, 0.47]}})
# 200.41 "Same voice, but breathless, terrified," - Dawes gasping at the mic
F.shot(200.41, 202.57, room('office', who=[{'n': 'dawes', 'at': [0.86, 0.87], 'clip': 'standScared', 'opts': {'mood': 'shake', 'intensity': 2.2}, 'face': {'eyes': 'wide', 'brows': 'worried', 'mouth': 'O', 'sweat': 1}}]),
       cam={'a': {'zoom': 2.5, 'aim': [0.86, 0.37]}, 'b': {'zoom': 2.7, 'aim': [0.86, 0.36]}, 'shake': 2})
sfx(200.6, 'breath', 0.6)
# 202.57 "coming from the speaker above our heads," - the class looks up; the camera tilts to the speaker above them
F.shot(202.57, 204.83, 'rooms/corner_dark.json', who=huddle(tyler='lookup', dong='lookup', marcus='lookup', priya='lookup', kid_a='lookup', kid_b='lookup', harlow={'opts': {'mood': 'lookup'}}),
       cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.9, 'aim': [0.69, 0.18]}})
# 204.83 "from the office," - his office; 205.77 "all the way down on the first floor." - down the stairwell, floor by floor
F.shot(204.83, 205.77, DW(lip=None), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.1}})
F.shot(205.77, 207.81, flat('bg_stairwell', tint=0x3a4054), cam={'a': {'zoom': 1.8, 'aim': [0.5, 0.2]}, 'b': {'zoom': 1.8, 'aim': [0.5, 0.8]}, 'ease': 'inout'})
sfx(205.8, 'whoosh', 0.4)
# 207.81 "And then the speaker clicked off," - click
F.shot(207.81, 209.69, flat('bg_intercom', tint=0x262b3a), cam={'a': {'zoom': 2.0, 'aim': [0.47, 0.47]}, 'b': {'zoom': 2.1, 'aim': [0.47, 0.47]}, 'kicks': [208.97], 'kick': 0.5})
sfx(208.97, 'pa_off', 1.3)
# 209.69 "and from the other side of our door, in exactly the same voice, very slowly, someone repeated it." - the door, the two shadows still there
F.shot(209.69, 213.94, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.45, 0.6]}, 'ease': 'linear'})
F.shot(213.94, 215.92, 'rooms/corner_dark.json', who=huddle(**FROZEN), events=[{'t': 214.4, 'flinch': 1.0}], cam={'a': {'zoom': 1.1, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.2, 'aim': [0.5, 0.5]}})
sfx(214.4, 'gasp', 0.6)
# 215.92 THING (through the door, slowly): "Including." 217.56 "Me." - the door goes red
RED = 'saturate(1.3) sepia(0.3) hue-rotate(-25deg) brightness(0.85)'
F.shot(215.92, 217.56, DOOR('bg_door_close_full'), filter=RED, cam={'a': {'zoom': 1.7, 'aim': [0.45, 0.42]}, 'b': {'zoom': 2.0, 'aim': [0.45, 0.42]}, 'ease': 'linear'})
F.shot(217.56, 219.17, DOOR('bg_door_close_full'), filter=RED, cam={'a': {'zoom': 2.4, 'aim': [0.45, 0.40]}, 'b': {'zoom': 2.6, 'aim': [0.45, 0.40]}, 'shake': 1.2})
sfx(215.92, 'boom', 0.8); sfx(217.56, 'hit', 0.8)
# 219.17 "Then the footsteps walked away." - the shadows under the door step out of the light
F.shot(219.17, 220.88, DOOR('bg_door_close_full'), events=[{'t': 219.7, 'plate': 'art/plate_door_close_covered.png'}], cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.8]}, 'b': {'zoom': 1.5, 'aim': [0.45, 0.78]}})
sfx(219.3, 'recede', 1.6)
# 220.88 "Slow. Even. Like it had all the time in the world." - the dark legs stroll off down the hall and out of sight
F.shot(220.88, 224.3, feet('deputy', 0.40, pace=0.45), cam={'a': {'zoom': 2.4, 'aim': [0.45, 0.70]}, 'b': {'zoom': 2.4, 'aim': [0.72, 0.70]}})
# 224.3 "Ms. Harlow sat back down in front of us, very carefully, like the floor might break." - a slow, slow sit
SIT = huddle(**FROZEN); SIT[6] = {'card': None, 'view': 'side', 'facing': -1, 'clip': 'idle', 'face': {'eyes': 'wide', 'brows': 'worried', 'mouth': 'flat'}, 'sideHead': 'scared', **HFRONT}
F.shot(224.3, 228.64, 'rooms/corner_dark.json', who=SIT, events=[{'t': 224.9, 'i': 6, 'play': 'sit', 'opts': {'dur': 2.8}}],
       cam={'a': {'zoom': 1.5, 'aim': [0.75, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.78, 0.5]}})
sfx(225.0, 'cloth', 0.35)
# 228.64 "She didn't look at us. She just stared at the door," - eyes fixed away from us, on the door
F.shot(228.64, 230.91, 'rooms/corner_dark.json', who=huddle(**{**FROZEN, 'harlow': {'opts': {'mood': 'stare', 'look': 1, 'blank': 1}}}), cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.8, 'aim': [0.79, 0.48]}})
# 230.91 "and I watched her lips moving," - her lips, moving without a sound
F.shot(230.91, 233.67, 'rooms/corner_dark.json', who=huddle(**{**FROZEN, 'harlow': {'opts': {'mood': 'whisper'}}}), cam={'a': {'zoom': 3.2, 'aim': [0.79, 0.44]}, 'b': {'zoom': 3.6, 'aim': [0.79, 0.44]}})
sfx(231.0, 'whispers', 0.25)
# 232.56 "...she was counting us. Over and over." - her eyes going along the row, face by face
F.shot(233.67, 235.42, 'rooms/corner_dark.json', who=huddle(**{**FROZEN, 'harlow': {'opts': {'mood': 'whisper'}}}), cam={'a': {'zoom': 1.9, 'aim': [0.7, 0.5]}, 'b': {'zoom': 1.9, 'aim': [0.15, 0.5]}, 'ease': 'linear'})
# 235.42 / 236.24 / 236.9 "Twenty-three." x3 - cuts across the faces, a faint 23 each time
T23 = lambda t, x, y, s: {'type': 'text', 'cls': 'faint', 'text': '23', 'x': x, 'y': y, 'size': s, 'alpha': 0.35, 't0': t, 't1': 239.0, 'fadeIn': 0.15, 'fadeOut': 0.5}
F.shot(235.42, 236.24, 'rooms/corner_dark.json', who=huddle(**FROZEN), cam={'a': {'zoom': 2.2, 'aim': [0.21, 0.5]}, 'b': {'zoom': 2.3, 'aim': [0.21, 0.5]}}, overlays=[T23(235.42, 0.3, 0.3, 140)])
F.shot(236.24, 236.9, 'rooms/corner_dark.json', who=huddle(**FROZEN), cam={'a': {'zoom': 2.2, 'aim': [0.5, 0.5]}, 'b': {'zoom': 2.3, 'aim': [0.5, 0.5]}}, overlays=[T23(235.42, 0.3, 0.3, 140), T23(236.24, 0.72, 0.22, 160)])
F.shot(236.9, 239.0, 'rooms/corner_dark.json', who=huddle(**{**FROZEN, 'harlow': {'opts': {'mood': 'whisper'}}}), cam={'a': {'zoom': 2.6, 'aim': [0.79, 0.47]}, 'b': {'zoom': 3.0, 'aim': [0.79, 0.46]}},
       overlays=[T23(235.42, 0.3, 0.3, 140), T23(236.24, 0.72, 0.22, 160), T23(236.9, 0.25, 0.78, 180), {'type': 'black', 't0': 238.2, 't1': 239.1, 'fadeIn': 0.7, 'fadeOut': 0.01}])
add_lighting(F)
F.save('ch2')
SFX = [x for x in SFX if x[2] > 0]
BEDS = [[107.0, 148.61, 'room_dark', 0.16], [107.0, 148.61, 'dread_bed', 0.26], [107.0, 115.9, 'huddle_cry', 0.16], [118.68, 122.6, 'huddle_cry', 0.16],
        [107.0, 107.99, 'hall', 0.35], [114.39, 115.9, 'hall', 0.35], [122.6, 142.17, 'hall', 0.35],
        [115.9, 118.68, 'exterior', 0.35],
        # 148.61 "Nobody breathed": everything drops out to a bare room tone
        [148.61, 152.13, 'room_dark', 0.06],
        [152.13, 239.0, 'room_dark', 0.16], [152.13, 163.84, 'dread_bed', 0.22], [158.47, 160.38, 'whispers', 0.08],
        [163.84, 169.54, 'class', 0.3], [169.54, 182.56, 'whispers', 0.07],
        [182.56, 193.72, 'dread_bed', 0.24], [182.56, 193.72, 'huddle_cry', 0.14],
        [193.72, 209.69, 'pa_hum', 0.14], [193.72, 239.0, 'dread_bed', 0.3], [209.69, 239.0, 'huddle_cry', 0.2], [228.64, 239.0, 'whispers', 0.07]]
SFX += [[148.65, 'heart', 0.55], [149.3, 'heart', 0.5], [149.95, 'heart', 0.45], [150.6, 'heart', 0.45], [151.25, 'heart', 0.4],
        [109.6, 'breath', 0.3], [131.1, 'breath', 0.35], [191.4, 'breath', 0.35], [224.4, 'teeth', 0.25], [204.0, 'gasp', 0.0]]
SFX = [x for x in SFX if x[2] > 0]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch2_sfx.json', 'w'), indent=1)
print(len(SFX), 'sound cues,', len(BEDS), 'beds')
