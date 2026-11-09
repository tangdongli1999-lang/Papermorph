"""Join the six rendered chapters into the finished video, with burned-in captions and one loudness pass.
usage (from the this-is-not-a-drill folder):  python tools/merge.py [out/ch1_final.mp4 ... out/ch6_final.mp4]
  default inputs: out/ch1_final.mp4 ... out/ch6_final.mp4. Writes out/this-is-not-a-drill_final.mp4 (1920x1080, 30 fps, -14 LUFS, -1.5 dBTP).
Uses the GPU encoder (h264_nvenc) when ffmpeg has it, otherwise libx264."""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(ROOT, 'out')
ins = sys.argv[1:] or [os.path.join(OUT, f'ch{c}_final.mp4') for c in range(1, 7)]
missing = [p for p in ins if not os.path.exists(p)]
if missing: sys.exit('missing chapter videos: ' + ', '.join(missing))
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
starts, t = {}, 0.0
for c, p in enumerate(ins, 1):
    want = (lambda f: f['t1'] - f['t0'])(json.load(open(os.path.join(ROOT, 'web', 'film', f'ch{c}.json')))); d = dur(p)
    print(f'ch{c}: {d:.2f} s (shot list {want:.2f} s)' + ('   <-- does not match its shot list: re-render this chapter' if abs(d - want) > 0.25 else ''))
    starts[c] = t; t += d
json.dump(starts, open(os.path.join(OUT, 'chapter_starts.json'), 'w'))
subprocess.run([sys.executable, os.path.join(HERE, 'captions.py'), os.path.join(OUT, 'captions.ass'), os.path.join(OUT, 'chapter_starts.json')], check=True)
with open(os.path.join(OUT, 'concat.txt'), 'w') as f:
    for p in ins: f.write(f"file '{os.path.abspath(p).replace(os.sep, '/')}'\n")
joined = os.path.join(OUT, 'joined.mp4')   # 1) join without re-encoding
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'joined.mp4'], cwd=OUT, check=True)
# 2) measure the loudness of the whole film, then 3) burn the captions and set loudness in one encode
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', joined, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
L = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={L['input_i']}:measured_TP={L['input_tp']}:measured_LRA={L['input_lra']}"
      f":measured_thresh={L['input_thresh']}:offset={L['target_offset']}:linear=true")
enc = subprocess.run(['ffmpeg', '-hide_banner', '-encoders'], capture_output=True, text=True).stdout
venc = ['-c:v', 'h264_nvenc', '-preset', 'p5', '-cq', '19', '-b:v', '0'] if 'h264_nvenc' in enc else ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18']
final = 'this-is-not-a-drill_final.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-stats', '-y', '-i', 'joined.mp4', '-vf', 'subtitles=captions.ass', *venc, '-pix_fmt', 'yuv420p',
                '-af', ln, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final], cwd=OUT, check=True)
print('done:', os.path.join(OUT, final), f'{dur(os.path.join(OUT, final)):.2f} s')
