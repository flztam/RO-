/**
 * state.js – Game state & persistence via localStorage
 * Includes item inventory, box opening (OBB/OVB), ore combining, and hunting rewards
 */

const State = (() => {
  const ACCOUNTS_KEY = 'rop_accounts';
  const CURRENT_KEY  = 'rop_current';

  let currentUser = null;
  let data = null;

  // ---- Default Player State (Starter Pack) ----
  function defaultData(username) {
    return {
      username,
      zeny: 10000,
      settings: { sfx: true, music: true, shake: true, particles: true },
      inventory: {
        equipment: [
          { id: 'knife',        instanceId: _uid(), level: 0 },
          { id: 'cutter',       instanceId: _uid(), level: 0 },
          { id: 'cotton_shirt', instanceId: _uid(), level: 0 },
        ],
        materials: {
          phracon: 15,
          emveretarcon: 8,
          oridecon: 3,
          elunium: 3,
          rough_oridecon: 5,
          rough_elunium: 5,
          obb: 1,
        },
      },
      stats: {
        totalRefines: 0,
        successCount: 0,
        failCount: 0,
        breakCount: 0,
        maxRefineReached: 0,
        huntCount: 0,
        totalZenyEarned: 10000,
        maxZenyReached: 10000,
        totalBought: 0,
        manualSuccess: 0,
        boxesOpened: 0,
      },
      achievements: {},
      lastHunt: 0,
      refineLog: [],
    };
  }

  function _uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // ---- Auth ----
  function getAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); }
    catch { return {}; }
  }

  function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function register(username, password) {
    const u = username.trim();
    if (!u || u.length < 3) return { ok: false, msg: 'Username must be at least 3 characters.' };
    if (!password || password.length < 4) return { ok: false, msg: 'Password must be at least 4 characters.' };
    const accounts = getAccounts();
    if (accounts[u.toLowerCase()]) return { ok: false, msg: 'Username already exists.' };
    accounts[u.toLowerCase()] = { username: u, password, data: defaultData(u) };
    saveAccounts(accounts);
    return { ok: true };
  }

  function signIn(username, password) {
    const u = username.trim();
    const accounts = getAccounts();
    const acc = accounts[u.toLowerCase()];
    if (!acc) return { ok: false, msg: 'Account not found.' };
    if (acc.password !== password) return { ok: false, msg: 'Incorrect password.' };
    currentUser = u.toLowerCase();
    data = acc.data;
    _migrate();
    localStorage.setItem(CURRENT_KEY, currentUser);
    return { ok: true };
  }

  function autoLogin() {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (!saved) return false;
    const accounts = getAccounts();
    if (!accounts[saved]) return false;
    currentUser = saved;
    data = accounts[saved].data;
    _migrate();
    return true;
  }

  function logout() {
    save();
    currentUser = null;
    data = null;
    localStorage.removeItem(CURRENT_KEY);
  }

  function deleteAccount() {
    const accounts = getAccounts();
    delete accounts[currentUser];
    saveAccounts(accounts);
    logout();
  }

  function _migrate() {
    data.stats = data.stats || {};
    ['totalRefines','successCount','failCount','breakCount','maxRefineReached','huntCount','totalZenyEarned','totalBought','manualSuccess','boxesOpened','maxZenyReached']
      .forEach(k => { if (data.stats[k] === undefined) data.stats[k] = 0; });
    if (!data.stats.maxZenyReached || data.stats.maxZenyReached < (data.zeny || 0)) {
      data.stats.maxZenyReached = Math.max(data.zeny || 0, 10000);
    }
    data.stats.plus10Items = data.stats.plus10Items || {};
    data.achievements = data.achievements || {};
    data.lastHunt = data.lastHunt || 0;
    data.refineLog = data.refineLog || [];
    data.settings = data.settings || { sfx: true, music: true, shake: true, particles: true };
    data.inventory = data.inventory || {};
    data.inventory.materials = data.inventory.materials || {};
    data.inventory.equipment = data.inventory.equipment || [];

    // Auto-populate plus10Items from current inventory if any
    data.inventory.equipment.forEach(item => {
      if (item && item.level >= 10) {
        data.stats.plus10Items[item.id] = true;
      }
    });

    // Migrate any legacy item IDs from earlier versions
    const legacyMap = {
      'leather': 'leather_jacket',
      'chainmail': 'chain_mail',
      'muffler': 'muffler_hood',
      'guard': 'buckler'
    };
    data.inventory.equipment = data.inventory.equipment.map(item => {
      if (typeof item === 'string') {
        return { id: legacyMap[item] || item, instanceId: _uid(), level: 0 };
      }
      if (legacyMap[item.id]) item.id = legacyMap[item.id];
      if (typeof item.level !== 'number') item.level = 0;
      if (!item.instanceId) item.instanceId = _uid();
      return item;
    });
  }

  function save() {
    if (!currentUser || !data) return;
    const accounts = getAccounts();
    if (accounts[currentUser]) {
      accounts[currentUser].data = data;
      saveAccounts(accounts);
    }
  }

  // ---- Accessors ----
  function get()        { return data; }
  function getUser()    { return currentUser; }
  function isLoggedIn() { return !!currentUser; }

  function addZeny(amount) {
    data.zeny += amount;
    if (amount > 0) {
      data.stats.totalZenyEarned += amount;
      if (data.zeny > (data.stats.maxZenyReached || 0)) {
        data.stats.maxZenyReached = data.zeny;
      }
    }
    save();
  }

  function spendZeny(amount) {
    if (data.zeny < amount) return false;
    data.zeny -= amount;
    save();
    return true;
  }

  function getMaterial(id) { return data.inventory.materials[id] || 0; }

  function addMaterial(id, qty) {
    data.inventory.materials[id] = (data.inventory.materials[id] || 0) + qty;
    save();
  }

  function removeMaterial(id, qty) {
    if (getMaterial(id) < qty) return false;
    data.inventory.materials[id] -= qty;
    save();
    return true;
  }

  function addEquipment(equipId) {
    const eqDef = EQUIPMENT.find(e => e.id === equipId);
    if (!eqDef) return null;
    const instance = { id: equipId, instanceId: _uid(), level: 0 };
    data.inventory.equipment.push(instance);
    save();
    return instance;
  }

  function removeEquipment(instanceId) {
    const idx = data.inventory.equipment.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return false;
    data.inventory.equipment.splice(idx, 1);
    save();
    return true;
  }

  function updateEquipmentLevel(instanceId, newLevel) {
    const eq = data.inventory.equipment.find(e => e.instanceId === instanceId);
    if (!eq) return;
    eq.level = newLevel;
    if (newLevel > data.stats.maxRefineReached) data.stats.maxRefineReached = newLevel;
    if (newLevel >= 10) {
      data.stats.plus10Items = data.stats.plus10Items || {};
      data.stats.plus10Items[eq.id] = true;
    }
    save();
  }

  function addRefineLog(entry) {
    data.refineLog.unshift(entry);
    if (data.refineLog.length > 50) data.refineLog.length = 50;
    save();
  }

  // ---- Open Box (OBB / OVB) ----
  function openBox(boxId) {
    if (getMaterial(boxId) < 1) return null;
    if (!removeMaterial(boxId, 1)) return null;

    data.stats.boxesOpened = (data.stats.boxesOpened || 0) + 1;
    let pool = [];

    if (boxId === 'obb') {
      // Tier 1 - 3 weapons and all armors
      pool = EQUIPMENT.filter(e => (e.type === 'Weapon' && e.weaponLevel <= 3) || e.type === 'Armor');
    } else if (boxId === 'ovb') {
      // Rare Lv 3 - 4 weapons and high-tier armors
      pool = EQUIPMENT.filter(e => (e.type === 'Weapon' && e.weaponLevel >= 3) || (e.type === 'Armor' && (e.price || 0) >= 20000));
    } else {
      pool = EQUIPMENT;
    }

    if (!pool || pool.length === 0) pool = EQUIPMENT;
    const rewardItem = pool[Math.floor(Math.random() * pool.length)];
    addEquipment(rewardItem.id);
    save();
    return rewardItem;
  }

  // ---- Ore Combining (5 Rough -> 1 Pure) ----
  function combineRoughStone(roughId) {
    const targetMap = {
      'rough_oridecon': 'oridecon',
      'rough_elunium': 'elunium'
    };
    const target = targetMap[roughId];
    if (!target) return false;
    if (getMaterial(roughId) < 5) return false;
    removeMaterial(roughId, 5);
    addMaterial(target, 1);
    save();
    return true;
  }

  // ---- Hunt Monster System ----
  const HUNT_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours

  function calculateHuntReward(peakZeny) {
    const peak = Math.max(10000, peakZeny || 10000);
    let base = 2000;
    if (peak <= 100000) {
      // 10k -> 2k, 100k -> 20k (20%)
      base = Math.round(peak * 0.2);
    } else if (peak <= 1000000) {
      // 100k -> 20k, 1M -> 100k
      base = Math.round(20000 + (peak - 100000) * (80000 / 900000));
    } else {
      // 1M+ -> capped at 100k
      base = 100000;
    }
    return Math.min(100000, Math.max(2000, base));
  }

  function getExpectedHuntReward() {
    if (!data) return 2000;
    const peak = Math.max(data.zeny || 0, data.stats?.maxZenyReached || 0, 10000);
    return calculateHuntReward(peak);
  }

  function canHunt() {
    return Date.now() - data.lastHunt >= HUNT_COOLDOWN_MS;
  }

  function huntCooldownRemaining() {
    const remaining = HUNT_COOLDOWN_MS - (Date.now() - data.lastHunt);
    return Math.max(0, remaining);
  }

  function doHunt() {
    if (!canHunt()) return null;
    data.lastHunt = Date.now();
    data.stats.huntCount++;

    // User request: Scale with current user's max zeny reach (10k -> 2k, 100k -> 20k, 1M -> 100k, max 100k)
    const peak = Math.max(data.zeny || 0, data.stats.maxZenyReached || 0, 10000);
    const zenyGain = calculateHuntReward(peak);
    data.zeny += zenyGain;
    data.stats.totalZenyEarned += zenyGain;
    if (data.zeny > (data.stats.maxZenyReached || 0)) {
      data.stats.maxZenyReached = data.zeny;
    }

    // Guaranteed Refine Material Drop (1 to 3 items)
    const possibleMats = ['phracon', 'emveretarcon', 'rough_oridecon', 'rough_elunium', 'oridecon', 'elunium'];
    const randomMat = possibleMats[Math.floor(Math.random() * possibleMats.length)];
    const matQty = Math.floor(Math.random() * 3) + 1;
    addMaterial(randomMat, matQty);

    // Chance for Equipment Drop (45% chance!)
    let equipDrop = null;
    if (Math.random() < 0.45) {
      const eq = EQUIPMENT[Math.floor(Math.random() * EQUIPMENT.length)];
      addEquipment(eq.id);
      equipDrop = eq;
    }

    // Chance for Box or Enriched drop (25% chance)
    let specialDrop = null;
    if (Math.random() < 0.25) {
      const specials = ['obb', 'ovb', 'enriched_o', 'enriched_e'];
      const spec = specials[Math.floor(Math.random() * specials.length)];
      addMaterial(spec, 1);
      specialDrop = MATERIALS.find(m => m.id === spec);
    }

    save();
    return {
      zenyGain,
      matDrop: { id: randomMat, qty: matQty, def: MATERIALS.find(m => m.id === randomMat) },
      equipDrop,
      specialDrop
    };
  }

  function formatCooldown(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  // ---- Save Code Export & Import ----
  function exportSaveCode() {
    if (!currentUser || !data) return null;
    const accounts = getAccounts();
    const acc = accounts[currentUser] || {};
    const payload = {
      v: 1,
      createdAt: Date.now(),
      username: acc.username || data.username || currentUser,
      password: acc.password || '1234',
      data: data
    };
    try {
      const json = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(json));
      return 'ROREFINE-' + encoded;
    } catch (e) {
      console.error('Export save code error:', e);
      return null;
    }
  }

  function importSaveCode(codeStr) {
    if (!codeStr || typeof codeStr !== 'string') {
      return { ok: false, msg: 'กรุณากรอกรหัสเซฟ (Please enter save code)' };
    }
    let clean = codeStr.trim();
    try {
      let payload;
      if (clean.startsWith('{')) {
        payload = JSON.parse(clean);
      } else {
        if (clean.startsWith('ROREFINE-')) clean = clean.slice(9);
        const json = decodeURIComponent(atob(clean));
        payload = JSON.parse(json);
      }

      if (!payload || !payload.data || !payload.data.inventory) {
        return { ok: false, msg: 'รหัสเซฟไม่ถูกต้อง โครงสร้างข้อมูลไม่สมบูรณ์' };
      }

      const username = payload.username || payload.data.username || 'Novice';
      const password = payload.password || '1234';
      const uKey = username.toLowerCase();

      const accounts = getAccounts();
      accounts[uKey] = {
        username: username,
        password: password,
        data: payload.data
      };
      saveAccounts(accounts);

      currentUser = uKey;
      data = payload.data;
      _migrate();
      save();
      localStorage.setItem(CURRENT_KEY, currentUser);

      return { ok: true, username: username };
    } catch (err) {
      console.error('Import save code error:', err);
      return { ok: false, msg: 'รหัสเซฟผิดพลาดหรือเสียหาย ไม่สามารถอ่านข้อมูลได้' };
    }
  }

  return {
    register, signIn, autoLogin, logout, deleteAccount,
    get, getUser, isLoggedIn, save,
    addZeny, spendZeny,
    getMaterial, addMaterial, removeMaterial,
    addEquipment, removeEquipment, updateEquipmentLevel,
    addRefineLog,
    openBox, combineRoughStone,
    canHunt, huntCooldownRemaining, doHunt, formatCooldown, getExpectedHuntReward,
    exportSaveCode, importSaveCode,
    HUNT_COOLDOWN_MS,
  };
})();
