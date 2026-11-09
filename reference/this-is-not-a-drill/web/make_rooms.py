"""Staging for every set that has people in it: the camera that matches the painting (from a 2.1 m door, or another
object of known height), the floor line, the cut-outs people go behind, and where everyone stands.
Camera maths (level camera, pitch 0): with the floor line of an object at screen v_f and its top (height Y m) at v_t,
camera height h = Y (v_f - 0.5) / (v_f - v_t)."""
import json
M = json.load(open('/home/claude/lockdown/web/masks/index.json'))
def h_from(Y, vf, vt): return round(Y * (vf - 0.5) / (vf - vt), 3)
def holds(setname, horizon):
    return [{'mask': m['mask'], 'base': m['base'], 'u': m['u']} for m in M[setname] if m['base'] > horizon + 0.015]
DAY, DARK, NIGHT, EVE = 0xffffff, 0x8790ad, 0x6f7ca8, 0xffe6c8
def plate(img, h, horizon, **k): return {'img': f'art/{img}.png', 'fov': 40, 'h': h, 'pitch': 0, 'horizon': horizon, **k}
R = {}
# kindergarten: the drill when they were little; small kids (students at 0.6 scale) hiding behind the little tables
R['kindergarten'] = {'plate': plate('bg_kindergarten', h_from(2.1, 0.70, 0.05), 0.69, holdouts=holds('kindergarten', 0.69)), 'tint': DAY, 'who': [
  {'n': 'kid_a', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'whisper'}, 'at': [0.40, 0.79], 'scale': 0.62},
  {'n': 'priya', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'glance'}, 'at': [0.56, 0.80], 'scale': 0.6},
  {'n': 'kid_b', 'card': 'huddle', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.13, 0.85], 'scale': 0.6}]}
# Room 214 looking at the front: Ms. Harlow reading Poe
R['classroom_day'] = {'plate': plate('bg_classroom_day', h_from(2.1, 0.73, 0.21), 0.74, holdouts=holds('classroom_day', 0.74)), 'tint': DAY, 'who': [
  {'n': 'harlow', 'card': 'book', 'clip': 'idle', 'at': [0.80, 0.80]}]}
# the lights go off; Harlow runs to the door (side view)
R['classroom_dark'] = {'plate': plate('bg_classroom_dark', h_from(2.1, 0.73, 0.21), 0.74, holdouts=[dict(x, mask=x['mask']) for x in holds('classroom_day', 0.74)]), 'tint': DARK, 'who': [
  {'n': 'harlow', 'view': 'side', 'facing': 1, 'clip': 'run', 'at': [0.55, 0.79]}]}
# the reverse angle: the class at their desks, everyone visible
row_b, row_f = 0.775, 0.91
R['class_students'] = {'plate': plate('plate_class_students_empty', h_from(1.4, 0.703, 0.455), 0.703), 'tint': DAY, 'who': [
  {'n': 'marcus', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.33, row_b]},
  {'n': 'kid_a', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.67, row_b]},
  {'n': 'kid_b', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.93, row_b]},
  {'n': 'tyler', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.15, row_f]},
  {'n': 'dong', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.50, row_f]},
  {'n': 'priya', 'card': 'sit_desk', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.85, row_f]}],
  'props': [{'img': 'props/desk.png', 'height': 0.78, 'at': [0.06, row_b]}]}
# the principal at the mic, behind his desk
R['office'] = {'plate': plate('bg_office', h_from(0.76, 0.86, 0.62), 0.765, holdouts=holds('office', 0.765)), 'tint': DAY, 'who': [
  {'n': 'dawes', 'clip': 'talk', 'at': [0.52, 0.79]}]}
# Priya putting the black paper over the door window
R['door_close'] = {'plate': plate('bg_door_close', 0.92, 0.83, holdouts=holds('door_close', 0.83)), 'tint': DARK, 'who': [
  {'n': 'priya', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.66, 0.86]}]}
R['door_open'] = {'plate': plate('bg_door_open', h_from(2.1, 0.73, 0.08), 0.73), 'tint': 0xd8cfc0, 'who': [
  {'n': 'deputy', 'clip': 'talk', 'at': [0.69, 0.735]}]}
R['kitchen_mom'] = {'plate': plate('bg_kitchen_mom', h_from(0.9, 0.76, 0.53), 0.76), 'tint': DAY, 'who': [
  {'n': 'mom', 'card': 'phone_ear', 'clip': 'idle', 'at': [0.50, 0.80]}]}
# corridors get side walls so the camera can push in
R['hallway'] = {'plate': plate('bg_hallway', h_from(2.1, 0.77, 0.22), 0.55, sides=[{'at': [0.2, 0.69]}, {'at': [0.82, 0.69]}]), 'tint': DAY, 'who': [
  {'n': 'dong', 'clip': 'walkToward', 'at': [0.5, 0.66]}]}
R['hallway_side'] = {'plate': plate('bg_hallway_side', h_from(2.1, 0.69, 0.24), 0.69), 'tint': DAY, 'who': [
  {'n': n, 'view': 'side', 'facing': 1, 'clip': 'walk', 'at': [u, 0.80]} for n, u in
  [('kid_b', 0.0), ('marcus', 0.15), ('priya', 0.30), ('kid_a', 0.45), ('tyler', 0.60), ('dong', 0.75)]]}
R['stairwell'] = {'plate': plate('bg_stairwell', 1.05, 0.74, holdouts=holds('stairwell', 0.74)), 'tint': DAY, 'who': [
  {'n': 'priya', 'view': 'side', 'facing': 1, 'clip': 'walk', 'at': [0.40, 0.80]},
  {'n': 'dong', 'view': 'side', 'facing': -1, 'clip': 'idle', 'at': [0.78, 0.84]}]}
R['lawn_close'] = {'plate': plate('bg_lawn_close', 1.0, 0.57), 'tint': 0xd9c8d8, 'who': [
  {'n': 'parent_a', 'clip': 'idle', 'at': [0.14, 0.66]}, {'n': 'deputy', 'clip': 'idle', 'at': [0.32, 0.64]},
  {'n': 'harlow', 'clip': 'idle', 'at': [0.50, 0.66]}, {'n': 'parent_b', 'clip': 'idle', 'at': [0.68, 0.65]},
  {'n': 'mom', 'card': 'hug', 'clip': 'idle', 'at': [0.86, 0.70]}]}
R['gym'] = {'plate': plate('bg_gym', h_from(2.1, 0.66, 0.36), 0.66, holdouts=holds('gym', 0.66)), 'tint': DAY, 'who': [
  {'n': 'marcus', 'card': 'sit_floor_knees', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.47, 0.665], 'y': 0.34},
  {'n': 'priya', 'card': 'sit_floor_knees', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.60, 0.665], 'y': 0.34},
  {'n': 'tyler', 'card': 'sit_floor_knees', 'clip': 'huddle', 'opts': {'mood': 'rock'}, 'at': [0.73, 0.665], 'y': 0.34},
  {'n': 'dong', 'card': 'sit_floor_knees', 'clip': 'huddle', 'opts': {'mood': 'still'}, 'at': [0.86, 0.665], 'y': 0.34},
  {'n': 'district', 'card': 'clipboard', 'clip': 'idle', 'at': [0.30, 0.80]}]}
R['bedroom_evening'] = {'plate': plate('bg_bedroom_evening', h_from(2.1, 0.73, 0.05), 0.735), 'tint': EVE, 'who': [
  {'n': 'dong_home', 'card': 'sit_floor_knees', 'clip': 'idle', 'at': [0.13, 0.775], 'y': 0.42},
  {'n': 'mom', 'clip': 'talk', 'at': [0.80, 0.76]}]}
# the bed is part of Dong's cards here (asleep, then bolt upright), so the plate has no bed
R['bedroom_night'] = {'plate': plate('plate_bedroom_night_nobed', h_from(2.1, 0.74, 0.07), 0.74), 'tint': NIGHT, 'who': [
  {'n': 'dong_home', 'card': 'bed_asleep', 'clip': 'idle', 'at': [0.17, 0.80]}]}
R['bedroom_night_walk'] = {'plate': plate('plate_bedroom_night_nobed', h_from(2.1, 0.74, 0.07), 0.74), 'tint': NIGHT, 'who': [
  {'n': 'dong_home', 'view': 'side', 'facing': 1, 'clip': 'walk', 'opts': {'pace': 0.5}, 'at': [0.56, 0.775]}]}
R['bedroom_day'] = {'plate': plate('bg_bedroom_day', 0.75, 0.69), 'tint': 0xe0dcd8, 'who': [
  {'n': 'dong_home', 'card': 'sit_floor_knees', 'clip': 'idle', 'at': [0.58, 0.70]}]}
R['home_hall_night'] = {'plate': plate('bg_home_hall_night', h_from(2.1, 0.64, 0.18), 0.645, sides=[{'at': [0.86, 0.745]}]), 'tint': NIGHT, 'who': [
  {'n': 'dong_home', 'clip': 'idle', 'at': [0.5, 0.66]}]}
for k, v in R.items():
    v['name'] = k; json.dump(v, open(f'/home/claude/lockdown/web/rooms/{k}.json', 'w'), indent=1)
print(len(R), 'rooms')
