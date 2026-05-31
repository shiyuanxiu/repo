const FORTUNES = [
  "Try a new recipe", "Message someone important", "Sleep early tonight",
  "Walk outside for 15 minutes", "Tidy your desk", "Listen to a new song",
  "Write three things you're grateful for", "Drink a glass of water", "Read 10 pages", "Stretch for 5 minutes",
  "Photo today's sky", "Try a new tea or coffee", "Phone off for 30 minutes",
  "Add flowers or a plant to your room", "Learn a new word", "Smile at the first person you meet",
  "Delete 100 photos from your camera roll", "Do one thing you've been putting off", "Say something kind to yourself",
  "Plan a short trip",
];

const EARTH_TASKS = [
  "Learn a nursery rhyme", "Message someone important", "Walk outside for 15 minutes",
  "Write three grateful things", "Try a new recipe", "Read 10 pages",
  "Smile at the first person you meet", "Stretch for 5 minutes", "Tidy your desk",
  "Listen to a new song", "Photo today's sky", "Say something kind to yourself",
  "Drink a glass of water", "Phone off for 30 minutes", "Learn a new word",
  "Do one delayed task", "Add flowers or a plant", "Plan a short trip",
];

/* ===== 状态 ===== */
let lastFortuneIndex = -1;
let lastFortuneText = "";
let isDrawing = false;
let audioCtx = null;
let fortuneBgm = null;
let earthBgm = null;
let shopBgm = null;
let leapBgm = null;
let runBgm = null;
let lastEarthTaskIndex = -1;
let currentEarthTask = "";
let lastCompletedEarthTask = "";

const soundState = { fortune: true, earth: true, chick: true, block: true, shop: true, leap: true, run: true, face: true, box: true, sente: true, pet: true, spot: true, mj: true, star: true, stack: true, match: true, merge: true, beat: true };

/* ===== DOM ===== */
const drawScene = document.getElementById("drawScene");
const resultScene = document.getElementById("resultScene");
const tubeArea = document.getElementById("tubeArea");
const tubeWrapper = document.getElementById("tubeWrapper");
const fortuneStick = document.getElementById("fortuneStick");
const fortuneText = document.getElementById("fortuneText");
const drawAgainBtn = document.getElementById("drawAgainBtn");
const fortuneShareBtn = document.getElementById("fortuneShareBtn");
const resetFortuneBtn = document.getElementById("resetFortuneBtn");
const earthHome = document.getElementById("earthHome");
const earthTask = document.getElementById("earthTask");
const earthReward = document.getElementById("earthReward");
const earthHistory = document.getElementById("earthHistory");
const earthTaskName = document.getElementById("earthTaskName");
const earthRandomBtn = document.getElementById("earthRandomBtn");
const earthDoneBtn = document.getElementById("earthDoneBtn");
const earthBackBtn = document.getElementById("earthBackBtn");
const earthShareBtn = document.getElementById("earthShareBtn");
const earthHistoryBtn = document.getElementById("earthHistoryBtn");
const earthHistoryClose = document.getElementById("earthHistoryClose");
const earthHistoryList = document.getElementById("earthHistoryList");
const earthHistoryEmpty = document.getElementById("earthHistoryEmpty");
const earthRewardList = document.getElementById("earthRewardList");
const earthCard = document.getElementById("earthCard");

const chickLanding = document.getElementById("chickLanding");
const chickPlay = document.getElementById("chickPlay");
const chickBadges = document.getElementById("chickBadges");
const chickStartBtn = document.getElementById("chickStartBtn");
const chickBadgeBtn = document.getElementById("chickBadgeBtn");
const chickBackBtn = document.getElementById("chickBackBtn");
const chickBadgeBackBtn = document.getElementById("chickBadgeBackBtn");
const chickResetBtn = document.getElementById("chickResetBtn");
const chickSquishBtn = document.getElementById("chickSquishBtn");
const chickBlob = document.getElementById("chickBlob");
const chickPop = document.getElementById("chickPop");
const chickDecompress = document.getElementById("chickDecompress");
const chickClicks = document.getElementById("chickClicks");
const badgeDecompressVal = document.getElementById("badgeDecompressVal");
const badgeClicksVal = document.getElementById("badgeClicksVal");
const badgeDecompress = document.getElementById("badgeDecompress");
const badgeClicks = document.getElementById("badgeClicks");
const badgeBalloon = document.getElementById("badgeBalloon");
const chickEmoteLayer = document.getElementById("chickEmoteLayer");
const chickLandingHero = document.getElementById("chickLandingHero");
const landingChick = document.getElementById("landingChick");

/* ===== 音频工具 ===== */
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function getMaster(ctx, vol) {
  const g = ctx.createGain();
  g.gain.value = vol;
  g.connect(ctx.destination);
  return g;
}

function playMusicBox(ctx, master, freq, start, dur, vol = 0.55) {
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const vib = ctx.createOscillator();
  const vg = ctx.createGain();
  o1.type = "sine";
  o2.type = "triangle";
  o1.frequency.value = freq;
  o2.frequency.value = freq * 2;
  vib.frequency.value = 6;
  vg.gain.value = 1.8;
  vib.connect(vg);
  vg.connect(o1.frequency);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o1.connect(gain);
  o2.connect(gain);
  gain.connect(master);
  o1.start(start);
  o2.start(start);
  vib.start(start);
  o1.stop(start + dur + 0.05);
  o2.stop(start + dur + 0.05);
  vib.stop(start + dur + 0.05);
}

function playBubble(ctx, master, freq, start, vol = 0.28) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, start);
  o.frequency.exponentialRampToValueAtTime(freq * 0.7, start + 0.12);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
  o.connect(g);
  g.connect(master);
  o.start(start);
  o.stop(start + 0.2);
}

function playSparkle(ctx, master, start, vol = 0.22) {
  [1318, 1760, 2093].forEach((f, i) => playMusicBox(ctx, master, f, start + i * 0.05, 0.12, vol));
}

/* ===== 签文 BGM ===== */
function startFortuneBGM() {
  if (fortuneBgm?.running || !soundState.fortune) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.48);
  fortuneBgm = { master, timers: [], running: true, step: 0 };
  const melody = [
    { n: 523, d: 0.32, rest: false }, { n: 659, d: 0.32, rest: false },
    { n: 784, d: 0.32, rest: false }, { n: 0, d: 0.16, rest: true },
    { n: 880, d: 0.32, rest: false }, { n: 784, d: 0.32, rest: false },
    { n: 659, d: 0.32, rest: false }, { n: 587, d: 0.48, rest: false },
    { n: 523, d: 0.32, rest: false }, { n: 587, d: 0.32, rest: false },
    { n: 659, d: 0.32, rest: false }, { n: 0, d: 0.16, rest: true },
    { n: 784, d: 0.32, rest: false }, { n: 880, d: 0.32, rest: false },
    { n: 988, d: 0.32, rest: false }, { n: 880, d: 0.64, rest: false },
  ];
  const bass = [262, 262, 196, 196, 220, 220, 196, 196, 174, 174, 196, 196, 220, 220, 262, 262];

  function tick() {
    if (!fortuneBgm?.running || !soundState.fortune) return;
    const step = fortuneBgm.step % melody.length;
    const m = melody[step];
    const now = ctx.currentTime + 0.04;
    if (!m.rest) playMusicBox(ctx, master, m.n, now, m.d, 0.52);
    if (step % 2 === 0) playBubble(ctx, master, bass[step], now, 0.3);
    if (step === 3 || step === 11) playSparkle(ctx, master, now, 0.18);
    fortuneBgm.step++;
    fortuneBgm.timers.push(setTimeout(tick, m.d * 1000));
  }
  tick();
}

function stopFortuneBGM() {
  if (!fortuneBgm) return;
  fortuneBgm.running = false;
  fortuneBgm.timers.forEach(clearTimeout);
  fortuneBgm = null;
}

function playShakeSound() {
  if (!soundState.fortune) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.55);
  [784, 880, 988, 880, 784, 659, 784, 880].forEach((f, i) =>
    playMusicBox(ctx, master, f, ctx.currentTime + i * 0.07, 0.1, 0.45)
  );
}

function playRevealSound() {
  if (!soundState.fortune) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.55);
  [523, 659, 784, 988, 1175, 1319].forEach((f, i) =>
    playMusicBox(ctx, master, f, ctx.currentTime + i * 0.09, 0.28, 0.6)
  );
  playSparkle(ctx, master, ctx.currentTime + 0.5, 0.35);
}

/* ===== 签文逻辑 ===== */
function getRandomFortune() {
  let i;
  do { i = Math.floor(Math.random() * FORTUNES.length); }
  while (i === lastFortuneIndex && FORTUNES.length > 1);
  lastFortuneIndex = i;
  return FORTUNES[i];
}

function showDrawScene() {
  resultScene.classList.add("hidden");
  drawScene.classList.remove("hidden", "fade-out");
  tubeWrapper.classList.remove("shaking");
  fortuneStick.classList.remove("pop-out");
  isDrawing = false;
}

function showResultScene(text) {
  lastFortuneText = text;
  fortuneText.textContent = text;
  drawScene.classList.add("fade-out");
  setTimeout(() => {
    drawScene.classList.add("hidden");
    resultScene.classList.remove("hidden");
    playRevealSound();
  }, 500);
}

function drawFortune() {
  if (isDrawing) return;
  isDrawing = true;
  if (soundState.fortune && !fortuneBgm) startFortuneBGM();
  tubeWrapper.classList.add("shaking");
  playShakeSound();
  setTimeout(() => fortuneStick.classList.add("pop-out"), 300);
  setTimeout(() => showResultScene(getRandomFortune()), 1200);
}

tubeArea.addEventListener("click", drawFortune);
drawAgainBtn.addEventListener("click", showDrawScene);
resetFortuneBtn.addEventListener("click", showDrawScene);

/* ===== 地球Online ===== */
function showEarthScene(scene) {
  [earthHome, earthTask, earthReward].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
}

function getRandomEarthTask() {
  let i;
  do { i = Math.floor(Math.random() * EARTH_TASKS.length); }
  while (i === lastEarthTaskIndex && EARTH_TASKS.length > 1);
  lastEarthTaskIndex = i;
  return EARTH_TASKS[i];
}

const EARTH_HISTORY_MAX = 50;

function getEarthHistory() {
  try { return JSON.parse(localStorage.getItem("earthTasks") || "[]"); }
  catch { return []; }
}

function saveEarthHistory(task) {
  const list = getEarthHistory();
  list.unshift({ task, time: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) });
  localStorage.setItem("earthTasks", JSON.stringify(list.slice(0, EARTH_HISTORY_MAX)));
}

function renderEarthHistory() {
  const list = getEarthHistory();
  earthHistoryList.innerHTML = "";
  earthHistoryEmpty.classList.toggle("hidden", list.length > 0);
  list.forEach(({ task, time }) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task}</span><span>${time}</span>`;
    earthHistoryList.appendChild(li);
  });
}

/* ===== 地球Online · 音效 ===== */
let earthChain = null;

function getEarthOut(ctx, vol = 1) {
  if (!earthChain) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -30;
    comp.ratio.value = 2;
    comp.connect(ctx.destination);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    lp.Q.value = 0.35;
    lp.connect(comp);

    const delay = ctx.createDelay(2.5);
    delay.delayTime.value = 0.52;
    const fb = ctx.createGain();
    fb.gain.value = 0.2;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(lp);

    const dry = ctx.createGain();
    dry.gain.value = 0.65;
    dry.connect(lp);

    earthChain = { dry, delay };
  }
  const master = ctx.createGain();
  master.gain.value = vol;
  master.connect(earthChain.dry);
  master.connect(earthChain.delay);
  return master;
}

function playEarthTaskSound() {
  if (!soundState.earth) return;
  const ctx = getAudioCtx();
  const master = getEarthOut(ctx, 0.5);
  const t = ctx.currentTime;
  playBubble(ctx, master, 880, t, 0.22);
  playBubble(ctx, master, 1175, t + 0.12, 0.16);
}

function playEarthCompleteSound() {
  if (!soundState.earth) return;
  const ctx = getAudioCtx();
  const master = getEarthOut(ctx, 0.55);
  const t = ctx.currentTime;
  [784, 988, 1175, 1319].forEach((f, i) =>
    playMusicBox(ctx, master, f, t + i * 0.11, 0.32, 0.38)
  );
  playSparkle(ctx, master, t + 0.45, 0.2);
}

function startEarthBGM() {
  if (!soundState.earth) return;
  if (earthBgm?.running) return;
  if (earthBgm) {
    earthBgm.timers.forEach(clearTimeout);
    try {
      earthBgm.wind.stop();
      earthBgm.oscs.forEach((o) => o.stop());
      earthBgm.breathe.stop();
      earthBgm.sweep.stop();
    } catch (_) { /* already stopped */ }
    earthBgm = null;
  }
  const ctx = getAudioCtx();
  const t = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(0.22, t + 3);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 680;
  lp.Q.value = 0.25;
  lp.connect(ctx.destination);
  master.connect(lp);

  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < len; i++) {
    brown = (brown + 0.018 * (Math.random() * 2 - 1)) * 0.995;
    d[i] = brown;
  }
  const wind = ctx.createBufferSource();
  wind.buffer = buf;
  wind.loop = true;
  const windF = ctx.createBiquadFilter();
  windF.type = "bandpass";
  windF.frequency.value = 280;
  windF.Q.value = 0.35;
  const windG = ctx.createGain();
  windG.gain.value = 0.04;
  wind.connect(windF);
  windF.connect(windG);
  windG.connect(master);

  const padG = ctx.createGain();
  padG.gain.value = 0.055;
  padG.connect(master);
  const oscs = [65.41, 98.0].map((freq, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    o.detune.value = i === 0 ? -6 : 5;
    o.connect(padG);
    o.start();
    return o;
  });

  const breathe = ctx.createOscillator();
  breathe.frequency.value = 0.045;
  const breatheD = ctx.createGain();
  breatheD.gain.value = 0.018;
  breathe.connect(breatheD);
  breatheD.connect(padG.gain);
  breathe.start();

  const sweep = ctx.createOscillator();
  sweep.frequency.value = 0.025;
  const sweepD = ctx.createGain();
  sweepD.gain.value = 180;
  sweep.connect(sweepD);
  sweepD.connect(lp.frequency);
  sweep.start();

  earthBgm = { running: true, master, wind, oscs, breathe, sweep, timers: [] };
}

function stopEarthBGM() {
  if (!earthBgm?.running) return;
  const bgm = earthBgm;
  bgm.running = false;
  bgm.timers.forEach(clearTimeout);
  const ctx = getAudioCtx();
  const t = ctx.currentTime;
  bgm.master.gain.cancelScheduledValues(t);
  bgm.master.gain.setValueAtTime(bgm.master.gain.value, t);
  bgm.master.gain.linearRampToValueAtTime(0, t + 1.5);
  bgm.timers.push(setTimeout(() => {
    try {
      bgm.wind.stop();
      bgm.oscs.forEach((o) => o.stop());
      bgm.breathe.stop();
      bgm.sweep.stop();
    } catch (_) { /* already stopped */ }
    if (earthBgm === bgm) earthBgm = null;
  }, 1600));
}

function replayRewardAnimation() {
  earthRewardList.querySelectorAll("li").forEach((li) => {
    li.style.animation = "none";
    void li.offsetWidth;
    li.style.animation = "";
  });
}

earthRandomBtn.addEventListener("click", () => {
  getAudioCtx();
  if (soundState.earth && !earthBgm) startEarthBGM();
  currentEarthTask = getRandomEarthTask();
  earthTaskName.textContent = currentEarthTask;
  showEarthScene(earthTask);
  playEarthTaskSound();
});

earthDoneBtn.addEventListener("click", () => {
  lastCompletedEarthTask = currentEarthTask;
  saveEarthHistory(currentEarthTask);
  showEarthScene(earthReward);
  replayRewardAnimation();
  playEarthCompleteSound();
});

earthBackBtn.addEventListener("click", () => showEarthScene(earthHome));

earthShareBtn?.addEventListener("click", () => shareEarthQuest(lastCompletedEarthTask || currentEarthTask));

earthHistoryBtn.addEventListener("click", () => {
  renderEarthHistory();
  earthHistory.classList.remove("hidden");
});

earthHistoryClose.addEventListener("click", () => earthHistory.classList.add("hidden"));
earthHistory.addEventListener("click", (e) => {
  if (e.target === earthHistory) earthHistory.classList.add("hidden");
});

/* ===== 挤挤小鸡 ===== */
const CHICK_STORAGE_KEY = "chickGame";
const BALLOON_POP_CLICKS = 35;

let chickState = loadChickState();
let balloonSkinClicks = 0;
let chickSquishTimer = null;
let chickHappyTimer = null;
let chickBlinkTimer = null;
let landingBlinkTimer = null;
let lastSquishTime = 0;
let squishCombo = 0;

const CHICK_EMOTES = ["Hehe~", "So nice♡", "More!", "Whoa!", "So good!", "Yay~", "Squish~", "Yes!!"];
const CHICK_COMBO_EMOTES = ["Ahhh!!", "Can't stop~", "So satisfying!!", "Hehehe~"];

function defaultChickState() {
  return {
    decompress: 0,
    clicks: 0,
    skin: "balloon",
    achievements: { decompress: false, clicks: false, balloon: false },
  };
}

function loadChickState() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHICK_STORAGE_KEY) || "null");
    return saved ? { ...defaultChickState(), ...saved, achievements: { ...defaultChickState().achievements, ...saved.achievements } } : defaultChickState();
  } catch {
    return defaultChickState();
  }
}

function saveChickState() {
  localStorage.setItem(CHICK_STORAGE_KEY, JSON.stringify(chickState));
}

function showChickScene(scene) {
  [chickLanding, chickPlay, chickBadges].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
}

function updateChickUI() {
  chickDecompress.textContent = chickState.decompress;
  chickClicks.textContent = chickState.clicks;
  badgeDecompressVal.textContent = chickState.decompress;
  badgeClicksVal.textContent = chickState.clicks;
  chickBlob.dataset.skin = chickState.skin;
  document.querySelectorAll(".chick-skin-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.skin === chickState.skin);
  });
  updateBadgeUI();
}

function updateBadgeUI() {
  const ach = chickState.achievements;
  setBadgeState(badgeDecompress, ach.decompress);
  setBadgeState(badgeClicks, ach.clicks);
  setBadgeState(badgeBalloon, ach.balloon);
}

function setBadgeState(el, unlocked) {
  el.classList.toggle("unlocked", unlocked);
  el.classList.toggle("locked", !unlocked);
  el.querySelector(".badge-check").classList.toggle("hidden", !unlocked);
}

function checkChickAchievements() {
  const ach = chickState.achievements;
  if (!ach.decompress && chickState.decompress >= 100) ach.decompress = true;
  if (!ach.clicks && chickState.clicks >= 50) ach.clicks = true;
  saveChickState();
  updateBadgeUI();
}

function playSquishSound(skin) {
  if (!soundState.chick) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.45);
  const t = ctx.currentTime;
  const base = skin === "balloon" ? 520 : skin === "rubber" ? 380 : 320;
  playBubble(ctx, master, base + Math.random() * 60, t, 0.28);
  if (skin === "rubber") playBubble(ctx, master, base * 1.4, t + 0.04, 0.14);
  if (squishCombo >= 4) playMusicBox(ctx, master, 880, t + 0.05, 0.12, 0.22);
}

function updateChickEyes(clientX, clientY) {
  const rect = chickBlob.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height * 0.4;
  const dx = (clientX - cx) / (rect.width * 0.5);
  const dy = (clientY - cy) / (rect.height * 0.5);
  const px = Math.max(-6, Math.min(6, dx * 7));
  const py = Math.max(-5, Math.min(5, dy * 6));
  chickBlob.querySelectorAll(".pupil").forEach((p) => {
    p.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  });
}

function blinkChick() {
  if (chickBlob.classList.contains("squish")) return;
  chickBlob.classList.add("blink");
  setTimeout(() => chickBlob.classList.remove("blink"), 120);
}

function scheduleChickBlink() {
  clearTimeout(chickBlinkTimer);
  chickBlinkTimer = setTimeout(() => {
    if (!chickPlay.classList.contains("hidden")) {
      blinkChick();
      scheduleChickBlink();
    }
  }, 2200 + Math.random() * 2800);
}

function scheduleLandingBlink() {
  clearTimeout(landingBlinkTimer);
  landingBlinkTimer = setTimeout(() => {
    if (!chickLanding.classList.contains("hidden") && landingChick) {
      landingChick.classList.add("blink");
      setTimeout(() => landingChick.classList.remove("blink"), 130);
      scheduleLandingBlink();
    }
  }, 2000 + Math.random() * 2500);
}

function updateLandingEyes(clientX, clientY) {
  if (!landingChick) return;
  const rect = landingChick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height * 0.38;
  const px = Math.max(-7, Math.min(7, (clientX - cx) / rect.width * 14));
  const py = Math.max(-5, Math.min(5, (clientY - cy) / rect.height * 12));
  landingChick.querySelectorAll(".landing-pupil").forEach((p) => {
    p.style.animation = "none";
    p.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  });
}

function peepLandingChick() {
  landingChick.classList.remove("peep");
  void landingChick.offsetWidth;
  landingChick.classList.add("peep");
  setTimeout(() => landingChick.classList.remove("peep"), 450);
  if (soundState.chick) {
    getAudioCtx();
    playBubble(getAudioCtx(), getMaster(getAudioCtx(), 0.4), 660, getAudioCtx().currentTime, 0.2);
  }
}

function spawnChickEmote(isCombo) {
  const el = document.createElement("span");
  el.className = "chick-float-emote" + (isCombo ? " big" : "");
  const pool = isCombo ? CHICK_COMBO_EMOTES : CHICK_EMOTES;
  el.textContent = pool[Math.floor(Math.random() * pool.length)];
  el.style.left = `${40 + Math.random() * 20}%`;
  el.style.top = `${20 + Math.random() * 25}%`;
  chickEmoteLayer.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function squishChick() {
  const now = Date.now();
  squishCombo = now - lastSquishTime < 450 ? squishCombo + 1 : 1;
  lastSquishTime = now;
  const isCombo = squishCombo >= 5;

  chickBlob.classList.remove("squish", "happy");
  void chickBlob.offsetWidth;
  chickBlob.classList.add("squish");
  clearTimeout(chickSquishTimer);
  clearTimeout(chickHappyTimer);
  chickSquishTimer = setTimeout(() => {
    chickBlob.classList.remove("squish");
    chickBlob.classList.add("happy");
    chickHappyTimer = setTimeout(() => chickBlob.classList.remove("happy"), 500);
  }, 220);

  spawnChickEmote(isCombo);

  const gain = chickState.skin === "balloon" ? 2 : chickState.skin === "rubber" ? 3 : 1;
  chickState.decompress += gain + Math.floor(Math.random() * 2);
  chickState.clicks += 1;
  saveChickState();
  updateChickUI();
  checkChickAchievements();
  playSquishSound(chickState.skin);

  if (chickState.skin === "balloon") {
    balloonSkinClicks += 1;
    if (balloonSkinClicks >= BALLOON_POP_CLICKS && !chickState.achievements.balloon) {
      triggerBalloonPop();
    }
  }
}

function triggerBalloonPop() {
  chickState.achievements.balloon = true;
  saveChickState();
  chickBlob.classList.add("popped");
  chickPop.classList.remove("hidden");
  if (soundState.chick) {
    const ctx = getAudioCtx();
    const master = getMaster(ctx, 0.5);
    playBubble(ctx, master, 200, ctx.currentTime, 0.4);
    playSparkle(ctx, master, ctx.currentTime + 0.1, 0.25);
  }
  setTimeout(() => {
    chickBlob.classList.remove("popped");
    chickPop.classList.add("hidden");
    balloonSkinClicks = 0;
    updateBadgeUI();
  }, 700);
}

function resetChickGame() {
  chickState = defaultChickState();
  balloonSkinClicks = 0;
  saveChickState();
  updateChickUI();
}

chickStartBtn.addEventListener("click", () => {
  getAudioCtx();
  showChickScene(chickPlay);
  updateChickUI();
  scheduleChickBlink();
});

chickBadgeBtn.addEventListener("click", () => {
  showChickScene(chickBadges);
  updateChickUI();
});

chickBackBtn.addEventListener("click", () => {
  clearTimeout(chickBlinkTimer);
  showChickScene(chickLanding);
  scheduleLandingBlink();
});

chickBadgeBackBtn.addEventListener("click", () => {
  showChickScene(chickLanding);
  scheduleLandingBlink();
});

if (chickLandingHero) {
  chickLandingHero.addEventListener("click", peepLandingChick);
  chickLandingHero.addEventListener("pointermove", (e) => updateLandingEyes(e.clientX, e.clientY));
  chickLandingHero.addEventListener("pointerleave", () => {
    landingChick.querySelectorAll(".landing-pupil").forEach((p) => {
      p.style.animation = "";
      p.style.transform = "";
    });
  });
}

scheduleLandingBlink();

chickResetBtn.addEventListener("click", () => {
  if (confirm("Reset relief points and tap count?")) resetChickGame();
});

chickSquishBtn.addEventListener("click", squishChick);

chickSquishBtn.addEventListener("pointermove", (e) => {
  if (e.pointerType === "mouse") updateChickEyes(e.clientX, e.clientY);
});

chickSquishBtn.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) updateChickEyes(t.clientX, t.clientY);
}, { passive: true });

document.querySelectorAll(".chick-skin-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    chickState.skin = btn.dataset.skin;
    balloonSkinClicks = 0;
    saveChickState();
    updateChickUI();
  });
});

updateChickUI();

/* ===== 萌块堆堆 ===== */
const BLOCK_COLS = 10;
const BLOCK_ROWS = 16;
const blockLanding = document.getElementById("blockLanding");
const blockPlay = document.getElementById("blockPlay");
const blockStartBtn = document.getElementById("blockStartBtn");
const blockBackBtn = document.getElementById("blockBackBtn");
const blockCanvas = document.getElementById("blockCanvas");
const blockScoreEl = document.getElementById("blockScore");
const blockGameOver = document.getElementById("blockGameOver");
const blockShareBtn = document.getElementById("blockShareBtn");
const blockBombBtn = document.getElementById("blockBombBtn");
const blockFastBtn = document.getElementById("blockFastBtn");
const blockRestartBtn = document.getElementById("blockRestartBtn");
const blockHistoryBtn = document.getElementById("blockHistoryBtn");
const blockHistoryBtnPlay = document.getElementById("blockHistoryBtnPlay");
const blockHistory = document.getElementById("blockHistory");
const blockHistoryClose = document.getElementById("blockHistoryClose");
const blockHistoryList = document.getElementById("blockHistoryList");
const blockHistoryEmpty = document.getElementById("blockHistoryEmpty");
const blockHistoryBest = document.getElementById("blockHistoryBest");
const blockCtx = blockCanvas?.getContext("2d");

const BLOCK_HISTORY_KEY = "blockScores";
const BLOCK_HISTORY_MAX = 50;

const BLOCK_PIECES = [
  { c: "#c084fc", s: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ]},
  { c: "#f87171", s: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ]},
  { c: "#60a5fa", s: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ]},
  { c: "#fb923c", s: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ]},
  { c: "#4ade80", s: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ]},
  { c: "#fbbf24", s: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ]},
  { c: "#38bdf8", s: [
    [[1,0,0],[1,1,0],[0,1,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ]},
];

let blockBoard = [];
let blockActive = null;
let blockScore = 0;
let blockDropMs = 650;
let blockFastUntil = 0;
let blockRunning = false;
let blockBlinkT = 0;
let blockLoopId = 0;
let blockLastArchived = -1;

function formatBlockHistoryTime(date = new Date()) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getBlockHistory() {
  try { return JSON.parse(localStorage.getItem(BLOCK_HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function saveBlockHistory(score, reason) {
  const list = getBlockHistory();
  list.unshift({ score, reason, time: formatBlockHistoryTime() });
  localStorage.setItem(BLOCK_HISTORY_KEY, JSON.stringify(list.slice(0, BLOCK_HISTORY_MAX)));
}

function archiveBlockScore(reason) {
  if (blockScore <= 0 || blockScore === blockLastArchived) return;
  saveBlockHistory(blockScore, reason);
  blockLastArchived = blockScore;
}

function renderBlockHistory() {
  const list = getBlockHistory();
  blockHistoryList.innerHTML = "";
  blockHistoryEmpty.classList.toggle("hidden", list.length > 0);
  if (list.length) {
    const best = Math.max(...list.map((item) => item.score));
    blockHistoryBest.textContent = `Best ${best}`;
    blockHistoryBest.classList.remove("hidden");
  } else {
    blockHistoryBest.classList.add("hidden");
  }
  const reasonLabel = {
    over: "Game over",
    restart: "Restart",
    exit: "Exit",
  };
  list.forEach(({ score, reason, time }) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${score} pts · ${reasonLabel[reason] || "Run"}</span><span>${time}</span>`;
    blockHistoryList.appendChild(li);
  });
}

function openBlockHistory() {
  renderBlockHistory();
  blockHistory.classList.remove("hidden");
}

function closeBlockHistory() {
  blockHistory.classList.add("hidden");
}

function showBlockScene(scene) {
  [blockLanding, blockPlay].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
}

function emptyBlockBoard() {
  return Array.from({ length: BLOCK_ROWS }, () => Array(BLOCK_COLS).fill(null));
}

function spawnBlockPiece() {
  const p = BLOCK_PIECES[Math.floor(Math.random() * BLOCK_PIECES.length)];
  blockActive = {
    shape: p.s[0].map((r) => [...r]),
    rot: 0,
    defs: p.s,
    color: p.c,
    x: Math.floor(BLOCK_COLS / 2) - 1,
    y: 0,
  };
  if (blockCollide(blockActive.x, blockActive.y, blockActive.shape)) {
    blockRunning = false;
    archiveBlockScore("over");
    blockGameOver.classList.remove("hidden");
    blockShareBtn?.classList.remove("hidden");
  }
}

function blockCollide(ox, oy, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = ox + c;
      const ny = oy + r;
      if (nx < 0 || nx >= BLOCK_COLS || ny >= BLOCK_ROWS) return true;
      if (ny >= 0 && blockBoard[ny][nx]) return true;
    }
  }
  return false;
}

function lockBlockPiece() {
  const { shape, x, y, color } = blockActive;
  let placed = 0;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const ny = y + r;
      const nx = x + c;
      if (ny >= 0) {
        blockBoard[ny][nx] = color;
        placed++;
      }
    }
  }
  if (placed) {
    blockScore += placed * 10;
    blockScoreEl.textContent = blockScore;
  }
  let cleared = 0;
  for (let r = BLOCK_ROWS - 1; r >= 0; r--) {
    if (blockBoard[r].every((cell) => cell)) {
      blockBoard.splice(r, 1);
      blockBoard.unshift(Array(BLOCK_COLS).fill(null));
      cleared++;
      r++;
    }
  }
  if (cleared) {
    blockScore += cleared * 150 * cleared;
    blockScoreEl.textContent = blockScore;
    playBlockLineSound(cleared);
  }
  spawnBlockPiece();
}

function addBlockScore(n) {
  blockScore += n;
  blockScoreEl.textContent = blockScore;
}

function blockMove(dx, dy) {
  if (!blockRunning || !blockActive) return;
  if (!blockCollide(blockActive.x + dx, blockActive.y + dy, blockActive.shape)) {
    blockActive.x += dx;
    blockActive.y += dy;
    if (dx) playBlockMoveSound();
    if (dy > 0) addBlockScore(1);
    drawBlockGame();
    return true;
  }
  if (dy > 0) lockBlockPiece();
  drawBlockGame();
  return false;
}

function blockRotate() {
  if (!blockRunning || !blockActive) return;
  blockActive.rot = (blockActive.rot + 1) % blockActive.defs.length;
  const next = blockActive.defs[blockActive.rot].map((r) => [...r]);
  if (!blockCollide(blockActive.x, blockActive.y, next)) {
    blockActive.shape = next;
    playBlockRotateSound();
  }
  drawBlockGame();
}

function blockBomb() {
  if (!blockRunning) return;
  const r = BLOCK_ROWS - 1;
  let removed = 0;
  for (let c = 0; c < BLOCK_COLS; c++) {
    if (blockBoard[r][c]) removed++;
    blockBoard[r][c] = null;
  }
  if (removed) {
    addBlockScore(removed * 15 + 30);
    playBlockLineSound(1);
  }
  drawBlockGame();
}

function blockFastBoost() {
  blockFastUntil = Date.now() + 4000;
  playBlockMoveSound();
}

function drawBlockCell(ctx, x, y, size, color, t) {
  const pad = 1;
  const w = size - pad * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x + pad, y + pad, w, w, 4);
  } else {
    ctx.rect(x + pad, y + pad, w, w);
  }
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(x + pad + 2, y + pad + 2, w * 0.5, 3);
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(x + pad, y + pad + w - 3, w, 3);
  const blink = Math.sin(t * 0.004) > 0.92;
  const ex = x + size * 0.35;
  const ey = y + size * 0.42;
  if (blink) {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex - 3, ey);
    ctx.lineTo(ex + 3, ey);
    ctx.moveTo(ex + size * 0.28, ey);
    ctx.lineTo(ex + size * 0.28 + 6, ey);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, ey, size * 0.12, 0, Math.PI * 2);
    ctx.arc(ex + size * 0.28, ey, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(ex + 1, ey + 1, size * 0.05, 0, Math.PI * 2);
    ctx.arc(ex + size * 0.28 + 1, ey + 1, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBlockGame() {
  if (!blockCtx) return;
  const w = blockCanvas.width;
  const h = blockCanvas.height;
  const cell = w / BLOCK_COLS;
  blockBlinkT = performance.now();
  blockCtx.clearRect(0, 0, w, h);
  blockCtx.fillStyle = "rgba(160, 210, 150, 0.35)";
  blockCtx.fillRect(0, 0, w, h);
  for (let r = 0; r < BLOCK_ROWS; r++) {
    for (let c = 0; c < BLOCK_COLS; c++) {
      blockCtx.strokeStyle = "rgba(255,255,255,0.15)";
      blockCtx.strokeRect(c * cell, r * cell, cell, cell);
      if (blockBoard[r][c]) drawBlockCell(blockCtx, c * cell, r * cell, cell, blockBoard[r][c], blockBlinkT);
    }
  }
  if (blockActive) {
    const { shape, x, y, color } = blockActive;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        drawBlockCell(blockCtx, (x + c) * cell, (y + r) * cell, cell, color, blockBlinkT);
      }
    }
  }
}

function blockGameTick(loopId) {
  if (!blockRunning || loopId !== blockLoopId) return;
  const ms = Date.now() < blockFastUntil ? 180 : blockDropMs;
  if (!blockGameTick.last || Date.now() - blockGameTick.last >= ms) {
    blockMove(0, 1);
    blockGameTick.last = Date.now();
  }
  drawBlockGame();
  if (blockRunning && loopId === blockLoopId) {
    requestAnimationFrame(() => blockGameTick(loopId));
  }
}

function startBlockGame() {
  blockLoopId++;
  const loopId = blockLoopId;
  blockRunning = false;
  blockBoard = emptyBlockBoard();
  blockScore = 0;
  blockLastArchived = -1;
  blockScoreEl.textContent = "0";
  blockRunning = true;
  blockGameOver.classList.add("hidden");
  blockShareBtn?.classList.add("hidden");
  blockFastUntil = 0;
  spawnBlockPiece();
  blockGameTick.last = 0;
  drawBlockGame();
  requestAnimationFrame(() => blockGameTick(loopId));
}

function stopBlockGame() {
  blockRunning = false;
  blockLoopId++;
}

function playBlockMoveSound() {
  if (!soundState.block) return;
  const ctx = getAudioCtx();
  playBubble(ctx, getMaster(ctx, 0.35), 440 + Math.random() * 80, ctx.currentTime, 0.12);
}

function playBlockRotateSound() {
  if (!soundState.block) return;
  const ctx = getAudioCtx();
  playMusicBox(ctx, getMaster(ctx, 0.4), 660, ctx.currentTime, 0.08, 0.3);
}

function playBlockLineSound(lines) {
  if (!soundState.block) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.45);
  [523, 659, 784, 988].slice(0, lines).forEach((f, i) =>
    playMusicBox(ctx, master, f, ctx.currentTime + i * 0.08, 0.2, 0.4)
  );
}

blockStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  showBlockScene(blockPlay);
  startBlockGame();
});

blockBackBtn?.addEventListener("click", () => {
  archiveBlockScore("exit");
  stopBlockGame();
  showBlockScene(blockLanding);
});

blockHistoryBtn?.addEventListener("click", openBlockHistory);
blockHistoryBtnPlay?.addEventListener("click", openBlockHistory);
blockHistoryClose?.addEventListener("click", closeBlockHistory);
blockHistory?.addEventListener("click", (e) => {
  if (e.target === blockHistory) closeBlockHistory();
});

document.querySelectorAll(".dpad-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (dir === "left") blockMove(-1, 0);
    else if (dir === "right") blockMove(1, 0);
    else if (dir === "down") blockMove(0, 1);
    else if (dir === "up") blockRotate();
  });
});

blockRestartBtn?.addEventListener("click", () => {
  getAudioCtx();
  archiveBlockScore("restart");
  startBlockGame();
});

blockGameOver?.addEventListener("click", () => {
  getAudioCtx();
  startBlockGame();
});

blockGameOver?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    getAudioCtx();
    startBlockGame();
  }
});

blockBombBtn?.addEventListener("click", blockBomb);
blockFastBtn?.addEventListener("click", blockFastBoost);

/* ===== 鲜果驿站 ===== */
const SHOP_PRODUCTS = [
  { id: "apple", emoji: "🍎", price: 5, cost: 2, name: "Apple" },
  { id: "bread", emoji: "🍞", price: 8, cost: 3, name: "Bread" },
  { id: "milk", emoji: "🥛", price: 12, cost: 5, name: "Milk" },
  { id: "egg", emoji: "🥚", price: 15, cost: 6, name: "Eggs" },
];

const shopLanding = document.getElementById("shopLanding");
const shopPlay = document.getElementById("shopPlay");
const shopStartBtn = document.getElementById("shopStartBtn");
const shopBackBtn = document.getElementById("shopBackBtn");
const shopMoneyEl = document.getElementById("shopMoney");
const shopRatingEl = document.getElementById("shopRating");
const shopOrdersEl = document.getElementById("shopOrders");
const shopRoundEarnEl = document.getElementById("shopRoundEarn");
const shopHeartsEl = document.getElementById("shopHearts");
const shopTimerEl = document.getElementById("shopTimer");
const shopProductsEl = document.getElementById("shopProducts");
const shopCustomersEl = document.getElementById("shopCustomers");
const shopTrayHint = document.getElementById("shopTrayHint");
const shopTutorial = document.getElementById("shopTutorial");
const shopTutorialOk = document.getElementById("shopTutorialOk");
const shopRoundEnd = document.getElementById("shopRoundEnd");
const shopRoundTotal = document.getElementById("shopRoundTotal");
const shopRoundOrders = document.getElementById("shopRoundOrders");
const shopRoundRating = document.getElementById("shopRoundRating");
const shopRoundAgain = document.getElementById("shopRoundAgain");
const shopRoundHome = document.getElementById("shopRoundHome");
const shopFloor = document.getElementById("shopFloor");
const shopCounter = document.getElementById("shopCounter");
const shopShelfEls = document.querySelectorAll("#shopCard .shop-shelf");

const SHOP_SHIRTS = ["orange", "purple", "blue", "teal"];
const SHOP_POS_FALLBACK = {
  0: { x: 14, y: 46 },
  1: { x: 38, y: 28 },
  2: { x: 62, y: 28 },
  3: { x: 86, y: 28 },
  4: { x: 38, y: 62 },
  5: { x: 62, y: 62 },
  6: { x: 86, y: 62 },
  enter: { x: 96, y: 78 },
};

let shopRunning = false;
let shopSelected = null;
let shopShelves = [null, null, null, null, null, null, null];
let shopMoney = 50;
let shopRating = 80;
let shopHearts = 80;
let shopOrders = 0;
let shopRoundEarn = 0;
let shopTimeLeft = 60;
let shopCustomers = [];
let shopTimers = [];
let shopCustomerId = 0;

function showShopScene(scene) {
  [shopLanding, shopPlay].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
}

function clearShopTimers() {
  shopTimers.forEach(clearInterval);
  shopTimers = [];
}

function playShopSound(type) {
  if (!soundState.shop) return;
  const ctx = getAudioCtx();
  const master = getMaster(ctx, 0.4);
  const t = ctx.currentTime;
  if (type === "stock") playBubble(ctx, master, 520, t, 0.2);
  else if (type === "cash") {
    playMusicBox(ctx, master, 784, t, 0.15, 0.35);
    playMusicBox(ctx, master, 988, t + 0.1, 0.2, 0.35);
  } else if (type === "leave") playBubble(ctx, master, 220, t, 0.15);
  else if (type === "enter") playBubble(ctx, master, 660, t, 0.12);
}

function startShopBGM() {
  if (!soundState.shop) return;
  if (shopBgm?.running) return;
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.2;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2400;
  lp.connect(ctx.destination);
  master.connect(lp);

  shopBgm = { running: true, timers: [], master, step: 0 };
  const melody = [523, 587, 659, 784, 880, 784, 659, 587, 523, 440, 494, 523, 659, 784, 659, 523];

  function tick() {
    if (!shopBgm?.running || !soundState.shop) return;
    const n = melody[shopBgm.step % melody.length];
    playMusicBox(ctx, shopBgm.master, n, ctx.currentTime + 0.02, 0.32, 0.38);
    if (shopBgm.step % 4 === 0) {
      playBubble(ctx, shopBgm.master, 262, ctx.currentTime + 0.02, 0.12);
    }
    shopBgm.step++;
    shopBgm.timers.push(setTimeout(tick, 420));
  }
  tick();
}

function stopShopBGM() {
  if (!shopBgm) return;
  shopBgm.running = false;
  shopBgm.timers.forEach(clearTimeout);
  shopBgm = null;
}

function renderShopHUD() {
  shopMoneyEl.textContent = shopMoney;
  shopRatingEl.textContent = shopRating;
  shopOrdersEl.textContent = shopOrders;
  shopRoundEarnEl.textContent = shopRoundEarn;
  shopHeartsEl.textContent = shopHearts;
  shopTimerEl.textContent = `${shopTimeLeft}s`;
}

function renderShopProducts() {
  shopProductsEl.innerHTML = "";
  SHOP_PRODUCTS.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shop-product-btn" + (shopSelected === p.id ? " active" : "");
    btn.dataset.id = p.id;
    btn.innerHTML = `<span class="shop-product-emoji">${p.emoji}</span><span class="shop-product-price">$${p.price}</span>`;
    btn.addEventListener("click", () => {
      shopSelected = shopSelected === p.id ? null : p.id;
      renderShopProducts();
      shopTrayHint.textContent = shopSelected
        ? `Selected ${p.name} — tap empty shelf (cost $${p.cost})`
        : "Tap goods, then shelf to stock";
    });
    shopProductsEl.appendChild(btn);
  });
}

function renderShopShelves() {
  shopShelfEls.forEach((el) => {
    const i = parseInt(el.dataset.shelf, 10);
    if (i === 0) return;
    const itemEl = el.querySelector(".shelf-item");
    if (!itemEl) return;
    const pid = shopShelves[i];
    if (pid) {
      const p = SHOP_PRODUCTS.find((x) => x.id === pid);
      itemEl.textContent = p?.emoji || "";
      el.classList.add("stocked");
    } else {
      itemEl.textContent = "";
      el.classList.remove("stocked");
    }
  });
}

function seedShopShelves() {
  shopShelves[1] = "apple";
  shopShelves[2] = "bread";
  shopShelves[4] = "egg";
  renderShopShelves();
  shopTrayHint.textContent = "Stocked up — customers incoming~";
}

function getShelfCenter(index) {
  const target = index === 0
    ? shopCounter
    : document.querySelector(`#shopCard .shop-shelf[data-shelf="${index}"]`);
  if (!target || !shopFloor) return SHOP_POS_FALLBACK[index] || { x: 50, y: 50 };
  const fr = shopFloor.getBoundingClientRect();
  const r = target.getBoundingClientRect();
  if (!fr.width || !fr.height || !r.width) return SHOP_POS_FALLBACK[index] || { x: 50, y: 50 };
  return {
    x: ((r.left + r.width / 2 - fr.left) / fr.width) * 100,
    y: ((r.top + r.height / 2 - fr.top) / fr.height) * 100,
  };
}

function pixelHeadHtml(expr = "walk") {
  return `<div class="pixel-head">
    <div class="pixel-face expr-${expr}">
      <span class="pixel-eye le"></span>
      <span class="pixel-eye re"></span>
      <span class="pixel-mouth"></span>
    </div>
  </div>`;
}

function setCustomerExpr(el, expr) {
  const face = el.querySelector(".pixel-face");
  if (face) face.className = `pixel-face expr-${expr}`;
}

function createPixelCustomer(shirt, expr = "walk") {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "shop-customer";
  el.innerHTML = `
    <div class="pixel-char shirt-${shirt}">
      ${pixelHeadHtml(expr)}
      <div class="pixel-torso"></div>
      <div class="pixel-legs"></div>
    </div>
    <span class="cust-carry hidden"></span>
    <span class="cust-pay hidden">💵</span>
    <div class="cust-progress hidden"><div class="cust-progress-bar"></div></div>`;
  return el;
}

function moveCustomerEl(el, x, y) {
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
}

function stockShelf(index) {
  if (!shopSelected || index === 0) return;
  if (shopShelves[index]) return;
  const p = SHOP_PRODUCTS.find((x) => x.id === shopSelected);
  if (!p || shopMoney < p.cost) {
    shopTrayHint.textContent = shopMoney < p.cost ? "Not enough gold" : "Shelf already stocked";
    return;
  }
  shopMoney -= p.cost;
  shopShelves[index] = p.id;
  playShopSound("stock");
  renderShopHUD();
  renderShopShelves();
  shopTrayHint.textContent = `${p.name} stocked`;
}

function getStockedShelves() {
  return shopShelves
    .map((pid, i) => (pid && i > 0 ? { index: i, pid } : null))
    .filter(Boolean);
}

function shelfPosition(index) {
  return getShelfCenter(index);
}

function spawnShopCustomer() {
  if (!shopRunning || !shopCustomersEl) return;
  playShopSound("enter");

  const shirt = SHOP_SHIRTS[Math.floor(Math.random() * SHOP_SHIRTS.length)];
  const el = createPixelCustomer(shirt);
  const enter = SHOP_POS_FALLBACK.enter;
  moveCustomerEl(el, enter.x, enter.y);
  shopCustomersEl.appendChild(el);

  const stocked = getStockedShelves();

  if (!stocked.length) {
    const c = { id: ++shopCustomerId, el, state: "leave", productId: null, price: 0 };
    shopCustomers.push(c);
    const mid = getShelfCenter(5);
    setTimeout(() => moveCustomerEl(el, mid.x, mid.y), 80);
    setCustomerExpr(el, "angry");
    const carry = el.querySelector(".cust-carry");
    carry.textContent = "💢";
    carry.classList.remove("hidden");
    setTimeout(() => {
      if (!shopRunning) return;
      shopHearts = Math.max(0, shopHearts - 2);
      shopRating = Math.max(50, shopRating - 1);
      renderShopHUD();
      playShopSound("leave");
      moveCustomerEl(el, 108, enter.y);
      el.classList.add("leaving");
    }, 1800);
    setTimeout(() => removeShopCustomer(c.id), 3000);
    return;
  }

  const pick = stocked[Math.floor(Math.random() * stocked.length)];
  const product = SHOP_PRODUCTS.find((x) => x.id === pick.pid);
  const shelfPos = getShelfCenter(pick.index);

  const c = {
    id: ++shopCustomerId,
    el,
    state: "browse",
    shelfIndex: pick.index,
    productId: pick.pid,
    price: product?.price || 5,
  };
  shopCustomers.push(c);

  setTimeout(() => moveCustomerEl(el, shelfPos.x, shelfPos.y), 80);
  setCustomerExpr(el, "happy");
  const carry = el.querySelector(".cust-carry");
  carry.textContent = product?.emoji || "🛒";
  carry.classList.remove("hidden");

  setTimeout(() => {
    if (!shopRunning || c.state === "done") return;
    shopShelves[pick.index] = null;
    renderShopShelves();
    carry.classList.add("hidden");
    c.state = "checkout";
    setCustomerExpr(el, "wait");
    const checkout = getShelfCenter(0);
    moveCustomerEl(el, checkout.x + 6, checkout.y);
    el.classList.add("at-checkout");
    el.querySelector(".cust-pay").classList.remove("hidden");
    el.querySelector(".cust-progress").classList.remove("hidden");
  }, 2000);

  el.addEventListener("click", () => checkoutCustomer(c.id));
}

function checkoutCustomer(id) {
  const c = shopCustomers.find((x) => x.id === id);
  if (!c || c.state !== "checkout" || !shopRunning) return;
  c.state = "done";
  shopMoney += c.price;
  shopRoundEarn += c.price;
  shopOrders += 1;
  shopRating = Math.min(99, shopRating + 1);
  shopHearts = Math.min(90, shopHearts + 1);
  playShopSound("cash");
  renderShopHUD();
  setCustomerExpr(c.el, "glad");
  c.el.classList.add("paid");
  setTimeout(() => removeShopCustomer(id), 400);
}

function removeShopCustomer(id) {
  const i = shopCustomers.findIndex((x) => x.id === id);
  if (i < 0) return;
  shopCustomers[i].el.remove();
  shopCustomers.splice(i, 1);
}

function endShopRound() {
  shopRunning = false;
  clearShopTimers();
  shopCustomers.forEach((c) => c.el.remove());
  shopCustomers = [];
  shopRoundTotal.textContent = shopRoundEarn;
  shopRoundOrders.textContent = shopOrders;
  shopRoundRating.textContent = shopRating;
  shopRoundEnd.classList.remove("hidden");
}

function resetShopRound(keepStats) {
  clearShopTimers();
  shopCustomers.forEach((c) => c.el.remove());
  shopCustomers = [];
  shopShelves = [null, null, null, null, null, null, null];
  shopSelected = null;
  shopOrders = 0;
  shopRoundEarn = 0;
  shopTimeLeft = 60;
  if (!keepStats) {
    shopMoney = 50;
    shopRating = 80;
    shopHearts = 80;
  }
  shopRoundEnd.classList.add("hidden");
  renderShopHUD();
  renderShopProducts();
  renderShopShelves();
}

function startShopRound() {
  resetShopRound(true);
  shopRunning = true;
  shopTutorial.classList.add("hidden");
  seedShopShelves();
  renderShopHUD();
  startShopBGM();
  shopTimers.push(setInterval(() => {
    if (!shopRunning) return;
    shopTimeLeft -= 1;
    shopTimerEl.textContent = `${shopTimeLeft}s`;
    if (shopTimeLeft <= 0) endShopRound();
  }, 1000));
  shopTimers.push(setInterval(() => {
    if (shopRunning) spawnShopCustomer();
  }, 2800));
  setTimeout(() => {
    if (shopRunning) spawnShopCustomer();
  }, 400);
  setTimeout(() => {
    if (shopRunning) spawnShopCustomer();
  }, 1600);
}

function enterShopPlay() {
  showShopScene(shopPlay);
  resetShopRound(false);
  shopTutorial.classList.remove("hidden");
  renderShopProducts();
  renderShopShelves();
  startShopBGM();
}

function leaveShopPlay() {
  shopRunning = false;
  clearShopTimers();
  stopShopBGM();
  shopCustomers.forEach((c) => c.el.remove());
  shopCustomers = [];
  shopRoundEnd.classList.add("hidden");
}

shopStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  enterShopPlay();
});

shopBackBtn?.addEventListener("click", () => {
  leaveShopPlay();
  showShopScene(shopLanding);
});

shopTutorialOk?.addEventListener("click", startShopRound);
shopRoundAgain?.addEventListener("click", startShopRound);
shopRoundHome?.addEventListener("click", () => {
  leaveShopPlay();
  showShopScene(shopLanding);
});

shopShelfEls.forEach((el) => {
  el.addEventListener("click", () => {
    const idx = parseInt(el.dataset.shelf, 10);
    if (idx > 0) stockShelf(idx);
  });
});

/* ===== 荷芽蹦蹦 ===== */
const LEAP_STORAGE = "leapSave";
const LEAP_SHOP_ITEMS = [
  { id: "hat", name: "Leaf Hat", emoji: "🍃", cost: 1 },
  { id: "bow", name: "Dew Bow", emoji: "💧", cost: 1 },
  { id: "star", name: "Firefly Spot", emoji: "✨", cost: 1 },
];

const leapLanding = document.getElementById("leapLanding");
const leapCoverCanvas = document.getElementById("leapCoverCanvas");
const leapCoverCtx = leapCoverCanvas?.getContext("2d");
const leapPlay = document.getElementById("leapPlay");
const leapStartBtn = document.getElementById("leapStartBtn");
const leapBackBtn = document.getElementById("leapBackBtn");
const leapSaveBtn = document.getElementById("leapSaveBtn");
const leapCanvas = document.getElementById("leapCanvas");
const leapCanvasWrap = document.getElementById("leapCanvasWrap");
const leapCoinsEl = document.getElementById("leapCoins");
const leapComboEl = document.getElementById("leapCombo");
const leapScoreEl = document.getElementById("leapScore");
const leapComboPop = document.getElementById("leapComboPop");
const leapRainEl = document.getElementById("leapRain");
const leapDuskEl = document.getElementById("leapDusk");
const leapHint = document.getElementById("leapHint");
const leapShop = document.getElementById("leapShop");
const leapShopList = document.getElementById("leapShopList");
const leapShopClose = document.getElementById("leapShopClose");
const leapCtx = leapCanvas?.getContext("2d");

let leapRunning = false;
let leapLoopId = 0;
let leapCoins = 0;
let leapScore = 0;
let leapCombo = 0;
let leapBestCombo = 0;
let leapOwned = [];
let leapRainMin = 5;
let leapDuskMin = 7;
let leapRaining = false;
let leapRaindrops = [];
let leapRipples = [];
let leapFireflies = [];
let leapPads = [];
let leapTargetIdx = 1;
let leapFrogPad = 0;
let leapFrog = { x: 0, y: 0, expr: "idle", hop: 0, jumpT: 0, jumpFrom: null, jumpTo: null };
let leapCharging = false;
let leapCharge = 0;
let leapChargeStart = 0;
let leapLastTap = 0;
let leapSplash = null;
let leapTimers = [];
let leapCoverLoopId = 0;
let leapCoverRunning = false;
let leapCoverRain = [];
let leapCoverRipples = [];
let leapCoverFireflies = [];

const LEAP_COVER_PADS = [
  { x: 180, y: 210, r: 38, glow: true },
  { x: 100, y: 175, r: 28 },
  { x: 268, y: 168, r: 30 },
  { x: 58, y: 228, r: 22 },
  { x: 305, y: 218, r: 24 },
  { x: 145, y: 255, r: 32 },
  { x: 228, y: 262, r: 26 },
];

function initLeapCoverFx() {
  if (!leapCoverCanvas) return;
  const w = leapCoverCanvas.width;
  const h = leapCoverCanvas.height;
  leapCoverRain = Array.from({ length: 70 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    len: 10 + Math.random() * 14,
    sp: 5 + Math.random() * 4,
    a: 0.2 + Math.random() * 0.35,
  }));
  leapCoverRipples = [];
  leapCoverFireflies = Array.from({ length: 10 }, () => ({
    x: Math.random() * w,
    y: 40 + Math.random() * h * 0.55,
    ph: Math.random() * Math.PI * 2,
  }));
}

function drawCoverFrog(ctx, x, y, t) {
  const bob = Math.sin(t * 2) * 4;
  y += bob;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 20, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3cb852";
  ctx.beginPath();
  ctx.ellipse(0, 8, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a9a3a";
  ctx.beginPath();
  ctx.ellipse(-12, 14, 10, 7, -0.35, 0, Math.PI * 2);
  ctx.ellipse(12, 14, 10, 7, 0.35, 0, Math.PI * 2);
  ctx.fill();
  [-1, 1].forEach((s) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s * 12, -2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(s * 12 + s * 2, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s * 12 + s * 2.5, -1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "#1f6b30";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 10, 8, 0.25, Math.PI - 0.25);
  ctx.stroke();
  ctx.restore();
}

function drawCoverPad(ctx, p, t) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(p.x + 4, p.y + 6, p.r, p.r * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(p.x - p.r * 0.25, p.y - p.r * 0.3, 4, p.x, p.y, p.r);
  if (p.glow) {
    const pulse = 0.85 + Math.sin(t * 3) * 0.15;
    g.addColorStop(0, `rgba(167,243,235,${pulse})`);
    g.addColorStop(0.55, "#2dd4bf");
    g.addColorStop(1, "#0f766e");
  } else {
    g.addColorStop(0, "#7ee06a");
    g.addColorStop(0.65, "#3d9b4a");
    g.addColorStop(1, "#256832");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.r, p.r * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p.x - p.r * 0.5, p.y);
  ctx.lineTo(p.x + p.r * 0.5, p.y);
  ctx.stroke();
  if (p.glow) {
    ctx.shadowColor = "#5eead4";
    ctx.shadowBlur = 18 + Math.sin(t * 3) * 8;
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r + 2, p.r * 0.72 + 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawLeapCover() {
  if (!leapCoverCtx || !leapCoverCanvas) return;
  const ctx = leapCoverCtx;
  const w = leapCoverCanvas.width;
  const h = leapCoverCanvas.height;
  const t = performance.now() * 0.001;

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  sky.addColorStop(0, "#1e3a5f");
  sky.addColorStop(0.35, "#2d5a6b");
  sky.addColorStop(1, "#3d7a88");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(254,240,138,0.15)";
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.12, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(254,240,138,0.35)";
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.12, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a3340";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.quadraticCurveTo(w * 0.25, h * 0.32, w * 0.5, h * 0.38);
  ctx.quadraticCurveTo(w * 0.78, h * 0.44, w, h * 0.36);
  ctx.lineTo(w, h * 0.52);
  ctx.lineTo(0, h * 0.48);
  ctx.closePath();
  ctx.fill();

  const water = ctx.createLinearGradient(0, h * 0.38, 0, h);
  water.addColorStop(0, "#5ec4d8");
  water.addColorStop(0.4, "#3a9eb5");
  water.addColorStop(1, "#266880");
  ctx.fillStyle = water;
  ctx.fillRect(0, h * 0.38, w, h * 0.62);

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    const y0 = h * 0.42 + i * 28 + (t * 12) % 20;
    ctx.moveTo(0, y0);
    ctx.bezierCurveTo(w * 0.3, y0 + 8, w * 0.7, y0 - 6, w, y0 + 4);
    ctx.stroke();
  }

  leapCoverRipples.forEach((r) => {
    ctx.strokeStyle = `rgba(255,255,255,${r.a * 0.45})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.r * 2.2, r.r * 0.65, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  leapCoverRipples.forEach((r) => { r.r += 0.5; r.a -= 0.015; });
  leapCoverRipples = leapCoverRipples.filter((r) => r.a > 0);
  if (Math.random() > 0.92) {
    leapCoverRipples.push({
      x: 80 + Math.random() * 200,
      y: 200 + Math.random() * 80,
      r: 2,
      a: 0.55,
    });
  }

  LEAP_COVER_PADS.forEach((p) => drawCoverPad(ctx, p, t));
  drawCoverFrog(ctx, 180, 188, t);

  ctx.font = "32px serif";
  ctx.fillText("🪷", 42, 130);
  ctx.font = "22px sans-serif";
  ctx.fillText("🌿", w - 48, 115);

  leapCoverFireflies.forEach((f) => {
    const fx = f.x + Math.sin(t + f.ph) * 18;
    const fy = f.y + Math.cos(t * 0.8 + f.ph) * 10;
    ctx.globalAlpha = 0.4 + Math.sin(t * 4 + f.ph) * 0.35;
    ctx.fillStyle = "#fef08a";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;

  leapCoverRain.forEach((d) => {
    d.y += d.sp;
    d.x -= 1.2;
    if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
    if (d.x < 0) d.x = w;
    ctx.strokeStyle = `rgba(200,230,255,${d.a})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - 2, d.y + d.len);
    ctx.stroke();
  });

  const fade = ctx.createLinearGradient(0, h * 0.55, 0, h);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(0.55, "rgba(0,0,0,0.35)");
  fade.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, h * 0.45, w, h * 0.55);
}

function startLeapCoverAnim() {
  if (!leapCoverCanvas) return;
  initLeapCoverFx();
  leapCoverRunning = true;
  leapCoverLoopId++;
  const id = leapCoverLoopId;
  function tick() {
    if (!leapCoverRunning || id !== leapCoverLoopId) return;
    drawLeapCover();
    requestAnimationFrame(tick);
  }
  tick();
}

function stopLeapCoverAnim() {
  leapCoverRunning = false;
  leapCoverLoopId++;
}

function showLeapScene(scene) {
  [leapLanding, leapPlay].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
}

function loadLeapSave() {
  try {
    const d = JSON.parse(localStorage.getItem(LEAP_STORAGE) || "{}");
    leapCoins = d.coins || 0;
    leapScore = d.score || 0;
    leapBestCombo = d.bestCombo || 0;
    leapOwned = d.owned || [];
  } catch {
    leapCoins = 0;
    leapScore = 0;
    leapBestCombo = 0;
    leapOwned = [];
  }
}

function saveLeapData() {
  localStorage.setItem(LEAP_STORAGE, JSON.stringify({
    coins: leapCoins,
    score: leapScore,
    bestCombo: leapBestCombo,
    owned: leapOwned,
  }));
  leapHint.textContent = "Saved ✓";
  setTimeout(() => { leapHint.textContent = "Hold to charge · land on bright pads · chain combos"; }, 1200);
}

function updateLeapHUD() {
  if (leapCoinsEl) leapCoinsEl.textContent = leapCoins;
  if (leapComboEl) leapComboEl.textContent = leapCombo;
  if (leapScoreEl) leapScoreEl.textContent = leapScore;
}

function showComboPop(text) {
  if (!leapComboPop) return;
  leapComboPop.textContent = text;
  leapComboPop.classList.remove("hidden");
  leapComboPop.classList.remove("pop");
  void leapComboPop.offsetWidth;
  leapComboPop.classList.add("pop");
  setTimeout(() => leapComboPop.classList.add("hidden"), 900);
}

function initLeapWeather() {
  leapRaindrops = Array.from({ length: 55 }, (_, i) => ({
    x: Math.random() * leapCanvas.width,
    y: Math.random() * leapCanvas.height,
    len: 8 + Math.random() * 10,
    speed: 4 + Math.random() * 5,
    opacity: 0.15 + Math.random() * 0.35,
  }));
  leapRipples = [];
  leapFireflies = Array.from({ length: 6 }, () => ({
    x: Math.random() * leapCanvas.width,
    y: Math.random() * leapCanvas.height * 0.6,
    phase: Math.random() * Math.PI * 2,
  }));
}

function setLeapRain(on) {
  leapRaining = on;
  if (leapRainEl) {
    leapRainEl.textContent = on ? "🌧️ Rain" : (leapRainMin ? `Drizzle ${leapRainMin}m` : "Drizzle soon");
    leapRainEl.classList.toggle("raining", on);
  }
}

function tickLeapWeather() {
  leapRaindrops.forEach((d) => {
    d.y += d.speed * (leapRaining ? 1.4 : 0.35);
    d.x -= 0.8;
    if (d.y > leapCanvas.height) {
      d.y = -d.len;
      d.x = Math.random() * leapCanvas.width;
      if (leapRaining && Math.random() > 0.92) {
        leapRipples.push({ x: d.x, y: leapCanvas.height * 0.55 + Math.random() * 80, r: 2, a: 0.5 });
      }
    }
    if (d.x < 0) d.x = leapCanvas.width;
  });
  leapRipples.forEach((r) => { r.r += 0.6; r.a -= 0.018; });
  leapRipples = leapRipples.filter((r) => r.a > 0);
}

function initLeapPads() {
  const w = leapCanvas.width;
  const h = leapCanvas.height;
  leapPads = [
    { x: w * 0.5, y: h * 0.52, r: 34 },
    { x: w * 0.28, y: h * 0.38, r: 26 },
    { x: w * 0.72, y: h * 0.36, r: 28 },
    { x: w * 0.18, y: h * 0.58, r: 22 },
    { x: w * 0.82, y: h * 0.55, r: 24 },
    { x: w * 0.42, y: h * 0.68, r: 30 },
    { x: w * 0.62, y: h * 0.72, r: 26 },
    { x: w * 0.78, y: h * 0.78, r: 20, island: true },
  ];
  leapPads.forEach((p, i) => { p.coin = i !== leapFrogPad && Math.random() > 0.55; });
  leapFrogPad = 0;
  pickLeapTarget();
  syncFrogPos();
}

function pickLeapTarget() {
  let idx;
  do { idx = Math.floor(Math.random() * (leapPads.length - 1)); }
  while (idx === leapFrogPad);
  leapTargetIdx = idx;
}

function syncFrogPos() {
  const p = leapPads[leapFrogPad];
  leapFrog.x = p.x;
  leapFrog.y = p.y - 8;
}

function playLeapSound(type) {
  if (!soundState.leap) return;
  const ctx = getAudioCtx();
  const m = getMaster(ctx, 0.38);
  const t = ctx.currentTime;
  if (type === "jump") playBubble(ctx, m, 440 + leapCharge * 200, t, 0.18);
  else if (type === "land") playBubble(ctx, m, 320, t, 0.22);
  else if (type === "coin") {
    playMusicBox(ctx, m, 880, t, 0.12, 0.35);
    playMusicBox(ctx, m, 1175, t + 0.08, 0.1, 0.35);
  } else if (type === "splash") playBubble(ctx, m, 180, t, 0.25);
  else if (type === "hop") playBubble(ctx, m, 520, t, 0.1);
  else if (type === "combo") {
    playMusicBox(ctx, m, 660 + leapCombo * 40, t, 0.14, 0.4);
    playSparkle(ctx, m, t, 0.2);
  }
}

function startLeapBGM() {
  if (!soundState.leap || leapBgm?.running) return;
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.16;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1800;
  lp.connect(ctx.destination);
  master.connect(lp);
  leapBgm = { running: true, timers: [], master, step: 0 };
  const notes = [392, 440, 494, 523, 494, 440, 392, 349];
  function tick() {
    if (!leapBgm?.running || !soundState.leap) return;
    playMusicBox(ctx, leapBgm.master, notes[leapBgm.step % notes.length], ctx.currentTime, 0.5, 0.3);
    leapBgm.step++;
    leapBgm.timers.push(setTimeout(tick, 650));
  }
  tick();
}

function stopLeapBGM() {
  if (!leapBgm) return;
  leapBgm.running = false;
  leapBgm.timers.forEach(clearTimeout);
  leapBgm = null;
}

function drawLeapFrog(ctx, x, y, expr, hop) {
  const bob = Math.sin(hop) * 4;
  y += bob;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 14, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3d9b4a";
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2d7a38";
  ctx.beginPath();
  ctx.ellipse(-10, 8, 8, 5, -0.4, 0, Math.PI * 2);
  ctx.ellipse(10, 8, 8, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  const eyeY = expr === "jump" ? -2 : -4;
  const eyeScale = expr === "wait" ? 1.15 : 1;
  [-1, 1].forEach((side) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(side * 9, eyeY, 7 * eyeScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    if (expr === "happy" || expr === "glad") {
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(side * 9, eyeY - 1, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (expr === "splash") {
      ctx.fillRect(side * 9 - 4, eyeY, 8, 2);
    } else {
      ctx.beginPath();
      ctx.arc(side * 9 + side, eyeY + 1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(side * 9 + side + 1, eyeY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.strokeStyle = "#2d5a30";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (expr === "happy" || expr === "glad") {
    ctx.arc(0, 6, 6, 0.2, Math.PI - 0.2);
  } else if (expr === "splash") {
    ctx.moveTo(-5, 8);
    ctx.lineTo(5, 8);
  } else {
    ctx.arc(0, 5, 4, 0.2, Math.PI - 0.2);
  }
  ctx.stroke();
  if (leapOwned.includes("hat")) {
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🍃", 0, -16);
  }
  if (leapOwned.includes("star")) {
    ctx.globalAlpha = 0.7 + Math.sin(hop * 2) * 0.3;
    ctx.font = "10px sans-serif";
    ctx.fillText("✨", -14, -8);
    ctx.fillText("✨", 14, -8);
  }
  ctx.restore();
}

function drawLeapPad(ctx, p, i) {
  const isTarget = i === leapTargetIdx;
  const isCurrent = i === leapFrogPad;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(p.x + 3, p.y + 5, p.r, p.r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  if (p.island) {
    ctx.fillStyle = "#8b6914";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r * 1.4, p.r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6b8f3a";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 4, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏝️", p.x, p.y + 2);
    ctx.restore();
    return;
  }
  const grad = ctx.createRadialGradient(p.x - 8, p.y - 8, 4, p.x, p.y, p.r);
  if (isTarget) {
    grad.addColorStop(0, leapRaining ? "#6ee7d8" : "#7ee8d6");
    grad.addColorStop(0.6, leapRaining ? "#14b8a6" : "#2dd4bf");
    grad.addColorStop(1, "#0d9488");
  } else {
    grad.addColorStop(0, leapRaining ? "#5cb84a" : "#6ecf5a");
    grad.addColorStop(0.7, leapRaining ? "#2d7a38" : "#3d9b4a");
    grad.addColorStop(1, "#2d7a38");
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.r, p.r * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  if (leapRaining && !p.island) {
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.ellipse(p.x - 4, p.y - 6, p.r * 0.35, p.r * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (isTarget) {
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (p.coin) {
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🪙", p.x + p.r * 0.35, p.y - p.r * 0.2);
  }
  if (isCurrent && !leapFrog.jumpT) {
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r + 3, p.r * 0.72 + 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLeapGame() {
  if (!leapCtx) return;
  const w = leapCanvas.width;
  const h = leapCanvas.height;
  const t = performance.now() * 0.001;
  tickLeapWeather();
  leapCtx.clearRect(0, 0, w, h);

  const sky = leapCtx.createLinearGradient(0, 0, 0, h);
  if (leapRaining) {
    sky.addColorStop(0, "#5a7a8a");
    sky.addColorStop(0.45, "#4a6d7a");
    sky.addColorStop(1, "#2d5560");
  } else {
    sky.addColorStop(0, "#a8dce8");
    sky.addColorStop(0.35, "#6ec4d8");
    sky.addColorStop(1, "#3a8fad");
  }
  leapCtx.fillStyle = sky;
  leapCtx.fillRect(0, 0, w, h);

  leapCtx.fillStyle = leapRaining ? "rgba(80,110,90,0.25)" : "rgba(60,120,70,0.2)";
  leapCtx.beginPath();
  leapCtx.ellipse(w * 0.5, h * 0.18, w * 0.55, h * 0.12, 0, 0, Math.PI * 2);
  leapCtx.fill();

  leapFireflies.forEach((f) => {
    const fx = f.x + Math.sin(t + f.phase) * 20;
    const fy = f.y + Math.cos(t * 0.7 + f.phase) * 12;
    leapCtx.globalAlpha = 0.35 + Math.sin(t * 3 + f.phase) * 0.25;
    leapCtx.fillStyle = "#fef08a";
    leapCtx.beginPath();
    leapCtx.arc(fx, fy, 2, 0, Math.PI * 2);
    leapCtx.fill();
  });
  leapCtx.globalAlpha = 1;

  leapCtx.font = "26px sans-serif";
  leapCtx.fillText("🪷", w * 0.1, h * 0.2);
  leapCtx.fillText("🌿", w * 0.88, h * 0.16);

  leapRipples.forEach((r) => {
    leapCtx.strokeStyle = `rgba(255,255,255,${r.a * 0.5})`;
    leapCtx.lineWidth = 1.5;
    leapCtx.beginPath();
    leapCtx.ellipse(r.x, r.y, r.r * 2, r.r * 0.6, 0, 0, Math.PI * 2);
    leapCtx.stroke();
  });

  leapPads.forEach((p, i) => drawLeapPad(leapCtx, p, i));

  leapRaindrops.forEach((d) => {
    leapCtx.strokeStyle = `rgba(200,230,255,${d.opacity * (leapRaining ? 1.3 : 0.6)})`;
    leapCtx.lineWidth = leapRaining ? 1.5 : 1;
    leapCtx.beginPath();
    leapCtx.moveTo(d.x, d.y);
    leapCtx.lineTo(d.x - 2, d.y + d.len);
    leapCtx.stroke();
  });

  if (leapRaining) {
    leapCtx.fillStyle = "rgba(255,255,255,0.04)";
    leapCtx.fillRect(0, 0, w, h);
  }

  if (leapSplash) {
    leapCtx.globalAlpha = leapSplash.a;
    leapCtx.font = "22px sans-serif";
    leapCtx.textAlign = "center";
    leapCtx.fillText("💦", leapSplash.x, leapSplash.y);
    leapCtx.globalAlpha = 1;
  }

  let fx = leapFrog.x;
  let fy = leapFrog.y;
  if (leapFrog.jumpT > 0 && leapFrog.jumpT < 1) {
    const a = leapFrog.jumpFrom;
    const b = leapFrog.jumpTo;
    const jt = leapFrog.jumpT;
    fx = a.x + (b.x - a.x) * jt;
    fy = a.y + (b.y - a.y) * jt - Math.sin(jt * Math.PI) * 58;
  }
  if (leapCharging) {
    const ring = leapCtx.createRadialGradient(fx, fy, 10, fx, fy, 28 + leapCharge * 22);
    ring.addColorStop(0, `rgba(126,232,214,${0.15 + leapCharge * 0.2})`);
    ring.addColorStop(1, "rgba(126,232,214,0)");
    leapCtx.fillStyle = ring;
    leapCtx.beginPath();
    leapCtx.arc(fx, fy, 28 + leapCharge * 22, 0, Math.PI * 2);
    leapCtx.fill();
    leapCtx.strokeStyle = `rgba(255,255,255,${0.4 + leapCharge * 0.5})`;
    leapCtx.lineWidth = 3;
    leapCtx.beginPath();
    leapCtx.arc(fx, fy, 20 + leapCharge * 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * leapCharge);
    leapCtx.stroke();
  }

  if (leapCombo >= 2 && !leapFrog.jumpT) {
    leapCtx.font = "bold 11px sans-serif";
    leapCtx.fillStyle = "rgba(255,255,255,0.85)";
    leapCtx.textAlign = "center";
    leapCtx.fillText(`x${leapCombo}`, fx, fy - 28);
  }

  drawLeapFrog(leapCtx, fx, fy, leapFrog.expr, t * 3 + leapFrog.hop);
}

function leapGameTick(loopId) {
  if (!leapRunning || loopId !== leapLoopId) return;
  const now = performance.now();
  if (leapCharging) {
    leapCharge = Math.min(1, (now - leapChargeStart) / 900);
    leapFrog.expr = "wait";
  }
  if (leapFrog.jumpT > 0 && leapFrog.jumpT < 1) {
    leapFrog.jumpT = Math.min(1, leapFrog.jumpT + 0.045);
    leapFrog.expr = "jump";
    if (leapFrog.jumpT >= 1) finishLeapJump();
  }
  if (leapSplash) {
    leapSplash.a -= 0.03;
    leapSplash.y -= 1;
    if (leapSplash.a <= 0) leapSplash = null;
  }
  drawLeapGame();
  requestAnimationFrame(() => leapGameTick(loopId));
}

function finishLeapJump() {
  leapFrog.jumpT = 0;
  const target = leapPads[leapTargetIdx];
  const ok = leapCharge >= 0.35 && Math.hypot(leapFrog.jumpTo.x - target.x, leapFrog.jumpTo.y - (target.y - 8)) < target.r + 12;
  if (ok) {
    leapFrogPad = leapTargetIdx;
    syncFrogPos();
    leapFrog.expr = "happy";
    playLeapSound("land");
    leapCombo += 1;
    const pts = leapCombo * 15 + (leapCombo >= 3 ? leapCombo * 5 : 0);
    leapScore += pts;
    if (leapCombo > leapBestCombo) leapBestCombo = leapCombo;
    updateLeapHUD();
    if (leapCombo >= 2) {
      playLeapSound("combo");
      showComboPop(`Combo x${leapCombo}  +${pts}`);
      leapHint.textContent = leapCombo >= 5 ? "Amazing combo master!" : `Combo ${leapCombo} — keep going!`;
    }
    if (target.coin) {
      target.coin = false;
      leapCoins += 1;
      updateLeapHUD();
      playLeapSound("coin");
      if (leapCombo < 2) leapHint.textContent = "Coin +1";
    } else if (leapCombo < 2) {
      leapHint.textContent = "Nice! Find the next bright pad";
    }
    pickLeapTarget();
    leapPads[leapTargetIdx].coin = Math.random() > 0.5;
  } else {
    if (leapCombo >= 3) showComboPop(`Combo broke x${leapCombo}`);
    leapCombo = 0;
    updateLeapHUD();
    leapFrog.expr = "splash";
    playLeapSound("splash");
    leapSplash = { x: leapFrog.jumpTo.x, y: leapFrog.jumpTo.y, a: 1 };
    syncFrogPos();
    leapHint.textContent = "Splash~ combo broken, try again";
  }
  leapCharge = 0;
  setTimeout(() => { if (leapFrog.expr !== "wait") leapFrog.expr = "idle"; }, 600);
}

function doLeapHop() {
  if (leapFrog.jumpT > 0) return;
  leapFrog.hop += 1;
  leapFrog.expr = "happy";
  playLeapSound("hop");
  setTimeout(() => { leapFrog.expr = "idle"; }, 300);
}

function startLeapJump() {
  if (leapFrog.jumpT > 0) return;
  if (leapCharge < 0.15) {
    leapHint.textContent = "Hold a bit longer~";
    leapCharge = 0;
    return;
  }
  const fromPad = leapPads[leapFrogPad];
  const to = leapPads[leapTargetIdx];
  const power = Math.min(1, leapCharge);
  leapFrog.jumpFrom = { x: leapFrog.x, y: leapFrog.y };
  if (power >= 0.35) {
    leapFrog.jumpTo = { x: to.x, y: to.y - 8 };
  } else {
    leapFrog.jumpTo = {
      x: fromPad.x + (to.x - fromPad.x) * (0.25 + power * 0.5),
      y: fromPad.y + (to.y - fromPad.y) * (0.25 + power * 0.5),
    };
  }
  leapFrog.jumpT = 0.01;
  playLeapSound("jump");
}

function renderLeapShop() {
  leapShopList.innerHTML = "";
  LEAP_SHOP_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const owned = leapOwned.includes(item.id);
    li.innerHTML = `<span>${item.emoji} ${item.name}</span><button type="button" ${owned ? "disabled" : ""}>${owned ? "Owned" : item.cost + " coins"}</button>`;
    li.querySelector("button")?.addEventListener("click", () => {
      if (leapCoins < item.cost || owned) return;
      leapCoins -= item.cost;
      leapOwned.push(item.id);
      updateLeapHUD();
      saveLeapData();
      renderLeapShop();
    });
    leapShopList.appendChild(li);
  });
}

function clearLeapTimers() {
  leapTimers.forEach(clearInterval);
  leapTimers = [];
}

function startLeapGame() {
  leapLoopId++;
  const loopId = leapLoopId;
  leapRunning = true;
  loadLeapSave();
  leapCombo = 0;
  updateLeapHUD();
  leapRainMin = 5;
  leapDuskMin = 7;
  setLeapRain(false);
  initLeapPads();
  initLeapWeather();
  startLeapBGM();
  clearLeapTimers();
  leapTimers.push(setInterval(() => {
    leapRainMin = Math.max(0, leapRainMin - 1);
    if (leapRainMin <= 0 && !leapRaining) setLeapRain(true);
    else if (leapRainMin > 0) leapRainEl.textContent = `Drizzle ${leapRainMin}m`;
  }, 10000));
  leapTimers.push(setInterval(() => {
    leapDuskMin = Math.max(0, leapDuskMin - 1);
    leapDuskEl.textContent = leapDuskMin ? `Dusk ${leapDuskMin}m` : "🌙 Nightfall";
  }, 12000));
  drawLeapGame();
  requestAnimationFrame(() => leapGameTick(loopId));
}

function stopLeapGame() {
  leapRunning = false;
  leapLoopId++;
  clearLeapTimers();
  stopLeapBGM();
}

function handleLeapPointerDown(e) {
  if (!leapRunning || leapFrog.jumpT > 0) return;
  e.preventDefault();
  const now = performance.now();
  if (now - leapLastTap < 320) {
    doLeapHop();
    leapLastTap = 0;
    return;
  }
  leapLastTap = now;
  leapCharging = true;
  leapChargeStart = now;
  leapCharge = 0;
}

function handleLeapPointerUp() {
  if (!leapCharging) return;
  leapCharging = false;
  startLeapJump();
}

function handleLeapIslandDbl(e) {
  const rect = leapCanvas.getBoundingClientRect();
  const sx = (e.clientX - rect.left) * (leapCanvas.width / rect.width);
  const sy = (e.clientY - rect.top) * (leapCanvas.height / rect.height);
  const island = leapPads[leapPads.length - 1];
  if (Math.hypot(sx - island.x, sy - island.y) < island.r * 2) {
    renderLeapShop();
    leapShop.classList.remove("hidden");
  }
}

leapStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopLeapCoverAnim();
  showLeapScene(leapPlay);
  startLeapGame();
});

leapBackBtn?.addEventListener("click", () => {
  saveLeapData();
  stopLeapGame();
  showLeapScene(leapLanding);
  startLeapCoverAnim();
});

leapSaveBtn?.addEventListener("click", saveLeapData);
leapShopClose?.addEventListener("click", () => leapShop.classList.add("hidden"));

leapCanvasWrap?.addEventListener("mousedown", handleLeapPointerDown);
leapCanvasWrap?.addEventListener("mouseup", handleLeapPointerUp);
leapCanvasWrap?.addEventListener("mouseleave", handleLeapPointerUp);
leapCanvasWrap?.addEventListener("touchstart", handleLeapPointerDown, { passive: false });
leapCanvasWrap?.addEventListener("touchend", handleLeapPointerUp);
leapCanvas?.addEventListener("dblclick", handleLeapIslandDbl);

/* startLeapCoverAnim deferred — see feed lazy init */

/* ===== 流光疾跑 ===== */
const runLanding = document.getElementById("runLanding");
const runPlay = document.getElementById("runPlay");
const runStartBtn = document.getElementById("runStartBtn");
const runBackBtn = document.getElementById("runBackBtn");
const runAgainBtn = document.getElementById("runAgainBtn");
const runShareBtn = document.getElementById("runShareBtn");
const runCanvas = document.getElementById("runCanvas");
const runCanvasWrap = document.getElementById("runCanvasWrap");
const runCoverCanvas = document.getElementById("runCoverCanvas");
const runCoverCtx = runCoverCanvas?.getContext("2d");
const runCtx = runCanvas?.getContext("2d");
const runScoreEl = document.getElementById("runScore");
const runCoinsEl = document.getElementById("runCoins");
const runDistEl = document.getElementById("runDist");
const runHint = document.getElementById("runHint");
const runOver = document.getElementById("runOver");
const runOverScore = document.getElementById("runOverScore");
const runOverDist = document.getElementById("runOverDist");

let runLoopId = 0;
let runCoverLoopId = 0;
let runCoverRunning = false;
let runActive = false;
let runLane = 1;
let runJump = 0;
let runSlide = 0;
let runEntities = [];
let lastRunScore = 0;
let lastRunDist = 0;
let runCoins = 0;
let runDist = 0;
let runSpeed = 0.013;
let runSpawnT = 0;
let runBuildings = [];

function showRunScene(el) {
  [runLanding, runPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function runLaneX(lane, z, w) {
  const spread = 55 + z * 100;
  return w / 2 + (lane - 1) * spread;
}

function runLaneY(z, h) {
  return h * 0.32 + (1 - z) * h * 0.58;
}

function runEntScale(z) {
  return 0.25 + (1 - z) * 0.85;
}

function initRunBuildings() {
  runBuildings = Array.from({ length: 14 }, (_, i) => ({
    x: (i / 14) * 360 + Math.random() * 20,
    h: 40 + Math.random() * 80,
    w: 22 + Math.random() * 28,
    c: ["#ec4899", "#22d3ee", "#eab308", "#a855f7", "#4ade80"][i % 5],
  }));
}

function spawnRunEntity() {
  const lane = Math.floor(Math.random() * 3);
  const coin = Math.random() > 0.42;
  if (coin) {
    runEntities.push({ type: "coin", lane, z: 1.05 });
  } else {
    const tall = Math.random() > 0.55;
    runEntities.push({ type: tall ? "bar" : "block", lane, z: 1.05 });
  }
}

function updateRunHUD() {
  if (runScoreEl) runScoreEl.textContent = runScore;
  if (runCoinsEl) runCoinsEl.textContent = runCoins;
  if (runDistEl) runDistEl.textContent = Math.floor(runDist);
}

function playRunSound(type) {
  if (!soundState.run) return;
  const ctx = getAudioCtx();
  const m = getMaster(ctx, 0.38);
  const t = ctx.currentTime;
  if (type === "coin") {
    playMusicBox(ctx, m, 988, t, 0.1, 0.35);
    playMusicBox(ctx, m, 1319, t + 0.06, 0.08, 0.35);
  } else if (type === "jump") playBubble(ctx, m, 520, t, 0.12);
  else if (type === "slide") playBubble(ctx, m, 280, t, 0.14);
  else if (type === "hit") playBubble(ctx, m, 120, t, 0.3);
  else if (type === "lane") playBubble(ctx, m, 440, t, 0.08);
}

function startRunBGM() {
  if (!soundState.run || runBgm?.running) return;
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.14;
  master.connect(ctx.destination);
  runBgm = { running: true, timers: [], master, step: 0 };
  const bass = [110, 110, 98, 98, 87, 87, 98, 110];
  function tick() {
    if (!runBgm?.running || !soundState.run) return;
    playBubble(ctx, runBgm.master, bass[runBgm.step % bass.length], ctx.currentTime, 0.2);
    if (runBgm.step % 2 === 0) {
      playMusicBox(ctx, runBgm.master, 440 + (runBgm.step % 4) * 55, ctx.currentTime, 0.08, 0.25);
    }
    runBgm.step++;
    runBgm.timers.push(setTimeout(tick, 280));
  }
  tick();
}

function stopRunBGM() {
  if (!runBgm) return;
  runBgm.running = false;
  runBgm.timers.forEach(clearTimeout);
  runBgm = null;
}

function drawRunRoad(ctx, w, h, t) {
  ctx.fillStyle = "#0a0618";
  ctx.fillRect(0, 0, w, h);
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
  sky.addColorStop(0, "#1a0a2e");
  sky.addColorStop(1, "#2d1b4e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.42);
  runBuildings.forEach((b, i) => {
    const bx = (b.x + t * 5 + i * 7) % (w + 40) - 20;
    ctx.fillStyle = b.c;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(bx, h * 0.42 - b.h, b.w, b.h);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(bx + 4, h * 0.42 - b.h + 8, 4, 4);
    ctx.fillRect(bx + 12, h * 0.42 - b.h + 20, 4, 4);
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ec4899";
  ctx.shadowColor = "#ec4899";
  ctx.shadowBlur = 20;
  ctx.fillRect(0, h * 0.42 - 2, w, 3);
  ctx.shadowBlur = 0;
  for (let i = 0; i <= 10; i++) {
    const z = i / 10;
    const y = runLaneY(z, h);
    const lx = runLaneX(0, z, w);
    const rx = runLaneX(2, z, w);
    const cx = runLaneX(1, z, w);
    ctx.strokeStyle = `rgba(34,211,238,${0.15 + (1 - z) * 0.45})`;
    ctx.lineWidth = 1 + (1 - z) * 2;
    ctx.beginPath();
    ctx.moveTo(lx, y);
    ctx.lineTo(runLaneX(0, Math.max(0, z - 0.08), w), runLaneY(Math.max(0, z - 0.08), h));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rx, y);
    ctx.lineTo(runLaneX(2, Math.max(0, z - 0.08), w), runLaneY(Math.max(0, z - 0.08), h));
    ctx.stroke();
    if (i < 10) {
      ctx.setLineDash([6 * (1 - z), 8 * (1 - z)]);
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(runLaneX(1, z + 0.1, w), runLaneY(Math.min(1, z + 0.1), h));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.fillStyle = "rgba(236,72,153,0.08)";
  ctx.beginPath();
  ctx.moveTo(runLaneX(0, 1, w), h);
  ctx.lineTo(runLaneX(2, 1, w), h);
  ctx.lineTo(w / 2 + 30, h * 0.38);
  ctx.lineTo(w / 2 - 30, h * 0.38);
  ctx.closePath();
  ctx.fill();
}

function drawRunPlayer(ctx, w, h) {
  const z = 0.08;
  let x = runLaneX(runLane, z, w);
  let y = runLaneY(z, h);
  const jumpY = runJump > 0 ? -Math.sin(Math.min(1, runJump) * Math.PI) * 55 : 0;
  y += jumpY;
  const slide = runSlide > 0;
  const sh = slide ? 18 : 42;
  const sw = slide ? 28 : 22;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(236,72,153,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 30, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!slide) {
    ctx.fillStyle = "#f472b6";
    ctx.shadowColor = "#ec4899";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -sh * 0.35, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = "#22d3ee";
  ctx.shadowColor = "#22d3ee";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-sw / 2, -sh * 0.15, sw, sh * 0.7, 8);
  else ctx.rect(-sw / 2, -sh * 0.15, sw, sh * 0.7);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawRunEntities(ctx, w, h) {
  runEntities.sort((a, b) => b.z - a.z);
  runEntities.forEach((e) => {
    const x = runLaneX(e.lane, e.z, w);
    const y = runLaneY(e.z, h);
    const s = runEntScale(e.z);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    if (e.type === "coin") {
      ctx.fillStyle = "#fde047";
      ctx.shadowColor = "#fde047";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(0, -20, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.ellipse(0, -24, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (e.type === "block") {
      ctx.fillStyle = "#a855f7";
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 10;
      ctx.fillRect(-16, -18, 32, 22);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "#6366f1";
      ctx.shadowColor = "#818cf8";
      ctx.shadowBlur = 10;
      ctx.fillRect(-20, -38, 40, 8);
      ctx.fillRect(-4, -38, 8, 30);
    }
    ctx.restore();
  });
}

function drawRunGame() {
  if (!runCtx || !runCanvas) return;
  const w = runCanvas.width;
  const h = runCanvas.height;
  const t = performance.now() * 0.001;
  drawRunRoad(runCtx, w, h, t);
  drawRunEntities(runCtx, w, h);
  drawRunPlayer(runCtx, w, h);
}

function runGameTick(loopId) {
  if (!runActive || loopId !== runLoopId) return;
  const dt = 1;
  runDist += runSpeed * 80;
  runScore += Math.floor(runSpeed * 55);
  runSpeed = Math.min(0.028, runSpeed + 0.000008);
  if (runJump > 0) runJump = Math.max(0, runJump - 0.028);
  if (runSlide > 0) runSlide = Math.max(0, runSlide - 0.024);
  runSpawnT += runSpeed;
  if (runSpawnT > 0.55) {
    runSpawnT = 0;
    spawnRunEntity();
  }
  runEntities.forEach((e) => { e.z -= runSpeed; });
  runEntities = runEntities.filter((e) => {
    if (e.z < -0.05) return false;
    if (e.z > 0.04 && e.z < 0.14 && e.lane === runLane) {
      if (e.type === "coin") {
        runCoins += 1;
        runScore += 25;
        playRunSound("coin");
        return false;
      }
      if (e.type === "block") {
        if (runJump > 0.25) return false;
        endRunGame();
        return false;
      }
      if (e.type === "bar") {
        if (runSlide > 0.15) return false;
        endRunGame();
        return false;
      }
    }
    return true;
  });
  updateRunHUD();
  drawRunGame();
  requestAnimationFrame(() => runGameTick(loopId));
}

function runAction(dir) {
  if (!runActive) return;
  if (dir === "left" && runLane > 0) { runLane--; playRunSound("lane"); }
  if (dir === "right" && runLane < 2) { runLane++; playRunSound("lane"); }
  if (dir === "up" && runJump <= 0 && runSlide <= 0) { runJump = 1; playRunSound("jump"); }
  if (dir === "down" && runSlide <= 0 && runJump <= 0) { runSlide = 1; playRunSound("slide"); }
}

function resetRunGame() {
  runLane = 1;
  runJump = 0;
  runSlide = 0;
  runEntities = [];
  runScore = 0;
  runCoins = 0;
  runDist = 0;
  runSpeed = 0.013;
  runSpawnT = 0;
  initRunBuildings();
  runOver?.classList.add("hidden");
  updateRunHUD();
}

function startRunGame() {
  runLoopId++;
  const id = runLoopId;
  resetRunGame();
  runActive = true;
  startRunBGM();
  requestAnimationFrame(() => runGameTick(id));
}

function endRunGame() {
  runActive = false;
  runLoopId++;
  stopRunBGM();
  playRunSound("hit");
  lastRunScore = runScore;
  lastRunDist = Math.floor(runDist);
  if (runOverScore) runOverScore.textContent = runScore;
  if (runOverDist) runOverDist.textContent = lastRunDist;
  runOver?.classList.remove("hidden");
}

function drawRunCover() {
  if (!runCoverCtx || !runCoverCanvas) return;
  const ctx = runCoverCtx;
  const w = runCoverCanvas.width;
  const h = runCoverCanvas.height;
  const t = performance.now() * 0.001;
  ctx.fillStyle = "#0a0618";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 10; i++) {
    const bx = (i * 40 + t * 20) % (w + 30);
    const bh = 50 + (i % 4) * 25;
    ctx.fillStyle = ["#ec4899", "#22d3ee", "#eab308", "#a855f7"][i % 4];
    ctx.fillRect(bx, h * 0.55 - bh, 28, bh);
  }
  ctx.strokeStyle = "#22d3ee";
  ctx.shadowColor = "#22d3ee";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h);
  ctx.lineTo(w * 0.35, h * 0.5);
  ctx.lineTo(w * 0.65, h * 0.5);
  ctx.lineTo(w * 0.8, h);
  ctx.stroke();
  ctx.shadowBlur = 0;
  const px = w / 2 + Math.sin(t * 2) * 30;
  ctx.fillStyle = "#f472b6";
  ctx.beginPath();
  ctx.arc(px, h * 0.62, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(px - 11, h * 0.66, 22, 36, 6);
  else ctx.rect(px - 11, h * 0.66, 22, 36);
  ctx.fill();
}

function startRunCoverAnim() {
  if (!runCoverCanvas) return;
  runCoverRunning = true;
  runCoverLoopId++;
  const id = runCoverLoopId;
  function tick() {
    if (!runCoverRunning || id !== runCoverLoopId) return;
    drawRunCover();
    requestAnimationFrame(tick);
  }
  tick();
}

function stopRunCoverAnim() {
  runCoverRunning = false;
  runCoverLoopId++;
}

runStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopRunCoverAnim();
  showRunScene(runPlay);
  startRunGame();
});

runBackBtn?.addEventListener("click", () => {
  runActive = false;
  runLoopId++;
  stopRunBGM();
  showRunScene(runLanding);
  startRunCoverAnim();
});

runAgainBtn?.addEventListener("click", startRunGame);
runShareBtn?.addEventListener("click", () => {
  shareScoreCard({
    gameName: "Neon Rush",
    scoreLine: `Score: ${lastRunScore}\nDistance: ${lastRunDist} m`,
    tag: "#NeonRush",
    filename: "vibeverse-neon-rush.png",
    caption: `Scored ${lastRunScore} pts · ${lastRunDist}m on Neon Rush #NeonRush — VibeVerse`,
  });
});

document.querySelectorAll(".run-dpad-btn").forEach((btn) => {
  btn.addEventListener("click", () => runAction(btn.dataset.run));
});

runCanvasWrap?.addEventListener("keydown", (e) => {
  const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
  if (map[e.key]) { e.preventDefault(); runAction(map[e.key]); }
});
runCanvasWrap?.setAttribute("tabindex", "0");

document.addEventListener("keydown", (e) => {
  if (!runActive) return;
  const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
  if (map[e.key]) { e.preventDefault(); runAction(map[e.key]); }
});

/* startRunCoverAnim deferred — see feed lazy init */

/* ===== Tab 切换 ===== */
const feedEmpty = document.getElementById("feedEmpty");
const gameCategories = document.getElementById("gameCategories");
let activeGameCategory = "all";

const GAME_CATEGORIES = {
  chick: "chill", run: "arcade", shop: "chill", sente: "social",
  fortune: "chill", earth: "chill", block: "puzzle", leap: "arcade",
  face: "social", box: "social", pet: "chill", spot: "chill",
  mj: "chill", star: "arcade", stack: "puzzle", match: "puzzle",
  merge: "puzzle", beat: "arcade",
};

const TODAY_PICKS = [
  { game: "run", label: "Neon Rush — dodge 300m+", challenge: "Reach 300m in one run" },
  { game: "chick", label: "Squishy Chick — 50 taps", challenge: "Tap the chick 50 times" },
  { game: "shop", label: "Fruit Stand — $80 revenue", challenge: "Earn $80 in one round" },
  { game: "box", label: "Flavor Box — guess 5 tastes", challenge: "Open 5 boxes today" },
  { game: "leap", label: "Lily Pad Leap — 10 combo", challenge: "Chain a 10 combo jump" },
  { game: "merge", label: "Number Merge — tile 128", challenge: "Merge up to 128" },
  { game: "star", label: "Starfall — score 200+", challenge: "Score 200 before a meteor hits" },
  { game: "beat", label: "Beat Tap — combo x10", challenge: "Build a 10-hit combo" },
  { game: "match", label: "Memory Match — under 20 moves", challenge: "Clear the board in ≤20 moves" },
  { game: "stack", label: "Stack Rush — 15 levels", challenge: "Stack 15 levels before the tower falls" },
  { game: "face", label: "Runway Glow-Up — full slay", challenge: "Complete all glow-up rounds" },
  { game: "fortune", label: "Daily Fortune — draw & share", challenge: "Draw once and share your fortune" },
  { game: "earth", label: "Blue Planet — complete a quest", challenge: "Finish one real-world quest today" },
  { game: "spot", label: "Salt Lake — check in", challenge: "Snap and share a travel check-in" },
  { game: "block", label: "Cute Stack — score 500", challenge: "Reach 500 points in one run" },
  { game: "sente", label: "Meme lines — share a card", challenge: "Generate and share one meme line" },
  { game: "pet", label: "Office Pets — unlock 5 scenes", challenge: "Cycle through 5 pet moods" },
  { game: "mj", label: "Tile Draw — 20 tiles", challenge: "Draw 20 tiles in one session" },
];

const WHATS_NEW = [
  "Share cards on every game — tap 📤 after you play.",
  "Browse Arcade, Puzzle, Chill & Social category hubs.",
  "Press / to search any game instantly.",
  "Star favorites — find them on Saved ⭐.",
  "Build a daily vibe streak — play once a day.",
  "18 deep guides with tips, FAQ & play links.",
  "Today's pick rotates a new challenge daily.",
  "What's new page — see the full changelog.",
];

const GAME_LABELS = {
  fortune: "Daily Fortune", earth: "Blue Planet Diary", chick: "Squishy Chick",
  block: "Cute Stack", shop: "Fresh Fruit Stand", leap: "Lily Pad Leap",
  run: "Neon Rush", face: "Runway Glow-Up", box: "Mystery Flavor Box",
  sente: "Born To vs Forced To", pet: "Office Pets", spot: "Rainbow Salt Lake",
  mj: "Tile Draw", star: "Starfall", stack: "Stack Rush", match: "Memory Match",
  merge: "Number Merge", beat: "Beat Tap",
};

let feedSearchQuery = "";

function applyFeedSearchFilter(q) {
  const query = q.trim().toLowerCase();
  document.querySelectorAll(".feed-item").forEach((item) => {
    const game = item.dataset.game || "";
    const label = (GAME_LABELS[game] || game).toLowerCase();
    const title = item.querySelector(".feed-title")?.textContent?.toLowerCase() || "";
    const desc = item.querySelector(".feed-desc")?.textContent?.toLowerCase() || "";
    const match = !query || label.includes(query) || game.includes(query) || title.includes(query) || desc.includes(query);
    item.classList.toggle("hidden", !match);
  });
  document.querySelectorAll(".ad-in-feed").forEach((ad) => ad.classList.add("hidden"));
  gameCategories?.classList.add("hidden");
  const count = document.querySelectorAll(".feed-item:not(.hidden)").length;
  feedEmpty?.classList.toggle("hidden", count > 0);
  if (typeof refreshFeedProgress === "function") refreshFeedProgress();
}

function applyFeedVisibility() {
  if (feedSearchQuery) {
    applyFeedSearchFilter(feedSearchQuery);
    return;
  }
  const tab = document.querySelector(".tab.active")?.dataset.tab || "recommend";
  document.querySelectorAll(".feed-item").forEach((item) => {
    const tabMatch = item.dataset.feed === tab;
    const cat = item.dataset.category || "chill";
    const catMatch = tab !== "games" || activeGameCategory === "all" || cat === activeGameCategory;
    item.classList.toggle("hidden", !(tabMatch && catMatch));
  });
  document.querySelectorAll(".ad-in-feed").forEach((ad) => {
    ad.classList.toggle("hidden", ad.dataset.feedTab !== tab);
  });
  const count = document.querySelectorAll(`.feed-item[data-feed="${tab}"]:not(.hidden)`).length;
  feedEmpty?.classList.toggle("hidden", count > 0);
  gameCategories?.classList.toggle("hidden", tab !== "games");
  document.querySelector(".feed-intro:not(.feed-intro-learn)")?.classList.toggle("hidden", tab !== "recommend");
  document.getElementById("feedIntroLearn")?.classList.toggle("hidden", tab !== "knowledge");
  document.body.dataset.feedTab = tab;
  if (typeof refreshFeedProgress === "function") refreshFeedProgress();
  if (typeof feedLazyOnTabSwitch === "function") feedLazyOnTabSwitch(tab);
}

function switchFeedTab(tabName) {
  const prevTab = document.body.dataset.feedTab || document.querySelector(".tab.active")?.dataset.tab || "recommend";
  const nextTab = tabName || document.querySelector(".tab.active")?.dataset.tab || "recommend";
  applyFeedVisibility();
  if (nextTab !== prevTab) {
    const feed = document.getElementById("feed");
    if (feed) feed.scrollTop = 0;
  }
  if (nextTab !== "knowledge") {
    const learnInput = document.getElementById("learnFeedSearch");
    if (learnInput?.value) {
      learnInput.value = "";
      if (typeof window.syncLearnSearch === "function") window.syncLearnSearch("");
    }
  }
}

function switchGameCategory(cat) {
  activeGameCategory = cat || "all";
  gameCategories?.querySelectorAll(".game-cat").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.cat === activeGameCategory);
  });
  applyFeedVisibility();
}

function playGameFx(game, type) {
  if (!soundState[game]) return;
  const ctx = getAudioCtx();
  const m = getMaster(ctx, 0.36);
  const t = ctx.currentTime;
  if (type === "good") playMusicBox(ctx, m, 784, t, 0.1, 0.4);
  else if (type === "bad") playBubble(ctx, m, 140, t, 0.3);
  else if (type === "tap") playBubble(ctx, m, 440, t, 0.12);
  else if (type === "win") playSparkle(ctx, m, t, 0.35);
  else if (type === "drum") {
    playBubble(ctx, m, 180, t, 0.45);
    playBubble(ctx, m, 90, t + 0.02, 0.35);
  }
}

/* ===== 一秒超模变脸 ===== */
const FACE_ROUNDS = [
  { lazy: "Monday face", model: "Runway ice queen", lazyTag: "Nope", modelTag: "SLAY" },
  { lazy: "Couch potato", model: "Red carpet pose", lazyTag: "Slouch", modelTag: "Queen" },
  { lazy: "Bare-faced yawn", model: "Magazine cover", lazyTag: "Raw", modelTag: "Iconic" },
  { lazy: "Delivery mode", model: "Haute couture turn", lazyTag: "Waiting", modelTag: "Power" },
  { lazy: "Brain offline", model: "Finale face", lazyTag: "AFK", modelTag: "Finale" },
];

const faceLanding = document.getElementById("faceLanding");
const facePlay = document.getElementById("facePlay");
const faceStartBtn = document.getElementById("faceStartBtn");
const faceBackBtn = document.getElementById("faceBackBtn");
const faceAgainBtn = document.getElementById("faceAgainBtn");
const faceRetryBtn = document.getElementById("faceRetryBtn");
const faceBeatBtn = document.getElementById("faceBeatBtn");
const faceCanvas = document.getElementById("faceCanvas");
const faceCoverCanvas = document.getElementById("faceCoverCanvas");
const faceCtx = faceCanvas?.getContext("2d");
const faceCoverCtx = faceCoverCanvas?.getContext("2d");
const faceRoundEl = document.getElementById("faceRound");
const faceStateLabel = document.getElementById("faceStateLabel");
const faceBeatHint = document.getElementById("faceBeatHint");
const faceBeatRing = document.getElementById("faceBeatRing");
const faceFlash = document.getElementById("faceFlash");
const faceWin = document.getElementById("faceWin");
const faceFail = document.getElementById("faceFail");
const faceFailMsg = document.getElementById("faceFailMsg");
const faceStageWrap = document.getElementById("faceStageWrap");
const faceSticker = document.getElementById("faceSticker");
const faceShareTikTok = document.getElementById("faceShareTikTok");
const faceShareIg = document.getElementById("faceShareIg");

let faceCoverOn = false;
let faceCoverId = 0;
let faceAnimId = 0;
let faceActive = false;
let faceRound = 0;
let faceIsModel = false;
let facePhase = "idle";
let facePulse = 0;
let faceWindowOpen = false;
let faceWindowStart = 0;
let facePulseTimer = null;
let faceRevealTimer = null;

function showFaceScene(el) {
  [faceLanding, facePlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function clearFaceTimers() {
  clearTimeout(facePulseTimer);
  clearTimeout(faceRevealTimer);
  facePulseTimer = null;
  faceRevealTimer = null;
}

function playFaceDrum() {
  playGameFx("face", "drum");
}

function drawFacePerson(ctx, w, h, mode, t, data) {
  const lazy = mode === "lazy";
  const label = lazy ? data.lazy : data.model;
  const tag = lazy ? data.lazyTag : data.modelTag;
  const cx = w / 2;
  const cy = h * 0.44;

  if (lazy) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#fce7f3");
    bg.addColorStop(0.55, "#fbcfe8");
    bg.addColorStop(1, "#e9d5ff");
    ctx.fillStyle = bg;
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#0f0a1a");
    bg.addColorStop(0.45, "#4a044e");
    bg.addColorStop(1, "#831843");
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, 0, w, h);

  if (lazy) {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h * 0.25, 50, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(236,72,153,0.5)";
    ctx.fillText("zzz", w * 0.15 + Math.sin(t * 2) * 4, h * 0.22);
  } else {
    const spot = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy, 140);
    spot.addColorStop(0, "rgba(255,255,255,0.35)");
    spot.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) {
      const a = t * 1.5 + i * 0.9;
      const sx = cx + Math.cos(a) * (80 + (i % 3) * 18);
      const sy = cy - 40 + Math.sin(a) * (50 + (i % 2) * 20);
      ctx.fillStyle = i % 2 ? "#fde047" : "#f472b6";
      ctx.globalAlpha = 0.5 + Math.sin(t * 3 + i) * 0.3;
      drawStarShape(ctx, sx, sy, 4 + (i % 3));
    }
    ctx.globalAlpha = 1;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(lazy ? -0.05 : Math.sin(t * 2.5) * 0.04);

  if (lazy) {
    ctx.fillStyle = "#fda4af";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-52, 42, 104, 88, 18);
    else ctx.rect(-52, 42, 104, 88);
    ctx.fill();
    ctx.fillStyle = "#fecdd3";
    ctx.beginPath();
    ctx.ellipse(0, -6, 42, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fb7185";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(-22 + i * 9, -48 + Math.sin(t * 2 + i) * 3, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.fillRect(-30, 8, 60, 14);
    ctx.fillStyle = "#881337";
    ctx.beginPath();
    ctx.arc(-11, 0, 4, 0, Math.PI * 2);
    ctx.arc(11, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#881337";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 12, 8, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.fillStyle = "#475569";
    ctx.fillRect(38, 30, 22, 36);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(41, 34, 16, 22);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px sans-serif";
    ctx.fillText("FOOD", 43, 48);
  } else {
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(-48, 50);
    ctx.lineTo(48, 50);
    ctx.lineTo(42, 110);
    ctx.lineTo(-42, 110);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#be123c";
    ctx.beginPath();
    ctx.moveTo(-46, 50);
    ctx.lineTo(0, 8);
    ctx.lineTo(46, 50);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.ellipse(0, -14, 38, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.moveTo(-40, -28);
    ctx.quadraticCurveTo(0, -38, 40, -28);
    ctx.quadraticCurveTo(0, -18, -40, -28);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(-28, -8);
    ctx.lineTo(-8, -4);
    ctx.lineTo(-26, -2);
    ctx.closePath();
    ctx.moveTo(28, -8);
    ctx.lineTo(8, -4);
    ctx.lineTo(26, -2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, 12);
    ctx.quadraticCurveTo(0, 18, 12, 12);
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(34, -8);
    ctx.lineTo(42, 4);
    ctx.lineTo(34, 16);
    ctx.lineTo(26, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SLAY", 0, -58);
  }
  ctx.restore();

  const pillW = ctx.measureText(tag).width + 28;
  ctx.fillStyle = lazy ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)";
  ctx.strokeStyle = lazy ? "rgba(236,72,153,0.35)" : "rgba(244,114,182,0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cx - pillW / 2, h - 72, pillW, 26, 13);
  else ctx.rect(cx - pillW / 2, h - 72, pillW, 26);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = lazy ? "#be185d" : "#fdf2f8";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tag, cx, h - 54);

  ctx.fillStyle = lazy ? "#831843" : "#fce7f3";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText(label, cx, h - 28);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = lazy ? "rgba(131,24,67,0.65)" : "rgba(252,231,243,0.75)";
  ctx.fillText(lazy ? "😮‍💨 Couch mode" : "💃 Runway mode", cx, h - 10);
}

function drawStarShape(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const ang = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(ang) * r;
    const py = y + Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawFaceScene() {
  if (!faceCtx || !faceCanvas) return;
  const w = faceCanvas.width;
  const h = faceCanvas.height;
  const t = performance.now() * 0.001;
  const data = FACE_ROUNDS[Math.min(faceRound, FACE_ROUNDS.length - 1)];
  drawFacePerson(faceCtx, w, h, faceIsModel ? "model" : "lazy", t, data);
}

function drawFaceCover() {
  if (!faceCoverCtx || !faceCoverCanvas) return;
  const w = faceCoverCanvas.width;
  const h = faceCoverCanvas.height;
  const t = performance.now() * 0.001;
  const lg = faceCoverCtx.createLinearGradient(0, 0, w, h);
  lg.addColorStop(0, "#fdf4ff");
  lg.addColorStop(1, "#fce7f3");
  faceCoverCtx.fillStyle = lg;
  faceCoverCtx.fillRect(0, 0, w, h);
  faceCoverCtx.save();
  faceCoverCtx.beginPath();
  faceCoverCtx.rect(0, 0, w / 2 - 4, h);
  faceCoverCtx.clip();
  drawFacePerson(faceCoverCtx, w, h, "lazy", t, FACE_ROUNDS[0]);
  faceCoverCtx.restore();
  faceCoverCtx.save();
  faceCoverCtx.beginPath();
  faceCoverCtx.rect(w / 2 + 4, 0, w / 2, h);
  faceCoverCtx.clip();
  drawFacePerson(faceCoverCtx, w, h, "model", t + 1, FACE_ROUNDS[0]);
  faceCoverCtx.restore();
  faceCoverCtx.fillStyle = "#fff";
  faceCoverCtx.shadowColor = "#ec4899";
  faceCoverCtx.shadowBlur = 16;
  faceCoverCtx.fillRect(w / 2 - 3, 16, 6, h - 32);
  faceCoverCtx.shadowBlur = 0;
  faceCoverCtx.beginPath();
  faceCoverCtx.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
  faceCoverCtx.fillStyle = "#fff";
  faceCoverCtx.fill();
  faceCoverCtx.strokeStyle = "#ec4899";
  faceCoverCtx.lineWidth = 3;
  faceCoverCtx.stroke();
  faceCoverCtx.font = "bold 18px sans-serif";
  faceCoverCtx.fillStyle = "#db2777";
  faceCoverCtx.textAlign = "center";
  faceCoverCtx.textBaseline = "middle";
  faceCoverCtx.fillText("VS", w / 2, h / 2);
}

function faceAnimLoop() {
  if (faceCoverOn) drawFaceCover();
  if (faceActive) drawFaceScene();
  if (faceActive || faceCoverOn) {
    faceAnimId = requestAnimationFrame(faceAnimLoop);
  } else {
    faceAnimId = 0;
  }
}

function startFaceCover() {
  faceCoverOn = true;
  if (!faceAnimId) faceAnimLoop();
}

function stopFaceCover() {
  faceCoverOn = false;
}

function setFaceRing(active, pulse) {
  if (faceBeatRing) {
    faceBeatRing.classList.toggle("pulse", active);
    faceBeatRing.style.setProperty("--pulse", pulse);
  }
  faceBeatTrack?.querySelectorAll(".face-beat-dot").forEach((dot) => {
    const idx = parseInt(dot.dataset.idx, 10);
    dot.classList.toggle("active", active && idx <= pulse);
    dot.classList.toggle("go-hit", active && pulse >= 4 && idx === 4);
  });
}

function setFaceMood(model) {
  faceStageWrap?.classList.toggle("model-mode", model);
  if (faceStateLabel) faceStateLabel.textContent = model ? "Runway SLAY" : "Couch mode";
}

function startFaceRound() {
  faceIsModel = false;
  setFaceMood(false);
  facePhase = "count";
  facePulse = 0;
  faceWindowOpen = false;
  faceSticker?.classList.add("hidden");
  if (faceRoundEl) faceRoundEl.textContent = `${String(faceRound + 1).padStart(2, "0")}/05`;
  if (faceBeatHint) faceBeatHint.textContent = "Ready… hear beat 1 2 3";
  faceBeatBtn.disabled = false;
  setFaceRing(false, 0);
  scheduleFacePulse();
}

function scheduleFacePulse() {
  clearTimeout(facePulseTimer);
  facePulseTimer = setTimeout(() => {
    if (!faceActive) return;
    facePulse++;
    playFaceDrum();
    setFaceRing(true, facePulse);
    faceBeatRing?.classList.add("hit");
    setTimeout(() => faceBeatRing?.classList.remove("hit"), 120);

    if (facePulse < 4) {
      if (faceBeatHint) faceBeatHint.textContent = facePulse < 3 ? `beat ${facePulse}…` : "Final beat!";
      scheduleFacePulse();
    } else {
      faceWindowOpen = true;
      faceWindowStart = performance.now();
      facePhase = "window";
      if (faceBeatHint) faceBeatHint.textContent = "NOW! Hit it!";
      facePulseTimer = setTimeout(() => {
        if (facePhase === "window" && faceWindowOpen) {
          failFaceRound("Missed the beat window");
        }
      }, 560);
    }
  }, 580);
}

function flashFaceTransform() {
  faceFlash?.classList.remove("hidden");
  faceFlash?.classList.add("pop");
  faceStageWrap?.classList.add("shake");
  faceSticker?.classList.remove("hidden");
  setTimeout(() => faceStageWrap?.classList.remove("shake"), 450);
  setTimeout(() => {
    faceFlash?.classList.remove("pop");
    faceFlash?.classList.add("hidden");
  }, 420);
}

function successFaceBeat() {
  if (facePhase !== "window" || !faceWindowOpen) return;
  clearFaceTimers();
  faceWindowOpen = false;
  facePhase = "success";
  faceBeatBtn.disabled = true;
  playFaceDrum();
  faceIsModel = true;
  setFaceMood(true);
  flashFaceTransform();
  playGameFx("face", "win");
  if (faceBeatHint) faceBeatHint.textContent = "✦ Glow-up success ✦";
  setFaceRing(true, 4);

  faceRevealTimer = setTimeout(() => {
    faceRound++;
    if (faceRound >= 5) {
      faceActive = false;
      faceWin?.classList.remove("hidden");
      playGameFx("face", "win");
    } else {
      startFaceRound();
    }
  }, 1100);
}

function failFaceRound(msg) {
  clearFaceTimers();
  faceActive = false;
  faceBeatBtn.disabled = true;
  if (faceFailMsg) faceFailMsg.textContent = msg;
  faceFail?.classList.remove("hidden");
  playGameFx("face", "bad");
}

function onFaceBeatTap() {
  if (!faceActive) return;
  getAudioCtx();
  if (facePhase === "window" && faceWindowOpen) {
    const elapsed = performance.now() - faceWindowStart;
    if (elapsed <= 520) {
      successFaceBeat();
    } else {
      failFaceRound("Slightly late — try again");
    }
  } else if (facePhase === "count") {
    failFaceRound("Not the final beat yet — wait~");
  }
}

function resetFaceGame() {
  faceRound = 0;
  faceIsModel = false;
  facePhase = "idle";
  faceWin?.classList.add("hidden");
  faceFail?.classList.add("hidden");
  clearFaceTimers();
}

function startFaceGame() {
  resetFaceGame();
  faceActive = true;
  if (!faceAnimId) faceAnimLoop();
  startFaceRound();
}

faceStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopFaceCover();
  showFaceScene(facePlay);
  startFaceGame();
});

faceBackBtn?.addEventListener("click", () => {
  faceActive = false;
  clearFaceTimers();
  showFaceScene(faceLanding);
  startFaceCover();
});

faceAgainBtn?.addEventListener("click", () => {
  faceWin?.classList.add("hidden");
  startFaceGame();
});

faceRetryBtn?.addEventListener("click", () => {
  faceFail?.classList.add("hidden");
  startFaceGame();
});

faceBeatBtn?.addEventListener("click", onFaceBeatTap);

const SHARE_HASHTAG = "#VibeVerseGlowUp";

function roundShareRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildFaceShareCanvas(platform) {
  const w = 1080;
  const h = 1920;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fdf2f8");
  bg.addColorStop(0.5, "#fce7f3");
  bg.addColorStop(1, "#f3e8ff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const src = faceCanvas?.width ? faceCanvas : faceCoverCanvas;
  if (src?.width) {
    const imgW = w * 0.78;
    const imgH = imgW * (src.height / src.width);
    const ix = (w - imgW) / 2;
    const iy = h * 0.2;
    ctx.save();
    roundShareRect(ctx, ix, iy, imgW, imgH, 36);
    ctx.clip();
    ctx.drawImage(src, ix, iy, imgW, imgH);
    ctx.restore();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
    ctx.lineWidth = 4;
    roundShareRect(ctx, ix, iy, imgW, imgH, 36);
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#4b5563";
  ctx.font = "bold 64px Inter, sans-serif";
  ctx.fillText("Runway Glow-Up", w / 2, h * 0.1);
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Couch → Runway on the beat", w / 2, h * 0.145);

  const pillW = 420;
  const pillH = 56;
  const pillX = (w - pillW) / 2;
  const pillY = h * 0.86;
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
  pillGrad.addColorStop(0, "#ec4899");
  pillGrad.addColorStop(1, "#a855f7");
  roundShareRect(ctx, pillX, pillY, pillW, pillH, 28);
  ctx.fillStyle = pillGrad;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText(SHARE_HASHTAG, w / 2, pillY + 38);

  ctx.fillStyle = "#a855f7";
  ctx.font = "bold 44px Inter, sans-serif";
  ctx.fillText("✦ VibeVerse", w / 2, h * 0.935);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText(`Made for ${platform}`, w / 2, h * 0.975);
  return c;
}

function shareFaceGlowUp(platform) {
  const canvas = buildFaceShareCanvas(platform);
  const caption = `Just slayed my Runway Glow-Up! ${SHARE_HASHTAG} — play on VibeVerse`;
  canvas.toBlob(async (blob) => {
    if (!blob) {
      showAppToast("Couldn't create share card. Try again.");
      return;
    }
    const file = new File([blob], `vibeverse-glowup-${platform.toLowerCase()}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: "Runway Glow-Up", text: caption, files: [file] });
        showAppToast(`Shared! Tag us with ${SHARE_HASHTAG}`);
        return;
      } catch (_) { /* fallback below */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(caption);
      showAppToast(`Card saved! Caption copied — upload to ${platform}`);
    } else {
      showAppToast(`Share card saved! Upload to ${platform} with ${SHARE_HASHTAG}`);
    }
  }, "image/png");
}

faceShareTikTok?.addEventListener("click", () => shareFaceGlowUp("TikTok"));
faceShareIg?.addEventListener("click", () => shareFaceGlowUp("Instagram"));

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = String(text).split("\n");
  let cy = y;
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const test = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cy);
        line = words[i];
        cy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, cy);
      cy += lineHeight;
    }
  }
  return cy;
}

function buildTextShareCanvas({ title, subtitle, body, tag, accent = ["#ec4899", "#a855f7"] }) {
  const w = 720;
  const h = 720;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fdf4ff");
  bg.addColorStop(1, "#fce7f3");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cardX = 48;
  const cardY = 130;
  const cardW = w - 96;
  const cardH = h - 300;
  ctx.fillStyle = "#fffef8";
  roundShareRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(168, 85, 247, 0.22)";
  ctx.lineWidth = 3;
  roundShareRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = accent[1];
  ctx.font = "bold 52px Inter, sans-serif";
  ctx.fillText(title, w / 2, 88);
  if (subtitle) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "600 26px Inter, sans-serif";
    ctx.fillText(subtitle, w / 2, 124);
  }

  ctx.fillStyle = "#374151";
  ctx.font = "500 34px Inter, sans-serif";
  wrapCanvasText(ctx, body, w / 2, cardY + 72, cardW - 72, 46);

  const pillW = 380;
  const pillH = 52;
  const pillX = (w - pillW) / 2;
  const pillY = h * 0.84;
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
  pillGrad.addColorStop(0, accent[0]);
  pillGrad.addColorStop(1, accent[1]);
  roundShareRect(ctx, pillX, pillY, pillW, pillH, 26);
  ctx.fillStyle = pillGrad;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 26px Inter, sans-serif";
  ctx.fillText(tag, w / 2, pillY + 36);

  ctx.fillStyle = accent[1];
  ctx.font = "bold 40px Inter, sans-serif";
  ctx.fillText("✦ VibeVerse", w / 2, h * 0.925);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "22px Inter, sans-serif";
  ctx.fillText("vibeverse.app", w / 2, h * 0.965);
  return c;
}

function shareImageFile(canvas, { filename, title, caption }) {
  canvas.toBlob(async (blob) => {
    if (!blob) {
      showAppToast("Couldn't create share card. Try again.");
      return;
    }
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title, text: caption, files: [file] });
        showAppToast("Shared!");
        return;
      } catch (_) { /* fallback below */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(caption);
      showAppToast("Card saved! Caption copied.");
    } else {
      showAppToast("Share card saved!");
    }
  }, "image/png");
}

function shareTextCard({ title, subtitle, body, tag, accent, filename, caption }) {
  shareImageFile(buildTextShareCanvas({ title, subtitle, body, tag, accent }), { filename, title, caption });
}

function buildSpotShareCanvas() {
  const w = 720;
  const h = 720;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fdf2f8");
  bg.addColorStop(1, "#e0e7ff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const frameX = 56;
  const frameY = 100;
  const frameW = w - 112;
  const frameH = frameW * 0.78;
  ctx.fillStyle = "#fff";
  roundShareRect(ctx, frameX - 8, frameY - 8, frameW + 16, frameH + 120, 12);
  ctx.fill();
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  if (spotCanvas?.width) {
    const imgW = frameW;
    const imgH = frameW * (spotCanvas.height / spotCanvas.width);
    const ix = frameX;
    const iy = frameY;
    ctx.drawImage(spotCanvas, ix, iy, imgW, imgH);
  }
  ctx.shadowColor = "transparent";

  const loc = spotScene?.loc?.split("·").pop()?.trim() || "Rainbow Lake";
  const d = new Date();
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  ctx.textAlign = "center";
  ctx.fillStyle = "#374151";
  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillText(loc, w / 2, frameY + frameH + 48);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "26px Inter, sans-serif";
  ctx.fillText(dateStr, w / 2, frameY + frameH + 82);

  ctx.fillStyle = "#6366f1";
  ctx.font = "bold 44px Inter, sans-serif";
  ctx.fillText("📸 Checked in!", w / 2, h * 0.88);

  const pillW = 360;
  const pillH = 48;
  const pillX = (w - pillW) / 2;
  const pillY = h * 0.905;
  roundShareRect(ctx, pillX, pillY, pillW, pillH, 24);
  ctx.fillStyle = "#6366f1";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Inter, sans-serif";
  ctx.fillText("#TravelCheckIn", w / 2, pillY + 32);

  ctx.fillStyle = "#a855f7";
  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillText("✦ VibeVerse", w / 2, h * 0.975);
  return c;
}

function shareSpotCheckIn() {
  if (!spotScene) {
    showAppToast("Check in first to share");
    return;
  }
  captureSpotPhoto();
  const loc = spotScene.loc;
  const caption = `Checked in at ${loc} #TravelCheckIn — VibeVerse`;
  shareImageFile(buildSpotShareCanvas(), {
    filename: "vibeverse-checkin.png",
    title: "Rainbow Salt Lake",
    caption,
  });
}

function shareStreakCard(days, gamesToday) {
  const body = gamesToday > 0
    ? `${days}-day vibe streak!\nPlayed ${gamesToday} game${gamesToday === 1 ? "" : "s"} today.`
    : `${days}-day vibe streak!\nKeep the vibes going on VibeVerse.`;
  shareTextCard({
    title: "Vibe Streak",
    subtitle: "Daily mini game habit",
    body,
    tag: "#VibeVerse",
    accent: ["#f97316", "#ec4899"],
    filename: "vibeverse-streak.png",
    caption: `🔥 ${days}-day vibe streak on VibeVerse! #VibeVerse`,
  });
}

function shareScoreCard({ gameName, scoreLine, tag, filename, caption }) {
  shareTextCard({
    title: gameName,
    subtitle: "Run complete",
    body: scoreLine,
    tag,
    accent: ["#06b6d4", "#a855f7"],
    filename,
    caption,
  });
}

function getMergeMaxTile() {
  return mergeBoard.reduce((max, row) => Math.max(max, ...row), 0);
}

function initGameShareButtons() {
  document.getElementById("chickShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Squishy Chick",
      scoreLine: `Decompress: ${chickState.decompress}\nClicks: ${chickState.clicks}`,
      tag: "#SquishyChick",
      filename: "vibeverse-squishy-chick.png",
      caption: `Squished ${chickState.decompress} stress away on Squishy Chick #SquishyChick — VibeVerse`,
    });
  });

  blockShareBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    shareScoreCard({
      gameName: "Cute Stack",
      scoreLine: `Score: ${blockScore}`,
      tag: "#CuteStack",
      filename: "vibeverse-cute-stack.png",
      caption: `Scored ${blockScore} on Cute Stack #CuteStack — VibeVerse`,
    });
  });

  document.getElementById("shopShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Fresh Fruit Stand",
      scoreLine: `Earned: $${shopRoundEarn}\nOrders: ${shopOrders}\nRating: ${shopRating}%`,
      tag: "#FruitStand",
      filename: "vibeverse-fruit-stand.png",
      caption: `Made $${shopRoundEarn} in one round at Fresh Fruit Stand #FruitStand — VibeVerse`,
    });
  });

  document.getElementById("leapShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Lily Pad Leap",
      scoreLine: `Score: ${leapScore}\nBest combo: ${leapBestCombo}x`,
      tag: "#LilyPadLeap",
      filename: "vibeverse-lily-pad.png",
      caption: `Scored ${leapScore} · ${leapBestCombo}x combo on Lily Pad Leap #LilyPadLeap — VibeVerse`,
    });
  });

  document.getElementById("boxShareBtn")?.addEventListener("click", () => {
    const picks = boxHistory.map((f) => `${f.emoji} ${f.name}`).join("\n");
    shareScoreCard({
      gameName: "Mystery Flavor Box",
      scoreLine: picks || "Completed a flavor quest!",
      tag: "#FlavorBox",
      filename: "vibeverse-flavor-box.png",
      caption: "Completed my Mystery Flavor quest #FlavorBox — VibeVerse",
    });
  });

  document.getElementById("starShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Starfall",
      scoreLine: `Score: ${starScore}`,
      tag: "#Starfall",
      filename: "vibeverse-starfall.png",
      caption: `Scored ${starScore} on Starfall #Starfall — VibeVerse`,
    });
  });

  document.getElementById("stackShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Stack Rush",
      scoreLine: `Levels stacked: ${stackLevel}`,
      tag: "#StackRush",
      filename: "vibeverse-stack-rush.png",
      caption: `Stacked ${stackLevel} levels on Stack Rush #StackRush — VibeVerse`,
    });
  });

  document.getElementById("matchShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Memory Match",
      scoreLine: `Cleared in ${matchMoves} moves`,
      tag: "#MemoryMatch",
      filename: "vibeverse-memory-match.png",
      caption: `Matched all pairs in ${matchMoves} moves #MemoryMatch — VibeVerse`,
    });
  });

  document.getElementById("mergeShareBtn")?.addEventListener("click", () => {
    const maxTile = getMergeMaxTile();
    shareScoreCard({
      gameName: "Number Merge",
      scoreLine: `Score: ${mergeScore}\nHighest tile: ${maxTile || 2}`,
      tag: "#NumberMerge",
      filename: "vibeverse-number-merge.png",
      caption: `Scored ${mergeScore} · tile ${maxTile || 2} on Number Merge #NumberMerge — VibeVerse`,
    });
  });

  document.getElementById("beatShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Beat Tap",
      scoreLine: `Score: ${beatScore}`,
      tag: "#BeatTap",
      filename: "vibeverse-beat-tap.png",
      caption: `Scored ${beatScore} on Beat Tap #BeatTap — VibeVerse`,
    });
  });
}

function shareEarthQuest(task) {
  const body = task?.trim() || "Completed a daily quest!";
  shareTextCard({
    title: "Blue Planet Diary",
    subtitle: "Quest complete ✓",
    body,
    tag: "#BluePlanet",
    accent: ["#22c55e", "#3b82f6"],
    filename: "vibeverse-quest.png",
    caption: `Completed today's quest: ${body} #BluePlanet — VibeVerse`,
  });
}

fortuneShareBtn?.addEventListener("click", () => {
  const body = lastFortuneText || fortuneText?.textContent?.trim() || "";
  if (!body) {
    showAppToast("Draw a fortune first");
    return;
  }
  shareTextCard({
    title: "Daily Fortune",
    subtitle: "Today's draw",
    body,
    tag: "#DailyFortune",
    accent: ["#f472b6", "#a855f7"],
    filename: "vibeverse-fortune.png",
    caption: `My fortune today: ${body} #DailyFortune — play on VibeVerse`,
  });
});

document.addEventListener("keydown", (e) => {
  if (!faceActive) return;
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    onFaceBeatTap();
  }
});

/* startFaceCover deferred — see feed lazy init */


/* ===== 口味盲盒猜猜猜 ===== */
const BOX_FLAVORS = [
  { name: "Pickle Sparkling Water", cat: "Drink", emoji: "🥒", type: "drink", taste: "Tangy", desc: "Like a pickle party in a can", hints: ["Green & clear", "Extra fizz", "Face-scrunching sour"], tags: ["sour", "wild", "addictive"] },
  { name: "Rainbow Soda Mix", cat: "Drink", emoji: "🥤", type: "drink", taste: "Chaotic sweet", desc: "Seven colors, sweet vs sour battle", hints: ["Rainbow layers", "Nostalgia hit", "Sugar overload"], tags: ["sweet", "wild", "fizz"] },
  { name: "Pop-Rocks Cola", cat: "Drink", emoji: "✨", type: "drink", taste: "Explosive", desc: "Fireworks in your mouth plus cola", hints: ["Crackles loud", "Double carbonation", "Childhood punch"], tags: ["sweet", "wild", "addictive"] },
  { name: "Cilantro Lemon Tea", cat: "Drink", emoji: "🌿", type: "drink", taste: "Bold", desc: "Cilantro lovers rejoice, others quiet", hints: ["Green brew", "Herbal aroma", "Hot debate"], tags: ["sour", "wild", "fresh"] },
  { name: "Black Garlic Chocolate", cat: "Snack", emoji: "🍫", type: "snack", taste: "Dark", desc: "Pretty outside, fermented garlic inside", hints: ["Dark square", "Sweet then funky", "Long finish"], tags: ["wild", "bitter", "addictive"] },
  { name: "Spicy Strip Ice Cream", cat: "Snack", emoji: "🌶️", type: "snack", taste: "Fire & ice", desc: "Cold sweet with spicy strip soul", hints: ["Pink pack", "Cold then hot", "Weirdly good"], tags: ["spicy", "sweet", "wild"] },
  { name: "Cheese Beer", cat: "Drink", emoji: "🧀", type: "drink", taste: "Savory", desc: "Creamy cheese meets malt", hints: ["Thick foam", "Salty-sweet", "Tipsy vibe"], tags: ["salty", "wild", "addictive"] },
  { name: "Wasabi Macadamia", cat: "Snack", emoji: "🫛", type: "snack", taste: "Punchy", desc: "Crunchy nut, wasabi uppercut", hints: ["Small round", "Mild start", "Brain tingle"], tags: ["spicy", "wild", "addictive"] },
  { name: "Plum Americano", cat: "Drink", emoji: "☕", type: "drink", taste: "Sour-bitter", desc: "Coffee bitter plus preserved plum sour", hints: ["Dark brown", "Sour & bitter", "Surprisingly hooked"], tags: ["sour", "bitter", "wild"] },
  { name: "Blue Pixel Candy", cat: "Snack", emoji: "💎", type: "snack", taste: "Blueberry", desc: "Like eating game pixels", hints: ["Blue cubes", "Sweet-tart", "Crunchy"], tags: ["sweet", "sour", "nostalgia"] },
  { name: "Salted Egg Foam Tea", cat: "Drink", emoji: "🥚", type: "drink", taste: "Salty-sweet", desc: "Sandy salted egg on creamy foam", hints: ["Yellow foam", "Tea base", "Keeps you sipping"], tags: ["salty", "sweet", "addictive"] },
  { name: "Luosifen Chips", cat: "Snack", emoji: "🍜", type: "snack", taste: "Funky", desc: "Opening the bag at work takes courage", hints: ["Thin crisp", "Pickled bamboo", "Smells bad, tastes good"], tags: ["wild", "salty", "addictive"] },
  { name: "Mango Chili Shave Ice", cat: "Snack", emoji: "🥭", type: "snack", taste: "Sweet-spicy", desc: "Tropical fruit with chili dust", hints: ["Orange-red", "Slushy", "Gets intense"], tags: ["spicy", "sweet", "wild"] },
  { name: "Yakult Sparkling Americano", cat: "Drink", emoji: "🫧", type: "drink", taste: "Yogurt fizz", desc: "Coffee mixology gone rogue", hints: ["Two-tone gradient", "Sour & bitter", "Weird harmony"], tags: ["sour", "bitter", "wild"] },
  { name: "Fermented Tofu Bagel", cat: "Snack", emoji: "🥯", type: "snack", taste: "Fermented", desc: "Western bread meets fermented tofu", hints: ["Spread on top", "Rich & salty", "Carb bliss"], tags: ["salty", "wild", "addictive"] },
  { name: "Cherry Blossom Salt Soda", cat: "Drink", emoji: "🌸", type: "drink", taste: "Lightly salty", desc: "Spring color, summer bubbles", hints: ["Pink clear", "Hint of salt", "Photo-ready"], tags: ["salty", "sweet", "fresh"] },
];

const BOX_GUESS_OPTS = ["Sour punch", "Sugar rush", "Spicy kick", "Wild hit", "Pleasant surprise", "Chaos food"];

const boxLanding = document.getElementById("boxLanding");
const boxPlay = document.getElementById("boxPlay");
const boxStartBtn = document.getElementById("boxStartBtn");
const boxBackBtn = document.getElementById("boxBackBtn");
const boxDrawBtn = document.getElementById("boxDrawBtn");
const boxNextBtn = document.getElementById("boxNextBtn");
const boxAgainBtn = document.getElementById("boxAgainBtn");
const boxCanvas = document.getElementById("boxCanvas");
const boxCoverCanvas = document.getElementById("boxCoverCanvas");
const boxCtx = boxCanvas?.getContext("2d");
const boxCoverCtx = boxCoverCanvas?.getContext("2d");
const boxMystery = document.getElementById("boxMystery");
const boxReveal = document.getElementById("boxReveal");
const boxGuessPanel = document.getElementById("boxGuessPanel");
const boxGuessBtns = document.getElementById("boxGuessBtns");
const boxGuessResult = document.getElementById("boxGuessResult");
const boxCountEl = document.getElementById("boxCount");
const boxTypeHint = document.getElementById("boxTypeHint");
const boxFlavorEmoji = document.getElementById("boxFlavorEmoji");
const boxFlavorCat = document.getElementById("boxFlavorCat");
const boxFlavorName = document.getElementById("boxFlavorName");
const boxFlavorDesc = document.getElementById("boxFlavorDesc");
const boxFlavorCard = document.getElementById("boxFlavorCard");
const boxProgress = document.getElementById("boxProgress");
const boxOver = document.getElementById("boxOver");
const boxOverList = document.getElementById("boxOverList");
const boxStage = document.getElementById("boxStage");

const BOX_GOAL = 10;
let boxDrawCount = 0;
let boxHistory = [];
let boxCurrent = null;
let boxCoverOn = false;
let boxAnimId = 0;
let boxShaking = false;

function showBoxScene(el) {
  [boxLanding, boxPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function drawBoxShape(ctx, w, h, t, shake) {
  const cx = w / 2;
  const cy = h / 2 - 10;
  const sx = shake ? Math.sin(t * 40) * 6 : 0;
  ctx.save();
  ctx.translate(cx + sx, cy);
  ctx.fillStyle = "#f97316";
  ctx.fillRect(-70, -50, 140, 100);
  ctx.fillStyle = "#fb923c";
  ctx.fillRect(-70, -50, 140, 28);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("?", 0, -30);
  ctx.fillStyle = "#ea580c";
  ctx.fillRect(-70, 50, 140, 12);
  ctx.fillStyle = "#fde047";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-50 + i * 25, 10 + Math.sin(t * 2 + i) * 3, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBoxCover() {
  if (!boxCoverCtx || !boxCoverCanvas) return;
  const w = boxCoverCanvas.width;
  const h = boxCoverCanvas.height;
  const t = performance.now() * 0.001;
  const bg = boxCoverCtx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fff7ed");
  bg.addColorStop(1, "#ffedd5");
  boxCoverCtx.fillStyle = bg;
  boxCoverCtx.fillRect(0, 0, w, h);
  drawBoxShape(boxCoverCtx, w, h, t, false);
  ["🥒", "🥤", "🍫", "🌶️"].forEach((e, i) => {
    boxCoverCtx.font = "28px sans-serif";
    boxCoverCtx.fillText(e, 40 + i * 80, h - 30 + Math.sin(t + i) * 4);
  });
}

function drawBoxPlay() {
  if (!boxCtx || !boxCanvas) return;
  const w = boxCanvas.width;
  const h = boxCanvas.height;
  const t = performance.now() * 0.001;
  const bg = boxCtx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fef3c7");
  bg.addColorStop(1, "#fed7aa");
  boxCtx.fillStyle = bg;
  boxCtx.fillRect(0, 0, w, h);
  drawBoxShape(boxCtx, w, h, t, boxShaking);
}

function boxAnimLoop() {
  if (boxCoverOn) drawBoxCover();
  if (boxPlay && !boxPlay.classList.contains("hidden") && boxMystery && !boxMystery.classList.contains("hidden")) {
    drawBoxPlay();
  }
  const running = boxCoverOn || (boxPlay && !boxPlay.classList.contains("hidden") && boxMystery && !boxMystery.classList.contains("hidden"));
  if (running) boxAnimId = requestAnimationFrame(boxAnimLoop);
  else boxAnimId = 0;
}

function startBoxCover() {
  boxCoverOn = true;
  if (!boxAnimId) boxAnimLoop();
}

function stopBoxCover() {
  boxCoverOn = false;
}

function renderBoxProgress() {
  if (!boxProgress) return;
  boxProgress.innerHTML = "";
  for (let i = 0; i < BOX_GOAL; i++) {
    const dot = document.createElement("span");
    dot.className = "box-dot" + (i < boxDrawCount ? " done" : "");
    if (boxHistory[i]) dot.title = boxHistory[i].name;
    boxProgress.appendChild(dot);
  }
}

function resetBoxGame() {
  boxDrawCount = 0;
  boxHistory = [];
  boxCurrent = null;
  boxOver?.classList.add("hidden");
  boxReveal?.classList.add("hidden");
  boxMystery?.classList.remove("hidden");
  boxGuessPanel?.classList.add("hidden");
  boxGuessResult?.classList.add("hidden");
  boxNextBtn?.classList.add("hidden");
  boxDrawBtn?.classList.remove("hidden");
  boxDrawBtn.disabled = false;
  if (boxCountEl) boxCountEl.textContent = "0/10";
  if (boxTypeHint) boxTypeHint.textContent = "???";
  renderBoxProgress();
}

function pickBoxFlavor() {
  let pool = BOX_FLAVORS.filter((f) => !boxHistory.some((h) => h.name === f.name));
  if (!pool.length) pool = [...BOX_FLAVORS];
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildGuessButtons(flavor) {
  if (!boxGuessBtns) return;
  boxGuessBtns.innerHTML = "";
  const opts = [...flavor.tags.map((t) => {
    const map = { sour: "Sour punch", sweet: "Sugar rush", spicy: "Spicy kick", wild: "Wild hit", bitter: "Bitter doubt", salty: "Savory hit", fresh: "Pleasant surprise", addictive: "More please", nostalgia: "Nostalgia", fizz: "Fizz burst" };
    return map[t] || "Pleasant surprise";
  })];
  while (opts.length < 4) {
    const extra = BOX_GUESS_OPTS[Math.floor(Math.random() * BOX_GUESS_OPTS.length)];
    if (!opts.includes(extra)) opts.push(extra);
  }
  opts.slice(0, 4).forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "box-guess-btn";
    btn.textContent = label;
    btn.addEventListener("click", () => onBoxGuess(label, flavor));
    boxGuessBtns.appendChild(btn);
  });
}

function onBoxGuess(label, flavor) {
  boxGuessBtns?.querySelectorAll("button").forEach((b) => { b.disabled = true; });
  const tagMap = { "Sour punch": "sour", "Sugar rush": "sweet", "Spicy kick": "spicy", "Wild hit": "wild", "Pleasant surprise": "fresh", "Chaos food": "wild", "Bitter doubt": "bitter", "Savory hit": "salty", "More please": "addictive", "Nostalgia": "nostalgia", "Fizz burst": "fizz" };
  const guessed = tagMap[label];
  const hit = guessed && flavor.tags.includes(guessed);
  if (boxGuessResult) {
    boxGuessResult.classList.remove("hidden");
    boxGuessResult.textContent = hit
      ? `🎯 Correct! ${flavor.taste} — ${flavor.desc}`
      : `😏 Closer to ${flavor.taste} — ${flavor.desc}`;
  }
  playGameFx("box", hit ? "good" : "tap");
}

function revealBoxFlavor(flavor) {
  boxCurrent = flavor;
  boxHistory.push(flavor);
  boxDrawCount++;
  if (boxCountEl) boxCountEl.textContent = `${boxDrawCount}/10`;
  if (boxTypeHint) boxTypeHint.textContent = flavor.type === "drink" ? "Drink" : "Snack";
  if (boxFlavorEmoji) boxFlavorEmoji.textContent = flavor.emoji;
  if (boxFlavorCat) boxFlavorCat.textContent = flavor.cat + " Mystery";
  if (boxFlavorName) boxFlavorName.textContent = flavor.name;
  if (boxFlavorDesc) boxFlavorDesc.textContent = `Hints: ${flavor.hints.join(" · ")}`;
  boxFlavorCard?.classList.remove("pop");
  void boxFlavorCard?.offsetWidth;
  boxFlavorCard?.classList.add("pop");
  boxMystery?.classList.add("hidden");
  boxReveal?.classList.remove("hidden");
  boxGuessPanel?.classList.remove("hidden");
  boxGuessResult?.classList.add("hidden");
  boxGuessBtns?.querySelectorAll("button").forEach((b) => { b.disabled = false; });
  buildGuessButtons(flavor);
  renderBoxProgress();
  playGameFx("box", "win");
  boxDrawBtn?.classList.add("hidden");
  if (boxDrawCount >= BOX_GOAL) {
    boxNextBtn?.classList.add("hidden");
    setTimeout(showBoxComplete, 800);
  } else {
    boxNextBtn?.classList.remove("hidden");
  }
}

function showBoxComplete() {
  if (!boxOverList) return;
  boxOverList.innerHTML = boxHistory.map((f) => `<li>${f.emoji} ${f.name}</li>`).join("");
  boxOver?.classList.remove("hidden");
  playGameFx("box", "win");
}

function drawBoxFlavor() {
  if (boxDrawCount >= BOX_GOAL || boxShaking) return;
  getAudioCtx();
  boxShaking = true;
  boxDrawBtn.disabled = true;
  playGameFx("box", "drum");
  boxStage?.classList.add("shake");
  setTimeout(() => {
    boxShaking = false;
    boxStage?.classList.remove("shake");
    revealBoxFlavor(pickBoxFlavor());
  }, 700);
}

function nextBoxDraw() {
  boxReveal?.classList.add("hidden");
  boxMystery?.classList.remove("hidden");
  boxNextBtn?.classList.add("hidden");
  boxDrawBtn?.classList.remove("hidden");
  boxDrawBtn.disabled = false;
}

boxStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopBoxCover();
  showBoxScene(boxPlay);
  resetBoxGame();
  if (!boxAnimId) boxAnimLoop();
});

boxBackBtn?.addEventListener("click", () => {
  showBoxScene(boxLanding);
  startBoxCover();
});

boxDrawBtn?.addEventListener("click", drawBoxFlavor);
boxNextBtn?.addEventListener("click", nextBoxDraw);
boxAgainBtn?.addEventListener("click", () => {
  boxOver?.classList.add("hidden");
  resetBoxGame();
});

/* startBoxCover deferred — see feed lazy init */


/* ===== 天生 VS 被迫造句 ===== */
const SENTE_LIST = [
  "Born to love food, forced to watch calories",
  "Born to chill, forced to hustle",
  "Born to travel, forced to stay home",
  "Born to scroll, forced to sleep early",
  "Born to slack, forced to reply OK",
  "Born to coast, forced to look busy",
  "Born to order in, forced to cook",
  "Born to stay up, forced to clock in",
  "Born to quit, forced to drink coffee",
  "Born to shop, forced to check balance",
  "Born to be alone, forced to network",
  "Born to diet, forced to get boba",
  "Born to sleep in, forced to morning class",
  "Born to binge shows, forced to overtime",
  "Born to adopt cats, forced to watch others' pets",
  "Born to be unhinged, forced to be normal",
  "Born to yap, forced to write reports",
  "Born to retire, forced to plan ahead",
  "Born to procrastinate, forced to deadline sprint",
  "Born to gossip, forced to pay attention",
];

const senteText = document.getElementById("senteText");
const senteGenBtn = document.getElementById("senteGenBtn");
const senteCopyBtn = document.getElementById("senteCopyBtn");
const senteShareBtn = document.getElementById("senteShareBtn");
const senteDiyBtn = document.getElementById("senteDiyBtn");
const senteLike = document.getElementById("senteLike");
const senteForce = document.getElementById("senteForce");
const senteHistory = document.getElementById("senteHistory");
let senteLastIdx = -1;

function showSente(text, diy) {
  if (!senteText) return;
  senteText.classList.remove("pop");
  void senteText.offsetWidth;
  senteText.classList.add("pop");
  const plain = diy ? `Born to love ${text.like}, forced to ${text.force}` : text;
  if (diy) {
    senteText.innerHTML = `Born to love <strong>${text.like}</strong>, forced to <strong>${text.force}</strong>`;
  } else {
    senteText.innerHTML = text.replace(/, forced to /, "<br>forced to ");
  }
  playGameFx("sente", "tap");
  if (senteHistory) {
    const li = document.createElement("li");
    li.textContent = plain;
    senteHistory.prepend(li);
    while (senteHistory.children.length > 5) senteHistory.lastChild.remove();
  }
}

function genSente() {
  let idx;
  do { idx = Math.floor(Math.random() * SENTE_LIST.length); } while (idx === senteLastIdx && SENTE_LIST.length > 1);
  senteLastIdx = idx;
  showSente(SENTE_LIST[idx], false);
}

senteGenBtn?.addEventListener("click", () => { getAudioCtx(); genSente(); });
senteCopyBtn?.addEventListener("click", () => {
  const t = senteText?.innerText?.replace(/\n/g, "，") || "";
  if (t && navigator.clipboard) navigator.clipboard.writeText(t);
  playGameFx("sente", "good");
});
senteShareBtn?.addEventListener("click", () => {
  const body = senteText?.innerText?.trim() || "";
  if (!body) {
    showAppToast("Generate a line first");
    return;
  }
  shareTextCard({
    title: "Born To vs Forced To",
    subtitle: "Meme line",
    body,
    tag: "#MemeLines",
    accent: ["#6366f1", "#ec4899"],
    filename: "vibeverse-meme.png",
    caption: `${body.replace(/\n/g, " ")} #MemeLines — VibeVerse`,
  });
  playGameFx("sente", "good");
});
senteDiyBtn?.addEventListener("click", () => {
  const like = senteLike?.value.trim() || "spacing out";
  const force = senteForce?.value.trim() || "replying";
  getAudioCtx();
  showSente({ like, force }, true);
});

/* ===== 萌宠打工模仿 ===== */
const PET_SCENES = [
  { id: "type", title: "Dog typing furiously", emoji: "🐶", action: "Brows furrowed, paws flying on keyboard", mood: "Anxious focus", moodClass: "focus", thought: "This bug ships today…", accent: "#6366f1", type: "dog", fur: "#e8954a", eye: "focus" },
  { id: "slack", title: "Cat slacking at desk", emoji: "🐱", action: "Eyes offline, soul at the window", mood: "Zoned out", moodClass: "chill", thought: "Nobody's watching… right?", accent: "#ec4899", type: "cat", fur: "#fb923c", eye: "dead" },
  { id: "badge", title: "Good boy clocking in", emoji: "🐕", action: "Tail helicopter — let's go!", mood: "Hyped", moodClass: "hype", thought: "Morning! Best dog ever!", accent: "#eab308", type: "dog", fur: "#fcd34d", eye: "sparkle" },
  { id: "nap", title: "Kitten nap mode", emoji: "😺", action: "Keyboard pillow, purrs over AC", mood: "Sleepy", moodClass: "sleepy", thought: "Five more minutes…", accent: "#22c55e", type: "cat", fur: "#cbd5e1", eye: "sleep" },
  { id: "meet", title: "Meeting nod dog", emoji: "🐕‍🦺", action: "Nods to everything: Got it!", mood: "Corporate", moodClass: "yes", thought: "Yes yes yes received", accent: "#a855f7", type: "dog", fur: "#78716c", eye: "wide" },
  { id: "snack", title: "Snack-stealing cat", emoji: "😼", action: "Looks around, devours fish treats", mood: "Guilty", moodClass: "guilty", thought: "Just one bite…", accent: "#f97316", type: "cat", fur: "#ea580c", eye: "sly" },
  { id: "ot", title: "Overtime corgi", emoji: "🐶", action: "Soul leaving body, still typing", mood: "Breaking", moodClass: "broken", thought: "I can make it… maybe?", accent: "#64748b", type: "corgi", fur: "#d97706", eye: "tired" },
  { id: "wc", title: "Bathroom scroll cat", emoji: "🐈", action: "Phone scroll — time stops", mood: "Stealth break", moodClass: "stealth", thought: "One more video…", accent: "#06b6d4", type: "cat", fur: "#1e293b", eye: "phone" },
];

const petCanvas = document.getElementById("petCanvas");
const petCtx = petCanvas?.getContext("2d");
const petCaption = document.getElementById("petCaption");
const petAction = document.getElementById("petAction");
const petMood = document.getElementById("petMood");
const petBubble = document.getElementById("petBubble");
const petSwitchBtn = document.getElementById("petSwitchBtn");
const petImitateBtn = document.getElementById("petImitateBtn");
const petCountEl = document.getElementById("petCount");
const petFrame = document.getElementById("petFrame");
let petIdx = -1;
let petSeen = 0;
let petAnimId = 0;
let petScene = null;
let petImitating = false;
let petImitateUntil = 0;

function drawPetOffice(ctx, w, h, t, accent, scene) {
  const wall = ctx.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, scene.id === "ot" ? "#e2e8f0" : "#fef9f3");
  wall.addColorStop(1, scene.id === "nap" ? "#ecfdf5" : "#fce7f3");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(24, 20, 90, 70);
  ctx.fillStyle = scene.id === "slack" ? "#1e293b" : "#bae6fd";
  ctx.fillRect(30, 26, 78, 50);
  if (scene.id === "slack") {
    ctx.fillStyle = "#64748b";
    ctx.font = "9px sans-serif";
    ctx.fillText("loading...", 38, 52);
  }
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(95, 36, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(0, h - 95, w, 95);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#d6d3d1";
  ctx.fillRect(0, h - 88, w, 88);
  ctx.fillStyle = "#78716c";
  ctx.fillRect(50, h - 96, w - 100, 10);
  ctx.fillStyle = "#44403c";
  ctx.fillRect(w / 2 - 55, h - 130, 110, 75);
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(w / 2 - 48, h - 122, 96, 58);
  const glow = ctx.createLinearGradient(w / 2 - 48, h - 122, w / 2 + 48, h - 64);
  glow.addColorStop(0, accent + "55");
  glow.addColorStop(1, scene.id === "nap" ? "#334155" : "#0f172a");
  ctx.fillStyle = glow;
  ctx.fillRect(w / 2 - 48, h - 122, 96, 58);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.08 + Math.sin(t * 2) * 0.06;
  for (let i = 0; i < 4; i++) ctx.fillRect(w / 2 - 40 + i * 22, h - 115, 16, 3);
  ctx.globalAlpha = 1;
  ctx.font = "10px sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("● ● ●", w / 2 - 18, h - 108);
  if (scene.id === "type") {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.5 + Math.sin(t * 12) * 0.3;
    ctx.font = "8px monospace";
    ctx.fillText("git push", w / 2 - 20, h - 95);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#86efac";
  ctx.beginPath();
  ctx.ellipse(w - 42, h - 55, 14, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4ade80";
  ctx.beginPath();
  ctx.ellipse(w - 38, h - 72, 18, 10, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(w - 72, h - 72, 22, 28);
  ctx.fillStyle = "#92400e";
  ctx.fillRect(w - 68, h - 68, 14, 8);
  if (scene.id === "ot") {
    ctx.fillStyle = "rgba(100,116,139,0.4)";
    ctx.font = "11px sans-serif";
    ctx.fillText("23:47", 28, 38);
  }
}

function petIsBlinking(t) {
  return Math.sin(t * 0.7 + petIdx * 2.1) > 0.92;
}

function drawPetEyes(ctx, cx, eyeY, eye, t, blink) {
  const lx = cx - 12;
  const rx = cx + 12;
  ctx.lineWidth = 2.5;
  if (blink || eye === "sleep") {
    ctx.strokeStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(lx, eyeY, 6, 0.2, Math.PI - 0.2);
    ctx.arc(rx, eyeY, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
    return;
  }
  if (eye === "dead") {
    ctx.strokeStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(lx - 5, eyeY - 3); ctx.lineTo(lx + 5, eyeY + 3);
    ctx.moveTo(lx + 5, eyeY - 3); ctx.lineTo(lx - 5, eyeY + 3);
    ctx.moveTo(rx - 5, eyeY - 3); ctx.lineTo(rx + 5, eyeY + 3);
    ctx.moveTo(rx + 5, eyeY - 3); ctx.lineTo(rx - 5, eyeY + 3);
    ctx.stroke();
    return;
  }
  if (eye === "focus") {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(lx, eyeY, 5, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(rx, eyeY, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(lx - 8, eyeY - 10); ctx.lineTo(lx + 2, eyeY - 6);
    ctx.moveTo(rx + 8, eyeY - 10); ctx.lineTo(rx - 2, eyeY - 6);
    ctx.stroke();
  } else if (eye === "sparkle") {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(lx, eyeY, 5, 0, Math.PI * 2);
    ctx.arc(rx, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(lx - 2, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.arc(rx + 2, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "10px sans-serif";
    ctx.fillText("✦", lx + 8, eyeY - 8);
    ctx.fillText("✦", rx - 14, eyeY - 8);
  } else if (eye === "wide") {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(lx, eyeY, 6, 0, Math.PI * 2);
    ctx.arc(rx, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(lx - 1, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.arc(rx + 3, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (eye === "sly") {
    ctx.fillStyle = "#166534";
    ctx.beginPath();
    ctx.ellipse(lx, eyeY, 4, 6, -0.2, 0, Math.PI * 2);
    ctx.ellipse(rx, eyeY, 4, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (eye === "tired") {
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.ellipse(lx, eyeY + 1, 4, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(rx, eyeY + 1, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#475569";
    ctx.beginPath();
    ctx.arc(lx, eyeY - 4, 7, 0.3, Math.PI - 0.3);
    ctx.arc(rx, eyeY - 4, 7, 0.3, Math.PI - 0.3);
    ctx.stroke();
  } else if (eye === "phone") {
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(lx, eyeY, 5, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(rx, eyeY, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(lx, eyeY, 4, 0, Math.PI * 2);
    ctx.arc(rx, eyeY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(lx - 1, eyeY - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(rx + 3, eyeY - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPetMouth(ctx, cx, cy, scene, bounce) {
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (scene.id === "type") {
    ctx.moveTo(cx - 4, cy + 14 + bounce);
    ctx.lineTo(cx + 4, cy + 14 + bounce);
  } else if (scene.id === "badge" || scene.id === "meet") {
    ctx.arc(cx, cy + 12 + bounce, 8, 0.2, Math.PI - 0.2);
  } else if (scene.id === "ot") {
    ctx.moveTo(cx - 6, cy + 16 + bounce);
    ctx.quadraticCurveTo(cx, cy + 10 + bounce, cx + 6, cy + 16 + bounce);
  } else if (scene.id === "snack") {
    ctx.arc(cx, cy + 14 + bounce, 6, 0, Math.PI);
  } else if (scene.id === "nap") {
    ctx.arc(cx, cy + 16 + bounce, 4, 0, Math.PI);
  } else {
    ctx.arc(cx, cy + (scene.id === "slack" ? 16 : 14) + bounce, 6, 0.15, Math.PI - 0.15);
  }
  ctx.stroke();
}

function drawPetBlush(ctx, x, y, intensity) {
  ctx.fillStyle = `rgba(251, 113, 133, ${intensity || 0.35})`;
  ctx.beginPath();
  ctx.ellipse(x - 22, y + 8, 10, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 22, y + 8, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPetTail(ctx, cx, cy, t, scene, bounce) {
  if (scene.type === "cat") return;
  const wag = scene.id === "badge" ? Math.sin(t * 14) * 18 : scene.id === "meet" ? Math.sin(t * 8) * 8 : Math.sin(t * 3) * 4;
  ctx.strokeStyle = scene.fur;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 28, cy + 20 + bounce);
  ctx.quadraticCurveTo(cx + 48 + wag * 0.3, cy + 5 + bounce, cx + 42 + wag, cy - 15 + bounce);
  ctx.stroke();
}

function drawPetBubbleCanvas(ctx, cx, cy, text, t) {
  const bob = Math.sin(t * 3) * 3;
  const bx = cx + 55;
  const by = cy - 55 + bob;
  ctx.font = "11px sans-serif";
  const tw = ctx.measureText(text).width;
  const bw = tw + 20;
  const bh = 28;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 10);
  else ctx.rect(bx - bw / 2, by - bh / 2, bw, bh);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - 8, by + bh / 2 - 2);
  ctx.lineTo(bx - 18, by + bh / 2 + 10);
  ctx.lineTo(bx + 2, by + bh / 2 - 2);
  ctx.fill();
  ctx.fillStyle = "#334155";
  ctx.textAlign = "center";
  ctx.fillText(text, bx, by + 4);
  ctx.textAlign = "left";
}

function petAccentFade(hex, a) {
  return hex + Math.round(a * 255).toString(16).padStart(2, "0");
}

function drawPetFX(ctx, cx, cy, t, scene) {
  ctx.font = "14px sans-serif";
  if (scene.id === "type") {
    ctx.fillStyle = petAccentFade(scene.accent, 0.6);
    ["⌨", "⌨", "⌨"].forEach((k, i) => {
      const y = cy + 40 - ((t * 2 + i) % 1) * 30;
      ctx.globalAlpha = 1 - ((t * 2 + i) % 1);
      ctx.fillText(k, cx - 30 + i * 28, y);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px sans-serif";
    ctx.fillText("💦", cx + 38, cy - 28 + Math.sin(t * 5) * 2);
  }
  if (scene.id === "slack") {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("…", cx + 50, cy - 40 + Math.sin(t * 2) * 2);
    ctx.font = "12px sans-serif";
    ctx.fillText("🌤", cx - 60, cy - 50 + Math.sin(t * 1.5) * 4);
  }
  if (scene.id === "badge") {
    ctx.fillStyle = "#fbbf24";
    ["♥", "♥"].forEach((h, i) => {
      const y = cy - 45 - ((t + i * 0.5) % 1) * 25;
      ctx.globalAlpha = 1 - ((t + i * 0.5) % 1);
      ctx.fillText(h, cx - 20 + i * 40, y);
    });
    ctx.globalAlpha = 1;
  }
  if (scene.id === "nap") {
    ctx.fillStyle = "#64748b";
    ctx.font = "13px sans-serif";
    ["Z", "z", "z"].forEach((z, i) => {
      ctx.fillText(z, cx + 35 + i * 10, cy - 35 - i * 12 - Math.sin(t * 2 + i) * 3);
    });
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#86efac";
    ctx.fillText("purr~", cx - 55, cy + 5);
  }
  if (scene.id === "meet") {
    ctx.fillStyle = scene.accent;
    ctx.font = "10px sans-serif";
    ctx.fillText("Got it!", cx + 48, cy - 35 + Math.abs(Math.sin(t * 6)) * -8);
  }
  if (scene.id === "snack") {
    ctx.font = "18px sans-serif";
    ctx.fillText("🐟", cx + 42, cy + 8 + Math.sin(t * 8) * 2);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("👀", cx - 55, cy - 30);
  }
  if (scene.id === "ot") {
    ctx.font = "20px sans-serif";
    const soulY = cy - 50 - ((t * 0.5) % 1) * 40;
    ctx.globalAlpha = 0.5 + Math.sin(t * 2) * 0.2;
    ctx.fillText("👻", cx + 10, soulY);
    ctx.globalAlpha = 1;
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("bug...", cx + 38, cy - 6);
    ctx.fillText("💻", cx + 38, cy - 20);
  }
  if (scene.id === "wc") {
    ctx.font = "16px sans-serif";
    ctx.fillText("📱", cx + 44, cy - 8);
    ctx.font = "9px sans-serif";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("▶ Next", cx + 30, cy + 20);
  }
}

function drawPetDog(ctx, cx, cy, t, scene, bounce, blink, imitate) {
  const isCorgi = scene.type === "corgi";
  const bodyW = isCorgi ? 52 : 46;
  const bodyH = isCorgi ? 28 : 34;
  const nod = scene.id === "meet" ? Math.sin(t * 5) * 6 : 0;
  const breathe = 1 + Math.sin(t * 1.8) * 0.02;
  const pawWave = imitate ? Math.sin(t * 12) * 12 : 0;
  ctx.save();
  ctx.translate(cx, cy + nod);
  ctx.scale(breathe, breathe);
  ctx.translate(-cx, -cy);
  drawPetTail(ctx, cx, cy, t, scene, bounce);
  ctx.fillStyle = scene.fur;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18 + bounce, bodyW, bodyH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 22 + bounce, bodyW * 0.55, bodyH * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = scene.fur;
  ctx.beginPath();
  ctx.arc(cx, cy - 8 + bounce, 32, 0, Math.PI * 2);
  ctx.fill();
  const earDroop = scene.id === "ot" ? 0.15 : 0;
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy - 18 + bounce + earDroop * 8, 14, 20, -0.3 - earDroop, 0, Math.PI * 2);
  ctx.ellipse(cx + 28, cy - 18 + bounce + earDroop * 8, 14, 20, 0.3 + earDroop, 0, Math.PI * 2);
  ctx.fill();
  drawPetBlush(ctx, cx, cy - 4 + bounce, scene.id === "badge" ? 0.5 : 0.35);
  const eyeY = cy - 2 + bounce;
  drawPetEyes(ctx, cx, eyeY, scene.eye, t, blink);
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 + bounce, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  drawPetMouth(ctx, cx, cy, scene, bounce);
  const pawY = cy + 28 + bounce;
  if (scene.id === "type") {
    ctx.fillStyle = scene.fur;
    ctx.fillRect(cx - 38 + Math.sin(t * 10) * 4, pawY - 20, 16, 10);
    ctx.fillRect(cx + 22 + Math.sin(t * 10 + 1) * 4, pawY - 20, 16, 10);
  }
  if (imitate) {
    ctx.fillStyle = scene.fur;
    ctx.beginPath();
    ctx.ellipse(cx - 35, cy - 5 + bounce - pawWave, 12, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (scene.id === "badge") {
    ctx.fillStyle = "#fde047";
    ctx.fillRect(cx - 12, cy + 30 + bounce, 24, 16);
    ctx.fillStyle = "#92400e";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GOOD", cx, cy + 42 + bounce);
    ctx.textAlign = "left";
  }
  ctx.restore();
}

function drawPetCat(ctx, cx, cy, t, scene, bounce, blink, imitate) {
  const dark = scene.id === "wc";
  const breathe = 1 + Math.sin(t * 1.5) * 0.025;
  const earTwitch = Math.sin(t * 4 + 1) * 0.05;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(breathe, breathe);
  ctx.translate(-cx, -cy);

  ctx.fillStyle = scene.fur;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20 + bounce, 42, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy - 6 + bounce, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dark ? "#f8fafc" : "#fff";
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 22 + bounce);
  ctx.lineTo(cx - 12 + earTwitch * 20, cy - 42 + bounce);
  ctx.lineTo(cx - 2, cy - 22 + bounce);
  ctx.moveTo(cx + 22, cy - 22 + bounce);
  ctx.lineTo(cx + 12 - earTwitch * 20, cy - 42 + bounce);
  ctx.lineTo(cx + 2, cy - 22 + bounce);
  ctx.fill();
  drawPetBlush(ctx, cx, cy - 2 + bounce, scene.id === "snack" ? 0.55 : 0.35);
  drawPetEyes(ctx, cx, cy - 4 + bounce, scene.eye, t, blink);
  ctx.strokeStyle = dark ? "#94a3b8" : "#78716c";
  ctx.lineWidth = 1;
  [-1, 0, 1].forEach((i) => {
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + i * 4 + bounce);
    ctx.lineTo(cx - 38, cy - 4 + i * 6 + bounce);
    ctx.moveTo(cx + 18, cy + i * 4 + bounce);
    ctx.lineTo(cx + 38, cy - 4 + i * 6 + bounce);
    ctx.stroke();
  });
  drawPetMouth(ctx, cx, cy, scene, bounce);
  if (scene.id === "slack") {
    ctx.font = "16px sans-serif";
    ctx.fillText("👅", cx + 35, cy + 10 + bounce);
  }
  if (imitate) {
    ctx.font = "18px sans-serif";
    ctx.fillText("🐾", cx - 45, cy - 20 + Math.sin(t * 10) * 4);
  }
  ctx.restore();
}

function drawPetScene() {
  if (!petCtx || !petCanvas || !petScene) return;
  const w = petCanvas.width;
  const h = petCanvas.height;
  const t = performance.now() * 0.001;
  const blink = petIsBlinking(t);
  const imitate = petImitating && performance.now() < petImitateUntil;

  drawPetOffice(petCtx, w, h, t, petScene.accent, petScene);
  const cx = w / 2;
  const cy = h / 2 - 15;
  const bounce = petScene.id === "nap" ? Math.sin(t * 1.2) * 2 : Math.sin(t * 2.5) * 3;

  if (petScene.type === "cat" || petScene.id === "wc") {
    drawPetCat(petCtx, cx, cy, t, petScene, bounce, blink, imitate);
  } else {
    drawPetDog(petCtx, cx, cy, t, petScene, bounce, blink, imitate);
  }

  drawPetFX(petCtx, cx, cy, t, petScene);

  const thought = imitate ? "Copy me!" : petScene.thought;
  drawPetBubbleCanvas(petCtx, cx, cy, thought, t);
}

function petLoop() {
  if (petImitating && performance.now() >= petImitateUntil) petImitating = false;
  drawPetScene();
  petAnimId = requestAnimationFrame(petLoop);
}

function updatePetMoodUI() {
  if (!petScene) return;
  if (petMood) {
    petMood.textContent = petScene.mood;
    petMood.className = "pet-mood mood-" + petScene.moodClass;
  }
  if (petBubble) {
    petBubble.textContent = "💭 " + petScene.thought;
    petBubble.classList.remove("hidden");
  }
}

function switchPet() {
  let i;
  do { i = Math.floor(Math.random() * PET_SCENES.length); } while (i === petIdx && PET_SCENES.length > 1);
  petIdx = i;
  petScene = PET_SCENES[i];
  petSeen = Math.min(8, petSeen + 1);
  petImitating = false;
  if (petCaption) petCaption.textContent = petScene.emoji + " " + petScene.title;
  if (petAction) petAction.textContent = petScene.action;
  if (petCountEl) petCountEl.textContent = String(Math.min(petSeen, 8));
  updatePetMoodUI();
  petFrame?.classList.remove("pop");
  void petFrame?.offsetWidth;
  petFrame?.classList.add("pop");
  playGameFx("pet", "tap");
  if (!petAnimId) petLoop();
}

petSwitchBtn?.addEventListener("click", () => { getAudioCtx(); switchPet(); });
petImitateBtn?.addEventListener("click", () => {
  getAudioCtx();
  playGameFx("pet", "good");
  petImitating = true;
  petImitateUntil = performance.now() + 1800;
  if (petBubble) {
    petBubble.textContent = "🎭 Copy my pose?";
    petBubble.classList.add("bounce");
    setTimeout(() => petBubble?.classList.remove("bounce"), 600);
  }
  if (petAction) petAction.textContent = "It waved — strike the same pose!";
  petFrame?.classList.add("imitate");
  setTimeout(() => petFrame?.classList.remove("imitate"), 600);
});
/* switchPet deferred — see feed lazy init */


/* ===== 网红景点打卡 ===== */
const SPOT_SCENES = [
  { text: "Pink-purple lake like an eyeshadow palette ✨", loc: "Bonneville · Pink Salt", vibe: "Dreamy pink", colors: ["#fbcfe8", "#c4b5fd", "#a5b3fc", "#ddd6fe"], sky: ["#fdf4ff", "#f3e8ff", "#e9d5ff"], sun: "#fde047", mt: "#c4b5fd", accent: "#a855f7" },
  { text: "Endless blue-green water — photo heaven 📸", loc: "Laguna Colorada · Bolivia", vibe: "Clear teal", colors: ["#67e8f9", "#5eead4", "#6ee7b7", "#99f6e4"], sky: ["#ecfeff", "#cffafe", "#a5f3fc"], sun: "#fef08a", mt: "#0891b2", accent: "#06b6d4" },
  { text: "Salt lake panorama — pure healing 💐", loc: "Salar de Uyuni · Mirror", vibe: "Warm glow", colors: ["#fda4af", "#f9a8d4", "#fdba74", "#fde68a"], sky: ["#fff1f2", "#ffe4e6", "#fecdd3"], sun: "#fb923c", mt: "#fb7185", accent: "#f472b6" },
  { text: "Stroll the colorful shore 🌿", loc: "Great Salt Lake · Utah", vibe: "Fresh nature", colors: ["#86efac", "#bef264", "#fde047", "#fcd34d"], sky: ["#f0fdf4", "#ecfccb", "#d9f99d"], sun: "#fde047", mt: "#65a30d", accent: "#22c55e" },
  { text: "Sunset paints the lake orange soda 🌅", loc: "Mono Lake · California", vibe: "Sunset tone", colors: ["#fdba74", "#fb923c", "#f87171", "#fca5a5"], sky: ["#ffedd5", "#fed7aa", "#fdba74"], sun: "#f97316", mt: "#c2410c", accent: "#ea580c" },
  { text: "Mirror reflection — walking in a palette 🎨", loc: "Rainbow Lake", vibe: "Mirror magic", colors: ["#93c5fd", "#a78bfa", "#f0abfc", "#c4b5fd"], sky: ["#eff6ff", "#dbeafe", "#bfdbfe"], sun: "#fde68a", mt: "#6366f1", accent: "#818cf8" },
];

const spotCanvas = document.getElementById("spotCanvas");
const spotCtx = spotCanvas?.getContext("2d");
const spotCaption = document.getElementById("spotCaption");
const spotLoc = document.getElementById("spotLoc");
const spotVibe = document.getElementById("spotVibe");
const spotSwitchBtn = document.getElementById("spotSwitchBtn");
const spotCheckBtn = document.getElementById("spotCheckBtn");
const spotShareBtn = document.getElementById("spotShareBtn");
const spotFlash = document.getElementById("spotFlash");
const spotShutter = document.getElementById("spotShutter");
const spotPolaroidImg = document.getElementById("spotPolaroidImg");
const spotPolaroidLoc = document.getElementById("spotPolaroidLoc");
const spotPolaroidDate = document.getElementById("spotPolaroidDate");
const spotGoldenHour = document.getElementById("spotGoldenHour");
const spotViewfinder = document.getElementById("spotViewfinder");
const spotCheckCount = document.getElementById("spotCheckCount");
const spotStage = document.getElementById("spotStage");
let spotIdx = -1;
let spotScene = SPOT_SCENES[0];
let spotAnimId = 0;
let spotChecks = 0;
const SPOT_W = 360;
const SPOT_H = 320;

function initSpotCanvas() {
  if (!spotCanvas || !spotCtx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  spotCanvas.width = SPOT_W * dpr;
  spotCanvas.height = SPOT_H * dpr;
  spotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  spotCtx.imageSmoothingEnabled = true;
}

function spotDarken(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 255) - amt);
  const b = Math.max(0, (n & 255) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function spotFillWavyGrad(ctx, w, y0, h, c1, c2, t, amp, freq, phase) {
  const grad = ctx.createLinearGradient(0, y0, 0, y0 + h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  for (let x = 0; x <= w; x += 2) {
    ctx.lineTo(x, y0 + Math.sin(x * freq + t + phase) * amp + Math.sin(x * freq * 2.3 + t * 1.3) * amp * 0.3);
  }
  ctx.lineTo(w, y0 + h);
  for (let x = w; x >= 0; x -= 2) {
    ctx.lineTo(x, y0 + h + Math.sin(x * freq + t + phase + 1.2) * amp * 0.55);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSpotClouds(ctx, w, h, t, scene) {
  const clouds = [
    { x: w * 0.12 + Math.sin(t * 0.2) * 8, y: h * 0.08, s: 1 },
    { x: w * 0.45 + Math.sin(t * 0.15 + 1) * 10, y: h * 0.05, s: 0.8 },
    { x: w * 0.72 + Math.sin(t * 0.18 + 2) * 6, y: h * 0.1, s: 0.65 },
  ];
  clouds.forEach((c) => {
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    const r = 16 * c.s;
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.arc(c.x + r * 0.9, c.y - r * 0.2, r * 0.85, 0, Math.PI * 2);
    ctx.arc(c.x + r * 1.7, c.y, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSpotMountains(ctx, w, h, scene) {
  const base = h * 0.36;
  ctx.fillStyle = scene.mt + "88";
  ctx.beginPath();
  ctx.moveTo(0, base);
  ctx.lineTo(w * 0.15, base - 28);
  ctx.lineTo(w * 0.32, base - 12);
  ctx.lineTo(w * 0.48, base - 38);
  ctx.lineTo(w * 0.65, base - 18);
  ctx.lineTo(w * 0.82, base - 42);
  ctx.lineTo(w, base - 22);
  ctx.lineTo(w, base);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = scene.mt + "55";
  ctx.beginPath();
  ctx.moveTo(0, base + 4);
  ctx.lineTo(w * 0.22, base - 14);
  ctx.lineTo(w * 0.55, base - 8);
  ctx.lineTo(w * 0.78, base - 24);
  ctx.lineTo(w, base - 6);
  ctx.lineTo(w, base + 8);
  ctx.closePath();
  ctx.fill();
}

function drawSpotSun(ctx, w, h, t, scene) {
  const sx = w * 0.78 + Math.sin(t * 0.3) * 4;
  const sy = h * 0.11 + Math.cos(t * 0.25) * 3;
  const glow = ctx.createRadialGradient(sx, sy, 4, sx, sy, 48);
  glow.addColorStop(0, scene.sun);
  glow.addColorStop(0.35, scene.sun + "aa");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sx, sy, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = scene.sun;
  ctx.beginPath();
  ctx.arc(sx, sy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.arc(sx - 5, sy - 5, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpotBirds(ctx, w, h, t) {
  const birds = [
    { ox: w * 0.2, oy: h * 0.14, sp: 0.4 },
    { ox: w * 0.55, oy: h * 0.09, sp: 0.55 },
  ];
  ctx.strokeStyle = "rgba(15,23,42,0.35)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  birds.forEach((b, i) => {
    const x = b.ox + Math.sin(t * b.sp + i) * 30;
    const y = b.oy + Math.cos(t * b.sp * 0.7 + i) * 6;
    const flap = Math.sin(t * 8 + i * 2) * 3;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + flap);
    ctx.quadraticCurveTo(x, y - 2, x + 8, y + flap);
    ctx.stroke();
  });
}

function drawSpotSparkles(ctx, w, h, t) {
  const lakeTop = h * 0.38;
  for (let i = 0; i < 18; i++) {
    const px = (i * 47 + 13) % w;
    const py = lakeTop + 20 + (i * 31) % (h * 0.42);
    const alpha = 0.25 + Math.sin(t * 3 + i * 1.7) * 0.25;
    if (alpha < 0.15) continue;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSpotCaustics(ctx, w, h, t, horizon) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    const y0 = horizon + 25 + i * 18;
    for (let x = 0; x <= w; x += 6) {
      const y = y0 + Math.sin(x * 0.04 + t * 1.5 + i) * 5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpotHorizonGlow(ctx, w, horizon, scene) {
  const g = ctx.createLinearGradient(0, horizon - 20, 0, horizon + 30);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, scene.sun + "44");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, horizon - 20, w, 50);
}

function drawSpotHexSalt(ctx, w, h, t) {
  const fg = h * 0.8;
  for (let i = 0; i < 55; i++) {
    const sx = (i * 41 + 7) % w;
    const sy = fg + (i * 23) % (h - fg - 8);
    const size = 3 + (i % 4);
    ctx.strokeStyle = `rgba(255,255,255,${0.25 + (i % 3) * 0.15})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let j = 0; j < 6; j++) {
      const a = Math.PI / 3 * j + t * 0.1;
      const px = sx + Math.cos(a) * size;
      const py = sy + Math.sin(a) * size;
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function drawSpotTraveler(ctx, w, h, t) {
  const x = w * 0.7 + Math.sin(t * 0.5) * 2;
  const y = h * 0.73;
  ctx.fillStyle = "rgba(15,23,42,0.55)";
  ctx.beginPath();
  ctx.arc(x, y - 30, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 6, y - 24, 12, 20);
  ctx.fillRect(x - 10, y - 18, 5, 14);
  ctx.fillRect(x + 5, y - 32, 5, 10);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(x + 5, y - 32, 5, 3);
}

function drawSpotLensFlare(ctx, w, h, scene) {
  const sx = w * 0.78;
  const sy = h * 0.11;
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = scene.sun;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - 60, sy);
  ctx.lineTo(sx + 60, sy);
  ctx.moveTo(sx, sy - 40);
  ctx.lineTo(sx, sy + 40);
  ctx.stroke();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = scene.sun;
  ctx.beginPath();
  ctx.arc(sx - 30, sy + 10, 4, 0, Math.PI * 2);
  ctx.arc(sx + 20, sy - 8, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSpotFilmGrain(ctx, w, h, t) {
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 120; i++) {
    const gx = (i * 97 + Math.floor(t * 10)) % w;
    const gy = (i * 53) % h;
    ctx.fillStyle = i % 2 ? "#000" : "#fff";
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.restore();
}

function drawSpotSalt(ctx, w, h, t) {
  const fg = h * 0.82;
  const grad = ctx.createLinearGradient(0, fg - 10, 0, h);
  grad.addColorStop(0, "rgba(255,255,255,0.65)");
  grad.addColorStop(0.4, "rgba(254,252,232,0.92)");
  grad.addColorStop(1, "rgba(250,250,249,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, fg - 6, w, h - fg + 6);
  drawSpotHexSalt(ctx, w, h, t);
}

function drawSpotBoardwalk(ctx, w, h, t) {
  const y = h * 0.76;
  ctx.fillStyle = "rgba(120, 53, 15, 0.18)";
  ctx.beginPath();
  ctx.moveTo(w * 0.58, y);
  ctx.lineTo(w * 0.98, y - 8);
  ctx.lineTo(w * 0.98, h);
  ctx.lineTo(w * 0.58, h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#78350f";
  for (let i = 0; i < 6; i++) {
    const ly = y + i * 13 + Math.sin(t + i) * 0.5;
    ctx.globalAlpha = 0.85 - i * 0.05;
    ctx.fillRect(w * 0.58, ly, w * 0.4, 5);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(w * 0.58, y, 5, h - y);
  drawSpotTraveler(ctx, w, h, t);
}

function drawSpotVignette(ctx, w, h) {
  const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(15,23,42,0.18)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

function drawSpotLake() {
  if (!spotCtx || !spotCanvas || !spotScene) return;
  const w = SPOT_W;
  const h = SPOT_H;
  const t = performance.now() * 0.001;
  const horizon = h * 0.36;

  const sky = spotCtx.createLinearGradient(0, 0, 0, horizon);
  spotScene.sky.forEach((c, i) => sky.addColorStop(i / (spotScene.sky.length - 1), c));
  spotCtx.fillStyle = sky;
  spotCtx.fillRect(0, 0, w, horizon);

  drawSpotClouds(spotCtx, w, h, t, spotScene);
  drawSpotBirds(spotCtx, w, h, t);
  drawSpotSun(spotCtx, w, h, t, spotScene);
  drawSpotLensFlare(spotCtx, w, h, spotScene);
  drawSpotMountains(spotCtx, w, h, spotScene);
  drawSpotHorizonGlow(spotCtx, w, horizon, spotScene);

  const bandH = (h * 0.46) / spotScene.colors.length;
  spotScene.colors.forEach((c, i) => {
    const y = horizon + i * bandH * 0.9;
    spotFillWavyGrad(spotCtx, w, y, bandH, c, spotDarken(c, 18), t * 0.8, 4 + i * 0.6, 0.016 + i * 0.002, i * 0.8);
  });

  spotCtx.save();
  spotCtx.globalAlpha = 0.42;
  spotCtx.translate(0, horizon * 2 + h * 0.12);
  spotCtx.scale(1, -0.52);
  spotScene.colors.slice().reverse().forEach((c, i) => {
    const y = horizon + i * bandH * 0.75;
    spotFillWavyGrad(spotCtx, w, y, bandH * 0.85, c + "cc", spotDarken(c, 30), t * 0.55, 3, 0.018, i);
  });
  spotCtx.restore();

  drawSpotCaustics(spotCtx, w, h, t, horizon);

  spotCtx.strokeStyle = "rgba(255,255,255,0.3)";
  spotCtx.lineWidth = 1.2;
  for (let i = 0; i < 5; i++) {
    const ry = horizon + 28 + i * 20 + Math.sin(t * 0.8 + i) * 2;
    spotCtx.beginPath();
    spotCtx.ellipse(w / 2, ry, w * 0.48 - i * 18, 5 - i * 0.3, 0, 0, Math.PI * 2);
    spotCtx.stroke();
  }

  drawSpotSparkles(spotCtx, w, h, t, spotScene);
  drawSpotSalt(spotCtx, w, h, t);
  drawSpotBoardwalk(spotCtx, w, h, t);
  drawSpotVignette(spotCtx, w, h);
  drawSpotFilmGrain(spotCtx, w, h, t);
}

function spotLoop() {
  drawSpotLake();
  spotAnimId = requestAnimationFrame(spotLoop);
}

function captureSpotPhoto() {
  if (!spotCanvas || !spotPolaroidImg) return;
  try {
    spotPolaroidImg.src = spotCanvas.toDataURL("image/jpeg", 0.92);
  } catch (_) {
    spotPolaroidImg.src = spotCanvas.toDataURL("image/png");
  }
}

function updateSpotUI() {
  if (!spotScene) return;
  if (spotCaption) spotCaption.textContent = spotScene.text;
  if (spotLoc) spotLoc.textContent = "📍 " + spotScene.loc;
  if (spotVibe) {
    spotVibe.textContent = spotScene.vibe;
    spotVibe.style.color = spotScene.accent;
    spotVibe.style.border = `1px solid ${spotScene.accent}44`;
  }
  if (spotPolaroidLoc) spotPolaroidLoc.textContent = spotScene.loc.split("·").pop()?.trim() || spotScene.loc;
  if (spotPolaroidDate) {
    const d = new Date();
    spotPolaroidDate.textContent = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }
  if (spotGoldenHour) {
    spotGoldenHour.textContent = spotIdx === 4 ? "Golden Hour" : spotIdx % 2 ? "Blue Hour" : "Magic Light";
  }
}

function switchSpot() {
  let i;
  do { i = Math.floor(Math.random() * SPOT_SCENES.length); } while (i === spotIdx && SPOT_SCENES.length > 1);
  spotIdx = i;
  spotScene = SPOT_SCENES[i];
  updateSpotUI();
  spotStage?.classList.remove("pop");
  void spotStage?.offsetWidth;
  spotStage?.classList.add("pop");
  playGameFx("spot", "tap");
  if (!spotAnimId) spotLoop();
}

spotSwitchBtn?.addEventListener("click", () => { getAudioCtx(); switchSpot(); });
spotCheckBtn?.addEventListener("click", () => {
  getAudioCtx();
  playGameFx("spot", "good");
  spotChecks += 1;
  if (spotCheckCount) spotCheckCount.textContent = String(spotChecks);
  captureSpotPhoto();
  spotViewfinder?.classList.add("hidden");
  spotShutter?.classList.remove("hidden");
  spotShutter?.classList.remove("flash");
  void spotShutter?.offsetWidth;
  spotShutter?.classList.add("flash");
  setTimeout(() => spotShutter?.classList.add("hidden"), 350);
  setTimeout(() => {
    spotFlash?.classList.remove("hidden");
    spotFlash?.classList.add("pop");
  }, 280);
  setTimeout(() => {
    spotFlash?.classList.add("hidden");
    spotFlash?.classList.remove("pop");
    spotViewfinder?.classList.remove("hidden");
  }, 2400);
});
spotShareBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  getAudioCtx();
  shareSpotCheckIn();
});
initSpotCanvas();
/* switchSpot deferred — see feed lazy init */


/* ===== 简易麻将摸牌 ===== */
const MJ_TILES = [];
["Wan", "Tong", "Tiao"].forEach((suit) => {
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"].forEach((n) => MJ_TILES.push(n + suit));
});
["E", "S", "W", "N", "Red", "Green", "White"].forEach((h) => MJ_TILES.push(h));

const mjCanvas = document.getElementById("mjCanvas");
const mjCtx = mjCanvas?.getContext("2d");
const mjDrawBtn = document.getElementById("mjDrawBtn");
const mjCountEl = document.getElementById("mjCount");
const mjHand = document.getElementById("mjHand");
let mjDrawn = 0;
let mjCurrent = "🀄";
let mjDeck = [];

function resetMjDeck() {
  mjDeck = [...MJ_TILES];
  for (let i = mjDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mjDeck[i], mjDeck[j]] = [mjDeck[j], mjDeck[i]];
  }
}

function drawMjTile(name, flip) {
  if (!mjCtx || !mjCanvas) return;
  const w = mjCanvas.width;
  const h = mjCanvas.height;
  mjCtx.fillStyle = flip ? "#fef9c3" : "#fafafa";
  mjCtx.strokeStyle = "#92400e";
  mjCtx.lineWidth = 3;
  mjCtx.fillRect(8, 8, w - 16, h - 16);
  mjCtx.strokeRect(8, 8, w - 16, h - 16);
  mjCtx.fillStyle = "#7f1d1d";
  mjCtx.font = "bold 42px serif";
  mjCtx.textAlign = "center";
  mjCtx.textBaseline = "middle";
  mjCtx.fillText(name.length > 1 ? name[0] : name, w / 2, h / 2 - 8);
  if (name.length > 1) {
    mjCtx.font = "bold 22px serif";
    mjCtx.fillText(name[1], w / 2, h / 2 + 28);
  }
}

function mjDraw() {
  getAudioCtx();
  if (!mjDeck.length) resetMjDeck();
  mjCurrent = mjDeck.pop();
  mjDrawn++;
  if (mjCountEl) mjCountEl.textContent = mjDrawn;
  drawMjTile(mjCurrent, true);
  playGameFx("mj", "tap");
  if (mjHand) {
    const chip = document.createElement("span");
    chip.className = "mj-chip pop";
    chip.textContent = mjCurrent;
    mjHand.prepend(chip);
    while (mjHand.children.length > 12) mjHand.lastChild.remove();
  }
}

resetMjDeck();
drawMjTile("?", false);
mjDrawBtn?.addEventListener("click", mjDraw);

/* ===== 星落拾光 ===== */
const starLanding = document.getElementById("starLanding");
const starPlay = document.getElementById("starPlay");
const starStartBtn = document.getElementById("starStartBtn");
const starBackBtn = document.getElementById("starBackBtn");
const starAgainBtn = document.getElementById("starAgainBtn");
const starCanvas = document.getElementById("starCanvas");
const starCoverCanvas = document.getElementById("starCoverCanvas");
const starCtx = starCanvas?.getContext("2d");
const starCoverCtx = starCoverCanvas?.getContext("2d");
const starScoreEl = document.getElementById("starScore");
const starComboEl = document.getElementById("starCombo");
const starOver = document.getElementById("starOver");
const starOverScore = document.getElementById("starOverScore");

let starLoopId = 0;
let starCoverId = 0;
let starCoverOn = false;
let starActive = false;
let starBasketX = 180;
let starItems = [];
let starScore = 0;
let starCombo = 0;
let starSpawn = 0;
let starFall = 1.4;

function showStarScene(el) {
  [starLanding, starPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function drawStarBg(ctx, w, h, t) {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) {
    const sx = (i * 47 + t * 12) % w;
    const sy = (i * 31) % (h * 0.7);
    ctx.fillStyle = `rgba(255,255,255,${0.2 + (i % 5) * 0.12})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStarCover() {
  if (!starCoverCtx || !starCoverCanvas) return;
  const w = starCoverCanvas.width;
  const h = starCoverCanvas.height;
  const t = performance.now() * 0.001;
  drawStarBg(starCoverCtx, w, h, t);
  starCoverCtx.fillStyle = "#fde047";
  starCoverCtx.shadowColor = "#fde047";
  starCoverCtx.shadowBlur = 16;
  starCoverCtx.beginPath();
  starCoverCtx.arc(w / 2, h * 0.45 + Math.sin(t * 2) * 8, 14, 0, Math.PI * 2);
  starCoverCtx.fill();
  starCoverCtx.shadowBlur = 0;
  starCoverCtx.fillStyle = "rgba(250,204,21,0.25)";
  starCoverCtx.fillRect(w * 0.25, h * 0.72, w * 0.5, 10);
}

function startStarCover() {
  if (!starCoverCanvas) return;
  starCoverOn = true;
  starCoverId++;
  const id = starCoverId;
  (function tick() {
    if (!starCoverOn || id !== starCoverId) return;
    drawStarCover();
    requestAnimationFrame(tick);
  })();
}

function stopStarCover() {
  starCoverOn = false;
  starCoverId++;
}

function resetStar() {
  starBasketX = 180;
  starItems = [];
  starScore = 0;
  starCombo = 0;
  starSpawn = 0;
  starFall = 1.4;
  starOver?.classList.add("hidden");
  if (starScoreEl) starScoreEl.textContent = "0";
  if (starComboEl) starComboEl.textContent = "0";
}

function endStar() {
  starActive = false;
  starLoopId++;
  playGameFx("star", "bad");
  if (starOverScore) starOverScore.textContent = starScore;
  starOver?.classList.remove("hidden");
}

function starTick(id) {
  if (!starActive || id !== starLoopId || !starCtx) return;
  const w = starCanvas.width;
  const h = starCanvas.height;
  starSpawn++;
  if (starSpawn > 45 - Math.min(20, starScore / 30)) {
    starSpawn = 0;
    starItems.push({
      x: 30 + Math.random() * (w - 60),
      y: -20,
      type: Math.random() > 0.22 ? "star" : "rock",
      r: 10 + Math.random() * 6,
    });
  }
  starFall = Math.min(3.2, 1.4 + starScore * 0.004);
  const bw = 64;
  starItems.forEach((it) => { it.y += starFall; });
  starItems = starItems.filter((it) => {
    if (it.y > h + 30) return false;
    if (it.y > h - 48 && Math.abs(it.x - starBasketX) < bw / 2 + it.r) {
      if (it.type === "star") {
        starScore += 10 + starCombo;
        starCombo++;
        playGameFx("star", "good");
      } else {
        endStar();
      }
      return false;
    }
    return true;
  });
  if (starScoreEl) starScoreEl.textContent = starScore;
  if (starComboEl) starComboEl.textContent = starCombo;
  const t = performance.now() * 0.001;
  drawStarBg(starCtx, w, h, t);
  starItems.forEach((it) => {
    if (it.type === "star") {
      starCtx.fillStyle = "#fde047";
      starCtx.shadowColor = "#fde047";
      starCtx.shadowBlur = 12;
    } else {
      starCtx.fillStyle = "#78716c";
      starCtx.shadowColor = "#ef4444";
      starCtx.shadowBlur = 8;
    }
    starCtx.beginPath();
    starCtx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
    starCtx.fill();
  });
  starCtx.shadowBlur = 0;
  starCtx.fillStyle = "rgba(250,204,21,0.35)";
  starCtx.fillRect(starBasketX - bw / 2, h - 36, bw, 12);
  starCtx.fillStyle = "#fde047";
  starCtx.beginPath();
  starCtx.moveTo(starBasketX, h - 50);
  starCtx.lineTo(starBasketX - bw / 2, h - 36);
  starCtx.lineTo(starBasketX + bw / 2, h - 36);
  starCtx.closePath();
  starCtx.fill();
  requestAnimationFrame(() => starTick(id));
}

function startStar() {
  resetStar();
  starActive = true;
  starLoopId++;
  starTick(starLoopId);
}

function starMove(dir) {
  if (!starActive) return;
  starBasketX += dir === "left" ? -28 : 28;
  starBasketX = Math.max(40, Math.min(starCanvas.width - 40, starBasketX));
  playGameFx("star", "tap");
}

starStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopStarCover();
  showStarScene(starPlay);
  startStar();
});
starBackBtn?.addEventListener("click", () => {
  starActive = false;
  starLoopId++;
  showStarScene(starLanding);
  startStarCover();
});
starAgainBtn?.addEventListener("click", startStar);
document.querySelectorAll("[data-star]").forEach((b) => b.addEventListener("click", () => starMove(b.dataset.star)));
document.addEventListener("keydown", (e) => {
  if (!starActive) return;
  if (e.key === "ArrowLeft") starMove("left");
  if (e.key === "ArrowRight") starMove("right");
});
/* startStarCover deferred — see feed lazy init */


/* ===== 叠层手速台 ===== */
const stackLanding = document.getElementById("stackLanding");
const stackPlay = document.getElementById("stackPlay");
const stackStartBtn = document.getElementById("stackStartBtn");
const stackBackBtn = document.getElementById("stackBackBtn");
const stackAgainBtn = document.getElementById("stackAgainBtn");
const stackCanvas = document.getElementById("stackCanvas");
const stackCoverCanvas = document.getElementById("stackCoverCanvas");
const stackCtx = stackCanvas?.getContext("2d");
const stackCoverCtx = stackCoverCanvas?.getContext("2d");
const stackLevelEl = document.getElementById("stackLevel");
const stackScoreEl = document.getElementById("stackScore");
const stackOver = document.getElementById("stackOver");
const stackOverLevel = document.getElementById("stackOverLevel");
const stackCanvasWrap = document.getElementById("stackCanvasWrap");

const STACK_COLORS = ["#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#6366f1", "#ec4899"];

let stackLoopId = 0;
let stackActive = false;
let stackBlocks = [];
let stackMoving = null;
let stackLevel = 0;
let stackScore = 0;
let stackDir = 1;

function showStackScene(el) {
  [stackLanding, stackPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function drawStackCover() {
  if (!stackCoverCtx || !stackCoverCanvas) return;
  const w = stackCoverCanvas.width;
  const h = stackCoverCanvas.height;
  stackCoverCtx.fillStyle = "#fef3c7";
  stackCoverCtx.fillRect(0, 0, w, h);
  for (let i = 0; i < 5; i++) {
    stackCoverCtx.fillStyle = STACK_COLORS[i % STACK_COLORS.length];
    const bw = 120 - i * 12;
    stackCoverCtx.fillRect((w - bw) / 2, h - 30 - i * 28, bw, 22);
  }
}

function resetStack() {
  stackBlocks = [{ x: 60, w: 240, y: stackCanvas.height - 40, c: STACK_COLORS[0] }];
  stackLevel = 0;
  stackScore = 0;
  stackDir = 1;
  stackMoving = { x: 60, w: 240, y: stackCanvas.height - 68, c: STACK_COLORS[1] };
  stackOver?.classList.add("hidden");
  if (stackLevelEl) stackLevelEl.textContent = "0";
  if (stackScoreEl) stackScoreEl.textContent = "0";
}

function spawnStackBlock() {
  const prev = stackBlocks[stackBlocks.length - 1];
  stackMoving = {
    x: 0,
    w: prev.w,
    y: prev.y - 28,
    c: STACK_COLORS[(stackLevel + 1) % STACK_COLORS.length],
  };
  stackDir = 1;
}

function dropStackBlock() {
  if (!stackActive || !stackMoving) return;
  const prev = stackBlocks[stackBlocks.length - 1];
  const left = Math.max(stackMoving.x, prev.x);
  const right = Math.min(stackMoving.x + stackMoving.w, prev.x + prev.w);
  const nw = right - left;
  if (nw <= 8) {
    endStack();
    return;
  }
  const overlap = nw / stackMoving.w;
  stackScore += Math.floor(overlap * 100);
  stackLevel++;
  stackBlocks.push({ x: left, w: nw, y: stackMoving.y, c: stackMoving.c });
  if (stackLevelEl) stackLevelEl.textContent = stackLevel;
  if (stackScoreEl) stackScoreEl.textContent = stackScore;
  playGameFx("stack", overlap > 0.9 ? "good" : "tap");
  if (stackBlocks.length > 12) stackBlocks.shift();
  stackBlocks.forEach((b, i) => { b.y += 28; });
  spawnStackBlock();
}

function endStack() {
  stackActive = false;
  stackLoopId++;
  playGameFx("stack", "bad");
  if (stackOverLevel) stackOverLevel.textContent = stackLevel;
  stackOver?.classList.remove("hidden");
}

function drawStack() {
  if (!stackCtx || !stackCanvas) return;
  const w = stackCanvas.width;
  const h = stackCanvas.height;
  stackCtx.fillStyle = "#fffbeb";
  stackCtx.fillRect(0, 0, w, h);
  stackBlocks.forEach((b) => {
    stackCtx.fillStyle = b.c;
    stackCtx.fillRect(b.x, b.y, b.w, 22);
  });
  if (stackMoving) {
    stackCtx.fillStyle = stackMoving.c;
    stackCtx.fillRect(stackMoving.x, stackMoving.y, stackMoving.w, 22);
  }
}

function stackTick(id) {
  if (!stackActive || id !== stackLoopId || !stackMoving) return;
  stackMoving.x += stackDir * (2.8 + stackLevel * 0.08);
  if (stackMoving.x <= 0 || stackMoving.x + stackMoving.w >= stackCanvas.width) stackDir *= -1;
  drawStack();
  requestAnimationFrame(() => stackTick(id));
}

function startStack() {
  resetStack();
  stackActive = true;
  stackLoopId++;
  stackTick(stackLoopId);
}

stackStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  drawStackCover();
  showStackScene(stackPlay);
  startStack();
});
stackBackBtn?.addEventListener("click", () => {
  stackActive = false;
  stackLoopId++;
  showStackScene(stackLanding);
});
stackAgainBtn?.addEventListener("click", startStack);
stackCanvasWrap?.addEventListener("click", dropStackBlock);
document.addEventListener("keydown", (e) => {
  if (!stackActive) return;
  if (e.code === "Space") { e.preventDefault(); dropStackBlock(); }
});
drawStackCover();

/* ===== 配对翻翻乐 ===== */
const MATCH_ICONS = ["🌸", "🎵", "🍀", "🌙", "⭐", "🎈"];
const matchLanding = document.getElementById("matchLanding");
const matchPlay = document.getElementById("matchPlay");
const matchStartBtn = document.getElementById("matchStartBtn");
const matchBackBtn = document.getElementById("matchBackBtn");
const matchAgainBtn = document.getElementById("matchAgainBtn");
const matchGrid = document.getElementById("matchGrid");
const matchMovesEl = document.getElementById("matchMoves");
const matchPairsEl = document.getElementById("matchPairs");
const matchTimeEl = document.getElementById("matchTime");
const matchWin = document.getElementById("matchWin");
const matchWinMoves = document.getElementById("matchWinMoves");

let matchOpen = [];
let matchLocked = false;
let matchMoves = 0;
let matchFound = 0;
let matchTimer = null;
let matchSeconds = 0;

function showMatchScene(el) {
  [matchLanding, matchPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildMatchGrid() {
  if (!matchGrid) return;
  matchGrid.innerHTML = "";
  matchOpen = [];
  matchLocked = false;
  matchMoves = 0;
  matchFound = 0;
  matchSeconds = 0;
  matchWin?.classList.add("hidden");
  clearInterval(matchTimer);
  matchTimer = setInterval(() => {
    matchSeconds++;
    if (matchTimeEl) matchTimeEl.textContent = `${matchSeconds}s`;
  }, 1000);
  if (matchMovesEl) matchMovesEl.textContent = "0";
  if (matchPairsEl) matchPairsEl.textContent = "0/6";
  if (matchTimeEl) matchTimeEl.textContent = "0s";
  const deck = shuffle([...MATCH_ICONS, ...MATCH_ICONS]);
  deck.forEach((icon, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "match-card-btn";
    btn.dataset.icon = icon;
    btn.dataset.idx = idx;
    btn.innerHTML = `<span class="back">?</span><span class="face">${icon}</span>`;
    btn.addEventListener("click", () => flipMatchCard(btn));
    matchGrid.appendChild(btn);
  });
}

function flipMatchCard(btn) {
  if (matchLocked || btn.classList.contains("flipped") || btn.classList.contains("matched")) return;
  btn.classList.add("flipped");
  matchOpen.push(btn);
  playGameFx("match", "tap");
  if (matchOpen.length === 2) {
    matchMoves++;
    if (matchMovesEl) matchMovesEl.textContent = matchMoves;
    matchLocked = true;
    const [a, b] = matchOpen;
    if (a.dataset.icon === b.dataset.icon) {
      a.classList.add("matched");
      b.classList.add("matched");
      matchFound++;
      if (matchPairsEl) matchPairsEl.textContent = `${matchFound}/6`;
      playGameFx("match", "good");
      matchOpen = [];
      matchLocked = false;
      if (matchFound === 6) {
        clearInterval(matchTimer);
        playGameFx("match", "win");
        if (matchWinMoves) matchWinMoves.textContent = matchMoves;
        matchWin?.classList.remove("hidden");
      }
    } else {
      setTimeout(() => {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        matchOpen = [];
        matchLocked = false;
      }, 650);
    }
  }
}

matchStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  showMatchScene(matchPlay);
  buildMatchGrid();
});
matchBackBtn?.addEventListener("click", () => {
  clearInterval(matchTimer);
  showMatchScene(matchLanding);
});
matchAgainBtn?.addEventListener("click", buildMatchGrid);

/* ===== 数字合并格 ===== */
const mergeLanding = document.getElementById("mergeLanding");
const mergePlay = document.getElementById("mergePlay");
const mergeStartBtn = document.getElementById("mergeStartBtn");
const mergeBackBtn = document.getElementById("mergeBackBtn");
const mergeAgainBtn = document.getElementById("mergeAgainBtn");
const mergeGrid = document.getElementById("mergeGrid");
const mergeScoreEl = document.getElementById("mergeScore");
const mergeBestEl = document.getElementById("mergeBest");
const mergeOver = document.getElementById("mergeOver");
const mergeOverTitle = document.getElementById("mergeOverTitle");
const mergeOverScore = document.getElementById("mergeOverScore");

let mergeBoard = [];
let mergeScore = 0;
let mergeBest = parseInt(localStorage.getItem("mergeBest") || "0", 10);
let mergeActive = false;

function showMergeScene(el) {
  [mergeLanding, mergePlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function emptyMerge() {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function spawnMergeTile(b) {
  const empty = [];
  b.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() > 0.85 ? 4 : 2;
}

function renderMerge() {
  if (!mergeGrid) return;
  mergeGrid.innerHTML = "";
  mergeBoard.forEach((row) => {
    row.forEach((v) => {
      const cell = document.createElement("div");
      cell.className = "merge-cell" + (v ? ` v${v}` : "");
      cell.textContent = v || "";
      mergeGrid.appendChild(cell);
    });
  });
  if (mergeScoreEl) mergeScoreEl.textContent = mergeScore;
  if (mergeBestEl) mergeBestEl.textContent = mergeBest;
}

function slideMerge(dir) {
  if (!mergeActive) return;
  const b = mergeBoard.map((r) => [...r]);
  let moved = false;
  const mergeLine = (line) => {
    const filtered = line.filter((v) => v);
    const out = [];
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const v = filtered[i] * 2;
        out.push(v);
        mergeScore += v;
        i++;
        moved = true;
      } else out.push(filtered[i]);
    }
    while (out.length < 4) out.push(0);
    if (out.some((v, i) => v !== line[i])) moved = true;
    return out;
  };
  if (dir === "left") {
    for (let r = 0; r < 4; r++) b[r] = mergeLine(b[r]);
  } else if (dir === "right") {
    for (let r = 0; r < 4; r++) b[r] = mergeLine([...b[r]].reverse()).reverse();
  } else if (dir === "up") {
    for (let c = 0; c < 4; c++) {
      const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
      const next = mergeLine(col);
      next.forEach((v, r) => { b[r][c] = v; });
    }
  } else if (dir === "down") {
    for (let c = 0; c < 4; c++) {
      const col = [b[3][c], b[2][c], b[1][c], b[0][c]];
      const next = mergeLine(col);
      next.forEach((v, r) => { b[3 - r][c] = v; });
    }
  }
  if (!moved) return;
  mergeBoard = b;
  spawnMergeTile(mergeBoard);
  if (mergeScore > mergeBest) {
    mergeBest = mergeScore;
    localStorage.setItem("mergeBest", String(mergeBest));
  }
  playGameFx("merge", "tap");
  renderMerge();
  if (!canMergeMove()) {
    mergeActive = false;
    if (mergeOverTitle) mergeOverTitle.textContent = "Grid full";
    if (mergeOverScore) mergeOverScore.textContent = mergeScore;
    mergeOver?.classList.remove("hidden");
    playGameFx("merge", "bad");
  }
}

function canMergeMove() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = mergeBoard[r][c];
      if (!v) return true;
      if (c < 3 && mergeBoard[r][c + 1] === v) return true;
      if (r < 3 && mergeBoard[r + 1][c] === v) return true;
    }
  }
  return false;
}

function startMerge() {
  mergeBoard = emptyMerge();
  mergeScore = 0;
  mergeActive = true;
  mergeOver?.classList.add("hidden");
  spawnMergeTile(mergeBoard);
  spawnMergeTile(mergeBoard);
  renderMerge();
}

mergeStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  showMergeScene(mergePlay);
  startMerge();
});
mergeBackBtn?.addEventListener("click", () => {
  mergeActive = false;
  showMergeScene(mergeLanding);
});
mergeAgainBtn?.addEventListener("click", startMerge);

let mergeTouchX = 0;
let mergeTouchY = 0;
mergeGrid?.addEventListener("touchstart", (e) => {
  mergeTouchX = e.touches[0].clientX;
  mergeTouchY = e.touches[0].clientY;
}, { passive: true });
mergeGrid?.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - mergeTouchX;
  const dy = e.changedTouches[0].clientY - mergeTouchY;
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) slideMerge(dx > 0 ? "right" : "left");
  else slideMerge(dy > 0 ? "down" : "up");
});
document.addEventListener("keydown", (e) => {
  if (!mergeActive) return;
  const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
  if (map[e.key]) { e.preventDefault(); slideMerge(map[e.key]); }
});
if (mergeBestEl) mergeBestEl.textContent = mergeBest;

/* ===== 节拍点点 ===== */
const beatLanding = document.getElementById("beatLanding");
const beatPlay = document.getElementById("beatPlay");
const beatStartBtn = document.getElementById("beatStartBtn");
const beatBackBtn = document.getElementById("beatBackBtn");
const beatAgainBtn = document.getElementById("beatAgainBtn");
const beatCanvas = document.getElementById("beatCanvas");
const beatCtx = beatCanvas?.getContext("2d");
const beatScoreEl = document.getElementById("beatScore");
const beatComboEl = document.getElementById("beatCombo");
const beatLifeEl = document.getElementById("beatLife");
const beatOver = document.getElementById("beatOver");
const beatOverScore = document.getElementById("beatOverScore");

const BEAT_HIT_Y = 268;
const BEAT_LANES = [45, 135, 225, 315];

let beatLoopId = 0;
let beatActive = false;
let beatNotes = [];
let beatScore = 0;
let beatCombo = 0;
let beatLife = 3;
let beatSpawn = 0;
let beatSpeed = 2.2;

function showBeatScene(el) {
  [beatLanding, beatPlay].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function resetBeat() {
  beatNotes = [];
  beatScore = 0;
  beatCombo = 0;
  beatLife = 3;
  beatSpawn = 0;
  beatSpeed = 2.2;
  beatOver?.classList.add("hidden");
  if (beatScoreEl) beatScoreEl.textContent = "0";
  if (beatComboEl) beatComboEl.textContent = "0";
  if (beatLifeEl) beatLifeEl.textContent = "3";
}

function endBeat() {
  beatActive = false;
  beatLoopId++;
  playGameFx("beat", "bad");
  if (beatOverScore) beatOverScore.textContent = beatScore;
  beatOver?.classList.remove("hidden");
}

function beatHit(lane) {
  if (!beatActive) return;
  const btn = document.querySelector(`.beat-lane-btn[data-beat="${lane}"]`);
  btn?.classList.add("hit");
  setTimeout(() => btn?.classList.remove("hit"), 120);
  let hit = -1;
  let best = 999;
  beatNotes.forEach((n, i) => {
    if (n.lane !== lane) return;
    const d = Math.abs(n.y - BEAT_HIT_Y);
    if (d < 36 && d < best) { best = d; hit = i; }
  });
  if (hit >= 0) {
    beatNotes.splice(hit, 1);
    beatCombo++;
    beatScore += 50 + beatCombo * 5;
    playGameFx("beat", "good");
  } else {
    beatCombo = 0;
    beatLife--;
    playGameFx("beat", "bad");
    if (beatLife <= 0) endBeat();
  }
  if (beatScoreEl) beatScoreEl.textContent = beatScore;
  if (beatComboEl) beatComboEl.textContent = beatCombo;
  if (beatLifeEl) beatLifeEl.textContent = beatLife;
}

function drawBeat() {
  if (!beatCtx || !beatCanvas) return;
  const w = beatCanvas.width;
  const h = beatCanvas.height;
  beatCtx.fillStyle = "#042f2e";
  beatCtx.fillRect(0, 0, w, h);
  BEAT_LANES.forEach((x) => {
    beatCtx.strokeStyle = "rgba(45,212,191,0.2)";
    beatCtx.beginPath();
    beatCtx.moveTo(x, 0);
    beatCtx.lineTo(x, h);
    beatCtx.stroke();
  });
  beatCtx.fillStyle = "rgba(45,212,191,0.25)";
  beatCtx.fillRect(0, BEAT_HIT_Y - 8, w, 16);
  beatNotes.forEach((n) => {
    beatCtx.fillStyle = "#2dd4bf";
    beatCtx.shadowColor = "#5eead4";
    beatCtx.shadowBlur = 14;
    beatCtx.beginPath();
    beatCtx.arc(BEAT_LANES[n.lane], n.y, 14, 0, Math.PI * 2);
    beatCtx.fill();
  });
  beatCtx.shadowBlur = 0;
}

function beatTick(id) {
  if (!beatActive || id !== beatLoopId) return;
  beatSpawn++;
  if (beatSpawn > 50 - Math.min(18, beatScore / 80)) {
    beatSpawn = 0;
    beatNotes.push({ lane: Math.floor(Math.random() * 4), y: -10 });
  }
  beatSpeed = Math.min(4.5, 2.2 + beatScore * 0.003);
  beatNotes.forEach((n) => { n.y += beatSpeed; });
  beatNotes = beatNotes.filter((n) => {
    if (n.y > hSafe()) {
      beatCombo = 0;
      beatLife--;
      if (beatLifeEl) beatLifeEl.textContent = beatLife;
      if (beatLife <= 0) endBeat();
      return false;
    }
    return true;
  });
  drawBeat();
  requestAnimationFrame(() => beatTick(id));
}

function hSafe() { return beatCanvas?.height || 320; }

function startBeat() {
  resetBeat();
  beatActive = true;
  beatLoopId++;
  beatTick(beatLoopId);
}

beatStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  showBeatScene(beatPlay);
  startBeat();
});
beatBackBtn?.addEventListener("click", () => {
  beatActive = false;
  beatLoopId++;
  showBeatScene(beatLanding);
});
beatAgainBtn?.addEventListener("click", startBeat);
document.querySelectorAll("[data-beat]").forEach((b) => {
  b.addEventListener("click", () => beatHit(parseInt(b.dataset.beat, 10)));
});

/* ===== 通用交互 ===== */
document.querySelectorAll(".sound-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const game = btn.dataset.game;
    soundState[game] = !soundState[game];
    btn.querySelector(".icon-on").classList.toggle("hidden", !soundState[game]);
    btn.querySelector(".icon-off").classList.toggle("hidden", soundState[game]);
    btn.classList.toggle("muted", !soundState[game]);
    if (game === "fortune") {
      soundState.fortune ? startFortuneBGM() : stopFortuneBGM();
    } else if (game === "earth") {
      soundState.earth ? startEarthBGM() : stopEarthBGM();
    } else if (game === "shop") {
      soundState.shop ? startShopBGM() : stopShopBGM();
    } else if (game === "leap") {
      soundState.leap ? startLeapBGM() : stopLeapBGM();
    } else if (game === "run") {
      soundState.run ? startRunBGM() : stopRunBGM();
    }
  });
});

document.querySelectorAll(".fullscreen-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = document.getElementById(btn.dataset.target);
    card.classList.toggle("fullscreen");
    const isFull = card.classList.contains("fullscreen");
    btn.innerHTML = isFull
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg> Exit`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg> Full`;
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    tab.closest(".tabs").querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const search = document.getElementById("feedSearch");
    if (search?.value) {
      search.value = "";
      feedSearchQuery = "";
    }
    switchFeedTab(tab.dataset.tab || "recommend");
  });
});

document.querySelectorAll(".stat-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "share") {
      const item = btn.closest(".feed-item");
      const gameId = item?.dataset.game || "home";
      const meta = GAME_SHARE_META[gameId] || GAME_SHARE_META.home;
      const url = `${window.location.origin}${window.location.pathname}?game=${gameId}`;
      const text = `${meta.text} ${meta.tag}`;
      if (navigator.share) {
        navigator.share({ title: meta.title, text, url }).catch(() => {});
      } else if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(`${text} ${url}`);
        showAppToast("Link copied!");
      }
      recordStreakPlay(gameId);
      return;
    }
    if (action === "star") {
      btn.classList.toggle("saved");
      const gameId = btn.closest(".feed-item")?.dataset.game;
      if (gameId) toggleSavedGame(gameId, btn.classList.contains("saved"));
      showAppToast(btn.classList.contains("saved") ? "Saved to favorites" : "Removed from favorites");
      return;
    }
    if (action === "like") {
      btn.classList.toggle("active");
      showAppToast(btn.classList.contains("active") ? "Thanks for the love!" : "Like removed");
      recordStreakPlay(btn.closest(".feed-item")?.dataset.game);
      return;
    }
    recordStreakPlay(btn.closest(".feed-item")?.dataset.game);
  });
});

function showAppToast(message) {
  const toast = document.getElementById("appToast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showAppToast._timer);
  showAppToast._timer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

function hideAppLoader() {
  const loader = document.getElementById("appLoader");
  if (!loader) return;
  loader.classList.add("hidden");
  loader.setAttribute("aria-hidden", "true");
}

/* ===== Feed optimizations: reorder, ads, lazy init, streak ===== */
const ADSENSE_CLIENT = "";

const GAME_SHARE_META = {
  home: { title: "VibeVerse", text: "Free mini games in a scroll feed!", tag: "#VibeVerse" },
  fortune: { title: "Daily Fortune", text: "Draw today's fortune on VibeVerse", tag: "#DailyFortune" },
  earth: { title: "Blue Planet Diary", text: "Daily quests & good vibes", tag: "#BluePlanet" },
  chick: { title: "Squishy Chick", text: "Squeeze away the stress", tag: "#SquishyChick" },
  block: { title: "Cute Stack", text: "Stack blocks, chase high scores", tag: "#CuteStack" },
  shop: { title: "Fresh Fruit Stand", text: "Run your corner fruit shop", tag: "#FruitStand" },
  leap: { title: "Lily Pad Leap", text: "Hop pads, chain combos", tag: "#LilyPadLeap" },
  run: { title: "Neon Rush", text: "Three-lane cyber runner", tag: "#NeonRush" },
  face: { title: "Runway Glow-Up", text: "Couch to runway on the beat", tag: "#VibeVerseGlowUp" },
  box: { title: "Mystery Flavor Box", text: "Guess wild drink flavors", tag: "#FlavorGuess" },
  sente: { title: "Born To vs Forced To", text: "Meme lines for your mood", tag: "#MemeLines" },
  pet: { title: "Office Pets", text: "Pets with WFH vibes", tag: "#PetOffice" },
  spot: { title: "Rainbow Salt Lake", text: "Cloud travel check-in", tag: "#TravelCheckIn" },
  mj: { title: "Tile Draw", text: "Solo tile draws, no rules", tag: "#TileZen" },
  star: { title: "Starfall", text: "Catch stars, dodge meteors", tag: "#Starfall" },
  stack: { title: "Stack Rush", text: "Drop blocks, stack higher", tag: "#StackRush" },
  match: { title: "Memory Match", text: "Flip matching pairs", tag: "#MemoryMatch" },
  merge: { title: "Number Merge", text: "Swipe to merge — chase 2048", tag: "#NumberMerge" },
  beat: { title: "Beat Tap", text: "Tap on rhythm, stay on beat", tag: "#BeatTap" },
};

const RECOMMEND_ORDER = ["chick", "run", "shop", "sente", "fortune", "earth", "block", "leap"];
const GAMES_ORDER = ["face", "box", "pet", "spot", "mj", "star", "stack", "match", "merge", "beat"];

const lazyInited = new Set();
let feedProgressObserver = null;

function initKnowledgeHub() {
  /* Logic in assets/financial-news-hub.js (loaded before app.js) */
}

function initFeedOptimizations() {
  polishTrustSignals();
  tagFeedItems();
  reorderFeedItems();
  injectInFeedAds();
  renderAdUnits();
  initSavedGames();
  initStreakUI();
  initFeedLazyLoad();
  initFeedProgress();
  initCookieConsent();
  initContentHub();
  initGameCategoryNav();
  initFeedSearch();
  initOnboarding();
  initGameShareButtons();

  const tab = document.querySelector(".tab.active")?.dataset.tab || "recommend";
  const gamesReady =
    tab === "knowledge"
      ? Promise.resolve()
      : window.vvEnsureGamesChunk?.() || Promise.resolve();

  gamesReady.then(() => {
    initFeedMeta();
    initKnowledgeHub();
    handleDeepLink();
    switchFeedTab(tab);
    document.querySelectorAll(".game-card button, .mini-scene button, .feed-item .btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const gameId = btn.closest(".feed-item")?.dataset.game;
        if (gameId) recordStreakPlay(gameId);
      }, { capture: true, once: false });
    });
  });
}

function tagFeedItems() {
  document.querySelectorAll(".feed-item").forEach((item) => {
    const card = item.querySelector(".game-card");
    if (!card?.id) return;
    const game = card.id.replace(/Card$/, "").toLowerCase();
    item.dataset.game = game;
    item.dataset.category = GAME_CATEGORIES[game] || "chill";
  });
  const senteItem = document.querySelector('.feed-item[data-game="sente"]');
  if (senteItem) senteItem.dataset.feed = "recommend";
}

const CREATOR_EMOJI = {
  fortune: "🌸", earth: "🌍", chick: "🐣", block: "🦌", shop: "🏪",
  leap: "🐸", run: "⚡", face: "💅", box: "🎁", sente: "✨",
  pet: "🐾", spot: "🌈", mj: "🀄", star: "⭐", stack: "🧱",
  match: "🃏", merge: "🔢", beat: "🎵",
};

function polishTrustSignals() {
  document.querySelectorAll(".stat-btn span").forEach((s) => s.remove());
  document.querySelectorAll(".stat-btn").forEach((btn) => {
    const action = btn.dataset.action;
    if (action === "like" && !btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Like");
    if (action === "star" && !btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Save");
    if (action === "share" && !btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Share");
  });
  document.querySelectorAll(".avatar img[src*='picsum']").forEach((img) => {
    const el = document.createElement("span");
    el.className = "avatar-emoji";
    el.setAttribute("aria-hidden", "true");
    el.textContent = "✦";
    img.replaceWith(el);
  });
  document.querySelectorAll(".feed-user img[src*='picsum']").forEach((img) => {
    const item = img.closest(".feed-item");
    const game = item?.querySelector(".game-card")?.id?.replace(/Card$/, "").toLowerCase();
    const el = document.createElement("span");
    el.className = "feed-avatar";
    el.setAttribute("aria-hidden", "true");
    el.textContent = CREATOR_EMOJI[game] || "🎮";
    img.replaceWith(el);
  });
}

function initOnboarding() {
  if (localStorage.getItem("vv_onboarded")) return;
  const overlay = document.getElementById("onboardOverlay");
  const dismiss = document.getElementById("onboardDismiss");
  if (!overlay || !dismiss) return;
  setTimeout(() => overlay.classList.remove("hidden"), 900);
  dismiss.addEventListener("click", () => {
    overlay.classList.add("hidden");
    localStorage.setItem("vv_onboarded", "1");
  });
}

function initFeedSearch() {
  const input = document.getElementById("feedSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    feedSearchQuery = input.value;
    if (!feedSearchQuery.trim()) {
      feedSearchQuery = "";
      applyFeedVisibility();
      return;
    }
    applyFeedSearchFilter(feedSearchQuery);
  });
  input.addEventListener("search", () => {
    if (!input.value.trim()) {
      feedSearchQuery = "";
      applyFeedVisibility();
    }
  });
  if (input.dataset.bound) return;
  input.dataset.bound = "1";
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName || "")) {
      e.preventDefault();
      const learnIntro = document.getElementById("feedIntroLearn");
      if (learnIntro && !learnIntro.classList.contains("hidden") && typeof focusLearnFeedSearch === "function") {
        window.vvEnsureLearnCore?.().then(() => focusLearnFeedSearch());
        return;
      }
      input.focus();
    }
    if (e.key === "Escape") {
      const learnInput = document.getElementById("learnFeedSearch");
      if (document.activeElement === learnInput) {
        learnInput.value = "";
        if (typeof window.syncLearnSearch === "function") window.syncLearnSearch("");
        else learnInput.dispatchEvent(new Event("input", { bubbles: true }));
        learnInput.blur();
        return;
      }
      if (document.activeElement === input) {
        input.value = "";
        feedSearchQuery = "";
        input.blur();
        applyFeedVisibility();
      }
    }
  });
}

function initContentHub() {
  const earthDate = document.getElementById("earthFeedDate");
  if (earthDate) {
    const d = new Date();
    earthDate.textContent = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  const pickBtn = document.getElementById("todayPickBtn");
  const whatsNew = document.getElementById("whatsNew");
  if (pickBtn) {
    const dayIndex = Math.floor(Date.now() / 86400000) % TODAY_PICKS.length;
    const pick = TODAY_PICKS[dayIndex];
    pickBtn.textContent = pick.label;
    pickBtn.title = pick.challenge;
    pickBtn.addEventListener("click", () => {
      const item = document.querySelector(`.feed-item[data-game="${pick.game}"]`);
      if (!item) return;
      const tab = item.dataset.feed || "recommend";
      document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
      applyFeedVisibility();
      setTimeout(() => {
        item.scrollIntoView({ behavior: "smooth", block: "start" });
        lazyInitGame(pick.game);
      }, 80);
    });
  }
  if (whatsNew) {
    const idx = Math.floor(Date.now() / 604800000) % WHATS_NEW.length;
    whatsNew.textContent = WHATS_NEW[idx];
  }
}

function initGameCategoryNav() {
  gameCategories?.querySelectorAll(".game-cat").forEach((btn) => {
    btn.addEventListener("click", () => switchGameCategory(btn.dataset.cat));
  });
}

function initFeedMeta() {
  const meta = window.FEED_META || {};
  document.querySelectorAll(".feed-item").forEach((item) => {
    const game = item.dataset.game;
    const m = meta[game];
    if (!m) return;
    const left = item.querySelector(".feed-meta-left");
    if (!left) return;
    let desc = item.querySelector(".feed-desc");
    if (!desc) {
      desc = document.createElement("p");
      desc.className = "feed-desc";
      const user = item.querySelector(".feed-user");
      left.insertBefore(desc, user || null);
    }
    if (m.editorPick) desc.textContent = m.editorPick;
    if (!left.querySelector(".feed-guide-link")) {
      const guide = document.createElement("a");
      guide.className = "feed-guide-link";
      guide.href = `games/${m.guide}`;
      guide.textContent = "How to play →";
      left.appendChild(guide);
    }
    const user = item.querySelector(".feed-user");
    if (user) {
      user.innerHTML = `<span class="feed-cat-pill">${m.categoryLabel || "Game"}</span><span class="feed-cred">VibeVerse editorial</span>`;
    }
  });
  const list = document.getElementById("feedHighlightsList");
  const highlights = window.FEED_HIGHLIGHTS || [];
  if (list && highlights.length) {
    list.innerHTML = highlights
      .map(
        (h) =>
          `<li><a href="index.html?game=${h.game}">${h.label}</a><span class="feed-highlight-tip">${h.tip}</span></li>`,
      )
      .join("");
  }
}

function reorderFeedItems() {
  const feed = document.getElementById("feed");
  const empty = document.getElementById("feedEmpty");
  if (!feed || !empty) return;

  const all = [...feed.querySelectorAll(".feed-item")];
  const recommend = all.filter((i) => i.dataset.feed === "recommend");
  const games = all.filter((i) => i.dataset.feed === "games");

  const sortBy = (list, order) =>
    list.sort((a, b) => {
      const ai = order.indexOf(a.dataset.game);
      const bi = order.indexOf(b.dataset.game);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  sortBy(recommend, RECOMMEND_ORDER);
  sortBy(games, GAMES_ORDER);

  [...recommend, ...games].forEach((item) => feed.insertBefore(item, empty));
}

function createAdElement(tab, index) {
  const ad = document.createElement("div");
  ad.className = "ad-in-feed";
  ad.dataset.feedTab = tab;
  ad.dataset.adIndex = String(index);
  ad.setAttribute("aria-label", "Advertisement");
  ad.innerHTML = `<div class="ad-in-feed-inner" data-ad-unit="in-feed-${tab}-${index}"></div>`;
  return ad;
}

function injectInFeedAds() {
  const feed = document.getElementById("feed");
  const empty = document.getElementById("feedEmpty");
  if (!feed || !empty) return;

  ["recommend", "games"].forEach((tab) => {
    const items = [...feed.querySelectorAll(`.feed-item[data-feed="${tab}"]`)];
    let adCount = 0;
    items.forEach((item, idx) => {
      if ((idx + 1) % 4 !== 0 || idx === items.length - 1) return;
      adCount += 1;
      const ad = createAdElement(tab, adCount);
      item.after(ad);
    });
  });
}

function renderAdPlaceholder(container) {
  container.innerHTML = `<span class="ad-slot-label">Sponsored</span>`;
}

function renderAdUnits() {
  const hasAds = Boolean(ADSENSE_CLIENT);
  document.body.classList.toggle("ads-enabled", hasAds);
  if (!hasAds) {
    document.querySelectorAll(".sidebar-ad, .ad-in-feed, .ad-slot").forEach((el) => {
      el.hidden = true;
    });
    return;
  }
  document.querySelectorAll(".sidebar-ad, .ad-in-feed, .ad-slot").forEach((el) => {
    el.hidden = false;
  });
  document.querySelectorAll("[data-ad-unit]").forEach((el) => {
    const unit = el.dataset.adUnit;
    if (typeof window.adsbygoogle !== "undefined") {
      el.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${unit}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      try { window.adsbygoogle.push({}); } catch (_) { renderAdPlaceholder(el); }
    } else {
      renderAdPlaceholder(el);
    }
  });
}

function toggleSavedGame(gameId, saved) {
  const key = "vv_saved";
  let list = [];
  try { list = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) { list = []; }
  if (saved && !list.includes(gameId)) list.push(gameId);
  if (!saved) list = list.filter((id) => id !== gameId);
  localStorage.setItem(key, JSON.stringify(list));
}

function initSavedGames() {
  let list = [];
  try { list = JSON.parse(localStorage.getItem("vv_saved") || "[]"); } catch (_) { list = []; }
  list.forEach((gameId) => {
    const item = document.querySelector(`.feed-item[data-game="${gameId}"]`);
    item?.querySelector('.stat-btn[data-action="star"]')?.classList.add("saved");
  });
}

function recordStreakPlay(gameId) {
  if (!gameId) return;
  const today = new Date().toISOString().slice(0, 10);
  let data = { last: today, days: 1, played: [] };
  try { data = { ...data, ...JSON.parse(localStorage.getItem("vv_streak") || "{}") }; } catch (_) {}
  if (!data.played.includes(gameId)) data.played.push(gameId);
  if (data.last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    data.days = data.last === yStr ? (data.days || 0) + 1 : 1;
    data.last = today;
    data.played = [gameId];
  }
  localStorage.setItem("vv_streak", JSON.stringify(data));
  updateStreakUI(data);
}

function initStreakUI() {
  let data = {};
  try { data = JSON.parse(localStorage.getItem("vv_streak") || "{}"); } catch (_) {}
  updateStreakUI(data);
  const shareBtn = document.getElementById("streakShareBtn");
  if (shareBtn && !shareBtn.dataset.bound) {
    shareBtn.dataset.bound = "1";
    shareBtn.addEventListener("click", () => {
      let fresh = {};
      try { fresh = JSON.parse(localStorage.getItem("vv_streak") || "{}"); } catch (_) {}
      const today = new Date().toISOString().slice(0, 10);
      const days = fresh.last === today ? (fresh.days || 1) : 0;
      if (days < 1) {
        showAppToast("Play a game today to start a streak");
        return;
      }
      shareStreakCard(days, (fresh.played || []).length);
    });
  }
}

function updateStreakUI(data) {
  const bar = document.getElementById("feedStreak");
  const daysEl = document.getElementById("streakDays");
  const hint = document.getElementById("streakHint");
  const shareBtn = document.getElementById("streakShareBtn");
  if (!bar || !daysEl) return;
  const today = new Date().toISOString().slice(0, 10);
  const days = data.last === today ? (data.days || 1) : 0;
  daysEl.textContent = String(days || 0);
  if (hint) {
    hint.textContent = days > 0
      ? `${(data.played || []).length} game${(data.played || []).length === 1 ? "" : "s"} today`
      : "Play one game today";
  }
  if (shareBtn) shareBtn.classList.toggle("hidden", days < 1);
  bar.hidden = false;
}

const LAZY_GAME_INIT = {
  leap: () => { if (!lazyInited.has("leap")) { startLeapCoverAnim(); lazyInited.add("leap"); } },
  run: () => { if (!lazyInited.has("run")) { startRunCoverAnim(); lazyInited.add("run"); } },
  face: () => { if (!lazyInited.has("face")) { startFaceCover(); lazyInited.add("face"); } },
  box: () => { if (!lazyInited.has("box")) { startBoxCover(); lazyInited.add("box"); } },
  pet: () => { if (!lazyInited.has("pet")) { switchPet(); lazyInited.add("pet"); } },
  spot: () => { if (!lazyInited.has("spot")) { switchSpot(); lazyInited.add("spot"); } },
  star: () => { if (!lazyInited.has("star")) { startStarCover(); lazyInited.add("star"); } },
};

function lazyInitGame(gameId) {
  LAZY_GAME_INIT[gameId]?.();
}

function feedLazyOnTabSwitch(tabName) {
  if (tabName === "knowledge") {
    window.vvOnLearnTabActive?.();
  } else {
    window.vvEnsureGamesChunk?.();
  }
  if (tabName === "recommend") lazyInitGame("run");
  else stopRunCoverAnim();
  document.querySelectorAll(`.feed-item[data-feed="${tabName}"]:not(.hidden)`).forEach((item) => {
    if (isElementVisibleInFeed(item)) lazyInitGame(item.dataset.game);
  });
}

function isElementVisibleInFeed(el) {
  const feed = document.getElementById("feed");
  if (!feed || !el) return false;
  const r = el.getBoundingClientRect();
  const fr = feed.getBoundingClientRect();
  return r.top < fr.bottom && r.bottom > fr.top;
}

function initFeedLazyLoad() {
  const feed = document.getElementById("feed");
  if (!feed || !("IntersectionObserver" in window)) {
    Object.keys(LAZY_GAME_INIT).forEach(lazyInitGame);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target.closest?.(".feed-item") || entry.target;
        if (item?.dataset?.game) lazyInitGame(item.dataset.game);
      });
    },
    { root: feed, rootMargin: "120px 0px", threshold: 0.15 }
  );

  document.querySelectorAll(".feed-item").forEach((item) => observer.observe(item));

  document.body.classList.add("js-ready");
  const activeTab = document.querySelector(".tab.active")?.dataset.tab || "recommend";
  feedLazyOnTabSwitch(activeTab);
}

function initFeedProgress() {
  const nav = document.getElementById("feedProgress");
  const feed = document.getElementById("feed");
  if (!nav || !feed) return;

  const rebuild = () => {
    nav.innerHTML = "";
    const tab = document.querySelector(".tab.active")?.dataset.tab || "recommend";
    const slides = [
      ...feed.querySelectorAll(
        `.feed-item[data-feed="${tab}"]:not(.hidden):not(.learn-feed-skip), .ad-in-feed[data-feed-tab="${tab}"]:not(.hidden)`,
      ),
    ];
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "feed-progress-dot" + (i === 0 ? " active" : "");
      dot.dataset.index = String(i);
      nav.appendChild(dot);
    });
    if (feedProgressObserver) feedProgressObserver.disconnect();
    if (!slides.length || !("IntersectionObserver" in window)) return;

    feedProgressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
          const idx = slides.indexOf(entry.target);
          if (idx < 0) return;
          nav.querySelectorAll(".feed-progress-dot").forEach((d, i) => {
            d.classList.toggle("active", i === idx);
          });
        });
      },
      { root: feed, threshold: [0.45, 0.6] }
    );
    slides.forEach((s) => feedProgressObserver.observe(s));
  };

  rebuild();
  window.refreshFeedProgress = rebuild;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setTimeout(rebuild, 50));
  });
}

function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab");
  if (tabParam === "knowledge") {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === "knowledge");
    });
    switchFeedTab("knowledge");
    const learn = params.get("learn");
    const learnIds = { finance: "financeHubItem", worldcup: "wcHubItem", wiki: "catWikiHubItem", space: "spaceHubItem", poetry: "poetryHubItem", vibecoding: "vibeHubItem", radar: "hotspotHubItem", hustle: "hustleHubItem", aitools: "aiToolsHubItem", mind: "mindHubItem", campus: "campusHubItem", dating: "datingHubItem", career: "careerHubItem", jobs: "careerHubItem", startup: "careerHubItem", creatorplay: "creatorPlayHubItem", gaming: "creatorPlayHubItem", creator: "creatorPlayHubItem", stocks: "stockPulseHubItem", wellness: "wellnessHubItem", climate: "climateHubItem", food: "foodHubItem" };
    const sectionKey =
      learn === "jobs" || learn === "startup"
        ? learn
        : learn === "gaming" || learn === "creator"
          ? learn
          : learn;
    const boot = () => {
      if (typeof window.scrollToLearnSection === "function") window.scrollToLearnSection(learn);
      else document.getElementById(learnIds[learn])?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const load = window.vvEnsureLearnCore?.() || Promise.resolve();
    if (sectionKey && typeof window.vvEnsureLearnSection === "function") {
      load.then(() => window.vvEnsureLearnSection(sectionKey)).then(boot);
    } else {
      load.then(boot);
    }
    return;
  }
  const cat = params.get("cat");
  if (cat && ["arcade", "puzzle", "chill", "social"].includes(cat)) {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === "games");
    });
    switchGameCategory(cat);
    return;
  }
  const game = params.get("game");
  if (!game) return;
  const item = document.querySelector(`.feed-item[data-game="${game}"]`);
  if (!item) return;
  const tab = item.dataset.feed || "recommend";
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tab);
  });
  switchFeedTab(tab);
  applyFeedVisibility();
  setTimeout(() => {
    item.scrollIntoView({ behavior: "smooth", block: "start" });
    lazyInitGame(game);
  }, 120);
}

function initCookieConsent() {
  const banner = document.getElementById("cookieBanner");
  const accept = document.getElementById("cookieAccept");
  const essential = document.getElementById("cookieEssential");
  if (!banner) return;
  let choice = null;
  try { choice = localStorage.getItem("vv_cookie_consent"); } catch (_) {}
  if (choice) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  const save = (value) => {
    try { localStorage.setItem("vv_cookie_consent", value); } catch (_) {}
    banner.hidden = true;
  };
  accept?.addEventListener("click", () => save("all"));
  essential?.addEventListener("click", () => save("essential"));
}

initFeedOptimizations();
window.addEventListener("load", () => requestAnimationFrame(hideAppLoader));
document.body.addEventListener("click", () => getAudioCtx(), { once: true });

