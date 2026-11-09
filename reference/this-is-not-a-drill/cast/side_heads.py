"""Alternate side-view heads (side/head_<variant>.png), cut from an edit of the arm-less side image with exactly the same crop as the normal head."""
import sys, numpy as np
sys.argv = ['x']; import build_cast as B
from PIL import Image
def build(name, variant='scared'):
    src = name; d = f'/home/claude/lockdown/cast/{name}'
    noarm = B.gcut(f'{B.ART}/{src}_side_noarm_g.png'); new = B.gcut(f'{B.ART}/{src}_side_{variant}_g.png')
    sa = np.asarray(noarm)[..., 3] > 128; ys = np.where(sa.any(1))[0]; top, sole = ys[0], ys[-1]; y_tee = top + 467 * (sole - top) / 1400
    na = np.asarray(new)[..., 3] > 128
    yy, xx = np.mgrid[0:new.height, 0:new.width]
    head = B.rim(B.masked(new, yy < y_tee + 30).crop((0, 0, new.width, int(y_tee + 30))))
    ref = Image.open(f'{d}/side/head.png'); assert head.size == ref.size, (head.size, ref.size)
    head.save(f'{d}/side/head_{variant}.png'); return head
if __name__ == '__main__':
    for n in ['harlow', 'priya', 'tyler', 'kid_a', 'kid_b', 'marcus', 'mom']:
        h = build(n); print(n, h.size)
