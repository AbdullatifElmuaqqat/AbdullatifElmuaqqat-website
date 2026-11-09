// Map walk, quest logs, inventory, terminal, command menu, companion sprite, cheat code. No dependencies.
// Classic script so the page also works when opened straight from disk (file://), where modules are blocked.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const EMAIL = 'Elmuaqqat.info@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/abdullatif-elmuaqqat/';
const GITHUB = 'https://github.com/AbdullatifElmuaqqat';
const ext = (url) => open(url, '_blank', 'noopener');

// The eyes need http (file:// blocks modules and canvas pixel reads), so fall back to the plain photo.
import('./eyes.js').then((m) => m.mountEyes($('#portrait'), { photo: './js/avatar-photo.jpg' })).catch(() => {
  $('#portrait').innerHTML = '<img src="./js/avatar-photo.jpg" width="800" height="800" alt="">';
});

// Menu, pause, clock, year
const hud = $('.hud');
const menuBtn = $('.hud__menu');
const setMenu = (open) => { hud.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); };
menuBtn.addEventListener('click', () => setMenu(!hud.classList.contains('is-open')));
$$('.hud__nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

const motionBtn = $('[data-motion]');
motionBtn.addEventListener('click', () => {
  const on = root.classList.toggle('paused');
  motionBtn.setAttribute('aria-pressed', on);
  motionBtn.setAttribute('aria-label', on ? 'Play animations' : 'Pause animations');
});

const clock = $('[data-clock]');
const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
const tick = () => { clock.textContent = fmt.format(new Date()); };
tick(); setInterval(tick, 30000);
$('[data-year]').textContent = new Date().getFullYear();

// Toast
const toast = $('.toast');
let toastT;
const say = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 2400); };

// 8-bit sound effects, synthesized with Web Audio. Off until the visitor turns them on.
let soundOn = false;
try { soundOn = localStorage.getItem('sound') === 'on'; } catch {}
let actx;
// Phones create the audio engine paused and only start it from a tap; iPhones also need the
// "playback" session to play through the silent switch (iOS 17+).
const wakeAudio = () => {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}
  actx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state !== 'running') actx.resume();
};
const tone = (f, d = .08, type = 'square', v = .05, slide = 0, at = 0) => {
  if (!soundOn) return;
  wakeAudio();
  const t = actx.currentTime + at, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d);
};
const sfx = {
  blip: () => tone(660, .06),
  step: () => [0, .16, .32, .48].forEach((at, i) => tone(i % 2 ? 150 : 190, .05, 'square', .04, 0, at)),
  tick: () => tone(1100 + Math.random() * 400, .02, 'square', .02),
  buzz: () => tone(170, .25, 'sawtooth', .04, 90),
  coin: () => { tone(988, .08); tone(1319, .35, 'square', .05, 0, .08); },
};
const soundBtn = $('[data-sound]');
const paintSound = () => { soundBtn.setAttribute('aria-pressed', soundOn); soundBtn.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on'); };
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  try { localStorage.setItem('sound', soundOn ? 'on' : 'off'); } catch {}
  paintSound(); sfx.coin();
});
paintSound();
document.addEventListener('click', (e) => { if (e.target.closest('button:not([data-sound]), a')) sfx.blip(); });
// Any first touch wakes the engine too, so a remembered "sound on" works on the next visit.
addEventListener('pointerdown', () => { if (soundOn) wakeAudio(); }, { passive: true });

// Companion sprite: idle, typing, waving or thinking, with a speech bubble
const buddy = $('.buddy .sprite');
const bubble = $('.buddy__say');
let buddyT, bubbleT;
const act = (state, ms = 2200) => {
  buddy.dataset.sprite = state;
  clearTimeout(buddyT);
  if (state !== 'idle') buddyT = setTimeout(() => { buddy.dataset.sprite = 'idle'; }, ms);
};
const talk = (msg, state = 'wave') => {
  bubble.textContent = msg; bubble.classList.add('is-on'); act(state, 2800);
  clearTimeout(bubbleT); bubbleT = setTimeout(() => bubble.classList.remove('is-on'), 2800);
};
const lines = ['Kinder Bueno break?', 'Five a side after work?', 'Try Ctrl K.', 'The terminal knows things.', 'Hi! Thanks for stopping by.'];
let li = 0;
$('.buddy').addEventListener('click', () => talk(lines[li++ % lines.length]));
setTimeout(() => talk('Hi! Pick a building on the map.'), 1400);
// Step aside at the contact section so the terminal and links stay clear
// and on phones, sit out the hero too, where it would cover the portrait
const inView = new Set();
const narrow = matchMedia('(max-width: 640px)');
const buddyIo = new IntersectionObserver((ens) => {
  ens.forEach((en) => (en.isIntersecting ? inView.add(en.target.id) : inView.delete(en.target.id)));
  $('.buddy').classList.toggle('is-away', inView.has('save') || (narrow.matches && inView.has('top')));
});
buddyIo.observe($('#save')); buddyIo.observe($('#top'));

// Dialogs
const dlg = $('.dlg:not(.dlg--cv)');
const dlgBody = $('.dlg__body');
const openQuest = (id) => {
  dlgBody.replaceChildren(document.getElementById(id).content.cloneNode(true));
  $('h3', dlgBody).id = 'dlg-title';
  dlg.showModal(); dlg.scrollTop = 0;
};
document.addEventListener('click', (e) => { const b = e.target.closest('[data-quest]'); if (b) openQuest(b.dataset.quest); });
dlg.addEventListener('close', () => dlgBody.replaceChildren()); // also stops any playing video

const cv = $('.dlg--cv');
const openResume = () => { const f = $('iframe', cv); if (!f.src) f.src = f.dataset.src; cv.showModal(); };
$$('[data-resume]').forEach((b) => b.addEventListener('click', openResume));
$$('dialog').forEach((d) => {
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  $$('[data-close]', d).forEach((b) => b.addEventListener('click', () => d.close()));
});

const copyEmail = async () => {
  try { await navigator.clipboard.writeText(EMAIL); say('Email copied'); } catch { say(`Email: ${EMAIL}`); }
};
$$('[data-copy]').forEach((b) => b.addEventListener('click', copyEmail));

// World map: the walker sprite travels to the chosen stop
const ROUTE = ['appian', 'hughes', 'umd', 'workshop'];
const STAND = { appian: [35, 52], hughes: [66, 80], umd: [23, 80], workshop: [57, 34] }; // path tiles in front of each building, % of map
const pins = $$('.pin');
const walker = $('.sprite--walker');
let stop = 'appian';
const goTo = (id) => {
  stop = id;
  pins.forEach((p) => p.setAttribute('aria-pressed', p.dataset.stop === id));
  $$('[data-log]').forEach((l) => { l.hidden = l.dataset.log !== id; });
  $('.log__count').textContent = `${ROUTE.indexOf(id) + 1} / ${ROUTE.length}`;
  const [x, y] = STAND[id];
  walker.style.setProperty('--x', `${x}%`); walker.style.setProperty('--y', `${y}%`);
  walker.dataset.sprite = 'wave';
  sfx.step();
  setTimeout(() => { walker.dataset.sprite = 'idle'; }, reduced.matches ? 0 : 1600);
};
pins.forEach((p) => p.addEventListener('click', () => goTo(p.dataset.stop)));
$$('[data-step]').forEach((b) => b.addEventListener('click', () => {
  const i = (ROUTE.indexOf(stop) + +b.dataset.step + ROUTE.length) % ROUTE.length;
  goTo(ROUTE[i]);
}));

// Quest log: one tab per project, one open card at a time
const qtabs = $('.qlog__tabs');
const cards = $$('.quest');
const pickQuest = (i, focus) => {
  cards.forEach((c, j) => { c.hidden = j !== i; });
  $$('[role="tab"]', qtabs).forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; if (j === i && focus) t.focus(); });
};
cards.forEach((c, i) => {
  c.id = `quest-${i}`; c.setAttribute('role', 'tabpanel');
  const t = document.createElement('button');
  t.type = 'button'; t.className = 'qtab'; t.id = `qtab-${i}`;
  t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', c.id); c.setAttribute('aria-labelledby', t.id);
  const img = $('.quest__art img', c);
  t.innerHTML = `<img src="${img.getAttribute('src')}" alt="" width="60" height="60" loading="lazy"><span><b></b><small></small></span>`;
  $('b', t).textContent = $('h3', c).textContent;
  $('small', t).textContent = $$('.tags li', c).slice(0, 2).map((x) => x.textContent).join(' · ');
  t.addEventListener('click', () => pickQuest(i));
  t.addEventListener('keydown', (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); pickQuest((i + k + cards.length) % cards.length, true); }
  });
  qtabs.append(t);
});
qtabs.insertAdjacentHTML('beforeend', `<a class="qtab qtab--more" href="${GITHUB}" target="_blank" rel="noopener">+ More side quests on GitHub</a>`);
pickQuest(0);

// Rotating word in the hero tagline
const rot = $('.rot');
const words = rot.dataset.words.split('|');
let w = 0;
setInterval(() => {
  if (reduced.matches || root.classList.contains('paused') || document.hidden) return;
  w = (w + 1) % words.length;
  rot.classList.add('out');
  setTimeout(() => { rot.textContent = words[w]; rot.classList.remove('out'); }, 250);
}, 2600);

// Inventory: each item knows where it was used
const Q = (label, quest) => ({ label, quest });
const S = (label, stop) => ({ label, stop });
const neural = Q('Neural Modeling', 'q-neural'), pink = Q('PinkPath', 'q-pink'), etl = Q('ETL Health Check', 'q-etl'), checkin = Q('Student Life Check-In', 'q-checkin'), senti = Q('Sentiment & Engagement', 'q-sentiment');
const appian = S('Appian', 'appian'), hughes = S('Hughes', 'hughes'), umd = S('UMD teaching', 'umd');
const INV = {
  Languages: [['Py', 'Python', [neural, pink, etl, senti, appian, umd]], ['SQL', 'SQL', [etl, hughes]], ['JS', 'JavaScript', [checkin]], ['Jv', 'Java'], ['C', 'C / C++'], ['R', 'R'], ['Sh', 'Bash', [appian]], ['HT', 'HTML & CSS', [checkin]]],
  'Data & ML': [['Pd', 'Pandas', [pink, umd]], ['Np', 'NumPy', [neural]], ['JX', 'JAX', [neural]], ['LG', 'LightGBM', [pink]], ['SK', 'Scikit-learn', [senti]], ['NLP', 'NLP / TF-IDF', [senti]], ['St', 'Statistics', [senti]], ['Pl', 'Matplotlib & Plotly', [umd]]],
  Web: [['Re', 'React', [neural]], ['Fl', 'Flask', [neural, pink]], ['Fb', 'Firebase', [checkin]], ['API', 'REST & webhooks'], ['Mg', 'MongoDB']],
  'Cloud & Ops': [['GCP', 'Google Cloud', [etl, hughes]], ['BQ', 'BigQuery', [etl]], ['PS', 'Pub/Sub', [etl]], ['Dk', 'Docker', [hughes]], ['CI', 'CI/CD', [hughes]], ['Lx', 'Linux', [appian]], ['AWS', 'AWS'], ['Ft', 'FortiManager', [hughes]]],
  'AI tools': [['Cl', 'Claude & Claude Code'], ['GPT', 'ChatGPT'], ['Cp', 'GitHub Copilot'], ['LLM', 'LLM APIs'], ['Ag', 'AI agents & automation']],
  Workflow: [['Git', 'Git & GitHub'], ['Bb', 'Bitbucket'], ['Fg', 'Figma'], ['Ag', 'Agile / Scrum'], ['Db', 'Testing & debugging', [appian, umd]]],
};
const tabs = $('.inv__tabs');
const grid = $('.inv__grid');
const card = $('.inv__card');
const showItem = (btn, [, name, used]) => {
  $$('.slot', grid).forEach((s) => s.setAttribute('aria-pressed', s === btn));
  card.replaceChildren(Object.assign(document.createElement('p'), { className: 'inv__name', textContent: name }));
  if (!used) return card.append(Object.assign(document.createElement('p'), { className: 'inv__desc', textContent: 'In my toolkit. Ask me how I use it.' }));
  card.append(Object.assign(document.createElement('p'), { className: 'inv__desc', textContent: 'Used in' }));
  const ul = document.createElement('ul'); ul.className = 'inv__used';
  used.forEach((u) => {
    const li = document.createElement('li');
    const b = Object.assign(document.createElement('button'), { type: 'button', className: 'textlink', textContent: u.label });
    b.addEventListener('click', () => (u.quest ? openQuest(u.quest) : (goTo(u.stop), $('#map').scrollIntoView())));
    li.append(b); ul.append(li);
  });
  card.append(ul);
};
const showTab = (name) => {
  $$('[role="tab"]', tabs).forEach((t) => t.setAttribute('aria-selected', t.textContent === name));
  const items = INV[name];
  // shortcut: ghost slots finish the last row at the width seen when the tab opens, not on resize
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const empties = (cols - (items.length % cols)) % cols;
  grid.replaceChildren(...items.map((it) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot'; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<b aria-hidden="true">${it[0]}</b><span>${it[1]}</span>`;
    b.addEventListener('click', () => showItem(b, it));
    return b;
  }), ...Array.from({ length: empties }, () => Object.assign(document.createElement('span'), { className: 'slot slot--empty', ariaHidden: 'true' })));
  showItem(grid.firstChild, items[0]);
};
Object.keys(INV).forEach((name, i) => {
  const t = Object.assign(document.createElement('button'), { type: 'button', textContent: name });
  t.setAttribute('role', 'tab'); t.tabIndex = i ? -1 : 0;
  t.addEventListener('click', () => showTab(name));
  t.addEventListener('keydown', (e) => { // arrow keys move between tabs
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const all = $$('[role="tab"]', tabs);
    const next = all[(all.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
    all.forEach((x) => { x.tabIndex = x === next ? 0 : -1; });
    next.focus(); next.click();
  });
  tabs.append(t);
});
showTab('Languages');

// Command menu (Ctrl/Cmd+K)
const cmd = $('.cmd');
const cin = $('input', cmd);
const list = $('#cmd-list');
const quests = cards.map((q) => ({ title: $('h3', q).textContent, id: $('[data-quest]', q).dataset.quest, repo: $('[data-repo]', q)?.href, live: $('[data-live]', q)?.href }));
const commands = [
  ...$$('.hud__nav a').map((a) => ({ label: a.textContent, kind: 'Section', run: () => a.click() })),
  ...quests.flatMap((q) => [
    { label: q.title, kind: 'Project', run: () => openQuest(q.id) },
    q.repo && { label: `${q.title} on GitHub`, kind: 'Repo', run: () => ext(q.repo) },
    q.live && { label: `${q.title} live app`, kind: 'Live', run: () => ext(q.live) },
  ].filter(Boolean)),
  { label: 'Preview resume', kind: 'Resume', run: openResume },
  { label: 'Copy email address', kind: 'Contact', run: copyEmail },
  { label: 'LinkedIn', kind: 'Contact', run: () => ext(LINKEDIN) },
  { label: 'GitHub profile', kind: 'Contact', run: () => ext(GITHUB) },
];
let shown = [], active = 0;
const render = () => {
  const q = cin.value.trim().toLowerCase();
  shown = commands.filter((c) => `${c.label} ${c.kind}`.toLowerCase().includes(q));
  active = Math.min(active, Math.max(shown.length - 1, 0));
  list.replaceChildren(...shown.map((c, i) => {
    const li = document.createElement('li');
    li.id = `cmd-${i}`; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', i === active);
    li.textContent = c.label;
    li.append(Object.assign(document.createElement('small'), { textContent: c.kind }));
    li.addEventListener('click', () => runCmd(i));
    return li;
  }));
  if (!shown.length) { list.innerHTML = '<li role="option" aria-disabled="true">No matches. Try “resume” or “github”.</li>'; act('think'); }
  cin.setAttribute('aria-activedescendant', shown.length ? `cmd-${active}` : '');
  $(`#cmd-${active}`)?.scrollIntoView({ block: 'nearest' });
};
const runCmd = (i) => { const c = shown[i]; if (!c) return; cmd.close(); c.run(); };
const openCmd = () => {
  if (cmd.open) return cmd.close();
  $$('dialog[open]').forEach((d) => d.close());
  setMenu(false); cin.value = ''; active = 0; render(); cmd.showModal(); cin.focus();
};
cin.addEventListener('input', () => { active = 0; render(); });
cin.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % (shown.length || 1); render(); }
  else if (e.key === 'Enter') { e.preventDefault(); runCmd(active); }
});
$$('[data-cmd-open]').forEach((b) => b.addEventListener('click', openCmd));
if (/Mac|iPhone|iPad/.test(navigator.platform)) $$('kbd').forEach((k) => { k.textContent = k.textContent.replace('Ctrl', '⌘'); });

// Cheat code: up up down down left right left right b a
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kpos = 0;
const cheat = () => {
  talk('+99 Kinder Bueno unlocked!');
  sfx.coin();
  if (reduced.matches) return;
  for (let i = 0; i < 28; i++) {
    const c = Object.assign(document.createElement('i'), { className: 'coin' });
    c.style.left = `${Math.random() * 100}vw`;
    c.style.setProperty('--t', `${1.2 + Math.random() * 1.4}s`);
    c.style.animationDelay = `${Math.random() * .6}s`;
    c.addEventListener('animationend', () => c.remove());
    document.body.append(c);
  }
};
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); return; }
  if (e.key === 'Escape' && hud.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  if (e.target.matches('input')) return;
  kpos = e.key.toLowerCase() === KONAMI[kpos].toLowerCase() ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (kpos === KONAMI.length) { kpos = 0; cheat(); }
});

// Highlight the nav link for the section in view
const navLinks = $$('.hud__nav a');
const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  navLinks.forEach((a) => (a.getAttribute('href') === `#${en.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => spy.observe($(a.getAttribute('href'))));

// Terminal (kept from the last site, now it knows the map too)
const esc = (t) => t.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const term = $('[data-term]');
const out = $('.term__out', term);
const tin = $('#term-in');
tin.setAttribute('aria-label', 'Type a terminal command');
const hist = [];
let h = 0;
const line = (html, cls) => {
  const el = document.createElement('p');
  if (cls) el.className = cls;
  el.innerHTML = html; // only static strings or esc()-ed text reach here
  out.append(el); out.scrollTop = out.scrollHeight;
};
const a = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const termCmds = {
  help: () => 'Try: <b>whoami</b> <b>map</b> <b>go appian|hughes|umd</b> <b>quests</b> <b>open 1-5</b> <b>inventory</b> <b>resume</b> <b>contact</b> <b>email</b> <b>hire</b> <b>kinder</b> <b>football</b> <b>clear</b>',
  whoami: () => 'Abdullatif Elmuaqqat. Associate Solutions Engineer at Appian. B.S. Computer Science, University of Maryland.',
  map: () => ROUTE.slice(0, 3).map((id) => `${esc($(`[data-log="${id}"] h3`).textContent)} · ${esc($(`[data-log="${id}"] .log__org`).textContent.split('·')[0].trim())}`).join('<br>') + '<br>Type <b>go hughes</b> to walk there.',
  quests: () => quests.map((q, i) => `${i + 1}. ${esc(q.title)}`).join('<br>') + '<br>Type <b>open 1</b> to read one.',
  inventory: () => Object.entries(INV).map(([k, v]) => `<b>${esc(k)}</b>: ${esc(v.map((x) => x[1]).join(', '))}`).join('<br>'),
  resume: () => { openResume(); return 'Opening the resume…'; },
  contact: () => `${a(`mailto:${EMAIL}`, 'Email')} · ${a(LINKEDIN, 'LinkedIn')} · ${a(GITHUB, 'GitHub')}`,
  email: () => { copyEmail(); return `${EMAIL} (copied to your clipboard)`; },
  hire: () => { location.href = `mailto:${EMAIL}?subject=Let%E2%80%99s%20work%20together`; talk('Yes! Let’s talk.'); return 'Great choice. Opening your email app…'; },
  sudo: () => 'Permission denied. Try <b>hire</b> instead.',
  kinder: () => { ext('https://www.google.com/search?q=kinder+bueno&udm=2'); return 'Excellent taste.'; },
  football: () => 'Football after work? I’m in. Tough bug before work? Also in.',
  clear: () => { out.replaceChildren(); return ''; },
};
termCmds.projects = termCmds.quests; termCmds.skills = termCmds.inventory; termCmds.experience = termCmds.map;
$('.term__line', term).addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = tin.value.trim();
  tin.value = '';
  if (!raw) return;
  hist.push(raw); h = hist.length;
  line(`$ ${esc(raw)}`, 'term__cmd');
  const [name, arg] = raw.toLowerCase().split(/\s+/);
  if (name === 'open') {
    const q = quests[+arg - 1];
    if (!q) return line('Usage: <b>open 1</b> to <b>open 5</b>');
    line(`Opening ${esc(q.title)}…`);
    return openQuest(q.id);
  }
  if (name === 'go') {
    if (!STAND[arg]) return line('Usage: <b>go appian</b>, <b>go hughes</b>, <b>go umd</b> or <b>go workshop</b>');
    goTo(arg); $('#map').scrollIntoView();
    return line(`Walking to ${esc(arg)}…`);
  }
  const run = termCmds[name];
  if (!run) { act('think'); sfx.buzz(); }
  const res = run ? run() : `command not found: ${esc(name)}. Type <b>help</b>.`;
  if (res) line(res);
});
tin.addEventListener('input', () => { act('type', 900); sfx.tick(); });
tin.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  e.preventDefault();
  h = Math.max(0, Math.min(hist.length, h + (e.key === 'ArrowUp' ? -1 : 1)));
  tin.value = hist[h] || '';
});
term.addEventListener('click', (e) => { if (!e.target.closest('a')) tin.focus(); });
