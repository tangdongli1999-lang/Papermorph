"""Chapter 4 (5:42-7:46), "Tyler", storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch4.json (picture) and film/ch4_sfx.json (sound cues [time, sound, volume] and beds)."""
import json
from film_lib import *
F = Film(342.0, 465.6); SFX = []
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
def flatwho(img, who, tint=None):
    r = flat(img, tint); r['who'] = who; r['tint'] = tint if tint is not None else 0xffffff; return r
WARM = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
MEMORY = 'sepia(0.35) saturate(0.8) brightness(1.05) contrast(0.9)'
RED = 'saturate(1.3) sepia(0.3) hue-rotate(-25deg) brightness(0.85)'
HFRONT = {'pos': [1.45, 0, 0], 'wall': 1.5}
SIL, HALL, MIMIC = 0x0d0f15, 0x30364a, 0x4a5064
CORNER = 'rooms/corner_dark.json'
DOOR = lambda img='plate_door_close_covered': withplate('door_close', img, who=[])
W = json.load(open('/home/claude/lockdown/vo/words.json'))
def caption(line, t0, t1, size=84, y=0.56, x=0.45, rng=None):
    ws = [[w[0], w[2].strip('"')] for w in W[line] if rng is None or rng[0] <= w[0] < rng[1]]
    return {'type': 'words', 'words': ws, 'max': 5, 'x': x, 'y': y, 'size': size, 't0': t0, 't1': t1, 'fadeIn': 0.05, 'fadeOut': 0.05}
FEARS = ['shiver', 'terror', 'shock', 'sob', 'lookaround', 'headshake', 'shake']
def fearify(name, v):
    if isinstance(v, dict) and ('lip' in v or 'card' in v): return v
    mood, inten = (v[0], v[1]) if isinstance(v, tuple) else (v, 1.0) if isinstance(v, str) else (v.get('opts', {}).get('mood'), v.get('opts', {}).get('intensity', 1.0)) if isinstance(v, dict) else (None, 1)
    if mood not in ('shiver', 'shake', 'terror', 'shock', 'rock'): return v
    k = ORDER.index(name); out = {'opts': {'mood': 'fear', 'list': FEARS[k:] + FEARS[:k], 'intensity': inten}}
    if isinstance(v, dict): out = {**v, 'opts': {**v.get('opts', {}), **out['opts']}}
    return out
def huddle(**m):
    m = {n: (fearify(n, v) if n != 'harlow' else v) for n, v in m.items()}
    out = moods(**m); out[6] = {**(out[6] or {}), **HFRONT}
    return out
AFRAID = dict(tyler=('shake', 1.0), dong=('shiver', 1.0), marcus='shock', priya='shock', kid_a=('shake', 1.1), kid_b='rock', harlow={'opts': {'mood': 'shake', 'intensity': 0.7}})
# walkers whose feet land on given times (same as Chapter 2)
GAIT = dict(stride=0.8, arms=0.6, knee=0.9, lean=0.5, armOut=0, elbow=0.8, bounce=0, head=0)
def walker(n, at, t0, first, period, scale=1.0, warm=0.8):
    ph = (period / 2 - (first - t0 + warm)) % period
    w = {'n': n, 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {**GAIT, 'pace': 1 / (1.8 * period), 'phase': ph}, 'at': at}
    if scale != 1.0: w['scale'] = scale
    return w
FOLLOW = lambda zoom=2.6, v=0.70: {'a': {'zoom': zoom, 'aim': [0.3, v]}, 'b': {'zoom': zoom, 'aim': [0.3, v]}, 'follow': 0}
def legs_at_door(num, n, t0, t1, knocks, scale=1.0, cam=None, plain=False):
    """the thing at another classroom's door, wearing someone's legs, knocking (the camera low, legs only)"""
    img = f'plate_door_hall_{num}' + ('' if plain else '_lv0')
    w = {'n': n, 'view': 'side', 'facing': 1, 'clip': 'knock', 'at': [0.215, 0.985]}
    if scale != 1.0: w['scale'] = scale
    F.shot(t0, t1, flatwho(img, [w], tint=MIMIC), plateTint=HALL, cam=cam or {'a': {'zoom': 2.0, 'aim': [0.3, 0.8]}, 'b': {'zoom': 2.1, 'aim': [0.32, 0.8]}, 'kicks': knocks, 'kick': 0.5})
    for t in knocks: sfx(t, 'knock', 0.9)
GLITCH = lambda t0, t1: {'type': 'flicker', 't0': t0, 't1': t1, 'rate': 22, 'on': 0.4, 'alpha': 0.9, 'fadeIn': 0.01, 'fadeOut': 0.01}

# 342.0 "For the next hour, it went from door to door down the whole floor." - the dark legs walking the hallway, past door after door
F.shot(342.0, 346.04, withplate('hallway_side', 'bg_hallway_side_dim', who=[walker('deputy', [0.05, 0.80], 342.0, 342.3, 0.75)], tint=SIL), cam=FOLLOW(2.2, 0.68))
for k, t in enumerate([342.3 + 0.75 * i for i in range(5)]): sfx(t, f'boot{1 + k % 2}', 0.8)
sfx(344.25, 'knock', 0.5); sfx(344.51, 'knock', 0.5)
# 346.04 "We could hear it trying voices" - the corner, listening
F.shot(346.04, 347.42, CORNER, who=huddle(**{**AFRAID, 'marcus': 'lookaround', 'priya': 'lookaround'}), cam={'a': {'zoom': 1.1, 'aim': [0.45, 0.52]}, 'b': {'zoom': 1.2, 'aim': [0.45, 0.52]}})
# 347.42 "like someone trying on coats." - at a door, the legs change from one person to the next, one after another
COATS = [walker(n, [0.3, 0.80], 347.42, 347.6, 0.6, scale=s) for n, s in [('parent_a', 1.0), ('parent_b', 1.80 / 1.66), ('deputy', 1.80 / 1.83), ('kid_a', 1.0)]]
for i, w in enumerate(COATS):
    w['clip'] = 'idle'; w.pop('opts')
    if i: w['hidden'] = 1; w['tie'] = 0
ev, cur = [], 0
for t, i in [(347.75, 1), (348.05, 2), (348.35, 3), (348.65, 0)]: ev += [{'t': t, 'i': cur, 'hide': 1}, {'t': t, 'i': i, 'show': 1}]; cur = i
F.shot(347.42, 349.02, withplate('hallway_side', 'bg_hallway_side_dim', who=COATS, tint=MIMIC), events=ev, cam={'a': {'zoom': 2.6, 'aim': [0.3, 0.72]}, 'b': {'zoom': 2.7, 'aim': [0.3, 0.72]}})
for t in (347.75, 348.05, 348.35, 348.65): sfx(t, 'glitch', 0.4)
# 349.02 "Coach Reyes." 349.88 "The lunch lady." 350.79 "Somebody's little sister, asking for her brother by name." - each at a different door, knocking
legs_at_door('204', 'parent_a', 349.02, 349.88, [349.2, 349.45], plain=True)
legs_at_door('206', 'parent_b', 349.88, 350.79, [350.05, 350.3], plain=True)
legs_at_door('216', 'kid_a', 350.79, 353.78, [351.0, 351.25, 351.5], scale=0.85, plain=True)
sfx(352.4, 'whispers', 0.25)
# 353.78 "Every so often, one of the voices would get something slightly wrong," - the legs at a door; the picture glitches on "wrong"
DOORLEGS = flatwho('plate_door_hall_212_lv0', [{'n': 'parent_b', 'view': 'side', 'facing': 1, 'clip': 'idle', 'at': [0.215, 0.985], 'scale': 1.80 / 1.66}], tint=MIMIC)
F.shot(353.78, 357.22, DOORLEGS, plateTint=HALL, cam={'a': {'zoom': 1.9, 'aim': [0.3, 0.78]}, 'b': {'zoom': 2.1, 'aim': [0.3, 0.8]}}, overlays=[GLITCH(356.6, 356.95)])
sfx(356.62, 'glitch', 0.9)
# 357.22 "a word too slow," (everything slows: a held, stretched beat) 358.37 "a laugh in the wrong place," (glitch)
F.shot(357.22, 358.37, CORNER, who=huddle(**{**AFRAID, 'dong': 'shock', 'tyler': 'shock'}), filter='blur(0.6px) brightness(0.9)', cam={'a': {'zoom': 1.6, 'aim': [0.25, 0.5]}, 'b': {'zoom': 1.62, 'aim': [0.25, 0.5]}, 'ease': 'linear'})
F.shot(358.37, 359.7, DOORLEGS, plateTint=HALL, cam={'a': {'zoom': 2.1, 'aim': [0.3, 0.8]}, 'b': {'zoom': 2.2, 'aim': [0.3, 0.8]}}, overlays=[GLITCH(359.0, 359.35)])
sfx(359.0, 'glitch', 0.9)
# 359.7 "and it would stop," - the legs vanish: nothing; 360.63 "and try again," - back, flickering; 361.42 "and get it right." - still and steady
F.shot(359.7, 362.67, DOORLEGS, plateTint=HALL, events=[{'t': 359.9, 'i': 0, 'hide': 1}, {'t': 360.82, 'i': 0, 'show': 1}],
       cam={'a': {'zoom': 2.2, 'aim': [0.3, 0.8]}, 'b': {'zoom': 2.4, 'aim': [0.3, 0.8]}}, overlays=[GLITCH(360.82, 361.3)])
sfx(359.9, 'click', 0.5); sfx(360.85, 'glitch', 0.7); sfx(361.9, 'hit', 0.4)
# 362.67 "At noon" - the clock: 12:00
F.shot(362.67, 363.6, flat('bg_intercom'), overlays=[{'type': 'clock', 't0': 362.67, 't1': 363.6, 'h': 11, 'm': 20, 'h2': 12, 'm2': 0, 't2': 362.8, 'dur': 0.6, 'label': '12:00 PM', 'dark': True, 'fadeIn': 0.01, 'fadeOut': 0.01}])
# 363.6 "it came back to us." - the shadows step back into the light under our door
F.shot(363.6, 364.49, DOOR('plate_door_arrive_start'), events=[{'t': round(363.65 + k * 0.09, 3), 'plate': f'art/plate_door_arrive_{k}.png'} for k in range(8)],
       cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.78]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.8]}})
sfx(363.9, 'boot1', 1.0); sfx(364.3, 'boot2', 1.3)
# 364.49 "Three knocks, soft, polite." - one on each word
F.shot(364.49, 366.6, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.48]}, 'b': {'zoom': 1.35, 'aim': [0.45, 0.48]}, 'kicks': [364.78, 365.36, 365.89], 'kick': 0.9})
for t in (364.78, 365.36, 365.89): sfx(t, 'knock', 1.6)
# 366.6 "And then a voice we all knew, crying." - every face turns to the door
F.shot(366.6, 370.62, CORNER, who=huddle(**{n: {'opts': {'mood': 'lookat', 'look': 1}} for n in ORDER}), cam={'a': {'zoom': 1.05}, 'b': {'zoom': 1.15, 'aim': [0.5, 0.5]}})
sfx(368.21, 'huddle_cry', 0.0)
# 370.62 THING, in Tyler's voice, crying: "Guys? Guys, it's me, it's Tyler. I was in the bathroom when it started. Please open the door. It's right behind me, it's right behind me, please!"
CAP18 = caption('c4_18', 370.5, 379.5)
F.shot(370.62, 373.7, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.48]}, 'b': {'zoom': 1.4, 'aim': [0.45, 0.48]}, 'ease': 'linear'}, overlays=[CAP18])
F.shot(373.7, 376.97, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.4, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.5]}, 'ease': 'linear'}, overlays=[CAP18])
F.shot(376.97, 379.5, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.75, 'aim': [0.45, 0.5]}, 'shake': 2.2, 'kicks': [377.2, 377.5, 377.8, 378.1, 378.4, 378.7], 'kick': 0.8}, overlays=[CAP18])
sfx(377.15, 'pound', 1.8)
# 379.5 (the pounding stops) - the class, frozen
F.shot(379.5, 381.31, CORNER, who=huddle(**{**AFRAID, 'tyler': ('terror', 1.2)}), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.05}})
# 381.31 "Twenty-two heads turned at the same time to look at Tyler." - every head snaps to Tyler
LOOK = huddle(tyler=('headshake', 1.6), dong={'opts': {'mood': 'lookat', 'look': 1}}, **{n: {'opts': {'mood': 'lookat', 'look': -1}} for n in ['marcus', 'priya', 'kid_a', 'kid_b', 'harlow']})
F.shot(381.31, 384.73, CORNER, who=LOOK, events=[{'t': 381.4, 'flinch': 0.6}], cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.27, 0.5]}})
sfx(381.5, 'cloth', 0.6)
# 384.73 "And Tyler was right there, in the corner, between Marcus and me," 388.66 "shaking his head so hard his teeth were rattling."
F.shot(384.73, 388.66, CORNER, who=LOOK, cam={'a': {'zoom': 2.0, 'aim': [0.25, 0.5]}, 'b': {'zoom': 2.2, 'aim': [0.25, 0.5]}})
F.shot(388.66, 391.65, CORNER, who=huddle(**{**AFRAID, 'tyler': ('headshake', 2.2)}), cam=close('tyler', 2.8, 3.1))
sfx(389.0, 'teeth', 0.9)
# 391.65 "He'd only said one thing all morning. One joke, when we first got in the corner." - the memory: Tyler leaning over, whispering his joke
F.shot(391.65, 396.6, CORNER, who=huddle(tyler={'opts': {'mood': 'whisper'}}, dong=('shiver', 0.8), marcus='lookaround', priya='shock', kid_a=('shake', 0.8), kid_b='rock', harlow={'opts': {'mood': 'shake', 'intensity': 0.6}}),
       events=[{'t': 392.0, 'i': 0, 'lean': -14, 'dur': 0.5}], filter=MEMORY, cam=close('tyler', 2.3, 2.5),
       overlays=[{'type': 'flash', 't0': 391.65, 't1': 392.0, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.7}])
sfx(391.7, 'whoosh', 0.5); sfx(394.3, 'whispers', 0.35)
# 396.6 "That was enough." - Tyler, now, terrified
F.shot(396.6, 398.35, CORNER, who=huddle(**{**AFRAID, 'tyler': ('terror', 1.4)}), cam=close('tyler', 3.0, 3.2))
sfx(396.9, 'hit', 0.7)
# 398.35 THING, Tyler's voice: "Please. Please. Pl—" - red on the door, cut off mid-word
CAP20 = caption('c4_20', 398.3, 403.0, size=120)
F.shot(398.35, 401.51, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.48]}, 'b': {'zoom': 2.2, 'aim': [0.45, 0.46]}, 'ease': 'in'}, overlays=[CAP20])
# 401.51 "Pl—" cut off - 403.0 "And then it stopped crying." - silence on the door
F.shot(401.51, 405.0, DOOR('bg_door_close_full'), cam={'a': {'zoom': 2.2, 'aim': [0.45, 0.46]}, 'b': {'zoom': 2.25, 'aim': [0.45, 0.46]}}, overlays=[CAP20])
# 405.0 "Just like that, mid-word," / 406.92 "like someone switching off a radio." - a radio clicked off
F.shot(405.0, 406.92, CORNER, who=huddle(**{**AFRAID, 'dong': 'shock', 'tyler': 'shock', 'marcus': 'shock'}), cam={'a': {'zoom': 1.4, 'aim': [0.3, 0.5]}, 'b': {'zoom': 1.45, 'aim': [0.3, 0.5]}})
F.shot(406.92, 409.15, flat('bg_radio', tint=0x3e3e48), cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.5]}},
       events=[{'t': 408.08, 'plateTint': 0x1c1c22}])
sfx(406.95, 'radio_off', 1.1)
# 409.15 "And very softly, through the door, in Tyler's voice, it laughed." - the door, close; the laugh
F.shot(409.15, 413.03, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.6]}, 'b': {'zoom': 2.3, 'aim': [0.45, 0.62]}, 'ease': 'linear'})
sfx(412.17, 'laugh', 1.3)
# 413.03 "Tyler started crying then, for real, the quiet kind, with his face pressed into his knees," 418.16 "and Marcus put a hand on his back."
TY = huddle(**AFRAID); TY[0] = {'card': 'face_knees', 'clip': 'huddle', 'opts': {'mood': 'sob', 'intensity': 1.0}}
F.shot(413.03, 418.16, CORNER, who=TY, cam=close('tyler', 2.6, 2.8))
sfx(413.2, 'huddle_cry', 0.35)
TY2 = list(TY); TY2[2] = {'opts': {'mood': 'stare', 'look': -1, 'blank': 1}}   # (until the hand-on-his-back pose can be drawn: Marcus leans in close to him)
F.shot(418.16, 420.27, CORNER, who=TY2, events=[{'t': 418.3, 'i': 2, 'lean': -12, 'dur': 0.6}], cam={'a': {'zoom': 2.3, 'aim': [0.29, 0.5]}, 'b': {'zoom': 2.4, 'aim': [0.29, 0.5]}})
# 420.27 "Nobody said it, but we were all thinking the same thing." - faces, one after another, all the same thought
F.shot(420.27, 423.38, CORNER, who=huddle(**{**AFRAID, 'tyler': {'card': 'face_knees', 'clip': 'huddle', 'opts': {'mood': 'sob'}}}), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.7, 0.5]}, 'ease': 'linear'})
# 423.38 "Tyler had said one sentence. Just one." - the memory of the joke, one more time, faded
F.shot(423.38, 426.27, CORNER, who=huddle(tyler={'opts': {'mood': 'whisper'}}, dong=('shiver', 0.8), marcus='lookaround'), events=[{'t': 423.5, 'i': 0, 'lean': -14, 'dur': 0.4}],
       filter=MEMORY + ' blur(0.6px)', cam=close('tyler', 2.6, 2.7), overlays=[{'type': 'flash', 't0': 423.38, 't1': 423.7, 'fadeIn': 0.01, 'fadeOut': 0.3, 'alpha': 0.6}])
# 426.27 "And now it owned his voice." - the door, red
F.shot(426.27, 428.43, DOOR('bg_door_close_full'), filter=RED, cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.45]}, 'b': {'zoom': 2.0, 'aim': [0.45, 0.45]}, 'ease': 'linear'})
sfx(427.44, 'boom', 0.7)
# 428.43 "I thought about everything I'd said that morning. Every answer in class." - Dong answering in class (warm memory)
F.shot(428.43, 432.43, 'rooms/class_students.json', filter=WARM, cam={'a': {'zoom': 1.6, 'aim': [0.3, 0.6]}, 'b': {'zoom': 2.0, 'aim': [0.28, 0.58]}},
       overlays=[{'type': 'flash', 't0': 428.43, 't1': 428.8, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.7}])
sfx(428.45, 'whoosh', 0.5); sfx(429.0, 'class', 0.3)
# 432.43 "The phone call." - whispering into the hidden phone (red)
F.shot(432.43, 433.26, CORNER, who=huddle(**{**AFRAID, 'dong': {'card': 'phone_discreet', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 0.5}}}), filter=RED, cam=close('dong', 3.0, 3.1, dy=0.06))
# 433.26 "Every word." - Dong, terrified, hand going to his mouth
F.shot(433.26, 434.2, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'terror', 'intensity': 1.3}}}), cam=close('dong', 2.8, 3.0))
# 434.2 "Then I saw the corner of the black paper on the window had peeled down, just a little, just a triangle of glass."
F.shot(434.2, 440.47, DOOR('plate_door_close_peeled'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.4]}, 'b': {'zoom': 2.6, 'aim': [0.39, 0.17]}, 'ease': 'inout'})
sfx(437.4, 'paper', 0.4)
# 440.47 "And I know the rule. I know." - Dong
F.shot(440.47, 442.48, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'rock', 'intensity': 0.6}}}), cam=close('dong', 2.7, 2.9))
# 442.48 "But I had to know what it was." - his eyes go to the door
F.shot(442.48, 444.21, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'stare', 'look': 1, 'blank': 1}}}), cam=close('dong', 2.9, 3.1))
# 444.21 "I crawled closer and looked through the gap." - Dong crawls toward the door
F.shot(444.21, 446.58, CORNER, who=huddle(**{**AFRAID, 'dong': {'card': 'crawl', 'clip': 'huddle', 'opts': {'mood': 'still'}}}),
       events=[{'t': 444.3, 'i': 1, 'slide': [1.3, 0.4], 'dur': 2.1}], cam={'a': {'zoom': 1.9, 'aim': [0.2, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.35, 0.58]}})
sfx(444.4, 'cloth', 0.6); sfx(445.2, 'cloth', 0.5)
# 446.58 "And the hallway was empty. Completely empty, all the way to the stairs." - through the triangle of glass
TRI = 'polygon(30% 8%, 72% 14%, 40% 92%)'
F.shot(446.58, 451.0, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.48]}, 'b': {'zoom': 1.8, 'aim': [0.5, 0.42]}, 'ease': 'inout'})
# 451.0 "Nothing at our door. Nothing anywhere." - the floor right outside our door: empty
F.shot(451.0, 453.1, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 1.6, 'aim': [0.72, 0.75]}, 'b': {'zoom': 1.2, 'aim': [0.5, 0.5]}})
# 453.1 "But the shadow of two feet under our door didn't move." - inside: the two shadows, still there
F.shot(453.1, 456.5, DOOR('plate_door_shift_7'), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.8]}, 'b': {'zoom': 2.2, 'aim': [0.45, 0.86]}, 'ease': 'linear'})
for k in range(4): sfx(453.4 + k * 0.7, 'heart', 0.6)
# 456.5 "And then, from right there, right on the other side of the glass, where nothing was standing," - the empty glass, closer and closer
F.shot(456.5, 461.4, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.48]}, 'b': {'zoom': 2.6, 'aim': [0.48, 0.45]}, 'ease': 'in'})
sfx(458.0, 'riser', 0.5)
# 461.4 "it whispered my name." 463.51 THING: "Dong." - red, on the glass
F.shot(461.4, 465.6, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 2.6, 'aim': [0.48, 0.45]}, 'b': {'zoom': 2.8, 'aim': [0.48, 0.45]}, 'kicks': [463.55], 'kick': 0.8},
       overlays=[caption('c4_22', 463.4, 465.6, size=170, y=0.5, x=0.48), {'type': 'black', 't0': 464.9, 't1': 465.7, 'fadeIn': 0.6, 'fadeOut': 0.01}])
sfx(461.6, 'creepy_whisper', 0.6); sfx(463.52, 'hit', 0.9)
add_lighting(F)
F.save('ch4')
BEDS = [[342.0, 465.6, 'room_dark', 0.16], [342.0, 362.67, 'hall', 0.3], [342.0, 370.62, 'dread_bed', 0.24], [346.04, 362.67, 'huddle_cry', 0.12],
        [366.6, 381.31, 'huddle_cry', 0.2], [381.31, 398.35, 'dread_bed', 0.28], [384.73, 398.35, 'huddle_cry', 0.16],
        # 403 "it stopped crying": a dead silence, then only room tone and dread
        [409.15, 465.6, 'dread_bed', 0.3], [413.03, 428.43, 'huddle_cry', 0.2], [428.43, 432.43, 'class', 0.25],
        [446.58, 453.1, 'hall', 0.3], [456.5, 465.6, 'hall', 0.3]]
SFX += [[346.1, 'breath', 0.3], [366.7, 'gasp', 0.6], [381.35, 'gasp', 0.5], [440.5, 'breath', 0.35], [453.2, 'breath', 0.4]]
SFX = [x for x in SFX if x[2] > 0]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch4_sfx.json', 'w'), indent=1)
print(len(SFX), 'sound cues,', len(BEDS), 'beds')
