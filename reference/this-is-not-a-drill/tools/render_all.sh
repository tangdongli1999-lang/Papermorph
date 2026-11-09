#!/bin/bash
# renders chapters given as args, each with 2 workers, then muxes its voice-over
S=${S:-$(pwd)}; export NODE_PATH=$(npm root -g); TOOLS=$(cd "$(dirname "$0")" && pwd); cd $S
OUT=/home/claude/lockdown/out
for c in "$@"; do
  t0=$(python3 -c "import json;print(json.load(open('/home/claude/lockdown/web/film/ch$c.json'))['t0'])")
  t1=$(python3 -c "import json;print(json.load(open('/home/claude/lockdown/web/film/ch$c.json'))['t1'])")
  rm -rf ch${c}f; mkdir ch${c}f
  node $TOOLS/render.js film/ch$c.json ch${c}f w0of2 > ch${c}_w0.log 2>&1 &
  node $TOOLS/render.js film/ch$c.json ch${c}f w1of2 > ch${c}_w1.log 2>&1
  wait
  echo "ch$c rendered: $(ls ch${c}f | wc -l) frames; $(cat ch${c}_w0.log ch${c}_w1.log | grep -c 'E:') page errors"
  dur=$(python3 -c "print($t1-$t0)")
  ffmpeg -y -v error -ss $t0 -t $dur -i /home/claude/lockdown/vo/this-is-not-a-drill-voiceover.mp3 -af "apad" -t $dur -c:a pcm_s16le $OUT/ch${c}_vo.wav
  ffmpeg -y -v error -framerate 30 -i ch${c}f/f%05d.jpg -i $OUT/ch${c}_vo.wav -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart $OUT/this-is-not-a-drill-ch$c.mp4 && echo "ch$c encoded"
done
