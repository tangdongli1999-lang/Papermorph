"""Chapter 3 (3:59-5:42), "The Group Chat", storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch3.json (picture) and film/ch3_sfx.json (sound cues [time, sound, volume] and beds)."""
import json
from film_lib import *
F = Film(239.0, 342.0); SFX = []
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
def flatwho(img, who, tint=None):
    r = flat(img, tint); r['who'] = who; r['tint'] = tint if tint is not None else 0xffffff; return r
WARM = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
RED = 'saturate(1.3) sepia(0.3) hue-rotate(-25deg) brightness(0.85)'
HFRONT = {'pos': [1.45, 0, 0], 'wall': 1.5}
SIL = 0x0d0f15
HALL = 0x30364a                       # the hallway plates, lights down
CORNER = 'rooms/corner_dark.json'
DOOR = lambda img='plate_door_close_covered': withplate('door_close', img, who=[])
# ---------- frightened kids: a new kind of fear about every 2 s, each on their own clock (director's note 32) ----------
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
STILL = dict(tyler=('shake', 0.4), dong=('shiver', 0.4), marcus=('shock', 0.4), priya=('shock', 0.4), kid_a=('shake', 0.4), kid_b=('rock', 0.4), harlow={'opts': {'mood': 'still'}})
def legs_standing(x=0.35, tint=SIL):
    return withplate('hallway_side', 'bg_hallway_side_dim', who=[{'n': 'deputy', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [x, 0.80]}], tint=tint)
# phone screens are the only light now: a soft glow at each kid's lap in the wide shots
GLOW = lambda t0, t1, n=6: {'type': 'glow', 't0': t0, 't1': t1, 'spots': [[x, y - 0.02, 230] for x, y in LAPS[:n] if x != 0.82], 'fadeIn': 0.4, 'fadeOut': 0.1}
DIM = lambda t0, t1, a=0.6: {'type': 'black', 'alpha': a, 't0': t0, 't1': t1, 'fadeIn': 0.2, 'fadeOut': 0.1}
def chat(t0, t1, msgs, title='Room 214 🦅', keep=5): return {'type': 'chat', 't0': t0, 't1': t1, 'msgs': msgs, 'title': title, 'keep': keep, 'fadeIn': 0.2, 'fadeOut': 0.1}
def hdoor(num, t0, t1, cam, events=None, img=None):
    F.shot(t0, t1, flatwho(img or f'plate_door_hall_{num}_lv0', [], tint=HALL), plateTint=HALL, cam=cam, events=events or [])
J, M, E, K, S2, R10 = '#ffb86b', '#7ee0a3', '#c79bff', '#ff8fb1', '#ffd36b', '#ff6b6b'
CRAZY = [{'t': 247.5, 'name': 'Marcus', 'text': 'is this real??', 'color': M}, {'t': 247.8, 'name': 'Jayden', 'text': 'my mom is texting me', 'color': J},
         {'t': 248.1, 'name': 'Ava', 'text': 'is anyone hurt', 'color': E}, {'t': 248.4, 'name': 'Leo', 'text': 'pls someone say something', 'color': S2},
         {'t': 248.7, 'name': 'Mia', 'text': "we're in the gym closet", 'color': M}, {'t': 249.0, 'name': 'Ethan', 'text': 'omg omg omg', 'color': E}]
MSG1 = CRAZY + [{'t': 249.73, 'name': 'Jayden', 'text': 'Is anyone else hearing knocking?', 'color': J},
                {'t': 251.79, 'name': 'Mia', 'text': "It's in the science wing.", 'color': M},
                {'t': 253.22, 'name': 'Ethan', 'text': 'It said it was the nurse.', 'color': E}]
KAYLA = {'t': 257.49, 'name': 'Kayla · Room 208', 'text': "Coach Reyes is outside. He says it's clear. We're opening.", 'color': K, 'seen': 261.5}
MSG2 = MSG1 + [KAYLA]
MORE = MSG2 + [{'t': 270.9, 'name': 'Leo', 'text': 'anyone??', 'color': S2}, {'t': 271.3, 'name': 'Ava', 'text': 'kayla answer', 'color': E}, {'t': 271.7, 'name': 'Marcus', 'text': 'KAYLA', 'color': M}]
SOFIA = {'t': 272.38, 'name': 'Sofia', 'text': "Something knocked on 204 in Mr. Kim's voice. Mr. Kim is IN 204.", 'color': S2}
MSG3 = MORE + [SOFIA, {'t': 276.68, 'name': 'Ethan', 'text': 'It knows our names.', 'color': E}, {'t': 278.47, 'name': 'Jayden', 'text': 'Why is nobody coming?', 'color': J}]
R210 = {'t': 283.35, 'name': 'Room 210', 'text': "Don't talk. It's listening. It only knows voices it's heard.", 'color': R10, 'alert': True}

# 239.0 "For an hour," - the clock crawls from 10:20 to 11:20 (lights off)
F.shot(239.0, 240.14, flat('bg_intercom'), overlays=[{'type': 'clock', 't0': 239.0, 't1': 240.14, 'h': 10, 'm': 20, 'h2': 11, 'm2': 20, 't2': 239.3, 'dur': 0.8, 'label': '11:20 AM', 'dark': True, 'fadeIn': 0.01, 'fadeOut': 0.01}])
for k in range(4): sfx(239.3 + k * 0.2, 'tick', 0.5)
# 240.14 "nobody moved." - the corner, frozen; only the shaking
F.shot(240.14, 241.16, CORNER, who=huddle(**STILL), cam={'a': {'zoom': 1.02}, 'b': {'zoom': 1.05}})
# 241.16 "Then the phones started." - a phone lights up under someone's knees
F.shot(241.16, 242.66, flat('bg_phone_lap2'), cam={'a': {'zoom': 1.05, 'aim': [0.55, 0.5]}, 'b': {'zoom': 1.2, 'aim': [0.6, 0.45]}},
       overlays=[{'type': 'black', 'alpha': 0.85, 't0': 241.16, 't1': 241.6, 'fadeIn': 0.01, 'fadeOut': 0.3}])
sfx(241.5, 'buzz', 1.4)
# 242.66 "Everyone had them on silent," - silent mode on
F.shot(242.66, 244.49, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.7, 'aim': [0.45, 0.55]}},
       overlays=[DIM(242.66, 244.49, 0.5), {'type': 'phone', 't0': 242.66, 't1': 244.49, 'flip': 242.7, 'time': '11:20', 'fadeIn': 0.12, 'fadeOut': 0.1}])
sfx(243.2, 'buzz', 0.9)
# 244.49 "but you could see the glow," - screens glowing in every lap
F.shot(244.49, 245.81, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.06}}, overlays=[GLOW(244.49, 245.81)])
# 245.81 "under knees" / 246.55 "and in sleeves,"
F.shot(245.81, 246.55, flat('bg_phone_lap2'), cam={'a': {'zoom': 1.15, 'aim': [0.6, 0.45]}, 'b': {'zoom': 1.25, 'aim': [0.62, 0.45]}})
F.shot(246.55, 247.35, flat('bg_phone_sleeve'), cam={'a': {'zoom': 1.1, 'aim': [0.6, 0.6]}, 'b': {'zoom': 1.25, 'aim': [0.65, 0.62]}})
sfx(246.6, 'buzz', 0.8)
# 247.35 "and the class group chat was going crazy." then the messages, each on its words
F.shot(247.35, 254.63, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.55]}},
       overlays=[DIM(247.35, 254.63), chat(247.35, 254.63, MSG1)])
for m in MSG1: sfx(m['t'], 'buzz', 0.45)
# 254.63 "And then one from Kayla in Room 208." - Room 208's door in the dark hallway
hdoor('208', 254.63, 257.49, {'a': {'zoom': 1.0, 'aim': [0.6, 0.45]}, 'b': {'zoom': 1.4, 'aim': [0.72, 0.35]}})
# 257.49 "Coach Reyes is outside. He says it's clear." - her message
F.shot(257.49, 260.08, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.55, 'aim': [0.45, 0.55]}},
       overlays=[DIM(257.49, 260.08), chat(257.49, 260.08, MSG2, keep=3)])
sfx(257.5, 'buzz', 0.6)
# 260.08 "We're opening." - 208's handle goes down and the door swings open into the dark
hdoor('208', 260.08, 260.84, {'a': {'zoom': 1.3, 'aim': [0.62, 0.55]}, 'b': {'zoom': 1.2, 'aim': [0.6, 0.5]}},
      events=[{'t': 260.12, 'plate': 'art/plate_door_hall_208_lv12.png'}, {'t': 260.2, 'plate': 'art/plate_door_hall_208_lv18.png'}, {'t': 260.45, 'plate': 'art/plate_door_hall_208_open.png'}])
sfx(260.15, 'click', 0.8); sfx(260.45, 'door_open', 0.9)
# 260.84 "And after that, nothing from Kayla." - her message sits there: Seen, no reply
F.shot(260.84, 262.73, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.55, 'aim': [0.45, 0.55]}},
       overlays=[DIM(260.84, 262.73), chat(260.84, 262.73, MSG2, keep=3)])
# 262.73 "Nothing from anyone in 208. Ever." - the open door, the dark inside, slowly closer
hdoor('208', 262.73, 265.17, {'a': {'zoom': 1.1, 'aim': [0.6, 0.5]}, 'b': {'zoom': 1.9, 'aim': [0.82, 0.5]}, 'ease': 'linear'}, img='plate_door_hall_208_open')
sfx(264.66, 'hit', 0.7)
# 265.17 "Ms. Harlow saw the screens and," - her eyes go to the glowing laps
F.shot(265.17, 266.55, CORNER, who=huddle(**{**AFRAID, 'harlow': {'opts': {'mood': 'glance'}}}), cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.5, 'aim': [0.79, 0.5]}})
# 266.55 "for once, she didn't take" - (any other day: Ms. Harlow confiscating a phone, warm memory)
F.shot(266.55, 267.87, room('classroom_day', who=[{'n': 'harlow', 'card': 'confiscate', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.40, 0.93]}]), filter=WARM,
       cam={'a': {'zoom': 1.3, 'aim': [0.42, 0.55]}, 'b': {'zoom': 1.5, 'aim': [0.40, 0.5]}}, overlays=[{'type': 'flash', 't0': 266.55, 't1': 266.9, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.8}])
sfx(266.56, 'whoosh', 0.5)
# 267.87 "a single phone." - back in the dark: she just looks, and lets them be
F.shot(267.87, 269.0, CORNER, who=huddle(**{**AFRAID, 'harlow': {'opts': {'mood': 'stare', 'look': -1, 'blank': 1}}}), cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.6, 'aim': [0.79, 0.5]}})
# 269.0 "She just pulled hers out too." - Ms. Harlow, crouched, her own screen lighting her face
F.shot(269.0, 270.68, CORNER, who=huddle(**{**AFRAID, 'harlow': {'card': 'floor_phone', 'clip': 'huddle', 'opts': {'mood': 'shake', 'intensity': 0.6}}}),
       cam={'a': {'zoom': 2.2, 'aim': [0.79, 0.52]}, 'b': {'zoom': 2.4, 'aim': [0.79, 0.52]}}, overlays=[{'type': 'glow', 't0': 269.0, 't1': 270.68, 'spots': [[0.5, 0.45, 520]], 'fadeIn': 0.3, 'fadeOut': 0.1}])
# 270.68 "And the messages kept coming."
F.shot(270.68, 272.38, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.55, 'aim': [0.45, 0.55]}},
       overlays=[DIM(270.68, 272.38), chat(270.68, 272.38, MORE)])
for m in MORE[-3:]: sfx(m['t'], 'buzz', 0.45)
# 272.38 "Something knocked on 204 in Mr. Kim's voice." - three knocks on 204's door
hdoor('204', 272.38, 275.61, {'a': {'zoom': 1.0, 'aim': [0.55, 0.5]}, 'b': {'zoom': 1.3, 'aim': [0.6, 0.5]}, 'kicks': [273.18, 273.5, 273.82], 'kick': 0.8}, img='plate_door_hall_204')
for t in (273.18, 273.5, 273.82): sfx(t, 'knock', 1.4)
# 275.61 "Mr. Kim is IN 204." 276.68 "It knows our names." 278.47 "Why is"
F.shot(275.61, 279.4, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.55]}},
       overlays=[DIM(275.61, 279.4), chat(275.61, 279.4, MSG3, keep=4)])
for t in (275.62, 276.68, 278.47): sfx(t, 'buzz', 0.5)
# 279.4 "nobody coming?" - the window: the parking lot outside, empty, no lights, no one
F.shot(279.4, 281.09, flat('bg_window_view_dark'), cam={'a': {'zoom': 1.1, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.3, 'aim': [0.5, 0.42]}, 'ease': 'linear'})
# 281.09 "Then a message from someone in 210."
hdoor('210', 281.09, 283.35, {'a': {'zoom': 1.0, 'aim': [0.6, 0.45]}, 'b': {'zoom': 1.3, 'aim': [0.7, 0.4]}})
# 283.35 "Don't talk."
F.shot(283.35, 284.75, CORNER, who=huddle(**AFRAID), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.55, 'aim': [0.45, 0.55]}},
       overlays=[DIM(283.35, 284.75), chat(283.35, 284.75, MSG3 + [R210], keep=2)])
sfx(283.36, 'buzz', 0.6)
# 284.75 "It's listening." - out in the hallway, the dark legs standing perfectly still
F.shot(284.75, 285.93, legs_standing(0.4), cam={'a': {'zoom': 2.8, 'aim': [0.4, 0.73]}, 'b': {'zoom': 3.0, 'aim': [0.4, 0.74]}})
# 285.93 "It only knows voices it's heard." - everyone in the corner shuts their mouth; Ms. Harlow's finger on her lips
SH = huddle(**AFRAID); SH[0] = {'card': 'hands_mouth', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 1.2}}; SH[6] = {'card': 'shush', 'clip': 'huddle', 'opts': {'mood': 'still'}, **HFRONT}
F.shot(285.93, 287.43, CORNER, who=SH, cam={'a': {'zoom': 1.05}, 'b': {'zoom': 1.12, 'aim': [0.5, 0.52]}}, overlays=[GLOW(285.93, 287.43)])
sfx(286.6, 'shh', 0.3)
# 287.43 "And I remembered that every time someone knocks," - Dong, putting it together
F.shot(287.43, 288.99, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'glance'}}}), cam=close('dong', 2.6, 2.9))
# 288.99 "...someone knocks" - the knocks from before, flashing past: a teacher, a friend, Mom
for (t0, t1), n in zip([(288.99, 289.4), (289.4, 289.8), (289.8, 290.15)], ['parent_b', 'kid_b', 'mom']):
    F.shot(t0, t1, flatwho('plate_door_hall_214', [{'n': n, 'view': 'side', 'facing': 1, 'clip': 'knock', 'at': [0.215, 0.985], 'face': {'eyes': 'open', 'mouth': 'grin'}}], tint=0xe8e4dc),
           filter=RED, warm=0.35, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.04}}, overlays=[{'type': 'flash', 't0': t0, 't1': t0 + 0.12, 'fadeIn': 0.01, 'fadeOut': 0.1, 'alpha': 0.6}])
    sfx(t0 + 0.05, 'knock', 1.1)
# 290.15 "the voice on the other side is someone you know." - our door, the shadows still under it
F.shot(290.15, 292.71, DOOR('bg_door_close_full'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.6]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.72]}, 'ease': 'linear'})
# 292.71 "Someone it's heard." - the speaker it heard Dawes through
F.shot(292.71, 294.15, flat('bg_intercom', tint=0x262b3a), cam={'a': {'zoom': 1.8, 'aim': [0.47, 0.47]}, 'b': {'zoom': 2.2, 'aim': [0.47, 0.47]}})
# 294.15 "It wasn't guessing. It was learning," - the legs outside, listening
F.shot(294.15, 296.17, legs_standing(0.4), cam={'a': {'zoom': 2.6, 'aim': [0.42, 0.72]}, 'b': {'zoom': 3.1, 'aim': [0.4, 0.74]}, 'ease': 'linear'})
sfx(294.2, 'riser', 0.4)
# 296.17 "and we'd been feeding it." - our whispers, all along
FEED = huddle(**AFRAID); FEED[0] = {'opts': {'mood': 'whisper'}}; FEED[4] = {'opts': {'mood': 'whisper'}}; FEED[2] = {'opts': {'mood': 'whisper'}}
F.shot(296.17, 297.47, CORNER, who=FEED, cam={'a': {'zoom': 1.3, 'aim': [0.35, 0.5]}, 'b': {'zoom': 1.4, 'aim': [0.4, 0.5]}})
sfx(296.2, 'whispers', 0.5)
# 297.47 "And this is the part I'd take back if I could." - Dong, close
F.shot(297.47, 300.1, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'sob', 'intensity': 0.6}}}), cam=close('dong', 2.5, 2.9))
# 300.1 "My mom had texted me twelve times." - his screen: twelve texts from Mom
MOM = [{'t': 300.2 + k * 0.17, 'text': x} for k, x in enumerate(['are you ok', 'baby answer me', 'i saw the news', 'is it your school', 'please answer', 'Dong??', 'are you safe',
                                                                     'call me', 'im coming', 'they wont let us in', 'please', 'i love you'])]
F.shot(300.1, 302.35, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'shock'}}}), cam=close('dong', 2.4, 2.5),
       overlays=[DIM(300.1, 302.35), chat(300.1, 302.35, MOM, title='Mom ❤️  (12)', keep=8)])
for m in MOM[::3]: sfx(m['t'], 'buzz', 0.5)
# 302.35 "So I called her."
F.shot(302.35, 303.34, CORNER, who=huddle(**AFRAID), cam=close('dong', 2.4, 2.5), overlays=[DIM(302.35, 303.34), {'type': 'call', 't0': 302.35, 't1': 303.34, 'name': 'Mom', 'initial': 'M', 'fadeIn': 0.15, 'fadeOut': 0.1}])
sfx(302.4, 'ringback', 1.0)
# 303.34 "I know." - his face: he knows
F.shot(303.34, 304.03, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'rock', 'intensity': 0.5}}}), cam=close('dong', 2.9, 3.0))
# 304.03 "I put my hand over the phone and I whispered so quietly." - phone to his ear, hand cupped round it
PHONE = lambda **o: huddle(**{**AFRAID, 'dong': {'card': 'phone_live', 'clip': 'huddle', **o}})
WHISPER = huddle(**{**AFRAID, 'dong': {'card': 'phone_whisper', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 0.5}}})
F.shot(304.03, 307.54, CORNER, who=WHISPER, cam=close('dong', 2.4, 2.8))
# 307.54 Dong (whispering): "Mom, I'm okay. We're in 214. I love you. I'll call you after." - mouthed, word for word
# (a tight close-up on his face so every word is visible; the phone's light on his cheek)
F.shot(307.54, 310.22, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'shake', 'intensity': 0.4}, 'lip': 'c3_15', 'lipGain': 1.5}}), cam=close('dong', 3.6, 3.8, dy=0.03),
       overlays=[{'type': 'glow', 't0': 307.54, 't1': 310.22, 'spots': [[0.36, 0.62, 420]], 'fadeIn': 0.2, 'fadeOut': 0.1}])
# 310.22 "I love you. I'll call you after." - Mom, in her kitchen, phone to her ear, hearing it
MOMK = lambda **o: room('kitchen_mom', who=[{'n': 'mom', 'at': [0.5, 0.8], 'card': 'phone_live', 'clip': 'huddle', **o}])
F.shot(310.22, 312.49, MOMK(opts={'mood': 'holdcry'}), cam={'a': {'zoom': 1.6, 'aim': [0.5, 0.49]}, 'b': {'zoom': 1.9, 'aim': [0.5, 0.48]}})
# 312.49 "She didn't say anything back." 314.51 "I could just hear her breathing, fast, the way she breathes when she's trying not to cry,"
F.shot(312.49, 319.79, MOMK(opts={'mood': 'holdcry'}), cam={'a': {'zoom': 2.0, 'aim': [0.5, 0.47]}, 'b': {'zoom': 2.6, 'aim': [0.5, 0.46]}, 'ease': 'linear'})
sfx(314.4, 'mombreath', 0.9)
# 319.79 "and then she whispered 'okay, baby,'" - her lips on "okay, baby"
F.shot(319.79, 321.96, MOMK(opts={'mood': 'holdcry'}, lip='c3_16', lipSpans=[[320.92, 321.96]], lipGain=1.4), cam={'a': {'zoom': 2.7, 'aim': [0.5, 0.455]}, 'b': {'zoom': 2.8, 'aim': [0.5, 0.455]}})
# 321.96 "and I hung up" - the call ends
F.shot(321.96, 322.9, CORNER, who=huddle(**AFRAID), cam=close('dong', 2.4, 2.5),
       overlays=[DIM(321.96, 322.9), {'type': 'call', 't0': 321.96, 't1': 322.9, 'name': 'Mom', 'initial': 'M', 'answer': 307.4, 'end': 322.46, 'fadeIn': 0.05, 'fadeOut': 0.1}])
sfx(322.46, 'click', 0.8)
# 322.9 "before she could hear me crying too." - Dong crying
F.shot(322.9, 324.79, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'sob', 'intensity': 1.2}}}), cam=close('dong', 2.6, 2.9))
sfx(323.0, 'huddle_cry', 0.4)
# 324.79 "Priya looked at me like I'd just set off a firework." - Priya, horrified, staring at him
F.shot(324.79, 327.5, CORNER, who=huddle(**{**AFRAID, 'priya': {'opts': {'mood': 'stare', 'look': -1}}}), cam={'a': {'zoom': 2.0, 'aim': [0.32, 0.5]}, 'b': {'zoom': 2.2, 'aim': [0.34, 0.5]}})
sfx(324.8, 'hit', 0.5)
# 327.5 "And out in the hallway," - the dim hallway, toward Room 214
F.shot(327.5, 329.13, flat('bg_hallway_dim'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.75, 0.45]}, 'ease': 'in'})
# 329.13 "right outside our door," - outside 214: the dark legs, standing at our door
F.shot(329.13, 330.32, flatwho('plate_door_hall_214', [{'n': 'deputy', 'view': 'side', 'facing': 1, 'clip': 'idle', 'at': [0.2, 0.985]}], tint=0x050608), plateTint=HALL,
       cam={'a': {'zoom': 2.4, 'aim': [0.32, 0.82]}, 'b': {'zoom': 2.5, 'aim': [0.32, 0.82]}})
# 330.32 "something that had been completely silent for an hour" - inside: the shadows under our door, not moving
F.shot(330.32, 333.03, DOOR('plate_door_shift_0'), cam={'a': {'zoom': 1.4, 'aim': [0.45, 0.74]}, 'b': {'zoom': 1.9, 'aim': [0.45, 0.82]}, 'ease': 'linear'})
# 333.03 "shifted its weight." - one shadow lifts and sets down again
F.shot(333.03, 334.18, DOOR('plate_door_shift_0'), events=[{'t': round(333.1 + k * 0.09, 3), 'plate': f'art/plate_door_shift_{k + 1}.png'} for k in range(7)],
       cam={'a': {'zoom': 1.9, 'aim': [0.45, 0.82]}, 'b': {'zoom': 1.95, 'aim': [0.45, 0.82]}, 'kicks': [333.1], 'kick': 0.5})
sfx(333.05, 'weight', 1.8)
# 334.18 "It had been standing there the whole time."
F.shot(334.18, 336.33, DOOR('plate_door_shift_7'), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.7]}, 'b': {'zoom': 1.2, 'aim': [0.45, 0.6]}, 'ease': 'linear'})
for k in range(3): sfx(334.4 + k * 0.62, 'heart', 0.55)
# 336.33 "And now it had my voice." - Dong, terrified
F.shot(336.33, 338.09, CORNER, who=huddle(**{**AFRAID, 'dong': {'opts': {'mood': 'terror', 'intensity': 1.2}}}), cam=close('dong', 2.6, 3.1))
sfx(337.29, 'hit', 0.7)
# 338.09 "My name." - Dong on the phone, saying it; 338.97 "My mom." - Mom; 339.77 "And our room number." - 214
F.shot(338.09, 338.97, CORNER, who=WHISPER, filter=RED, cam=close('dong', 2.6, 2.7))
F.shot(338.97, 339.77, MOMK(opts={'mood': 'holdcry'}), filter=RED, cam={'a': {'zoom': 2.4, 'aim': [0.5, 0.46]}, 'b': {'zoom': 2.5, 'aim': [0.5, 0.46]}})
F.shot(339.77, 342.0, flat('plate_door_hall_214', tint=HALL), filter=RED, cam={'a': {'zoom': 1.8, 'aim': [0.76, 0.29]}, 'b': {'zoom': 2.6, 'aim': [0.76, 0.29]}, 'ease': 'in'},
       overlays=[{'type': 'black', 't0': 341.2, 't1': 342.1, 'fadeIn': 0.7, 'fadeOut': 0.01}])
sfx(338.1, 'hit', 0.6); sfx(338.97, 'hit', 0.6); sfx(339.8, 'boom', 0.9)
add_lighting(F)
F.save('ch3')
BEDS = [[239.0, 342.0, 'room_dark', 0.16], [239.0, 330.32, 'dread_bed', 0.24], [240.14, 241.16, 'huddle_cry', 0.12],
        [241.16, 300.1, 'buzzbed', 0.12], [244.49, 300.1, 'huddle_cry', 0.14], [247.35, 283.35, 'whispers', 0.06],
        [254.63, 265.17, 'hall', 0.3], [272.38, 275.61, 'hall', 0.3], [281.09, 283.35, 'hall', 0.3], [284.75, 285.93, 'hall', 0.35], [294.15, 296.17, 'hall', 0.35],
        [310.22, 322.0, 'room_class', 0.08],
        [327.5, 330.32, 'hall', 0.35],
        # 330.32 "completely silent": everything drops to a bare room tone until the weight shifts
        [333.03, 342.0, 'dread_bed', 0.32], [336.33, 342.0, 'huddle_cry', 0.18]]
SFX += [[240.2, 'breath', 0.3], [287.5, 'breath', 0.35], [297.6, 'breath', 0.3], [336.4, 'gasp', 0.5]]
SFX = [x for x in SFX if x[2] > 0]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch3_sfx.json', 'w'), indent=1)
print(len(SFX), 'sound cues,', len(BEDS), 'beds')
