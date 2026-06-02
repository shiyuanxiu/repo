/**
 * Generate local mock comment JSON per gameId (no GitHub API).
 * Run: node scripts/generate-mock-comments.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "assets", "mock-comments");

/** @type {{ id: string, name: string, feed: string, gistKey: string, mains: string[], tips: string[], replies: string[] }[]} */
const GAMES = [
  {
    id: "chick",
    name: "Squishy Chick",
    feed: "recommend",
    gistKey: "SquishyChick",
    mains: [
      "This squishy chick is ridiculously cute — five minutes in and my stress is gone 🐣✨",
      "Instant mood boost — tap, squish, repeat. Simple and oddly addictive.",
    ],
    tips: [
      "Love the squish mechanic — a volume slider for peep sounds would help when playing at work.",
      "Would love a pastel pink chick skin alongside the classic yellow one ✨",
    ],
    replies: [
      "Same here! The bounce physics feel so satisfying 😊",
      "Good call — a quick mute toggle would be perfect for commute play.",
      "You get it — best little break game on the feed 🥰",
    ],
  },
  {
    id: "run",
    name: "Neon Rush",
    feed: "recommend",
    gistKey: "NeonRush",
    mains: [
      "Neon visuals are fire — one more run always turns into ten 🔥",
      "Fast reflex game that actually feels fair. Love the lane-switch flow.",
    ],
    tips: [
      "Great pace — maybe add a practice mode without score pressure for new players.",
      "Night theme is perfect; a color-blind lane indicator option would help accessibility.",
    ],
    replies: [
      "The combo streak sound is so satisfying 😊",
      "Practice mode is a smart idea — I'd use that daily.",
      "Agreed on accessibility — neon is pretty but lanes blur together sometimes ✨",
    ],
  },
  {
    id: "shop",
    name: "Fresh Fruit Stand",
    feed: "recommend",
    gistKey: "FreshFruitStand",
    mains: [
      "Wholesome and chill — sorting fruit feels weirdly therapeutic 🍎",
      "Cute art style and easy to pick up between meetings.",
    ],
    tips: [
      "Fun loop — would be nice to save high scores per fruit type.",
      "Customer orders could show a tiny timer so rush hours feel more exciting.",
    ],
    replies: [
      "The watermelon slice animation made me smile 🥰",
      "Timer idea is good — adds stakes without stress.",
      "Therapeutic is the word — my go-to unwind game ✨",
    ],
  },
  {
    id: "sente",
    name: "Born To vs Forced To",
    feed: "recommend",
    gistKey: "BornToVsForcedTo",
    mains: [
      "Meme lines hit way too close to home 😂 sharing this with the group chat",
      "Hilarious pick-your-vibe format — perfect scroll-stopper.",
    ],
    tips: [
      "Would love a save-image button for favorite meme combos.",
      "More line packs (office vs weekend) would keep it fresh.",
    ],
    replies: [
      "Forced To energy every Monday lol 😊",
      "Save-image would make this instantly viral material ✨",
      "Office pack when?? 🥰",
    ],
  },
  {
    id: "fortune",
    name: "Daily Fortune",
    feed: "recommend",
    gistKey: "FortuneCorner",
    mains: [
      "Checked my fortune before coffee — weirdly accurate today ☕✨",
      "Cozy daily ritual. Love the soft colors and calm vibe.",
    ],
    tips: [
      "A small history of past fortunes would be a nice personal journal feature.",
      "Optional notification for daily draw could boost return visits.",
    ],
    replies: [
      "Same — mine said 'take a break' and I needed that 😊",
      "History tab would make this a keeper app 🥰",
      "The typography on the card is *chef's kiss* ✨",
    ],
  },
  {
    id: "earth",
    name: "Blue Planet Diary",
    feed: "recommend",
    gistKey: "BluePlanetDiary",
    mains: [
      "Beautiful planet facts with a diary feel — learned something new 🌍",
      "Relaxing educational scroll — great for wind-down time.",
    ],
    tips: [
      "Bookmark favorite entries would help me revisit cool facts.",
      "A map pin when a location is mentioned would deepen the immersion.",
    ],
    replies: [
      "The ocean entry today was stunning 😊",
      "Bookmark yes — I keep screenshotting instead 🥰",
      "Map pin idea is brilliant for travel lovers ✨",
    ],
  },
  {
    id: "block",
    name: "Cute Stack",
    feed: "recommend",
    gistKey: "CuteStack",
    mains: [
      "Stacking blocks has never been this adorable — clean puzzle loop 🧱✨",
      "Easy to learn, hard to put down. Perfect five-minute game.",
    ],
    tips: [
      "Ghost preview for next block placement would reduce misdrops.",
      "Leaderboard for weekly high score could add friendly competition.",
    ],
    replies: [
      "The block bounce sfx is so cute 😊",
      "Ghost preview would save my sanity on fast levels.",
      "Weekly leaderboard — I'm in 🥰",
    ],
  },
  {
    id: "leap",
    name: "Lily Pad Leap",
    feed: "recommend",
    gistKey: "LilyPadLeap",
    mains: [
      "Frog jumps feel snappy and satisfying — great arcade vibe 🐸",
      "Timing the lily pads is addictive in the best way.",
    ],
    tips: [
      "Optional haptic on each landing would feel amazing on mobile.",
      "Endless mode with rising water level could be a fun challenge mode.",
    ],
    replies: [
      "That splash animation tho ✨",
      "Haptics yes — every perfect jump should buzz 😊",
      "Endless mode would destroy my productivity 🥰",
    ],
  },
  {
    id: "face",
    name: "Runway Glow-Up",
    feed: "games",
    gistKey: "RunwayGlowUp",
    mains: [
      "Glow-up mini game is so fun — love mixing styles on the runway ✨",
      "Creative and lighthearted — perfect share-with-friends content.",
    ],
    tips: [
      "More accessory slots would unlock crazier runway looks.",
      "Export look as a PNG for social posts would be awesome.",
    ],
    replies: [
      "I made the most chaotic outfit and I'm proud 😊",
      "PNG export = instant Instagram story 🥰",
      "More accessories please — need extra sparkle ✨",
    ],
  },
  {
    id: "box",
    name: "Mystery Flavor Box",
    feed: "games",
    gistKey: "MysteryFlavorBox",
    mains: [
      "Guessing flavors is surprisingly tense — love the reveal moment 🎁",
      "Fun party-game energy in a solo scroll card.",
    ],
    tips: [
      "Hint system after two wrong guesses would help newcomers.",
      "Seasonal flavor packs (summer fruits, holiday spices) would be great.",
    ],
    replies: [
      "I guessed wrong three times and still had fun 😊",
      "Seasonal packs sound delicious ngl ✨",
      "The reveal animation is top tier 🥰",
    ],
  },
  {
    id: "pet",
    name: "Office Pets",
    feed: "games",
    gistKey: "OfficePets",
    mains: [
      "Office pets cheering me on during the workday — instant serotonin 🐾",
      "Wholesome idle vibes without being boring.",
    ],
    tips: [
      "Pet rename option would make each desk buddy feel personal.",
      "A tiny desk decoration unlock tree could extend progression.",
    ],
    replies: [
      "My cat pet is named Spreadsheet 😂😊",
      "Decoration tree — take my engagement ✨",
      "Serotonin delivery service confirmed 🥰",
    ],
  },
  {
    id: "spot",
    name: "Rainbow Salt Lake",
    feed: "games",
    gistKey: "RainbowSaltLake",
    mains: [
      "Stunning colors — feels like a mini travel postcard 🌈",
      "Calm exploration with gorgeous photo spots.",
    ],
    tips: [
      "Photo album to collect visited viewpoints would reward exploration.",
      "Light weather variations (sunset vs midday) could change the palette.",
    ],
    replies: [
      "Screenshot gallery already full on my phone ✨",
      "Sunset mode would be breathtaking 😊",
      "This is digital vacation energy 🥰",
    ],
  },
  {
    id: "mj",
    name: "Brain Sketch",
    feed: "games",
    gistKey: "BrainSketch",
    mains: [
      "Quick brain teasers that don't feel like homework — love it 🧠",
      "Sketch-style puzzles are fresh compared to typical trivia.",
    ],
    tips: [
      "Daily challenge streak with gentle reminders could build habit.",
      "Difficulty slider for kids vs adults would widen the audience.",
    ],
    replies: [
      "Got today's puzzle in two tries — feeling smart 😊",
      "Difficulty slider is a great idea for my niece ✨",
      "Sketch art direction is *so* good 🥰",
    ],
  },
  {
    id: "star",
    name: "Starfall",
    feed: "games",
    gistKey: "Starfall",
    mains: [
      "Catch the stars — simple arcade bliss with a dreamy sky ✨",
      "Night theme and particle effects are gorgeous.",
    ],
    tips: [
      "Power-up descriptions on first pickup would clarify mechanics faster.",
      "Combo multiplier UI could be slightly larger on small screens.",
    ],
    replies: [
      "Dreamy is the word — played until my battery cried 😊",
      "Bigger combo text yes — I squint on phone 🥰",
      "Star trail effects are chef's kiss ✨",
    ],
  },
  {
    id: "stack",
    name: "Piggy Catch",
    feed: "games",
    gistKey: "PiggyCatch",
    mains: [
      "Catching apples with the piggy is absurdly fun 🐷🍎",
      "Arcade timing done right — fair but challenging.",
    ],
    tips: [
      "Slow-motion on near-miss would add drama without frustration.",
      "Co-op local high score could be fun for siblings.",
    ],
    replies: [
      "The pig oink when you catch one 😊 perfection",
      "Near-miss slo-mo would be cinematic ✨",
      "My kid and I compete every night 🥰",
    ],
  },
  {
    id: "match",
    name: "Memory Match",
    feed: "games",
    gistKey: "MemoryMatch",
    mains: [
      "Classic memory match with polished cards — great brain warm-up 🃏",
      "Clean UI and satisfying flip animations.",
    ],
    tips: [
      "Timer optional mode for speedrunners would add replay value.",
      "Themed card sets (animals, food, travel) would keep it fresh.",
    ],
    replies: [
      "Beat my best time by 4 seconds — hooked 😊",
      "Food themed cards when?? ✨",
      "Flip sound is ASMR level 🥰",
    ],
  },
  {
    id: "merge",
    name: "2248 Chain",
    feed: "games",
    gistKey: "2248Chain",
    mains: [
      "Chain merges feel great — 2248 hook is real 🔗",
      "Smart puzzle design; diagonals open up fun paths.",
    ],
    tips: [
      "Undo last move (once per game) would reduce rage quits.",
      "Color contrast on high tiles could improve readability.",
    ],
    replies: [
      "Hit 512 chain and screamed quietly 😊",
      "One undo is fair — I'd use it wisely ✨",
      "Diagonal merges saved my run twice 🥰",
    ],
  },
  {
    id: "beat",
    name: "Mochi Snake",
    feed: "games",
    gistKey: "MochiSnake",
    mains: [
      "Mochi snake is adorable and plays smooth — retro done cute 🍡",
      "Snake with personality — the munch sfx are delightful.",
    ],
    tips: [
      "Wall-wrap toggle for casual mode would welcome classic players.",
      "Speed ramp curve could slow slightly after minute three for longer runs.",
    ],
    replies: [
      "Mochi head bobbing while moving 😊 I can't",
      "Wrap mode for old-school fans please ✨",
      "Delightful is understating it 🥰",
    ],
  },
];

const USERS = [
  { userId: "28471963", username: "PixelPenguin" },
  { userId: "39102847", username: "SarahDev" },
  { userId: "15783920", username: "noodleFan" },
  { userId: "44210588", username: "devMindset" },
  { userId: "22847190", username: "jake_plays" },
  { userId: "50391827", username: "EmilyCodes" },
  { userId: "61938472", username: "codeNinja42" },
  { userId: "87410293", username: "MorganRivers" },
  { userId: "33659281", username: "TylerBuilds" },
  { userId: "71290456", username: "AlexInSF" },
  { userId: "55829103", username: "JordanLee" },
  { userId: "90384712", username: "ChrisBuilds" },
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function pick(rng, arr) {
  return arr[rng() % arr.length];
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s;
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function addMinutes(base, mins) {
  const [date, time] = base.split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);
  const total = hh * 3600 + mm * 60 + ss + mins * 60;
  const nh = Math.floor(total / 3600) % 24;
  const nm = Math.floor((total % 3600) / 60);
  const ns = total % 60;
  return `${y}-${pad(m)}-${pad(d)} ${pad(nh)}:${pad(nm)}:${pad(ns)}`;
}

function avatar(userId) {
  return `https://avatars.githubusercontent.com/u/${userId}?v=4`;
}

function generateGame(game) {
  const rng = makeRng(hashSeed(game.id));
  const totalLike = 10 + (rng() % 91);
  const mainCount = 1 + (rng() % 3);
  const comments = [];
  const baseDate = "2026-06-01";
  const startHour = 8 + (rng() % 4);
  let cursorMins = startHour * 60 + (rng() % 30);

  const usedUsers = new Set();

  for (let m = 0; m < mainCount; m++) {
    let author;
    do {
      author = pick(rng, USERS);
    } while (usedUsers.has(author.userId));
    usedUsers.add(author.userId);

    const isTip = m === 1 || (mainCount === 1 && rng() % 2 === 0);
    const pool = isTip ? game.tips : game.mains;
    const content = pick(rng, pool);
    const mainId = `${game.id}-m${m + 1}-${(rng() % 9000) + 1000}`;
    const createTime = addMinutes(
      `${baseDate} ${pad(Math.floor(cursorMins / 60))}:${pad(cursorMins % 60)}:00`,
      0
    );
    cursorMins += 45 + (rng() % 60);

    comments.push({
      commentId: mainId,
      userId: author.userId,
      username: author.username,
      avatar: avatar(author.userId),
      content,
      createTime,
      replyTo: "",
    });

    const replyCount = 1 + (rng() % 3);
    let replyMins = 15 + (rng() % 20);
    for (let r = 0; r < replyCount; r++) {
      const replier = pick(rng, USERS.filter((u) => u.userId !== author.userId));
      const replyContent = pick(rng, game.replies);
      comments.push({
        commentId: `${mainId}-r${r + 1}`,
        userId: replier.userId,
        username: replier.username,
        avatar: avatar(replier.userId),
        content: replyContent,
        createTime: addMinutes(createTime, replyMins),
        replyTo: mainId,
      });
      replyMins += 12 + (rng() % 25);
    }
  }

  return { gameId: game.id, totalLike, comments };
}

mkdirSync(OUT_DIR, { recursive: true });

const manifest = {
  version: 1,
  description: "Local mock comments by feed gameId — no GitHub API",
  feeds: {
    recommend: { label: "For You", gameIds: [] },
    games: { label: "Games", gameIds: [] },
  },
  files: {},
};

for (const game of GAMES) {
  const doc = generateGame(game);
  const filename = `${game.id}.json`;
  writeFileSync(join(OUT_DIR, filename), JSON.stringify(doc, null, 2) + "\n", "utf8");
  manifest.feeds[game.feed].gameIds.push(game.id);
  manifest.files[game.id] = {
    file: filename,
    name: game.name,
    gistKey: game.gistKey,
    feed: game.feed,
    commentCount: doc.comments.length,
    totalLike: doc.totalLike,
  };
}

writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Generated ${GAMES.length} mock comment files → assets/mock-comments/`);
console.log(`For You (${manifest.feeds.recommend.gameIds.length}):`, manifest.feeds.recommend.gameIds.join(", "));
console.log(`Games (${manifest.feeds.games.gameIds.length}):`, manifest.feeds.games.gameIds.join(", "));
