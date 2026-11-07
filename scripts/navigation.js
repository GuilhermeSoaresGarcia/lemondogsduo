/**
 * scripts/navigation.js
 * Gerencia o estado ativo do menu via IntersectionObserver e
 * o comportamento do botão de voltar ao topo (#back-to-top).
 */

function inicializarNavegacao() {
  // 1. Menu ativo com IntersectionObserver
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.site-section');

  if (navLinks.length && sections.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 2. Botão Voltar ao Topo
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight / 2) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarNavegacao);
} else {
  inicializarNavegacao();
}
