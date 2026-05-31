/** Generate learn radar hub JS from config */
export function radarHubJs(cfg) {
  const classify = cfg.classifyDomainFn
    ? cfg.classifyDomainFn
    : `() => "all"`;
  const listWindow = cfg.listWindowMs ? `\n    listWindowMs: ${cfg.listWindowMs},` : "";
  const listTitle = cfg.listTitle ? `\n      listTitle: ${JSON.stringify(cfg.listTitle)},` : "";

  return `/* ${cfg.title} — Learn tab */
(function () {
  if (!document.getElementById("${cfg.prefix}App")) return;
  window.initLearnRadar({
    prefix: "${cfg.prefix}",
    appId: "${cfg.prefix}App",
    windowKey: "${cfg.windowKey}",${listWindow}
    storage: {
      cache: "${cfg.storage.cache}",
      saved: "${cfg.storage.saved}",
      auto: "${cfg.storage.auto}",
    },
    ids: {
      list: "${cfg.prefix}List",
      radarDots: "${cfg.prefix}RadarDots",
      updated: "${cfg.prefix}UpdatedAt",
      domainFilters: "${cfg.prefix}DomainFilters",
      platformFilters: "${cfg.prefix}PlatformFilters",
      search: "${cfg.prefix}Search",
      sheet: "${cfg.prefix}Sheet",
      listCount: "${cfg.prefix}ListCount",
      refreshBtn: "${cfg.prefix}RefreshBtn",
      autoBtn: "${cfg.prefix}AutoBtn",
      savedToggle: "${cfg.prefix}SavedToggle",
      sheetClose: "${cfg.prefix}SheetClose",
      sheetBackdrop: "${cfg.prefix}SheetBackdrop",
      sheetRank: "${cfg.prefix}SheetRank",
      sheetPlatform: "${cfg.prefix}SheetPlatform",
      sheetTitle: "${cfg.prefix}SheetTitle",
      sheetHeat: "${cfg.prefix}SheetHeat",
      sheetTime: "${cfg.prefix}SheetTime",
      sheetDeep: "${cfg.prefix}SheetDeep",
      sheetSave: "${cfg.prefix}SheetSave",
      sheetLink: "${cfg.prefix}SheetLink",
      readBtn: "${cfg.prefix}ReadBtn",
    },
    labels: {${listTitle}
      deepIntro: ${JSON.stringify(cfg.labels.deepIntro)},
      refreshToast: ${JSON.stringify(cfg.labels.refreshToast)},
      loading: ${JSON.stringify(cfg.labels.loading)},
      empty: ${JSON.stringify(cfg.labels.empty)},
    },
    classifyDomain(title, summary) {
      const t = \`\${title} \${summary}\`.toLowerCase();
      ${cfg.classifyBody}
    },
  });
})();
`;
}
