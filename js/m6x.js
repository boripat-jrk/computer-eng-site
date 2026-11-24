/* ม.6 กิจกรรมที่ 1.4 และ 1.5: ทีมฝ่ายเกียรติบัตร (แบ่งกลุ่มตามชนิดกีฬา จับเวลา นับยอด 300 ใบ) และสุ่มหัวข้อรายงาน
   ข้อมูลเก็บใน config/app (ระบบแปลงเป็น config/m6) → ct[<lid>_<ห้อง>] และ td[<lid>_<ห้อง>] ครูเขียน นักเรียนอ่านแบบเรียลไทม์
   ไม่แตะข้อมูลความคืบหน้าเดิมของนักเรียน */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const E = s => T.esc(s == null ? '' : String(s));
  const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const rk = (lid, room) => lid + String(room || '').replace(/[^0-9]+/g, '_');
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nosOf = (n, skip) => { const o = []; for (let i = 1; i <= n; i++) if (!skip.includes(i)) o.push(i); return o; };
  const myRoom = () => T.viewRoom ? T.viewRoom() : T.state.room;
  const myNo = () => +(T.viewNo ? T.viewNo() : T.state.no) || 0;

  /* ---------- รับข้อมูลแบบเรียลไทม์ ---------- */
  let cfgDoc = {}, sub = false; const views = [];
  const subscribe = () => {
    if (sub || !T.fb || !T.ready) return; sub = true;
    try { const { db, doc, onSnapshot } = T.fb; onSnapshot(doc(db, 'config', 'app'), sn => { cfgDoc = (sn.exists() && sn.data()) || {}; views.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }, () => { }); } catch (e) { }
  };
  const write = async (field, key, val) => { const { db, doc, setDoc } = T.fb; await setDoc(doc(db, 'config', 'app'), { [field]: { [key]: val } }, { merge: true }); };

  const css = document.createElement('style');
  css.textContent = `.x-tp{border:1.5px dashed #F59E0B;border-radius:16px;padding:14px 16px;background:#FFFBEB;margin:12px 0}.x-tp h4{margin:0 0 8px;font:700 16px var(--h);color:#92400E}
.x-form{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}.x-form label{display:grid;gap:3px;font:600 13px var(--h);color:var(--navy)}.x-form input,.x-form select{padding:7px 9px;border:1.5px solid #D5DCF3;border-radius:10px;font:15px var(--b);width:110px}.x-form input.w{width:180px}.x-form input.url{width:320px}
.x-clock{display:flex;align-items:center;gap:12px;margin:10px 0;padding:10px 14px;border-radius:14px;background:#0F1B4C;color:#fff}.x-clock b{font:700 34px var(--h);min-width:100px;text-align:center}.x-clock.end{background:#B91C1C}.x-clock span{flex:1;font:600 15px var(--h)}
.x-bar{margin:10px 0;padding:12px 14px;border-radius:14px;background:#F5F8FF;border:1.5px solid #DCE3FA}.x-bar .tr{height:16px;border-radius:99px;background:#E3E8F8;overflow:hidden;margin-top:6px}.x-bar .tr i{display:block;height:100%;background:linear-gradient(90deg,#F59E0B,#16A34A);transition:width .5s}.x-bar b{font:700 20px var(--h);color:var(--navy)}
.x-tb{width:100%;border-collapse:collapse;font-size:14px;margin-top:8px}.x-tb th,.x-tb td{border-bottom:1px solid #E5EAF8;padding:7px 8px;text-align:left;vertical-align:middle}.x-tb th{font:600 13px var(--h);color:var(--muted)}.x-tb tr.me td{background:#EEF3FF}.x-tb tr.ok td{background:#F0FDF4}
.x-mine{border:2px solid var(--blue);border-radius:16px;padding:14px 16px;background:#F5F8FF;margin:12px 0}.x-mine.ok{border-color:#16A34A;background:#F0FDF4}.x-mine h4{margin:0 0 6px;font:700 18px var(--h);color:var(--navy)}.x-mine p{margin:4px 0;font-size:15px}
.x-st{display:inline-block;padding:3px 10px;border-radius:99px;font:600 13px var(--h);background:#E0E7FF;color:#3730A3}.x-st.ok{background:#DCFCE7;color:#166534}
.x-sports{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.x-sports span{padding:4px 10px;border-radius:99px;background:#fff;border:1.5px solid #DCE3FA;font:600 13.5px var(--h)}
.x-topics{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:10px 0}.x-topic{border:1.5px solid #DCE3FA;border-radius:14px;padding:10px 12px;background:#fff}.x-topic.me{border:2px solid var(--blue);background:#F5F8FF}.x-topic b{display:block;font:600 15.5px var(--h);color:var(--navy)}.x-topic small{color:var(--muted);font-size:13.5px}
.x-topic details{margin-top:6px}.x-topic summary{cursor:pointer;font:600 13.5px var(--h);color:var(--blue)}.x-topic ol,.x-topic ul{margin:6px 0 0;padding-left:20px;font-size:14px;line-height:1.55}.x-topic a{word-break:break-all}
.x-roll{display:inline-grid;place-items:center;min-width:54px;padding:2px 8px;border-radius:10px;background:#EEF2FF;font:600 13px var(--h)}
@media(max-width:640px){.x-topics{grid-template-columns:1fr}.x-form input.url{width:100%}}`;
  document.head.appendChild(css);

  const roomSelect = room => `<label>ห้อง<select data-f="room">${(window.ROOMS || []).map(r => `<option ${r === room ? 'selected' : ''}>${r}</option>`).join('')}</select></label>`;

  /* =====================================================================
     1.4 ทีมฝ่ายจัดทำเกียรติบัตร “แก่นนครเกมส์” • 10 ชนิดกีฬา × 30 คน = 300 ใบ
     ===================================================================== */
  const DRIVE = { 'ม.6/7': 'https://drive.google.com/drive/folders/1mIQcbuEzfLkJ5fFIU7P-S0ms1GSw8wfQ', 'ม.6/11': 'https://drive.google.com/drive/folders/1dvDCoJE1VpSpS9GnW9EyeashbRfrd683', 'ม.6/13': 'https://drive.google.com/drive/folders/1ypSUrbvHHa5TbtnlSaqU-HG3w4zzAVRX' };
  const SPORTS = ['ฟุตบอล', 'ฟุตซอล', 'บาสเกตบอล', 'วอลเลย์บอล', 'แบดมินตัน', 'เทเบิลเทนนิส', 'เซปักตะกร้อ', 'เปตอง', 'กรีฑา', 'ว่ายน้ำ'];
  const SP_EM = ['⚽', '🥅', '🏀', '🏐', '🏸', '🏓', '🦶', '🟤', '🏃', '🏊'];
  window.CT_SPORTS = SPORTS;
  const makeTeams = (n, g, skip) => {
    const nos = shuffle(nosOf(n, skip)); g = Math.max(1, Math.min(g, 10, nos.length));
    const base = Math.floor(nos.length / g), extra = nos.length % g, out = []; let p = 0;
    for (let i = 0; i < g; i++) { const size = base + (i < extra ? 1 : 0); out.push({ m: nos.slice(p, p + size).sort((a, b) => a - b), s: [], done: [] }); p += size; }
    SPORTS.forEach((_, i) => out[i % g].s.push(i));
    return out;
  };

  W.certteam = (el, cfg, key) => {
    const lid = key.split(':')[0]; let room = '', tick = null;
    const draw = () => {
      const teacher = T.isTeacher(); if (!room) room = teacher ? (window.ROOMS || [])[0] : myRoom(); if (!teacher) room = myRoom();
      const k = rk(lid, room), all = cfgDoc.ct || {}, data = all[k]; const no = myNo();
      const drive = (data && data.drive) || DRIVE[room] || '';
      const teams = data ? data.groups : [];
      const doneSports = teams.reduce((a, g) => a + (g.done || []).length, 0), total = doneSports * 30;
      const mineIdx = data && !teacher ? teams.findIndex(g => g.m.includes(no)) : -1, mine = mineIdx >= 0 ? teams[mineIdx] : null;
      let h = `<div class="w-head"><span class="w-tag"><i data-lucide="users"></i>ภารกิจทีม</span>${cfg.title ? `<h4>${cfg.title}</h4>` : ''}${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;
      if (data && data.until) h += `<div class="x-clock"><span>⏱ เวลาที่เหลือก่อนส่งเกียรติบัตรเข้าโฟลเดอร์กลาง • ${E(room)}</span><b></b></div>`;
      h += `<div class="x-bar">🏅 เกียรติบัตรที่ส่งเข้าโฟลเดอร์กลางแล้ว <b>${total}</b> / 300 ใบ <span class="muted" style="font-size:13.5px">(${doneSports}/10 ชนิดกีฬา • ครูตรวจในไดรฟ์แล้วกดยืนยัน)</span><div class="tr"><i style="width:${Math.round(total / 3)}%"></i></div></div>`;
      const sportsOf = g => g.s.map(i => `<span>${SP_EM[i]} ${SPORTS[i]}${(g.done || []).includes(i) ? ' ✅' : ''}</span>`).join('');
      const table = (meIdx, tch) => `<table class="x-tb"><tr><th>ทีม</th><th>ชนิดกีฬา (ชีต)</th><th>สมาชิก (เลขที่)</th>${tch ? '<th>ยืนยันว่าส่งครบ</th>' : '<th>สถานะ</th>'}</tr>${teams.map((g, i) => `<tr class="${i === meIdx ? 'me' : ''} ${(g.done || []).length === g.s.length ? 'ok' : ''}"><td><b>${i + 1}</b></td><td>${g.s.map(s => SP_EM[s] + ' ' + SPORTS[s]).join('<br>')}</td><td>${g.m.join(', ')}</td><td>${tch ? g.s.map(s => `<label style="display:block;font-size:13.5px"><input type="checkbox" data-done="${i}:${s}" ${(g.done || []).includes(s) ? 'checked' : ''}> ${SPORTS[s]}</label>`).join('') : `<span class="x-st ${(g.done || []).length === g.s.length ? 'ok' : ''}">${(g.done || []).length}/${g.s.length} ชีต</span>`}</td></tr>`).join('')}</table>`;
      if (teacher) {
        h += `<div class="x-tp"><h4>🎛️ สำหรับครู: แบ่งทีม จับเวลา และยืนยันยอด</h4><div class="x-form">${roomSelect(room)}
          <label>จำนวนนักเรียน<input type="number" data-f="n" min="2" max="60" value="${data ? data.n : 40}"></label>
          <label>จำนวนทีม<input type="number" data-f="g" min="1" max="10" value="${data ? teams.length : 10}"></label>
          <label>เลขที่ที่ไม่มาเรียน<input class="w" data-f="skip" placeholder="เช่น 5, 12" value="${data && data.skip ? E(data.skip.join(', ')) : ''}"></label>
          <button class="btn gold" data-make>🎲 ${data ? 'แบ่งทีมใหม่' : 'แบ่งทีม'}</button>${data ? '<button class="btn ghost" data-clear>ล้างทีม</button>' : ''}</div>
          <div class="x-form" style="margin-top:10px"><label>ลิงก์โฟลเดอร์ Google Drive กลางของห้องนี้ (แชร์ให้นักเรียนแก้ไขได้)<input class="url" data-f="drive" placeholder="https://drive.google.com/drive/folders/..." value="${E(drive)}"></label><button class="btn sm" data-drive>💾 บันทึกลิงก์</button></div>
          ${data ? `<div class="row" style="margin-top:10px">${[20, 25, 30].map(m => `<button class="btn sm" data-time="${m}">⏱ เริ่ม ${m} นาที</button>`).join('')}${data.until ? '<button class="btn sm ghost" data-time="0">หยุดเวลา</button>' : ''}</div>${table(-1, true)}` : '<p class="muted" style="margin:8px 0 0">ตั้งจำนวนทีมได้ 1–10 ทีม ถ้าน้อยกว่า 10 ทีม บางทีมจะได้ 2 ชนิดกีฬา</p>'}</div>`;
      } else if (!T.user) {
        h += '<p class="muted">เข้าสู่ระบบด้วยบัญชีโรงเรียนก่อน จึงจะเห็นทีมของตนเอง</p>';
      } else if (!data) {
        h += `<div class="x-mine"><h4>⏳ รอครูแบ่งทีม</h4><p>เมื่อครูกดแบ่งทีม หน้านี้จะแสดงทีมและชนิดกีฬาที่ได้รับของ ${E(room || 'ห้องเรา')} ทันที ระหว่างรอ ทำงานเดี่ยว “เกียรติบัตรสภานักเรียน” ให้เสร็จก่อน</p></div>`;
      } else {
        if (mine) {
          const full = (mine.done || []).length === mine.s.length;
          h += `<div class="x-mine ${full ? 'ok' : ''}"><span class="x-st ${full ? 'ok' : ''}">${full ? '✅ ครูยืนยันว่าทีมส่งครบแล้ว' : 'กำลังทำ • ครูยืนยันเมื่อเห็นไฟล์ในโฟลเดอร์กลาง'}</span>
            <h4>ทีมที่ ${mineIdx + 1} • ฝ่ายเกียรติบัตร</h4><div class="x-sports">${sportsOf(mine)}</div>
            <p>สมาชิก (เลขที่): <b>${mine.m.join(', ')}</b> • รับผิดชอบ <b>${mine.s.length * 30} ใบ</b></p>
            <ol style="margin:8px 0 0;padding-left:20px;font-size:14.5px;line-height:1.6"><li>เปิดไฟล์ <b>เกียรติบัตรแก่นนครเกมส์.docx</b> เลือกแหล่งข้อมูล <b>รายชื่อนักกีฬา แก่นนครเกมส์.xlsx</b> แล้วเลือกชีต <b>${mine.s.map(s => SPORTS[s]).join(' และ ')}</b></li><li>แทรกเขตข้อมูล 4 ช่อง ตรวจด้วย Preview Results แล้ว Finish &amp; Merge</li><li>บันทึกเป็น PDF ชื่อ <b>${mine.s.map(s => `ทีม${mineIdx + 1}-${SPORTS[s]}.pdf`).join(' และ ')}</b></li><li>อัปโหลดเข้าโฟลเดอร์กลางของห้อง แล้วกดปุ่มยกมือ “✅ ทำเสร็จแล้ว ขอให้ครูตรวจ”</li></ol>
            <div class="row" style="margin-top:8px">${drive ? `<a class="btn gold" href="${E(drive)}" target="_blank" rel="noopener"><i data-lucide="folder-open"></i>เปิดโฟลเดอร์กลางของห้อง</a>` : '<span class="muted">ครูยังไม่ได้ใส่ลิงก์โฟลเดอร์กลาง</span>'}</div></div>`;
          if (full) { T.state.ct = T.state.ct || {}; if (!T.state.ct[lid]) { T.state.ct[lid] = Date.now(); T.save(); T.markWidget(key, cfg.xp || 20, el); T.toast('🏅 ทีมส่งเกียรติบัตรครบแล้ว', 'ครูยืนยันยอดในโฟลเดอร์กลาง', 'badge'); } }
        } else h += `<div class="x-mine"><h4>ยังไม่พบเลขที่ ${no || ''} ในทีม</h4><p>ดูตารางด้านล่าง หรือกดยกมือแจ้งครูเพื่อเพิ่มเข้าทีม</p></div>`;
        h += `<details><summary style="cursor:pointer;font:600 14px var(--h);color:var(--blue)">ดูทีมทั้งหมดของ ${E(room)}</summary>${table(mineIdx, false)}</details>`;
      }
      el.innerHTML = h; T.icons(); paint();
      clearInterval(tick); tick = data && data.until ? setInterval(paint, 500) : null;
    };
    const paint = () => { const c = el.querySelector('.x-clock'); if (!c) return; const d = (cfgDoc.ct || {})[rk(lid, room)]; if (!d || !d.until) return; const left = (d.until - Date.now()) / 1000; c.classList.toggle('end', left <= 0); c.querySelector('b').textContent = left > 0 ? fmt(left) : 'หมดเวลา'; };
    el.addEventListener('change', async e => {
      const f = e.target.closest('[data-f="room"]'); if (f) { room = f.value; draw(); return; }
      const d = e.target.closest('[data-done]'); if (!d || !T.isTeacher()) return;
      const k = rk(lid, room), data = (cfgDoc.ct || {})[k]; if (!data) return; const [gi, si] = d.dataset.done.split(':').map(Number);
      const groups = data.groups.map((g, i) => { if (i !== gi) return g; const s = new Set(g.done || []); d.checked ? s.add(si) : s.delete(si); return Object.assign({}, g, { done: [...s] }); });
      try { await write('ct', k, Object.assign({}, data, { groups })); } catch (err) { T.toast('บันทึกไม่สำเร็จ', 'ลองใหม่อีกครั้ง', 'err'); }
    });
    el.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b || !T.isTeacher()) return;
      const k = rk(lid, room), data = (cfgDoc.ct || {})[k]; const v = f => (el.querySelector(`[data-f="${f}"]`) || {}).value || '';
      try {
        if (b.dataset.make != null) {
          const n = Math.max(2, Math.min(60, +v('n') || 0)), g = Math.max(1, Math.min(10, +v('g') || 0));
          const skip = v('skip').split(/[^0-9]+/).map(Number).filter(x => x >= 1 && x <= n);
          if (data && data.groups.some(x => (x.done || []).length) && !confirm('มีทีมที่ยืนยันยอดแล้ว แบ่งใหม่จะล้างยอดของห้องนี้ ต้องการแบ่งใหม่หรือไม่')) return;
          await write('ct', k, { room, n, skip, groups: makeTeams(n, g, skip), drive: v('drive') || (data && data.drive) || DRIVE[room] || '', until: 0, at: Date.now() }); T.toast('🎲 แบ่งทีมแล้ว', `${room} • ${g} ทีม`);
        } else if (b.dataset.clear != null) { if (!confirm('ล้างทีมของห้องนี้หรือไม่')) return; await write('ct', k, null); }
        else if (b.dataset.drive != null) { await write('ct', k, Object.assign({ room, n: 40, skip: [], groups: [] }, data || {}, { drive: v('drive').trim() })); T.toast('💾 บันทึกลิงก์โฟลเดอร์แล้ว', room); }
        else if (b.dataset.time != null && data) { const m = +b.dataset.time; await write('ct', k, Object.assign({}, data, { until: m ? Date.now() + m * 60000 : 0 })); }
      } catch (err) { console.warn('ct', err); T.toast('บันทึกไม่สำเร็จ', 'ลองใหม่อีกครั้ง', 'err'); }
    });
    views.push(draw); T.on(() => { subscribe(); draw(); }); subscribe(); draw();
  };

  /* =====================================================================
     1.5 เล่มรายงานเรื่องที่ฉันสนใจ • 10 หัวข้อ + ครูสุ่มหัวข้อให้นักเรียนรายคน
     ===================================================================== */
  const TOPICS = [
    { em: '⚖️', t: 'พ.ร.บ.คอมพิวเตอร์ ที่วัยรุ่นต้องรู้', q: 'การกระทำใดบนอินเทอร์เน็ตที่ผิด พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ และมีโทษอย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'สาระสำคัญของ พ.ร.บ.คอมพิวเตอร์ (ฉบับที่ 2) พ.ศ. 2560', 'ตัวอย่างการกระทำที่ผิดกฎหมาย เช่น แชร์ข้อมูลเท็จ เจาะระบบ ใช้รหัสผ่านผู้อื่น', 'ข้อควรปฏิบัติสำหรับนักเรียน', 'สรุป'],
      s: [['ไอลอว์ (iLaw): สรุป พ.ร.บ.คอมพิวเตอร์ 2560', 'https://ilaw.or.th/'], ['สำนักงานคณะกรรมการกฤษฎีกา: ค้นตัวบทกฎหมาย', 'https://www.krisdika.go.th/'], ['ไทยพีบีเอส: ข่าวเกี่ยวกับ พ.ร.บ.คอมพิวเตอร์', 'https://www.thaipbs.or.th/']] },
    { em: '🔐', t: 'PDPA: ข้อมูลส่วนบุคคลของเรา', q: 'พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ให้สิทธิอะไรแก่เรา และองค์กรต้องดูแลข้อมูลอย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'ข้อมูลส่วนบุคคลและข้อมูลอ่อนไหวคืออะไร', 'สิทธิของเจ้าของข้อมูล', 'ตัวอย่างสถานการณ์ในโรงเรียนและโซเชียลมีเดีย', 'สรุป'],
      s: [['สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)', 'https://www.pdpc.or.th/'], ['สำนักงาน คปภ.: คู่มือ PDPA สำหรับประชาชน', 'https://www.oic.or.th/'], ['มหาวิทยาลัยสุโขทัยธรรมาธิราช: สรุป PDPA', 'https://www.stou.ac.th/']] },
    { em: '🎨', t: 'ลิขสิทธิ์กับผลงานที่สร้างจาก AI', q: 'ภาพ เพลง หรือข้อความที่สร้างด้วย AI มีลิขสิทธิ์หรือไม่ และใช้อย่างไรให้ถูกต้อง',
      h: ['ความเป็นมาและความสำคัญ', 'หลักการคุ้มครองลิขสิทธิ์ในประเทศไทย', 'ผลงานจาก AI กับเจ้าของลิขสิทธิ์', 'แนวทางใช้ AI สร้างผลงานอย่างถูกต้อง', 'สรุป'],
      s: [['กรมประชาสัมพันธ์: ผลงานจาก AI กับลิขสิทธิ์', 'https://www.prd.go.th/th/content/category/detail/id/31/iid/531615'], ['มติชนออนไลน์: ประเด็นลิขสิทธิ์ผลงาน AI', 'https://www.matichon.co.th/'], ['กรมทรัพย์สินทางปัญญา', 'https://www.ipthailand.go.th/']] },
    { em: '🎭', t: 'Deepfake: ภาพและเสียงปลอมด้วย AI', q: 'Deepfake คืออะไร ถูกนำไปใช้หลอกลวงอย่างไร และเราจะสังเกตได้อย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'Deepfake ทำงานอย่างไร', 'ตัวอย่างการหลอกลวงด้วย Deepfake', 'วิธีสังเกตและป้องกัน', 'สรุป'],
      s: [['ธนาคารกรุงเทพ (Bangkok Bank Grow Club): Deepfake', 'https://www.bangkokbank.com/'], ['ไทยพีบีเอส (Thai PBS Now): Deepfake', 'https://www.thaipbs.or.th/now/content/219'], ['ไทยรัฐออนไลน์: ETDA กับเนื้อหาที่สร้างด้วย AI', 'https://www.thairath.co.th/']] },
    { em: '📰', t: 'ข่าวปลอมและการตรวจสอบข้อเท็จจริง', q: 'ข่าวปลอมแพร่กระจายได้อย่างไร มีผลทางกฎหมายหรือไม่ และตรวจสอบได้อย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'ลักษณะของข่าวปลอม', 'ผลกระทบและความผิดตามกฎหมาย', 'ขั้นตอนตรวจสอบข่าวก่อนแชร์', 'สรุป'],
      s: [['Thai PBS Verify: ตรวจสอบข่าว', 'https://www.thaipbs.or.th/verify'], ['ศูนย์ต่อต้านข่าวปลอม (Anti-Fake News Center)', 'https://www.antifakenewscenter.com/'], ['ไอลอว์ (iLaw): ข่าวปลอมกับกฎหมาย', 'https://ilaw.or.th/']] },
    { em: '💬', t: 'การกลั่นแกล้งบนโลกออนไลน์ (Cyberbullying)', q: 'การกลั่นแกล้งออนไลน์มีรูปแบบใด ส่งผลอย่างไร และควรรับมืออย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'รูปแบบของการกลั่นแกล้งออนไลน์', 'ผลกระทบต่อผู้ถูกกระทำ', 'วิธีรับมือและขอความช่วยเหลือ', 'สรุป'],
      s: [['THE STANDARD: Safe Internet Lab', 'https://thestandard.co/'], ['ThaiJO: บทความวิชาการเรื่อง Cyberbullying', 'https://www.tci-thaijo.org/'], ['UNICEF Thailand: การกลั่นแกล้งออนไลน์', 'https://www.unicef.org/thailand/th']] },
    { em: '📞', t: 'แก๊งคอลเซ็นเตอร์และบัญชีม้า', q: 'มิจฉาชีพหลอกลวงทางโทรศัพท์และออนไลน์อย่างไร และการรับจ้างเปิดบัญชีม้าผิดกฎหมายอย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'รูปแบบการหลอกลวงที่พบบ่อย', 'บัญชีม้าและโทษตาม พ.ร.ก.ปราบปรามอาชญากรรมทางเทคโนโลยี พ.ศ. 2566', 'วิธีป้องกันและแจ้งเหตุ', 'สรุป'],
      s: [['กรมประชาสัมพันธ์: พ.ร.ก. ปราบปรามอาชญากรรมทางเทคโนโลยี', 'https://www.prd.go.th/th/content/category/detail/id/9/iid/262413'], ['PPTV Online: บัญชีม้า', 'https://www.pptvhd36.com/'], ['ไทยพับลิก้า: ภัยแก๊งคอลเซ็นเตอร์', 'https://thaipublica.org/']] },
    { em: '🤖', t: 'ใช้ AI ช่วยเรียนอย่างมีจริยธรรม', q: 'นักเรียนจะใช้ AI เช่น ChatGPT หรือ Gemini ช่วยเรียนอย่างไรให้ได้ประโยชน์ และไม่ผิดหลักความซื่อสัตย์',
      h: ['ความเป็นมาและความสำคัญ', 'ประโยชน์ของ AI ต่อการเรียน', 'ความเสี่ยง เช่น ข้อมูลผิด การคัดลอกผลงาน', 'แนวทางใช้ AI อย่างมีจริยธรรม (UNESCO)', 'สรุป'],
      s: [['UNESCO: Guidance for generative AI in education', 'https://www.unesco.org/en/digital-education/artificial-intelligence'], ['ThaiJO: AI กับการศึกษา', 'https://www.tci-thaijo.org/'], ['GotoKnow: แนวทาง UNESCO ฉบับภาษาไทย', 'https://www.gotoknow.org/']] },
    { em: '💿', t: 'ซอฟต์แวร์ละเมิดลิขสิทธิ์', q: 'การใช้โปรแกรมหรือเกมเถื่อนผิดกฎหมายอย่างไร มีความเสี่ยงอะไร และมีทางเลือกอะไรที่ถูกกฎหมาย',
      h: ['ความเป็นมาและความสำคัญ', 'ซอฟต์แวร์ละเมิดลิขสิทธิ์คืออะไร', 'ความผิดตามกฎหมายและความเสี่ยงด้านความปลอดภัย', 'ทางเลือกที่ถูกกฎหมาย เช่น ซอฟต์แวร์ฟรีและโอเพนซอร์ส', 'สรุป'],
      s: [['ไทยพีบีเอส: ซอฟต์แวร์ละเมิดลิขสิทธิ์', 'https://www.thaipbs.or.th/'], ['ทรูปลูกปัญญา: ลิขสิทธิ์ซอฟต์แวร์', 'https://www.trueplookpanya.com/'], ['กรมทรัพย์สินทางปัญญา', 'https://www.ipthailand.go.th/']] },
    { em: '🛡️', t: 'ภัยไซเบอร์และ พ.ร.บ.การรักษาความมั่นคงปลอดภัยไซเบอร์', q: 'ภัยไซเบอร์ที่พบบ่อยมีอะไรบ้าง และประเทศไทยมีหน่วยงานและกฎหมายดูแลอย่างไร',
      h: ['ความเป็นมาและความสำคัญ', 'ภัยไซเบอร์ที่พบบ่อย เช่น ฟิชชิง มัลแวร์ แรนซัมแวร์', 'สาระสำคัญของ พ.ร.บ.ไซเบอร์ พ.ศ. 2562 และ สกมช.', 'วิธีป้องกันตนเอง', 'สรุป'],
      s: [['สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช.)', 'https://www.ncsa.or.th/'], ['ThaiCERT', 'https://www.thaicert.or.th/'], ['มติชนออนไลน์: พ.ร.บ.ไซเบอร์', 'https://www.matichon.co.th/']] }
  ];
  window.TD_TOPICS = TOPICS;
  const assign = (n, skip) => { const nos = shuffle(nosOf(n, skip)); const order = shuffle(TOPICS.map((_, i) => i)); const map = {}; nos.forEach((no, i) => { map[no] = order[i % TOPICS.length]; }); return map; };
  const topicCard = (t, i, me) => `<div class="x-topic ${me ? 'me' : ''}"><b>${t.em} หัวข้อที่ ${i + 1} ${t.t}</b><small>${t.q}</small>
    <details ${me ? 'open' : ''}><summary>หัวข้อย่อยที่แนะนำ (ใส่ในแม่แบบ) และแหล่งข้อมูลตั้งต้น</summary><ul><li><b>สาระสำคัญ › หัวข้อย่อยที่ 1:</b> ${t.h[1]}</li><li><b>สาระสำคัญ › หัวข้อย่อยที่ 2:</b> ${t.h[2]}</li><li><b>ตัวอย่างสถานการณ์ / ข้อควรปฏิบัติ:</b> ${t.h[3]}</li></ul><b style="display:block;margin-top:6px;font-size:13.5px">แหล่งข้อมูลตั้งต้น (ค้นต่อเองได้ อย่างน้อย 3 แหล่ง)</b><ul>${t.s.map(s => `<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a></li>`).join('')}</ul></details></div>`;

  W.topicdraw = (el, cfg, key) => {
    const lid = key.split(':')[0]; let room = '';
    const draw = () => {
      const teacher = T.isTeacher(); if (!room) room = teacher ? (window.ROOMS || [])[0] : myRoom(); if (!teacher) room = myRoom();
      const k = rk(lid, room), data = (cfgDoc.td || {})[k]; const no = myNo(); const map = (data && data.map) || {};
      const mine = !teacher && map[no] != null ? +map[no] : -1;
      let h = `<div class="w-head"><span class="w-tag"><i data-lucide="list-checks"></i>หัวข้อรายงาน</span>${cfg.title ? `<h4>${cfg.title}</h4>` : ''}${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;
      if (teacher) {
        const cnt = TOPICS.map((_, i) => Object.values(map).filter(v => +v === i).length);
        h += `<div class="x-tp"><h4>🎛️ สำหรับครู: สุ่มหัวข้อให้นักเรียน</h4><div class="x-form">${roomSelect(room)}
          <label>จำนวนนักเรียน<input type="number" data-f="n" min="1" max="60" value="${data ? data.n : 40}"></label>
          <label>เลขที่ที่ไม่มาเรียน<input class="w" data-f="skip" placeholder="เช่น 5, 12" value="${data && data.skip ? E(data.skip.join(', ')) : ''}"></label>
          <button class="btn gold" data-roll>🎲 ${data ? 'สุ่มใหม่ทั้งห้อง' : 'สุ่มหัวข้อทั้งห้อง'}</button>${data ? '<button class="btn ghost" data-clear>ล้าง</button>' : ''}</div>
          <p class="muted" style="margin:8px 0 0;font-size:13.5px">ระบบกระจายหัวข้อให้แต่ละหัวข้อมีจำนวนคนใกล้เคียงกัน • เพิ่มเลขที่ที่มาสาย หรือสุ่มใหม่รายคน ได้ที่ช่องด้านล่าง</p>
          ${data ? `<div class="x-form" style="margin-top:10px"><label>เลขที่<input type="number" data-f="one" min="1" max="60" placeholder="เช่น 7"></label><button class="btn sm" data-one>🎲 สุ่มให้เลขที่นี้</button></div>
          <table class="x-tb"><tr><th>หัวข้อ</th><th>เลขที่</th></tr>${TOPICS.map((t, i) => `<tr><td>${t.em} ${i + 1}. ${t.t}</td><td>${Object.keys(map).filter(x => +map[x] === i).map(Number).sort((a, b) => a - b).join(', ') || '-'} <span class="x-roll">${cnt[i]} คน</span></td></tr>`).join('')}</table>` : ''}</div>`;
      } else if (!T.user) h += '<p class="muted">เข้าสู่ระบบด้วยบัญชีโรงเรียนก่อน จึงจะเห็นหัวข้อของตนเอง</p>';
      else if (!data) h += `<div class="x-mine"><h4>⏳ รอครูสุ่มหัวข้อ</h4><p>เมื่อครูกดสุ่ม หัวข้อของเลขที่ ${no || ''} จะขึ้นที่นี่ทันที ระหว่างรอ ดาวน์โหลดแม่แบบและเปิดดูตัวอย่างเล่มก่อนได้</p></div>`;
      else if (mine < 0) h += `<div class="x-mine"><h4>ยังไม่มีหัวข้อของเลขที่ ${no || ''}</h4><p>กดยกมือแจ้งครูเพื่อสุ่มหัวข้อให้</p></div>`;
      else {
        const t = TOPICS[mine]; h += `<div class="x-mine ok"><span class="x-st ok">หัวข้อของฉัน • เลขที่ ${no}</span><h4>${t.em} ${t.t}</h4><p>${t.q}</p></div>`;
        T.state.td = T.state.td || {}; if (T.state.td[lid] !== mine) { T.state.td[lid] = mine; T.save(); }
      }
      h += `<div class="x-topics">${TOPICS.map((t, i) => topicCard(t, i, i === mine)).join('')}</div>`;
      el.innerHTML = h; T.icons();
    };
    el.addEventListener('change', e => { const f = e.target.closest('[data-f="room"]'); if (f) { room = f.value; draw(); } });
    el.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b || !T.isTeacher()) return;
      const k = rk(lid, room), data = (cfgDoc.td || {})[k]; const v = f => (el.querySelector(`[data-f="${f}"]`) || {}).value || '';
      try {
        if (b.dataset.roll != null) {
          const n = Math.max(1, Math.min(60, +v('n') || 0)), skip = v('skip').split(/[^0-9]+/).map(Number).filter(x => x >= 1 && x <= n);
          if (data && !confirm('สุ่มใหม่ทั้งห้อง หัวข้อเดิมของทุกคนจะเปลี่ยน ต้องการสุ่มใหม่หรือไม่')) return;
          await write('td', k, { room, n, skip, map: assign(n, skip), at: Date.now() }); T.toast('🎲 สุ่มหัวข้อแล้ว', room);
        } else if (b.dataset.clear != null) { if (!confirm('ล้างหัวข้อของห้องนี้หรือไม่')) return; await write('td', k, null); }
        else if (b.dataset.one != null && data) {
          const one = +v('one'); if (!one) return; const map = Object.assign({}, data.map); const cnt = TOPICS.map((_, i) => Object.values(map).filter(x => +x === i).length);
          const min = Math.min(...cnt), pool = TOPICS.map((_, i) => i).filter(i => cnt[i] === min && i !== map[one]); map[one] = (pool.length ? pool : TOPICS.map((_, i) => i))[Math.floor(Math.random() * (pool.length || TOPICS.length))];
          await write('td', k, Object.assign({}, data, { map, skip: (data.skip || []).filter(x => x !== one) })); T.toast(`🎲 เลขที่ ${one}`, TOPICS[map[one]].t);
        }
      } catch (err) { console.warn('td', err); T.toast('บันทึกไม่สำเร็จ', 'ลองใหม่อีกครั้ง', 'err'); }
    });
    views.push(draw); T.on(() => { subscribe(); draw(); }); subscribe(); draw();
  };
})();
