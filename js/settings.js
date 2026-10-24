/**
 * settings.js – Settings page
 */
const Settings = (() => {
  function open() {
    const d = State.get();
    if (!d) return;
    const s = d.settings;
    document.getElementById('toggle-sfx').checked      = s.sfx;
    document.getElementById('toggle-music').checked    = s.music;
    document.getElementById('toggle-shake').checked    = s.shake;
    document.getElementById('toggle-particles').checked= s.particles;
    Audio.setEnabled(s.sfx);
  }

  function init() {
    document.getElementById('toggle-sfx').addEventListener('change', e => {
      const d = State.get(); if (!d) return;
      d.settings.sfx = e.target.checked;
      Audio.setEnabled(e.target.checked);
      State.save();
    });

    document.getElementById('toggle-music').addEventListener('change', e => {
      const d = State.get(); if (!d) return;
      d.settings.music = e.target.checked;
      State.save();
    });

    document.getElementById('toggle-shake').addEventListener('change', e => {
      const d = State.get(); if (!d) return;
      d.settings.shake = e.target.checked;
      State.save();
    });

    document.getElementById('toggle-particles').addEventListener('change', e => {
      const d = State.get(); if (!d) return;
      d.settings.particles = e.target.checked;
      State.save();
    });

    document.getElementById('btn-delete-account').addEventListener('click', () => {
      if (!confirm('Are you sure? This will permanently delete your account and all progress. This cannot be undone!')) return;
      if (!confirm('Last chance – delete everything?')) return;
      State.deleteAccount();
      Router.go('page-landing');
    });
  }

  return { init, open };
})();
