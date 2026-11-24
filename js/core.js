/* แกนหลัก: สถานะผู้เรียน ล็อกอิน XP เหรียญ เมนู */
(function () {
  if (window.lucide && lucide.i && !lucide.i.copy) lucide.i.copy = '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />';
  const LS = 'cq_state_v1';
  const blank = () => ({ nick: '', room: '', avatar: '🦊', xp: 0, sec: {}, wid: {}, quiz: {}, done: {}, badges: [], streak: 0, lastDay: '', codeRuns: 0, hero: null, daily: {}, tb: [], et: {}, sent: {}, created: Date.now() });
  const T = {
    state: Object.assign(blank(), safeParse(localStorage.getItem(LS))),
    user: null, fb: null, ready: false, listeners: []
  };
  window.T2 = T;
  const CFG = 't2_cfg_v1';
  LESSONS.forEach(l => l.built = !!l.ready);
  T.applyCfg = c => { const o = (c && c.lessons) || {}; LESSONS.forEach(l => { l.ready = (String(l.id) in o) ? !!o[l.id] : l.built; }); };
  T.cfg = (() => { try { return JSON.parse(localStorage.getItem(CFG)) || {}; } catch (e) { return {}; } })();
  T.applyCfg(T.cfg);
  T.xp = () => (T.state.xp || 0) + (T.state.bonus || 0);
  T.lv = () => T.level(T.xp()).i;
  T.hero = () => T.state.hero || { cls: 'mage', skin: 0, style: 0, hc: 0 };
  T.heroClass = () => HERO_CLASSES[T.hero().cls] || Object.values(HERO_CLASSES)[0];
  T.avatar = (size = 40) => heroSVG(T.state.hero, T.lv(), size);
  /* โบนัสอาชีพ: XP +20% ในโลก (หน่วย) ที่ตรงกับอาชีพ */
  T.perk = lid => false; T._perkOld = lid => { const L = LESSONS.find(l => l.id === +lid); return !!(T.state.hero && L && T.heroClass().units.includes(L.unit)); };
  /* ภารกิจประจำวัน */
  T.today = () => new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
  T.daily = () => { const d = T.state.daily || {}; if (d.d !== T.today()) T.state.daily = { d: T.today(), sec: 0, wid: 0, code: 0, got: [], chest: false }; return T.state.daily; };
  T.dailyInc = k => {
    const d = T.daily(); d[k] = (d[k] || 0) + 1;
    DAILY.forEach((q, i) => { if (q.k === k && d[k] >= q.need && !d.got.includes(i)) { d.got.push(i); setTimeout(() => { T.toast(`${q.icon} ภารกิจสำเร็จ!`, `${q.name} +${q.xp} XP`, 'badge'); T.addXP(q.xp, 'ภารกิจประจำวัน'); }, 900); } });
    if (d.got.length === DAILY.length && !d.chest) { d.chest = true; setTimeout(() => T.openChest(), 2000); }
  };
  T.openChest = () => { T.confetti(150); T.addXP(DAILY_CHEST, 'หีบสมบัติประจำวัน');
    T.modal(`<div class="center"><div class="chest">🎁</div><h2>เปิดหีบสมบัติประจำวัน!</h2><p>ทำภารกิจประจำวันครบทั้ง ${DAILY.length} อย่าง ได้รับ <b>+${DAILY_CHEST} XP</b></p><p class="muted">กลับมาใหม่พรุ่งนี้ ภารกิจจะรีเซ็ตทุกวัน</p><button class="btn gold" onclick="this.closest('.modal-bg').remove()">รับรางวัล</button></div>`); };

  function safeParse(s) { try { return JSON.parse(s) || {}; } catch (e) { return {}; } }
  const $ = (s, r = document) => r.querySelector(s);
  T.$ = $;
  T.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- ระดับ ---------- */
  T.level = xp => {
    let i = 0; LEVELS.forEach((l, k) => { if (xp >= l.xp) i = k; });
    const cur = LEVELS[i], next = LEVELS[i + 1];
    const pct = next ? Math.round((xp - cur.xp) / (next.xp - cur.xp) * 100) : 100;
    return { i, cur, next, pct };
  };
  T.lessonProgress = id => {
    const L = (window.LESSON_SECTIONS || {})[id];
    const s = T.state;
    if (s.done['l' + id]) return 100;
    const total = L ? L + 1 : 0;
    if (!total) return 0;
    const n = Object.keys(s.sec).filter(k => k.startsWith('l' + id + ':')).length + (s.quiz['l' + id] != null ? 1 : 0);
    return Math.min(99, Math.round(n / total * 100));
  };
  T.courseProgress = () => {
    const ready = LESSONS.filter(l => l.ready).length || 1;
    const done = LESSONS.filter(l => T.state.done['l' + l.id]).length;
    return Math.round(done / LESSONS.length * 100);
  };

  /* ---------- บันทึก ---------- */
  let saveTimer = null;
  /* แจ้งเตือนเมื่อสมรรถนะเลื่อนระดับ */
  T.compCheck = (silent) => {
    if (!window.heroComp) return; const now = heroComp(T.state);
    if (T._comp && !silent) now.forEach((x, i) => { if (x.lv > T._comp[i]) setTimeout(() => { T.toast(`${x.icon} สมรรถนะ${x.name} เลื่อนระดับ!`, `ตอนนี้อยู่ระดับ ${x.lvIcon} ${x.lvName}`, 'badge'); T.confetti(60); }, 1400); });
    T._comp = now.map(x => x.lv);
  };
  T.save = () => {
    localStorage.setItem(LS, JSON.stringify(T.state));
    T.compCheck(!T.ready);
    T.emit();
    if (!T.user || !T.fb) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(T.pushCloud, 800);
  };
  T.pushCloud = async () => {
    if (!T.user || !T.fb || T.blocked) return false;
    const { db, doc, setDoc } = T.fb; const s = T.state; const lv = T.level(T.xp());
    try {
      await setDoc(doc(db, 'users', T.user.uid), Object.assign({}, s, { email: T.user.email, name: T.user.displayName || '', updated: Date.now() }));
      await setDoc(doc(db, 'board', T.user.uid), { nick: s.nick || 'นักเรียน', room: s.room || '-', avatar: s.avatar, hero: s.hero || null, xp: T.xp(), level: lv.i, badges: s.badges.length + (s.tb || []).length, done: Object.keys(s.done).length, updated: Date.now() });
      if (T.myPts) try { await setDoc(doc(db, 'board', T.user.uid), { pt: T.myPts() }, { merge: true }); } catch (e) { }
      /* ยกมือขอเพื่อนช่วย: เก็บในกระดานที่เพื่อนร่วมห้องอ่านได้ (แยกเขียน ไม่กระทบคะแนน) */
      try { const h = s.help, fresh = x => x && x.ts && Date.now() - x.ts < 3 * 36e5;
        await setDoc(doc(db, 'board', T.user.uid), { peer: fresh(h) && h.to === 'friend' ? { msg: h.msg || '', lid: h.lid || '', sec: h.sec || '', ts: h.ts } : null, helping: fresh(s.helping) ? s.helping : null }, { merge: true }); } catch (e) { }
      return true;
    } catch (e) { console.warn('cloud save', e); return false; }
  };
  T.on = fn => T.listeners.push(fn);
  T.emit = () => T.listeners.forEach(f => { try { f(T.state); } catch (e) { console.error(e); } });

  /* ---------- XP / เหรียญ ---------- */
  /* โหมดผู้เยี่ยมชม: ไม่ได้ล็อกอิน อ่านบทเรียนได้ แต่ไม่เก็บ/ไม่แสดงคะแนน */
  T.guest = () => !!(T.ready && T.fb && !T.user);
  T.addXP = (n, why, at) => {
    if (T.guest()) return;
    const before = T.level(T.xp()).i;
    T.state.xp += n;
    T.toast(`+${n} XP`, why || '', 'xp', at);
    const after = T.level(T.xp()).i;
    if (after > before) setTimeout(() => T.levelUp(LEVELS[after]), 700);
    T.save();
  };
  T.award = id => {
    if (T.guest() || !BADGES[id] || T.state.badges.includes(id)) return false;
    T.state.badges.push(id); T.save();
    const b = BADGES[id];
    setTimeout(() => T.toast(`${b.icon} ได้รับเหรียญ "${b.name}"`, b.desc, 'badge'), 400);
    T.confetti();
    return true;
  };
  T.markSection = (lid, sid, el) => {
    const k = 'l' + lid + ':' + sid;
    if (T.state.sec[k]) return false;
    T.state.sec[k] = Date.now(); T.daily(); T.dailyInc('sec');
    const pk = T.perk(lid); T.addXP(pk ? Math.round(XP.section * 1.2) : XP.section, pk ? 'อ่านจบหัวข้อ • โบนัสอาชีพ' : 'อ่านจบหัวข้อ', el); T.checkLesson(lid); return true;
  };
  T.markWidget = (key, xp, el) => {
    if (T.state.wid[key]) return false;
    T.state.wid[key] = Date.now(); T.daily(); T.dailyInc('wid');
    const pk = T.perk((key.match(/^l(\d+)/) || [])[1]); const base = xp || XP.widget;
    T.addXP(pk ? Math.round(base * 1.2) : base, pk ? 'ทำกิจกรรมสำเร็จ • โบนัสอาชีพ' : 'ทำกิจกรรมสำเร็จ', el);
    if (Object.keys(T.state.wid).length >= 10) T.award('explorer');
    return true;
  };
  T.checkLesson = lid => {
    const n = (window.LESSON_SECTIONS || {})[lid]; if (!n) return;
    const read = Object.keys(T.state.sec).filter(k => k.startsWith('l' + lid + ':')).length;
    if (read >= n && T.state.quiz['l' + lid] != null && !T.state.done['l' + lid]) {
      T.state.done['l' + lid] = Date.now();
      T.addXP(XP.lessonDone, 'จบเควส 🎉');
      T.award('l' + lid);
      const u = LESSONS.find(l => l.id === lid).unit;
      const unit = UNITS.find(x => x.n === u);
      if (unit.lessons.every(id => T.state.done['l' + id])) T.award('u' + u);
      T.celebrate(lid);
    }
  };
  T.touchStreak = () => {
    const d = new Date(); const today = d.toISOString().slice(0, 10);
    const y = new Date(d - 864e5).toISOString().slice(0, 10);
    const s = T.state;
    if (s.lastDay === today) return;
    s.streak = s.lastDay === y ? (s.streak || 0) + 1 : 1;
    s.lastDay = today;
    if (s.streak >= 3) T.award('streak3');
    T.save();
  };

  /* ---------- UI: toast / confetti / modal ---------- */
  T.toast = (title, sub, kind) => {
    let box = $('#toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (kind || '');
    t.innerHTML = `<b>${title}</b>${sub ? `<span>${sub}</span>` : ''}`;
    box.appendChild(t); setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3100);
  };
  T.confetti = (n = 90) => {
    const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#F5C542', '#2D4FD6', '#7FD3FF', '#FF6B6B', '#22C55E', '#A855F7'];
    const P = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6 }));
    let f = 0; (function tick() { x.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); x.restore(); }); if (++f < 110) requestAnimationFrame(tick); else c.remove(); })();
  };
  T.modal = (html, opts = {}) => {
    const m = document.createElement('div'); m.className = 'modal-bg';
    m.innerHTML = `<div class="modal ${opts.cls || ''}">${opts.close === false ? '' : '<button class="modal-x" aria-label="ปิด">✕</button>'}${html}</div>`;
    document.body.appendChild(m);
    const close = () => { m.classList.add('out'); setTimeout(() => m.remove(), 200); };
    m.addEventListener('click', e => { if (e.target === m && opts.close !== false) close(); });
    const x = m.querySelector('.modal-x'); if (x) x.onclick = close;
    T.icons(); return { el: m, close };
  };
  T.levelUp = lv => { T.confetti(140); const i = LEVELS.indexOf(lv); const gear = window.WARDROBE ? (x => x ? 'ปลดล็อก ' + x : '')(Object.values(WARDROBE).flatMap(g => g.items.filter(it => it[2] === i).map(it => g.em + ' ' + it[1])).join(' • ')) : '';
    T.modal(`<div class="center"><div class="lvup-hero">${heroSVG(T.state.hero, i, 140)}</div><h2>เลื่อนระดับ! Lv.${i + 1}</h2><p>ยอดเยี่ยมมาก! ความพยายามพาขึ้นสู่ระดับ <b>${lv.icon} ${lv.name}</b></p>${gear ? `<p class="pill">🎁 ${gear}</p>` : ''}<div class="row-center"><button class="btn gold" onclick="this.closest('.modal-bg').remove();T2.wardrobe&&T2.wardrobe()">🎨 อัปเกรดตัวละคร</button><button class="btn ghost" onclick="this.closest('.modal-bg').remove()">ไว้ทีหลัง</button></div></div>`); };
  T.celebrate = lid => {
    const next = LESSONS.find(l => l.id === lid + 1);
    T.confetti(160);
    T.modal(`<div class="center"><div class="big-emoji">🏅</div><h2>ยอดเยี่ยม! จบเควส ${ACT(lid)}</h2><p>ได้รับ +${XP.lessonDone} XP และเหรียญ ${BADGES['l' + lid] ? BADGES['l' + lid].icon + ' ' + BADGES['l' + lid].name : ''}</p>
      <div class="row-center">${next ? `<a class="btn gold" href="lesson.html?id=${next.id}">เควสถัดไป →</a>` : ''}<a class="btn ghost" href="profile.html">ดูเหรียญของฉัน</a></div></div>`);
  };
  T.icons = () => { if (window.lucide) lucide.createIcons(); };

  /* ---------- Header / เมนูนักเรียน / Footer ---------- */
  T.renderChrome = (active) => {
    const h = document.createElement('header'); h.className = 'topbar';
    h.innerHTML = `
      <a class="brand" href="index.html"><span class="logo"><i data-lucide="cpu"></i></span><span><b>${COURSE.short}</b><small>${COURSE.lv} • เตรียมวิศวะคอมฯ</small></span></a>
      <nav class="mainnav">
        <a href="index.html" class="${active === 'home' ? 'on' : ''}"><i data-lucide="house"></i>หน้าแรก</a>
        <div class="dd"><button class="dd-btn ${active === 'units' ? 'on' : ''}"><i data-lucide="map"></i>แผนที่โลก<i data-lucide="chevron-down" class="sm"></i></button><div class="dd-menu lmenu" id="lmenu"></div></div>
        <a href="missions.html" class="${active === 'missions' ? 'on' : ''}"><i data-lucide="target"></i>เควสทั้งหมด<span class="ncnt" id="msCnt"></span></a>
        <a href="sidequests.html" class="${active === 'side' ? 'on' : ''}"><i data-lucide="compass"></i>เควสรอง</a>
        <a href="leaderboard.html" class="${active === 'board' ? 'on' : ''}"><i data-lucide="route"></i>การเดินทาง</a>
        <a href="points.html" class="${active === 'points' ? 'on' : ''}"><i data-lucide="star"></i>แต้มสะสม</a>
        <div class="dd"><button class="dd-btn"><i data-lucide="backpack"></i>เมนูนักเรียน<i data-lucide="chevron-down" class="sm"></i></button>
          <div class="dd-menu">
            <a href="profile.html"><i data-lucide="medal"></i>โปรไฟล์และเหรียญของฉัน</a>
            <div class="dd-grp"><small><i data-lucide="sparkles"></i>ตัวละครของฉัน</small><div class="dd-tabs"><a href="#" data-wardrobe>🎨 แต่งตัว</a><a href="pets.html">🐾 สัตว์เลี้ยง</a></div></div>
            <a href="index.html#units"><i data-lucide="book-open"></i>หน่วยการเรียนทั้งหมด</a>
            <a href="sidequests.html"><i data-lucide="compass"></i>เควสรองตามสาย</a>
            <a href="leaderboard.html"><i data-lucide="route"></i>กระดานการเดินทาง</a>
            <a href="${COURSE.links.score}" target="_blank" rel="noopener"><i data-lucide="clipboard-list"></i>ตรวจสอบคะแนน</a>
            <a href="${COURSE.links.classroom}" target="_blank" rel="noopener"><i data-lucide="school"></i>Google Classroom</a>
            <a href="${COURSE.links.drive}" target="_blank" rel="noopener"><i data-lucide="folder-open"></i>คลังสื่อ (Google Drive)</a>
            ${COURSE.links.colab ? `<a href="${COURSE.links.colab}" target="_blank" rel="noopener"><i data-lucide="notebook-pen"></i>Google Colab</a>` : ''}${COURSE.links.py101 ? `<a href="${COURSE.links.py101}" target="_blank" rel="noopener"><i data-lucide="graduation-cap"></i>Python 101 (จุฬาฯ)</a>` : ''}${COURSE.links.word ? `<a href="${COURSE.links.word}" target="_blank" rel="noopener"><i data-lucide="file-text"></i>Microsoft Word ออนไลน์</a>` : ''}
            <a href="${COURSE.links.main}" target="_blank" rel="noopener"><i data-lucide="globe"></i>เว็บหลัก boripat.com</a>
          </div></div>
        <div class="dd teacher-only" style="display:none"><button class="dd-btn teach"><i data-lucide="shield-check"></i>เมนูครู<i data-lucide="chevron-down" class="sm"></i></button>
          <div class="dd-menu">
            <small class="dd-h">จัดการชั้นเรียน</small>
            <a href="teacher.html#progress"><i data-lucide="gauge"></i>ความคืบหน้านักเรียน</a>
            <a href="teacher.html#users"><i data-lucide="users"></i>จัดการผู้ใช้ / รายชื่อ</a>
            <a href="teacher.html#lessons"><i data-lucide="book-open"></i>เปิด–ปิดกิจกรรม</a>
            <a href="teacher.html#announce"><i data-lucide="megaphone"></i>ประกาศ & ตั้งค่า</a>
            <a href="attendance.html"><i data-lucide="clipboard-check"></i>เช็คชื่อ / รายงานเวลาเรียน</a>
            <a href="points.html"><i data-lucide="star"></i>ให้แต้มสะสม / รหัสรับแต้ม</a>
            <button class="rn-tg" data-rn><i data-lucide="id-card"></i><span>แสดงชื่อจริง (ชื่อเล่น)</span><i class="sw"></i></button>
            <small class="dd-h">ระบบหลังบ้าน</small>
            <a href="https://boripat.com/score-teacher/" target="_blank" rel="noopener"><i data-lucide="clipboard-list"></i>ระบบคะแนน (ครู)</a>
            <a href="https://console.firebase.google.com/project/computer-eng-kw/firestore/databases/-default-/data" target="_blank" rel="noopener"><i data-lucide="database"></i>Firebase Console</a>
            <a href="${COURSE.links.drive}" target="_blank" rel="noopener"><i data-lucide="folder-open"></i>คลังสื่อ (Drive)</a>
          </div></div>
      </nav>
      <div class="dd bell-dd" id="bellDD"><button class="dd-btn bell" aria-label="การแจ้งเตือน" title="การแจ้งเตือน">🔔<span class="ncnt" id="bellCnt"></span></button><div class="dd-menu nmenu" id="nmenu"></div></div>
      <div class="me" id="me"></div>
      <button class="burger" aria-label="เมนู"><i data-lucide="menu"></i></button>`;
    document.body.prepend(h);
    h.querySelector('.burger').onclick = () => h.classList.toggle('open');
    h.querySelectorAll('.dd').forEach(d => d.querySelector('.dd-btn').onclick = e => { e.stopPropagation(); h.querySelectorAll('.dd').forEach(x => x !== d && x.classList.remove('open')); d.classList.toggle('open'); });
    document.addEventListener('click', () => h.querySelectorAll('.dd').forEach(d => d.classList.remove('open')));
    const f = document.createElement('footer'); f.className = 'foot';
    f.innerHTML = `<div class="wrap foot-in"><div><b>รายวิชา${COURSE.name} (${COURSE.code})</b><br>${COURSE.grade} • ${COURSE.term}</div>
      <div>${COURSE.teacher} • ${COURSE.school}<br>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</div>
      <div><a href="${COURSE.links.main}" target="_blank">boripat.com</a> • <a href="${COURSE.links.score}" target="_blank">ตรวจคะแนน</a><br><small>© 2569 สงวนลิขสิทธิ์ เนื้อหาเพื่อการศึกษา</small></div></div>`;
    document.body.appendChild(f);
    T.on(T.renderMe); T.renderMe();
    T.icons();
  };
  T.renderMe = () => {
    const box = $('#me'); if (!box) return;
    const s = T.state, lv = T.level(T.xp());
    const login = T.user ? '' : `<button class="btn sm gold" id="loginBtn"><i data-lucide="log-in"></i>เข้าสู่ระบบ</button>`;
    document.body.classList.toggle('guest', T.guest());
    document.body.classList.toggle('tview', T.tview());
    if (T.guest()) { const gt = T.guestTeacher();
      box.innerHTML = `<div class="dd guest-dd"><button type="button" class="guest-chip" aria-haspopup="true" title="อ่านได้ทุกกิจกรรม • ไม่บันทึกคะแนน">${gt ? '🧑‍🏫 ผู้เยี่ยมชม (ครู)' : '👀 ผู้เยี่ยมชม'}<span class="gc-v">▾</span></button>
        <div class="dd-menu"><small class="dd-h">เลือกมุมมองผู้เยี่ยมชม</small>
          <a href="#" data-gt="0" class="${gt ? '' : 'on'}"><span>👀</span><span><b>ผู้เยี่ยมชม</b><small>เห็นหน้ากิจกรรมแบบเดียวกับนักเรียน</small></span></a>
          <a href="#" data-gt="1" class="${gt ? 'on' : ''}"><span>🧑‍🏫</span><span><b>ผู้เยี่ยมชมแบบครู</b><small>เห็นขั้นการสอน แนวการจัดการเรียนรู้ และเกณฑ์การประเมิน</small></span></a></div></div>${login}`;
      const g = $('#loginBtn'); if (g) g.onclick = T.login;
      const dd = box.querySelector('.guest-dd'); dd.querySelector('.guest-chip').onclick = e => { e.stopPropagation(); dd.classList.toggle('open'); };
      dd.querySelectorAll('[data-gt]').forEach(a => a.onclick = e => { e.preventDefault(); try { localStorage.setItem('t2-gt', a.dataset.gt); } catch (x) { } location.reload(); });
      document.querySelectorAll('.teacher-only').forEach(a => a.style.display = 'none'); T.icons(); return; }
    box.innerHTML = `
      <div class="streak" title="เรียนต่อเนื่อง"><span>🔥</span>${s.streak || 0}</div>
      <a class="xpchip" href="profile.html" title="${lv.cur.name}"><span class="lv">${lv.cur.icon}</span><span class="xpbar"><i style="width:${lv.pct}%"></i></span><b>${T.xp()}</b><small>XP</small></a>
      ${T.user ? `<a href="profile.html" class="avatar hero car-wrap" data-car="${s.career ? careerOf(s.career, (s.hero || {}).g).em : ''}" title="${T.esc(s.nick || T.user.displayName || '')} • ${T.heroClass().name}">${T.avatar(40)}</a>` : login}`;
    const lb = $('#loginBtn'); if (lb) lb.onclick = T.login;
    document.querySelectorAll('.teacher-only').forEach(a => a.style.display = T.isTeacher() ? '' : 'none');
    T.icons();
  };
  T.isTeacherReal = () => !!(T.user && TEACHER_EMAILS.includes((T.user.email || '').toLowerCase()));
  /* มุมนักเรียน (สำหรับครู): เก็บในแท็บนี้เท่านั้น ไม่เขียนลงข้อมูลของใคร */
  T.sv = () => { if (!/lesson\.html$/.test(location.pathname)) return null; try { return JSON.parse(sessionStorage.getItem('t2_sv') || 'null'); } catch (e) { return null; } };
  T.setSV = v => { try { if (v) sessionStorage.setItem('t2_sv', JSON.stringify(v)); else sessionStorage.removeItem('t2_sv'); } catch (e) { } location.reload(); };
  T.isTeacher = () => T.isTeacherReal() && !T.sv();
  T.viewRoom = () => { const v = T.isTeacherReal() && T.sv(); return v ? v.room : (T.state || {}).room; };
  T.viewNo = () => { const v = T.isTeacherReal() && T.sv(); return v ? v.no : (T.state || {}).no; };
  T.on(() => { const v = T.isTeacherReal() && T.sv(); let b = document.getElementById('svBar'); if (!v) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'svBar'; b.className = 'sv-bar'; b.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:99999'; document.body.appendChild(b); }
    b.innerHTML = `<span>👀 กำลังดูมุมนักเรียน • ${T.esc(v.room || '')}${v.no ? ' เลขที่ ' + T.esc(v.no) : ''}</span><button type="button">กลับมุมครู</button>`; b.querySelector('button').onclick = () => T.setSV(null); });
  /* ผู้เยี่ยมชมแบบครู: ไม่ได้ล็อกอิน แต่เห็นหน้ากิจกรรมในมุมมองครู (ขั้นการสอน แนวการจัดการเรียนรู้ เกณฑ์ประเมิน) ไม่เข้าถึงข้อมูลนักเรียน */
  T.guestTeacher = () => { try { return T.guest() && localStorage.getItem('t2-gt') === '1'; } catch (e) { return false; } };
  T.tview = () => T.isTeacher() || T.guestTeacher();

  /* ---------- Firebase ---------- */
  T.initFirebase = async () => {
    if (!window.FIREBASE_CONFIG) { T.ready = true; T.emit(); return; }
    try {
      const V = '10.12.2';
      const [app, auth, fs] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
      ]);
      const a = app.initializeApp(FIREBASE_CONFIG);
      const au = auth.getAuth(a);
      const NS = window.DB_NS || '', CN = c => NS && c !== 'config' ? NS + '_' + c : c, DN = (c, id) => NS && c === 'config' && id === 'app' ? NS : id;
      T.fb = { onSnapshot: fs.onSnapshot, auth: au, authMod: auth, db: fs.getFirestore(a), doc: (d, c, id, ...r) => fs.doc(d, CN(c), DN(c, id), ...r), setDoc: fs.setDoc, getDoc: fs.getDoc, getDocs: fs.getDocs, collection: (d, c, ...r) => fs.collection(d, CN(c), ...r), query: fs.query, orderBy: fs.orderBy, limit: fs.limit, where: fs.where, deleteDoc: fs.deleteDoc, updateDoc: fs.updateDoc };
      T.cfgReady = T.loadCfg();
      auth.getRedirectResult(au).catch(e => console.warn('redirect', e));
      auth.onAuthStateChanged(au, async u => {
        T.user = u;
        if (u) await T.pullCloud();
        T.ready = true; T.emit();
      });
    } catch (e) { console.warn('firebase', e); T.ready = true; T.emit(); }
  };
  T.loadCfg = async () => {
    try {
      const { db, doc, getDoc } = T.fb;
      const snap = await getDoc(doc(db, 'config', 'app'));
      const c = snap.exists() ? snap.data() : {};
      const changed = JSON.stringify(c.lessons || {}) !== JSON.stringify(T.cfg.lessons || {});
      T.cfg = c; localStorage.setItem(CFG, JSON.stringify(c)); T.applyCfg(c);
      if (changed && /lesson\.html/.test(location.pathname) && !sessionStorage.getItem('t2_rl')) { sessionStorage.setItem('t2_rl', 1); location.reload(); return; }
      sessionStorage.removeItem('t2_rl');
      T.emit();
    } catch (e) { console.warn('cfg', e); }
  };
  T.login = async () => {
    if (!T.fb) { T.modal(`<h3>ยังไม่ได้เปิดระบบล็อกอิน</h3><p>ความคืบหน้าจะถูกบันทึกไว้ในเครื่องนี้ก่อน</p>`); return; }
    const { authMod, auth } = T.fb;
    const p = new authMod.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
    try { await authMod.signInWithPopup(auth, p); }
    catch (e) {
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') { await authMod.signInWithRedirect(auth, p); return; }
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') T.toast('เข้าสู่ระบบไม่สำเร็จ', e.code || '', 'err');
    }
  };
  T.logout = async () => { if (T.fb) await T.fb.authMod.signOut(T.fb.auth); localStorage.removeItem(LS); T.state = blank(); location.href = 'index.html'; };
  T.pullCloud = async () => {
    const { db, doc, getDoc } = T.fb;
    try {
      await T.cfgReady;
      const email = (T.user.email || '').toLowerCase();
      let roster = null;
      if (!T.isTeacher()) {
        try { const r = await getDoc(doc(db, 'roster', email)); roster = r.exists() ? r.data() : null; } catch (e) { }
        if (T.cfg.restrict && !roster) { T.blocked = true; T.showBlocked(email); return; }
      }
      let local = T.state;
      try {
        const rm = await getDoc(doc(db, 'removed', T.user.uid));
        if (rm.exists() && (rm.data().at || 0) > (local.resetAt || 0)) { local = blank(); local.resetAt = rm.data().at; T.state = local; }
      } catch (e) { }
      const snap = await getDoc(doc(db, 'users', T.user.uid));
      if (snap.exists()) {
        const c = snap.data();
        const m = Object.assign(blank(), c);
        m.xp = Math.max(c.xp || 0, local.xp || 0);
        ['sec', 'wid', 'quiz', 'done', 'et', 'sent'].forEach(k => m[k] = Object.assign({}, local[k], c[k]));
        m.badges = [...new Set([...(c.badges || []), ...(local.badges || [])])];
        T.state = m;
      } else {
        T.state.nick = T.state.nick || '';
      }
      try { const b = await getDoc(doc(db, 'bonus', T.user.uid)); const bd = b.exists() ? b.data() : {}; const newTb = (bd.badges || []).filter(x => !(T.state.tb || []).includes(x));
        T.state.bonus = bd.total || 0; T.state.tb = bd.badges || []; T.blog = bd.log || []; T.plog = bd.plog || []; T.state.bpt = bd.pt || 0;
        newTb.forEach((k, n) => { const b = TEACHER_BADGES[k]; if (b) setTimeout(() => { T.toast(`${b.icon} ครูมอบเหรียญ "${b.name}"`, b.desc, 'badge'); T.confetti(); }, 1200 + n * 900); }); } catch (e) { }
      if (roster) { if (roster.room) T.state.room = roster.room; if (roster.no) T.state.no = roster.no; T.state.rosterLock = !!roster.room; }
      T.award('hello');
      T.touchStreak();
      localStorage.setItem(LS, JSON.stringify(T.state));
      T.compCheck(true);
      T.pushCloud();
      if (roster && roster.nickname && !T.state.nickname) { T.state.nickname = roster.nickname; localStorage.setItem(LS, JSON.stringify(T.state)); T.pushCloud(); }
      if (!T.state.nick || !T.state.room || !T.state.hero) T.setupProfile();
      else if (!T.state.nickname && !sessionStorage.getItem('t2_nn')) T.askNickname();
    } catch (e) { console.warn('pull', e); }
  };
  T.showBlocked = email => {
    T.modal(`<div class="center"><div class="big-emoji">🔒</div><h3>บัญชีนี้ยังไม่อยู่ในรายชื่อนักเรียน</h3>
      <p>${T.esc(email)}</p><p class="muted">ครูเปิดให้เข้าใช้เฉพาะนักเรียนที่มีชื่อในรายวิชา ลองเข้าสู่ระบบด้วยบัญชีโรงเรียน (@kw.ac.th) หรือแจ้งครูให้เพิ่มรายชื่อ</p>
      <button class="btn gold" id="blkOut">ออกจากระบบ / ใช้บัญชีอื่น</button></div>`, { close: false }).el.querySelector('#blkOut').onclick = T.logout;
  };
  /* มีฮีโร่แล้วแต่ยังไม่มีชื่อเล่นจริง: ถามเฉพาะช่องที่ขาด ครั้งเดียวต่อการเปิดเบราว์เซอร์ */
  T.askNickname = () => {
    sessionStorage.setItem('t2_nn', 1);
    const m = T.modal(`<h3>✏️ เพิ่มชื่อเล่นจริง</h3><p class="muted">ฮีโร่ ${T.esc(T.state.nick)} พร้อมแล้ว เหลือเพียงชื่อเล่นจริง เพื่อให้ครูรู้ว่าเป็นใคร</p>
      <label style="margin:0">ชื่อเล่นจริง<input id="nnReal" maxlength="20" placeholder="ชื่อเล่นที่ครูและเพื่อนเรียก"></label>
      <div class="row" style="margin-top:12px"><button class="btn gold" id="nnSave">บันทึก</button></div>`);
    const inp = m.el.querySelector('#nnReal'); setTimeout(() => inp.focus(), 50);
    const save = () => { const v = inp.value.trim(); if (!v) { T.toast('กรุณาใส่ชื่อเล่นจริง', '', 'err'); return; }
      T.state.nickname = v; localStorage.setItem(LS, JSON.stringify(T.state)); T.emit(); m.close();
      T.pushCloud().then(ok => ok ? T.toast('บันทึกชื่อเล่นแล้ว', v) : T.toast('บันทึกขึ้นระบบไม่สำเร็จ', 'ลองใหม่อีกครั้ง หรือแจ้งครู', 'err')); };
    m.el.querySelector('#nnSave').onclick = save; inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
  };
  T.AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦉', '🐬', '🦄', '🐲', '🤖', '👾', '🚀', '⚡', '🌟', '🎧'];
  T.setupProfile = () => {
    const s = T.state; const h = Object.assign({}, T.hero(), s.hero ? {} : { cls: '' });
    const O = HERO_OPTS;
    const m = T.modal(`<h3>🎮 สร้างฮีโร่ของฉัน</h3>
      <div class="hc-wrap"><div class="hc-prev"><div id="hcSvg"></div><b id="hcName"></b><div id="hcPerk"></div></div>
      <div class="hc-form">
        <span class="flabel">1. เลือกสายของฮีโร่ (เปลี่ยนได้ภายหลัง)</span>
        <div class="hc-cls">${Object.entries(HERO_CLASSES).map(([k, c]) => { const A = COMPETENCIES[c.comp], B = COMPETENCIES[c.comp2]; return `<button data-c="${k}" style="--c:${c.c1}"><span class="hc-av">${heroSVG({ cls: k, skin: h.skin, style: h.style, hc: h.hc }, 0, 52)}</span><b>${c.name}</b><small>${c.th ? c.th + ' • ' : ''}${c.desc}</small><span class="hc-tags"><i class="cmp-tag" style="--c:${A.color}" title="สมรรถนะเด่น">${A.icon} ${A.name}</i><i class="cmp-tag sub" style="--c:${B.color}" title="สมรรถนะรอง">${B.icon} ${B.name}</i></span><em class="hc-w">🧭 เควสรอง: ${((window.SIDE_QUESTS || {})[k] || { q: [] }).q.map(x => x.t).join(' • ')}</em></button>`; }).join('')}</div>
        <span class="flabel">2. แต่งตัวละคร</span>
        <div class="hc-row"><small>เพศ</small>${[['m', '👦 ชาย'], ['f', '👧 หญิง'], ['n', '🙂 ไม่ระบุ']].map(([v, t]) => `<button class="chip" data-g="${v}">${t}</button>`).join('')}</div>
        <div class="hc-row"><small>สีผิว</small>${O.SKINS.map((c, i) => `<button class="sw" data-k="skin" data-v="${i}" style="background:${c}"></button>`).join('')}</div>
        <div class="hc-row"><small>ทรงผม</small>${O.STYLES.map((t, i) => `<button class="chip" data-k="style" data-v="${i}">${t}</button>`).join('')}</div>
        <div class="hc-row"><small>สีผม</small>${O.HAIRS.map((c, i) => `<button class="sw" data-k="hc" data-v="${i}" style="background:${c}"></button>`).join('')}</div>
        <span class="flabel">3. ข้อมูลผู้เล่น</span>
        <div class="grid2" style="gap:10px"><label style="margin:0">ชื่อเล่นจริง<input id="pfReal" maxlength="20" value="${T.esc(s.nickname || '')}" placeholder="ชื่อเล่นที่ครูและเพื่อนเรียก"></label>
        <label style="margin:0">ชื่อฮีโร่ (แสดงบนหอเกียรติยศ)<input id="pfNick" maxlength="16" value="${T.esc(s.nick || '')}" placeholder="เช่น มะลิผู้กล้า"></label></div>
        <div class="grid2" style="gap:10px;margin-top:10px">
        <label style="margin:0">ห้องเรียน<select id="pfRoom">${ROOMS.map(r => `<option ${r === s.room ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
        <label style="margin:0">เลขที่<input id="pfNo" type="number" min="1" max="60" value="${s.no || ''}"></label></div>
        <span class="flabel">4. อาชีพที่สนใจในอนาคต <small class="muted" style="font-weight:400">(พิมพ์เองได้ จะกลายเป็นไอเท็มประจำตัวฮีโร่)</small></span>
        <input id="pfCareer" maxlength="60" value="${T.esc(s.career || '')}" placeholder="เช่น นักออกแบบเกม, หมอฟัน, เปิดคาเฟ่, ยังไม่แน่ใจ">
        <div class="car-sugg">${CAREER_SUGG.map(x => `<button class="chip" data-sugg="${x}">${x}</button>`).join('')}</div><div id="carPrev" class="car-prev"></div>
        <p class="muted" style="font-size:13px;margin:0 0 8px">🔒 ชื่อเล่นจริงและเลขที่ ครูเท่านั้นที่เห็น • ชื่อฮีโร่และตัวละครจะแสดงบนหอเกียรติยศ (ไม่แสดงชื่อจริงและอีเมล) • เปลี่ยนได้ภายหลัง</p>
      </div></div>
      <button class="btn gold block lg" id="pfSave"><i data-lucide="swords"></i>เริ่มการผจญภัย</button>`, { close: !!s.nick, cls: 'wide' });
    const upd = () => {
      m.el.querySelector('#hcSvg').innerHTML = h.cls ? heroSVG(h, T.lv(), 150) : heroBlank(150);
      const c = HERO_CLASSES[h.cls]; m.el.querySelector('#hcName').textContent = c ? c.name : 'ยังไม่ได้เลือกสาย';
      m.el.querySelector('#hcPerk').innerHTML = c ? heroExplain(h.cls) : '<small class="muted">เลือกสายจากรายการ แล้วดูว่าสายนั้นได้ฝึกอะไร</small>';
      m.el.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === h.cls));
      m.el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', +b.dataset.v === h[b.dataset.k]));
      m.el.querySelectorAll('[data-g]').forEach(b => b.classList.toggle('on', b.dataset.g === (h.g || 'n')));
      m.el.querySelectorAll('.hc-cls [data-c] .hc-av').forEach(a => { a.innerHTML = heroSVG({ cls: a.parentNode.dataset.c, skin: h.skin, style: h.style, hc: h.hc, g: h.g }, 0, 52); });
      if (m.el.querySelector('#pfCareer')) carUpd();
    };
    const carUpd = () => { const v = m.el.querySelector('#pfCareer').value.trim(), c = careerOf(v, h.g); m.el.querySelector('#carPrev').innerHTML = `<span class="car-em">${c.em}</span><div><b>${c.t}</b>${v && c.t === CAREER_DEF.t ? ' • ' + T.esc(v) : ''}<br><small class="muted">ไอเท็มประจำตัว ${c.items.join(' ')} • ไม่มีผลกับ XP</small></div>`; };
    m.el.querySelector('#pfCareer').oninput = carUpd; m.el.querySelectorAll('[data-sugg]').forEach(b => b.onclick = () => { m.el.querySelector('#pfCareer').value = b.dataset.sugg; carUpd(); }); carUpd();
    m.el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { h.cls = b.dataset.c; upd(); });
    m.el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { h[b.dataset.k] = +b.dataset.v; upd(); });
    m.el.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { h.g = b.dataset.g; upd(); });
    upd();
    m.el.querySelector('#pfSave').onclick = () => {
      const nick = m.el.querySelector('#pfNick').value.trim();
      if (!h.cls) { T.toast('เลือกสายของฮีโร่ก่อน', '', 'err'); return; }
      const real = m.el.querySelector('#pfReal').value.trim();
      if (!real) { T.toast('กรุณาใส่ชื่อเล่นจริง', 'เพื่อให้ครูรู้ว่าเป็นใคร', 'err'); return; }
      if (!nick) { T.toast('กรุณาใส่ชื่อฮีโร่', '', 'err'); return; }
      s.nickname = real;
      const first = !s.hero;
      s.career = m.el.querySelector('#pfCareer').value.trim();
      s.nick = nick; s.room = m.el.querySelector('#pfRoom').value; s.no = +m.el.querySelector('#pfNo').value || '';
      s.hero = Object.assign({}, s.hero || {}, { cls: h.cls, skin: h.skin, style: h.style, hc: h.hc, g: h.g || 'n' });
      localStorage.setItem(LS, JSON.stringify(s)); T.emit(); m.close();
      if (first) { T.confetti(120); T.toast(`⚔️ ${HERO_CLASSES[h.cls].name} ${nick} พร้อมผจญภัย!`, HERO_CLASSES[h.cls].perk, 'badge'); }
      if (T.user && T.fb) T.pushCloud().then(ok => ok ? T.toast('บันทึกฮีโร่แล้ว', `${s.nick} • ${s.room}`) : T.toast('บันทึกขึ้นระบบไม่สำเร็จ', 'ลองใหม่อีกครั้ง หรือแจ้งครู', 'err'));
    };
  };

  /* ---------- เริ่มทำงาน ---------- */
  T.boot = (active) => {
    T.renderChrome(active);
    if (!window.FIREBASE_CONFIG) { T.touchStreak(); if (!T.state.hero && /index\.html$|\/$/.test(location.pathname)) setTimeout(T.setupProfile, 600); }
    T.initFirebase();
  };
})();
