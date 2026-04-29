// =============================================
// NAV — Smooth scroll
// =============================================
function go(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// =============================================
// LOADER
// =============================================
const msgs = [
  "INIT SYSTEMS...",
  "LOADING THREE.JS...",
  "COMPILING SHADERS...",
  "MOUNTING APP...",
  "GSAP READY...",
  "LAUNCHING ↗",
];
let p = 0,
  mi = 0;
const fill = document.getElementById("ldFill");
const pctEl = document.getElementById("ldPct");
const msgEl = document.getElementById("ldMsg");

const ldI = setInterval(() => {
  p += Math.random() * 3.5 + 1.2;
  if (p > 100) p = 100;
  fill.style.width = p + "%";
  pctEl.textContent = Math.floor(p) + "%";
  const idx = Math.floor((p / 100) * msgs.length);
  if (idx > mi && mi < msgs.length - 1) {
    mi = idx;
    msgEl.textContent = msgs[mi];
  }
  if (p >= 100) {
    clearInterval(ldI);
    msgEl.textContent = msgs[msgs.length - 1];
    setTimeout(() => {
      document.getElementById("loader").classList.add("gone");
      setTimeout(onLoaderDone, 400);
    }, 700);
  }
}, 55);

// =============================================
// HERO INTRO SEQUENCE
// =============================================
function onLoaderDone() {
  showStartOverlay();
}

// =============================================
// THREE.JS BACKGROUND — OPTIMIZED
// =============================================
const tc = document.getElementById("tc");
const renderer = new THREE.WebGLRenderer({
  canvas: tc,
  antialias: false,
  alpha: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(
  58,
  innerWidth / innerHeight,
  0.1,
  2000,
);
cam.position.set(0, 0, 5.5);

scene.add(new THREE.AmbientLight(0x000820, 3));
const dl = new THREE.DirectionalLight(0x0088cc, 4);
dl.position.set(5, 5, 5);
scene.add(dl);
const pl1 = new THREE.PointLight(0x00cfff, 5, 18);
pl1.position.set(-3, 2, 3);
scene.add(pl1);
const pl2 = new THREE.PointLight(0x7b5cff, 4, 14);
pl2.position.set(3, -2, 2);
scene.add(pl2);

const wh1 = new THREE.Mesh(
  new THREE.TorusGeometry(2.4, 0.75, 14, 60),
  new THREE.MeshBasicMaterial({
    color: 0x7b5cff,
    wireframe: true,
    transparent: true,
    opacity: 0.11,
  }),
);
wh1.position.set(-3.5, -0.5, -3.5);
wh1.rotation.y = Math.PI / 4;
scene.add(wh1);

const N = 1800;
const pos3 = new Float32Array(N * 3);
const col3 = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const i3 = i * 3;
  pos3[i3] = (Math.random() - 0.5) * 65;
  pos3[i3 + 1] = (Math.random() - 0.5) * 65;
  pos3[i3 + 2] = (Math.random() - 0.5) * 65;
  const r = Math.random();
  if (r < 0.65) {
    col3[i3] = 0.85;
    col3[i3 + 1] = 0.92;
    col3[i3 + 2] = 1;
  } else if (r < 0.83) {
    col3[i3] = 0.45;
    col3[i3 + 1] = 0.35;
    col3[i3 + 2] = 1;
  } else {
    col3[i3] = 0;
    col3[i3 + 1] = 0.85;
    col3[i3 + 2] = 1;
  }
}
const sg = new THREE.BufferGeometry();
sg.setAttribute("position", new THREE.BufferAttribute(pos3, 3));
sg.setAttribute("color", new THREE.BufferAttribute(col3, 3));
scene.add(
  new THREE.Points(
    sg,
    new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
    }),
  ),
);

const debris = [];
for (let i = 0; i < 7; i++) {
  const g =
    Math.random() > 0.5
      ? new THREE.OctahedronGeometry(Math.random() * 0.09 + 0.025)
      : new THREE.TetrahedronGeometry(Math.random() * 0.08 + 0.03);
  const m = new THREE.MeshPhongMaterial({
    color: 0x002244,
    emissive: 0x000d1a,
    wireframe: Math.random() > 0.4,
    transparent: true,
    opacity: 0.5 + Math.random() * 0.5,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(
    (Math.random() - 0.5) * 9,
    (Math.random() - 0.5) * 5.5,
    (Math.random() - 0.5) * 3.5 - 1,
  );
  mesh.userData = {
    rx: (Math.random() - 0.5) * 0.022,
    ry: (Math.random() - 0.5) * 0.018,
    t: Math.random() * Math.PI * 2,
    spd: 0.08 + Math.random() * 0.25,
  };
  scene.add(mesh);
  debris.push(mesh);
}

let mx = 0,
  my = 0,
  sr = 0;
let camX = 0,
  camY = 0;
window.addEventListener(
  "mousemove",
  (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  },
  { passive: true },
);
window.addEventListener(
  "scroll",
  () => {
    sr = scrollY / (document.body.scrollHeight - innerHeight);
  },
  { passive: true },
);
window.addEventListener("resize", () => {
  cam.aspect = innerWidth / innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  brsz();
});

const clk = new THREE.Clock();
(function anim() {
  requestAnimationFrame(anim);
  const t = clk.getElapsedTime();
  wh1.rotation.z = t * 0.12;
  wh1.rotation.x = t * 0.04;
  debris.forEach((d) => {
    const u = d.userData;
    d.rotation.x += u.rx;
    d.rotation.y += u.ry;
    d.position.y += Math.sin(t * u.spd + u.t) * 0.0018;
  });
  camX += (mx * 0.55 - camX) * 0.04;
  camY += (-my * 0.38 - camY) * 0.04;
  cam.position.x = camX;
  cam.position.y = camY;
  cam.position.z = 5.5 - sr * 3.2;
  scene.rotation.y = mx * 0.045;
  renderer.render(scene, cam);
})();

// =============================================
// 2D CANVAS — hanya resize, tidak ada draw loop
// Bintang Three.js sudah cukup menggantikannya
// =============================================
const bc = document.getElementById("bc");
let bW, bH;
function brsz() {
  bW = bc.width = innerWidth;
  bH = bc.height = innerHeight;
}
brsz();

// =============================================
// CUSTOM CURSOR — pakai rAF, bukan setInterval
// =============================================
const dotEl = document.getElementById("dot");
const ringEl = document.getElementById("ring");
let curX = 0,
  curY = 0,
  ringX = 0,
  ringY = 0;
let cursorRAF = false;

document.addEventListener(
  "mousemove",
  (e) => {
    curX = e.clientX;
    curY = e.clientY;
    dotEl.style.left = curX + "px";
    dotEl.style.top = curY + "px";
    if (!cursorRAF) {
      cursorRAF = true;
      requestAnimationFrame(updateRing);
    }
  },
  { passive: true },
);

function updateRing() {
  ringX += (curX - ringX) * 0.18;
  ringY += (curY - ringY) * 0.18;
  ringEl.style.left = ringX + "px";
  ringEl.style.top = ringY + "px";
  if (Math.abs(curX - ringX) > 0.5 || Math.abs(curY - ringY) > 0.5) {
    requestAnimationFrame(updateRing);
  } else {
    cursorRAF = false;
  }
}

// =============================================
// 3D PHOTO TILT — throttled dengan rAF
// =============================================
const photoCard = document.getElementById("photoCard");
let cardBounds = null;
let heroVisible = true;
let tiltPending = false;
let lastMX = 0,
  lastMY = 0;

function getCardBounds() {
  cardBounds = photoCard.getBoundingClientRect();
}
window.addEventListener("resize", getCardBounds);
setTimeout(getCardBounds, 500);
window.addEventListener("scroll", getCardBounds, { passive: true });

document.addEventListener(
  "mousemove",
  (e) => {
    if (!heroVisible) return;
    lastMX = e.clientX;
    lastMY = e.clientY;
    if (!tiltPending) {
      tiltPending = true;
      requestAnimationFrame(applyTilt);
    }
  },
  { passive: true },
);

function applyTilt() {
  tiltPending = false;
  if (!cardBounds) getCardBounds();
  const cx = cardBounds.left + cardBounds.width / 2;
  const cy = cardBounds.top + cardBounds.height / 2;
  const dx = (lastMX - cx) / (window.innerWidth / 2);
  const dy = (lastMY - cy) / (window.innerHeight / 2);
  const tiltX = -dy * 18;
  const tiltY = dx * 18;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const sc = 1 + Math.max(0, (1 - dist) * 0.04);
  photoCard.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${sc})`;
}

document.getElementById("hero").addEventListener("mouseleave", () => {
  photoCard.style.transition = "transform 0.8s cubic-bezier(.16,1,.3,1)";
  photoCard.style.transform =
    "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  setTimeout(() => {
    photoCard.style.transition = "transform 0.08s ease-out";
  }, 850);
});

window.addEventListener(
  "scroll",
  () => {
    const scrollPct = window.scrollY / window.innerHeight;
    heroVisible = scrollPct < 0.8;
    const translateY = window.scrollY * 0.15;
    const opacity = Math.max(0, 1 - scrollPct * 1.4);
    photoCard.style.transform = `perspective(800px) translateY(-${translateY}px) scale(${1 - scrollPct * 0.08})`;
    document.querySelector(".hero-photo-wrap").style.opacity = opacity;
  },
  { passive: true },
);

// =============================================
// INJECT MARQUEE CSS
// =============================================
(function injectMarqueeCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .carousel-viewport {
      overflow: hidden;
      width: 100%;
    }
    .carousel-track {
      display: flex;
      gap: 1.2rem;
      will-change: transform;
    }
    .carousel-track.marquee-mode {
      animation: marqueeScroll linear infinite;
    }
    .carousel-track.marquee-mode.paused {
      animation-play-state: paused;
    }
    @keyframes marqueeScroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(var(--marquee-dist)); }
    }
  `;
  document.head.appendChild(style);
})();

// =============================================
// SKILLS DATA + CAROUSEL
// =============================================
// =============================================
// SKILLS DATA + INFINITE MARQUEE
// =============================================
const skills = [
  {
    cat: "FRONTEND",
    icon: "⬡",
    nm: "REACT + R3F",
    ds: "3D web interfaces & component architecture",
    lv: 94,
    accent: "cyan",
  },
  {
    cat: "3D / WEBGL",
    icon: "◉",
    nm: "THREE.JS",
    ds: "Real-time 3D scenes, shaders, particle systems",
    lv: 90,
    accent: "purple",
  },
  {
    cat: "ANIMATION",
    icon: "◈",
    nm: "GSAP + ScrollTrigger",
    ds: "Cinematic scroll-driven animations",
    lv: 92,
    accent: "green",
  },
  {
    cat: "FRONTEND",
    icon: "◆",
    nm: "VUE 3 + NUXT",
    ds: "Reactive UI & server-side rendering",
    lv: 88,
    accent: "orange",
  },
  {
    cat: "BACKEND",
    icon: "▣",
    nm: "LARAVEL",
    ds: "REST APIs, MVC, authentication & eloquent ORM",
    lv: 91,
    accent: "pink",
  },
  {
    cat: "LANGUAGE",
    icon: "◎",
    nm: "TYPESCRIPT",
    ds: "Type-safe fullstack development",
    lv: 87,
    accent: "yellow",
  },
  {
    cat: "MOBILE",
    icon: "◐",
    nm: "FLUTTER",
    ds: "Cross-platform mobile apps for iOS & Android",
    lv: 82,
    accent: "cyan",
  },
  {
    cat: "BACKEND",
    icon: "▶",
    nm: "NODE.JS + EXPRESS",
    ds: "REST APIs, WebSocket, real-time systems",
    lv: 85,
    accent: "green",
  },
  {
    cat: "LANGUAGE",
    icon: "◑",
    nm: "JAVA",
    ds: "OOP, Android & backend service development",
    lv: 80,
    accent: "orange",
  },
];

const accentColors = {
  cyan: "#00cfff",
  purple: "#a855f7",
  green: "#00ff9f",
  orange: "#ff6b35",
  pink: "#ff3d9a",
  yellow: "#ffe566",
};

const skTrack = document.getElementById("skTrack");
const skDots = document.getElementById("skDots");
let skBarsAnimated = false;

function buildSkCard(s) {
  const col = accentColors[s.accent];
  const card = document.createElement("div");
  card.className = "sk";
  card.dataset.accent = s.accent;
  card.innerHTML = `
    <div class="sk-cat" style="color:${col}">${s.cat}</div>
    <div class="sk-ic" style="color:${col}">${s.icon}</div>
    <div class="sk-nm">${s.nm}</div>
    <div class="sk-ds">${s.ds}</div>
    <div class="sk-tr"><div class="sk-fl" data-w="${s.lv}" style="background:linear-gradient(90deg,${col},${col}88)"></div></div>`;
  return card;
}

// Build cards + clone for seamless loop
skills.forEach((s) => skTrack.appendChild(buildSkCard(s)));
// Clone all cards for infinite loop
skills.forEach((s) => {
  const clone = buildSkCard(s);
  clone.setAttribute("aria-hidden", "true");
  skTrack.appendChild(clone);
});

// Setup marquee
function initSkMarquee() {
  const cardW = 280;
  const gap = 1.2 * 16;
  const totalW = skills.length * (cardW + gap);
  // Set fixed card width
  skTrack.querySelectorAll(".sk").forEach((c) => {
    c.style.width = cardW + "px";
    c.style.minWidth = cardW + "px";
  });
  skTrack.style.cssText += `--marquee-dist: -${totalW}px;`;
  skTrack.style.animationDirection = "reverse"; // ← gerak kanan ke kiri → kanan
  skTrack.classList.add("marquee-mode");
  // Speed: 40px/s → duration = totalW / 40
  skTrack.style.animationDuration = totalW / 22 + "s";
}

// Pause on hover
document
  .getElementById("skCarousel")
  .addEventListener("mouseenter", () => skTrack.classList.add("paused"));
document
  .getElementById("skCarousel")
  .addEventListener("mouseleave", () => skTrack.classList.remove("paused"));

// Prev/Next: shift animation by one card step
let skOffset = 0;
const skCardStep = 280 + 1.2 * 16;

document.getElementById("skPrev").addEventListener("click", () => {
  skOffset = Math.max(skOffset - skCardStep, 0);
  skTrack.style.animationDelay = skOffset / 38 + "s";
});
document.getElementById("skNext").addEventListener("click", () => {
  skOffset += skCardStep;
  skTrack.style.animationDelay = -(skOffset / 38) + "s";
});

// Hide dots (marquee doesn't need page dots)
skDots.style.display = "none";
document.getElementById("skPrev").style.display = "flex";
document.getElementById("skNext").style.display = "flex";

// Animate bars when section enters view
const skillObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !skBarsAnimated) {
        skBarsAnimated = true;
        skTrack
          .querySelectorAll(".sk-fl")
          .forEach((el) => (el.style.width = el.dataset.w + "%"));
      }
    });
  },
  { threshold: 0.25 },
);
skillObs.observe(document.getElementById("skills"));

setTimeout(initSkMarquee, 50);

// =============================================
// PROJECTS DATA + CAROUSEL
// =============================================
// =============================================
// PROJECTS DATA + INFINITE MARQUEE
// =============================================
const projects = [
  {
    n: "001",
    t: "NEBULA UI KIT",
    d: "Design system 3D component library dengan particle engine & React Three Fiber.",
    tags: ["REACT", "R3F", "TYPESCRIPT", "GSAP"],
    accent: "cyan-purple",
  },
  {
    n: "002",
    t: "QUANTUM DASHBOARD",
    d: "Platform analytics realtime dengan WebGL renderer untuk 10M+ data points.",
    tags: ["VUE 3", "THREE.JS", "NODE.JS", "D3"],
    accent: "green-cyan",
  },
  {
    n: "003",
    t: "VOID COMMERCE",
    d: "E-commerce fullstack dengan 3D product showcase sinematik & checkout GSAP-animated.",
    tags: ["NEXT.JS", "GSAP", "NODE", "STRIPE"],
    accent: "orange-pink",
  },
  {
    n: "004",
    t: "STELLAR MAP",
    d: "Interactive star map WebGL dengan 100k+ bintang prosedural & real astronomy data.",
    tags: ["THREE.JS", "GLSL", "VUE", "REST API"],
    accent: "purple-pink",
  },
  {
    n: "005",
    t: "LARAVEL SIS AKADEMIK",
    d: "Sistem informasi akademik berbasis Laravel dengan autentikasi role & dashboard dinamis.",
    tags: ["LARAVEL", "MySQL", "TAILWIND", "ALPINE"],
    accent: "yellow-green",
  },
  {
    n: "006",
    t: "FLUTTER FINANCE APP",
    d: "Aplikasi keuangan personal mobile cross-platform dengan grafik interaktif real-time.",
    tags: ["FLUTTER", "DART", "FIREBASE", "CHARTS"],
    accent: "blue-cyan",
  },
];

const pjTrack = document.getElementById("pjTrack");
const pjDots = document.getElementById("pjDots");

function buildPjCard(p) {
  const card = document.createElement("div");
  card.className = "pj";
  card.dataset.accent = p.accent;
  card.onclick = () => window.open("#");
  card.innerHTML = `
    <div class="pj-arr">↗</div>
    <div class="pj-n">//${p.n}</div>
    <div class="pj-t">${p.t}</div>
    <div class="pj-d">${p.d}</div>
    <div class="pj-tags">${p.tags.map((t) => `<span class="pj-tag">${t}</span>`).join("")}</div>`;
  return card;
}

// Build original + clones
projects.forEach((p) => pjTrack.appendChild(buildPjCard(p)));
projects.forEach((p) => {
  const clone = buildPjCard(p);
  clone.setAttribute("aria-hidden", "true");
  pjTrack.appendChild(clone);
});

function initPjMarquee() {
  const cardW = 360;
  const gap = 1.2 * 16;
  const totalW = projects.length * (cardW + gap);
  pjTrack.querySelectorAll(".pj").forEach((c) => {
    c.style.width = cardW + "px";
    c.style.minWidth = cardW + "px";
  });
  pjTrack.style.cssText += `--marquee-dist: -${totalW}px;`;
  pjTrack.classList.add("marquee-mode");
  // Slightly slower than skills: 32px/s
  pjTrack.style.animationDuration = totalW / 18 + "s";
}

// Pause on hover
document
  .getElementById("pjCarousel")
  .addEventListener("mouseenter", () => pjTrack.classList.add("paused"));
document
  .getElementById("pjCarousel")
  .addEventListener("mouseleave", () => pjTrack.classList.remove("paused"));

// Prev/Next buttons
let pjOffset = 0;
const pjCardStep = 360 + 1.2 * 16;

document.getElementById("pjPrev").addEventListener("click", () => {
  pjOffset = Math.max(pjOffset - pjCardStep, 0);
  pjTrack.style.animationDelay = pjOffset / 32 + "s";
});
document.getElementById("pjNext").addEventListener("click", () => {
  pjOffset += pjCardStep;
  pjTrack.style.animationDelay = -(pjOffset / 32) + "s";
});

// Hide dots
pjDots.style.display = "none";

setTimeout(initPjMarquee, 50);

// =============================================
// COUNTER ANIMATION
// =============================================
function animCount(el, target, suffix = "") {
  let v = 0;
  const step = target / 60;
  const iv = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = Math.floor(v) + suffix;
    if (v >= target) clearInterval(iv);
  }, 25);
}
const statsObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animCount(document.getElementById("sn1"), 3, "+");
        animCount(document.getElementById("sn2"), 24, "");
        animCount(document.getElementById("sn3"), 12, "");
        animCount(document.getElementById("sn4"), 1200, "+");
        statsObs.disconnect();
      }
    });
  },
  { threshold: 0.4 },
);
statsObs.observe(document.getElementById("about"));

// =============================================
// START OVERLAY + AUDIO
// =============================================
const bgAudio = document.getElementById("bgAudio");
bgAudio.volume = 0.5;
let audioPlaying = false;

function startAudio() {
  bgAudio
    .play()
    .then(() => {
      audioPlaying = true;
      document.getElementById("audioBtn").textContent = "🔊";
      sessionStorage.setItem("audioUnlocked", "1");
    })
    .catch(() => {});
}

function toggleAudio() {
  const btn = document.getElementById("audioBtn");
  if (audioPlaying) {
    bgAudio.pause();
    btn.textContent = "🔇";
    audioPlaying = false;
  } else {
    startAudio();
  }
}

const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");

// Loader selesai → tampilkan start overlay
// (panggil ini di dalam onLoaderDone, GANTIKAN baris spinner & textEls)
function showStartOverlay() {
  // overlay sudah visible, tinggal sembunyikan loader
  document.getElementById("loader").classList.add("gone");
}

startBtn.addEventListener("click", () => {
  // 1. Mulai audio
  startAudio();

  // 2. Fade out overlay
  startOverlay.classList.add("fade-out");
  setTimeout(() => {
    startOverlay.classList.add("gone");

    // 3. Baru jalankan intro animasi hero (yang tadinya di onLoaderDone)
    const spinner = document.getElementById("photoSpinner");
    spinner.classList.add("do-spin");
    spinner.addEventListener(
      "animationend",
      () => {
        spinner.classList.remove("do-spin");
        spinner.classList.add("spin-done");
      },
      { once: true },
    );

    const textEls = document.querySelectorAll(".hero-text > *");
    const delays = [250, 850, 1550, 2550, 3300, 3950, 4650];
    textEls.forEach((el, i) => {
      const ms = delays[i] !== undefined ? delays[i] : 300 + i * 600;
      setTimeout(() => el.classList.add("revealed"), ms);
    });
  }, 850);
});
