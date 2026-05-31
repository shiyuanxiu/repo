/** 2026 FIFA World Cup — Learn tab mini-app data (English) */
window.WC2026 = {
  /** Opening ceremony + Match 1 kickoff — Mexico City (CDT, UTC-5) */
  openingKickoff: "2026-06-11T20:00:00-05:00",
  finalKickoff: "2026-07-19T19:00:00-04:00",
  hosts: "USA · Canada · Mexico",
  teamCount: 48,
  hostCities: "16 cities across North America",
  tagline: "Check the 2026 World Cup schedule and explore brief introductions for all teams and players!",

  champions: [
    { id: "1930", year: 1930, location: "Uruguay · Montevideo", champion: "Uruguay", runnerUp: "Argentina", score: "4–2", chFlag: "🇺🇾", ruFlag: "🇦🇷" },
    { id: "1934", year: 1934, location: "Italy · Rome", champion: "Italy", runnerUp: "Czechoslovakia", score: "2–1", chFlag: "🇮🇹", ruFlag: "🇨🇿" },
    { id: "1958", year: 1958, location: "Sweden · Stockholm", champion: "Brazil", runnerUp: "Sweden", score: "5–2", chFlag: "🇧🇷", ruFlag: "🇸🇪" },
    { id: "1970", year: 1970, location: "Mexico · Mexico City", champion: "Brazil", runnerUp: "Italy", score: "4–1", chFlag: "🇧🇷", ruFlag: "🇮🇹" },
    { id: "1998", year: 1998, location: "France · Saint-Denis", champion: "France", runnerUp: "Brazil", score: "3–0", chFlag: "🇫🇷", ruFlag: "🇧🇷" },
    { id: "2018", year: 2018, location: "Russia · Moscow", champion: "France", runnerUp: "Croatia", score: "4–2", chFlag: "🇫🇷", ruFlag: "🇭🇷" },
    { id: "2022", year: 2022, location: "Qatar · Lusail", champion: "Argentina", runnerUp: "France", score: "3–3 (4–2 pen.)", chFlag: "🇦🇷", ruFlag: "🇫🇷" },
  ],

  scheduleFilters: [
    { id: "all", label: "All" },
    { id: "group", label: "Group Stage" },
    { id: "r16", label: "Round of 16" },
    { id: "qf", label: "Quarter-finals" },
  ],

  schedule: [
    { id: "m1", kickoff: "2026-06-11T20:00:00-05:00", date: "2026-06-11", time: "20:00 CDT", teamA: "Mexico", teamB: "South Africa", flagA: "🇲🇽", flagB: "🇿🇦", stage: "group", stageLabel: "Group Stage", venue: "Estadio Azteca, Mexico City", group: "A" },
    { id: "m2", kickoff: "2026-06-12T02:00:00-04:00", date: "2026-06-11", time: "22:00 ET", teamA: "South Korea", teamB: "UEFA Play-off D", flagA: "🇰🇷", flagB: "🏳️", stage: "group", stageLabel: "Group Stage", venue: "MetLife Stadium, New Jersey", group: "A" },
    { id: "m3", kickoff: "2026-06-12T20:00:00-04:00", date: "2026-06-12", time: "20:00 ET", teamA: "Canada", teamB: "UEFA Play-off A", flagA: "🇨🇦", flagB: "🏳️", stage: "group", stageLabel: "Group Stage", venue: "BMO Field, Toronto", group: "B" },
    { id: "m4", kickoff: "2026-06-13T01:00:00-04:00", date: "2026-06-12", time: "18:00 PT", teamA: "USA", teamB: "Paraguay", flagA: "🇺🇸", flagB: "🇵🇾", stage: "group", stageLabel: "Group Stage", venue: "SoFi Stadium, Los Angeles", group: "D" },
    { id: "m5", kickoff: "2026-06-14T01:00:00-04:00", date: "2026-06-13", time: "21:00 ET", teamA: "Brazil", teamB: "Morocco", flagA: "🇧🇷", flagB: "🇲🇦", stage: "group", stageLabel: "Group Stage", venue: "Hard Rock Stadium, Miami", group: "C" },
    { id: "m6", kickoff: "2026-06-28T21:00:00-05:00", date: "2026-06-28", time: "21:00 CDT", teamA: "Winner Group A", teamB: "Runner-up Group B", flagA: "🏆", flagB: "🥈", stage: "r16", stageLabel: "Round of 16", venue: "AT&T Stadium, Dallas", group: "" },
    { id: "m7", kickoff: "2026-07-05T00:00:00-04:00", date: "2026-07-04", time: "20:00 ET", teamA: "Winner R16-1", teamB: "Winner R16-2", flagA: "⚽", flagB: "⚽", stage: "qf", stageLabel: "Quarter-finals", venue: "Mercedes-Benz Stadium, Atlanta", group: "" },
    { id: "m8", kickoff: "2026-07-19T19:00:00-04:00", date: "2026-07-19", time: "19:00 ET", teamA: "Finalist A", teamB: "Finalist B", flagA: "🥇", flagB: "🥈", stage: "final", stageLabel: "Final", venue: "MetLife Stadium, New Jersey", group: "" },
  ],

  teams: [
    { name: "Brazil", flag: "🇧🇷", appearances: 22, rating: 5, confederation: "CONMEBOL" },
    { name: "Germany", flag: "🇩🇪", appearances: 20, rating: 5, confederation: "UEFA" },
    { name: "Argentina", flag: "🇦🇷", appearances: 18, rating: 5, confederation: "CONMEBOL" },
    { name: "France", flag: "🇫🇷", appearances: 16, rating: 5, confederation: "UEFA" },
    { name: "England", flag: "🏴", appearances: 16, rating: 4, confederation: "UEFA" },
    { name: "Spain", flag: "🇪🇸", appearances: 16, rating: 5, confederation: "UEFA" },
    { name: "Italy", flag: "🇮🇹", appearances: 18, rating: 4, confederation: "UEFA" },
    { name: "USA", flag: "🇺🇸", appearances: 11, rating: 4, confederation: "CONCACAF" },
    { name: "Mexico", flag: "🇲🇽", appearances: 17, rating: 4, confederation: "CONCACAF" },
    { name: "Canada", flag: "🇨🇦", appearances: 2, rating: 3, confederation: "CONCACAF" },
    { name: "Japan", flag: "🇯🇵", appearances: 7, rating: 4, confederation: "AFC" },
    { name: "South Korea", flag: "🇰🇷", appearances: 11, rating: 4, confederation: "AFC" },
    { name: "Morocco", flag: "🇲🇦", appearances: 6, rating: 4, confederation: "CAF" },
    { name: "Senegal", flag: "🇸🇳", appearances: 3, rating: 4, confederation: "CAF" },
    { name: "Netherlands", flag: "🇳🇱", appearances: 11, rating: 4, confederation: "UEFA" },
    { name: "Portugal", flag: "🇵🇹", appearances: 8, rating: 4, confederation: "UEFA" },
    { name: "Belgium", flag: "🇧🇪", appearances: 14, rating: 4, confederation: "UEFA" },
    { name: "Croatia", flag: "🇭🇷", appearances: 6, rating: 4, confederation: "UEFA" },
    { name: "Uruguay", flag: "🇺🇾", appearances: 14, rating: 4, confederation: "CONMEBOL" },
    { name: "Colombia", flag: "🇨🇴", appearances: 6, rating: 4, confederation: "CONMEBOL" },
  ],
};
