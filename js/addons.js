/* ส่วนเสริม v2: เมนูย่อยบทเรียน • ภารกิจทั้งหมด • แบบทดสอบประจำหน่วย • การแจ้งเตือนคะแนนจากครู */
(function () {
  const T = window.T2; if (!T) return;
  const E = s => T.esc(s == null ? '' : String(s));

  /* ---------- แบบทดสอบประจำหน่วย (10 ข้อ) ---------- */
  window.UNIT_TESTS = window.UNIT_TESTS || {
    1: { from: [[1, [2, 5, 7]], [2, [2, 5, 7]]], extra: [
      { q: 'ข้อมูลใดไม่ควรโพสต์ลงสื่อสังคมแบบสาธารณะ', c: ['รูปผลงานศิลปะที่ตัวเองวาด', 'เลขบัตรประชาชนและที่อยู่บ้าน', 'ความรู้สึกหลังดูหนังเรื่องโปรด', 'คะแนนเกมที่ทำได้'], a: 1, why: 'เลขบัตรประชาชนและที่อยู่เป็นข้อมูลส่วนบุคคลที่อาจถูกนำไปสวมรอยหรือทำให้ไม่ปลอดภัย' },
      { q: 'ก่อนกดแชร์ข่าวที่เพื่อนส่งมา ควรทำสิ่งใดเป็นอันดับแรก', c: ['แชร์ทันทีเพราะเพื่อนส่งมา', 'ตรวจแหล่งที่มาและเทียบกับสำนักข่าวที่เชื่อถือได้', 'ดูว่ามีคนกดถูกใจเยอะไหม', 'เปลี่ยนหัวข้อข่าวให้น่าสนใจขึ้น'], a: 1, why: 'ตรวจสอบแหล่งที่มาก่อนเสมอ ยอดไลก์ไม่ได้บอกว่าข่าวจริง' },
      { q: 'ใช้รหัสผ่านเดียวกันทุกบัญชี มีความเสี่ยงอย่างไร', c: ['ไม่มีความเสี่ยง เพราะจำง่าย', 'ถ้าบัญชีหนึ่งรั่ว บัญชีอื่นจะถูกเข้าถึงไปด้วย', 'ทำให้อินเทอร์เน็ตช้า', 'ทำให้ลืมรหัสบ่อย'], a: 1, why: 'ผู้ไม่หวังดีมักนำรหัสที่รั่วจากเว็บหนึ่งไปลองกับบัญชีอื่น ควรใช้รหัสต่างกันและเปิด 2FA' },
      { q: 'ผลลัพธ์ของโค้ดนี้คืออะไร', code: 'print(3 + 4 * 2)', c: ['14', '11', '10', '3 + 4 * 2'], a: 1, why: 'ไพทอนคูณก่อนบวก 4 × 2 = 8 แล้ว 3 + 8 = 11' }
    ] },
    2: { from: [[3, [0, 1, 2, 3, 5, 7]], [4, [0, 1, 3, 5, 6, 7]]], extra: [
      { q: 'กดเปิดคอมพิวเตอร์แล้วมีเสียงบี๊บเตือนซ้ำ ๆ และจอไม่แสดงผล สาเหตุที่เป็นไปได้มากที่สุดคือ', c: ['ไม่มีลำโพง', 'ไม่มี RAM หรือ RAM เสียบไม่แน่น', 'อินเทอร์เน็ตหลุด', 'แป้นพิมพ์เสีย'], a: 1, why: 'CPU ต้องใช้ RAM พักคำสั่งและข้อมูล ถ้าไม่มี RAM เครื่องจะเตือนด้วยเสียงบี๊บ' },
      { q: 'ภาพกีฬาสี 2 GB ต้องแชร์ให้สมาชิก 40 คน วิธีใดประหยัดอินเทอร์เน็ตของสมาชิกมากที่สุด', c: ['ส่งรูปทีละรูปในกลุ่มแชต', 'อัปโหลดไว้บนคลาวด์ครั้งเดียวแล้วแชร์ลิงก์แบบผู้ดู', 'แนบอีเมลส่งทีละคน', 'ส่งไฟล์ซ้ำทุกวัน'], a: 1, why: 'อัปโหลดครั้งเดียว ทุกคนเลือกดาวน์โหลดเฉพาะภาพที่ต้องการได้' }
    ] }
  };
  T.unitOpen = n => { const u = UNITS.find(x => x.n === n); const cu = (T.cfg && T.cfg.units) || {}; if (!u || !UNIT_TESTS[n]) return false; if (String(n) in cu) return !!cu[n]; return u.lessons.every(id => (LESSONS.find(l => l.id === id) || {}).ready); };

  T.classroomUrl = () => ((COURSE.links.rooms || {})[T.viewRoom ? T.viewRoom() : (T.state || {}).room] || COURSE.links.classroom);
  /* ---------- รายการงานของแต่ละภารกิจ ---------- */
  T.missionItems = l => {
    const s = T.state, id = l.id, nsec = (window.LESSON_SECTIONS || {})[id] || 0;
    const read = Object.keys(s.sec || {}).filter(k => k.startsWith('l' + id + ':')).length;
    const q = (s.quiz || {})['l' + id]; s.sent = s.sent || {};
    return [
      { em: '📖', t: 'เรียนเนื้อหาครบทุกหัวข้อ', d: nsec ? `อ่านแล้ว ${Math.min(read, nsec)}/${nsec} หัวข้อ` : 'เปิดอ่านในกิจกรรม', done: !!(s.done || {})['l' + id] || (nsec && read >= nsec), b: [`<a class="btn sm" href="lesson.html?id=${id}" target="_blank" rel="noopener">▶ เข้ากิจกรรม</a>`] },
      { em: '🛠️', t: l.task || 'ภาระงาน / ชิ้นงาน', d: 'ส่งงานที่แท็บ “ภารกิจในคาบเรียน” ของกิจกรรมนี้', done: !!s.sent['l' + id], b: [`<a class="btn sm green" href="lesson.html?id=${id}#t-task" target="_blank" rel="noopener">📤 ไปที่ส่วนส่งงาน</a>`, `<button class="btn sm ghost" data-sent="l${id}">${s.sent['l' + id] ? '↺ ยกเลิก' : '✓ ฉันส่งแล้ว'}</button>`] },
      { em: '📝', t: 'แบบทดสอบท้ายกิจกรรม (5 ข้อ)', d: q != null ? `คะแนนสูงสุด ${q} ข้อ • ผ่านเมื่อถูก 4 ข้อขึ้นไป` : 'ยังไม่ได้ทำ', done: q != null && q >= 4, b: [`<a class="btn sm" href="lesson.html?id=${id}#s-quiz" target="_blank" rel="noopener">📝 ทำแบบทดสอบ</a>`] },
      { em: '🏁', t: 'ผ่านกิจกรรม (รับเหรียญประจำกิจกรรม)', d: 'อ่านครบ ทำกิจกรรม และผ่านแบบทดสอบ', done: !!(s.done || {})['l' + id], b: [] }
    ];
  };
  T.missionPct = l => { const it = T.missionItems(l); return Math.round(it.filter(x => x.done).length / it.length * 100); };
  T.pendingCount = () => LESSONS.filter(l => l.ready).reduce((n, l) => n + T.missionItems(l).filter(x => !x.done && x.b.length).length, 0);

  /* ---------- เมนูย่อยบทเรียน + ตัวนับ ---------- */
  const renderMenus = () => {
    const m = document.getElementById('lmenu');
    if (m) { const op = m.querySelector('.lm-u.open'), keep = op ? op.dataset.u : (T._lmU || '');
      const cur = +(new URLSearchParams(location.search).get('id') || 0), cu = (LESSONS.find(l => l.id === cur) || {}).unit;
      m.innerHTML = `<a href="index.html#units"><i data-lucide="map"></i>เส้นทางหน่วยการเรียนทั้งหมด</a><a href="missions.html"><i data-lucide="target"></i>ภารกิจทั้งหมด</a><small class="dd-h">เลือกหน่วยการเรียนรู้</small><div class="lm-units">` + UNITS.map(u => { const ls = LESSONS.filter(l => l.unit === u.n), nr = ls.filter(l => l.ready).length;
        return `<div class="lm-u ${String(u.n) === String(keep) ? 'open' : ''} ${u.n === cu ? 'cur' : ''}" data-u="${u.n}" style="--uc:${u.color}"><button class="lm-ub" type="button"><span class="lnum">${u.n}</span><span class="lm-t"><b>หน่วยที่ ${u.n}</b><small>${E(u.short)}</small></span><em>${nr ? nr + '/' + ls.length : '🔒'}</em><i class="lm-ch">›</i></button>
        <div class="lm-sub"><small class="dd-h" style="color:${u.color}">หน่วยที่ ${u.n} ${E(u.title)}</small><a href="unit.html?u=${u.n}" class="lm-ov"><span class="lnum">📘</span>ภาพรวมหน่วย คำอธิบาย และแบบทดสอบ</a>${ls.map(l => l.ready ? `<a href="lesson.html?id=${l.id}" class="${l.id === cur ? 'on' : ''}"><span class="lnum act">${ACT(l.id)}</span>${E(l.title)}</a>` : `<span class="dis">🔒 ${ACT(l.id)} ${E(l.title)}</span>`).join('')}${UNIT_TESTS[u.n] ? (T.unitOpen(u.n) ? `<a href="unit.html?u=${u.n}#test"><span class="lnum">📝</span>แบบทดสอบประจำหน่วย</a>` : `<span class="dis">🔒 แบบทดสอบประจำหน่วย</span>`) : ''}</div></div>`; }).join('') + `</div>`; }
    const c = document.getElementById('msCnt'); if (c) { const n = T.user ? T.pendingCount() : 0; c.textContent = n || ''; c.style.display = n ? '' : 'none'; }
    renderBell(); T.icons();
  };

  /* ---------- การแจ้งเตือน ---------- */
  const seenKey = () => 't2-seen-' + (T.user ? T.user.uid : 'guest');
  const seen = () => +(localStorage.getItem(seenKey()) || 0);
  const notes = () => { const out = (T.blog || []).map(x => ({ at: x.at || 0, em: x.pts >= 0 ? '⭐' : '↩️', t: `ครูให้ ${x.pts > 0 ? '+' : ''}${x.pts} XP พิเศษ`, d: x.note || 'รางวัลจากครู', pts: x.pts, kind: 'pt', u: 'XP' }))
      .concat((T.plog || []).map(x => ({ at: x.at || 0, em: x.pts >= 0 ? '🌟' : '↩️', t: `ครูให้ ${x.pts > 0 ? '+' : ''}${x.pts} แต้มสะสม`, d: x.note || 'แต้มจากครู', pts: x.pts, kind: 'pt', u: 'แต้ม' })));
    (T.anns ? T.anns() : []).forEach(a => out.push({ at: a.at || 0, em: a.level === 'urgent' ? '🚨' : '📣', t: (a.title || 'ประกาศจากครู') + (T.isTeacher() ? ' • ' + T.annTarget(a) : ''), d: a.text }));
    return out.sort((x, y) => y.at - x.at); };
  function renderBell() {
    const n = T.user ? notes().filter(x => x.at > seen()).length : 0, c = document.getElementById('bellCnt'), m = document.getElementById('nmenu'); if (!c || !m) return;
    c.textContent = n || ''; c.style.display = n ? '' : 'none';
    const all = T.user ? notes() : [];
    m.innerHTML = `<small class="dd-h">การแจ้งเตือน</small>` + (!T.user ? '<div class="note"><span>🔑</span><div><small>เข้าสู่ระบบเพื่อดูการแจ้งเตือน</small></div></div>' : all.length ? all.slice(0, 10).map(x => `<div class="note ${x.at > seen() ? 'new' : ''}"><span>${x.em}</span><div><b>${x.t}</b><small>${E(x.d)}</small><time>${x.at ? new Date(x.at).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</time></div></div>`).join('') : '<div class="note"><span>📭</span><div><small>ยังไม่มีการแจ้งเตือน</small></div></div>');
  }
  let popped = false;
  const popup = () => {
    if (!T.user || document.querySelector('.npop')) return; const u = notes().filter(x => x.kind === 'pt' && x.at > seen()); if (!u.length) return;
    const sum = k => u.filter(x => x.u === k).reduce((a, x) => a + x.pts, 0), tx = sum('XP'), tp = sum('แต้ม'), tot = tx + tp, sg = n => (n > 0 ? '+' : '') + n;
    const head = [u.some(x => x.u === 'XP') ? sg(tx) + ' XP' : '', u.some(x => x.u === 'แต้ม') ? sg(tp) + ' แต้ม' : ''].filter(Boolean).join(' • ');
    const m = T.modal(`<div class="center npop"><div class="big-emoji">${tot >= 0 ? '🎉' : '📌'}</div><h3>ครูให้คะแนน ${head}</h3>
      <div class="mlist">${u.map(x => `<div><b class="${x.pts < 0 ? 'neg' : ''}">${sg(x.pts)} <small>${x.u}</small></b><span>${E(x.d)}</span><time>${new Date(x.at).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time></div>`).join('')}</div>
      <p class="muted" style="margin:10px 0 0">XP รวม ${T.xp()} XP${T.myPts ? ` • แต้มสะสม ${T.myPts()} แต้ม` : ''}</p><button class="btn gold" id="npOk" style="margin-top:12px">รับทราบ</button></div>`);
    if (tot > 0) T.confetti(80);
    const ok = () => { localStorage.setItem(seenKey(), Date.now()); renderBell(); m.close(); };
    m.el.querySelector('#npOk').onclick = ok;
  };
  let unsub = null;
  const live = () => {
    if (!T.user || !T.fb || !T.fb.onSnapshot || unsub) return;
    const { db, doc, onSnapshot } = T.fb;
    unsub = onSnapshot(doc(db, 'bonus', T.user.uid), snap => { const bd = snap.exists() ? snap.data() : {}; T.blog = bd.log || []; T.plog = bd.plog || []; T.state.bpt = bd.pt || 0; T.state.bonus = bd.total || 0; T.state.tb = bd.badges || []; renderMenus(); popup(); if (T.renderMe) T.renderMe(); }, () => { });
  };

  /* เมนูบทเรียน: เมาส์ชี้หน่วย = เมนูย่อยเด้งด้านข้าง • จอสัมผัส/มือถือ = แตะหน่วยเพื่อกางรายการ */
  document.addEventListener('mouseover', e => { if (!matchMedia('(hover:hover) and (min-width:901px)').matches) return; const u = e.target.closest('.lm-u'); if (!u) return; u.parentNode.querySelectorAll('.lm-u.open').forEach(x => x !== u && x.classList.remove('open')); u.classList.add('open'); T._lmU = u.dataset.u; });
  document.addEventListener('click', e => {
    const ub = e.target.closest('.lm-ub'); if (ub && matchMedia('(hover:hover) and (min-width:901px)').matches) { location.href = 'unit.html?u=' + ub.parentNode.dataset.u; return; }
    if (ub) { e.stopImmediatePropagation(); const u = ub.parentNode, was = u.classList.contains('open'); u.parentNode.querySelectorAll('.lm-u.open').forEach(x => x.classList.remove('open')); if (!was || matchMedia('(hover:hover) and (min-width:901px)').matches) { u.classList.add('open'); T._lmU = u.dataset.u; } else T._lmU = ''; return; }
    const b = e.target.closest('.bell'); if (b) setTimeout(() => { localStorage.setItem(seenKey(), Date.now()); const c = document.getElementById('bellCnt'); if (c) c.style.display = 'none'; }, 1500);
    const s = e.target.closest('[data-sent]'); if (s) { const k = s.dataset.sent; T.state.sent = T.state.sent || {}; if (T.state.sent[k]) delete T.state.sent[k]; else { T.state.sent[k] = Date.now(); T.toast('บันทึกว่าส่งแล้ว', 'อย่าลืมกด “ส่ง” ใน Classroom ด้วยนะ'); } T.save(); T.emit(); if (T.user) T.pushCloud(); }
  });
  T.on(() => { renderMenus(); if (T.ready) { live(); if (!popped && T.user) { popped = true; setTimeout(popup, 700); } } });
  addEventListener('DOMContentLoaded', () => setTimeout(renderMenus, 0));
  document.addEventListener('click', e => { const c = e.target.closest('a[data-classroom]'); if (c) c.href = T.classroomUrl(); }, true);
})();
