/**
 * router.js – Page navigation system
 */
const Router = (() => {
  const pages = {};
  let current = null;

  function register(id, { onEnter, onLeave } = {}) {
    pages[id] = { el: document.getElementById(id), onEnter, onLeave };
  }

  function go(id) {
    if (current === id) return;

    // Leave current
    if (current && pages[current]) {
      const old = pages[current];
      old.el.classList.remove('active');
      if (old.onLeave) {
        try { old.onLeave(); } catch (err) { console.error('Router onLeave error:', err); }
      }
    }

    // Ensure all other page elements have active removed (handles initial HTML state)
    Object.keys(pages).forEach(k => {
      if (k !== id && pages[k]?.el) {
        pages[k].el.classList.remove('active');
      }
    });

    // Enter new
    const next = pages[id];
    if (!next) { console.warn('Unknown page:', id); return; }
    next.el.classList.add('active');
    current = id;
    if (next.onEnter) {
      try { next.onEnter(); } catch (err) { console.error('Router onEnter error:', err); }
    }
    Audio.play('click');
  }

  function getCurrent() { return current; }

  return { register, go, getCurrent };
})();
