---
name: sfx-library
description: Find, download and place sound effects for a video from a catalog of 4,634 free sounds (CC0 and CC BY) hosted on GitHub, with ready-made kits for horror, doors, footsteps, impacts, transitions, phone/UI, cats, ambience and voices. Use when a video, animation or chapter needs sound design or a specific sound effect.
---

# SFX library

4,634 sound effects, searchable by words, category, length and licence, fetched one at a time from GitHub, so nothing large has to be installed.

| Source | Sounds | Licence |
| --- | --- | --- |
| [lavenderdotpet/CC0-Public-Domain-Sounds](https://github.com/lavenderdotpet/CC0-Public-Domain-Sounds): Kenney packs, Bart's monthly packs, creature, sci-fi, retro arcade, Warfork and more | ~4,000 | CC0, no credit needed |
| [facebookincubator/Meta-open-sound](https://github.com/facebookincubator/Meta-open-sound): the Oculus Audio Pack (footsteps on 6 surfaces, doors, creepy drones and creaks, screams, stingers, ambience loops) | 508 | **CC BY 4.0: credit required** |
| [code4fukui/sound-cc0](https://github.com/code4fukui/sound-cc0) | 9 | CC0 |
| `papermorph-synth`: the synthesized effects from our own films (heartbeat, riser, hit, buzz, glitch, meow, purr, barestep, room tones, rain beds) | 107 | CC0 (our own) |

## Setup

The tool and catalog live in the Papermorph repo at `.claude/skills/sfx-library/`. Outside that repo, fetch the one script; it reads the catalog from GitHub by itself:

```bash
curl -sSLo sfx_library.py https://raw.githubusercontent.com/tangdongli1999-lang/Papermorph/claude/hide-and-seek/.claude/skills/sfx-library/sfx_library.py
```

Needs Python 3 and ffmpeg. No other packages.

## Finding sounds

```bash
python3 sfx_library.py cats                              # 21 categories and their counts
python3 sfx_library.py search door creak                 # ranked: words in the file name count most
python3 sfx_library.py search scream --cat voice --max 2 # one category, at most 2 s
python3 sfx_library.py search footsteps wood --cc0       # CC0 only
python3 sfx_library.py kits                              # the ready-made kits
```

Categories: music, voice, impact, creature, scifi, mechanism, weapon, ui, foley, footsteps, water, retro-game, door, glass-break, paper, whoosh, ambience, horror, cat, household, misc. Search in plain words for what is heard ("glass break small", "drone creepy", "notification"). If nothing fits, try a broader word or a category. The Oculus files carry their category in capitals at the start of the name (FEETHmn = human feet, DSGN = designed horror, MUSCStngr = musical stinger).

## Downloading

```bash
python3 sfx_library.py get site/<book>/ch01/audio/sfx synth-heart foley-woodfric-creakscreepy-os-01
python3 sfx_library.py get site/<book>/ch01/audio/sfx voice-scream-01 --name scream   # saved as scream.mp3
python3 sfx_library.py kit site/<book>/ch01/audio/sfx horror                          # a whole kit
```

Each file is converted to a 44.1 kHz MP3, its leading silence trimmed and its peak set to -3 dBFS, so every effect starts on its first frame and arrives at the same level. Give each sound a short name with `--name` when a film will call it by name (`sfx(scene, t, 'scream', .8)` in Papermorph).

## Kits

| Kit | Count | What's in it |
| --- | --- | --- |
| horror | 41 | heartbeat, riser, hit, buzz, tension pad, glitch, bare footsteps, creepy drones and impacts, creaks, creepy clock, whispers, creature, scream, breathing, bone break, loss stingers, growls |
| doors | 55 | open, close, knock, knob, lock, latch, creaks, slams; wood, metal, glass and sliding |
| footsteps | 24 | shoes walking and running, wet and wood steps, bare heel-toe steps |
| impacts | 26 | slams, punches, metal, wood, glass breaking, thuds, booms |
| transitions | 17 | swishes, whooshes, quick and fast risers |
| ui-phone | 57 | notifications, clicks, switches, phone rings and dial tone, typing, ticks |
| cat | 22 | 20 real meows, plus a synth meow and purr |
| ambience | 44 | home, city and forest beds, wind, fans, HVAC, room tone, rain, crickets, store hum |
| voices | 22 | laughs (including evil laughs), hurt sounds, breathing, inhale, sniff |

## Placing sound in a video

What worked across *Which One Is Mia*, *The Overnight Rules* and *Two Legs*:

- **Voice first.** Effects sit under the narration: about half the voice's level (Papermorph's `sfx()` plays at half volume; volume 0.5 to 1.0 on top of that). Never cover a word that carries the plot.
- **A bed under every scene.** A quiet room tone, fan or rain loop (the ambience kit) stops silence sounding like a broken file. Change the bed when the place changes, so the cut is heard as well as seen.
- **Every cut and reveal gets a sound.** A swish or swipe on a scene change, a hit on a reveal, a riser in the 1 to 2 s before a cut to the scare.
- **Fear is a pattern.** Heartbeat during a freeze (about one beat every 0.55 to 0.7 s), a riser that stops dead, a beat of near-silence, then a hit. Silence is only scary after noise.
- **Sync to the frame.** Footsteps land on the foot's contact frame, a door's latch on the frame the door stops. Align effects to aligned word times when the narration names the sound ("I heard it knock").
- **Finish with one loudness pass.** -14 LUFS integrated and -1.5 dBTP for YouTube, over the whole mix, not per effect.

## Licence and credit

CC0 sounds need nothing. For any CC BY sound (all Oculus files: the search shows "CC BY (credit)"), `get` writes the credit into `CREDITS.txt` in the output folder. Paste that line into the video description:

> "Oculus Audio Pack 01" by Oculus VR, LLC (https://developers.meta.com/vr/downloads/package/oculus-audio-pack-1/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

To keep a video credit-free, add `--cc0` to every search.

## Making a sound that isn't in the library

Papermorph's `sfx.py` synthesizes effects from numpy recipes (`.claude/skills/papermorph/scripts/sfx.py --list`; a book's own recipes in `books/<book>/sfx_recipes.py`). A recipe is a short function returning samples, seeded by its name. Write one when the library has nothing close (a specific heartbeat speed, a hum at a certain pitch), and add the rendered file to `synth/` and a row to `sfx_catalog.csv` so the next video can find it.
