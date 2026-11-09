"""Mix a chapter's soundtrack: the voice-over, ambience beds (looped), and every sound cue, then one loudness pass (-14 LUFS, -1.5 dBTP).
usage: python3 mix.py N   ->  out/chN_mix.wav"""
import json, subprocess, sys, numpy as np, os
SR = 44100; L = '/home/claude/lockdown/sfx/lib/'
MAP = {'birds': 'ambience-ambforst-forestbirds-os-02.mp3', 'birds_loop': 'ambience-ambforst-forestbirds-os-02.mp3', 'boom': 'synth-boom.mp3', 'whoosh': 'synth-whoosh.mp3',
       'switch': 'ui-switch12.mp3', 'thunk': 'impact-impactgeneric-light-001.mp3', 'lock': 'door-lock-01.mp3', 'paper': 'paper-paper-02.mp3', 'click': 'ui-click-003.mp3',
       'riser': 'synth-riser.mp3', 'hit': 'synth-hit.mp3', 'knock': 'synth-knock.mp3', 'keys': 'door-keys-04.mp3', 'door_open': 'door-creak2.mp3',
       'step1': 'footsteps-feethmn-shoeconcretewalk-os-01.mp3', 'step2': 'footsteps-feethmn-shoeconcretewalk-os-03.mp3', 'step3': 'footsteps-feethmn-shoeconcretewalk-os-05.mp3',
       'typing': 'synth-keys.mp3', 'pa_on': 'pa_on.wav', 'pa_off': 'pa_off.wav', 'pa_chime': 'pa_chime.wav', 'pa_hum': 'pa_hum.wav', 'fire_alarm': 'fire_alarm.wav',
       'giggle_a': 'giggle_a.wav', 'giggle_b': 'giggle_b.wav', 'heart': 'synth-heart.mp3', 'tick': 'synth-tick.mp3', 'shh': 'shh.wav', 'cloth': 'cloth.wav', 'pencil': 'pencil.wav',
       'room_class': 'room_class.wav', 'room_dark': 'room_class.wav', 'dread_bed': 'dread_bed.wav', 'ext_air': 'ext_air.wav', 'rumble': 'synth-rumble.mp3',
       'creepy_whisper': 'voice-voxwhsp-whisperscreepy-os-01.mp3', 'creak': 'foley-woodfric-creakscreepy-os-01.mp3', 'flicker': 'synth-flicker.mp3', 'breath': 'voice-breath.mp3',
       'slam': 'impact-wood-slam-01.mp3', 'sneakers_c': 'el_sneakers_c.wav', 'heels_c': 'el_heels_c.wav', 'boots_c': 'el_boots_c.wav', 'knocks3_c': 'el_knocks3_c.wav', **{f'{k}{i}': f'el_step_{k}{i}.wav' for k in ('sneaker', 'heel', 'boot') for i in (1, 2)},
       **{k: f'el_{k}_n.wav' for k in ['huddle_cry', 'giggles', 'whispers', 'breath', 'kinder', 'class', 'scramble', 'teeth', 'hall', 'exterior', 'gasp', 'sneakers', 'heels', 'boots', 'rattle', 'handle_down', 'recede', 'relief_cry', 'exhale', 'knocks3', 'buzzbed', 'buzz', 'ringback', 'mombreath', 'weight', 'pound', 'laugh', 'radio_off', 'glitch', 'squad', 'keyturn', 'gym', 'bottle', 'chaos']}}
FILT = {'room_dark': 'lowpass=f=700', 'step_far': 'lowpass=f=1500'}
cache = {}
def load(name):
    if name not in cache:
        af = ['-af', FILT[name]] if name in FILT else []
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', L + MAP[name], *af, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
        cache[name] = np.frombuffer(pcm, np.float32).copy()
    return cache[name]
c = sys.argv[1]; F = json.load(open(f'/home/claude/lockdown/web/film/ch{c}.json')); S = json.load(open(f'/home/claude/lockdown/web/film/ch{c}_sfx.json'))
t0, t1 = F['t0'], F['t1']; n = int((t1 - t0) * SR) + 1
vo = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(t1 - t0), '-i', '/home/claude/lockdown/vo/this-is-not-a-drill-voiceover.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
fx = np.zeros(n, np.float32)
for b0, b1, name, vol in S['beds']:
    x = load(name); a, b = int((b0 - t0) * SR), int((b1 - t0) * SR); seg = np.resize(x, b - a).astype(np.float32)
    f = min(int(0.4 * SR), len(seg) // 2); env = np.ones(len(seg), np.float32); env[:f] = np.linspace(0, 1, f); env[-f:] = np.linspace(1, 0, f)
    fx[a:b] += seg * env * vol * 0.5
for t, name, vol in S['sfx']:
    if vol <= 0: continue
    x = load(name); a = int((t - t0) * SR)
    if a >= n or a < 0: continue
    b = min(n, a + len(x)); fx[a:b] += x[:b - a] * vol * 0.5
mix = np.zeros(n, np.float32); mix[:len(vo)] += vo[:n]; mix += fx
tmp = f'/home/claude/lockdown/out/ch{c}_raw.wav'; out = f'/home/claude/lockdown/out/ch{c}_mix.wav'
import wave
with wave.open(tmp, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
# two-pass loudness: measure, then normalise linearly to -14 LUFS with a -1.5 dBTP ceiling
import re
m = subprocess.run(['ffmpeg', '-v', 'info', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', ln, '-ar', str(SR), '-ac', '2', out], check=True)
print('mixed', out, f'{n / SR:.2f}s', len(S['sfx']), 'cues')
