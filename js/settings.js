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
    Audio.setMusicEnabled(s.music);
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
      Audio.setMusicEnabled(e.target.checked);
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

    // Export save code
    document.getElementById('btn-export-code')?.addEventListener('click', async () => {
      const code = State.exportSaveCode();
      const output = document.getElementById('export-code-output');
      if (code && output) {
        output.value = code;
        try {
          await navigator.clipboard.writeText(code);
          showToast('📋 คัดลอกรหัสเซฟลงคลิปบอร์ดแล้ว! นำไปโหลดในเครื่องใหม่ได้ทันที');
        } catch {
          showToast('📋 สร้างรหัสเซฟสำเร็จ! กรุณาคัดลอกรหัสจากกล่องข้อความ');
        }
        Audio.play('buy');
      }
    });

    // Import save code in settings
    document.getElementById('btn-import-code')?.addEventListener('click', () => {
      const input = document.getElementById('import-code-input');
      const msg = document.getElementById('transfer-msg');
      if (msg) msg.textContent = '';
      if (!input || !input.value.trim()) {
        if (msg) msg.textContent = 'กรุณาวางรหัสเซฟก่อนกดโหลด';
        Audio.play('fail');
        return;
      }
      const res = State.importSaveCode(input.value.trim());
      if (res.ok) {
        Audio.play('level-up');
        showToast(`🎉 กู้คืนข้อมูลสำเร็จ! ยินดีต้อนรับกลับ [${res.username}]`);
        MainPage.refresh();
        Router.go('page-main');
      } else {
        if (msg) msg.textContent = res.msg;
        Audio.play('fail');
      }
    });
  }

  function showToast(text) {
    const toast = document.getElementById('hunt-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  return { init, open };
})();
