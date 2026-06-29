// Image comparison sliders
document.querySelectorAll('.img-compare').forEach(container => {
  const dragZone = container.querySelector('.img-compare-drag-zone');
  if (!dragZone) return;

  function updatePos(e) {
    const rect = container.getBoundingClientRect();
    let pos = ((e.clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    container.style.setProperty('--pos', pos + '%');
  }

  dragZone.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragZone.setPointerCapture(e.pointerId);
    updatePos(e);
  });

  dragZone.addEventListener('pointermove', (e) => {
    if (!dragZone.hasPointerCapture(e.pointerId)) return;
    updatePos(e);
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Dot grid cursor illumination
const contentEl = document.querySelector('.content');
if (contentEl) {
  contentEl.addEventListener('mousemove', (e) => {
    const rect = contentEl.getBoundingClientRect();
    contentEl.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
    contentEl.style.setProperty('--cursor-y', `${e.clientY - rect.top + contentEl.scrollTop}px`);
  });
  contentEl.addEventListener('mouseleave', () => {
    contentEl.style.setProperty('--cursor-x', '-200px');
    contentEl.style.setProperty('--cursor-y', '-200px');
  });
}

// Theme toggle (light/dark, defaults to light)
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark');
  themeToggle.setAttribute('aria-checked', 'true');
} else {
  root.removeAttribute('data-theme');
  themeToggle.setAttribute('aria-checked', 'false');
  localStorage.removeItem('theme');
}

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-checked', 'false');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-checked', 'true');
    localStorage.setItem('theme', 'dark');
  }
});

// Accordion project nav
document.querySelectorAll('.nav-accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const href = header.dataset.href;
    if (href) {
      window.location.href = href;
    } else {
      header.closest('.nav-accordion').classList.toggle('open');
    }
  });
});
