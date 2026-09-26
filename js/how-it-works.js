// How It Works overlay: leader lines, distance arrow and cutout markers drawn
// in SVG over the illustration, with the HTML callouts placed to match.
//
// Mirrored arrangement, following the ceiling's S-curve:
//   active speaker:  cutout marker above, label below
//   passive speaker: label above, cutout marker below
// which leaves the middle clear for the distance arrow.
//
// CONFIG is the single place to correct positions. All values are
// percentages of the image box (x of its width, y of its height).
//   grilles: centre (x, y), trim-ring width (w), trim-ring top and bottom.
//   labels:  side "above" or "below" the speaker. align "start" puts the
//            label's left edge at x, "end" its right edge. y is the edge
//            nearest the speaker (bottom when above, top when below). w is
//            the label's max width.
//   cutouts: side "above" or "below"; offset is the gap between the ring and
//            the marker line, labelGap the gap between the line and its text.
//   spacing: t is where its label sits along the arrow (0 to 1).
// Positions were tuned against a contrast map of each image so text stays
// off the ceiling band and the lower ceiling edge.
var CONFIG = {
  wide: {
    grilles: {
      active: { x: 28.6, y: 65.5, w: 13.2, top: 60.7, bottom: 70.3 },
      passive: { x: 81.0, y: 67.7, w: 12.4, top: 63.0, bottom: 72.5 }
    },
    labels: {
      active: { side: 'below', x: 27, y: 73, w: 40, align: 'start' }, // wide enough for a one-line description at 768, clear of the lower ceiling edge
      passive: { side: 'above', x: 88, y: 58.5, w: 26, align: 'end' } // not to the right: the window is there
    },
    cutouts: {
      active: { side: 'above', offset: 0.9, labelGap: 0.5 },
      passive: { side: 'below', offset: 1.6, labelGap: 0.9 }
    },
    spacing: { t: 0.5 }
  },
  portrait: {
    grilles: {
      active: { x: 25.5, y: 49.2, w: 19.2, top: 45.3, bottom: 53.2 },
      // Brief gave w 15.9 (the grille face); the trim ring, which the other
      // three widths measure, is 18.3.
      passive: { x: 73.7, y: 69.7, w: 18.3, top: 66.0, bottom: 73.5 }
    },
    labels: {
      active: { side: 'below', x: 3, y: 56, w: 40, align: 'start' },
      passive: { side: 'above', x: 95, y: 57, w: 48, align: 'end' }
    },
    cutouts: {
      active: { side: 'above', offset: 1.0, labelGap: 0.5 },
      passive: { side: 'below', offset: 1.4, labelGap: 0.7 }
    },
    spacing: { t: 0.6 }
  }
};

// Drawing sizes in CSS pixels, converted to the % viewBox at draw time so
// they stay the same size at every width.
var DOT_R = 2.5;
var ARROW_LEN = 7;
var ARROW_SPREAD = 0.45; // radians either side of the line
var ARROW_GAP = 3;       // space between an arrow tip and the trim ring
var TICK = 4;            // half-height of the cutout end ticks
var LEADER_GAP = 6;      // space between a leader's end and its label
var LABEL_PAD = 6;       // space the distance line leaves around its label

(function () {
  var section = document.querySelector('.how-it-works');
  if (!section) return;
  var canvas = section.querySelector('.hiw-canvas');
  var img = section.querySelector('.hiw-img');
  var svg = section.querySelector('.hiw-overlay');
  var callouts = section.querySelector('.hiw-callouts');
  if (!canvas || !img || !svg || !callouts) return;

  var el = function (name) { return callouts.querySelector('[data-callout="' + name + '"]'); };
  var set = function (node, vars) { for (var k in vars) node.style.setProperty('--' + k, vars[k]); };
  var f = function (n) { return Math.round(n * 1000) / 1000; };

  function ready() { return img.complete && img.naturalWidth > 0; }

  function draw() {
    if (!ready()) return;
    var cfg = CONFIG[img.naturalWidth >= img.naturalHeight ? 'wide' : 'portrait'];
    section.classList.add('is-overlaid');
    section.classList.remove('is-image-failed');

    var W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    var px = function (x) { return x / W * 100; };  // px -> % of width
    var py = function (y) { return y / H * 100; };  // px -> % of height
    var parts = [];
    var line = function (x1, y1, x2, y2) {
      parts.push('<line class="hiw-stroke" x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '"/>');
    };
    var dot = function (x, y) {
      parts.push('<ellipse class="hiw-fill" cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(px(DOT_R)) + '" ry="' + f(py(DOT_R)) + '"/>');
    };

    // Leader lines and labels: dot on the ring edge facing the label, line to the label
    ['active', 'passive'].forEach(function (id) {
      var g = cfg.grilles[id], l = cfg.labels[id], node = el(id);
      set(node, { x: l.x, y: l.y, w: l.w });
      node.setAttribute('data-align', l.align);
      node.setAttribute('data-side', l.side);
      if (l.side === 'below') {
        dot(g.x, g.bottom);
        line(g.x, g.bottom, g.x, l.y - py(LEADER_GAP));
      } else {
        dot(g.x, g.top);
        line(g.x, g.top, g.x, l.y + py(LEADER_GAP));
      }
    });

    // Distance arrow: aimed centre to centre, but stopping at each trim ring
    var a = cfg.grilles.active, b = cfg.grilles.passive;
    var ring = function (g) {   // ring as an ellipse, in px
      return { cx: g.x * W / 100, cy: (g.top + g.bottom) / 2 * H / 100, rx: g.w / 2 * W / 100, ry: (g.bottom - g.top) / 2 * H / 100 };
    };
    var ra = ring(a), rb = ring(b);
    var dx = rb.cx - ra.cx, dy = rb.cy - ra.cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    var exit = function (r) { return 1 / Math.sqrt(Math.pow(ux / r.rx, 2) + Math.pow(uy / r.ry, 2)); };
    var ta = exit(ra) + ARROW_GAP, tb = exit(rb) + ARROW_GAP;
    var ax = ra.cx + ux * ta, ay = ra.cy + uy * ta;       // start, just outside the active ring
    var bx = rb.cx - ux * tb, by = rb.cy - uy * tb;       // end, just outside the passive ring

    var t = cfg.spacing.t, spacing = el('spacing');
    set(spacing, { x: f(px(ax + (bx - ax) * t)), y: f(py(ay + (by - ay) * t)) });

    var box = spacing.getBoundingClientRect(), cbox = canvas.getBoundingClientRect();
    var rx0 = box.left - cbox.left - LABEL_PAD, rx1 = box.right - cbox.left + LABEL_PAD;
    var ry0 = box.top - cbox.top - LABEL_PAD, ry1 = box.bottom - cbox.top + LABEL_PAD;
    // Where the arrow enters and leaves the label box (Liang-Barsky)
    var sx = bx - ax, sy = by - ay, t0 = 0, t1 = 1, clipped = true;
    [[-sx, ax - rx0], [sx, rx1 - ax], [-sy, ay - ry0], [sy, ry1 - ay]].forEach(function (pq) {
      var p = pq[0], q = pq[1];
      if (p === 0) { if (q < 0) clipped = false; return; }
      var r = q / p;
      if (p < 0) { if (r > t0) t0 = r; } else if (r < t1) t1 = r;
    });
    if (clipped && t0 < t1) {
      line(px(ax), py(ay), px(ax + sx * t0), py(ay + sy * t0));
      line(px(ax + sx * t1), py(ay + sy * t1), px(bx), py(by));
    } else {
      line(px(ax), py(ay), px(bx), py(by));
    }
    var ang = Math.atan2(sy, sx);
    [[ax, ay, ang], [bx, by, ang + Math.PI]].forEach(function (tip) {
      var x = tip[0], y = tip[1], th = tip[2];
      var p1 = [x + ARROW_LEN * Math.cos(th - ARROW_SPREAD), y + ARROW_LEN * Math.sin(th - ARROW_SPREAD)];
      var p2 = [x + ARROW_LEN * Math.cos(th + ARROW_SPREAD), y + ARROW_LEN * Math.sin(th + ARROW_SPREAD)];
      parts.push('<polyline class="hiw-stroke" points="' +
        f(px(p1[0])) + ',' + f(py(p1[1])) + ' ' + f(px(x)) + ',' + f(py(y)) + ' ' + f(px(p2[0])) + ',' + f(py(p2[1])) + '"/>');
    });

    // Cutout markers: a line spanning the trim ring, above or below it
    ['active', 'passive'].forEach(function (id) {
      var g = cfg.grilles[id], c = cfg.cutouts[id], node = el('cutout-' + id);
      var above = c.side === 'above';
      var y = above ? g.top - c.offset : g.bottom + c.offset;
      var x0 = g.x - g.w / 2, x1 = g.x + g.w / 2;
      line(x0, y, x1, y);
      line(x0, y - py(TICK), x0, y + py(TICK));
      line(x1, y - py(TICK), x1, y + py(TICK));
      node.setAttribute('data-side', c.side);
      set(node, { x: g.x, y: f(above ? y - c.labelGap : y + c.labelGap) });
    });

    svg.innerHTML = parts.join('');
  }

  function fail() {
    section.classList.remove('is-overlaid');
    section.classList.add('is-image-failed');
    svg.innerHTML = '';
  }

  img.addEventListener('load', draw);   // also fires when the <picture> source switches at 768px
  img.addEventListener('error', fail);
  if (ready()) draw();
  else if (img.complete) fail();        // already finished loading, but with nothing to show

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { if (section.classList.contains('is-overlaid')) draw(); });
    ro.observe(canvas);
    ro.observe(el('spacing'));           // web font arriving changes the label's width
  }
  // Label text edited in place later (data-editable tooling) changes label sizes.
  new MutationObserver(function () { if (section.classList.contains('is-overlaid')) draw(); })
    .observe(callouts, { subtree: true, childList: true, characterData: true });
})();
