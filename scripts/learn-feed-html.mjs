/** Generate radar article HTML snippet — campus (cp) or jobs (jr) */
export function radarArticleHtml(cfg) {
  const p = cfg.prefix;
  const section = cfg.learnSection;
  const hubId = cfg.hubId;
  const titleA = cfg.titleA;
  const titleB = cfg.titleB;
  const subtitle = cfg.subtitle;
  const logo = cfg.logo;
  const feedTitle = cfg.feedTitle;
  const feedDesc = cfg.feedDesc;
  const listTitle = cfg.listTitle;

  return `      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="${section}" id="${hubId}">
        <div class="${p}-app" id="${p}App">
          <div class="${p}-glow" aria-hidden="true"></div>
          <header class="${p}-header">
            <div class="${p}-header-top">
              <div class="${p}-brand">
                <span class="${p}-logo" aria-hidden="true">${logo}</span>
                <div>
                  <h2 class="${p}-title"><span class="${p}-title-a">${titleA}</span> <span class="${p}-title-b">${titleB}</span></h2>
                  <p class="${p}-subtitle">${subtitle}</p>
                </div>
              </div>
              <div class="${p}-header-actions">
                <button type="button" class="${p}-icon-btn" id="${p}SavedToggle" aria-label="Saved" title="Saved">♥</button>
                <label class="visually-hidden" for="${p}Search">Search</label>
                <input type="search" class="${p}-search" id="${p}Search" placeholder="Search…" autocomplete="off">
              </div>
            </div>
            <div class="${p}-filters">
              <div class="${p}-filter-row">
                <span class="${p}-filter-label">Topic</span>
                <div class="${p}-filter-scroll" id="${p}DomainFilters" role="tablist" aria-label="Topic"></div>
              </div>
              <div class="${p}-filter-row">
                <span class="${p}-filter-label">Platform</span>
                <div class="${p}-filter-scroll" id="${p}PlatformFilters" role="tablist" aria-label="Platform"></div>
              </div>
            </div>
            <p class="${p}-updated" id="${p}UpdatedAt">Loading…</p>
          </header>
          <div class="${p}-radar-wrap" aria-hidden="true">
            <div class="${p}-radar">
              <div class="${p}-radar-ring ${p}-radar-ring--1"></div>
              <div class="${p}-radar-ring ${p}-radar-ring--2"></div>
              <div class="${p}-radar-ring ${p}-radar-ring--3"></div>
              <div class="${p}-radar-sweep"></div>
              <div class="${p}-radar-center" aria-hidden="true">◎</div>
              <div class="${p}-radar-dots" id="${p}RadarDots"></div>
            </div>
          </div>
          <section class="${p}-list-section" aria-label="${listTitle}">
            <header class="${p}-list-head">
              <h3 class="${p}-list-title">${listTitle}</h3>
              <span class="${p}-list-count" id="${p}ListCount">0 items</span>
            </header>
            <div class="${p}-list" id="${p}List" role="list"></div>
          </section>
          <footer class="${p}-actions">
            <button type="button" class="${p}-action-btn" id="${p}RefreshBtn"><span aria-hidden="true">↻</span> Refresh</button>
            <button type="button" class="${p}-action-btn" id="${p}AutoBtn"><span aria-hidden="true">⏱</span> Auto refresh</button>
          </footer>
        </div>
        <div class="${p}-sheet hidden" id="${p}Sheet" role="dialog" aria-modal="true" aria-labelledby="${p}SheetTitle">
          <div class="${p}-sheet-backdrop" id="${p}SheetBackdrop"></div>
          <div class="${p}-sheet-panel">
            <button type="button" class="${p}-sheet-close" id="${p}SheetClose" aria-label="Close">×</button>
            <div class="${p}-sheet-head">
              <span class="${p}-sheet-rank" id="${p}SheetRank">#1</span>
              <span class="${p}-tag ${p}-tag--platform" id="${p}SheetPlatform">Web</span>
              <button type="button" class="${p}-sheet-save" id="${p}SheetSave"><span aria-hidden="true">♡</span> Save</button>
            </div>
            <h2 class="${p}-sheet-title" id="${p}SheetTitle"></h2>
            <div class="${p}-sheet-meta">
              <span class="${p}-heat">🔥 <span id="${p}SheetHeat">0</span></span>
              <span class="${p}-time">🕐 <span id="${p}SheetTime"></span></span>
            </div>
            <div class="${p}-deep-card">
              <div class="${p}-deep-head">
                <h3 class="${p}-deep-title"><span aria-hidden="true">📄</span> Deep Dive</h3>
                <button type="button" class="${p}-read-btn" id="${p}ReadBtn"><span aria-hidden="true">🔊</span> Read aloud</button>
              </div>
              <div class="${p}-deep-body" id="${p}SheetDeep"></div>
            </div>
            <a class="${p}-sheet-link" id="${p}SheetLink" href="#">Read original →</a>
          </div>
        </div>
        <footer class="feed-meta learn-feed-meta">
          <div class="feed-meta-left">
            <p class="feed-title">${feedTitle}</p>
            <p class="feed-desc">${feedDesc}</p>
          </div>
        </footer>
      </article>`;
}

/** Career Radar — Jobs + Startup dual-tab */
export function careerRadarArticleHtml() {
  return `      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="career" id="careerHubItem">
        <div class="cr-app" id="crApp">
          <div class="cr-glow" aria-hidden="true"></div>
          <header class="cr-header">
            <div class="cr-header-top">
              <div class="cr-brand">
                <span class="cr-logo" aria-hidden="true">💼</span>
                <div>
                  <h2 class="cr-title"><span class="cr-title-a">Career</span> <span class="cr-title-b">Radar</span></h2>
                  <p class="cr-subtitle" id="crSubtitle">Internships · hiring · tech careers</p>
                </div>
              </div>
              <div class="cr-header-actions">
                <button type="button" class="cr-icon-btn" id="crSavedToggle" aria-label="Saved" title="Saved">♥</button>
                <label class="visually-hidden" for="crSearch">Search</label>
                <input type="search" class="cr-search" id="crSearch" placeholder="Search…" autocomplete="off">
              </div>
            </div>
            <nav class="cr-career-tabs" id="crCareerTabs" role="tablist" aria-label="Career feeds">
              <button type="button" class="cr-career-tab active" data-career-tab="jobs" role="tab" aria-selected="true">💼 Jobs</button>
              <button type="button" class="cr-career-tab" data-career-tab="startup" role="tab" aria-selected="false">🚀 Startups</button>
            </nav>
            <div class="cr-filters">
              <div class="cr-filter-row">
                <span class="cr-filter-label">Topic</span>
                <div class="cr-filter-scroll" id="crDomainFilters" role="tablist" aria-label="Topic"></div>
              </div>
              <div class="cr-filter-row">
                <span class="cr-filter-label">Platform</span>
                <div class="cr-filter-scroll" id="crPlatformFilters" role="tablist" aria-label="Platform"></div>
              </div>
            </div>
            <p class="cr-updated" id="crUpdatedAt">Loading…</p>
          </header>
          <div class="cr-radar-wrap" aria-hidden="true">
            <div class="cr-radar">
              <div class="cr-radar-ring cr-radar-ring--1"></div>
              <div class="cr-radar-ring cr-radar-ring--2"></div>
              <div class="cr-radar-ring cr-radar-ring--3"></div>
              <div class="cr-radar-sweep"></div>
              <div class="cr-radar-center" aria-hidden="true">◎</div>
              <div class="cr-radar-dots" id="crRadarDots"></div>
            </div>
          </div>
          <section class="cr-list-section" aria-label="Career news">
            <header class="cr-list-head">
              <h3 class="cr-list-title" id="crListTitle">Today's Job News</h3>
              <span class="cr-list-count" id="crListCount">0 items</span>
            </header>
            <div class="cr-list" id="crList" role="list"></div>
          </section>
          <footer class="cr-actions">
            <button type="button" class="cr-action-btn" id="crRefreshBtn"><span aria-hidden="true">↻</span> Refresh</button>
            <button type="button" class="cr-action-btn" id="crAutoBtn"><span aria-hidden="true">⏱</span> Auto refresh</button>
          </footer>
        </div>
        <div class="cr-sheet hidden" id="crSheet" role="dialog" aria-modal="true" aria-labelledby="crSheetTitle">
          <div class="cr-sheet-backdrop" id="crSheetBackdrop"></div>
          <div class="cr-sheet-panel">
            <button type="button" class="cr-sheet-close" id="crSheetClose" aria-label="Close">×</button>
            <div class="cr-sheet-head">
              <span class="cr-sheet-rank" id="crSheetRank">#1</span>
              <span class="cr-tag cr-tag--platform" id="crSheetPlatform">Web</span>
              <button type="button" class="cr-sheet-save" id="crSheetSave"><span aria-hidden="true">♡</span> Save</button>
            </div>
            <h2 class="cr-sheet-title" id="crSheetTitle"></h2>
            <div class="cr-sheet-meta">
              <span class="cr-heat">🔥 <span id="crSheetHeat">0</span></span>
              <span class="cr-time">🕐 <span id="crSheetTime"></span></span>
            </div>
            <div class="cr-deep-card">
              <div class="cr-deep-head">
                <h3 class="cr-deep-title"><span aria-hidden="true">📄</span> Deep Dive</h3>
                <button type="button" class="cr-read-btn" id="crReadBtn"><span aria-hidden="true">🔊</span> Read aloud</button>
              </div>
              <div class="cr-deep-body" id="crSheetDeep"></div>
            </div>
            <a class="cr-sheet-link" id="crSheetLink" href="#">Read original →</a>
          </div>
        </div>
        <footer class="feed-meta learn-feed-meta">
          <div class="feed-meta-left">
            <p class="feed-title">Career Radar</p>
            <p class="feed-desc">Jobs + Startup wire · dual tab</p>
          </div>
        </footer>
      </article>`;
}

/** Creator & Play — Gaming + Creator dual-tab */
export function creatorPlayRadarArticleHtml() {
  return `      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="creatorplay" id="creatorPlayHubItem">
        <div class="cpl-app" id="cplApp">
          <div class="cpl-glow" aria-hidden="true"></div>
          <header class="cpl-header">
            <div class="cpl-header-top">
              <div class="cpl-brand">
                <span class="cpl-logo" aria-hidden="true">🎬</span>
                <div>
                  <h2 class="cpl-title"><span class="cpl-title-a">Creator</span> <span class="cpl-title-b">&amp; Play</span></h2>
                  <p class="cpl-subtitle" id="cplSubtitle">Releases · esports · indie · hardware</p>
                </div>
              </div>
              <div class="cpl-header-actions">
                <button type="button" class="cpl-icon-btn" id="cplSavedToggle" aria-label="Saved" title="Saved">♥</button>
                <label class="visually-hidden" for="cplSearch">Search</label>
                <input type="search" class="cpl-search" id="cplSearch" placeholder="Search…" autocomplete="off">
              </div>
            </div>
            <nav class="cpl-play-tabs" id="cplPlayTabs" role="tablist" aria-label="Creator and Play feeds">
              <button type="button" class="cpl-play-tab active" data-play-tab="gaming" role="tab" aria-selected="true">🎮 Gaming</button>
              <button type="button" class="cpl-play-tab" data-play-tab="creator" role="tab" aria-selected="false">🎬 Creator</button>
            </nav>
            <div class="cpl-filters">
              <div class="cpl-filter-row">
                <span class="cpl-filter-label">Topic</span>
                <div class="cpl-filter-scroll" id="cplDomainFilters" role="tablist" aria-label="Topic"></div>
              </div>
              <div class="cpl-filter-row">
                <span class="cpl-filter-label">Platform</span>
                <div class="cpl-filter-scroll" id="cplPlatformFilters" role="tablist" aria-label="Platform"></div>
              </div>
            </div>
            <p class="cpl-updated" id="cplUpdatedAt">Loading…</p>
          </header>
          <div class="cpl-radar-wrap" aria-hidden="true">
            <div class="cpl-radar">
              <div class="cpl-radar-ring cpl-radar-ring--1"></div>
              <div class="cpl-radar-ring cpl-radar-ring--2"></div>
              <div class="cpl-radar-ring cpl-radar-ring--3"></div>
              <div class="cpl-radar-sweep"></div>
              <div class="cpl-radar-center" aria-hidden="true">◎</div>
              <div class="cpl-radar-dots" id="cplRadarDots"></div>
            </div>
          </div>
          <section class="cpl-list-section" aria-label="Creator and Play news">
            <header class="cpl-list-head">
              <h3 class="cpl-list-title" id="cplListTitle">Today's Gaming</h3>
              <span class="cpl-list-count" id="cplListCount">0 items</span>
            </header>
            <div class="cpl-list" id="cplList" role="list"></div>
          </section>
          <footer class="cpl-actions">
            <button type="button" class="cpl-action-btn" id="cplRefreshBtn"><span aria-hidden="true">↻</span> Refresh</button>
            <button type="button" class="cpl-action-btn" id="cplAutoBtn"><span aria-hidden="true">⏱</span> Daily refresh</button>
          </footer>
        </div>
        <div class="cpl-sheet hidden" id="cplSheet" role="dialog" aria-modal="true" aria-labelledby="cplSheetTitle">
          <div class="cpl-sheet-backdrop" id="cplSheetBackdrop"></div>
          <div class="cpl-sheet-panel">
            <button type="button" class="cpl-sheet-close" id="cplSheetClose" aria-label="Close">×</button>
            <div class="cpl-sheet-head">
              <span class="cpl-sheet-rank" id="cplSheetRank">#1</span>
              <span class="cpl-tag cpl-tag--platform" id="cplSheetPlatform">Web</span>
              <button type="button" class="cpl-sheet-save" id="cplSheetSave"><span aria-hidden="true">♡</span> Save</button>
            </div>
            <h2 class="cpl-sheet-title" id="cplSheetTitle"></h2>
            <div class="cpl-sheet-meta">
              <span class="cpl-heat">🔥 <span id="cplSheetHeat">0</span></span>
              <span class="cpl-time">🕐 <span id="cplSheetTime"></span></span>
            </div>
            <div class="cpl-deep-card">
              <div class="cpl-deep-head">
                <h3 class="cpl-deep-title"><span aria-hidden="true">📄</span> Deep Dive</h3>
                <button type="button" class="cpl-read-btn" id="cplReadBtn"><span aria-hidden="true">🔊</span> Read aloud</button>
              </div>
              <div class="cpl-deep-body" id="cplSheetDeep"></div>
            </div>
            <a class="cpl-sheet-link" id="cplSheetLink" href="#">Read original →</a>
          </div>
        </div>
        <footer class="feed-meta learn-feed-meta">
          <div class="feed-meta-left">
            <p class="feed-title">Creator &amp; Play</p>
            <p class="feed-desc">Gaming + Creator · dual tab · daily auto refresh</p>
          </div>
        </footer>
      </article>`;
}

export const DATING_ARTICLE_HTML = `      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="dating" id="datingHubItem">
        <div class="ds-app" id="dsApp">
          <div class="ds-glow" aria-hidden="true"></div>
          <header class="ds-hero">
            <div class="ds-brand">
              <span class="ds-logo" aria-hidden="true">💕</span>
              <div>
                <h2 class="ds-title"><span class="ds-title-a">Dating</span> <span class="ds-title-b">&amp; Social 101</span></h2>
                <p class="ds-subtitle">Boundaries · friends · roommates · red flags</p>
              </div>
            </div>
          </header>
          <div class="ds-panel active" data-ds-panel="guides">
            <div class="ds-intro-card">
              <h3 class="ds-intro-title" id="dsIntroTitle"></h3>
              <p class="ds-intro-body" id="dsIntroBody"></p>
            </div>
            <h3 class="ds-section-label">Relationship guides</h3>
            <div class="ds-scroll" id="dsGuideList"></div>
          </div>
          <div class="ds-panel" data-ds-panel="scenarios">
            <header class="ds-panel-head">
              <h3 class="ds-panel-title">Real scenarios</h3>
              <p class="ds-panel-sub">What would you do? — tap tags to filter</p>
            </header>
            <div class="ds-filter-scroll" id="dsScenarioFilters" role="tablist"></div>
            <div class="ds-scroll" id="dsScenarioList"></div>
          </div>
          <div class="ds-panel" data-ds-panel="support">
            <header class="ds-panel-head">
              <h3 class="ds-panel-title">Red flags &amp; support</h3>
              <p class="ds-panel-sub">Know the signs · get help</p>
            </header>
            <p class="ds-disclaimer" id="dsDisclaimer"></p>
            <h4 class="ds-flags-label">Common red flags</h4>
            <ul class="ds-red-flags" id="dsRedFlags"></ul>
            <h4 class="ds-resources-label">Resources</h4>
            <div class="ds-scroll" id="dsResourceList"></div>
            <h4 class="ds-tips-label">Pro tips</h4>
            <ul class="ds-tips" id="dsTipsList"></ul>
          </div>
          <nav class="ds-nav" aria-label="Dating &amp; Social sections">
            <button type="button" class="ds-nav-btn active" data-ds-nav="guides"><span aria-hidden="true">📚</span> Guides</button>
            <button type="button" class="ds-nav-btn" data-ds-nav="scenarios"><span aria-hidden="true">💬</span> Scenarios</button>
            <button type="button" class="ds-nav-btn" data-ds-nav="support"><span aria-hidden="true">🛡</span> Support</button>
          </nav>
        </div>
        <footer class="feed-meta learn-feed-meta">
          <div class="feed-meta-left">
            <p class="feed-title">Dating &amp; Social 101</p>
            <p class="feed-desc">5 guides · 12 scenarios · support links</p>
          </div>
        </footer>
      </article>`;
