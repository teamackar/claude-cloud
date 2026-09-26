// How It Works overlay: leader lines, distance arrow and cutout markers drawn
// in SVG over the illustration, with the HTML callouts placed to match.
//
// CONFIG is the single place to correct positions. All values are
// percentages of the image box (x of its width, y of its height).
//   grilles: centre (x, y), trim-ring width (w), trim-ring top and bottom (top, bottom)
//   labels:  where each label's box sits. align "end" puts its right edge at x,
//            "start" its left edge; y is the label's bottom edge; w its max width.
//   spacing: t is where along the centre-to-centre line its label sits (0 to 1).
//   cutout:  offset is the gap between the ring's bottom and the marker line;
//            labelGap the gap between the line and "200 mm cutout".
var CONFIG = {
  wide: {
    grilles: {
      active: { x: 28.6, y: 65.5, w: 13.2, top: 60.7, bottom: 70.3 },
      passive: { x: 81.0, y: 67.7, w: 12.4, top: 63.0, bottom: 72.5 }
    },
    labels: {
      active: { x: 30.5, y: 51.5, w: 26, align: 'end' }, // above and left; y keeps the description off the band at wide widths
      passive: { x: 88, y: 58.5, w: 26, align: 'end' }  // above; not right, the window is there. x and y keep the description clear of the ceiling band
    },
    spacing: { t: 0.5 },
    cutout: { offset: 1.6, labelGap: 0.9 }
  },
  portrait: {
    grilles: {
      active: { x: 25.5, y: 49.2, w: 19.2, top: 45.3, bottom: 53.2 },
      // Brief gave w 15.9 (the grille face); the trim ring, which the other
      // three widths measure, is 18.3.
      passive: { x: 73.7, y: 69.7, w: 18.3, top: 66.0, bottom: 73.5 }
    },
    labels: {
      active: { x: 5, y: 40, w: 56, align: 'start' },    // above and left; wide enough for two lines at 360px
      passive: { x: 95, y: 54, w: 48, align: 'end' }     // above and right
    },
    spacing: { t: 0.55 },
    cutout: { offset: 1.4, labelGap: 0.7 }
  }
};

// Drawing sizes in CSS pixels, converted to the % viewBox at draw time so
// they stay the same size at every width.
var DOT_R = 2.5;
var ARROW_LEN = 7;
var ARROW_SPREAD = 0.45; // radians either side of the line
var TICK = 4;            // half-height of the cutout end ticks
var LEADER_GAP = 6;      // space between a leader's top and its label
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

    // 1. Leader lines and labels
    ['active', 'passive'].forEach(function (id) {
      var g = cfg.grilles[id], l = cfg.labels[id], node = el(id);
      set(node, { x: l.x, y: l.y, w: l.w });
      node.setAttribute('data-align', l.align);
      dot(g.x, g.top);
      line(g.x, g.top, g.x, l.y + py(LEADER_GAP));
    });

    // 3. Distance arrow, centre to centre, broken around its label
    var a = cfg.grilles.active, b = cfg.grilles.passive;
    var ax = a.x * W / 100, ay = a.y * H / 100, bx = b.x * W / 100, by = b.y * H / 100;
    var t = cfg.spacing.t;
    var spacing = el('spacing');
    set(spacing, { x: f(a.x + (b.x - a.x) * t), y: f(a.y + (b.y - a.y) * t) });

    var box = spacing.getBoundingClientRect(), cbox = canvas.getBoundingClientRect();
    var rx0 = box.left - cbox.left - LABEL_PAD, rx1 = box.right - cbox.left + LABEL_PAD;
    var ry0 = box.top - cbox.top - LABEL_PAD, ry1 = box.bottom - cbox.top + LABEL_PAD;
    // Where the centre line enters and leaves the label box (Liang-Barsky)
    var dx = bx - ax, dy = by - ay, t0 = 0, t1 = 1, clipped = true;
    [[-dx, ax - rx0], [dx, rx1 - ax], [-dy, ay - ry0], [dy, ry1 - ay]].forEach(function (pq) {
      var p = pq[0], q = pq[1];
      if (p === 0) { if (q < 0) clipped = false; return; }
      var r = q / p;
      if (p < 0) { if (r > t0) t0 = r; } else if (r < t1) t1 = r;
    });
    if (clipped && t0 < t1) {
      line(a.x, a.y, px(ax + dx * t0), py(ay + dy * t0));
      line(px(ax + dx * t1), py(ay + dy * t1), b.x, b.y);
    } else {
      line(a.x, a.y, b.x, b.y);
    }
    var ang = Math.atan2(dy, dx);
    [[ax, ay, ang], [bx, by, ang + Math.PI]].forEach(function (tip) {
      var x = tip[0], y = tip[1], th = tip[2];
      var p1 = [x + ARROW_LEN * Math.cos(th - ARROW_SPREAD), y + ARROW_LEN * Math.sin(th - ARROW_SPREAD)];
      var p2 = [x + ARROW_LEN * Math.cos(th + ARROW_SPREAD), y + ARROW_LEN * Math.sin(th + ARROW_SPREAD)];
      parts.push('<polyline class="hiw-stroke" points="' +
        f(px(p1[0])) + ',' + f(py(p1[1])) + ' ' + f(px(x)) + ',' + f(py(y)) + ' ' + f(px(p2[0])) + ',' + f(py(p2[1])) + '"/>');
    });

    // 4. Cutout markers under each grille, spanning the trim ring
    ['active', 'passive'].forEach(function (id) {
      var g = cfg.grilles[id];
      var y = g.bottom + cfg.cutout.offset, x0 = g.x - g.w / 2, x1 = g.x + g.w / 2;
      line(x0, y, x1, y);
      line(x0, y - py(TICK), x0, y + py(TICK));
      line(x1, y - py(TICK), x1, y + py(TICK));
      set(el('cutout-' + id), { x: g.x, y: f(y + cfg.cutout.labelGap) });
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
