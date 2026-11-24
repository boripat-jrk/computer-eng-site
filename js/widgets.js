/* สื่อ Interactive */
(function () {
  const W = {}; window.WIDGETS = W;
  const esc = s => T2.esc(s);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const head = (cfg, icon, label) => `<div class="w-head"><span class="w-tag"><i data-lucide="${icon}"></i>${label}</span>${cfg.title ? `<h4>${cfg.title}</h4>` : ''}${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;
  const doneBadge = key => T2.state.wid[key] ? '<span class="w-done">✓ ทำแล้ว</span>' : '';
  const win = (el, key, xp) => { if (T2.markWidget(key, xp, el)) { el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 600); } const d = el.querySelector('.w-head'); if (d && !d.querySelector('.w-done')) d.insertAdjacentHTML('beforeend', '<span class="w-done">✓ ทำแล้ว</span>'); };

  /* ----- แบบทดสอบ / คำถาม • XP: ถูก +10 • เร็ว (≤20 วิ ไม่ใช้ตัวช่วย) +5 • ต่อเนื่อง +2/ข้อ (สูงสุด +6) • ถูกทุกข้อ +20 ----- */
  const QB = { fast: 5, fastSec: 20, combo: 2, comboMax: 6, perfect: 20 };
  W.quiz = (el, cfg, key) => {
    const qs = cfg.items; let i = 0, score = 0, t0 = 0, used = false, streak = 0, bonus = 0; let rec = [];
    el.innerHTML = head(cfg, cfg.final ? 'graduation-cap' : 'circle-help', cfg.final ? (cfg.unit ? 'แบบทดสอบประจำหน่วย' : 'แบบทดสอบท้ายกิจกรรม') : 'เช็กความเข้าใจ') + doneBadge(key) + '<div class="q-body"></div>';
    const body = el.querySelector('.q-body');
    const scoring = () => cfg.final && T2.state.quiz[cfg.lid] == null;
    const show = () => {
      if (i >= qs.length) return finish();
      const q = qs[i]; const opts = q.c.map((c, k) => ({ c, k })); t0 = Date.now(); used = false; body.classList.remove('q-bad', 'q-good');
      body.innerHTML = `${qs.length > 1 ? `<div class="q-prog"><span style="width:${i / qs.length * 100}%"></span></div><small class="muted">ข้อ ${i + 1} / ${qs.length}${scoring() ? ' • ⏱️ ตอบถูกภายใน 20 วินาทีได้โบนัส' : ''}</small>` : ''}
        <p class="q-text">${q.q}</p>${q.code ? `<pre class="code">${esc(q.code)}</pre>` : ''}
        <div class="q-opts">${opts.map(o => `<button data-k="${o.k}">${o.c}</button>`).join('')}</div>${q.c.length > 2 ? '<button class="q-hint">💡 ตัวช่วย: ตัดตัวเลือกผิด 1 ข้อ</button>' : ''}<div class="q-why"></div>`;
      const hb = body.querySelector('.q-hint'); if (hb) hb.onclick = () => { const wrong = [...body.querySelectorAll('.q-opts button')].filter(x => +x.dataset.k !== q.a && !x.disabled); if (wrong.length) { const w = wrong[Math.random() * wrong.length | 0]; w.disabled = true; w.classList.add('cut'); } used = true; hb.remove(); };
      body.querySelectorAll('.q-opts button').forEach(b => b.onclick = () => {
        const k = +b.dataset.k; const ok = k === q.a; const sec = (Date.now() - t0) / 1000;
        body.querySelectorAll('.q-opts button').forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('ok'); });
        if (!ok) b.classList.add('no');
        body.classList.add(ok ? 'q-good' : 'q-bad');
        let gain = '';
        if (ok) { score++; streak++; if (scoring()) { let n = XP.quizPerItem, parts = [`ถูก +${XP.quizPerItem}`]; if (sec <= QB.fastSec && !used) { n += QB.fast; parts.push(`เร็ว ${Math.round(sec)} วิ +${QB.fast}`); } const cb = Math.min((streak - 1) * QB.combo, QB.comboMax); if (cb > 0) { n += cb; parts.push(`ต่อเนื่อง ×${streak} +${cb}`); } bonus += n - XP.quizPerItem; gain = `<span class="q-gain">+${n} XP • ${parts.join(' • ')}</span>`; } }
        else streak = 0;
        rec.push(ok);
        const w = body.querySelector('.q-why');
        w.innerHTML = `<div class="${ok ? 'good' : 'bad'}">${ok ? '✅ ถูกต้อง!' : '❌ ยังไม่ใช่'} ${gain} ${q.why || ''}</div><button class="btn sm">${i + 1 < qs.length ? 'ข้อต่อไป →' : 'ดูผลลัพธ์'}</button>`;
        w.querySelector('button').onclick = () => { i++; show(); };
        T2.icons();
      });
      T2.icons();
    };
    const finish = () => {
      const pct = Math.round(score / qs.length * 100); body.classList.remove('q-bad', 'q-good');
      if (cfg.final) {
        const prev = T2.state.quiz[cfg.lid];
        const best = Math.max(prev == null ? -1 : prev, score);
        const firstTime = prev == null;
        T2.state.quiz[cfg.lid] = best; T2.save();
        if (firstTime) { let tot = score * XP.quizPerItem + bonus + (score === qs.length ? QB.perfect : 0); T2.addXP(tot, `ตอบถูก ${score} ข้อ${bonus ? ` • โบนัสเร็ว/ต่อเนื่อง +${bonus}` : ''}${score === qs.length ? ` • แม่นยำ +${QB.perfect}` : ''}`, el); }
        if (score === qs.length) T2.award('perfect');
        if (!cfg.unit) T2.checkLesson(+cfg.lid.slice(1)); else T2.emit();
        if (pct >= 70) T2.confetti(70);
      } else if (score === qs.length) win(el, key);
      body.innerHTML = `<div class="q-result"><div class="ring" style="--p:${pct}"><b>${score}/${qs.length}</b></div>
        <div><h4>${pct >= 70 ? '🎉 ผ่านแล้ว!' : '💪 ลองอีกครั้งนะ'}</h4><p>${cfg.final ? (pct >= 70 ? 'เยี่ยมมาก เก็บคะแนนสูงสุดไว้ให้แล้ว' : 'ทบทวนเนื้อหาแล้วทำใหม่ได้ (เกณฑ์ผ่าน 70%)') : (score === qs.length ? 'เข้าใจครบทุกข้อ' : 'ลองทำใหม่ให้ถูกทุกข้อเพื่อรับ XP')}</p>
        ${rec.length ? `<div class="q-dots">${rec.map((o, n) => `<span class="${o ? 'ok' : 'no'}" title="ข้อ ${n + 1}">${n + 1}</span>`).join('')}</div>` : ''}
        <button class="btn sm ghost">ทำอีกครั้ง</button></div></div>`;
      body.querySelector('button.btn').onclick = () => { i = 0; score = 0; streak = 0; bonus = 0; rec = []; show(); };
    };
    show();
  };

  /* ----- จัดหมวดหมู่ ----- */
  W.sort = (el, cfg, key) => {
    const items = shuffle(cfg.items.map((it, i) => Object.assign({ i }, it)));
    let pick = null; const place = {};
    el.innerHTML = head(cfg, 'shapes', 'จัดหมวดหมู่') + doneBadge(key) + `
      <p class="hint">👆 แตะการ์ด แล้วแตะกล่องที่ถูกต้อง (หรือลากวาง)</p>
      <div class="s-pool"></div><div class="s-buckets" style="--n:${cfg.buckets.length}">${cfg.buckets.map(b => `<div class="s-bucket" data-b="${b.id}"><div class="s-bh">${b.icon || ''} ${b.label}</div><div class="s-drop"></div></div>`).join('')}</div>
      <div class="row"><button class="btn sm s-check">ตรวจคำตอบ</button><button class="btn sm ghost s-reset">เริ่มใหม่</button><span class="s-msg"></span></div>`;
    const pool = el.querySelector('.s-pool');
    const render = () => {
      pool.innerHTML = ''; el.querySelectorAll('.s-drop').forEach(d => d.innerHTML = '');
      items.forEach(it => {
        const c = document.createElement('button'); c.className = 'chip' + (pick === it.i ? ' sel' : ''); c.textContent = it.t; c.draggable = true;
        c.onclick = e => { e.stopPropagation(); pick = pick === it.i ? null : it.i; render(); };
        c.ondragstart = e => { e.dataTransfer.setData('text', it.i); };
        (place[it.i] ? el.querySelector(`.s-bucket[data-b="${place[it.i]}"] .s-drop`) : pool).appendChild(c);
      });
    };
    el.querySelectorAll('.s-bucket').forEach(b => {
      b.onclick = () => { if (pick == null) return; place[pick] = b.dataset.b; pick = null; render(); };
      b.ondragover = e => e.preventDefault();
      b.ondrop = e => { e.preventDefault(); place[e.dataTransfer.getData('text')] = b.dataset.b; render(); };
    });
    pool.ondragover = e => e.preventDefault(); pool.ondrop = e => { e.preventDefault(); delete place[e.dataTransfer.getData('text')]; render(); };
    el.querySelector('.s-reset').onclick = () => { Object.keys(place).forEach(k => delete place[k]); render(); el.querySelector('.s-msg').textContent = ''; };
    el.querySelector('.s-check').onclick = () => {
      let ok = 0; const total = items.length;
      el.querySelectorAll('.chip').forEach(c => c.classList.remove('ok', 'no'));
      items.forEach(it => { const c = [...el.querySelectorAll('.chip')].find(x => x.textContent === it.t); if (place[it.i] === it.b) { ok++; c.classList.add('ok'); } else if (place[it.i]) c.classList.add('no'); });
      const msg = el.querySelector('.s-msg');
      msg.innerHTML = ok === total ? '🎉 ถูกทั้งหมด!' : `ถูก ${ok}/${total} ข้อ ลองย้ายการ์ดสีแดง`;
      if (ok === total) win(el, key);
    };
    render();
  };

  /* ----- จับคู่ ----- */
  W.match = (el, cfg, key) => {
    const L = cfg.pairs.map((p, i) => ({ t: p.a, i })), R = shuffle(cfg.pairs.map((p, i) => ({ t: p.b, i })));
    let sel = null; const matched = new Set();
    el.innerHTML = head(cfg, 'link', 'จับคู่') + doneBadge(key) + `<p class="hint">แตะคำทางซ้าย แล้วแตะความหมายทางขวาที่คู่กัน</p>
      <div class="m-grid"><div class="m-col">${L.map(x => `<button class="m-l" data-i="${x.i}">${x.t}</button>`).join('')}</div><div class="m-col">${R.map(x => `<button class="m-r" data-i="${x.i}">${x.t}</button>`).join('')}</div></div><div class="m-msg"></div>`;
    el.querySelectorAll('.m-l').forEach(b => b.onclick = () => { if (matched.has(+b.dataset.i)) return; el.querySelectorAll('.m-l').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = +b.dataset.i; });
    el.querySelectorAll('.m-r').forEach(b => b.onclick = () => {
      if (sel == null || matched.has(+b.dataset.i)) return;
      if (+b.dataset.i === sel) { matched.add(sel); b.classList.add('ok'); el.querySelector(`.m-l[data-i="${sel}"]`).classList.replace('sel', 'ok'); sel = null; if (matched.size === L.length) { el.querySelector('.m-msg').textContent = '🎉 จับคู่ครบแล้ว!'; win(el, key); } }
      else { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); }
    });
  };

  /* ----- เรียงลำดับ ----- */
  W.order = (el, cfg, key) => {
    let arr = shuffle(cfg.items.map((t, i) => ({ t, i })));
    if (arr.every((x, k) => x.i === k)) arr.reverse();
    el.innerHTML = head(cfg, 'list-ordered', 'เรียงลำดับ') + doneBadge(key) + `<p class="hint">ใช้ลูกศร ▲▼ หรือลากเพื่อเรียงให้ถูกต้อง</p><ol class="o-list"></ol><div class="row"><button class="btn sm o-check">ตรวจคำตอบ</button><span class="o-msg"></span></div>`;
    const ol = el.querySelector('.o-list'); let drag = null;
    const render = () => {
      ol.innerHTML = arr.map((x, k) => `<li draggable="true" data-k="${k}"><span class="o-n">${k + 1}</span><span class="o-t">${x.t}</span><span class="o-btns"><button data-d="-1">▲</button><button data-d="1">▼</button></span></li>`).join('');
      ol.querySelectorAll('li').forEach(li => {
        const k = +li.dataset.k;
        li.querySelectorAll('button').forEach(b => b.onclick = () => { const j = k + +b.dataset.d; if (j < 0 || j >= arr.length) return;[arr[k], arr[j]] = [arr[j], arr[k]]; render(); });
        li.ondragstart = () => drag = k; li.ondragover = e => e.preventDefault();
        li.ondrop = e => { e.preventDefault(); if (drag == null) return; const [m] = arr.splice(drag, 1); arr.splice(k, 0, m); drag = null; render(); };
      });
    };
    el.querySelector('.o-check').onclick = () => {
      let ok = 0; ol.querySelectorAll('li').forEach((li, k) => { const g = arr[k].i === k; li.classList.toggle('ok', g); li.classList.toggle('no', !g); if (g) ok++; });
      el.querySelector('.o-msg').innerHTML = ok === arr.length ? '🎉 ถูกต้องทั้งหมด!' : `ถูกตำแหน่ง ${ok}/${arr.length}`;
      if (ok === arr.length) { win(el, key); if (cfg.after) el.querySelector('.o-msg').insertAdjacentHTML('afterend', `<div class="note">${cfg.after}</div>`); }
    };
    render();
  };

  /* ----- การ์ดพลิก ----- */
  W.flip = (el, cfg, key) => {
    const seen = new Set();
    el.innerHTML = head(cfg, 'layers', 'การ์ดความรู้') + doneBadge(key) + `<p class="hint">แตะการ์ดเพื่อพลิกดูคำอธิบาย (เปิดให้ครบทุกใบ)</p><div class="f-grid">${cfg.cards.map((c, i) => `<button class="f-card" data-i="${i}"><div class="f-in"><div class="f-front"><span class="f-ic">${c.icon || '❓'}</span>${c.f}</div><div class="f-back">${c.b}</div></div></button>`).join('')}</div>`;
    el.querySelectorAll('.f-card').forEach(c => c.onclick = () => { c.classList.toggle('flip'); seen.add(c.dataset.i); if (seen.size === cfg.cards.length) win(el, key, 10); });
  };

  /* ----- ถูก/ผิด ----- */
  W.tf = (el, cfg, key) => {
    el.innerHTML = head(cfg, 'scale', 'ถูกหรือผิด') + doneBadge(key) + `<div class="tf-list">${cfg.items.map((it, i) => `<div class="tf-row" data-i="${i}"><span>${it.t}</span><span class="tf-b"><button data-v="1">ถูก</button><button data-v="0">ผิด</button></span><div class="tf-why"></div></div>`).join('')}</div><div class="tf-msg"></div>`;
    let right = 0, answered = 0;
    el.querySelectorAll('.tf-row').forEach(r => r.querySelectorAll('button').forEach(b => b.onclick = () => {
      if (r.dataset.done) return; r.dataset.done = 1; answered++;
      const it = cfg.items[+r.dataset.i]; const ok = (+b.dataset.v === 1) === it.a; if (ok) right++;
      b.classList.add(ok ? 'ok' : 'no'); r.querySelector('.tf-why').innerHTML = (ok ? '✅ ' : '❌ ') + (it.why || '');
      if (answered === cfg.items.length) { el.querySelector('.tf-msg').innerHTML = `ถูก ${right}/${cfg.items.length}`; if (right >= Math.ceil(cfg.items.length * .7)) win(el, key); }
    }));
  };

  /* ----- แบบสำรวจตนเอง (Digital Me) ----- */
  W.survey = (el, cfg, key) => {
    el.innerHTML = head(cfg, 'scan-face', 'สำรวจตนเอง') + doneBadge(key) + `<div class="sv-list">${cfg.items.map((q, i) => `<label class="sv-row"><input type="checkbox" data-i="${i}"><span>${q}</span></label>`).join('')}</div><button class="btn sm sv-go">ประเมินผล</button><div class="sv-out"></div>`;
    el.querySelector('.sv-go').onclick = () => {
      const n = el.querySelectorAll('input:checked').length; const r = cfg.levels.find(l => n <= l.max);
      el.querySelector('.sv-out').innerHTML = `<div class="meter"><span style="width:${n / cfg.items.length * 100}%;background:${r.color}"></span></div><div class="note" style="border-color:${r.color}"><b>${r.icon} คะแนนความเสี่ยง ${n}/${cfg.items.length} : ${r.label}</b><br>${r.tip}</div>`;
      win(el, key);
    };
  };

  /* ----- ตรวจรหัสผ่าน ----- */
  W.password = (el, cfg, key) => {
    const rules = [['ยาวอย่างน้อย 12 ตัวอักษร', p => p.length >= 12], ['มีตัวพิมพ์ใหญ่ A-Z', p => /[A-Z]/.test(p)], ['มีตัวพิมพ์เล็ก a-z', p => /[a-z]/.test(p)], ['มีตัวเลข 0-9', p => /\d/.test(p)], ['มีสัญลักษณ์ เช่น ! @ - #', p => /[^A-Za-z0-9฀-๿]/.test(p)], ['ไม่มีคำยอดฮิต (1234, password, qwerty)', p => p && !/1234|password|qwerty|abcd/i.test(p)]];
    el.innerHTML = head(cfg, 'key-round', 'Password Lab') + doneBadge(key) + `<p class="warn">⚠️ ห้ามพิมพ์รหัสผ่านจริงของตนเอง ใช้รหัสตัวอย่างเท่านั้น (ระบบไม่บันทึกสิ่งที่พิมพ์)</p>
      <div class="pw-in"><input type="text" autocomplete="off" spellcheck="false" placeholder="ลองพิมพ์รหัสผ่านตัวอย่าง เช่น Malee2555"><button class="btn sm ghost pw-gen">🎲 สุ่มวลีรหัสผ่าน</button></div>
      <div class="meter big"><span></span></div><div class="pw-lv"></div><ul class="pw-rules">${rules.map(r => `<li>${r[0]}</li>`).join('')}</ul><div class="pw-time muted"></div>`;
    const inp = el.querySelector('input'), bar = el.querySelector('.meter span'), lv = el.querySelector('.pw-lv');
    const words = ['Mango', 'Rocket', 'Tiger', 'Cloud', 'Python', 'Lotus', 'Mekong', 'Pixel', 'Coconut', 'Thunder', 'Kanit', 'Robot'];
    const upd = () => {
      const p = inp.value; const s = rules.map(r => r[1](p));
      el.querySelectorAll('.pw-rules li').forEach((li, i) => li.classList.toggle('ok', s[i]));
      const n = s.filter(Boolean).length; const pct = n / rules.length * 100;
      const L = n <= 2 ? ['🔴 อ่อนแอ', '#EF4444'] : n <= 4 ? ['🟡 ปานกลาง', '#F59E0B'] : ['🟢 แข็งแรง', '#22C55E'];
      bar.style.width = pct + '%'; bar.style.background = L[1]; lv.innerHTML = p ? `<b style="color:${L[1]}">${L[0]}</b> (${n}/${rules.length} เกณฑ์)` : '';
      let pool = 0; if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26; if (/\d/.test(p)) pool += 10; if (/[^A-Za-z0-9]/.test(p)) pool += 33;
      const secs = Math.pow(Math.max(pool, 1), p.length) / 1e10;
      const t = secs < 1 ? 'ทันที' : secs < 3600 ? Math.round(secs / 60) + ' นาที' : secs < 86400 * 365 ? Math.round(secs / 86400) + ' วัน' : secs < 3.15e7 * 1e6 ? Math.round(secs / 3.15e7).toLocaleString() + ' ปี' : 'มากกว่าล้านปี';
      el.querySelector('.pw-time').textContent = p ? `⏱️ เวลาโดยประมาณที่คอมพิวเตอร์เดาสุ่มทุกแบบ (หมื่นล้านครั้ง/วินาที): ${t}` : '';
      if (n === rules.length) win(el, key);
    };
    inp.oninput = upd;
    el.querySelector('.pw-gen').onclick = () => { const w = shuffle(words).slice(0, 3); inp.value = w.join('-') + '-' + (10 + Math.random() * 89 | 0) + '!'; upd(); };
  };

  /* ----- จับผิดข้อความหลอกลวง ----- */
  W.spot = (el, cfg, key) => {
    const bad = cfg.parts.filter(p => p.bad).length; let found = 0;
    el.innerHTML = head(cfg, 'scan-search', 'นักสืบไซเบอร์') + doneBadge(key) + `<p class="hint">🔎 แตะจุดที่น่าสงสัยให้ครบ ${bad} จุด</p><div class="spot-card">${cfg.parts.map((p, i) => `<span class="sp ${p.block ? 'blk' : ''}" data-i="${i}">${p.t}</span>`).join('')}</div><div class="spot-log"></div>`;
    el.querySelectorAll('.sp').forEach(s => s.onclick = () => {
      const p = cfg.parts[+s.dataset.i]; if (s.classList.contains('hit') || s.classList.contains('miss')) return;
      if (p.bad) { s.classList.add('hit'); found++; el.querySelector('.spot-log').insertAdjacentHTML('beforeend', `<div class="good">🚩 ${p.why}</div>`); if (found === bad) { el.querySelector('.spot-log').insertAdjacentHTML('beforeend', `<div class="note"><b>🎉 จับได้ครบ!</b> ${cfg.after || ''}</div>`); win(el, key); } }
      else { s.classList.add('miss'); setTimeout(() => s.classList.remove('miss'), 700); }
    });
  };

  /* ----- เลือกสัญญาอนุญาต CC ----- */
  W.cc = (el, cfg, key) => {
    el.innerHTML = head(cfg, 'copyright', 'สร้างสัญญาอนุญาต CC') + doneBadge(key) + `
      <div class="cc-q"><p>1) อนุญาตให้นำผลงานไปใช้ <b>เพื่อการค้า</b> หรือไม่?</p><label><input type="radio" name="c1" value="y" checked> อนุญาต</label><label><input type="radio" name="c1" value="n"> ไม่อนุญาต (NC)</label></div>
      <div class="cc-q"><p>2) อนุญาตให้ <b>ดัดแปลง</b> ผลงานหรือไม่?</p><label><input type="radio" name="c2" value="y" checked> อนุญาต</label><label><input type="radio" name="c2" value="sa"> อนุญาต แต่ต้องใช้สัญญาแบบเดียวกัน (SA)</label><label><input type="radio" name="c2" value="n"> ไม่อนุญาต (ND)</label></div>
      <div class="cc-out"></div>`;
    const names = { BY: 'แสดงที่มา', NC: 'ไม่ใช้เพื่อการค้า', ND: 'ไม่ดัดแปลง', SA: 'อนุญาตแบบเดียวกัน' };
    const upd = () => {
      const c1 = el.querySelector('[name=c1]:checked').value, c2 = el.querySelector('[name=c2]:checked').value;
      const parts = ['BY']; if (c1 === 'n') parts.push('NC'); if (c2 === 'n') parts.push('ND'); if (c2 === 'sa') parts.push('SA');
      el.querySelector('.cc-out').innerHTML = `<div class="cc-badge">${parts.map(p => `<span>${p}</span>`).join('')}</div><p><b>CC ${parts.join('-')} 4.0</b> : ${parts.map(p => names[p]).join(' + ')}</p><p class="muted">ตัวอย่างการเขียนท้ายผลงาน: "อินโฟกราฟิกปลอดภัยไว้ก่อน" โดย (ชื่อนักเรียน) เผยแพร่ภายใต้สัญญาอนุญาต CC ${parts.join('-')} 4.0</p>`;
      if (parts.length > 1) win(el, key);
    };
    el.querySelectorAll('input').forEach(i => i.onchange = upd); upd();
  };

  /* ----- เส้นทางข้อมูล (แอนิเมชัน) ----- */
  W.path = (el, cfg, key) => {
    el.innerHTML = head(cfg, 'route', 'จำลองเส้นทางข้อมูล') + doneBadge(key) + `<div class="path"><div class="path-line"><i class="pkt">📦</i></div>${cfg.nodes.map((n, i) => `<button class="node" data-i="${i}"><span>${n.icon}</span><small>${n.name}</small></button>`).join('')}</div>
      <div class="row"><button class="btn sm gold p-go">▶ ส่งข้อมูล</button><span class="muted">หรือแตะแต่ละจุดเพื่ออ่านคำอธิบาย</span></div><div class="note p-info">${cfg.intro || ''}</div>`;
    const nodes = el.querySelectorAll('.node'), info = el.querySelector('.p-info'), pkt = el.querySelector('.pkt'); const seen = new Set();
    const showN = i => { nodes.forEach(n => n.classList.remove('on')); nodes[i].classList.add('on'); const n = cfg.nodes[i]; info.innerHTML = `<b>${n.icon} ${n.name}</b><br>${n.d}`; seen.add(i); pkt.style.left = (i / (cfg.nodes.length - 1) * 100) + '%'; if (seen.size === cfg.nodes.length) win(el, key); };
    nodes.forEach((n, i) => n.onclick = () => showN(i));
    el.querySelector('.p-go').onclick = async () => { for (let i = 0; i < cfg.nodes.length; i++) { showN(i); await new Promise(r => setTimeout(r, 1500)); } };
  };

  /* ----- เขียนสะท้อนคิด ----- */
  W.reflect = (el, cfg, key) => {
    const saved = localStorage.getItem('t2_ref_' + key) || '';
    el.innerHTML = head(cfg, 'notebook-pen', 'สะท้อนคิด') + doneBadge(key) + `${cfg.prompts.map((p, i) => `<label class="rf">${p}<textarea data-i="${i}" rows="2"></textarea></label>`).join('')}<div class="row"><button class="btn sm rf-save">บันทึก</button><span class="muted">บันทึกไว้ในเครื่องนี้ (ส่งงานจริงใน Google Classroom)</span></div>`;
    const tas = el.querySelectorAll('textarea'); try { JSON.parse(saved).forEach((v, i) => tas[i] && (tas[i].value = v)); } catch (e) { }
    el.querySelector('.rf-save').onclick = () => {
      const v = [...tas].map(t => t.value.trim()); localStorage.setItem('t2_ref_' + key, JSON.stringify(v));
      if (v.every(x => x.length >= 8)) win(el, key); else T2.toast('เขียนให้ครบทุกข้อนะ', 'อย่างน้อยข้อละ 1 ประโยค', 'err');
    };
  };

  /* ----- ไพทอนบนเว็บ (Pyodide) ----- */
  let pyP = null;
  const loadPy = () => pyP || (pyP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    s.onload = async () => { try { const py = await loadPyodide(); res(py); } catch (e) { rej(e); } }; s.onerror = rej; document.head.appendChild(s);
  }));
  W.python = (el, cfg, key) => {
    el.innerHTML = head(cfg, 'terminal', 'ลองเขียนไพทอน') + doneBadge(key) + `${cfg.task ? `<div class="task">🎯 <b>ภารกิจ:</b> ${cfg.task}</div>` : ''}
      <div class="py"><div class="py-bar"><span>main.py</span><span class="py-btns"><button class="py-reset" title="คืนค่าโค้ดเริ่มต้น"><i data-lucide="rotate-ccw"></i></button><button class="btn sm gold py-run"><i data-lucide="play"></i>Run</button></span></div>
      <textarea class="py-code" spellcheck="false"></textarea><div class="py-out"><span class="muted">ผลลัพธ์จะแสดงที่นี่ (ครั้งแรกใช้เวลาโหลด 5–10 วินาที)</span></div></div>
      ${cfg.hint ? `<details class="hintbox"><summary>💡 คำใบ้</summary>${cfg.hint}</details>` : ''}<div class="py-check"></div>`;
    const ta = el.querySelector('.py-code'), out = el.querySelector('.py-out');
    const saveK = 't2_code_' + key; ta.value = localStorage.getItem(saveK) || cfg.code;
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.max(120, ta.scrollHeight + 4) + 'px'; }; fit();
    ta.oninput = () => { localStorage.setItem(saveK, ta.value); fit(); };
    ta.onkeydown = e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 4; } if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) { e.preventDefault(); run(); } };
    el.querySelector('.py-reset').onclick = () => { ta.value = cfg.code; localStorage.removeItem(saveK); fit(); };
    const run = async () => {
      out.innerHTML = '<span class="muted">⏳ กำลังเตรียมไพทอน...</span>';
      let py; try { py = await loadPy(); } catch (e) { out.innerHTML = '<span class="err">โหลดไพทอนไม่สำเร็จ ตรวจสอบอินเทอร์เน็ต หรือใช้ Google Colab แทน</span>'; return; }
      const buf = [];
      py.setStdout({ batched: s => buf.push(s) }); py.setStderr({ batched: s => buf.push('⚠ ' + s) });
      py.globals.set('__t2_input', (p) => { const v = window.prompt(p || 'ป้อนข้อมูล:') ?? ''; buf.push((p || '') + v); return v; });
      out.innerHTML = '<span class="muted">▶ กำลังรัน...</span>';
      let err = null;
      try { await py.runPythonAsync('import builtins\nbuiltins.input = lambda p="": __t2_input(p)\n' + ta.value); }
      catch (e) { err = String(e.message || e).split('\n').filter(l => l.trim()).slice(-2).join('\n'); }
      const text = buf.join('\n');
      out.innerHTML = `<pre>${esc(text)}${err ? `\n<span class="err">❌ ${esc(err)}</span>` : ''}</pre>`;
      if (!T2.state.codeRuns) T2.award('coder');
      T2.state.codeRuns = (T2.state.codeRuns || 0) + 1; T2.daily(); T2.dailyInc('code'); T2.save();
      if (!err && cfg.check) {
        const c = cfg.check; let ok = true;
        if (c.contains) ok = c.contains.every(s => text.includes(s));
        if (ok && c.code) ok = c.code.every(s => new RegExp(s).test(ta.value));
        if (ok && c.lines) ok = text.split('\n').filter(x => x.trim()).length >= c.lines;
        el.querySelector('.py-check').innerHTML = ok ? `<div class="good">🎉 ภารกิจสำเร็จ! ${c.msg || ''}</div>` : `<div class="bad">ยังไม่ครบตามภารกิจ ${c.fail || 'ลองอ่านภารกิจอีกครั้ง'}</div>`;
        if (ok) win(el, key, 20);
      }
    };
    el.querySelector('.py-run').onclick = run;
  };

  /* ----- ตัวจัดการ ----- */
  /* เพลย์ลิสต์วีดิทัศน์: เลือกคลิปจากรายการ */
  W.videos = (el, cfg, key) => {
    const L = cfg.list; let cur = 0;
    el.innerHTML = `<div class="w-head"><span class="w-ic">🎬</span><b>${cfg.title || 'คลิปอธิบาย'}</b></div>
      <div class="vp"><div class="vp-main"><div class="video" style="margin:0"><iframe loading="lazy" allowfullscreen title=""></iframe></div><div class="vp-cap"></div></div>
      <div class="vp-list">${L.map((v, i) => `<button data-i="${i}"><img loading="lazy" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt=""><span><b>${v.t}</b><small>${v.lang === 'en' ? '🇬🇧' : '🇹🇭'} ${v.ch}${v.dur ? ' • ' + v.dur : ''}</small></span></button>`).join('')}</div></div>`;
    const show = i => { cur = i; const v = L[i]; const f = el.querySelector('iframe'); f.src = `https://www.youtube-nocookie.com/embed/${v.id}${v.start ? '?start=' + v.start : ''}`; f.title = v.t;
      el.querySelector('.vp-cap').innerHTML = `<b>${v.t}</b><small>${v.ch}${v.note ? ' • ' + v.note : ''} • <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">เปิดใน YouTube</a></small>`;
      el.querySelectorAll('.vp-list button').forEach(b => b.classList.toggle('on', +b.dataset.i === i)); };
    el.querySelectorAll('.vp-list button').forEach(b => b.onclick = () => { show(+b.dataset.i); if (!T2.state.wid[key]) win(el, key, 5); });
    show(0);
  };
  /* ภาพประกอบแบบแตะดูคำอธิบาย (hotspot) */
  W.hotspot = (el, cfg, key) => {
    el.innerHTML = `<div class="w-head"><span class="w-ic">🔎</span><b>${cfg.title}</b><small class="muted" style="margin-left:auto">แตะหมายเลขเพื่อดูคำอธิบาย</small></div>
      <div class="hs-wrap">${cfg.html}</div><div class="hs-info"><span class="hs-n">?</span><div><b>แตะหมายเลขบนภาพ</b><p>ดูว่าแต่ละส่วนของหน้าจอใช้ทำอะไร</p></div></div>`;
    const seen = new Set();
    el.querySelectorAll('[data-hs]').forEach(h => h.onclick = () => { const i = +h.dataset.hs, it = cfg.items[i - 1];
      el.querySelectorAll('[data-hs]').forEach(x => x.classList.toggle('on', x === h));
      el.querySelector('.hs-info').innerHTML = `<span class="hs-n">${i}</span><div><b>${it[0]}</b><p>${it[1]}</p></div>`;
      seen.add(i); if (seen.size === cfg.items.length) win(el, key); });
  };

  W.mount = (root, defs, lid) => {
    root.querySelectorAll('[data-w]').forEach(el => {
      const id = el.dataset.w; const cfg = defs[id]; if (!cfg || !W[cfg.type]) return;
      el.classList.add('widget', 'w-' + cfg.type);
      try { W[cfg.type](el, cfg, 'l' + lid + ':' + id); } catch (e) { console.error(id, e); el.innerHTML = '<p class="err">โหลดกิจกรรมไม่สำเร็จ</p>'; }
    });
    T2.icons();
  };
})();
