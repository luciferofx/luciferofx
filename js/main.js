/* ============================================================
   RAJA SHARMA — PORTFOLIO SCRIPT
   Cursor · scroll · reveal · counters · skills · game · form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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
    // active link
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

  /* ---------- 8. CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill all fields.';
      status.style.color = '#ff6b6b';
      return;
    }
    // No backend: fallback to mailto
    const mailto = `mailto:luciferofx69@gmail.com?subject=${encodeURIComponent(
      'Portfolio inquiry from ' + name
    )}&body=${encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')')}`;
    status.textContent = '✓ Opening your mail client...';
    status.style.color = 'var(--teal)';
    window.location.href = mailto;
    form.reset();
    setTimeout(() => { status.textContent = ''; }, 4000);
  });

  /* ---------- 9. PARTICLE BACKGROUND ---------- */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = window.innerWidth < 700 ? 40 : 85;

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
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,201,167,${0.12 * (1 - dist / 120)})`;
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

});
