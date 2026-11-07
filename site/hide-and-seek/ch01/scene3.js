'use strict'; const PRE3 = .2;  function scene3(p, D) { const R = bedroom(p); stopClock(D, (q, f) => R.cam.apply(q, f)); }
