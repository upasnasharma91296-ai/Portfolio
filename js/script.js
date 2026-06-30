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

// Project summary side panel
const projectCards = document.querySelectorAll('.project-card');
const projectPanel = document.getElementById('project-panel');
const projectPanelOverlay = document.getElementById('project-panel-overlay');
const projectPanelClose = document.getElementById('project-panel-close');
const projectPanelPrev = document.getElementById('project-panel-prev');
const projectPanelNext = document.getElementById('project-panel-next');
const projectPanelExpand = document.getElementById('project-panel-expand');
const projectPanelMedia = document.getElementById('project-panel-media');
const projectPanelImage = document.getElementById('project-panel-image');
const projectPanelTitle = document.getElementById('project-panel-title');
const projectPanelStatus = document.getElementById('project-panel-status');
const projectPanelDescription = document.getElementById('project-panel-description');
const projectPanelTags = document.getElementById('project-panel-tags');
const projectPanelSubheading = document.getElementById('project-panel-subheading');
const projectPanelStickyGrid = document.getElementById('project-panel-sticky-grid');
const projectPanelStickyGridInner = document.getElementById('project-panel-sticky-grid-inner');

let activeCaseStudyUrl = '#';
let activeCardIndex = 0;

function openProjectPanel(card) {
  activeCardIndex = [...projectCards].indexOf(card);
  const title = card.querySelector('.project-head h3').textContent;
  const statusEl = card.querySelector('.status');
  const description = card.querySelector('.project-info > p').textContent.trim();
  const mediaImg = card.querySelector('.preview-media');
  const gradientClass = [...card.querySelector('.preview').classList].find((c) =>
    c.startsWith('gradient-')
  );
  const tags = card.querySelectorAll('.company-tag');
  const links = card.querySelectorAll('.project-links a');

  projectPanelTitle.textContent = title;
  projectPanelStatus.textContent = statusEl ? statusEl.textContent : '';
  projectPanelStatus.className = statusEl ? statusEl.className : 'status';
  const subheading = card.dataset.subheading || '';
  projectPanelSubheading.textContent = subheading;
  projectPanelSubheading.style.display = subheading ? 'block' : 'none';
  projectPanelDescription.textContent = description;

  const panelSrc = card.dataset.panelSrc;
  projectPanelMedia.className = 'project-panel-media';
  if (panelSrc || mediaImg) {
    projectPanelImage.src = panelSrc || mediaImg.src;
    projectPanelImage.style.display = 'block';
  } else {
    projectPanelImage.style.display = 'none';
    if (gradientClass) projectPanelMedia.classList.add(gradientClass);
  }

  projectPanelTags.innerHTML = '';
  tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'company-tag';
    span.textContent = tag.textContent;
    projectPanelTags.appendChild(span);
  });

  const hasStickyGrid = card.dataset.stickyGrid === 'true';
  projectPanelDescription.style.display = hasStickyGrid ? 'none' : 'block';
  projectPanelTags.style.display = 'flex';
  projectPanelStickyGrid.style.display = hasStickyGrid ? 'block' : 'none';
  if (hasStickyGrid && projectPanelStickyGridInner) {
    const s1l = card.dataset.sticky1Label || '';
    const s1t = card.dataset.sticky1Text || '';
    const s2l = card.dataset.sticky2Label || '';
    const s2t = card.dataset.sticky2Text || '';
    projectPanelStickyGridInner.innerHTML = `
      <div class="sticky-note"><span class="sticky-label">${s1l}</span><p class="sticky-text">${s1t}</p></div>
      <div class="sticky-note"><span class="sticky-label">${s2l}</span><p class="sticky-text">${s2t}</p></div>`;
  }

  const viewLink = card.querySelector('.view-project-link');
  activeCaseStudyUrl = viewLink ? viewLink.getAttribute('href') : '#';

  projectPanelPrev.disabled = activeCardIndex === 0;
  projectPanelNext.disabled = activeCardIndex === projectCards.length - 1;

  projectPanel.classList.add('open');
  projectPanelOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectPanel() {
  projectPanel.classList.remove('open');
  projectPanelOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

projectCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    if (card.classList.contains('coming-soon-card')) return;
    openProjectPanel(card);
  });
});

projectPanelClose.addEventListener('click', closeProjectPanel);
projectPanelOverlay.addEventListener('click', closeProjectPanel);

projectPanelPrev.addEventListener('click', () => {
  if (activeCardIndex > 0) openProjectPanel(projectCards[activeCardIndex - 1]);
});

projectPanelNext.addEventListener('click', () => {
  if (activeCardIndex < projectCards.length - 1) openProjectPanel(projectCards[activeCardIndex + 1]);
});

projectPanelExpand.addEventListener('click', () => {
  if (activeCaseStudyUrl && activeCaseStudyUrl !== '#') window.location.href = activeCaseStudyUrl;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectPanel();
});

// Live clock (local time)
const clock = document.getElementById('clock');

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

updateClock();
setInterval(updateClock, 1000);

// Highlight active sidebar link + update top-bar title based on scroll
const trackedSections = document.querySelectorAll('main [id]');
const navItems = document.querySelectorAll('.nav-item');
const topBarTitle = document.getElementById('top-bar-title');

const sectionLabels = {
  home: 'Home',
  projects: 'Projects',
  about: 'About',
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(
          `.nav-item[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
        if (topBarTitle && sectionLabels[entry.target.id]) {
          topBarTitle.textContent = sectionLabels[entry.target.id];
        }
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
);

trackedSections.forEach((section) => observer.observe(section));

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

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (hamburgerBtn && sidebar && sidebarOverlay) {
  function openSidebar() {
    sidebar.classList.add('mobile-open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburgerBtn.addEventListener('click', openSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a, button.nav-accordion-header').forEach(el => {
    el.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}
