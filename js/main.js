/* ============================================================
   RAJA SHARMA — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  (function initPreloader() {
    const pre = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    const pct = document.getElementById('preloaderPercent');
    const lines = document.querySelectorAll('.pl-line');

    if (!pre) return;

    document.body.style.overflow = 'hidden';

    let progress = 0;
    let lineIndex = 0;

    const lineTimer = setInterval(() => {
      if (lineIndex < lines.length) {
        lines[lineIndex].classList.add('show');
        lineIndex++;
      } else {
        clearInterval(lineTimer);
      }
    }, 220);

    const progressTimer = setInterval(() => {
      const step = progress < 70
        ? Math.random() * 4 + 1.5
        : progress < 92
          ? Math.random() * 1.8 + 0.6
          : Math.random() * 0.9 + 0.3;

      progress = Math.min(100, progress + step);
      bar.style.width = progress + '%';
      pct.textContent = Math.floor(progress);

      if (progress >= 100) {
        clearInterval(progressTimer);
        clearInterval(lineTimer);
        lines.forEach(l => l.classList.add('show'));
        setTimeout(finishPreloader, 500);
      }
    }, 60);

    function finishPreloader() {
      pre.classList.add('done');
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('scroll'));
      setTimeout(() => { pre.style.display = 'none'; }, 900);
    }

    function skip() {
      progress = 100;
      bar.style.width = '100%';
      pct.textContent = '100';
      clearInterval(progressTimer);
      clearInterval(lineTimer);
      lines.forEach(l => l.classList.add('show'));
      finishPreloader();
      window.removeEventListener('keydown', onKey);
      pre.removeEventListener('click', skip);
    }
    function onKey(e) { if (e.key === 'Escape') skip(); }
    window.addEventListener('keydown', onKey);
    pre.addEventListener('click', skip);
  })();

  /* ---------- 0. RIGHT-CLICK DISABLE + SCREENSHOT BLACKOUT ---------- */
  const blackout = document.getElementById('blackout');

  function flashBlackout(ms = 400) {
    if (!blackout) return;
    blackout.classList.add('active');
    clearTimeout(blackout._t);
    blackout._t = setTimeout(() => blackout.classList.remove('active'), ms);
  }

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    flashBlackout(250);
    return false;
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if (key === 'PrintScreen' || key === 'Print' || e.keyCode === 44) {
      e.preventDefault(); flashBlackout(500); return false;
    }
    if (ctrl && shift && (key === 'S' || key === 's')) {
      e.preventDefault(); flashBlackout(500); return false;
    }
    if (e.metaKey && shift && (key === '3' || key === '4' || key === '5')) {
      e.preventDefault(); flashBlackout(500); return false;
    }
    if (ctrl && (key === 'p' || key === 'P')) {
      e.preventDefault(); flashBlackout(500); return false;
    }
    if (ctrl && !shift && (key === 's' || key === 'S')) {
      e.preventDefault(); flashBlackout(300); return false;
    }
    if (ctrl && (key === 'u' || key === 'U')) {
      e.preventDefault(); return false;
    }
    if (key === 'F12' ||
        (ctrl && shift && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c'))) {
      e.preventDefault(); flashBlackout(300); return false;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen' || e.key === 'Print' || e.keyCode === 44) {
      flashBlackout(500);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flashBlackout(300);
  });

  /* ---------- 1. CUSTOM CURSOR ---------- */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
    const follow = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll('a, button, .project-card, .info-card, .spark')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ---------- 2. SCROLL PROGRESS ---------- */
  const progress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progress) progress.style.width = pct + '%';
  });

  /* ---------- 3. NAV ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const sections = document.querySelectorAll('section[id]');
    let current = 'home';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  links.forEach(l => l.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navLinks?.classList.remove('open');
  }));

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ---------- 4b. PROJECT CARDS: SCROLL SLIDE-IN ---------- */
  document.querySelectorAll('.projects-grid .project-card').forEach(card => {
    card.removeAttribute('data-reveal');
  });

  const projectCards = document.querySelectorAll('.projects-grid .project-card');
  projectCards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.12}s`;
  });

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-in');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  projectCards.forEach(card => cardIO.observe(card));

  /* ---------- 4c. SCROLL PARALLAX FOR CARDS ---------- */
  let cardScrollTick = false;

  function updateCardParallax() {
    const viewportH = window.innerHeight;
    projectCards.forEach(card => {
      if (!card.classList.contains('slide-in')) return;
      if (card.matches(':hover')) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (cardCenter - viewportH / 2) / viewportH;
      const clamped = Math.max(-1, Math.min(1, distanceFromCenter));
      const translateY = clamped * 18;
      const rotateX = clamped * -2;
      card.style.transform =
        `translateY(${translateY}px) rotateX(${rotateX}deg) scale(1)`;
    });
    cardScrollTick = false;
  }

  window.addEventListener('scroll', () => {
    if (!cardScrollTick) {
      requestAnimationFrame(updateCardParallax);
      cardScrollTick = true;
    }
  }, { passive: true });

  updateCardParallax();

  /* ---------- 5. COUNTERS ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let n = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        n += step;
        if (n >= target) { el.textContent = target + '+'; return; }
        el.textContent = n;
        requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

  /* ---------- 6. SKILL BARS ---------- */
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        const pct = bar.dataset.skill;
        const fill = bar.querySelector('.bar i');
        setTimeout(() => { if (fill) fill.style.width = pct + '%'; }, 150);
      });
      skillIO.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-group').forEach(el => skillIO.observe(el));

  /* ---------- 6b. PROJECT MODAL ---------- */
  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalBadge = document.getElementById('modalBadge');
  const modalYear = document.getElementById('modalYear');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalFeatureSection = document.getElementById('modalFeatureSection');
  const modalActions = document.getElementById('modalActions');

  function openProjectModal(card) {
    if (!projectModal) return;

    const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project';
    const badge = card.dataset.badge || 'Project';
    const year = card.dataset.year || '2024';
    const desc = card.dataset.desc || card.querySelector('p')?.textContent || '';
    const tech = (card.dataset.tech || '').split(',').filter(Boolean);
    const features = (card.dataset.features || '').split('|').filter(Boolean);
    const linksRaw = (card.dataset.links || '').split(';').filter(Boolean);

    modalBadge.textContent = badge;
    modalYear.textContent = year;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modalTech.innerHTML = '';
    tech.forEach(t => {
      const span = document.createElement('span');
      span.textContent = t.trim();
      modalTech.appendChild(span);
    });

    modalFeatures.innerHTML = '';
    if (features.length > 0) {
      modalFeatureSection.style.display = 'block';
      features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f.trim();
        modalFeatures.appendChild(li);
      });
    } else {
      modalFeatureSection.style.display = 'none';
    }

    modalActions.innerHTML = '';
    linksRaw.forEach((raw, i) => {
      const [label, url] = raw.split('|');
      if (label && url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = label.trim() + ' ↗';
        if (i > 0) a.classList.add('ghost');
        modalActions.appendChild(a);
      }
    });
    if (linksRaw.length === 0) modalActions.style.display = 'none';
    else modalActions.style.display = 'flex';

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // don't open modal if user clicked a direct link
      if (e.target.closest('a')) return;
      openProjectModal(card);
    });
  });

  modalClose?.addEventListener('click', closeProjectModal);
  modalBackdrop?.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
      closeProjectModal();
    }
  });

  /* ---------- 7. MINI GAME ---------- */
  const board = document.getElementById('gameBoard');
  const overlay = document.getElementById('gameOverlay');
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const startBtn = document.getElementById('gameStart');
  let score = 0, timeLeft = 20, spawnTimer = null, clockTimer = null, playing = false;

  function spawnSpark() {
    if (!playing) return;
    const spark = document.createElement('div');
    spark.className = 'spark';
    const size = 26;
    const maxX = board.clientWidth - size;
    const maxY = board.clientHeight - size;
    spark.style.left = Math.random() * maxX + 'px';
    spark.style.top = Math.random() * maxY + 'px';
    spark.addEventListener('click', () => {
      score++;
      scoreEl.textContent = score;
      spark.remove();
      spawnSpark();
    });
    board.appendChild(spark);
    clearTimeout(spawnTimer);
    spawnTimer = setTimeout(() => {
      spark.remove();
      if (playing) spawnSpark();
    }, 1100);
  }

  function startGame() {
    playing = true;
    score = 0; timeLeft = 20;
    scoreEl.textContent = '0';
    timeEl.textContent = '20';
    board.querySelectorAll('.spark').forEach(s => s.remove());
    overlay.classList.add('hidden');
    spawnSpark();
    clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    playing = false;
    clearTimeout(spawnTimer);
    clearInterval(clockTimer);
    board.querySelectorAll('.spark').forEach(s => s.remove());
    overlay.classList.remove('hidden');
    overlay.innerHTML = `<p>Time's up! You caught <b style="color:var(--teal-bright)">${score}</b> sparks. ${score >= 10 ? '🔥 Sharp reflexes!' : 'Try again — beat your score!'}</p>`;
  }

  startBtn?.addEventListener('click', startGame);

  /* ---------- 8. CONTACT FORM (Formspree) + SUCCESS SCREEN ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const successScreen = document.getElementById('successScreen');
  const successCountdown = document.getElementById('successCountdown');

  function showSuccessScreen() {
    if (!successScreen) return;
    successScreen.classList.add('active');
    document.body.style.overflow = 'hidden';

    let seconds = 4;
    if (successCountdown) successCountdown.textContent = seconds;

    const countdownTimer = setInterval(() => {
      seconds--;
      if (successCountdown) successCountdown.textContent = Math.max(0, seconds);
      if (seconds <= 0) {
        clearInterval(countdownTimer);
        hideSuccessAndReset();
      }
    }, 1000);
  }

  function hideSuccessAndReset() {
    if (!successScreen) return;
    successScreen.classList.remove('active');
    setTimeout(() => {
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => { window.location.reload(); }, 250);
    }, 600);
  }

  if (form && status && submitBtn) {
    const btnLabel = submitBtn.querySelector('.btn-label');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = '⚠ Please fill all fields.';
        status.style.color = '#ff6b6b';
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        status.textContent = '⚠ Please enter a valid email.';
        status.style.color = '#ff6b6b';
        return;
      }

      btnLabel.style.display = 'none';
      btnSpinner.style.display = 'inline';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      status.textContent = '';
      status.style.color = 'var(--teal)';

      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          showSuccessScreen();
        } else {
          const data = await res.json().catch(() => ({}));
          const err = data.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
          status.textContent = '⚠ ' + err;
          status.style.color = '#ff6b6b';
        }
      } catch (err) {
        status.textContent = '⚠ Network error. Try again or email directly.';
        status.style.color = '#ff6b6b';
      } finally {
        btnLabel.style.display = 'inline';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }

  /* ---------- 9. PARTICLE BACKGROUND ---------- */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = window.innerWidth < 700 ? 40 : 85;
    const LINK_DIST = 120;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function init() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.5,
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,245,212,0.55)';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,201,167,${0.12 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); draw();
  }

  /* ---------- 10. HERO GLOW PARALLAX ---------- */
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroGlow.style.transform = `translate(${y * 0.1}px, ${y * 0.15}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---------- 11. PROJECT CARD 3D TILT ON MOVE ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('slide-in')) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${y * 4}deg) rotateY(${x * 4}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('slide-in')) return;
        card.style.transform = '';
      });
    });
  }

  /* ---------- 12. SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
