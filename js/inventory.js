/**
 * inventory.js – Authentic Ragnarok Online Item Bag (Inventory)
 * Supports RMS item icons, weapon levels, box unboxing (OBB/OVB), and ore refinery
 */

const Inventory = (() => {
  let activeTab = 'equipment';
  const $tooltip = document.getElementById('item-tooltip');

  function open() {
    try {
      render();
      bindTabs();
    } catch (err) {
      console.error('Inventory open error:', err);
    }
  }

  function bindTabs() {
    document.querySelectorAll('.ro-tab-btn[data-inv-tab]').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.ro-tab-btn[data-inv-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.invTab;
        document.querySelectorAll('.ro-item-grid').forEach(g => g.classList.remove('active'));
        document.getElementById('inv-' + activeTab).classList.add('active');
        Audio.play('click');
      };
    });
  }

  function render() {
    const d = State.get();
    if (!d) return;

    document.getElementById('inv-zeny').textContent = d.zeny.toLocaleString();

    // ---- Equipment Grid ----
    const eqGrid = document.getElementById('inv-equipment');
    eqGrid.innerHTML = '';
    if (d.inventory.equipment.length === 0) {
      eqGrid.innerHTML = '<div class="inv-empty">📦 ไม่มีอุปกรณ์ในตัว<br>หาได้จากการล่ามอนสเตอร์, ซื้อจากร้านค้า หรือเปิดกล่อง OBB / OVB!</div>';
    } else {
      d.inventory.equipment.forEach(item => {
        const eqDef = EQUIPMENT.find(e => e.id === item.id);
        if (!eqDef) return;
        const cell = document.createElement('div');
        cell.className = 'inv-item';
        
        const typeBadge = eqDef.type === 'Weapon' ? `Lv.${eqDef.weaponLevel}` : 'Armor';
        const stats = calculateRefinedStats(eqDef, item.level);

        cell.innerHTML = `
          <div class="inv-item-icon-wrap">
            <img src="${eqDef.icon}" alt="${eqDef.name}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
          </div>
          <span class="inv-item-name">${eqDef.name}</span>
          <span class="inv-item-badge ${eqDef.type === 'Weapon' ? 'badge-wlv' : 'badge-armor'}">${typeBadge}</span>
          <span class="inv-item-level ${item.level >= 7 ? 'level-high' : ''}">+${item.level}</span>
        `;
        cell.addEventListener('mouseenter', e => showTooltip(e, item, eqDef, stats));
        cell.addEventListener('mousemove', moveTooltip);
        cell.addEventListener('mouseleave', hideTooltip);
        cell.addEventListener('click', e => {
          showTooltip(e, item, eqDef, stats);
        });
        eqGrid.appendChild(cell);
      });
    }

    // ---- Materials & Usable Grid ----
    const matGrid = document.getElementById('inv-materials');
    matGrid.innerHTML = '';
    const mats = d.inventory.materials;
    let anyMat = false;

    MATERIALS.forEach(def => {
      const qty = mats[def.id] || 0;
      if (qty <= 0) return;
      anyMat = true;
      const cell = document.createElement('div');
      cell.className = 'inv-item mat-item';

      let actionHtml = '';
      if (def.isUsable) {
        actionHtml = `<button class="btn-use-box" data-box="${def.id}" title="เปิดกล่องเพื่อสุ่มไอเทม">🎁 เปิด</button>`;
      } else if (def.id === 'rough_oridecon' || def.id === 'rough_elunium') {
        if (qty >= 5) {
          actionHtml = `<button class="btn-combine-ore" data-rough="${def.id}" title="หลอมเศษแร่ 5 ก้อนเป็น 1 ก้อนบริสุทธิ์">✨ หลอม</button>`;
        }
      }

      cell.innerHTML = `
        <div class="inv-item-icon-wrap">
          <img src="${def.icon}" alt="${def.name}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${def.itemId}.gif'" />
        </div>
        <span class="inv-item-name">${def.name}</span>
        <span class="inv-item-count">x${qty}</span>
        ${actionHtml}
      `;

      // Button listeners
      const useBtn = cell.querySelector('.btn-use-box');
      if (useBtn) {
        useBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openTreasureBox(def.id);
        });
      }

      const combineBtn = cell.querySelector('.btn-combine-ore');
      if (combineBtn) {
        combineBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          combineRough(def.id);
        });
      }

      cell.addEventListener('mouseenter', e => showMatTooltip(e, def, qty));
      cell.addEventListener('mousemove', moveTooltip);
      cell.addEventListener('mouseleave', hideTooltip);
      cell.addEventListener('click', e => {
        showMatTooltip(e, def, qty);
      });
      matGrid.appendChild(cell);
    });

    if (!anyMat) {
      matGrid.innerHTML = '<div class="inv-empty">🪨 ไม่มีหินหรือกล่องสมบัติในตัว<br>ซื้อได้จากร้านค้า หรือได้จากการล่ามอนสเตอร์!</div>';
    }
  }

  function openTreasureBox(boxId) {
    const boxDef = MATERIALS.find(m => m.id === boxId);
    Audio.play('buy');
    const reward = State.openBox(boxId);
    if (!reward) return;

    Audio.play('level-up');
    showNotification(`🎁 เปิด ${boxDef?.name}! ได้รับ [${reward.name}]!`);
    render();
    MainPage.refresh();
  }

  function combineRough(roughId) {
    const success = State.combineRoughStone(roughId);
    if (success) {
      Audio.play('buy');
      const roughDef = MATERIALS.find(m => m.id === roughId);
      const targetName = roughId === 'rough_oridecon' ? 'Oridecon' : 'Elunium';
      showNotification(`✨ หลอมสำเร็จ! ได้รับ ${targetName} 1 ก้อน!`);
      render();
    }
  }

  function showTooltip(e, item, eqDef, stats) {
    const lvl = item.level;
    const safe = getSafeLevel(eqDef);
    const safeClass = lvl <= safe ? 'text-safe' : 'text-danger';
    const matName = getRequiredMaterial(eqDef);
    const matDef = MATERIALS.find(m => m.id === matName);

    $tooltip.innerHTML = `
      <button type="button" class="tooltip-close-btn" id="btn-close-tooltip" title="ปิด">✕</button>
      <div class="tooltip-header">
        <img src="${eqDef.icon}" class="tooltip-icon" />
        <div class="tooltip-title-wrap">
          <div class="tooltip-name">${eqDef.name} <span class="refine-badge">+${lvl}</span></div>
          <div class="tooltip-sub">Item ID# ${eqDef.itemId} · ${eqDef.type}</div>
        </div>
      </div>
      <div class="tooltip-divider"></div>
      <div class="tooltip-body">
        <div class="tooltip-row">
          <span>ประเภท (Class):</span>
          <strong>${eqDef.subClass || eqDef.type}</strong>
        </div>
        ${eqDef.type === 'Weapon' ? `
          <div class="tooltip-row">
            <span>เลเวลอาวุธ (Weapon Lv):</span>
            <strong style="color:#275ff9;">Level ${eqDef.weaponLevel}</strong>
          </div>
          <div class="tooltip-row">
            <span>พลังโจมตี (ATK):</span>
            <strong>${eqDef.baseAtk} + <span style="color:#2e7d32">${stats.refineBonus}</span> (${stats.total})</strong>
          </div>
        ` : `
          <div class="tooltip-row">
            <span>พลังป้องกัน (DEF):</span>
            <strong>${eqDef.baseDef} + <span style="color:#2e7d32">${stats.refineBonus}</span> (${stats.total})</strong>
          </div>
        `}
        <div class="tooltip-row">
          <span>หินที่ใช้ตีบวก:</span>
          <span style="color:#b45309; font-weight:700;">${matDef ? matDef.name : matName}</span>
        </div>
        <div class="tooltip-row">
          <span>ระดับปลอดภัย (Safe Refine):</span>
          <span class="${safeClass}">ปลอดภัยถึง +${safe}</span>
        </div>
        <div class="tooltip-desc">${eqDef.desc}</div>
      </div>
    `;
    $tooltip.classList.add('visible');
    $tooltip.querySelector('#btn-close-tooltip')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      hideTooltip();
    });
    moveTooltip(e);
  }

  function showMatTooltip(e, def, qty) {
    $tooltip.innerHTML = `
      <button type="button" class="tooltip-close-btn" id="btn-close-mat-tooltip" title="ปิด">✕</button>
      <div class="tooltip-header">
        <img src="${def.icon}" class="tooltip-icon" />
        <div class="tooltip-title-wrap">
          <div class="tooltip-name">${def.name}</div>
          <div class="tooltip-sub">Item ID# ${def.itemId} · ${def.category === 'box' ? 'Treasure Box' : 'Refine Material'}</div>
        </div>
      </div>
      <div class="tooltip-divider"></div>
      <div class="tooltip-body">
        <div class="tooltip-row">
          <span>จำนวนที่มีในตัว:</span>
          <strong style="color:#1a3da8;">${qty} ชิ้น</strong>
        </div>
        <div class="tooltip-desc">${def.desc}</div>
      </div>
    `;
    $tooltip.classList.add('visible');
    $tooltip.querySelector('#btn-close-mat-tooltip')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      hideTooltip();
    });
    moveTooltip(e);
  }

  function moveTooltip(e) {
    let x = e.clientX + 14;
    let y = e.clientY + 14;
    if (x + 310 > window.innerWidth)  x = e.clientX - 310;
    if (y + 240 > window.innerHeight) y = e.clientY - 240;
    $tooltip.style.left = x + 'px';
    $tooltip.style.top  = y + 'px';
  }

  function hideTooltip() { $tooltip.classList.remove('visible'); }

  function showNotification(msg) {
    const toast = document.getElementById('hunt-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  return { open, render };
})();
