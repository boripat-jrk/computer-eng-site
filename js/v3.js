/* ส่วนเสริม v3: ชื่อจริง (ครู) • แต้มสะสม (แยกจาก XP) • โหมดผู้เยี่ยมชม */
(function () {
  const T = window.T2; if (!T) return;
  const E = s => T.esc(s == null ? '' : String(s));

  /* ---------- ชื่อจริง (ชื่อเล่น) สำหรับครู ---------- */
  T.rnMap = null;
  T.rnOn = () => T.isTeacher() && localStorage.getItem('t2-rn') === '1';
  T.rnLoad = async (force) => {
    if (!T.isTeacher() || !T.fb || (T.rnMap && !force)) return T.rnMap;
    const { db, collection, getDocs } = T.fb;
    try {
      const [u, r] = await Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'roster'))]);
      const ro = {}; r.forEach(d => ro[d.id] = d.data());
      const m = {}; u.forEach(d => { const x = d.data(), rr = ro[(x.email || '').toLowerCase()] || {}; m[d.id] = { name: rr.name || x.name || '', nick: rr.nickname || x.nickname || '', no: rr.no || x.no || '' }; });
      T.rnMap = m; T.emit();
    } catch (e) { console.warn('rn', e); }
    return T.rnMap;
  };
  T.rnText = uid => { const x = (T.rnMap || {})[uid]; if (!x || !(x.name || x.nick)) return ''; return x.name ? x.name + (x.nick ? ` (${x.nick})` : '') : `(${x.nick})`; };
  T.rnLine = uid => { if (!T.rnOn()) return ''; const t = T.rnText(uid); return t ? `<small class="rn">👤 ${E(t)}</small>` : ''; };
  const rnSync = () => { document.querySelectorAll('[data-rn]').forEach(b => b.classList.toggle('on', T.rnOn())); if (T.rnOn() && !T.rnMap) T.rnLoad(); };

  /* ---------- แต้มสะสม ---------- */
  T.hash = async c => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('t2pt:' + String(c).trim().toUpperCase())); return [...new Uint8Array(b)].slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join(''); };
  T.codes = () => (T.cfg && T.cfg.codes) || {};
  T.claimPts = cl => Object.keys(cl || {}).reduce((a, h) => a + ((T.codes()[h] || {}).pts || 0), 0);
  T.ptsOf = (bonusDoc, claims) => ((bonusDoc || {}).pt || 0) + T.claimPts(claims);
  T.myPts = () => (T.state.bpt || 0) + T.claimPts(T.state.claims);
  T.redeem = async raw => {
    const code = String(raw || '').trim().toUpperCase(); if (!code) return { ok: false, m: 'พิมพ์รหัสก่อน' };
    if (!T.user) return { ok: false, m: 'เข้าสู่ระบบก่อนรับแต้ม' };
    if (T.loadCfg) await T.loadCfg();
    const h = await T.hash(code), c = T.codes()[h];
    if (!c) return { ok: false, m: 'ไม่พบรหัสนี้ ตรวจตัวอักษรอีกครั้ง' };
    T.state.claims = T.state.claims || {};
    if (T.state.claims[h]) return { ok: false, m: 'รับแต้มจากรหัสนี้ไปแล้ว' };
    if (c.off) return { ok: false, m: 'ครูปิดรหัสนี้แล้ว' };
    if (c.exp && Date.now() > c.exp) return { ok: false, m: 'รหัสนี้หมดเวลาแล้ว' };
    if (c.room && c.room !== T.state.room) return { ok: false, m: `รหัสนี้สำหรับห้อง ${c.room}` };
    if (c.one && T.fb) { try { const { db, collection, query, where, getDocs } = T.fb; const q = await getDocs(query(collection(db, 'board'), where('cl', 'array-contains', h))); if (q.docs.some(d => d.id !== T.user.uid)) return { ok: false, m: 'รหัสนี้มีคนใช้ไปแล้ว (ใช้ได้ 1 คน)' }; } catch (e) { } }
    T.state.claims[h] = Date.now(); T.save();
    if (T.fb) { try { const { db, doc, setDoc } = T.fb; await T.pushCloud(); await setDoc(doc(db, 'board', T.user.uid), { cl: Object.keys(T.state.claims) }, { merge: true }); } catch (e) { } }
    return { ok: true, pts: c.pts, note: c.note || '' };
  };

  /* ---------- คลิก / สถานะ ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-rn]'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (!T.isTeacher()) return;
    const on = !T.rnOn(); localStorage.setItem('t2-rn', on ? '1' : '0');
    T.toast(on ? 'แสดงชื่อจริง (ชื่อเล่น) แล้ว' : 'ซ่อนชื่อจริงแล้ว', on ? 'เห็นเฉพาะบัญชีครู' : 'แสดงเฉพาะชื่อฮีโร่');
    if (on) T.rnLoad(); rnSync(); T.emit();
  });
  T.on(() => { if (T.ready) rnSync(); });
})();
