# Localize app.js game strings to English
from pathlib import Path
import re

p = Path(__file__).resolve().parents[1] / "app.js"
text = p.read_text(encoding="utf-8")

# FORTUNES
text = text.replace(
    """const FORTUNES = [
  "尝试一道新的食谱", "给重要的人发一条消息", "今天早点睡觉",
  "出门散步15分钟", "整理一下桌面", "听一首没听过的歌",
  "写三件今天感恩的事", "喝一杯温水", "读10页书", "做5分钟拉伸",
  "拍一张今天的天空", "尝试一种新的茶或咖啡", "关掉手机休息30分钟",
  "给房间添一束花或绿植", "学习一个新单词", "微笑面对遇到的第一个人",
  "清理手机相册100张", "做一件拖延很久的小事", "对自己说一句鼓励的话",
  "计划一次短途出行",
];""",
    """const FORTUNES = [
  "Try a new recipe", "Message someone important", "Sleep early tonight",
  "Walk outside for 15 minutes", "Tidy your desk", "Listen to a new song",
  "Write three things you're grateful for", "Drink a glass of water", "Read 10 pages", "Stretch for 5 minutes",
  "Photo today's sky", "Try a new tea or coffee", "Phone off for 30 minutes",
  "Add flowers or a plant to your room", "Learn a new word", "Smile at the first person you meet",
  "Delete 100 photos from your camera roll", "Do one thing you've been putting off", "Say something kind to yourself",
  "Plan a short trip",
];""",
)

text = text.replace(
    """const EARTH_TASKS = [
  "学习一个童谣", "给重要的人发一条消息", "出门散步15分钟",
  "写三件今天感恩的事", "尝试一道新的食谱", "读10页书",
  "微笑面对遇到的第一个人", "做5分钟拉伸", "整理一下桌面",
  "听一首没听过的歌", "拍一张今天的天空", "对自己说一句鼓励的话",
  "喝一杯温水", "关掉手机休息30分钟", "学习一个新单词",
  "做一件拖延很久的小事", "给房间添一束花或绿植", "计划一次短途出行",
];""",
    """const EARTH_TASKS = [
  "Learn a nursery rhyme", "Message someone important", "Walk outside for 15 minutes",
  "Write three grateful things", "Try a new recipe", "Read 10 pages",
  "Smile at the first person you meet", "Stretch for 5 minutes", "Tidy your desk",
  "Listen to a new song", "Photo today's sky", "Say something kind to yourself",
  "Drink a glass of water", "Phone off for 30 minutes", "Learn a new word",
  "Do one delayed task", "Add flowers or a plant", "Plan a short trip",
];""",
)

replacements = [
    ('const CHICK_EMOTES = ["嘿嘿~", "好舒服呀♡", "再挤挤~", "呜哇!", "超解压!", "开心~", "噗叽~", "好爽!!"];',
     'const CHICK_EMOTES = ["Hehe~", "So nice♡", "More!", "Whoa!", "So good!", "Yay~", "Squish~", "Yes!!"];'),
    ('const CHICK_COMBO_EMOTES = ["啊啊啊!!", "停不下来~", "太解压了!!", "嘿嘿嘿嘿~"];',
     'const CHICK_COMBO_EMOTES = ["Ahhh!!", "Can\'t stop~", "So satisfying!!", "Hehehe~"];'),
    ('if (confirm("确定重置解压值和点击次数吗？")) resetChickGame();',
     'if (confirm("Reset relief points and tap count?")) resetChickGame();'),
    ('blockHistoryBest.textContent = `最高得分 ${best}`;', 'blockHistoryBest.textContent = `Best ${best}`;'),
    ('over: "本局结束"', 'over: "Game over"'),
    ('restart: "手动重来"', 'restart: "Restart"'),
    ('exit: "返回退出"', 'exit: "Exit"'),
    ('li.innerHTML = `<span>${score} 分 · ${reasonLabel[reason] || "挑战"}</span><span>${time}</span>`;',
     'li.innerHTML = `<span>${score} pts · ${reasonLabel[reason] || "Run"}</span><span>${time}</span>`;'),
    ('{ id: "apple", emoji: "🍎", price: 5, cost: 2, name: "鲜苹果" }', '{ id: "apple", emoji: "🍎", price: 5, cost: 2, name: "Apple" }'),
    ('{ id: "bread", emoji: "🍞", price: 8, cost: 3, name: "软面包" }', '{ id: "bread", emoji: "🍞", price: 8, cost: 3, name: "Bread" }'),
    ('{ id: "milk", emoji: "🥛", price: 12, cost: 5, name: "纯牛奶" }', '{ id: "milk", emoji: "🥛", price: 12, cost: 5, name: "Milk" }'),
    ('{ id: "egg", emoji: "🥚", price: 15, cost: 6, name: "农家蛋" }', '{ id: "egg", emoji: "🥚", price: 15, cost: 6, name: "Eggs" }'),
    ('? `已选 ${p.name}，点空货架补货（进价 $${p.cost}）`', '? `Selected ${p.name} — tap empty shelf (cost $${p.cost})`'),
    (': "点选商品，再点货架补货";', ': "Tap goods, then shelf to stock";'),
    ('shopTrayHint.textContent = "货架已备好货，客人马上就来～";', 'shopTrayHint.textContent = "Stocked up — customers incoming~";'),
    ('shopTrayHint.textContent = shopMoney < p.cost ? "金币不够进货啦" : "这个货架已有商品";',
     'shopTrayHint.textContent = shopMoney < p.cost ? "Not enough gold" : "Shelf already stocked";'),
    ('shopTrayHint.textContent = `${p.name} 已上架`;', 'shopTrayHint.textContent = `${p.name} stocked`;'),
    ('{ id: "hat", name: "荷叶帽", emoji: "🍃", cost: 1 }', '{ id: "hat", name: "Leaf Hat", emoji: "🍃", cost: 1 }'),
    ('{ id: "bow", name: "荷露结", emoji: "💧", cost: 1 }', '{ id: "bow", name: "Dew Bow", emoji: "💧", cost: 1 }'),
    ('{ id: "star", name: "萤光斑", emoji: "✨", cost: 1 }', '{ id: "star", name: "Firefly Spot", emoji: "✨", cost: 1 }'),
    ('leapHint.textContent = "存档成功 ✓";', 'leapHint.textContent = "Saved ✓";'),
    ('setTimeout(() => { leapHint.textContent = "长按蓄力，跃向亮叶｜连跳越高分越多"; }, 1200);',
     'setTimeout(() => { leapHint.textContent = "Hold to charge · land on bright pads · chain combos"; }, 1200);'),
    ('leapRainEl.textContent = on ? "🌧️ 雨中" : (leapRainMin ? `微雨 ${leapRainMin}分` : "微雨来了");',
     'leapRainEl.textContent = on ? "🌧️ Rain" : (leapRainMin ? `Drizzle ${leapRainMin}m` : "Drizzle soon");'),
    ('leapHint.textContent = leapCombo >= 5 ? "太棒了！连跳大师！" : `连跳 ${leapCombo} 次，继续！`;',
     'leapHint.textContent = leapCombo >= 5 ? "Amazing combo master!" : `Combo ${leapCombo} — keep going!`;'),
    ('if (leapCombo < 2) leapHint.textContent = "捡到荷币 +1";', 'if (leapCombo < 2) leapHint.textContent = "Coin +1";'),
    ('leapHint.textContent = "漂亮！再寻下一片亮叶";', 'leapHint.textContent = "Nice! Find the next bright pad";'),
    ('leapHint.textContent = "扑通～连跳中断，再试一次";', 'leapHint.textContent = "Splash~ combo broken, try again";'),
    ('leapHint.textContent = "再长按一会儿～";', 'leapHint.textContent = "Hold a bit longer~";'),
    ('${owned ? "已拥有" : item.cost + " 荷币"}', '${owned ? "Owned" : item.cost + " coins"}'),
    ('leapDuskEl.textContent = leapDuskMin ? `薄暮 ${leapDuskMin}分` : "🌙 入夜了";',
     'leapDuskEl.textContent = leapDuskMin ? `Dusk ${leapDuskMin}m` : "🌙 Nightfall";'),
    ('if (navigator.share) navigator.share({ title: "小游戏", text: "来玩玩这个！" });',
     'if (navigator.share) navigator.share({ title: "Mini Game", text: "Try this game!" });'),
]

for old, new in replacements:
    text = text.replace(old, new)

# FACE_LOOKS block - replace entire
face_old = re.search(r"const FACE_LOOKS = \[[\s\S]*?\];", text)
if face_old:
    text = text.replace(face_old.group(0), """const FACE_LOOKS = [
  { lazy: "Monday face", model: "Runway ice queen", lazyTag: "Nope", modelTag: "SLAY" },
  { lazy: "Couch potato", model: "Red carpet pose", lazyTag: "Slouch", modelTag: "Queen" },
  { lazy: "Bare-faced yawn", model: "Magazine cover", lazyTag: "Raw", modelTag: "Iconic" },
  { lazy: "Delivery mode", model: "Haute couture turn", lazyTag: "Waiting", modelTag: "Power" },
  { lazy: "Brain offline", model: "Finale face", lazyTag: "AFK", modelTag: "Finale" },
];""")

# PET_SCENES - English block
pet_old = re.search(r"const PET_SCENES = \[[\s\S]*?\];", text)
if pet_old:
    text = text.replace(pet_old.group(0), """const PET_SCENES = [
  { id: "type", title: "Dog typing furiously", emoji: "🐶", action: "Brows furrowed, paws flying on keyboard", mood: "Anxious focus", moodClass: "focus", thought: "This bug ships today…", accent: "#6366f1", type: "dog", fur: "#e8954a", eye: "focus" },
  { id: "slack", title: "Cat slacking at desk", emoji: "🐱", action: "Eyes offline, soul at the window", mood: "Zoned out", moodClass: "chill", thought: "Nobody's watching… right?", accent: "#ec4899", type: "cat", fur: "#fb923c", eye: "dead" },
  { id: "badge", title: "Good boy clocking in", emoji: "🐕", action: "Tail helicopter — let's go!", mood: "Hyped", moodClass: "hype", thought: "Morning! Best dog ever!", accent: "#eab308", type: "dog", fur: "#fcd34d", eye: "sparkle" },
  { id: "nap", title: "Kitten nap mode", emoji: "😺", action: "Keyboard pillow, purrs over AC", mood: "Sleepy", moodClass: "sleepy", thought: "Five more minutes…", accent: "#22c55e", type: "cat", fur: "#cbd5e1", eye: "sleep" },
  { id: "meet", title: "Meeting nod dog", emoji: "🐕‍🦺", action: "Nods to everything: Got it!", mood: "Corporate", moodClass: "yes", thought: "Yes yes yes received", accent: "#a855f7", type: "dog", fur: "#78716c", eye: "wide" },
  { id: "snack", title: "Snack-stealing cat", emoji: "😼", action: "Looks around, devours fish treats", mood: "Guilty", moodClass: "guilty", thought: "Just one bite…", accent: "#f97316", type: "cat", fur: "#ea580c", eye: "sly" },
  { id: "ot", title: "Overtime corgi", emoji: "🐶", action: "Soul leaving body, still typing", mood: "Breaking", moodClass: "broken", thought: "I can make it… maybe?", accent: "#64748b", type: "corgi", fur: "#d97706", eye: "tired" },
  { id: "wc", title: "Bathroom scroll cat", emoji: "🐈", action: "Phone scroll — time stops", mood: "Stealth break", moodClass: "stealth", thought: "One more video…", accent: "#06b6d4", type: "cat", fur: "#1e293b", eye: "phone" },
];""")

# SPOT_SCENES English
spot_old = re.search(r"const SPOT_SCENES = \[[\s\S]*?\];", text)
if spot_old:
    text = text.replace(spot_old.group(0), """const SPOT_SCENES = [
  { text: "Pink-purple lake like an eyeshadow palette ✨", loc: "Bonneville · Pink Salt", vibe: "Dreamy pink", colors: ["#fbcfe8", "#c4b5fd", "#a5b3fc", "#ddd6fe"], sky: ["#fdf4ff", "#f3e8ff", "#e9d5ff"], sun: "#fde047", mt: "#c4b5fd", accent: "#a855f7" },
  { text: "Endless blue-green water — photo heaven 📸", loc: "Laguna Colorada · Bolivia", vibe: "Clear teal", colors: ["#67e8f9", "#5eead4", "#6ee7b7", "#99f6e4"], sky: ["#ecfeff", "#cffafe", "#a5f3fc"], sun: "#fef08a", mt: "#0891b2", accent: "#06b6d4" },
  { text: "Salt lake panorama — pure healing 💐", loc: "Salar de Uyuni · Mirror", vibe: "Warm glow", colors: ["#fda4af", "#f9a8d4", "#fdba74", "#fde68a"], sky: ["#fff1f2", "#ffe4e6", "#fecdd3"], sun: "#fb923c", mt: "#fb7185", accent: "#f472b6" },
  { text: "Stroll the colorful shore 🌿", loc: "Great Salt Lake · Utah", vibe: "Fresh nature", colors: ["#86efac", "#bef264", "#fde047", "#fcd34d"], sky: ["#f0fdf4", "#ecfccb", "#d9f99d"], sun: "#fde047", mt: "#65a30d", accent: "#22c55e" },
  { text: "Sunset paints the lake orange soda 🌅", loc: "Mono Lake · California", vibe: "Sunset tone", colors: ["#fdba74", "#fb923c", "#f87171", "#fca5a5"], sky: ["#ffedd5", "#fed7aa", "#fdba74"], sun: "#f97316", mt: "#c2410c", accent: "#ea580c" },
  { text: "Mirror reflection — walking in a palette 🎨", loc: "Rainbow Lake", vibe: "Mirror magic", colors: ["#93c5fd", "#a78bfa", "#f0abfc", "#c4b5fd"], sky: ["#eff6ff", "#dbeafe", "#bfdbfe"], sun: "#fde68a", mt: "#6366f1", accent: "#818cf8" },
];""")

# SENTE lines
sente_old = re.search(r"const SENTE_LINES = \[[\s\S]*?\];", text)
if sente_old:
    text = text.replace(sente_old.group(0), """const SENTE_LINES = [
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
];""")

# More inline replacements
more = [
    ('ctx.fillText("外卖", 43, 48);', 'ctx.fillText("FOOD", 43, 48);'),
    ('ctx.fillText(lazy ? "😮‍💨 摆烂状态" : "💃 超模状态", cx, h - 10);',
     'ctx.fillText(lazy ? "😮‍💨 Couch mode" : "💃 Runway mode", cx, h - 10);'),
    ('if (faceStateLabel) faceStateLabel.textContent = model ? "超模杀疯" : "摆烂 mode";',
     'if (faceStateLabel) faceStateLabel.textContent = model ? "Runway SLAY" : "Couch mode";'),
    ('if (faceBeatHint) faceBeatHint.textContent = "预备…听 beat 1 2 3";',
     'if (faceBeatHint) faceBeatHint.textContent = "Ready… hear beat 1 2 3";'),
    ('if (faceBeatHint) faceBeatHint.textContent = facePulse < 3 ? `beat ${facePulse}…` : "最后一拍！";',
     'if (faceBeatHint) faceBeatHint.textContent = facePulse < 3 ? `beat ${facePulse}…` : "Final beat!";'),
    ('if (faceBeatHint) faceBeatHint.textContent = "NOW！拍它！";',
     'if (faceBeatHint) faceBeatHint.textContent = "NOW! Hit it!";'),
    ('failFaceRound("错过了节拍窗口");', 'failFaceRound("Missed the beat window");'),
    ('if (faceBeatHint) faceBeatHint.textContent = "✦ 一秒换头成功 ✦";',
     'if (faceBeatHint) faceBeatHint.textContent = "✦ Glow-up success ✦";'),
    ('failFaceRound("晚了一点点，再卡点试试");', 'failFaceRound("Slightly late — try again");'),
    ('failFaceRound("还没到最后一拍，别急～");', 'failFaceRound("Not the final beat yet — wait~");'),
    ('const plain = diy ? `天生喜欢${text.like}，被迫做${text.force}` : text;',
     'const plain = diy ? `Born to love ${text.like}, forced to ${text.force}` : text;'),
    ('senteText.innerHTML = `天生喜欢<strong>${text.like}</strong>，被迫做<strong>${text.force}</strong>`;',
     'senteText.innerHTML = `Born to love <strong>${text.like}</strong>, forced to <strong>${text.force}</strong>`;'),
    ('const like = senteLike?.value.trim() || "发呆";', 'const like = senteLike?.value.trim() || "spacing out";'),
    ('const force = senteForce?.value.trim() || "回消息";', 'const force = senteForce?.value.trim() || "replying";'),
    ('ctx.fillText("修勾", cx, cy + 42 + bounce);', 'ctx.fillText("GOOD", cx, cy + 42 + bounce);'),
    ('ctx.fillText("呼噜~", cx - 55, cy + 5);', 'ctx.fillText("purr~", cx - 55, cy + 5);'),
    ('ctx.fillText("收到!", cx + 48, cy - 35 + Math.abs(Math.sin(t * 6)) * -8);',
     'ctx.fillText("Got it!", cx + 48, cy - 35 + Math.abs(Math.sin(t * 6)) * -8);'),
    ('ctx.fillText("▶ 下一个", cx + 30, cy + 20);', 'ctx.fillText("▶ Next", cx + 30, cy + 20);'),
    ('const thought = imitate ? "学我像不像！" : petScene.thought;',
     'const thought = imitate ? "Copy me!" : petScene.thought;'),
    ('petBubble.textContent = "🎭 你也学我？像不像！";', 'petBubble.textContent = "🎭 Copy my pose?";'),
    ('if (petAction) petAction.textContent = "它朝你挥爪了！你也摆个同款姿势";',
     'if (petAction) petAction.textContent = "It waved — strike the same pose!";'),
    ('["万", "筒", "条"]', '["Wan", "Tong", "Tiao"]'),
    ('["一", "二", "三", "四", "五", "六", "七", "八", "九"]', '["1", "2", "3", "4", "5", "6", "7", "8", "9"]'),
    ('["东", "南", "西", "北", "中", "发", "白"]', '["E", "S", "W", "N", "Red", "Green", "White"]'),
]

for old, new in more:
    text = text.replace(old, new)

p.write_text(text, encoding="utf-8")
print("app.js localized")
