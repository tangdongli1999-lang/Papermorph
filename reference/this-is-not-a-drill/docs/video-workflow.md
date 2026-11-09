# How to make these videos — the user's working order

Agreed on 2026-11-07, after *Hide and Seek*. In the user's words: "in the future of making videos like this i would like you show me the script and then do the voice over first before making the entirity of the video".

## The order

1. **Script first.** Show the full script (every line, who says it, any acting notes) and wait for approval. Long-form means **at least 10 minutes of voice** — time the first take and extend the script before generating the rest if it will come in short.
2. **Voice-over second, as its own deliverable.** Generate every line, then send one listening file of the whole film's voices, with the silences where shots will sit, before anything is animated. The user listens and approves, or names lines to redo.
   - **ElevenLabs is always allowed** (the user, 2026-11-09: "always allow for eleven labs, as long as it doesnt use over 5k credit for a huge chunk"). Ask first only before a single batch over 5,000 credits; run `estimate_only` first when unsure.
   - **One take per line** (`generations_count: 1`). The user, 2026-11-07: "in the future just generate one audio at a time will do, i dont want to waste my credits." Repeated 2026-11-08: "when u use eleven labs remember not to do two narration at a time. just one will do". Regenerate only the lines the user (or a check) rejects.
   - Check each take against the script before sending: doubled or dropped words happen (ElevenLabs v4 said "four" twice and "Sure" twice in *Hide and Seek*).
   - Counts and other cut-up takes: map each piece in order; never guess which sound to drop.
   - **Dong** is always the user's clone "DONG" (`VVG3rQgFgaq7gavknXYv`), on `eleven_multilingual_v2`.
3. **Shot list: every line of the voice-over gets a set.** (The user, 2026-11-09: "i would want ever set to align with the audio, so if that means making more sets, i would want you to do it … make sure you do this for all the future videos.") Before any art is made, go through the approved voice-over line by line (with its timestamps) and write down the set, characters, poses and props each moment needs. Then make **every** set and character that list calls for — never stretch one background over lines that describe somewhere else, and add close-ups (a door, a speaker, a phone, a window) wherever the narration points at one.
4. **Then the art**: cast in Dong's pose on his rig (see `dong-character-sheet.md`) and all the sets from the shot list. Show the user the cast and sets before animating.
5. **Then the picture**, timed to the approved clips.

## Staging (from 2026-11-09, every video)

- Characters sit, stand and walk **inside** the set, not pasted on a picture: each set is a painted plate projected onto a real floor and wall (`set.js`), with furniture as cut-out props in front of and behind people, and a contact shadow under everyone.
- **Spread people out evenly so everyone can be seen.** (The user, 2026-11-09: "make sure to spread them out evenly so that everyone can be seen".) No one's face may be hidden behind anyone else or a prop; in a group, use one evenly spaced row (or a clear staggered row) and check a frame before rendering.
- In a group, every character moves differently (shiver, sob, look around, rock, freeze …) and reacts to a scare with their own delay and strength.

## Animating (from 2026-11-09, *This Is Not a Drill*)

- **Word times first.** Force-align every take (`vo/align.py`, PocketSphinx) so each cut lands on the word that calls for it, not on an estimate.
- **One shot list per chapter in code** (`web/make_chN.py` → `web/film/chN.json`). Each shot has:
  - a room or flat insert
  - a camera move: aim at a point of the painting, zoom, small dolly, a knock jolt
  - per-character moods and actions
  - overlays: on-screen text, phone chats, clock inserts, door plaques, CCTV, the triangle point-of-view, flicker, foot shadows
- **Lip sync from the voice track.** `web/amp.json` holds the loudness per frame. A speaking character's mouth opens with it during their line and stays flat between words, never the default smile. Every speaking character needs a live (blank) face; check for one before animating.
- **Check before the long render.** Render one frame from the middle of every shot, look at all of them, fix, then render. After the full render, pull frames at key moments and crop the mouths on every speaking line.
- **Continuity.** Seat people where the script later needs them (Tyler "between Marcus and me").
- **Renders cost no credits.** Only new art or new voice lines do.

## The picture does exactly what the narration says (from 2026-11-09, every video)

The user, 2026-11-09: "WHAT EVER I SAY AND NARRATE. MAKE SURE THE ANIMATION DO THE EXACT THING." and "show illustration of what i am saying word for word. not just zooming [make sure this is done for all the other videos too]".

- **Storyboard word by word** from the aligned word times. Every phrase that describes an action, a person or a thing gets a shot that shows it, at that word:
  - "Not a teacher, not a friend, not your own mom": a teacher, then a friend, then Mom, each knocking at the door.
  - "Lights off": a hand flips the switch and the room goes dark.
  - "finger on her lips": her finger is on her lips.
  - "No Go Hawks": the principal saying "Go Hawks" on a normal morning.
  - "I found out why…": the narrator's own face, horrified.
- **A camera move on a still picture is never the illustration.** Use it only between beats.
- **Characters keep moving:**
  - They walk in, reach, knock, lean, turn their heads, flinch at sounds and gesture while they talk.
  - Nobody stands frozen through a line.
  - A quoted line ("Bet it's a raccoon in the vents again") is mouthed by the character who said it, in time with the narrator's words.
- **People must be clearly visible.** No one is sunk behind furniture: the principal stands beside his desk, not inside it.
- **Sound design goes in with the picture, not at the end.** Every chapter sent for review has:
  - a room tone or ambience bed
  - a sound on every action the narration names (click, knock, lock, footsteps)
  - risers and hits on the scares
  - effects at about half the voice level, with one loudness pass to −14 LUFS

## Sound and light that match the scene (from 2026-11-09)

- **Human ambience:** generated with ElevenLabs sound effects (`eleven_text_to_sound_v2`, one take each).
  - **Set `duration_seconds` on the node** (and `loop` for beds) with `creative_update_node` before running it. Writing "20 seconds" in the prompt is ignored; it gives 1-second clips.
  - **Normalise every take** to −20 LUFS before mixing, since they come back at wildly different levels.
- **Under the narration, never over it.** Measure the gap per scene: aim for the voice 6–10 dB above the ambience (`sfx/mix.py`, then compare).
- **Library so far** (`sfx/lib/el_*`):
  - huddle crying and sniffling
  - nervous whispers
  - stifled giggles
  - shaky breathing
  - teeth chattering
  - the scramble into the corner
  - kindergarten chatter
  - classroom murmur
  - empty hallway hum
  - schoolyard morning
  - group gasp
- **Ambience lighting on every shot**, chosen by location (`film_lib.lights`):
  - sunbeams through blinds, with dust in daylight rooms
  - grey light leaking through closed blinds, with deep shadows, once the lights are off
  - the warm strip under the door
  - fluorescent tubes that buzz and dip
  - the red EXIT glow in dark hallways
  - a warm sepia for flashbacks

## Long-form (8–12 min) videos

Agreed 2026-11-07 for *The Overnight Rules*: the whole script and the whole voice-over are approved up front; then the animation is built and approved one 1.5–2 min chapter at a time; then the chapters are merged into one 16:9 video (continuous ambience across joins, one loudness pass, one caption file, title card, end-screen tail); Shorts are re-staged upright from the best moments last.

*Two Legs* (2026-11-08) ran it per chapter instead: for each chapter, the voice-over, then an art brief (very specific character sheets and sets for that chapter's scenes) that the user generates with another image AI and sends back as a zip, then the animation. The user wants **non-stop narration** (no long pauses, "like a rollercoaster").

## Captions (from 2026-11-08, every video)

- Burned into the picture, **at most 10 words on screen at a time** (cut at sentence ends and commas, a long clause where she pauses).
- **The word being spoken is highlighted in yellow** as she says it (karaoke-style tracker).
- Word times come from forced alignment of each take (PocketSphinx with its bundled English model, `tools/two-legs/align.py`), not estimated.

## What we learned on *Hide and Seek*

- **Voices:** ElevenLabs (v4, through the ElevenLabs connector). Its voice design refuses child voices; use a library character voice for a child (Leo: "VALF - Child, Young, Playful").
- **Ambient beds** (rain, room tone) go under the whole film as one long track, not restarted per scene, or they cut at every scene change.
- **Captions:** burned into the picture, with the second voice's line in red.
- **Blocked in this workspace unless allowed:** `us.aws.cdn.hf.co` and `cas-server.xethub.hf.co` (the Whisper model, for word-by-word transcript checks of the voices).
- **Downloading takes:** use the signed `content_url` exactly as given (don't URL-encode the Signature again, or the CDN answers 403).
