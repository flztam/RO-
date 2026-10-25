/**
 * main-page.js – Main room: NPC, menu navigation, hunt button
 */
const MainPage = (() => {
  let huntTimer = null;
  let huntCdInterval = null;

  function refresh() {
    const d = State.get();
    if (!d) return;
    document.getElementById('player-name-display').textContent = d.username;
    updateZeny();
    updateHuntButton();
    randomNpcSpeech();
  }

  function updateZeny() {
    const d = State.get();
    if (!d) return;
    const z = d.zeny.toLocaleString();
    document.getElementById('zeny-count').textContent = z;
    // Update all zeny displays
    document.querySelectorAll('#refine-zeny, #inv-zeny, #shop-zeny').forEach(el => {
      el.textContent = z;
    });
  }

  function randomNpcSpeech() {
    const speech = NPC_SPEECHES[Math.floor(Math.random() * NPC_SPEECHES.length)];
    const el = document.getElementById('npc-speech');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = speech;
      el.style.opacity = '1';
    }, 300);
  }

  function updateHuntButton() {
    const btn = document.getElementById('btn-hunt');
    if (huntCdInterval) clearInterval(huntCdInterval);

    function tick() {
      if (State.canHunt()) {
        btn.classList.remove('cooling');
        btn.removeAttribute('data-cd');
        const rew = State.getExpectedHuntReward();
        btn.title = `ล่ามอนสเตอร์ (พร้อมลุย! ได้รับ +${rew.toLocaleString()} z)`;
        clearInterval(huntCdInterval);
        huntCdInterval = null;
      } else {
        btn.classList.add('cooling');
        const rem = State.huntCooldownRemaining();
        btn.setAttribute('data-cd', State.formatCooldown(rem));
        btn.title = `Hunt – Ready in ${State.formatCooldown(rem)}`;
      }
    }
    tick();
    if (!State.canHunt()) {
      huntCdInterval = setInterval(tick, 1000);
    }
  }

  function showToast(msg, duration = 3500) {
    const toast = document.getElementById('hunt-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(huntTimer);
    huntTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  function init() {
    // Menu buttons
    document.getElementById('btn-refine').addEventListener('click', () => Router.go('page-refine'));
    document.getElementById('btn-inventory').addEventListener('click', () => Router.go('page-inventory'));
    document.getElementById('btn-shop').addEventListener('click', () => Shop.promptService());
    document.getElementById('btn-achievements').addEventListener('click', () => Router.go('page-achievements'));

    // NPC Dialogue Options
    document.getElementById('dialog-opt-refine')?.addEventListener('click', () => Router.go('page-refine'));
    document.getElementById('dialog-opt-inventory')?.addEventListener('click', () => Router.go('page-inventory'));
    document.getElementById('dialog-opt-shop')?.addEventListener('click', () => Shop.promptService());
    document.getElementById('dialog-opt-achievements')?.addEventListener('click', () => Router.go('page-achievements'));
    document.getElementById('btn-talk-npc')?.addEventListener('click', () => {
      randomNpcSpeech();
      Audio.play('click');
    });

    // Settings
    document.getElementById('btn-settings-main').addEventListener('click', () => {
      Settings.open();
      Router.go('page-settings');
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
      State.logout();
      Router.go('page-landing');
    });

    // Hunt button
    document.getElementById('btn-hunt').addEventListener('click', () => {
      if (!State.canHunt()) return;
      Audio.play('hunt');
      const result = State.doHunt();
      if (!result) return;

      let msg = `⚔️ ล่าสำเร็จ! +${result.zenyGain.toLocaleString()} z`;
      if (result.matDrop && result.matDrop.def) {
        msg += ` | ได้รับ ${result.matDrop.def.name} x${result.matDrop.qty}`;
      }
      if (result.equipDrop) {
        msg += ` | 🎁 ดรอปอุปกรณ์: [${result.equipDrop.name}]!`;
        Audio.play('level-up');
      }
      if (result.specialDrop) {
        msg += ` | ✨ ดรอปพิเศษ: [${result.specialDrop.name}]!`;
        Audio.play('level-up');
      }

      showToast(msg, 5000);
      updateZeny();
      updateHuntButton();
      Achievements.check();
    });

    // Back buttons
    document.getElementById('back-from-refine').addEventListener('click', () => {
      Refine.close();
      Router.go('page-main');
      refresh();
    });
    document.getElementById('back-from-inventory').addEventListener('click', () => Router.go('page-main'));
    document.getElementById('back-from-shop').addEventListener('click',      () => { Router.go('page-main'); refresh(); });
    document.getElementById('back-from-achievements').addEventListener('click', () => Router.go('page-main'));
    document.getElementById('back-from-settings').addEventListener('click', () => Router.go('page-main'));
  }

  return { init, refresh, updateZeny };
})();
