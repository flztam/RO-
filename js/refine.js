/**
 * refine.js – Authentic Ragnarok Online Refinement System
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
  let pickerOpen = false;

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

  // DOM refs
  const $overlay    = () => document.getElementById('minigame-overlay');
  const $needle     = () => document.getElementById('timing-needle');
  const $zoneS      = () => document.getElementById('zone-success');
  const $zoneDL     = () => document.getElementById('zone-danger-left');
  const $zoneDR     = () => document.getElementById('zone-danger-right');
  const $timerVal   = () => document.getElementById('minigame-timer-val');
  const $refineZeny = () => document.getElementById('refine-zeny');
  const $matCount   = () => document.getElementById('mat-count');
  const $zenyCost   = () => document.getElementById('zeny-cost');
  const $log        = () => document.getElementById('refine-log');
  const $doBtn      = () => document.getElementById('btn-do-refine');
  const $itemVisual = () => document.getElementById('refine-item-visual');
  const $itemLevel  = () => document.querySelector('#refine-item-visual .refine-item-level');
  const $chanceInfo = () => document.getElementById('refine-chance-info');
  const $strikeOverlay = () => document.getElementById('refine-striking-overlay');
  const $strikeIcon    = () => document.getElementById('striking-item-icon');

  function open() {
    selectedItem = null;
    pickerOpen = false;
    isEnriched = false;
    renderEquipPanel();
    updateDisplay();
    updateLog();
    updateZeny();
  }

  function close() {
    closeMinigame(false);
  }

  function updateZeny() {
    const d = State.get();
    if (d) $refineZeny().textContent = d.zeny.toLocaleString();
  }

  // ---- Equipment Panel ----
  function renderEquipPanel() {
    const slot = document.getElementById('equip-slot');
    const picker = document.getElementById('equip-picker');

    if (!pickerOpen && !selectedItem) {
      slot.innerHTML = `<span class="equip-slot-icon">➕</span><span class="equip-slot-label">คลิกเพื่อเลือกอุปกรณ์ที่ต้องการตีบวก</span>`;
      slot.className = 'equip-slot empty';
      picker.classList.add('hidden');
    } else if (pickerOpen) {
      slot.innerHTML = `<span class="equip-slot-icon">🔍</span><span class="equip-slot-label">เลือกอุปกรณ์จากรายการด้านล่าง</span>`;
      slot.className = 'equip-slot empty';
      picker.classList.remove('hidden');
      renderPicker(picker);
    } else if (selectedItem) {
      const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
      const typeLabel = eqDef.type === 'Weapon' ? `Weapon Lv.${eqDef.weaponLevel}` : 'Armor';
      slot.innerHTML = `
        <div class="inv-item-icon-wrap">
          <img src="${eqDef.icon}" alt="${eqDef.name}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
        </div>
        <span class="equip-slot-name">${eqDef.name}</span>
        <span class="equip-slot-level">+${selectedItem.level} (${typeLabel})</span>
      `;
      slot.className = 'equip-slot has-item';
      picker.classList.add('hidden');
    }
  }

  function renderPicker(container) {
    const d = State.get();
    if (!d) return;
    const items = d.inventory.equipment;
    container.innerHTML = '';
    if (items.length === 0) {
      container.innerHTML = '<p style="color:#64748b;font-size:0.85rem;padding:12px;text-align:center;">ไม่มีอุปกรณ์ในตัว<br>ซื้อได้จากร้านค้า หรือเปิดกล่อง OBB / OVB!</p>';
      return;
    }
    items.forEach(item => {
      const eqDef = EQUIPMENT.find(e => e.id === item.id);
      if (!eqDef) return;
      const div = document.createElement('div');
      div.className = 'equip-pick-item';
      const typeBadge = eqDef.type === 'Weapon' ? `Lv.${eqDef.weaponLevel}` : 'Armor';
      div.innerHTML = `
        <div class="inv-item-icon-wrap" style="width:28px;height:28px;">
          <img src="${eqDef.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
        </div>
        <div class="equip-pick-info">
          <div class="equip-pick-name">${eqDef.name}</div>
          <div class="equip-pick-level">+${item.level} · <span style="color:#275ff9;font-weight:700;">${typeBadge}</span> ${item.level >= 10 ? '✨ (MAX)' : ''}</div>
        </div>
      `;
      div.addEventListener('click', () => {
        selectedItem = item;
        pickerOpen = false;
        renderEquipPanel();
        updateDisplay();
        Audio.play('click');
      });
      container.appendChild(div);
    });
  }

  document.getElementById('equip-slot').addEventListener('click', () => {
    pickerOpen = !pickerOpen;
    if (!pickerOpen && selectedItem) {
      // keep selected
    } else {
      selectedItem = null;
    }
    renderEquipPanel();
    updateDisplay();
  });

  // ---- Mode buttons ----
  document.getElementById('mode-npc').addEventListener('click', () => {
    mode = 'npc';
    document.getElementById('mode-npc').classList.add('active');
    document.getElementById('mode-manual').classList.remove('active');
    updateDisplay();
    Audio.play('click');
  });
  document.getElementById('mode-manual').addEventListener('click', () => {
    mode = 'manual';
    document.getElementById('mode-manual').classList.add('active');
    document.getElementById('mode-npc').classList.remove('active');
    updateDisplay();
    Audio.play('click');
  });

  // ---- Enriched Stone Toggle ----
  document.getElementById('btn-toggle-enriched')?.addEventListener('click', () => {
    isEnriched = !isEnriched;
    const btn = document.getElementById('btn-toggle-enriched');
    const label = document.getElementById('enriched-btn-text');
    if (isEnriched) {
      btn.classList.add('active');
      if (label) label.textContent = '✨ ใช้หิน Enriched (เพิ่มโอกาสสำเร็จ): เปิดใช้งาน (ON)';
    } else {
      btn.classList.remove('active');
      if (label) label.textContent = '✨ ใช้หิน Enriched (เพิ่มโอกาสสำเร็จ): ปิด (OFF)';
    }
    updateDisplay();
    Audio.play('click');
  });

  // ---- Display Update ----
  function updateDisplay() {
    const d = State.get();
    if (!d) return;

    const visual = $itemVisual();

    if (!selectedItem) {
      visual.innerHTML = `
        <span class="refine-item-icon">❓</span>
        <span class="refine-item-level">+?</span>
      `;
      $chanceInfo().innerHTML = '<span>กรุณาเลือกอุปกรณ์จากรายการด้านซ้าย</span>';
      $matCount().textContent = '—';
      $zenyCost().textContent = '0 z';
      $doBtn().disabled = true;
      return;
    }

    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;

    // Verify item is still in player inventory
    const liveItem = d.inventory.equipment.find(e => e.instanceId === selectedItem.instanceId);
    if (!liveItem) { selectedItem = null; renderEquipPanel(); updateDisplay(); return; }
    selectedItem = liveItem;

    const safe = getSafeLevel(eqDef);
    const cost = getRefineCost(eqDef, lvl);
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const matDef = MATERIALS.find(m => m.id === matId);
    const matHave = State.getMaterial(matId);
    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    const pct = Math.round(rate * 100);

    // Update item visual with RateMyServer image
    visual.innerHTML = `
      <img src="${eqDef.icon}" class="refine-hero-img" alt="${eqDef.name}" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
      <span class="refine-item-level ${lvl >= 7 ? 'level-high' : ''} ${lvl >= 10 ? 'level-max' : ''}">+${lvl}</span>
    `;

    if (lvl >= 10) {
      $chanceInfo().innerHTML = '<span style="color:#ffd54f;font-weight:700;font-size:1.1rem;">✨ บรรลุระดับการตีบวกสูงสุด (+10 MAX)!</span>';
      $doBtn().disabled = true;
      $matCount().textContent = '—';
      $zenyCost().textContent = '—';
      return;
    }

    let chanceClass = 'chance-high';
    if (pct < 50) chanceClass = 'chance-mid';
    if (pct <= 20) chanceClass = 'chance-low';

    let safeBadgeHtml = '';
    if (lvl < safe) {
      safeBadgeHtml = `<div class="safe-badge-pill safe-on">🛡️ ช่วงปลอดภัย (Safe Refine 100%) · ปลอดภัยถึง +${safe}</div>`;
    } else {
      safeBadgeHtml = `<div class="safe-badge-pill safe-warn">⚠️ คำเตือน: เกินระดับปลอดภัย! (+${safe}) หากล้มเหลวอุปกรณ์จะแตกสลาย!</div>`;
    }

    $chanceInfo().innerHTML = `
      ${safeBadgeHtml}
      <div style="margin-top:6px;">
        อัตราสำเร็จ: <span class="chance-value ${chanceClass}">${pct}%</span>
        <small style="color:#94a3b8;">(+${lvl} → +${lvl+1})</small>
      </div>
    `;

    // Material display
    $matCount().innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:4px;">
        <img src="${matDef.icon}" style="width:20px;height:20px;vertical-align:middle;" />
        ${matDef.name}: <strong>${matHave} / 1</strong>
      </span>
    `;
    $matCount().className = 'mat-count' + (matHave < 1 ? ' insufficient' : '');

    // Cost display
    $zenyCost().textContent = cost.toLocaleString() + ' z';

    const canRefine = matHave >= 1 && d.zeny >= cost;
    $doBtn().disabled = !canRefine;
  }

  // ---- Refine Button ----
  document.getElementById('btn-do-refine').addEventListener('click', () => {
    if (!selectedItem) return;
    if (mode === 'manual') {
      startMinigame();
    } else {
      doNpcRefine();
    }
  });

  // ---- Refine Animation (Hammering overlay + authentic RO Sound) ----
  async function performRefinementAnimation(success, isManual) {
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem?.id);
    const strikeIcon = $strikeIcon();
    if (strikeIcon && eqDef) {
      strikeIcon.innerHTML = `<img src="${eqDef.icon}" style="width:48px;height:48px;" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />`;
    }
    const strikeOverlay = $strikeOverlay();
    if (strikeOverlay) strikeOverlay.classList.remove('hidden');

    // Play authentic Ragnarok Online refine sound (blacksmith_refine.mp3)
    await Audio.playRefine();

    if (strikeOverlay) strikeOverlay.classList.add('hidden');
    const center = getBtnCenter($doBtn());
    applyRefineResult(success, isManual, center);
  }

  // ---- NPC Refine ----
  async function doNpcRefine() {
    const d = State.get();
    if (!d || !selectedItem) return;
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const cost = getRefineCost(eqDef, lvl);

    if (!State.removeMaterial(matId, 1)) return;
    if (!State.spendZeny(cost)) { State.addMaterial(matId, 1); return; }

    d.stats.totalRefines++;
    State.save();
    updateZeny();
    MainPage.updateZeny();

    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    const roll = Math.random();
    const success = roll <= rate;

    await performRefinementAnimation(success, false);
  }

  // ---- Apply Result (Shared) ----
  function applyRefineResult(success, isManual, centerCoords) {
    const d = State.get();
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const oldLvl = selectedItem.level;
    const safe = getSafeLevel(eqDef);

    if (success) {
      d.stats.successCount++;
      if (isManual) d.stats.manualSuccess++;
      const newLvl = oldLvl + 1;
      State.updateEquipmentLevel(selectedItem.instanceId, newLvl);

      Audio.play(newLvl >= 7 ? 'level-up' : 'success');
      Particles.successBurst(centerCoords.x, centerCoords.y);
      Particles.flash($itemVisual(), 'success');
      Particles.floatText(centerCoords.x - 30, centerCoords.y - 40, `+${newLvl} ✨`, '#4caf50');

      addLog({
        type: 'success',
        text: `✅ อัพเกรดสำเร็จ! +${oldLvl} → +${newLvl} ${eqDef.name} ${isManual ? '(ตีด้วยตนเอง)' : '(ช่างตี)'}`,
      });
    } else {
      d.stats.failCount++;
      Audio.play('break');

      // Authentic Classic RO Rule: Beyond safe level, equipment breaks upon failure!
      if (oldLvl >= safe) {
        d.stats.breakCount++;
        State.removeEquipment(selectedItem.instanceId);
        Particles.failBurst(centerCoords.x, centerCoords.y);
        Particles.shake(document.body);
        Particles.floatText(centerCoords.x - 40, centerCoords.y - 40, '💔 แตกสลาย!', '#dc2626');
        addLog({
          type: 'break',
          text: `💔 เสียหาย! ${eqDef.name} แตกสลายเป็นชิ้นเล็กชิ้นน้อยที่ระดับ +${oldLvl}!`,
        });
        selectedItem = null;
        pickerOpen = false;
        renderEquipPanel();
      } else {
        // Safe level theoretically has 100% success, but as safety guard:
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
    Achievements.check();
    updateDisplay();
    updateZeny();
    MainPage.updateZeny();
  }

  // ---- Log ----
  function addLog(entry) {
    entry.time = new Date().toLocaleTimeString();
    State.addRefineLog(entry);
    updateLog();
  }

  function updateLog() {
    const d = State.get();
    if (!d) return;
    const log = $log();
    log.innerHTML = '';
    d.refineLog.forEach(entry => {
      const div = document.createElement('div');
      div.className = `log-entry ${entry.type}`;
      div.innerHTML = `${entry.text}<span class="log-time">${entry.time || ''}</span>`;
      log.appendChild(div);
    });
  }

  // ============================================================
  // MANUAL REFINE MINIGAME (Pangya Style Gauge)
  // ============================================================
  function startMinigame() {
    const d = State.get();
    if (!d || !selectedItem) return;
    const eqDef = EQUIPMENT.find(e => e.id === selectedItem.id);
    const lvl = selectedItem.level;
    const matId = getRequiredMaterial(eqDef, isEnriched);
    const cost = getRefineCost(eqDef, lvl);

    if (!State.removeMaterial(matId, 1)) return;
    if (!State.spendZeny(cost)) { State.addMaterial(matId, 1); return; }

    d.stats.totalRefines++;
    State.save();
    updateZeny();
    MainPage.updateZeny();

    // Zone calculation directly tied to classic RO success rate!
    const rate = getSuccessRate(eqDef, lvl, isEnriched);
    // Green target zone: from 12% (10% rate) to 80% (100% safe rate)
    const zoneWidth = Math.max(12, Math.round(rate * 60));
    successZoneStart = Math.round(30 + Math.random() * (40 - zoneWidth / 2));
    successZoneStart = Math.max(10, Math.min(successZoneStart, 90 - zoneWidth));
    successZoneEnd = successZoneStart + zoneWidth;

    // Apply zone styles
    $zoneDL().style.left  = '0%';
    $zoneDL().style.width = successZoneStart + '%';
    $zoneS().style.left   = successZoneStart + '%';
    $zoneS().style.width  = (successZoneEnd - successZoneStart) + '%';
    $zoneDR().style.left  = successZoneEnd + '%';
    $zoneDR().style.width = (100 - successZoneEnd) + '%';

    // Needle speed: higher refine levels speed up the needle!
    needleSpeed = 35 + (lvl * 9);
    needlePos = 0;
    needleDir = 1;
    lastTs = null;

    timerSec = 5;
    $timerVal().textContent = timerSec;

    $overlay().classList.remove('hidden');
    minigameActive = true;

    countdownTimer = setInterval(() => {
      timerSec--;
      $timerVal().textContent = timerSec;
      if (timerSec <= 0) { resolveMinigame(false); }
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

    $needle().style.left = `calc(${needlePos}% - 2px)`;
    rafId = requestAnimationFrame(animateNeedle);
  }

  function onHit() {
    if (!minigameActive) return;
    const hit = needlePos >= successZoneStart && needlePos <= successZoneEnd;
    resolveMinigame(hit);
  }

  async function resolveMinigame(hit) {
    closeMinigame(true);
    await performRefinementAnimation(hit, true);
  }

  function closeMinigame(animate) {
    minigameActive = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    $overlay().classList.add('hidden');
  }

  const hitBtn = document.getElementById('btn-hit');
  hitBtn.addEventListener('click', onHit);
  hitBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onHit();
  }, { passive: false });

  document.getElementById('timing-bar')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onHit();
  }, { passive: false });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && minigameActive) { e.preventDefault(); onHit(); }
  });

  function getBtnCenter(btn) {
    const r = btn.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  return { open, close };
})();
