/**
 * landing.js – Landing page: sign in / register
 */
const Landing = (() => {
  function init() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        Audio.play('click');
      });
    });

    // Sign in
    document.getElementById('btn-signin').addEventListener('click', () => {
      const user = document.getElementById('signin-name').value;
      const pass = document.getElementById('signin-pass').value;
      const err  = document.getElementById('signin-error');
      err.textContent = '';
      const result = State.signIn(user, pass);
      if (result.ok) {
        const d = State.get();
        if (d && d.settings) {
          Audio.setEnabled(d.settings.sfx !== false);
          Audio.setMusicEnabled(d.settings.music !== false);
        }
        MainPage.refresh();
        Router.go('page-main');
      } else {
        err.textContent = result.msg;
        Audio.play('fail');
      }
    });

    // Allow Enter key in sign in
    ['signin-name', 'signin-pass'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('btn-signin').click();
      });
    });

    // Register
    document.getElementById('btn-register').addEventListener('click', () => {
      const user  = document.getElementById('reg-name').value;
      const pass  = document.getElementById('reg-pass').value;
      const pass2 = document.getElementById('reg-pass2').value;
      const err   = document.getElementById('reg-error');
      err.textContent = '';
      if (pass !== pass2) { err.textContent = 'Passwords do not match.'; Audio.play('fail'); return; }
      const result = State.register(user, pass);
      if (result.ok) {
        State.signIn(user, pass);
        const d = State.get();
        if (d && d.settings) {
          Audio.setEnabled(d.settings.sfx !== false);
          Audio.setMusicEnabled(d.settings.music !== false);
        }
        MainPage.refresh();
        Router.go('page-main');
      } else {
        err.textContent = result.msg;
        Audio.play('fail');
      }
    });

    ['reg-name','reg-pass','reg-pass2'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('btn-register').click();
      });
    });

    // Transfer save code import
    document.getElementById('btn-load-transfer')?.addEventListener('click', () => {
      const codeInput = document.getElementById('transfer-code-input');
      const err = document.getElementById('transfer-error');
      err.textContent = '';
      if (!codeInput || !codeInput.value.trim()) {
        err.textContent = 'กรุณาวางรหัสเซฟที่ต้องการโหลด';
        Audio.play('fail');
        return;
      }
      const res = State.importSaveCode(codeInput.value.trim());
      if (res.ok) {
        Audio.play('level-up');
        MainPage.refresh();
        Router.go('page-main');
      } else {
        err.textContent = res.msg;
        Audio.play('fail');
      }
    });
  }

  return { init };
})();
