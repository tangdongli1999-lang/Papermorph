"""Lockdown cast and sets on gpt-image-2.6-flare (xcode.best). Every job is an edit of a reference so scale and position stay registered.
usage: python3 gen.py job [job ...]   (jobs in jobs.json: {name: [prompt, [ref paths], size]})"""
import base64, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
KEY=os.environ['IMAGE_API_KEY'];   # never stored in the repo
OUT='/home/claude/lockdown/art/out'; os.makedirs(OUT,exist_ok=True)
J=json.load(open('/home/claude/lockdown/art/jobs.json'))
def run(j):
    out=f'{OUT}/{j}.png'
    if os.path.exists(out): return f'{j}: exists'
    p,refs,size=J[j]
    cmd=['curl','-sS','-m','900','https://xcode.best/v1/images/edits','-H',f'Authorization: Bearer {KEY}','-F','model=gpt-image-2.6-flare','-F',f'prompt={p}',
         '-F',f'size={size}','-F','n=1','-F','response_format=b64_json']+sum((['-F',f'image[]=@{r}'] for r in refs),[])
    for attempt in range(2):
        raw=subprocess.run(cmd,capture_output=True).stdout
        try: d=json.loads(raw); open(out,'wb').write(base64.b64decode(d['data'][0]['b64_json'])); return f'{j}: ok'
        except Exception: err=raw[:200]
    return f'{j}: FAILED {err!r}'
with ThreadPoolExecutor(8) as ex:
    for r in ex.map(run, sys.argv[1:]): print(r, flush=True)
