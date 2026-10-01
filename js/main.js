/**
 * Core Application Orchestrator
 * Navbar transformation, mobile menu, typewriter animation,
 * magnetic buttons, flip cards touch support, scroll reveal & contact validation.
 * For: Samarveer Singh Mertia Portfolio
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Navbar Scroll Transformation
  const nav = document.getElementById('main-nav');
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 2. Mobile Hamburger Navigation
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.remove('hidden');
        mobileToggle.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Typewriter Animation for Hero Section
  const typewriterElement = document.getElementById('hero-typewriter');
  if (typewriterElement) {
    const roles = [
      'Semiconductor & VLSI Aspirant',
      'Digital Logic Learner',
      'Chip Design Enthusiast',
      'Embedded Systems Explorer',
      'Future Semiconductor Engineer'
    ];

    if (isReducedMotion) {
      typewriterElement.textContent = roles[0];
    } else {
      let roleIdx = 0;
      let charIdx = 0;
      let isDeleting = false;
      let typingDelay = 80;

      function typeLoop() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
          typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
          charIdx--;
          typingDelay = 40;
        } else {
          typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
          charIdx++;
          typingDelay = 80;
        }

        if (!isDeleting && charIdx === currentRole.length) {
          // Pause at end of word
          typingDelay = 2000;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          typingDelay = 450;
        }

        setTimeout(typeLoop, typingDelay);
      }

      setTimeout(typeLoop, 500);
    }
  }

  // 4. Magnetic Buttons Interaction
  if (!isReducedMotion && window.innerWidth >= 1024) {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 5. 3D Flip Cards (Touch and Click support for Mobile)
  const flipCards = document.querySelectorAll('.flip-card-inner');
  flipCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });

    // Keyboard accessibility: Enter or Space flips card
    card.parentElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // 6. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window && !isReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealElements.forEach((el) => {
        el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-8');
        observer.observe(el);
      });
    } else {
      revealElements.forEach((el) => {
        el.classList.add('opacity-100', 'translate-y-0');
      });
    }
  }

  // 7. Contact Form Simulation & Feedback
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      if (!nameInput.value || !emailInput.value || !messageInput.value) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'font-mono text-xs text-amber-400 mt-3 block';
        return;
      }

      // Simulate transmission feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Transmitting Signal...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        formStatus.textContent = 'Signal received! Thank you for connecting with Samarveer.';
        formStatus.className = 'font-mono text-xs text-cyan-300 mt-3 block';
        contactForm.reset();

        setTimeout(() => {
          formStatus.textContent = '';
        }, 6000);
      }, 1000);
    });
  }

  // 8. Active Navigation Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan-400');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-cyan-400');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }, { passive: true });
})();
