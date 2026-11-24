/* ยกมือแบบ Zoom (นักเรียน) • รายการมือที่ยกและส่วนควบคุมสำหรับครู • แสดงทุกหน้าเมื่อเข้าสู่ระบบแล้ว */
(function () {
  const T = window.T2; if (!T) return;
  const esc = s => T.esc(s == null ? '' : String(s));
  const PAGE = { 'index': 'หน้าแรก', 'missions': 'ภารกิจทั้งหมด', 'unit': 'หน่วยการเรียน', 'profile': 'โปรไฟล์', 'points': 'แต้มสะสม', 'leaderboard': 'อันดับ', 'pets': 'สัตว์เลี้ยง', 'attendance': 'เช็กชื่อ', 'teacher': 'เมนูครู', 'game': 'เกม' };
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  const onLesson = page === 'lesson', lessonId = +new URLSearchParams(location.search).get('id') || 0;
  const where = () => onLesson ? { lid: 'l' + lessonId, sec: window.LESSON_CUR ? LESSON_CUR() : '' } : { lid: 'p:' + page, sec: '' };
  const placeOf = h => { if (!h) return ''; if (/^l\d+$/.test(h.lid || '')) { const id = +h.lid.slice(1), l = (window.LESSONS || []).find(x => x.id === id), s = (((window.LESSON || {}).id === id && LESSON.sections) || []).find(x => x.id === h.sec);
    return 'กิจกรรมที่ ' + (window.ACT ? ACT(id) : id) + (s ? ' • ' + s.title : l ? ' • ' + l.title : ''); } return PAGE[(h.lid || '').slice(2)] || ''; };
  const isT = () => !!(T.user && (T.isTeacherReal || T.isTeacher)() );
  const FRIEND = ['❓ ไม่เข้าใจขั้นตอนนี้', '📂 หาไฟล์หรือเมนูไม่เจอ', '💻 ใช้โปรแกรมไม่คล่อง', '👀 ขอเพื่อนดูงานให้หน่อย'];
  const REASONS = ['🙋 มีคำถาม', '❓ ไม่เข้าใจขั้นตอนนี้', '📂 หาไฟล์หรือลิงก์ไม่เจอ', '💻 เครื่องหรือโปรแกรมมีปัญหา', '✅ ทำเสร็จแล้ว ขอให้ครูตรวจ', '⏳ ขอเวลาเพิ่ม'];
  const ago = ts => { const m = Math.max(0, Math.round((Date.now() - ts) / 60000)); return m < 1 ? 'เมื่อสักครู่' : m + ' นาทีที่แล้ว'; };
  const plog = () => { const l = T.state.pl = T.state.pl || { a: [], h: [] }; l.a = (l.a || []).slice(-60); l.h = (l.h || []).slice(-60); return l; };
  const mk = (tag, cls) => { const e = document.createElement(tag); e.className = cls; if (tag === 'button') e.type = 'button'; document.body.appendChild(e); return e; };
  const init = () => {
    /* ---------- นักเรียน: ยกมือ ---------- */
    const hb = mk('button', 'help-fab'), hm = mk('div', 'hand-pop'); hm.hidden = true; hb.style.display = 'none';
    const myHand = () => { const h = T.state && T.state.help; return h && Date.now() - h.ts < 3 * 36e5 ? h : null; };
    const hpaint = () => { const h = myHand(); hb.classList.toggle('on', !!h); hb.innerHTML = h ? `✋ ยกมืออยู่ <small>${esc(h.msg)}</small>` : '✋ ยกมือ'; hb.title = h ? 'กดเพื่อลดมือ' : 'ยกมือขอให้ครูหรือเพื่อนช่วย';
      if (h && h.to === 'friend') hb.innerHTML = `🤝 ขอเพื่อนช่วยอยู่ <small>${helper ? esc(helper) + ' กำลังมาช่วย' : esc(h.msg)}</small>`; hb.style.display = T.user && !isT() && !(T.guest && T.guest()) ? '' : 'none'; };
    const push = () => { T.save(); T.pushCloud && T.pushCloud(); };
    hb.onclick = e => { e.stopPropagation(); if (myHand()) { T.state.help = null; push(); hm.hidden = true; hpaint(); return; }
      hm.innerHTML = `<b>👩‍🏫 ขอครูช่วย</b>${REASONS.map(r => `<button type="button" data-r="${esc(r)}">${esc(r)}</button>`).join('')}<b class="hp-sep">🤝 ขอเพื่อนในห้องช่วย</b>${FRIEND.map(r => `<button type="button" data-r="${esc(r)}" data-f="1">${esc(r)}</button>`).join('')}`; pp.hidden = true; hm.hidden = !hm.hidden; };
    hm.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; const f = !!b.dataset.f; helper = '';
      T.state.help = Object.assign(where(), { msg: b.dataset.r, ts: Date.now() }, f ? { to: 'friend' } : {}); if (f) plog().a.push({ ts: T.state.help.ts, msg: b.dataset.r, lid: T.state.help.lid, sec: T.state.help.sec, by: '' }); push(); hm.hidden = true; hpaint();
      T.toast(f ? '🤝 ขอเพื่อนช่วยแล้ว' : '✋ ยกมือแล้ว', f ? 'เพื่อนในห้องเห็นคำขอแล้ว ช่วยกันเรียนรู้นะ' : 'ครูเห็นชื่อและเหตุผลของเราแล้ว รอสักครู่'); });
    /* ---------- นักเรียน: รายการเพื่อนที่ขอความช่วยเหลือ (ปุ่มเล็ก เงียบ ไม่เด้ง เปิดดูเมื่อกดเท่านั้น) ---------- */
    let helper = '', peers = [], pSub = false, mSub = false;
    const pb = mk('button', 'peer-fab'), pp = mk('div', 'hand-pop peer-list'); pp.hidden = true; pb.style.display = 'none';
    const myRoom = () => (T.state && T.state.room) || '';
    const helpingId = () => { const x = T.state && T.state.helping; return x && Date.now() - x.ts < 3 * 36e5 ? x.uid : ''; };
    const ppaint = () => { const me = T.user && T.user.uid, list = peers.filter(u => u.id !== me && u.room === myRoom()), n = list.length, student = T.user && !isT() && !(T.guest && T.guest());
      pb.style.display = student && n ? '' : 'none'; pb.innerHTML = `🤝 เพื่อนขอช่วย <b>${n}</b>`; pb.title = 'เพื่อนในห้องที่ขอความช่วยเหลือ (กดเพื่อดู)';
      if (!pp.hidden) pp.innerHTML = `<b>🤝 เพื่อนที่ขอความช่วยเหลือ (${n})</b><p class="muted pl-note">ทำงานของตัวเองให้ถึงจุดที่พักได้ก่อน แล้วค่อยไปช่วยเพื่อน</p>` + (n ? list.map(u => { const mine = helpingId() === u.id;
        return `<div class="hl-row"><div><b>${esc(u.nick || 'เพื่อน')}</b><small>${esc(u.peer.msg || '')} • ${esc(placeOf(u.peer))} • ${ago(u.peer.ts)}</small></div><button type="button" class="pl-go${mine ? ' on' : ''}" data-help="${esc(u.id)}" data-nick="${esc(u.nick || '')}">${mine ? 'กำลังช่วย ✓' : 'ไปช่วย'}</button></div>`; }).join('') : '<p class="muted" style="margin:6px 0 0">ตอนนี้ยังไม่มีเพื่อนขอความช่วยเหลือ</p>'); };
    const pListen = () => { if (pSub || !T.fb || !T.user || isT() || (T.guest && T.guest())) return; pSub = true;
      try { const { db, collection, query, where: W, onSnapshot } = T.fb;
        onSnapshot(query(collection(db, 'board'), W('peer.ts', '>', Date.now() - 3 * 36e5)), q => { peers = q.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(u => u.peer && u.peer.ts).sort((a, b) => a.peer.ts - b.peer.ts);
          if (helpingId() && !peers.some(u => u.id === helpingId())) { T.state.helping = null; push(); } ppaint(); }, () => { }); } catch (e) { } };
    const mListen = () => { if (mSub || !T.fb || !T.user || isT()) return; mSub = true;
      try { const { db, collection, query, where: W, onSnapshot } = T.fb;
        onSnapshot(query(collection(db, 'board'), W('helping.uid', '==', T.user.uid)), q => { const h = myHand(); const d = q.docs.map(x => x.data()).find(x => x.helping && h && x.helping.ts >= h.ts);
          const nick = d ? (d.nick || 'เพื่อน') : ''; if (nick && nick !== helper && h && h.to === 'friend') { const r = plog().a.find(x => x.ts === h.ts); if (r && !(r.by || '').split(', ').includes(nick)) { r.by = r.by ? r.by + ', ' + nick : nick; push(); } } if (nick && nick !== helper && h && h.to === 'friend') T.toast('🤝 ' + nick + ' กำลังมาช่วย', 'ช่วยเสร็จแล้วกดปุ่มเพื่อลดมือ'); helper = nick; hpaint(); }, () => { }); } catch (e) { } };
    pb.onclick = e => { e.stopPropagation(); hm.hidden = true; pp.hidden = !pp.hidden; ppaint(); };
    pp.addEventListener('click', e => { const b = e.target.closest('[data-help]'); if (!b) return; const id = b.dataset.help;
      T.state.helping = helpingId() === id ? null : { uid: id, ts: Date.now() }; if (T.state.helping) { const u = peers.find(x => x.id === id) || {}, pr = u.peer || {}; plog().h.push({ ts: T.state.helping.ts, uid: id, nick: b.dataset.nick || '', msg: pr.msg || '', lid: pr.lid || '', sec: pr.sec || '' }); } push(); ppaint();
      if (T.state.helping) T.toast('🤝 ขอบคุณที่ช่วยเพื่อน', 'ไปช่วย ' + (b.dataset.nick || 'เพื่อน') + ' ได้เลย'); });
    let ackSub = false;
    const ackListen = () => { if (ackSub || !T.fb || !T.user || isT()) return; ackSub = true;
      try { const { db, doc, onSnapshot } = T.fb; onSnapshot(doc(db, 'bonus', T.user.uid), sn => { const a = sn.exists() && sn.data().helpAck, h = T.state.help;
        if (a && h && a >= h.ts) { T.state.help = null; push(); hpaint(); T.toast('👩‍🏫 ครูรับทราบแล้ว', 'ลดมือให้อัตโนมัติ'); } }, () => { }); } catch (e) { } };
    /* ---------- ครู: รายการมือที่ยก (ใต้ปุ่มส่วนควบคุม) ---------- */
    const kb = mk('button', 'hands-fab'), kp = mk('div', 'hand-pop hand-list'); kp.hidden = true; kb.style.display = 'none';
    let hands = [], hSub = false, helpers = {};
    const kpaint = () => { const n = hands.length; kb.classList.toggle('on', n > 0); kb.innerHTML = `✋ <b>${n}</b>`; kb.title = n ? `มีนักเรียนยกมือ ${n} คน` : 'ยังไม่มีใครยกมือ';
      if (!kp.hidden) kp.innerHTML = `<b>✋ นักเรียนที่ยกมือ (${n})</b>` + (n ? hands.map(u => `<div class="hl-row"><div><b>${esc(u.room || '')} เลขที่ ${esc(u.no || '-')}</b> ${esc(u.nickname || u.nick || u.name || 'นักเรียน')}<small>${u.help.to === 'friend' ? '🤝 ขอเพื่อน' + (helpers[u.id] ? ' (' + esc(helpers[u.id].join(', ')) + ' กำลังช่วย)' : ' (ยังไม่มีเพื่อนรับ)') + ' • ' : ''}${esc(u.help.msg || '')} • ${esc(placeOf(u.help))} • ${ago(u.help.ts)}</small></div><button type="button" data-ack="${esc(u.id)}" title="รับทราบและลดมือ">✓</button></div>`).join('') : '<p class="muted" style="margin:6px 0 0">ยังไม่มีใครยกมือ</p>') + '<button type="button" class="pl-sum" data-sum="1">🤝 เพื่อนช่วยเพื่อน • ให้แต้มสะสม</button>'; };
    const hListen = () => { if (hSub || !T.fb || !T.isTeacher()) return; hSub = true;
      try { const { db, collection, query, where: W, onSnapshot } = T.fb;
        onSnapshot(query(collection(db, 'users'), W('help.ts', '>', Date.now() - 3 * 36e5)), q => { hands = q.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(u => u.help && u.help.ts).sort((a, b) => a.help.ts - b.help.ts); kpaint(); }, () => { });
        onSnapshot(query(collection(db, 'board'), W('helping.ts', '>', Date.now() - 3 * 36e5)), q => { helpers = {}; q.docs.forEach(d => { const x = d.data(); if (x.helping && x.helping.uid) (helpers[x.helping.uid] = helpers[x.helping.uid] || []).push(x.nick || 'เพื่อน'); }); kpaint(); }, () => { }); } catch (e) { } };
    kb.onclick = e => { e.stopPropagation(); kp.hidden = !kp.hidden; kpaint(); };
    /* ---------- ครู: สรุปการขอให้เพื่อนช่วยและการช่วยเพื่อน (ย้อนหลัง) ---------- */
    const peerPanel = async root => { root.innerHTML = '<p class="muted">กำลังโหลด…</p>';
      let us = [], bon = {}; try { const { db, collection, getDocs } = T.fb; const [a, b] = await Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'bonus'))]);
        us = a.docs.map(d => Object.assign({ id: d.id }, d.data())); b.docs.forEach(d => bon[d.id] = d.data()); } catch (e) { root.innerHTML = '<p class="muted">โหลดข้อมูลไม่สำเร็จ</p>'; return; }
      const TE = (window.TEACHER_EMAILS || []); us = us.filter(u => u.room && !TE.includes((u.email || '').toLowerCase())); const nameOf = u => u ? (u.nickname || u.nick || u.name || 'นักเรียน') : '';
      const byId = Object.fromEntries(us.map(u => [u.id, u])); const rooms = [...new Set(us.map(u => u.room))].sort((a, b) => a.localeCompare(b, 'th', { numeric: true }));
      const d8 = ts => new Date(ts).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      const paid = id => (bon[id] || {}).peerPaid || [], gone = id => (bon[id] || {}).peerDel || []; let room = rooms[0] || '', amt = 1, onlyNew = true;
      const box = root.querySelector('p.muted'); const sel = document.createElement('div'); sel.className = 'ps-rooms'; box.replaceWith(sel); const out = document.createElement('div'); sel.after(out);
      const events = () => { const ev = []; us.filter(u => u.room === room).forEach(u => ((u.pl || {}).h || []).forEach(x => { const asker = byId[x.uid], ok = !!(asker && ((asker.pl || {}).a || []).some(a => a.by && a.by.split(', ').includes(u.nick || '') && Math.abs(a.ts - x.ts) < 3 * 36e5));
        if (!gone(u.id).includes(x.ts)) ev.push({ u, x, asker, ok, paid: paid(u.id).includes(x.ts) }); })); return ev.sort((a, b) => b.x.ts - a.x.ts); };
      const draw = () => { sel.innerHTML = rooms.map(r => `<button type="button" class="btn ${r === room ? '' : 'ghost'}" data-room="${esc(r)}">${esc(r)}</button>`).join('');
        const all = events(), ev = all.filter(e => !onlyNew || !e.paid), wait = all.filter(e => !e.paid).length;
        const rows = us.filter(u => u.room === room).map(u => { const l = u.pl || {}; return { u, a: l.a || [], h: l.h || [] }; }).sort((x, y) => (+x.u.no || 999) - (+y.u.no || 999));
        out.innerHTML = `<h4 class="ps-h">🤝 รายการช่วยเพื่อน • ห้อง ${esc(room)} <small>รอให้แต้ม ${wait} รายการ</small></h4>
          <div class="ps-bar"><label>ครั้งละ <select data-amt>${[1, 2].map(n => `<option value="${n}" ${n === amt ? 'selected' : ''}>+${n} แต้ม</option>`).join('')}</select></label>
            <label><input type="checkbox" data-only ${onlyNew ? 'checked' : ''}> ซ่อนรายการที่ให้แต้มแล้ว</label>
            <button type="button" class="btn" data-payall ${wait ? '' : 'disabled'}>⭐ ให้แต้มทุกรายการที่เพื่อนยืนยัน</button></div>
          <div class="ps-wrap"><table class="ps-tb"><thead><tr><th>เวลา</th><th>ผู้ช่วย</th><th>ช่วยใคร / เรื่อง</th><th>เพื่อนยืนยัน</th><th></th></tr></thead><tbody>${ev.map(e => `<tr><td>${d8(e.x.ts)}</td><td><b>${esc(e.u.no || '-')}</b> ${esc(nameOf(e.u))}</td><td>${esc(nameOf(e.asker) || e.x.nick || 'เพื่อน')}<small class="ps-it">${esc(e.x.msg || '')} • ${esc(placeOf(e.x))}</small></td><td>${e.ok ? '✅' : '<span class="muted" title="ผู้ขอยังไม่ได้รับแจ้งว่าเพื่อนคนนี้มาช่วย">—</span>'}</td><td class="ps-act">${e.paid ? '<span class="ps-paid">ให้แล้ว ✓</span>' : `<button type="button" class="pl-go ps-pay" data-pay="${esc(e.u.id)}" data-ts="${e.x.ts}">+${amt} แต้ม</button>`}<button type="button" class="ps-del" data-del="${esc(e.u.id)}" data-ts="${e.x.ts}" title="ลบรายการนี้ (กดผิด)${e.paid ? ' และหักแต้มที่ให้ไปคืน' : ''}">🗑️</button></td></tr>`).join('') || '<tr><td colspan="5" class="muted">ไม่มีรายการ</td></tr>'}</tbody></table></div>
          <details class="ps-more"><summary>📋 สรุปรายคน (ขอ/ช่วย)</summary><table class="ps-tb"><thead><tr><th>เลขที่</th><th>ชื่อเล่น</th><th>ขอให้เพื่อนช่วย</th><th>ช่วยเพื่อน</th><th>ได้แต้มช่วยเพื่อน</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.u.no || '-')}</td><td>${esc(nameOf(r.u))}</td><td>${r.a.length || '-'}</td><td>${r.h.filter(x => !gone(r.u.id).includes(x.ts)).length || '-'}</td><td>${paid(r.u.id).filter(t => !gone(r.u.id).includes(t)).length || '-'}</td></tr>`).join('')}</tbody></table></details>`; };
      const pay = async list => { const { db, doc, setDoc } = T.fb, at = Date.now(), R = (window.PT_REASONS || []).find(r => r[2] === 'ช่วยเหลือเพื่อน') || ['TEAM', 1, 'ช่วยเหลือเพื่อน'];
        const by = {}; list.forEach(e => (by[e.u.id] = by[e.u.id] || []).push(e));
        let n = 0; for (const id of Object.keys(by)) { const u = byId[id], cur = bon[id] || {}, items = by[id].filter(e => !(cur.peerPaid || []).includes(e.x.ts)); if (!items.length) continue;
          const pt = (cur.pt || 0) + amt * items.length, plog = [...(cur.plog || []), ...items.map(e => ({ pts: amt, note: 'ช่วยเหลือเพื่อน (' + (nameOf(e.asker) || e.x.nick || 'เพื่อน') + ' • ' + placeOf(e.x) + ')', at, c: R[0] }))].slice(-80), peerPaid = [...(cur.peerPaid || []), ...items.map(e => e.x.ts)].slice(-200), peerAmt = Object.assign({}, cur.peerAmt || {}); items.forEach(e => peerAmt[e.x.ts] = amt);
          try { await setDoc(doc(db, 'bonus', id), { pt, plog, peerPaid, peerAmt, email: u.email || '' }, { merge: true }); bon[id] = Object.assign({}, cur, { pt, plog, peerPaid, peerAmt }); n += items.length;
            try { await setDoc(doc(db, 'board', id), { pt: T.ptsOf ? T.ptsOf(bon[id], u.claims) : pt }, { merge: true }); } catch (e) { } } catch (e) { T.toast('บันทึกไม่สำเร็จ', e.code || '', 'err'); } }
        if (n) T.toast(`⭐ +${amt * n} แต้ม`, `ให้แต้มช่วยเหลือเพื่อน ${n} รายการ`); draw(); };
      out.addEventListener('change', e => { if (e.target.matches('[data-amt]')) { amt = +e.target.value; draw(); } if (e.target.matches('[data-only]')) { onlyNew = e.target.checked; draw(); } });
      const del = async ev => { const { db, doc, setDoc } = T.fb, id = ev.u.id, u = ev.u, cur = bon[id] || {}, at = Date.now(), patch = { peerDel: [...(cur.peerDel || []), ev.x.ts].slice(-200) };
        if (ev.paid) { const back = (cur.peerAmt || {})[ev.x.ts] || 1; patch.pt = (cur.pt || 0) - back; patch.plog = [...(cur.plog || []), { pts: -back, note: 'ยกเลิกแต้มช่วยเหลือเพื่อน (' + (nameOf(ev.asker) || ev.x.nick || 'เพื่อน') + ' • กดผิด)', at, c: 'TEAM' }].slice(-80); }
        try { await setDoc(doc(db, 'bonus', id), patch, { merge: true }); bon[id] = Object.assign({}, cur, patch);
          if (ev.paid) try { await setDoc(doc(db, 'board', id), { pt: T.ptsOf ? T.ptsOf(bon[id], u.claims) : patch.pt }, { merge: true }); } catch (e) { }
          T.toast('🗑️ ลบรายการแล้ว', ev.paid ? 'หักแต้มที่ให้ไปคืนแล้ว' : ''); } catch (e) { T.toast('ลบไม่สำเร็จ', e.code || '', 'err'); } draw(); };
      out.addEventListener('click', e => { const d = e.target.closest('[data-del]'); if (d) { if (!d.classList.contains('sure')) { d.classList.add('sure'); d.textContent = 'ยืนยันลบ'; setTimeout(() => { if (d.isConnected) { d.classList.remove('sure'); d.textContent = '🗑️'; } }, 4000); return; }
          d.disabled = true; const ev = events().find(x => x.u.id === d.dataset.del && x.x.ts === +d.dataset.ts); if (ev) del(ev); return; }
        const b = e.target.closest('[data-pay]'); if (b) { b.disabled = true; const ev = events().find(x => x.u.id === b.dataset.pay && x.x.ts === +b.dataset.ts); if (ev) pay([ev]); }
        if (e.target.closest('[data-payall]')) { const l = events().filter(x => !x.paid && x.ok); if (!l.length) { T.toast('ไม่มีรายการที่เพื่อนยืนยัน', 'กดให้แต้มทีละรายการได้'); return; } pay(l); } });
      sel.addEventListener('click', e => { const b = e.target.closest('[data-room]'); if (b) { room = b.dataset.room; draw(); } }); if (rooms.length) draw(); else out.innerHTML = '<p class="muted">ยังไม่มีข้อมูล</p>'; };
    T.peerPanel = peerPanel;
    const peerSummary = () => { kp.hidden = true; const m = T.modal('<h3>🤝 เพื่อนช่วยเพื่อน</h3><div class="pp-root"></div>', { cls: 'wide' }); peerPanel(m.el.querySelector('.pp-root')); };
    kp.addEventListener('click', async e => { if (e.target.closest('[data-sum]')) { peerSummary(); return; } const b = e.target.closest('[data-ack]'); if (!b) return; const id = b.dataset.ack; b.disabled = true;
      try { const { db, doc, setDoc } = T.fb; await setDoc(doc(db, 'bonus', id), { helpAck: Date.now() }, { merge: true }); await setDoc(doc(db, 'users', id), { help: null }, { merge: true }); } catch (err) { T.toast('ลดมือไม่สำเร็จ', err.code || '', 'err'); b.disabled = false; } });
    /* ---------- ครู: ส่วนควบคุมในหน้าที่ไม่ใช่หน้ากิจกรรม ---------- */
    let tb = null;
    if (!onLesson) { tb = mk('button', 'teach-fab'); tb.innerHTML = '🎛️ ส่วนควบคุมสำหรับครู'; tb.style.display = 'none';
      tb.onclick = () => { const ls = (window.LESSONS || []).filter(l => l.ready);
        const m = T.modal(`<h3>🎛️ ส่วนควบคุมสำหรับครู</h3>
          <div class="tp-tabs"><button data-tpt="main" class="on">🎛️ ทางลัดและกิจกรรม</button><button data-tpt="peer">🤝 เพื่อนช่วยเพื่อน</button></div>
          <div class="tp-pane" data-pane="peer" hidden><div class="pp-root"></div></div>
          <div class="tp-pane" data-pane="main"><div class="tc-quick">${[['points.html', '⭐', 'ให้แต้มสะสม'], ['attendance.html', '✅', 'เช็กชื่อ'], ['teacher.html', '🛡️', 'เมนูครู'], ['missions.html', '🎯', 'ภารกิจทั้งหมด']].map(x => `<a class="btn ghost" href="${x[0]}">${x[1]} ${x[2]}</a>`).join('')}</div>
          <span class="flabel">เปิดกิจกรรมเพื่อสอน (มีแผนการสอน คุมชั้นเรียน และดูมุมนักเรียน)</span>
          <div class="tc-acts">${ls.map(l => `<a href="lesson.html?id=${l.id}"><b>${window.ACT ? ACT(l.id) : l.id}</b>${esc(l.title)}</a>`).join('') || '<p class="muted">ยังไม่มีกิจกรรมที่เปิด</p>'}</div>
          <div class="row" style="margin-top:12px"><button class="btn ghost" id="tcStop">หยุดคุมเวลาที่ส่งถึงนักเรียน</button></div></div>`, { cls: 'wide' });
        let pLoaded = false; const show = k => { sessionStorage.setItem('t2_tct', k); m.el.querySelectorAll('[data-tpt]').forEach(b => b.classList.toggle('on', b.dataset.tpt === k)); m.el.querySelectorAll('[data-pane]').forEach(x => x.hidden = x.dataset.pane !== k); if (k === 'peer' && !pLoaded) { pLoaded = true; peerPanel(m.el.querySelector('.pp-root')); } };
        m.el.querySelectorAll('[data-tpt]').forEach(b => b.onclick = () => show(b.dataset.tpt)); show(sessionStorage.getItem('t2_tct') || 'main');
        m.el.querySelector('#tcStop').onclick = async () => { try { const { db, doc, setDoc } = T.fb; await setDoc(doc(db, 'config', 'app'), { live: null }, { merge: true }); T.toast('หยุดคุมเวลาแล้ว'); } catch (e) { T.toast('ทำไม่สำเร็จ', e.code || '', 'err'); } }; }; }
    document.addEventListener('click', e => { if (!hm.hidden && !hm.contains(e.target) && !hb.contains(e.target)) hm.hidden = true; if (!kp.hidden && !kp.contains(e.target) && !kb.contains(e.target)) kp.hidden = true; if (!pp.hidden && !pp.contains(e.target) && !pb.contains(e.target)) pp.hidden = true; });
    const all = () => { hpaint(); ackListen(); pListen(); mListen(); ppaint(); const t = T.user && T.isTeacher(); kb.style.display = t ? '' : 'none'; if (tb) tb.style.display = t ? '' : 'none'; hListen(); kpaint(); };
    T.on(all); all(); setInterval(() => { kpaint(); ppaint(); }, 30000);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', init); else init();
})();
