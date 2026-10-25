/**
 * audio.js – Sound system supporting Ragnarok Online authentic SFX
 * Includes blacksmith_refine.mp3 and Web Audio API procedural sounds.
 */
const Audio = (() => {
  let ctx = null;
  let enabled = true;
  let musicEnabled = true;
  let refineAudio = null;
  let failAudio = null;
  let bgmAudio = null;

  function initAudio() {
    try {
      if (!refineAudio) {
        refineAudio = new window.Audio('Data/Sound/blacksmith_refine.mp3');
        refineAudio.preload = 'auto';
      }
      if (!failAudio) {
        failAudio = new window.Audio('Data/Sound/ro-refine-failed.mp3');
        failAudio.preload = 'auto';
      }
    } catch (e) {
      console.warn('Audio preloading error:', e);
    }
  }

  function initBgm() {
    try {
      if (!bgmAudio) {
        bgmAudio = new window.Audio('Data/Sound/bgm.mp3');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.4;
        bgmAudio.preload = 'auto';
      }
    } catch (e) {
      console.warn('BGM initialization error:', e);
    }
  }

  function playBgm() {
    if (!musicEnabled) return;
    initBgm();
    try {
      if (bgmAudio && bgmAudio.paused) {
        const p = bgmAudio.play();
        if (p && p.catch) {
          p.catch(err => {
            console.log('BGM waiting for user gesture', err);
          });
        }
      }
    } catch (e) {}
  }

  function pauseBgm() {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  }

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /**
   * Play the iconic RO blacksmith hammer sound
   * Returns a promise that resolves when the sound completes (or ~2.4s fallback)
   */
  function playRefine() {
    return new Promise((resolve) => {
      if (!enabled) {
        setTimeout(resolve, 800);
        return;
      }

      initAudio();
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      try {
        if (refineAudio) {
          refineAudio.pause();
          refineAudio.currentTime = 0;
          refineAudio.onended = done;
          refineAudio.onerror = done;
          const p = refineAudio.play();
          if (p && p.catch) {
            p.catch((err) => {
              console.warn('HTML5 audio play failed, using procedural fallback', err);
              _playProceduralHammer();
              setTimeout(done, 2000);
            });
          }
          // Safety timeout in case onended doesn't fire
          setTimeout(done, 3000);
        } else {
          _playProceduralHammer();
          setTimeout(done, 2000);
        }
      } catch (err) {
        _playProceduralHammer();
        setTimeout(done, 2000);
      }
    });
  }

  function _playProceduralHammer() {
    try {
      const c = getCtx();
      // 3 hammer strikes
      [0, 0.6, 1.2].forEach((delay) => {
        _beep(c, 700, 0.25, 'triangle', delay, 0.12);
        _beep(c, 1400, 0.15, 'sine', delay + 0.01, 0.08);
      });
    } catch (e) {}
  }

  function playFail() {
    if (!enabled) return;
    initAudio();
    try {
      if (failAudio) {
        failAudio.pause();
        failAudio.currentTime = 0;
        const p = failAudio.play();
        if (p && p.catch) {
          p.catch(err => {
            console.warn('HTML5 fail audio failed, using procedural fallback', err);
            _break(getCtx());
          });
        }
      } else {
        _break(getCtx());
      }
    } catch (err) {
      _break(getCtx());
    }
  }

  function play(type) {
    if (!enabled) return;
    try {
      const c = getCtx();
      switch (type) {
        case 'click':    _beep(c, 880, 0.08, 'sine', 0, 0.06); break;
        case 'success':  _success(c); break;
        case 'fail':     playFail(); break;
        case 'break':    playFail(); break;
        case 'hit':      _beep(c, 660, 0.15, 'square', 0, 0.08); break;
        case 'miss':     _beep(c, 220, 0.1, 'sawtooth', 0, 0.1); break;
        case 'buy':      _beep(c, 1047, 0.1, 'sine', 0, 0.1); break;
        case 'hunt':     _hunt(c); break;
        case 'level-up': _levelUp(c); break;
      }
    } catch (e) { /* ignore audio errors */ }
  }

  function _beep(c, freq, vol, type, start, dur) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + start);
    gain.gain.setValueAtTime(vol, c.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + dur + 0.01);
  }

  function _success(c) {
    // RO iconic victory chime
    _beep(c, 523.25, 0.18, 'sine', 0, 0.12);
    _beep(c, 659.25, 0.18, 'sine', 0.1, 0.12);
    _beep(c, 783.99, 0.2, 'sine', 0.2, 0.16);
    _beep(c, 1046.50, 0.25, 'sine', 0.35, 0.35);
    _beep(c, 1318.51, 0.2, 'sine', 0.45, 0.4);
  }

  function _fail(c) {
    _beep(c, 349.23, 0.2, 'sawtooth', 0, 0.15);
    _beep(c, 261.63, 0.25, 'sawtooth', 0.15, 0.25);
  }

  function _break(c) {
    // Glass shatter + hollow metal crack
    _beep(c, 120, 0.35, 'sawtooth', 0, 0.4);
    _beep(c, 75,  0.3, 'square', 0.05, 0.35);
    _beep(c, 240, 0.2, 'triangle', 0.1, 0.2);
  }

  function _hunt(c) {
    _beep(c, 440, 0.1, 'square', 0, 0.06);
    _beep(c, 554, 0.1, 'square', 0.07, 0.06);
    _beep(c, 659, 0.12, 'square', 0.14, 0.1);
  }

  function _levelUp(c) {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      _beep(c, f, 0.12, 'sine', i * 0.07, 0.15);
    });
  }

  // Pre-initialize and trigger BGM on first user interaction
  function onFirstUserGesture() {
    initAudio();
    initBgm();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (musicEnabled) playBgm();
  }

  document.addEventListener('click', onFirstUserGesture, { once: true });
  document.addEventListener('touchstart', onFirstUserGesture, { once: true });

  return {
    play,
    playRefine,
    playFail,
    playBgm,
    pauseBgm,
    setEnabled(v) {
      enabled = v;
      if (!v) {
        if (refineAudio) refineAudio.pause();
        if (failAudio) failAudio.pause();
      }
    },
    isEnabled() { return enabled; },
    setMusicEnabled(v) {
      musicEnabled = v;
      if (v) {
        playBgm();
      } else {
        pauseBgm();
      }
    },
    isMusicEnabled() { return musicEnabled; },
  };
})();
