// Util
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));

// Data: videos (YouTube + Instagram Reels)
const videos = [
  { id: '32V0GzI7I2o', title: 'Dynamic Edit — Highlight', tag: 'case', duration: '02:02', poster: 'https://i.ytimg.com/vi/32V0GzI7I2o/hqdefault.jpg', type: 'youtube' },
  { id: '9zOpEKGi1fA', title: 'Ad Cut — Momentum', tag: 'ad', duration: '01:21', poster: 'https://i.ytimg.com/vi/9zOpEKGi1fA/hqdefault.jpg', type: 'youtube' },
  { id: '8Jd-bwOBiXo', title: 'Short — Vertical Performance', tag: 'short', duration: '00:23', poster: 'https://i.ytimg.com/vi/8Jd-bwOBiXo/hqdefault.jpg', type: 'short' },
  { id: '_knXPHAiMuE', title: 'Short — Fast Hook', tag: 'short', duration: '00:19', poster: 'https://i.ytimg.com/vi/_knXPHAiMuE/hqdefault.jpg', type: 'short' },
  { id: 'oAGIIzr0A3g', title: 'Short — Story Beat', tag: 'short', duration: '00:17', poster: 'https://i.ytimg.com/vi/oAGIIzr0A3g/hqdefault.jpg', type: 'short' },
  // Instagram reels (uniform size in gallery; embedded in player)
  { id: 'DBcm1e3ofJ1', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
  { id: 'DAy6St-Pcrd', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
  { id: 'DAmQpUYvdgF', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
  { id: 'DAPSLp2t_QK', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
  { id: 'DAHZeriP64_', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
  { id: 'DAhYNaGt5jC', title: 'Instagram Reel', tag: 'reel', duration: '', type: 'instagram' },
];

const state = { filter: 'all' };

function renderGallery() {
  const grid = $('#gallery');
  grid.innerHTML = '';
  const list = videos.filter(v => state.filter === 'all' || v.tag === state.filter);
  list.forEach(v => {
    const card = document.createElement('div');
    card.className = 'thumb';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.dataset.id = v.id;
    card.dataset.type = v.type;
    const hasPoster = Boolean(v.poster);
    card.innerHTML = `
      ${hasPoster ? `<img loading="lazy" alt="${v.title}" src="${v.poster}">` : `
        <div class="placeholder" aria-hidden="true">
          <span class="badge">IG Reel</span>
        </div>
      `}
      <div class="play-badge" aria-hidden="true"></div>
      <div class="meta"><span>${v.title}</span><span>${v.duration || ''}</span></div>
    `;
    card.addEventListener('click', () => openPlayer(v));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openPlayer(v); });
    grid.appendChild(card);
  });
}

function openPlayer(video) {
  let player = $('.player');
  if (!player) {
    player = document.createElement('div');
    player.className = 'player';
    $('.bezel').appendChild(player);
  }
  let src;
  if (video.type === 'instagram') {
    // Instagram ignores autoplay in many cases, but we include it to attempt autoplay on click
    src = `https://www.instagram.com/reel/${video.id}/embed/?autoplay=1`;
  } else {
    src = `https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`;
  }

  player.innerHTML = `
    <iframe title="${video.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" src="${src}"></iframe>
    <div class="player-ui">
      <div class="cta">
        <a class="btn btn-outline" id="seeProject" href="#work">See project →</a>
        <a class="btn btn-ghost" href="#contact">Contact</a>
        <button class="btn" id="closePlayer" aria-label="Close video">Close</button>
      </div>
    </div>`;
  player.classList.add('active');
  const stopAndClose = () => {
    const iframe = player.querySelector('iframe');
    if (iframe) { iframe.src = 'about:blank'; }
    player.classList.remove('active');
  };
  $('#closePlayer').addEventListener('click', stopAndClose);
  $('#seeProject').addEventListener('click', (e) => { e.preventDefault(); stopAndClose(); document.querySelector('.device-screen').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
}

function setupFilters() {
  $$('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderGallery();
    });
  });
}

function setupContact() {
  const wa = $('#letsStart');
  const form = $('#contactForm');
  const nameInput = $('#cName');
  const companyInput = $('#cCompany');
  const projectInput = $('#cProject');
  const encode = (s) => encodeURIComponent(s);
  const phone = '5514996621675';
  const buildMessage = () => {
    const name = nameInput.value.trim() || 'Friend';
    const company = companyInput.value.trim() || '(company)';
    const project = projectInput.value.trim() || 'a video editing project';
    return `hello Matheus, my name is ${name}, i work on ${company} and i want ${project}`;
  };
  const updateLinkAndEnable = () => {
    const text = buildMessage();
    wa.href = `https://wa.me/${phone}?text=${encode(text)}`;
    const allFilled = nameInput.value.trim() && companyInput.value.trim() && projectInput.value.trim();
    wa.classList.toggle('disabled', !allFilled);
  };
  form.addEventListener('input', updateLinkAndEnable);
  updateLinkAndEnable();
  wa.addEventListener('click', (e) => {
    if (wa.classList.contains('disabled')) {
      e.preventDefault();
    }
  });
}

function setYear(){ $('#year').textContent = new Date().getFullYear(); }

function setupCaseLinks() {
  $$('.case-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.device-screen').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function animateNumbers() {
  $$('.price-value').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const increment = target / 100;
    const update = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  });
}

function animateStars() {
  $$('.stars').forEach(el => {
    el.innerHTML = '☆☆☆☆☆';
    let count = 0;
    const fill = () => {
      if (count < 5) {
        el.innerHTML = '★'.repeat(count + 1) + '☆'.repeat(4 - count);
        count++;
        setTimeout(fill, 300);
      }
    };
    fill();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilters();
  renderGallery();
  setupContact();
  setYear();
  setupTilt();
  setupReveal();
  setupCaseLinks();
  animateNumbers();
  animateStars();
});

// Interactive tilt for laptop following mouse
function setupTilt(){
  const stage = document.querySelector('.stage');
  const laptop = document.querySelector('.laptop');
  if(!stage || !laptop) return;
  const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
  let rect;
  const onMove = (e)=>{
    rect = rect || stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = clamp((x - .5) * 28, -28, 28);
    const rotX = clamp((.5 - y) * 18 + 14, -2, 26);
    laptop.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };
  const reset = ()=>{ laptop.style.transform = 'rotateX(14deg) rotateY(-18deg)'; rect = null; };
  stage.addEventListener('mousemove', onMove);
  stage.addEventListener('mouseleave', reset);
}

// Reveal-on-scroll animations
function setupReveal(){
  const els = $$('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(el=>el.classList.add('is-visible'));return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{ if(ent.isIntersecting){ ent.target.classList.add('is-visible'); io.unobserve(ent.target); } });
  },{threshold:.2});
  els.forEach(el=>io.observe(el));
}
