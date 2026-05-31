/** Dating & Social 101 — Learn tab (English, youth relationships) */
window.DATING_SOCIAL_APP = {
  disclaimer:
    "General relationship education only — not therapy or crisis care. If you feel unsafe, call 988 (US) or contact local emergency services.",

  intro: {
    title: "Relationships without the drama",
    body: "Dating apps, friendships, roommates, and boundaries — learn the skills Gen Z wish someone taught earlier. No pick-up artistry, no guilt trips: just healthier connections.",
  },

  tags: [
    { id: "all", label: "All" },
    { id: "dating", label: "Dating" },
    { id: "boundaries", label: "Boundaries" },
    { id: "friendship", label: "Friendship" },
    { id: "roommate", label: "Roommates" },
    { id: "online", label: "Online" },
  ],

  guides: [
    {
      id: "online-dating",
      emoji: "📱",
      title: "Online dating basics",
      summary: "Profiles, first messages, and meeting safely IRL.",
      tag: "dating",
      tasks: [
        { id: "od-photos", label: "Use 3–4 recent photos that look like you" },
        { id: "od-bio", label: "Write a bio with one specific interest + one prompt answer" },
        { id: "od-msg", label: "Open with something from their profile — not just \"hey\"" },
        { id: "od-public", label: "First meet in a public place; tell a friend where you'll be" },
        { id: "od-exit", label: "Practice a polite exit line if there's no vibe" },
      ],
    },
    {
      id: "boundaries",
      emoji: "🛡",
      title: "Healthy boundaries",
      summary: "Say no without over-explaining; recognize pressure.",
      tag: "boundaries",
      tasks: [
        { id: "bd-no", label: "Memorize: \"No\" is a complete sentence" },
        { id: "bd-body", label: "Notice gut feelings — tight chest, dread — as data" },
        { id: "bd-script", label: "Write one boundary script for school/work/dating" },
        { id: "bd-enforce", label: "If someone punishes your boundary, that's information" },
      ],
    },
    {
      id: "friendship",
      emoji: "🤝",
      title: "Friendship skills",
      summary: "Deepen connections; spot one-sided friendships.",
      tag: "friendship",
      tasks: [
        { id: "fr-reach", label: "Send one low-pressure check-in text this week" },
        { id: "fr-listen", label: "Practice listening without fixing for 10 minutes" },
        { id: "fr-balance", label: "Ask: does this friendship feel mutual?" },
        { id: "fr-space", label: "It's OK if friendships shift after college" },
      ],
    },
    {
      id: "roommate",
      emoji: "🏠",
      title: "Roommate relations",
      summary: "Chores, noise, guests, and tough conversations.",
      tag: "roommate",
      tasks: [
        { id: "rm-agree", label: "Agree on quiet hours + guest policy upfront" },
        { id: "rm-chores", label: "Split chores in writing (app or whiteboard)" },
        { id: "rm-i", label: "Use \"I\" statements: \"I need quiet after 11pm\"" },
        { id: "rm-ra", label: "Know when to involve RA / landlord vs talk directly" },
      ],
    },
    {
      id: "communication",
      emoji: "💬",
      title: "Clear communication",
      summary: "Conflict without contempt — text vs call rules.",
      tag: "dating",
      tasks: [
        { id: "cm-hard", label: "Hard talks deserve a call or in person — not a paragraph text" },
        { id: "cm-assume", label: "Assume good intent once; ask a clarifying question" },
        { id: "cm-repair", label: "After a fight: \"Can we reset?\" is valid" },
      ],
    },
  ],

  scenarios: [
    {
      id: "s1",
      tag: "dating",
      title: "They only text after midnight",
      situation: "Someone you're seeing only hits you up late and keeps plans vague.",
      tip: "Green flags include consistent effort and respect for your schedule. Ask what they're looking for; match actions to words.",
    },
    {
      id: "s2",
      tag: "boundaries",
      title: "Friend makes jokes at your expense",
      situation: "In the group chat they roast you and say \"relax, it's a joke.\"",
      tip: "You can name it once calmly. If it continues, pull back access — proximity is permission they don't deserve.",
    },
    {
      id: "s3",
      tag: "online",
      title: "Match wants to move to WhatsApp day one",
      situation: "New match pushes to leave the app immediately with a link.",
      tip: "Common scam pattern. Stay on-app until you've verified basics; never click suspicious links.",
    },
    {
      id: "s4",
      tag: "roommate",
      title: "Roommate never buys toilet paper",
      situation: "You've bought shared supplies three times; they shrug.",
      tip: "Split a shared expense app or rotate a written chore chart. Document before escalating to housing staff.",
    },
    {
      id: "s5",
      tag: "dating",
      title: "Pressure to go further than you want",
      situation: "Date is fine until intimacy; they say you \"owe\" them because they paid for dinner.",
      tip: "Red flag. You never owe physical intimacy. Leave if you feel unsafe; tell a trusted person.",
    },
    {
      id: "s6",
      tag: "friendship",
      title: "Only hear from them when they're bored",
      situation: "A friend texts \"u up?\" but ghosts when you need support.",
      tip: "Friendships can be seasonal. Invest in people who show up both ways.",
    },
    {
      id: "s7",
      tag: "boundaries",
      title: "Ex keeps viewing every story",
      situation: "Breakup was mutual but they orbit every post without talking.",
      tip: "Mute or restrict without drama. Boundaries can be digital too.",
    },
    {
      id: "s8",
      tag: "online",
      title: "Love-bombing early on",
      situation: "Two dates in and they're planning vacations and saying \"I've never felt this way.\"",
      tip: "Intensity ≠ compatibility. Slow down; watch consistency over weeks, not days.",
    },
    {
      id: "s9",
      tag: "roommate",
      title: "Partner basically moved in",
      situation: "Roommate's partner is there 6 nights a week; you weren't consulted.",
      tip: "Guest policies exist for a reason. Calm house meeting; refer to lease/RA if needed.",
    },
    {
      id: "s10",
      tag: "friendship",
      title: "FOMO when friends hang without you",
      situation: "Group posted stories from a night you weren't invited to.",
      tip: "Feeling hurt is normal. One event isn't your whole social worth. Plan one-on-one time with someone you trust.",
    },
    {
      id: "s11",
      tag: "dating",
      title: "Situationship limbo",
      situation: "Months of \"we're not official but act like a couple.\"",
      tip: "You can ask for clarity. If they won't define it, you can define your own limits.",
    },
    {
      id: "s12",
      tag: "boundaries",
      title: "Family guilt about visiting",
      situation: "Parents say you're selfish for staying on campus during break.",
      tip: "Adult children can choose. Offer what you can; guilt is not a contract.",
    },
  ],

  redFlags: [
    "Insults disguised as jokes",
    "Checking your phone or location without consent",
    "Isolating you from friends",
    "Love-bombing then cold withdrawal",
    "Pressure around sex or money",
    "Refusing to respect \"no\"",
    "Tracking who you follow or DM",
    "Threats of self-harm to control you",
  ],

  resources: [
    {
      name: "Love is Respect",
      tag: "Dating abuse",
      desc: "Chat, call, text support for unhealthy relationships — 1-866-331-9474.",
      link: "https://www.loveisrespect.org",
    },
    {
      name: "988 Lifeline",
      tag: "Crisis · US",
      desc: "Call or text 988 anytime.",
      link: "tel:988",
    },
    {
      name: "Crisis Text Line",
      tag: "Crisis · US",
      desc: "Text HOME to 741741.",
      link: "https://www.crisistextline.org",
    },
    {
      name: "Scarleteen",
      tag: "Education",
      desc: "Inclusive, frank relationship and sex ed for teens and young adults.",
      link: "https://www.scarleteen.com",
    },
    {
      name: "The Trevor Project",
      tag: "LGBTQ+ youth",
      desc: "Crisis support for LGBTQ+ young people.",
      link: "https://www.thetrevorproject.org",
    },
  ],

  tips: [
    "Actions > words. Watch patterns over 2–3 weeks.",
    "You can leave a date early — your safety beats politeness.",
    "Roommate issues get easier with written agreements early.",
    "It's normal for friend groups to change after 22.",
    "If someone reacts badly to a boundary, that confirms you needed one.",
  ],
};
