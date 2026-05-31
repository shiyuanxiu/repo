from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]

js = (root / "app.js").read_text(encoding="utf-8")

sente = """const SENTE_LIST = [
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
];"""

js = re.sub(r"const SENTE_LIST = \[[\s\S]*?\];", sente, js, count=1)

box_flavors = """const BOX_FLAVORS = [
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
];"""

js = re.sub(r"const BOX_FLAVORS = \[[\s\S]*?\];", box_flavors, js, count=1)
js = js.replace('const BOX_GUESS_OPTS = ["酸到皱眉", "甜到发懵", "辣到上头", "猎奇暴击", "意外真香", "黑暗料理"];', 'const BOX_GUESS_OPTS = ["Sour punch", "Sugar rush", "Spicy kick", "Wild hit", "Pleasant surprise", "Chaos food"];')
js = js.replace('const map = { 酸: "酸到皱眉", 甜: "甜到发懵", 辣: "辣到上头", 猎奇: "猎奇暴击", 苦: "苦到怀疑", 咸: "咸香上头", 清新: "意外真香", 上头: "越吃越上头", 童年: "童年回忆", 气泡: "气泡炸裂" };', 'const map = { sour: "Sour punch", sweet: "Sugar rush", spicy: "Spicy kick", wild: "Wild hit", bitter: "Bitter doubt", salty: "Savory hit", fresh: "Pleasant surprise", addictive: "More please", nostalgia: "Nostalgia", fizz: "Fizz burst" };')
js = js.replace('return map[t] || "意外真香";', 'return map[t] || "Pleasant surprise";')
js = js.replace('const tagMap = { 酸到皱眉: "酸", 甜到发懵: "甜", 辣到上头: "辣", 猎奇暴击: "猎奇", 意外真香: "清新", 黑暗料理: "猎奇", 苦到怀疑: "苦", 咸香上头: "咸", 越吃越上头: "上头", 童年回忆: "童年", 气泡炸裂: "气泡" };', 'const tagMap = { "Sour punch": "sour", "Sugar rush": "sweet", "Spicy kick": "spicy", "Wild hit": "wild", "Pleasant surprise": "fresh", "Chaos food": "wild", "Bitter doubt": "bitter", "Savory hit": "salty", "More please": "addictive", "Nostalgia": "nostalgia", "Fizz burst": "fizz" };')
js = js.replace('? `🎯 猜中了！实际：${flavor.taste} — ${flavor.desc}`', '? `🎯 Correct! ${flavor.taste} — ${flavor.desc}`')
js = js.replace(': `😏 其实更偏「${flavor.taste}」— ${flavor.desc}`;', ': `😏 Closer to ${flavor.taste} — ${flavor.desc}`;')
js = js.replace('if (boxTypeHint) boxTypeHint.textContent = flavor.type === "drink" ? "饮品" : "零食";', 'if (boxTypeHint) boxTypeHint.textContent = flavor.type === "drink" ? "Drink" : "Snack";')
js = js.replace('if (boxFlavorCat) boxFlavorCat.textContent = flavor.cat + "盲盒";', 'if (boxFlavorCat) boxFlavorCat.textContent = flavor.cat + " Mystery";')
js = js.replace('if (boxFlavorDesc) boxFlavorDesc.textContent = `线索：${flavor.hints.join(" · ")}`;', 'if (boxFlavorDesc) boxFlavorDesc.textContent = `Hints: ${flavor.hints.join(" · ")}`;')
js = js.replace('leapCtx.fillText(`连 x${leapCombo}`, fx, fy - 28);', 'leapCtx.fillText(`x${leapCombo}`, fx, fy - 28);')
js = js.replace('showComboPop(`连跳 x${leapCombo}  +${pts}`);', 'showComboPop(`Combo x${leapCombo}  +${pts}`);')
js = js.replace('if (leapCombo >= 3) showComboPop(`连跳断了 x${leapCombo}`);', 'if (leapCombo >= 3) showComboPop(`Combo broke x${leapCombo}`);')
js = js.replace('else if (leapRainMin > 0) leapRainEl.textContent = `微雨 ${leapRainMin}分`;', 'else if (leapRainMin > 0) leapRainEl.textContent = `Drizzle ${leapRainMin}m`;')
js = js.replace('senteText.innerHTML = text.replace("，", "<br>");', 'senteText.innerHTML = text.replace(/, forced to /, "<br>forced to ");')

(root / "app.js").write_text(js, encoding="utf-8")

html = (root / "index.html").read_text(encoding="utf-8")
fixes = [
    ("点击签筒，抽取Daily Fortune", "Tap the tube to draw today's fortune"),
    ("Blue Planet Diary·每日任务站", "Blue Planet · Daily Quests"),
    ("← Back游戏", "← Back to Game"),
    ("累计Relief达到100", "Reach 100 relief points"),
    ("让Balloon爆炸", "Pop the balloon chick"),
    ("当前Relief", "Relief now"),
    ("总Taps", "Total taps"),
    ("还没有挑战Log哦", "No scores yet"),
    ("Cute Stack·森系版", "Cute Stack · Forest"),
    ("把可爱木块堆整齐，挑战更高Score", "Stack blocks clean, chase high scores"),
    ("Fresh Fruit Stand·经营小记", "Fresh Fruit Stand · Tycoon"),
    ("长按蓄力，跃向亮叶｜Combo越高分越多", "Hold to charge · bright pads · chain combos"),
    ("Lily Pad Leap·水塘篇", "Lily Pad Leap · Pond"),
    ("长按蓄力跃荷叶，收集Coins装扮你的小蛙", "Charge, hop pads, collect coins for your frog"),
    ("Neon Rush·霓虹篇", "Neon Rush · Cyber"),
    ("三条光道狂奔，闪避障碍拾取Coins", "Three lanes — dodge and collect coins"),
    ("Start开盒", "Start Unboxing"),
    ("🥒 酸黄瓜", "🥒 Pickle"),
    ("🥤 混合汽水", "🥤 Soda mix"),
    ("🍫 巧克力", "🍫 Chocolate"),
    ("🌶️ 猎奇", "🌶️ Wild"),
    ("已抽", "Picked"),
    ('aria-label="盲盒"', 'aria-label="Mystery box"'),
    ("点击抽取，看看今天什么口味", "Tap to draw — what's today's flavor?"),
    ("饮品盲盒", "Drink Mystery"),
    ("混合汽水", "Rainbow Soda"),
    ("猜猜口感是？", "Guess the taste?"),
    ("🎁 抽取盲盒", "🎁 Draw Box"),
    ("下一盒 →", "Next →"),
    ("10 盒开完啦！", "All 10 boxes opened!"),
    ("今日猎奇口味体验达成", "Daily wild flavor quest complete"),
    ("网红猎奇口味，开盒猜口感超解压", "Wild flavors — guess the taste, instant chill"),
    ("味蕾实验室", "Flavor Lab"),
    ("Born To vs Forced To造句", "Born To vs Forced To"),
    ("Born to love  XX, forced to 做 XX", "Born to love XX, forced to do XX"),
    ("点击生成，收获今日嘴替", "Tap generate for today's line"),
    ("✨ 随机生成", "✨ Random"),
    ("📋 摘抄", "📋 Copy"),
    ("自己续写：", "Write your own:"),
    ("被迫做", "forced to "),
    ('placeholder="刷短视频"', 'placeholder="scroll reels"'),
    ('placeholder="写周报"', 'placeholder="write reports"'),
    ("生成我的版本", "Generate mine"),
    (" orders人玩梗解压", " solo meme relief"),
    ("嘴替小站", "Meme Lines"),
    ('aria-label="萌宠场景"', 'aria-label="Office pets"'),
    ("梦幻", "Dreamy"),
    ('aria-label="盐湖场景"', 'aria-label="Salt lake"'),
    ('alt="打卡照片"', 'alt="Check-in photo"'),
    ("加州Rainbow Salt Lake打卡", "Rainbow Salt Lake Check-in"),
    (" orders人随机抽牌，纯休闲无规则", " Solo random draws, no rules"),
    ("🀄 Draw Tile牌", "🀄 Draw Tile"),
    (" orders人麻将摸牌", "Solo Tile Draw"),
    ("星落拾光", "Starfall"),
    ("接住星光，躲开陨石", "Catch stars, dodge meteors"),
    ("▶ Start接星", "▶ Start"),
    ('aria-label="接星星"', 'aria-label="Catch stars"'),
    ("星光暂歇", "Star Pause"),
    ("晚风拾星", "Night Breeze"),
    ("看准时机，把方块叠上去", "Time your drops, stack higher"),
    ("▶ Start叠层", "▶ Start"),
    ("层数", "Level"),
    ('aria-label="叠方块"', 'aria-label="Stack blocks"'),
    ("点击翻开相同图案", "Flip matching pairs"),
    ("▶ Start配对", "▶ Start"),
    ("滑动合并相同数字", "Swipe to merge numbers"),
    ("▶ Start合并", "▶ Start"),
    ("跟着节拍点击光点", "Tap lights on beat"),
    ("▶ Start节拍", "▶ Start"),
]
for a, b in fixes:
    html = html.replace(a, b)
html = html.replace(" orders", " Solo")

(root / "index.html").write_text(html, encoding="utf-8")
print("fix pass done")
