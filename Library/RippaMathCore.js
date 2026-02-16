/**
 * RippaMathCore.js — A p5.js-based math visualization library
 * 
 * Classes:
 *   RippaMathCore.NumberLine      — Interactive number line (basic, snap, zoom, negative, animations)
 *   RippaMathCore.DecimalCounter  — Decimal counting with arches & formula
 *   RippaMathCore.AbsoluteValue   — Absolute value visualization with draggable marker
 *   RippaMathCore.DistanceBetween — Distance between two points with optional animated calculation
 *   RippaMathCore.CoordinateGrid  — 2D coordinate grid with animated intro
 *   RippaMathCore.Coordinate3D    — 3D coordinate system with camera orbit
 *   RippaMathCore.AngleExplorer   — Interactive angle teaching tool with naming, types & snap
 *
 * Mobile & Touch:
 *   All classes support touch drag, tap, and pinch-to-zoom on mobile devices.
 *   Hit areas and UI elements auto-scale for finger-friendly interaction.
 *   Layouts adapt responsively to small screens.
 *
 * Usage:
 *   <script src="https://cdn.jsdelivr.net/npm/p5@1/lib/p5.min.js"></script>
 *   <script src="RippaMathCore.js"></script>
 *   <script>
 *     let nl;
 *     function setup() {
 *       createCanvas(800, 400);
 *       nl = new RippaMathCore.NumberLine({ min: -10, max: 10, interactive: true });
 *     }
 *     function draw() { background(240); nl.draw(); }
 *     function mousePressed()  { nl.mousePressed(); }
 *     function mouseReleased() { nl.mouseReleased(); }
 *     function keyPressed()    { nl.keyPressed(); }
 *     function mouseWheel(e)   { return nl.mouseWheel(e); }
 *   </script>
 */
(function () {
  "use strict";

  var RippaMathCore = {};

  // ============================================================
  // Shared Utilities
  // ============================================================

  /** Detect touch device */
  var _isTouch = (typeof window !== "undefined") &&
    (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

  /** Detect mobile-sized viewport */
  function isMobile() {
    return (typeof width !== "undefined" && width < 500) || (typeof window !== "undefined" && window.innerWidth < 600);
  }

  /** Get touch-scaled hit radius (bigger on touch devices) */
  function hitR(base) {
    return _isTouch ? Math.max(base * 1.6, 30) : base;
  }

  /** Get responsive padding for axis edges */
  function axisPad() {
    if (typeof width === "undefined") return 80;
    if (width < 400) return 30;
    if (width < 600) return 50;
    return 80;
  }

  /** Easing: ease-in-out cubic */
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Easing: ease-out bounce */
  function easeOutBounce(t) {
    var n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }

  /** Round to step */
  function roundTo(v, s) { return Math.round(v / s) * s; }

  /** Nearly equal */
  function nearlyEqual(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-9); }

  /** Format one decimal */
  function formatDec(v) {
    var s = (Math.abs(v) < 1e-9 ? 0 : v).toFixed(1);
    return s;
  }

  /** Represent value in tenths for safe comparison */
  function toTenthInt(v) { return Math.round(v * 10); }

  /** Clamp */
  function clampVal(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

  /** Responsive text size */
  function rTextSize(base) {
    if (typeof width === "undefined") return base;
    if (width < 400) return Math.max(base * 0.65, 8);
    if (width < 600) return base * 0.8;
    return base;
  }

  /** Draw a simple arrow-head on the axis */
  function drawAxisArrow(x, y, dir) {
    push();
    translate(x, y);
    noStroke();
    fill(40);
    var sz = 10;
    triangle(dir * 0, 0, dir * -sz, -sz / 1.2, dir * -sz, sz / 1.2);
    pop();
  }

  /** Draw a canvas button and return true if hovered/touched */
  function drawButton(btn, label, fg, bg, bgHover, borderColor) {
    var hover = mouseX >= btn.x && mouseX <= btn.x + btn.w &&
                mouseY >= btn.y && mouseY <= btn.y + btn.h;
    stroke(borderColor || fg);
    strokeWeight(2);
    fill(hover ? (bgHover || 245) : (bg || 255));
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();
    fill(fg || 30);
    textSize(btn.fontSize || rTextSize(15));
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
    return hover;
  }

  /** Check if mouse/touch is inside a button rect (with extra padding on touch) */
  function insideBtn(btn) {
    var pad = _isTouch ? 6 : 0;
    return mouseX >= btn.x - pad && mouseX <= btn.x + btn.w + pad &&
           mouseY >= btn.y - pad && mouseY <= btn.y + btn.h + pad;
  }

  /** Merge user options onto defaults */
  function mergeOpts(defaults, opts) {
    var result = {};
    for (var k in defaults) result[k] = defaults[k];
    if (opts) { for (var k2 in opts) result[k2] = opts[k2]; }
    return result;
  }

  // ============================================================
  // Pinch-to-Zoom Helper (shared by classes that support zoom)
  // ============================================================
  function PinchHelper() {
    this._pinching = false;
    this._lastPinchDist = 0;
    this._pinchCenterX = 0;
    this._pinchCenterY = 0;
  }
  PinchHelper.prototype = {
    update: function () {
      if (typeof touches === "undefined" || !Array.isArray(touches) || touches.length < 2) {
        this._pinching = false;
        return null;
      }
      var t0 = touches[0], t1 = touches[1];
      var d = dist(t0.x, t0.y, t1.x, t1.y);
      var cx = (t0.x + t1.x) / 2;
      var cy = (t0.y + t1.y) / 2;
      if (!this._pinching) {
        this._pinching = true;
        this._lastPinchDist = d;
        this._pinchCenterX = cx;
        this._pinchCenterY = cy;
        return null;
      }
      var delta = this._lastPinchDist - d;
      this._lastPinchDist = d;
      this._pinchCenterX = cx;
      this._pinchCenterY = cy;
      return { delta: delta * 3, centerX: cx, centerY: cy };
    },
    reset: function () { this._pinching = false; }
  };

  // ============================================================
  // RippaMathCore.NumberLine  (sketches 1–6)
  // ============================================================
  RippaMathCore.NumberLine = function (opts) {
    var defaults = {
      min: 0, max: 10,
      tickSpacing: 1, subTickSpacing: 0.1,
      interactive: false,
      snap: false,
      zoom: false,
      showArrow: false,
      animations: false,
      axisY: null,
      axisStartX: null, axisEndX: null
    };
    this.o = mergeOpts(defaults, opts);
    this._dotX = null;
    this._isDragging = false;
    this._snapToTick = this.o.snap;
    this._viewScale = 1;
    this._viewOffsetX = 0;
    this._viewOffsetY = 0;
    this._particles = [];
    this._sparkleRadius = 0;
    this._isAnimating = false;
    this._lastIntVal = null;
    this._pinch = new PinchHelper();
  };

  RippaMathCore.NumberLine.prototype = {
    _getAxisY: function () { return this.o.axisY || (height * 0.67); },
    _getStartX: function () {
      if (this.o.axisStartX !== null) return this.o.axisStartX;
      return axisPad();
    },
    _getEndX: function () {
      if (this.o.axisEndX !== null) return this.o.axisEndX;
      return width - axisPad();
    },

    _valueToX: function (v) {
      return map(v, this.o.min, this.o.max, this._getStartX(), this._getEndX());
    },
    _xToValue: function (x) {
      return map(x, this._getStartX(), this._getEndX(), this.o.min, this.o.max);
    },
    _worldMouseX: function () {
      if (!this.o.zoom) return mouseX;
      return (mouseX - this._viewOffsetX) / this._viewScale;
    },
    _worldMouseY: function () {
      if (!this.o.zoom) return mouseY;
      return (mouseY - this._viewOffsetY) / this._viewScale;
    },

    getValue: function () {
      if (this._dotX === null) return this.o.min;
      return this._xToValue(this._dotX);
    },

    setValue: function (v) {
      this._dotX = this._valueToX(clampVal(v, this.o.min, this.o.max));
    },

    draw: function () {
      var axY = this._getAxisY();
      var sX = this._getStartX();
      var eX = this._getEndX();

      if (this.o.interactive && this._dotX === null) {
        this._dotX = map((this.o.min + this.o.max) / 2, this.o.min, this.o.max, sX, eX);
      }

      // Handle pinch-to-zoom on touch
      if (this.o.zoom && _isTouch) {
        var pinch = this._pinch.update();
        if (pinch) {
          this.mouseWheel({ delta: pinch.delta });
        }
      }

      push();
      if (this.o.zoom) {
        translate(this._viewOffsetX, this._viewOffsetY);
        scale(this._viewScale);
      }

      stroke(50); strokeWeight(2);
      line(sX, axY, eX, axY);

      if (this.o.subTickSpacing && this.o.subTickSpacing < this.o.tickSpacing) {
        var nSub = (this.o.max - this.o.min) / this.o.subTickSpacing;
        for (var i = 0; i <= nSub; i++) {
          var sv = this.o.min + i * this.o.subTickSpacing;
          if (Math.abs(sv % this.o.tickSpacing) > 0.001) {
            var sx = this._valueToX(sv);
            stroke(150); strokeWeight(1);
            line(sx, axY - 5, sx, axY + 5);
          }
        }
      }

      var nTicks = (this.o.max - this.o.min) / this.o.tickSpacing + 1;
      for (var j = 0; j < nTicks; j++) {
        var tv = this.o.min + j * this.o.tickSpacing;
        var tx = this._valueToX(tv);
        stroke(50); strokeWeight(2);
        line(tx, axY - 15, tx, axY + 15);
        noStroke(); fill(50); textSize(rTextSize(14)); textAlign(CENTER, CENTER);
        text(tv, tx, axY + 35);
      }

      if (this.o.interactive) {
        this._updateDot();
        if (this.o.showArrow) {
          this._drawArrowMarker();
        } else {
          noStroke(); fill(50, 150, 255);
          circle(this._dotX, axY, _isTouch ? 28 : 20);
        }
        this._displayValue();
      }

      if (this.o.animations) {
        this._updateAnimations();
        this._drawAnimations();
      }

      pop();

      if (this.o.interactive && this.o.snap !== undefined) {
        this._drawModeIndicator();
      }
    },

    _updateDot: function () {
      if (!this._isDragging) return;
      var mx = this._worldMouseX();
      var newX = constrain(mx, this._getStartX(), this._getEndX());
      if (this._snapToTick) {
        var v = this._xToValue(newX);
        var sv = round(v / this.o.tickSpacing) * this.o.tickSpacing;
        this._dotX = this._valueToX(sv);
      } else {
        this._dotX = newX;
      }
      if (this.o.animations) this._checkIntegerLanding();
    },

    _checkIntegerLanding: function () {
      var cv = this.getValue();
      var ci = round(cv);
      if (Math.abs(cv - ci) < 0.01 && ci !== this._lastIntVal) {
        this._triggerAnimation();
        this._lastIntVal = ci;
      }
    },

    _triggerAnimation: function () {
      this._isAnimating = true;
      this._sparkleRadius = 0;
      this._particles = [];
      var axY = this._getAxisY();
      for (var i = 0; i < 20; i++) {
        this._particles.push({
          x: this._dotX, y: axY - 40,
          vx: random(-3, 3), vy: random(-5, -2),
          c: color(random(255), random(255), random(255)),
          sz: random(5, 10), life: 30
        });
      }
    },

    _updateAnimations: function () {
      if (!this._isAnimating) return;
      this._sparkleRadius += 3;
      if (this._sparkleRadius > 80) this._sparkleRadius = 0;
      for (var i = this._particles.length - 1; i >= 0; i--) {
        var p = this._particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--;
        if (p.life <= 0) this._particles.splice(i, 1);
      }
      if (this._particles.length === 0 && this._sparkleRadius === 0) {
        this._isAnimating = false;
        this._lastIntVal = null;
      }
    },

    _drawAnimations: function () {
      if (!this._isAnimating) return;
      var axY = this._getAxisY();
      if (this._sparkleRadius > 0) {
        push(); translate(this._dotX, axY - 40);
        var al = map(this._sparkleRadius, 0, 80, 255, 0);
        noFill(); stroke(255, 200, 0, al); strokeWeight(3);
        circle(0, 0, this._sparkleRadius * 2);
        for (var i = 0; i < 8; i++) {
          var a = (TWO_PI / 8) * i;
          stroke(255, 255, 0, al); strokeWeight(2);
          line(cos(a) * this._sparkleRadius, sin(a) * this._sparkleRadius,
               cos(a) * (this._sparkleRadius + 10), sin(a) * (this._sparkleRadius + 10));
        }
        pop();
      }
      for (var j = 0; j < this._particles.length; j++) {
        var pp = this._particles[j];
        fill(pp.c); noStroke(); circle(pp.x, pp.y, pp.sz);
      }
    },

    _drawArrowMarker: function () {
      var axY = this._getAxisY();
      var sc = isMobile() ? 0.85 : 1;
      var tipY = axY, headH = 18 * sc, headHW = 14 * sc, shaftH = 55 * sc, shaftW = 6 * sc;
      var topY = tipY - headH - shaftH;
      var sbY = tipY - headH;
      noStroke(); fill(50, 150, 255); rectMode(CENTER);
      rect(this._dotX, (topY + sbY) / 2, shaftW, shaftH, 3);
      stroke(30, 100, 200); strokeWeight(2); fill(50, 150, 255);
      triangle(this._dotX, tipY, this._dotX - headHW, sbY, this._dotX + headHW, sbY);
      rectMode(CORNER);
    },

    _displayValue: function () {
      var v = this.getValue();
      var sgn = v < 0 ? "-" : "";
      var av = Math.abs(v);
      var ip = Math.floor(av);
      var dp = (av - ip).toFixed(2).substring(2);

      textAlign(CENTER, CENTER);
      var bigSize = rTextSize(28);
      var smallSize = rTextSize(20);
      textSize(bigSize); textStyle(BOLD);
      var iText = sgn + ip.toString();
      var iW = textWidth(iText);
      textSize(smallSize); textStyle(NORMAL);
      var dText = "." + dp;
      var dW = textWidth(dText);
      var tW = iW + dW;
      var axY = this._getAxisY();
      var sX = this._dotX - tW / 2;

      fill(30, 50, 100); noStroke();
      textSize(bigSize); textStyle(BOLD);
      text(iText, sX + iW / 2, axY - 120);
      fill(100, 120, 150); textSize(smallSize); textStyle(NORMAL);
      text(dText, sX + iW + dW / 2, axY - 120);
    },

    _drawModeIndicator: function () {
      fill(50); noStroke(); textSize(rTextSize(14)); textStyle(NORMAL); textAlign(LEFT, TOP);
      text("Mode: " + (this._snapToTick ? "SNAP" : "SMOOTH"), 12, 12);
      if (!_isTouch) {
        text("(Press SPACE to toggle)", 12, 30);
      } else {
        // On mobile, draw a toggle button for snap mode
        var btn = { x: 12, y: 34, w: 100, h: 32 };
        drawButton(btn, this._snapToTick ? "Snap: ON" : "Snap: OFF",
          color(50), color(240), color(220), color(100));
        this._snapToggleBtn = btn;
      }
    },

    mousePressed: function () {
      if (!this.o.interactive) return;
      // Check snap toggle button on touch
      if (_isTouch && this._snapToggleBtn && insideBtn(this._snapToggleBtn)) {
        this._snapToTick = !this._snapToTick;
        return;
      }
      var mx = this._worldMouseX(), my = this._worldMouseY();
      var axY = this._getAxisY();
      var hr = hitR(20);
      if (this.o.showArrow) {
        var tipY = axY, headH = 18, headHW = 14, shaftH = 55;
        var topY = tipY - headH - shaftH;
        var extra = _isTouch ? 16 : 6;
        var lx = this._dotX - Math.max(headHW, 6) - extra;
        var rx = this._dotX + Math.max(headHW, 6) + extra;
        if (mx >= lx && mx <= rx && my >= topY - extra && my <= tipY + extra) this._isDragging = true;
      } else {
        if (dist(mx, my, this._dotX, axY) < hr) this._isDragging = true;
      }
    },

    mouseReleased: function () {
      this._isDragging = false;
      this._pinch.reset();
    },

    keyPressed: function () {
      if (key === ' ') this._snapToTick = !this._snapToTick;
    },

    mouseWheel: function (event) {
      if (!this.o.zoom) return;
      var oldS = this._viewScale;
      var zf = Math.exp(-event.delta * 0.0015);
      var newS = constrain(oldS * zf, 0.4, 6);
      if (newS === oldS) return false;
      var wx = (mouseX - this._viewOffsetX) / oldS;
      var wy = (mouseY - this._viewOffsetY) / oldS;
      this._viewScale = newS;
      this._viewOffsetX = mouseX - wx * newS;
      this._viewOffsetY = mouseY - wy * newS;
      return false;
    }
  };

  // ============================================================
  // RippaMathCore.DecimalCounter  (sketch 7)
  // ============================================================
  RippaMathCore.DecimalCounter = function (opts) {
    var defaults = {
      step: 0.1, showFormula: true, showArches: true,
      maxSteps: 40
    };
    this.o = mergeOpts(defaults, opts);
    this._leftVal = 14; this._rightVal = 16;
    this._targetA = 14.2;
    this._aValue = 14;
    this._dragFrom = null; this._isDragging = false;
    this._tryBtn = { x: 20, y: 20, w: 90, h: 40 };
    this._axisY = 0; this._axisStartX = 0; this._axisEndX = 0;
    this._inited = false;
  };

  RippaMathCore.DecimalCounter.prototype = {
    _layout: function () {
      this._axisY = height * 0.55;
      var pad = axisPad() + 30;
      this._axisStartX = pad;
      this._axisEndX = width - pad;
    },
    _valToX: function (v) { return map(v, this._leftVal, this._rightVal, this._axisStartX, this._axisEndX); },
    _xToVal: function (x) { return map(x, this._axisStartX, this._axisEndX, this._leftVal, this._rightVal); },

    newRound: function () {
      var base = Math.floor(random(5, 21));
      var span = random() < 0.6 ? 2 : 1;
      this._leftVal = base; this._rightVal = base + span;
      var minI = 1, maxI = Math.round((this._rightVal - this._leftVal) / this.o.step) - 1;
      var k = Math.floor(random(minI, maxI + 1));
      this._targetA = roundTo(this._leftVal + k * this.o.step, this.o.step);
      this._dragFrom = null; this._isDragging = false; this._aValue = this._leftVal;
    },

    draw: function () {
      if (!this._inited) { this._layout(); this.newRound(); this._inited = true; }
      else this._layout();

      var axY = this._axisY, sX = this._axisStartX, eX = this._axisEndX;
      var lX = this._valToX(this._leftVal), rX = this._valToX(this._rightVal);
      var mob = isMobile();

      noStroke(); fill(40); textSize(rTextSize(18)); textAlign(CENTER, CENTER);
      text(mob ? "Find the value of a" : "Use the points on the ends of the number line to find the value of a", width / 2, 40);

      drawButton(this._tryBtn, "Try", color(30), color(255), color(245), color(40));

      stroke(40); strokeWeight(3);
      line(sX, axY, eX, axY);
      drawAxisArrow(sX, axY, -1);
      drawAxisArrow(eX, axY, 1);

      var total = this._rightVal - this._leftVal;
      var n = Math.round(total / this.o.step);
      for (var i = 0; i <= n; i++) {
        var v = roundTo(this._leftVal + i * this.o.step, this.o.step);
        var x = this._valToX(v);
        var isInt = nearlyEqual(v, Math.round(v));
        stroke(30); strokeWeight(isInt ? 3 : 2);
        var h = isInt ? 18 : 8;
        line(x, axY - h / 2, x, axY + h);
      }
      noStroke(); fill(60); textSize(rTextSize(16)); textAlign(CENTER, CENTER);
      text(this._leftVal, lX, axY + 48);
      text(this._rightVal, rX, axY + 48);

      this._drawEndpoint(lX, axY, this._leftVal.toString());
      this._drawEndpoint(rX, axY, this._rightVal.toString());

      if (this.o.showArches && this._dragFrom) {
        var startV = this._dragFrom === "left" ? this._leftVal : this._rightVal;
        this._drawArches(startV, this._aValue);
      }

      var ax = this._valToX(this._aValue);
      fill(60, 120, 240); noStroke(); ellipse(ax, axY, _isTouch ? 20 : 14, _isTouch ? 20 : 14);
      fill(40, 90, 210); textSize(rTextSize(18)); textStyle(ITALIC); textAlign(CENTER, CENTER);
      text("a", ax, axY + 26); textStyle(NORMAL);
      fill(230, 40, 120); textSize(rTextSize(18)); textStyle(BOLD);
      text("a = " + formatDec(this._aValue), ax, axY - 56); textStyle(NORMAL);

      if (this.o.showFormula && this._dragFrom) {
        var sv = this._dragFrom === "left" ? this._leftVal : this._rightVal;
        var steps = this._dragFrom === "left"
          ? Math.max(0, toTenthInt(this._aValue) - toTenthInt(sv))
          : Math.max(0, toTenthInt(sv) - toTenthInt(this._aValue));
        var op = this._dragFrom === "left" ? "+" : "-";
        var formula = sv + " " + op + " 0.1 \u00d7 " + steps + " = " + formatDec(this._aValue);
        noStroke(); fill(30, 60, 140); textSize(rTextSize(16)); textAlign(CENTER, CENTER);
        text(formula, width / 2, axY + 88);
      }

      if (toTenthInt(this._aValue) === toTenthInt(this._targetA)) {
        noStroke(); fill(40, 90, 210); textSize(rTextSize(22)); textStyle(BOLD); textAlign(CENTER, CENTER);
        text("Correct!  a = " + formatDec(this._targetA), width / 2, axY + 120);
        textStyle(NORMAL);
      }
    },

    _drawEndpoint: function (x, y, label) {
      var sz = _isTouch ? 42 : 34;
      noFill(); stroke(230, 40, 120); strokeWeight(4); ellipse(x, y, sz, sz);
      fill(230, 40, 120); noStroke(); ellipse(x, y, 12, 12);
      fill(230, 40, 120); textSize(rTextSize(18)); textAlign(CENTER, CENTER); text(label, x, y - 34);
    },

    _drawArches: function (startV, endV) {
      var delta = endV - startV;
      var steps = Math.round(delta / this.o.step);
      var cnt = clampVal(Math.abs(steps), 0, this.o.maxSteps);
      if (cnt === 0) return;
      var dir = steps >= 0 ? 1 : -1;
      var stepPx = Math.abs(this._valToX(startV + this.o.step) - this._valToX(startV));
      var startX = this._valToX(startV);
      var axY = this._axisY;

      for (var i = 0; i < cnt; i++) {
        var x1 = startX + dir * i * stepPx;
        var x2 = startX + dir * (i + 1) * stepPx;
        var mx = (x1 + x2) / 2;
        noFill(); stroke(230, 40, 120); strokeWeight(3);
        arc(mx, axY, stepPx, stepPx, PI, TWO_PI);
        noStroke(); fill(230, 40, 120); textSize(rTextSize(12)); textAlign(CENTER, CENTER);
        text(dir > 0 ? "0.1" : "-0.1", mx, axY - stepPx * 0.55);
      }
    },

    mousePressed: function () {
      if (insideBtn(this._tryBtn)) { this.newRound(); return; }
      var lX = this._valToX(this._leftVal), rX = this._valToX(this._rightVal);
      var axY = this._axisY;
      var hr = hitR(22);
      if (dist(mouseX, mouseY, lX, axY) < hr) {
        this._dragFrom = "left"; this._isDragging = true; this._aValue = this._leftVal; return;
      }
      if (dist(mouseX, mouseY, rX, axY) < hr) {
        this._dragFrom = "right"; this._isDragging = true; this._aValue = this._rightVal; return;
      }
    },

    mouseDragged: function () {
      if (!this._isDragging || !this._dragFrom) return;
      var v = this._xToVal(mouseX);
      this._aValue = roundTo(clampVal(v, this._leftVal, this._rightVal), this.o.step);
    },

    mouseReleased: function () { this._isDragging = false; }
  };

  // ============================================================
  // RippaMathCore.AbsoluteValue  (sketch 8)
  // ============================================================
  RippaMathCore.AbsoluteValue = function (opts) {
    var defaults = {
      min: -20, max: 20,
      labelInterval: 5,
      tickSpacing: 1
    };
    this.o = mergeOpts(defaults, opts);
    this._personValue = 7;
    this._isDragging = false;
    this._axisY = 0; this._axisStartX = 0; this._axisEndX = 0;
    this._newBtn = { x: 0, y: 0, w: 160, h: 44 };
    this._inited = false;
  };

  RippaMathCore.AbsoluteValue.prototype = {
    _layout: function () {
      this._axisY = height * 0.5;
      var pad = axisPad();
      this._axisStartX = pad; this._axisEndX = width - pad;
      this._newBtn.w = isMobile() ? 130 : 160;
      this._newBtn.x = width - this._newBtn.w - 16;
      this._newBtn.y = height - 56;
    },
    _valToX: function (v) { return map(v, this.o.min, this.o.max, this._axisStartX, this._axisEndX); },
    _xToVal: function (x) { return map(x, this._axisStartX, this._axisEndX, this.o.min, this.o.max); },

    newRound: function () {
      var side = random() < 0.5 ? -1 : 1;
      this._personValue = side * floor(random(1, this.o.max + 1));
      this._personValue = constrain(this._personValue, this.o.min, this.o.max);
      if (this._personValue === 0) this._personValue = 7;
      this._isDragging = false;
    },

    draw: function () {
      if (!this._inited) { this._layout(); this.newRound(); this._inited = true; }
      else this._layout();

      var axY = this._axisY;
      var mob = isMobile();

      noStroke(); fill(40); textSize(rTextSize(20)); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Absolute Value", width / 2, 24);
      textStyle(NORMAL); textSize(rTextSize(14)); fill(90);
      text(mob ? "Drag marker to see distance from zero" : "Drag the marker. See how far it is from zero (absolute value).", width / 2, 48);

      stroke(40); strokeWeight(3);
      line(this._axisStartX, axY, this._axisEndX, axY);
      drawAxisArrow(this._axisStartX, axY, -1);
      drawAxisArrow(this._axisEndX, axY, 1);

      var labelInt = mob ? Math.max(this.o.labelInterval, 10) : this.o.labelInterval;
      for (var v = this.o.min; v <= this.o.max; v += this.o.tickSpacing) {
        var x = this._valToX(v);
        var isLabel = v % labelInt === 0;
        stroke(30); strokeWeight(isLabel ? 3 : 1);
        var h = isLabel ? 18 : (mob ? 4 : 10);
        line(x, axY - h / 2, x, axY + h);
        if (isLabel) {
          noStroke(); fill(60); textSize(rTextSize(14)); textAlign(CENTER, CENTER);
          text(v, x, axY + 32);
        }
      }

      var schoolX = this._valToX(0);
      noStroke(); fill(40); textSize(rTextSize(11)); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Zero", schoolX, axY - 65); textStyle(NORMAL);
      fill(60); textSize(rTextSize(13)); text("0", schoolX, axY - 48);
      stroke(50); strokeWeight(2); line(schoolX, axY - 38, schoolX, axY - 6);
      noStroke(); fill(50);
      triangle(schoolX - 5, axY - 6, schoolX + 5, axY - 6, schoolX, axY);

      var px = this._valToX(this._personValue);
      var markerSize = _isTouch ? 36 : 30;
      if (this._isDragging) {
        noFill(); stroke(140, 80, 180); strokeWeight(3);
        ellipse(px, axY - 55, markerSize + 14, markerSize + 14);
      }
      noStroke(); fill(50, 150, 255); ellipse(px, axY - 55, markerSize, markerSize);
      noFill(); stroke(60, 60, 80); strokeWeight(2); ellipse(px, axY - 55, markerSize, markerSize);
      stroke(50); strokeWeight(2); line(px, axY - 40, px, axY - 6);
      noStroke(); fill(50);
      triangle(px - 5, axY - 6, px + 5, axY - 6, px, axY);
      fill(60, 40, 120); textSize(rTextSize(14)); textAlign(CENTER, CENTER);
      text(this._personValue, px, axY - 85);

      if (this._personValue !== 0) {
        var dU = Math.abs(this._personValue);
        var leftX = Math.min(px, schoolX), rightX = Math.max(px, schoolX);
        var dLineY = axY - 100;
        stroke(34, 100, 50); strokeWeight(2);
        line(px, axY - 70, px, dLineY);
        line(schoolX, axY - 70, schoolX, dLineY);
        strokeWeight(4);
        line(leftX, dLineY, rightX, dLineY);
        noStroke(); fill(20, 80, 40); textSize(rTextSize(16)); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(dU, (leftX + rightX) / 2, dLineY - 14);
        textStyle(NORMAL);

        noStroke(); fill(40); textSize(rTextSize(15)); textAlign(CENTER, CENTER);
        text("Distance from zero = " + dU, width / 2, axY + 68);
        text("| " + this._personValue + " | = " + dU, width / 2, axY + 90);
      } else {
        noStroke(); fill(40, 120, 60); textSize(rTextSize(22)); textStyle(BOLD); textAlign(CENTER, CENTER);
        text("At zero!", width / 2, axY + 85);
        textStyle(NORMAL);
      }

      drawButton(this._newBtn, mob ? "NEW" : "NEW DISTANCE", color(80, 40, 120),
        color(230, 220, 245), color(200, 200, 230), color(80, 40, 120));
    },

    mousePressed: function () {
      if (insideBtn(this._newBtn)) { this.newRound(); return; }
      var px = this._valToX(this._personValue);
      var cY = this._axisY - 55;
      if (dist(mouseX, mouseY, px, cY) <= hitR(40)) this._isDragging = true;
    },
    mouseDragged: function () {
      if (!this._isDragging) return;
      var v = this._xToVal(mouseX);
      this._personValue = round(v);
      this._personValue = constrain(this._personValue, this.o.min, this.o.max);
    },
    mouseReleased: function () { this._isDragging = false; }
  };

  // ============================================================
  // RippaMathCore.DistanceBetween  (sketches 9-10)
  // ============================================================
  RippaMathCore.DistanceBetween = function (opts) {
    var defaults = {
      min: -20, max: 20,
      labelInterval: 5, tickSpacing: 1,
      animated: false
    };
    this.o = mergeOpts(defaults, opts);
    this._personAVal = -5;
    this._personBVal = 7;
    this._dragTarget = null; this._isDragging = false;
    this._axisY = 0; this._axisStartX = 0; this._axisEndX = 0;
    this._newBtn = { x: 0, y: 0, w: 160, h: 44 };
    this._inited = false;
  };

  RippaMathCore.DistanceBetween.prototype = {
    _layout: function () {
      this._axisY = height * 0.4;
      var pad = axisPad();
      this._axisStartX = pad; this._axisEndX = width - pad;
      this._newBtn.w = isMobile() ? 130 : 160;
      this._newBtn.x = width - this._newBtn.w - 16;
      this._newBtn.y = height - 56;
    },
    _valToX: function (v) { return map(v, this.o.min, this.o.max, this._axisStartX, this._axisEndX); },
    _xToVal: function (x) { return map(x, this._axisStartX, this._axisEndX, this.o.min, this.o.max); },

    getDistance: function () { return Math.abs(this._personAVal - this._personBVal); },

    newRound: function () {
      this._personAVal = floor(random(this.o.min, this.o.max + 1));
      this._personBVal = floor(random(this.o.min, this.o.max + 1));
      this._personAVal = constrain(this._personAVal, this.o.min, this.o.max);
      this._personBVal = constrain(this._personBVal, this.o.min, this.o.max);
      this._dragTarget = null; this._isDragging = false;
    },

    draw: function () {
      if (!this._inited) { this._layout(); this.newRound(); this._inited = true; }
      else this._layout();

      var axY = this._axisY;
      var mob = isMobile();

      noStroke(); fill(40); textSize(rTextSize(20)); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Distance Between Two Points", width / 2, 24);
      textStyle(NORMAL); textSize(rTextSize(14)); fill(90);
      text(mob ? "Drag A or B" : "Drag either marker. Distance = | A \u2212 B |", width / 2, 48);

      stroke(40); strokeWeight(3);
      line(this._axisStartX, axY, this._axisEndX, axY);
      drawAxisArrow(this._axisStartX, axY, -1);
      drawAxisArrow(this._axisEndX, axY, 1);

      var labelInt = mob ? Math.max(this.o.labelInterval, 10) : this.o.labelInterval;
      for (var v = this.o.min; v <= this.o.max; v += this.o.tickSpacing) {
        var x = this._valToX(v);
        var isLabel = v % labelInt === 0;
        stroke(30); strokeWeight(isLabel ? 3 : 1);
        var h = isLabel ? 18 : (mob ? 4 : 10);
        line(x, axY - h / 2, x, axY + h);
        if (isLabel) {
          noStroke(); fill(60); textSize(rTextSize(13)); textAlign(CENTER, CENTER); text(v, x, axY + 32);
        }
      }

      var ax = this._valToX(this._personAVal);
      var bx = this._valToX(this._personBVal);
      var mY = axY - 55;
      var markerSz = _isTouch ? 34 : 28;

      if (this._dragTarget === "A") {
        noFill(); stroke(140, 80, 180); strokeWeight(3); ellipse(ax, mY, markerSz + 16, markerSz + 16);
      }
      noStroke(); fill(230, 130, 50); ellipse(ax, mY, markerSz, markerSz);
      noFill(); stroke(60); strokeWeight(2); ellipse(ax, mY, markerSz, markerSz);
      stroke(50); strokeWeight(2); line(ax, mY + 14, ax, axY - 6);
      noStroke(); fill(50); triangle(ax - 5, axY - 6, ax + 5, axY - 6, ax, axY);
      fill(180, 100, 30); textSize(rTextSize(14)); textAlign(CENTER, CENTER);
      text("A=" + this._personAVal, ax, mY - 24);

      if (this._dragTarget === "B") {
        noFill(); stroke(80, 100, 160); strokeWeight(3); ellipse(bx, mY, markerSz + 16, markerSz + 16);
      }
      noStroke(); fill(50, 100, 200); ellipse(bx, mY, markerSz, markerSz);
      noFill(); stroke(60); strokeWeight(2); ellipse(bx, mY, markerSz, markerSz);
      stroke(50); strokeWeight(2); line(bx, mY + 14, bx, axY - 6);
      noStroke(); fill(50); triangle(bx - 5, axY - 6, bx + 5, axY - 6, bx, axY);
      fill(30, 70, 150); textSize(rTextSize(14)); textAlign(CENTER, CENTER);
      text("B=" + this._personBVal, bx, mY - 24);

      var dU = this.getDistance();
      if (dU > 0) {
        var leftX = Math.min(ax, bx), rightX = Math.max(ax, bx);
        var dLY = mY - 30;
        stroke(34, 100, 50); strokeWeight(2);
        line(ax, mY - 14, ax, dLY); line(bx, mY - 14, bx, dLY);
        strokeWeight(4); line(leftX, dLY, rightX, dLY);
        noStroke(); fill(20, 80, 40); textSize(rTextSize(16)); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(dU, (leftX + rightX) / 2, dLY - 14); textStyle(NORMAL);
      }

      noStroke(); fill(40); textSize(rTextSize(15)); textAlign(CENTER, CENTER);
      var fY = axY + 60;
      if (dU === 0) {
        fill(40, 120, 60); textSize(rTextSize(18)); textStyle(BOLD);
        text("Same position! Distance is 0.", width / 2, fY); textStyle(NORMAL);
      } else {
        text("Distance = | " + this._personAVal + " \u2212 " + this._personBVal + " | = " + dU, width / 2, fY);
        textStyle(BOLD);
        text("| " + this._personAVal + " \u2212 (" + this._personBVal + ") | = " + dU, width / 2, fY + 22);
        textStyle(NORMAL);
      }

      drawButton(this._newBtn, mob ? "NEW" : "NEW POSITIONS", color(80, 40, 120),
        color(230, 220, 245), color(200, 200, 230), color(80, 40, 120));
    },

    mousePressed: function () {
      if (insideBtn(this._newBtn)) { this.newRound(); return; }
      var mY = this._axisY - 55;
      var ax = this._valToX(this._personAVal);
      var bx = this._valToX(this._personBVal);
      var hr = hitR(30);
      if (dist(mouseX, mouseY, ax, mY) <= hr) { this._dragTarget = "A"; this._isDragging = true; return; }
      if (dist(mouseX, mouseY, bx, mY) <= hr) { this._dragTarget = "B"; this._isDragging = true; }
    },
    mouseDragged: function () {
      if (!this._isDragging || !this._dragTarget) return;
      var v = round(this._xToVal(mouseX));
      v = constrain(v, this.o.min, this.o.max);
      if (this._dragTarget === "A") this._personAVal = v; else this._personBVal = v;
    },
    mouseReleased: function () { this._isDragging = false; this._dragTarget = null; }
  };

  // ============================================================
  // RippaMathCore.CoordinateGrid  (sketches 11-12)
  // ============================================================
  RippaMathCore.CoordinateGrid = function (opts) {
    var defaults = {
      gridMin: -10, gridMax: 10,
      showIntro: false,
      gameMode: false
    };
    this.o = mergeOpts(defaults, opts);
    this._pointX = 3; this._pointY = 4;
    this._isDragging = false;
    this._targetX = 0; this._targetY = 0;
    this._score = 0;
    this._inited = false;
  };

  RippaMathCore.CoordinateGrid.prototype = {
    _gridToScreen: function (gx, gy) {
      var cx = width / 2, cy = height / 2;
      var range = this.o.gridMax - this.o.gridMin;
      var pxPerUnit = Math.min(width, height) * 0.75 / range;
      return { x: cx + gx * pxPerUnit, y: cy - gy * pxPerUnit, ppu: pxPerUnit };
    },
    _screenToGrid: function (sx, sy) {
      var cx = width / 2, cy = height / 2;
      var range = this.o.gridMax - this.o.gridMin;
      var ppu = Math.min(width, height) * 0.75 / range;
      return { gx: (sx - cx) / ppu, gy: (cy - sy) / ppu };
    },

    newTarget: function () {
      this._targetX = floor(random(this.o.gridMin + 1, this.o.gridMax));
      this._targetY = floor(random(this.o.gridMin + 1, this.o.gridMax));
    },

    draw: function () {
      if (!this._inited) {
        if (this.o.gameMode) this.newTarget();
        this._inited = true;
      }

      var gMin = this.o.gridMin, gMax = this.o.gridMax;
      var range = gMax - gMin;
      var ppu = Math.min(width, height) * 0.75 / range;
      var cx = width / 2, cy = height / 2;
      var mob = isMobile();
      var showEvery = mob ? 2 : 1;

      noStroke(); fill(40); textSize(rTextSize(18)); textStyle(BOLD); textAlign(CENTER, TOP);
      text("2D Coordinate Grid", width / 2, 6); textStyle(NORMAL);

      for (var i = gMin; i <= gMax; i++) {
        var s = this._gridToScreen(i, 0);
        var sy1 = this._gridToScreen(0, gMin);
        var sy2 = this._gridToScreen(0, gMax);
        stroke(220); strokeWeight(1);
        line(s.x, sy1.y, s.x, sy2.y);
        var sh = this._gridToScreen(gMin, i);
        var sh2 = this._gridToScreen(gMax, i);
        line(sh.x, sh.y, sh2.x, sh2.y);
      }

      var ox = this._gridToScreen(0, 0);
      var xEnd = this._gridToScreen(gMax, 0);
      var xStart = this._gridToScreen(gMin, 0);
      var yEnd = this._gridToScreen(0, gMax);
      var yStart = this._gridToScreen(0, gMin);

      stroke(0); strokeWeight(2);
      line(xStart.x, ox.y, xEnd.x, ox.y);
      line(ox.x, yStart.y, ox.x, yEnd.y);

      noStroke(); fill(0); textSize(rTextSize(11)); textAlign(CENTER, CENTER);
      for (var j = gMin; j <= gMax; j++) {
        if (j === 0) continue;
        if (mob && j % showEvery !== 0) continue;
        var tx = this._gridToScreen(j, 0);
        text(j, tx.x, ox.y + 14);
        var ty = this._gridToScreen(0, j);
        text(j, ox.x - 16, ty.y);
      }
      textSize(rTextSize(13)); textStyle(BOLD);
      text("x", xEnd.x + 14, ox.y);
      text("y", ox.x, yEnd.y - 14);
      textStyle(NORMAL);
      text("0", ox.x - 12, ox.y + 12);

      if (this.o.gameMode) {
        var tPos = this._gridToScreen(this._targetX, this._targetY);
        noStroke(); fill(255, 100, 100, 180);
        circle(tPos.x, tPos.y, _isTouch ? 28 : 20);
        fill(180, 0, 0); textSize(rTextSize(12));
        text("(" + this._targetX + "," + this._targetY + ")", tPos.x, tPos.y - 18);
      }

      var pp = this._gridToScreen(this._pointX, this._pointY);
      var dotSz = _isTouch ? 24 : 16;
      if (this._isDragging) {
        noFill(); stroke(50, 150, 255, 150); strokeWeight(3);
        ellipse(pp.x, pp.y, dotSz + 20, dotSz + 20);
      }
      noStroke(); fill(50, 150, 255);
      circle(pp.x, pp.y, dotSz);
      fill(30, 50, 100); textSize(rTextSize(14)); textStyle(BOLD);
      text("(" + this._pointX + ", " + this._pointY + ")", pp.x, pp.y - 18);
      textStyle(NORMAL);

      if (this.o.gameMode) {
        fill(40); textSize(rTextSize(16)); textAlign(LEFT, TOP);
        text("Score: " + this._score, 10, 32);
        if (this._pointX === this._targetX && this._pointY === this._targetY) {
          fill(40, 160, 60); textSize(rTextSize(18)); textStyle(BOLD); textAlign(CENTER, CENTER);
          text(mob ? "Correct! Tap to continue" : "Correct! Click to continue.", width / 2, height - 24);
          textStyle(NORMAL);
        }
      }
    },

    mousePressed: function () {
      var pp = this._gridToScreen(this._pointX, this._pointY);
      if (dist(mouseX, mouseY, pp.x, pp.y) < hitR(24)) {
        this._isDragging = true; return;
      }
      if (this.o.gameMode && this._pointX === this._targetX && this._pointY === this._targetY) {
        this._score++;
        this.newTarget();
      }
    },
    mouseDragged: function () {
      if (!this._isDragging) return;
      var g = this._screenToGrid(mouseX, mouseY);
      this._pointX = round(constrain(g.gx, this.o.gridMin, this.o.gridMax));
      this._pointY = round(constrain(g.gy, this.o.gridMin, this.o.gridMax));
    },
    mouseReleased: function () { this._isDragging = false; }
  };

  // ============================================================
  // RippaMathCore.Coordinate3D  (sketches 13-14)
  // ============================================================
  RippaMathCore.Coordinate3D = function (opts) {
    var defaults = {
      gridMin: -5, gridMax: 5,
      showIntro: false,
      freeOrbit: true
    };
    this.o = mergeOpts(defaults, opts);
    this._camAz = -0.4; this._camEl = 0.35;
    this._camDist = 500;
    this._ptX = 2; this._ptY = 3; this._ptZ = 1;
    this._lastMX = 0; this._lastMY = 0;
    this._isDragging = false;
    this._inited = false;
    this._pinch = new PinchHelper();
  };

  RippaMathCore.Coordinate3D.prototype = {
    draw: function () {
      if (!this._inited) { this._inited = true; }

      // Handle pinch-to-zoom on touch
      if (_isTouch) {
        var pinch = this._pinch.update();
        if (pinch) {
          this._camDist = constrain(this._camDist + pinch.delta * 0.5, 100, 2000);
        }
      }

      var gMin = this.o.gridMin, gMax = this.o.gridMax;
      var sc = 40;

      var cX = this._camDist * cos(this._camEl) * sin(this._camAz);
      var cY = -this._camDist * sin(this._camEl);
      var cZ = this._camDist * cos(this._camEl) * cos(this._camAz);
      camera(cX, cY, cZ, 0, 0, 0, 0, 1, 0);
      orbitControl(2, 2, 0.5);

      push();
      stroke(200); strokeWeight(0.5);
      for (var i = gMin; i <= gMax; i++) {
        line(i * sc, 0, gMin * sc, i * sc, 0, gMax * sc);
        line(gMin * sc, 0, i * sc, gMax * sc, 0, i * sc);
      }
      pop();

      push(); strokeWeight(2);
      stroke(220, 50, 50);
      line(gMin * sc, 0, 0, gMax * sc, 0, 0);
      stroke(50, 180, 50);
      line(0, -gMax * sc, 0, 0, -gMin * sc, 0);
      stroke(50, 50, 220);
      line(0, 0, gMin * sc, 0, 0, gMax * sc);
      pop();

      push();
      translate(this._ptX * sc, -this._ptY * sc, this._ptZ * sc);
      noStroke(); fill(255, 100, 50);
      sphere(8);
      pop();

      push(); stroke(100); strokeWeight(1);
      line(this._ptX * sc, -this._ptY * sc, this._ptZ * sc,
           this._ptX * sc, 0, this._ptZ * sc);
      line(this._ptX * sc, 0, this._ptZ * sc, this._ptX * sc, 0, 0);
      line(this._ptX * sc, 0, this._ptZ * sc, 0, 0, this._ptZ * sc);
      pop();
    },

    mousePressed: function () {
      this._lastMX = mouseX; this._lastMY = mouseY;
      this._isDragging = true;
    },

    mouseDragged: function () {
      if (!this._isDragging || !this.o.freeOrbit) return;
      var dx = mouseX - this._lastMX;
      var dy = mouseY - this._lastMY;
      this._camAz += dx * 0.005;
      this._camEl = constrain(this._camEl + dy * 0.005, -HALF_PI + 0.05, HALF_PI - 0.05);
      this._lastMX = mouseX; this._lastMY = mouseY;
    },

    mouseReleased: function () {
      this._isDragging = false;
      this._pinch.reset();
    },

    mouseWheel: function (event) {
      this._camDist = constrain(this._camDist + event.delta * 0.5, 100, 2000);
      return false;
    },

    setPoint: function (x, y, z) {
      this._ptX = x; this._ptY = y; this._ptZ = z;
    }
  };

  // ============================================================
  // RippaMathCore.AngleExplorer  (sketch 15)
  // ============================================================
  RippaMathCore.AngleExplorer = function (opts) {
    var defaults = {
      snapMode: false,
      startAngle: 45,
      showNaming: true,
      showSpecialMarkers: true,
      showTypeInfo: true,
      showQuickJump: true,
      pointLabels: ['A', 'B', 'C']
    };
    this.o = mergeOpts(defaults, opts);
    this._angle = this.o.startAngle;
    this._targetAngle = this.o.startAngle;
    this._isDragging = false;
    this._snapMode = this.o.snapMode;
    this._activeNameStyle = 0;
    this._particles = [];
    this._lastSpecialHit = -1;
    this._cx = 0; this._cy = 0;
    this._rayLen = 120; this._arcR = 40; this._handleR = 12;
    this._leftW = 0; this._rightW = 0;
    this._topH = 50; this._botH = 80;
    this._quickBtns = [];
    this._nameBtns = [];
    this._snapBtn = { x: 0, y: 0, w: 120, h: 30 };
    this._inited = false;
    this._SPECIAL = [0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];
    this._QUICK = [30,45,60,90,120,180,270,360];
    this._cols = null;
    this._typeCols = null;
    this._mobileMode = false;
  };

  RippaMathCore.AngleExplorer.prototype = {
    _initCols: function () {
      this._cols = {
        ray: color(220,60,140), arc: color(120,80,220,160),
        vertex: color(220,60,140), handle: color(100,60,200),
        accent: color(80,60,200), special: color(255,175,40),
        snapOn: color(50,180,90), text: color(40,40,60),
        muted: color(130,135,150), cardBg: color(255),
        cardBorder: color(215,220,235), panelBg: color(255,255,255,230)
      };
      this._typeCols = {
        acute: color(60,180,120), right: color(50,120,220),
        obtuse: color(220,140,40), straight: color(180,60,60),
        reflex: color(160,60,180), full: color(220,50,50)
      };
    },

    _layout: function () {
      var w = width, h = height;
      this._mobileMode = w < 580;

      if (this._mobileMode) {
        // Mobile: no side panels, full-width viz, compact bottom bar
        this._leftW = 0;
        this._rightW = 0;
        this._topH = 70; // extra room for angle info overlay
        this._botH = 70;
        this._cx = w / 2;
        this._cy = this._topH + (h - this._topH - this._botH) / 2;
        var vizSz = Math.min(w, h - this._topH - this._botH);
        this._rayLen = constrain(vizSz * 0.30, 50, 160);
        this._arcR = this._rayLen * 0.32;
        this._handleR = Math.max(14, this._rayLen * 0.1);

        // Compact quick buttons
        var barY = h - this._botH + 8;
        var bw = Math.min(42, (w - 20) / (this._QUICK.length + 1.5) - 3);
        var bh = 30;
        var bg = 3;
        var snapW = Math.min(80, bw * 2);
        this._snapBtn.w = snapW;
        var tw = this._QUICK.length * (bw + bg) - bg;
        var gw = tw + 8 + snapW;
        var sx = Math.max(4, (w - gw) / 2);
        this._quickBtns = [];
        for (var i = 0; i < this._QUICK.length; i++) {
          this._quickBtns.push({ x: sx + i * (bw + bg), y: barY, w: bw, h: bh, angle: this._QUICK[i] });
        }
        this._snapBtn.x = sx + tw + 8;
        this._snapBtn.y = barY;
        this._snapBtn.h = bh;
        this._nameBtns = [];
      } else {
        // Desktop: side panels
        this._leftW = constrain(w * 0.20, 150, 220);
        this._rightW = constrain(w * 0.20, 150, 220);
        this._topH = 50;
        this._botH = 80;
        var vizL = this._leftW, vizR = w - this._rightW;
        this._cx = (vizL + vizR) / 2;
        this._cy = this._topH + (h - this._topH - this._botH) / 2;
        var vizW = vizR - vizL, vizH = h - this._topH - this._botH;
        this._rayLen = constrain(Math.min(vizW, vizH) * 0.28, 60, 200);
        this._arcR = this._rayLen * 0.32;
        this._handleR = Math.max(8, this._rayLen * 0.08);

        var barY2 = h - this._botH + 12;
        var bw2 = 50, bh2 = 28, bg2 = 5;
        var tw2 = this._QUICK.length * (bw2 + bg2) - bg2;
        var gw2 = tw2 + 16 + this._snapBtn.w;
        var sx2 = (w - gw2) / 2;
        this._quickBtns = [];
        for (var ii = 0; ii < this._QUICK.length; ii++) {
          this._quickBtns.push({ x: sx2 + ii * (bw2 + bg2), y: barY2, w: bw2, h: bh2, angle: this._QUICK[ii] });
        }
        this._snapBtn.x = sx2 + tw2 + 16;
        this._snapBtn.y = barY2;
        this._snapBtn.h = bh2;

        var nW = this._leftW - 30, nH = 36, nG = 7;
        var nY = this._topH + 80;
        this._nameBtns = [];
        for (var j = 0; j < 3; j++) {
          this._nameBtns.push({ x: 15, y: nY + j * (nH + nG), w: nW, h: nH });
        }
      }
    },

    getAngle: function () { return this._angle; },
    setAngle: function (d) { this._targetAngle = constrain(d, 0, 360); },

    draw: function () {
      if (!this._inited) { this._initCols(); this._layout(); this._inited = true; }
      else this._layout();

      var diff = this._targetAngle - this._angle;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (Math.abs(diff) > 0.1) {
        this._angle += diff * 0.12;
        if (this._angle < 0) this._angle += 360;
        if (this._angle > 360) this._angle = 360;
      } else this._angle = this._targetAngle;
      this._angle = constrain(this._angle, 0, 360);

      if (this._mobileMode) {
        this._drawMobileTitleBar();
      } else {
        this._drawTitleBar();
        if (this.o.showNaming) this._drawLeftPanel();
        this._drawRightPanel();
      }
      this._drawBottomBar();
      if (this.o.showSpecialMarkers && !this._mobileMode) this._drawMarkers();
      this._drawRays();
      this._drawArc();
      this._drawPtLabels();
      this._updateParts();
      this._drawParts();
    },

    _drawMobileTitleBar: function () {
      var c = this._cols;
      fill(255,255,255,220); noStroke();
      rect(0, 0, width, this._topH);
      stroke(215,220,235); strokeWeight(1);
      line(0, this._topH, width, this._topH);

      var deg = Math.round(this._angle * 10) / 10;
      var info = this._getType(deg);
      var tc = this._typeCols[info.key];
      var spec = this._isSpec(deg);

      // Angle degree + type on mobile top bar
      noStroke(); fill(spec ? c.special : c.accent);
      textSize(22); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(deg + "\u00B0", width / 2, 20);
      textStyle(NORMAL);
      fill(tc); textSize(12); textStyle(BOLD);
      text(info.name, width / 2, 42);
      textStyle(NORMAL);

      // Naming style indicator (compact)
      var pA = this.o.pointLabels[0], pB = this.o.pointLabels[1], pC = this.o.pointLabels[2];
      var names = ["\u2220" + pA + pB + pC, "\u2220" + pC + pB + pA, "\u2220" + pB];
      fill(c.muted); textSize(11); textAlign(LEFT, CENTER);
      text(names[this._activeNameStyle], 10, 20);
      // Tap-to-cycle hint
      fill(200); textSize(8);
      text("tap to cycle", 10, 35);
      this._mobileNameBtn = { x: 2, y: 4, w: 80, h: 36 };

      if (spec) {
        fill(c.special); textSize(9); textStyle(BOLD); textAlign(RIGHT, CENTER);
        text("\u2605 Special", width - 10, 20);
        textStyle(NORMAL);
      }
    },

    _drawTitleBar: function () {
      fill(255,255,255,200); noStroke();
      rect(0, 0, width, this._topH);
      stroke(215,220,235); strokeWeight(1);
      line(0, this._topH, width, this._topH);
      noStroke(); fill(this._cols.text);
      textSize(18); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Angle Explorer", width / 2, this._topH / 2);
      textStyle(NORMAL);
    },

    _drawLeftPanel: function () {
      var lw = this._leftW, c = this._cols;
      fill(c.panelBg); noStroke();
      rect(0, this._topH, lw, height - this._topH - this._botH);
      stroke(215,220,235); strokeWeight(1);
      line(lw, this._topH, lw, height - this._botH);

      var cx = lw / 2, py = this._topH + 14;
      var pA = this.o.pointLabels[0], pB = this.o.pointLabels[1], pC = this.o.pointLabels[2];
      noStroke(); fill(c.accent); textSize(13); textStyle(BOLD); textAlign(CENTER, TOP);
      text("Naming the Angle", cx, py); textStyle(NORMAL);
      fill(c.muted); textSize(9); text("Click to explore each style", cx, py + 18);

      var names = [
        { label: "\u2220" + pA + pB + pC, sub: "vertex in the middle" },
        { label: "\u2220" + pC + pB + pA, sub: "reversed order" },
        { label: "\u2220" + pB, sub: "just the vertex letter" }
      ];
      for (var i = 0; i < this._nameBtns.length; i++) {
        var btn = this._nameBtns[i], act = (this._activeNameStyle === i);
        var hov = insideBtn(btn);
        if (act) { fill(red(c.accent),green(c.accent),blue(c.accent),22); stroke(c.accent); strokeWeight(2.5); }
        else if (hov) { fill(242,240,255); stroke(c.accent); strokeWeight(1.5); }
        else { fill(250,250,255); stroke(c.cardBorder); strokeWeight(1); }
        rect(btn.x, btn.y, btn.w, btn.h, 10);
        noStroke(); fill(act ? c.accent : c.text);
        textSize(15); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(names[i].label, btn.x + btn.w / 2, btn.y + btn.h / 2 - 3); textStyle(NORMAL);
        fill(act ? c.accent : c.muted); textSize(8);
        text(names[i].sub, btn.x + btn.w / 2, btn.y + btn.h - 6);
      }

      var dy = this._nameBtns[2].y + this._nameBtns[2].h + 16;
      var cw = lw - 24, ch = 70;
      fill(c.cardBg); stroke(c.accent); strokeWeight(2);
      rect(12, dy, cw, ch, 12);
      noStroke(); fill(c.accent); textSize(24); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(names[this._activeNameStyle].label, cx, dy + 24); textStyle(NORMAL);
      fill(c.muted); textSize(9);
      var exps = [
        "Vertex (" + pB + ") is always\nin the middle",
        "Same angle, read\nthe other way around",
        "Short form when there\u2019s\nonly one angle at " + pB
      ];
      var el = exps[this._activeNameStyle].split("\n");
      for (var k = 0; k < el.length; k++) text(el[k], cx, dy + 48 + k * 12);

      var gy = dy + ch + 14;
      fill(c.text); textSize(10); textStyle(BOLD); textAlign(LEFT, TOP);
      text("How to read:", 18, gy); textStyle(NORMAL);
      fill(80); textSize(9);
      var rt = [
        "\"Angle " + pA + "-" + pB + "-" + pC + "\"\nVertex letter (" + pB + ")\nis always in the middle.",
        "\"Angle " + pC + "-" + pB + "-" + pA + "\"\nSame angle, just name\nthe points in reverse.",
        "\"Angle " + pB + "\"\nUse when there is only\none angle at this vertex."
      ];
      var rl = rt[this._activeNameStyle].split("\n");
      for (var m = 0; m < rl.length; m++) text(rl[m], 18, gy + 16 + m * 13);
    },

    _drawRightPanel: function () {
      var px = width - this._rightW, rw = this._rightW, c = this._cols;
      fill(c.panelBg); noStroke();
      rect(px, this._topH, rw, height - this._topH - this._botH);
      stroke(215,220,235); strokeWeight(1);
      line(px, this._topH, px, height - this._botH);

      var cx = px + rw / 2, pad = 14, cw = rw - pad * 2;
      var deg = Math.round(this._angle * 10) / 10;
      var spec = this._isSpec(deg);

      var my = this._topH + 14;
      noStroke(); fill(c.accent); textSize(13); textStyle(BOLD); textAlign(CENTER, TOP);
      text("Measurement", cx, my); textStyle(NORMAL);
      var cy = my + 22, ch = 80;
      fill(c.cardBg); stroke(spec ? c.special : c.cardBorder); strokeWeight(spec ? 3 : 1.5);
      rect(px + pad, cy, cw, ch, 14);
      noStroke(); fill(spec ? c.special : c.accent);
      textSize(36); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(deg + "\u00B0", cx, cy + ch / 2 - 6); textStyle(NORMAL);
      if (spec) { fill(c.special); textSize(10); textStyle(BOLD); text("\u2605 Special Angle", cx, cy + ch - 10); textStyle(NORMAL); }

      var info = this._getType(deg);
      var tc = this._typeCols[info.key];
      var ty = cy + ch + 14;
      noStroke(); fill(tc); textSize(13); textStyle(BOLD); textAlign(CENTER, TOP);
      text("Angle Type", cx, ty); textStyle(NORMAL);
      var tcy = ty + 20, tch = 68;
      fill(red(tc), green(tc), blue(tc), 12); stroke(tc); strokeWeight(2);
      rect(px + pad, tcy, cw, tch, 12);
      noStroke(); fill(tc); textSize(16); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(info.name, cx, tcy + 20); textStyle(NORMAL);
      fill(90); textSize(9);
      var words = info.desc.split(" "), ln = "", lines = [];
      for (var i = 0; i < words.length; i++) {
        var t = ln + (ln ? " " : "") + words[i];
        if (textWidth(t) > cw - 14 && ln) { lines.push(ln); ln = words[i]; } else ln = t;
      }
      if (ln) lines.push(ln);
      for (var j = 0; j < lines.length; j++) text(lines[j], cx, tcy + 38 + j * 12);

      var ry = tcy + tch + 14;
      this._drawRange(px + pad, ry, cw, deg);
    },

    _drawRange: function (x, y, w, deg) {
      var c = this._cols;
      noStroke(); fill(c.text); textSize(10); textStyle(BOLD); textAlign(CENTER, TOP);
      text("Angle Ranges", x + w / 2, y); textStyle(NORMAL);
      var by = y + 16, bh = 7;
      fill(235,238,245); noStroke(); rect(x, by, w, bh, 3);
      var fw = map(deg, 0, 360, 0, w);
      fill(red(c.accent), green(c.accent), blue(c.accent), 50);
      rect(x, by, fw, bh, 3);
      fill(c.accent); noStroke();
      triangle(x + fw - 3, by - 2, x + fw + 3, by - 2, x + fw, by + 2);
      var ticks = [0, 90, 180, 270, 360];
      for (var i = 0; i < ticks.length; i++) {
        var tx = x + map(ticks[i], 0, 360, 0, w);
        stroke(180); strokeWeight(1); line(tx, by, tx, by + bh);
        noStroke(); fill(c.muted); textSize(7); textAlign(CENTER, TOP);
        text(ticks[i] + "\u00B0", tx, by + bh + 2);
      }
      var ranges = [
        { l: "Acute", c: this._typeCols.acute },
        { l: "Right", c: this._typeCols.right },
        { l: "Obtuse", c: this._typeCols.obtuse },
        { l: "Straight", c: this._typeCols.straight },
        { l: "Reflex", c: this._typeCols.reflex },
        { l: "Full", c: this._typeCols.full }
      ];
      var ly = by + bh + 14;
      for (var j = 0; j < ranges.length; j++) {
        var col2 = j % 2, row2 = Math.floor(j / 2);
        var lx = x + col2 * (w / 2) + 2, ly2 = ly + row2 * 13;
        fill(ranges[j].c); noStroke(); circle(lx + 3, ly2 + 4, 5);
        fill(140); textSize(8); textAlign(LEFT, TOP); text(ranges[j].l, lx + 10, ly2);
      }
    },

    _drawBottomBar: function () {
      var bt = height - this._botH, c = this._cols;
      fill(255,255,255,220); noStroke(); rect(0, bt, width, this._botH);
      stroke(215,220,235); strokeWeight(1); line(0, bt, width, bt);
      if (!this._mobileMode) {
        noStroke(); fill(c.muted); textSize(10); textStyle(BOLD); textAlign(CENTER, CENTER);
        text("Quick Jump to Special Angles", width / 2, bt + 9); textStyle(NORMAL);
      }
      var deg = Math.round(this._angle * 10) / 10;
      for (var i = 0; i < this._quickBtns.length; i++) {
        var btn = this._quickBtns[i], act = Math.abs(deg - btn.angle) < 1;
        var hov = insideBtn(btn);
        if (act) { fill(c.special); stroke(210,150,30); strokeWeight(2); }
        else if (hov) { fill(240,238,255); stroke(c.accent); strokeWeight(2); }
        else { fill(c.cardBg); stroke(c.cardBorder); strokeWeight(1); }
        rect(btn.x, btn.y, btn.w, btn.h, 7);
        noStroke(); fill(act ? 255 : c.text);
        textSize(this._mobileMode ? 10 : 12); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(btn.angle + "\u00B0", btn.x + btn.w / 2, btn.y + btn.h / 2); textStyle(NORMAL);
      }
      var sh = insideBtn(this._snapBtn);
      if (this._snapMode) { fill(red(c.snapOn),green(c.snapOn),blue(c.snapOn),30); stroke(c.snapOn); strokeWeight(2); }
      else if (sh) { fill(240,245,255); stroke(c.accent); strokeWeight(1.5); }
      else { fill(c.cardBg); stroke(c.cardBorder); strokeWeight(1); }
      rect(this._snapBtn.x, this._snapBtn.y, this._snapBtn.w, this._snapBtn.h, 7);
      noStroke(); fill(this._snapMode ? c.snapOn : c.text);
      textSize(this._mobileMode ? 9 : 10); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(this._snapMode ? "\u2713 Snap" : "Snap",
        this._snapBtn.x + this._snapBtn.w / 2, this._snapBtn.y + this._snapBtn.h / 2);
      textStyle(NORMAL);
      if (!this._mobileMode) {
        fill(185); textSize(8); textAlign(CENTER, CENTER);
        text("Drag handle \u2022 Click buttons \u2022 Toggle snap", width / 2, height - 8);
      }
    },

    _drawMarkers: function () {
      var marks = [30,45,60,90,120,135,150,180,210,225,240,270,300,315,330];
      var len = this._rayLen + 18;
      for (var i = 0; i < marks.length; i++) {
        var rad = -radians(marks[i]);
        stroke(210,218,235,50); strokeWeight(1);
        drawingContext.setLineDash([3, 5]);
        line(this._cx, this._cy, this._cx + cos(rad) * len, this._cy + sin(rad) * len);
        drawingContext.setLineDash([]);
        var lr = len + 12;
        noStroke(); fill(185,192,210); textSize(7); textAlign(CENTER, CENTER);
        text(marks[i] + "\u00B0", this._cx + cos(rad) * lr, this._cy + sin(rad) * lr);
      }
    },

    _drawRays: function () {
      var aRad = -radians(this._angle), c = this._cols;
      var fex = this._cx + this._rayLen, fey = this._cy;
      var mex = this._cx + cos(aRad) * this._rayLen;
      var mey = this._cy + sin(aRad) * this._rayLen;
      stroke(c.ray); strokeWeight(3.5);
      line(this._cx, this._cy, fex, fey);
      this._arrow(fex, fey, 0);
      line(this._cx, this._cy, mex, mey);
      this._arrow(mex, mey, aRad);
      noStroke(); fill(c.vertex); circle(this._cx, this._cy, 12);
      fill(255); circle(this._cx, this._cy, 4);
      var hov = dist(mouseX, mouseY, mex, mey) < this._handleR + (_isTouch ? 20 : 10);
      if (this._isDragging || hov) {
        noFill(); stroke(c.handle); strokeWeight(2.5);
        circle(mex, mey, this._handleR * 2 + 12);
      }
      noStroke(); fill(c.handle); circle(mex, mey, this._handleR * 2);
      fill(255,255,255,200); circle(mex, mey, this._handleR);
      fill(c.handle); circle(mex, mey, 3);
    },

    _arrow: function (x, y, r) {
      push(); translate(x, y); rotate(r);
      noStroke(); fill(this._cols.ray);
      triangle(0, 0, -12, -5, -12, 5); pop();
    },

    _drawArc: function () {
      var deg = this._angle, c = this._cols;
      if (deg < 0.5) return;
      var endA = -radians(deg);
      fill(red(c.arc), green(c.arc), blue(c.arc), 25);
      noStroke(); beginShape(); vertex(this._cx, this._cy);
      for (var a = 0; a >= endA; a -= 0.04) {
        vertex(this._cx + cos(a) * this._arcR, this._cy + sin(a) * this._arcR);
      }
      vertex(this._cx + cos(endA) * this._arcR, this._cy + sin(endA) * this._arcR);
      endShape(CLOSE);
      noFill(); stroke(c.arc); strokeWeight(2.5);
      arc(this._cx, this._cy, this._arcR * 2, this._arcR * 2, endA, 0);
      if (Math.abs(deg - 90) < 1) {
        var sq = Math.min(16, this._arcR * 0.4);
        stroke(this._typeCols.right); strokeWeight(2.5); noFill();
        line(this._cx + sq, this._cy, this._cx + sq, this._cy - sq);
        line(this._cx + sq, this._cy - sq, this._cx, this._cy - sq);
      }
      if (!this._mobileMode) {
        var midR = -radians(deg / 2), lr = this._arcR + 18;
        noStroke(); fill(c.accent); textSize(14); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(Math.round(this._angle * 10) / 10 + "\u00B0",
          this._cx + cos(midR) * lr, this._cy + sin(midR) * lr);
        textStyle(NORMAL);
      }
    },

    _drawPtLabels: function () {
      var aRad = -radians(this._angle), off = 24, c = this._cols;
      var pA = this.o.pointLabels[0], pB = this.o.pointLabels[1], pC = this.o.pointLabels[2];
      noStroke(); textSize(rTextSize(15)); textStyle(BOLD); textAlign(CENTER, CENTER);
      fill(c.ray); text(pC, this._cx + this._rayLen + off, this._cy);
      fill(c.handle); text(pA, this._cx + cos(aRad) * (this._rayLen + off), this._cy + sin(aRad) * (this._rayLen + off));
      fill(c.vertex); text(pB, this._cx - 16, this._cy + 16);
      textStyle(NORMAL);
    },

    _getType: function (deg) {
      if (deg < 0.5) return { name: "Zero Angle", key: "full", desc: "The two rays overlap (0\u00B0)" };
      if (deg < 90) return { name: "Acute Angle", key: "acute", desc: "Less than 90\u00B0 \u2014 a sharp angle" };
      if (Math.abs(deg - 90) < 0.5) return { name: "Right Angle", key: "right", desc: "Exactly 90\u00B0 \u2014 a perfect corner" };
      if (deg < 180) return { name: "Obtuse Angle", key: "obtuse", desc: "Between 90\u00B0 and 180\u00B0" };
      if (Math.abs(deg - 180) < 0.5) return { name: "Straight Angle", key: "straight", desc: "Exactly 180\u00B0 \u2014 a straight line" };
      if (deg < 360) return { name: "Reflex Angle", key: "reflex", desc: "Between 180\u00B0 and 360\u00B0" };
      return { name: "Full Angle", key: "full", desc: "Exactly 360\u00B0 \u2014 full rotation" };
    },

    _isSpec: function (d) {
      for (var i = 0; i < this._SPECIAL.length; i++) if (Math.abs(d - this._SPECIAL[i]) < 1) return true;
      return false;
    },
    _nearSpec: function (d) {
      var n = d, m = 999;
      for (var i = 0; i < this._SPECIAL.length; i++) { var dd = Math.abs(d - this._SPECIAL[i]); if (dd < m) { m = dd; n = this._SPECIAL[i]; } }
      return { angle: n, dist: m };
    },
    _trigParts: function () {
      var mr = -radians(this._angle / 2);
      var px = this._cx + cos(mr) * this._arcR, py = this._cy + sin(mr) * this._arcR;
      for (var i = 0; i < 12; i++) {
        this._particles.push({ x: px, y: py, vx: random(-3,3), vy: random(-4,-1),
          c: color(random(180,255), random(100,255), random(50,200)), sz: random(3,8), life: 35 });
      }
    },
    _updateParts: function () {
      for (var i = this._particles.length - 1; i >= 0; i--) {
        var p = this._particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
        if (p.life <= 0) this._particles.splice(i, 1);
      }
      var d = Math.round(this._angle);
      if (this._isSpec(d) && this._lastSpecialHit !== d) { this._trigParts(); this._lastSpecialHit = d; }
      if (!this._isSpec(d)) this._lastSpecialHit = -1;
    },
    _drawParts: function () {
      for (var i = 0; i < this._particles.length; i++) {
        var p = this._particles[i], a = map(p.life, 0, 35, 0, 255);
        noStroke(); fill(red(p.c), green(p.c), blue(p.c), a);
        circle(p.x, p.y, p.sz);
      }
    },

    mousePressed: function () {
      // Mobile: tap name area to cycle naming style
      if (this._mobileMode && this._mobileNameBtn && insideBtn(this._mobileNameBtn)) {
        this._activeNameStyle = (this._activeNameStyle + 1) % 3;
        return;
      }
      for (var i = 0; i < this._quickBtns.length; i++) {
        if (insideBtn(this._quickBtns[i])) { this._targetAngle = this._quickBtns[i].angle; return; }
      }
      for (var j = 0; j < this._nameBtns.length; j++) {
        if (insideBtn(this._nameBtns[j])) { this._activeNameStyle = j; return; }
      }
      if (insideBtn(this._snapBtn)) { this._snapMode = !this._snapMode; return; }
      var aRad = -radians(this._angle);
      var hx = this._cx + cos(aRad) * this._rayLen;
      var hy = this._cy + sin(aRad) * this._rayLen;
      var hr = this._handleR + (_isTouch ? 24 : 14);
      if (dist(mouseX, mouseY, hx, hy) < hr) { this._isDragging = true; return; }
      var dC = dist(mouseX, mouseY, this._cx, this._cy);
      if (dC > 20 && dC < this._rayLen + 50 &&
          mouseX > this._leftW && mouseX < width - this._rightW &&
          mouseY > this._topH && mouseY < height - this._botH) {
        this._isDragging = true; this._updAngle();
      }
    },
    mouseDragged: function () { if (this._isDragging) this._updAngle(); },
    mouseReleased: function () { this._isDragging = false; },
    _updAngle: function () {
      var d = -degrees(atan2(mouseY - this._cy, mouseX - this._cx));
      if (d < 0) d += 360;
      if (this._snapMode) { var n = this._nearSpec(d); if (n.dist < 8) d = n.angle; }
      this._targetAngle = d; this._angle = d;
    }
  };

  // ============================================================
  // Export
  // ============================================================
  if (typeof window !== "undefined") {
    window.RippaMathCore = RippaMathCore;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = RippaMathCore;
  }

})();
