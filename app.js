// Util
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));

// Data: videos (provided links)
// Added Shorts from user
const videos = [
  { id: 'sUM0eTHUhOU', title: 'YouTube Short 1', tag: 'short', duration: '00:30', poster: 'https://i.ytimg.com/vi/sUM0eTHUhOU/hqdefault.jpg', type: 'short' },
  { id: 'I8tJsRSocLs', title: 'YouTube Short 2', tag: 'short', duration: '00:30', poster: 'https://i.ytimg.com/vi/I8tJsRSocLs/hqdefault.jpg', type: 'short' },
  { id: 'J2Sm6ysw24A', title: 'YouTube Short 3', tag: 'short', duration: '00:30', poster: 'https://i.ytimg.com/vi/J2Sm6ysw24A/hqdefault.jpg', type: 'short' },
  { id: 'oAGIIzr0A3g', title: 'Short — Story Beat', tag: 'short', duration: '00:17', poster: 'https://i.ytimg.com/vi/oAGIIzr0A3g/hqdefault.jpg', type: 'short' },
  { id: '8Jd-bwOBiXo', title: 'Short — Vertical Performance', tag: 'short', duration: '00:23', poster: 'https://i.ytimg.com/vi/8Jd-bwOBiXo/hqdefault.jpg', type: 'short' },
  { id: '32V0GzI7I2o', title: 'Dynamic Edit — Highlight', tag: 'case', duration: '02:02', poster: 'https://i.ytimg.com/vi/32V0GzI7I2o/hqdefault.jpg', type: 'youtube' },
  { id: '9zOpEKGi1fA', title: 'Ad Cut — Momentum', tag: 'ad', duration: '01:21', poster: 'https://i.ytimg.com/vi/9zOpEKGi1fA/hqdefault.jpg', type: 'youtube' },
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
    card.innerHTML = `
      <img loading="lazy" alt="${v.title}" src="${v.poster}">
      <div class="play-badge" aria-hidden="true"></div>
      <div class="meta"><span>${v.title}</span><span>${v.duration}</span></div>
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
  const src = `https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`;

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
  // Trigger power-on pulse on the in-device screen when opening a video
  const screen = document.querySelector('.device-screen');
  if (screen) {
    screen.classList.remove('power-on');
    // reflow to restart animation
    void screen.offsetWidth;
    screen.classList.add('power-on');
  }
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
  const planButtons = $$('.plan-select');
  let selectedPlanCode = '';
  const encode = (s) => encodeURIComponent(s);
  const phone = '5514996621675';
  const buildMessage = () => {
    const name = nameInput.value.trim() || 'Friend';
    const company = companyInput.value.trim() || '(company)';
    const project = projectInput.value.trim() || 'a video editing project';
    const base = `hello Matheus, my name is ${name}, i work on ${company} and i want ${project}`;
    let planText = '';
    if (selectedPlanCode) {
      const label = selectedPlanCode === '1' ? 'daily plan' : selectedPlanCode === '2' ? 'one month plan' : 'multi-month plan';
      planText = ` — Plan: ${label} (${selectedPlanCode})`;
    }
    return base + planText;
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
  // Plan selection buttons set hidden code but are optional
  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPlanCode = btn.dataset.plan || '';
      updateLinkAndEnable();
    });
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
    el.innerHTML = '<span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span>';
    const stars = $$('.star', el);
    let index = 0;
    const fillNext = () => {
      if (index < stars.length) {
        const s = stars[index];
        s.textContent = '★';
        s.classList.add('filled','jump');
        setTimeout(()=>{ s.classList.remove('jump'); }, 450);
        index++;
        setTimeout(fillNext, 420); // slower fill
      } else {
        // after all filled, stagger a quick sequential hop and then glow gold
        stars.forEach((s,i)=>{
          setTimeout(()=>{
            s.classList.add('jump');
            setTimeout(()=>{ s.classList.remove('jump'); s.classList.add('glow'); }, 450);
          }, i*80);
        });
      }
    };
    fillNext();
  });
}

// Trigger pricing and testimonial animations only when visible
function setupAnimationOnView(){
  const pricingSection = document.querySelector('#pricing');
  const testimonialsSection = document.querySelector('#testimonials');
  if(!('IntersectionObserver' in window)){
    animateNumbers();
    animateStars();
    return;
  }
  if(pricingSection){
    const priceObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateNumbers();
          priceObserver.disconnect();
        }
      });
    },{threshold:.25});
    priceObserver.observe(pricingSection);
  }
  if(testimonialsSection){
    const starObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateStars();
          starObserver.disconnect();
        }
      });
    },{threshold:.25});
    starObserver.observe(testimonialsSection);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Intro clapboard animation and initial laptop screen power-on
  const clap = document.getElementById('clapboard');
  if(clap){
    requestAnimationFrame(()=>{
      clap.classList.add('reveal');
      setTimeout(()=>{ clap.style.display = 'none'; }, 6000);
    });
  }
  setupFilters();
  renderGallery();
  setupContact();
  setYear();
  setupTilt();
  setupReveal();
  setupCaseLinks();
  setupAnimationOnView();
  // Initial pulse to simulate screen powering on at load
  const screen = document.querySelector('.device-screen');
  if(screen){
    screen.classList.add('power-on');
    setTimeout(()=>screen.classList.remove('power-on'), 2000);
  }
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
