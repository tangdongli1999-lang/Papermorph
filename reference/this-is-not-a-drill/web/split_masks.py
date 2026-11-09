"""Split each AI matte (art/out/mask_<set>.png) into its separate objects, so each can stand at its own depth.
Writes web/masks/<set>_<k>.png (white = object, full frame) and web/masks/index.json {set: [{mask, base, u, area}]}."""
import json, numpy as np
from PIL import Image
from scipy import ndimage as nd
SETS=['kindergarten','office','gym','bedroom_night','stairwell','door_close','classroom_day']
out={}
for s in SETS:
    m=np.array(Image.open(f'/home/claude/lockdown/art/out/mask_{s}.png').convert('L').resize((1536,1024)))>128
    m=nd.binary_opening(m,iterations=2); m=nd.binary_erosion(m,iterations=2)
    H,W=m.shape
    if s=='office':   # the chair stands behind Dawes: keep it out of the desk cut-out
        m[:int(0.585*H),int(0.38*W):int(0.6*W)]=False
    if s=='classroom_day':   # separate the teacher's desk (further back) from the front rows of student desks
        t=np.zeros_like(m); t[:int(0.83*H),int(0.3*W):int(0.72*W)]=m[:int(0.83*H),int(0.3*W):int(0.72*W)]
        m=m&~t
        f=f'masks/{s}_teacher.png'; Image.fromarray((t*255).astype(np.uint8)).resize((768,512),Image.BILINEAR).save('/home/claude/lockdown/web/'+f)
        extra=[{'mask':f,'base':0.83,'u':0.51,'area':int(t.sum()),'top':0.6}]
    lab,n=nd.label(m); res=[]
    for k in range(1,n+1):
        c=lab==k; a=c.sum()
        if a<1500: continue
        ys,xs=np.nonzero(c); base=float(np.percentile(ys,99.5))/1024
        # where it stands: the middle of its lowest rows
        low=xs[ys>np.percentile(ys,97)]; u=float(low.mean())/1536
        f=f'masks/{s}_{len(res)}.png'; Image.fromarray((c*255).astype(np.uint8)).resize((768,512),Image.BILINEAR).save('/home/claude/lockdown/web/'+f)
        res.append({'mask':f,'base':round(base,4),'u':round(u,4),'area':int(a),'top':round(float(ys.min())/1024,3)})
    res+=locals().get('extra',[]) if s=='classroom_day' else []
    out[s]=res; print(s,[(r['base'],r['u'],r['area']) for r in res])
json.dump(out,open('/home/claude/lockdown/web/masks/index.json','w'),indent=1)
