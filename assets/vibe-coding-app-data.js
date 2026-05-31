/** Vibe Coding mini-app — Learn tab feed #6 (English) */
window.VIBE_CODING_APP = {
  intro: {
    title: "What is Vibe Coding?",
    body: "Vibe Coding is a new way to build software — you describe what you want in plain language, and AI writes the code. Think of it as pair programming with a senior developer: you talk, AI types.",
  },

  weeks: [
    {
      id: "week1",
      num: 1,
      title: "Week 1: Find the vibe",
      summary: "Use Cursor or Windsurf — let AI build a calculator and a to-do list.",
      tasks: [
        { id: "w1-install", label: "Install Cursor (or Windsurf)" },
        { id: "w1-project", label: "Create your first project folder" },
        { id: "w1-calc", label: "Ask AI to build a calculator" },
        { id: "w1-todo", label: "Ask AI to build a to-do list app" },
      ],
    },
    {
      id: "week2",
      num: 2,
      title: "Week 2: Start imitating",
      summary: "Pick a project you admire and recreate it with AI help.",
      tasks: [
        { id: "w2-pick", label: "Choose a project you like" },
        { id: "w2-analyze", label: "Break down its structure on paper" },
        { id: "w2-clone", label: "Have AI rebuild the core features" },
        { id: "w2-tweak", label: "Edit the AI output and make it yours" },
      ],
    },
    {
      id: "week3",
      num: 3,
      title: "Week 3: Build solo",
      summary: "Ship a small project from scratch — 0 to 1, mostly on your own.",
      tasks: [
        { id: "w3-idea", label: "Define one clear project idea" },
        { id: "w3-design", label: "Sketch modules and user flow" },
        { id: "w3-steps", label: "Implement step-by-step with AI" },
        { id: "w3-ship", label: "Integrate, debug, and publish locally" },
      ],
    },
    {
      id: "week4",
      num: 4,
      title: "Week 4: Iterate & level up",
      summary: "Polish your project and learn advanced AI coding patterns.",
      tasks: [
        { id: "w4-features", label: "Add one new feature" },
        { id: "w4-quality", label: "Refactor for readability" },
        { id: "w4-prompts", label: "Practice sharper AI prompts" },
        { id: "w4-share", label: "Share your work with a friend" },
      ],
    },
  ],

  tools: [
    {
      id: "cursor",
      name: "Cursor",
      icon: "⌨",
      tag: "AI IDE",
      desc: "VS Code fork with built-in AI chat, Composer, and codebase context.",
      link: "https://cursor.com",
    },
    {
      id: "windsurf",
      name: "Windsurf",
      icon: "🌊",
      tag: "AI IDE",
      desc: "Flow-based editor with Cascade agent — great for multi-file edits.",
      link: "https://codeium.com/windsurf",
    },
    {
      id: "v0",
      name: "v0",
      icon: "✨",
      tag: "UI",
      desc: "Generate React/Tailwind UI from a screenshot or description.",
      link: "https://v0.dev",
    },
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      tag: "Ship",
      desc: "Version control + Copilot — store code and collaborate.",
      link: "https://github.com",
    },
    {
      id: "vercel",
      name: "Vercel",
      icon: "▲",
      tag: "Deploy",
      desc: "One-click deploy for static sites and Next.js apps.",
      link: "https://vercel.com",
    },
  ],

  tips: [
    "Be specific: \"Add a dark-mode toggle to the header\" beats \"make it prettier.\"",
    "Paste errors into chat — AI fixes faster when it sees the stack trace.",
    "Commit often; vibe coding moves fast, git saves you when AI goes sideways.",
    "Read the diff before accepting — you stay the captain, AI is the copilot.",
  ],
};
