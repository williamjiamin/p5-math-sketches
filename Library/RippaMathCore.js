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

  /** Draw a canvas button and return true if hovered */
  function drawButton(btn, label, fg, bg, bgHover, borderColor) {
    var hover = mouseX >= btn.x && mouseX <= btn.x + btn.w &&
                mouseY >= btn.y && mouseY <= btn.y + btn.h;
    stroke(borderColor || fg);
    strokeWeight(2);
    fill(hover ? (bgHover || 245) : (bg || 255));
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();
    fill(fg || 30);
    textSize(btn.fontSize || 15);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    textStyle(NORMAL);
    return hover;
  }

  /** Check if mouse is inside a button rect */
  function insideBtn(btn) {
    return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
           mouseY >= btn.y && mouseY <= btn.y + btn.h;
  }

  /** Merge user options onto defaults */
  function mergeOpts(defaults, opts) {
    var result = {};
    for (var k in defaults) result[k] = defaults[k];
    if (opts) { for (var k2 in opts) result[k2] = opts[k2]; }
    return result;
  }

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
      axisY: null,          // auto = height * 0.67
      axisStartX: 100, axisEndX: null  // null = width - 100
    };
    this.o = mergeOpts(defaults, opts);
    this._dotX = null;
    this._isDragging = false;
    this._snapToTick = this.o.snap;
    // zoom state
    this._viewScale = 1;
    this._viewOffsetX = 0;
    this._viewOffsetY = 0;
    // animation state
    this._particles = [];
    this._sparkleRadius = 0;
    this._isAnimating = false;
    this._lastIntVal = null;
  };

  RippaMathCore.NumberLine.prototype = {
    _getAxisY: function () { return this.o.axisY || (height * 0.67); },
    _getStartX: function () { return this.o.axisStartX; },
    _getEndX: function () { return this.o.axisEndX || (width - 100); },

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

    /** Get current value */
    getValue: function () {
      if (this._dotX === null) return this.o.min;
      return this._xToValue(this._dotX);
    },

    /** Set marker value programmatically */
    setValue: function (v) {
      this._dotX = this._valueToX(clampVal(v, this.o.min, this.o.max));
    },

    draw: function () {
      var axY = this._getAxisY();
      var sX = this._getStartX();
      var eX = this._getEndX();

      // init dotX
      if (this.o.interactive && this._dotX === null) {
        this._dotX = map((this.o.min + this.o.max) / 2, this.o.min, this.o.max, sX, eX);
      }

      push();
      if (this.o.zoom) {
        translate(this._viewOffsetX, this._viewOffsetY);
        scale(this._viewScale);
      }

      // axis line
      stroke(50); strokeWeight(2);
      line(sX, axY, eX, axY);

      // sub-ticks
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

      // main ticks + labels
      var nTicks = (this.o.max - this.o.min) / this.o.tickSpacing + 1;
      for (var j = 0; j < nTicks; j++) {
        var tv = this.o.min + j * this.o.tickSpacing;
        var tx = this._valueToX(tv);
        stroke(50); strokeWeight(2);
        line(tx, axY - 15, tx, axY + 15);
        noStroke(); fill(50); textSize(14); textAlign(CENTER, CENTER);
        text(tv, tx, axY + 35);
      }

      // interactive marker
      if (this.o.interactive) {
        this._updateDot();
        if (this.o.showArrow) {
          this._drawArrowMarker();
        } else {
          noStroke(); fill(50, 150, 255);
          circle(this._dotX, axY, 20);
        }
        this._displayValue();
      }

      // animations
      if (this.o.animations) {
        this._updateAnimations();
        this._drawAnimations();
      }

      pop();

      // mode indicator (outside world transform)
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
      // sparkle ring
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
      // confetti
      for (var j = 0; j < this._particles.length; j++) {
        var pp = this._particles[j];
        fill(pp.c); noStroke(); circle(pp.x, pp.y, pp.sz);
      }
    },

    _drawArrowMarker: function () {
      var axY = this._getAxisY();
      var tipY = axY, headH = 18, headHW = 14, shaftH = 55, shaftW = 6;
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
      textSize(28); textStyle(BOLD);
      var iText = sgn + ip.toString();
      var iW = textWidth(iText);
      textSize(20); textStyle(NORMAL);
      var dText = "." + dp;
      var dW = textWidth(dText);
      var tW = iW + dW;
      var axY = this._getAxisY();
      var sX = this._dotX - tW / 2;

      fill(30, 50, 100); noStroke();
      textSize(28); textStyle(BOLD);
      text(iText, sX + iW / 2, axY - 120);
      fill(100, 120, 150); textSize(20); textStyle(NORMAL);
      text(dText, sX + iW + dW / 2, axY - 120);
    },

    _drawModeIndicator: function () {
      fill(50); noStroke(); textSize(16); textStyle(NORMAL); textAlign(LEFT, TOP);
      text("Mode: " + (this._snapToTick ? "SNAP TO TICK" : "SMOOTH"), 20, 30);
      text("(Press SPACE to toggle)", 20, 50);
    },

    mousePressed: function () {
      if (!this.o.interactive) return;
      var mx = this._worldMouseX(), my = this._worldMouseY();
      var axY = this._getAxisY();
      if (this.o.showArrow) {
        var tipY = axY, headH = 18, headHW = 14, shaftH = 55;
        var topY = tipY - headH - shaftH;
        var lx = this._dotX - Math.max(headHW, 6) - 6;
        var rx = this._dotX + Math.max(headHW, 6) + 6;
        if (mx >= lx && mx <= rx && my >= topY && my <= tipY) this._isDragging = true;
      } else {
        if (dist(mx, my, this._dotX, axY) < 20) this._isDragging = true;
      }
    },

    mouseReleased: function () { this._isDragging = false; },

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
    this._tryBtn = { x: 20, y: 20, w: 90, h: 36 };
    this._axisY = 0; this._axisStartX = 0; this._axisEndX = 0;
    this._inited = false;
  };

  RippaMathCore.DecimalCounter.prototype = {
    _layout: function () {
      this._axisY = height * 0.55;
      this._axisStartX = 120;
      this._axisEndX = width - 120;
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

      // prompt
      noStroke(); fill(40); textSize(18); textAlign(CENTER, CENTER);
      text("Use the points on the ends of the number line to find the value of a", width / 2, 40);

      // try button
      drawButton(this._tryBtn, "Try", color(30), color(255), color(245), color(40));

      // axis
      stroke(40); strokeWeight(3);
      line(sX, axY, eX, axY);
      drawAxisArrow(sX, axY, -1);
      drawAxisArrow(eX, axY, 1);

      // ticks
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
      // endpoint labels
      noStroke(); fill(60); textSize(16); textAlign(CENTER, CENTER);
      text(this._leftVal, lX, axY + 48);
      text(this._rightVal, rX, axY + 48);

      // endpoints
      this._drawEndpoint(lX, axY, this._leftVal.toString());
      this._drawEndpoint(rX, axY, this._rightVal.toString());

      // arches
      if (this.o.showArches && this._dragFrom) {
        var startV = this._dragFrom === "left" ? this._leftVal : this._rightVal;
        this._drawArches(startV, this._aValue);
      }

      // a marker
      var ax = this._valToX(this._aValue);
      fill(60, 120, 240); noStroke(); ellipse(ax, axY, 14, 14);
      fill(40, 90, 210); textSize(18); textStyle(ITALIC); textAlign(CENTER, CENTER);
      text("a", ax, axY + 26); textStyle(NORMAL);
      fill(230, 40, 120); textSize(18); textStyle(BOLD);
      text("a = " + formatDec(this._aValue), ax, axY - 56); textStyle(NORMAL);

      // formula
      if (this.o.showFormula && this._dragFrom) {
        var sv = this._dragFrom === "left" ? this._leftVal : this._rightVal;
        var steps = this._dragFrom === "left"
          ? Math.max(0, toTenthInt(this._aValue) - toTenthInt(sv))
          : Math.max(0, toTenthInt(sv) - toTenthInt(this._aValue));
        var op = this._dragFrom === "left" ? "+" : "-";
        var formula = sv + " " + op + " 0.1 \u00d7 " + steps + " = " + formatDec(this._aValue);
        noStroke(); fill(30, 60, 140); textSize(18); textAlign(CENTER, CENTER);
        text(formula, width / 2, axY + 88);
      }

      // feedback
      if (toTenthInt(this._aValue) === toTenthInt(this._targetA)) {
        noStroke(); fill(40, 90, 210); textSize(22); textStyle(BOLD); textAlign(CENTER, CENTER);
        text("Correct!  a = " + formatDec(this._targetA), width / 2, axY + 120);
        textStyle(NORMAL);
      }
    },

    _drawEndpoint: function (x, y, label) {
      noFill(); stroke(230, 40, 120); strokeWeight(4); ellipse(x, y, 34, 34);
      fill(230, 40, 120); noStroke(); ellipse(x, y, 12, 12);
      fill(230, 40, 120); textSize(18); textAlign(CENTER, CENTER); text(label, x, y - 34);
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
        noStroke(); fill(230, 40, 120); textSize(14); textAlign(CENTER, CENTER);
        text(dir > 0 ? "0.1" : "-0.1", mx, axY - stepPx * 0.55);
      }
    },

    mousePressed: function () {
      if (insideBtn(this._tryBtn)) { this.newRound(); return; }
      var lX = this._valToX(this._leftVal), rX = this._valToX(this._rightVal);
      var axY = this._axisY;
      if (dist(mouseX, mouseY, lX, axY) < 22) {
        this._dragFrom = "left"; this._isDragging = true; this._aValue = this._leftVal; return;
      }
      if (dist(mouseX, mouseY, rX, axY) < 22) {
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
    this._newBtn = { x: 0, y: 0, w: 160, h: 40 };
    this._inited = false;
  };

  RippaMathCore.AbsoluteValue.prototype = {
    _layout: function () {
      this._axisY = height * 0.5;
      this._axisStartX = 80; this._axisEndX = width - 80;
      this._newBtn.x = width - this._newBtn.w - 24;
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

      // instructions
      noStroke(); fill(40); textSize(20); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Absolute Value Visualization", width / 2, 32);
      textStyle(NORMAL); textSize(15); fill(90);
      text("Drag the marker. See how far it is from zero (absolute value).", width / 2, 58);

      // number line
      stroke(40); strokeWeight(3);
      line(this._axisStartX, axY, this._axisEndX, axY);
      drawAxisArrow(this._axisStartX, axY, -1);
      drawAxisArrow(this._axisEndX, axY, 1);

      for (var v = this.o.min; v <= this.o.max; v += this.o.tickSpacing) {
        var x = this._valToX(v);
        var isLabel = v % this.o.labelInterval === 0;
        stroke(30); strokeWeight(isLabel ? 3 : 2);
        var h = isLabel ? 18 : 10;
        line(x, axY - h / 2, x, axY + h);
        if (isLabel) {
          noStroke(); fill(60); textSize(14); textAlign(CENTER, CENTER);
          text(v, x, axY + 36);
        }
      }

      // school at 0
      var schoolX = this._valToX(0);
      noStroke(); fill(40); textSize(12); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Zero / Origin", schoolX, axY - 70); textStyle(NORMAL);
      fill(60); textSize(14); text("0", schoolX, axY - 50);
      stroke(50); strokeWeight(2); line(schoolX, axY - 40, schoolX, axY - 6);
      noStroke(); fill(50);
      triangle(schoolX - 5, axY - 6, schoolX + 5, axY - 6, schoolX, axY);

      // person marker
      var px = this._valToX(this._personValue);
      if (this._isDragging) {
        noFill(); stroke(140, 80, 180); strokeWeight(3);
        ellipse(px, axY - 55, 44, 44);
      }
      noStroke(); fill(50, 150, 255); ellipse(px, axY - 55, 30, 30);
      noFill(); stroke(60, 60, 80); strokeWeight(2); ellipse(px, axY - 55, 30, 30);
      stroke(50); strokeWeight(2); line(px, axY - 40, px, axY - 6);
      noStroke(); fill(50);
      triangle(px - 5, axY - 6, px + 5, axY - 6, px, axY);
      fill(60, 40, 120); textSize(14); textAlign(CENTER, CENTER);
      text(this._personValue, px, axY - 85);

      // distance feedback
      if (this._personValue !== 0) {
        var dU = Math.abs(this._personValue);
        var leftX = Math.min(px, schoolX), rightX = Math.max(px, schoolX);
        var dLineY = axY - 100;
        stroke(34, 100, 50); strokeWeight(2);
        line(px, axY - 70, px, dLineY);
        line(schoolX, axY - 70, schoolX, dLineY);
        strokeWeight(4);
        line(leftX, dLineY, rightX, dLineY);
        noStroke(); fill(20, 80, 40); textSize(16); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(dU, (leftX + rightX) / 2, dLineY - 14);
        textStyle(NORMAL);

        noStroke(); fill(40); textSize(16); textAlign(CENTER, CENTER);
        text("Distance from zero = " + dU, width / 2, axY + 78);
        text("| " + this._personValue + " | = " + dU, width / 2, axY + 100);
      } else {
        noStroke(); fill(40, 120, 60); textSize(22); textStyle(BOLD); textAlign(CENTER, CENTER);
        text("At zero!", width / 2, axY + 95);
        textStyle(NORMAL);
      }

      // button
      drawButton(this._newBtn, "NEW DISTANCE", color(80, 40, 120),
        color(230, 220, 245), color(200, 200, 230), color(80, 40, 120));
    },

    mousePressed: function () {
      if (insideBtn(this._newBtn)) { this.newRound(); return; }
      var px = this._valToX(this._personValue);
      var cY = this._axisY - 55;
      if (dist(mouseX, mouseY, px, cY) <= 40) this._isDragging = true;
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
      animated: false // if true, shows animated bar calculation (sketch 10)
    };
    this.o = mergeOpts(defaults, opts);
    this._personAVal = -5;
    this._personBVal = 7;
    this._dragTarget = null; this._isDragging = false;
    this._axisY = 0; this._axisStartX = 0; this._axisEndX = 0;
    this._newBtn = { x: 0, y: 0, w: 160, h: 40 };
    this._inited = false;
  };

  RippaMathCore.DistanceBetween.prototype = {
    _layout: function () {
      this._axisY = height * 0.4;
      this._axisStartX = 80; this._axisEndX = width - 80;
      this._newBtn.x = width - this._newBtn.w - 24;
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

      // instructions
      noStroke(); fill(40); textSize(20); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Distance Between Two Points", width / 2, 32);
      textStyle(NORMAL); textSize(15); fill(90);
      text("Drag either marker. Distance = | A \u2212 B |", width / 2, 58);

      // number line
      stroke(40); strokeWeight(3);
      line(this._axisStartX, axY, this._axisEndX, axY);
      drawAxisArrow(this._axisStartX, axY, -1);
      drawAxisArrow(this._axisEndX, axY, 1);
      for (var v = this.o.min; v <= this.o.max; v += this.o.tickSpacing) {
        var x = this._valToX(v);
        var isLabel = v % this.o.labelInterval === 0;
        stroke(30); strokeWeight(isLabel ? 3 : 2);
        var h = isLabel ? 18 : 10;
        line(x, axY - h / 2, x, axY + h);
        if (isLabel) {
          noStroke(); fill(60); textSize(14); textAlign(CENTER, CENTER); text(v, x, axY + 36);
        }
      }

      // markers
      var ax = this._valToX(this._personAVal);
      var bx = this._valToX(this._personBVal);
      var mY = axY - 55;

      // A marker
      if (this._dragTarget === "A") {
        noFill(); stroke(140, 80, 180); strokeWeight(3); ellipse(ax, mY, 44, 44);
      }
      noStroke(); fill(230, 130, 50); ellipse(ax, mY, 28, 28);
      noFill(); stroke(60); strokeWeight(2); ellipse(ax, mY, 28, 28);
      stroke(50); strokeWeight(2); line(ax, mY + 14, ax, axY - 6);
      noStroke(); fill(50); triangle(ax - 5, axY - 6, ax + 5, axY - 6, ax, axY);
      fill(180, 100, 30); textSize(14); textAlign(CENTER, CENTER);
      text("A = " + this._personAVal, ax, mY - 28);

      // B marker
      if (this._dragTarget === "B") {
        noFill(); stroke(80, 100, 160); strokeWeight(3); ellipse(bx, mY, 44, 44);
      }
      noStroke(); fill(50, 100, 200); ellipse(bx, mY, 28, 28);
      noFill(); stroke(60); strokeWeight(2); ellipse(bx, mY, 28, 28);
      stroke(50); strokeWeight(2); line(bx, mY + 14, bx, axY - 6);
      noStroke(); fill(50); triangle(bx - 5, axY - 6, bx + 5, axY - 6, bx, axY);
      fill(30, 70, 150); textSize(14); textAlign(CENTER, CENTER);
      text("B = " + this._personBVal, bx, mY - 28);

      // distance bracket
      var dU = this.getDistance();
      if (dU > 0) {
        var leftX = Math.min(ax, bx), rightX = Math.max(ax, bx);
        var dLY = mY - 30;
        stroke(34, 100, 50); strokeWeight(2);
        line(ax, mY - 14, ax, dLY); line(bx, mY - 14, bx, dLY);
        strokeWeight(4); line(leftX, dLY, rightX, dLY);
        noStroke(); fill(20, 80, 40); textSize(16); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(dU, (leftX + rightX) / 2, dLY - 14); textStyle(NORMAL);
      }

      // feedback text
      noStroke(); fill(40); textSize(16); textAlign(CENTER, CENTER);
      var fY = axY + 70;
      if (dU === 0) {
        fill(40, 120, 60); textSize(18); textStyle(BOLD);
        text("Same position! Distance is 0.", width / 2, fY); textStyle(NORMAL);
      } else {
        text("Distance = | " + this._personAVal + " \u2212 " + this._personBVal + " | = " + dU, width / 2, fY);
        textStyle(BOLD);
        text("| " + this._personAVal + " \u2212 (" + this._personBVal + ") | = " + dU, width / 2, fY + 24);
        textStyle(NORMAL);
      }

      // button
      drawButton(this._newBtn, "NEW POSITIONS", color(80, 40, 120),
        color(230, 220, 245), color(200, 200, 230), color(80, 40, 120));
    },

    mousePressed: function () {
      if (insideBtn(this._newBtn)) { this.newRound(); return; }
      var mY = this._axisY - 55;
      var ax = this._valToX(this._personAVal);
      var bx = this._valToX(this._personBVal);
      if (dist(mouseX, mouseY, ax, mY) <= 30) { this._dragTarget = "A"; this._isDragging = true; return; }
      if (dist(mouseX, mouseY, bx, mY) <= 30) { this._dragTarget = "B"; this._isDragging = true; }
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

      // title
      noStroke(); fill(40); textSize(18); textStyle(BOLD); textAlign(CENTER, TOP);
      text("2D Coordinate Grid", width / 2, 10); textStyle(NORMAL);

      // grid lines
      for (var i = gMin; i <= gMax; i++) {
        var s = this._gridToScreen(i, 0);
        var sy1 = this._gridToScreen(0, gMin);
        var sy2 = this._gridToScreen(0, gMax);
        stroke(220); strokeWeight(1);
        line(s.x, sy1.y, s.x, sy2.y); // vertical
        var sh = this._gridToScreen(gMin, i);
        var sh2 = this._gridToScreen(gMax, i);
        line(sh.x, sh.y, sh2.x, sh2.y); // horizontal
      }

      // axes
      var ox = this._gridToScreen(0, 0);
      var xEnd = this._gridToScreen(gMax, 0);
      var xStart = this._gridToScreen(gMin, 0);
      var yEnd = this._gridToScreen(0, gMax);
      var yStart = this._gridToScreen(0, gMin);

      stroke(0); strokeWeight(2);
      line(xStart.x, ox.y, xEnd.x, ox.y); // x-axis
      line(ox.x, yStart.y, ox.x, yEnd.y); // y-axis

      // axis labels
      noStroke(); fill(0); textSize(12); textAlign(CENTER, CENTER);
      for (var j = gMin; j <= gMax; j++) {
        if (j === 0) continue;
        var tx = this._gridToScreen(j, 0);
        text(j, tx.x, ox.y + 16);
        var ty = this._gridToScreen(0, j);
        text(j, ox.x - 18, ty.y);
      }
      textSize(14); textStyle(BOLD);
      text("x", xEnd.x + 16, ox.y);
      text("y", ox.x, yEnd.y - 16);
      textStyle(NORMAL);
      text("0", ox.x - 14, ox.y + 14);

      // game mode target
      if (this.o.gameMode) {
        var tPos = this._gridToScreen(this._targetX, this._targetY);
        noStroke(); fill(255, 100, 100, 180);
        circle(tPos.x, tPos.y, 20);
        fill(180, 0, 0); textSize(12);
        text("Target (" + this._targetX + ", " + this._targetY + ")", tPos.x, tPos.y - 18);
      }

      // draggable point
      var pp = this._gridToScreen(this._pointX, this._pointY);
      if (this._isDragging) {
        noFill(); stroke(50, 150, 255, 150); strokeWeight(3);
        ellipse(pp.x, pp.y, 36, 36);
      }
      noStroke(); fill(50, 150, 255);
      circle(pp.x, pp.y, 16);
      fill(30, 50, 100); textSize(14); textStyle(BOLD);
      text("(" + this._pointX + ", " + this._pointY + ")", pp.x, pp.y - 20);
      textStyle(NORMAL);

      // game score
      if (this.o.gameMode) {
        fill(40); textSize(16); textAlign(LEFT, TOP);
        text("Score: " + this._score, 12, 40);
        if (this._pointX === this._targetX && this._pointY === this._targetY) {
          fill(40, 160, 60); textSize(20); textStyle(BOLD); textAlign(CENTER, CENTER);
          text("Correct! Click to continue.", width / 2, height - 30);
          textStyle(NORMAL);
        }
      }
    },

    mousePressed: function () {
      var pp = this._gridToScreen(this._pointX, this._pointY);
      if (dist(mouseX, mouseY, pp.x, pp.y) < 24) {
        this._isDragging = true; return;
      }
      // game mode: click to advance if correct
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
  };

  RippaMathCore.Coordinate3D.prototype = {
    draw: function () {
      // This class requires WEBGL renderer
      if (!this._inited) { this._inited = true; }

      var gMin = this.o.gridMin, gMax = this.o.gridMax;
      var sc = 40; // scale: 1 unit = 40 px

      // Camera
      var cX = this._camDist * cos(this._camEl) * sin(this._camAz);
      var cY = -this._camDist * sin(this._camEl);
      var cZ = this._camDist * cos(this._camEl) * cos(this._camAz);
      camera(cX, cY, cZ, 0, 0, 0, 0, 1, 0);
      orbitControl(2, 2, 0.5);

      // Title text (in 2D overlay is not easy in WEBGL, skip)

      // Grid floor (xz plane)
      push();
      stroke(200); strokeWeight(0.5);
      for (var i = gMin; i <= gMax; i++) {
        line(i * sc, 0, gMin * sc, i * sc, 0, gMax * sc); // along z
        line(gMin * sc, 0, i * sc, gMax * sc, 0, i * sc); // along x
      }
      pop();

      // Axes
      push(); strokeWeight(2);
      // X axis (red)
      stroke(220, 50, 50);
      line(gMin * sc, 0, 0, gMax * sc, 0, 0);
      // Y axis (green) — up
      stroke(50, 180, 50);
      line(0, -gMax * sc, 0, 0, -gMin * sc, 0);
      // Z axis (blue)
      stroke(50, 50, 220);
      line(0, 0, gMin * sc, 0, 0, gMax * sc);
      pop();

      // Point
      push();
      translate(this._ptX * sc, -this._ptY * sc, this._ptZ * sc);
      noStroke(); fill(255, 100, 50);
      sphere(8);
      pop();

      // Dashed lines from point to axes
      push(); stroke(100); strokeWeight(1);
      // vertical line from point down to xz
      line(this._ptX * sc, -this._ptY * sc, this._ptZ * sc,
           this._ptX * sc, 0, this._ptZ * sc);
      // line from xz projection to x-axis
      line(this._ptX * sc, 0, this._ptZ * sc, this._ptX * sc, 0, 0);
      // line from xz projection to z-axis
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

    mouseReleased: function () { this._isDragging = false; },

    mouseWheel: function (event) {
      this._camDist = constrain(this._camDist + event.delta * 0.5, 100, 2000);
      return false;
    },

    /** Set point position */
    setPoint: function (x, y, z) {
      this._ptX = x; this._ptY = y; this._ptZ = z;
    }
  };

  // ============================================================
  // RippaMathCore.AngleExplorer  (sketch 15)
  // ============================================================
  // Layout: LEFT panel (naming) | CENTER (angle viz) | RIGHT panel (data)
  //         BOTTOM bar (quick-jump buttons + snap toggle)
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
    // Layout
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
      this._leftW = constrain(w * 0.20, 150, 220);
      this._rightW = constrain(w * 0.20, 150, 220);
      var vizL = this._leftW, vizR = w - this._rightW;
      this._cx = (vizL + vizR) / 2;
      this._cy = this._topH + (h - this._topH - this._botH) / 2;
      var vizW = vizR - vizL, vizH = h - this._topH - this._botH;
      this._rayLen = constrain(Math.min(vizW, vizH) * 0.28, 60, 200);
      this._arcR = this._rayLen * 0.32;
      this._handleR = Math.max(8, this._rayLen * 0.08);

      // Bottom bar buttons
      var barY = h - this._botH + 12;
      var bw = 50, bh = 28, bg = 5;
      var tw = this._QUICK.length * (bw + bg) - bg;
      var gw = tw + 16 + this._snapBtn.w;
      var sx = (w - gw) / 2;
      this._quickBtns = [];
      for (var i = 0; i < this._QUICK.length; i++) {
        this._quickBtns.push({ x: sx + i * (bw + bg), y: barY, w: bw, h: bh, angle: this._QUICK[i] });
      }
      this._snapBtn.x = sx + tw + 16;
      this._snapBtn.y = barY;
      this._snapBtn.h = bh;

      // Left panel naming buttons
      var nW = this._leftW - 30, nH = 36, nG = 7;
      var nY = this._topH + 80;
      this._nameBtns = [];
      for (var j = 0; j < 3; j++) {
        this._nameBtns.push({ x: 15, y: nY + j * (nH + nG), w: nW, h: nH });
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

      this._drawTitleBar();
      if (this.o.showNaming) this._drawLeftPanel();
      this._drawRightPanel();
      this._drawBottomBar();
      if (this.o.showSpecialMarkers) this._drawMarkers();
      this._drawRays();
      this._drawArc();
      this._drawPtLabels();
      this._updateParts();
      this._drawParts();
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

      // Active name card
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

      // How to read
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

      // Measurement section
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

      // Type section
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

      // Range bar
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
      noStroke(); fill(c.muted); textSize(10); textStyle(BOLD); textAlign(CENTER, CENTER);
      text("Quick Jump to Special Angles", width / 2, bt + 9); textStyle(NORMAL);
      var deg = Math.round(this._angle * 10) / 10;
      for (var i = 0; i < this._quickBtns.length; i++) {
        var btn = this._quickBtns[i], act = Math.abs(deg - btn.angle) < 1;
        var hov = insideBtn(btn);
        if (act) { fill(c.special); stroke(210,150,30); strokeWeight(2); }
        else if (hov) { fill(240,238,255); stroke(c.accent); strokeWeight(2); }
        else { fill(c.cardBg); stroke(c.cardBorder); strokeWeight(1); }
        rect(btn.x, btn.y, btn.w, btn.h, 7);
        noStroke(); fill(act ? 255 : c.text);
        textSize(12); textStyle(BOLD); textAlign(CENTER, CENTER);
        text(btn.angle + "\u00B0", btn.x + btn.w / 2, btn.y + btn.h / 2); textStyle(NORMAL);
      }
      // Snap
      var sh = insideBtn(this._snapBtn);
      if (this._snapMode) { fill(red(c.snapOn),green(c.snapOn),blue(c.snapOn),30); stroke(c.snapOn); strokeWeight(2); }
      else if (sh) { fill(240,245,255); stroke(c.accent); strokeWeight(1.5); }
      else { fill(c.cardBg); stroke(c.cardBorder); strokeWeight(1); }
      rect(this._snapBtn.x, this._snapBtn.y, this._snapBtn.w, this._snapBtn.h, 7);
      noStroke(); fill(this._snapMode ? c.snapOn : c.text);
      textSize(10); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(this._snapMode ? "\u2713 Snap ON" : "Snap to Special",
        this._snapBtn.x + this._snapBtn.w / 2, this._snapBtn.y + this._snapBtn.h / 2);
      textStyle(NORMAL);
      // Hint
      fill(185); textSize(8); textAlign(CENTER, CENTER);
      text("Drag handle \u2022 Click buttons \u2022 Toggle snap", width / 2, height - 8);
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
      var hov = dist(mouseX, mouseY, mex, mey) < this._handleR + 10;
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
      var midR = -radians(deg / 2), lr = this._arcR + 18;
      noStroke(); fill(c.accent); textSize(14); textStyle(BOLD); textAlign(CENTER, CENTER);
      text(Math.round(this._angle * 10) / 10 + "\u00B0",
        this._cx + cos(midR) * lr, this._cy + sin(midR) * lr);
      textStyle(NORMAL);
    },

    _drawPtLabels: function () {
      var aRad = -radians(this._angle), off = 24, c = this._cols;
      var pA = this.o.pointLabels[0], pB = this.o.pointLabels[1], pC = this.o.pointLabels[2];
      noStroke(); textSize(15); textStyle(BOLD); textAlign(CENTER, CENTER);
      fill(c.ray); text(pC, this._cx + this._rayLen + off, this._cy);
      fill(c.handle); text(pA, this._cx + cos(aRad) * (this._rayLen + off), this._cy + sin(aRad) * (this._rayLen + off));
      fill(c.vertex); text(pB, this._cx - 18, this._cy + 18);
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
      if (dist(mouseX, mouseY, hx, hy) < this._handleR + 14) { this._isDragging = true; return; }
      var dC = dist(mouseX, mouseY, this._cx, this._cy);
      if (dC > 25 && dC < this._rayLen + 50 &&
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
