"""Pull every cast texture's alpha in by 1 px and replace edge colours with the colour just inside, so no cream halo shows in dark scenes."""
import glob, numpy as np, scipy.ndimage as nd
from PIL import Image
def defringe(f, size=3):
    im = Image.open(f).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    al = a[..., 3].copy()
    # cream background crumbs stuck to the edge (hair fuzz, collars): near the edge and the colour of the paper -> drop them
    near = nd.distance_transform_edt(al > 128) < 9
    rr, gg, bb = a[..., 0], a[..., 1], a[..., 2]
    crumb = near & (np.abs(rr - 243) < 22) & (np.abs(gg - 236) < 22) & (np.abs(bb - 222) < 26) & (rr - bb > 12)
    al[crumb] = 0; al = np.where(nd.binary_opening(al > 128, iterations=1), al, 0).astype(np.float32)
    er = nd.grey_erosion(al, size=(size, size)); solid = (er > 250).astype(np.float32)
    rgb = a[..., :3]; w = nd.uniform_filter(solid, 5)
    acc = np.stack([nd.uniform_filter(rgb[..., c] * solid, 5) for c in range(3)], -1)
    fill = np.where(w[..., None] > 0.02, acc / np.maximum(w[..., None], 1e-3), rgb)
    edge = (al > 0) & (solid < 1)
    rgb = np.where(edge[..., None], fill, rgb)
    out = np.dstack([np.clip(rgb, 0, 255), er]).astype(np.uint8)
    if f.endswith('.webp'): Image.fromarray(out).save(f, quality=92)
    else: Image.fromarray(out).save(f)
if __name__ == '__main__':
    import sys
    fs = sys.argv[1:] or glob.glob('/home/claude/lockdown/cast/*/*/*.png') + glob.glob('/home/claude/lockdown/cast/*/cards/*.webp')
    for f in fs: defringe(f, 5 if '/cards/' in f else 3)
    print(len(fs), 'textures defringed')
