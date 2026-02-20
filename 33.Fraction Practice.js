/* jshint esversion: 6 */
// ============================================================
// 33. Fraction Practice — Exercise module for fraction skills
// ============================================================
const ORIG_W = 800;
const ORIG_H = 600;

var PROBLEM_TYPES = ["compare", "simplify", "add", "subtract"];
var difficulty = "easy";
var diffRanges = {
  easy:   { min: 2, max: 6,  mixed: false },
  medium: { min: 2, max: 12, mixed: false },
  hard:   { min: 2, max: 12, mixed: true }
};

var problem = null;
var choices = [];
var selected = -1;
var answered = false;
var correct = false;
var score = 0;
var total = 0;
var streak = 0;
var bestStreak = 0;

var celebrationParticles = [];
var btnNext, btnDiffEasy, btnDiffMed, btnDiffHard;
var choiceBtns = [];
var feedbackTimer = 0;

function setup() {
  createCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  textFont("Arial");
  textAlign(CENTER, CENTER);
  buildLayout();
  generateProblem();
}

function windowResized() {
  resizeCanvas(Math.min(ORIG_W, windowWidth), Math.min(ORIG_H, windowHeight));
  buildLayout();
}

function buildLayout() {
  var bh = 30, bw = 80;
  var dy = height * 0.06;
  btnDiffEasy = { x: width * 0.28, y: dy, w: bw, h: bh, label: "Easy",   diff: "easy" };
  btnDiffMed  = { x: width * 0.44, y: dy, w: bw, h: bh, label: "Medium", diff: "medium" };
  btnDiffHard = { x: width * 0.60, y: dy, w: bw, h: bh, label: "Hard",   diff: "hard" };
  btnNext = { x: width * 0.38, y: height * 0.88, w: 180, h: 36, label: "Next Problem" };
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }

function randInt(lo, hi) { return Math.floor(random(lo, hi + 1)); }

function makeFrac(cfg) {
  var d = randInt(cfg.min, cfg.max);
  var n = randInt(1, d - 1);
  if (cfg.mixed && random() < 0.4) n += d;
  return { n: n, d: d };
}

function generateProblem() {
  selected = -1;
  answered = false;
  correct = false;
  feedbackTimer = 0;

  var cfg = diffRanges[difficulty];
  var type = PROBLEM_TYPES[Math.floor(random(PROBLEM_TYPES.length))];

  if (type === "compare") {
    var a = makeFrac(cfg);
    var b = makeFrac(cfg);
    while (a.n / a.d === b.n / b.d) b = makeFrac(cfg);
    var ans = (a.n / a.d) > (b.n / b.d) ? ">" : (a.n / a.d) < (b.n / b.d) ? "<" : "=";
    problem = { type: type, a: a, b: b, answer: ans,
      question: "Compare:  " + fracStr(a) + "  ___  " + fracStr(b) };
    choices = [
      { label: ">", value: ">" },
      { label: "<", value: "<" },
      { label: "=", value: "=" }
    ];
  } else if (type === "simplify") {
    var mult = randInt(2, 5);
    var sd = randInt(cfg.min, Math.min(cfg.max, 6));
    var sn = randInt(1, sd - 1);
    while (gcd(sn, sd) > 1) { sn = randInt(1, sd - 1); }
    var un = sn * mult;
    var ud = sd * mult;
    problem = { type: type, frac: { n: un, d: ud }, answer: sn + "/" + sd,
      question: "Simplify:  " + un + "/" + ud };
    choices = generateSimplifyChoices(sn, sd, un, ud);
  } else if (type === "add" || type === "subtract") {
    var f1 = makeFrac(cfg);
    var f2 = makeFrac(cfg);
    if (type === "subtract" && f1.n / f1.d < f2.n / f2.d) {
      var t = f1; f1 = f2; f2 = t;
    }
    var cd = lcm(f1.d, f2.d);
    var rn;
    if (type === "add") {
      rn = f1.n * (cd / f1.d) + f2.n * (cd / f2.d);
    } else {
      rn = f1.n * (cd / f1.d) - f2.n * (cd / f2.d);
    }
    var g = gcd(Math.abs(rn), cd);
    var ansN = rn / g;
    var ansD = cd / g;
    var opSym = type === "add" ? "+" : "−";
    problem = { type: type, a: f1, b: f2, answer: ansN + "/" + ansD,
      question: fracStr(f1) + "  " + opSym + "  " + fracStr(f2) + "  = ?" };
    choices = generateArithChoices(ansN, ansD, f1, f2);
  }

  positionChoices();
}

function fracStr(f) { return f.n + "/" + f.d; }

function generateSimplifyChoices(sn, sd, un, ud) {
  var ans = sn + "/" + sd;
  var opts = [{ label: ans, value: ans }];
  var attempts = 0;
  while (opts.length < 4 && attempts < 20) {
    var fn = randInt(1, sd);
    var fd = randInt(2, sd + 2);
    var opt = fn + "/" + fd;
    if (opt !== ans && !opts.some(function(o) { return o.value === opt; })) {
      opts.push({ label: opt, value: opt });
    }
    attempts++;
  }
  while (opts.length < 4) opts.push({ label: "1/1", value: "1/1" });
  return shuffleArray(opts);
}

function generateArithChoices(ansN, ansD, f1, f2) {
  var ans = ansN + "/" + ansD;
  var opts = [{ label: ans, value: ans }];
  var attempts = 0;
  while (opts.length < 4 && attempts < 20) {
    var vn = ansN + randInt(-3, 3);
    var vd = ansD + randInt(-1, 1);
    if (vn <= 0) vn = 1;
    if (vd <= 0) vd = 2;
    var g = gcd(Math.abs(vn), vd);
    var opt = (vn / g) + "/" + (vd / g);
    if (opt !== ans && !opts.some(function(o) { return o.value === opt; })) {
      opts.push({ label: opt, value: opt });
    }
    attempts++;
  }
  while (opts.length < 4) opts.push({ label: "1/2", value: "1/2" });
  return shuffleArray(opts);
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(random(i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function positionChoices() {
  choiceBtns = [];
  var totalW = choices.length * 120 + (choices.length - 1) * 12;
  var startX = (width - totalW) / 2;
  for (var i = 0; i < choices.length; i++) {
    choiceBtns.push({
      x: startX + i * 132,
      y: height * 0.6,
      w: 120, h: 40,
      idx: i
    });
  }
}

function draw() {
  background(245, 247, 252);
  if (feedbackTimer > 0) feedbackTimer--;

  drawTitle();
  drawDifficulty();
  drawScore();
  drawQuestion();
  drawVisualBar();
  drawChoices();
  drawFeedback();
  if (answered) drawNextBtn();
  updateCelebration();
}

function drawTitle() {
  noStroke();
  fill(40, 40, 60);
  textSize(Math.min(22, width * 0.03));
  text("Fraction Practice", width / 2, 28);
}

function drawDifficulty() {
  var btns = [btnDiffEasy, btnDiffMed, btnDiffHard];
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    var active = b.diff === difficulty;
    fill(active ? color(80, 60, 200) : color(200, 205, 220));
    noStroke();
    rect(b.x, b.y, b.w, b.h, 8);
    fill(active ? 255 : 80);
    textSize(13);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

function drawScore() {
  noStroke();
  fill(40, 40, 60);
  textSize(14);
  textAlign(RIGHT, CENTER);
  text("Score: " + score + "/" + total + "   Streak: " + streak + " (Best: " + bestStreak + ")", width - 20, 28);
  textAlign(CENTER, CENTER);
}

function drawQuestion() {
  if (!problem) return;
  noStroke();

  fill(255, 255, 255, 230);
  stroke(215, 220, 235);
  strokeWeight(1);
  rect(width * 0.1, height * 0.16, width * 0.8, 60, 12);

  noStroke();
  fill(40, 40, 60);
  textSize(20);
  text(problem.question, width / 2, height * 0.16 + 30);
}

function drawVisualBar() {
  if (!problem) return;
  var barY = height * 0.4;
  var barH = 24;
  var barW = width * 0.35;

  if (problem.type === "compare" || problem.type === "add" || problem.type === "subtract") {
    var a = problem.a;
    var b = problem.b;
    drawFracBar(width * 0.15, barY, barW, barH, a.n, a.d, color(80, 160, 255));
    drawFracBar(width * 0.55, barY, barW, barH, b.n, b.d, color(255, 140, 80));
  } else if (problem.type === "simplify") {
    drawFracBar(width * 0.25, barY, barW, barH, problem.frac.n, problem.frac.d, color(100, 200, 140));
  }
}

function drawFracBar(x, y, w, h, n, d, c) {
  stroke(200, 205, 220);
  strokeWeight(1);
  fill(240, 242, 248);
  rect(x, y, w, h, 4);

  var segW = w / d;
  noStroke();
  for (var i = 0; i < Math.min(n, d); i++) {
    fill(c);
    rect(x + i * segW + 1, y + 1, segW - 2, h - 2, 3);
  }

  stroke(200, 205, 220);
  strokeWeight(1);
  for (var j = 1; j < d; j++) {
    line(x + j * segW, y, x + j * segW, y + h);
  }

  noStroke();
  fill(40, 40, 60);
  textSize(12);
  text(n + "/" + d, x + w / 2, y + h + 14);
}

function drawChoices() {
  for (var i = 0; i < choiceBtns.length; i++) {
    var b = choiceBtns[i];
    var hover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
    var isSelected = (selected === i);
    var isCorrectChoice = answered && choices[i].value === problem.answer;
    var isWrong = answered && isSelected && !correct;

    if (isCorrectChoice && answered) {
      fill(color(50, 190, 100));
    } else if (isWrong) {
      fill(color(230, 70, 70));
    } else if (isSelected) {
      fill(color(80, 60, 200));
    } else {
      fill(hover ? color(120, 110, 240) : color(255));
    }

    stroke(isSelected || hover ? color(80, 60, 200) : color(200, 205, 220));
    strokeWeight(isSelected ? 2 : 1);
    rect(b.x, b.y, b.w, b.h, 10);

    noStroke();
    fill(isSelected || (isCorrectChoice && answered) || isWrong ? 255 : color(40, 40, 60));
    textSize(16);
    text(choices[i].label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

function drawFeedback() {
  if (!answered) return;
  noStroke();
  textSize(22);
  if (correct) {
    fill(50, 190, 100);
    text("Correct!", width / 2, height * 0.76);
  } else {
    fill(230, 70, 70);
    text("Answer: " + problem.answer, width / 2, height * 0.76);
  }
}

function drawNextBtn() {
  var b = btnNext;
  var hover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
  fill(hover ? color(80, 60, 200) : color(100, 110, 240));
  noStroke();
  rect(b.x, b.y, b.w, b.h, 10);
  fill(255);
  textSize(15);
  text(b.label, b.x + b.w / 2, b.y + b.h / 2);
}

function updateCelebration() {
  for (var i = celebrationParticles.length - 1; i >= 0; i--) {
    var p = celebrationParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 2;
    if (p.life <= 0) { celebrationParticles.splice(i, 1); continue; }
    noStroke();
    fill(p.r, p.g, p.b, p.life);
    var sz = p.s * (p.life / 255);
    ellipse(p.x, p.y, sz, sz);
  }
}

function celebrate() {
  for (var k = 0; k < 30; k++) {
    celebrationParticles.push({
      x: width / 2 + random(-100, 100), y: height * 0.5,
      vx: random(-5, 5), vy: random(-8, -2),
      life: 255, s: random(6, 14),
      r: random(80, 255), g: random(80, 255), b: random(80, 255)
    });
  }
}

function mousePressed() {
  var diffs = [btnDiffEasy, btnDiffMed, btnDiffHard];
  for (var d = 0; d < diffs.length; d++) {
    var db = diffs[d];
    if (mouseX > db.x && mouseX < db.x + db.w && mouseY > db.y && mouseY < db.y + db.h) {
      difficulty = db.diff;
      generateProblem();
      return;
    }
  }

  if (answered) {
    var nb = btnNext;
    if (mouseX > nb.x && mouseX < nb.x + nb.w && mouseY > nb.y && mouseY < nb.y + nb.h) {
      generateProblem();
      return;
    }
  }

  if (!answered) {
    for (var i = 0; i < choiceBtns.length; i++) {
      var b = choiceBtns[i];
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        selected = i;
        answered = true;
        total++;
        correct = (choices[i].value === problem.answer);
        if (correct) {
          score++;
          streak++;
          if (streak > bestStreak) bestStreak = streak;
          if (streak >= 3) celebrate();
        } else {
          streak = 0;
        }
        return;
      }
    }
  }
}
