# Director's notes: every correction, kept as a rule

The user's standing notes, collected from their feedback so each video starts where the last one ended. **Before sending any video (or any chapter), go through this whole list and check the picture and sound against it.** When the user gives a new note, add it here the same day, in their words where possible.

## Story and picture
1. **The animation does exactly what the narration says, word for word.** Every action, person and object named is shown at that word, not just a zoom on a still. *(2026-11-09: "WHAT EVER I SAY AND NARRATE. MAKE SURE THE ANIMATION DO THE EXACT THING.")*
2. **Characters keep moving.** They walk in, reach, knock, lean, turn their heads, flinch, gesture. Nobody stands frozen through a line. *("it feels so stale")*
3. **A quoted line is mouthed by the character who said it**, in time with the narration.
4. **Show the narrator's own reactions** where the narration is personal ("I found out why…" → Dong's horrified face).
5. **Gestures the script names must be visible**: finger on lips, hands holding each other, slapping paper on the window.
6. **Faces match the moment.** Panic is a panic face (wide eyes, open mouth, sweat) on everyone in it, in side views too: use the `scared` side heads (`setSideHead('scared')`). Nobody smiles in a lockdown.
7. **People are clearly visible.** Spread groups evenly so every face shows. Nobody is sunk behind furniture: the principal stands beside his desk, not inside it.
8. **Show the routine that makes the twist land** (Dawes's cheerful "Go Hawks" mornings before the silent announcement).

## Sets and props
9. **Signs and numbers are part of the wall**, never a label pasted over the picture: bake them into the painting (`plate_door_hall_<num>.png`).
10. **Props finish the action the narration describes.** Paper "slapped over the window" covers the whole window, with no gap or peel, unless the story says it peeled.
11. **Continuity with the lights.** Once the lights are off, every shot of that room is dark (window views, clocks, inserts), with daylight only outside the glass.
12. Seat people where the script later needs them (Tyler "between Marcus and me").

## Lighting
13. **Light comes from a source you can see, and only from it.** No decorative light strips or bars. *(2026-11-09: "it feels like there is strip of lights in every scene that isnt necessary")*
    - **Window open or uncovered:** natural light falls from the window onto a believable area, as in real life. Most paintings already include this, so don't add a second layer.
    - **Dark room with a lamp:** the lamp lights the room around it as far as it would reach, and the rest falls into shadow.
    - **Other sources that may glow:** the strip under a door, a flickering tube, an EXIT sign, a phone screen.

## Sound
14. **Sound design goes in with the picture**, never left for the end. Every chapter sent has:
    - room tone or ambience
    - a sound on every named action (switch, lock, knock, keys, door, intercom)
    - risers and hits on the scares
15. **Human ambience that matches the scene:**
    - giggling, whispering, crying, sniffling, shaky breathing, teeth chattering, kids scrambling
    - generated with ElevenLabs when the library lacks it
16. **Ambience sits under the narration, never over it** (voice 6–10 dB above).
    - The **whimpering and fear sounds stay soft**.
    - **Story sounds are loud and clear** when the narration lands on them, like the footsteps at the end of Chapter 1. *("at the end i would want the footsteps to be louder. and the whimpering and fear sounds to be softer")*
17. One loudness pass to −14 LUFS for YouTube.

## Process
18. **Script first, voice-over second**, then a shot list where every line of audio gets its set. Make more sets if needed. *(video-workflow.md)*
19. **Generate any art the story is missing** without asking. *("if you find anything slightly lacking for the story. just do it")*
20. **ElevenLabs is always allowed.** Ask only before a single batch over 5,000 credits. For sound effects, set `duration_seconds` on the node; length written in the prompt is ignored.
21. **Check thoroughly before saying it's done:**
    - one frame per shot
    - the action frames (reach, knock, slap, lock)
    - the mouths on lip-synced lines
    - sound levels per scene
    - loudness
    - no black frames
22. **At the start of every new video, do the full pass:** check every frame of the storyboard and generate every character pose and background the story needs, before rendering. *(2026-11-09: "at times when i want you to analyze every frame and generate 3js images for characters and background you have to do that. but that will always come up at the start.")*
23. **For fixes, re-render only the shots that changed** and splice them back in; never re-render a whole chapter for a few notes.
24. **Before each chapter's full render, send a storyboard sheet:** one frame per shot, labelled with its narration line, plus the sound cues, so problems are caught in minutes. The goal is one full render per chapter.
