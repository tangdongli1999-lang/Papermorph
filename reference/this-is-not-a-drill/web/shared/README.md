# Dong rig: animating him in three.js

Everything in this folder is what the Animate section of the character sheet runs on. Copy the whole `rig/` folder (plus `heads/`) into a video project.

## Quick start

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="rig/dong.js"></script>
<script>
  const dong = await Dong.load('rig/');   // needs rig.json, front/, back/, side/, face/, cards/, heads/
  scene.add(dong.root);                   // 1 unit = 1 m, Dong is 1.70 m, feet on y = 0
  dong.play('walk');
  // every frame: dong.update(dt)
</script>
```

Pages must be served over http (fetch can't read `rig.json` from `file://`). For renders, `python3 -m http.server` is enough.

## Moves (`dong.play(name)`)

| Clip | View | What it does |
|---|---|---|
| `idle` | front or side | breathing, arms settle |
| `talk` | any | idle plus the mouth moving |
| `wave`, `point`, `shrug`, `scared` | front | gestures with matching faces |
| `walk` (`{pace: 1}`), `run` | side | moves `dong.root` along x; the foot on the ground is pinned, so it never slides |
| `sit`, `stand` | side | feet stay planted, hips go back and down onto a 0.47 m seat; put the chair at `dong.sitHipX()` before `play('sit')` |
| `walkToward` | front | walks to the camera (+z): legs tilt towards the lens, knees lift |
| `walkAway` | back | walks away (−z) on the back rig |
| `jump` (`{forward: 1.2}`) | any | crouch, spring 0.38 m, tuck, land; `forward` carries him along in the side view |

- `dong.setFacing(1 | -1)`: side view faces right or left.
- `dong.turn('front' | 'side' | 'back', facing, thenClip)`: turns smoothly through the three-quarter drawings (`cards/turn_three_q*`), then plays `thenClip`.
- `dong.setView('front' | 'side' | 'back')`: an instant cut between the rigs.
- `dong.setTint(0x8090c0)`: the pieces are flat unlit paper, so darken or colour him for night scenes with this (1 = as drawn).
- A clip blends from the last pose over 0.25 s. Custom clips are a function returning joint angles in degrees: `name` turns in the picture plane (positive is counter-clockwise, which moves a limb forward in the right-facing side view), `name.x` tilts it towards (−) or away (+) from the camera. Feet (`foot_near`, `footL` ...) are given relative to the floor (0 = flat) and the ankle does the rest. Return `lock: 'x'` and `stance: 'foot_near'` to pin the planted foot.

## Face

- **Live face (front):** `dong.face = { eyes, mouth, brows, look, open }`.
  - `eyes`: `open`, `happy`, `wide`, `angry`, `cry`, `closed`, `creepy`.
  - `mouth`: `null`, `grin`, `laugh`, `O`, `scream`, `tongue`, `flat`.
  - `brows`: `null`, `angry`, `worried`, `up`.
  - `look`: −1 to 1.
- **Blinking** is automatic, every 2–5 s.
- **Lip sync:** `dong.talking = true` for a generic talk. For real sync, call `dong.say(loudness0to1)` every frame from the voice track's amplitude.
- **Drawn heads (front):** `dong.setExpression('shock')` puts any drawn head from `heads/` on the rig. `null` goes back to the live face.
- **Side view:** blinks and talks too (the eye and mouth are repainted on the profile).

## Drawn pose cards (`dong.showCard(name)`)

For poses a flat jointed puppet can't bend into:

- Sitting: `sit_chair_front`, `sit_chair_side`, `sit_floor_knees`
- Phone: `phone_hold`, `phone_ear`
- Reactions: `hands_head_scared`, `cover_face`, `crouch_hide`, `hands_up`
- Gestures: `wave`, `pointing`, `pointing_side`, `looking_down`
- Other: `lying_asleep`, `walk_away_back`

All are scaled to Dong's 1.70 m with the feet on the floor. `cards/cards.json` lists the sizes.

## Files

| File | What it is |
|---|---|
| `rig.json` | Each piece's image, pivot, parent, attach point and draw order for the `front`, `back` and `side` views (px; 1400 px = 1.70 m). |
| `front/`, `back/` | Front and back puppets: torso, upper arms with the tee sleeve and a round shoulder cap (drawn over the torso so the arm never looks detached), forearms with mitten hands, thighs, shins, shoes hinged at the ankle. |
| `side/` | Side puppet: one set used for both the near and far limbs (far ones tinted 0.8). |
| `face/blank_front.png` | Front head with no eyes or mouth. |
| `face/p00`–`p20` | Eye and mouth pieces. |
| `cards/` | The drawn poses, plus `turn_three_q` and `turn_three_q_back` for turns. |
| `dong.js` | The loader, joint hierarchy, foot grounding, faces and clips. |

## Limits worth knowing

- The front and back walks tilt flat legs towards the lens. That reads well from the usual eye-level camera; from very low or high angles prefer the side walk.
- Gestures (wave, point, shrug, scared) are front-view only; in a side shot, turn him to camera first (`dong.turn('front', ...)`).
