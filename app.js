const FORTUNE_ITEMS = [
  { text: "Try a new recipe", cat: "Create", emoji: "🍳" },
  { text: "Message someone important", cat: "Connect", emoji: "💌" },
  { text: "Sleep early tonight", cat: "Rest", emoji: "🌙" },
  { text: "Walk outside for 15 minutes", cat: "Move", emoji: "🚶" },
  { text: "Tidy your desk", cat: "Mind", emoji: "🧹" },
  { text: "Listen to a new song", cat: "Create", emoji: "🎵" },
  { text: "Write three things you're grateful for", cat: "Mind", emoji: "✨" },
  { text: "Drink a glass of water", cat: "Rest", emoji: "💧" },
  { text: "Read 10 pages", cat: "Mind", emoji: "📖" },
  { text: "Stretch for 5 minutes", cat: "Move", emoji: "🧘" },
  { text: "Photo today's sky", cat: "Create", emoji: "📷" },
  { text: "Try a new tea or coffee", cat: "Rest", emoji: "☕" },
  { text: "Phone off for 30 minutes", cat: "Rest", emoji: "📵" },
  { text: "Add flowers or a plant to your room", cat: "Create", emoji: "🌸" },
  { text: "Learn a new word", cat: "Mind", emoji: "📚" },
  { text: "Smile at the first person you meet", cat: "Kind", emoji: "😊" },
  { text: "Delete 100 photos from your camera roll", cat: "Mind", emoji: "🗂️" },
  { text: "Do one thing you've been putting off", cat: "Mind", emoji: "✅" },
  { text: "Say something kind to yourself", cat: "Kind", emoji: "💖" },
  { text: "Plan a short trip", cat: "Create", emoji: "🗺️" },
];

const EARTH_QUESTS = [
  { text: "Learn a nursery rhyme", cat: "Create", emoji: "🎵" },
  { text: "Message someone important", cat: "Connect", emoji: "💌" },
  { text: "Walk outside for 15 minutes", cat: "Move", emoji: "🚶" },
  { text: "Write three grateful things", cat: "Mind", emoji: "✨" },
  { text: "Try a new recipe", cat: "Create", emoji: "🍳" },
  { text: "Read 10 pages", cat: "Mind", emoji: "📖" },
  { text: "Smile at the first person you meet", cat: "Kind", emoji: "😊" },
  { text: "Stretch for 5 minutes", cat: "Move", emoji: "🧘" },
  { text: "Tidy your desk", cat: "Mind", emoji: "🧹" },
  { text: "Listen to a new song", cat: "Create", emoji: "🎵" },
  { text: "Photo today's sky", cat: "Create", emoji: "📷" },
  { text: "Say something kind to yourself", cat: "Kind", emoji: "💖" },
  { text: "Drink a glass of water", cat: "Rest", emoji: "💧" },
  { text: "Phone off for 30 minutes", cat: "Rest", emoji: "📵" },
  { text: "Learn a new word", cat: "Mind", emoji: "📚" },
  { text: "Do one delayed task", cat: "Mind", emoji: "✅" },
  { text: "Add flowers or a plant", cat: "Create", emoji: "🌸" },
  { text: "Plan a short trip", cat: "Create", emoji: "🗺️" },
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
let currentEarthQuest = null;
let lastCompletedEarthTask = "";

const soundState = { fortune: true, earth: true, chick: true, block: true, shop: true, leap: true, run: true, face: true, box: true, sente: true, pet: true, spot: true, mj: true, star: true, stack: true, match: true, merge: true, beat: true, hole: true, slash: true };

/* ===== DOM ===== */
const drawScene = document.getElementById("drawScene");
const resultScene = document.getElementById("resultScene");
const tubeArea = document.getElementById("tubeArea");
const tubeWrapper = document.getElementById("tubeWrapper");
const fortuneStick = document.getElementById("fortuneStick");
const fortuneText = document.getElementById("fortuneText");
const fortuneCat = document.getElementById("fortuneCat");
const fortuneNum = document.getElementById("fortuneNum");
const fortuneDateEl = document.getElementById("fortuneDate");
const fortuneReveal = document.getElementById("fortuneReveal");
const drawAgainBtn = document.getElementById("drawAgainBtn");
const fortuneShareBtn = document.getElementById("fortuneShareBtn");
const resetFortuneBtn = document.getElementById("resetFortuneBtn");
const earthHome = document.getElementById("earthHome");
const earthTask = document.getElementById("earthTask");
const earthReward = document.getElementById("earthReward");
const earthHistory = document.getElementById("earthHistory");
const earthTaskName = document.getElementById("earthTaskName");
const earthTaskCat = document.getElementById("earthTaskCat");
const earthDateEl = document.getElementById("earthDate");
const earthQuestCountEl = document.getElementById("earthQuestCount");
const earthStreakEl = document.getElementById("earthStreak");
const earthQuestReveal = document.getElementById("earthQuestReveal");
const earthRewardTask = document.getElementById("earthRewardTask");
const earthRewardCard = document.getElementById("earthRewardCard");
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
function formatFortuneDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function getRandomFortune() {
  let i;
  do { i = Math.floor(Math.random() * FORTUNE_ITEMS.length); }
  while (i === lastFortuneIndex && FORTUNE_ITEMS.length > 1);
  lastFortuneIndex = i;
  return FORTUNE_ITEMS[i];
}

function showDrawScene() {
  resultScene.classList.add("hidden");
  drawScene.classList.remove("hidden", "fade-out");
  tubeWrapper.classList.remove("shaking");
  fortuneStick.classList.remove("pop-out");
  fortuneReveal?.classList.remove("revealed");
  isDrawing = false;
}

function showResultScene(item) {
  lastFortuneText = item.text;
  if (fortuneText) fortuneText.textContent = item.text;
  if (fortuneCat) fortuneCat.textContent = `${item.emoji} ${item.cat}`;
  if (fortuneNum) fortuneNum.textContent = `#${String(lastFortuneIndex + 1).padStart(2, "0")}`;
  if (fortuneDateEl) fortuneDateEl.textContent = formatFortuneDate();
  drawScene.classList.add("fade-out");
  setTimeout(() => {
    drawScene.classList.add("hidden");
    resultScene.classList.remove("hidden");
    playRevealSound();
    requestAnimationFrame(() => fortuneReveal?.classList.add("revealed"));
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
if (fortuneDateEl) fortuneDateEl.textContent = formatFortuneDate();

/* ===== 地球Online ===== */
function formatEarthDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function getEarthStreakData() {
  try { return JSON.parse(localStorage.getItem("earth-streak") || "{}"); }
  catch { return {}; }
}

function getEarthStreakDays() {
  const data = getEarthStreakData();
  const today = new Date().toISOString().slice(0, 10);
  if (data.last === today) return data.days || 1;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.last === yesterday) return data.days || 0;
  return 0;
}

function bumpEarthStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const data = getEarthStreakData();
  if (data.last === today) return data.days || 1;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const days = data.last === yesterday ? (data.days || 0) + 1 : 1;
  localStorage.setItem("earth-streak", JSON.stringify({ last: today, days }));
  return days;
}

function updateEarthHomeStats() {
  if (earthQuestCountEl) earthQuestCountEl.textContent = String(getEarthHistory().length);
  if (earthStreakEl) earthStreakEl.textContent = String(getEarthStreakDays());
  if (earthDateEl) earthDateEl.textContent = formatEarthDate();
}

function showEarthScene(scene) {
  [earthHome, earthTask, earthReward].forEach((el) => el.classList.add("hidden"));
  scene.classList.remove("hidden");
  if (scene === earthHome) updateEarthHomeStats();
}

function getRandomEarthQuest() {
  let i;
  do { i = Math.floor(Math.random() * EARTH_QUESTS.length); }
  while (i === lastEarthTaskIndex && EARTH_QUESTS.length > 1);
  lastEarthTaskIndex = i;
  return EARTH_QUESTS[i];
}

function showEarthQuest(quest) {
  currentEarthQuest = quest;
  if (earthTaskName) earthTaskName.textContent = quest.text;
  if (earthTaskCat) earthTaskCat.textContent = `${quest.emoji} ${quest.cat}`;
  earthQuestReveal?.classList.remove("revealed");
  showEarthScene(earthTask);
  playEarthTaskSound();
  requestAnimationFrame(() => earthQuestReveal?.classList.add("revealed"));
}

const EARTH_HISTORY_MAX = 50;

function getEarthHistory() {
  try { return JSON.parse(localStorage.getItem("earthTasks") || "[]"); }
  catch { return []; }
}

function saveEarthHistory(quest) {
  const task = typeof quest === "string" ? quest : quest.text;
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
    const match = EARTH_QUESTS.find((q) => q.text === task);
    const icon = match ? match.emoji : "🌍";
    li.innerHTML = `<span class="history-task"><span class="history-icon">${icon}</span>${task}</span><span>${time}</span>`;
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
  earthRewardCard?.classList.remove("revealed");
  void earthRewardCard?.offsetWidth;
  earthRewardCard?.classList.add("revealed");
  earthRewardList.querySelectorAll("li").forEach((li) => {
    li.style.animation = "none";
    void li.offsetWidth;
    li.style.animation = "";
  });
}

earthRandomBtn.addEventListener("click", () => {
  getAudioCtx();
  if (soundState.earth && !earthBgm) startEarthBGM();
  showEarthQuest(getRandomEarthQuest());
});

earthDoneBtn.addEventListener("click", () => {
  lastCompletedEarthTask = currentEarthQuest?.text || "";
  if (currentEarthQuest) saveEarthHistory(currentEarthQuest);
  bumpEarthStreak();
  if (earthRewardTask) earthRewardTask.textContent = lastCompletedEarthTask;
  showEarthScene(earthReward);
  replayRewardAnimation();
  playEarthCompleteSound();
});

earthBackBtn.addEventListener("click", () => showEarthScene(earthHome));

earthShareBtn?.addEventListener("click", () => shareEarthQuest(lastCompletedEarthTask || currentEarthQuest?.text || ""));

earthHistoryBtn.addEventListener("click", () => {
  renderEarthHistory();
  earthHistory.classList.remove("hidden");
});

earthHistoryClose.addEventListener("click", () => earthHistory.classList.add("hidden"));
earthHistory.addEventListener("click", (e) => {
  if (e.target === earthHistory) earthHistory.classList.add("hidden");
});

updateEarthHomeStats();

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
    caption: `Scored ${lastRunScore} pts · ${lastRunDist}m on Neon Rush #NeonRush — Miniverse`,
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
  mj: "puzzle", star: "arcade", stack: "puzzle", match: "puzzle",
  merge: "puzzle", beat: "arcade", hole: "arcade", slash: "arcade",
};

const TODAY_PICKS = [
  { game: "run", label: "Neon Rush — dodge 300m+", challenge: "Reach 300m in one run" },
  { game: "chick", label: "Squishy Chick — 50 taps", challenge: "Tap the chick 50 times" },
  { game: "shop", label: "Fruit Stand — $80 revenue", challenge: "Earn $80 in one round" },
  { game: "box", label: "Flavor Box — guess 5 tastes", challenge: "Open 5 boxes today" },
  { game: "leap", label: "Lily Pad Leap — 10 combo", challenge: "Chain a 10 combo jump" },
  { game: "merge", label: "2248 Chain — link & double", challenge: "Merge up to 128 on the 5×5 grid" },
  { game: "star", label: "Starfall — score 200+", challenge: "Score 200 before a meteor hits" },
  { game: "beat", label: "Mochi Snake — score 50", challenge: "Reach 50 points in one run" },
  { game: "match", label: "Memory Match — under 20 moves", challenge: "Clear the board in ≤20 moves" },
  { game: "stack", label: "Piggy Catch — clear level 1", challenge: "Clear all river tiles on level 1" },
  { game: "face", label: "Runway Glow-Up — full slay", challenge: "Complete all glow-up rounds" },
  { game: "fortune", label: "Daily Fortune — draw & share", challenge: "Draw once and share your fortune" },
  { game: "earth", label: "Blue Planet — complete a quest", challenge: "Finish one real-world quest today" },
  { game: "spot", label: "Salt Lake — check in", challenge: "Snap and share a travel check-in" },
  { game: "block", label: "Cute Stack — score 500", challenge: "Reach 500 points in one run" },
  { game: "sente", label: "Meme lines — share a card", challenge: "Generate and share one meme line" },
  { game: "pet", label: "Office Pets — unlock 5 scenes", challenge: "Cycle through 5 pet moods" },
  { game: "mj", label: "Brain Sketch — clear a level", challenge: "Complete any Brain Sketch level" },
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
  mj: "Brain Sketch", star: "Starfall", stack: "Piggy Catch", match: "Memory Match",
  merge: "2248 Chain", beat: "Mochi Snake", hole: "Sushi Black Hole", slash: "Fruit Slash",
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
  ctx.fillText("✦ Miniverse", w / 2, h * 0.935);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText(`Made for ${platform}`, w / 2, h * 0.975);
  return c;
}

function shareFaceGlowUp(platform) {
  const canvas = buildFaceShareCanvas(platform);
  const caption = `Just slayed my Runway Glow-Up! ${SHARE_HASHTAG} — play on Miniverse`;
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
  ctx.fillText("✦ Miniverse", w / 2, h * 0.925);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "22px Inter, sans-serif";
  ctx.fillText("miniverse.gg", w / 2, h * 0.965);
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
  ctx.fillText("✦ Miniverse", w / 2, h * 0.975);
  return c;
}

function shareSpotCheckIn() {
  if (!spotScene) {
    showAppToast("Check in first to share");
    return;
  }
  captureSpotPhoto();
  const loc = spotScene.loc;
  const caption = `Checked in at ${loc} #TravelCheckIn — Miniverse`;
  shareImageFile(buildSpotShareCanvas(), {
    filename: "vibeverse-checkin.png",
    title: "Rainbow Salt Lake",
    caption,
  });
}

function shareStreakCard(days, gamesToday) {
  const body = gamesToday > 0
    ? `${days}-day vibe streak!\nPlayed ${gamesToday} game${gamesToday === 1 ? "" : "s"} today.`
    : `${days}-day vibe streak!\nKeep the vibes going on Miniverse.`;
  shareTextCard({
    title: "Vibe Streak",
    subtitle: "Daily mini game habit",
    body,
    tag: "#VibeVerse",
    accent: ["#f97316", "#ec4899"],
    filename: "vibeverse-streak.png",
    caption: `🔥 ${days}-day vibe streak on Miniverse! #VibeVerse`,
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
      caption: `Squished ${chickState.decompress} stress away on Squishy Chick #SquishyChick — Miniverse`,
    });
  });

  blockShareBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    shareScoreCard({
      gameName: "Cute Stack",
      scoreLine: `Score: ${blockScore}`,
      tag: "#CuteStack",
      filename: "vibeverse-cute-stack.png",
      caption: `Scored ${blockScore} on Cute Stack #CuteStack — Miniverse`,
    });
  });

  document.getElementById("shopShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Fresh Fruit Stand",
      scoreLine: `Earned: $${shopRoundEarn}\nOrders: ${shopOrders}\nRating: ${shopRating}%`,
      tag: "#FruitStand",
      filename: "vibeverse-fruit-stand.png",
      caption: `Made $${shopRoundEarn} in one round at Fresh Fruit Stand #FruitStand — Miniverse`,
    });
  });

  document.getElementById("leapShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Lily Pad Leap",
      scoreLine: `Score: ${leapScore}\nBest combo: ${leapBestCombo}x`,
      tag: "#LilyPadLeap",
      filename: "vibeverse-lily-pad.png",
      caption: `Scored ${leapScore} · ${leapBestCombo}x combo on Lily Pad Leap #LilyPadLeap — Miniverse`,
    });
  });

  document.getElementById("boxShareBtn")?.addEventListener("click", () => {
    const picks = boxHistory.map((f) => `${f.emoji} ${f.name}`).join("\n");
    shareScoreCard({
      gameName: "Mystery Flavor Box",
      scoreLine: picks || "Completed a flavor quest!",
      tag: "#FlavorBox",
      filename: "vibeverse-flavor-box.png",
      caption: "Completed my Mystery Flavor quest #FlavorBox — Miniverse",
    });
  });

  document.getElementById("starShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Starfall",
      scoreLine: `Score: ${starScore}`,
      tag: "#Starfall",
      filename: "vibeverse-starfall.png",
      caption: `Scored ${starScore} on Starfall #Starfall — Miniverse`,
    });
  });

  document.getElementById("stackShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Piggy Catch",
      scoreLine: fishShareWon ? `Level ${fishShareLevel} cleared · Score ${fishScore}` : `Level ${fishShareLevel} · Score ${fishScore}`,
      tag: "#PiggyCatch",
      filename: "vibeverse-piggy-catch.png",
      caption: `${fishShareWon ? "Cleared" : "Played"} level ${fishShareLevel} (score ${fishScore}) on Piggy Catch #PiggyCatch — Miniverse`,
    });
  });

  document.getElementById("matchShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Seaside Memory",
      scoreLine: `${matchShareDiff} · ${matchMoves} moves${matchTimerOn ? ` · ${matchSeconds}s` : ""}`,
      tag: "#SeasideMemory",
      filename: "vibeverse-seaside-memory.png",
      caption: `Matched all pairs in ${matchMoves} moves (${matchShareDiff}) #SeasideMemory — Miniverse`,
    });
  });

  document.getElementById("mergeShareBtn")?.addEventListener("click", () => {
    const maxTile = getMergeMaxTile();
    shareScoreCard({
      gameName: "2248 Chain",
      scoreLine: `Score: ${mergeScore}\nHighest tile: ${maxTile || 2}`,
      tag: "#NumberMerge",
      filename: "vibeverse-number-merge.png",
      caption: `Scored ${mergeScore} · tile ${maxTile || 2} on 2248 Chain #2248Chain — Miniverse`,
    });
  });

  document.getElementById("snakeShareBtn")?.addEventListener("click", () => {
    shareScoreCard({
      gameName: "Mochi Snake",
      scoreLine: `Score: ${snakeScore}\nHigh Score: ${snakeBest}`,
      tag: "#MochiSnake",
      filename: "vibeverse-mochi-snake.png",
      caption: `Scored ${snakeScore} on Mochi Snake #MochiSnake — Miniverse`,
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
    caption: `Completed today's quest: ${body} #BluePlanet — Miniverse`,
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
    caption: `My fortune today: ${body} #DailyFortune — play on Miniverse`,
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
    caption: `${body.replace(/\n/g, " ")} #MemeLines — Miniverse`,
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


/* ===== Brain Sketch — commute puzzle ===== */
const BRAIN_LEVELS = [
  { ball: { x: 0.12, y: 0.14 }, goal: { x: 0.88, y: 0.78 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.15, y: 0.18 }, goal: { x: 0.84, y: 0.76 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.1, y: 0.2 }, goal: { x: 0.9, y: 0.72 }, walls: [{ x1: 0, y1: 0.93, x2: 0.42, y2: 0.93 }, { x1: 0.58, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.2, y: 0.15 }, goal: { x: 0.78, y: 0.8 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0, y1: 0.52, x2: 0.22, y2: 0.52 }] },
  { ball: { x: 0.12, y: 0.16 }, goal: { x: 0.88, y: 0.34 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0.86, y1: 0, x2: 0.86, y2: 0.58 }] },
  { ball: { x: 0.86, y: 0.16 }, goal: { x: 0.14, y: 0.78 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.5, y: 0.12 }, goal: { x: 0.16, y: 0.78 }, walls: [{ x1: 0, y1: 0.93, x2: 0.4, y2: 0.93 }, { x1: 0.6, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.18, y: 0.22 }, goal: { x: 0.82, y: 0.65 }, walls: [{ x1: 0, y1: 0.93, x2: 0.32, y2: 0.93 }, { x1: 0.68, y1: 0.93, x2: 1, y2: 0.93 }] },
  { ball: { x: 0.28, y: 0.48 }, goal: { x: 0.78, y: 0.82 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0.12, y1: 0.58, x2: 0.48, y2: 0.58 }] },
  { ball: { x: 0.5, y: 0.14 }, goal: { x: 0.5, y: 0.86 }, walls: [{ x1: 0, y1: 0.93, x2: 0.38, y2: 0.93 }, { x1: 0.62, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0.38, y1: 0.93, x2: 0.36, y2: 0.52 }, { x1: 0.62, y1: 0.93, x2: 0.64, y2: 0.52 }] },
  { ball: { x: 0.1, y: 0.18 }, goal: { x: 0.88, y: 0.32 }, walls: [{ x1: 0, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0.86, y1: 0, x2: 0.86, y2: 0.58 }, { x1: 0.48, y1: 0.42, x2: 0.52, y2: 0.62 }] },
  { ball: { x: 0.14, y: 0.2 }, goal: { x: 0.86, y: 0.78 }, walls: [{ x1: 0, y1: 0.93, x2: 0.28, y2: 0.93 }, { x1: 0.72, y1: 0.93, x2: 1, y2: 0.93 }, { x1: 0.44, y1: 0.54, x2: 0.56, y2: 0.54 }] },
];

const brainCanvas = document.getElementById("brainCanvas");
const brainStage = document.getElementById("brainStage");
const brainCtx = brainCanvas?.getContext("2d");
const brainLanding = document.getElementById("brainLanding");
const brainPlay = document.getElementById("brainPlay");
const brainStartBtn = document.getElementById("brainStartBtn");
const brainBackBtn = document.getElementById("brainBackBtn");
const brainCoverCanvas = document.getElementById("brainCoverCanvas");
const brainCoverCtx = brainCoverCanvas?.getContext("2d");
const brainLevelDots = document.getElementById("brainLevelDots");
const brainLevelLabel = document.getElementById("brainLevelLabel");
const brainClearBtn = document.getElementById("brainClearBtn");
const brainUndoBtn = document.getElementById("brainUndoBtn");
const brainUndoN = document.getElementById("brainUndoN");
const brainGoBtn = document.getElementById("brainGoBtn");
const brainThemeBtn = document.getElementById("brainThemeBtn");
const brainInkFill = document.getElementById("brainInkFill");
const brainInkRow = document.querySelector(".brain-ink-row");
const brainHint = document.getElementById("brainHint");
const brainWinToast = document.getElementById("brainWinToast");
const brainFeed = document.getElementById("feed");
const brainCard = document.getElementById("mjCard");

const BRAIN_GRAVITY = 0.48;
const BRAIN_BALL_R = 12;
const BRAIN_RESTITUTION = 0.28;
const BRAIN_FRICTION = 0.988;
const BRAIN_LINE_W = 7;
const BRAIN_INK_BASE = 1750;
const BRAIN_HIT_W = 10;
const BRAIN_UNDO_MAX = 3;
const BRAIN_STAR_R = 14;
const BRAIN_GOAL_HIT = BRAIN_BALL_R + BRAIN_STAR_R + 6;
const BRAIN_STROKE_COLOR = "#365989";
const BRAIN_BALL_COLOR = "#f97316";

let brainLevelIdx = 0;
let brainStrokes = [];
let brainCurrentStroke = null;
let brainSimulating = false;
let brainAnimId = 0;
let brainAmbientId = 0;
let brainInkUsed = 0;
let brainActivePointer = null;
let brainBall = { x: 0, y: 0, vx: 0, vy: 0 };
let brainGoal = { x: 0, y: 0 };
let brainWalls = [];
let brainDrawSegments = [];
let brainTime = 0;
let brainUndosLeft = BRAIN_UNDO_MAX;
let brainFailStreak = 0;
let brainSettleFrames = 0;
let brainShakeT = 0;
let brainSquash = 0;
let brainStarFlash = 0;
let brainWinTimer = 0;
let brainLastCollideT = 0;
let brainSketchBound = false;
let brainCoverLoopId = 0;
let brainGameStarted = false;

function showBrainScene(el) {
  [brainLanding, brainPlay].forEach((s) => s?.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function brainIsDark() {
  return brainCard?.classList.contains("brain-dark");
}

function brainInkMax() {
  let max = BRAIN_INK_BASE;
  if (brainFailStreak >= 2) max += BRAIN_INK_BASE * 0.3;
  return max;
}

function brainPlayFx(type) {
  if (!soundState.mj) return;
  const ctx = getAudioCtx();
  const m = getMaster(ctx, 0.32);
  const t = ctx.currentTime;
  if (type === "scratch") {
    const n = ctx.createBufferSource();
    const len = ctx.sampleRate * 0.06;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.35;
    n.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.08;
    n.connect(g);
    g.connect(m);
    n.start(t);
  } else if (type === "thud") {
    playBubble(ctx, m, 120, t, 0.18);
  } else if (type === "ding") {
    playSparkle(ctx, m, t, 0.22);
  }
}

function brainStrokeLength(stroke) {
  let len = 0;
  for (let i = 1; i < stroke.length; i++) len += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
  return len;
}

function brainTotalInk() {
  return brainStrokes.reduce((sum, s) => sum + brainStrokeLength(s), 0);
}

function brainUpdateInkUI() {
  if (!brainInkFill) return;
  const max = brainInkMax();
  const left = Math.max(0, 1 - brainInkUsed / max);
  brainInkFill.style.transform = `scaleX(${left})`;
  brainInkRow?.classList.toggle("is-critical", left > 0 && left < 0.15);
  brainInkRow?.classList.toggle("is-low", left >= 0.15 && left < 0.35);
}

function brainUpdateUndoUI() {
  if (brainUndoN) brainUndoN.textContent = String(brainUndosLeft);
  if (brainUndoBtn) brainUndoBtn.disabled = brainUndosLeft <= 0 || !brainStrokes.length || brainSimulating;
}

function brainUpdateHintUI() {
  if (!brainHint) return;
  const show = !brainSimulating && !brainStrokes.length && !brainCurrentStroke;
  brainHint.classList.toggle("hidden", !show);
}

function brainShowWinToast() {
  if (!brainWinToast) return;
  brainWinToast.classList.remove("hidden");
  clearTimeout(brainWinTimer);
  brainWinTimer = setTimeout(() => {
    brainWinToast.classList.add("hidden");
    brainLoadLevel((brainLevelIdx + 1) % BRAIN_LEVELS.length);
  }, 850);
}

function brainHideWinToast() {
  brainWinToast?.classList.add("hidden");
}

function brainUpdateLevelDots() {
  if (brainLevelLabel) brainLevelLabel.textContent = `Level ${brainLevelIdx + 1} / ${BRAIN_LEVELS.length}`;
  if (!brainLevelDots) return;
  brainLevelDots.innerHTML = "";
  BRAIN_LEVELS.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "brain-level-dot" + (i === brainLevelIdx ? " is-current" : "");
    brainLevelDots.appendChild(dot);
  });
}

function brainNormSeg(seg, w, h) {
  return { x1: seg.x1 * w, y1: seg.y1 * h, x2: seg.x2 * w, y2: seg.y2 * h };
}

function brainAllSegments(w, h) {
  return brainWalls.map((s) => brainNormSeg(s, w, h)).concat(brainDrawSegments);
}

function brainPointerPos(e) {
  const rect = brainCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return { x: 0, y: 0 };
  const scaleX = brainCanvas.width / rect.width;
  const scaleY = brainCanvas.height / rect.height;
  const src = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
  return {
    x: Math.max(0, Math.min(brainCanvas.width, (src.clientX - rect.left) * scaleX)),
    y: Math.max(0, Math.min(brainCanvas.height, (src.clientY - rect.top) * scaleY)),
  };
}

function brainStrokeToSegments(stroke) {
  const segs = [];
  for (let i = 1; i < stroke.length; i++) segs.push({ x1: stroke[i - 1].x, y1: stroke[i - 1].y, x2: stroke[i].x, y2: stroke[i].y });
  return segs;
}

function brainRebuildDrawSegments() {
  brainDrawSegments = [];
  brainStrokes.forEach((s) => brainDrawSegments.push(...brainStrokeToSegments(s)));
}

function brainResetBallPos() {
  const lv = BRAIN_LEVELS[brainLevelIdx];
  const w = brainCanvas.width;
  const h = brainCanvas.height;
  brainBall = { x: lv.ball.x * w, y: lv.ball.y * h, vx: 0, vy: 0 };
}

function brainLoadLevel(idx, keepFailStreak) {
  const lv = BRAIN_LEVELS[idx % BRAIN_LEVELS.length];
  if (!lv || !brainCanvas) return;
  cancelAnimationFrame(brainAnimId);
  clearTimeout(brainWinTimer);
  brainWinTimer = 0;
  brainLevelIdx = idx % BRAIN_LEVELS.length;
  brainStrokes = [];
  brainCurrentStroke = null;
  brainSimulating = false;
  brainInkUsed = 0;
  brainDrawSegments = [];
  brainWalls = lv.walls || [];
  brainActivePointer = null;
  brainUndosLeft = BRAIN_UNDO_MAX;
  if (!keepFailStreak) brainFailStreak = 0;
  brainSettleFrames = 0;
  brainShakeT = 0;
  brainSquash = 0;
  brainStarFlash = 0;
  brainSetFeedLock(false);
  brainResetBallPos();
  brainGoal = { x: lv.goal.x * brainCanvas.width, y: lv.goal.y * brainCanvas.height };
  if (brainClearBtn) brainClearBtn.disabled = false;
  if (brainGoBtn) brainGoBtn.disabled = false;
  brainStage?.classList.remove("brain-drawing");
  brainUpdateInkUI();
  brainUpdateUndoUI();
  brainUpdateLevelDots();
  brainHideWinToast();
  brainUpdateHintUI();
  brainRender();
}

function brainClearStrokesOnly() {
  brainStrokes = [];
  brainCurrentStroke = null;
  brainDrawSegments = [];
  brainInkUsed = 0;
  brainUpdateInkUI();
  brainUpdateUndoUI();
}

function brainFailRetry() {
  cancelAnimationFrame(brainAnimId);
  brainSimulating = false;
  brainFailStreak += 1;
  brainShakeT = 12;
  brainClearStrokesOnly();
  brainResetBallPos();
  brainSettleFrames = 0;
  if (brainGoBtn) brainGoBtn.disabled = false;
  brainUpdateInkUI();
  brainPlayFx("thud");
  brainRender();
}

function brainResolveBallSegment(ball, seg) {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) return false;
  let t = ((ball.x - seg.x1) * dx + (ball.y - seg.y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = seg.x1 + t * dx;
  const cy = seg.y1 + t * dy;
  let nx = ball.x - cx;
  let ny = ball.y - cy;
  const dist = Math.hypot(nx, ny);
  const hitR = BRAIN_BALL_R + BRAIN_HIT_W * 0.35;
  if (dist >= hitR || dist < 1e-6) return false;
  nx /= dist;
  ny /= dist;
  const overlap = hitR - dist;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
  const vDot = ball.vx * nx + ball.vy * ny;
  if (vDot < 0) {
    ball.vx -= (1 + BRAIN_RESTITUTION) * vDot * nx;
    ball.vy -= (1 + BRAIN_RESTITUTION) * vDot * ny;
    if (Math.abs(vDot) > 0.6 && performance.now() - brainLastCollideT > 80) {
      brainLastCollideT = performance.now();
      brainSquash = Math.min(0.35, Math.abs(vDot) * 0.04);
      brainPlayFx("thud");
    }
  }
  return true;
}

function brainDrawCoverSparkles(ctx, cx, cy, t) {
  for (let i = 0; i < 5; i++) {
    const a = t * 1.6 + (i * Math.PI * 2) / 5;
    const r = 14 + Math.sin(t * 2.2 + i) * 5;
    ctx.fillStyle = `rgba(253,230,138,${0.35 + Math.sin(t * 3 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.2 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
}

function brainDrawCoverPencil(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#fca5a5";
  ctx.fillRect(-3.5, -20, 7, 9);
  ctx.fillStyle = "#fde68a";
  ctx.beginPath();
  ctx.moveTo(-3.5, 11);
  ctx.lineTo(0, 20);
  ctx.lineTo(3.5, 11);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#365989";
  ctx.fillRect(-3, -11, 6, 22);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(-1, -9, 1.5, 18);
  ctx.restore();
}

function brainDrawVignette(w, h) {
  const dark = brainIsDark();
  const g = brainCtx.createRadialGradient(w * 0.5, h * 0.45, w * 0.15, w * 0.5, h * 0.5, w * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, dark ? "rgba(0,0,0,0.22)" : "rgba(42,69,112,0.07)");
  brainCtx.fillStyle = g;
  brainCtx.fillRect(0, 0, w, h);
}

function brainDrawSpawnMarker(x, y, t) {
  const pulse = 0.88 + Math.sin(t * 0.004) * 0.12;
  brainCtx.save();
  brainCtx.strokeStyle = brainIsDark() ? "rgba(147,197,253,0.4)" : "rgba(54,89,137,0.25)";
  brainCtx.lineWidth = 1.5;
  brainCtx.setLineDash([5, 5]);
  brainCtx.beginPath();
  brainCtx.arc(x, y, BRAIN_BALL_R * 1.4 * pulse, 0, Math.PI * 2);
  brainCtx.stroke();
  brainCtx.setLineDash([]);
  brainCtx.restore();
}

function brainDrawIdleGuide(t) {
  if (brainSimulating || brainStrokes.length || brainCurrentStroke) return;
  const bx = brainBall.x;
  const by = brainBall.y;
  const gx = brainGoal.x;
  const gy = brainGoal.y;
  brainCtx.save();
  brainCtx.globalAlpha = 0.16 + Math.sin(t * 0.003) * 0.05;
  brainCtx.strokeStyle = brainIsDark() ? "#93c5fd" : "#64748b";
  brainCtx.lineWidth = 1.5;
  brainCtx.setLineDash([6, 9]);
  brainCtx.beginPath();
  brainCtx.moveTo(bx, by);
  brainCtx.quadraticCurveTo((bx + gx) * 0.5, (by + gy) * 0.3, gx, gy);
  brainCtx.stroke();
  brainCtx.restore();
}

function brainDrawBackground(w, h) {
  const dark = brainIsDark();
  if (dark) {
    const g = brainCtx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1a2744");
    g.addColorStop(0.55, "#152238");
    g.addColorStop(1, "#0f172a");
    brainCtx.fillStyle = g;
    brainCtx.fillRect(0, 0, w, h);
    brainCtx.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 97 + 11) % w;
      const sy = (i * 53 + 7) % (h * 0.6);
      brainCtx.beginPath();
      brainCtx.arc(sx, sy, 0.6 + (i % 3) * 0.3, 0, Math.PI * 2);
      brainCtx.fill();
    }
  } else {
    const g = brainCtx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#fffdf8");
    g.addColorStop(0.45, "#faf6ee");
    g.addColorStop(1, "#f3ece0");
    brainCtx.fillStyle = g;
    brainCtx.fillRect(0, 0, w, h);
    brainCtx.globalAlpha = 0.035;
    for (let i = 0; i < 700; i++) {
      brainCtx.fillStyle = i % 3 === 0 ? "#8b7355" : "#c4b59a";
      brainCtx.fillRect((i * 47 + 3) % w, (i * 31 + 5) % h, 1, 1);
    }
    brainCtx.globalAlpha = 1;
    brainCtx.fillStyle = "rgba(180, 160, 130, 0.14)";
    const step = 24;
    for (let x = step; x < w; x += step) {
      for (let y = step; y < h; y += step) {
        brainCtx.beginPath();
        brainCtx.arc(x, y, 0.75, 0, Math.PI * 2);
        brainCtx.fill();
      }
    }
    brainCtx.strokeStyle = "rgba(239, 68, 68, 0.12)";
    brainCtx.lineWidth = 1.5;
    brainCtx.beginPath();
    brainCtx.moveTo(28, 8);
    brainCtx.lineTo(28, h - 8);
    brainCtx.stroke();
  }
  brainCtx.strokeStyle = dark ? "rgba(148,163,184,0.15)" : "rgba(139, 115, 85, 0.18)";
  brainCtx.lineWidth = 2;
  brainCtx.strokeRect(8, 8, w - 16, h - 16);
}

function brainDrawCoverPaper(ctx, w, h, dark) {
  if (dark) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1a2744");
    g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#fffdf8");
    g.addColorStop(1, "#f3ece0");
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, 0, w, h);
  if (!dark) {
    ctx.fillStyle = "rgba(180, 160, 130, 0.12)";
    for (let x = 20; x < w; x += 22) {
      for (let y = 20; y < h; y += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function brainDrawCoverBall(ctx, x, y, r) {
  ctx.fillStyle = "rgba(15,23,42,0.1)";
  ctx.beginPath();
  ctx.ellipse(x, y + r + 3, r * 0.8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, "#fdba74");
  g.addColorStop(0.55, "#f97316");
  g.addColorStop(1, "#ea580c");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.28, y - r * 0.32, r * 0.28, r * 0.18, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function brainDrawCoverStar(ctx, cx, cy, r) {
  ctx.fillStyle = "rgba(253,230,138,0.3)";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fde68a";
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawBrainCover(now = performance.now()) {
  if (!brainCoverCtx || !brainCoverCanvas) return;
  const w = brainCoverCanvas.width;
  const h = brainCoverCanvas.height;
  const t = now / 1000;
  const dark = brainIsDark();
  brainDrawCoverPaper(brainCoverCtx, w, h, dark);
  if (!dark) {
    brainCoverCtx.strokeStyle = "rgba(239, 68, 68, 0.14)";
    brainCoverCtx.lineWidth = 1.2;
    brainCoverCtx.beginPath();
    brainCoverCtx.moveTo(26, 10);
    brainCoverCtx.lineTo(26, h - 10);
    brainCoverCtx.stroke();
  }
  const floorY = h * 0.88;
  brainCoverCtx.save();
  brainCoverCtx.lineCap = "round";
  brainCoverCtx.strokeStyle = "rgba(15,23,42,0.08)";
  brainCoverCtx.lineWidth = 12;
  brainCoverCtx.beginPath();
  brainCoverCtx.moveTo(16, floorY + 2);
  brainCoverCtx.lineTo(w - 16, floorY + 2);
  brainCoverCtx.stroke();
  brainCoverCtx.strokeStyle = dark ? "#64748b" : "#9ca8b8";
  brainCoverCtx.lineWidth = 10;
  brainCoverCtx.beginPath();
  brainCoverCtx.moveTo(16, floorY);
  brainCoverCtx.lineTo(w - 16, floorY);
  brainCoverCtx.stroke();
  brainCoverCtx.restore();
  const bx = w * 0.18;
  const by = h * 0.22 + Math.sin(t * 1.5) * 3;
  const sx = w * 0.78;
  const sy = h * 0.72;
  brainDrawCoverStar(brainCoverCtx, sx, sy, 13);
  brainDrawCoverSparkles(brainCoverCtx, sx, sy, t);
  const rampPhase = (Math.sin(t * 0.8) * 0.5 + 0.5);
  const rampLen = 0.42 + rampPhase * 0.48;
  const x2 = bx + (sx - bx) * rampLen;
  const y2 = by + (sy - by) * rampLen * 0.85 + 20;
  brainCoverCtx.save();
  brainCoverCtx.lineCap = "round";
  brainCoverCtx.strokeStyle = "rgba(54, 89, 137, 0.12)";
  brainCoverCtx.lineWidth = 9;
  brainCoverCtx.beginPath();
  brainCoverCtx.moveTo(bx + 1, by + 2);
  brainCoverCtx.lineTo(x2 + 1, y2 + 2);
  brainCoverCtx.stroke();
  brainCoverCtx.strokeStyle = dark ? "#93c5fd" : "#365989";
  brainCoverCtx.lineWidth = 7;
  brainCoverCtx.beginPath();
  brainCoverCtx.moveTo(bx, by);
  brainCoverCtx.lineTo(x2, y2);
  brainCoverCtx.stroke();
  brainCoverCtx.restore();
  const pencilAngle = Math.atan2(y2 - by, x2 - bx) + Math.PI * 0.12;
  brainDrawCoverPencil(brainCoverCtx, x2, y2, pencilAngle);
  const ballT = rampPhase;
  const ballX = bx + (x2 - bx) * ballT * 0.9;
  const ballY = by + (y2 - by) * ballT * 0.9 + ballT * ballT * 16;
  brainDrawCoverBall(brainCoverCtx, ballX, ballY, 11);
  brainDrawCoverBall(brainCoverCtx, bx, by, 11);
  const vg = brainCoverCtx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.7);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, dark ? "rgba(0,0,0,0.25)" : "rgba(42,69,112,0.08)");
  brainCoverCtx.fillStyle = vg;
  brainCoverCtx.fillRect(0, 0, w, h);
}

function startBrainCoverLoop() {
  if (brainCoverLoopId) return;
  const frame = (now) => {
    if (brainLanding?.classList.contains("hidden")) {
      brainCoverLoopId = 0;
      return;
    }
    drawBrainCover(now);
    brainCoverLoopId = requestAnimationFrame(frame);
  };
  brainCoverLoopId = requestAnimationFrame(frame);
}

function stopBrainCoverLoop() {
  if (!brainCoverLoopId) return;
  cancelAnimationFrame(brainCoverLoopId);
  brainCoverLoopId = 0;
}

function brainDrawWallSegment(seg) {
  const dark = brainIsDark();
  brainCtx.save();
  brainCtx.lineCap = "round";
  brainCtx.strokeStyle = "rgba(15,23,42,0.1)";
  brainCtx.lineWidth = 11;
  brainCtx.beginPath();
  brainCtx.moveTo(seg.x1 + 1, seg.y1 + 2);
  brainCtx.lineTo(seg.x2 + 1, seg.y2 + 2);
  brainCtx.stroke();
  const g = brainCtx.createLinearGradient(seg.x1, seg.y1, seg.x2, seg.y2);
  if (dark) {
    g.addColorStop(0, "#64748b");
    g.addColorStop(0.5, "#475569");
    g.addColorStop(1, "#64748b");
  } else {
    g.addColorStop(0, "#b8c4d4");
    g.addColorStop(0.5, "#8b9cb3");
    g.addColorStop(1, "#b8c4d4");
  }
  brainCtx.strokeStyle = g;
  brainCtx.lineWidth = 10;
  brainCtx.beginPath();
  brainCtx.moveTo(seg.x1, seg.y1);
  brainCtx.lineTo(seg.x2, seg.y2);
  brainCtx.stroke();
  brainCtx.restore();
}

function brainDrawStar(cx, cy, r, t) {
  const pulse = 0.92 + Math.sin(t * 0.002) * 0.08 + (brainStarFlash > 0 ? 0.15 : 0);
  const pr = r * pulse;
  const rot = t * 0.0008;
  brainCtx.save();
  brainCtx.translate(cx, cy);
  brainCtx.rotate(rot);
  const glow = brainCtx.createRadialGradient(0, 0, 0, 0, 0, pr * 2.2);
  glow.addColorStop(0, "rgba(253,230,138,0.45)");
  glow.addColorStop(0.5, "rgba(251,191,36,0.12)");
  glow.addColorStop(1, "rgba(251,191,36,0)");
  brainCtx.fillStyle = glow;
  brainCtx.beginPath();
  brainCtx.arc(0, 0, pr * 2.2, 0, Math.PI * 2);
  brainCtx.fill();
  brainCtx.fillStyle = "#fde68a";
  brainCtx.strokeStyle = "#f59e0b";
  brainCtx.lineWidth = 1.8;
  brainCtx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(a) * pr;
    const y = Math.sin(a) * pr;
    if (i === 0) brainCtx.moveTo(x, y);
    else brainCtx.lineTo(x, y);
  }
  brainCtx.closePath();
  brainCtx.fill();
  brainCtx.stroke();
  brainCtx.fillStyle = "rgba(255,255,255,0.55)";
  brainCtx.beginPath();
  brainCtx.arc(-pr * 0.15, -pr * 0.15, pr * 0.22, 0, Math.PI * 2);
  brainCtx.fill();
  brainCtx.restore();
}

function brainDrawBall(t) {
  let { x, y } = brainBall;
  if (brainShakeT > 0) {
    x += (Math.random() - 0.5) * brainShakeT * 0.35;
    brainShakeT -= 1;
  }
  const sy = 1 - brainSquash;
  brainSquash *= 0.82;

  brainCtx.save();
  brainCtx.fillStyle = "rgba(15,23,42,0.1)";
  brainCtx.beginPath();
  brainCtx.ellipse(x, y + BRAIN_BALL_R + 4, BRAIN_BALL_R * 0.85, 3.5, 0, 0, Math.PI * 2);
  brainCtx.fill();

  brainCtx.translate(x, y);
  brainCtx.scale(1, Math.max(0.72, sy));
  const g = brainCtx.createRadialGradient(-BRAIN_BALL_R * 0.32, -BRAIN_BALL_R * 0.38, BRAIN_BALL_R * 0.08, 0, 0, BRAIN_BALL_R);
  g.addColorStop(0, "#fdba74");
  g.addColorStop(0.5, "#f97316");
  g.addColorStop(1, "#ea580c");
  brainCtx.fillStyle = g;
  brainCtx.beginPath();
  brainCtx.arc(0, 0, BRAIN_BALL_R, 0, Math.PI * 2);
  brainCtx.fill();
  brainCtx.fillStyle = "rgba(255,255,255,0.52)";
  brainCtx.beginPath();
  brainCtx.ellipse(-3.5, -4.5, 4, 2.5, -0.35, 0, Math.PI * 2);
  brainCtx.fill();
  brainCtx.restore();
}

function brainDrawUserStroke(stroke) {
  if (stroke.length < 2) return;
  brainCtx.save();
  brainCtx.lineJoin = "round";
  brainCtx.lineCap = "round";
  brainCtx.strokeStyle = "rgba(54, 89, 137, 0.12)";
  brainCtx.lineWidth = BRAIN_LINE_W + 3;
  brainCtx.beginPath();
  brainCtx.moveTo(stroke[0].x, stroke[0].y + 1);
  for (let i = 1; i < stroke.length; i++) brainCtx.lineTo(stroke[i].x, stroke[i].y + 1);
  brainCtx.stroke();
  brainCtx.strokeStyle = brainIsDark() ? "#93c5fd" : BRAIN_STROKE_COLOR;
  brainCtx.lineWidth = BRAIN_LINE_W;
  brainCtx.beginPath();
  brainCtx.moveTo(stroke[0].x, stroke[0].y);
  for (let i = 1; i < stroke.length; i++) brainCtx.lineTo(stroke[i].x, stroke[i].y);
  brainCtx.stroke();
  brainCtx.strokeStyle = brainIsDark() ? "rgba(186, 230, 253, 0.35)" : "rgba(90, 130, 180, 0.28)";
  brainCtx.lineWidth = 2;
  brainCtx.beginPath();
  brainCtx.moveTo(stroke[0].x - 0.5, stroke[0].y - 0.5);
  for (let i = 1; i < stroke.length; i++) brainCtx.lineTo(stroke[i].x - 0.5, stroke[i].y - 0.5);
  brainCtx.stroke();
  brainCtx.restore();
}

function brainRender(now) {
  if (!brainCtx || !brainCanvas) return;
  const t = now ?? performance.now();
  brainTime = t;
  if (brainStarFlash > 0) brainStarFlash -= 1;
  const w = brainCanvas.width;
  const h = brainCanvas.height;
  brainCtx.imageSmoothingEnabled = true;
  brainDrawBackground(w, h);
  brainWalls.map((s) => brainNormSeg(s, w, h)).forEach((seg) => brainDrawWallSegment(seg));
  const allDraw = brainCurrentStroke ? [...brainStrokes, brainCurrentStroke] : brainStrokes;
  allDraw.forEach((stroke) => brainDrawUserStroke(stroke));
  if (!brainSimulating) {
    brainDrawIdleGuide(t);
    brainDrawSpawnMarker(brainBall.x, brainBall.y, t);
  }
  brainDrawStar(brainGoal.x, brainGoal.y, BRAIN_STAR_R, t);
  brainDrawBall(t);
  brainDrawVignette(w, h);
  brainUpdateHintUI();
}

function brainAmbientLoop(now) {
  if (!brainSimulating) brainRender(now);
  brainAmbientId = requestAnimationFrame(brainAmbientLoop);
}

function brainCheckWin() {
  return Math.hypot(brainBall.x - brainGoal.x, brainBall.y - brainGoal.y) < BRAIN_GOAL_HIT;
}

function brainWinLevel() {
  brainSimulating = false;
  cancelAnimationFrame(brainAnimId);
  brainStarFlash = 24;
  brainPlayFx("ding");
  brainFailStreak = 0;
  brainRender();
  brainShowWinToast();
}

function brainPhysicsStep(now) {
  if (!brainCanvas) return;
  const w = brainCanvas.width;
  const h = brainCanvas.height;
  for (let i = 0; i < 3; i++) {
    brainBall.vy += BRAIN_GRAVITY * 0.45;
    brainBall.vx *= BRAIN_FRICTION;
    brainBall.vy *= BRAIN_FRICTION;
    brainBall.x += brainBall.vx * 0.45;
    brainBall.y += brainBall.vy * 0.45;
    brainAllSegments(w, h).forEach((seg) => brainResolveBallSegment(brainBall, seg));
  }
  if (brainBall.x < BRAIN_BALL_R) { brainBall.x = BRAIN_BALL_R; brainBall.vx *= -BRAIN_RESTITUTION; }
  if (brainBall.x > w - BRAIN_BALL_R) { brainBall.x = w - BRAIN_BALL_R; brainBall.vx *= -BRAIN_RESTITUTION; }
  if (brainBall.y < BRAIN_BALL_R) { brainBall.y = BRAIN_BALL_R; brainBall.vy *= -BRAIN_RESTITUTION; }
  if (brainBall.y > h + 80) {
    brainFailRetry();
    return;
  }
  if (brainCheckWin()) {
    brainWinLevel();
    return;
  }
  const speed = Math.hypot(brainBall.vx, brainBall.vy);
  if (speed < 0.12) {
    brainSettleFrames += 1;
    if (brainSettleFrames > 60) {
      brainFailRetry();
      return;
    }
  } else brainSettleFrames = 0;
  brainRender(now);
  brainAnimId = requestAnimationFrame(brainPhysicsStep);
}

function brainStartSim() {
  if (!brainCanvas || brainSimulating) return;
  if (!brainStrokes.length) return;
  getAudioCtx();
  brainRebuildDrawSegments();
  brainSimulating = true;
  brainSettleFrames = 0;
  if (brainGoBtn) brainGoBtn.disabled = true;
  brainUpdateHintUI();
  brainResetBallPos();
  cancelAnimationFrame(brainAnimId);
  brainAnimId = requestAnimationFrame(brainPhysicsStep);
}

function brainClear() {
  cancelAnimationFrame(brainAnimId);
  brainSetFeedLock(false);
  brainActivePointer = null;
  brainStage?.classList.remove("brain-drawing");
  brainLoadLevel(brainLevelIdx);
}

function brainUndo() {
  if (brainSimulating || brainUndosLeft <= 0 || !brainStrokes.length) return;
  brainStrokes.pop();
  brainUndosLeft -= 1;
  brainInkUsed = brainTotalInk();
  brainUpdateInkUI();
  brainUpdateUndoUI();
  brainRender();
}

function brainBindTap(el, fn) {
  if (!el) return;
  el.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); fn(e); });
}

function brainSetFeedLock(locked) {
  brainFeed?.classList.toggle("brain-interacting", locked);
}

function brainStartGame() {
  stopBrainCoverLoop();
  showBrainScene(brainPlay);
  brainGameStarted = true;
  brainLoadLevel(brainLevelIdx || 0);
  if (!brainAmbientId) brainAmbientId = requestAnimationFrame(brainAmbientLoop);
}

function initBrainSketch() {
  if (!brainCanvas || !brainCtx || !brainStage) return;
  if (!brainSketchBound) {
    brainSketchBound = true;

    brainStartBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      getAudioCtx();
      brainStartGame();
    });

    brainBackBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      cancelAnimationFrame(brainAnimId);
      brainSimulating = false;
      brainSetFeedLock(false);
      showBrainScene(brainLanding);
      startBrainCoverLoop();
    });

    const target = brainCanvas;
    const peOpts = { passive: false };

    target.addEventListener("pointerdown", (e) => {
      if (brainSimulating) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (brainActivePointer != null) return;
      if (brainInkUsed >= brainInkMax()) return;
      e.preventDefault();
      e.stopPropagation();
      brainSetFeedLock(true);
      brainStage?.classList.add("brain-drawing");
      brainActivePointer = e.pointerId;
      target.setPointerCapture(e.pointerId);
      brainCurrentStroke = [brainPointerPos(e)];
      brainRender();
    }, peOpts);

    target.addEventListener("pointermove", (e) => {
      if (brainActivePointer !== e.pointerId || !brainCurrentStroke || brainSimulating) return;
      e.preventDefault();
      const p = brainPointerPos(e);
      const last = brainCurrentStroke[brainCurrentStroke.length - 1];
      const segLen = Math.hypot(p.x - last.x, p.y - last.y);
      if (segLen < 2) return;
      const max = brainInkMax();
      const inkLeft = max - brainInkUsed;
      if (segLen > inkLeft) {
        const t = inkLeft / segLen;
        brainCurrentStroke.push({ x: last.x + (p.x - last.x) * t, y: last.y + (p.y - last.y) * t });
        brainInkUsed = max;
        if (brainCurrentStroke.length >= 2) brainStrokes.push(brainCurrentStroke);
        brainCurrentStroke = null;
        brainActivePointer = null;
        brainSetFeedLock(false);
        brainStage?.classList.remove("brain-drawing");
        try { target.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
        brainInkUsed = brainTotalInk();
        brainUpdateUndoUI();
      } else {
        brainCurrentStroke.push(p);
        brainInkUsed += segLen;
        if (segLen > 4) brainPlayFx("scratch");
      }
      brainUpdateInkUI();
      brainRender();
    }, peOpts);

    const endStroke = (e) => {
      if (brainActivePointer !== e.pointerId) return;
      e.preventDefault();
      brainActivePointer = null;
      brainSetFeedLock(false);
      brainStage?.classList.remove("brain-drawing");
      try { target.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
      if (brainCurrentStroke?.length >= 2) brainStrokes.push(brainCurrentStroke);
      brainCurrentStroke = null;
      brainInkUsed = brainTotalInk();
      brainUpdateInkUI();
      brainUpdateUndoUI();
      brainRender();
    };
    target.addEventListener("pointerup", endStroke, peOpts);
    target.addEventListener("pointercancel", endStroke, peOpts);
    target.addEventListener("lostpointercapture", () => { brainActivePointer = null; brainSetFeedLock(false); });

    brainBindTap(brainClearBtn, () => brainClear());
    brainBindTap(brainUndoBtn, () => brainUndo());
    brainBindTap(brainGoBtn, () => brainStartSim());
    brainThemeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      brainCard?.classList.toggle("brain-dark");
      if (brainLanding && !brainLanding.classList.contains("hidden")) drawBrainCover();
      else brainRender();
    });

    startBrainCoverLoop();
  } else if (brainGameStarted) {
    brainRender();
  } else {
    startBrainCoverLoop();
  }
}

/* ===== Starfall · Night Sky ===== */
const STAR_BEST_KEY = "starfall-best";
const STAR_TRAILS_KEY = "starfall-trails";
const STAR_SENS_KEY = "starfall-sensitivity";

const starLanding = document.getElementById("starLanding");
const starPlay = document.getElementById("starPlay");
const starStartBtn = document.getElementById("starStartBtn");
const starBackBtn = document.getElementById("starBackBtn");
const starAgainBtn = document.getElementById("starAgainBtn");
const starCanvas = document.getElementById("starCanvas");
const starCoverCanvas = document.getElementById("starCoverCanvas");
const starCanvasWrap = document.getElementById("starCanvasWrap");
const starCtx = starCanvas?.getContext("2d");
const starCoverCtx = starCoverCanvas?.getContext("2d");
const starScoreEl = document.getElementById("starScore");
const starComboEl = document.getElementById("starCombo");
const starLivesEl = document.getElementById("starLives");
const starBestEl = document.getElementById("starBest");
const starTouchHint = document.getElementById("starTouchHint");
const starMeterFill = document.getElementById("starMeterFill");
const starDimOverlay = document.getElementById("starDimOverlay");
const starModeBadge = document.getElementById("starModeBadge");
const starTrailsToggle = document.getElementById("starTrailsToggle");
const starSensRange = document.getElementById("starSensRange");
const starOver = document.getElementById("starOver");
const starOverScore = document.getElementById("starOverScore");
const starOverBest = document.getElementById("starOverBest");

let starLoopId = 0;
let starCoverId = 0;
let starCoverOn = false;
let starActive = false;
let starPyramidX = 180;
let starPyramidVX = 0;
let starTargetX = 180;
let starPyramidGlow = 0;
let starPyramidPulse = 0;
let starItems = [];
let starParticles = [];
let starFloatTexts = [];
let starBgStars = [];
let starScore = 0;
let starCombo = 0;
let starLives = 3;
let starMeter = 0;
let starSpawn = 0;
let starFall = 1.1;
let starlightMode = false;
let starlightTimer = 0;
let starDim = 0;
let starShake = 0;
let starDragX = null;
let starFading = false;
let starFadeT = 0;
let starRainbowQueued = false;
let starWarmup = 0;
let starPlayTime = 0;
let starHighScore = parseInt(localStorage.getItem(STAR_BEST_KEY) || "0", 10);
let starTrailsOn = localStorage.getItem(STAR_TRAILS_KEY) !== "0";
let starSens = parseFloat(localStorage.getItem(STAR_SENS_KEY) || "1") || 1;
let starSlowMo = 1;

function showStarScene(el) {
  [starLanding, starPlay].forEach((s) => s.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function initStarBgStars(w, h) {
  starBgStars = Array.from({ length: 55 }, (_, i) => ({
    x: (i * 73 + 11) % w,
    y: (i * 47 + 7) % (h * 0.85),
    r: 0.6 + (i % 4) * 0.35,
    tw: Math.random() * Math.PI * 2,
    sp: 0.8 + (i % 5) * 0.2,
  }));
}

function drawStarNightSky(ctx, w, h, t, trails) {
  const nebX = 0.5 + Math.sin(t * 0.08) * 0.12;
  const nebY = 0.35 + Math.cos(t * 0.06) * 0.08;
  const grd = ctx.createRadialGradient(w * nebX, h * nebY, 20, w * 0.5, h * 0.4, w * 0.85);
  grd.addColorStop(0, "#1e293b");
  grd.addColorStop(0.45, "#0f172a");
  grd.addColorStop(1, "#020617");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  const neb2 = ctx.createRadialGradient(w * (1 - nebX), h * 0.65, 10, w * 0.7, h * 0.55, w * 0.5);
  neb2.addColorStop(0, "rgba(99,102,241,0.12)");
  neb2.addColorStop(1, "rgba(99,102,241,0)");
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, w, h);
  const neb3 = ctx.createRadialGradient(w * 0.2, h * 0.75, 10, w * 0.25, h * 0.7, w * 0.45);
  neb3.addColorStop(0, "rgba(236,72,153,0.08)");
  neb3.addColorStop(1, "rgba(236,72,153,0)");
  ctx.fillStyle = neb3;
  ctx.fillRect(0, 0, w, h);
  starBgStars.forEach((s) => {
    const a = 0.25 + Math.abs(Math.sin(t * s.sp + s.tw)) * 0.55;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (trails) {
    for (let i = 0; i < 6; i++) {
      const tx = (t * 28 + i * 97) % (w + 80) - 40;
      const ty = (i * 53 + t * 14) % (h * 0.55);
      ctx.strokeStyle = `rgba(200,220,255,${0.06 + (i % 3) * 0.03})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + 36, ty + 10);
      ctx.stroke();
    }
  }
}

function drawStarShape(ctx, x, y, r, rot = 0) {
  const spikes = 4;
  const outer = r;
  const inner = r * 0.42;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = rot + (Math.PI * i) / spikes - Math.PI / 2;
    const dist = i % 2 === 0 ? outer : inner;
    const px = x + Math.cos(rad) * dist;
    const py = y + Math.sin(rad) * dist;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawStarPyramid(ctx, x, h, glow, shake, t) {
  const shakeX = shake ? Math.sin(t * 28) * shake * 0.35 : 0;
  const px = x + shakeX;
  const pulse = 1 + Math.min(0.08, starPyramidPulse);
  const top = h - 54;
  const base = h - 10;
  const bw = 62 * pulse;
  const g = Math.min(1, glow);
  ctx.save();
  ctx.shadowColor = `rgba(253,224,71,${0.4 + g * 0.5})`;
  ctx.shadowBlur = 14 + g * 26;
  const baseGrd = ctx.createLinearGradient(px, base, px, top);
  baseGrd.addColorStop(0, `rgba(253,224,71,${0.35 + g * 0.45})`);
  baseGrd.addColorStop(1, "rgba(253,224,71,0)");
  ctx.fillStyle = baseGrd;
  ctx.fillRect(px - bw, base - 6, bw * 2, 18);
  ctx.beginPath();
  ctx.ellipse(px, base - 2, bw * 0.55, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  const stone = ctx.createLinearGradient(px - bw / 2, top, px + bw / 2, base);
  stone.addColorStop(0, "#94a3b8");
  stone.addColorStop(0.35, "#64748b");
  stone.addColorStop(1, "#475569");
  ctx.fillStyle = stone;
  ctx.beginPath();
  ctx.moveTo(px, top);
  ctx.lineTo(px - bw / 2, base);
  ctx.lineTo(px + bw / 2, base);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `rgba(226,232,240,${0.35 + g * 0.35})`;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = `rgba(253,224,71,${0.2 + g * 0.45})`;
  ctx.beginPath();
  ctx.moveTo(px, top + 10);
  ctx.lineTo(px - bw * 0.24, base - 6);
  ctx.lineTo(px + bw * 0.24, base - 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  if (g > 0.15) {
    ctx.save();
    ctx.globalAlpha = 0.12 + g * 0.18;
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, top - 4);
    ctx.lineTo(px - bw * 0.65, base + 2);
    ctx.lineTo(px + bw * 0.65, base + 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

function starHitPyramid(sx, sy, sr, px, h) {
  const top = h - 54;
  const base = h - 8;
  if (sy + sr < top - 8 || sy - sr > base + 6) return false;
  const t = Math.max(0, Math.min(1, (sy - top) / (base - top)));
  const halfW = 16 + t * 30;
  return Math.abs(sx - px) < halfW + sr;
}

function starSpawnParticle(x, y, color, n = 8) {
  for (let i = 0; i < n; i++) {
    starParticles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5 - 1.2,
      life: 1,
      color,
      r: 1.5 + Math.random() * 2.5,
    });
  }
  if (starParticles.length > 48) starParticles.splice(0, starParticles.length - 48);
}

function starMakeItem(w, type) {
  const t = type || (starlightMode && Math.random() < 0.32 ? "golden" : Math.random() < 0.14 ? "shooting" : "normal");
  return {
    x: 24 + Math.random() * (w - 48),
    y: -16,
    type: t,
    r: t === "rainbow" ? 13 : t === "golden" ? 11 : t === "shooting" ? 9 : 10,
    wobble: Math.random() * Math.PI * 2,
    vy: t === "shooting" ? 2.2 : 1.1 + Math.random() * 0.7,
    vx: t === "shooting" ? (Math.random() > 0.5 ? 1.4 : -1.4) : 0,
    trail: [],
  };
}

function starPoints(type) {
  if (type === "rainbow") return 100;
  if (type === "golden") return 25;
  if (type === "shooting") return 20;
  return 10;
}

function starMeterGain(type) {
  if (type === "rainbow") return 35;
  if (type === "golden") return 18;
  if (type === "shooting") return 14;
  return 8;
}

function starColor(type) {
  if (type === "rainbow") return "#f0abfc";
  if (type === "golden") return "#fcd34d";
  if (type === "shooting") return "#fef08a";
  return "#fde047";
}

function starAddFloatText(x, y, text, color = "#fde047") {
  starFloatTexts.push({ x, y, text, color, life: 1, vy: -1.1 });
  if (starFloatTexts.length > 12) starFloatTexts.shift();
}

function drawStarItem(ctx, it, t, h) {
  const c = starColor(it.type);
  const danger = it.y > h - 72 && it.type !== "rainbow";
  if (danger) {
    ctx.save();
    ctx.globalAlpha = 0.25 + Math.abs(Math.sin(t * 6 + it.wobble)) * 0.35;
    ctx.fillStyle = "#fca5a5";
    drawStarShape(ctx, it.x, it.y, it.r * 1.35, t * 0.5);
    ctx.fill();
    ctx.restore();
  }
  if (it.type === "shooting" && it.trail.length > 1) {
    ctx.strokeStyle = "rgba(254,240,138,0.5)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    it.trail.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }
  if (it.type === "rainbow") {
    const rg = ctx.createRadialGradient(it.x, it.y, 0, it.x, it.y, it.r * 2);
    rg.addColorStop(0, "#f0abfc");
    rg.addColorStop(0.35, "#93c5fd");
    rg.addColorStop(0.65, "#fde047");
    rg.addColorStop(1, "rgba(253,224,71,0)");
    ctx.fillStyle = rg;
    drawStarShape(ctx, it.x, it.y, it.r * 1.5, t);
    ctx.fill();
  }
  ctx.fillStyle = c;
  ctx.shadowColor = c;
  ctx.shadowBlur = it.type === "golden" ? 20 : it.type === "rainbow" ? 24 : 14;
  drawStarShape(ctx, it.x, it.y, it.r, t * (it.type === "shooting" ? 2 : 1.2) + it.wobble);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function starUpdateHud() {
  if (starScoreEl) starScoreEl.textContent = String(starScore);
  if (starComboEl) starComboEl.textContent = starCombo > 0 ? `×${starCombo}` : "×0";
  if (starLivesEl) starLivesEl.textContent = "♥".repeat(starLives) + "♡".repeat(Math.max(0, 3 - starLives));
  if (starBestEl) starBestEl.textContent = String(starHighScore);
  if (starMeterFill) starMeterFill.style.width = `${Math.min(100, starMeter)}%`;
  starModeBadge?.classList.toggle("hidden", !starlightMode);
  if (starDimOverlay) starDimOverlay.style.opacity = String(starDim);
  if (starComboEl) starComboEl.parentElement?.classList.toggle("star-combo-hot", starCombo >= 5);
}

function starTriggerStarlight() {
  starlightMode = true;
  starlightTimer = 480;
  starMeter = 0;
  starSlowMo = 0.58;
  playGameFx("star", "win");
}

function starMiss() {
  if (!starActive || starFading) return;
  starLives--;
  starCombo = 0;
  starRainbowQueued = false;
  starShake = 10;
  starDim = 0.38;
  playGameFx("star", "bad");
  starCanvasWrap?.classList.add("star-shake");
  setTimeout(() => starCanvasWrap?.classList.remove("star-shake"), 320);
  if (starLives <= 0) endStar();
}

function starCatch(it) {
  const pts = starPoints(it.type) + Math.min(starCombo, 12);
  starScore += pts;
  starCombo++;
  starPyramidGlow = Math.min(1, starPyramidGlow + 0.14);
  starPyramidPulse = 0.12;
  starMeter = Math.min(100, starMeter + starMeterGain(it.type));
  starSpawnParticle(it.x, it.y, starColor(it.type), it.type === "rainbow" ? 18 : 12);
  starAddFloatText(it.x, it.y - 8, `+${pts}`, starColor(it.type));
  playGameFx("star", it.type === "rainbow" ? "win" : "good");
  if (starCombo >= 10 && !starRainbowQueued) {
    starRainbowQueued = true;
    starItems.push(starMakeItem(starCanvas.width, "rainbow"));
    starAddFloatText(starPyramidX, starCanvas.height - 80, "Rainbow!", "#f0abfc");
  } else if (starCombo === 5) {
    starAddFloatText(starPyramidX, starCanvas.height - 70, "Nice combo!", "#fde047");
  }
  if (starMeter >= 100) starTriggerStarlight();
}

function drawStarCover() {
  if (!starCoverCtx || !starCoverCanvas) return;
  const w = starCoverCanvas.width;
  const h = starCoverCanvas.height;
  const t = performance.now() * 0.001;
  drawStarNightSky(starCoverCtx, w, h, t, true);
  drawStarPyramid(starCoverCtx, w / 2 + Math.sin(t * 1.2) * 20, h - 8, 0.5 + Math.sin(t * 2) * 0.2, 0, t);
  starCoverCtx.fillStyle = "#fde047";
  starCoverCtx.shadowColor = "#fde047";
  starCoverCtx.shadowBlur = 14;
  for (let i = 0; i < 3; i++) {
    const sx = w * (0.25 + i * 0.25) + Math.sin(t * 2 + i) * 6;
    const sy = h * 0.28 + ((t * 40 + i * 60) % (h * 0.45));
    drawStarShape(starCoverCtx, sx, sy, 8 - i * 0.5, t + i);
    starCoverCtx.fill();
  }
  starCoverCtx.shadowBlur = 0;
}

function startStarCover() {
  if (!starCoverCanvas) return;
  if (!starBgStars.length) initStarBgStars(starCoverCanvas.width, starCoverCanvas.height);
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
  const w = starCanvas?.width || 360;
  const h = starCanvas?.height || 400;
  starPyramidX = w / 2;
  starTargetX = w / 2;
  starPyramidVX = 0;
  starPyramidGlow = 0;
  starPyramidPulse = 0;
  starItems = [];
  starParticles = [];
  starFloatTexts = [];
  starScore = 0;
  starCombo = 0;
  starLives = 3;
  starMeter = 0;
  starSpawn = 0;
  starFall = 1.1;
  starlightMode = false;
  starlightTimer = 0;
  starDim = 0;
  starShake = 0;
  starFading = false;
  starFadeT = 0;
  starRainbowQueued = false;
  starWarmup = 540;
  starPlayTime = 0;
  starSlowMo = 1;
  starOver?.classList.add("hidden");
  starCanvasWrap?.classList.remove("star-fade-out");
  starTouchHint?.classList.remove("hidden");
  if (!starBgStars.length) initStarBgStars(w, h);
  starUpdateHud();
}

function endStar() {
  starActive = false;
  starFading = true;
  starFadeT = 0;
  if (starScore > starHighScore) {
    starHighScore = starScore;
    localStorage.setItem(STAR_BEST_KEY, String(starHighScore));
  }
  playGameFx("star", "bad");
}

function starShowOver() {
  if (starOverScore) starOverScore.textContent = String(starScore);
  if (starOverBest) {
    starOverBest.textContent = starScore >= starHighScore && starScore > 0
      ? "New best starlight! ✦"
      : `Best: ${starHighScore}`;
  }
  starOver?.classList.remove("hidden");
  starUpdateHud();
}

function starTick(id) {
  if ((!starActive && !starFading) || id !== starLoopId || !starCtx || !starCanvas) return;
  const w = starCanvas.width;
  const h = starCanvas.height;
  const dt = starSlowMo;
  const tDraw = performance.now() * 0.001;

  if (starFading) {
    starFadeT += 0.018;
    starDim = Math.min(0.72, starDim + 0.012);
    if (starFadeT >= 1) {
      starFading = false;
      starCanvasWrap?.classList.add("star-fade-out");
      drawStarNightSky(starCtx, w, h, tDraw, starTrailsOn);
      drawStarPyramid(starCtx, starPyramidX, h, starPyramidGlow, 0, tDraw);
      starCtx.fillStyle = `rgba(2,6,23,${0.55})`;
      starCtx.fillRect(0, 0, w, h);
      setTimeout(starShowOver, 400);
      return;
    }
  } else if (starActive) {
    starPlayTime++;
    if (starPlayTime === 180) starTouchHint?.classList.add("hidden");
    starDim = Math.max(0, starDim - 0.018);
    starShake = Math.max(0, starShake - 0.35);
    starPyramidGlow = Math.max(0, starPyramidGlow - 0.008);
    starPyramidPulse = Math.max(0, starPyramidPulse - 0.012);
    const follow = 0.18 + starSens * 0.08;
    starPyramidX += (starTargetX - starPyramidX) * follow * dt;
    starPyramidX = Math.max(36, Math.min(w - 36, starPyramidX));

    if (starlightMode) {
      starlightTimer--;
      if (starlightTimer <= 0) {
        starlightMode = false;
        starSlowMo = 1;
      }
    }

    const inWarmup = starWarmup > 0;
    if (inWarmup) starWarmup--;

    starSpawn++;
    const interval = inWarmup
      ? 72
      : starlightMode
        ? 28
        : Math.max(24, 52 - Math.min(20, starScore / 22));
    if (starSpawn > interval) {
      starSpawn = 0;
      starItems.push(starMakeItem(w, inWarmup ? "normal" : undefined));
    }

    starFall = inWarmup
      ? 0.85
      : Math.min(2.6, 1.1 + starScore * 0.0028);

    starItems.forEach((it) => {
      it.y += it.vy * starFall * dt;
      it.x += it.vx * dt;
      it.x += Math.sin(it.wobble + tDraw * 2.8) * 0.75;
      if (it.y > h - 78 && it.type !== "rainbow" && Math.abs(it.x - starPyramidX) < 52) {
        it.x += (starPyramidX - it.x) * 0.07 * dt;
      }
      if (it.type === "shooting") {
        it.trail.push({ x: it.x, y: it.y });
        if (it.trail.length > 8) it.trail.shift();
      }
    });

    const missed = [];
    const caught = [];
    starItems.forEach((it) => {
      if (it.y > h + 24) {
        missed.push(it);
        return;
      }
      if (starHitPyramid(it.x, it.y, it.r, starPyramidX, h)) caught.push(it);
    });

    for (let i = 0; i < missed.length && starActive; i++) starMiss();
    caught.forEach((it) => starCatch(it));
    starItems = starItems.filter((it) => !missed.includes(it) && !caught.includes(it));

    starParticles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 0.035;
    });
    starParticles = starParticles.filter((p) => p.life > 0);
    starFloatTexts.forEach((ft) => {
      ft.y += ft.vy * dt;
      ft.life -= 0.024;
    });
    starFloatTexts = starFloatTexts.filter((ft) => ft.life > 0);
    starUpdateHud();
  }

  drawStarNightSky(starCtx, w, h, tDraw, starTrailsOn);
  starParticles.forEach((p) => {
    starCtx.globalAlpha = p.life;
    starCtx.fillStyle = p.color;
    starCtx.beginPath();
    starCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    starCtx.fill();
  });
  starCtx.globalAlpha = 1;
  starItems.forEach((it) => drawStarItem(starCtx, it, tDraw, h));
  drawStarPyramid(starCtx, starPyramidX, h, starPyramidGlow, starShake, tDraw);
  starFloatTexts.forEach((ft) => {
    starCtx.save();
    starCtx.globalAlpha = ft.life;
    starCtx.font = "700 15px system-ui, sans-serif";
    starCtx.textAlign = "center";
    starCtx.fillStyle = ft.color;
    starCtx.shadowColor = ft.color;
    starCtx.shadowBlur = 8;
    starCtx.fillText(ft.text, ft.x, ft.y);
    starCtx.restore();
  });
  if (starDim > 0.01) {
    starCtx.fillStyle = `rgba(2,6,23,${starDim * 0.55})`;
    starCtx.fillRect(0, 0, w, h);
  }

  requestAnimationFrame(() => starTick(id));
}

function startStar() {
  resetStar();
  starActive = true;
  starLoopId++;
  starTick(starLoopId);
}

function starPointerX(clientX) {
  if (!starCanvas) return starTargetX;
  const rect = starCanvas.getBoundingClientRect();
  if (!rect.width) return starTargetX;
  return (clientX - rect.left) * (starCanvas.width / rect.width);
}

function starMove(dir) {
  if (!starActive) return;
  const push = dir === "left" ? -1 : 1;
  starTargetX = Math.max(36, Math.min((starCanvas?.width || 360) - 36, starTargetX + push * 14 * starSens));
}

function starBindControls() {
  if (starCanvasWrap?.dataset.starBound) return;
  starCanvasWrap.dataset.starBound = "1";
  starCanvasWrap.addEventListener("pointerdown", (e) => {
    if (!starActive) return;
    starDragX = e.clientX;
    starTargetX = starPointerX(e.clientX);
    starTouchHint?.classList.add("hidden");
    starCanvasWrap.setPointerCapture(e.pointerId);
  });
  starCanvasWrap.addEventListener("pointermove", (e) => {
    if (!starActive) return;
    if (starDragX != null || e.buttons) {
      starTargetX = starPointerX(e.clientX);
    }
  });
  starCanvasWrap.addEventListener("pointerup", () => { starDragX = null; });
  starCanvasWrap.addEventListener("pointercancel", () => { starDragX = null; });
}

starTrailsToggle?.addEventListener("change", (e) => {
  starTrailsOn = e.target.checked;
  localStorage.setItem(STAR_TRAILS_KEY, starTrailsOn ? "1" : "0");
});
starSensRange?.addEventListener("input", (e) => {
  starSens = parseFloat(e.target.value) || 1;
  localStorage.setItem(STAR_SENS_KEY, String(starSens));
});
if (starTrailsToggle) starTrailsToggle.checked = starTrailsOn;
if (starSensRange) starSensRange.value = String(starSens);
if (starBestEl) starBestEl.textContent = String(starHighScore);

starStartBtn?.addEventListener("click", () => {
  getAudioCtx();
  stopStarCover();
  starBindControls();
  showStarScene(starPlay);
  startStar();
});
starBackBtn?.addEventListener("click", () => {
  starActive = false;
  starFading = false;
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


/* ===== Piggy Catch — Sheep-a-Sheep river fishing ===== */
const fishLanding = document.getElementById("fishLanding");
const fishPlay = document.getElementById("fishPlay");
const fishStartBtn = document.getElementById("fishStartBtn");
const fishBackBtn = document.getElementById("fishBackBtn");
const fishAgainBtn = document.getElementById("fishAgainBtn");
const fishCanvas = document.getElementById("fishCanvas");
const fishCoverCanvas = document.getElementById("fishCoverCanvas");
const fishCtx = fishCanvas?.getContext("2d");
const fishCoverCtx = fishCoverCanvas?.getContext("2d");
const fishLevelEl = document.getElementById("fishLevel");
const fishLeftEl = document.getElementById("fishLeft");
const fishScoreEl = document.getElementById("fishScore");
const fishUndoBtn = document.getElementById("fishUndoBtn");
const fishResetBtn = document.getElementById("fishResetBtn");
const fishPlayTools = document.getElementById("fishPlayTools");
const fishOver = document.getElementById("fishOver");
const fishOverTitle = document.getElementById("fishOverTitle");
const fishOverMsg = document.getElementById("fishOverMsg");

const FISH_TYPES = [
  { id: "clown", label: "Clownfish" },
  { id: "gold", label: "Golden fish" },
  { id: "blue", label: "Blue fish" },
  { id: "puffer", label: "Puffer fish" },
  { id: "seahorse", label: "Seahorse" },
  { id: "wshell", label: "White shell" },
  { id: "sshell", label: "Striped shell" },
  { id: "pearl", label: "Pearl shell" },
];
const FISH_TRAY_MAX = 7;
const FISH_TILE = 58;
const FISH_SAVE_KEY = "piggy-catch-feed-v2";
const FISH_OUTLINE = "#374151";
const FISH_PINK = "#f9a8a8";
const FISH_PINK_DARK = "#f472b6";

let fishCoverLoopId = 0;
let fishBound = false;
let fishTiles = [];
let fishTray = [];
let fishLevel = 1;
let fishOverState = "";
let fishPickAnim = null;
let fishMatchFlash = 0;
let fishHasPicked = false;
let fishScore = 0;
let fishFly = [];
let fishSparks = [];
let fishSplashes = [];
let fishPig = { mood: "idle", tail: 0, rod: 0, rodVel: 0, shyStart: 0 };
let fishPointer = { x: 195, y: 300, active: false };
let fishUndoLeft = 1;
let fishHistory = [];
let fishPlayLoopId = 0;
let fishPlaying = false;

function fishTypesForLevel(lv) {
  return Math.min(4 + Math.floor((lv - 1) / 2), 8);
}

function fishSetsForLevel(lv) {
  return 1 + Math.floor((lv - 1) / 2);
}

function fishUpdateHud() {
  if (fishLevelEl) fishLevelEl.textContent = String(fishLevel);
  if (fishLeftEl) fishLeftEl.textContent = String(fishBoardLeft());
  if (fishScoreEl) fishScoreEl.textContent = String(fishScore);
}

function fishSaveProgress() {
  if (!fishPlaying || fishOverState) return;
  try {
    localStorage.setItem(FISH_SAVE_KEY, JSON.stringify({
      level: fishLevel, score: fishScore, tiles: fishTiles, tray: fishTray,
      undoLeft: fishUndoLeft, playing: true, over: "",
    }));
  } catch (_) { /* noop */ }
}

function showFishScene(el) {
  [fishLanding, fishPlay].forEach((s) => s?.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function fishShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fishRoundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function fishEyeLook(pigX, pigY, sc) {
  if (!fishPointer.active) return { ox: 0, oy: 0 };
  const hx = pigX;
  const hy = pigY - 26 * sc;
  const dx = fishPointer.x - hx;
  const dy = fishPointer.y - hy;
  const d = Math.hypot(dx, dy);
  if (d < 2) return { ox: 0, oy: 0 };
  const m = Math.min(2.2, d * 0.011);
  return { ox: (dx / d) * m, oy: (dy / d) * m * 0.85 };
}

function fishDrawPigFront(ctx, now, turnT, pigX, pigY, sc) {
  const rodAngle = 0.25 + Math.sin(now * 0.002) * 0.05 + fishPig.rod;
  const rodHide = turnT > 0.25 ? Math.min(1, (turnT - 0.25) / 0.35) : 0;

  ctx.fillStyle = FISH_PINK;
  fishRoundRect(ctx, -22, -34, 44, 52, 14);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-18, -34);
  ctx.lineTo(-12, -46);
  ctx.lineTo(-4, -34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(18, -34);
  ctx.lineTo(12, -46);
  ctx.lineTo(4, -34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff";
  fishRoundRect(ctx, -8, -18, 16, 11, 5);
  ctx.fill();
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.stroke();
  ctx.fillStyle = FISH_OUTLINE;
  ctx.beginPath();
  ctx.ellipse(-2, -14, 2.2, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(4, -14, 2.2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = FISH_PINK;
  ctx.beginPath();
  ctx.arc(-7, 8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-8, -24, 3.5, 0, Math.PI * 2);
  ctx.arc(8, -24, 3.5, 0, Math.PI * 2);
  ctx.fill();
  const look = fishEyeLook(pigX, pigY, sc);
  ctx.fillStyle = FISH_OUTLINE;
  ctx.beginPath();
  ctx.arc(-8 + look.ox, -24 + look.oy, 1.8, 0, Math.PI * 2);
  ctx.arc(8 + look.ox, -24 + look.oy, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(-8 + look.ox - 0.55, -24 + look.oy - 0.55, 0.45, 0, Math.PI * 2);
  ctx.arc(8 + look.ox - 0.55, -24 + look.oy - 0.55, 0.45, 0, Math.PI * 2);
  ctx.fill();

  if (rodHide < 1) {
    ctx.globalAlpha = 1 - rodHide;
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(16, -10);
    ctx.lineTo(34, -22);
    ctx.stroke();
    ctx.save();
    ctx.translate(34, -22);
    ctx.rotate(rodAngle);
    ctx.strokeStyle = FISH_OUTLINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, 18, 0, 36);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function fishDrawPigBack(ctx, now) {
  const hunch = 3 + Math.sin(now * 0.003) * 0.8;
  ctx.translate(0, hunch);

  const tailW = Math.sin(now * 0.014) * 0.3;
  ctx.save();
  ctx.translate(0, 10);
  ctx.rotate(tailW);
  ctx.strokeStyle = FISH_PINK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-10, 8, -2, 20);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = FISH_PINK;
  fishRoundRect(ctx, -22, -34, 44, 52, 14);
  ctx.fill();
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f8a0a0";
  fishRoundRect(ctx, -18, -32, 36, 28, 12);
  ctx.fill();

  ctx.fillStyle = FISH_PINK;
  ctx.beginPath();
  ctx.moveTo(-16, -34); ctx.lineTo(-22, -50); ctx.lineTo(-6, -36); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(16, -34); ctx.lineTo(22, -50); ctx.lineTo(6, -36); ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "rgba(244,114,182,0.5)";
  ctx.beginPath();
  ctx.ellipse(-14, -10, 5.5, 3.2, 0, 0, Math.PI * 2);
  ctx.ellipse(14, -10, 5.5, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(56,189,248,0.75)";
  ctx.beginPath();
  ctx.moveTo(-20, -22); ctx.lineTo(-18, -14); ctx.lineTo(-22, -16); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(22, -20); ctx.lineTo(20, -12); ctx.lineTo(24, -14); ctx.closePath(); ctx.fill();

  const bob = Math.sin(now * 0.005) * 1.2;
  ctx.fillStyle = FISH_OUTLINE;
  [[-7, -44 + bob], [0, -47 + bob], [7, -44 + bob]].forEach(([dx, dy]) => {
    ctx.beginPath(); ctx.arc(dx, dy, 1.3, 0, Math.PI * 2); ctx.fill();
  });
}

function fishDrawPig(ctx, x, y, sc, now = 0) {
  let turnT = 0;
  if (fishPig.mood === "shy") {
    if (!fishPig.shyStart) fishPig.shyStart = now;
    const raw = Math.min(1, (now - fishPig.shyStart) / 620);
    turnT = 1 - Math.pow(1 - raw, 3);
  }

  ctx.save();
  ctx.translate(x - turnT * 10, y + turnT * 2);
  ctx.scale(sc, sc);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.lineWidth = 3;

  const angle = turnT * Math.PI;
  const sx = Math.cos(angle);
  ctx.scale(sx, 1);
  if (sx >= 0) {
    fishDrawPigFront(ctx, now, turnT, x, y, sc);
  } else {
    ctx.scale(-1, 1);
    fishDrawPigBack(ctx, now);
  }
  ctx.restore();
}

function fishDrawItemIcon(ctx, type, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.lineWidth = 2.2;
  switch (type) {
    case "clown": {
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, -9);
      ctx.lineTo(-4, 9);
      ctx.moveTo(4, -9);
      ctx.lineTo(4, 9);
      ctx.stroke();
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(18, -5);
      ctx.lineTo(18, 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = FISH_OUTLINE;
      ctx.stroke();
      break;
    }
    case "gold": {
      const g = ctx.createLinearGradient(-12, -8, 12, 8);
      g.addColorStop(0, "#fde047");
      g.addColorStop(1, "#eab308");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(5, -2, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "blue": {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0ea5e9";
      ctx.beginPath();
      ctx.moveTo(-12, 2);
      ctx.lineTo(-18, 6);
      ctx.lineTo(-12, 8);
      ctx.fill();
      break;
    }
    case "puffer": {
      ctx.fillStyle = "#fcd34d";
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 10, Math.sin(a) * 10);
        ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
        ctx.stroke();
      }
      ctx.fillStyle = FISH_OUTLINE;
      ctx.beginPath();
      ctx.arc(-4, -2, 2, 0, Math.PI * 2);
      ctx.arc(4, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "seahorse": {
      ctx.strokeStyle = FISH_OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.quadraticCurveTo(10, 4, 4, -8);
      ctx.quadraticCurveTo(-2, -16, 0, -18);
      ctx.stroke();
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(0, -18, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "wshell": {
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(14, 0, 0, 12);
      ctx.quadraticCurveTo(-14, 0, 0, -12);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "sshell": {
      ctx.fillStyle = "#fda4af";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(14, 0, 0, 12);
      ctx.quadraticCurveTo(-14, 0, 0, -12);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, -8);
        ctx.lineTo(i * 0.3, 8);
        ctx.stroke();
      }
      break;
    }
    case "pearl": {
      ctx.fillStyle = "#e0e7ff";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(14, 0, 0, 12);
      ctx.quadraticCurveTo(-14, 0, 0, -12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#c4b5fd";
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function fishDrawRiverBg(ctx, w, h, t) {
  const phase = t * 0.00065;
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.42);
  sky.addColorStop(0, "#bae6fd");
  sky.addColorStop(1, "#ecfccb");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.42);
  ctx.fillStyle = "#86efac";
  ctx.fillRect(0, h * 0.38, w, h * 0.08);

  const wy0 = h * 0.44;
  const wy1 = h * 0.78;
  const waterGrad = ctx.createLinearGradient(0, wy0, 0, wy1);
  waterGrad.addColorStop(0, "#4fc3f7");
  waterGrad.addColorStop(0.45, "#29b6f6");
  waterGrad.addColorStop(1, "#0277bd");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, wy0, w, wy1 - wy0);

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#01579b";
  for (let band = 0; band < 4; band++) {
    const baseY = wy0 + 16 + band * 30;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 5) {
      ctx.lineTo(x, baseY + Math.sin(x * 0.016 + phase * 1.4 + band * 0.9) * 5);
    }
    ctx.lineTo(w, wy1);
    ctx.lineTo(0, wy1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 5; i++) {
    const y0 = wy0 + 12 + i * 24;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    for (let x = 0; x <= w; x += 4) {
      const y = y0 + Math.sin(x * 0.022 + phase * 2.2 + i * 0.6) * 2.5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, y0 + 10);
    ctx.lineTo(0, y0 + 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) {
    const y = wy0 + 8 + i * 20;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const wy = y + Math.sin(x * 0.028 + phase * 2.8 + i * 1.1) * 2;
      if (x === 0) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();
  }

  fishSplashes.forEach((s) => {
    ctx.strokeStyle = `rgba(255,255,255,${s.life * 0.55})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r + (1 - s.life) * 8, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.fillStyle = "#fde68a";
  ctx.fillRect(0, h * 0.78, w, h * 0.22);
  fishDrawPig(ctx, 72, h * 0.86, 1.05, t);
}

function fishDrawTile(ctx, tile, alpha = 1, scale = 1) {
  const cx = tile.x + FISH_TILE / 2;
  const cy = tile.y + FISH_TILE / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  fishRoundRect(ctx, tile.x, tile.y, FISH_TILE, FISH_TILE, 10);
  ctx.fill();
  ctx.strokeStyle = tile.blocked ? "rgba(148,163,184,0.5)" : FISH_OUTLINE;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  fishDrawItemIcon(ctx, tile.type, cx, cy, tile.blocked ? 0.72 : 0.88);
  if (tile.blocked) {
    ctx.fillStyle = "rgba(148,163,184,0.28)";
    fishRoundRect(ctx, tile.x, tile.y, FISH_TILE, FISH_TILE, 10);
    ctx.fill();
  }
  ctx.restore();
}

function fishDrawTray(ctx, w, h) {
  const trayY = h - 56;
  const slotW = 42;
  const gap = 4;
  const totalW = FISH_TRAY_MAX * slotW + (FISH_TRAY_MAX - 1) * gap;
  const startX = (w - totalW) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  fishRoundRect(ctx, startX - 8, trayY - 8, totalW + 16, slotW + 16, 14);
  ctx.fill();
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < FISH_TRAY_MAX; i++) {
    const sx = startX + i * (slotW + gap);
    ctx.fillStyle = fishTray[i] ? "#fff" : "rgba(255,255,255,0.35)";
    fishRoundRect(ctx, sx, trayY, slotW, slotW, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(55,65,81,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (fishTray[i]) fishDrawItemIcon(ctx, fishTray[i], sx + slotW / 2, trayY + slotW / 2, 0.78);
  }
  if (fishMatchFlash > 0) {
    ctx.fillStyle = `rgba(253,224,71,${fishMatchFlash * 0.35})`;
    fishRoundRect(ctx, startX - 8, trayY - 8, totalW + 16, slotW + 16, 14);
    ctx.fill();
    fishMatchFlash -= 0.08;
  }
}

function fishLayoutPositions(n) {
  const spots = [];
  const layers = [
    { layer: 0, cols: 4, rows: 3, ox: 22, oy: 158, step: 56 },
    { layer: 1, cols: 3, rows: 3, ox: 50, oy: 128, step: 56 },
    { layer: 2, cols: 3, rows: 2, ox: 50, oy: 98, step: 56 },
    { layer: 3, cols: 2, rows: 2, ox: 78, oy: 72, step: 56 },
  ];
  let idx = 0;
  layers.forEach((cfg) => {
    for (let r = 0; r < cfg.rows && idx < n; r++) {
      for (let c = 0; c < cfg.cols && idx < n; c++) {
        spots.push({ x: cfg.ox + c * cfg.step, y: cfg.oy + r * cfg.step, layer: cfg.layer });
        idx++;
      }
    }
  });
  return spots.slice(0, n);
}

function fishTilesOverlap(a, b) {
  const pad = 4;
  return a.x + pad < b.x + FISH_TILE - pad
    && a.x + FISH_TILE - pad > b.x + pad
    && a.y + pad < b.y + FISH_TILE - pad
    && a.y + FISH_TILE - pad > b.y + pad;
}

function fishUpdateBlocked() {
  fishTiles.forEach((t) => {
    if (t.removed) { t.blocked = false; return; }
    t.blocked = fishTiles.some((o) => !o.removed && o.layer > t.layer && fishTilesOverlap(t, o));
  });
}

function fishBuildLevel(lv) {
  const nTypes = fishTypesForLevel(lv);
  const sets = fishSetsForLevel(lv);
  const types = [];
  for (let s = 0; s < sets; s++)
    for (let i = 0; i < nTypes; i++)
      types.push(FISH_TYPES[i].id, FISH_TYPES[i].id, FISH_TYPES[i].id);
  fishShuffle(types);
  const spots = fishLayoutPositions(types.length);
  fishTiles = types.map((type, i) => ({
    id: i, type, x: spots[i].x, y: spots[i].y, layer: spots[i].layer,
    removed: false, blocked: false,
  }));
  fishTray = [];
  fishFly = [];
  fishUndoLeft = 1;
  fishHistory = [];
  if (fishUndoBtn) fishUndoBtn.disabled = true;
  fishUpdateBlocked();
  fishUpdateHud();
}

function fishBoardLeft() {
  return fishTiles.filter((t) => !t.removed).length;
}

function fishResolveTrayMatches() {
  let matched = false;
  FISH_TYPES.forEach((ft) => {
    const idxs = [];
    fishTray.forEach((t, i) => { if (t === ft.id) idxs.push(i); });
    while (idxs.length >= 3) {
      matched = true;
      const remove = idxs.splice(0, 3);
      remove.sort((a, b) => b - a).forEach((i) => fishTray.splice(i, 1));
    }
  });
  if (matched) {
    fishMatchFlash = 1;
    fishScore += 50;
    fishPig.mood = "happy";
    fishPig.tail = 1;
    playGameFx("stack", "good");
  }
  return matched;
}

function fishAddToTray(type) {
  let insert = fishTray.length;
  for (let i = fishTray.length - 1; i >= 0; i--) {
    if (fishTray[i] === type) { insert = i + 1; break; }
  }
  fishTray.splice(insert, 0, type);
  playGameFx("stack", "tap");
  fishResolveTrayMatches();
  if (fishTray.length >= FISH_TRAY_MAX) {
    fishEndGame(false);
    return;
  }
  if (fishBoardLeft() === 0) {
    fishEndGame(true);
  }
}

function fishPickTile(tile) {
  if (tile.removed || tile.blocked || fishOverState) return;
  fishHistory.push(fishSnapshot());
  if (fishUndoBtn) fishUndoBtn.disabled = false;
  fishHasPicked = true;
  tile.removed = true;
  fishScore += 10;
  fishUpdateBlocked();
  fishAddToTray(tile.type);
  fishUpdateHud();
  fishSaveProgress();
}

function fishCanvasPoint(e) {
  const rect = fishCanvas.getBoundingClientRect();
  const scaleX = fishCanvas.width / rect.width;
  const scaleY = fishCanvas.height / rect.height;
  const src = e.changedTouches?.[0] ?? e.touches?.[0] ?? e;
  return {
    x: (src.clientX - rect.left) * scaleX,
    y: (src.clientY - rect.top) * scaleY,
  };
}

function fishHitTile(x, y) {
  const candidates = fishTiles
    .filter((t) => !t.removed && !t.blocked)
    .filter((t) => x >= t.x && x <= t.x + FISH_TILE && y >= t.y && y <= t.y + FISH_TILE)
    .sort((a, b) => b.layer - a.layer);
  return candidates[0] ?? null;
}

function fishDrawShyCaption(ctx, w, h, now) {
  if (fishOverState !== "lose" || !fishPig.shyStart) return;
  const t = Math.min(1, (now - fishPig.shyStart) / 620);
  if (t < 0.7) return;
  const alpha = Math.min(1, (t - 0.7) / 0.25);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  fishRoundRect(ctx, 108, h * 0.775, 128, 30, 12);
  ctx.fill();
  ctx.strokeStyle = FISH_OUTLINE;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(108, h * 0.805);
  ctx.lineTo(98, h * 0.82);
  ctx.lineTo(108, h * 0.815);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = FISH_OUTLINE;
  ctx.font = "600 11px system-ui,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("So embarrassed…", 172, h * 0.795);
  ctx.restore();
}

function fishRender(now = performance.now()) {
  if (!fishCtx || !fishCanvas) return;
  const w = fishCanvas.width;
  const h = fishCanvas.height;
  fishDrawRiverBg(fishCtx, w, h, now);
  [...fishTiles].sort((a, b) => a.layer - b.layer).forEach((t) => {
    if (!t.removed) fishDrawTile(fishCtx, t);
  });
  fishDrawTray(fishCtx, w, h);
  if (!fishHasPicked && !fishOverState) {
    fishCtx.fillStyle = "rgba(55,65,81,0.75)";
    fishCtx.font = "600 11px system-ui,sans-serif";
    fishCtx.textAlign = "center";
    fishCtx.fillText("Tap uncovered fish or shells", w / 2, h * 0.52);
  }
  fishDrawShyCaption(fishCtx, w, h, now);
}

let fishOverTimer = 0;

function fishSetPlayTools(mode) {
  if (!fishPlayTools) return;
  if (mode === "hidden") {
    fishPlayTools.classList.add("hidden");
    return;
  }
  fishPlayTools.classList.remove("hidden");
  if (fishUndoBtn) fishUndoBtn.style.display = mode === "play" ? "" : "none";
  if (fishResetBtn) fishResetBtn.style.display = mode === "play" ? "" : "none";
  if (fishBackBtn) fishBackBtn.style.display = "";
}

function fishHideOver() {
  if (fishOverTimer) {
    clearTimeout(fishOverTimer);
    fishOverTimer = 0;
  }
  fishOver?.classList.add("hidden");
  fishSetPlayTools("play");
}

function fishShowOver(won) {
  fishHideOver();
  if (fishOverTitle) fishOverTitle.textContent = won ? "River cleared!" : "Slots full!";
  const showPanel = () => {
    if (fishOverMsg) {
      fishOverMsg.textContent = won
        ? `Level ${fishLevel} done · Score ${fishScore}`
        : `${fishBoardLeft()} left · Score ${fishScore}. The pig turned away shyly…`;
    }
    fishOver?.classList.remove("hidden");
    fishSetPlayTools("over");
    fishOverTimer = 0;
  };
  if (won) showPanel();
  else fishOverTimer = setTimeout(showPanel, 700);
}

function fishEndGame(won) {
  fishOverState = won ? "win" : "lose";
  fishPlaying = false;
  if (won) {
    fishPig.mood = "happy";
    fishPig.shyStart = 0;
  } else {
    fishPig.mood = "shy";
    fishPig.shyStart = performance.now();
  }
  fishShareLevel = fishLevel;
  fishShareWon = won;
  try { localStorage.removeItem(FISH_SAVE_KEY); } catch (_) {}
  fishShowOver(won);
  playGameFx("stack", won ? "good" : "bad");
  startFishPlayLoop();
}

function fishResetLevel() {
  fishHideOver();
  fishOverState = "";
  fishPlaying = true;
  fishPig.mood = "idle";
  fishPig.shyStart = 0;
  fishPig.rod = 0;
  fishPig.rodVel = 0;
  fishUndoLeft = 1;
  fishHistory = [];
  if (fishUndoBtn) fishUndoBtn.disabled = true;
  fishFly = [];
  fishSparks = [];
  fishMatchFlash = 0;
  fishHasPicked = false;
  fishBuildLevel(fishLevel);
  fishUpdateHud();
  fishSaveProgress();
  startFishPlayLoop();
}

function fishStartLevel(lv) {
  fishLevel = lv;
  fishOverState = "";
  fishHasPicked = false;
  fishPig.mood = "idle";
  fishPig.shyStart = 0;
  fishHideOver();
  fishBuildLevel(fishLevel);
  fishPlaying = true;
  fishRender();
  startFishPlayLoop();
}

function startFishPlayLoop() {
  if (fishPlayLoopId) cancelAnimationFrame(fishPlayLoopId);
  const tick = (now) => {
    if (fishPlay?.classList.contains("hidden")) {
      fishPlayLoopId = 0;
      return;
    }
    fishRender(now);
    fishPlayLoopId = requestAnimationFrame(tick);
  };
  fishPlayLoopId = requestAnimationFrame(tick);
}

function fishSnapshot() {
  return {
    tiles: fishTiles.map((t) => ({ ...t })),
    tray: [...fishTray],
    score: fishScore,
    undoLeft: fishUndoLeft,
  };
}

function fishUndo() {
  if (fishUndoLeft <= 0 || !fishHistory.length || fishOverState) return;
  const snap = fishHistory.pop();
  fishTiles = snap.tiles.map((t) => ({ ...t }));
  fishTray = [...snap.tray];
  fishScore = snap.score;
  fishUndoLeft = 0;
  if (fishUndoBtn) fishUndoBtn.disabled = true;
  fishFly = [];
  fishUpdateBlocked();
  fishUpdateHud();
  fishSaveProgress();
}

function fishStartGame() {
  getAudioCtx();
  fishScore = 0;
  fishStartLevel(1);
}

function drawFishCover(now = performance.now()) {
  if (!fishCoverCtx || !fishCoverCanvas) return;
  const w = fishCoverCanvas.width;
  const h = fishCoverCanvas.height;
  const t = now;
  fishDrawRiverBg(fishCoverCtx, w, h, t);
  const demo = ["clown", "gold", "blue", "wshell", "puffer", "pearl"];
  demo.forEach((type, i) => {
    const tx = 40 + (i % 3) * 52 + Math.sin(t * 0.001 + i) * 4;
    const ty = 100 + Math.floor(i / 3) * 48;
    fishCoverCtx.fillStyle = "rgba(255,255,255,0.9)";
    fishRoundRect(fishCoverCtx, tx, ty, 44, 44, 10);
    fishCoverCtx.fill();
    fishCoverCtx.strokeStyle = FISH_OUTLINE;
    fishCoverCtx.lineWidth = 2;
    fishCoverCtx.stroke();
    fishDrawItemIcon(fishCoverCtx, type, tx + 22, ty + 22, 0.85);
  });
}

function startFishCoverLoop() {
  if (fishCoverLoopId) return;
  const frame = (now) => {
    if (fishLanding?.classList.contains("hidden")) {
      fishCoverLoopId = 0;
      return;
    }
    drawFishCover(now);
    fishCoverLoopId = requestAnimationFrame(frame);
  };
  fishCoverLoopId = requestAnimationFrame(frame);
}

function stopFishCoverLoop() {
  if (!fishCoverLoopId) return;
  cancelAnimationFrame(fishCoverLoopId);
  fishCoverLoopId = 0;
}

function fishTrackPointer(e, canvas) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const src = e.touches?.[0] ?? e;
  fishPointer.x = (src.clientX - rect.left) * scaleX;
  fishPointer.y = (src.clientY - rect.top) * scaleY;
  fishPointer.active = true;
}

function initPiggyCatch() {
  if (!fishCanvas || !fishCtx) return;
  if (!fishBound) {
    fishBound = true;
    fishStartBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      stopFishCoverLoop();
      showFishScene(fishPlay);
      fishStartGame();
    });
    fishBackBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      fishPlaying = false;
      fishHideOver();
      showFishScene(fishLanding);
      startFishCoverLoop();
    });
    fishAgainBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (fishOverState === "win") fishStartLevel(fishLevel + 1);
      else fishResetLevel();
    });
    fishResetBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      fishResetLevel();
    });
    fishUndoBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      fishUndo();
    });
    fishCanvas.addEventListener("click", (e) => {
      e.stopPropagation();
      if (fishOverState) return;
      fishTrackPointer(e, fishCanvas);
      const p = fishCanvasPoint(e);
      if (p.y > fishCanvas.height - 70) return;
      const tile = fishHitTile(p.x, p.y);
      if (tile) {
        fishPickTile(tile);
        fishRender();
      }
    });
    fishCanvas.addEventListener("mousemove", (e) => {
      fishTrackPointer(e, fishCanvas);
    });
    fishCanvas.addEventListener("mouseleave", () => { fishPointer.active = false; });
    fishCanvas.addEventListener("touchmove", (e) => {
      fishTrackPointer(e, fishCanvas);
    }, { passive: true });
    fishCoverCanvas?.addEventListener("mousemove", (e) => {
      fishTrackPointer(e, fishCoverCanvas);
    });
    fishCoverCanvas?.addEventListener("mouseleave", () => { fishPointer.active = false; });
    fishCoverCanvas?.addEventListener("touchmove", (e) => {
      fishTrackPointer(e, fishCoverCanvas);
    }, { passive: true });
    startFishCoverLoop();
  } else if (fishLanding && !fishLanding.classList.contains("hidden")) {
    startFishCoverLoop();
  }
}

let fishShareLevel = 1;
let fishShareWon = false;

/* ===== Seaside Memory Match ===== */
const MATCH_ICONS = ["🐚", "⭐", "🐟", "🦀", "🐙", "🌊", "🦐", "🐠"];
const MATCH_DIFF = {
  easy: { cols: 3, pairs: 3, colsClass: "cols-3" },
  medium: { cols: 4, pairs: 6, colsClass: "cols-4" },
  hard: { cols: 4, pairs: 8, colsClass: "cols-4" },
};
const MATCH_BEST_PREFIX = "seaside-memory-best-";
const MATCH_DIFF_KEY = "seaside-memory-diff";
const MATCH_TIMER_KEY = "seaside-memory-timer";
const MATCH_MASCOT_TYPES = ["pink", "brown", "galaxy"];

function matchMascotSvg(type, uid) {
  const u = uid || type;
  const ink = "#3a4550";
  const sw = 1.7;
  const limbs = `
    <path d="M22 68 L14 58" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M78 68 L86 58" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M38 104 L34 114" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M62 104 L68 112" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>`;
  const eye = (cx, cy, iris) => {
    let irisEl = "";
    if (iris) {
      irisEl = iris.ring
        ? `<circle class="mascot-iris" r="${iris.r}" fill="none" stroke="${iris.fill}" stroke-width="1.6"/>`
        : `<circle class="mascot-iris" r="${iris.r}" fill="${iris.fill}"/>`;
    }
    return `<g transform="translate(${cx},${cy})"><g class="mascot-eye"><g class="mascot-eye-blink"><circle r="10.2" fill="#fff" stroke="${ink}" stroke-width="${sw}"/><g class="mascot-eye-move">${irisEl}<circle class="mascot-pupil" r="2.3" fill="#1a1a1a"/></g></g></g></g>`;
  };

  const bodies = {
    pink: `
      <defs>
        <linearGradient id="pk-${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffcce0"/><stop offset="100%" stop-color="#f0a8c4"/></linearGradient>
      </defs>
      <ellipse cx="50" cy="62" rx="33" ry="40" fill="url(#pk-${u})" stroke="${ink}" stroke-width="${sw}"/>
      <path d="M26 46 Q38 40 48 52 M30 58 Q44 52 54 62 M28 70 Q42 64 54 74 M36 38 Q50 34 60 42" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <ellipse cx="28" cy="66" rx="6" ry="4" fill="#ffb8c8" opacity="0.4"/><ellipse cx="72" cy="66" rx="6" ry="4" fill="#ffb8c8" opacity="0.4"/>
      <path d="M32 40 Q36 37 40 40" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M60 40 Q64 37 68 40" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M24 50 L21 46 M24 52 L19 52" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/>
      <path d="M76 50 L79 46 M76 52 L81 52" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/>
      <path d="M44 78 Q50 84 56 78 L56 81 Q50 86 44 81 Z" fill="#c97888"/>
      ${eye(36, 52, { r: 4.2, fill: "#7ec8e8" })}${eye(64, 52, { r: 4.2, fill: "#7ec8e8" })}`,
    brown: `
      <defs>
        <linearGradient id="br-${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#edd5bc"/><stop offset="100%" stop-color="#c9a882"/></linearGradient>
      </defs>
      <ellipse cx="50" cy="62" rx="34" ry="41" fill="url(#br-${u})" stroke="${ink}" stroke-width="${sw}"/>
      <ellipse cx="50" cy="58" rx="28" ry="8" fill="#b8956a" opacity="0.12"/>
      <circle cx="46" cy="70" r="1.1" fill="#9a7858" opacity="0.45"/><circle cx="52" cy="71" r="0.9" fill="#9a7858" opacity="0.4"/><circle cx="49" cy="68" r="0.8" fill="#9a7858" opacity="0.35"/>
      <path d="M34 42 Q38 39 42 42" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M58 42 Q62 39 66 42" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M42 79 Q50 85 58 79 Z" fill="#8b5a5a"/>
      <ellipse cx="50" cy="82" rx="4" ry="2.2" fill="#e8b4bc" opacity="0.85"/>
      ${eye(35, 54, { r: 4.8, fill: "#7bc96a", ring: true })}${eye(65, 54, { r: 4.8, fill: "#7bc96a", ring: true })}`,
    galaxy: `
      <defs>
        <radialGradient id="gal-${u}" cx="42%" cy="35%"><stop offset="0%" stop-color="#fef08a"/><stop offset="35%" stop-color="#bbf7d0"/><stop offset="65%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#c4b5fd"/></radialGradient>
      </defs>
      <ellipse cx="50" cy="62" rx="33" ry="40" fill="url(#gal-${u})" stroke="${ink}" stroke-width="${sw}"/>
      <circle cx="30" cy="50" r="1" fill="#fff" opacity="0.55"/><circle cx="68" cy="72" r="0.8" fill="#fff" opacity="0.5"/><circle cx="55" cy="44" r="0.7" fill="#fff" opacity="0.45"/>
      <path d="M38 44 L62 44" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" opacity="0.85"/>
      <path d="M38 78 Q50 88 62 78 Z" fill="#7a4545"/>
      <ellipse cx="50" cy="83" rx="5" ry="2.5" fill="#d4a0a8" opacity="0.8"/>
      ${eye(37, 52, null)}${eye(63, 52, null)}`,
  };

  return `<svg class="mascot-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bodies[type] || bodies.pink}${limbs}</svg>`;
}

function matchMascotHtml(type, uid) {
  return `<div class="mascot mascot-live" data-eye-track data-mascot="${type}"><div class="mascot-idle-wrap"><div class="mascot-stage"><div class="mascot-body">${matchMascotSvg(type, uid)}</div></div></div></div>`;
}

function matchHeroRowsHtml() {
  return MATCH_MASCOT_TYPES.map((t, i) =>
    `<div class="match-mascot-slot" style="--slot-i:${i}">${matchMascotHtml(t, `hero-${t}`)}</div>`
  ).join("");
}

let matchEyeBound = false;
let matchBlinkTimer = null;

function matchBindEyes() {
  if (matchEyeBound) return;
  matchEyeBound = true;
  const move = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x == null) return;
    document.querySelectorAll(".mascot-live[data-eye-track]").forEach((mascot) => {
      const stage = mascot.querySelector(".mascot-stage");
      if (!stage) return;
      const sr = stage.getBoundingClientRect();
      const scx = sr.left + sr.width / 2;
      const headTilt = Math.max(-5, Math.min(5, ((x - scx) / Math.max(sr.width, 1)) * 10));
      stage.style.setProperty("--head-tilt", `${headTilt}deg`);
      mascot.querySelectorAll(".mascot-eye").forEach((eye) => {
        const er = eye.getBoundingClientRect();
        const ecx = er.left + er.width / 2;
        const ecy = er.top + er.height / 2;
        const dx = x - ecx;
        const dy = y - ecy;
        const dist = Math.hypot(dx, dy) || 1;
        const max = er.width * 0.26;
        const tx = (dx / dist) * max;
        const ty = (dy / dist) * max;
        eye.querySelectorAll(".mascot-pupil, .mascot-iris").forEach((part) => {
          part.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      });
    });
  };
  document.addEventListener("mousemove", move, { passive: true });
  document.addEventListener("touchmove", move, { passive: true });
}

function matchStartBlink() {
  if (matchBlinkTimer) return;
  const tick = () => {
    document.querySelectorAll(".mascot-live[data-eye-track]").forEach((m) => {
      if (Math.random() > 0.55) return;
      m.classList.add("mascot-blink");
      setTimeout(() => m.classList.remove("mascot-blink"), 160);
    });
  };
  matchBlinkTimer = setInterval(tick, 3400);
  setTimeout(tick, 1200);
}

function matchMascotReact(mascot, cls, ms = 560) {
  if (!mascot) return;
  mascot.classList.remove("mascot-flip-happy", "mascot-pair-win", "mascot-hi-left", "mascot-hi-right");
  void mascot.offsetWidth;
  mascot.classList.add(cls);
  setTimeout(() => mascot.classList.remove(cls), ms);
}

function matchFlipHappy(btn) {
  matchMascotReact(btn.querySelector(".mascot-live"), "mascot-flip-happy", 520);
}

function matchPairCelebrate(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  const aCx = ra.left + ra.width / 2;
  const bCx = rb.left + rb.width / 2;
  const ma = a.querySelector(".mascot-live");
  const mb = b.querySelector(".mascot-live");
  if (ma) {
    ma.style.setProperty("--pair-dir", aCx < bCx ? "-1" : "1");
    matchMascotReact(ma, aCx < bCx ? "mascot-hi-left" : "mascot-hi-right", 620);
    setTimeout(() => matchMascotReact(ma, "mascot-pair-win", 640), 80);
  }
  if (mb) {
    mb.style.setProperty("--pair-dir", bCx < aCx ? "-1" : "1");
    matchMascotReact(mb, bCx < aCx ? "mascot-hi-left" : "mascot-hi-right", 620);
    setTimeout(() => matchMascotReact(mb, "mascot-pair-win", 640), 80);
  }
}

function matchRippleBtn(btn, e) {
  if (!btn) return;
  const ripple = document.createElement("span");
  ripple.className = "btn-ripple";
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${(e?.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
  ripple.style.top = `${(e?.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 560);
}

function matchRenderHero() {
  const host = document.getElementById("matchMascotRows");
  if (host) host.innerHTML = matchHeroRowsHtml();
}

function matchInitCover() {
  matchRenderHero();
  matchBindEyes();
  matchStartBlink();
}

const matchLanding = document.getElementById("matchLanding");
const matchPlay = document.getElementById("matchPlay");
const matchStartBtn = document.getElementById("matchStartBtn");
const matchBackBtn = document.getElementById("matchBackBtn");
const matchAgainBtn = document.getElementById("matchAgainBtn");
const matchRestartBtn = document.getElementById("matchRestartBtn");
const matchShuffleBtn = document.getElementById("matchShuffleBtn");
const matchMuteBtn = document.getElementById("matchMuteBtn");
const matchTimerToggle = document.getElementById("matchTimerToggle");
const matchGrid = document.getElementById("matchGrid");
const matchMovesEl = document.getElementById("matchMoves");
const matchPairsEl = document.getElementById("matchPairs");
const matchBestEl = document.getElementById("matchBest");
const matchTimeEl = document.getElementById("matchTime");
const matchTimePill = document.getElementById("matchTimePill");
const matchWin = document.getElementById("matchWin");
const matchWinMoves = document.getElementById("matchWinMoves");
const matchWinTime = document.getElementById("matchWinTime");
const matchWinBest = document.getElementById("matchWinBest");

let matchOpen = [];
let matchLocked = false;
let matchMoves = 0;
let matchFound = 0;
let matchTotalPairs = 6;
let matchTimer = null;
let matchSeconds = 0;
let matchDiff = localStorage.getItem(MATCH_DIFF_KEY) || "medium";
let matchTimerOn = localStorage.getItem(MATCH_TIMER_KEY) === "1";
let matchBound = false;
let matchShareDiff = "medium";

function showMatchScene(el) {
  [matchLanding, matchPlay].forEach((s) => s.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function matchCfg() {
  return MATCH_DIFF[matchDiff] || MATCH_DIFF.medium;
}

function matchBestForDiff(d = matchDiff) {
  const v = parseInt(localStorage.getItem(MATCH_BEST_PREFIX + d) || localStorage.getItem(`matchBest-${d}`) || "0", 10);
  return v > 0 ? v : null;
}

function matchUpdateBestHud() {
  if (matchBestEl) {
    const b = matchBestForDiff();
    matchBestEl.textContent = b ? String(b) : "—";
  }
}

function matchShuffleDeck(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function matchPlayFx(kind) {
  if (!soundState.match) return;
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const tone = (freq, dur, type = "sine", vol = 0.07) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
    };
    if (kind === "flip") tone(520, 0.05, "triangle", 0.04);
    else if (kind === "match") {
      tone(660, 0.1);
      tone(880, 0.12);
      tone(1100, 0.08, "sine", 0.05);
    } else if (kind === "wrong") tone(220, 0.15, "sawtooth", 0.035);
    else if (kind === "win") {
      tone(523, 0.12);
      tone(659, 0.12);
      tone(784, 0.16);
    }
  } catch (_) { /* noop */ }
}

function matchSparkAt(el) {
  if (!el) return;
  const card = el.closest(".match-card-btn") || el;
  const r = card.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const bits = ["✦", "·", "✧", "°"];
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("span");
    s.className = "match-spark";
    s.textContent = bits[i % bits.length];
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    const ang = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
    const dist = 16 + Math.random() * 20;
    s.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
    s.style.setProperty("--dy", `${Math.sin(ang) * dist - 8}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}

function matchStopTimer() {
  clearInterval(matchTimer);
  matchTimer = null;
}

function matchStartTimer() {
  matchStopTimer();
  matchSeconds = 0;
  if (matchTimeEl) matchTimeEl.textContent = "0s";
  if (!matchTimerOn) return;
  matchTimer = setInterval(() => {
    matchSeconds++;
    if (matchTimeEl) matchTimeEl.textContent = `${matchSeconds}s`;
  }, 1000);
}

function matchLoadPrefs() {
  document.querySelectorAll("[data-match-diff]").forEach((b) => {
    b.classList.toggle("active", b.dataset.matchDiff === matchDiff);
  });
  if (matchTimerToggle) matchTimerToggle.checked = matchTimerOn;
  if (matchMuteBtn) {
    matchMuteBtn.textContent = soundState.match ? "🔊 Sound" : "🔇 Muted";
    matchMuteBtn.classList.toggle("muted", !soundState.match);
  }
}

function buildMatchGrid(shuffleOnly = false) {
  if (!matchGrid) return;
  const cfg = matchCfg();
  matchTotalPairs = cfg.pairs;
  matchShareDiff = matchDiff;

  if (!shuffleOnly) {
    matchOpen = [];
    matchLocked = false;
    matchMoves = 0;
    matchFound = 0;
    matchWin?.classList.add("hidden");
    if (matchMovesEl) matchMovesEl.textContent = "0";
    if (matchPairsEl) matchPairsEl.textContent = `0/${matchTotalPairs}`;
    matchUpdateBestHud();
    matchStartTimer();
  } else {
    matchOpen.forEach((card) => {
      if (!card.classList.contains("matched")) card.classList.remove("flipped", "shake");
    });
    matchOpen = [];
    matchLocked = false;
  }

  matchGrid.className = `match-grid ${cfg.colsClass}`;
  matchTimePill?.classList.toggle("hidden", !matchTimerOn);

  const deck = matchShuffleDeck([...MATCH_ICONS.slice(0, cfg.pairs), ...MATCH_ICONS.slice(0, cfg.pairs)]);
  matchGrid.innerHTML = "";
  deck.forEach((icon, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "match-card-btn";
    btn.dataset.icon = icon;
    btn.dataset.idx = idx;
    btn.setAttribute("aria-label", "Memory card");
    const mascot = MATCH_MASCOT_TYPES[idx % 3];
    btn.innerHTML = `<div class="match-card-inner"><div class="match-card-face match-card-back" aria-hidden="true">${matchMascotHtml(mascot, `c${idx}`)}</div><div class="match-card-face match-card-front" aria-hidden="true">${icon}</div></div>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      flipMatchCard(btn);
    });
    matchGrid.appendChild(btn);
  });
}

function flipMatchCard(btn) {
  if (matchLocked || btn.classList.contains("flipped") || btn.classList.contains("matched")) return;
  btn.classList.add("flipped");
  matchFlipHappy(btn);
  matchOpen.push(btn);
  matchPlayFx("flip");
  if (matchOpen.length < 2) return;

  matchMoves++;
  if (matchMovesEl) matchMovesEl.textContent = String(matchMoves);
  matchLocked = true;
  const [a, b] = matchOpen;

  if (a.dataset.icon === b.dataset.icon) {
    a.classList.add("matched");
    b.classList.add("matched");
    matchFound++;
    if (matchPairsEl) matchPairsEl.textContent = `${matchFound}/${matchTotalPairs}`;
    matchPlayFx("match");
    matchPairCelebrate(a, b);
    matchSparkAt(a);
    matchSparkAt(b);
    matchOpen = [];
    matchLocked = false;
    if (matchFound === matchTotalPairs) {
      matchStopTimer();
      matchPlayFx("win");
      const prev = matchBestForDiff();
      let bestMsg = "";
      if (!prev || matchMoves < prev) {
        localStorage.setItem(MATCH_BEST_PREFIX + matchDiff, String(matchMoves));
        localStorage.setItem(`matchBest-${matchDiff}`, String(matchMoves));
        bestMsg = prev ? `New best! (was ${prev}) 🎉` : "First clear saved! 🎉";
        matchUpdateBestHud();
      } else {
        bestMsg = `Best on ${matchDiff}: ${prev} moves`;
      }
      if (matchWinMoves) matchWinMoves.textContent = String(matchMoves);
      if (matchWinTime) matchWinTime.textContent = matchTimerOn ? `· ${matchSeconds}s` : "";
      if (matchWinBest) matchWinBest.textContent = bestMsg;
      matchWin?.classList.remove("hidden");
    }
  } else {
    matchPlayFx("wrong");
    a.classList.add("shake");
    b.classList.add("shake");
    setTimeout(() => {
      a.classList.remove("flipped", "shake");
      b.classList.remove("flipped", "shake");
      matchOpen = [];
      matchLocked = false;
    }, 720);
  }
}

function initMemoryMatch() {
  matchInitCover();
  matchLoadPrefs();
  if (!matchGrid) return;
  if (matchBound) return;
  matchBound = true;

  document.querySelectorAll("[data-match-diff]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      matchDiff = btn.dataset.matchDiff || "medium";
      localStorage.setItem(MATCH_DIFF_KEY, matchDiff);
      matchLoadPrefs();
    });
  });

  matchTimerToggle?.addEventListener("change", (e) => {
    matchTimerOn = e.target.checked;
    localStorage.setItem(MATCH_TIMER_KEY, matchTimerOn ? "1" : "0");
    e.target.closest(".match-timer-toggle")?.classList.toggle("timer-on", matchTimerOn);
  });
  matchTimerToggle?.closest(".match-timer-toggle")?.classList.toggle("timer-on", matchTimerOn);

  matchStartBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    matchRippleBtn(matchStartBtn, e);
    getAudioCtx();
    showMatchScene(matchPlay);
    buildMatchGrid(false);
  });

  matchBackBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    matchStopTimer();
    showMatchScene(matchLanding);
    matchWin?.classList.add("hidden");
  });

  matchAgainBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    matchWin?.classList.add("hidden");
    buildMatchGrid(false);
  });

  matchRestartBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    buildMatchGrid(false);
  });

  matchShuffleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    buildMatchGrid(true);
  });

  matchMuteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    soundState.match = !soundState.match;
    matchLoadPrefs();
  });
}

/* ===== Number Merge — 2248 link puzzle ===== */
const MERGE_N = 5;
const MERGE_PAD = 10;
const MERGE_GAP = 8;
const MERGE_HIT = 6;
const MERGE_BEST_KEY = "number-merge-2248-best";
const MERGE_PALETTE = {
  2: { bg: "#ddd6fe", fg: "#5b21b6", glow: "#a78bfa" },
  4: { bg: "#c4b5fd", fg: "#4c1d95", glow: "#8b5cf6" },
  8: { bg: "#bae6fd", fg: "#075985", glow: "#38bdf8" },
  16: { bg: "#99f6e4", fg: "#115e59", glow: "#2dd4bf" },
  32: { bg: "#fde68a", fg: "#92400e", glow: "#fbbf24" },
  64: { bg: "#fdba74", fg: "#9a3412", glow: "#fb923c" },
  128: { bg: "#f9a8d4", fg: "#831843", glow: "#ec4899" },
  256: { bg: "#e879f9", fg: "#701a75", glow: "#d946ef" },
  512: { bg: "#a5b4fc", fg: "#312e81", glow: "#6366f1" },
  1024: { bg: "#fb7185", fg: "#fff", glow: "#f43f5e" },
  2048: { bg: "#1e1b4b", fg: "#fde047", glow: "#facc15" },
};
const MERGE_COVER_DEMO = [
  [2, 4, 8, 4, 2], [0, 2, 8, 2, 0], [4, 2, 16, 2, 4], [0, 8, 16, 8, 0], [2, 4, 32, 4, 2],
];
const MERGE_COVER_PATH = [
  { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
];

const mergeLanding = document.getElementById("mergeLanding");
const mergePlay = document.getElementById("mergePlay");
const mergeStartBtn = document.getElementById("mergeStartBtn");
const mergeBackBtn = document.getElementById("mergeBackBtn");
const mergeRestartBtn = document.getElementById("mergeRestartBtn");
const mergeMuteBtn = document.getElementById("mergeMuteBtn");
const mergeCanvas = document.getElementById("mergeCanvas");
const mergeCtx = mergeCanvas?.getContext("2d");
const mergeCoverCanvas = document.getElementById("mergeCoverCanvas");
const mergeCoverCtx = mergeCoverCanvas?.getContext("2d");
const mergeScoreEl = document.getElementById("mergeScore");
const mergeBestEl = document.getElementById("mergeBest");
const mergeHintEl = document.getElementById("mergeHint");
const mergeToastEl = document.getElementById("mergeToast");

let mergeBoard = [];
let mergeScore = 0;
let mergeBest = parseInt(localStorage.getItem(MERGE_BEST_KEY) || localStorage.getItem("mergeBest") || "0", 10);
let mergeActive = false;
let mergeOver = false;
let mergePath = [];
let mergeDragging = false;
let mergePointerId = null;
let mergePops = [];
let mergeSparks = [];
let mergeSpawnPop = null;
let mergeLoopId = 0;
let mergeCoverId = 0;
let mergeBound = false;
let mergeCell = 0;
let mergeMaxTile = 0;
let mergeLastLinkLen = 0;
let mergeToastTimer = 0;
let mergeBeatShown = false;

function mergeShowToast(msg) {
  if (!mergeToastEl) return;
  mergeToastEl.textContent = msg;
  mergeToastEl.classList.remove("hidden");
  mergeToastEl.classList.add("show");
  clearTimeout(mergeToastTimer);
  mergeToastTimer = setTimeout(() => mergeToastEl.classList.remove("show"), 1400);
}

function mergeMilestone(v) {
  if (v >= 128 && mergeMaxTile < 128) mergeShowToast("128 unlocked ✨");
  else if (v >= 256 && mergeMaxTile < 256) mergeShowToast("256 — keep going!");
  else if (v >= 512 && mergeMaxTile < 512) mergeShowToast("512 beast mode 🚀");
  else if (v >= 1024 && mergeMaxTile < 1024) mergeShowToast("1024 legend!");
  mergeMaxTile = Math.max(mergeMaxTile, v);
}

function mergePlayFx(kind, mergedVal) {
  if (!soundState.merge) return;
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const m = 0.09;
    const tone = (freq, dur, type = "sine", vol = m) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
    };
    if (kind === "link") tone(520, 0.04, "triangle", 0.035);
    else if (kind === "spawn") tone(740, 0.07, "sine", 0.05);
    else if (kind === "merge") {
      const base = 280 + Math.log2(Math.max(mergedVal || 2, 2)) * 65;
      tone(base, 0.14, "sine", 0.1);
      tone(base * 1.25, 0.12, "triangle", 0.06);
      tone(base * 1.5, 0.1, "sine", 0.04);
    } else if (kind === "over") {
      tone(180, 0.35, "sine", 0.08);
      tone(120, 0.4, "triangle", 0.05);
    } else if (kind === "start") {
      tone(440, 0.1);
      tone(554, 0.12);
      tone(659, 0.14);
    } else if (kind === "best") {
      tone(659, 0.1);
      tone(784, 0.12);
      tone(988, 0.14);
    }
  } catch (_) { /* noop */ }
}

function showMergeScene(el) {
  [mergeLanding, mergePlay].forEach((s) => s.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function mergeEmptyBoard() {
  return Array.from({ length: MERGE_N }, () => Array(MERGE_N).fill(0));
}

function mergeCellRect(r, c) {
  const x = MERGE_PAD + c * (mergeCell + MERGE_GAP);
  const y = MERGE_PAD + r * (mergeCell + MERGE_GAP);
  return { x, y, w: mergeCell, h: mergeCell, cx: x + mergeCell / 2, cy: y + mergeCell / 2 };
}

function mergePtFromEvent(e) {
  const rect = mergeCanvas.getBoundingClientRect();
  const sx = mergeCanvas.width / rect.width;
  const sy = mergeCanvas.height / rect.height;
  const t = e.touches?.[0] ?? e;
  return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
}

function mergeCellAt(x, y) {
  for (let r = 0; r < MERGE_N; r++) {
    for (let c = 0; c < MERGE_N; c++) {
      const { x: cx, y: cy } = mergeCellRect(r, c);
      if (x >= cx - MERGE_HIT && x <= cx + mergeCell + MERGE_HIT && y >= cy - MERGE_HIT && y <= cy + mergeCell + MERGE_HIT)
        return { r, c };
    }
  }
  return null;
}

function mergeAdj(a, b) {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return dr <= 1 && dc <= 1 && dr + dc > 0;
}

function mergeCanPlay() {
  for (let r = 0; r < MERGE_N; r++) {
    for (let c = 0; c < MERGE_N; c++) {
      const v = mergeBoard[r][c];
      if (!v) return true;
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < MERGE_N && nc >= 0 && nc < MERGE_N && mergeBoard[nr][nc] === v) return true;
      }
    }
  }
  return false;
}

function mergeSpawnOne() {
  const empty = [];
  for (let r = 0; r < MERGE_N; r++) {
    for (let c = 0; c < MERGE_N; c++) {
      if (mergeBoard[r][c] === 0) empty.push({ r, c });
    }
  }
  if (!empty.length) return false;
  const slot = empty[Math.floor(Math.random() * empty.length)];
  mergeBoard[slot.r][slot.c] = Math.random() < 0.85 ? 2 : 4;
  mergeSpawnPop = { r: slot.r, c: slot.c, t: 0 };
  mergePlayFx("spawn");
  return true;
}

function mergeRoundRectOn(c, x, y, w, h, rad) {
  const r = Math.min(rad, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function mergeRoundRect(x, y, w, h, rad) {
  mergeRoundRectOn(mergeCtx, x, y, w, h, rad);
}

function mergeTileColor(v) {
  return MERGE_PALETTE[v] || { bg: "#cbd5e1", fg: "#1e293b", glow: "#94a3b8" };
}

function mergeFontSize(v) {
  const s = String(v).length;
  if (s >= 4) return 16;
  if (s === 3) return 18;
  return 22;
}

function mergeUpdateHud() {
  if (mergeScoreEl) mergeScoreEl.textContent = String(mergeScore);
  if (mergeBestEl) mergeBestEl.textContent = String(mergeBest);
}

function mergeSaveBest() {
  if (mergeScore <= mergeBest) return;
  mergeBest = mergeScore;
  localStorage.setItem(MERGE_BEST_KEY, String(mergeBest));
  localStorage.setItem("mergeBest", String(mergeBest));
  mergeUpdateHud();
  if (!mergeBeatShown) {
    mergeBeatShown = true;
    mergeShowToast("New best! 🔥");
    mergePlayFx("best");
  }
}

function mergeDoMerge(chain) {
  if (!chain || chain.length < 2) return;
  const val = mergeBoard[chain[0].r][chain[0].c];
  if (!val) return;
  const end = chain[chain.length - 1];
  const merged = val * 2;
  for (let i = 0; i < chain.length; i++) {
    const p = chain[i];
    mergeBoard[p.r][p.c] = i === chain.length - 1 ? merged : 0;
  }
  mergeScore += merged;
  mergeSaveBest();
  mergeMilestone(merged);
  mergePops.push({ r: end.r, c: end.c, t: 0 });
  const { cx, cy } = mergeCellRect(end.r, end.c);
  const col = mergeTileColor(merged);
  for (let i = 0; i < 12; i++) {
    mergeSparks.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5 - 1.5,
      life: 1,
      glow: col.glow,
    });
  }
  mergePlayFx("merge", merged);
  mergeSpawnOne();
  mergeUpdateHud();
  if (!mergeCanPlay()) {
    mergeOver = true;
    mergeActive = false;
    mergePlayFx("over");
    if (mergeHintEl) mergeHintEl.textContent = `No moves · Score ${mergeScore} · Tap board to restart`;
  }
}

function mergeDrawBoard(c, w, h, opts = {}) {
  const {
    board: b, path: p = [], pops: pp = [], spawnPop: sp = null,
    over: ov = false, score: sc = 0, cell: cellSz, pad: padV, gap: gapV, n: nV,
  } = opts;
  const n = nV ?? MERGE_N;
  const pad = padV ?? MERGE_PAD;
  const gap = gapV ?? MERGE_GAP;
  const cell = cellSz ?? mergeCell;

  const cellR = (r, c) => {
    const x = pad + c * (cell + gap);
    const y = pad + r * (cell + gap);
    return { x, y, cx: x + cell / 2, cy: y + cell / 2 };
  };

  const bg = c.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#faf5ff");
  bg.addColorStop(0.5, "#f0f9ff");
  bg.addColorStop(1, "#fefce8");
  c.fillStyle = bg;
  c.fillRect(0, 0, w, h);

  for (let r = 0; r < n; r++) {
    for (let c2 = 0; c2 < n; c2++) {
      const { x, y } = cellR(r, c2);
      c.fillStyle = "rgba(255,255,255,0.45)";
      mergeRoundRectOn(c, x, y, cell, cell, 12);
      c.fill();
    }
  }

  if (p.length > 1) {
    c.save();
    c.strokeStyle = "rgba(167,139,250,0.7)";
    c.lineWidth = cell * 0.4;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.shadowColor = "rgba(236,72,153,0.55)";
    c.shadowBlur = 16;
    c.beginPath();
    p.forEach((pt, i) => {
      const { cx, cy } = cellR(pt.r, pt.c);
      if (i === 0) c.moveTo(cx, cy);
      else c.lineTo(cx, cy);
    });
    c.stroke();
    c.restore();
  }

  for (let r = 0; r < n; r++) {
    for (let c2 = 0; c2 < n; c2++) {
      const v = b?.[r]?.[c2];
      if (!v) continue;
      const { x, y } = cellR(r, c2);
      const col = mergeTileColor(v);
      let scale = 1;
      const pop = pp?.find?.((pp2) => pp2.r === r && pp2.c === c2);
      if (pop) scale = 1 + Math.sin(Math.min(1, pop.t / 220) * Math.PI) * 0.16;
      if (sp && sp.r === r && sp.c === c2) scale = 0.55 + Math.min(1, sp.t / 200) * 0.45;
      const inPath = p.some((pt) => pt.r === r && pt.c === c2);
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      c.save();
      c.translate(cx, cy);
      c.scale(scale, scale);
      c.translate(-cx, -cy);
      c.fillStyle = col.bg;
      mergeRoundRectOn(c, x, y, cell, cell, 12);
      c.fill();
      c.fillStyle = "rgba(0,0,0,0.04)";
      mergeRoundRectOn(c, x, y + cell * 0.72, cell, cell * 0.28, 12);
      c.fill();
      c.strokeStyle = inPath ? col.glow : "rgba(255,255,255,0.65)";
      c.lineWidth = inPath ? 2.5 : 1.2;
      c.stroke();
      c.fillStyle = col.fg;
      c.font = `800 ${mergeFontSize(v)}px system-ui,sans-serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(String(v), cx, cy + 1);
      c.restore();
    }
  }

  if (ov) {
    c.fillStyle = "rgba(30,27,75,0.72)";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#fde68a";
    c.font = "800 20px system-ui,sans-serif";
    c.textAlign = "center";
    c.fillText("Out of moves", w / 2, h / 2 - 16);
    c.fillStyle = "#e9d5ff";
    c.font = "600 14px system-ui,sans-serif";
    c.fillText(`Score ${sc} · tap to run it back`, w / 2, h / 2 + 12);
  }
}

function mergeDraw() {
  if (!mergeCtx || !mergeCanvas) return;
  const W = mergeCanvas.width;
  mergeDrawBoard(mergeCtx, W, W, {
    board: mergeBoard,
    path: mergePath,
    pops: mergePops,
    spawnPop: mergeSpawnPop,
    over: mergeOver,
    score: mergeScore,
  });

  mergeSparks = mergeSparks.filter((s) => {
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.07;
    s.life -= 0.035;
    if (s.life <= 0) return false;
    mergeCtx.fillStyle = `rgba(236,72,153,${s.life * 0.85})`;
    mergeCtx.beginPath();
    mergeCtx.arc(s.x, s.y, 3 * s.life, 0, Math.PI * 2);
    mergeCtx.fill();
    return true;
  });

  mergePops.forEach((p) => { p.t += 16; });
  mergePops = mergePops.filter((p) => p.t < 240);
  if (mergeSpawnPop) {
    mergeSpawnPop.t += 16;
    if (mergeSpawnPop.t >= 200) mergeSpawnPop = null;
  }
}

function mergeDrawCover(now) {
  if (!mergeCoverCtx || !mergeCoverCanvas) return;
  const w = mergeCoverCanvas.width;
  const h = mergeCoverCanvas.height;
  const t = now * 0.001;
  const idx = Math.floor(t * 2.2) % (MERGE_COVER_PATH.length + 2);
  const pathSlice = MERGE_COVER_PATH.slice(0, Math.max(0, idx));
  const cell = (w - 40 - 32) / MERGE_N;

  mergeCoverCtx.clearRect(0, 0, w, h);
  const bg = mergeCoverCtx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#ede9fe");
  bg.addColorStop(1, "#fce7f3");
  mergeCoverCtx.fillStyle = bg;
  mergeCoverCtx.fillRect(0, 0, w, h);

  mergeDrawBoard(mergeCoverCtx, w, h, {
    board: MERGE_COVER_DEMO,
    path: pathSlice,
    cell,
    pad: 20,
    gap: MERGE_GAP,
    n: MERGE_N,
  });

  mergeCoverCtx.fillStyle = "rgba(255,255,255,0.55)";
  mergeCoverCtx.fillRect(0, h - 52, w, 52);
  mergeCoverCtx.fillStyle = "#6d28d9";
  mergeCoverCtx.font = "800 13px system-ui,sans-serif";
  mergeCoverCtx.textAlign = "center";
  mergeCoverCtx.fillText("Drag → link → merge ×2", w / 2, h - 22);

  if (mergeLanding?.classList.contains("hidden")) {
    mergeCoverId = 0;
    return;
  }
  mergeCoverId = requestAnimationFrame(mergeDrawCover);
}

function startMergeCoverLoop() {
  if (mergeCoverId || !mergeCoverCanvas) return;
  mergeCoverId = requestAnimationFrame(mergeDrawCover);
}

function stopMergeCoverLoop() {
  if (!mergeCoverId) return;
  cancelAnimationFrame(mergeCoverId);
  mergeCoverId = 0;
}

function mergeLoop() {
  mergeDraw();
  if (mergePlay?.classList.contains("hidden")) {
    mergeLoopId = 0;
    return;
  }
  mergeLoopId = requestAnimationFrame(mergeLoop);
}

function startMergeLoop() {
  if (mergeLoopId) return;
  mergeLoopId = requestAnimationFrame(mergeLoop);
}

function startMerge() {
  mergeBoard = mergeEmptyBoard();
  mergeScore = 0;
  mergeOver = false;
  mergeActive = true;
  mergePath = [];
  mergePops = [];
  mergeSparks = [];
  mergeSpawnPop = null;
  mergeMaxTile = 0;
  mergeLastLinkLen = 0;
  mergeBeatShown = false;
  mergeCell = (mergeCanvas.width - MERGE_PAD * 2 - MERGE_GAP * (MERGE_N - 1)) / MERGE_N;
  mergeSpawnOne();
  mergeSpawnOne();
  mergeUpdateHud();
  if (mergeHintEl) mergeHintEl.textContent = "Drag to link same numbers · merge ×2";
  mergeDraw();
  startMergeLoop();
}

function initNumberMerge() {
  if (!mergeCanvas || !mergeCtx) return;
  if (mergeBestEl) mergeBestEl.textContent = String(mergeBest);
  if (mergeMuteBtn) {
    mergeMuteBtn.textContent = soundState.merge ? "🔊 Sound" : "🔇 Muted";
    mergeMuteBtn.classList.toggle("muted", !soundState.merge);
  }
  startMergeCoverLoop();
  if (mergeBound) return;
  mergeBound = true;

  mergeStartBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    getAudioCtx();
    stopMergeCoverLoop();
    showMergeScene(mergePlay);
    mergePlayFx("start");
    startMerge();
  });
  mergeBackBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    mergeActive = false;
    if (mergeLoopId) {
      cancelAnimationFrame(mergeLoopId);
      mergeLoopId = 0;
    }
    showMergeScene(mergeLanding);
    startMergeCoverLoop();
  });
  mergeRestartBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    startMerge();
  });
  mergeMuteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    soundState.merge = !soundState.merge;
    mergeMuteBtn.textContent = soundState.merge ? "🔊 Sound" : "🔇 Muted";
    mergeMuteBtn.classList.toggle("muted", !soundState.merge);
  });

  const onDown = (e) => {
    e.stopPropagation();
    if (mergeOver) { startMerge(); return; }
    if (!mergeActive) return;
    e.preventDefault();
    mergePointerId = e.pointerId ?? 0;
    mergeDragging = true;
    mergePath = [];
    mergeLastLinkLen = 0;
    try { mergeCanvas.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
    const p = mergePtFromEvent(e);
    const cell = mergeCellAt(p.x, p.y);
    if (cell && mergeBoard[cell.r][cell.c]) mergePath = [cell];
  };
  const onMove = (e) => {
    if (!mergeDragging || (e.pointerId != null && e.pointerId !== mergePointerId)) return;
    e.preventDefault();
    const p = mergePtFromEvent(e);
    const cell = mergeCellAt(p.x, p.y);
    if (!cell || !mergePath.length) return;
    const last = mergePath[mergePath.length - 1];
    if (cell.r === last.r && cell.c === last.c) return;
    if (mergePath.some((x) => x.r === cell.r && x.c === cell.c)) return;
    if (!mergeAdj(last, cell)) return;
    const base = mergeBoard[mergePath[0].r][mergePath[0].c];
    if (!mergeBoard[cell.r][cell.c] || mergeBoard[cell.r][cell.c] !== base) return;
    mergePath.push(cell);
    if (mergePath.length > mergeLastLinkLen) {
      mergePlayFx("link");
      mergeLastLinkLen = mergePath.length;
    }
  };
  const onUp = (e) => {
    if (!mergeDragging || (e.pointerId != null && mergePointerId != null && e.pointerId !== mergePointerId)) return;
    mergeDragging = false;
    try {
      if (mergeCanvas.hasPointerCapture(e.pointerId)) mergeCanvas.releasePointerCapture(e.pointerId);
    } catch (_) { /* noop */ }
    mergePointerId = null;
    const chain = mergePath.slice();
    mergePath = [];
    if (chain.length >= 2) mergeDoMerge(chain);
  };

  mergeCanvas.addEventListener("pointerdown", onDown);
  mergeCanvas.addEventListener("pointermove", onMove);
  mergeCanvas.addEventListener("pointerup", onUp);
  mergeCanvas.addEventListener("pointercancel", onUp);
  mergeCanvas.addEventListener("contextmenu", (e) => e.preventDefault());
}

/* ===== Mochi Snake — watercolor food hunt ===== */
const SNAKE_GRID_W = 18;
const SNAKE_GRID_H = 20;
const SNAKE_CELL = 20;
const SNAKE_FOODS = [
  { kind: "steamer", value: 1, weight: 18 },
  { kind: "noodles", value: 1, weight: 16 },
  { kind: "rice", value: 1, weight: 14 },
  { kind: "springroll", value: 5, weight: 12 },
  { kind: "mooncake", value: 5, weight: 10 },
  { kind: "duck", value: 10, weight: 6 },
];
const SNAKE_START_FOODS = 6;
const SNAKE_MAX_FOODS = 18;
const SNAKE_WALL_PAD = 1;
const SNAKE_MAX_RIVALS = 5;
const SNAKE_RIVAL_SPAWN_MS = 22000;
const SNAKE_RIVAL_MIN_SCORE = 15;
const SNAKE_RIVAL_MIN_DIST = 7;
const SNAKE_RIVAL_DIRS = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const SNAKE_RIVAL_STYLES = [
  { tail: ["#fde68a", "#fcd34d", "#fbbf24"], body: ["#fffbeb", "#fef3c7", "#fde68a"], preTail: ["#fffbeb", "#fef9c3", "#fde68a"], strokeT: "rgba(200,160,50,0.5)", strokeB: "rgba(180,150,90,0.45)" },
  { tail: ["#ddd6fe", "#c4b5fd", "#a78bfa"], body: ["#faf5ff", "#f5f3ff", "#ede9fe"], preTail: ["#faf5ff", "#ede9fe", "#ddd6fe"], strokeT: "rgba(140,120,200,0.5)", strokeB: "rgba(130,110,180,0.45)" },
  { tail: ["#a7f3d0", "#6ee7b7", "#34d399"], body: ["#ecfdf5", "#d1fae5", "#a7f3d0"], preTail: ["#ecfdf5", "#d1fae5", "#6ee7b7"], strokeT: "rgba(50,160,120,0.5)", strokeB: "rgba(60,140,110,0.45)" },
];
const SNAKE_SEG_HEAD = SNAKE_CELL * 0.58;
const SNAKE_SEG_BODY = SNAKE_CELL * 0.54;
const SNAKE_SEG_COMPRESS = 0.62;
const SNAKE_OUTLINE = "#5a5a62";
const SNAKE_BASE_TICK = 310;
const SNAKE_MIN_TICK = 190;

const snakeLanding = document.getElementById("snakeLanding");
const snakePlay = document.getElementById("snakePlay");
const snakeStartBtn = document.getElementById("snakeStartBtn");
const snakeBackBtn = document.getElementById("snakeBackBtn");
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas?.getContext("2d");
const snakeCoverCanvas = document.getElementById("snakeCoverCanvas");
const snakeCoverCtx = snakeCoverCanvas?.getContext("2d");
const snakeScoreEl = document.getElementById("snakeScore");
const snakeBestEl = document.getElementById("snakeBest");
const snakeAgainBtn = document.getElementById("snakeAgainBtn");
const snakeOver = document.getElementById("snakeOver");
const snakeOverTitle = document.getElementById("snakeOverTitle");
const snakeOverScore = document.getElementById("snakeOverScore");
const snakeOverBestLine = document.getElementById("snakeOverBestLine");
const snakeRivalHud = document.getElementById("snakeRivalHud");
const snakeRivalCountEl = document.getElementById("snakeRivalCount");
const snakeFeed = document.getElementById("feed");

let snakeBody = [];
let snakeDir = { x: 1, y: 0 };
let snakeQueued = null;
let snakeFoods = [];
let snakeRivals = [];
let snakeRivalId = 0;
let snakeLastRivalSpawn = 0;
let snakeFoodId = 0;
let snakePrevBody = null;
let snakeAnimT = 1;
let snakeScore = 0;
let snakeBest = Number(localStorage.getItem("vv-snake-best") || 0);
let snakeAlive = false;
let snakeLoopId = 0;
let snakeTickMs = SNAKE_BASE_TICK;
let snakeLastTick = 0;
let snakeMood = "happy";
let snakeDeathReason = "wall";
let snakeBound = false;
let snakeActivePointer = null;
let snakeBgm = null;
let snakeGrassDecor = [];
let snakeBgWashes = [];
let snakeFlowerDecor = [];
let snakeBgCache = null;
let snakeParticles = [];
let snakeSpawnFlashes = [];
let snakeCoverLoopId = 0;

const SNAKE_DEATH_COPY = {
  wall: "Hit the meadow edge!",
  self: "Bit your own tail!",
  rival: "Bumped a rival snake!",
};

function showSnakeScene(el) {
  [snakeLanding, snakePlay].forEach((s) => s?.classList.add("hidden"));
  el?.classList.remove("hidden");
}

function snakeSeedDecor() {
  snakeGrassDecor = [];
  snakeBgWashes = [];
  snakeFlowerDecor = [];
  for (let i = 0; i < 55; i++) {
    snakeGrassDecor.push({
      x: Math.random() * SNAKE_GRID_W * SNAKE_CELL,
      y: Math.random() * SNAKE_GRID_H * SNAKE_CELL,
      scale: 0.7 + Math.random() * 0.6,
      rot: (Math.random() - 0.5) * 0.5,
    });
  }
  for (let i = 0; i < 18; i++) {
    snakeBgWashes.push({
      x: Math.random() * SNAKE_GRID_W * SNAKE_CELL,
      y: Math.random() * SNAKE_GRID_H * SNAKE_CELL,
      rx: 40 + Math.random() * 80,
      ry: 30 + Math.random() * 50,
      rot: Math.random(),
      color: i % 2 ? "#a8cf88" : "#d8efbf",
    });
  }
  for (let i = 0; i < 24; i++) {
    snakeFlowerDecor.push({
      x: Math.random() * SNAKE_GRID_W * SNAKE_CELL,
      y: Math.random() * SNAKE_GRID_H * SNAKE_CELL,
      hue: i % 3,
      scale: 0.55 + Math.random() * 0.65,
    });
  }
  snakeBgCache = null;
}
snakeSeedDecor();

function snakeBuildBgCache() {
  if (!snakeCanvas || !snakeCtx) return;
  const w = snakeCanvas.width;
  const h = snakeCanvas.height;
  if (!snakeBgCache) snakeBgCache = document.createElement("canvas");
  if (snakeBgCache.width !== w || snakeBgCache.height !== h) {
    snakeBgCache.width = w;
    snakeBgCache.height = h;
  }
  const ctx = snakeBgCache.getContext("2d");
  snakeDrawSun(ctx, w * 0.82, h * 0.12, 22);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#e8f5d0");
  g.addColorStop(0.35, "#d0eab0");
  g.addColorStop(0.7, "#c0e4a0");
  g.addColorStop(1, "#b0d890");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.16;
  snakeBgWashes.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx, p.ry, p.rot, 0, Math.PI * 2);
    ctx.fill();
  });
  snakeFlowerDecor.forEach((f) => snakeDrawFlower(ctx, f.x, f.y, f.hue, f.scale));
  snakeGrassDecor.forEach((d) => {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    ctx.globalAlpha = 0.35;
    snakeDrawGrassTuft(ctx, d.scale);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i < 900; i++) {
    const gx = (i * 97 + 13) % w;
    const gy = (i * 53 + 7) % h;
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(8, 8, w - 16, h - 16, 12);
  else ctx.rect(8, 8, w - 16, h - 16);
  ctx.stroke();
  const inset = SNAKE_WALL_PAD * SNAKE_CELL + 4;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, 10);
  else ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(40,60,20,0.12)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

function snakeDrawCoverSegment(ctx, cx, cy, r, kind) {
  ctx.save();
  ctx.translate(cx, cy);
  const fill = kind === "pink" ? "#f2a0b0" : "#fafafa";
  const fillLight = kind === "pink" ? "#ffd0d8" : "#ffffff";
  const stroke = kind === "pink" ? "#c87888" : "#5a5a62";
  const grd = ctx.createRadialGradient(-r * 0.22, -r * 0.28, r * 0.08, 0, 0, r);
  grd.addColorStop(0, fillLight);
  grd.addColorStop(0.65, fill);
  grd.addColorStop(1, kind === "pink" ? "#e8909f" : "#f0ece8");
  ctx.fillStyle = grd;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = kind === "head" ? 2.4 : 2.1;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (kind === "head") {
    ctx.fillStyle = "#f4a8b8";
    ctx.beginPath();
    ctx.ellipse(-r * 0.38, -r * 0.72, r * 0.14, r * 0.18, -0.25, 0, Math.PI * 2);
    ctx.ellipse(r * 0.38, -r * 0.72, r * 0.14, r * 0.18, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.04, r * 0.21, 0, Math.PI * 2);
    ctx.arc(r * 0.28, -r * 0.04, r * 0.21, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.11, r * 0.06, 0, Math.PI * 2);
    ctx.arc(r * 0.34, -r * 0.11, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSnakeCover(now = performance.now()) {
  if (!snakeCoverCtx || !snakeCoverCanvas) return;
  const w = snakeCoverCanvas.width;
  const h = snakeCoverCanvas.height;
  const t = now / 1000;
  snakeDrawSun(snakeCoverCtx, w * 0.78, h * 0.14, 18);
  const g = snakeCoverCtx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#e8f5d0");
  g.addColorStop(0.5, "#c8e8a8");
  g.addColorStop(1, "#b4db98");
  snakeCoverCtx.fillStyle = g;
  snakeCoverCtx.fillRect(0, 0, w, h);
  snakeCoverCtx.globalAlpha = 0.22;
  for (let i = 0; i < 8; i++) {
    snakeCoverCtx.fillStyle = i % 2 ? "#a8cf88" : "#d8efbf";
    snakeCoverCtx.beginPath();
    snakeCoverCtx.ellipse(40 + i * 42, 30 + (i % 3) * 28, 50, 34, i * 0.3, 0, Math.PI * 2);
    snakeCoverCtx.fill();
  }
  snakeCoverCtx.globalAlpha = 0.55;
  for (let i = 0; i < 10; i++) {
    snakeDrawFlower(snakeCoverCtx, 30 + (i * 37) % w, 50 + (i * 23) % (h - 80), i % 3, 0.9 + (i % 2) * 0.2);
  }
  snakeCoverCtx.globalAlpha = 0.45;
  for (let i = 0; i < 14; i++) {
    snakeCoverCtx.save();
    snakeCoverCtx.translate(20 + (i * 27) % w, 40 + (i * 19) % (h - 60));
    snakeDrawGrassTuft(snakeCoverCtx, 0.8 + (i % 3) * 0.15);
    snakeCoverCtx.restore();
  }
  snakeCoverCtx.globalAlpha = 1;
  const bob = Math.sin(t * 2.2) * 4;
  const sway = Math.sin(t * 1.3) * 0.05;
  const cx = w * 0.46;
  const cy = h * 0.52 + bob * 0.25;
  snakeCoverCtx.save();
  snakeCoverCtx.translate(cx, cy);
  snakeCoverCtx.rotate(sway);
  const segW = Math.sin(t * 2.5) * 1.2;
  snakeDrawCoverSegment(snakeCoverCtx, 18, 10 + segW, 14, "pink");
  snakeDrawCoverSegment(snakeCoverCtx, 0, Math.sin(t * 2.5 + 0.5) * 0.8, 16, "white");
  snakeDrawCoverSegment(snakeCoverCtx, -16, -2 + Math.sin(t * 2.5 + 1) * 1, 14, "pink");
  snakeDrawCoverSegment(snakeCoverCtx, -30, -4 + Math.sin(t * 2.5 + 1.5) * 1.2, 15, "head");
  snakeCoverCtx.restore();
  const fBob = Math.sin(t * 2.8) * 2;
  snakeArtSteamer(snakeCoverCtx, w * 0.78, h * 0.38 + fBob);
  snakeArtDuck(snakeCoverCtx, w * 0.22, h * 0.62 + Math.sin(t * 2.6 + 1) * 1.5);
  snakeArtMooncake(snakeCoverCtx, w * 0.68, h * 0.72 + Math.sin(t * 2.4 + 2) * 1.8);
}

function startSnakeCoverLoop() {
  if (snakeCoverLoopId) return;
  const frame = (now) => {
    if (snakeLanding?.classList.contains("hidden")) {
      snakeCoverLoopId = 0;
      return;
    }
    drawSnakeCover(now);
    snakeCoverLoopId = requestAnimationFrame(frame);
  };
  snakeCoverLoopId = requestAnimationFrame(frame);
}

function stopSnakeCoverLoop() {
  if (!snakeCoverLoopId) return;
  cancelAnimationFrame(snakeCoverLoopId);
  snakeCoverLoopId = 0;
}

function snakeDrawGrassTuft(ctx, scale) {
  ctx.strokeStyle = "#3f6b2a";
  ctx.lineWidth = 1.3 * scale;
  ctx.lineCap = "round";
  const s = 5 * scale;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.quadraticCurveTo(-s * 0.4, -s, -s * 0.9, -s * 1.6);
  ctx.moveTo(0, 2);
  ctx.quadraticCurveTo(0, -s * 1.1, 0, -s * 1.9);
  ctx.moveTo(0, 2);
  ctx.quadraticCurveTo(s * 0.4, -s, s * 0.9, -s * 1.6);
  ctx.stroke();
}

function snakeDrawFlower(ctx, x, y, hue, scale) {
  const petals = hue === 0 ? "#f8b4c4" : hue === 1 ? "#fde68a" : "#c4b5fd";
  const center = hue === 1 ? "#f59e0b" : "#fff";
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5;
    ctx.fillStyle = petals;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 3.5 * scale, Math.sin(a) * 3.5 * scale, 2.8 * scale, 1.8 * scale, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(0, 0, 1.6 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function snakeDrawSun(ctx, x, y, r) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2);
  glow.addColorStop(0, "rgba(255, 248, 210, 0.55)");
  glow.addColorStop(0.45, "rgba(255, 248, 210, 0.12)");
  glow.addColorStop(1, "rgba(255, 248, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff3b0";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function snakePickFoodType() {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const f of SNAKE_FOODS) {
    acc += f.weight;
    if (roll < acc) return f;
  }
  return SNAKE_FOODS[0];
}

function snakeOccupiedSet() {
  const occupied = new Set(snakeBody.map((s) => `${s.x},${s.y}`));
  snakeFoods.forEach((f) => occupied.add(`${f.x},${f.y}`));
  snakeRivals.forEach((r) => r.body.forEach((s) => occupied.add(`${s.x},${s.y}`)));
  return occupied;
}

function snakeRivalCellSet(excludeId) {
  const cells = new Set();
  snakeRivals.forEach((r) => {
    if (r.id === excludeId) return;
    r.body.forEach((s) => cells.add(`${s.x},${s.y}`));
  });
  return cells;
}

function snakeRivalCap() {
  if (snakeScore < SNAKE_RIVAL_MIN_SCORE) return 0;
  if (snakeScore < 35) return 1;
  if (snakeScore < 65) return 2;
  if (snakeScore < 100) return 3;
  return SNAKE_MAX_RIVALS;
}

function snakeInBounds(x, y) {
  return x >= SNAKE_WALL_PAD && y >= SNAKE_WALL_PAD
    && x < SNAKE_GRID_W - SNAKE_WALL_PAD && y < SNAKE_GRID_H - SNAKE_WALL_PAD;
}

function snakeDirSafe(dx, dy) {
  if (!snakeBody.length) return false;
  const head = snakeBody[0];
  return snakeInBounds(head.x + dx, head.y + dy);
}

function snakeHitsRival(x, y) {
  return snakeRivals.some((r) => r.body.some((s) => s.x === x && s.y === y));
}

function snakeTrySpawnRival() {
  if (!snakeBody.length) return false;
  if (snakeScore < SNAKE_RIVAL_MIN_SCORE) return false;
  if (snakeRivals.length >= snakeRivalCap()) return false;
  const pad = SNAKE_WALL_PAD;
  for (let attempt = 0; attempt < 50; attempt++) {
    const dir = SNAKE_RIVAL_DIRS[Math.floor(Math.random() * SNAKE_RIVAL_DIRS.length)];
    const len = 2 + Math.floor(Math.random() * 3);
    const hx = pad + 1 + Math.floor(Math.random() * (SNAKE_GRID_W - 2 * pad - 2));
    const hy = pad + 1 + Math.floor(Math.random() * (SNAKE_GRID_H - 2 * pad - 2));
    const body = [];
    for (let i = 0; i < len; i++) body.push({ x: hx - dir.x * i, y: hy - dir.y * i });
    if (body.some((c) => !snakeInBounds(c.x, c.y))) continue;
    const occ = snakeOccupiedSet();
    if (body.some((c) => occ.has(`${c.x},${c.y}`))) continue;
    const dist = Math.hypot(body[0].x - snakeBody[0].x, body[0].y - snakeBody[0].y);
    if (dist < SNAKE_RIVAL_MIN_DIST) continue;
    snakeRivals.push({
      id: snakeRivalId++,
      body,
      dir: { ...dir },
      prevBody: body.map((s) => ({ ...s })),
      stepEvery: 3 + Math.floor(Math.random() * 2),
      tick: 0,
      style: SNAKE_RIVAL_STYLES[snakeRivalId % SNAKE_RIVAL_STYLES.length],
    });
    snakeSpawnFlashes.push({
      x: body[0].x * SNAKE_CELL + SNAKE_CELL / 2,
      y: body[0].y * SNAKE_CELL + SNAKE_CELL / 2,
      t: performance.now(),
    });
    return true;
  }
  return false;
}

function snakeStepRivals() {
  const playerHead = snakeBody[0];
  for (const rival of snakeRivals) {
    rival.tick = (rival.tick + 1) % rival.stepEvery;
    if (rival.tick !== 0) continue;
    rival.prevBody = rival.body.map((s) => ({ ...s }));
    const head = rival.body[0];
    const otherRivals = snakeRivalCellSet(rival.id);
    const options = SNAKE_RIVAL_DIRS.filter((d) => {
      if (d.x === -rival.dir.x && d.y === -rival.dir.y) return false;
      const nx = head.x + d.x;
      const ny = head.y + d.y;
      if (nx < 0 || ny < 0 || nx >= SNAKE_GRID_W || ny >= SNAKE_GRID_H) return false;
      const key = `${nx},${ny}`;
      if (rival.body.some((s, idx) => idx > 0 && s.x === nx && s.y === ny)) return false;
      if (otherRivals.has(key)) return false;
      return true;
    });
    if (!options.length) continue;
    const keep = options.find((d) => d.x === rival.dir.x && d.y === rival.dir.y);
    const pick = keep && Math.random() > 0.3 ? keep : options[Math.floor(Math.random() * options.length)];
    rival.dir = { ...pick };
    rival.body.unshift({ x: head.x + pick.x, y: head.y + pick.y });
    rival.body.pop();
    const rh = rival.body[0];
    if (rh.x === playerHead.x && rh.y === playerHead.y) {
      snakeDeathReason = "rival";
      snakeDie();
      return;
    }
    if (rival.body.some((s, idx) => idx > 0 && s.x === playerHead.x && s.y === playerHead.y)) {
      snakeDeathReason = "rival";
      snakeDie();
      return;
    }
  }
}

function snakeFreeCell() {
  const occupied = snakeOccupiedSet();
  for (let n = 0; n < 120; n++) {
    const x = SNAKE_WALL_PAD + Math.floor(Math.random() * (SNAKE_GRID_W - 2 * SNAKE_WALL_PAD));
    const y = SNAKE_WALL_PAD + Math.floor(Math.random() * (SNAKE_GRID_H - 2 * SNAKE_WALL_PAD));
    if (!occupied.has(`${x},${y}`)) return { x, y };
  }
  return null;
}

function snakeFoodTarget() {
  return Math.min(SNAKE_MAX_FOODS, SNAKE_START_FOODS + Math.floor(snakeScore / 10));
}

function snakeEnsureFoods() {
  const target = snakeFoodTarget();
  while (snakeFoods.length < target) {
    const p = snakeFreeCell();
    if (!p) break;
    const type = snakePickFoodType();
    snakeFoods.push({
      id: snakeFoodId++,
      x: p.x,
      y: p.y,
      kind: type.kind,
      value: type.value,
      bob: Math.random() * Math.PI * 2,
    });
  }
}

function snakeResetGame() {
  snakeBody = [{ x: Math.floor(SNAKE_GRID_W / 2), y: Math.floor(SNAKE_GRID_H / 2) }];
  snakeDir = { x: 0, y: -1 };
  snakeQueued = null;
  snakeScore = 0;
  snakeTickMs = SNAKE_BASE_TICK;
  snakeMood = "happy";
  snakeAlive = true;
  snakeFoods = [];
  snakeRivals = [];
  snakeRivalId = 0;
  snakeFoodId = 0;
  snakeParticles = [];
  snakeSpawnFlashes = [];
  snakeEnsureFoods();
  snakeLastRivalSpawn = performance.now();
  snakePrevBody = snakeBody.map((s) => ({ ...s }));
  snakeAnimT = 1;
  if (snakeScoreEl) snakeScoreEl.textContent = "0";
  if (snakeBestEl) snakeBestEl.textContent = String(snakeBest);
  snakeOver?.classList.add("hidden");
  snakeRivalHud?.classList.toggle("hidden", true);
  if (snakeRivalCountEl) snakeRivalCountEl.textContent = "0";
}

function startSnakeBGM() {
  if (!soundState.beat || snakeBgm?.running) return;
  const ctx = getAudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.13;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2400;
  lp.connect(ctx.destination);
  master.connect(lp);
  snakeBgm = { running: true, timers: [], master, step: 0 };
  const melody = [
    [262, 0.5], [294, 0.45], [330, 0.55], [392, 0.5], [330, 0.45], [294, 0.5],
    [262, 0.45], [220, 0.55], [262, 0.45], [330, 0.5], [294, 0.6],
  ];
  function tick() {
    if (!snakeBgm?.running || !soundState.beat) return;
    const [freq, dur] = melody[snakeBgm.step % melody.length];
    playMusicBox(ctx, snakeBgm.master, freq, ctx.currentTime, dur, 0.26);
    snakeBgm.step++;
    snakeBgm.timers.push(setTimeout(tick, dur * 1000 + 140));
  }
  tick();
}

function stopSnakeBGM() {
  if (!snakeBgm) return;
  snakeBgm.running = false;
  snakeBgm.timers.forEach(clearTimeout);
  snakeBgm = null;
}

function snakePlayFx(type) {
  if (!soundState.beat) return;
  const ctx = getAudioCtx();
  const m = getMaster(ctx, 0.34);
  const t = ctx.currentTime;
  if (type === "eat") playSparkle(ctx, m, t, 0.15);
  else if (type === "die") playBubble(ctx, m, 90, t, 0.28);
  else if (type === "move") playBubble(ctx, m, 320, t, 0.04);
}

function snakeSetDir(dx, dy) {
  if (!snakeAlive) return;
  const opp = snakeDir.x + dx === 0 && snakeDir.y + dy === 0;
  if (opp) return;
  snakeQueued = { x: dx, y: dy };
}

function snakeCanvasPoint(clientX, clientY) {
  const rect = snakeCanvas.getBoundingClientRect();
  const scaleX = snakeCanvas.width / rect.width;
  const scaleY = snakeCanvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

function snakeSteerToward(clientX, clientY) {
  if (!snakeAlive || !snakeBody.length) return;
  const p = snakeCanvasPoint(clientX, clientY);
  const head = snakeInterpPos(0);
  const dx = p.x - head.x;
  const dy = p.y - head.y;
  if (Math.hypot(dx, dy) < 16) return;
  const hDir = { x: dx > 0 ? 1 : -1, y: 0 };
  const vDir = { x: 0, y: dy > 0 ? 1 : -1 };
  const preferH = Math.abs(dx) > Math.abs(dy);
  const primary = preferH ? hDir : vDir;
  const secondary = preferH ? vDir : hDir;
  if (snakeDirSafe(primary.x, primary.y)) snakeSetDir(primary.x, primary.y);
  else if (snakeDirSafe(secondary.x, secondary.y)) snakeSetDir(secondary.x, secondary.y);
}

function snakeDrawBackground() {
  if (!snakeBgCache) snakeBuildBgCache();
  snakeCtx.drawImage(snakeBgCache, 0, 0);
}

function snakeArtSteamer(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c4a574";
  ctx.strokeStyle = "#9a7848";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 4 - i * 3, 11 - i, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#fff8f0";
  ctx.beginPath();
  ctx.arc(-3, -1, 3.5, 0, Math.PI * 2);
  ctx.arc(3, -1, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function snakeArtNoodles(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f5f0ea";
  ctx.strokeStyle = "#ccc5bb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e8c4a0";
  ctx.beginPath();
  ctx.ellipse(0, 3, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4aa70";
  ctx.lineWidth = 1.2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 2, 0);
    ctx.quadraticCurveTo(i * 3, 4, i * 2, 7);
    ctx.stroke();
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(3, -1, 3, 2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function snakeArtRice(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d64545";
  ctx.beginPath();
  ctx.arc(0, 3, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffef8";
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8b4513";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(8, -6);
  ctx.lineTo(5, 5);
  ctx.moveTo(10, -4);
  ctx.lineTo(7, 6);
  ctx.stroke();
  ctx.restore();
}

function snakeArtSpringRoll(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 11, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-12, 0, 24, 8, 2);
  else ctx.rect(-12, 0, 24, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#d4a056";
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(i * 7, 2, 4.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function snakeArtMooncake(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 7, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c9924a";
  ctx.strokeStyle = "#a67432";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 1, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#8b5a28";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.arc(0, 1, 4, 0, Math.PI * 2);
  ctx.moveTo(-4, 1);
  ctx.lineTo(4, 1);
  ctx.moveTo(0, -3);
  ctx.lineTo(0, 5);
  ctx.stroke();
  ctx.restore();
}

function snakeArtDuck(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, 9, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#ddd";
  ctx.beginPath();
  ctx.ellipse(0, 5, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8b4513";
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a0522d";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const SNAKE_FOOD_DRAW = {
  steamer: snakeArtSteamer,
  noodles: snakeArtNoodles,
  rice: snakeArtRice,
  springroll: snakeArtSpringRoll,
  mooncake: snakeArtMooncake,
  duck: snakeArtDuck,
};

function snakeSmoothstep(t) {
  return t * t * (3 - 2 * t);
}

function snakeInterpBody(body, prevBody, animT, i) {
  const cell = SNAKE_CELL;
  const cur = body[i];
  const curX = cur.x * cell + cell / 2;
  const curY = cur.y * cell + cell / 2;
  if (!prevBody?.[i] || animT >= 1) return { x: curX, y: curY };
  const prev = prevBody[i];
  const ease = snakeSmoothstep(animT);
  return {
    x: prev.x * cell + cell / 2 + (curX - (prev.x * cell + cell / 2)) * ease,
    y: prev.y * cell + cell / 2 + (curY - (prev.y * cell + cell / 2)) * ease,
  };
}

function snakeInterpPos(i) {
  return snakeInterpBody(snakeBody, snakePrevBody, snakeAnimT, i);
}

function snakeSegAngleFrom(i, pts, fallbackDir) {
  if (i === 0 && pts[1]) return Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x);
  if (i > 0) return Math.atan2(pts[i - 1].y - pts[i].y, pts[i - 1].x - pts[i].x);
  return Math.atan2(fallbackDir.y, fallbackDir.x);
}

function snakeBurstParticles(x, y, value) {
  const cx = x * SNAKE_CELL + SNAKE_CELL / 2;
  const cy = y * SNAKE_CELL + SNAKE_CELL / 2;
  const color = value >= 10 ? "#f59e0b" : value >= 5 ? "#eab308" : "#84cc16";
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const spd = 1.6 + Math.random() * 2.4;
    snakeParticles.push({
      x: cx,
      y: cy,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 1.2,
      life: 1,
      color,
      size: 2 + Math.random() * 2.5,
    });
  }
}

function snakeUpdateFx(dt) {
  snakeParticles = snakeParticles.filter((p) => {
    p.life -= dt * 2.2;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    return p.life > 0;
  });
  const now = performance.now();
  snakeSpawnFlashes = snakeSpawnFlashes.filter((f) => now - f.t < 900);
}

function snakeDrawFx() {
  const now = performance.now();
  snakeSpawnFlashes.forEach((f) => {
    const age = (now - f.t) / 900;
    const r = SNAKE_CELL * (0.35 + age * 0.55);
    snakeCtx.save();
    snakeCtx.strokeStyle = `rgba(198, 40, 40, ${0.55 * (1 - age)})`;
    snakeCtx.lineWidth = 2.5;
    snakeCtx.beginPath();
    snakeCtx.arc(f.x, f.y, r, 0, Math.PI * 2);
    snakeCtx.stroke();
    snakeCtx.restore();
  });
  snakeParticles.forEach((p) => {
    snakeCtx.save();
    snakeCtx.globalAlpha = p.life;
    snakeCtx.fillStyle = p.color;
    snakeCtx.beginPath();
    snakeCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    snakeCtx.fill();
    snakeCtx.restore();
  });
}

function snakeDrawFood(f) {
  const cx = f.x * SNAKE_CELL + SNAKE_CELL / 2;
  const bob = Math.sin(performance.now() / 520 + f.bob) * 1.8;
  const cy = f.y * SNAKE_CELL + SNAKE_CELL / 2 + bob;
  snakeCtx.save();
  snakeCtx.fillStyle = "rgba(40, 50, 25, 0.1)";
  snakeCtx.beginPath();
  snakeCtx.ellipse(cx, cy + 9, 10, 3.5, 0, 0, Math.PI * 2);
  snakeCtx.fill();
  snakeCtx.restore();
  if (f.value >= 5) {
    const pulse = 0.85 + Math.sin(performance.now() / 380 + f.bob) * 0.15;
    snakeCtx.save();
    snakeCtx.globalAlpha = f.value >= 10 ? 0.28 : 0.18;
    const glow = snakeCtx.createRadialGradient(cx, cy, 0, cx, cy, SNAKE_CELL * 0.5 * pulse);
    glow.addColorStop(0, f.value >= 10 ? "rgba(245,158,11,0.5)" : "rgba(234,179,8,0.4)");
    glow.addColorStop(1, "rgba(245,158,11,0)");
    snakeCtx.fillStyle = glow;
    snakeCtx.beginPath();
    snakeCtx.arc(cx, cy, SNAKE_CELL * 0.5 * pulse, 0, Math.PI * 2);
    snakeCtx.fill();
    snakeCtx.globalAlpha = f.value >= 10 ? 0.45 : 0.32;
    snakeCtx.strokeStyle = f.value >= 10 ? "#f59e0b" : "#eab308";
    snakeCtx.lineWidth = 2;
    snakeCtx.beginPath();
    snakeCtx.arc(cx, cy, SNAKE_CELL * 0.42 * pulse, 0, Math.PI * 2);
    snakeCtx.stroke();
    snakeCtx.restore();
  }
  snakeCtx.save();
  snakeCtx.translate(cx, cy);
  snakeCtx.scale(1.15, 1.15);
  const draw = SNAKE_FOOD_DRAW[f.kind] || snakeArtSteamer;
  draw(snakeCtx, 0, 0);
  snakeCtx.restore();
  if (f.value > 1) {
    snakeCtx.save();
    const label = `+${f.value}`;
    snakeCtx.font = "bold 10px Inter, sans-serif";
    const tw = snakeCtx.measureText(label).width;
    const bx = cx + 8;
    const by = cy - 14;
    snakeCtx.fillStyle = f.value >= 10 ? "#b45309" : "#a16207";
    snakeCtx.shadowColor = "rgba(0,0,0,0.15)";
    snakeCtx.shadowBlur = 4;
    if (snakeCtx.roundRect) {
      snakeCtx.beginPath();
      snakeCtx.roundRect(bx - 3, by - 10, tw + 8, 14, 5);
      snakeCtx.fill();
    }
    snakeCtx.shadowBlur = 0;
    snakeCtx.fillStyle = "#fff";
    snakeCtx.fillText(label, bx, by);
    snakeCtx.restore();
  }
}

function snakeCompressPts(pts) {
  if (pts.length <= 1) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    out.push({
      x: out[i - 1].x + (pts[i].x - out[i - 1].x) * SNAKE_SEG_COMPRESS,
      y: out[i - 1].y + (pts[i].y - out[i - 1].y) * SNAKE_SEG_COMPRESS,
    });
  }
  return out;
}

function snakeSegKind(i) {
  if (i === 0) return "head";
  return i % 2 === 0 ? "pink" : "white";
}

function snakeDrawRefHeadFace(ctx, r, mood) {
  if (mood === "dead") {
    ctx.strokeStyle = SNAKE_OUTLINE;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    const y = -r * 0.02;
    ctx.beginPath();
    ctx.moveTo(-r * 0.28, y - 2);
    ctx.lineTo(-r * 0.14, y + 2);
    ctx.moveTo(-r * 0.14, y - 2);
    ctx.lineTo(-r * 0.28, y + 2);
    ctx.moveTo(r * 0.14, y - 2);
    ctx.lineTo(r * 0.28, y + 2);
    ctx.moveTo(r * 0.28, y - 2);
    ctx.lineTo(r * 0.14, y + 2);
    ctx.stroke();
    return;
  }
  const eyeY = -r * 0.04;
  const eyeR = r * 0.21;
  ctx.fillStyle = "#f4a8b8";
  ctx.strokeStyle = SNAKE_OUTLINE;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(-r * 0.38, -r * 0.72, r * 0.14, r * 0.18, -0.25, 0, Math.PI * 2);
  ctx.ellipse(r * 0.38, -r * 0.72, r * 0.14, r * 0.18, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(-r * 0.28, eyeY, eyeR, 0, Math.PI * 2);
  ctx.arc(r * 0.28, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-r * 0.22, eyeY - eyeR * 0.35, eyeR * 0.28, 0, Math.PI * 2);
  ctx.arc(r * 0.34, eyeY - eyeR * 0.35, eyeR * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = SNAKE_OUTLINE;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, r * 0.14, r * 0.14, 0.25, Math.PI - 0.25);
  ctx.stroke();
}

function snakeDrawRefSegment(cx, cy, r, kind, mood, style) {
  snakeCtx.save();
  snakeCtx.translate(cx, cy);
  let fill = "#fafafa";
  let fillLight = "#ffffff";
  let fillDeep = "#f0ece8";
  let stroke = SNAKE_OUTLINE;
  if (kind === "pink") {
    fill = style ? style.body[1] : "#f2a0b0";
    fillLight = style ? style.body[0] : "#ffd0d8";
    fillDeep = style ? style.tail[1] : "#e8909f";
    stroke = style ? style.strokeT : "#c87888";
  } else if (kind === "white" && style) {
    fill = style.body[0];
    fillLight = style.body[1];
    fillDeep = style.body[2];
    stroke = style.strokeB;
  }
  const grd = snakeCtx.createRadialGradient(-r * 0.22, -r * 0.28, r * 0.08, 0, 0, r);
  grd.addColorStop(0, fillLight);
  grd.addColorStop(0.62, fill);
  grd.addColorStop(1, fillDeep);
  snakeCtx.fillStyle = grd;
  snakeCtx.strokeStyle = stroke;
  snakeCtx.lineWidth = kind === "head" ? 2.4 : 2.1;
  snakeCtx.beginPath();
  snakeCtx.arc(0, 0, r, 0, Math.PI * 2);
  snakeCtx.fill();
  snakeCtx.stroke();
  if (kind === "head") snakeDrawRefHeadFace(snakeCtx, r, mood);
  snakeCtx.restore();
}

function snakeDrawSingleCreature(x, y) {
  snakeDrawRefSegment(x, y + SNAKE_SEG_BODY * 0.28, SNAKE_SEG_BODY, "pink", "happy", null);
  snakeDrawRefSegment(x, y - SNAKE_SEG_HEAD * 0.06, SNAKE_SEG_HEAD, "head", snakeMood, null);
}

function snakeDrawChain(body, dir, prevBody, animT, style, mood) {
  const n = body.length;
  if (!n) return;
  const raw = [];
  for (let i = 0; i < n; i++) raw.push(snakeInterpBody(body, prevBody, animT, i));
  if (n === 1 && !style) {
    snakeDrawSingleCreature(raw[0].x, raw[0].y);
    return;
  }
  const pts = snakeCompressPts(raw);

  snakeCtx.save();
  snakeCtx.fillStyle = "rgba(40, 30, 20, 0.07)";
  pts.forEach((p, i) => {
    const r = i === 0 ? SNAKE_SEG_HEAD : SNAKE_SEG_BODY;
    snakeCtx.beginPath();
    snakeCtx.ellipse(p.x + 1, p.y + 4, r * 0.92, r * 0.38, 0, 0, Math.PI * 2);
    snakeCtx.fill();
  });
  snakeCtx.restore();

  for (let i = n - 1; i >= 0; i--) {
    const kind = snakeSegKind(i);
    const angle = snakeSegAngleFrom(i, pts, dir);
    const wobble = Math.sin(animT * Math.PI + i * 0.65) * SNAKE_CELL * 0.04 * (1 - i * 0.025);
    const px = pts[i].x + Math.cos(angle + Math.PI / 2) * wobble;
    const py = pts[i].y + Math.sin(angle + Math.PI / 2) * wobble;
    const r = i === 0 ? SNAKE_SEG_HEAD : SNAKE_SEG_BODY;
    snakeDrawRefSegment(px, py, r, kind, i === 0 ? mood : "happy", style);
  }
}

function snakeDrawSnake() {
  snakeDrawChain(snakeBody, snakeDir, snakePrevBody, snakeAnimT, null, snakeMood);
}

function snakeDrawRivals() {
  snakeRivals.forEach((r) => {
    snakeDrawChain(r.body, r.dir, r.prevBody, snakeAnimT, r.style, "happy");
  });
}

function snakeRender() {
  if (!snakeCtx || !snakeCanvas) return;
  snakeDrawBackground();
  snakeDrawFx();
  snakeFoods.forEach(snakeDrawFood);
  snakeDrawRivals();
  snakeDrawSnake();
  if (snakeRivalHud) {
    snakeRivalHud.classList.toggle("hidden", snakeRivals.length === 0);
    if (snakeRivalCountEl) snakeRivalCountEl.textContent = String(snakeRivals.length);
  }
}

function snakeDie() {
  snakeAlive = false;
  snakeMood = "dead";
  snakePlayFx("die");
  cancelAnimationFrame(snakeLoopId);
  stopSnakeBGM();
  const isNewBest = snakeScore > snakeBest;
  if (isNewBest) {
    snakeBest = snakeScore;
    localStorage.setItem("vv-snake-best", String(snakeBest));
    if (snakeBestEl) snakeBestEl.textContent = String(snakeBest);
  }
  snakeRender();
  if (snakeOverTitle) snakeOverTitle.textContent = SNAKE_DEATH_COPY[snakeDeathReason] || "Ouch!";
  if (snakeOverScore) snakeOverScore.textContent = String(snakeScore);
  if (snakeOverBestLine) {
    snakeOverBestLine.textContent = isNewBest
      ? `New best! ${snakeBest} pts`
      : `Best: ${snakeBest} pts`;
  }
  snakeOver?.classList.remove("hidden");
}

function snakeStep() {
  if (!snakeAlive) return;
  snakeStepRivals();
  if (!snakeAlive) return;
  snakePrevBody = snakeBody.map((s) => ({ ...s }));
  if (snakeQueued) {
    snakeDir = snakeQueued;
    snakeQueued = null;
  }
  const head = snakeBody[0];
  const nh = { x: head.x + snakeDir.x, y: head.y + snakeDir.y };
  if (!snakeInBounds(nh.x, nh.y)) {
    snakeDeathReason = "wall";
    snakeDie();
    return;
  }
  if (snakeBody.length > 3 && snakeBody.some((s) => s.x === nh.x && s.y === nh.y)) {
    snakeDeathReason = "self";
    snakeDie();
    return;
  }
  if (snakeHitsRival(nh.x, nh.y)) {
    snakeDeathReason = "rival";
    snakeDie();
    return;
  }
  snakeBody.unshift(nh);
  const eatenIdx = snakeFoods.findIndex((f) => f.x === nh.x && f.y === nh.y);
  if (eatenIdx >= 0) {
    const eaten = snakeFoods[eatenIdx];
    snakeScore += eaten.value;
    if (snakeScoreEl) snakeScoreEl.textContent = String(snakeScore);
    snakeTickMs = Math.max(SNAKE_MIN_TICK, SNAKE_BASE_TICK - Math.floor(snakeScore / 40));
    snakePlayFx("eat");
    snakeMood = "happy";
    snakeBurstParticles(eaten.x, eaten.y, eaten.value);
    snakeFoods.splice(eatenIdx, 1);
    snakeEnsureFoods();
  } else {
    snakeBody.pop();
  }
}

function snakeLoop(now) {
  if (!snakeAlive) return;
  if (now - snakeLastRivalSpawn >= SNAKE_RIVAL_SPAWN_MS) {
    snakeLastRivalSpawn = now;
    snakeTrySpawnRival();
  }
  if (now - snakeLastTick >= snakeTickMs) {
    snakeLastTick = now;
    snakeAnimT = 0;
    snakeStep();
  } else {
    snakeAnimT = Math.min(1, (now - snakeLastTick) / snakeTickMs);
  }
  snakeUpdateFx(1 / 60);
  snakeRender();
  snakeLoopId = requestAnimationFrame(snakeLoop);
}

function snakeStart() {
  stopSnakeCoverLoop();
  showSnakeScene(snakePlay);
  snakeResetGame();
  snakeLastTick = performance.now();
  cancelAnimationFrame(snakeLoopId);
  snakeLoopId = requestAnimationFrame(snakeLoop);
  if (soundState.beat) startSnakeBGM();
}

function snakeSetFeedLock(on) {
  snakeFeed?.classList.toggle("snake-interacting", on);
}

function loadIframeGame(game) {
  const map = {
    slash: { id: "slashFrame", src: "games/fruit-slash.html?embed=1&v=iframe-scroll-fix" },
    hole: { id: "holeFrame", src: "games/hole-swallow.html?embed=1&v=iframe-scroll-fix" },
  };
  const cfg = map[game];
  if (!cfg) return false;
  const frame = document.getElementById(cfg.id);
  if (!frame) return false;
  const target = frame.dataset.src || cfg.src;
  const blank = !frame.src || frame.src === "about:blank" || frame.src.endsWith("about:blank");
  if (blank || frame.dataset.loaded !== "1") {
    frame.dataset.loaded = "1";
    frame.src = target;
  }
  frame.contentWindow?.postMessage({ type: `${game}-resize` }, "*");
  return true;
}

function syncSlashFeedSound() {
  const frame = document.getElementById("slashFrame");
  frame?.contentWindow?.postMessage({ type: "slash-sound", enabled: soundState.slash }, "*");
}

function initSlashFeed() {
  loadIframeGame("slash");
}

function syncHoleFeedSound() {
  const frame = document.getElementById("holeFrame");
  frame?.contentWindow?.postMessage({ type: "hole-sound", enabled: soundState.hole }, "*");
}

function initHoleFeed() {
  loadIframeGame("hole");
}

function ensureVisibleIframeGames() {
  document.querySelectorAll(".feed-item[data-feed='games']:not(.hidden)").forEach((item) => {
    const game = item.dataset.game;
    if (game === "hole" || game === "slash") loadIframeGame(game);
  });
}

function initIframeFeedRetry() {
  const iframeGames = ["hole", "slash"];
  const feed = document.getElementById("feed");
  if (!feed) return;

  const retryVisible = () => {
    iframeGames.forEach((game) => {
      const item = document.querySelector(`.feed-item[data-game="${game}"]:not(.hidden)`);
      if (!item || !isElementVisibleInFeed(item)) return;
      const frame = document.getElementById(`${game}Frame`);
      if (!frame) return;
      const blank = !frame.src || frame.src.includes("about:blank");
      if (blank) loadIframeGame(game);
      else frame.contentWindow?.postMessage({ type: `${game}-resize` }, "*");
    });
  };

  feed.addEventListener("scroll", () => {
    if (feed.__vvIframeScroll) return;
    feed.__vvIframeScroll = requestAnimationFrame(() => {
      feed.__vvIframeScroll = 0;
      retryVisible();
    });
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.12) return;
          const item = entry.target.closest?.(".feed-item") || entry.target;
          const game = item?.dataset?.game;
          if (iframeGames.includes(game)) loadIframeGame(game);
        });
      },
      { root: feed, rootMargin: "80px 0px", threshold: [0.12, 0.35, 0.6] },
    );
    iframeGames.forEach((game) => {
      const frame = document.getElementById(`${game}Frame`);
      const card = document.getElementById(`${game}Card`);
      if (frame) io.observe(frame);
      if (card) io.observe(card);
    });
  }

  setTimeout(retryVisible, 400);
  setTimeout(retryVisible, 1200);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) retryVisible();
  });

  ["holeCard", "slashCard"].forEach((id) => {
    const card = document.getElementById(id);
    if (!card) return;
    const game = id.replace(/Card$/, "").toLowerCase();
    card.querySelector(".iframe-feed-shield-hint")?.addEventListener("click", (e) => {
      e.stopPropagation();
      loadIframeGame(game);
      card.classList.add("iframe-active");
    });
  });
}

function deactivateIframeCards() {
  document.querySelectorAll(".hole-card.iframe-active, .slash-card.iframe-active").forEach((card) => {
    card.classList.remove("iframe-active");
  });
}

function initIframeScrollShield() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.addEventListener(
    "scroll",
    () => {
      if (feed.__vvShieldScroll) return;
      feed.__vvShieldScroll = requestAnimationFrame(() => {
        feed.__vvShieldScroll = 0;
        deactivateIframeCards();
      });
    },
    { passive: true },
  );

  feed.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.closest(".iframe-feed-shield-hint, .card-controls, .control-btn")) return;
      deactivateIframeCards();
    },
    { passive: true },
  );
}

function initSnakeGame() {
  if (!snakeCanvas || !snakeCtx) return;
  if (!snakeBound) {
    snakeBound = true;
    if (snakeBestEl) snakeBestEl.textContent = String(snakeBest);
    snakeBuildBgCache();
    startSnakeCoverLoop();

    snakeStartBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      getAudioCtx();
      snakeStart();
    });

    snakeBackBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      snakeAlive = false;
      cancelAnimationFrame(snakeLoopId);
      stopSnakeBGM();
      snakeSetFeedLock(false);
      showSnakeScene(snakeLanding);
      startSnakeCoverLoop();
    });

  snakeCanvas.addEventListener("pointerdown", (e) => {
    if (!snakeAlive) return;
    e.preventDefault();
    e.stopPropagation();
    snakeActivePointer = e.pointerId;
    snakeSetFeedLock(true);
    snakeSteerToward(e.clientX, e.clientY);
    try { snakeCanvas.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
  });

  snakeCanvas.addEventListener("pointermove", (e) => {
    if (snakeActivePointer !== e.pointerId || !snakeAlive) return;
    e.preventDefault();
    snakeSteerToward(e.clientX, e.clientY);
  });

  const snakeEndPointer = (e) => {
    if (snakeActivePointer !== e.pointerId) return;
    snakeActivePointer = null;
    snakeSetFeedLock(false);
    try { snakeCanvas.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
  };
  snakeCanvas.addEventListener("pointerup", snakeEndPointer);
  snakeCanvas.addEventListener("pointercancel", snakeEndPointer);
  snakeCanvas.addEventListener("lostpointercapture", () => {
    snakeActivePointer = null;
    snakeSetFeedLock(false);
  });

  snakeAgainBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    snakeStart();
  });
  } else {
    startSnakeCoverLoop();
  }
}

/* ===== 通用交互 ===== */
document.querySelectorAll(".sound-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
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
    } else if (game === "beat") {
      soundState.beat ? startSnakeBGM() : stopSnakeBGM();
    } else if (game === "hole") {
      syncHoleFeedSound();
    } else if (game === "slash") {
      syncSlashFeedSound();
    }
  });
});

document.querySelectorAll(".fullscreen-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = document.getElementById(btn.dataset.target);
    if (!card) return;
    const entering = !card.classList.contains("fullscreen");

    if (entering) {
      card._fsParent = card.parentElement;
      card._fsNext = card.nextElementSibling;
      document.body.appendChild(card);
      card.classList.add("fullscreen");
    } else {
      card.classList.remove("fullscreen");
      if (card._fsParent) {
        card._fsParent.insertBefore(card, card._fsNext || null);
        delete card._fsParent;
        delete card._fsNext;
      }
    }

    document.body.classList.toggle(
      "game-fullscreen",
      !!document.querySelector(".game-card.fullscreen"),
    );

    btn.innerHTML = entering
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

/* ===== Feed optimizations: reorder, lazy init, streak ===== */

const GAME_SHARE_META = {
  home: { title: "Miniverse", text: "Free mini games in a scroll feed!", tag: "#Miniverse" },
  fortune: { title: "Daily Fortune", text: "Draw today's fortune on Miniverse", tag: "#DailyFortune" },
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
  mj: { title: "Brain Sketch", text: "Draw lines, solve physics puzzles", tag: "#BrainSketch" },
  star: { title: "Starfall", text: "Catch stars, dodge meteors", tag: "#Starfall" },
  stack: { title: "Piggy Catch", text: "Match fish & shells by the river", tag: "#PiggyCatch" },
  match: { title: "Memory Match", text: "Flip matching pairs", tag: "#MemoryMatch" },
      merge: { title: "2248 Chain", text: "Link same numbers on 5×5 — merge ×2", tag: "#2248Chain" },
  beat: { title: "Mochi Snake", text: "Swipe, eat food, chase high score", tag: "#MochiSnake" },
  hole: { title: "Sushi Black Hole", text: "Drag, combo, FEVER mode — swallow everything", tag: "#HoleSwallow" },
  slash: { title: "Fruit Slash", text: "Swipe fruit, dodge bombs, clear levels", tag: "#FruitSlash" },
};

const RECOMMEND_ORDER = ["chick", "run", "shop", "sente", "fortune", "earth", "block", "leap"];
const GAMES_ORDER = ["face", "box", "pet", "spot", "mj", "star", "stack", "match", "merge", "slash", "hole", "beat"];

const lazyInited = new Set();
let feedProgressObserver = null;

function initKnowledgeHub() {
  /* Logic in assets/financial-news-hub.js (loaded before app.js) */
}

function initFeedOptimizations() {
  polishTrustSignals();
  tagFeedItems();
  reorderFeedItems();
  // Ad injection disabled for Miniverse
  initSavedGames();
  initStreakUI();
  initFeedLazyLoad();
  initIframeFeedRetry();
  initIframeScrollShield();
  window.addEventListener("message", (e) => {
    if (e.data?.type === "hole-ready") syncHoleFeedSound();
    if (e.data?.type === "slash-ready") syncSlashFeedSound();
    if (e.data?.type === "hole-interact") {
      document.getElementById("holeCard")?.classList.toggle("iframe-active", !!e.data.active);
    }
    if (e.data?.type === "slash-interact") {
      document.getElementById("slashCard")?.classList.toggle("iframe-active", !!e.data.active);
    }
  });
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
    window.MiniverseSocial?.refresh?.();
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
  pet: "🐾", spot: "🌈", mj: "🧠", star: "⭐", stack: "🐷",
  match: "🃏", merge: "🔢", beat: "🐍", hole: "🕳️", slash: "🍉",
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
      user.innerHTML = `<span class="feed-cat-pill">${m.categoryLabel || "Game"}</span><span class="feed-cred">Miniverse editorial</span>`;
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
    const star =
      item?.querySelector(".social-btn.social-star") ||
      item?.querySelector('.stat-btn[data-action="star"]');
    star?.classList.add("saved", "is-on");
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
  stack: () => { if (!lazyInited.has("stack")) { initPiggyCatch(); lazyInited.add("stack"); } },
  mj: () => { if (!lazyInited.has("mj")) { initBrainSketch(); lazyInited.add("mj"); } },
  beat: () => { if (!lazyInited.has("beat")) { initSnakeGame(); lazyInited.add("beat"); } },
  hole: () => { if (!lazyInited.has("hole")) { initHoleFeed(); lazyInited.add("hole"); } },
  slash: () => { if (!lazyInited.has("slash")) { initSlashFeed(); lazyInited.add("slash"); } },
  merge: () => { if (!lazyInited.has("merge")) { initNumberMerge(); lazyInited.add("merge"); } },
  match: () => { if (!lazyInited.has("match")) { initMemoryMatch(); lazyInited.add("match"); } },
};

function lazyInitGame(gameId) {
  LAZY_GAME_INIT[gameId]?.();
}

function resetFeedSceneScroll() {
  document
    .querySelectorAll(
      ".feed-item:not(.hidden) [class*='-scene']:not(.hidden), .feed-item:not(.hidden) .draw-scene:not(.hidden), .feed-item:not(.hidden) .mini-scene:not(.hidden)",
    )
    .forEach((el) => {
      el.scrollTop = 0;
    });
}

function feedLazyOnTabSwitch(tabName) {
  if (tabName === "knowledge") {
    window.vvOnLearnTabActive?.();
  } else {
    window.vvEnsureGamesChunk?.();
  }
  if (tabName === "recommend") lazyInitGame("run");
  else stopRunCoverAnim();
  requestAnimationFrame(() => {
    document.querySelectorAll(`.feed-item[data-feed="${tabName}"]:not(.hidden)`).forEach((item) => {
      if (item.dataset.game) lazyInitGame(item.dataset.game);
    });
    ensureVisibleIframeGames();
    resetFeedSceneScroll();
    window.MiniverseSocial?.refresh?.();
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
  if (document.getElementById("matchMascotRows")) matchInitCover();

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
        item
          .querySelectorAll?.("[class*='-scene']:not(.hidden), .draw-scene:not(.hidden), .mini-scene:not(.hidden)")
          .forEach((el) => {
            el.scrollTop = 0;
          });
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
        `.feed-item[data-feed="${tab}"]:not(.hidden):not(.learn-feed-skip)`,
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

