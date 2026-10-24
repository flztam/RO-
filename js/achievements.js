/**
 * achievements.js – Achievement system + stats display
 */
const Achievements = (() => {

  function open() {
    render();
  }

  function check() {
    const d = State.get();
    if (!d) return;

    ACHIEVEMENTS.forEach(ach => {
      if (d.achievements[ach.id]) return; // already unlocked
      if (ach.req(d.stats)) {
        d.achievements[ach.id] = Date.now();
        State.save();
        showUnlockToast(ach);
        Audio.play('level-up');
      }
    });
  }

  function showUnlockToast(ach) {
    const toast = document.getElementById('hunt-toast');
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
    const defs = [
      { icon: '⚒️', label: 'Total Refines',    value: stats.totalRefines },
      { icon: '✅', label: 'Successes',         value: stats.successCount },
      { icon: '❌', label: 'Failures',          value: stats.failCount },
      { icon: '💔', label: 'Items Broken',      value: stats.breakCount },
      { icon: '⭐', label: 'Best Refine',       value: '+' + stats.maxRefineReached },
      { icon: '🗡️', label: 'Hunts Done',        value: stats.huntCount },
      { icon: '💰', label: 'Total Zeny Earned', value: stats.totalZenyEarned.toLocaleString() },
      { icon: '🎯', label: 'Manual Successes',  value: stats.manualSuccess },
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
    grid.innerHTML = '';

    ACHIEVEMENTS.forEach(ach => {
      const unlocked = !!d.achievements[ach.id];
      const current = d.stats[ach.key] || 0;
      const pct = Math.min(100, (current / ach.threshold) * 100);

      const card = document.createElement('div');
      card.className = `achieve-card ${unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="achieve-icon">${ach.icon}</div>
        <div class="achieve-info">
          <div class="achieve-name">${ach.name}</div>
          <div class="achieve-desc">${ach.desc}</div>
          <div class="achieve-progress-wrap">
            <div class="achieve-progress-bar">
              <div class="achieve-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="achieve-progress-text">${Math.min(current, ach.threshold)} / ${ach.threshold}</div>
          </div>
          <span class="achieve-badge ${unlocked ? 'done' : 'todo'}">${unlocked ? '✅ Unlocked' : '🔒 Locked'}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  return { open, check };
})();
