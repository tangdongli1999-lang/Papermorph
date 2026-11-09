"""Word times for every voice take by forced alignment (PocketSphinx, bundled US English model).
Writes vo/words.json: {line_id: [[start_s, end_s, word], ...]} with times on the FULL voice-over timeline."""
import json, re, subprocess, sys
from pocketsphinx import Decoder, Config, get_model_path
L = {b['id']: b for b in json.load(open('lines.json'))}; T = {t['id']: t for t in json.load(open('timing.json'))}
NUM = {'214': 'two fourteen', '208': 'two oh eight', '210': 'two ten', '212': 'two twelve', '23': 'twenty three'}
cfg = Config(); cfg.set_string('-hmm', get_model_path('en-us/en-us')); cfg.set_string('-dict', get_model_path('en-us/cmudict-en-us.dict')); cfg.set_string('-loglevel', 'FATAL'); cfg.set_float('-samprate', 16000)
dec = Decoder(cfg); out = {}
try: out = json.load(open('words.json'))
except Exception: pass
for lid in sys.argv[1:] or L:
    words = T[lid]['text'].split(); spoken = []
    for i, w in enumerate(words):
        k = re.sub(r"[^\w'’-]", '', w.lower()).replace('’', "'"); k = NUM.get(k, k).replace('-', ' ')
        for tok in k.split():
            tok = tok.strip("'")
            if tok: spoken.append((i, tok if dec.lookup_word(tok) is not None else 'uh'))
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{lid}.mp3', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    dec.set_align_text(' '.join(t for _, t in spoken)); dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
    segs = [(s.start_frame / 100, (s.end_frame + 1) / 100) for s in (dec.seg() or []) if s.word not in ('<s>', '</s>', '<sil>', '[NOISE]')]
    if len(segs) != len(spoken):
        # fall back: spread the words over the take by their length (the take's speech runs start..end)
        print(lid, 'aligner failed, using proportional times', len(segs), len(spoken))
        L = T[lid]['end'] - T[lid]['start']; w = [len(x) + 1 for x in words]; tot = sum(w); acc = 0; o = {}
        for i, x in enumerate(w): o[i] = [L * acc / tot, L * (acc + x) / tot]; acc += x
        st = T[lid]['start']; out[lid] = [[round(st + o[i][0], 3), round(st + o[i][1], 3), wd] for i, wd in enumerate(words)]; continue
    o = {}
    for (i, _), (a, b) in zip(spoken, segs): o.setdefault(i, [a, b])[1] = b
    st = T[lid]['start']; out[lid] = [[round(st + o[i][0], 3), round(st + o[i][1], 3), w] for i, w in enumerate(words)]
    print(lid, len(words), 'words', out[lid][0][0], out[lid][-1][1])
json.dump(out, open('words.json', 'w'))
