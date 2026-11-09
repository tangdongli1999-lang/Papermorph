"""Build a jointed puppet (front + side, and back for Dong) for every Lockdown character, on Dong's skeleton.

Every character image is an edit of Dong's hero, so it sits in the same frame: we crop all of them with one fixed box and
reuse Dong's joint heights. Widths (arms, legs, body) are measured per character from its silhouette. Outputs
cast/<name>/{rig.json, front/, side/, back/, face/, cards/} in the format rig/dong.js loads.

    python3 build_cast.py [name ...]
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, '/home/claude/dong/tools')
from cut import cut

ART = '/home/claude/lockdown/art/out'; OUT = '/home/claude/lockdown/cast'; DONG = '/home/claude/dong'
FX, FY, FW, FH = 214, 18, 603, 1460          # the fixed frame (Dong's hero box with margins), source px of the 1024x1536 images
DX, DY = 110, 60                              # Dong's hero-box coordinates + (DX, DY) = frame coordinates
K_SRC = 1400 / 1400                           # frame px == Dong hero px (the hero box is 1400 tall)

def rim(img, dark=0.86, width=2):
    a = np.asarray(img).astype(float); al = a[..., 3] / 255
    inner = np.asarray(Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(2 * width + 1))).astype(float) / 255
    edge = np.clip(al - inner, 0, 1)[..., None]; a[..., :3] *= 1 - (1 - dark) * edge
    return Image.fromarray(a.astype(np.uint8))

def tiled(tex, W, H):
    t = tex.resize((W, max(8, int(tex.height * W / tex.width))), Image.LANCZOS); c = Image.new('RGBA', (W, H)); y = 0; flip = False
    while y < H: c.paste(t.transpose(Image.FLIP_TOP_BOTTOM) if flip else t, (0, y)); y += t.height; flip = not flip
    return c

def capsule(tex, length, width, cap_top=True, cap_bottom=True, mitten=0.0, hand=None):
    r = width / 2; mr = mitten * width; extra = max(r if cap_bottom else 0, mr * 1.6 if mitten else 0)
    W = int(round(max(width, 2 * mr))) + 4; top = (r if cap_top else 0) + 2; H = int(round(top + length + extra)) + 2
    c = tiled(tex, W, H); yy, xx = np.mgrid[0:H, 0:W].astype(float); cx = (W - 1) / 2; bot = top + length
    m = (np.abs(xx - cx) <= r) & (yy >= top) & (yy <= bot)
    if cap_top: m |= np.hypot(xx - cx, yy - top) <= r
    else: m |= (np.abs(xx - cx) <= r) & (yy < top)
    if cap_bottom: m |= np.hypot(xx - cx, yy - bot) <= r
    a = np.asarray(c).copy()
    if mitten:
        hm = np.hypot(xx - cx, yy - (bot + mr * 0.55)) <= mr
        if hand is not None:
            h = np.asarray(tiled(hand, W, H)); hm2 = hm & ~((np.abs(xx - cx) <= r) & (yy <= bot)) | (hm & (yy > bot - 4))
            a[hm2] = h[hm2]
        m |= hm
    al = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    a[..., 3] = np.asarray(al)
    return rim(Image.fromarray(a)), int(round(top))

def inset(img, box, dx=10, dy=0):
    x0, y0, x1, y1 = box; return img.crop((int(x0 + dx), int(y0 + dy), int(x1 - dx), int(y1 - dy)))
def masked(img, keep):
    a = np.asarray(img).copy(); a[..., 3] = (a[..., 3] * keep).astype(np.uint8); return Image.fromarray(a)
def runs(row, minw=4):
    r = []; s = None
    for x, v in enumerate(row):
        if v and s is None: s = x
        if not v and s is not None: r.append((s, x - 1)); s = None
    if s is not None: r.append((s, len(row) - 1))
    return [q for q in r if q[1] - q[0] >= minw]

def gcut(path):
    """Chroma-key cut for the green-screen side images: exact edges even on white shirts and sneakers."""
    import scipy.ndimage as nd
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    gness = G - np.maximum(R, B)
    alpha = np.clip(1 - (gness - 25) / 50, 0, 1)                      # >75 above the others: background; <25: subject
    m = alpha > 0.5; lab, n = nd.label(m)
    if n > 1: m = lab == (1 + int(np.argmax(nd.sum(m, lab, range(1, n + 1)))))
    m = nd.binary_fill_holes(m); alpha = np.where(m, np.maximum(alpha, nd.binary_erosion(m, iterations=2)), 0)
    G2 = np.where(gness > 0, np.maximum(R, B) + 0.3 * np.maximum(0, gness) * 0, G)   # despill: green never above red/blue
    out = np.dstack([R, np.minimum(G, np.maximum(R, B) + 6), B, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out).crop((FX, FY, FX + FW, FY + FH))

def frame(path, fill=True, **kw):
    import scipy.ndimage as nd
    im = cut(path, **kw)
    if fill:   # holes the background cut punched into white shirts and sneakers
        a = np.asarray(im).copy(); m = a[..., 3] > 128; f = nd.binary_fill_holes(m) & ~m
        a[f, 3] = 255; im = Image.fromarray(a)
    return im.crop((FX, FY, FX + FW, FY + FH))

def save(dirn, name, img):
    os.makedirs(os.path.dirname(f'{dirn}/{name}'), exist_ok=True); img.save(f'{dirn}/{name}'); return name

# Dong's joint heights in his hero box, moved into the frame
Y = lambda y: y + DY
SHO, HEM, ELB, WRI, HIP, KNEE, ANK, NECK, TORSO_TOP, TORSO_BOT, PIV = map(Y, (462, 548, 650, 790, 770, 1025, 1300, 373, 330, 745, 725))
SOLE_DONG = Y(1398)

def frontlike(img, d, view, long_sleeves, head='static', blank=None, back=False):
    """img: RGBA in the frame. Writes <d>/<view>/*.png and returns the view dict for rig.json."""
    A = np.asarray(img).astype(int); al = A[..., 3] > 128
    ys = np.where(al.any(1))[0]; sole = ys[-1]
    # legs may be shorter or longer than Dong's: stretch the hip-to-sole joints to this character's sole
    s = (sole - HIP) / (SOLE_DONG - HIP); knee = HIP + (KNEE - HIP) * s; ank = HIP + (ANK - HIP) * s
    # body: silhouette at mid forearm; arms are the outer strips, about 53 px on Dong, scaled by body width
    xs = np.where(al[Y(650)])[0]; L, R = xs[0], xs[-1]; aw = int(round(53 * (R - L) / 332))
    arms = {'L': (L + 4, L + aw), 'R': (R - aw, R - 4)}
    cx = (L + R) / 2
    # legs: two runs a little above the ankle (split at the middle if they touch)
    rr = runs(al[int(ank - 120)], 10)
    if len(rr) >= 2: legs = {'L': rr[0], 'R': rr[-1]}
    else: x0, x1 = rr[0]; m = int(cx); legs = {'L': (x0, m - 2), 'R': (m + 2, x1)}
    P = {}
    yy, xx = np.mgrid[0:img.height, 0:img.width]
    T0 = Y(360) if back else TORSO_TOP
    xl, xr = arms['L'][1] + 1, arms['R'][0] - 1
    keep = (yy >= T0) & (yy <= TORSO_BOT + 20) & ~((yy >= Y(440)) & ((xx < xl) | (xx > xr)))
    torso = rim(masked(img, keep).crop((0, T0, img.width, TORSO_BOT + 21)))
    P['torso'] = {'file': save(d, f'{view}/torso.png', torso), 'pivot': [cx, PIV - T0], 'parent': None, 'z': 0}
    shirt = shirt_of(img)
    for side in 'LR':
        x0, x1 = arms[side]; w = x1 - x0 + 1; acx = (x0 + x1) / 2
        armtex = inset(img, (x0, Y(600), x1 + 1, Y(700) if long_sleeves else Y(720)), dx=max(3, w // 5) if long_sleeves else max(3, w // 8))
        handtex = None
        if long_sleeves:
            reg = A[Y(700):Y(940), x0:x1 + 1]; rgb = reg[..., :3]; sk = (reg[..., 3] > 128) & (rgb[..., 0] > 150) & (rgb[..., 0] - rgb[..., 2] > 35) & (rgb[..., 0] >= rgb[..., 1])
            rows = np.where(sk.sum(1) > w * 0.5)[0]
            if len(rows): r0 = Y(700) + int(np.median(rows)); handtex = inset(img, (x0, r0 - 10, x1 + 1, r0 + 12), dx=max(3, w // 4))
        up, top = capsule(armtex, ELB - SHO, w + (6 if long_sleeves else 0))
        if not long_sleeves:
            sw = int(w * 1.4); sleeve, stop_ = capsule(shirt, HEM - SHO, sw, cap_bottom=False)
            sl = np.asarray(sleeve).copy(); y2, x2 = np.mgrid[0:sl.shape[0], 0:sl.shape[1]]
            hemy = stop_ + (HEM - SHO) + 6 * np.cos((x2 / sl.shape[1] - .5) * np.pi)
            trim = A[Y(538):Y(546), int(acx) - 4:int(acx) + 4, :3].reshape(-1, 3)
            tc = np.median(trim, 0)
            if tc.max() < 140:                                   # a dark cuff band on the sleeve (the uniform's navy trim)
                band = (y2 > hemy - 14) & (y2 <= hemy); sl[band, :3] = tc.astype(np.uint8)
            sl[..., 3] = np.where(y2 > hemy, 0, sl[..., 3]); sleeve = rim(Image.fromarray(sl), dark=0.8)
            W = max(up.width, sleeve.width); uap = Image.new('RGBA', (W, max(up.height, sleeve.height)))
            uap.alpha_composite(up, ((W - up.width) // 2, 0)); uap.alpha_composite(sleeve, ((W - sleeve.width) // 2, top - stop_))
        else: uap = up; W = up.width
        fo, ftop = capsule(armtex, WRI - ELB, w + (4 if long_sleeves else 0), cap_bottom=False, mitten=0.62, hand=handtex)
        P[f'upperarm{side}'] = {'file': save(d, f'{view}/upperarm{side}.png', uap), 'pivot': [W / 2, top], 'parent': 'torso', 'at': [acx, SHO - T0], 'z': 1, 'len': ELB - SHO}
        P[f'forearm{side}'] = {'file': save(d, f'{view}/forearm{side}.png', fo), 'pivot': [fo.width / 2, ftop], 'parent': f'upperarm{side}', 'at': [W / 2, top + (ELB - SHO)], 'z': 2, 'len': WRI - ELB}
    for side in 'LR':
        x0, x1 = legs[side]; w = x1 - x0 + 1; lcx = (x0 + x1) / 2
        th, ttop = capsule(inset(img, (x0, HIP + 30, x1, knee - 25), dx=max(6, w // 9)), knee - HIP, w)
        sh, stop = capsule(inset(img, (x0, knee + 25, x1, ank - 40), dx=max(6, w // 9)), ank - knee, w * 0.96)
        shoe = masked(img, (yy >= ank - 30) & (xx >= x0 - 20) & (xx <= x1 + 20)).crop((int(x0 - 20), int(ank - 30), int(x1 + 21), sole + 3))
        bb = shoe.getbbox(); shoe = rim(shoe.crop(bb))
        P[f'thigh{side}'] = {'file': save(d, f'{view}/thigh{side}.png', th), 'pivot': [th.width / 2, ttop], 'parent': 'torso', 'at': [lcx, HIP - T0], 'z': -2, 'len': knee - HIP}
        P[f'shin{side}'] = {'file': save(d, f'{view}/shin{side}.png', sh), 'pivot': [sh.width / 2, stop], 'parent': f'thigh{side}', 'at': [th.width / 2, ttop + (knee - HIP)], 'z': -1, 'len': ank - knee}
        ax = lcx - (x0 - 20 + bb[0]); ay = (ank - 30 + bb[1])
        P[f'foot{side}'] = {'file': save(d, f'{view}/foot{side}.png', shoe), 'pivot': [ax, ank - ay], 'parent': f'shin{side}', 'at': [sh.width / 2, stop + (ank - knee)], 'z': 0,
                            'sole': [[shoe.width * 0.2, shoe.height - 6], [shoe.width * 0.8, shoe.height - 6]]}
    white = al & (A[..., :3].min(2) > 200)
    if back:
        hm = (yy < Y(405)) & ~((yy > Y(370)) & white)
        P['head'] = {'file': save(d, f'{view}/head.png', rim(masked(img, hm).crop((0, 0, img.width, Y(405))))), 'pivot': [cx, NECK], 'parent': 'torso', 'at': [cx, NECK - T0], 'z': -3}
        order = ['footL', 'footR', 'thighL', 'thighR', 'shinL', 'shinR', 'head', 'torso', 'forearmL', 'forearmR', 'upperarmL', 'upperarmR']
    else:
        if head == 'dong':
            P['head'] = {'file': 'heads/<expression>.webp', 'pivot': [256, 452], 'scale': 370 / 380, 'parent': 'torso', 'at': [189 + DX, NECK - T0], 'z': 3}
        else:
            P['head'] = {'file': save(d, 'face/head.png', head_card(img, cx)), 'pivot': [256, 452], 'scale': 370 / 380, 'parent': 'torso', 'at': [cx, NECK - T0], 'z': 3}
        order = ['thighL', 'thighR', 'shinL', 'shinR', 'footL', 'footR', 'torso', 'forearmL', 'forearmR', 'upperarmL', 'upperarmR', 'head']
    return {'pieces': P, 'order': order, 'hip_from_floor_px': sole - PIV}

def shirt_of(front):
    a = np.asarray(front)[..., 3] > 128; xs = np.where(a[Y(650)])[0]; cx = (xs[0] + xs[-1]) / 2
    return inset(front, (cx - 70, Y(560), cx - 18, Y(640)), dx=2)

def head_card(img, cx):
    """The head in Dong's 512 head-card format: neck at (256, 452), drawn at 370/380 of a body px."""
    f = 370 / 380; x0 = cx - 256 * f; y0 = NECK - 452 * f
    c = img.crop((int(round(x0)), int(round(y0)), int(round(x0 + 512 * f)), int(round(y0 + 512 * f)))).resize((512, 512), Image.LANCZOS)
    import scipy.ndimage as nd
    a = np.asarray(c).copy(); m = nd.binary_opening(a[..., 3] > 128, iterations=2); lab, n = nd.label(m)
    if n > 1: m = lab == (1 + int(np.argmax(nd.sum(m, lab, range(1, n + 1)))))
    a[..., 3] = np.where(m, a[..., 3], 0); a[466:, :, 3] = 0; a[450:466, :, 3] = (a[450:466, :, 3] * np.linspace(1, 0, 16)[:, None]).astype(np.uint8)
    return rim(Image.fromarray(a))

def face_anchors(front_card, blank_card):
    """Eyes and mouth from the difference between a character's head and its blank-faced edit."""
    import scipy.ndimage as nd
    a = np.asarray(front_card).astype(int); b = np.asarray(blank_card).astype(int)
    d = (np.abs(a[..., :3] - b[..., :3]).sum(2) > 60) & (a[..., 3] > 128) & (b[..., 3] > 128)
    d[:150] = False; d[440:] = False
    lab, n = nd.label(nd.binary_opening(d, iterations=1)); comps = []
    for i in range(1, n + 1):
        yy, xx = np.where(lab == i)
        if len(yy) < 25: continue
        comps.append((len(yy), xx.mean(), yy.mean(), xx.min(), xx.max(), yy.min(), yy.max()))
    comps.sort(reverse=True)
    # eyes: the biggest pair of round blobs side by side (eyebrows are wider and flatter)
    cand = [c for c in comps if (c[4] - c[3]) < 45 and 200 < c[2] < 350 and (c[6] - c[5]) > 0.5 * (c[4] - c[3])]
    best = None
    for i in range(len(cand)):
        for j in range(i + 1, len(cand)):
            p, q = cand[i], cand[j]
            if abs(p[2] - q[2]) < 15 and 60 < abs(p[1] - q[1]) < 160 and (best is None or p[0] + q[0] > best[0][0] + best[1][0]): best = (p, q)
    out = {}
    if best:
        e = sorted(best, key=lambda c: c[1]); out['EL'], out['ER'] = e[0][1], e[1][1]; out['EY'] = (e[0][2] + e[1][2]) / 2
        out['eye'] = max(e[0][4] - e[0][3], e[1][4] - e[1][3]) + 2
        mouth = [c for c in comps if c[2] > out['EY'] + 40 and (c[4] - c[3]) > 18 and c not in best]
        if mouth:
            m = max(mouth, key=lambda c: c[0]); out['MX'], out['MY'] = m[1], m[2]; out['mouthW'] = m[4] - m[3] + 4
    return out

def side_rig(full, noarm, d, long_sleeves, shirt_front=None):
    """Side puppet from a character's side image and its arm-less edit (both in the frame, facing right)."""
    F = np.asarray(full).astype(int); S = np.asarray(noarm).astype(int); fa = F[..., 3] > 128; sa = S[..., 3] > 128
    ys = np.where(sa.any(1))[0]; sole = ys[-1]
    # Dong's side, in his normalized 1400 px side frame: tee top 467, hem 867, shoe 1295 -> as fractions of the figure height
    top = ys[0]; Hh = sole - top
    fr = lambda v: top + (v - 0) * Hh / 1400
    y_tee, y_hem, y_shoe = fr(467), fr(867), fr(1295)
    legrow = runs(sa[int(y_hem + 60)], 10); legx0, legx1 = legrow[0][0], legrow[-1][1]
    shinrow = runs(sa[int(y_shoe - 60)], 10); shinx0, shinx1 = shinrow[0][0], shinrow[-1][1]
    import scipy.ndimage as nd
    diff = (np.abs(F[..., :3] - S[..., :3]).sum(2) > 70) & fa
    arm = (fa & ~sa) | diff; arm[:int(y_tee + 40)] = False; arm[int(y_shoe - 40):] = False
    arm = nd.binary_opening(arm, iterations=3); lab, n = nd.label(arm)
    if n: arm = lab == (1 + int(np.argmax(nd.sum(arm, lab, range(1, n + 1)))))
    arm_rows = np.where(arm.sum(1) >= 6)[0]; arm_bot = int(arm_rows.max()); mid = int(np.percentile(arm_rows, 35))
    # measure the arm just above the hand (the forearm): on short sleeves that's skin, on long sleeves it's the sleeve itself
    band = int(arm_bot - 115); axs = np.where(arm[band] if arm[band].sum() >= 6 else arm[mid])[0]
    ax0, ax1 = int(axs.min()), int(axs.max()); aw = ax1 - ax0 + 1; acx = (ax0 + ax1) / 2
    yy, xx = np.mgrid[0:noarm.height, 0:noarm.width]
    sx = np.where(sa[int(y_tee) - 12])[0]; neck_x = float(np.median(sx)) if len(sx) else acx
    hip = [(legx0 + legx1) / 2, y_hem + 20 - y_tee]
    P = {}
    P['torso'] = {'file': save(d, 'side/torso.png', rim(masked(noarm, (yy >= y_tee) & (yy < y_hem + 40)).crop((0, int(y_tee), noarm.width, int(y_hem + 40))))),
                  'pivot': [hip[0], hip[1] - (y_tee - int(y_tee))], 'parent': None, 'z': 0}
    P['head'] = {'file': save(d, 'side/head.png', rim(masked(noarm, yy < y_tee + 30).crop((0, 0, noarm.width, int(y_tee + 30))))), 'pivot': [neck_x, y_tee + 10],
                 'parent': 'torso', 'at': [neck_x, 10], 'z': 3}
    s_sho = y_tee + 70; s_wri = arm_bot - 45; s_elb = s_sho + int((s_wri - s_sho) * 0.55)
    armtex = inset(full, (ax0, arm_bot - 150, ax1, arm_bot - 85), dx=max(5, aw // 4))
    if long_sleeves:   # the sleeve is the same cloth as the body: take it from the plain side of the torso (no cuffs, no lanyard)
        tcx = (legx0 + legx1) / 2; armtex = inset(noarm, (tcx - 28, y_tee + 140, tcx + 28, y_tee + 250), dx=2)
    handtex = None
    if long_sleeves:
        reg = F[int(arm_bot - 120):arm_bot, ax0:ax1 + 1]; rgb = reg[..., :3]; sk = (reg[..., 3] > 128) & (rgb[..., 0] > 150) & (rgb[..., 0] - rgb[..., 2] > 35) & (rgb[..., 0] >= rgb[..., 1])
        rows = np.where(sk.sum(1) > aw * 0.5)[0]
        if len(rows): r0 = int(arm_bot - 120 + np.median(rows)); handtex = inset(full, (ax0, r0 - 10, ax1, r0 + 12), dx=max(3, aw // 4))
    ua, utop = capsule(armtex, s_elb - s_sho, aw + (4 if long_sleeves else 0))
    if not long_sleeves:
        tx = np.where(sa[int(y_tee + 330)])[0]; shirt = shirt_front or inset(noarm, (tx.min() + 8, y_tee + 300, tx.min() + 8 + aw * 1.3 + 24, y_tee + 380), dx=12)
        sleeve, stop_ = capsule(shirt, 110, aw * 1.3, cap_bottom=False)
        sl = np.asarray(sleeve).copy(); y2, x2 = np.mgrid[0:sl.shape[0], 0:sl.shape[1]]
        hemy = stop_ + 110 + 10 * np.cos((x2 / sl.shape[1] - .5) * np.pi)
        trim = F[int(y_tee + 150):int(y_tee + 175), int(acx) - 3:int(acx) + 3, :3].reshape(-1, 3)
        dark = trim[trim.max(1) < 140]
        if len(dark) > 10: band = (y2 > hemy - 14) & (y2 <= hemy); sl[band, :3] = np.median(dark, 0).astype(np.uint8)
        sl[..., 3] = np.where(y2 > hemy, 0, sl[..., 3]); sleeve = rim(Image.fromarray(sl))
        uap = Image.new('RGBA', (sleeve.width, ua.height)); uap.alpha_composite(ua, ((sleeve.width - ua.width) // 2, 0)); uap.alpha_composite(sleeve, (0, utop - stop_))
    else: uap = ua
    fap, ftop = capsule(armtex, s_wri - s_elb, aw + (2 if long_sleeves else 0), cap_bottom=False, mitten=0.62, hand=handtex)
    for nm, z, tint in (('near', 4, 1.0), ('far', -3, 0.8)):
        P[f'upperarm_{nm}'] = {'file': save(d, 'side/upperarm.png', uap), 'pivot': [uap.width / 2, utop], 'parent': 'torso', 'at': [acx, s_sho - y_tee], 'z': z, 'len': s_elb - s_sho, 'tint': tint}
        P[f'forearm_{nm}'] = {'file': save(d, 'side/forearm.png', fap), 'pivot': [fap.width / 2, ftop], 'parent': f'upperarm_{nm}', 'at': [uap.width / 2, utop + (s_elb - s_sho)],
                              'z': z + 0.5, 'len': s_wri - s_elb, 'tint': tint}
    s_hip = y_hem + 30; s_ank = y_shoe + 10; s_knee = s_hip + int((s_ank - s_hip) * 0.5)
    lw = legx1 - legx0 + 1; sw = shinx1 - shinx0 + 1
    th, ttop = capsule(inset(noarm, (legx0, y_hem + 60, legx1, y_hem + 230), dx=14), s_knee - s_hip, lw * 0.9)
    sh, stp = capsule(inset(noarm, (shinx0, s_knee + 30, shinx1, s_ank - 30), dx=14), s_ank - s_knee, sw * 0.95)
    # the shoe: everything below the ankle in the arm-less side image, toe to the right
    shoe = masked(noarm, yy >= s_ank - 24).crop((int(shinx0 - 40), int(s_ank - 24), int(shinx1 + 160), sole + 3)); bb = shoe.getbbox(); shoe = rim(shoe.crop(bb))
    ank = [((shinx0 + shinx1) / 2 - (shinx0 - 40 + bb[0])) - sw * 0.05, (s_ank - 24 + 24) - (s_ank - 24 + bb[1])]
    for nm, z, tint in (('near', 2, 1.0), ('far', -2, 0.8)):
        P[f'thigh_{nm}'] = {'file': save(d, 'side/thigh.png', th), 'pivot': [th.width / 2, ttop], 'parent': 'torso', 'at': [hip[0], s_hip - y_tee], 'z': z, 'len': s_knee - s_hip, 'tint': tint}
        P[f'shin_{nm}'] = {'file': save(d, 'side/shin.png', sh), 'pivot': [sh.width / 2, stp], 'parent': f'thigh_{nm}', 'at': [th.width / 2, ttop + (s_knee - s_hip)], 'z': z - 0.5, 'len': s_ank - s_knee, 'tint': tint}
        P[f'foot_{nm}'] = {'file': save(d, 'side/foot.png', shoe), 'pivot': ank, 'parent': f'shin_{nm}', 'at': [sh.width / 2, stp + (s_ank - s_knee)], 'z': z - 0.6, 'tint': tint,
                           'sole': [[max(8, ank[0] - sw * 0.3), shoe.height - 6], [shoe.width - 14, shoe.height - 6]]}
    return {'pieces': P, 'order': ['upperarm_far', 'forearm_far', 'foot_far', 'shin_far', 'thigh_far', 'foot_near', 'shin_near', 'thigh_near', 'torso', 'head', 'upperarm_near', 'forearm_near'],
            'hip_from_floor_px': sole - (y_hem + 20), 'faces': 'right'}

def headless_card(path, name, d, cards):
    """A floor pose with the head removed: the live head goes back on at the collar (neck point stored as card['head'])."""
    import scipy.ndimage as nd
    im = cut(path); a = np.asarray(im).copy(); m = nd.binary_opening(a[..., 3] > 128, iterations=3); a[..., 3] = np.where(m, a[..., 3], 0)
    lab, n = nd.label(m)
    if n > 1: keep = lab == (1 + int(np.argmax(nd.sum(m, lab, range(1, n + 1))))); a[..., 3] = (a[..., 3] * keep).astype(np.uint8)
    im = Image.fromarray(a); bb = im.getbbox(); im = im.crop(bb); al = np.asarray(im)[..., 3] > 128
    top = int(np.where(al.any(1))[0][0]); row = np.where(al[top + 6])[0]; nx = float((row[0] + row[-1]) / 2)
    os.makedirs(f'{d}/cards', exist_ok=True); im.save(f'{d}/cards/{name}.webp', quality=92)
    cards[name] = {'file': f'cards/{name}.webp', 'w': im.width, 'h': im.height, 'height_m': round(im.height / 1400 * 1.7, 3), 'head': {'at': [nx, top + 14]}}

def card(path, name, d, cards, target_h=None, ref_w=None):
    """A drawn pose, cut and scaled like Dong's cards (standing poses: frame height; floor poses: beanie/head width)."""
    import scipy.ndimage as nd
    im = cut(path); a = np.asarray(im).copy(); m = nd.binary_opening(a[..., 3] > 128, iterations=3); lab, n = nd.label(m)
    if n > 1: m = lab == (1 + int(np.argmax(nd.sum(m, lab, range(1, n + 1)))))
    a[..., 3] = np.where(m, a[..., 3], 0); im = Image.fromarray(a); im = im.crop(im.getbbox())
    h = target_h or 1400
    if ref_w: k = ref_w
    else: k = h / im.height
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    os.makedirs(f'{d}/cards', exist_ok=True); im.save(f'{d}/cards/{name}.webp', quality=92)
    cards[name] = {'file': f'cards/{name}.webp', 'w': im.width, 'h': im.height, 'height_m': round(im.height / 1400 * 1.7, 3)}

CAST = {   # name: (long sleeves?, height in metres)
    'dong': (False, 1.70), 'tyler': (False, 1.76), 'priya': (False, 1.63), 'marcus': (False, 1.84), 'kid_a': (False, 1.62), 'kid_b': (False, 1.72),
    'harlow': (True, 1.68), 'district': (True, 1.65), 'parent_a': (False, 1.80), 'parent_b': (True, 1.66), 'mom': (True, 1.62), 'deputy': (False, 1.83), 'dawes': (True, 1.78)}

MANUAL_FACE = {'district': {'EL': 205, 'ER': 307, 'EY': 293, 'eye': 28, 'MX': 255, 'MY': 370, 'mouthW': 66}}

def build(name):
    long_sl, height = CAST[name]; d = f'{OUT}/{name}'; os.makedirs(d, exist_ok=True)
    src = 'dong_uni' if name == 'dong' else name
    R = {'units': 'px of the cast frame; 1400 px = this character\'s height_m', 'height_m': height, 'views': {}, 'name': name}
    front = frame(f'{ART}/{src}.png')
    R['views']['front'] = frontlike(front, d, 'front', long_sl, head='dong' if name == 'dong' else 'static')
    if name != 'dong' and os.path.exists(f'{ART}/{src}_blank.png'):
        blank = frame(f'{ART}/{src}_blank.png'); cx = R['views']['front']['pieces']['torso']['pivot'][0]
        hc, bc = head_card(front, cx), head_card(blank, cx)
        an = face_anchors(hc, bc); save(d, 'face/blank_front.png', bc)
        an = {**an, **MANUAL_FACE.get(name, {})}   # where the automatic finder can't separate the eyes from glasses
        if 'EL' in an and 'MX' in an: R['face'] = {'blank': 'face/blank_front.png', **{k: round(float(v), 1) for k, v in an.items()}}
        print(name, 'face', an)
    if os.path.exists(f'{ART}/{src}_side_g.png'):
        R['views']['side'] = side_rig(gcut(f'{ART}/{src}_side_g.png'), gcut(f'{ART}/{src}_side_noarm_g.png'), d, long_sl, shirt_of(front))
    if name == 'dong':
        R['views']['back'] = frontlike(frame(f'{ART}/dong_uni_back.png'), d, 'back', False, back=True)
        R['views']['side'] = side_rig(gcut(f'{ART}/dong_uni_side_g.png'), gcut(f'{ART}/dong_uni_side_noarm_g.png'), d, False, shirt_of(front))
    cards = {}
    if name == 'dong':
        for n, f in [('turn_three_q', 'dong_uni_3q'), ('turn_three_q_back', 'dong_uni_3qback'), ('phone_ear', 'dong_uni_phone_ear'), ('phone_hold', 'dong_uni_phone_hold'),
                     ('cover_face', 'dong_uni_cover_face'), ('hands_head_scared', 'dong_uni_hands_head'), ('sit_chair_front', 'dong_uni_sit_chair'), ('sit_chair_side', 'dong_uni_sit_chair_side')]:
            card(f'{ART}/{f}.png', n, d, cards, ref_w=1.0)
        for n, f in [('sit_floor_knees', 'dong_uni_sit_floor'), ('crouch_hide', 'dong_uni_crouch')]:
            card(f'{ART}/{f}.png', n, d, cards, ref_w=1.0)
    if os.path.exists(f'{ART}/{src}_sit_floor_headless.png'): headless_card(f'{ART}/{src}_sit_floor_headless.png', 'huddle', d, cards)
    EXTRA = {'dong': [('sit_desk', 'dong_uni_sit_desk', 1.0), ('floor_phone', 'dong_uni_floor_phone', 1.0), ('phone_whisper', 'dong_uni_phone_whisper', 1.0), ('crawl', 'dong_uni_crawl', 1 / 1.45)],
             'tyler': [('sit_desk', 'tyler_sit_desk', 1.0), ('hands_mouth', 'tyler_hands_mouth', 1.0)], 'priya': [('sit_desk', 'priya_sit_desk', 1.0), ('grab', 'priya_grab', 1.0)], 'dawes': [('menu', 'dawes_menu', 1.0)], 'marcus': [('sit_desk', 'marcus_sit_desk', 1.0)],
             'kid_a': [('sit_desk', 'kid_a_sit_desk', 1.0)], 'kid_b': [('sit_desk', 'kid_b_sit_desk', 1.0)],
             'mom': [('phone_ear', 'mom_phone_ear', 1.0), ('phone_text', 'mom_phone_hold', 1 / 1.34), ('hug', 'mom_hug', 1.0)],
             'harlow': [('phone', 'harlow_phone', 1 / 1.17), ('book', 'harlow_book', 1.0), ('shush', 'harlow_shush', 1.0), ('hands', 'harlow_hands', 1.0), ('floor_phone', 'harlow_floor_phone', 1.0), ('confiscate', 'harlow_confiscate', 1.0)], 'district': [('clipboard', 'district_clipboard', 1.0)]}
    # poses with the head taken off, so the live head (blinks, talks, expressions) sits on them
    for n, f in {'harlow': [('book_live', 'harlow_book_headless'), ('hands_live', 'harlow_hands_headless')], 'dong': [('phone_live', 'dong_uni_phone_whisper_headless')], 'mom': [('phone_live', 'mom_phone_ear_headless')]}.get(name, []):
        if os.path.exists(f'{ART}/{f}.png'): headless_card(f'{ART}/{f}.png', n, d, cards)
        if n == 'phone_live' and n in cards and cards[n].get('head'): cards[n]['head']['behind'] = True   # the phone hand is in front of the face
    for n, f, rw in EXTRA.get(name, []):
        if os.path.exists(f'{ART}/{f}.png'): card(f'{ART}/{f}.png', n, d, cards, ref_w=rw)
    for n, f in [('sit_floor_knees', f'{src}_sit_floor')]:
        if name != 'dong' and os.path.exists(f'{ART}/{f}.png'): card(f'{ART}/{f}.png', n, d, cards, ref_w=1.0)
    # floor and crouch cards came out at about the same pixel scale as the standing images: keep their size relative to the 1536 px source
    for n, c in cards.items():
        if n in ('sit_floor_knees', 'crouch_hide', 'shush', 'hands', 'hands_mouth', 'grab', 'floor_phone', 'phone_whisper'): c['height_m'] = round(c['h'] / 1400 * 1.7, 3)
    for v in R['views'].values():
        for p in v['pieces'].values():
            if not p['file'].startswith('heads/'): p['size'] = list(Image.open(f"{d}/{p['file']}").size)
    json.dump(R, open(f'{d}/rig.json', 'w'), indent=1, default=float)
    json.dump(cards, open(f'{d}/cards.json', 'w'), indent=1)
    print(name, 'views', list(R['views']), 'cards', list(cards))

if __name__ == '__main__':
    import glob
    from defringe import defringe
    for n in sys.argv[1:] or CAST:
        build(n)
        for f in glob.glob(f'{OUT}/{n}/*/*.png') + glob.glob(f'{OUT}/{n}/cards/*.webp'): defringe(f, 5 if '/cards/' in f else 3)
