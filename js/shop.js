/**
 * shop.js – Midgard Blacksmith Supply & Equipment Shop
 * Allows players to purchase all Lv 1-4 weapons, armors, refine stones, and OBB/OVB boxes
 */

const Shop = (() => {
  let activeTab = 'mats';

  function open(targetTab) {
    try {
      bindTabs();
      bindServiceModal();
      if (targetTab) {
        switchTab(targetTab);
      } else {
        render();
      }
    } catch (err) {
      console.error('Shop open error:', err);
    }
  }

  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.ro-tab-btn[data-shop-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.shopTab === tabId);
    });
    document.querySelectorAll('.shop-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'shop-' + tabId);
    });
    updateZenyDisplay();
    renderActivePanel();
  }

  function bindTabs() {
    document.querySelectorAll('.ro-tab-btn[data-shop-tab]').forEach(tab => {
      tab.onclick = () => {
        switchTab(tab.dataset.shopTab);
        Audio.play('click');
      };
    });
  }

  function promptService() {
    bindServiceModal();
    const modal = document.getElementById('shop-service-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeServiceModal() {
    const modal = document.getElementById('shop-service-modal');
    if (modal) modal.classList.add('hidden');
  }

  let serviceModalBound = false;
  function bindServiceModal() {
    if (serviceModalBound) return;
    serviceModalBound = true;

    const modal = document.getElementById('shop-service-modal');
    const closeBtn = document.getElementById('btn-close-shop-service');
    const cancelBtn = document.getElementById('btn-cancel-shop-service');
    const optBuy = document.getElementById('srv-opt-buy');
    const optSell = document.getElementById('srv-opt-sell');
    const optRefinery = document.getElementById('srv-opt-refinery');

    if (closeBtn) closeBtn.onclick = closeServiceModal;
    if (cancelBtn) cancelBtn.onclick = closeServiceModal;

    if (optBuy) {
      optBuy.onclick = () => {
        closeServiceModal();
        Router.go('page-shop');
        switchTab('mats');
        Audio.play('click');
      };
    }

    if (optSell) {
      optSell.onclick = () => {
        closeServiceModal();
        Router.go('page-shop');
        switchTab('sell');
        Audio.play('click');
      };
    }

    if (optRefinery) {
      optRefinery.onclick = () => {
        closeServiceModal();
        Router.go('page-shop');
        switchTab('refinery');
        Audio.play('click');
      };
    }
  }

  function render() {
    updateZenyDisplay();
    renderActivePanel();
  }

  function renderActivePanel() {
    if (activeTab === 'mats') renderMaterials();
    else if (activeTab === 'wep-low') renderLowWeapons();
    else if (activeTab === 'wep-high') renderHighWeapons();
    else if (activeTab === 'armors') renderArmors();
    else if (activeTab === 'refinery') renderRefinery();
    else if (activeTab === 'sell') renderSell();
  }

  function updateZenyDisplay() {
    const d = State.get();
    if (!d) return;
    document.getElementById('shop-zeny').textContent = d.zeny.toLocaleString();
  }

  // ---- Tab 1: Materials & Boxes ----
  function renderMaterials() {
    const d = State.get();
    if (!d) return;
    const grid = document.getElementById('mats-grid');
    grid.innerHTML = '';

    MATERIALS.forEach(mat => {
      const owned = State.getMaterial(mat.id);
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon-wrap">
          <img src="${mat.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${mat.itemId}.gif'" />
        </div>
        <span class="shop-card-name">${mat.name}</span>
        <span class="shop-card-desc">${mat.desc}</span>
        <span class="shop-card-price">💰 ${mat.buyPrice.toLocaleString()} z</span>
        <span class="shop-card-stock">มีในตัว: ${owned}</span>
        <div class="shop-card-actions">
          <button class="btn-buy-1" data-id="${mat.id}" data-qty="1">ซื้อ 1</button>
          <button class="btn-buy-10" data-id="${mat.id}" data-qty="10">ซื้อ 10</button>
        </div>
      `;

      card.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const qty = parseInt(btn.dataset.qty);
          const total = mat.buyPrice * qty;
          if (!State.spendZeny(total)) {
            showNotification('❌ เงิน Zeny ของท่านไม่เพียงพอ!');
            return;
          }
          State.addMaterial(mat.id, qty);
          d.stats.totalBought += qty;
          State.save();
          Audio.play('buy');
          updateZenyDisplay();
          MainPage.updateZeny();
          renderMaterials();
          Achievements.check();
          showNotification(`🛒 ซื้อ ${mat.name} x${qty} สำเร็จ!`);
        });
      });

      grid.appendChild(card);
    });
  }

  // ---- Tab 2: Weapons Lv 1 - 2 ----
  function renderLowWeapons() {
    const grid = document.getElementById('wep-low-grid');
    grid.innerHTML = '';
    const lowWeapons = EQUIPMENT.filter(e => e.type === 'Weapon' && e.weaponLevel <= 2);
    renderEquipCards(lowWeapons, grid);
  }

  // ---- Tab 3: Weapons Lv 3 - 4 ----
  function renderHighWeapons() {
    const grid = document.getElementById('wep-high-grid');
    grid.innerHTML = '';
    const highWeapons = EQUIPMENT.filter(e => e.type === 'Weapon' && e.weaponLevel >= 3);
    renderEquipCards(highWeapons, grid);
  }

  // ---- Tab 4: Armors ----
  function renderArmors() {
    const grid = document.getElementById('armors-grid');
    grid.innerHTML = '';
    const armors = EQUIPMENT.filter(e => e.type === 'Armor');
    renderEquipCards(armors, grid);
  }

  function renderEquipCards(items, container) {
    const d = State.get();
    if (!d) return;

    items.forEach(eq => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      const typeBadge = eq.type === 'Weapon' ? `Weapon Lv.${eq.weaponLevel}` : eq.subClass;
      const statLabel = eq.type === 'Weapon' ? `ATK ${eq.baseAtk}` : `DEF ${eq.baseDef}`;
      const matName = getRequiredMaterial(eq);
      const matDef = MATERIALS.find(m => m.id === matName);

      card.innerHTML = `
        <div class="shop-card-icon-wrap">
          <img src="${eq.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eq.itemId}.gif'" />
        </div>
        <span class="shop-card-name">${eq.name}</span>
        <div class="shop-card-badge-row">
          <span class="badge-item-class">${typeBadge}</span>
          <span class="badge-item-stat">${statLabel}</span>
        </div>
        <span class="shop-card-desc">ใช้ ${matDef ? matDef.name : matName} (ปลอดภัยถึง +${getSafeLevel(eq)})</span>
        <span class="shop-card-price">💰 ${eq.price.toLocaleString()} z</span>
        <div class="shop-card-actions" style="width:100%;">
          <button class="btn-buy-1 btn-buy-equip" data-id="${eq.id}">ซื้ออุปกรณ์</button>
        </div>
      `;

      card.querySelector('.btn-buy-equip').addEventListener('click', () => {
        if (!State.spendZeny(eq.price)) {
          showNotification('❌ เงิน Zeny ของท่านไม่เพียงพอ!');
          return;
        }
        State.addEquipment(eq.id);
        d.stats.totalBought++;
        State.save();
        Audio.play('buy');
        updateZenyDisplay();
        MainPage.updateZeny();
        Achievements.check();
        showNotification(`🗡️ ซื้อ ${eq.name} สำเร็จ! (ดูได้ในช่องเก็บของ)`);
      });

      container.appendChild(card);
    });
  }

  // ---- Tab 5: Ore Refinery (Austri) ----
  function renderRefinery() {
    const grid = document.getElementById('refinery-grid');
    grid.innerHTML = '';

    const recipes = [
      {
        roughId: 'rough_oridecon',
        targetId: 'oridecon',
        title: 'หลอมก้อนแร่ Oridecon',
        desc: 'นำ Rough Oridecon 5 ก้อน หลอมรวมเป็น Oridecon บริสุทธิ์ 1 ก้อน'
      },
      {
        roughId: 'rough_elunium',
        targetId: 'elunium',
        title: 'หลอมก้อนแร่ Elunium',
        desc: 'นำ Rough Elunium 5 ก้อน หลอมรวมเป็น Elunium บริสุทธิ์ 1 ก้อน'
      }
    ];

    recipes.forEach(rec => {
      const roughDef = MATERIALS.find(m => m.id === rec.roughId);
      const targetDef = MATERIALS.find(m => m.id === rec.targetId);
      const owned = State.getMaterial(rec.roughId);
      const targetOwned = State.getMaterial(rec.targetId);
      const canCraft = owned >= 5;

      const card = document.createElement('div');
      card.className = 'shop-card refinery-card';
      card.innerHTML = `
        <div class="refinery-icon-flow">
          <img src="${roughDef.icon}" class="ro-item-img" />
          <span class="refinery-arrow">➔</span>
          <img src="${targetDef.icon}" class="ro-item-img" />
        </div>
        <span class="shop-card-name">${rec.title}</span>
        <span class="shop-card-desc">${rec.desc}</span>
        <div class="refinery-req-info">
          <span>วัตถุดิบ: <strong>${owned} / 5</strong></span>
          <span>มี ${targetDef.name}: <strong>${targetOwned}</strong></span>
        </div>
        <div class="shop-card-actions" style="width:100%;">
          <button class="btn-buy-1 ${!canCraft ? 'btn-disabled' : ''}" ${!canCraft ? 'disabled' : ''}>
            ${canCraft ? '✨ เริ่มการหลอมแร่' : 'วัตถุดิบไม่พอ (ต้องใช้ 5 ก้อน)'}
          </button>
        </div>
      `;

      if (canCraft) {
        card.querySelector('button').addEventListener('click', () => {
          State.combineRoughStone(rec.roughId);
          Audio.play('level-up');
          updateZenyDisplay();
          renderRefinery();
          showNotification(`✨ หลอมสำเร็จ! ได้รับ ${targetDef.name} 1 ก้อน!`);
        });
      }

      grid.appendChild(card);
    });
  }

  // ---- Tab 6: Sell Items ----
  function renderSell() {
    const d = State.get();
    if (!d) return;
    const grid = document.getElementById('sell-grid');
    grid.innerHTML = '';

    let anyItem = false;

    // 1. Sell Equipment
    d.inventory.equipment.forEach(item => {
      const eqDef = EQUIPMENT.find(e => e.id === item.id);
      if (!eqDef) return;
      anyItem = true;

      // Exponential sell price for refined equipment!
      const sellPrice = calculateRefinedSellPrice(eqDef, item.level);
      const baseSell = eqDef.sellPrice || Math.round((eqDef.price || 100) * 0.5);
      const multVal = baseSell > 0 ? (sellPrice / baseSell).toFixed(1) : '1.0';

      let multBadge = '';
      if (item.level >= 10) {
        multBadge = `<span class="badge-jackpot">🔥 ${multVal}x JACKPOT!</span>`;
      } else if (item.level > getSafeLevel(eqDef)) {
        multBadge = `<span class="badge-overrefine">⚡ ${multVal}x OVER-REFINE</span>`;
      } else if (item.level > 0) {
        multBadge = `<span class="badge-saferefined">✨ ${multVal}x SAFE BONUS</span>`;
      }

      const card = document.createElement('div');
      card.className = `shop-card ${item.level >= 7 ? 'card-high-value' : ''}`;
      card.innerHTML = `
        <div class="shop-card-icon-wrap">
          <img src="${eqDef.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${eqDef.itemId}.gif'" />
        </div>
        <span class="shop-card-name">${eqDef.name} +${item.level}</span>
        <div class="sell-badge-row">
          <span class="shop-card-desc">ระดับ +${item.level}</span>
          ${multBadge}
        </div>
        <span class="shop-card-price ${item.level >= 7 ? 'price-jackpot' : ''}">💰 ${sellPrice.toLocaleString()} z</span>
        <div class="shop-card-actions" style="width:100%;">
          <button class="btn-sell-item">ขายไอเทมนี้</button>
        </div>
      `;

      card.querySelector('.btn-sell-item').addEventListener('click', () => {
        if (!confirm(`ต้องการขาย ${eqDef.name} +${item.level} ในราคา ${sellPrice.toLocaleString()} z หรือไม่?`)) return;
        State.removeEquipment(item.instanceId);
        State.addZeny(sellPrice);
        Audio.play('buy');
        updateZenyDisplay();
        MainPage.updateZeny();
        renderSell();
        showNotification(`💰 ขาย ${eqDef.name} +${item.level} สำเร็จ! (+${sellPrice.toLocaleString()} z)`);
      });

      grid.appendChild(card);
    });

    // 2. Sell Materials
    Object.entries(d.inventory.materials).forEach(([matId, qty]) => {
      if (qty <= 0) return;
      const matDef = MATERIALS.find(m => m.id === matId);
      if (!matDef) return;
      anyItem = true;

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon-wrap">
          <img src="${matDef.icon}" class="ro-item-img" onerror="this.src='https://file5s.ratemyserver.net/items/small/${matDef.itemId}.gif'" />
        </div>
        <span class="shop-card-name">${matDef.name}</span>
        <span class="shop-card-desc">มีในครอบครอง: ${qty} ชิ้น</span>
        <span class="shop-card-price">💰 ชิ้นละ ${matDef.sellPrice.toLocaleString()} z</span>
        <div class="shop-card-actions">
          <button class="btn-sell-item" data-qty="1">ขาย 1 ชิ้น</button>
          ${qty >= 5 ? `<button class="btn-sell-item" data-qty="5">ขาย 5 ชิ้น</button>` : ''}
        </div>
      `;

      card.querySelectorAll('.btn-sell-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const sellQty = Math.min(qty, parseInt(btn.dataset.qty));
          const totalEarn = matDef.sellPrice * sellQty;
          State.removeMaterial(matId, sellQty);
          State.addZeny(totalEarn);
          Audio.play('buy');
          updateZenyDisplay();
          MainPage.updateZeny();
          renderSell();
          showNotification(`💰 ขาย ${matDef.name} x${sellQty} สำเร็จ! (+${totalEarn.toLocaleString()} z)`);
        });
      });

      grid.appendChild(card);
    });

    if (!anyItem) {
      grid.innerHTML = '<div class="inv-empty" style="grid-column:1/-1;">ไม่มีไอเทมหรือวัตถุดิบในตัวที่จะขายได้</div>';
    }
  }

  function showNotification(msg) {
    const toast = document.getElementById('hunt-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  return { open, render, switchTab, promptService };
})();
