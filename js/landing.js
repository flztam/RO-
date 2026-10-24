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
  }

  return { init };
})();
