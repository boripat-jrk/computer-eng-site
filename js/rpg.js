/* เกม RPG มุมมองด้านบน: เดินสำรวจ คุยกับ NPC รับเควส ทดลอง ค้นหา เก็บความรู้ลงสมุด (canvas 2D เบา) */
(function () {
  const TS = 32, VH = 380; let VW = 680;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
  let AC; const beep = (f, d = .08, t = 'triangle', v = .04, f2) => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = t; o.frequency.setValueAtTime(f, AC.currentTime); if (f2) o.frequency.exponentialRampToValueAtTime(f2, AC.currentTime + d); g.gain.setValueAtTime(v, AC.currentTime); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) { } };
  const TILE = {
    '#': { c: '#5b6478', top: '#7a8399', solid: 1, h: 26 }, '.': { c: '#eef1f6', grid: '#e1e6ef' }, ',': { c: '#7cc66b', grid: '#71ba61' }, '=': { c: '#d8d2c4', grid: '#cbc4b4' },
    'D': { c: '#c9a97a', grid: '#b8986a' }, 'T': { c: '#c58b52', top: '#dca46a', solid: 1, h: 14, obj: 1 }, 'C': { c: '#c58b52', top: '#dca46a', solid: 1, h: 14, obj: 1, pc: 1 },
    'S': { c: '#8a5a33', top: '#a56e42', solid: 1, h: 30, obj: 1, books: 1 }, 'X': { c: '#b7875a', top: '#d3a576', solid: 1, h: 18, obj: 1, box: 1 }, 'B': { c: '#3b82f6', top: '#60a5fa', solid: 1, h: 14, obj: 1 },
    'P': { c: '#2f855a', top: '#48bb78', solid: 1, h: 22, obj: 1, plant: 1 }, 'K': { c: '#334155', top: '#475569', solid: 1, h: 10, obj: 1 }, 'F': { c: '#e2e8f0', grid: '#cbd5e1' }
  };
  const look = (sh, hair, skin) => ({ sh: sh || '#3b5bfd', hair: hair || '#2b2118', skin: skin || '#f1c9a0' });

  window.RPG = (host, L) => {
    host.innerHTML = `<div class="rpg"><canvas tabindex="0"></canvas>
      <div class="rp-hud"><button class="rp-jb" data-a="journal">📒 สมุดความรู้ <b>0</b></button><span class="rp-inv"></span><span class="rp-tm"></span></div>
      <div class="rp-keys2"><div class="rk-h"><b>🎮 วิธีเล่น</b><button class="rk-min" title="ย่อ">–</button><button class="rk-x" title="ปิด">✕</button></div><div class="rk-b"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> เดิน</span><span><kbd>E</kbd> ทักทาย / สำรวจ</span><span>🖱️ คลิกที่ตัวละครหรือสิ่งของ</span><span><kbd>J</kbd> สมุดความรู้</span></div></div><button class="rk-open hide" title="วิธีเล่น">🎮</button>
      <div class="rp-q"></div><button class="rp-fs" title="เต็มจอ">⛶</button>
      <div class="rp-tc"><div class="rp-pad"><button data-k="U">▲</button><button data-k="L">◀</button><button data-k="R">▶</button><button data-k="D">▼</button></div><button class="rp-a" data-k="A">คุย<br>สำรวจ</button></div>
      <div class="rp-dlg hide"><div class="rp-pt"></div><div class="rp-tx"><b></b><p></p><div class="rp-ch"></div></div></div>
      <div class="rp-ov" data-o="start"><div class="rp-pn"></div></div><div class="rp-ov hide" data-o="panel"><div class="rp-pn"></div></div></div>`;
    const R = host.querySelector('.rpg'), cv = R.querySelector('canvas'), cx = cv.getContext('2d');
    if (matchMedia('(pointer:coarse)').matches) R.classList.add('touch');
    const TT = Object.assign({}, TILE, L.tiles || {});
    const map = L.map(), MW = map[0].length, MH = map.length;
    let mode = L.mode || 2, keys = {}, busy = false, run = false, cam = { x: 0, y: 0 }, last = 0, t = 0, raf;
    const P = { x: 0, y: 0, d: 'D', w: 0, lk: look(L.shirt || '#3b5bfd', '#2b2118') };
    const S = { clues: [], inv: [], quests: {}, flags: {}, wrong: 0, t: 0, target: null };
    const ents = L.ents.map(e => Object.assign({ px: e.x * TS + TS / 2, py: e.y * TS + TS / 2 }, e));
    /* ---------- API สำหรับสคริปต์ ---------- */
    const G = { S, mode: () => mode, esc, nick: L.nick || '' }; G.refresh = () => drawQ();
    const dlg = R.querySelector('.rp-dlg');
    const typeTo = (p, text) => new Promise(res => { let i = 0; p.innerHTML = ''; const full = text; const tick = () => { i += 2; p.innerHTML = full.slice(0, i); if (i < full.length && !p._skip) p._tm = setTimeout(tick, 14); else { p.innerHTML = full; res(); } }; p._skip = false; dlg.onclick = e => { if (!e.target.closest('button')) p._skip = true; }; tick(); });
    G.say = async (who, text, opt = {}) => {
      const n = ents.find(e => e.name === who) || {}; dlg.classList.remove('hide');
      dlg.querySelector('.rp-pt').innerHTML = who === 'me' ? '🙂' : (n.em || opt.em || '💬');
      dlg.querySelector('b').textContent = who === 'me' ? (L.nick || 'ฉัน') : who;
      const p = dlg.querySelector('p'), ch = dlg.querySelector('.rp-ch'); ch.innerHTML = '';
      beep(660, .04, 'square', .02);
      await typeTo(p, text);
      return new Promise(res => { ch.innerHTML = `<button class="rp-nx">ต่อ ▶</button>`; const b = ch.querySelector('button'); const go = () => { document.removeEventListener('keydown', kd2); ch.innerHTML = ''; res(); }; const kd2 = e => { if (['Enter', 'KeyE'].includes(e.code)) { e.preventDefault(); go(); } }; setTimeout(() => document.addEventListener('keydown', kd2), 120); b.onclick = go; });
    };
    G.choose = (q, opts) => new Promise(res => {
      dlg.classList.remove('hide'); const p = dlg.querySelector('p'), ch = dlg.querySelector('.rp-ch');
      if (q) p.innerHTML = q;
      ch.innerHTML = opts.map((o, i) => `<button data-i="${i}">${o}</button>`).join('');
      ch.querySelectorAll('button').forEach(b => b.onclick = () => { ch.innerHTML = ''; res(+b.dataset.i); });
    });
    /* คำถามแบบมีคำตอบถูก: วนจนตอบถูก นับจำนวนครั้งที่พลาด */
    G.quiz = async (who, q, opts) => {
      const ord = shuffle(opts.map((_, i) => i));
      for (; ;) {
        const k = await G.choose(q, ord.map(i => opts[i][0])), o = opts[ord[k]];
        if (o[1]) { beep(784, .1); await G.say(who, '✅ ' + o[2]); return; }
        S.wrong++; beep(220, .15, 'sawtooth', .03); await G.say(who, '🤔 ' + o[2] + (mode === 1 && o[3] ? '<br><small>💡 ' + o[3] + '</small>' : ''));
      }
    };
    G.end = () => { dlg.classList.add('hide'); };
    G.panel = (html, setup) => new Promise(res => {
      dlg.classList.add('hide'); const o = R.querySelector('[data-o="panel"]'), pn = o.querySelector('.rp-pn'); pn.innerHTML = html + '<button class="rp-x" aria-label="ปิด">✕</button>'; o.classList.remove('hide');
      const close = v => { o.classList.add('hide'); res(v); };
      pn.querySelector('.rp-x').onclick = () => close(false);
      setup(pn, close);
    });
    G.clue = (id, title, text, em) => {
      if (S.clues.find(c => c.id === id)) return;
      S.clues.push({ id, title, text, em: em || '💡' }); R.querySelector('.rp-jb b').textContent = S.clues.length;
      [523, 659, 988].forEach((f, i) => setTimeout(() => beep(f, .1), i * 80)); toast(`📒 ได้ความรู้ใหม่: ${title}`);
    };
    G.has = id => !!S.clues.find(c => c.id === id);
    G.give = (id, em, name) => { if (!S.inv.find(i => i.id === id)) S.inv.push({ id, em, name }); drawInv(); toast(`🎒 ได้รับ ${em} ${name}`); };
    G.take = id => { S.inv = S.inv.filter(i => i.id !== id); drawInv(); };
    G.got = id => !!S.inv.find(i => i.id === id);
    G.flag = (k, v) => v === undefined ? S.flags[k] : (S.flags[k] = v);
    G.quest = (id, title, step, target) => { S.quests[id] = S.quests[id] || { title, done: false }; if (step) S.quests[id].step = step; S.quests[id].target = target || null; drawQ(); };
    G.done = id => { if (!S.quests[id]) return; S.quests[id].done = true; S.joy = t + 3; ents.forEach(e => { if (e.qid === id) e.joy = t + 3; }); S.quests[id].target = null; drawQ(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .12), i * 90)); toast(`✅ เควสสำเร็จ: ${S.quests[id].title}`); };
    G.isDone = id => !!(S.quests[id] && S.quests[id].done);
    G.win = () => winScreen();
    const drawInv = () => R.querySelector('.rp-inv').innerHTML = S.inv.map(i => `<span title="${esc(i.name)}">${i.em}</span>`).join('');
    const drawQ = () => {
      const act = Object.entries(S.quests).filter(([k, q]) => !q.done);
      R.querySelector('.rp-q').innerHTML = `<b>🗺️ เควส</b>${act.length ? act.map(([k, q]) => `<div>• ${esc(q.title)}${q.step ? `<small>${q.step}</small>` : ''}</div>`).join('') : '<div><small>คุยกับ NPC ที่มีเครื่องหมาย ❗</small></div>'}`;
      const a = act.find(([k, q]) => q.target); S.target = a ? a[1].target : null;
    };
    let toasts = [];
    const toast = s => { toasts.push({ s, life: 2.6 }); if (toasts.length > 3) toasts.shift(); };
    /* ---------- สมุดความรู้ ---------- */
    const journal = () => {
      if (busy && !run) return;
      const was = run; run = false;
      G.panel(`<h3>📒 สมุดความรู้${L.nick ? 'ของ' + esc(L.nick) : ''}</h3><p style="color:var(--muted);margin-top:0;font-size:14px">ความรู้ที่ค้นพบจากการสำรวจ ทดลอง และพูดคุย (${S.clues.length}/${L.totalClues || '?'})</p>
        ${S.clues.length ? S.clues.map(c => `<div class="rp-clue"><span>${c.em}</span><div><b>${c.title}</b><p>${c.text}</p></div></div>`).join('') : '<p>ยังว่างอยู่ ลองคุยกับเพื่อนหรือสำรวจชั้นหนังสือดูสิ</p>'}`, () => { }).then(() => { run = was; last = performance.now(); });
    };
    R.querySelector('[data-a="journal"]').onclick = journal;
    /* ---------- ควบคุม ---------- */
    const KM = { ArrowUp: 'U', KeyW: 'U', ArrowDown: 'D', KeyS: 'D', ArrowLeft: 'L', KeyA: 'L', ArrowRight: 'R', KeyD: 'R' };
    const kd = e => { if (!R.isConnected) return; const k = KM[e.code]; if (run && k) { keys[k] = 1; e.preventDefault(); } if (run && ['KeyE', 'Enter'].includes(e.code)) { e.preventDefault(); act(); } if (run && e.code === 'KeyJ') journal(); };
    const ku = e => { const k = KM[e.code]; if (k) keys[k] = 0; };
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    R.querySelectorAll('.rp-tc [data-k]').forEach(b => { const k = b.dataset.k; b.addEventListener('pointerdown', e => { e.preventDefault(); if (k === 'A') { if (run) act(); } else keys[k] = 1; }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => { if (k !== 'A') keys[k] = 0; })); });
    cv.addEventListener('click', ev => {
      if (!run || busy) return; const r = cv.getBoundingClientRect(), mx = (ev.clientX - r.left) / r.width * VW + cam.x, my = (ev.clientY - r.top) / r.height * VH + cam.y;
      let hitE = null, bd = 30; ents.forEach(e => { if (e.hide || !e.on) return; const d = Math.hypot(e.px - mx, e.py - (e.name ? 18 : 6) - my); if (d < bd) { bd = d; hitE = e; } });
      if (!hitE) return; if (Math.hypot(hitE.px - P.x, hitE.py - P.y) > 96) { toast('เดินเข้าไปใกล้ ๆ ก่อนนะ'); return; } act(hitE);
    });
    const KB = R.querySelector('.rp-keys2'), KO = R.querySelector('.rk-open');
    R.querySelector('.rk-min').onclick = () => KB.classList.toggle('min');
    R.querySelector('.rk-x').onclick = () => { KB.classList.add('hide'); KO.classList.remove('hide'); };
    KO.onclick = () => { KB.classList.remove('hide', 'min'); KO.classList.add('hide'); };
    const tmEl = R.querySelector('.rp-tm'); let warned = 0;
    const tick = () => { if (!L.minutes || !S.started) return; const m = S.t / 60, lim = L.minutes; tmEl.textContent = `⏱ ${Math.floor(S.t / 60)}:${String(Math.floor(S.t % 60)).padStart(2, '0')} / ${lim} นาที`; tmEl.classList.toggle('over', m > lim); if (!warned && m > lim * .8) { warned = 1; toast(`⏰ ใกล้ครบเวลาแนะนำ ${lim} นาทีแล้ว`); } if (warned === 1 && m > lim) { warned = 2; toast('⏰ ครบเวลาแนะนำแล้ว ทำเควสที่เหลือให้จบ แล้วไปขั้นต่อไป'); } };
    R.querySelector('.rp-fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : R.requestFullscreen && R.requestFullscreen().catch(() => { });
    const solidAt = (x, y) => { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return true; const tl = TT[map[ty][tx]]; return tl && tl.solid; };
    const entAt = (x, y) => ents.some(e => !e.hide && !e.walk && Math.abs(e.px - x) < 14 && Math.abs(e.py - y) < 12);
    const free = (x, y) => !solidAt(x - 9, y - 6) && !solidAt(x + 9, y - 6) && !solidAt(x - 9, y + 6) && !solidAt(x + 9, y + 6) && !entAt(x, y);
    const near = () => { let best = null, bd = 46; ents.forEach(e => { if (e.hide) return; const d = Math.hypot(e.px - P.x, e.py - P.y); if (d < bd) { bd = d; best = e; } }); return best; };
    const act = async (pick) => {
      if (busy) return; const e = pick || near(); if (!e || !e.on) return;
      busy = true; run = false; keys = {};
      if (e.name) { const dx = P.x - e.px, dy = P.y - e.py; e.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U'); }
      try { await e.on(G, e); } catch (err) { console.error(err); }
      G.end(); busy = false; if (!S.won) { run = true; last = performance.now(); }
    };
    /* ---------- เริ่มเกม ---------- */
    const start = () => {
      const pn = R.querySelector('[data-o="start"] .rp-pn');
      const M = [['Easy', '⭐', 'มีลูกศรนำทางและคำใบ้'], ['Normal', '⭐⭐', 'สำรวจเอง มีเควสเพิ่ม 1 เควส'], ['Hard', '⭐⭐⭐', 'ไม่มีลูกศร มีเควสเสริม']];
      pn.innerHTML = `<div class="rp-title">${L.icon || '🗺️'} ${esc(L.title)}</div><p>${L.story}</p>
        <div class="rp-modes">${M.map((m, i) => `<button data-m="${i + 1}" class="${mode === i + 1 ? 'on' : ''}">${m[0]} <span>${m[1]}</span><small>${m[2]}</small></button>`).join('')}</div>
        <div class="rp-keys">⌨️ <b>W A S D</b> หรือลูกศร = เดิน • <b>E</b> = ทักทาย/สำรวจ • <b>J</b> = สมุดความรู้<br>📱 แท็บเล็ต: ปุ่มทิศทางซ้าย • ปุ่มคุย/สำรวจขวา</div>
        <button class="btn gold lg" style="width:100%;justify-content:center" data-go>▶ เริ่มผจญภัย</button>`;
      pn.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = +b.dataset.m; pn.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); });
      pn.querySelector('[data-go]').onclick = async () => {
        R.querySelector('[data-o="start"]').classList.add('hide'); P.x = L.spawn[0] * TS + TS / 2; P.y = L.spawn[1] * TS + TS / 2; P.d = 'U';
        S.t = 0; S.started = 1; run = false; busy = true; drawQ(); cv.focus();
        if (L.intro) { try { await L.intro(G); } catch (e) { console.error(e); } G.end(); }
        busy = false; run = true; last = performance.now();
      };
    };
    const winScreen = () => {
      S.won = true; run = false;
      const st = L.stars ? L.stars(G) : 1;
      const pn = R.querySelector('[data-o="start"] .rp-pn'); R.querySelector('[data-o="start"]').classList.remove('hide');
      pn.innerHTML = `<div class="rp-stars">${'⭐'.repeat(st)}${'☆'.repeat(3 - st)}</div><div class="rp-title" style="text-align:center">${L.winTitle || 'ภารกิจสำเร็จ!'}</div>
        <p style="text-align:center;color:var(--muted);font-size:14px">โหมด ${['Easy ⭐', 'Normal ⭐⭐', 'Hard ⭐⭐⭐'][mode - 1]} • ความรู้ในสมุด ${S.clues.length}/${L.totalClues || S.clues.length} • ตอบพลาด ${S.wrong} ครั้ง • เวลา ${Math.floor(S.t / 60)}:${String(Math.floor(S.t % 60)).padStart(2, '0')} นาที</p>
        ${L.winHTML ? L.winHTML(G) : ''}<div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button class="btn ghost" data-j>📒 เปิดสมุดความรู้</button><button class="btn" data-re>↻ เล่นใหม่</button></div>`;
      pn.querySelector('[data-j]').onclick = journal; pn.querySelector('[data-re]').onclick = () => location.reload();
      L.onWin && L.onWin({ stars: st, mode, clues: S.clues.length, wrong: S.wrong, t: S.t });
    };
    /* ---------- วาด ---------- */
    const rr = (x, y, w, h, r, c) => { cx.fillStyle = c; cx.beginPath(); cx.roundRect(x, y, w, h, r); cx.fill(); };
    const face = (x, y, mood) => {
      const E = (dx, h) => { cx.fillStyle = '#1f2937'; cx.fillRect(x + dx, y - 22, 3, h); cx.fillStyle = '#fff'; cx.fillRect(x + dx + 1, y - 22, 1.2, 1.4); };
      cx.strokeStyle = '#7c2d12'; cx.lineWidth = 1.5; cx.lineCap = 'round';
      if (mood === 'happy') { cx.strokeStyle = '#1f2937'; cx.beginPath(); cx.arc(x - 3.5, y - 20, 2.2, Math.PI + .3, -.3); cx.arc(x + 3.5, y - 20, 2.2, Math.PI + .3, -.3); cx.stroke(); cx.fillStyle = '#7c2d12'; cx.beginPath(); cx.arc(x, y - 17.5, 3.6, 0, Math.PI); cx.closePath(); cx.fill(); cx.fillStyle = 'rgba(255,110,130,.6)'; }
      else if (mood === 'worry') { E(-5, 4); E(2, 4); cx.strokeStyle = '#1f2937'; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x - 6, y - 24.5); cx.lineTo(x - 2, y - 25.5); cx.moveTo(x + 6, y - 24.5); cx.lineTo(x + 2, y - 25.5); cx.stroke(); cx.strokeStyle = '#7c2d12'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(x - 3, y - 15.5); cx.quadraticCurveTo(x, y - 17.5, x + 3, y - 15.5); cx.stroke(); cx.fillStyle = '#7dd3fc'; cx.beginPath(); cx.moveTo(x + 9, y - 30); cx.quadraticCurveTo(x + 12, y - 25, x + 9, y - 23.5); cx.quadraticCurveTo(x + 6, y - 25, x + 9, y - 30); cx.fill(); cx.fillStyle = 'rgba(255,110,130,.25)'; }
      else { E(-5, 4); E(2, 4); cx.beginPath(); cx.arc(x, y - 17.5, 3, .3, Math.PI - .3); cx.stroke(); cx.fillStyle = 'rgba(255,110,130,.45)'; }
      cx.beginPath(); cx.ellipse(x - 6, y - 16.5, 2.4, 1.5, 0, 0, 7); cx.ellipse(x + 6, y - 16.5, 2.4, 1.5, 0, 0, 7); cx.fill();
    };
    const person = (x, y, lk, d, walk, name, mark, mood) => {
      const sw = Math.sin(walk) * 3;
      cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(x, y + 12, 11, 4, 0, 0, 7); cx.fill();
      rr(x - 7, y + 2 + (d === 'L' || d === 'R' ? 0 : sw * .3), 6, 11 + sw * .4, 2, '#334155'); rr(x + 1, y + 2 - (d === 'L' || d === 'R' ? 0 : sw * .3), 6, 11 - sw * .4, 2, '#334155');
      rr(x - 10, y - 12, 20, 16, 4, lk.sh);
      rr(x - 13, y - 11 + sw * .5, 4, 12, 2, lk.sh); rr(x + 9, y - 11 - sw * .5, 4, 12, 2, lk.sh);
      rr(x - 9, y - 30, 18, 18, 5, lk.skin);
      rr(x - 10, y - 32, 20, d === 'U' ? 16 : 7, 4, lk.hair);
      if (d !== 'U') face(x + (d === 'L' ? -3 : d === 'R' ? 3 : 0), y, mood);
      if (name) { cx.font = '600 12px Mali, Kanit, sans-serif'; const w = cx.measureText(name).width + 12; rr(x - w / 2, y - 51, w, 17, 8, 'rgba(15,23,42,.6)'); cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText(name, x, y - 38); }
      if (mark) { const b = Math.sin(t * 5) * 3; rr(x - 9, y - 74 + b, 18, 20, 6, mark === '!' ? '#f59e0b' : mark === '?' ? '#3b82f6' : '#10b981'); cx.fillStyle = '#fff'; cx.font = '700 14px Mali, Kanit, sans-serif'; cx.textAlign = 'center'; cx.fillText(mark === 'ok' ? '✓' : mark, x, y - 59 + b); }
    };
    const obj = (e, x, y) => {
      const b = Math.sin(t * 3 + x) * 2, glow = !e.mark || e.mark(G);
      if (glow) { cx.fillStyle = 'rgba(255,214,90,.35)'; cx.beginPath(); cx.arc(x, y - 6 + b, 17 + Math.sin(t * 4) * 2, 0, 7); cx.fill(); }
      if (e.ico && window.ICO) { const im = ICO.img(e.ico); if (im.complete) cx.drawImage(im, x - 15, y - 22 + b, 30, 30); } else { rr(x - 13, y - 19 + b, 26, 26, 8, '#fff'); cx.font = '18px sans-serif'; cx.textAlign = 'center'; cx.fillText(e.em || '❔', x, y + 1 + b); }
    };
    const draw = () => {
      cx.fillStyle = '#5f9e57'; cx.fillRect(0, 0, VW, VH);
      const x0 = Math.max(0, Math.floor(cam.x / TS)), y0 = Math.max(0, Math.floor(cam.y / TS)), x1 = Math.min(MW, x0 + VW / TS + 2), y1 = Math.min(MH, y0 + VH / TS + 2);
      // พื้น
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const ch = map[y][x], tl = TT[ch] || TT['.']; const sx = x * TS - cam.x, sy = y * TS - cam.y; const base = tl.obj ? TT[L.floorUnder ? L.floorUnder(x, y) : '.'] : tl; cx.fillStyle = (base || tl).c; cx.fillRect(sx, sy, TS, TS); if ((base || tl).grid) { cx.fillStyle = (base || tl).grid; cx.fillRect(sx, sy, TS, 1); cx.fillRect(sx, sy, 1, TS); } }
      // วัตถุ/ผนัง (เรียงตามแถวเพื่อให้ซ้อนสวย) + คน
      const people = ents.filter(e => !e.hide).map(e => ({ y: e.py, f: () => e.draw ? e.draw(cx, e.px - cam.x, e.py - cam.y, t, G) : !e.name ? obj(e, e.px - cam.x, e.py - cam.y) : person(e.px - cam.x, e.py - cam.y - (e.joy > t ? Math.abs(Math.sin(t * 10)) * 5 : 0), e.lk || look(), e.face || 'D', 0, e.name, e.mark ? e.mark(G) : null, e.mood ? e.mood(G) : e.qid ? (G.isDone(e.qid) ? 'happy' : e.calm ? 'calm' : 'worry') : 'calm') }));
      people.push({ y: P.y, f: () => person(P.x - cam.x, P.y - cam.y, P.lk, P.d, P.w, null, null, S.joy > t ? 'happy' : 'calm') });
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const tl = TT[map[y][x]]; if (!tl || !tl.solid) continue; const sx = x * TS - cam.x, sy = y * TS - cam.y, h = tl.h;
          cx.fillStyle = tl.top; cx.fillRect(sx, sy - h * .6, TS, TS); cx.fillStyle = tl.c; cx.fillRect(sx, sy + TS - h * .6, TS, h * .6);
          if (tl.pc) { rr(sx + 7, sy - 18, 18, 13, 2, '#111827'); cx.fillStyle = L.pcGlow && L.pcGlow(x, y, G) ? '#60a5fa' : '#1f2937'; cx.fillRect(sx + 9, sy - 16, 14, 9); cx.fillStyle = '#374151'; cx.fillRect(sx + 14, sy - 5, 4, 4); }
          if (tl.books) { ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#a855f7'].forEach((c, i) => { cx.fillStyle = c; cx.fillRect(sx + 3 + i * 5.5, sy - 16, 4, 12); cx.fillRect(sx + 3 + ((i + 2) % 5) * 5.5, sy - 2, 4, 10); }); }
          if (tl.box) { cx.strokeStyle = 'rgba(0,0,0,.18)'; cx.strokeRect(sx + 4, sy - 12, TS - 8, TS - 4); cx.fillStyle = 'rgba(0,0,0,.12)'; cx.fillRect(sx + 14, sy - 12, 4, TS - 4); }
          if (tl.plant) { cx.fillStyle = '#38a169'; cx.beginPath(); cx.arc(sx + 16, sy - 6, 14, 0, 7); cx.fill(); cx.fillStyle = '#68d391'; cx.beginPath(); cx.arc(sx + 11, sy - 11, 6, 0, 7); cx.fill(); }
          if (map[y][x] === '#') { cx.fillStyle = 'rgba(255,255,255,.08)'; cx.fillRect(sx, sy - h * .6, TS, 3); }
        }
        people.filter(p => p.y >= y * TS && p.y < (y + 1) * TS).forEach(p => p.f());
      }
      // ป้ายห้อง
      (L.signs || []).forEach(s => { const sx = s.x * TS - cam.x, sy = s.y * TS - cam.y; if (sx < -200 || sx > VW + 100 || sy < -60 || sy > VH + 40) return; cx.font = '600 14px Mali, Kanit, sans-serif'; const w = cx.measureText(s.t).width + 20; rr(sx - w / 2, sy - 14, w, 24, 8, s.c || '#0f172a'); cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText(s.t, sx, sy + 3); });
      // ลูกศรนำทาง (Easy)
      if (mode === 1 && run && S.target) { const e = ents.find(x => x.id === S.target); if (e) { const dx = e.px - P.x, dy = e.py - P.y, d = Math.hypot(dx, dy); if (d > 70) { const a = Math.atan2(dy, dx), ax = P.x - cam.x + Math.cos(a) * 42, ay = P.y - cam.y - 10 + Math.sin(a) * 42; cx.save(); cx.translate(ax, ay); cx.rotate(a); cx.fillStyle = 'rgba(245,158,11,.95)'; cx.beginPath(); cx.moveTo(12, 0); cx.lineTo(-6, -8); cx.lineTo(-2, 0); cx.lineTo(-6, 8); cx.closePath(); cx.fill(); cx.restore(); } else { const sx = e.px - cam.x, sy = e.py - cam.y; cx.strokeStyle = 'rgba(245,158,11,.9)'; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(sx, sy + 12, 18 + Math.sin(t * 6) * 2, 7, 0, 0, 7); cx.stroke(); } } }
      // ปุ่มคุย
      if (run) { const e = near(); if (e && e.on) { const sx = e.px - cam.x, sy = e.py - cam.y - (e.name ? 58 : 30); cx.font = '600 14px Mali, Kanit, sans-serif'; const s = `${e.name ? '💬 ทักทาย' + ' ' + e.name : '🔍 ' + (e.verb || 'สำรวจ') + (e.label ? ' ' + e.label : '')}`, w = cx.measureText(s).width + 46; rr(sx - w / 2, sy - 15, w, 28, 14, '#ffffff'); rr(sx - w / 2 + 6, sy - 11, 22, 20, 6, '#f5b700'); cx.fillStyle = '#3a2800'; cx.font = '700 13px Mali, Kanit, sans-serif'; cx.textAlign = 'center'; cx.fillText('E', sx - w / 2 + 17, sy + 4); cx.fillStyle = '#0f172a'; cx.font = '600 14px Mali, Kanit, sans-serif'; cx.fillText(s, sx + 12, sy + 4); } }
      // toast
      toasts.forEach(m => m.life -= 1 / 60); toasts = toasts.filter(m => m.life > 0);
      toasts.forEach((m, i) => { cx.globalAlpha = Math.min(1, m.life); cx.font = '500 15px "IBM Plex Sans Thai", Mali, Kanit, sans-serif'; const w = cx.measureText(m.s).width + 26; rr(VW / 2 - w / 2, 60 + i * 34, w, 28, 14, 'rgba(15,23,42,.82)'); cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText(m.s, VW / 2, 79 + i * 34); cx.globalAlpha = 1; });
    };
    const step = dt => {
      const vx = (keys.R ? 1 : 0) - (keys.L ? 1 : 0), vy = (keys.D ? 1 : 0) - (keys.U ? 1 : 0);
      if (vx || vy) {
        const sp = 150 * dt / (vx && vy ? 1.414 : 1);
        if (vx && free(P.x + vx * sp, P.y)) P.x += vx * sp; if (vy && free(P.x, P.y + vy * sp)) P.y += vy * sp;
        P.d = Math.abs(vx) >= Math.abs(vy) && vx ? (vx > 0 ? 'R' : 'L') : (vy > 0 ? 'D' : 'U'); P.w += dt * 12;
      } else P.w = 0;
      (L.zones || []).forEach(z => { if (!S.flags['z:' + z.id] && P.x > z.x0 * TS && P.x < z.x1 * TS && P.y > z.y0 * TS && P.y < z.y1 * TS) { S.flags['z:' + z.id] = 1; toast(z.t); } });
    };
    const resize = () => { const r = R.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); if (!r.width || !r.height) return; VW = Math.round(VH * r.width / r.height); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(cv.width / VW, 0, 0, cv.height / VH, 0, 0); cx.imageSmoothingEnabled = false; };
    new ResizeObserver(resize).observe(R); resize();
    const loop = now => {
      raf = requestAnimationFrame(loop);
      if (!R.isConnected) { cancelAnimationFrame(raf); removeEventListener('keydown', kd); removeEventListener('keyup', ku); return; }
      const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = Math.max(last, now); t += dt;
      if (run) { S.t += dt; step(dt); tick(); }
      const tx = (S.won || !R.querySelector('[data-o="start"]').classList.contains('hide')) && !P.x ? L.spawn[0] * TS : P.x, ty = !P.y ? L.spawn[1] * TS : P.y;
      cam.x += ((tx - VW / 2) - cam.x) * Math.min(1, dt * 8); cam.y += ((ty - VH / 2) - cam.y) * Math.min(1, dt * 8);
      cam.x = Math.max(0, Math.min(MW * TS - VW, cam.x)); cam.y = Math.max(-40, Math.min(MH * TS - VH, cam.y));
      draw();
    };
    start(); raf = requestAnimationFrame(loop);
    return (window.RPG._last = { G, P, S, ents, act, tp: (x, y) => { P.x = x * TS + TS / 2; P.y = y * TS + TS / 2; } });
  };

  /* ---------- widget สำหรับหน้าบทเรียน ---------- */
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const head = (cfg, icon, label) => `<div class="w-head"><span class="w-tag"><i data-lucide="${icon}"></i>${label}</span>${cfg.title ? `<h4>${cfg.title}</h4>` : ''}${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;
  T.modeOf = lid => +(T.state.wid['tier:' + lid] || 0) || 2;
  W.rpg = (el, cfg, key) => {
    const lid = key.split(':')[0];
    el.innerHTML = head(cfg, 'gamepad-2', 'เกมผจญภัย') + (T.state.wid[key] ? '<span class="w-done">✓ ทำแล้ว</span>' : '') + '<div class="rpg-host"></div>';
    const lv = Object.assign({}, (window.RPG_LEVELS || {})[cfg.level], { mode: T.modeOf(lid), nick: T.state.nick || '', shirt: '#3b5bfd', minutes: cfg.minutes || 20 });
    lv.onWin = r => {
      const b = +T.state.wid['gstar:' + key] || 0; if (r.stars > b) T.state.wid['gstar:' + key] = r.stars;
      if (T.markWidget(key, Math.round((cfg.xp || 30) * [1, 1, 1.5, 2][r.mode]), el)) { const d = el.querySelector('.w-head'); if (d && !d.querySelector('.w-done')) d.insertAdjacentHTML('beforeend', '<span class="w-done">✓ ทำแล้ว</span>'); } else T.save();
    };
    window.RPG(el.querySelector('.rpg-host'), lv);
  };
  /* ตัวเลือกโหมด Easy / Normal / Hard */
  W.modes = (el, cfg, key) => {
    const lid = key.split(':')[0];
    const M = [['Easy', '⭐', 'มีตัวช่วย ตัวอย่าง และคำใบ้', '×1'], ['Normal', '⭐⭐', 'คิดเองเป็นหลัก', '×1.5'], ['Hard', '⭐⭐⭐', 'ท้าทาย ต่อยอด สืบค้นเพิ่ม', '×2']];
    const draw = () => { const m = T.modeOf(lid); el.innerHTML = `<div class="md-row"><div class="md-t"><b>เลือกโหมดการเรียน</b><small>ทุกโหมดประเมินด้วยเกณฑ์เดียวกัน • โหมดยากได้ XP มากกว่า • เปลี่ยนได้ตลอด</small></div>${M.map((x, i) => `<button data-m="${i + 1}" class="${m === i + 1 ? 'on' : ''}"><span>${x[0]} <i>${x[1]}</i></span><small>${x[2]} • XP ${x[3]}</small></button>`).join('')}</div>`;
      el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { T.state.wid['tier:' + lid] = +b.dataset.m; T.save(); document.body.dataset.mode = b.dataset.m; draw(); T.toast(`โหมด ${M[b.dataset.m - 1][0]} ${M[b.dataset.m - 1][1]}`, 'กิจกรรมและเกมจะปรับตามโหมดนี้'); if (cfg.reload !== false) setTimeout(() => location.reload(), 600); }); };
    document.body.dataset.mode = T.modeOf(lid); draw();
  };
})();
