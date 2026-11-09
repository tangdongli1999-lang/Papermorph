# This Is Not a Drill: quality reference

A complete, working copy of the paper-puppet horror video *This Is Not a Drill* (11:34, 6 chapters): code, character rigs and art, sets, lighting, camera, sound and voice-over. Use it as the reference for how these videos should look, sound and be built. **Read `docs/director-notes.md` (every rule the director has given, in their words) and `docs/video-workflow.md` (the working order and what each step needs) before making a video.** `docs/lockdown-shotlist.md` is the shot list for this film.

`sample/this-is-not-a-drill-ch1-excerpt.mp4` is a 47-second finished excerpt of Chapter 1 (0:56–1:44): the lockdown, the huddle, the flashback, and the footsteps at the end.

## How a frame is rendered

Each frame is a three.js (r128) scene drawn in headless Chromium, then screenshotted. `web/film.html` loads `vendor/three.min.js`, `dong.js`, `set.js` and `film.js`; `filmFrame(f)` in `film.js` draws frame `f`.

1. **Shot list.** `web/make_chN.py` (helpers in `web/film_lib.py`) writes `web/film/chN.json`. Each shot is a time span with a room, character overrides, camera keys, timed events and overlays, storyboarded word by word against the aligned voice-over (`vo/words.json`).
2. **The set** (`web/set.js`, `buildSet`). A painted plate (`art/out/*.png`) is projected from a reference camera onto a real floor and back wall, so characters stand *in* the painting. `floorAt(u, v)` puts a character on the painted floor. Cut-out masks (`web/masks/`) become holdouts in front of people; props are in `web/props/`. Rooms are `web/rooms/*.json` (plate + who stands where), made by `web/make_rooms.py`.
3. **The characters** (`web/dong.js`). Every character is a flat paper puppet: front, side and back views of jointed pieces, plus "cards" (whole poses, such as sitting on the floor or hands over mouth). They have:
   - clips: walk, run, sit, stand, reach, knock, slap, point, cheer, smooth, scared and others
   - huddle moods: shiver, sob, terror, lookaround, whisper, stare, relief, lookup and others
   - a live face drawn on a canvas (eyes, brows, mouth, tears, sweat)
   - lip sync from `web/amp.json` (voice loudness per frame) and `web/lines_t.json`
   - a tint for dark rooms

   The rigs are built from the character art by `cast/build_cast.py` into `cast/<name>/` (`rig.json`, `cards.json`, the cut pieces). Scared side heads come from `cast/side_heads.py`.
4. **Events** (`film.js`, `stepTo`). These change things at exact times:
   - play a clip, change mood, card, face, view or facing
   - `runTo`, `slide`, `lean`, `flinch`
   - swap the painting (`plate`): lights going off, shadows under the door, a lever turning one pre-composited plate per angle
   - tint
5. **The camera** (`film.js`, `camera()`). Each shot moves from key `a` to key `b`:
   - `aim` is the point of the painting to centre; `zoom`, dolly (`dx`, `dz`) and `ease` set the move
   - `shake` adds handheld drift; `kicks` jolt the frame on a knock
   - it never looks past the painting's edge
6. **Lighting** (`web/film_lib.py`, `lights()` and `add_lighting()`; drawn by `overlays()` in `film.js` with styles in `film.html`). Light only comes from sources in the picture:
   - the strip under the door
   - a buzzing fluorescent tube
   - the red EXIT sign
   - a lamp
   - with the lights off, the room falls into shadow

   Flashbacks get a warm `filter`. Other overlays are titles, typed text, phone and chat, clock, CCTV and faint numbers.
7. **Sound** (`sfx/mix.py`). Mixes the voice-over (`vo/this-is-not-a-drill-voiceover.mp3`), looped ambience beds and timed cues from `web/film/chN_sfx.json`, using the sounds in `sfx/lib/`, with one loudness pass to −14 LUFS. ElevenLabs takes are `el_*_n.wav`, normalised to −20 LUFS; library credits are in `sfx/lib/CREDITS.txt`.

Art generation prompts are in `art/jobs.json`, and `art/gen.py` runs them. It needs your own key in the `IMAGE_API_KEY` environment variable; no key is stored here.

## Render a clip

The Python scripts use absolute paths under `/home/claude/lockdown`, so link the folder there first.

```bash
ln -s "$PWD/reference/this-is-not-a-drill" /home/claude/lockdown
npm i -g playwright && npx playwright install chromium      # once
cd /home/claude/lockdown/web
python3 -m http.server 8766 &                                  # the page is served from web/
python3 make_ch1.py                                            # shot list -> film/ch1.json + ch1_sfx.json

# render frames 0-299 (the first 10 s at 30 fps); 'mid' renders one check frame per shot
node ../tools/render.js film/ch1.json /tmp/ch1f f0-299

cd ../sfx && python3 mix.py 1                                  # -> out/ch1_mix.wav
ffmpeg -framerate 30 -i /tmp/ch1f/f%05d.jpg -ss 0 -t 10 -i ../out/ch1_mix.wav \
  -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -shortest clip.mp4
```

For a whole chapter on two workers, run `tools/render_all.sh 1`. Then:

- `web/check_ch.py` checks duration, audio and black frames.
- `web/board.py N frames_dir out` makes the storyboard sheet (one frame per shot, with its narration and sound cues).

## The finished video (all chapters, with captions)

When `out/ch1_final.mp4` … `out/ch6_final.mp4` are rendered (each one rendered from the current `web/film/chN.json`):

```
python tools/merge.py        # -> out/this-is-not-a-drill_final.mp4
```

It checks each chapter's length against its shot list, joins them, burns in the captions from `tools/captions.py` (at most 10 words on screen, the spoken word in yellow, Dong white, every other voice red, timed from `vo/words.json`) and does one loudness pass to −14 LUFS, −1.5 dBTP. It uses the GPU encoder (`h264_nvenc`) when ffmpeg has it.
