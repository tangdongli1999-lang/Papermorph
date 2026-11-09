"""Chapter 3: The Group Chat (3:59-5:42)."""
from film_lib import *
F = Film(239.0, 342.0)
WAIT = moods(tyler=('shake', 0.8), dong=('shiver', 1.0), marcus='lookaround', priya='shock', kid_a='sob', kid_b='rock', harlow='still')
PH = 'rooms/corner_dark.json'
glow = lambda t0, t1, spots: {'type': 'glow', 't0': t0, 't1': t1, 'spots': spots, 'fadeIn': 0.6}
F.shot(239.0, 240.9, flat('bg_ext_midday'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.6, 0.45]}})
F.shot(240.9, 242.3, flat('bg_ext_midday'), overlays=[{'type': 'clock', 't0': 240.9, 't1': 242.3, 'h': 10, 'm': 20, 'h2': 11, 'm2': 20, 't2': 241.05, 'label': '11:20 AM', 'fadeIn': 0.01, 'fadeOut': 0.01}])
spots = [[x, y - 0.02, 230] for x, y in LAPS if x != 0.82]
F.shot(242.3, 249.4, PH, who=WAIT, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.08, 'dz': 0.2}}, overlays=[glow(242.6, 249.4, spots)])
chat1 = [{'t': 249.7, 'name': 'Jayden', 'text': 'is anyone else hearing knocking??', 'color': '#ffb86b'},
         {'t': 251.8, 'name': 'Mia', 'text': "it's in the science wing", 'color': '#7ee0a3'},
         {'t': 253.2, 'name': 'Ethan', 'text': 'it said it was the nurse', 'color': '#c79bff'},
         {'t': 257.4, 'name': 'Kayla · Room 208', 'text': "Coach Reyes is outside. He says it's clear. We're opening.", 'color': '#ff8fb1', 'seen': 261.4}]
F.shot(249.4, 264.9, PH, who=WAIT, cam={'a': {'zoom': 1.6, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.7, 'aim': [0.45, 0.55]}},
       overlays=[{'type': 'black', 'alpha': 0.55, 't0': 249.4, 't1': 264.9, 'fadeIn': 0.25, 'fadeOut': 0.1}, {'type': 'chat', 't0': 249.4, 't1': 264.9, 'fadeIn': 0.25, 'fadeOut': 0.1, 'msgs': chat1}])
F.shot(264.9, 269.3, PH, who=WAIT, cam=close('harlow', 2.2, 2.4))
F.shot(269.3, 270.6, PH, who=WAIT[:6] + [{'card': 'phone', 'clip': 'idle'}], cam=close('harlow', 2.2, 2.3, dy=0.04))
chat2 = chat1 + [{'t': 272.4, 'name': 'Sofia', 'text': "something knocked on 204 in Mr. Kim's voice. Mr. Kim is IN 204", 'color': '#ffd36b'},
                 {'t': 276.7, 'name': 'Ethan', 'text': 'it knows our names', 'color': '#c79bff'},
                 {'t': 278.5, 'name': 'Jayden', 'text': 'why is nobody coming', 'color': '#ffb86b'},
                 {'t': 281.7, 'name': 'Room 210', 'text': "Don't talk. It's listening. It only knows voices it's heard.", 'color': '#ff6b6b', 'alert': True}]
F.shot(270.6, 287.4, PH, who=WAIT[:6] + [{'card': 'phone', 'clip': 'idle'}], cam={'a': {'zoom': 1.6, 'aim': [0.55, 0.55]}, 'b': {'zoom': 1.7, 'aim': [0.55, 0.55]}},
       overlays=[{'type': 'black', 'alpha': 0.55, 't0': 270.6, 't1': 287.4, 'fadeIn': 0.25, 'fadeOut': 0.1}, {'type': 'chat', 't0': 270.6, 't1': 287.4, 'fadeIn': 0.25, 'fadeOut': 0.1, 'msgs': chat2, 'keep': 5}])
F.shot(287.4, 297.3, flat('bg_hallway_dim'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.45]}, 'ease': 'linear'},
       overlays=[{'type': 'flicker', 't0': 287.4, 't1': 297.3, 'fadeIn': 0.01, 'fadeOut': 0.01, 'rate': 7, 'on': 0.85, 'alpha': 0.7}])
F.shot(297.3, 303.2, PH, who=moods(dong=('shiver', 1.0)), cam=close('dong', 2.3, 2.6), overlays=[glow(297.3, 303.2, [[0.47, 0.9, 520]])])
F.shot(303.2, 307.4, PH, who=moods(dong={'card': 'floor_phone', 'clip': 'idle'}), cam=close('dong', 2.4, 2.6, dy=0.04), overlays=[glow(303.2, 307.4, [[0.52, 0.42, 440]])])
F.shot(307.4, 312.3, PH, who=moods(dong={'opts': {'mood': 'shake', 'intensity': 0.7}, 'lip': 'c3_15', 'lipGain': 1.1}), cam=close('dong', 2.9, 3.1), overlays=[glow(307.4, 312.3, [[0.47, 0.92, 560]])])
F.shot(312.3, 324.6, 'rooms/kitchen_mom.json', cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.45]}, 'b': {'zoom': 2.0, 'aim': [0.5, 0.42]}, 'ease': 'linear'})
F.shot(324.6, 327.4, PH, who=moods(priya='stare', dong=('shiver', 1.2)), cam=close('priya', 2.5, 2.7))
F.shot(327.4, 336.2, empty('door_close'), cam={'a': {'zoom': 1.2, 'aim': [0.45, 0.7]}, 'b': {'zoom': 2.1, 'aim': [0.45, 0.84]}, 'ease': 'linear', 'kicks': [333.1], 'kick': 0.4})
F.shot(336.2, 342.0, PH, who=moods(dong=('terror', 1.0), tyler=('shake', 1.2), marcus='shock'), cam=close('dong', 2.5, 3.0),
       overlays=[{'type': 'black', 't0': 341.3, 't1': 342.1, 'fadeIn': 0.6, 'fadeOut': 0.01}])
F.save('ch3')
