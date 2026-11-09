"""Chapter 6: Lock Your Door (9:34-11:34)."""
from film_lib import *
F = Film(574.3, 694.39)
NIGHT_RED = 'saturate(1.2) sepia(0.2) hue-rotate(-20deg) brightness(0.85)'
F.shot(574.3, 579.6, 'rooms/bedroom_evening.json', who=[None, {'clip': 'idle', 'at': [0.30, 0.82], 'face': {'brows': 'worried', 'mouth': 'flat'}}],
       cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.15, 'aim': [0.35, 0.5]}}, overlays=[{'type': 'black', 't0': 574.3, 't1': 574.9, 'fadeIn': 0.01, 'fadeOut': 0.5}])
F.shot(579.6, 585.2, 'rooms/bedroom_evening.json', who=[None, {'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.6}, 'at': [0.32, 0.80]}],
       events=[{'t': 582.6, 'i': 1, 'play': 'idle'}], cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.05, 'aim': [0.55, 0.5]}})
F.shot(585.2, 587.0, 'rooms/bedroom_evening.json', who=[None, {'clip': 'idle', 'lip': 'c6_27', 'lipGain': 1.6, 'at': [0.80, 0.76], 'face': {'brows': 'worried'}}],
       cam={'a': {'zoom': 2.3, 'aim': [0.80, 0.33]}, 'b': {'zoom': 2.4, 'aim': [0.80, 0.33]}})
F.shot(587.0, 588.6, flat('bg_bedroom_door_night'), cam={'a': {'zoom': 1.6, 'aim': [0.72, 0.3]}, 'b': {'zoom': 1.7, 'aim': [0.72, 0.3]}, 'kicks': [588.25], 'kick': 0.6})
F.shot(588.6, 593.0, 'rooms/bedroom_night.json', events=[{'t': 590.75, 'i': 0, 'card': 'bed_sit'}],
       cam={'a': {'zoom': 1.3, 'aim': [0.25, 0.5]}, 'b': {'zoom': 1.5, 'aim': [0.22, 0.5]}, 'kicks': [590.45, 590.75, 591.05], 'kick': 0.7})
F.shot(593.0, 599.5, flat('bg_bedroom_door_night'), filter=NIGHT_RED, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.5, 0.5]}, 'ease': 'linear'})
F.shot(599.5, 605.0, 'rooms/bedroom_night.json', who=[{'card': 'bed_sit'}], cam={'a': {'zoom': 2.2, 'aim': [0.18, 0.45]}, 'b': {'zoom': 2.5, 'aim': [0.18, 0.45]}})
F.shot(605.0, 609.3, flat('bg_bedroom_door_night'), cam={'a': {'zoom': 1.5, 'aim': [0.72, 0.3]}, 'b': {'zoom': 2.0, 'aim': [0.72, 0.3]}, 'ease': 'linear'})
F.shot(609.3, 617.0, 'rooms/bedroom_night.json', who=[{'card': 'bed_sit'}], cam={'a': {'zoom': 1.3, 'aim': [0.3, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.45, 0.5]}})
F.shot(617.0, 619.8, 'rooms/bedroom_night.json', who=[{'card': 'bed_sit'}], cam={'a': {'zoom': 2.0, 'aim': [0.2, 0.47]}, 'b': {'zoom': 2.1, 'aim': [0.2, 0.47]}},
       overlays=[{'type': 'glow', 't0': 618.9, 't1': 619.8, 'spots': [[0.2, 0.62, 520]], 'fadeIn': 0.1, 'fadeOut': 0.01}])
mom = [{'t': 620.6, 'text': "Don't open your door."}, {'t': 622.6, 'text': "I'm in the car outside."},
       {'t': 623.9, 'text': 'Somebody called me an hour ago from your number.'}, {'t': 626.2, 'text': 'It sounded exactly like you.'},
       {'t': 627.9, 'text': 'It said you needed me to go and get you from school.'}]
F.shot(619.8, 630.5, flat('bg_car_night'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.1, 'aim': [0.6, 0.4]}},
       overlays=[{'type': 'black', 'alpha': 0.45, 't0': 619.8, 't1': 630.5, 'fadeIn': 0.2, 'fadeOut': 0.1}, {'type': 'chat', 'title': 'Mom ❤️', 't0': 619.8, 't1': 630.5, 'fadeIn': 0.2, 'fadeOut': 0.1, 'msgs': mom, 'x': 0.32}])
F.shot(630.5, 641.4, flat('bg_bedroom_door_night'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 2.1, 'aim': [0.4, 0.86]}, 'ease': 'linear'})
F.shot(641.4, 643.8, flat('bg_ext_midday'), filter='grayscale(0.8) contrast(1.2)', cam={'a': {'zoom': 1.3, 'aim': [0.5, 0.6]}, 'b': {'zoom': 1.4, 'aim': [0.5, 0.6]}},
       overlays=[{'type': 'flash', 't0': 641.4, 't1': 641.8, 'fadeIn': 0.01, 'fadeOut': 0.35, 'alpha': 0.8}])
F.shot(643.8, 646.0, empty('door_close'), filter='grayscale(0.8) contrast(1.2)', cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.5]}},
       overlays=[{'type': 'flash', 't0': 645.6, 't1': 646.0, 'fadeIn': 0.35, 'fadeOut': 0.01, 'alpha': 0.8}])
F.shot(646.0, 650.1, flat('bg_house_night'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 2.0, 'aim': [0.51, 0.27]}, 'ease': 'linear'})
F.shot(650.1, 653.8, 'rooms/bedroom_night.json', who=[{'card': 'bed_sit'}], cam={'a': {'zoom': 2.6, 'aim': [0.18, 0.43]}, 'b': {'zoom': 3.0, 'aim': [0.18, 0.42]}})
F.shot(653.8, 657.0, flat('bg_bedroom_door_night'), filter=NIGHT_RED, cam={'a': {'zoom': 1.4, 'aim': [0.5, 0.5]}, 'b': {'zoom': 2.2, 'aim': [0.5, 0.5]}, 'ease': 'in'})
F.shot(657.0, 665.4, 'rooms/bedroom_day.json', cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.58, 0.55]}, 'ease': 'linear'})
code = [{'t': 665.6, 'text': 'goodnight. code word:'}, {'t': 666.6, 'text': '<span style="filter:blur(10px)">blueberry pancakes</span>'}]
F.shot(665.4, 672.0, 'rooms/bedroom_day.json', cam={'a': {'zoom': 1.5, 'aim': [0.58, 0.55]}, 'b': {'zoom': 1.6, 'aim': [0.58, 0.55]}},
       overlays=[{'type': 'black', 'alpha': 0.5, 't0': 665.4, 't1': 672.0, 'fadeIn': 0.2, 'fadeOut': 0.2}, {'type': 'chat', 'title': 'Mom ❤️', 't0': 665.4, 't1': 672.0, 'fadeIn': 0.2, 'fadeOut': 0.2, 'msgs': code}])
names = [(677.4, 'MS. HARLOW', 0.25, 0.25), (678.1, 'TYLER', 0.72, 0.3), (678.6, 'PRINCIPAL DAWES', 0.3, 0.7), (679.5, 'MOM', 0.75, 0.68), (680.1, 'ME', 0.5, 0.48)]
F.shot(672.0, 683.6, flat('bg_bedroom_door_night'), filter='brightness(0.8)', cam={'a': {'zoom': 1.2, 'aim': [0.5, 0.5]}, 'b': {'zoom': 1.6, 'aim': [0.5, 0.5]}, 'ease': 'linear', 'kicks': [674.3, 674.65, 675.0], 'kick': 0.8},
       overlays=[{'type': 'text', 'text': n, 'x': x, 'y': y, 'size': 84, 'color': '#ff3b3b', 'alpha': 0.85, 't0': t, 't1': 683.3, 'fadeIn': 0.15, 'fadeOut': 0.4} for t, n, x, y in names])
F.shot(683.6, 688.8, 'rooms/bedroom_night_walk.json', who=[{'view': 'front', 'clip': 'idle', 'at': [0.5, 0.90], 'lip': 'c6_33', 'lipGain': 1.3, 'face': {'brows': 'worried', 'eyes': 'wide'}}],
       cam={'a': {'zoom': 1.9, 'aim': [0.5, 0.2]}, 'b': {'zoom': 2.2, 'aim': [0.5, 0.18]}})
F.shot(688.8, 694.39, 'rooms/home_hall_night.json', who=[{'clip': 'idle', 'lip': 'c6_34', 'lipGain': 1.2, 'face': {'eyes': 'creepy', 'mouth': 'grin', 'brows': 'up'}}],
       cam={'a': {'zoom': 1.0}, 'b': {'zoom': 2.6, 'aim': [0.5, 0.42]}, 'ease': 'in'},
       overlays=[{'type': 'black', 't0': 692.6, 't1': 694.5, 'fadeIn': 0.01, 'fadeOut': 0.01}])
F.save('ch6')
