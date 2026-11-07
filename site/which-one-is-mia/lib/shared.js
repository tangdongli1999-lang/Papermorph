/* shared.js — what every scene of Which One Is Mia? uses: timing helpers and the dorm room, built the same way in
   every scene so the staging matches across cuts. */
'use strict';
const clipAt = (scene, pre, clip, t = 0) => pre + TIMINGS[scene].parts[clip] + t;
const tween = (q, t0, d, a, b) => a + (b - a) * span(q, t0, t0 + d);
const lips = (q, scene, pre, ...clips) => { for (const c of clips) { const m = mouthAt(c, q - clipAt(scene, pre, c)); if (m !== 'X') return m; } return 'X'; };
// Jess between lines: lips shut (A), not the rest shape's smile
const worried = m => m === 'X' ? 'A' : m;
const shotAt = (q, shots) => { let s = shots[0][1]; for (const [t0, n] of shots) if (q >= t0) s = n; return s; };
const breath = (q, ph = 0, a = 1.2) => a * Math.sin((q + ph) * 2.4);
const slotIn = (g, slot) => { if (g.parentNode !== slot) slot.appendChild(g); };

// Where things are (world px of the 'dorm' set at z 1). Jess's bed is near the camera (bottom left, scaled up), Mia's
// against the far wall under the window (right, scaled down); the door in the middle of the back wall.
const JESS_BED = { x: -150, y: 1600, s: 1.3, w: 480 };   // the group's origin (bottom-left of the bed) and scale
const MIA_BED = { x: 600, y: 1186, s: .78, w: 400 };
// Mia under her duvet (her hip, bed coordinates): only the top of her curls shows over its edge, the clue a second
// watch finds in every shot of her bed
const MIA_HID = 94;
const SPOT = { jessInBed: [200, -120], miaInBed: [210, -40], jessAtDoor: [610, 1130], jessFloor: [330, 1470] };

/* The dorm: the set on a paper camera; on the puppets' plane, back to front: the door, Mia's bed (with her slot under
   the duvet), the floor's slot for Jess on her feet, Jess's bed (with her slot), the dark over everything, then the
   phone's glow (cool light around the phone, wherever Jess holds it). */
function dormRoom(p, v0 = {}) {
  const cam = paperCam(p, 'dorm', v0);
  const door = dormDoor(cam.stage);
  const miaBedG = mk('g', { transform: `translate(${MIA_BED.x},${MIA_BED.y}) scale(${MIA_BED.s})` }, cam.stage);
  const miaBed = dormBed(miaBedG, 0, 0, { w: MIA_BED.w, duvet: '#47506e', duvetFar: '#373f5a' });
  const mia = miaPuppet(miaBed.slot); miaBed.dv.parentNode.appendChild(miaBed.dv);
  const floorSlot = mk('g', {}, cam.stage);
  const jessBedG = mk('g', { transform: `translate(${JESS_BED.x},${JESS_BED.y}) scale(${JESS_BED.s})` }, cam.stage);
  const jessBed = dormBed(jessBedG, 0, 0, { w: JESS_BED.w, duvet: '#5b6a8f', duvetFar: '#4a5878' });
  const jess = jessPuppet(jessBed.slot); jessBed.dv.parentNode.appendChild(jessBed.dv);
  const dark = mk('rect', { x: -400, y: -400, width: 1700, height: 2500, fill: '#04060d', opacity: .42, 'pointer-events': 'none' }, cam.stage);
  const glowG = mk('g', { 'pointer-events': 'none' }, cam.stage);
  glowG.innerHTML = `<defs><radialGradient id="phoneGlow"><stop offset="0" stop-color="#a8c8ff" stop-opacity=".42"/><stop offset=".45" stop-color="#7fa6ee" stop-opacity=".14"/><stop offset="1" stop-color="#7fa6ee" stop-opacity="0"/></radialGradient></defs>`;
  const glow = mk('circle', { r: 340, fill: 'url(#phoneGlow)' }, glowG);
  return { cam, door, miaBed, mia, floorSlot, jessBed, jess, dark, glow,
    // where Jess's phone is in the world: her held phone, through her bed's group when she is in it
    light(x, y, k = 1) { glow.setAttribute('cx', x.toFixed(1)); glow.setAttribute('cy', y.toFixed(1)); glow.setAttribute('opacity', k.toFixed(2)); } };
}
// world point of a point given in a bed group's own coordinates
const inBed = (B, [x, y]) => [B.x + x * B.s, B.y + y * B.s];
