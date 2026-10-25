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
          e.preventDefault();
          e.stopPropagation();
          hideTooltip();
          promptOpenBox(def.id);
        });
      }

      const combineBtn = cell.querySelector('.btn-combine-ore');
      if (combineBtn) {
        combineBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideTooltip();
          combineRough(def.id);
        });
      }

      cell.addEventListener('mouseenter', e => {
        if (window.matchMedia('(hover: none)').matches) return;
        showMatTooltip(e, def, qty);
      });
      cell.addEventListener('mousemove', e => {
        if (window.matchMedia('(hover: none)').matches) return;
        moveTooltip(e);
      });
      cell.addEventListener('mouseleave', e => {
        if (window.matchMedia('(hover: none)').matches) return;
        if (e.relatedTarget && $tooltip.contains(e.relatedTarget)) return;
        hideTooltip();
      });
      cell.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        hideTooltip();
        if (def.isUsable) {
          promptOpenBox(def.id);
        } else {
          showMatTooltip(e, def, qty);
        }
      });
      matGrid.appendChild(cell);
    });

    if (!anyMat) {
      matGrid.innerHTML = '<div class="inv-empty">🪨 ไม่มีหินหรือกล่องสมบัติในตัว<br>ซื้อได้จากร้านค้า หรือได้จากการล่ามอนสเตอร์!</div>';
    }
  }

  let pendingBoxId = null;

  function promptOpenBox(boxId) {
    const boxDef = MATERIALS.find(m => m.id === boxId);
    if (!boxDef) return;
    const qty = State.getMaterial(boxId);
    if (qty < 1) {
      showNotification(`❌ ท่านไม่มี ${boxDef.name} ในตัว!`);
      return;
    }

    pendingBoxId = boxId;
    hideTooltip();

    const modal = document.getElementById('unbox-confirm-modal');
    if (!modal) {
      openTreasureBox(boxId);
      return;
    }

    const icon = document.getElementById('unbox-confirm-icon');
    const name = document.getElementById('unbox-confirm-name');
    const desc = document.getElementById('unbox-confirm-desc');
    const qtyEl = document.getElementById('unbox-confirm-qty');

    if (icon) {
      icon.src = boxDef.icon;
      icon.onerror = () => { icon.src = `https://file5s.ratemyserver.net/items/small/${boxDef.itemId}.gif`; };
    }
    if (name) name.textContent = boxDef.name;
    if (desc) desc.textContent = boxDef.desc || 'กล่องสมบัติโบราณ เมื่อเปิดจะสุ่มได้รับอุปกรณ์สวมใส่ 1 ชิ้น';
    if (qtyEl) qtyEl.textContent = qty;

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('btn-close-unbox-confirm');
    const cancelBtn = document.getElementById('btn-cancel-open-box');
    const confirmBtn = document.getElementById('btn-confirm-open-box');

    const closeModal = () => modal.classList.add('hidden');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        closeModal();
        openTreasureBox(pendingBoxId);
      };
    }
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  function openTreasureBox(boxId) {
    const boxDef = MATERIALS.find(m => m.id === boxId);
    if (!boxDef) return;
    
    if (State.getMaterial(boxId) < 1) {
      showNotification(`❌ ท่านไม่มี ${boxDef.name} ในตัว!`);
      return;
    }

    const reward = State.openBox(boxId);
    if (!reward) {
      showNotification(`❌ ไม่สามารถเปิด ${boxDef.name} ได้!`);
      return;
    }

    hideTooltip();
    Audio.play('level-up');
    try {
      Particles.successBurst(window.innerWidth / 2, window.innerHeight / 2);
    } catch (e) {}

    showUnboxModal(reward, boxId);
    render();
    MainPage.refresh();
    if (typeof Achievements !== 'undefined' && Achievements.check) {
      Achievements.check();
    }
  }

  function showUnboxModal(reward, boxId) {
    const modal = document.getElementById('unbox-modal');
    if (!modal) return;

    const img = document.getElementById('unbox-item-img');
    const name = document.getElementById('unbox-item-name');
    const badgeType = document.getElementById('unbox-badge-type');
    const badgeStat = document.getElementById('unbox-badge-stat');
    const price = document.getElementById('unbox-item-price');
    const desc = document.getElementById('unbox-item-desc');
    const remCount = document.getElementById('unbox-rem-count');
    const btnAgain = document.getElementById('btn-unbox-again');

    if (img) {
      img.src = reward.icon;
      img.onerror = () => { img.src = `https://file5s.ratemyserver.net/items/small/${reward.itemId}.gif`; };
    }
    if (name) name.textContent = reward.name;
    if (badgeType) badgeType.textContent = reward.type === 'Weapon' ? `Weapon Lv.${reward.weaponLevel}` : 'Armor';
    if (badgeStat) badgeStat.textContent = reward.type === 'Weapon' ? `ATK: ${reward.baseAtk}` : `DEF: ${reward.baseDef}`;
    const sellVal = reward.sellPrice || Math.round((reward.price || 100) * 0.5);
    if (price) price.textContent = `💰 ราคาขายเริ่มต้น: ${sellVal.toLocaleString()} z`;
    if (desc) desc.textContent = reward.desc || '';

    const remaining = State.getMaterial(boxId);
    if (remCount) remCount.textContent = remaining;
    if (btnAgain) {
      btnAgain.disabled = remaining < 1;
      btnAgain.style.opacity = remaining < 1 ? '0.5' : '1';
    }

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('btn-close-unbox');
    const doneBtn = document.getElementById('btn-unbox-done');
    const invBtn = document.getElementById('btn-unbox-inventory');

    const closeModal = () => modal.classList.add('hidden');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (doneBtn) doneBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    if (invBtn) {
      invBtn.onclick = () => {
        closeModal();
        const eqTab = document.querySelector('.ro-tab-btn[data-inv-tab="equipment"]');
        if (eqTab) eqTab.click();
      };
    }
    if (btnAgain) {
      btnAgain.onclick = () => {
        if (State.getMaterial(boxId) >= 1) {
          openTreasureBox(boxId);
        }
      };
    }
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
    let actionBtnHtml = '';
    if (def.isUsable) {
      actionBtnHtml = `
        <div class="tooltip-action-row">
          <button type="button" class="btn-tooltip-action" id="btn-tooltip-open-box">🎁 เปิดกล่องนี้ (Open Box)</button>
        </div>
      `;
    } else if ((def.id === 'rough_oridecon' || def.id === 'rough_elunium') && qty >= 5) {
      actionBtnHtml = `
        <div class="tooltip-action-row">
          <button type="button" class="btn-tooltip-action" style="background:linear-gradient(180deg,#10b981 0%,#047857 100%);border-color:#065f46;" id="btn-tooltip-combine-ore">✨ หลอมแร่บริสุทธิ์ (Refine 5 to 1)</button>
        </div>
      `;
    }

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
        ${actionBtnHtml}
      </div>
    `;
    $tooltip.classList.add('visible');

    $tooltip.querySelector('#btn-close-mat-tooltip')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      hideTooltip();
    });

    $tooltip.querySelector('#btn-tooltip-open-box')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      promptOpenBox(def.id);
    });

    $tooltip.querySelector('#btn-tooltip-combine-ore')?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      combineRough(def.id);
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
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  return { open, render, openTreasureBox, showUnboxModal };
})();
