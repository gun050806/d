// ===== 다크 모드 전환 =====
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function currentTheme() {
  const set = root.getAttribute('data-theme');
  if (set) return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    // 저장이 막혀 있어도 전환은 그대로 동작해요.
  }
});

// ===== 모바일 메뉴 열고 닫기 =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

menuToggle.addEventListener('click', () => {
  setMenu(!nav.classList.contains('is-open'));
});

// 메뉴 항목을 누르면 메뉴를 닫아요.
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// ===== 스크롤하면 요소가 부드럽게 나타나기 =====
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ===== 푸터 연도 자동 표시 =====
document.getElementById('year').textContent = new Date().getFullYear();
