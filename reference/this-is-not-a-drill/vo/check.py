import json,subprocess,re,difflib
from pocketsphinx import Decoder, Config, get_model_path
B=json.load(open('lines.json'))
cfg=Config(); cfg.set_string('-hmm',get_model_path('en-us/en-us')); cfg.set_string('-lm',get_model_path('en-us/en-us.lm.bin')); cfg.set_string('-dict',get_model_path('en-us/cmudict-en-us.dict')); cfg.set_string('-loglevel','FATAL')
dec=Decoder(cfg)
for b in B:
    f=b['id']+'.mp3'
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
    pcm=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    dec.start_utt(); dec.process_raw(pcm,full_utt=True); dec.end_utt()
    hyp=(dec.hyp().hypstr if dec.hyp() else '').split()
    ref=re.sub(r"[^a-z' ]",' ',b['text_clean'].lower()).split()
    sm=difflib.SequenceMatcher(None,ref,hyp); m=sum(x.size for x in sm.get_matching_blocks())
    rate=len(b['text_clean'])/d
    print(f"{b['id']} {b['as'][:6]:6} {d:6.1f}s {rate:5.1f}c/s words {len(ref)}/{len(hyp)} match {m/max(1,len(ref)):.0%}")
