/* วิดเจ็ตเสริมสำหรับบทเรียนฉบับใหม่ (บทที่ 5–18) */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const head = (cfg, tag) => `<div class="w-head"><span class="w-tag"><i data-lucide="table"></i>${tag}</span><h4>${cfg.title || ''}</h4>${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;

  /* ตารางตัดสินใจ: ให้คะแนนแต่ละแนวคิดตามเกณฑ์ (มีน้ำหนัก) แล้วดูผลรวม */
  W.matrix = (el, cfg, key) => {
    const SK = 't2_mx_' + key; let st;
    try { st = JSON.parse(localStorage.getItem(SK)); } catch (e) { }
    st = st || { opt: (cfg.options || ['แนวคิด A', 'แนวคิด B', 'แนวคิด C']).map(n => ({ n: cfg.blank ? '' : n, s: {} })) };
    const C = cfg.criteria;
    const tot = o => C.reduce((a, c, i) => a + (+o.s[i] || 0) * (c.w || 1), 0);
    const draw = () => {
      const best = st.opt.reduce((b, o, i) => tot(o) > tot(st.opt[b]) ? i : b, 0);
      const full = st.opt.every(o => o.n.trim() && C.every((_, i) => o.s[i]));
      el.innerHTML = head(cfg, 'ตารางตัดสินใจ') + `<div class="mx-wrap"><table class="mx"><thead><tr><th>เกณฑ์ (น้ำหนัก)</th>${st.opt.map((o, k) => `<th><input data-n="${k}" value="${T.esc(o.n)}" placeholder="ชื่อแนวคิด ${k + 1}" maxlength="30"></th>`).join('')}</tr></thead>
        <tbody>${C.map((c, i) => `<tr><td>${c.t} <small class="muted">×${c.w || 1}</small></td>${st.opt.map((o, k) => `<td><select data-k="${k}" data-i="${i}"><option value="">–</option>${[1, 2, 3, 4, 5].map(v => `<option ${+o.s[i] === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}
        <tr class="mx-t"><td><b>คะแนนรวม</b></td>${st.opt.map((o, k) => `<td><b>${tot(o)}</b>${full && k === best ? ' 🏆' : ''}</td>`).join('')}</tr></tbody></table></div>
        <small class="muted">ให้คะแนน 1 (น้อย) – 5 (มาก) • ${cfg.note || 'คะแนนสูงสุดช่วยตัดสินใจ แต่ทีมยังต้องให้เหตุผลประกอบเสมอ'}</small>
        ${cfg.add !== false && st.opt.length < 4 ? '<div class="row"><button class="btn sm ghost" data-add>+ เพิ่มแนวคิด</button></div>' : ''}
        ${full ? `<div class="good">แนวคิดที่ได้คะแนนสูงสุด: <b>${T.esc(st.opt[best].n)}</b> • บันทึกเหตุผลที่เลือกลงใน E-Ticket</div>` : ''}`;
      el.querySelectorAll('[data-n]').forEach(i => i.onchange = () => { st.opt[+i.dataset.n].n = i.value; save(); });
      el.querySelectorAll('select').forEach(s => s.onchange = () => { st.opt[+s.dataset.k].s[+s.dataset.i] = +s.value || 0; save(); });
      const a = el.querySelector('[data-add]'); if (a) a.onclick = () => { st.opt.push({ n: '', s: {} }); save(); };
      if (full) T.markWidget(key, cfg.xp || 20, el);
      T.icons && T.icons();
    };
    const save = () => { localStorage.setItem(SK, JSON.stringify(st)); draw(); };
    draw();
  };

  /* แบบจำลองสถานการณ์แบบเลือกคำตอบทีละขั้น (ใช้ทดสอบโปรแกรม/ตารางทดสอบ) */
  W.trace = (el, cfg, key) => {
    let i = 0, ok = 0;
    const show = () => {
      if (i >= cfg.steps.length) { el.querySelector('.tr-b').innerHTML = `<div class="good">🎉 ไล่โค้ดครบ ${cfg.steps.length} ขั้น ถูก ${ok} ขั้น</div>`; if (ok >= Math.ceil(cfg.steps.length * .7)) T.markWidget(key, cfg.xp || 15, el); return; }
      const s = cfg.steps[i];
      el.querySelector('.tr-b').innerHTML = `<small class="muted">ขั้นที่ ${i + 1}/${cfg.steps.length}</small><p><b>${s.q}</b></p><div class="chips2">${s.c.map((c, k) => `<button class="chip" data-c="${k}">${c}</button>`).join('')}</div><div class="tr-why"></div>`;
      el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
        const g = +b.dataset.c === s.a; if (g) ok++;
        el.querySelectorAll('[data-c]').forEach(x => x.disabled = true); b.classList.add(g ? 'on' : 'no');
        el.querySelector('.tr-why').innerHTML = `<div class="${g ? 'good' : 'bad'}">${g ? '✅' : '❌'} ${s.why || ''}</div><div class="row"><button class="btn sm" data-nx>ต่อไป →</button></div>`;
        el.querySelector('[data-nx]').onclick = () => { i++; show(); };
      });
    };
    el.innerHTML = head(cfg, 'ไล่โค้ด') + (cfg.code ? `<pre class="tr-code">${T.esc(cfg.code)}</pre>` : '') + '<div class="tr-b"></div>';
    show(); T.icons && T.icons();
  };
})();

/* ===== เครื่องจำลอง Excel ขนาดเล็ก (สูตร การอ้างอิงเซลล์ และฟังก์ชันพื้นฐาน) ===== */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const colN = s => s.split('').reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0);
  const colS = n => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
  const parse = r => { const m = /^\$?([A-Z]+)\$?(\d+)$/.exec(r); return m ? { c: colN(m[1]), r: +m[2] } : null; };
  const shift = (f, dr, dc) => f.replace(/"[^"]*"|(\$?)([A-Z]{1,2})(\$?)(\d+)(?![\d(])/g, (all, d1, col, d2, row) => all[0] === '"' ? all : d1 + (d1 ? col : colS(colN(col) + dc)) + d2 + (d2 ? row : (+row + dr)));
  const flat = a => a.reduce((x, y) => x.concat(Array.isArray(y) ? flat(y) : [y]), []);
  const nums = a => flat(a).filter(v => typeof v === 'number');
  const crit = (c) => { const m = /^(>=|<=|<>|>|<|=)?(.*)$/.exec(String(c)); const op = m[1] || '=', raw = m[2], n = raw !== '' && !isNaN(+raw) ? +raw : raw;
    return v => { const x = typeof n === 'number' ? +v : String(v); if (typeof n === 'number' && (v === '' || isNaN(+v))) return op === '<>'; return op === '=' ? x == n : op === '<>' ? x != n : op === '>' ? x > n : op === '<' ? x < n : op === '>=' ? x >= n : x <= n; }; };
  const F = {
    SUM: (...a) => nums(a).reduce((x, y) => x + y, 0), AVERAGE: (...a) => { const n = nums(a); if (!n.length) throw '#DIV/0!'; return n.reduce((x, y) => x + y, 0) / n.length; },
    MAX: (...a) => Math.max(...nums(a)), MIN: (...a) => Math.min(...nums(a)), COUNT: (...a) => nums(a).length, COUNTA: (...a) => flat(a).filter(v => v !== '' && v != null).length,
    COUNTIF: (r, c) => flat([r]).filter(crit(c)).length, SUMIF: (r, c, s) => { const k = crit(c), A = flat([r]), B = flat([s || r]); return A.reduce((t, v, i) => t + (k(v) ? +B[i] || 0 : 0), 0); },
    AVERAGEIF: (r, c, s) => { const k = crit(c), A = flat([r]), B = flat([s || r]); const v = A.map((x, i) => k(x) ? +B[i] : null).filter(x => x != null); if (!v.length) throw '#DIV/0!'; return v.reduce((a, b) => a + b, 0) / v.length; },
    IF: (c, a, b) => c ? a : (b === undefined ? false : b), IFS: (...a) => { for (let i = 0; i < a.length; i += 2) if (a[i]) return a[i + 1]; throw '#N/A'; },
    AND: (...a) => flat(a).every(Boolean), OR: (...a) => flat(a).some(Boolean), NOT: a => !a,
    ROUND: (x, n) => { const p = 10 ** (n || 0); return Math.round(x * p) / p; }, ABS: Math.abs,
    XLOOKUP: (v, a, b, nf) => { const A = flat([a]), B = flat([b]); const i = A.findIndex(x => String(x).toLowerCase() === String(v).toLowerCase()); if (i < 0) { if (nf !== undefined) return nf; throw '#N/A'; } return B[i]; },
    VLOOKUP: (v, t, col, approx) => { const rows = t.rows || [flat([t])]; const ex = approx === false || approx === 0; let hit = -1;
      rows.forEach((r, i) => { if (ex ? String(r[0]).toLowerCase() === String(v).toLowerCase() : +r[0] <= +v) if (hit < 0 || !ex) hit = ex && hit >= 0 ? hit : i; });
      if (hit < 0) throw '#N/A'; return rows[hit][col - 1]; },
    CONCAT: (...a) => flat(a).join(''), LEN: s => String(s).length, TODAY: () => '(วันที่)'
  };
  const toJS = f => {
    let s = f.replace(/^=/, ''), out = '', m;
    const re = /\s+|"[^"]*"|\$?[A-Z]{1,2}\$?\d+:\$?[A-Z]{1,2}\$?\d+|[A-Za-z][A-Za-z0-9.]*\s*\(|\$?[A-Z]{1,2}\$?\d+|\d+(\.\d+)?%?|<=|>=|<>|[=<>]|[-+*/^(),&]|TRUE|FALSE/gy;
    while (re.lastIndex < s.length) {
      const st = re.lastIndex; m = re.exec(s); if (!m || m.index !== st) throw '#NAME?'; const t = m[0];
      if (/^\s+$/.test(t)) out += ' ';
      else if (t[0] === '"') out += JSON.stringify(t.slice(1, -1));
      else if (t.includes(':')) { const [a, b] = t.split(':'); out += `R("${a.replace(/\$/g, '')}","${b.replace(/\$/g, '')}")`; }
      else if (/\($/.test(t)) { const n = t.replace(/\s*\($/, '').toUpperCase(); if (n === 'TRUE' || n === 'FALSE') out += n.toLowerCase() + '('; else if (!F[n]) throw '#NAME?'; else out += `F.${n}(`; }
      else if (/^\$?[A-Z]{1,2}\$?\d+$/.test(t)) out += `V("${t.replace(/\$/g, '')}")`;
      else if (/%$/.test(t)) out += '(' + parseFloat(t) / 100 + ')';
      else if (t === '=') out += '=='; else if (t === '<>') out += '!='; else if (t === '^') out += '**'; else if (t === '&') out += '+""+';
      else if (t === 'TRUE' || t === 'FALSE') out += t.toLowerCase();
      else out += t;
    }
    return out;
  };
  W.xlsim = (el, cfg, key) => {
    const base = {}; (cfg.rows || []).forEach((row, i) => row.forEach((v, j) => { if (v !== null && v !== undefined && v !== '') base[colS(j + 1) + (i + 1)] = v; }));
    const nC = Math.max(...cfg.rows.map(r => r.length), cfg.cols || 0), nR = cfg.rows.length;
    let ti = 0, user = {}, ok = 0, tries = 0;
    const evalAll = () => {
      const cells = Object.assign({}, base, user), memo = {}, busy = {};
      const val = a => { if (a in memo) return memo[a]; if (busy[a]) throw '#REF!'; let v = cells[a]; if (v === undefined) return '';
        if (typeof v === 'string' && v[0] === '=') { busy[a] = 1; try { v = new Function('V', 'R', 'F', 'return (' + toJS(v) + ')')(val, rng, F); } catch (e) { v = typeof e === 'string' ? e : '#VALUE!'; } busy[a] = 0; }
        if (typeof v === 'string' && v[0] === '#') { memo[a] = v; throw v; } return (memo[a] = v); };
      const rng = (a, b) => { const p = parse(a), q = parse(b), rows = []; for (let r = p.r; r <= q.r; r++) { const row = []; for (let c = p.c; c <= q.c; c++) { let v; try { v = val(colS(c) + r); } catch (e) { v = e; } row.push(v); } rows.push(row); } const f = flat(rows); f.rows = rows; return f; };
      const out = {}; for (let r = 1; r <= nR + 2; r++) for (let c = 1; c <= nC; c++) { const a = colS(c) + r; try { out[a] = val(a); } catch (e) { out[a] = e; } } return out;
    };
    const fmt = v => typeof v === 'number' ? (Number.isInteger(v) ? v.toLocaleString('en-US') : (+v.toFixed(2)).toLocaleString('en-US')) : v === true ? 'TRUE' : v === false ? 'FALSE' : (v ?? '');
    const range = s => { const [a, b] = s.split(':'), p = parse(a), q = parse(b || a), L = []; for (let r = p.r; r <= q.r; r++) for (let c = p.c; c <= q.c; c++) L.push(colS(c) + r); return L; };
    const draw = (msg) => {
      const t = cfg.tasks[ti], vals = evalAll(), hot = t ? range(t.fill || t.at) : [];
      el.innerHTML = `<div class="w-head"><span class="w-tag"><i data-lucide="sheet"></i>เครื่องจำลอง Excel</span><h4>${cfg.title || ''}</h4>${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>
        <div class="xl-wrap"><table class="xl"><tr><th></th>${Array.from({ length: nC }, (_, j) => `<th>${colS(j + 1)}</th>`).join('')}</tr>
        ${Array.from({ length: nR }, (_, i) => `<tr><th>${i + 1}</th>${Array.from({ length: nC }, (_, j) => { const a = colS(j + 1) + (i + 1), v = vals[a]; const isF = typeof (user[a] || base[a]) === 'string' && (user[a] || base[a])[0] === '='; return `<td class="${hot.includes(a) ? 'hot' : ''} ${i === 0 && cfg.head !== false ? 'hd' : ''} ${typeof v === 'string' && v[0] === '#' ? 'err' : ''}" title="${isF ? T.esc(user[a] || base[a]) : ''}">${fmt(v)}</td>`; }).join('')}</tr>`).join('')}</table></div>
        ${t ? `<div class="xl-task"><b>ข้อ ${ti + 1}/${cfg.tasks.length}</b> ${t.q}</div>
        <div class="xl-bar"><span class="xl-at">${t.at}</span><span class="fx">fx</span><input class="xl-in" placeholder="พิมพ์สูตร เช่น =B2*C2" spellcheck="false" autocomplete="off"><button class="btn sm" data-go>✔ ตรวจ</button></div>
        ${t.fill ? `<small class="muted">สูตรจะถูก “ลากคัดลอก” จาก ${t.at} ไปถึง ${t.fill.split(':')[1]} ให้อัตโนมัติ เหมือนดับเบิลคลิกจุดจับเติม</small>` : ''}
        ${msg || ''}${t.hint ? `<details class="xl-hint"><summary>💡 ขอคำใบ้</summary>${t.hint}</details>` : ''}`
        : `<div class="good">🎉 ทำครบ ${cfg.tasks.length} ข้อแล้ว ${ok === cfg.tasks.length && tries === cfg.tasks.length ? 'ถูกทุกข้อตั้งแต่ครั้งแรก!' : ''}</div>`}`;
      const inp = el.querySelector('.xl-in'), go = el.querySelector('[data-go]');
      if (inp) { inp.value = user[t.at] && typeof user[t.at] === 'string' ? user[t.at] : ''; inp.onkeydown = e => { if (e.key === 'Enter') go.click(); }; }
      if (go) go.onclick = () => check(inp.value.trim());
      T.icons && T.icons();
    };
    const check = f => {
      const t = cfg.tasks[ti]; if (!f) return; if (f[0] !== '=') f = '=' + f; tries++;
      const p0 = parse(t.at), cells = range(t.fill || t.at), saved = Object.assign({}, user);
      cells.forEach(a => { const p = parse(a); user[a] = shift(f, p.r - p0.r, p.c - p0.c); });
      const vals = evalAll();
      const want = Array.isArray(t.want) ? t.want : [t.want];
      const bad = cells.filter((a, i) => { const v = vals[a], w = want[i % want.length]; return typeof w === 'number' ? !(typeof v === 'number' && Math.abs(v - w) < 0.01) : String(v) !== String(w); });
      const mustOk = !t.must || new RegExp(t.must, 'i').test(f);
      if (!bad.length && mustOk) { ok++; ti++; T.toast && T.toast('✅ ถูกต้อง'); draw(`<div class="good">✅ ${t.ok || 'ถูกต้อง'}</div>`); if (ti >= cfg.tasks.length) { T.markWidget(key, cfg.xp || 20, el); draw(); } return; }
      user = saved; user[t.at] = f;
      const vv = vals[bad[0] || t.at];
      draw(`<div class="bad">❌ ${!mustOk ? (t.mustMsg || 'ผลถูกแต่ยังไม่ได้ใช้วิธีที่โจทย์กำหนด') : typeof vv === 'string' && vv[0] === '#' ? `เซลล์ ${bad[0]} ขึ้น ${vv} ตรวจชื่อฟังก์ชัน วงเล็บ และเครื่องหมายคำพูด` : `เซลล์ ${bad[0]} ได้ ${fmt(vv)} ยังไม่ตรงกับที่ควรเป็น${t.fill && !/\$/.test(f) && t.must && /\$/.test(t.must) ? ' ลองตรึงเซลล์ด้วย $' : ''}`}</div>`);
    };
    draw();
  };
  W.xlsim.toJS = toJS; W.xlsim.F = F; W.xlsim.shift = shift;
})();

/* ===== ห้องทดลองภาษากล้อง: ขนาดภาพ มุมกล้อง กฎสามส่วน ===== */
(function () {
  const T = window.T2, W = window.WIDGETS; if (!T || !W) return;
  const SIZES = [['ELS', 'Extreme Long Shot', 'ไกลมาก เห็นสถานที่กว้าง คนตัวเล็ก', 22, 128], ['LS', 'Long Shot', 'เห็นเต็มตัว บอกตำแหน่งในฉาก', 150, 18], ['MS', 'Medium Shot', 'ครึ่งตัว เห็นท่าทางและสีหน้า', 300, 22], ['MCU', 'Medium Close-up', 'ระดับอก นิยมใช้ตอนสนทนา', 440, 22], ['CU', 'Close-up', 'ใบหน้าเต็มเฟรม เน้นอารมณ์', 1050, -8], ['ECU', 'Extreme Close-up', 'เจาะรายละเอียด เช่น ดวงตา', 2600, -150]];
  const ANG = [['high', 'มุมสูง (High Angle)', 'มองลง ตัวละครดูเล็ก อ่อนแอ'], ['eye', 'ระดับสายตา (Eye Level)', 'เป็นกลาง เหมือนคนดูยืนคุยด้วย'], ['low', 'มุมต่ำ (Low Angle)', 'มองขึ้น ตัวละครดูยิ่งใหญ่ มีพลัง']];
  const person = (x, top, h, mood) => `<g transform="translate(${x} ${top}) scale(${h / 100})">
    <rect x="-14" y="54" width="10" height="44" rx="4" fill="#334155"/><rect x="4" y="54" width="10" height="44" rx="4" fill="#334155"/>
    <rect x="-18" y="15" width="36" height="42" rx="8" fill="#c2185b"/><rect x="-26" y="17" width="9" height="32" rx="4" fill="#c2185b"/><rect x="17" y="17" width="9" height="32" rx="4" fill="#c2185b"/>
    <circle cx="0" cy="8" r="8.5" fill="#f5c9a8"/><path d="M-8.5 6 Q0 -6 8.5 6 L8.5 2 Q0 -5 -8.5 2Z" fill="#1f1a17"/>
    <circle cx="-3" cy="8" r="1.1" fill="#1f1a17"/><circle cx="3" cy="8" r="1.1" fill="#1f1a17"/><circle cx="-2.6" cy="7.6" r=".35" fill="#fff"/><circle cx="3.4" cy="7.6" r=".35" fill="#fff"/>
    ${mood === 'sad' ? '<path d="M-2.5 12.6 Q0 11 2.5 12.6" stroke="#7c2d12" stroke-width=".7" fill="none"/>' : '<path d="M-2.5 11.4 Q0 13.4 2.5 11.4" stroke="#7c2d12" stroke-width=".7" fill="none"/>'}</g>`;
  W.shotlab = (el, cfg, key) => {
    let sz = 'LS', an = 'eye', thirds = false, ti = 0, ok = 0;
    const tasks = cfg.tasks || [];
    const draw = (msg) => {
      const S = SIZES.find(s => s[0] === sz), A = ANG.find(a => a[0] === an);
      let h = S[3], top = S[4], horizon = an === 'high' ? 34 : an === 'low' ? 82 : 60;
      if (an === 'high') { h *= .88; top += S[0] === 'ELS' ? 10 : 14; } if (an === 'low') { h *= 1.1; top -= S[0] === 'ELS' ? 12 : 10; }
      const x = thirds ? 213 : 160, t = tasks[ti];
      el.innerHTML = `<div class="w-head"><span class="w-tag"><i data-lucide="camera"></i>ห้องทดลองกล้อง</span><h4>${cfg.title || 'ลองจัดช็อต'}</h4>${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>
      <div class="shot-lab"><div><div class="shot-vf" style="background:linear-gradient(#bae6fd,#e0f2fe ${horizon}%,#86efac ${horizon}%)"><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${S[0] === 'ELS' ? '<rect x="40" y="70" width="40" height="40" fill="#94a3b8"/><polygon points="36,70 60,52 84,70" fill="#64748b"/><rect x="230" y="62" width="50" height="50" fill="#cbd5e1"/><circle cx="260" cy="40" r="12" fill="#fde047"/>' : ''}${person(x, top, h, cfg.mood)}</svg>${thirds ? '<div class="grid3"></div>' : ''}<span class="rec">● REC</span><span class="lbl">${S[0]} • ${A[1].split(' (')[0]}</span></div>
        <p class="muted" style="margin:6px 0 0"><b>${S[1]}</b> — ${S[2]}<br><b>${A[1]}</b> — ${A[2]}</p></div>
        <div><p style="margin:0 0 4px"><b>ขนาดภาพ</b></p><div class="chips2">${SIZES.map(s => `<button class="chip ${s[0] === sz ? 'on' : ''}" data-s="${s[0]}">${s[0]}</button>`).join('')}</div>
        <p style="margin:10px 0 4px"><b>มุมกล้อง</b></p><div class="chips2">${ANG.map(a => `<button class="chip ${a[0] === an ? 'on' : ''}" data-a="${a[0]}">${a[1].split(' (')[0]}</button>`).join('')}</div>
        <p style="margin:10px 0 4px"><label><input type="checkbox" data-t ${thirds ? 'checked' : ''}> แสดงเส้นกฎสามส่วน (Rule of Thirds)</label></p>
        ${t ? `<div class="xl-task" style="margin-top:12px"><b>โจทย์ ${ti + 1}/${tasks.length}</b> ${t.q}</div><button class="btn sm" data-go>📸 ถ่ายช็อตนี้</button>${msg || ''}` : tasks.length ? `<div class="good">🎬 ผ่านครบ ${tasks.length} โจทย์แล้ว</div>` : ''}</div></div>`;
      el.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { sz = b.dataset.s; draw(); });
      el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { an = b.dataset.a; draw(); });
      el.querySelector('[data-t]').onchange = e => { thirds = e.target.checked; draw(); };
      const g = el.querySelector('[data-go]'); if (g) g.onclick = () => {
        const good = (!t.size || [].concat(t.size).includes(sz)) && (!t.angle || [].concat(t.angle).includes(an)) && (!t.thirds || thirds);
        if (good) { ok++; ti++; if (ti >= tasks.length) T.markWidget(key, cfg.xp || 20, el); draw(`<div class="good">✅ ${t.why || 'ใช่เลย'}</div>`); }
        else draw(`<div class="bad">❌ ยังไม่ใช่ ลองคิดว่าคนดูควร “เห็นอะไร” และ “รู้สึกอย่างไร”${t.hint ? ' • ' + t.hint : ''}</div>`);
      };
      if (!tasks.length) T.markWidget(key, cfg.xp || 10, el);
      T.icons && T.icons();
    };
    draw();
  };
})();
