"""Chapter 4: Tyler (5:42-7:46)."""
from film_lib import *
F = Film(342.0, 465.6)
PH = 'rooms/corner_dark.json'
WAIT = moods(tyler=('shake', 1.0), dong=('shiver', 1.2), marcus='lookaround', priya='shock', kid_a='sob', kid_b='rock', harlow=('shake', 1.0))
F.shot(342.0, 349.0, flat('bg_hallway_side_dim'), cam={'a': {'zoom': 1.35, 'aim': [0.22, 0.5]}, 'b': {'zoom': 1.35, 'aim': [0.78, 0.5]}, 'ease': 'linear', 'kicks': [344.3, 344.55, 346.6, 346.85], 'kick': 0.5})
for t0, t1, num, ks in [(349.0, 349.95, '204', [349.3, 349.55]), (349.95, 350.75, '206', [350.2, 350.45]), (350.75, 353.7, '216', [351.2, 351.45, 352.6])]:
    F.shot(t0, t1, flat('bg_door_hall_close', tint=0x8a93ad), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.06}, 'kicks': ks, 'kick': 0.7},
           overlays=[{'type': 'text', 'cls': 'plaque', 'text': num, 'x': 0.79, 'y': 0.29, 'size': 58, 't0': t0, 't1': t1, 'fadeIn': 0.01, 'fadeOut': 0.01}])
F.shot(353.7, 362.6, flat('bg_hallway_dim'), cam={'a': {'zoom': 1.1}, 'b': {'zoom': 1.7, 'aim': [0.5, 0.45]}, 'ease': 'linear'},
       overlays=[{'type': 'flicker', 't0': 353.7, 't1': 362.6, 'fadeIn': 0.01, 'fadeOut': 0.01, 'rate': 9, 'on': 0.78, 'alpha': 0.8}])
F.shot(362.6, 364.4, flat('bg_hallway_dim'), overlays=[{'type': 'clock', 't0': 362.6, 't1': 364.4, 'h': 12, 'm': 0, 'label': '12:00 PM', 'fadeIn': 0.01, 'fadeOut': 0.01}])
F.shot(364.4, 368.6, empty('door_close'), cam={'a': {'zoom': 1.15, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.45]}, 'kicks': [364.45, 364.85, 365.25], 'kick': 1.2})
F.shot(368.6, 379.5, empty('door_close'), cam={'a': {'zoom': 1.35, 'aim': [0.5, 0.42]}, 'b': {'zoom': 2.2, 'aim': [0.5, 0.38]}, 'ease': 'linear', 'kicks': [377.3, 377.9, 378.5], 'kick': 0.9})
LOOK = moods(tyler=('headshake', 1.4), dong={'opts': {'mood': 'shock'}, 'face': {'look': 1}}, marcus={'opts': {'mood': 'shock'}, 'face': {'look': -1}},
             priya='shock', kid_a='shock', kid_b='shock', harlow='shock')
F.shot(379.5, 384.6, PH, who=LOOK, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.6, 'aim': [0.27, 0.5]}})
F.shot(384.6, 391.5, PH, who=LOOK, cam={'a': {'zoom': 2.1, 'aim': [0.25, 0.5]}, 'b': {'zoom': 2.3, 'aim': [0.25, 0.5]}})
F.shot(391.5, 393.9, PH, who=LOOK, cam=close('tyler', 2.8, 3.0))
FB = 'sepia(0.35) saturate(0.8) brightness(1.05) contrast(0.9) blur(0.6px)'
F.shot(393.9, 397.3, PH, who=moods(tyler='whisper', dong=('shiver', 1.0), marcus='lookaround'), filter=FB, cam=close('tyler', 2.3, 2.4),
       overlays=[{'type': 'flash', 't0': 393.9, 't1': 394.3, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.7}])
F.shot(397.3, 401.7, empty('door_close'), cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.42]}, 'b': {'zoom': 2.6, 'aim': [0.5, 0.4]}, 'ease': 'in'})
F.shot(401.7, 412.9, empty('door_close'), cam={'a': {'zoom': 1.5, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.62, 'aim': [0.5, 0.45]}, 'ease': 'linear'},
       filter='brightness(0.85)')
F.shot(412.9, 420.2, PH, who=moods(tyler=('sob', 1.2), dong=('shiver', 1.3), marcus={'opts': {'mood': 'still'}, 'face': {'look': -1, 'brows': 'worried'}}), cam={'a': {'zoom': 2.1, 'aim': [0.29, 0.5]}, 'b': {'zoom': 2.3, 'aim': [0.29, 0.5]}})
F.shot(420.2, 428.3, PH, who=moods(tyler=('sob', 1.0), dong=('shiver', 1.3), marcus='still', priya='shock', kid_a='sob', kid_b='rock', harlow=('shake', 1.2)), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'dz': 0.3}})
F.shot(428.3, 434.1, PH, who=moods(dong=('shiver', 1.7), tyler=('sob', 1.0)), cam=close('dong', 2.6, 2.9))
F.shot(434.1, 440.4, empty('door_close'), cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.35]}, 'b': {'zoom': 3.0, 'aim': [0.5, 0.22]}, 'ease': 'linear'})
# Dong crawls towards the door (off to the right)
F.shot(440.4, 446.4, PH, who=moods(dong=('shiver', 1.4), tyler=('sob', 1.0), marcus='shock'),
       events=[{'t': 444.2, 'i': 1, 'card': 'crawl'}, {'t': 444.2, 'i': 1, 'slide': [1.1, 0.35], 'dur': 2.2}],
       cam={'a': {'zoom': 2.0, 'aim': [0.2, 0.52]}, 'b': {'zoom': 1.6, 'aim': [0.32, 0.55]}})
TRI = 'polygon(36% 14%, 70% 22%, 44% 88%)'
F.shot(446.4, 452.9, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.45]}, 'b': {'zoom': 1.35, 'aim': [0.5, 0.45]}})
F.shot(452.9, 456.4, empty('door_close'), cam={'a': {'zoom': 1.5, 'aim': [0.45, 0.8]}, 'b': {'zoom': 2.2, 'aim': [0.45, 0.85]}, 'ease': 'linear'})
F.shot(456.4, 463.3, flat('bg_hallway_dim'), clip=TRI, cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.45]}, 'b': {'zoom': 2.2, 'aim': [0.5, 0.47]}, 'ease': 'in'})
F.shot(463.3, 465.6, PH, who=moods(dong={'card': 'crawl', 'opts': {}, 'clip': 'idle', 'pos': [-0.95, 0, 0], 'wall': 0.9}), cam={'a': {'zoom': 2.6, 'aim': [0.36, 0.68]}, 'b': {'zoom': 2.9, 'aim': [0.36, 0.68]}, 'kicks': [463.55], 'kick': 1.5},
       overlays=[{'type': 'black', 't0': 463.3, 't1': 463.55, 'fadeIn': 0.01, 'fadeOut': 0.01}, {'type': 'black', 't0': 465.0, 't1': 465.7, 'fadeIn': 0.5, 'fadeOut': 0.01}])
F.save('ch4')
