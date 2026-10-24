/**
 * refine.js – Authentic Ragnarok Online Refinement System
 * UI matching photo reference media_1792845954806.jpg (Equipment Refining)
 * Weapons Lv 1: Phracon (Safe +7, 50z)
 * Weapons Lv 2: Emveretarcon (Safe +6, 200z)
 * Weapons Lv 3: Oridecon (Safe +5, 5,000z)
 * Weapons Lv 4: Oridecon (Safe +4, 20,000z)
 * Armors: Elunium (Safe +4, 2,000z)
 */

const Refine = (() => {
  let selectedItem = null; // { instanceId, id, level }
  let isEnriched = false;
  let mode = 'npc'; // 'npc' | 'manual'
  let drawerFilter = 'all';

  // Minigame state
  let minigameActive = false;
  let needlePos = 0;
  let needleDir = 1;
  let needleSpeed = 45;
  let successZoneStart = 0;
  let successZoneEnd = 0;
  let countdownTimer = null;
  let timerSec = 5;
  let rafId = null;
  let lastTs = null;

  // DOM elements
  const $gaugeContainer = () => document.getElementById('refine-gauge-container');
  const $needle         = () => document.getElementById('timing-needle');
  const $zoneS          = () => document.getElementById('zone-success');
  const $zoneDL         = () => document.getElementById('zone-danger-left');
  const $zoneDR         = () => document.getElementById('zone-danger-right');
  const $timerVal       = () => document.getElementById('minigame-timer-val');
  const $timerBadge     = () => document.getElementById('minigame-timer-badge');
  const $manualBtn      = () => document.getElementById('btn-toggle-manual');
  const $refineZeny     = () => document.getElementById('refine-zeny');
  const $matCount       = () => document.getElementById('mat-count');
  const $zenyCost       = () => document.getElementById('zeny-cost');
  const $log            = () => document.getElementById('refine-log');
  const $doBtn          = () => document.getElementById('btn-do-refine');
  const $itemVisual     = () => document.getElementById('refine-item-visual');
  const $ribbonName     = () => document.getElementById('refine-ribbon-item-name');
  const $statCurrLvl    = () => document.getElementById('stat-current-lvl');
  const $statCurrBonus  = () => document.getElementById('stat-current-bonus');
  const $statNextLvl    = () => document.getElementById('stat-next-lvl');
  const $statNextBonus  = () => document.getElementById('stat-next-bonus');
  const $statLblCurr    = () => document.getElementById('stat-lbl-curr-atk');
  const $statLblNext    = () => document.getElementById('stat-lbl-next-atk');
  const $infoBar        = () => document.getElementById('refine-info-bar');
  const $infoText       = () => document.getElementById('refine-info-text');
  const $pillMatIcon    = () => document.getElementById('pill-mat-icon');
  const $drawer         = () => document.getElementById('refine-equip-drawer');
  const $strikeOverlay  = () => document.getElementById('refine-striking-overlay');
  const $strikeIcon     = () => document.getElementById('striking-item-icon');

  function open() {
    isEnriched = false;
    mode = 'npc';
    const manualBtn = $manualBtn();
    if (manualBtn) {
      manualBtn.classList.remove('active');
      const lbl = document.getElementById('manual-btn-label');
      if (lbl) lbl.textContent = 'Manual';
    }
    closeMinigame();
    bindEvents();
    renderDrawer();
    updateDisplay();
    updateLog();
    updateZeny();
  }

  function close() {
    closeMinigame(false);
  }

  function updateZeny() {
    const d = State.get();
    if (d && $refineZeny()) {
      $refineZeny().textContent = d.zeny.toLocaleString();
    }
  }

  let eventsBound = false;
  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // Red ribbon bookmark close button
    document.getElementById('refine-close-ribbon')?.addEventListener('click', () => {
      Router.go('page-main');
    });

    // Back button in header
    document.getElementById('back-from-refine')?.addEventListener('click', () => {
      Router.go('page-main');
    });

    // Clicking item slot or ribbon banner opens drawer
    document.getElementById('equip-slot')?.addEventListener('click', () => {
      toggleDrawer(true);
      Audio.play('click');
    });
    document.getElementById('btn-open-picker-ribbon')?.addEventListener('click', () => {
      toggleDrawer(true);
      Audio.play('click');
    });
    document.getElementById('btn-trigger-picker')?.addEventListener('click', () => {
      toggleDrawer(true);
      Audio.play('click');
    });
    document.getElementById('btn-close-drawer')?.addEventListener('click', () => {
      toggleDrawer(false);
      Audio.play('click');
    });

    // Drawer filter buttons
    document.querySelectorAll('.drawer-filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.drawer-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawerFilter = btn.dataset.filter;
        renderDrawer();
        Audio.play('click');
      });
    });

    // Mode Pill (Normal vs Safe/Enriched)
    document.getElementById('pill-mode-toggle')?.addEventListener('click', () => {
      isEnriched = !isEnriched;
      updateDisplay();
      Audio.play('click');
    });

    // Manual Minigame Toggle Button
    const manualBtn = document.getElementById('btn-toggle-manual');
    if (manualBtn) {
      manualBtn.addEventListener('click', () => {
        if (minigameActive) return;
        mode = mode === 'npc' ? 'manual' : 'npc';
        manualBtn.classList.toggle('active', mode === 'manual');
        const lbl = document.getElementById('manual-btn-label');
        if (lbl) lbl.textContent = mode === 'manual' ? 'Manual (ON)' : 'Manual';
        updateDisplay();
        Audio.play('click');
      });
    }

    // Refine History Log Toggle (Top bar under header)
    const logBtn = document.getElementById('btn-toggle-log');
    const logBox = document.getElementById('refine-log-box');
    const closeLogBtn = document.getElementById('btn-close-log');
    if (logBtn && logBox) {
      logBtn.addEventListener('click', () => {
        const isHidden = logBox.classList.toggle('hidden');
        logBtn.classList.toggle('active', !isHidden);
        Audio.play('click');
      });
    }
    if (closeLogBtn && logBox) {
      closeLogBtn.addEventListener('click', () => {
        logBox.classList.add('hidden');
        logBtn?.classList.remove('active');
        Audio.play('click');
      });
    }

    // Main Refine Button (Exact same button morphs into HIT! during manual refine)
    const doBtn = document.getElementById('btn-do-refine');
    const handleDoRefine = () => {
      if (minigameActive) {
        onHit();
        return;
      }
      if (!selectedItem) return;
      if (mode === 'manual') {
        startMinigame();
      } else {
        doNpcRefine();
      }
    };

    if (doBtn) {
      doBtn.addEventListener('click', handleDoRefine);
      doBtn.addEventListener('touchstart', (e) => {
        if (minigameActive) {
          e.preventDefault();
          onHit();
        }
      }, { passive: false });
    }

    // Direct touch/click on timing bar as an alternative HIT target
    const barWrap = document.getElementById('timing-bar-wrap');
    if (barWrap) {
      barWrap.addEventListener('click', () => {
        if (minigameActive) onHit();
      });
      barWrap.addEventListener('touchstart', (e) => {
        if (minigameActive) {
          e.preventDefault();
          onHit();
        }
      }, { passive: false });
    }

    // Spacebar control (starts manual refine or hits timing)
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        if (minigameActive) {
          e.preventDefault();
          onHit();
        } else if (mode === 'manual' && selectedItem && !$doBtn()?.disabled) {
          e.preventDefault();
          startMinigame();
        }
      }
    });
  }

  function toggleDrawer(show) {
    const dr = $drawer();
    if (!dr) return;
    if (show) {
      dr.classList.remove('hidden');
      renderDrawer();
    } else {
      dr.classList.add('hidden');
    }
  }

  // ---- Equipment Selection Drawer ----
  function renderDrawer() {
    const container = document.getElementById('equip-picker');
    if (!container) return;
    const d = State.get();
    if (!d) return;

    let items = d.inventory.equipment;
    if (drawerFilter === 'Weapon') {
      items = items.filter(i => {
        const def = EQUIPMENT.find(e => e.id === i.id);
        return def && def.type === 'Weapon';
      });
    } else if (drawerFilter === 'Armor') {
      items = items.filter(i => {
        const def = EQUIPMENT.find(e => e.id === i.id);
        return def && def.type === 'Armor';
      });
    }

    container.innerHTML = '';
    if (items.length === 0) {
      container.innerHTML = '<p style="color:#64748b;font-size:0.85rem;padding:16px;text-align:center;">ไม่มีอุปกรณ์ในหมวดหมู่นี้<br>หาได้จากร้านค้าหรือเปิดกล่อง OBB / OVB!</p>';
      return;
    }

    items.forEach(item => {
      const eqDef = EQUIPMENT.find(e => e.id === item.id);
      if (!eqDef) return;
      const isSelected = selectedItem && selectedItem.instanceId === item.instanceId;
      const div = document.createElement('div');
      div.className = 'equip-pick-item' + (isSelected ? ' active' : '');
      const typeBadge = eqDef.type === 'Weapon' ? `Lv.${eqDef.weaponLevel}` : 'Armor';

      div.innerHTML = `
        <div class="equip-pick-icon">
          <img src="${eqDef.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
        </div>
        <div class="equip-pick-info">
          <div class="equip-pick-name">${eqDef.name}</div>
          <div class="equip-pick-level">+${item.level} · <span style="color:#2563eb;font-weight:700;">${typeBadge}</span> ${item.level >= 10 ? '✨ (MAX)' : ''}</div>
        </div>
      `;

      div.addEventListener('click', () => {
        selectedItem = item;
        toggleDrawer(false);
        updateDisplay();
        Audio.play('click');
      });

      container.appendChild(div);
    });
  }

  // ---- Display Update (Sync with media_1792845954806.jpg layout) ----
  function updateDisplay() {
    const d = State.get();
    if (!d) return;

    // Normal vs Safe mode tabs in Pill 1
    const tabNormal = document.getElementById('tab-mode-normal');
    const tabSafe = document.getElementById('tab-mode-safe');
    if (tabNormal && tabSafe) {
      tabNormal.classList.toggle('active', !isEnriched);
      tabSafe.classList.toggle('active', isEnriched);
    }

    const visual = $itemVisual();
    const ribbon = $ribbonName();
    const doBtn = $doBtn();

    if (!selectedItem) {
      if (visual) {
        visual.innerHTML = `
          <span class="empty-plus">➕</span>
          <span class="empty-text">เลือกอุปกรณ์</span>
        `;
      }
      if (ribbon) ribbon.textContent = 'กรุณาเลือกอุปกรณ์ที่จะตีบวก';
      if ($statCurrLvl())   $statCurrLvl().textContent = '+0';
      if ($statCurrBonus()) $statCurrBonus().textContent = '+0';
      if ($statNextLvl())   $statNextLvl().innerHTML = '+1 <small>(100%)</small>';
      if ($statNextBonus()) $statNextBonus().textContent = '+0';
      if ($matCount())      $matCount().textContent = '0/1';
      if ($zenyCost())      $zenyCost().textContent = '0';
      if ($infoText())      $infoText().textContent = 'คลิกเลือกอาวุธหรือชุดเกราะที่ต้องการตีบวก';
      if ($infoBar())       $infoBar().className = 'refine-info-bar';
      if ($gaugeContainer()) $gaugeContainer().classList.add('hidden');
      if (doBtn) {
        doBtn.disabled = true;
        doBtn.innerHTML = 'Refine';
        doBtn.classList.remove('is-hitting');
      }
      return;
    }

    // Verify item still exists in inventory
    const liveItem = d.inventory.equipment.find(e => e.instanceId === selectedItem.instanceId);
    if (!liveItem) {
      selectedItem = null;
      updateDisplay();
      renderDrawer();
      return;
    }
    selectedItem = liveItem;

    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;
    const safe = getSafeLevel(eqDef);
    const cost = getRefineCost(eqDef, lvl);
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const matDef = MATERIALS.find(m => m.id === matId);
    const matHave = State.getMaterial(matId);
    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    const pct = Math.round(rate * 100);

    // Update center visual
    if (visual) {
      visual.innerHTML = `
        <img src="${eqDef.icon}" class="refine-hero-img" alt="${eqDef.name}" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
      `;
    }

    // Update ribbon banner
    if (ribbon) {
      ribbon.textContent = `${eqDef.name}`;
    }

    // Compute stats
    const currStats = calculateRefinedStats(eqDef, lvl);
    const nextStats = calculateRefinedStats(eqDef, Math.min(10, lvl + 1));
    const statName = eqDef.type === 'Weapon' ? 'Refine Atk :' : 'Refine Def :';

    if ($statLblCurr())   $statLblCurr().textContent = statName;
    if ($statLblNext())   $statLblNext().textContent = statName;
    if ($statCurrLvl())   $statCurrLvl().textContent = `+${lvl}`;
    if ($statCurrBonus()) $statCurrBonus().textContent = `+${currStats.refineBonus}`;

    if (lvl >= 10) {
      if ($statNextLvl())   $statNextLvl().innerHTML = 'MAX';
      if ($statNextBonus()) $statNextBonus().textContent = `+${currStats.refineBonus}`;
      if ($matCount())      $matCount().textContent = '—';
      if ($zenyCost())      $zenyCost().textContent = '—';
      if ($infoText())      $infoText().textContent = '✨ บรรลุระดับการตีบวกสูงสุด (+10 MAX)!';
      if ($infoBar())       $infoBar().className = 'refine-info-bar';
      if ($gaugeContainer()) $gaugeContainer().classList.add('hidden');
      if (doBtn) {
        doBtn.disabled = true;
        doBtn.innerHTML = 'Refine';
        doBtn.classList.remove('is-hitting');
      }
      return;
    }

    if ($statNextLvl()) {
      $statNextLvl().innerHTML = `+${lvl + 1} <small>(${pct}%)</small>`;
    }
    if ($statNextBonus()) {
      $statNextBonus().textContent = `+${nextStats.refineBonus}`;
    }

    // Material Pill
    if ($pillMatIcon() && matDef) {
      $pillMatIcon().src = matDef.icon;
      $pillMatIcon().onerror = () => { $pillMatIcon().src = `https://file5s.ratemyserver.net/items/small/${matDef.itemId}.gif`; };
    }
    if ($matCount()) {
      $matCount().textContent = `${matHave}/1`;
      $matCount().className = 'pill-mat-text' + (matHave < 1 ? ' insufficient' : '');
    }

    // Zeny Pill
    if ($zenyCost()) {
      $zenyCost().textContent = cost.toLocaleString();
      $zenyCost().className = 'pill-zeny-amount' + (d.zeny < cost ? ' insufficient' : '');
    }

    // Info / Warning text
    if ($infoText() && $infoBar()) {
      if (lvl < safe) {
        $infoText().textContent = `100% success for Refine +1 to +${safe}`;
        $infoBar().className = 'refine-info-bar';
      } else {
        $infoText().textContent = `⚠️ เกินระดับปลอดภัย! (+${safe}) หากล้มเหลวอุปกรณ์จะแตกสลาย!`;
        $infoBar().className = 'refine-info-bar warn-break';
      }
    }

    // Gauge preview (shows in manual mode)
    const gaugeContainer = $gaugeContainer();
    if (gaugeContainer) {
      if (mode === 'manual' && lvl < 10) {
        gaugeContainer.classList.remove('hidden');
        renderGaugePreview(eqDef, lvl, isEnriched);
      } else if (!minigameActive) {
        gaugeContainer.classList.add('hidden');
      }
    }

    // Button state (transforms into HIT! during manual refine)
    const canRefine = matHave >= 1 && d.zeny >= cost;
    if (doBtn) {
      if (minigameActive) {
        doBtn.disabled = false;
        doBtn.innerHTML = '💥 HIT!';
        doBtn.classList.add('is-hitting');
      } else {
        doBtn.disabled = !canRefine;
        doBtn.innerHTML = 'Refine';
        doBtn.classList.remove('is-hitting');
      }
    }
  }

  // ---- NPC Refine Execution ----
  async function doNpcRefine() {
    const d = State.get();
    if (!d || !selectedItem) return;
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const cost = getRefineCost(eqDef, lvl);

    if (!State.removeMaterial(matId, 1)) return;
    if (!State.spendZeny(cost)) {
      State.addMaterial(matId, 1);
      return;
    }

    d.stats.totalRefines = (d.stats.totalRefines || 0) + 1;
    State.save();
    updateZeny();
    MainPage.updateZeny();

    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    const roll = Math.random();
    const success = roll <= rate;

    await performRefinementAnimation(success, false);
  }

  // ---- Refine Animation (Hammering overlay + authentic RO Sound) ----
  async function performRefinementAnimation(success, isManual) {
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem?.id);
    const strikeIcon = $strikeIcon();
    if (strikeIcon && eqDef) {
      strikeIcon.innerHTML = `<img src="${eqDef.icon}" style="width:48px;height:48px;" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />`;
    }
    const strikeOverlay = $strikeOverlay();
    if (strikeOverlay) strikeOverlay.classList.remove('hidden');

    // Play iconic RO blacksmith hammer sound
    await Audio.playRefine();

    if (strikeOverlay) strikeOverlay.classList.add('hidden');
    const center = getBtnCenter($doBtn());
    applyRefineResult(success, isManual, center);
  }

  // ---- Apply Result ----
  function applyRefineResult(success, isManual, centerCoords) {
    const d = State.get();
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const oldLvl = selectedItem.level;
    const safe = getSafeLevel(eqDef);

    if (success) {
      d.stats.successCount = (d.stats.successCount || 0) + 1;
      if (isManual) d.stats.manualSuccess = (d.stats.manualSuccess || 0) + 1;
      const newLvl = oldLvl + 1;
      State.updateEquipmentLevel(selectedItem.instanceId, newLvl);

      Audio.play(newLvl >= 7 ? 'level-up' : 'success');
      Particles.successBurst(centerCoords.x, centerCoords.y);
      Particles.flash($itemVisual(), 'success');
      Particles.floatText(centerCoords.x - 30, centerCoords.y - 40, `+${newLvl} ✨`, '#4caf50');

      addLog({
        type: 'success',
        text: `✅ อัพเกรดสำเร็จ! +${oldLvl} → +${newLvl} ${eqDef.name} ${isManual ? '(Manual)' : '(NPC)'}`,
      });
    } else {
      d.stats.failCount = (d.stats.failCount || 0) + 1;
      Audio.play('break');

      if (oldLvl >= safe) {
        d.stats.breakCount = (d.stats.breakCount || 0) + 1;
        State.removeEquipment(selectedItem.instanceId);
        Particles.failBurst(centerCoords.x, centerCoords.y);
        Particles.shake(document.body);
        Particles.floatText(centerCoords.x - 40, centerCoords.y - 40, '💔 แตกสลาย!', '#dc2626');
        addLog({
          type: 'break',
          text: `💔 เสียหาย! ${eqDef.name} แตกสลายเป็นชิ้นเล็กชิ้นน้อยที่ระดับ +${oldLvl}!`,
        });
        selectedItem = null;
      } else {
        Particles.failBurst(centerCoords.x, centerCoords.y);
        Particles.flash($itemVisual(), 'fail');
        Particles.floatText(centerCoords.x - 30, centerCoords.y - 40, '❌ ล้มเหลว!', '#dc2626');
        addLog({
          type: 'fail',
          text: `❌ การอัพเกรดล้มเหลว! ${eqDef.name} (คงอยู่ที่ +${oldLvl})`,
        });
      }
    }

    State.save();
    if (typeof Achievements !== 'undefined' && Achievements.check) {
      Achievements.check();
    }
    updateDisplay();
    renderDrawer();
    updateZeny();
    MainPage.updateZeny();
  }

  // ---- Refine Log ----
  function addLog(entry) {
    entry.time = new Date().toLocaleTimeString();
    State.addRefineLog(entry);
    updateLog();
  }

  function updateLog() {
    const d = State.get();
    if (!d) return;
    const log = $log();
    if (!log) return;
    log.innerHTML = '';
    d.refineLog.forEach(entry => {
      const div = document.createElement('div');
      div.className = `log-entry ${entry.type}`;
      div.innerHTML = `${entry.text}<span class="log-time">${entry.time || ''}</span>`;
      log.appendChild(div);
    });
  }

  // ============================================================
  // MANUAL REFINE MINIGAME (Pangya Style Embedded Gauge)
  // ============================================================
  function renderGaugePreview(eqDef, lvl, enriched) {
    if (minigameActive) return; // do not override active game
    const rate = getSuccessRate(eqDef, lvl, enriched);
    const rawZone = 45 * Math.pow(rate, 2.4);
    const zoneWidth = Math.max(1.8, Math.round(rawZone * 10) / 10);
    const baseSpeed = 50;
    const lvlBonus = lvl * 14;
    const rateBonus = Math.pow(1 - rate, 1.8) * 85;
    const spd = Math.round(baseSpeed + lvlBonus + rateBonus);

    const previewStart = Math.round((50 - zoneWidth / 2) * 10) / 10;
    const previewEnd = Math.round((previewStart + zoneWidth) * 10) / 10;

    const zoneSEl = $zoneS();
    if (zoneSEl && $zoneDL() && $zoneDR()) {
      $zoneDL().style.left  = '0%';
      $zoneDL().style.width = previewStart + '%';
      zoneSEl.style.left    = previewStart + '%';
      zoneSEl.style.width   = zoneWidth + '%';
      $zoneDR().style.left  = previewEnd + '%';
      $zoneDR().style.width = (100 - previewEnd) + '%';
      if (zoneWidth <= 5) zoneSEl.classList.add('critical');
      else zoneSEl.classList.remove('critical');
    }

    const statHint = document.getElementById('minigame-stat-hint');
    if (statHint) {
      let diffTag = 'NORMAL';
      if (zoneWidth <= 3.5) diffTag = '★★★ EXTREME';
      else if (zoneWidth <= 10) diffTag = '★★ HARD';
      statHint.innerHTML = `🎯 โอกาสสำเร็จ: <strong>${Math.round(rate * 100)}%</strong> · เป้าหมาย: <strong>${zoneWidth.toFixed(1)}%</strong> · ความเร็ว: <strong>${spd}%/s</strong> <span style="color:#f59e0b;font-weight:700;">(${diffTag})</span>`;
    }

    if ($needle()) $needle().style.left = '0%';
    if ($timerVal()) $timerVal().textContent = '5';
    $timerBadge()?.classList.remove('danger');
  }

  function startMinigame() {
    const d = State.get();
    if (!d || !selectedItem) return;
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const cost = getRefineCost(eqDef, lvl);

    if (!State.removeMaterial(matId, 1)) return;
    if (!State.spendZeny(cost)) {
      State.addMaterial(matId, 1);
      return;
    }

    d.stats.totalRefines = (d.stats.totalRefines || 0) + 1;
    State.save();
    updateZeny();
    MainPage.updateZeny();

    // True exponential scaling based on success rate
    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    // Zone width: scales exponentially with rate^2.4 from 45% (100% safe) down to 1.8% (10% rate)
    const rawZone = 45 * Math.pow(rate, 2.4);
    const zoneWidth = Math.max(1.8, Math.round(rawZone * 10) / 10);

    // Random placement across the timing bar (15% to 85%)
    const minStart = 15;
    const maxStart = Math.max(minStart, 85 - zoneWidth);
    successZoneStart = Math.round((minStart + Math.random() * (maxStart - minStart)) * 10) / 10;
    successZoneEnd = Math.round((successZoneStart + zoneWidth) * 10) / 10;

    const zoneSEl = $zoneS();
    $zoneDL().style.left  = '0%';
    $zoneDL().style.width = successZoneStart + '%';
    zoneSEl.style.left    = successZoneStart + '%';
    zoneSEl.style.width   = zoneWidth + '%';
    $zoneDR().style.left  = successZoneEnd + '%';
    $zoneDR().style.width = (100 - successZoneEnd) + '%';

    // Highlight critical zone if target is tight (<= 5%)
    if (zoneWidth <= 5) {
      zoneSEl.classList.add('critical');
    } else {
      zoneSEl.classList.remove('critical');
    }

    // Needle speed: scales exponentially with level and difficulty
    const baseSpeed = 50;
    const lvlBonus = lvl * 14;
    const rateBonus = Math.pow(1 - rate, 1.8) * 85;
    needleSpeed = Math.round(baseSpeed + lvlBonus + rateBonus);

    // Update real-time minigame difficulty hint
    const statHint = document.getElementById('minigame-stat-hint');
    if (statHint) {
      let diffTag = '★ NORMAL';
      if (zoneWidth <= 3.5) diffTag = '★★★ EXTREME';
      else if (zoneWidth <= 10) diffTag = '★★ HARD';
      statHint.innerHTML = `🎯 โอกาสสำเร็จ: <strong>${Math.round(rate * 100)}%</strong> · เป้าหมาย: <strong>${zoneWidth.toFixed(1)}%</strong> · ความเร็ว: <strong>${needleSpeed}%/s</strong> <span style="color:#f59e0b;font-weight:700;">(${diffTag})</span>`;
    }

    needlePos = 0;
    needleDir = 1;
    lastTs = null;

    timerSec = 5;
    if ($timerVal()) $timerVal().textContent = timerSec;
    $timerBadge()?.classList.remove('danger');

    $gaugeContainer()?.classList.remove('hidden');
    minigameActive = true;

    // Morph the Refine button into HIT! button at the EXACT SAME POSITION
    const doBtn = $doBtn();
    if (doBtn) {
      doBtn.innerHTML = '💥 HIT!';
      doBtn.classList.add('is-hitting');
      doBtn.disabled = false;
    }
    const manBtn = $manualBtn();
    if (manBtn) manBtn.disabled = true;

    countdownTimer = setInterval(() => {
      timerSec--;
      if ($timerVal()) $timerVal().textContent = timerSec;
      if (timerSec <= 2) {
        $timerBadge()?.classList.add('danger');
      }
      if (timerSec <= 0) {
        resolveMinigame(false);
      }
    }, 1000);

    rafId = requestAnimationFrame(animateNeedle);
  }

  function animateNeedle(ts) {
    if (!minigameActive) return;
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    needlePos += needleDir * needleSpeed * dt;
    if (needlePos >= 100) { needlePos = 100; needleDir = -1; }
    if (needlePos <= 0)   { needlePos = 0;   needleDir = 1; }

    if ($needle()) $needle().style.left = `calc(${needlePos}% - 2px)`;
    rafId = requestAnimationFrame(animateNeedle);
  }

  function onHit() {
    if (!minigameActive) return;
    // Allow a small fair 0.35% tolerance
    const hit = needlePos >= (successZoneStart - 0.35) && needlePos <= (successZoneEnd + 0.35);
    resolveMinigame(hit);
  }

  async function resolveMinigame(hit) {
    closeMinigame();
    const doBtn = $doBtn();
    if (doBtn) doBtn.disabled = true;
    await performRefinementAnimation(hit, true);
  }

  function closeMinigame() {
    minigameActive = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }

    const doBtn = $doBtn();
    if (doBtn) {
      doBtn.classList.remove('is-hitting');
      doBtn.innerHTML = 'Refine';
    }
    const manBtn = $manualBtn();
    if (manBtn) manBtn.disabled = false;
    $timerBadge()?.classList.remove('danger');

    if (mode === 'npc') {
      $gaugeContainer()?.classList.add('hidden');
    }
  }

  function getBtnCenter(btn) {
    if (!btn) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = btn.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  return { open, close, selectItem: (it) => { selectedItem = it; updateDisplay(); } };
})();
