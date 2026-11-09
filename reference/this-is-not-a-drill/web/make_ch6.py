"""Chapter 6 (9:34-11:34), "Lock Your Door", storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch6.json (picture) and film/ch6_sfx.json (sound cues [time, sound, volume] and beds)."""
import json
from film_lib import *
F = Film(574.3, 697.68); SFX = []   # the voice-over ends later now: 'it... isn't... me.' is spoken slowly, with silences
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
MEMORY = 'sepia(0.35) saturate(0.8) brightness(1.05) contrast(0.9)'
WARM = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
RED = 'saturate(1.3) sepia(0.3) hue-rotate(-25deg) brightness(0.85)'
GREY = 'grayscale(0.85) contrast(1.15) brightness(0.9)'
MIMIC = 0x4a5064
W = json.load(open('/home/claude/lockdown/vo/words.json'))
def words(line, a, b, strip=True): return [[w[0], w[2].strip('"') if strip else w[2]] for w in W[line] if a <= w[0] < b]
def caption(line, t0, t1, a=None, b=None, size=90, y=0.5, x=0.45, mx=5):
    return {'type': 'words', 'words': words(line, a if a is not None else t0 - 0.2, b if b is not None else t1), 'max': mx, 'x': x, 'y': y, 'size': size, 't0': t0, 't1': t1, 'fadeIn': 0.05, 'fadeOut': 0.05}
DIM = lambda t0, t1, a=0.88: {'type': 'black', 'alpha': a, 't0': t0, 't1': t1, 'fadeIn': 0.2, 'fadeOut': 0.1}
# his bedroom at night: the door close-up (light strip clear / two feet standing in it); the whole room with Dong in bed
DOORN = lambda feet=True: flat('bg_bedroom_door_night' if feet else 'bg_bedroom_door_night_clear')
BED = lambda card='bed_sit', **k: room('bedroom_night', who=[{'n': 'dong', 'card': card, 'at': [0.2, 0.84], **k}])
EVE = lambda who: withplate('bedroom_evening', 'plate_bedroom_evening_nobed', who=who)
DAY = lambda **k: room('bedroom_day', who=[{'n': 'dong', 'card': 'floor_tired', 'at': [0.8, 0.8], **k}])
CORNER = 'rooms/corner_dark.json'
FEARS = ['shiver', 'terror', 'shock', 'sob', 'lookaround', 'headshake', 'shake']
AFRAID = [{'opts': {'mood': 'fear', 'list': FEARS[k:] + FEARS[:k], 'intensity': 0.9}} for k in range(6)] + [{'opts': {'mood': 'shake', 'intensity': 0.7}}]

# 574.3 "That night, my mom made me grilled cheese," - Mom on the edge of his bed, Dong eating
F.shot(574.3, 577.2, EVE([{'n': 'mom', 'card': 'bed_cheese', 'at': [0.2, 0.86]}]), cam={'a': {'zoom': 1.6, 'aim': [0.22, 0.6]}, 'b': {'zoom': 1.75, 'aim': [0.22, 0.6]}},
       overlays=[{'type': 'black', 't0': 574.3, 't1': 574.9, 'fadeIn': 0.01, 'fadeOut': 0.5}])
# 577.2 "and sat on my bed until I was almost asleep," - she strokes his hair, his eyes closing
F.shot(577.2, 579.7, EVE([{'n': 'mom', 'card': 'bed_sleepy', 'at': [0.2, 0.86]}]), cam={'a': {'zoom': 1.75, 'aim': [0.22, 0.6]}, 'b': {'zoom': 2.0, 'aim': [0.2, 0.6]}, 'ease': 'linear'})
# 579.7 "and on her way out" - Dong asleep in bed; Mom walks to the door
F.shot(579.7, 581.2, EVE([{'n': 'dong', 'card': 'bed_asleep', 'at': [0.18, 0.86]}, {'n': 'mom', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.55}, 'at': [0.42, 0.8]}]),
       events=[{'t': 579.75, 'i': 1, 'runTo': [0.8, 0.77], 'then': 'idle'}], cam={'a': {'zoom': 1.05, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.15, 'aim': [0.6, 0.5]}})
sfx(579.9, 'step1', 0.3); sfx(580.5, 'step2', 0.3)
# 581.2 "she said something she has never said to me in seventeen years." - at the door, hand on it, she turns back to him, worried
F.shot(581.2, 585.16, EVE([{'n': 'dong', 'card': 'bed_asleep', 'at': [0.18, 0.86]}, {'n': 'mom', 'view': 'front', 'clip': 'idle', 'at': [0.8, 0.77], 'face': {'brows': 'worried', 'mouth': 'flat'}}]),
       cam={'a': {'zoom': 1.6, 'aim': [0.72, 0.42]}, 'b': {'zoom': 2.0, 'aim': [0.78, 0.36]}, 'ease': 'linear'})
# 585.16 MOM: "Lock your door tonight, honey." - she says it, mouthed
F.shot(585.16, 587.94, EVE([{'n': 'dong', 'card': 'bed_asleep', 'at': [0.18, 0.86]}, {'n': 'mom', 'view': 'front', 'clip': 'idle', 'at': [0.8, 0.77], 'lip': 'c6_27', 'lipGain': 1.6, 'face': {'brows': 'worried'}}]),
       cam={'a': {'zoom': 2.4, 'aim': [0.8, 0.33]}, 'b': {'zoom': 2.6, 'aim': [0.8, 0.32]}})
sfx(587.6, 'door_open', 0.3)
# 587.94 "So I did." - his hand presses the lock in; click
F.shot(587.94, 588.62, flat('bg_bedroom_lock'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.45]}, 'b': {'zoom': 1.35, 'aim': [0.42, 0.42]}, 'kicks': [588.28], 'kick': 0.5})
sfx(588.28, 'lock', 1.0)
# 588.62 "And at three in the morning," - the dark bedroom, the alarm clock at 3:00
F.shot(588.62, 590.21, BED('bed_asleep'), cam={'a': {'zoom': 1.1, 'aim': [0.35, 0.55]}, 'b': {'zoom': 1.3, 'aim': [0.3, 0.55]}},
       overlays=[{'type': 'text', 'text': '3:00 AM', 'x': 0.86, 'y': 0.1, 'size': 52, 'color': '#ff4a3a', 't0': 588.7, 't1': 590.21, 'fadeIn': 0.15, 'fadeOut': 0.01}])
# 590.21 "I woke up to three knocks." - he jolts up on the first knock; the room shakes with each
F.shot(590.21, 591.21, BED('bed_asleep'), events=[{'t': 590.45, 'i': 0, 'card': 'bed_sit'}, {'t': 590.45, 'flinch': 0.8}],
       cam={'a': {'zoom': 1.6, 'aim': [0.22, 0.5]}, 'b': {'zoom': 1.7, 'aim': [0.22, 0.5]}, 'kicks': [590.45, 590.75, 591.05], 'kick': 0.6})
for t in (590.45, 590.75, 591.05): sfx(t, 'knock', 1.4)
# 591.21 "Soft." 591.79 "Polite." - the door, a soft nudge on each word
F.shot(591.21, 593.24, DOORN(), cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.52]}, 'kicks': [591.25, 591.82], 'kick': 0.3})
# 593.24 THING, Mom's voice: "Dong? It's Mom. Can you open the door, sweetheart? I just want to check on you." - red on the door, word by word
CAP29 = caption('c6_29', 593.2, 599.59, size=84)
F.shot(593.24, 596.11, DOORN(), cam={'a': {'zoom': 1.35, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.48, 0.48]}, 'ease': 'linear'}, overlays=[CAP29])
# 596.11 "...sweetheart?" - Dong, his face crumpling: it's her voice
F.shot(596.11, 597.08, BED('bed_sit'), cam={'a': {'zoom': 2.6, 'aim': [0.2, 0.42]}, 'b': {'zoom': 2.8, 'aim': [0.2, 0.42]}})
F.shot(597.08, 599.59, DOORN(), cam={'a': {'zoom': 1.6, 'aim': [0.48, 0.48]}, 'b': {'zoom': 1.8, 'aim': [0.48, 0.5]}, 'ease': 'linear'}, overlays=[CAP29])
sfx(593.3, 'riser', 0.25)
# 599.59 "It was perfect." - Dong
F.shot(599.59, 600.58, BED('bed_sit'), cam={'a': {'zoom': 2.6, 'aim': [0.2, 0.42]}, 'b': {'zoom': 2.7, 'aim': [0.2, 0.42]}})
# 600.58 "Her voice." - the door
F.shot(600.58, 601.42, DOORN(), cam={'a': {'zoom': 1.5, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.58]}})
# 601.42 "The way she says sweetheart, a little bit too long, like she's tired." - (memory) Mom at home, tired, saying it
F.shot(601.42, 605.12, room('kitchen_mom', who=[{'n': 'mom', 'at': [0.5, 0.8], 'clip': 'talk', 'face': {'brows': 'worried'}}]), filter=WARM,
       cam={'a': {'zoom': 2.0, 'aim': [0.5, 0.42]}, 'b': {'zoom': 2.3, 'aim': [0.5, 0.4]}, 'ease': 'linear'}, overlays=[{'type': 'flash', 't0': 601.42, 't1': 601.75, 'fadeIn': 0.01, 'fadeOut': 0.3, 'alpha': 0.6}])
sfx(601.45, 'whoosh', 0.4)
# 605.12 "I could even hear her keys jingling," - the keys, jingling, behind the door
F.shot(605.12, 606.62, flat('bg_duck_keys', tint=0xb0a8a0), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.3, 'aim': [0.45, 0.5]}, 'shake': 0.8})
sfx(605.4, 'keys', 1.0)
# 606.62 "the little rubber duck keychain I gave her in fifth grade." - in on the duck
F.shot(606.62, 609.45, flat('bg_duck_keys', tint=0xb0a8a0), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.6]}, 'b': {'zoom': 2.6, 'aim': [0.5, 0.66]}, 'ease': 'inout'})
sfx(607.6, 'keys', 0.5)
# 609.45 "Every single part of me wanted to open that door, because it was my mom," - he sits up, crying, reaching for the door
F.shot(609.45, 613.55, BED('bed_sit'), events=[{'t': 610.85, 'i': 0, 'card': 'bed_reach'}], cam={'a': {'zoom': 1.5, 'aim': [0.3, 0.5]}, 'b': {'zoom': 1.7, 'aim': [0.3, 0.48]}})
sfx(611.0, 'relief_cry', 0.35)
# 613.55 "and I'd had the worst day of my life," - the day flashing past: the corner, the door
F.shot(613.55, 614.6, CORNER, who=AFRAID, filter=RED, cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.3, 'aim': [0.45, 0.5]}}, overlays=[{'type': 'flash', 't0': 613.55, 't1': 613.85, 'fadeIn': 0.01, 'fadeOut': 0.25, 'alpha': 0.6}])
F.shot(614.6, 615.5, withplate('door_close', 'plate_door_shift_7', who=[]), filter=RED, cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.8]}, 'b': {'zoom': 1.7, 'aim': [0.45, 0.82]}})
sfx(613.6, 'whoosh', 0.4)
# 615.5 "and I just wanted my mom." - back to him, sobbing, arm out
F.shot(615.5, 617.12, BED('bed_reach'), cam={'a': {'zoom': 2.2, 'aim': [0.25, 0.45]}, 'b': {'zoom': 2.4, 'aim': [0.25, 0.45]}})
# 617.12 "I was halfway out of bed" - feet on the floor, leaning toward the door
F.shot(617.12, 618.8, BED('bed_halfway'), cam={'a': {'zoom': 1.3, 'aim': [0.35, 0.55]}, 'b': {'zoom': 1.4, 'aim': [0.4, 0.55]}})
sfx(617.4, 'cloth', 0.5)
# 618.8 "when my phone lit up." - the phone on the nightstand lights the dark
F.shot(618.8, 619.81, BED('bed_halfway'), cam={'a': {'zoom': 1.8, 'aim': [0.36, 0.55]}, 'b': {'zoom': 1.9, 'aim': [0.36, 0.55]}},
       overlays=[{'type': 'glow', 't0': 619.23, 't1': 619.81, 'spots': [[0.587, 0.53, 300]], 'fadeIn': 0.08, 'fadeOut': 0.01}])
sfx(619.25, 'buzz', 0.9)
# 619.81 "A text. From Mom." - him reading it, the screen lighting his face
F.shot(619.81, 621.54, BED('bed_phone'), cam={'a': {'zoom': 2.4, 'aim': [0.2, 0.42]}, 'b': {'zoom': 2.6, 'aim': [0.2, 0.42]}})
# 621.54 Mom's text, full screen, word by word: "Don't open your door. I'm in the car outside. Somebody called me an hour ago from your number. It sounded exactly like you. It said you needed me to go and get you from school."
F.shot(621.54, 630.73, BED('bed_phone'), cam={'a': {'zoom': 1.4, 'aim': [0.3, 0.5]}, 'b': {'zoom': 1.5, 'aim': [0.3, 0.5]}},
       overlays=[DIM(621.54, 630.73),
                 {'type': 'text', 'text': 'Mom ❤️', 'x': 0.5, 'y': 0.24, 'size': 46, 'color': '#9fd0ff', 't0': 621.54, 't1': 630.73, 'fadeIn': 0.15, 'fadeOut': 0.1},
                 {'type': 'words', 'words': words('c6_30', 621.5, 630.5), 'max': 6, 'x': 0.5, 'y': 0.52, 'size': 84, 'color': '#f2f2f2', 'hot': '#ffffff', 't0': 621.54, 't1': 630.73, 'fadeIn': 0.05, 'fadeOut': 0.1}])
sfx(621.6, 'buzz', 0.5)
# 630.73 "I read it three times." - his face, eyes going over and over it
F.shot(630.73, 632.0, BED('bed_phone'), cam={'a': {'zoom': 2.7, 'aim': [0.2, 0.4]}, 'b': {'zoom': 2.9, 'aim': [0.2, 0.4]}})
# 632.0 "Then I looked at the bottom of my door, at the strip of hallway light," - down the door to the light
F.shot(632.0, 635.57, DOORN(False), cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.9, 'aim': [0.48, 0.85]}, 'ease': 'inout'})
# 635.57 "and there were two shadows in it." (the feet are there, on "shadows") 636.92 "Two feet, standing perfectly still."
F.shot(635.57, 638.76, DOORN(False), events=[{'t': 636.04, 'plate': 'art/bg_bedroom_door_night.png'}], cam={'a': {'zoom': 1.9, 'aim': [0.48, 0.85]}, 'b': {'zoom': 2.2, 'aim': [0.48, 0.86]}, 'ease': 'linear'})
sfx(636.05, 'hit', 0.8)
for k in range(4): sfx(636.6 + k * 0.6, 'heart', 0.6)
# 638.76 "The same way they stood outside Room 214." - the school door, the same two shadows
F.shot(638.76, 641.55, withplate('door_close', 'plate_door_shift_7', who=[]), filter=MEMORY, cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.8]}, 'b': {'zoom': 2.0, 'aim': [0.45, 0.84]}},
       overlays=[{'type': 'flash', 't0': 638.76, 't1': 639.1, 'fadeIn': 0.01, 'fadeOut': 0.3, 'alpha': 0.6}])
sfx(638.8, 'whoosh', 0.4)
# 641.55 "It never broke into the school. It can't." - the school, shut tight
F.shot(641.55, 643.83, flat('bg_ext_morning'), filter=GREY, cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.58]}})
# 643.83 "It just needs one person to open one door." - a classroom handle going down from inside; the door opening on "open"
F.shot(643.83, 645.48, flat('plate_door_hall_208_lv0'), filter=MEMORY, events=[{'t': 644.5, 'plate': 'art/plate_door_hall_208_lv6.png'}, {'t': 644.65, 'plate': 'art/plate_door_hall_208_lv12.png'}, {'t': 644.8, 'plate': 'art/plate_door_hall_208_lv18.png'}],
       cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.7, 'aim': [0.45, 0.55]}})
sfx(644.5, 'handle_down', 0.7)
F.shot(645.48, 646.07, flat('plate_door_hall_208_open'), filter=MEMORY, cam={'a': {'zoom': 1.7, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.8, 'aim': [0.45, 0.55]}})
sfx(645.5, 'door_open', 0.6)
# 646.07 "And it had my name," - "Dong." whispered on the glass, red
TRI = 'polygon(30% 8%, 72% 14%, 40% 92%)'
F.shot(646.07, 647.22, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 2.6, 'aim': [0.48, 0.45]}, 'b': {'zoom': 2.7, 'aim': [0.48, 0.45]}},
       overlays=[{'type': 'words', 'words': [[646.1, 'Dong.']], 'max': 1, 'x': 0.48, 'y': 0.5, 'size': 150, 't0': 646.07, 't1': 647.22, 'fadeIn': 0.05, 'fadeOut': 0.05}])
# 647.22 "my voice, my mom's voice, and now it knew where I lived." - his house at night, in on his lit window
F.shot(647.22, 650.19, flat('bg_house_night'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 2.2, 'aim': [0.53, 0.3]}, 'ease': 'in'})
sfx(649.5, 'boom', 0.5)
# 650.19 "Because I'd told it. Because I couldn't keep quiet for one day." - the phone call in the corner, red
F.shot(650.19, 653.6, CORNER, who=[AFRAID[0], {'card': 'phone_discreet', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 0.5}}] + AFRAID[2:], filter=RED, cam=close('dong', 2.8, 3.1, dy=0.06),
       overlays=[{'type': 'flash', 't0': 650.19, 't1': 650.5, 'fadeIn': 0.01, 'fadeOut': 0.3, 'alpha': 0.6}])
sfx(650.3, 'whispers', 0.3)
# 653.6 THING: "Dong. It's me. Open the door. Go Hawks." - red on his door
CAP31 = caption('c6_31', 654.2, 657.33, size=110, mx=4)
F.shot(653.6, 657.33, DOORN(), filter='brightness(0.85)', cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.5]}, 'b': {'zoom': 2.0, 'aim': [0.5, 0.5]}, 'ease': 'in', 'kicks': [655.07], 'kick': 0.4}, overlays=[CAP31])
sfx(654.3, 'creepy_whisper', 0.4)
# 657.33 "That was eleven days ago. I haven't opened my door since." - daylight; his messy room; Dong on the floor against the door
F.shot(657.33, 660.73, DAY(), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.72, 0.6]}, 'ease': 'linear'})
# 660.73 "My mom leaves food in the hallway," - the tray outside his door
F.shot(660.73, 662.88, flat('bg_home_hall_tray'), cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.7]}})
sfx(661.0, 'step_far', 0.4)
# 662.88 "and I wait until I hear her car leave" - Dong, listening
F.shot(662.88, 664.75, DAY(), cam={'a': {'zoom': 2.2, 'aim': [0.8, 0.55]}, 'b': {'zoom': 2.3, 'aim': [0.8, 0.55]}})
sfx(662.9, 'car_leave', 0.8)
# 664.75 "before I reach out." - his hand through the gap, pulling the tray in
F.shot(664.75, 665.43, flat('bg_door_gap_hand'), cam={'a': {'zoom': 1.4, 'aim': [0.6, 0.7]}, 'b': {'zoom': 1.5, 'aim': [0.62, 0.7]}})
sfx(664.8, 'creak', 0.4)
# 665.43 "She texts me every night now, a code word, one we made up that I've never said out loud." - the text, full screen: the word itself hidden
CODE = [[665.6, 'Goodnight'], [665.95, 'sweetheart ❤️'], [667.2, 'Code'], [667.6, 'word:'], [667.9, '<span style="filter:blur(14px)">blueberry pancakes</span>']]
F.shot(665.43, 670.16, DAY(), cam={'a': {'zoom': 1.6, 'aim': [0.75, 0.55]}, 'b': {'zoom': 1.7, 'aim': [0.75, 0.55]}},
       overlays=[DIM(665.43, 670.16), {'type': 'text', 'text': 'Mom ❤️', 'x': 0.5, 'y': 0.3, 'size': 46, 'color': '#9fd0ff', 't0': 665.43, 't1': 670.16, 'fadeIn': 0.15, 'fadeOut': 0.1},
                 {'type': 'words', 'words': CODE, 'max': 2, 'x': 0.5, 'y': 0.52, 'size': 84, 'color': '#f2f2f2', 'hot': '#ffffff', 't0': 665.43, 't1': 670.16, 'fadeIn': 0.05, 'fadeOut': 0.1}])
sfx(665.45, 'buzz', 0.6)
# 670.16 "Not once. Not even to myself." - him, mouth shut tight
F.shot(670.16, 672.07, DAY(), cam={'a': {'zoom': 2.6, 'aim': [0.8, 0.52]}, 'b': {'zoom': 2.8, 'aim': [0.8, 0.52]}})
# 672.07 "And some nights, after she's gone to bed," - the dark room, Dong awake in bed
F.shot(672.07, 674.15, BED('bed_sit'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.2, 'aim': [0.4, 0.55]}})
# 674.15 "the knocking starts again," - the door, three knocks
F.shot(674.15, 675.43, DOORN(), cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.4, 'aim': [0.5, 0.5]}, 'kicks': [674.35, 674.7, 675.05], 'kick': 0.7})
for t in (674.35, 674.7, 675.05): sfx(t, 'knock', 1.3)
# 675.43 "and it tries every voice it knows." - the feet under the door
F.shot(675.43, 677.44, DOORN(), cam={'a': {'zoom': 1.8, 'aim': [0.48, 0.84]}, 'b': {'zoom': 2.0, 'aim': [0.48, 0.86]}})
# 677.44 "Ms. Harlow." 678.11 "Tyler." 678.6 "Principal Dawes." 679.53 "My mom." 680.11 "Me." - outside his door, one after another, each of them standing there; glitching between
NAMES = [('harlow', 677.44), ('tyler', 678.11), ('dawes', 678.6), ('mom', 679.53), ('dong', 680.11)]
VOICES = [{'n': n, 'view': 'front', 'clip': 'idle', 'at': [0.5, 0.68], 'face': {'eyes': 'creepy', 'mouth': 'flat', 'brows': 'up'}, **({} if i == 0 else {'hidden': 1})} for i, (n, t) in enumerate(NAMES)]
ev = []
for i in range(1, len(NAMES)): ev += [{'t': NAMES[i][1], 'i': i - 1, 'hide': 1}, {'t': NAMES[i][1], 'i': i, 'show': 1}]
GL = lambda t: {'type': 'flicker', 't0': t - 0.12, 't1': t + 0.12, 'rate': 22, 'on': 0.4, 'alpha': 0.9, 'fadeIn': 0.01, 'fadeOut': 0.01}
F.shot(677.44, 680.49, withplate('home_hall_night', 'bg_home_hall_night', who=VOICES, tint=MIMIC), events=ev, cam={'a': {'zoom': 1.5, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.5, 0.42]}},
       overlays=[GL(t) for _, t in NAMES[1:]] + [{'type': 'words', 'words': words('c6_32', 677.4, 680.5), 'max': 2, 'x': 0.5, 'y': 0.86, 'size': 64, 't0': 677.44, 't1': 680.49, 'fadeIn': 0.05, 'fadeOut': 0.05}])
for _, t in NAMES[1:]: sfx(t, 'glitch', 0.6)
# 680.49 "It's very patient. It has all the time in the world." - the feet under his door, not moving; slowly closer
F.shot(680.49, 683.78, DOORN(), filter='brightness(0.8)', cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.6]}, 'b': {'zoom': 2.0, 'aim': [0.48, 0.84]}, 'ease': 'linear'})
sfx(681.0, 'tick', 0.3); sfx(682.0, 'tick', 0.3); sfx(683.0, 'tick', 0.3)
# 683.78 "So if your school ever goes into lockdown," - the class in the corner, lights off
F.shot(683.78, 685.61, CORNER, who=AFRAID, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.1, 'aim': [0.45, 0.5]}})
# 685.61 "don't whisper." - Ms. Harlow, finger to her lips
F.shot(685.61, 686.38, CORNER, who=AFRAID[:6] + [{'card': 'shush', 'clip': 'huddle', 'opts': {'mood': 'shake', 'intensity': 0.5}}], cam=close('harlow', 2.6, 2.7))
sfx(685.7, 'shh', 0.4)
# 686.38 "Don't call anyone." - the hidden phone, red
F.shot(686.38, 687.53, CORNER, who=[AFRAID[0], {'card': 'phone_discreet', 'clip': 'huddle', 'opts': {'mood': 'shiver', 'intensity': 0.5}}] + AFRAID[2:], filter=RED, cam=close('dong', 3.0, 3.1, dy=0.06))
# 687.53 "Don't make a sound." - everyone frozen; the sound drops away
F.shot(687.53, 688.91, CORNER, who=[{'opts': {'mood': 'stare', 'look': 1, 'blank': 1}}] * 7, cam={'a': {'zoom': 1.3, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.35, 'aim': [0.45, 0.5]}})
# 688.91 "And if you ever hear my voice outside your door..." - outside a door at night: Dong, as he was that day, standing too still
ME = [{'n': 'dong', 'view': 'front', 'clip': 'idle', 'at': [0.5, 0.68], 'face': {'eyes': 'creepy', 'mouth': 'flat', 'brows': 'up'}}]
F.shot(688.91, 691.955, withplate('home_hall_night', 'bg_home_hall_night', who=ME, tint=MIMIC), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.8, 'aim': [0.5, 0.42]}, 'ease': 'in'})
sfx(689.0, 'riser', 0.4)
# 691.985 "it..." 693.565 "...isn't..." 695.035 "...me." (whispered) - said slowly, a silence between each word: the camera creeps in on its face on every word, its head tilting in the silences; then it smiles; black
LIPS = [[691.985, 692.405], [693.565, 694.095], [695.035, 695.245]]   # the whispered ElevenLabs take (vo/c6_34_tail_el.mp3)
F.shot(691.955, 697.68, withplate('home_hall_night', 'bg_home_hall_night', who=[{**ME[0], 'lip': 'c6_34', 'lipSpans': LIPS, 'lipGain': 1.5}], tint=MIMIC),
       events=[{'t': 692.7, 'i': 0, 'lean': -7, 'dur': 0.6}, {'t': 694.35, 'i': 0, 'lean': 5, 'dur': 0.6}, {'t': 695.5, 'i': 0, 'face': {'eyes': 'creepy', 'mouth': 'grin', 'brows': 'up'}}],
       cam={'keys': [[691.955, {'zoom': 1.9, 'aim': [0.5, 0.4]}], [692.45, {'zoom': 2.05, 'aim': [0.5, 0.39]}], [693.56, {'zoom': 2.1, 'aim': [0.5, 0.38]}], [694.1, {'zoom': 2.55, 'aim': [0.5, 0.36]}],
                     [695.03, {'zoom': 2.65, 'aim': [0.5, 0.35]}], [695.5, {'zoom': 3.3, 'aim': [0.5, 0.34]}], [696.2, {'zoom': 3.4, 'aim': [0.5, 0.34]}]]},
       overlays=[{'type': 'black', 't0': 696.2, 't1': 697.8, 'fadeIn': 0.01, 'fadeOut': 0.01}])
for t in (692.75, 693.25, 694.35, 694.8): sfx(t, 'heart', 0.3)
sfx(694.2, 'riser', 0.15); sfx(696.2, 'hit', 1.1)
add_lighting(F)
F.save('ch6')
BEDS = [[574.3, 587.94, 'room_dark', 0.1], [588.62, 601.42, 'room_dark', 0.18], [593.24, 657.33, 'dread_bed', 0.24], [605.12, 683.78, 'room_dark', 0.16],
        [657.33, 672.07, 'room_dark', 0.12], [672.07, 683.78, 'dread_bed', 0.28], [683.78, 687.53, 'huddle_cry', 0.12], [688.91, 691.9, 'dread_bed', 0.3], [691.9, 696.2, 'dread_bed', 0.07]]
SFX += [[599.7, 'breath', 0.35], [631.0, 'breath', 0.4], [663.0, 'breath', 0.2]]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch6_sfx.json', 'w'), indent=1)
print(len(F.S), 'shots,', len(SFX), 'sound cues,', len(BEDS), 'beds')
