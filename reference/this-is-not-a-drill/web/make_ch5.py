"""Chapter 5: Clear (7:46-9:34)."""
from film_lib import *
F = Film(465.6, 574.3)
PA = 'rooms/corner_afternoon.json'
TIRED = moods(tyler='still', dong=('shiver', 0.6), marcus='asleep', priya='still', kid_a='rock', kid_b='still', harlow='still')
F.shot(465.6, 472.3, PA, who=TIRED, cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.1, 'dz': 0.3}}, overlays=[{'type': 'flash', 't0': 465.6, 't1': 466.2, 'fadeIn': 0.01, 'fadeOut': 0.6, 'alpha': 0.0}])
F.shot(472.3, 474.4, PA, who=TIRED, cam=close('marcus', 2.6, 2.8))
F.shot(474.4, 475.6, flat('bg_hallway_dim'), overlays=[{'type': 'clock', 't0': 474.4, 't1': 475.6, 'h': 4, 'm': 40, 'label': '4:40 PM', 'fadeIn': 0.01, 'fadeOut': 0.01}])
F.shot(475.6, 483.2, flat('bg_handle_inside'), cam={'a': {'zoom': 1.2, 'aim': [0.55, 0.5]}, 'b': {'zoom': 1.8, 'aim': [0.53, 0.32]}, 'ease': 'linear', 'kicks': [476.2, 476.7, 477.2, 481.1, 481.75], 'kick': 0.5})
F.shot(483.2, 487.7, 'rooms/door_open.json', who=[{'lip': 'c5_24', 'clip': 'idle', 'face': {'mouth': 'flat'}}], cam={'a': {'zoom': 1.3, 'aim': [0.69, 0.45]}, 'b': {'zoom': 1.6, 'aim': [0.69, 0.42]}})
LINE = [('kid_b', -0.55, 0.84), ('marcus', -0.34, 0.70), ('priya', -0.13, 0.94), ('kid_a', 0.08, 1.0), ('tyler', 0.29, 0.76), ('dong', 0.50, 0.80)]   # pace = 0.8 / stride, so everyone covers ground at the same speed so the line keeps its spacing
F.shot(487.7, 496.8, 'rooms/hallway_side.json', who=[{'n': n, 'at': [u, 0.80], 'opts': {'pace': pc}} for n, u, pc in LINE], cam={'a': {'zoom': 1.05, 'aim': [0.45, 0.5]}, 'b': {'zoom': 1.05, 'aim': [0.6, 0.5]}, 'ease': 'linear'})
F.shot(496.8, 506.6, flat('bg_room208'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.58, 0.75]}, 'ease': 'linear'})
F.shot(506.6, 516.3, 'rooms/stairwell.json', who=[{'n': 'priya', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.6}, 'at': [0.12, 0.80]},
                                                  {'n': 'dong', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.80, 0.84], 'face': {'eyes': 'wide', 'brows': 'worried', 'mouth': 'flat'}}],
       events=[{'t': 506.7, 'i': 0, 'runTo': [0.45, 0.80], 'then': 'idle'}],
       cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.5, 'aim': [0.72, 0.5]}})
F.shot(516.3, 521.1, flat('bg_hallway_dim_open'), cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.4, 'aim': [0.5, 0.45]}, 'ease': 'linear'})
F.shot(521.1, 524.9, flat('bg_ext_dusk'), cam={'a': {'zoom': 1.15, 'aim': [0.5, 0.6]}, 'b': {'zoom': 1.0}, 'shake': 0.6})
F.shot(524.9, 527.5, 'rooms/lawn_close.json', who=[None, {'clip': 'talk'}, {'clip': 'idle', 'face': {'brows': 'worried', 'mouth': 'flat'}}, None, {'card': None, 'clip': 'idle', 'at': [0.95, 0.75]}],
       cam={'a': {'zoom': 1.8, 'aim': [0.41, 0.5]}, 'b': {'zoom': 2.0, 'aim': [0.41, 0.5]}})
F.shot(527.5, 537.6, flat('bg_hallway_side_dim'), filter='grayscale(1) contrast(1.25) brightness(1.1)', cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.05}, 'kicks': [535.0, 535.4, 535.9, 536.4, 536.8], 'kick': 0.45},
       overlays=[{'type': 'cctv', 't0': 527.5, 't1': 537.6, 'fadeIn': 0.01, 'fadeOut': 0.01, 'clock': 41000}])
F.shot(537.6, 544.4, 'rooms/gym.json', cam={'a': {'zoom': 1.0}, 'b': {'zoom': 1.2, 'aim': [0.45, 0.48]}})
F.shot(544.4, 551.6, 'rooms/gym.json', cam={'a': {'zoom': 2.3, 'aim': [0.30, 0.42]}, 'b': {'zoom': 2.5, 'aim': [0.30, 0.40]}})
F.shot(551.6, 557.3, 'rooms/gym.json', cam={'a': {'zoom': 1.7, 'aim': [0.66, 0.42]}, 'b': {'zoom': 1.8, 'aim': [0.66, 0.42]}})
F.shot(557.3, 561.4, 'rooms/gym.json', cam={'a': {'zoom': 3.0, 'aim': [0.285, 0.43]}, 'b': {'zoom': 3.4, 'aim': [0.285, 0.43]}})
# Mom comes through the crowd and grabs him
HUG = [{'at': [0.12, 0.62]}, {'at': [0.30, 0.60]}, {'at': [0.46, 0.61]}, {'at': [0.30, 0.62], 'n': 'parent_b', 'hide0': True},
       {'card': None, 'view': 'side', 'facing': 1, 'clip': 'run', 'at': [-0.1, 0.72]}]
F.shot(561.4, 572.9, 'rooms/lawn_close.json', who=[{'at': [0.10, 0.62]}, {'at': [0.26, 0.60]}, {'at': [0.40, 0.61], 'face': {'mouth': 'flat'}}, {'at': [0.86, 0.62]},
                                                   {'card': None, 'view': 'side', 'facing': 1, 'clip': 'run', 'at': [0.02, 0.73]}],
       add=[{'n': 'dong', 'clip': 'idle', 'at': [0.62, 0.73], 'face': {'eyes': 'open', 'mouth': 'flat', 'brows': 'worried'}}],
       events=[{'t': 561.5, 'i': 4, 'runTo': [0.55, 0.73], 'then': 'idle'}, {'t': 563.4, 'i': 4, 'card': 'hug'}, {'t': 563.4, 'i': 5, 'hide': True}],
       cam={'a': {'zoom': 1.3, 'aim': [0.45, 0.55]}, 'b': {'zoom': 1.8, 'aim': [0.6, 0.52]}})
F.shot(572.9, 574.3, flat('bg_ext_dusk'), cam={'a': {'zoom': 1.25, 'aim': [0.5, 0.55]}, 'b': {'zoom': 1.0}, 'ease': 'out'},
       overlays=[{'type': 'black', 't0': 573.8, 't1': 574.4, 'fadeIn': 0.5, 'fadeOut': 0.01}])
F.save('ch5')
