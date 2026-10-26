/**
 * ============================================================================
 * PORTFOLIO SCRIPT: Zill-e-Huma Minhas
 * Features:
 *  1. Particle-network Canvas animation
 *  2. Interactive Python terminal with syntax-highlighted typing effect
 *  3. Count-up statistics on scroll reveal
 *  4. Scroll reveal animations via IntersectionObserver
 *  5. Project category filtering
 *  6. Certificate category filtering
 *  7. Fullscreen accessible Lightbox modal (keyboard & touch swipe support)
 *  8. Sticky navbar & responsive mobile drawer
 *  9. Email clipboard copy with toast feedback
 * 10. Contact form mailto generator & status handler
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Accessibility: Check for reduced motion preference
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 2. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 3. Sticky Navigation & Mobile Drawer
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Handle header background on scroll
  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active section link highlighting
  const sections = document.querySelectorAll('section[id]');
  const highlightActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Subtle Particle Network Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 55);
    const maxDistance = 120;

    const mouse = { x: null, y: null, maxDist: 140 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(124, 108, 255,' : 'rgba(61, 214, 198,';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse repulsion/interactivity
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 0.6;
            this.y -= Math.sin(angle) * 0.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} 0.65)`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(canvas.parentElement);

    const animateParticles = () => {
      if (isHeroVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.22;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(124, 108, 255, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };

    requestAnimationFrame(animateParticles);

    // Track mouse position on hero
    const heroSection = canvas.parentElement;
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize handler
    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Python Terminal Card (Typewriter Effect)
  // --------------------------------------------------------------------------
  const typewriterCode = document.getElementById('typewriter-code');
  const lineNumbersEl = document.getElementById('terminal-line-numbers');
  const replayBtn = document.getElementById('terminal-replay');

  // The Python code structure to type out
  const codeLines = [
    { html: '<span class="tok-keyword">class</span> <span class="tok-class">Developer</span>:' },
    { html: '    <span class="tok-comment">"""Profile of Zill-e-Huma Minhas"""</span>' },
    { html: '    <span class="tok-def">def</span> <span class="tok-class">__init__</span>(<span class="tok-self">self</span>):' },
    { html: '        <span class="tok-self">self</span>.name = <span class="tok-str">"Zill-e-Huma Minhas"</span>' },
    { html: '        <span class="tok-self">self</span>.degree = <span class="tok-str">"BS Information Technology"</span>' },
    { html: '        <span class="tok-self">self</span>.cgpa = <span class="tok-num">3.77</span>' },
    { html: '        <span class="tok-self">self</span>.stack = [' },
    { html: '            <span class="tok-str">"Python"</span>, <span class="tok-str">"OpenCV"</span>, <span class="tok-str">"Java"</span>, <span class="tok-str">"C#"</span>,' },
    { html: '            <span class="tok-str">"HTML/CSS/JS"</span>, <span class="tok-str">"PHP"</span>, <span class="tok-str">"SQL"</span>, <span class="tok-str">"n8n"</span>' },
    { html: '        ]' },
    { html: '        <span class="tok-self">self</span>.status = <span class="tok-teal">"Ready for impact"</span>' },
    { html: '' },
    { html: '    <span class="tok-def">def</span> <span class="tok-class">solve</span>(<span class="tok-self">self</span>, challenge):' },
    { html: '        <span class="tok-keyword">return</span> <span class="tok-str">"Purposeful technology."</span>' },
    { html: '' },
    { html: 'huma = <span class="tok-class">Developer</span>()' },
    { html: '<span class="tok-keyword">print</span>(huma.solve(<span class="tok-str">"world"</span>))' }
  ];

  let typingTimer = null;

  const runTerminalTyping = () => {
    if (!typewriterCode || !lineNumbersEl) return;

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    typewriterCode.innerHTML = '';
    lineNumbersEl.innerHTML = '';

    if (prefersReducedMotion) {
      // If user prefers reduced motion, render all lines instantly
      codeLines.forEach((line, index) => {
        const lineNum = document.createElement('div');
        lineNum.textContent = index + 1;
        lineNumbersEl.appendChild(lineNum);
      });
      typewriterCode.innerHTML = codeLines.map((l) => l.html).join('\n');
      return;
    }

    let lineIndex = 0;

    const renderNextLine = () => {
      if (lineIndex < codeLines.length) {
        // Append line number
        const numDiv = document.createElement('div');
        numDiv.textContent = lineIndex + 1;
        lineNumbersEl.appendChild(numDiv);

        // Append line HTML
        const lineContent = codeLines[lineIndex].html;
        if (lineIndex === 0) {
          typewriterCode.innerHTML = lineContent;
        } else {
          typewriterCode.innerHTML += '\n' + lineContent;
        }

        lineIndex++;

        // Calculate dynamic typing delay for realistic rhythm
        const delay = lineContent === '' ? 50 : Math.floor(Math.random() * 40) + 60;
        typingTimer = setTimeout(renderNextLine, delay);
      }
    };

    renderNextLine();
  };

  // Run typing animation
  runTerminalTyping();

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runTerminalTyping();
    });
  }

  // --------------------------------------------------------------------------
  // 6. Animated Count-up Statistics
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateStats = () => {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out expo curve for smooth landing
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * easeProgress;

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsStrip);
  }

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animation for Sections & Cards
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 8. Project Category Filtering
  // --------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.projects-section .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const shouldShow =
          filterValue === 'all' || cardCategory.includes(filterValue);

        if (shouldShow) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Certificate Category Filtering
  // --------------------------------------------------------------------------
  const certFilterBtns = document.querySelectorAll('.certificates-section .filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  certFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      certCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const shouldShow =
          filterValue === 'all' || cardCategory.includes(filterValue);

        if (shouldShow) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 10. Fullscreen Certificate Lightbox Modal
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // Collect certificate dataset from DOM
  const certificateData = [];
  certCards.forEach((card, index) => {
    const fgImg = card.querySelector('.cert-fg-img');
    const titleEl = card.querySelector('.cert-title');
    const categoryEl = card.querySelector('.cert-category-tag');
    const frame = card.querySelector('.cert-media-frame');

    const item = {
      index: index,
      src: fgImg ? fgImg.getAttribute('src') : '',
      alt: fgImg ? fgImg.getAttribute('alt') : '',
      title: titleEl ? titleEl.textContent.trim() : 'Certificate',
      category: categoryEl ? categoryEl.textContent.trim() : 'Verified'
    };

    certificateData.push(item);

    // Click handler to open lightbox
    if (frame) {
      frame.addEventListener('click', () => openLightbox(index));
      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    }
  });

  let currentCertIndex = 0;
  let lastActiveElement = null;

  const openLightbox = (index) => {
    currentCertIndex = (index + certificateData.length) % certificateData.length;
    lastActiveElement = document.activeElement;

    updateLightboxView();

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for keyboard accessibility
    setTimeout(() => {
      lightboxClose.focus();
    }, 50);
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  const updateLightboxView = () => {
    const cert = certificateData[currentCertIndex];
    if (!cert) return;

    lightboxImg.src = cert.src;
    lightboxImg.alt = cert.alt;
    lightboxTitle.textContent = cert.title;
    lightboxCategory.textContent = cert.category;
    lightboxCounter.textContent = `${currentCertIndex + 1} / ${certificateData.length}`;

    // Preload next and previous images for instant switching
    const nextIdx = (currentCertIndex + 1) % certificateData.length;
    const prevIdx = (currentCertIndex - 1 + certificateData.length) % certificateData.length;
    new Image().src = certificateData[nextIdx].src;
    new Image().src = certificateData[prevIdx].src;
  };

  const showNextCert = () => {
    currentCertIndex = (currentCertIndex + 1) % certificateData.length;
    updateLightboxView();
  };

  const showPrevCert = () => {
    currentCertIndex = (currentCertIndex - 1 + certificateData.length) % certificateData.length;
    updateLightboxView();
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextCert);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevCert);

  // Keyboard navigation for Lightbox (Esc, Left Arrow, Right Arrow)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNextCert();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showPrevCert();
    }
  });

  // Touch Swipe navigation on mobile for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  const handleSwipeGesture = () => {
    const threshold = 45;
    if (touchEndX < touchStartX - threshold) {
      // Swiped left -> next
      showNextCert();
    } else if (touchEndX > touchStartX + threshold) {
      // Swiped right -> prev
      showPrevCert();
    }
  };

  // --------------------------------------------------------------------------
  // 11. Copy Email to Clipboard & Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toastNotification = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastNotification) return;
    if (toastMsg) toastMsg.textContent = message;

    toastNotification.classList.add('show');
    toastNotification.setAttribute('aria-hidden', 'false');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
      toastNotification.setAttribute('aria-hidden', 'true');
    }, 2800);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'humaminhas14314@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback textarea copy method
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        const copyTextEl = copyEmailBtn.querySelector('.copy-text');
        if (copyTextEl) copyTextEl.textContent = 'Copied!';
        showToast('Email address copied to clipboard!');

        setTimeout(() => {
          if (copyTextEl) copyTextEl.textContent = 'Copy';
        }, 2200);
      } catch (err) {
        showToast('humaminhas14314@gmail.com');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. Contact Form Handler (Client validation & Mailto fallback)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please fill out all required fields.';
          formStatus.className = 'form-status error';
        }
        return;
      }

      // Generate mailto link
      const mailtoBody = encodeURIComponent(
        `Hello Zill-e-Huma,\n\nMy name is ${name} (${email}).\n\n${message}`
      );
      const mailtoUrl = `mailto:humaminhas14314@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${mailtoBody}`;

      if (formStatus) {
        formStatus.textContent = 'Opening your email client... Thank you!';
        formStatus.className = 'form-status success';
      }

      // Open user's email client
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Message ready in your email client. Looking forward to connecting!';
        }
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 13. Back to Top Smooth Scroll
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
