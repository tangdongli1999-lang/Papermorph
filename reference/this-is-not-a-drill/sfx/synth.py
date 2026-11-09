"""Sounds the library doesn't have, made from scratch (CC0, our own)."""
import numpy as np, subprocess, wave
SR = 44100
def save(name, x):
    x = np.asarray(x, float); x = x / (np.abs(x).max() + 1e-9) * 0.7
    with wave.open(f'lib/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
t_ = lambda d: np.arange(int(SR * d)) / SR
rng = np.random.default_rng(7)
def bp(x, lo, hi):  # crude band-pass via FFT
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
# school PA chime: three soft bell tones, rising
def bell(f, d): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2.01 * f * t) + 0.15 * np.sin(2 * np.pi * 3.0 * f * t)) * np.exp(-t * 2.2) * np.minimum(1, t * 300)
ch = np.zeros(int(SR * 3.0))
for i, f in enumerate([587.3, 740.0, 880.0]): s = int(SR * 0.42 * i); b = bell(f, 1.8); ch[s:s + len(b)] += b
save('pa_chime', ch)
# PA click on: a pop plus a short burst of speaker hiss; click off: a pop and the hum dying
pop = lambda: np.concatenate([rng.normal(0, 1, 120) * np.linspace(1, 0, 120), np.zeros(200)])
hiss = bp(rng.normal(0, 1, int(SR * 0.9)), 1500, 7000) * 0.25 * np.exp(-t_(0.9) * 3)
hum = lambda d, a: a * (np.sin(2 * np.pi * 60 * t_(d)) + 0.5 * np.sin(2 * np.pi * 120 * t_(d)) + 0.2 * np.sin(2 * np.pi * 180 * t_(d)))
on = np.concatenate([pop(), np.zeros(10)]); on = np.pad(on, (0, len(hiss))); on[320:320 + len(hiss)] += hiss + hum(0.9, 0.15)[:len(hiss)] * np.exp(-t_(0.9) * 1.5)
save('pa_on', on)
off = np.pad(pop(), (0, int(SR * 0.5))); off[320:] += hum(0.5, 0.18)[:len(off) - 320] * np.exp(-t_(0.5)[:len(off) - 320] * 12)
save('pa_off', off)
save('pa_hum', hum(6, 1) + bp(rng.normal(0, 1, SR * 6), 2000, 6000) * 0.08)
# fire alarm: the classic school horn, square-ish 3 Hz pulses
t = t_(3.0); horn = np.sign(np.sin(2 * np.pi * 520 * t)) * 0.5 + np.sin(2 * np.pi * 1040 * t) * 0.3
gate = (np.sin(2 * np.pi * 1.6 * t) > -0.2).astype(float); save('fire_alarm', bp(horn * gate, 300, 4000))
# classroom room tone: fluorescent hum + ventilation air (12 s loopable)
d = 12; air = bp(rng.normal(0, 1, SR * d), 80, 900) * 0.6; save('room_class', air + hum(d, 0.12) + bp(rng.normal(0, 1, SR * d), 3000, 8000) * 0.03)
# lockdown dread bed: two detuned low tones that breathe, plus air
t = t_(d); dr = np.sin(2 * np.pi * 55 * t) + np.sin(2 * np.pi * 55.7 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t + np.sin(t * 0.7))
save('dread_bed', dr * (0.7 + 0.3 * np.sin(2 * np.pi * t / d)) + bp(rng.normal(0, 1, SR * d), 60, 400) * 0.5)
# exterior school morning: distant traffic wash (birds come from the library)
save('ext_air', bp(rng.normal(0, 1, SR * d), 40, 500) * 0.8 + bp(rng.normal(0, 1, SR * d), 500, 2000) * 0.1)
# a whispered 'shhh', clothes rustling as kids pack in, a pencil scratching
t = t_(1.0); save('shh', bp(rng.normal(0, 1, SR), 2500, 9000) * np.sin(np.pi * t) ** 0.6)
c = np.zeros(SR); 
for k in range(6): s = int(rng.uniform(0, 0.8) * SR); n = int(0.15 * SR); c[s:s + n] += bp(rng.normal(0, 1, n), 300, 4000) * np.hanning(n)
save('cloth', c)
p = np.zeros(int(SR * 1.2))
for k in range(9): s = int(k * 0.12 * SR); n = int(0.09 * SR); p[s:s + n] += bp(rng.normal(0, 1, n), 2000, 8000) * np.hanning(n) * rng.uniform(0.5, 1)
save('pencil', p)
