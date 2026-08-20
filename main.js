// EcoSphere — Cyber Theme JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initNav();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initTabs();
  initCyberEffects();
});

// ==================== THEME ====================
function initTheme() {
  var saved = localStorage.getItem('ecosphere-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    updateThemeIcon(saved);
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ecosphere-theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  var toggle = document.getElementById('themeToggle');
  if (toggle) toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ==================== NAVIGATION ====================
function initNav() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
  window.addEventListener('scroll', function() {
    var nav = document.querySelector('.navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ==================== MOBILE NAV OVERLAY ====================
function initMobileNav() {
  var menuBtns = document.querySelectorAll('.bloom-hero-wrap .menu-btn, .menu-btn');
  if (!menuBtns.length) return;

  var pages = [
    { label: 'Dashboard', href: 'index.html' },
    { label: 'Calculator', href: 'calculator.html' },
    { label: 'Challenges', href: 'challenges.html' },
    { label: 'Marketplace', href: 'marketplace.html' },
    { label: 'Community', href: 'community.html' },
    { label: 'Learn', href: 'learn.html' },
    { label: 'Events', href: 'events.html' },
    { label: 'Leaderboard', href: 'leaderboard.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Impact', href: 'impact.html' },
    { label: 'Profile', href: 'profile.html' }
  ];

  var overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.style.cssText =
    'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.9);' +
    'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
    'flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;';

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.style.cssText =
    'position:absolute;top:1.2rem;right:1.5rem;background:none;border:none;' +
    'color:#fff;font-size:2.4rem;cursor:pointer;line-height:1;';

  pages.forEach(function(page) {
    var a = document.createElement('a');
    a.href = page.href;
    a.textContent = page.label;
    a.style.cssText =
      'color:#fff;font-size:2rem;font-family:Space Grotesk,sans-serif;text-decoration:none;' +
      'transition:color .2s,transform .2s;letter-spacing:0.03em;';
    a.addEventListener('mouseenter', function() { a.style.color = '#10b981'; a.style.transform = 'translateX(6px)'; });
    a.addEventListener('mouseleave', function() { a.style.color = '#fff'; a.style.transform = 'translateX(0)'; });
    a.addEventListener('click', function() { overlay.style.display = 'none'; });
    overlay.appendChild(a);
  });

  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function toggleOverlay() {
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
  }

  menuBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleOverlay();
    });
  });

  closeBtn.addEventListener('click', function() {
    overlay.style.display = 'none';
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.style.display = 'none';
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  var elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(function(el) { observer.observe(el); });
  }

  // Staggered card / item animations
  var staggerSelectors = ['.card', '.stat-item', '.challenge-card', '.testimonial-card'];
  staggerSelectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (!el.closest('.animate-on-scroll')) {
        el.classList.add('animate-on-scroll');
      }
    });
  });

  var staggerObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var parent = el.parentElement;
        var siblings = parent.querySelectorAll('.card, .stat-item, .challenge-card, .testimonial-card');
        var index = Array.prototype.indexOf.call(siblings, el);
        if (index === -1) index = 0;
        var delay = index * 120;

        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity .5s ease ' + delay + 'ms, transform .5s ease ' + delay + 'ms';

        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });

        staggerObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .stat-item, .challenge-card, .testimonial-card').forEach(function(el) {
    staggerObserver.observe(el);
  });

  // Slide-left animations
  var slideLeftObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.opacity = '0';
        el.style.transform = 'translateX(-40px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          });
        });
        slideLeftObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-slide-left').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-40px)';
    slideLeftObserver.observe(el);
  });

  // Slide-right animations
  var slideRightObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.opacity = '0';
        el.style.transform = 'translateX(40px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          });
        });
        slideRightObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-slide-right').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    slideRightObserver.observe(el);
  });
}

// ==================== ANIMATED COUNTERS ====================
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(function(c) { observer.observe(c); });
}

function animateCount(el) {
  var target = parseInt(el.getAttribute('data-count'));
  var suffix = el.getAttribute('data-suffix') || '';
  var prefix = el.getAttribute('data-prefix') || '';
  var duration = 2000;
  var startTime = performance.now();
  function update(now) {
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(target * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ==================== TABS ====================
function initTabs() {
  document.querySelectorAll('.tabs').forEach(function(tabGroup) {
    var buttons = tabGroup.querySelectorAll('.tab-btn');
    var targetId = tabGroup.getAttribute('data-tabs-group');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        buttons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        if (targetId) {
          document.querySelectorAll('[data-tab-content][data-tabs-group="' + targetId + '"]').forEach(function(panel) {
            panel.style.display = panel.getAttribute('data-tab-content') === target ? 'block' : 'none';
          });
        } else if (target) {
          document.querySelectorAll('.tab-panel').forEach(function(p) { p.style.display = 'none'; });
          var panel = document.getElementById(target);
          if (panel) panel.style.display = 'block';
        }
      });
    });
  });
}

// ==================== TOAST ====================
function showToast(message, type) {
  type = type || 'success';
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span style="font-size:1.1rem">' + (type === 'success' ? '✓' : '⚠') + '</span><span style="color:var(--text-primary);font-size:0.9rem">' + message + '</span>';
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

// ==================== PROGRESS BARS ====================
function initProgressBars() {
  var bars = document.querySelectorAll('.progress-fill[data-progress]');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.width = bar.getAttribute('data-progress') + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function(b) { observer.observe(b); });
}
document.addEventListener('DOMContentLoaded', initProgressBars);

// ==================== CYBER EFFECTS ====================
function initCyberEffects() {
  var heroes = document.querySelectorAll('.hero, .hero-section, [data-cyber-glow]');
  heroes.forEach(function(hero) {
    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', x + 'px');
      hero.style.setProperty('--mouse-y', y + 'px');
    });
  });
}

// ==================== CHART HELPERS ====================
var CYBER_COLORS = {
  cyan: '#10b981',
  green: '#06b6d4',
  purple: '#b388ff',
  pink: '#ff006e',
  yellow: '#ffd600',
  blue: '#448aff',
  cyanA: 'rgba(16,185,129,0.25)',
  greenA: 'rgba(0,255,136,0.25)',
  purpleA: 'rgba(179,136,255,0.25)',
};

function getThemeTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#4a6580';
}

function drawBarChart(canvasId, labels, data, colors) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 250 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '250px';
  ctx.scale(dpr, dpr);
  var w = rect.width;
  var h = 250;
  var padding = { top: 20, right: 20, bottom: 40, left: 50 };
  var chartW = w - padding.left - padding.right;
  var chartH = h - padding.top - padding.bottom;
  var maxVal = Math.max.apply(null, data) * 1.2;
  var barW = chartW / data.length * 0.6;
  var gap = chartW / data.length * 0.4;

  ctx.strokeStyle = 'rgba(16,185,129,0.06)';
  ctx.lineWidth = 1;
  for (var i = 0; i <= 5; i++) {
    var y = padding.top + chartH - (chartH * i / 5);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = getThemeTextColor();
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * i / 5).toString(), padding.left - 8, y + 4);
  }

  data.forEach(function(val, idx) {
    var x = padding.left + (chartW / data.length) * idx + gap / 2;
    var barH = (val / maxVal) * chartH;
    var y = padding.top + chartH - barH;
    var color = colors[idx % colors.length] || '#10b981';

    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    var gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + '22');
    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, barW, barH, 4);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + barW, y);
    ctx.stroke();

    ctx.fillStyle = getThemeTextColor();
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(labels[idx], x + barW / 2, h - padding.bottom + 18);
  });
}

function drawLineChart(canvasId, labels, datasets) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 250 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '250px';
  ctx.scale(dpr, dpr);
  var w = rect.width;
  var h = 250;
  var padding = { top: 20, right: 20, bottom: 40, left: 50 };
  var chartW = w - padding.left - padding.right;
  var chartH = h - padding.top - padding.bottom;
  var allVals = [];
  datasets.forEach(function(ds) { allVals = allVals.concat(ds.data); });
  var maxVal = Math.max.apply(null, allVals) * 1.2;

  ctx.strokeStyle = 'rgba(16,185,129,0.06)';
  ctx.lineWidth = 1;
  for (var i = 0; i <= 5; i++) {
    var y = padding.top + chartH - (chartH * i / 5);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = getThemeTextColor();
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * i / 5).toString(), padding.left - 8, y + 4);
  }

  datasets.forEach(function(ds) {
    ctx.shadowColor = ds.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ds.data.forEach(function(val, idx) {
      var x = padding.left + (chartW / (labels.length - 1)) * idx;
      var y = padding.top + chartH - (val / maxVal) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.08;
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = ds.color;
    ctx.fill();
    ctx.globalAlpha = 1;

    ds.data.forEach(function(val, idx) {
      var x = padding.left + (chartW / (labels.length - 1)) * idx;
      var y = padding.top + chartH - (val / maxVal) * chartH;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = ds.color + '22';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = ds.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
  });

  labels.forEach(function(label, idx) {
    var x = padding.left + (chartW / (labels.length - 1)) * idx;
    ctx.fillStyle = getThemeTextColor();
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, h - padding.bottom + 18);
  });
}

function drawDoughnut(canvasId, segments) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var size = 200;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  var cx = size / 2;
  var cy = size / 2;
  var outerR = 85;
  var innerR = 55;
  var total = segments.reduce(function(s, seg) { return s + seg.value; }, 0);
  var startAngle = -Math.PI / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, outerR + 4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(16,185,129,0.06)';
  ctx.lineWidth = 2;
  ctx.stroke();

  segments.forEach(function(seg) {
    var sliceAngle = (seg.value / total) * Math.PI * 2;
    ctx.shadowColor = seg.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    startAngle += sliceAngle;
  });

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e8f0fe';
  ctx.font = 'bold 22px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total.toString(), cx, cy - 6);
  ctx.font = '10px JetBrains Mono';
  ctx.fillStyle = getThemeTextColor();
  ctx.fillText('TOTAL', cx, cy + 14);
}

function drawRadialProgress(canvasId, value, maxVal, color) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var size = 140;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  var cx = size / 2;
  var cy = size / 2;
  var radius = 58;
  var lineWidth = 10;
  var actualColor = color || '#10b981';

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(16,185,129,0.06)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = actualColor + '11';
  ctx.lineWidth = lineWidth + 8;
  ctx.stroke();

  var progress = value / maxVal;
  ctx.shadowColor = actualColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.strokeStyle = actualColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.shadowBlur = 0;

  var endAngle = -Math.PI / 2 + Math.PI * 2 * progress;
  var dotX = cx + Math.cos(endAngle) * radius;
  var dotY = cy + Math.sin(endAngle) * radius;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
  ctx.fillStyle = actualColor + '33';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
  ctx.fillStyle = actualColor;
  ctx.fill();

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e8f0fe';
  ctx.font = 'bold 24px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toString(), cx, cy - 6);
  ctx.font = '10px JetBrains Mono';
  ctx.fillStyle = getThemeTextColor();
  ctx.fillText('/ ' + maxVal, cx, cy + 14);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawWaterFill(canvasId, percentage) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var w = 200;
  var h = 260;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  var fillH = (h - 40) * (percentage / 100);
  var fillY = h - 20 - fillH;

  ctx.beginPath();
  roundRect(ctx, 10, 10, w - 20, h - 20, 16);
  ctx.fillStyle = 'rgba(16,185,129,0.03)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(16,185,129,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, 12, 12, w - 24, h - 24, 14);
  ctx.clip();

  var gradient = ctx.createLinearGradient(0, fillY, 0, h - 20);
  gradient.addColorStop(0, 'rgba(16,185,129,0.5)');
  gradient.addColorStop(1, 'rgba(0,255,136,0.7)');
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(12, h - 20);
  var time = Date.now() / 1000;
  for (var x = 12; x <= w - 12; x++) {
    var wave = Math.sin((x * 0.03) + time * 2) * 4;
    ctx.lineTo(x, fillY + wave);
  }
  ctx.lineTo(w - 12, h - 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  for (var x2 = 12; x2 <= w - 12; x2++) {
    var wave2 = Math.sin((x2 * 0.03) + time * 2) * 4;
    if (x2 === 12) ctx.moveTo(x2, fillY + wave2);
    else ctx.lineTo(x2, fillY + wave2);
  }
  ctx.strokeStyle = 'rgba(16,185,129,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(percentage + '%', w / 2, h / 2);
  ctx.shadowBlur = 0;
}