/* ห้องเรียนสด: จับเวลาเรียน • ครูคุมขั้นการสอน (5E) และเวลา • ข้อความถึงนักเรียน • “มองที่ครู” • นักเรียนยกมือขอความช่วยเหลือ */
(function () {
  const T = window.T2; if (!T) return;
  const esc = s => T.esc(s == null ? '' : String(s));
  const fmt = s => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const PH = { Engage: ['🎯', 'ขั้นนำ สร้างความสนใจ'], Explore: ['🔍', 'สำรวจ ทดลอง ค้นหา'], Explain: ['💬', 'อธิบาย สรุปความรู้'], Elaborate: ['🛠️', 'ขยายความรู้ นำไปใช้'], Evaluate: ['✅', 'ประเมินผล'] };
  window.CLASS_LIVE = (L, meta, root) => {
    const lid = 'l' + meta.id, secs = L.sections, plan = []; let acc = 0;
    secs.forEach(s => { plan.push({ s, from: acc, to: acc + (s.min || 0) }); acc += s.min || 0; });
    /* ---------- แถบเวลา (ทุกคน) ---------- */
    const SK = 't2_start_' + lid + '_' + T.today();
    if (!sessionStorage.getItem(SK)) sessionStorage.setItem(SK, Date.now());
    const bar = document.createElement('div'); bar.className = 'pace'; bar.innerHTML = `<div class="pace-in"><span class="pace-ic">⏱</span><div class="pace-tx"></div><div class="pace-bar"><i></i></div><button class="pace-rs" title="เริ่มนับเวลาใหม่">↺</button></div>`;
    root.querySelector('.lmain').prepend(bar);
    bar.querySelector('.pace-rs').onclick = () => { sessionStorage.setItem(SK, Date.now()); paint(); };
    let live = null, lastFocus = false;
    const curSec = () => { if (window.LESSON_CUR) return LESSON_CUR(); let best = secs[0].id; root.querySelectorAll('section.lsec[id^="s-"]').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .4) best = el.id.slice(2); }); return best; };
    const paint = () => {
      const now = Date.now(), tx = bar.querySelector('.pace-tx'), fill = bar.querySelector('.pace-bar i');
      root.querySelectorAll('.lsec.live-on,.ltab.live-on').forEach(e => e.classList.remove('live-on'));
      if (live && live.lid === lid && live.until > now - 60000) {
        const left = (live.until - now) / 1000, s = secs.find(x => x.id === live.sec);
        bar.classList.add('is-live'); bar.classList.toggle('late', left <= 0);
        tx.innerHTML = `<b>👩‍🏫 ครูกำหนด:</b> ${s ? `${s.phase && T.tview() ? PH[s.phase][0] + ' ' + s.phase + ' • ' : ''}${esc(s.title)}` : ''} • ${left > 0 ? `เหลือ <b>${fmt(left)}</b>` : '<b>หมดเวลาแล้ว</b>'}${live.msg ? `<span class="pace-msg">💬 ${esc(live.msg)}</span>` : ''}`;
        fill.style.width = Math.min(100, 100 - left / ((live.min || 1) * 60) * 100) + '%';
        const el = document.getElementById('s-' + live.sec); if (el) el.classList.add('live-on'); root.querySelectorAll('.ltab').forEach(b => b.classList.toggle('live-on', (b.dataset.secs || '').split(',').includes(live.sec)));
      } else {
        bar.classList.remove('is-live', 'late');
        const m = (now - +sessionStorage.getItem(SK)) / 60000, p = plan.find(x => m < x.to) || plan[plan.length - 1];
        tx.innerHTML = `ใช้ไป <b>${Math.floor(m)} นาที</b> จากเวลาแนะนำ ${acc} นาที • ตอนนี้ควรอยู่ที่ <b>${p.s.phase && T.tview() ? PH[p.s.phase][0] + ' ' + p.s.phase + ' • ' : ''}${esc(p.s.title)}</b>${m > acc ? ' • <b style="color:#dc2626">เกินเวลาแนะนำแล้ว</b>' : ''}`;
        fill.style.width = Math.min(100, m / acc * 100) + '%';
      }
      const want = !!(live && live.lid === lid && live.focus && !T.isTeacher());
      if (want !== lastFocus) { lastFocus = want; let f = document.getElementById('focusOv'); if (want) { if (!f) { f = document.createElement('div'); f.id = 'focusOv'; f.className = 'focus-ov'; document.body.appendChild(f); } f.innerHTML = `<div><div class="big-emoji">👀</div><h2>มองที่ครูก่อนนะ</h2><p>${esc(live.msg || 'ครูกำลังอธิบาย จะกลับมาทำต่อได้เมื่อครูปลดล็อก')}</p></div>`; } else if (f) f.remove(); }
    };
    setInterval(paint, 1000); paint();
    /* ---------- ตำแหน่งปัจจุบันของนักเรียน (ส่งให้ครูดู ทุก ~45 วินาที) ---------- */
    let lastAt = 0;
    addEventListener('scroll', () => { if (!T.user || (T.isTeacherReal || T.isTeacher)()) return; const now = Date.now(); if (now - lastAt < 45000) return; lastAt = now; T.state.at = { lid, sec: curSec(), ts: now }; T.save(); }, { passive: true });
    /* ---------- รับคำสั่งสดจากครู ---------- */
    let sub = false;
    const subscribe = () => { if (sub || !T.fb || !T.ready) return; sub = true; try { const { db, doc, onSnapshot } = T.fb; onSnapshot(doc(db, 'config', 'app'), sn => { live = (sn.exists() && sn.data().live) || null; paint(); }, () => { }); } catch (e) { } };
    T.on(subscribe); subscribe();
    /* ---------- แผงครู ---------- */
    const tb = document.createElement('button'); tb.className = 'teach-fab'; tb.innerHTML = '🎛️ ส่วนควบคุมสำหรับครู'; tb.style.display = 'none'; document.body.appendChild(tb);
    T.on(() => { tb.style.display = T.isTeacher() ? '' : 'none'; });
    let users = [], timer = null;
    const loadUsers = async () => { try { const { db, collection, getDocs } = T.fb; const q = await getDocs(collection(db, 'users')); users = q.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) { users = []; } };
    const panel = () => {
      const strip = h => String(h || '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const notes = (window.TEACH_NOTES || {})[meta.id] || {}, slides = (window.TEACH_SLIDES || {})[meta.id] || '', total = secs.reduce((a, s) => a + (s.min || 0), 0);
      const planHTML = `<div class="tpl-top"><div><b>${esc(meta.title)}</b><small>หน่วยที่ ${meta.unit} • ${esc(meta.model || '')} • เวลาตามแผน ${total} นาที • ${esc((meta.ind || []).join(', '))}</small></div>${slides ? `<a class="btn gold" href="${slides}" target="_blank" rel="noopener">🖥️ เปิดสไลด์ประกอบการสอน (Canva)</a>` : '<span class="pill soon">ยังไม่มีสไลด์ของกิจกรรมนี้</span>'}</div>
        <div class="tpl-list">${secs.map((s, i) => { const ns = notes[s.id]; const sm = strip(s.html); return `<div class="tpl-row"><div class="tpl-ph">${s.phase ? `<span class="ph ph-${s.phase}">${PH[s.phase][0]} ${s.phase}</span>` : `<span class="ph">ขั้นที่ ${i + 1}</span>`}<small>${s.min || 0} นาที</small></div><div><b>${esc(s.title)}</b>${ns ? `<ul>${ns.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${esc(sm.slice(0, 150))}${sm.length > 150 ? '…' : ''}</p>`}<button class="btn sm ghost" data-goto="${s.id}">ไปที่หัวข้อนี้</button></div></div>`; }).join('')}</div>`;
      const m = T.modal(`<h3>🎛️ ส่วนควบคุมสำหรับครู • เควส ${ACT(meta.id)}</h3>
        <div class="tp-tabs"><button data-tpt="plan" class="on">📋 แผนการสอน</button><button data-tpt="ctl">🎛️ คุมชั้นเรียน</button><button data-tpt="sv">👀 ดูมุมนักเรียน</button><button data-tpt="peer">🤝 เพื่อนช่วยเพื่อน</button></div>
        <div class="tp-pane" data-pane="peer" hidden><div class="pp-root"></div></div>
        <div class="tp-pane" data-pane="plan">${planHTML}</div>
        <div class="tp-pane" data-pane="sv" hidden><div class="sv-form"><label><span class="flabel">ห้อง</span><select id="svRoom">${(window.ROOMS || []).map(r => `<option>${esc(r)}</option>`).join('')}</select></label><label><span class="flabel">เลขที่ <small class="muted">(ไม่บังคับ)</small></span><input type="number" min="1" max="60" id="svNo" placeholder="เช่น 5"></label><button class="btn gold" id="svGo">👀 เปิดมุมนักเรียน</button></div></div>
        <div class="tp-pane" data-pane="ctl" hidden><div class="tp-grid"><div><span class="flabel">1. ขั้นการสอนตอนนี้</span><div class="tp-steps">${secs.map(s => `<button data-s="${s.id}" class="${live && live.sec === s.id && live.lid === lid ? 'on' : ''}">${s.phase ? `<span class="ph ph-${s.phase}">${PH[s.phase][0]} ${s.phase}</span>` : ''}${esc(s.title)}<small>แนะนำ ${s.min} นาที</small></button>`).join('')}</div>
          <span class="flabel">2. ให้เวลา (นาที)</span><div class="tp-min">${[3, 5, 10, 15, 20].map(n => `<button data-n="${n}">${n}</button>`).join('')}<input type="number" min="1" max="120" id="tpMin" placeholder="อื่น ๆ"></div>
          <span class="flabel">3. ข้อความถึงนักเรียน <small class="muted">(ไม่บังคับ)</small></span><input id="tpMsg" maxlength="120" placeholder="เช่น ทำเควสของต้นข้าวให้เสร็จก่อน แล้วรอเพื่อน" value="${esc((live && live.msg) || '')}">
          <label class="tp-chk"><input type="checkbox" id="tpFocus" ${live && live.focus ? 'checked' : ''}> 👀 ล็อกหน้าจอให้นักเรียน “มองที่ครู”</label>
          <div class="row" style="gap:8px;margin-top:10px"><button class="btn gold" id="tpGo">📣 ส่งให้นักเรียน</button><button class="btn ghost" id="tpStop">หยุดคุมเวลา</button></div></div>
          <div><span class="flabel">นักเรียนอยู่ขั้นไหน <small class="muted">(อัปเดตทุก 20 วินาที)</small></span><div id="tpAt" class="tp-at">กำลังโหลด…</div>
          <span class="flabel">✋ ยกมือขอความช่วยเหลือ</span><div id="tpHelp" class="tp-help">กำลังโหลด…</div>
          <details class="tp-5e"><summary>📖 สอนแบบ 5E กับแพลตฟอร์มนี้</summary><ol><li><b>🎯 Engage</b> เปิดหัวข้อ “เริ่มภารกิจ” ฉายสถานการณ์ ให้นักเรียนเลือกโหมด</li><li><b>🔍 Explore</b> ให้เวลาสำรวจ/เล่นเกม คอยดูแผง “นักเรียนอยู่ขั้นไหน” และตอบคนที่ยกมือ</li><li><b>💬 Explain</b> กด “มองที่ครู” แล้วสรุปความรู้จากสมุดความรู้ในเกมร่วมกัน</li><li><b>🛠️ Elaborate</b> ปลดล็อก ให้ทำชิ้นงาน โหมด Hard ทำโจทย์ขยาย</li><li><b>✅ Evaluate</b> ให้ทำแบบทดสอบท้ายคาบและ E-Ticket แล้วอ่านคำตอบในหน้าครู</li></ol></details></div></div></div>`, { cls: 'wide' });
      const showTab = k => { sessionStorage.setItem('t2_tpt', k); m.el.querySelectorAll('[data-tpt]').forEach(b => b.classList.toggle('on', b.dataset.tpt === k)); m.el.querySelectorAll('[data-pane]').forEach(x => x.hidden = x.dataset.pane !== k); if (k === 'peer' && T.peerPanel && !m.el.dataset.pp) { m.el.dataset.pp = 1; T.peerPanel(m.el.querySelector('.pp-root')); } };
      m.el.querySelectorAll('[data-tpt]').forEach(b => b.onclick = () => showTab(b.dataset.tpt)); showTab(sessionStorage.getItem('t2_tpt') || 'plan');
      m.el.querySelector('#svGo').onclick = () => T.setSV({ room: m.el.querySelector('#svRoom').value, no: +m.el.querySelector('#svNo').value || 0 });
      m.el.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { m.close(); const h = '#s-' + b.dataset.goto; if (location.hash !== h) { location.hash = h; return; } const x = document.getElementById('s-' + b.dataset.goto); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      let sel = live && live.lid === lid ? live.sec : curSec(), min = 0;
      const stepBtns = m.el.querySelectorAll('[data-s]'); const mark = () => stepBtns.forEach(b => b.classList.toggle('on', b.dataset.s === sel)); mark();
      stepBtns.forEach(b => b.onclick = () => { sel = b.dataset.s; const s = secs.find(x => x.id === sel); min = s.min; m.el.querySelectorAll('[data-n]').forEach(x => x.classList.toggle('on', +x.dataset.n === min)); m.el.querySelector('#tpMin').value = ''; mark(); });
      m.el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { min = +b.dataset.n; m.el.querySelector('#tpMin').value = ''; m.el.querySelectorAll('[data-n]').forEach(x => x.classList.toggle('on', x === b)); });
      const save = async v => { try { const { db, doc, setDoc } = T.fb; await setDoc(doc(db, 'config', 'app'), { live: v }, { merge: true }); T.toast(v ? '📣 ส่งให้นักเรียนแล้ว' : 'หยุดคุมเวลาแล้ว', v ? `${secs.find(x => x.id === v.sec).title} • ${v.min} นาที` : ''); } catch (e) { T.toast('ส่งไม่สำเร็จ', e.code || '', 'err'); } };
      m.el.querySelector('#tpGo').onclick = () => { const n = +m.el.querySelector('#tpMin').value || min || (secs.find(x => x.id === sel) || {}).min || 10; save({ lid, sec: sel, min: n, until: Date.now() + n * 60000, msg: m.el.querySelector('#tpMsg').value.trim(), focus: m.el.querySelector('#tpFocus').checked, ts: Date.now() }); };
      m.el.querySelector('#tpStop').onclick = () => save(null);
      const draw = async () => {
        if (!m.el.isConnected) { clearInterval(timer); return; }
        await loadUsers(); const now = Date.now();
        const here = users.filter(u => u.at && u.at.lid === lid && now - u.at.ts < 20 * 60000);
        m.el.querySelector('#tpAt').innerHTML = here.length ? secs.map(s => { const n = here.filter(u => u.at.sec === s.id); return `<div class="tp-row"><span>${s.phase ? PH[s.phase][0] : '•'} ${esc(s.title)}</span><b>${n.length}</b><div class="tp-bar"><i style="width:${n.length / here.length * 100}%"></i></div></div>`; }).join('') : '<p class="muted" style="margin:0">ยังไม่มีนักเรียนเปิดบทนี้ในช่วง 20 นาทีที่ผ่านมา</p>';
        const hs = users.filter(u => u.help && u.help.lid === lid && now - u.help.ts < 3 * 36e5).sort((a, b) => a.help.ts - b.help.ts);
        m.el.querySelector('#tpHelp').innerHTML = hs.length ? hs.map(u => `<div class="tp-h"><b>${esc(u.nickname || u.nick || u.name || 'นักเรียน')}</b> <small>${esc(u.room || '')} ${u.no ? 'เลขที่ ' + esc(u.no) : ''}</small><span>${esc(u.help.msg)} • ${esc((secs.find(s => s.id === u.help.sec) || {}).title || '')}</span><small>${Math.round((now - u.help.ts) / 60000)} นาทีที่แล้ว</small></div>`).join('') : '<p class="muted" style="margin:0">ยังไม่มีใครยกมือ</p>';
      };
      clearInterval(timer); draw(); timer = setInterval(draw, 20000);
    };
    tb.onclick = panel;
  };
})();
