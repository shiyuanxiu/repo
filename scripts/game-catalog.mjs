export const SITE = "https://miniverse.gg";

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
      "Arcade games on Miniverse are built for the five-minute adrenaline loop: learn in one swipe, fail fast, retry instantly. Runners like Neon Rush and Starfall escalate speed without punishing you with long tutorials. Score-chasers like Mochi Snake reward quick reflexes — perfect when you want a number worth bragging about.",
      "Our editors reach for arcade picks between tasks, on commutes, or when puzzle games feel too thoughtful. Each title includes a share card on the results screen so your personal best becomes a story, not just a number.",
    ],
    topPickSlugs: ["neon-rush", "snake-bite"],
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
      "Puzzle games here skip the guilt of a hard timer. 2248 Chain and Memory Match let you think out loud — chain links, move counts, tile milestones — without a clock yelling at you. Cute Stack and Stack Rush split the difference: spatial depth with arcade timing when you want it.",
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
      "Chill is the biggest category on Miniverse for a reason: most people open the feed to decompress, not to sweat. Squishy Chick and Daily Fortune are the gateway drugs — zero fail state, instant feedback. Blue Planet Diary and Rainbow Salt Lake nudge you toward small real-world wins and dreamy screenshots.",
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
  merge: "puzzle", beat: "arcade", hole: "arcade", slash: "arcade",
};

const EMOJI_BY_ID = {
  fortune: "🌸", earth: "🌍", chick: "🐣", block: "🦌", shop: "🏪",
  leap: "🐸", run: "⚡", face: "💅", box: "🎁", sente: "✨",
  pet: "🐾", spot: "🌈", mj: "🧠", star: "⭐", stack: "🧱",
  match: "🃏", merge: "🔢", beat: "🐍", hole: "🕳️", slash: "🍉",
};

const RAW_GUIDES = [
  {
    slug: "squishy-chick", id: "chick", name: "Squishy Chick", tag: "#SquishyChick",
    lead: "A tap-to-squeeze stress relief toy in your browser. Pet a round chick, rack up relief points, switch skins, and try balloon pop mode — perfect for a 30-second mental reset.",
    forWho: "Great if you need a fidget-style break, want cute feedback without rules, or feel tense between tasks. Skip it if you prefer score-chasing arcade games.",
    how: "Tap Start, then press the chick repeatedly. Each tap adds relief points and emote reactions. Switch Rubber, Balloon, and Clay skins for different bounce effects. Open Achievements to track milestones.",
    tips: ["Balloon skin pops after many taps — a fun milestone.", "Steady tapping builds relief faster than random spam.", "Use Fullscreen on the card for a distraction-free session."],
    faq: [["Is Squishy Chick free?", "Yes. It runs free in your browser on Miniverse."], ["Do I need an account?", "No download or sign-up required."], ["Is progress saved?", "Relief and taps can persist locally in your browser for the session."], ["Does it work on mobile?", "Yes — fully touch-friendly."]],
    related: [["neon-rush.html", "Neon Rush"], ["daily-fortune.html", "Daily Fortune"], ["brain-sketch.html", "Brain Sketch"]],
  },
  {
    slug: "neon-rush", id: "run", name: "Neon Rush", tag: "#NeonRush",
    lead: "A three-lane cyber endless runner in your browser. Swap lanes, jump, slide, collect coins, and chase distance — built for quick adrenaline breaks.",
    forWho: "Ideal for reflex lovers and high-score chasers. Less suited if you want zero-fail chill vibes.",
    how: "Tap Start Run, then use on-screen D-pad or arrow keys: left/right to change lanes, up to jump, down to slide. Avoid obstacles and survive as long as you can.",
    tips: ["Look ahead — obstacles telegraph early in each lane.", "Slide under low barriers instead of jumping late.", "Share your score from the Run Over screen."],
    faq: [["Is Neon Rush free?", "Yes, free in your browser."], ["Keyboard support?", "Arrow keys work on desktop."], ["Can I share scores?", "Yes — tap Share score after a run."], ["Mobile controls?", "On-screen D-pad buttons."]],
    related: [["starfall.html", "Starfall"], ["lily-pad-leap.html", "Lily Pad Leap"], ["snake-bite.html", "Mochi Snake"]],
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
    tips: ["Do the quest same day for streak synergy with Miniverse.", "Share completed quests to inspire friends.", "Quests are suggestions — adapt them to your life."],
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
    related: [["stack-rush.html", "Stack Rush"], ["number-merge.html", "2248 Chain"], ["memory-match.html", "Memory Match"]],
  },
  {
    slug: "runway-glow-up", id: "face", name: "Runway Glow-Up", tag: "#VibeVerseGlowUp",
    lead: "Rhythm fashion mini game — tap on beat to transform from couch mode to runway queen. Share your glow-up to TikTok or Instagram.",
    forWho: "Rhythm game fans and anyone who loves shareable transformation moments. Requires listening to the beat pattern.",
    how: "Start and tap when beat markers hit the zone. Complete stages to finish the full glow-up sequence. Use dedicated share buttons after success.",
    tips: ["Listen for the repeating beat before tapping.", "Perfect hits progress faster than early spam.", "Use built-in TikTok/IG share for styled cards."],
    faq: [["Share options?", "TikTok and Instagram share buttons after a full run."], ["Keyboard?", "Space/Enter to tap on desktop."], ["Free?", "Yes."]],
    related: [["snake-bite.html", "Mochi Snake"], ["neon-rush.html", "Neon Rush"], ["born-vs-forced.html", "Born To vs Forced To"]],
  },
  {
    slug: "mystery-flavor-box", id: "box", name: "Mystery Flavor Box", tag: "#FlavorGuess",
    lead: "Open mystery boxes and guess wild drink and snack flavors — from pickle sparkling water to rainbow soda. Chill guessing with instant feedback.",
    forWho: "Curious players who like novelty and humor. Great party-game energy solo.",
    how: "Tap to open boxes, read hints, and guess the flavor profile. Open all 10 for the daily complete screen. Share your flavor quest when finished.",
    tips: ["Read all three hints before guessing.", "Wild flavors are intentional — lean into the joke.", "Complete all 10 to unlock the share summary."],
    faq: [["Real products?", "Fictional flavor concepts for fun."], ["Daily limit?", "10 boxes per round — play Another Round freely."], ["Share?", "Share card after opening all boxes."]],
    related: [["fresh-fruit-stand.html", "Fresh Fruit Stand"], ["born-vs-forced.html", "Born To vs Forced To"], ["brain-sketch.html", "Brain Sketch"]],
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
    slug: "brain-sketch", id: "mj", name: "Brain Sketch", tag: "#BrainSketch",
    lead: "Draw lines and shapes on the canvas — they become real physics objects. Use gravity and collisions to roll the ball into the star. Short brain-teaser levels, zero download.",
    forWho: "Fans of physics puzzlers like Brain It On. Quick levels, creative solutions, share-worthy aha moments.",
    how: "Draw up to 3 strokes on the blue canvas, then tap Go. Your lines turn solid — the ball falls, rolls, and bounces. Clear the level when the ball hits the star.",
    tips: ["Start with a gentle ramp — steep lines can launch the ball off-screen.", "Use two strokes on later levels: one ramp, one wall bounce.", "Tap Clear to erase and rethink without leaving the card."],
    faq: [["How many draws?", "Up to 3 strokes per level."], ["Fail state?", "Ball falls off — tap Clear and try again."], ["Levels?", "5 puzzles, then loop from the start."]],
    related: [["memory-match.html", "Memory Match"], ["number-merge.html", "2248 Chain"], ["cute-stack.html", "Cute Stack"]],
  },
  {
    slug: "starfall", id: "star", name: "Starfall", tag: "#Starfall",
    lead: "Move your basket across the night sky, catch glowing stars, and dodge meteors — classic arcade reflex in a cozy wrapper.",
    forWho: "Arcade fans who like simple controls and escalating intensity. Short runs fit commutes.",
    how: "Start and move the basket left/right (D-pad or drag). Stars add score; meteors end the run. Share score on the pause screen.",
    tips: ["Stay centered until meteors telegraph a lane.", "Rhythm of stars speeds up — stay calm.", "Share every personal best from Star Pause."],
    faq: [["Controls?", "D-pad buttons or touch drag."], ["End condition?", "Meteor hit ends the run."], ["Share?", "Share score on Star Pause screen."]],
    related: [["neon-rush.html", "Neon Rush"], ["stack-rush.html", "Stack Rush"], ["snake-bite.html", "Mochi Snake"]],
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
    related: [["number-merge.html", "2248 Chain"], ["brain-sketch.html", "Brain Sketch"], ["cute-stack.html", "Cute Stack"]],
  },
  {
    slug: "number-merge", id: "merge", name: "2248 Chain", tag: "#2248Chain",
    lead: "Link matching numbers on a 5×5 grid, merge ×2, chase 1024+ — no app install, zero ads.",
    forWho: "Merge puzzle fans who want satisfying chains without a timer. Perfect for commutes and coffee breaks.",
    how: "Drag through adjacent tiles with the same number (any angle). Link 2 or more, then release to merge ×2. A random 2 or 4 spawns after each merge. Game ends when no matches remain — share your score.",
    tips: ["Build long chains before you release — every linked tile counts.", "Anchor your largest tile in a corner and grow toward it.", "Watch for milestone pops at 128, 256, 512, and 1024."],
    faq: [["Like 2248?", "Same link-and-merge energy — drag chains on a 5×5 grid instead of swiping the whole board."], ["Undo?", "No undo — commit to your chain."], ["Share?", "Share score from the feed card or fullscreen view."]],
    related: [["memory-match.html", "Memory Match"], ["cute-stack.html", "Cute Stack"], ["fresh-fruit-stand.html", "Fresh Fruit Stand"]],
  },
  {
    slug: "snake-bite", id: "beat", name: "Mochi Snake", tag: "#MochiSnake",
    lead: "Cute mochi caterpillar snake — tap to steer through a watercolor meadow, eat snacks for 1/5/10 points, dodge rival snakes.",
    forWho: "Classic snake fans who want cozy hand-drawn vibes. One-thumb tap steering — no D-pad needed.",
    how: "Tap Start, then tap or drag on the meadow to steer toward food. Eat snacks to grow and score — higher values are rarer. Avoid walls, your tail, and rival snakes. Share your score from the game-over screen.",
    tips: ["Early rounds stay calm — fewer snacks until you score more.", "Plan two moves ahead — speed increases as you score.", "Grab 10pt duck only when you have a safe escape route.", "Use Fullscreen for a taller meadow on small screens."],
    faq: [["Food values?", "Common snacks 1pt, spring rolls and mooncakes 5pt, roast duck 10pt."], ["Controls?", "Tap or drag on the meadow — snake steers toward your finger."], ["Rivals?", "Colored rival snakes spawn over time — touching one ends your run."], ["Share?", "Share score on the game-over screen or via the feed button."]],
    related: [["neon-rush.html", "Neon Rush"], ["starfall.html", "Starfall"], ["stack-rush.html", "Stack Rush"]],
  },
  {
    slug: "hole-swallow", id: "hole", name: "Sushi Black Hole", tag: "#HoleSwallow",
    lead: "Drag a glowing black hole across a sushi table — swallow nigiri, ramen, maki rolls, and golden teapots. Chain combos, trigger FEVER mode, and climb levels with run history saved locally.",
    forWho: "Hole.io fans and anyone who loves satisfying swallow physics with score multipliers. One-finger drag — instant fun.",
    how: "Tap Start Swallowing, drag the hole toward food. Bigger items need a larger hole. Build combos within 2.2s for x2–x8 multipliers. Golden teapot adds time. Tap Next level after each round — difficulty ramps. Open History anytime to review past runs.",
    tips: ["Swallow many small sushi first to grow before tackling maki.", "FEVER at 8 combos doubles all points — keep the chain alive.", "Golden teapots add +4 seconds — grab them when the timer is low.", "Check Run History from the 📋 button or end screen."],
    faq: [["Combo rules?", "3+ swallows within 2.2s start multipliers — up to x8, FEVER at 8."], ["History saved?", "Yes — last 40 runs in your browser (History button)."], ["Levels?", "Each Next level adds more food, less time, higher rewards."], ["Share?", "Share score from the end screen or feed card."]],
    related: [["snake-bite.html", "Mochi Snake"], ["starfall.html", "Starfall"], ["number-merge.html", "2248 Chain"]],
  },
  {
    slug: "fruit-slash", id: "slash", name: "Fruit Slash", tag: "#FruitSlash",
    lead: "Swipe to slice flying fruit on a bamboo board — dodge bombs, chain combos, trigger FEVER mode, and clear level score targets. Run history saved locally.",
    forWho: "Fruit Ninja fans who want instant browser play with level progression and juicy feedback. One-finger swipe slicing.",
    how: "Tap Start Slicing, swipe through fruit as they fly up. Miss a fruit or hit a bomb = lose a life (3 total). Reach the level target score to advance — each level spawns faster with more bombs. Open History anytime.",
    tips: ["Slice star fruit for +80 bonus points.", "Build 8+ combo for FEVER — double points and golden slash trail.", "Don't chase bombs — one swipe costs a life.", "Check the bottom bar for SCORE, TARGET, and LIVES."],
    faq: [["Like Fruit Ninja?", "Same swipe-to-slice core with levels, combos, and local run history."], ["Levels?", "Each level has a score target — clear it to unlock the next, harder stage."], ["History?", "Last 40 runs saved in browser — tap History on end screen."], ["Share?", "Share score from level clear or game over screen."]],
    related: [["fresh-fruit-stand.html", "Fresh Fruit Stand"], ["snake-bite.html", "Mochi Snake"], ["hole-swallow.html", "Sushi Black Hole"]],
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
  mj: "Editor's pick: draw shapes, watch physics solve the puzzle — short levels, big brain energy.",
  star: "Editor's pick: classic catch-and-dodge — easy start, hard stop.",
  stack: "Editor's pick: one button, one more try — pure stacker satisfaction.",
  match: "Editor's pick: calm memory training — no clock, just move count.",
  merge: "Editor's pick: link matching digits on a 5×5 grid — zero ads, pure merge dopamine.",
  beat: "Editor's pick: cute pill snake — swipe, eat coins, chase high score.",
  hole: "Editor's pick: drag, swallow, combo — FEVER mode is pure dopamine.",
  slash: "Editor's pick: swipe, juice splatter, level targets — instant Fruit Ninja fix.",
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
  merge: "Longer chains = bigger merges. Corner your highest tile early.",
  beat: "Swipe, eat coins, grow faster — five pill crew colors to meet.",
  hole: "Chain swallows, hit FEVER, golden teapot adds time — check your run history.",
  slash: "Swipe flying fruit, dodge bombs, clear level targets — FEVER at 8 combo.",
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
