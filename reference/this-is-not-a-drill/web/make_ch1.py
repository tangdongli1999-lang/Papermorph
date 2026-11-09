"""Chapter 1 (0:00-1:47), storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch1.json (picture) and film/ch1_sfx.json (sound cues: [time, sound, volume])."""
import json
from film_lib import *
F = Film(0.0, 107.0); SFX = []
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
def flatwho(img, who, tint=None):
    r = flat(img, tint); r['who'] = who; r['tint'] = tint if tint is not None else 0xffffff; return r
WARM = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
# Harlow crouches IN FRONT of the class from the moment the lockdown starts (front-right of the row)
HFRONT = {'pos': [1.45, 0, 0], 'wall': 1.5}

# 0:00 "Every school in America has a lockdown drill."  - the school, the title
F.shot(0.0, 2.72, flatwho('bg_ext_morning', []), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.12, 'aim': [0.5, 0.45]}},
       overlays=[{'type': 'title', 'text': 'THIS IS<br>NOT A DRILL', 't0': 0.2, 't1': 2.72, 'fadeIn': 0.4, 'fadeOut': 0.3}])
sfx(0.0, 'birds', 0.2); sfx(0.2, 'boom', 0.9)
# 2.72 "You learn it in kindergarten, the same way you learn your address." - a teacher points at the LOCKDOWN poster, the little kids repeat it
KG = room('kindergarten'); KG['who'] = [
  {'n': 'kid_a', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'whisper'}, 'at': [0.33, 0.90], 'scale': 0.6},
  {'n': 'priya', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'whisper'}, 'at': [0.47, 0.91], 'scale': 0.58},
  {'n': 'kid_b', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'whisper'}, 'at': [0.61, 0.90], 'scale': 0.58},
  {'n': 'parent_b', 'clip': 'point', 'opts': {'left': True}, 'at': [0.93, 0.74], 'face': {'eyes': 'happy', 'mouth': 'grin'}}]
F.shot(2.72, 5.6, KG, cam={'a': {'zoom': 1.0, 'aim': [0.55, 0.5]}, 'b': {'zoom': 1.15, 'aim': [0.62, 0.45]}})
sfx(2.72, 'whoosh', 0.5)
# 5.6 "Lights off." - a hand on the switch, the room goes dark
DRILL_ROOM = room('classroom_day'); DRILL_ROOM['who'] = [{'n': 'harlow', 'view': 'side', 'facing': 1, 'clip': 'idle', 'at': [0.735, 0.80]}]
F.shot(5.6, 6.15, DRILL_ROOM, cam={'a': {'zoom': 1.6, 'aim': [0.75, 0.5]}, 'b': {'zoom': 1.65, 'aim': [0.75, 0.5]}},
       events=[{'t': 5.62, 'i': 0, 'play': 'reach', 'opts': {'up': 62, 'bend': 22, 'dur': 0.25}}, {'t': 5.94, 'plate': 'art/bg_classroom_dark.png'}, {'t': 5.94, 'tint': DARK}])
sfx(5.93, 'switch', 1.6); sfx(5.95, 'thunk', 0.5)
# 6.15 "Lock the door." - the thumb-turn turns
F.shot(6.15, 6.8, flat('bg_handle_inside'), cam={'a': {'zoom': 1.8, 'aim': [0.53, 0.30]}, 'b': {'zoom': 1.8, 'aim': [0.53, 0.30]}},
       overlays=[{'type': 'rotor', 't0': 6.15, 't1': 6.8, 'x': 0.5, 'y': 0.5, 'w': 70, 'h': 200, 'from': 0, 'to': 90, 't2': 6.35, 'dur': 0.18, 'fadeIn': 0.01, 'fadeOut': 0.01}])
sfx(6.38, 'lock', 1.7)
# 6.8 "Cover the window." - Priya slaps the black paper over the glass
F.shot(6.8, 7.58, withplate('door_close', 'plate_door_close_window', who=[{'n': 'priya', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.66, 0.88]}], tint=0xd0cdc8),
       events=[{'t': 6.9, 'i': 0, 'play': 'slap'}, {'t': 7.06, 'plate': 'art/plate_door_close_covered.png'}], cam={'a': {'zoom': 1.15, 'aim': [0.55, 0.42]}, 'b': {'zoom': 1.2, 'aim': [0.55, 0.42]}})
sfx(7.06, 'paper', 1.0)
# 7.58 "Get in the corner away from the door." - the class hurries into the corner
RUNIN = room('corner_dark'); RUNIN['who'] = [{'n': n, 'view': 'side', 'facing': -1, 'clip': 'run', 'opts': {'pace': 0.8}, 'pos': [x, 0, 0], 'wall': w} for n, x, w in
  [('tyler', 0.2, 0.7), ('priya', 1.0, 1.0), ('dong', 1.7, 0.6), ('kid_a', 2.4, 1.1), ('marcus', 3.1, 0.8)]]
F.shot(7.58, 9.2, RUNIN, cam={'a': {'zoom': 1.05}, 'b': {'zoom': 1.08}})
for k in range(9): sfx(7.62 + k * 0.17, ['step1', 'step2', 'step3'][k % 3], 0.35)
# 9.2 "Phones on silent." - the switch flips to silent
F.shot(9.2, 10.33, 'rooms/corner_dark.json', who=moods(tyler='calm', dong='calm', marcus='calm', priya='calm', kid_a='glance', kid_b='calm', harlow='calm'),
       cam={'a': {'zoom': 2.0, 'aim': HU['dong']}, 'b': {'zoom': 2.1, 'aim': HU['dong']}},
       overlays=[{'type': 'black', 'alpha': 0.45, 't0': 9.2, 't1': 10.33, 'fadeIn': 0.1, 'fadeOut': 0.1}, {'type': 'phone', 't0': 9.2, 't1': 10.33, 'flip': 9.8, 'fadeIn': 0.12, 'fadeOut': 0.1}])
sfx(9.8, 'click', 1.0)
# 10.33 "And the most important rule of all:" - the classroom door
F.shot(10.33, 12.18, withplate('door_close', 'plate_door_close_covered', who=[]), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.45]}, 'ease': 'linear'})
sfx(10.33, 'riser', 0.45)
# 12.18 "you don't open that door for anyone." - Dong reaches for the handle... and stops
F.shot(12.18, 14.05, withplate('door_close', 'plate_door_close_covered', who=[{'n': 'dong', 'view': 'side', 'facing': 1, 'clip': 'idle', 'at': [0.47, 0.90]}]),
       events=[{'t': 12.4, 'i': 0, 'play': 'reach', 'opts': {'up': 62, 'bend': 18, 'dur': 0.6}}, {'t': 13.3, 'i': 0, 'play': 'idle'}, {'t': 13.3, 'i': 0, 'face': {'eyes': 'wide', 'brows': 'worried', 'mouth': 'flat'}}],
       cam={'a': {'zoom': 1.25, 'aim': [0.55, 0.5]}, 'b': {'zoom': 1.35, 'aim': [0.58, 0.5]}})
sfx(13.3, 'hit', 0.5)
# 14.05 "Not a teacher," 14.65 "not a friend," 15.28 "not your own mom." - each of them knocking at Room 214
for t0, t1, n in [(14.05, 14.65, 'parent_b'), (14.65, 15.28, 'kid_b'), (15.28, 16.13, 'mom')]:
    F.shot(t0, t1, flatwho('plate_door_hall_214', [{'n': n, 'view': 'side', 'facing': 1, 'clip': 'knock', 'at': [0.215, 0.985], 'face': {'eyes': 'open', 'mouth': 'grin'}}], tint=0xe8e4dc),
           warm=0.35, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.03}})
    for k in range(3): sfx(t0 + 0.01 + k * 0.24, 'knock', 0.8)
# 16.13 "When it's really over," - a deputy walks up the hallway
F.shot(16.13, 17.34, room('hallway_side', who=[{'n': 'deputy', 'view': 'side', 'facing': 1, 'clip': 'walk', 'at': [0.3, 0.80]}]), cam={'a': {'zoom': 1.1, 'aim': [0.4, 0.5]}, 'b': {'zoom': 1.1, 'aim': [0.5, 0.5]}})
for k in range(3): sfx(16.25 + k * 0.55, ['step1', 'step2', 'step3'][k], 0.45)
# 17.34 "someone with a key" - the key in the lock
F.shot(17.34, 18.46, flat('bg_key_lock'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.62, 0.42]}})
sfx(17.4, 'keys', 0.8); sfx(18.15, 'lock', 1.5)
# 18.46 "will open it for you." - the door swings open, the deputy in the light
F.shot(18.46, 19.19, 'rooms/door_open.json', who=[{'clip': 'idle', 'face': {'mouth': 'grin'}}], cam={'a': {'zoom': 1.05, 'aim': [0.6, 0.5]}, 'b': {'zoom': 1.15, 'aim': [0.65, 0.48]}},
       overlays=[{'type': 'flash', 't0': 18.46, 't1': 18.9, 'fadeIn': 0.01, 'fadeOut': 0.4, 'alpha': 0.5}])
sfx(18.46, 'door_open', 0.8)
# 19.19 "I've done that drill maybe forty times." - Dong walks down the hall, shrugs on "forty times"
F.shot(19.19, 21.22, 'rooms/hallway.json', events=[{'t': 20.25, 'i': 0, 'play': 'shrug'}], cam={'a': {'zoom': 1.6, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.75, 'aim': [0.5, 0.45]}})
for k in range(2): sfx(19.3 + k * 0.5, 'step2', 0.3)
# 21.22 "And on October twelfth, at ten fourteen in the morning," - the school; the date types on
F.shot(21.22, 24.14, flat('bg_ext_morning'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.9, 'aim': [0.88, 0.37]}},
       overlays=[{'type': 'type', 'text': 'OCT 12 · 10:14 AM', 't0': 21.66, 't1': 24.14, 'cps': 12, 'fadeIn': 0.05, 'fadeOut': 0.1}])
sfx(21.22, 'birds', 0.2); sfx(21.66, 'typing', 0.6)
# 24.14 "in Room 214," - the door of Room 214
F.shot(24.14, 25.64, flat('plate_door_hall_214', tint=0xe8e4dc), cam={'a': {'zoom': 1.0, 'aim': [0.6, 0.4]}, 'b': {'zoom': 1.8, 'aim': [0.76, 0.29]}, 'ease': 'out'})
sfx(24.14, 'whoosh', 0.5)
# 25.64 "I found out why that last rule exists." - Dong's face, horrified
HZ = room('hallway'); HZ['plate'] = dict(HZ['plate'], img='art/bg_hallway_dim.png'); HZ['tint'] = 0x9aa2bb
HZ['who'] = [{'n': 'dong', 'clip': 'standScared', 'opts': {'mood': 'frozen'}, 'at': [0.5, 0.75], 'face': {'eyes': 'wide', 'brows': 'worried'}}]
F.shot(25.64, 28.19, HZ, cam={'a': {'zoom': 3.0, 'aim': [0.5, 0.38]}, 'b': {'zoom': 4.2, 'aim': [0.5, 0.36]}, 'ease': 'in'})
sfx(25.64, 'boom', 0.9); sfx(26.0, 'riser', 0.5); sfx(27.9, 'whoosh', 0.6)
# 28.19 "Third period, English. Ms. Harlow was reading Poe out loud." - Harlow reading aloud at the front
CLS = room('classroom_day', who=[{'n': 'harlow', 'card': 'book_live', 'clip': 'huddle', 'opts': {'mood': 'whisper'}, 'at': [0.62, 0.80]}])
F.shot(28.19, 30.0, CLS, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.6, 0.5]}})
F.shot(30.0, 32.05, CLS, cam={'a': {'zoom': 2.0, 'aim': [0.62, 0.42]}, 'b': {'zoom': 2.2, 'aim': [0.62, 0.40]}})
# 32.05 "Tyler was drawing on his arm." 33.91 "Priya, who sits next to me, was actually taking notes."
F.shot(32.05, 33.91, 'rooms/class_students.json', who=[None, None, None, {'clip': 'huddle', 'opts': {'mood': 'calm'}}], cam={'a': {'zoom': 2.1, 'aim': [0.16, 0.62]}, 'b': {'zoom': 2.3, 'aim': [0.16, 0.62]}})
F.shot(33.91, 37.18, 'rooms/class_students.json', who=[None, None, None, None, {'clip': 'huddle', 'opts': {'mood': 'calm'}}, {'clip': 'huddle', 'opts': {'mood': 'calm'}}],
       cam={'a': {'zoom': 1.9, 'aim': [0.5, 0.62]}, 'b': {'zoom': 1.9, 'aim': [0.82, 0.62]}})
sfx(32.2, 'pencil', 0.4); sfx(35.6, 'pencil', 0.4)
# 37.18 "And then the speaker over the door clicked on." - the speaker; the click and the chime
F.shot(37.18, 40.2, flat('bg_intercom'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.7, 'aim': [0.47, 0.47]}})
sfx(38.72, 'pa_on', 1.0); sfx(39.1, 'pa_chime', 0.7)
# 40.2 the announcement: Dawes at the mic beside his desk, talking
OFF = room('office'); OFF['who'] = [{'n': 'dawes', 'clip': 'idle', 'lip': 'c1_01', 'lipGain': 2.2, 'at': [0.86, 0.87], 'face': {'brows': 'worried', 'mouth': 'flat'}}]
F.shot(40.2, 44.6, OFF, cam={'a': {'zoom': 1.3, 'aim': [0.75, 0.5]}, 'b': {'zoom': 2.2, 'aim': [0.86, 0.38]}},
       events=[{'t': 42.7, 'i': 0, 'play': 'standScared', 'opts': {'mood': 'shake', 'intensity': 1.2}}])
sfx(40.2, 'pa_hum', 0.35)
# 44.6 "This is not a drill." - the speaker  /  46.3 "Lockdown." - Harlow freezes, book in hand
F.shot(44.6, 46.3, flat('bg_intercom'), cam={'a': {'zoom': 1.9, 'aim': [0.47, 0.47]}, 'b': {'zoom': 2.5, 'aim': [0.47, 0.47]}, 'shake': 1})
F.shot(46.3, 47.85, room('classroom_day', who=[{'n': 'harlow', 'card': 'book_live', 'clip': 'huddle', 'opts': {'mood': 'shock'}, 'at': [0.62, 0.80]}]),
       events=[{'t': 46.33, 'flinch': 1.4}], cam={'a': {'zoom': 2.3, 'aim': [0.62, 0.40]}, 'b': {'zoom': 2.6, 'aim': [0.62, 0.38]}})
sfx(46.33, 'hit', 0.8)
# 47.85 "No 'good morning.' No 'Go Hawks.' Principal Dawes says 'Go Hawks' at the end of everything, even the fire alarm announcements." - his usual mornings
MORN = room('office'); MORN['who'] = [{'n': 'dawes', 'clip': 'wave', 'lip': 'c1_02', 'lipGain': 2.2, 'lipSpans': [[48.15, 48.95]], 'at': [0.86, 0.87]}]
F.shot(47.85, 49.05, MORN, filter=WARM, cam={'a': {'zoom': 1.6, 'aim': [0.8, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.8, 0.45]}},
       overlays=[{'type': 'flash', 't0': 47.85, 't1': 48.2, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.8}])
MORN2 = room('office'); MORN2['who'] = [{'n': 'dawes', 'clip': 'cheer', 'lip': 'c1_02', 'lipGain': 2.2, 'lipSpans': [[49.25, 49.95], [51.25, 51.95]], 'at': [0.86, 0.87]}]
F.shot(49.05, 50.0, MORN2, filter=WARM, cam={'a': {'zoom': 2.2, 'aim': [0.86, 0.38]}, 'b': {'zoom': 2.3, 'aim': [0.86, 0.38]}})
F.shot(50.0, 53.4, MORN2, filter=WARM, events=[{'t': 50.0, 'i': 0, 'play': 'idle'}, {'t': 51.15, 'i': 0, 'play': 'cheer'}, {'t': 52.2, 'i': 0, 'play': 'talk'}],
       cam={'a': {'zoom': 1.4, 'aim': [0.75, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.8, 0.45]}})
F.shot(53.4, 54.72, MORN2, filter=WARM, events=[{'t': 53.4, 'i': 0, 'play': 'cheer'}], cam={'a': {'zoom': 1.5, 'aim': [0.8, 0.45]}, 'b': {'zoom': 1.6, 'aim': [0.8, 0.45]}},
       overlays=[{'type': 'strobe', 't0': 53.4, 't1': 54.72, 'rate': 4, 'alpha': 0.35, 'fadeIn': 0.01, 'fadeOut': 0.2},
                 {'type': 'flash', 't0': 54.4, 't1': 54.72, 'fadeIn': 0.3, 'fadeOut': 0.01, 'alpha': 0.8}])
sfx(47.85, 'whoosh', 0.6); sfx(53.42, 'fire_alarm', 0.35)
# 54.72 "This time the speaker just clicked off." - the click, then nothing
F.shot(54.72, 56.6, flat('bg_intercom', tint=0x9aa3bb), cam={'a': {'zoom': 2.2, 'aim': [0.47, 0.47]}, 'b': {'zoom': 2.3, 'aim': [0.47, 0.47]}})
sfx(56.0, 'pa_off', 1.0)
# 56.6 "Ms. Harlow had the door locked before he finished." - she runs to the door and locks it
# 59.16 "Lights off." - she hits the switch
F.shot(56.6, 59.94, room('classroom_day', who=[{'n': 'harlow', 'view': 'side', 'facing': 1, 'clip': 'run', 'at': [0.30, 0.80], 'sideHead': 'scared'}]),
       events=[{'t': 56.62, 'i': 0, 'runTo': [0.80, 0.80], 'then': 'reach', 'thenOpts': {'up': 48, 'bend': 18, 'dur': 0.3, 'twist': 1}},
               {'t': 58.6, 'i': 0, 'slide': [-0.35, 0], 'dur': 0.4}, {'t': 58.6, 'i': 0, 'play': 'idle'}, {'t': 59.05, 'i': 0, 'play': 'reach', 'opts': {'up': 62, 'bend': 22, 'dur': 0.25}},
               {'t': 59.48, 'plate': 'art/bg_classroom_dark.png'}, {'t': 59.48, 'tint': DARK}],
       cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.35, 'aim': [0.75, 0.48]}})
for k in range(5): sfx(56.7 + k * 0.28, ['step1', 'step2', 'step3'][k % 3], 0.5)
sfx(57.88, 'lock', 1.7); sfx(59.47, 'switch', 1.6); sfx(59.49, 'thunk', 0.6)
# 59.94 "Priya slapped the black paper over the window."
F.shot(59.94, 61.99, withplate('door_close', 'plate_door_close_window', who=[{'n': 'priya', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.66, 0.88], 'sideHead': 'scared'}]),
       events=[{'t': 60.0, 'i': 0, 'play': 'slap'}, {'t': 60.17, 'plate': 'art/plate_door_close_covered.png'}], cam={'a': {'zoom': 1.15, 'aim': [0.55, 0.42]}, 'b': {'zoom': 1.3, 'aim': [0.55, 0.4]}})
sfx(60.17, 'paper', 1.0)
# 61.99 "Twenty-three of us crammed into the corner by the bookshelf," - they scramble in, panicking
RUNIN_SCARED = json.loads(json.dumps(RUNIN))
for w in RUNIN_SCARED['who']: w['sideHead'] = 'scared'; w['face'] = {'eyes': 'wide', 'brows': 'worried', 'mouth': 'O'}
F.shot(61.99, 63.45, RUNIN_SCARED, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.05}})
for k in range(8): sfx(62.0 + k * 0.17, ['step1', 'step2', 'step3'][k % 3], 0.4)
# 63.45 ...packed in tight; 64.73 "knees in each other's backs"
EARLY = moods(tyler=('shake', 1.0), dong=('shiver', 1.1), marcus='lookaround', priya='shock', kid_a=('shake', 1.2), kid_b='rock', harlow={'opts': {'mood': 'shake', 'intensity': 0.7}, **HFRONT})
F.shot(63.45, 66.0, 'rooms/corner_dark.json', who=EARLY, events=[{'t': 63.5, 'flinch': 0.6}], cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.35, 'aim': [0.4, 0.55]}})
sfx(63.45, 'cloth', 0.4)
# 66.0 "and Ms. Harlow crouched in front of us, finger on her lips." - she turns to them, finger on her lips
SH = moods(tyler=('shake', 1.0), dong=('shiver', 1.1), marcus='lookaround', priya='shock', kid_a=('shake', 1.2), kid_b='rock', harlow={'card': 'shush', 'clip': 'huddle', 'opts': {'mood': 'still'}, **HFRONT})
F.shot(66.0, 69.8, 'rooms/corner_dark.json', who=SH, cam={'a': {'zoom': 1.2, 'aim': [0.6, 0.5]}, 'b': {'zoom': 2.3, 'aim': [0.79, 0.52]}})
sfx(67.9, 'shh', 0.35)
# 69.8 "Not a word. Not one. No matter what you hear." - she whispers it
F.shot(69.8, 74.45, 'rooms/corner_dark.json', who=EARLY[:6] + [{'opts': {'mood': 'shake', 'intensity': 0.6}, 'lip': 'c1_03', **HFRONT}],
       cam={'a': {'zoom': 2.6, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.9, 'aim': [0.79, 0.49]}})
# 74.45 "I'd done this forty times, and it always felt like a game." - the old drills, warm
FB = 'sepia(0.45) saturate(1.25) brightness(1.06) contrast(0.95)'
GAME = moods(tyler='giggle', dong='calm', marcus='giggle', priya='calm', kid_a='glance', kid_b='giggle', harlow='calm')
F.shot(74.45, 77.66, 'rooms/corner_day.json', who=GAME, filter=FB, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.1}},
       overlays=[{'type': 'flash', 't0': 74.45, 't1': 74.9, 'fadeIn': 0.01, 'fadeOut': 0.45, 'alpha': 0.9}])
sfx(74.45, 'whoosh', 0.6); sfx(75.3, 'giggle_b', 0.35)
# 77.66 "Somebody always giggles." - Tyler cracking up
F.shot(77.66, 78.9, 'rooms/corner_day.json', who=GAME, filter=FB, cam=close('tyler', 2.4, 2.6))
sfx(77.9, 'giggle_a', 0.6)
# 78.9 "Somebody always whispers 'what if it's real' in a spooky voice." - kid_a, mouthing it, spooky face
F.shot(78.9, 82.38, 'rooms/corner_day.json', who=moods(tyler='giggle', dong='calm', marcus='giggle', priya='calm', kid_a={'opts': {'mood': 'spooky'}, 'lip': 'c1_04', 'lipSpans': [[80.3, 81.35]], 'lipGain': 1.6}, kid_b='giggle', harlow='calm'),
       filter=FB, cam=close('kid_a', 2.2, 2.6), overlays=[{'type': 'flash', 't0': 82.0, 't1': 82.38, 'fadeIn': 0.3, 'fadeOut': 0.01, 'alpha': 0.9}])
sfx(81.6, 'giggle_b', 0.45)
# 82.38 "This time nobody giggled." - the dark corner, everyone frozen
FROZE = moods(tyler=('shake', 1.2), dong=('shiver', 1.4), marcus='shock', priya='shock', kid_a=('shake', 1.4), kid_b='still', harlow={'opts': {'mood': 'shake', 'intensity': 1.0}, **HFRONT})
F.shot(82.38, 84.05, 'rooms/corner_dark.json', who=FROZE, cam={'a': {'zoom': 1.02}, 'b': {'zoom': 1.06}})
sfx(82.5, 'heart', 0.5); sfx(83.15, 'heart', 0.45)
# 84.05 "Ms. Harlow's hands were shaking so hard she had to hold one with the other."
F.shot(84.05, 87.85, 'rooms/corner_dark.json', who=FROZE[:6] + [{'card': 'hands_live', 'clip': 'huddle', 'opts': {'mood': 'shake', 'intensity': 2.4}, **HFRONT}],
       cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.55]}, 'b': {'zoom': 2.8, 'aim': [0.79, 0.55]}})
# 87.85 "Tyler leaned over and whispered, 'Bet it's a raccoon in the vents again,'" - he leans to Dong and mouths it
TY = moods(tyler={'opts': {'mood': 'whisper'}, 'lip': 'c1_04', 'lipSpans': [[89.5, 91.3]], 'lipGain': 1.5}, dong=('shiver', 1.0), marcus='lookaround', priya='shock', kid_a=('shake', 1.2), kid_b='rock', harlow={'opts': {'mood': 'shake', 'intensity': 1.0}, **HFRONT})
F.shot(87.85, 91.81, 'rooms/corner_dark.json', who=TY, events=[{'t': 88.2, 'i': 0, 'lean': -14, 'dur': 0.5}],
       cam={'a': {'zoom': 2.3, 'aim': [0.22, 0.48]}, 'b': {'zoom': 2.5, 'aim': [0.22, 0.48]}})
# 91.81 "and Ms. Harlow looked at him in a way I'd never seen a teacher look at anyone," - the stare, towards Tyler
STARE = moods(tyler={'opts': {'mood': 'whisper'}}, dong=('shiver', 1.0), marcus='shock', priya='shock', kid_a=('shake', 1.2), kid_b='rock', harlow={'opts': {'mood': 'stare'}, **HFRONT})
F.shot(91.81, 95.84, 'rooms/corner_dark.json', who=STARE, cam={'a': {'zoom': 2.4, 'aim': [0.79, 0.5]}, 'b': {'zoom': 2.9, 'aim': [0.79, 0.48]}})
sfx(92.5, 'riser', 0.35)
# 95.84 "and he shut up." - Tyler sits back, mouth shut
F.shot(95.84, 96.57, 'rooms/corner_dark.json', who=[{'opts': {'mood': 'shock'}}] + STARE[1:], events=[{'t': 95.86, 'i': 0, 'lean': 0, 'dur': 0.25}],
       cam={'a': {'zoom': 2.6, 'aim': [0.25, 0.47]}, 'b': {'zoom': 2.6, 'aim': [0.25, 0.47]}})
sfx(95.9, 'hit', 0.45)
# 96.57 "We waited for sirens. For helicopters." - the empty window
F.shot(96.57, 99.07, flat('bg_window_view_dark'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.2, 'aim': [0.5, 0.35]}, 'ease': 'linear'})
# 99.07 "For anything." - the kids looking around, waiting
F.shot(99.07, 99.79, 'rooms/corner_dark.json', who=moods(tyler='lookaround', dong='lookaround', marcus='lookaround', priya='glance', kid_a='lookaround', kid_b='glance', harlow={'opts': {'mood': 'lookaround'}, **HFRONT}),
       cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.25, 'aim': [0.45, 0.5]}})
# 99.79 "And for six minutes, we heard nothing at all." - the clock crawls from 10:14 to 10:20
F.shot(99.79, 102.61, flat('bg_intercom'), overlays=[{'type': 'clock', 't0': 99.79, 't1': 102.61, 'h': 10, 'm': 14, 'h2': 10, 'm2': 20, 't2': 100.1, 'dur': 2.3, 'label': '10:20 AM', 'dark': True, 'fadeIn': 0.01, 'fadeOut': 0.01}])
for k in range(6): sfx(100.1 + k * 0.42, 'tick', 0.5)
# 102.61 "Then, from the far end of the hallway, footsteps." - the dim hallway, steps coming
F.shot(102.61, 107.0, flat('bg_hallway_dim'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.7, 'aim': [0.5, 0.45]}, 'ease': 'in'},
       overlays=[{'type': 'black', 't0': 106.3, 't1': 107.1, 'fadeIn': 0.6, 'fadeOut': 0.01}])
for k in range(5): sfx(104.55 + k * 0.62, ['step1', 'step2', 'step3'][k % 3], 2.0 + 0.35 * k)
add_lighting(F)
F.save('ch1')
# beds: [t0, t1, sound, volume] looped under the picture
BEDS = [[0.0, 2.72, 'exterior', 0.28], [2.72, 5.6, 'kinder', 0.55], [2.72, 5.94, 'room_class', 0.15], [5.94, 21.22, 'room_dark', 0.18],
        [19.19, 21.22, 'class', 0.25], [21.22, 24.14, 'exterior', 0.3], [24.14, 25.64, 'hall', 0.35], [25.64, 28.19, 'dread_bed', 0.35], [25.64, 28.19, 'hall', 0.4],
        [28.19, 40.2, 'class', 0.4], [28.19, 40.2, 'room_class', 0.15], [40.2, 47.85, 'pa_hum', 0.12], [40.2, 59.48, 'room_class', 0.15],
        [47.85, 54.72, 'class', 0.2], [59.48, 107.0, 'dread_bed', 0.26], [59.48, 107.0, 'room_dark', 0.16],
        # the huddle: muffled crying, sniffles, shaky breaths and nervous whispers under everything in the dark corner
        [63.45, 74.45, 'huddle_cry', 0.24], [63.45, 74.45, 'whispers', 0.09], [82.38, 99.79, 'huddle_cry', 0.26], [87.8, 96.5, 'whispers', 0.08],
        [74.45, 82.38, 'class', 0.3], [96.57, 99.07, 'exterior', 0.25], [102.61, 107.0, 'hall', 0.3]]
# human sounds on cue
SFX += [[7.58, 'scramble', 0.7], [61.99, 'scramble', 0.9], [46.33, 'gasp', 0.6], [25.7, 'breath', 0.7], [74.6, 'giggles', 0.55], [77.7, 'giggles', 0.7],
        [82.5, 'teeth', 0.28], [84.1, 'breath', 0.3], [99.2, 'breath', 0.28], [104.6, 'breath', 0.3]]
SFX = [x for x in SFX if x[1] not in ('giggle_a', 'giggle_b')]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch1_sfx.json', 'w'), indent=1)
print(len(SFX), 'sound cues,', len(BEDS), 'beds')
