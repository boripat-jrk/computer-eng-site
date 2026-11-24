/* ภาพสถานการณ์แบบบล็อก (คล้ายเกม) แตะตัวละคร/สิ่งของเพื่อฟังเรื่องราว */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const VW = 720, VH = 300;
  const BG = {
    room: { floor: '#eef1f6', grid: '#e1e6ef', wall: '#cbd5e1', wall2: '#94a3b8', top: 120 },
    lab: { floor: '#e8eef8', grid: '#d6dfee', wall: '#bfdbfe', wall2: '#60a5fa', top: 120 },
    field: { floor: '#7cc66b', grid: '#71ba61', wall: '#bfe6ff', wall2: '#8fd3ff', top: 110, sky: 1 },
    library: { floor: '#f5efe4', grid: '#e9dfcc', wall: '#e7d5b5', wall2: '#c8a876', top: 120 }
  };
  W.scene = (el, cfg, key) => {
    el.classList.add('scene-w');
    el.innerHTML = `<div class="sc-wrap"><canvas></canvas><div class="sc-bub hide"></div><div class="sc-hint">👆 แตะตัวละครหรือสิ่งของ เพื่อฟังเรื่องราว <b>0/${cfg.actors.length + (cfg.props || []).filter(p => p.say).length}</b></div></div>${cfg.caption ? `<p class="sc-cap">${cfg.caption}</p>` : ''}`;
    const cv = el.querySelector('canvas'), cx = cv.getContext('2d'), bub = el.querySelector('.sc-bub'), B = BG[cfg.bg] || BG.room;
    const items = cfg.actors.map(a => Object.assign({ kind: 'a' }, a)).concat((cfg.props || []).map(p => Object.assign({ kind: 'p' }, p)));
    const seen = new Set(); let t = 0, hot = null;
    const rr = (x, y, w, h, r, c) => { cx.fillStyle = c; cx.beginPath(); cx.roundRect(x, y, w, h, r); cx.fill(); };
    const person = (a, b) => {
      const s = a.s || 2.2, x = a.x, y = a.y + b, lk = Object.assign({ sh: '#3b5bfd', hair: '#2b2118', skin: '#f1c9a0' }, a.lk);
      cx.save(); cx.translate(x, y); cx.scale(s, s);
      cx.fillStyle = 'rgba(0,0,0,.16)'; cx.beginPath(); cx.ellipse(0, 13, 12, 4, 0, 0, 7); cx.fill();
      rr(-7, 2, 6, 11, 2, '#334155'); rr(1, 2, 6, 11, 2, '#334155'); rr(-10, -12, 20, 16, 4, lk.sh);
      const wave = a === hot ? Math.sin(t * 10) * 4 : 0;
      rr(-13, -11, 4, 12, 2, lk.sh); cx.save(); cx.translate(11, -11); cx.rotate(a.arm ? -2.4 + wave * .05 : 0); rr(-2, 0, 4, 12, 2, lk.sh); cx.restore();
      rr(-9, -30, 18, 18, 5, lk.skin); rr(-10, -32, 20, 7, 4, lk.hair);
      const md = a.mood === 'sad' ? 'worry' : a.mood || 'calm';
      const E = dx => { cx.fillStyle = '#1f2937'; cx.fillRect(dx, -22, 3, 4); cx.fillStyle = '#fff'; cx.fillRect(dx + 1, -22, 1.2, 1.4); };
      cx.lineCap = 'round';
      if (md === 'happy') { cx.strokeStyle = '#1f2937'; cx.lineWidth = 1.4; cx.beginPath(); cx.arc(-3.5, -20, 2.2, Math.PI + .3, -.3); cx.arc(3.5, -20, 2.2, Math.PI + .3, -.3); cx.stroke(); cx.fillStyle = '#7c2d12'; cx.beginPath(); cx.arc(0, -17.5, 3.6, 0, Math.PI); cx.closePath(); cx.fill(); cx.fillStyle = 'rgba(255,110,130,.6)'; }
      else if (md === 'worry') { E(-5); E(2); cx.strokeStyle = '#1f2937'; cx.lineWidth = 1.1; cx.beginPath(); cx.moveTo(-6, -24.5); cx.lineTo(-2, -25.5); cx.moveTo(6, -24.5); cx.lineTo(2, -25.5); cx.stroke(); cx.strokeStyle = '#7c2d12'; cx.lineWidth = 1.4; cx.beginPath(); cx.moveTo(-3, -15.5); cx.quadraticCurveTo(0, -17.5, 3, -15.5); cx.stroke(); cx.fillStyle = '#7dd3fc'; cx.beginPath(); cx.moveTo(10, -30); cx.quadraticCurveTo(13, -25, 10, -23); cx.quadraticCurveTo(7, -25, 10, -30); cx.fill(); cx.fillStyle = 'rgba(255,110,130,.25)'; }
      else { E(-5); E(2); cx.strokeStyle = '#7c2d12'; cx.lineWidth = 1.4; cx.beginPath(); cx.arc(0, -17.5, 3, .3, Math.PI - .3); cx.stroke(); cx.fillStyle = 'rgba(255,110,130,.45)'; }
      cx.beginPath(); cx.ellipse(-6, -16.5, 2.4, 1.5, 0, 0, 7); cx.ellipse(6, -16.5, 2.4, 1.5, 0, 0, 7); cx.fill();
      if (a.hold) { cx.font = '12px sans-serif'; cx.textAlign = 'center'; cx.fillText(a.hold, 14, -2); }
      cx.restore();
      if (a.name) { cx.font = '600 14px Mali, Kanit, sans-serif'; const w = cx.measureText(a.name).width + 14; rr(x - w / 2, y - 32 * s - 24, w, 20, 10, 'rgba(15,23,42,.65)'); cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText(a.name, x, y - 32 * s - 9); }
      if (!seen.has(a)) { const bb = Math.sin(t * 5) * 3; rr(x - 10, y - 32 * s - 50 + bb, 20, 22, 7, '#f59e0b'); cx.fillStyle = '#fff'; cx.font = '700 15px Mali, Kanit, sans-serif'; cx.textAlign = 'center'; cx.fillText('!', x, y - 32 * s - 34 + bb); }
    };
    const prop = (p, b) => {
      const s = p.s || 1; if (p.box) { rr(p.x - p.box[0] / 2, p.y - p.box[1], p.box[0], p.box[1], 8, p.c || '#c58b52'); cx.fillStyle = p.c2 || '#dca46a'; cx.fillRect(p.x - p.box[0] / 2, p.y - p.box[1], p.box[0], 10); }
      if (p.ico && window.ICO) { const im = ICO.img(p.ico), z = 46 * s; if (im.complete) cx.drawImage(im, p.x - z / 2, p.y - (p.box ? p.box[1] + 4 : 0) - z + (p.say ? b * .5 : 0) + 8, z, z); } else if (p.em) { cx.font = `${Math.round(34 * s)}px sans-serif`; cx.textAlign = 'center'; cx.fillText(p.em, p.x, p.y - (p.box ? p.box[1] + 4 : 0) + (p.say ? b * .5 : 0)); }
      if (p.label) { cx.font = '500 13px Mali, Kanit, sans-serif'; const w = cx.measureText(p.label).width + 12; rr(p.x - w / 2, p.y + 6, w, 19, 9, 'rgba(255,255,255,.9)'); cx.fillStyle = '#0f172a'; cx.textAlign = 'center'; cx.fillText(p.label, p.x, p.y + 20); }
      if (p.say && !seen.has(p)) { cx.fillStyle = 'rgba(255,214,90,.35)'; cx.beginPath(); cx.arc(p.x, p.y - (p.box ? p.box[1] : 0) - 14 * s, 26 * s + Math.sin(t * 4) * 2, 0, 7); cx.fill(); }
    };
    const draw = () => {
      cx.fillStyle = B.floor; cx.fillRect(0, 0, VW, VH);
      if (B.sky) { const g = cx.createLinearGradient(0, 0, 0, B.top); g.addColorStop(0, '#77c4ff'); g.addColorStop(1, '#dff3ff'); cx.fillStyle = g; cx.fillRect(0, 0, VW, B.top); cx.fillStyle = 'rgba(255,255,255,.9)'; [[90, 30], [420, 50], [600, 24]].forEach(([x, y]) => { cx.fillRect(x, y, 70, 16); cx.fillRect(x + 16, y - 10, 38, 12); }); }
      else { cx.fillStyle = B.wall; cx.fillRect(0, 0, VW, B.top); cx.fillStyle = B.wall2; cx.fillRect(0, B.top - 10, VW, 10); (cfg.windows || [120, 560]).forEach(x => { rr(x, 22, 90, 60, 6, '#e0f2fe'); cx.fillStyle = '#bae6fd'; cx.fillRect(x + 44, 22, 3, 60); }); }
      cx.fillStyle = B.grid; for (let x = 0; x < VW; x += 40) cx.fillRect(x, B.top, 1, VH - B.top); for (let y = B.top; y < VH; y += 40) cx.fillRect(0, y, VW, 1);
      (cfg.board ? [cfg.board] : []).forEach(b => { rr(b.x, 18, b.w || 200, 74, 6, '#14532d'); cx.fillStyle = '#e2e8f0'; cx.font = '500 15px Mali, Kanit, sans-serif'; cx.textAlign = 'center'; (b.t || '').split('\n').forEach((l, i) => cx.fillText(l, b.x + (b.w || 200) / 2, 44 + i * 20)); });
      const bob = k => Math.sin(t * 2 + k) * 1.5;
      items.slice().sort((a, b) => a.y - b.y).forEach((it, k) => it.kind === 'a' ? person(it, bob(k)) : prop(it, bob(k)));
    };
    const resize = () => { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); if (!r.width) return; cv.width = r.width * d; cv.height = r.width * VH / VW * d; cx.setTransform(cv.width / VW, 0, 0, cv.height / VH, 0, 0); };
    new ResizeObserver(resize).observe(cv); resize();
    let last = 0; const loop = now => { if (!cv.isConnected) return; t += Math.min(.05, (now - last) / 1000 || 0); last = now; draw(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    /* โหมดเล่นอัตโนมัติ: กดครั้งเดียว ฉากเล่นเองตามบท (cfg.play) */
    const PLAY = cfg.play || cfg.actors.concat(cfg.props || []).filter(i => i.say).map(i => ({ n: i.name || i.label, say: i.say }));
    if (PLAY.length) {
      const wrap = el.querySelector('.sc-wrap'), hint = el.querySelector('.sc-hint');
      const pb = document.createElement('button'); pb.className = 'sc-play'; pb.innerHTML = '▶ ดูสถานการณ์'; wrap.appendChild(pb);
      hint.classList.add('hide');
      let run = 0;
      const find = n => items.find(i => (i.name || i.label) === n) || items[0];
      const play = async () => {
        const my = ++run; pb.classList.add('hide'); hint.classList.add('hide');
        for (const ln of PLAY) {
          if (my !== run || !cv.isConnected) return;
          if (ln.mood) Object.entries(ln.mood).forEach(([n, m]) => { const a = items.find(i => i.name === n); if (a) a.mood = m; });
          const it = find(ln.n); hot = it; seen.add(it);
          bub.classList.remove('hide'); bub.innerHTML = `<b>${ln.n || ''}</b>${ln.say}`;
          bub.style.left = Math.min(70, Math.max(2, it.x / VW * 100 - 14)) + '%';
          await new Promise(r => setTimeout(r, Math.max(3600, ln.say.length * 75)));
        }
        if (my !== run) return; hot = null;
        items.forEach(i => { if (i.say) seen.add(i); });
        pb.innerHTML = '↻ ดูอีกครั้ง'; pb.classList.add('again'); pb.classList.remove('hide');
        hint.classList.remove('hide'); hint.innerHTML = '✅ ดูสถานการณ์จบแล้ว แตะตัวละครเพื่อฟังซ้ำได้';
        T.markWidget(key, cfg.xp || 10, el);
      };
      pb.onclick = play;
    }
    cv.addEventListener('click', ev => {
      const r = cv.getBoundingClientRect(), mx = (ev.clientX - r.left) / r.width * VW, my = (ev.clientY - r.top) / r.height * VH;
      let best = null, bd = 60; items.forEach(it => { if (!it.say) return; const cy = it.kind === 'a' ? it.y - 30 * (it.s || 2.2) : it.y - (it.box ? it.box[1] : 0) - 16; const d = Math.hypot(it.x - mx, cy - my); if (d < bd) { bd = d; best = it; } });
      if (!best) return; hot = best; seen.add(best);
      bub.classList.remove('hide'); bub.innerHTML = `<b>${best.name || best.label || ''}</b>${best.say}`;
      const px = best.x / VW * 100; bub.style.left = Math.min(70, Math.max(2, px - 14)) + '%';
      const n = items.filter(i => i.say).length; el.querySelector('.sc-hint b').textContent = `${seen.size}/${n}`;
      if (seen.size === n && T.markWidget(key, cfg.xp || 10, el)) el.querySelector('.sc-hint').innerHTML = '✅ ฟังครบทุกคนแล้ว';
      setTimeout(() => { if (hot === best) hot = null; }, 1200);
    });
  };
})();
/* การ์ด Digital Me ปลอดภัย (ชิ้นงานบทที่ 1 แทน Colab) */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  W.dmcard = (el, cfg, key) => {
    const mode = T.modeOf ? T.modeOf(key.split(':')[0]) : 2, sv = (T.state.dm || {});
    const AV = ['🦊', '🐼', '🐯', '🦉', '🐬', '🤖', '🚀', '🎧', '🎨', '⚽'], INT = ['เล่นกีฬา', 'วาดรูป', 'ดนตรี', 'เกม', 'ทำอาหาร', 'อ่านการ์ตูน', 'ถ่ายรูป', 'ปลูกต้นไม้', 'เขียนโค้ด', 'เต้น'];
    const INFO = [['nick', 'ชื่อเล่นหรือนามแฝง', 0], ['hobby', 'งานอดิเรก', 0], ['proud', 'ผลงานที่ภูมิใจ', 0], ['school', 'ชื่อโรงเรียน', 1], ['full', 'ชื่อจริง–นามสกุล', 2], ['room', 'ห้องและเลขที่', 2], ['phone', 'เบอร์โทรศัพท์', 3], ['home', 'ที่อยู่บ้าน', 3]];
    const RULES = ['คิดก่อนโพสต์ทุกครั้ง', 'ไม่เปิดตำแหน่งตอนโพสต์', 'ขออนุญาตก่อนโพสต์รูปเพื่อน', 'ตั้งบัญชีเป็นส่วนตัว', 'ไม่บอกรหัสผ่านใคร', 'ลบโพสต์ที่ไม่เหมาะสมของตัวเอง'];
    const st = Object.assign({ av: '🦊', name: '', ints: [], show: ['nick', 'hobby'], rules: [], own: '' }, sv);
    const draw = () => {
      const risk = st.show.reduce((a, k) => a + (INFO.find(i => i[0] === k) || [0, 0, 0])[2], 0) + (st.show.includes('full') && st.show.includes('school') ? 2 : 0), safe = Math.max(0, 100 - risk * 18);
      el.innerHTML = `<div class="w-head"><span class="w-tag"><i data-lucide="id-card"></i>ชิ้นงาน</span><h4>${cfg.title || 'การ์ด Digital Me ปลอดภัย'}</h4><p>${cfg.desc || ''}</p></div>
        <span class="flabel">1. เลือกตัวแทนของฉัน</span><div class="chips2">${AV.map(a => `<button class="chip ${st.av === a ? 'on' : ''}" data-av="${a}" style="font-size:22px">${a}</button>`).join('')}</div>
        <label class="flabel">2. ชื่อที่จะแสดง <small class="muted">(ชื่อเล่นหรือนามแฝง)</small><input data-f="name" maxlength="24" value="${T.esc(st.name)}" placeholder="เช่น มะลิสายอาร์ต"></label>
        <span class="flabel">3. สิ่งที่ฉันสนใจ <small class="muted">(เลือก 3 อย่าง)</small></span><div class="chips2">${INT.map(a => `<button class="chip ${st.ints.includes(a) ? 'on' : ''}" data-int="${a}">${a}</button>`).join('')}</div>
        <span class="flabel">4. ข้อมูลที่จะเปิดเผยบนโปรไฟล์สาธารณะ <small class="muted">(แตะเพื่อเปิด/ปิด)</small></span><div class="chips2">${INFO.map(i => `<button class="chip ${st.show.includes(i[0]) ? 'on' : ''}" data-sh="${i[0]}">${st.show.includes(i[0]) ? '👁️' : '🙈'} ${i[1]}</button>`).join('')}</div>
        <div class="dm-meter"><b>ความปลอดภัย</b><div class="mb"><i style="width:${safe}%;background:${safe >= 70 ? '#16a34a' : safe >= 40 ? '#f59e0b' : '#dc2626'}"></i></div><b>${safe}%</b></div>
        ${risk >= 3 ? `<div class="tipbox">⚠️ ${st.show.includes('phone') || st.show.includes('home') ? 'เบอร์โทรและที่อยู่บ้านทำให้คนแปลกหน้าติดต่อหรือตามหาเราได้' : 'ชื่อจริงรวมกับชื่อโรงเรียนและห้อง ทำให้คนแปลกหน้ารู้ว่าเราอยู่ที่ไหนในแต่ละวัน'}</div>` : ''}
        <span class="flabel">5. สัญญาใจดิจิทัลของฉัน <small class="muted">(เลือก 2 ข้อ${mode === 3 ? ' และเขียนเองอีก 1 ข้อ' : ''})</small></span><div class="chips2">${RULES.map(a => `<button class="chip ${st.rules.includes(a) ? 'on' : ''}" data-ru="${a}">${a}</button>`).join('')}</div>
        ${mode === 3 ? `<input data-f="own" maxlength="80" value="${T.esc(st.own)}" placeholder="สัญญาข้อที่ 3 ที่ฉันคิดเอง" style="margin-top:8px">` : ''}
        <div class="dm-card"><div class="av">${st.av}</div><div><h4>${T.esc(st.name || 'ชื่อของฉัน')}</h4><div>${st.ints.map(x => '#' + x).join(' ') || '<span style="opacity:.7">ยังไม่ได้เลือกสิ่งที่สนใจ</span>'}</div><ul>${st.rules.concat(mode === 3 && st.own ? [st.own] : []).map(r => `<li>${T.esc(r)}</li>`).join('')}</ul></div></div>
        <div class="err et-err"></div><div class="row"><button class="btn gold" data-save>✅ บันทึกการ์ด</button>${T.state.wid[key] ? '<span class="w-done">✓ บันทึกแล้ว</span>' : ''}</div>`;
      el.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { st.av = b.dataset.av; draw(); });
      el.querySelectorAll('[data-int]').forEach(b => b.onclick = () => { const v = b.dataset.int; st.ints = st.ints.includes(v) ? st.ints.filter(x => x !== v) : st.ints.length < 3 ? st.ints.concat(v) : st.ints; draw(); });
      el.querySelectorAll('[data-sh]').forEach(b => b.onclick = () => { const v = b.dataset.sh; st.show = st.show.includes(v) ? st.show.filter(x => x !== v) : st.show.concat(v); draw(); });
      el.querySelectorAll('[data-ru]').forEach(b => b.onclick = () => { const v = b.dataset.ru; st.rules = st.rules.includes(v) ? st.rules.filter(x => x !== v) : st.rules.length < 2 ? st.rules.concat(v) : st.rules; draw(); });
      el.querySelectorAll('[data-f]').forEach(i => i.oninput = () => { st[i.dataset.f] = i.value; el.querySelector('.dm-card h4').textContent = st.name || 'ชื่อของฉัน'; });
      el.querySelector('[data-save]').onclick = () => {
        const E = el.querySelector('.err'); const miss = [];
        if (!st.name.trim()) miss.push('ชื่อที่จะแสดง'); if (st.ints.length < 3) miss.push('สิ่งที่สนใจ 3 อย่าง'); if (st.rules.length < 2) miss.push('สัญญาใจ 2 ข้อ'); if (mode === 3 && st.own.trim().length < 6) miss.push('สัญญาข้อที่ 3');
        if (miss.length) { E.textContent = 'ยังไม่ครบ: ' + miss.join(', '); return; }
        if (st.show.includes('phone') || st.show.includes('home')) { E.textContent = 'ปิดเบอร์โทรและที่อยู่บ้านก่อน ข้อมูลนี้ไม่ควรเปิดเผยบนโปรไฟล์สาธารณะ'; return; }
        if (risk >= 4) { E.textContent = 'ข้อมูลที่เปิดเผยยังมากเกินไป ลองซ่อนบางอย่าง ให้ความปลอดภัยอย่างน้อย 40%'; return; }
        T.state.dm = Object.assign({}, st, { ts: Date.now() }); T.save(); T.markWidget(key, cfg.xp || 30, el); T.toast('✅ บันทึกการ์ด Digital Me แล้ว', `ความปลอดภัย ${safe}%`); draw();
      };
      T.icons && T.icons();
    };
    draw();
  };
})();
