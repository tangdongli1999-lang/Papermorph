"""Chapter 5 (7:45-9:34), "Clear", storyboarded word by word: every phrase of the narration is shown happening, with its sound.
Writes film/ch5.json (picture) and film/ch5_sfx.json (sound cues [time, sound, volume] and beds)."""
import json
from film_lib import *
F = Film(465.6, 574.3); SFX = []
def sfx(t, name, vol=0.6): SFX.append([round(t, 3), name, vol])
def room(n, **k): r = R(n); r.update(k); return r
def withplate(n, img, who=None, **k):
    r = R(n); r['plate'] = dict(r['plate'], img=f'art/{img}.png'); r['who'] = who if who is not None else r['who']; r.update(k); return r
def flatwho(img, who, tint=None):
    r = flat(img, tint); r['who'] = who; r['tint'] = tint if tint is not None else 0xffffff; return r
MEMORY = 'sepia(0.35) saturate(0.8) brightness(1.05) contrast(0.9)'
WARM = 'sepia(0.25) saturate(1.2) brightness(1.04)'
CCTV = 'grayscale(1) contrast(1.3) brightness(1.15)'
HALL = 0x30364a
PA = 'rooms/corner_afternoon.json'
DOOR = lambda img='plate_door_away_23': withplate('door_close', img, who=[])
W = json.load(open('/home/claude/lockdown/vo/words.json'))
FEARS = ['shiver', 'terror', 'shock', 'sob', 'lookaround', 'headshake', 'shake']
def fearify(name, v):
    if isinstance(v, dict) and ('lip' in v or 'card' in v): return v
    mood, inten = (v[0], v[1]) if isinstance(v, tuple) else (v, 1.0) if isinstance(v, str) else (v.get('opts', {}).get('mood'), v.get('opts', {}).get('intensity', 1.0)) if isinstance(v, dict) else (None, 1)
    if mood not in ('shiver', 'shake', 'terror', 'shock', 'rock'): return v
    k = ORDER.index(name); out = {'opts': {'mood': 'fear', 'list': FEARS[k:] + FEARS[:k], 'intensity': inten}}
    if isinstance(v, dict): out = {**v, 'opts': {**v.get('opts', {}), **out['opts']}}
    return out
def huddle(**m): return moods(**{n: (fearify(n, v) if n != 'harlow' else v) for n, v in m.items()})
# five hours on: still frightened, but worn out (fear faces still cycling, at half strength)
TIRED = dict(tyler=('shake', 0.5), dong=('shiver', 0.5), marcus=('shock', 0.5), priya=('rock', 0.5), kid_a=('shake', 0.5), kid_b=('rock', 0.5), harlow={'opts': {'mood': 'shake', 'intensity': 0.4}})
ASLEEP = {**TIRED, 'marcus': 'asleep'}
LOOKDOOR = {n: {'opts': {'mood': 'lookat', 'look': 1}} for n in ORDER}

# 465.6 "It didn't come back." - the strip of light under our door: empty
F.shot(465.6, 467.49, DOOR(), cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.8]}, 'b': {'zoom': 1.5, 'aim': [0.45, 0.78]}})
# 467.49 "We sat in that corner for five more hours." - the corner, late light
F.shot(467.49, 469.08, PA, who=huddle(**TIRED), cam={'a': {'zoom': 1.15, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.0}})
# 469.08 "five more hours" - the clock hands sweep round
F.shot(469.08, 470.41, flat('bg_intercom'), overlays=[{'type': 'clock', 't0': 469.08, 't1': 470.41, 'h': 12, 'm': 0, 'h2': 4, 'm2': 35, 't2': 469.15, 'dur': 1.1, 'label': '', 'dark': True, 'fadeIn': 0.01, 'fadeOut': 0.01}])
sfx(469.1, 'tick', 0.5); sfx(469.5, 'tick', 0.5); sfx(469.9, 'tick', 0.5)
# 470.41 "Nobody ate," (a lunch box, shut, untouched by Priya) 471.43 "nobody talked." - the camera drifts along silent, exhausted faces
F.shot(470.41, 472.5, PA, who=huddle(**TIRED), cam={'a': {'zoom': 1.7, 'aim': [0.2, 0.5]}, 'b': {'zoom': 1.7, 'aim': [0.6, 0.5]}, 'ease': 'linear'})
# 472.5 "Marcus fell asleep sitting up." - his eyes close and his head drops on "asleep"
F.shot(472.5, 474.43, PA, who=huddle(**TIRED), events=[{'t': 473.24, 'i': 2, 'mood': 'asleep'}], cam=close('marcus', 2.6, 2.8))
# 474.43 "At four forty," - the clock: 4:40
F.shot(474.43, 475.46, flat('bg_intercom'), overlays=[{'type': 'clock', 't0': 474.43, 't1': 475.46, 'h': 4, 'm': 40, 'label': '4:40 PM', 'dark': True, 'fadeIn': 0.01, 'fadeOut': 0.01}])
# 475.46 "there were heavy footsteps," - shadows arrive under the door, and the door trembles with the tread
F.shot(475.46, 477.04, DOOR('plate_door_arrive_start'), events=[{'t': round(475.6 + k * 0.12, 3), 'plate': f'art/plate_door_arrive_{k}.png'} for k in range(8)],
       cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.78]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.8]}, 'kicks': [475.8, 476.2, 476.6], 'kick': 0.35})
sfx(475.5, 'squad', 1.3)
# 477.04 "a lot of them," - every head snaps to the door; Marcus jolts awake
F.shot(477.04, 477.76, PA, who=huddle(**{**LOOKDOOR, 'marcus': {'opts': {'mood': 'lookat', 'look': 1}}}), events=[{'t': 477.1, 'flinch': 0.8}], cam={'a': {'zoom': 1.05}, 'b': {'zoom': 1.1}})
sfx(477.1, 'gasp', 0.5)
# 477.76 "and then the one sound we'd been waiting for all day." - Dong close: staring at the door, not breathing
F.shot(477.76, 481.01, PA, who=huddle(**{**LOOKDOOR, 'dong': {'opts': {'mood': 'stare', 'look': 1, 'blank': 1}}}), cam=close('dong', 2.6, 3.0))
# 481.01 "A key, in the lock." - a deputy's hand turns a key in our lock
F.shot(481.01, 483.26, flat('bg_key_lock'), cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.52, 0.42]}, 'kicks': [481.73], 'kick': 0.5})
sfx(481.05, 'keyturn', 1.4)
# 483.26 DEPUTY: "Sheriff's department. Stay where you are. We're bringing you out." - in the open doorway, mouthing it
F.shot(483.26, 487.8, 'rooms/door_open.json', who=[{'lip': 'c5_24', 'clip': 'idle', 'face': {'mouth': 'flat', 'brows': 'worried'}}], cam={'a': {'zoom': 1.3, 'aim': [0.69, 0.45]}, 'b': {'zoom': 1.7, 'aim': [0.69, 0.4]}})
sfx(483.3, 'door_open', 1.0)
# 487.8 "They had keys." - the ring of keys in the lock
F.shot(487.8, 488.92, flat('bg_key_lock'), cam={'a': {'zoom': 1.9, 'aim': [0.48, 0.55]}, 'b': {'zoom': 2.0, 'aim': [0.48, 0.55]}})
sfx(487.9, 'keys', 0.8)
# 488.92 "They didn't knock, and they didn't ask." - the deputy steps straight in, waving us up
F.shot(488.92, 490.92, 'rooms/door_open.json', who=[{'clip': 'talk', 'face': {'mouth': 'flat', 'brows': 'worried'}}], cam={'a': {'zoom': 1.15, 'aim': [0.6, 0.5]}, 'b': {'zoom': 1.25, 'aim': [0.62, 0.5]}})
# 490.92 "They walked us out single file," - the class walking down the dark hallway, one behind another
LINE = [('kid_b', -0.55, 0.84), ('marcus', -0.34, 0.70), ('priya', -0.13, 0.94), ('kid_a', 0.08, 1.0), ('tyler', 0.29, 0.76), ('dong', 0.50, 0.80)]
WALK = [{'n': n, 'view': 'side', 'facing': 1, 'clip': 'walk', 'at': [u, 0.80], 'opts': {'pace': pc}, 'sideHead': 'scared'} for n, u, pc in LINE]
F.shot(490.92, 492.75, withplate('hallway_side', 'bg_hallway_side_dim', who=WALK), cam={'a': {'zoom': 1.05, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.05, 'aim': [0.6, 0.5]}, 'ease': 'linear'})
for k in range(6): sfx(491.0 + k * 0.3, f'sneaker{1 + k % 2}', 0.5)
# 492.75 "hands on the shoulder of the person in front." - close on the line: each hand on the shoulder ahead, Ms. Harlow leading
F.shot(492.75, 495.16, withplate('hallway_side', 'bg_hallway_side_dim', who=[{'n': 'harlow', 'card': 'line', 'at': [0.42, 0.86]}]), events=[{'t': 492.8, 'i': 0, 'slide': [0.5, 0], 'dur': 2.3}],
       cam={'a': {'zoom': 1.5, 'aim': [0.42, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.5]}, 'ease': 'linear'})
sfx(493.0, 'cloth', 0.4)
# 495.16 "And as we went down the hall," - walking past the doors (Dong's eyes)
F.shot(495.16, 496.78, flat('bg_hallway_dim_open'), cam={'a': {'zoom': 1.0, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.3, 'aim': [0.45, 0.5]}, 'ease': 'linear', 'shake': 0.3})
# 496.78 "I looked into Room 208." 499.02 "The door was wide open." - Room 208's door, wide open
F.shot(496.78, 499.02, flat('bg_hall_five_open'), cam={'a': {'zoom': 1.0, 'aim': [0.5, 0.5]}, 'b': {'zoom': 2.0, 'aim': [0.12, 0.45]}, 'shake': 0.3})
F.shot(499.02, 500.55, flat('bg_hall_five_open'), cam={'a': {'zoom': 2.4, 'aim': [0.1, 0.45]}, 'b': {'zoom': 2.8, 'aim': [0.09, 0.45]}})
sfx(499.4, 'creak', 0.4)
# 500.55 "Every backpack was still on its desk." - inside: bag after bag, left where they were dropped
ROOM208 = lambda k: flat(f'plate_208_roll_{k}', tint=0xb6b8c6)
F.shot(500.55, 502.8, ROOM208(0), cam={'keys': [[500.55, {'zoom': 2.0, 'aim': [0.18, 0.62]}], [501.35, {'zoom': 2.0, 'aim': [0.22, 0.5]}], [502.2, {'zoom': 2.0, 'aim': [0.74, 0.5]}], [502.8, {'zoom': 1.9, 'aim': [0.74, 0.52]}]]})
# 502.8 "A water bottle was rolling slowly on the floor." - rolling down the aisle, slowing, stopping
F.shot(502.8, 505.62, ROOM208(0), events=[{'t': round(502.84 + k * 0.115, 3), 'plate': f'art/plate_208_roll_{k}.png'} for k in range(1, 24)],
       cam={'a': {'zoom': 2.4, 'aim': [0.5, 0.86]}, 'b': {'zoom': 2.3, 'aim': [0.55, 0.86]}})
sfx(502.85, 'bottle', 0.9)
# 505.62 "Nobody was in there." - the whole empty room
F.shot(505.62, 506.89, ROOM208(23), cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.0}})
# 506.89 "On the stairs," - Dong on the stairs, looking back up the hall
F.shot(506.89, 508.28, 'rooms/stairwell.json', who=[{'n': 'priya', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.6}, 'at': [0.12, 0.80], 'sideHead': 'scared'},
                                                    {'n': 'dong', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.78, 0.84], 'sideHead': 'scared'}],
       events=[{'t': 506.95, 'i': 0, 'runTo': [0.45, 0.80], 'then': 'idle'}], cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.4, 'aim': [0.72, 0.5]}})
# 508.28 "I counted the open doors on our floor." 510.0 "Five." - the hall: one open door after another, a beat on each
CNT = [[508.28, {'zoom': 1.0, 'aim': [0.5, 0.5]}], [508.6, {'zoom': 1.6, 'aim': [0.28, 0.5]}], [508.95, {'zoom': 1.6, 'aim': [0.67, 0.45]}], [509.3, {'zoom': 1.6, 'aim': [0.72, 0.45]}],
       [509.6, {'zoom': 1.6, 'aim': [0.93, 0.5]}], [510.0, {'zoom': 1.05, 'aim': [0.5, 0.5]}], [510.67, {'zoom': 1.08, 'aim': [0.5, 0.5]}]]
F.shot(508.28, 510.67, flat('bg_hall_five_open'), cam={'keys': CNT, 'kicks': [508.6, 508.95, 509.3, 509.6, 510.0], 'kick': 0.4})
for t in (508.6, 508.95, 509.3, 509.6): sfx(t, 'tick', 0.6)
sfx(510.0, 'hit', 0.6)
# 510.67 "Five rooms that heard someone they trusted" - (memory) another class's door lever going down from inside
F.shot(510.67, 513.08, flat('plate_door_hall_212_lv0'), filter=MEMORY, events=[{'t': 512.0, 'plate': 'art/plate_door_hall_212_lv6.png'}, {'t': 512.15, 'plate': 'art/plate_door_hall_212_lv12.png'}, {'t': 512.3, 'plate': 'art/plate_door_hall_212_lv18.png'}],
       cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.9, 'aim': [0.45, 0.55]}}, overlays=[{'type': 'flash', 't0': 510.67, 't1': 511.0, 'fadeIn': 0.01, 'fadeOut': 0.3, 'alpha': 0.6}])
sfx(510.7, 'whoosh', 0.4); sfx(512.0, 'handle_down', 0.7)
# 513.08 "and did exactly what any normal person would do." - the door swings open
F.shot(513.08, 516.4, flat('plate_door_hall_208_open'), filter=MEMORY, cam={'a': {'zoom': 1.3, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.5]}})
sfx(513.2, 'door_open', 0.6)
# 516.4 "Nobody from those rooms was outside with us." - into an empty doorway down the hall
F.shot(516.4, 518.97, flat('bg_hall_five_open'), cam={'a': {'zoom': 1.6, 'aim': [0.28, 0.5]}, 'b': {'zoom': 2.6, 'aim': [0.18, 0.55]}, 'ease': 'in'})
# 518.97 "Nobody from those rooms was ever found." - the empty room 208 goes dark
F.shot(518.97, 521.32, ROOM208(23), events=[{'t': 520.0, 'plateTint': 0x3a3e4c}], cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.5, 0.55]}, 'ease': 'linear'})
sfx(520.3, 'boom', 0.5)
# 521.32 "Outside, it was chaos." 522.87 "Parents," 523.45 "police," 524.02 "news vans." - the camera finds each one on its word
F.shot(521.32, 524.91, flat('bg_school_chaos'), cam={'keys': [[521.32, {'zoom': 1.0, 'aim': [0.5, 0.5]}], [522.4, {'zoom': 1.05, 'aim': [0.5, 0.5]}], [522.87, {'zoom': 1.9, 'aim': [0.45, 0.85]}],
                                                              [523.45, {'zoom': 1.9, 'aim': [0.62, 0.66]}], [524.02, {'zoom': 1.9, 'aim': [0.2, 0.6]}], [524.91, {'zoom': 2.0, 'aim': [0.2, 0.6]}]], 'shake': 0.6})
sfx(521.4, 'whoosh', 0.5)
# 524.91 "I heard a deputy telling Ms. Harlow they'd checked every security camera in the building," - the deputy talking, Ms. Harlow listening, frightened
LAWN_WHO = ([{'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}}, {'clip': 'talk', 'face': {'brows': 'worried'}}, {'clip': 'idle', 'face': {'eyes': 'wide', 'brows': 'worried', 'mouth': 'o'}},
                                          {'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}}, {'hidden': 1}])
F.shot(524.91, 527.46, 'rooms/lawn_close.json', who=LAWN_WHO, cam={'a': {'zoom': 1.8, 'aim': [0.41, 0.5]}, 'b': {'zoom': 2.0, 'aim': [0.41, 0.5]}})
# 527.46 the security cameras: "and all day long, the second-floor hallway was empty." - grey camera footage of the empty hall
CAM = lambda t0, t1, clock, cam='CAM 07 · 2F HALLWAY': {'type': 'cctv', 't0': t0, 't1': t1, 'fadeIn': 0.01, 'fadeOut': 0.01, 'clock': clock, 'cam': cam}
F.shot(527.46, 530.57, flat('bg_hallway_side_dim'), filter=CCTV, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.03}}, overlays=[CAM(527.46, 530.57, 36000)])
F.shot(530.57, 532.51, flat('bg_hallway_dim'), filter=CCTV, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.02}}, overlays=[CAM(530.57, 532.51, 44100, 'CAM 04 · 2F HALLWAY')])
# 532.51 "No one walking." (the hall floor, empty) 533.47 "No one knocking." (a classroom door, nobody at it)
F.shot(532.51, 533.47, flat('bg_hallway_side_dim'), filter=CCTV, cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.7]}, 'b': {'zoom': 1.32, 'aim': [0.5, 0.7]}}, overlays=[CAM(532.51, 533.47, 49800)])
F.shot(533.47, 534.4, flat('plate_door_hall_210_lv0', tint=0x9aa0b0), filter=CCTV, overlays=[CAM(533.47, 534.4, 51200, 'CAM 09 · RM 210')])
# 534.4 "Just doors, rattling, one by one, on their own." - lever after lever shaking, nobody there
def rattle(num, t0, t1, cam, clock):
    ev = [{'t': round(t0 + 0.08 + k * 0.07, 3), 'plate': f'art/plate_door_hall_{num}_lv{[12, 0, 18, 6, 12, 0][k % 6]}.png'} for k in range(int((t1 - t0 - 0.15) / 0.07))]
    ev.append({'t': round(t1 - 0.04, 3), 'plate': f'art/plate_door_hall_{num}_lv0.png'})
    F.shot(t0, t1, flat(f'plate_door_hall_{num}_lv0', tint=0x9aa0b0), filter=CCTV, events=ev, cam={'a': {'zoom': 1.15, 'aim': [0.42, 0.55]}, 'b': {'zoom': 1.2, 'aim': [0.42, 0.55]}}, overlays=[CAM(t0, t1, clock, cam)])
    sfx(t0 + 0.08, 'rattle', 0.9)
F.shot(534.4, 534.88, flat('bg_hallway_side_dim'), filter=CCTV, overlays=[CAM(534.4, 534.88, 52400)])
rattle('208', 534.88, 536.02, 'CAM 08 · RM 208', 53000)
rattle('210', 536.02, 536.89, 'CAM 09 · RM 210', 53700)
rattle('212', 536.89, 537.76, 'CAM 10 · RM 212', 54300)
# 537.76 "They sat us all in the gym across the street," - the class on the gym floor, still shaking
GYMK = lambda **m: [{'card': 'huddle', 'clip': 'huddle', 'at': [0.47 + 0.13 * i, 0.82], **({'opts': m[n]} if n in m else {'opts': {'mood': 'fear', 'list': FEARS[i:] + FEARS[:i], 'intensity': 0.5}})} for i, n in enumerate(['marcus', 'priya', 'tyler', 'dong'])]
DIST = lambda **o: {'card': 'clipboard_live', 'clip': 'huddle', 'at': [0.3, 0.86], **o}
F.shot(537.76, 539.96, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.55, 0.55]}})
# 539.96 "and a lady from the district with a clipboard" - the district lady, clipboard in hand
F.shot(539.96, 542.47, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 1.5, 'aim': [0.5, 0.55]}, 'b': {'zoom': 2.2, 'aim': [0.3, 0.45]}})
# 542.47 "asked every single one of us the same question." - from her across the row of kids
F.shot(542.47, 544.91, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 1.8, 'aim': [0.35, 0.5]}, 'b': {'zoom': 1.8, 'aim': [0.75, 0.6]}, 'ease': 'linear'})
# 544.91 "Did anyone in your room open the door?" - she says it, flat, the same way every time
F.shot(544.91, 547.4, 'rooms/gym.json', who=(GYMK() + [DIST(lip='c5_25', lipSpans=[[544.91, 546.9]], lipGain=1.4, opts={'mood': 'still'})]), cam={'a': {'zoom': 3.0, 'aim': [0.3, 0.36]}, 'b': {'zoom': 3.2, 'aim': [0.3, 0.36]}})
# 547.4 Not "are you okay." - Dong, small and shaking, nobody asking
F.shot(547.4, 549.12, 'rooms/gym.json', who=(GYMK(dong={'mood': 'sob', 'intensity': 0.8}) + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 2.8, 'aim': [0.86, 0.55]}, 'b': {'zoom': 3.0, 'aim': [0.86, 0.55]}})
# 549.12 Not "what did you see." - Tyler, staring at nothing
F.shot(549.12, 550.97, 'rooms/gym.json', who=(GYMK(tyler={'mood': 'stare', 'look': -1, 'blank': 1}) + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 2.8, 'aim': [0.73, 0.55]}, 'b': {'zoom': 3.0, 'aim': [0.73, 0.55]}})
# 550.97 "Just that." - her, waiting for the answer
F.shot(550.97, 551.93, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'stare', 'look': 1, 'blank': 1})]), cam={'a': {'zoom': 3.0, 'aim': [0.3, 0.36]}, 'b': {'zoom': 3.1, 'aim': [0.3, 0.36]}})
# 551.93 "And every time someone said no," - the kids shake their heads, one after another
NO = GYMK(**{n: {'mood': 'headshake', 'intensity': 0.7} for n in ['marcus', 'priya', 'tyler', 'dong']})
F.shot(551.93, 554.33, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'still'})]),
       events=[{'t': t, 'i': i, 'mood': 'headshake', 'intensity': 0.7} for i, t in enumerate([552.2, 552.7, 553.2, 553.57])], cam={'a': {'zoom': 1.9, 'aim': [0.62, 0.55]}, 'b': {'zoom': 1.95, 'aim': [0.66, 0.55]}})
# 554.33 "she let out this tiny breath" - held, then let go
F.shot(554.33, 556.19, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'exhale', 'at': 0.5, 'dur': 0.9, 'after': 'flat'})]), cam={'a': {'zoom': 3.0, 'aim': [0.3, 0.36]}, 'b': {'zoom': 3.2, 'aim': [0.3, 0.36]}})
sfx(555.2, 'exhale', 0.6)
# 556.19 "and wrote something down," - down to the clipboard, the pen moving
F.shot(556.19, 557.29, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 3.4, 'aim': [0.31, 0.5]}, 'b': {'zoom': 3.5, 'aim': [0.31, 0.5]}, 'kicks': [556.4, 556.7, 557.0], 'kick': 0.12})
sfx(556.3, 'pencil', 0.8)
# 557.29 "and I remember thinking," - Dong, watching her
F.shot(557.29, 558.67, 'rooms/gym.json', who=(GYMK(dong={'mood': 'stare', 'look': -1, 'blank': 1}) + [DIST(opts={'mood': 'still'})]), cam={'a': {'zoom': 2.8, 'aim': [0.86, 0.55]}, 'b': {'zoom': 3.0, 'aim': [0.86, 0.55]}})
# 558.67 "she knows. Whatever this is, she's seen it before." - slowly in on her face
F.shot(558.67, 561.54, 'rooms/gym.json', who=(GYMK() + [DIST(opts={'mood': 'stare', 'look': 1, 'blank': 1})]), cam={'a': {'zoom': 2.6, 'aim': [0.3, 0.38]}, 'b': {'zoom': 3.6, 'aim': [0.3, 0.33]}, 'ease': 'in'})
sfx(558.8, 'riser', 0.35)
# 561.54 "And then my mom came through the crowd" - Mom running between the parents toward Dong
MOMRUN = [{'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}}, {'clip': 'idle'}, {'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}}, {'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}},
          {'card': None, 'view': 'side', 'facing': 1, 'clip': 'run', 'at': [0.02, 0.73], 'sideHead': 'scared'}]
F.shot(561.54, 563.43, 'rooms/lawn_close.json', who=(MOMRUN), add=([{'n': 'dong', 'clip': 'idle', 'at': [0.62, 0.73], 'face': {'eyes': 'wide', 'mouth': 'o', 'brows': 'worried'}}]),
       events=[{'t': 561.6, 'i': 4, 'runTo': [0.55, 0.73], 'then': 'idle'}], cam={'a': {'zoom': 1.3, 'aim': [0.4, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.55, 0.55]}})
sfx(561.7, 'step_far', 0.6)
# 563.43 "and grabbed me so hard she lifted me off the ground," - she sweeps him up, his feet off the grass
LIFT = [{'clip': 'idle'}, {'clip': 'idle'}, {'clip': 'idle'}, {'clip': 'idle'}, {'card': 'lift', 'clip': 'idle', 'at': [0.58, 0.74]}]
F.shot(563.43, 566.52, 'rooms/lawn_close.json', who=(LIFT), cam={'a': {'zoom': 1.8, 'aim': [0.58, 0.55]}, 'b': {'zoom': 2.1, 'aim': [0.58, 0.55]}, 'kicks': [563.45], 'kick': 0.6})
sfx(563.45, 'cloth', 0.8); sfx(563.6, 'relief_cry', 0.7)
# 566.52 "and for the first time all day I let myself breathe." - holding on, warm, slowly closer
F.shot(566.52, 569.7, 'rooms/lawn_close.json', who=(LIFT), filter=WARM, cam={'a': {'zoom': 2.2, 'aim': [0.58, 0.45]}, 'b': {'zoom': 2.6, 'aim': [0.58, 0.42]}, 'ease': 'linear'})
sfx(568.5, 'exhale', 0.7)
# 569.7 "It was over. We'd done everything right." - the school at dusk, from further away
F.shot(569.7, 571.62, flat('bg_school_chaos'), filter=WARM, cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.0}, 'ease': 'out'})
# 571.62 "We never opened the door." - our classroom door, shut, then black
F.shot(571.62, 574.3, DOOR(), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.48]}, 'b': {'zoom': 1.45, 'aim': [0.45, 0.48]}, 'ease': 'linear'},
       overlays=[{'type': 'black', 't0': 573.6, 't1': 574.4, 'fadeIn': 0.6, 'fadeOut': 0.01}])
sfx(572.5, 'hit', 0.4)
add_lighting(F)
F.save('ch5')
BEDS = [[465.6, 490.92, 'room_dark', 0.16], [465.6, 481.01, 'dread_bed', 0.2], [467.49, 474.43, 'huddle_cry', 0.08],
        [490.92, 521.32, 'hall', 0.3], [496.78, 521.32, 'dread_bed', 0.22],
        [521.32, 527.46, 'chaos', 0.4], [527.46, 537.76, 'flicker', 0.12], [527.46, 537.76, 'dread_bed', 0.25],
        [537.76, 561.54, 'gym', 0.3], [561.54, 574.3, 'chaos', 0.22]]
SFX += [[466.0, 'breath', 0.3], [483.3, 'gasp', 0.4], [497.0, 'breath', 0.35], [527.5, 'click', 0.4], [544.9, 'breath', 0.25]]
json.dump({'sfx': SFX, 'beds': BEDS}, open('/home/claude/lockdown/web/film/ch5_sfx.json', 'w'), indent=1)
print(len(F.S), 'shots,', len(SFX), 'sound cues,', len(BEDS), 'beds')
