/**
 * particles.js – Particle and visual effect system
 */
const Particles = (() => {
  const container = document.getElementById('particles');

  function burst(x, y, color, count = 12) {
    const d = State.get();
    if (d && !d.settings.particles) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist  = Math.random() * 60 + 30;
      p.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        transform: translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px);
        animation-duration: ${0.8 + Math.random() * 0.6}s;
        animation-delay: ${Math.random() * 0.1}s;
      `;
      container.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  function successBurst(x, y) {
    burst(x, y, '#4caf50', 16);
    burst(x, y, '#ffd740', 10);
  }

  function failBurst(x, y) {
    burst(x, y, '#e53935', 12);
    burst(x, y, '#ff7043', 8);
  }

  function floatText(x, y, text, color = '#ffd740') {
    const el = document.createElement('div');
    el.className = 'float-result';
    el.textContent = text;
    el.style.cssText = `left:${x}px; top:${y}px; color:${color};`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  function shake(el) {
    const d = State.get();
    if (d && !d.settings.shake) return;
    el.classList.remove('shake');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('shake');
    el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  }

  function flash(el, type) {
    el.classList.remove('success-flash', 'fail-flash');
    void el.offsetWidth;
    el.classList.add(type === 'success' ? 'success-flash' : 'fail-flash');
    el.addEventListener('animationend', () => {
      el.classList.remove('success-flash', 'fail-flash');
    }, { once: true });
  }

  return { burst, successBurst, failBurst, floatText, shake, flash };
})();
