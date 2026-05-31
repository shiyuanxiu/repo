export const SITE = "https://vibeverse.app";

export function gameOgImage(slug) {
  return `${SITE}/assets/og/games/${slug}.svg`;
}

export const CATEGORY_META = {
  arcade: {
    id: "arcade",
    shortName: "Arcade",
    title: "Arcade & Action Mini Games",
    emoji: "⚡",
    description:
      "Fast reflex games for adrenaline breaks — lane runners, rhythm taps, star catchers, and timing stackers. No download, instant play in your browser.",
    blurb: "Reflex runs, rhythm taps, and arcade timing games.",
    editorial: [
      "Arcade games on VibeVerse are built for the five-minute adrenaline loop: learn in one swipe, fail fast, retry instantly. Runners like Neon Rush and Starfall escalate speed without punishing you with long tutorials. Rhythm titles like Beat Tap reward headphones and focus — perfect when you want a score you can actually brag about.",
      "Our editors reach for arcade picks between tasks, on commutes, or when puzzle games feel too thoughtful. Each title includes a share card on the results screen so your personal best becomes a story, not just a number.",
    ],
    topPickSlugs: ["neon-rush", "beat-tap"],
  },
  puzzle: {
    id: "puzzle",
    shortName: "Puzzle",
    title: "Puzzle Mini Games",
    emoji: "🧩",
    description:
      "Brain-warming puzzles without harsh timers — merge tiles, match pairs, stack blocks, and chase high scores at your own pace.",
    blurb: "Merge, match, and stack puzzles for thoughtful breaks.",
    editorial: [
      "Puzzle games here skip the guilt of a hard timer. Number Merge and Memory Match let you think out loud — corner strategies, move counts, tile milestones — without a clock yelling at you. Cute Stack and Stack Rush split the difference: spatial depth with arcade timing when you want it.",
      "We recommend puzzle picks when you need a mental reset that still feels productive. Pair a merge session with coffee, or challenge a friend to beat your Memory Match move count via share card.",
    ],
    topPickSlugs: ["number-merge", "memory-match"],
  },
  chill: {
    id: "chill",
    shortName: "Chill",
    title: "Chill & Cozy Mini Games",
    emoji: "🌸",
    description:
      "Low-pressure vibes for unwinding — squeeze toys, daily fortunes, cozy shops, travel check-ins, and gentle rituals.",
    blurb: "Stress relief, daily rituals, and cozy simulation.",
    editorial: [
      "Chill is the biggest category on VibeVerse for a reason: most people open the feed to decompress, not to sweat. Squishy Chick and Daily Fortune are the gateway drugs — zero fail state, instant feedback. Blue Planet Diary and Rainbow Salt Lake nudge you toward small real-world wins and dreamy screenshots.",
      "Editors use chill picks before bed, after meetings, or when social games feel too loud. Nothing here demands an account or a perfect run — close the tab anytime and come back tomorrow for a streak point.",
    ],
    topPickSlugs: ["squishy-chick", "daily-fortune"],
  },
  social: {
    id: "social",
    shortName: "Social",
    title: "Social & Shareable Mini Games",
    emoji: "✨",
    description:
      "Games built for sharing — meme generators, runway glow-ups, and flavor guessing with instant share cards for chats and stories.",
    blurb: "Meme lines, glow-ups, and shareable moments.",
    editorial: [
      "Social games are content factories. Born To vs Forced To spits out meme lines in seconds; Runway Glow-Up turns rhythm skill into a glow-up card worth posting. Mystery Flavor Box finishes with a flavor quest summary you can share like a bingo card.",
      "We built this category for group chats and stories — not fake engagement metrics. Every share button exports an image you own; no watermark tricks, no forced login.",
    ],
    topPickSlugs: ["born-vs-forced", "runway-glow-up"],
  },
};

const CATEGORY_BY_ID = {
  chick: "chill", run: "arcade", shop: "chill", sente: "social",
  fortune: "chill", earth: "chill", block: "puzzle", leap: "arcade",
  face: "social", box: "social", pet: "chill", spot: "chill",
  mj: "chill", star: "arcade", stack: "puzzle", match: "puzzle",
  merge: "puzzle", beat: "arcade",
};

const EMOJI_BY_ID = {
  fortune: "🌸", earth: "🌍", chick: "🐣", block: "🦌", shop: "🏪",
  leap: "🐸", run: "⚡", face: "💅", box: "🎁", sente: "✨",
  pet: "🐾", spot: "🌈", mj: "🀄", star: "⭐", stack: "🧱",
  match: "🃏", merge: "🔢", beat: "🎵",
};

const RAW_GUIDES = [
  {
    slug: "squishy-chick", id: "chick", name: "Squishy Chick", tag: "#SquishyChick",
    lead: "A tap-to-squeeze stress relief toy in your browser. Pet a round chick, rack up relief points, switch skins, and try balloon pop mode — perfect for a 30-second mental reset.",
    forWho: "Great if you need a fidget-style break, want cute feedback without rules, or feel tense between tasks. Skip it if you prefer score-chasing arcade games.",
    how: "Tap Start, then press the chick repeatedly. Each tap adds relief points and emote reactions. Switch Rubber, Balloon, and Clay skins for different bounce effects. Open Achievements to track milestones.",
    tips: ["Balloon skin pops after many taps — a fun milestone.", "Steady tapping builds relief faster than random spam.", "Use Fullscreen on the card for a distraction-free session."],
    faq: [["Is Squishy Chick free?", "Yes. It runs free in your browser on VibeVerse."], ["Do I need an account?", "No download or sign-up required."], ["Is progress saved?", "Relief and taps can persist locally in your browser for the session."], ["Does it work on mobile?", "Yes — fully touch-friendly."]],
    related: [["neon-rush.html", "Neon Rush"], ["daily-fortune.html", "Daily Fortune"], ["tile-draw.html", "Tile Draw"]],
  },
  {
    slug: "neon-rush", id: "run", name: "Neon Rush", tag: "#NeonRush",
    lead: "A three-lane cyber endless runner in your browser. Swap lanes, jump, slide, collect coins, and chase distance — built for quick adrenaline breaks.",
    forWho: "Ideal for reflex lovers and high-score chasers. Less suited if you want zero-fail chill vibes.",
    how: "Tap Start Run, then use on-screen D-pad or arrow keys: left/right to change lanes, up to jump, down to slide. Avoid obstacles and survive as long as you can.",
    tips: ["Look ahead — obstacles telegraph early in each lane.", "Slide under low barriers instead of jumping late.", "Share your score from the Run Over screen."],
    faq: [["Is Neon Rush free?", "Yes, free in your browser."], ["Keyboard support?", "Arrow keys work on desktop."], ["Can I share scores?", "Yes — tap Share score after a run."], ["Mobile controls?", "On-screen D-pad buttons."]],
    related: [["starfall.html", "Starfall"], ["lily-pad-leap.html", "Lily Pad Leap"], ["beat-tap.html", "Beat Tap"]],
  },
  {
    slug: "daily-fortune", id: "fortune", name: "Daily Fortune", tag: "#DailyFortune",
    lead: "Draw a daily fortune stick online. Tap the tube, reveal a kindness prompt, and share your result — a calm ritual for starting or ending the day.",
    forWho: "Perfect for mindfulness fans and anyone wanting a gentle daily nudge. Not a predictive fortune-telling service — prompts are kind suggestions.",
    how: "Tap the fortune tube on the card. After the animation, read your prompt on the scroll. Draw Again for another line, or Share fortune to save a card.",
    tips: ["Try one fortune action per day for a simple habit.", "Share cards work great for morning social posts.", "Pair with Blue Planet Diary for real-world quests."],
    faq: [["Is this real fortune telling?", "No — light-hearted daily prompts for self-care."], ["Can I draw multiple times?", "Yes, use Draw Again anytime."], ["Share support?", "Built-in Share fortune button on results."]],
    related: [["blue-planet-diary.html", "Blue Planet Diary"], ["born-vs-forced.html", "Born To vs Forced To"], ["rainbow-salt-lake.html", "Rainbow Salt Lake"]],
  },
  {
    slug: "blue-planet-diary", id: "earth", name: "Blue Planet Diary", tag: "#BluePlanet",
    lead: "Daily random quests that nudge small real-world wins — learn a song, tidy your desk, message someone important. Complete tasks and collect feel-good rewards.",
    forWho: "For people who want playful accountability without heavy productivity apps. Best as a 2-minute daily check-in.",
    how: "Tap Random Quest to receive today's task. Mark Complete when done, then enjoy the reward animation. Share quest from the reward screen. Quest Log stores history locally.",
    tips: ["Do the quest same day for streak synergy with VibeVerse.", "Share completed quests to inspire friends.", "Quests are suggestions — adapt them to your life."],
    faq: [["Are quests personalized?", "Randomly picked from a curated list each draw."], ["Is data stored?", "Quest log saves locally in your browser."], ["Can I share?", "Yes — Share quest on the reward screen."]],
    related: [["daily-fortune.html", "Daily Fortune"], ["office-pets.html", "Office Pets"], ["play-tips.html", "../play-tips.html"]],
  },
  {
    slug: "fresh-fruit-stand", id: "shop", name: "Fresh Fruit Stand", tag: "#FruitStand",
    lead: "Run a cozy corner fruit shop in 60-second rounds. Restock shelves, serve customers, and maximize revenue — light tycoon vibes in the browser.",
    forWho: "Fans of casual shop sims and time-management lite. Good for players who like clear goals each round.",
    how: "Open Shop, restock by tapping goods then empty shelves. When customers reach checkout, tap to complete sales. Round ends after 60 seconds — review revenue and rating.",
    tips: ["Keep popular shelves full early in the round.", "Watch customer paths to prioritize restocks.", "Share your revenue from Round Complete."],
    faq: [["Round length?", "60 seconds per round."], ["Multiplayer?", "Solo only."], ["Share results?", "Share button on Round Complete screen."]],
    related: [["mystery-flavor-box.html", "Mystery Flavor Box"], ["cute-stack.html", "Cute Stack"], ["office-pets.html", "Office Pets"]],
  },
  {
    slug: "born-vs-forced", id: "sente", name: "Born To vs Forced To", tag: "#MemeLines",
    lead: "Generate relatable meme lines: Born to love X, forced to Y. Random prompts plus DIY mode — copy or share as an image card.",
    forWho: "Social scrollers, meme lovers, and anyone venting about work-life contrast. Instant content for chats.",
    how: "Tap Random for a line, or fill DIY fields and Generate mine. Copy text or Share card for a PNG with your line.",
    tips: ["DIY mode shines for inside jokes.", "Share cards look great on Instagram Stories.", "Generate a few and pick the funniest."],
    faq: [["Can I write custom lines?", "Yes — DIY mode."], ["Share format?", "PNG card via Share card button."], ["Free?", "Yes, unlimited generations."]],
    related: [["daily-fortune.html", "Daily Fortune"], ["office-pets.html", "Office Pets"], ["rainbow-salt-lake.html", "Rainbow Salt Lake"]],
  },
  {
    slug: "lily-pad-leap", id: "leap", name: "Lily Pad Leap", tag: "#LilyPadLeap",
    lead: "Charge and hop between lily pads, chain combos, collect coins, and visit the floating shop — arcade pond vibes with forgiving retry loops.",
    forWho: "Players who enjoy timing-based jumps without harsh permadeath. Good for short sessions with gradual score climbing.",
    how: "Tap Jump In, hold to charge each leap, release toward the highlighted pad. Land clean to build combo multipliers. Miss and you splash — combo resets but you keep playing.",
    tips: ["Hold longer for distant pads — watch the charge meter.", "Coins often spawn on the next target pad.", "Tap Share in the HUD to share your current score anytime."],
    faq: [["Game over on miss?", "No hard stop — splash breaks combo and you continue."], ["Shop?", "Double-tap the island icon to open Floating Shop."], ["Share?", "Share score button in the game HUD."]],
    related: [["neon-rush.html", "Neon Rush"], ["cute-stack.html", "Cute Stack"], ["starfall.html", "Starfall"]],
  },
  {
    slug: "cute-stack", id: "block", name: "Cute Stack", tag: "#CuteStack",
    lead: "Drop forest-themed blocks onto a grid, clear lines, and chase high scores — a cozy twist on classic stacking puzzles.",
    forWho: "Puzzle fans who want depth without time pressure until the grid fills. Similar appeal to merge games but spatial.",
    how: "Start the game, drag or tap to place falling blocks. Complete rows to clear them and earn points. Use power-ups like bomb and speed when unlocked. Game ends when no space remains.",
    tips: ["Keep the stack flat — holes are costly.", "Save bombs for emergency bottom rows.", "Share your final score on Game Over."],
    faq: [["Like Tetris?", "Inspired stacking mechanics with a cute forest theme."], ["Scores saved?", "Local score history in the Scores panel."], ["Share?", "Share score when Game Over appears."]],
    related: [["stack-rush.html", "Stack Rush"], ["number-merge.html", "Number Merge"], ["memory-match.html", "Memory Match"]],
  },
  {
    slug: "runway-glow-up", id: "face", name: "Runway Glow-Up", tag: "#VibeVerseGlowUp",
    lead: "Rhythm fashion mini game — tap on beat to transform from couch mode to runway queen. Share your glow-up to TikTok or Instagram.",
    forWho: "Rhythm game fans and anyone who loves shareable transformation moments. Requires listening to the beat pattern.",
    how: "Start and tap when beat markers hit the zone. Complete stages to finish the full glow-up sequence. Use dedicated share buttons after success.",
    tips: ["Listen for the repeating beat before tapping.", "Perfect hits progress faster than early spam.", "Use built-in TikTok/IG share for styled cards."],
    faq: [["Share options?", "TikTok and Instagram share buttons after a full run."], ["Keyboard?", "Space/Enter to tap on desktop."], ["Free?", "Yes."]],
    related: [["beat-tap.html", "Beat Tap"], ["neon-rush.html", "Neon Rush"], ["born-vs-forced.html", "Born To vs Forced To"]],
  },
  {
    slug: "mystery-flavor-box", id: "box", name: "Mystery Flavor Box", tag: "#FlavorGuess",
    lead: "Open mystery boxes and guess wild drink and snack flavors — from pickle sparkling water to rainbow soda. Chill guessing with instant feedback.",
    forWho: "Curious players who like novelty and humor. Great party-game energy solo.",
    how: "Tap to open boxes, read hints, and guess the flavor profile. Open all 10 for the daily complete screen. Share your flavor quest when finished.",
    tips: ["Read all three hints before guessing.", "Wild flavors are intentional — lean into the joke.", "Complete all 10 to unlock the share summary."],
    faq: [["Real products?", "Fictional flavor concepts for fun."], ["Daily limit?", "10 boxes per round — play Another Round freely."], ["Share?", "Share card after opening all boxes."]],
    related: [["fresh-fruit-stand.html", "Fresh Fruit Stand"], ["born-vs-forced.html", "Born To vs Forced To"], ["tile-draw.html", "Tile Draw"]],
  },
  {
    slug: "office-pets", id: "pet", name: "Office Pets", tag: "#PetOffice",
    lead: "Watch WFH pets act out office moods — grinding dogs, slacking cats, and more. Tap to switch scenes and unlock impressions.",
    forWho: "Anyone who loves pet memes and remote-work humor. Zero score pressure — pure vibe browsing.",
    how: "Tap the scene to cycle pets and workplace moods. Unlock scenes as you explore. No win/lose — browse at your own pace.",
    tips: ["Tap through all scenes to maximize unlock count.", "Screenshot favorite moods for sharing.", "Pair with Born To vs Forced To for meme posting."],
    faq: [["Gameplay goal?", "Explore and collect scene impressions — no timer."], ["Share?", "Screenshot or use feed Share link."], ["Mobile?", "Tap to switch works on touch."]],
    related: [["born-vs-forced.html", "Born To vs Forced To"], ["blue-planet-diary.html", "Blue Planet Diary"], ["rainbow-salt-lake.html", "Rainbow Salt Lake"]],
  },
  {
    slug: "rainbow-salt-lake", id: "spot", name: "Rainbow Salt Lake", tag: "#TravelCheckIn",
    lead: "Cloud travel check-in — browse dreamy destinations, snap polaroid check-ins, and fill your passport without leaving home.",
    forWho: "Aesthetic lovers and travel daydreamers. Ideal for screenshot sharing and calm exploration.",
    how: "Switch scenes, read captions, then Snap & Check In for a polaroid moment. Share check-in cards directly from the flash overlay.",
    tips: ["Visit every scene for a full passport feel.", "Share check-in cards right after snapping.", "Combine with play-tips for chill game recommendations."],
    faq: [["Real locations?", "Inspired scenic vibes — cloud travel theme."], ["Check-in count?", "Tracked per session in the UI."], ["Share?", "Share check-in button on the polaroid screen."]],
    related: [["blue-planet-diary.html", "Blue Planet Diary"], ["office-pets.html", "Office Pets"], ["daily-fortune.html", "Daily Fortune"]],
  },
  {
    slug: "tile-draw", id: "mj", name: "Tile Draw", tag: "#TileZen",
    lead: "Solo random tile draws with zero rules — tap the deck, reveal a tile, repeat. Digital ASMR for puzzle fans who want no pressure.",
    forWho: "Players seeking pure chill with no fail state. Not for those wanting competitive scoring.",
    how: "Tap the deck to reveal tiles one at a time. Counter tracks draws this session. Exit anytime — no penalty.",
    tips: ["Use between intense arcade rounds to reset.", "Great one-handed mobile pastime.", "No timer — stop whenever you want."],
    faq: [["Win condition?", "None — infinite draws."], ["Scoring?", "Only a draw counter, no leaderboard."], ["Share?", "Use feed Share or screenshot favorite tiles."]],
    related: [["memory-match.html", "Memory Match"], ["squishy-chick.html", "Squishy Chick"], ["daily-fortune.html", "Daily Fortune"]],
  },
  {
    slug: "starfall", id: "star", name: "Starfall", tag: "#Starfall",
    lead: "Move your basket across the night sky, catch glowing stars, and dodge meteors — classic arcade reflex in a cozy wrapper.",
    forWho: "Arcade fans who like simple controls and escalating intensity. Short runs fit commutes.",
    how: "Start and move the basket left/right (D-pad or drag). Stars add score; meteors end the run. Share score on the pause screen.",
    tips: ["Stay centered until meteors telegraph a lane.", "Rhythm of stars speeds up — stay calm.", "Share every personal best from Star Pause."],
    faq: [["Controls?", "D-pad buttons or touch drag."], ["End condition?", "Meteor hit ends the run."], ["Share?", "Share score on Star Pause screen."]],
    related: [["neon-rush.html", "Neon Rush"], ["stack-rush.html", "Stack Rush"], ["beat-tap.html", "Beat Tap"]],
  },
  {
    slug: "stack-rush", id: "stack", name: "Stack Rush", tag: "#StackRush",
    lead: "Drop sliding blocks onto a tower — misaligned edges get sliced off until the tower falls. Pure timing satisfaction.",
    forWho: "Fans of stackers like the viral tower genre. One-button gameplay, high retry value.",
    how: "Tap or press Space to drop each block when aligned over the tower. Count stacked levels until collapse. Share level count when the tower falls.",
    tips: ["Watch block speed — it stays steady per level.", "After a bad drop, play safer with smaller overhang.", "Share your best level count after each fall."],
    faq: [["Keyboard?", "Space to drop on desktop."], ["Scoring?", "Number of levels stacked."], ["Share?", "Share score on Tower fell screen."]],
    related: [["cute-stack.html", "Cute Stack"], ["starfall.html", "Starfall"], ["lily-pad-leap.html", "Lily Pad Leap"]],
  },
  {
    slug: "memory-match", id: "match", name: "Memory Match", tag: "#MemoryMatch",
    lead: "Flip cards to find matching pairs and clear the board. Train memory with a calm pace — no harsh timer.",
    forWho: "Puzzle players of all ages who like brain warm-ups without arcade stress.",
    how: "Tap cards to flip two at a time. Matching pairs stay revealed; mismatches flip back. Win when all pairs are found — share your move count.",
    tips: ["Memorize corners and edges first.", "Plan the second flip before revealing the first.", "Fewer moves means a better run — share to challenge friends."],
    faq: [["Time limit?", "No hard timer — focus on move efficiency."], ["Board size?", "6 pairs in standard mode."], ["Share?", "Share result on All pairs screen."]],
    related: [["number-merge.html", "Number Merge"], ["tile-draw.html", "Tile Draw"], ["cute-stack.html", "Cute Stack"]],
  },
  {
    slug: "number-merge", id: "merge", name: "Number Merge", tag: "#NumberMerge",
    lead: "Swipe tiles to merge numbers toward 2048 and beyond — the classic merge puzzle in your feed, no app install.",
    forWho: "Merge puzzle veterans and newcomers alike. Perfect for thoughtful breaks.",
    how: "Swipe or use arrow keys to slide tiles. Equal numbers merge into doubles. Game ends when the grid is full — share your score and highest tile.",
    tips: ["Anchor your largest tile in a corner.", "Avoid random up/down swipes — pick two primary directions.", "Share when you hit a new tile milestone."],
    faq: [["Like 2048?", "Same core merge mechanics."], ["Undo?", "No undo — classic rules."], ["Share?", "Share score on Grid full screen."]],
    related: [["memory-match.html", "Memory Match"], ["cute-stack.html", "Cute Stack"], ["fresh-fruit-stand.html", "Fresh Fruit Stand"]],
  },
  {
    slug: "beat-tap", id: "beat", name: "Beat Tap", tag: "#BeatTap",
    lead: "Four-lane rhythm taps — hit the zone when lights arrive, build combos, and chase high scores on the rails.",
    forWho: "Rhythm game enthusiasts who want a quick beat-fix. Pairs well with Runway Glow-Up.",
    how: "Start and tap the lane when its note hits the bottom target. Miss too many beats and the run ends. Share your score on Rhythm broken.",
    tips: ["Assign each lane a finger on mobile.", "Watch the lead lane to predict patterns.", "Headphones help for timing precision."],
    faq: [["Lanes?", "Four parallel rhythm lanes."], ["End condition?", "Too many missed beats breaks the run."], ["Share?", "Share score on Rhythm broken screen."]],
    related: [["runway-glow-up.html", "Runway Glow-Up"], ["neon-rush.html", "Neon Rush"], ["starfall.html", "Starfall"]],
  },
];

const EDITOR_PICK_BY_ID = {
  fortune: "Editor's pick: one tap, one kind line — the softest daily ritual on the feed.",
  earth: "Editor's pick: a real-world quest small enough to finish before your coffee cools.",
  chick: "Editor's pick: zero rules, pure squeeze — our #1 stress reset.",
  block: "Editor's pick: cozy stacking depth without a timer shouting at you.",
  shop: "Editor's pick: 60 seconds of shop chaos — clear goal, instant replay.",
  leap: "Editor's pick: forgiving jumps and combo highs — arcade without rage-quit.",
  run: "Editor's pick: if you try one runner today, make it Neon Rush.",
  face: "Editor's pick: rhythm meets glow-up — built for share cards.",
  box: "Editor's pick: wild flavor humor solo — party energy, zero stakes.",
  sente: "Editor's pick: instant meme lines for group chats.",
  pet: "Editor's pick: WFH pet moods — browse, screenshot, repeat.",
  spot: "Editor's pick: dreamy check-ins you'll want to screenshot.",
  mj: "Editor's pick: ASMR tile draws — the palate cleanser between intense games.",
  star: "Editor's pick: classic catch-and-dodge — easy start, hard stop.",
  stack: "Editor's pick: one button, one more try — pure stacker satisfaction.",
  match: "Editor's pick: calm memory training — no clock, just move count.",
  merge: "Editor's pick: the 2048 fix with no app install required.",
  beat: "Editor's pick: four-lane rhythm when you want a real score chase.",
};

const HIGHLIGHT_BY_ID = {
  fortune: "Not fortune-telling — a kindness nudge you can act on today.",
  earth: "Playful accountability: one small win in the real world.",
  chick: "Thirty seconds of squeeze therapy beats scrolling.",
  block: "Spatial puzzle calm until the grid fills — then share your score.",
  shop: "Tycoon lite: restock, serve, count your revenue.",
  leap: "Charge, hop, combo — the pond forgives a splash.",
  run: "Three lanes, one distance number worth chasing.",
  face: "Couch mode to runway queen on the beat.",
  box: "Ten wild flavors — guess, laugh, share the quest.",
  sente: "Born to love X, forced to Y — relatable in one line.",
  pet: "Office moods through pet eyes — no win condition needed.",
  spot: "Cloud travel check-ins with polaroid share cards.",
  mj: "Infinite draws, zero pressure — digital tile zen.",
  star: "Catch stars, dodge meteors, share the high score.",
  stack: "Misaligned edges get sliced until the tower falls.",
  match: "Six pairs, your move count is the flex.",
  merge: "Corner your biggest tile and swipe with intent.",
  beat: "Hit the zone when the lights arrive — combo or bust.",
};

export const GUIDES = RAW_GUIDES.map((g) => ({
  ...g,
  category: CATEGORY_BY_ID[g.id],
  emoji: EMOJI_BY_ID[g.id],
  editorPick: EDITOR_PICK_BY_ID[g.id] || g.lead.slice(0, 90),
  highlight: HIGHLIGHT_BY_ID[g.id] || g.lead.slice(0, 100),
}));

export function guidesByCategory(cat) {
  return GUIDES.filter((g) => g.category === cat);
}

export function guideById(id) {
  return GUIDES.find((g) => g.id === id);
}
