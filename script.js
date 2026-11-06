/**
 * Suraj Narayan Gupta | Data Analyst & Aspiring Data Scientist
 * Portfolio Interactivity: Theme switcher, Project filtering, ScrollSpy,
 * Mobile navigation, Formspree AJAX submission, and clipboard helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. Dark / Light Theme Toggle with Persistence
  // ========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or evaluate system preference
  const savedTheme = localStorage.getItem('sng_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('sng_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  // ========================================================================
  // 2. Mobile Navigation Menu Toggle
  // ========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMobileMenu(false);
        mobileToggleBtn.focus();
      }
    });
  }

  function toggleMobileMenu(open) {
    if (!mobileToggleBtn || !navMenu) return;
    mobileToggleBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      navMenu.classList.add('is-open');
    } else {
      navMenu.classList.remove('is-open');
    }
  }

  // ========================================================================
  // 3. ScrollSpy Active Link Tracking
  // ========================================================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 120; // Accounts for sticky header height & buffer

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // ========================================================================
  // 4. Project Category Filtering Bar
  // ========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Manage active button state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('is-hidden');
          // Trigger smooth reveal animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 300ms ease, transform 300ms ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ========================================================================
  // 5. Scroll Reveal Observer (Subtle Fade-In Animations)
  // ========================================================================
  const revealElements = document.querySelectorAll(
    '.stat-card, .skill-category-card, .project-card, .timeline-content, .cred-card, .highlight-item'
  );

  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ========================================================================
  // 6. Click-to-Copy Email Helper
  // ========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const targetEmail = 'surajnarayangupta2004@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(targetEmail);
        } else {
          // Fallback for non-https local contexts
          const tempInput = document.createElement('textarea');
          tempInput.value = targetEmail;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Show feedback tooltip
        copyEmailBtn.classList.add('copied');
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // ========================================================================
  // 7. Contact Formspree AJAX Handler with Friendly Placeholder Fallback
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
        <span>Sending...</span>
      `;
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      const formAction = contactForm.getAttribute('action') || '';
      const isPlaceholder = formAction.includes('your-form-id');

      if (isPlaceholder) {
        // Friendly local simulation when user hasn't added their Formspree ID yet
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Message logged!</strong> (Demo note: Replace <code>your-form-id</code> in <code>index.html</code> with your Formspree endpoint to receive emails, or reach out directly at <a href="mailto:${targetEmail}" style="text-decoration: underline;">${targetEmail}</a>).
          `;
          contactForm.reset();
        }, 800);
        return;
      }

      // Real Formspree AJAX Submission
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully. I will respond within 24 hours.';
          contactForm.reset();
        } else {
          const result = await response.json().catch(() => null);
          const errorMsg = result && result.errors ? result.errors.map(err => err.message).join(', ') : 'Oops! There was a problem submitting your form.';
          formStatus.className = 'form-status error';
          formStatus.textContent = errorMsg;
        }
      } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Network error: Please try emailing me directly at surajnarayangupta2004@gmail.com.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  // ========================================================================
  // 8. Auto-Detect Local Profile Photo
  // ========================================================================
  const avatarContainer = document.getElementById('avatar-container');
  if (avatarContainer && !avatarContainer.querySelector('img')) {
    const testImg = new Image();
    testImg.src = 'profile.jpg';
    testImg.onload = () => {
      avatarContainer.innerHTML = '';
      const imgEl = document.createElement('img');
      imgEl.src = 'profile.jpg';
      imgEl.alt = 'Suraj Narayan Gupta';
      imgEl.className = 'avatar-img';
      avatarContainer.appendChild(imgEl);
    };
  }
});

