/**
 * achievements.js – Achievement system + stats display
 */
const Achievements = (() => {

  function open() {
    check();
    render();
  }

  function check() {
    const d = State.get();
    if (!d) return;

    ACHIEVEMENTS.forEach(ach => {
      if (d.achievements[ach.id]) return; // already unlocked
      if (ach.req(d.stats, d)) {
        d.achievements[ach.id] = Date.now();
        State.save();
        showUnlockToast(ach);
        Audio.play('level-up');
      }
    });
  }

  function showUnlockToast(ach) {
    const toast = document.getElementById('hunt-toast');
    if (!toast) return;
    toast.textContent = `🏆 Achievement Unlocked: ${ach.name}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function render() {
    const d = State.get();
    if (!d) return;

    renderStats(d.stats);
    renderAchievements(d);
  }

  function renderStats(stats) {
    const grid = document.getElementById('stats-grid');
    if (!grid) return;
    const plus10Count = stats.plus10Items ? Object.keys(stats.plus10Items).length : 0;
    const defs = [
      { icon: '<img src="images/icons/hammer.gif" class="pixel-stat-icon" alt="" />', label: 'Total Refines',     value: stats.totalRefines || 0 },
      { icon: '<img src="images/items/1101.gif" class="pixel-stat-icon" alt="" />', label: 'Successes',          value: stats.successCount || 0 },
      { icon: '<span style="color:#ef4444;font-size:1.4rem;font-weight:900;">✕</span>', label: 'Failures',           value: stats.failCount || 0 },
      { icon: '<img src="images/icons/anvil.gif" class="pixel-stat-icon" alt="" />', label: 'Items Broken',       value: stats.breakCount || 0 },
      { icon: '<img src="images/icons/ore.gif" class="pixel-stat-icon" alt="" />', label: 'Best Refine',        value: '+' + (stats.maxRefineReached || 0) },
      { icon: '<img src="images/icons/crown.gif" class="pixel-stat-icon" alt="" />', label: '+10 Items Reached',  value: `${plus10Count} / ${EQUIPMENT.length}` },
      { icon: '<img src="images/icons/sword.gif" class="pixel-stat-icon" alt="" />', label: 'Hunts Done',         value: stats.huntCount || 0 },
      { icon: '<img src="images/icons/zeny.gif" class="pixel-stat-icon" alt="" />', label: 'Total Zeny Earned',  value: (stats.totalZenyEarned || 0).toLocaleString() },
      { icon: '<img src="images/icons/cross_sword.gif" class="pixel-stat-icon" alt="" />', label: 'Manual Successes',   value: stats.manualSuccess || 0 },
    ];
    grid.innerHTML = defs.map(s => `
      <div class="stat-card">
        <span class="stat-icon">${s.icon}</span>
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  function renderAchievements(d) {
    const grid = document.getElementById('achieve-grid');
    if (!grid) return;
    grid.innerHTML = '';

    ACHIEVEMENTS.forEach(ach => {
      const unlocked = !!d.achievements[ach.id];
      let current = 0;
      let threshold = ach.threshold || 1;

      if (ach.getProgress) {
        const prog = ach.getProgress(d);
        current = prog.current;
        threshold = prog.threshold;
      } else if (ach.key) {
        current = d.stats[ach.key] || 0;
      } else {
        current = unlocked ? threshold : 0;
      }

      const pct = Math.min(100, Math.round((current / threshold) * 100));

      const card = document.createElement('div');
      card.className = `achieve-card ${unlocked ? 'unlocked' : 'locked'}`;
      const iconHtml = (ach.icon && (ach.icon.includes('/') || ach.icon.includes('.gif')))
        ? `<img src="${ach.icon}" class="pixel-achieve-icon" alt="" />`
        : ach.icon;

      card.innerHTML = `
        <div class="achieve-icon">${iconHtml}</div>
        <div class="achieve-info">
          <div class="achieve-name">${ach.name}</div>
          <div class="achieve-desc">${ach.desc}</div>
          <div class="achieve-progress-wrap">
            <div class="achieve-progress-bar">
              <div class="achieve-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="achieve-progress-text">${Math.min(current, threshold)} / ${threshold}</div>
          </div>
          <span class="achieve-badge ${unlocked ? 'done' : 'todo'}">${unlocked ? 'Unlocked' : 'Locked'}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  return { open, check };
})();
