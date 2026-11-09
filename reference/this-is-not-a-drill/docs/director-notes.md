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

## Chapter 2 notes (2026-11-09)
25. **Feet shots keep the walker in the middle of the frame** (camera `follow`). When the shoes change (sneakers → heels → boots), the change happens **on a footfall, one step at a time, with the new legs exactly where the old ones were** — one walk, the three pairs of legs stacked in step and lined up by their feet, swapped on the frame a foot lands. *("i want the frame to be exactly one step at the time and it changes. matches the leg perfectly")*
26. **Every close-up must match the story's state.** A shot of our handle during a lockdown shows the door **shut**, not ajar. Check inserts for gaps, open doors, wrong lights.
27. **A voice heard through the door gets red captions on the door, word by word** (the thing speaking in Dawes's voice). *("when principal doss talks i want red captions on the door. word by word")*
28. **Expressions follow the script in detail.** "Let out this breath": held breath (wide eyes, tight mouth), then eyes shut, lips blowing, shoulders sinking, then relief. "Counting us": eyes stepping from face to face, lips on each number. Write new expressions in the rig when the existing ones don't fit. *("make sure all the expressions follows in detail to the script")*
29. **"All the way down on the first floor" shows the floors.** Use a cut-away of the *same* school (recognisably a school: wide, several floors, rows of classrooms, lockers, stairs), in the same felt style and the same time of day (10 a.m., lights off). Not a house. *("it doesnt look like a school anymore it looks like a house")*
30. **Shadows under the door walk away step by step** and leave the light; they never just disappear (same for arriving).
31. **Sitting down on the floor goes all the way down to the floor.** No chair pose without a chair; nobody levitates. Standing up starts from the floor too. *("she is not even sitting on anythign she is levitating")*
32. **Frightened kids never hold one face.** Every ~2 s while they're on screen, each kid moves to a different kind of fear (trembling, crying, screaming, frozen open-mouthed, looking around, shaking their head), each on their own clock so the row never changes together (`fear` mood). *("facial expression of fear from the kids can be change every 2 sec … a different expression of fear not just one")*
33. **In a panic moment the adult panics too.** When Ms. Harlow sits back down "very carefully", she is frantic: panic face, trembling as she lowers herself, still terrified once down. A blank face reads as dead. *("her facial expressions looks dead, she should be frantic and panicking, maybe even shaking abit")*
34. **Full renders run on the user's own GPU (RTX 5090, Windows PC, Code-tab session).** This cloud session builds the shots and renders only check stills, then pushes to `reference/quality`; the PC session pulls and renders.
35. **A live head must sit on its body.** When a pose's drawn head is swapped for a live one (to move the mouth), check the neck join in a close frame: the head sits on the collar, never floating above or beside it. Poses with hands or a phone held up near the face fool the automatic neck finder; set the collar point by hand (`MANUAL_HEAD` in `cast/build_cast.py`) and keep hands and phone in front of the face. *("why is my mom head off")*
36. **An important text message gets the whole screen, word by word.** When the narration reads out a key message (Room 210's "Don't talk. It's listening. It only knows voices it's heard."), show that message full screen, each word appearing as it's said, not a small bubble in a phone. *("show it full screen and show it word for word")*
37. **Secret phone calls look secret.** Whispering to Mom in a lockdown: phone hidden low against the chest, hand cupped over the phone and mouth, eyes darting to the door. *("show dong using his phone discreetly")*
