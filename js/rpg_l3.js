/* ด่าน RPG บทเรียนที่ 3: สัปดาห์วิทยาศาสตร์ บูธห้อง ม.2/5 (อิงหนังสือเรียน สสวท. บทที่ 4) */
(function () {
  const lk = (sh, hair, skin) => ({ sh, hair: hair || '#2b2118', skin: skin || '#f1c9a0' });
  const build = () => {
    const W = 44, H = 27, m = Array.from({ length: H }, () => Array(W).fill(','));
    const rect = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) m[y][x] = c; };
    rect(0, 0, 43, 13, '.');
    for (let x = 0; x < W; x++) { m[0][x] = '#'; m[9][x] = '#'; m[13][x] = '#'; }
    for (let y = 0; y <= 13; y++) { m[y][0] = '#'; m[y][43] = '#'; }
    for (let y = 0; y <= 9; y++) { m[y][14] = '#'; m[y][29] = '#'; }
    [7, 21, 36].forEach(x => m[9][x] = 'D');
    [6, 20, 21, 22, 23, 37].forEach(x => m[13][x] = 'D');
    // ห้องคอมพิวเตอร์
    rect(1, 1, 4, 1, 'S'); rect(2, 3, 5, 3, 'C'); rect(8, 3, 11, 3, 'C'); rect(2, 6, 5, 6, 'C'); rect(8, 6, 11, 6, 'C');
    // ห้องเรียน ม.2/5
    rect(19, 1, 23, 1, 'T');[3, 5, 7].forEach(y => { rect(16, y, 17, y, 'T'); rect(21, y, 22, y, 'T'); rect(25, y, 27, y, 'T'); });
    // ห้องเก็บอุปกรณ์
    rect(31, 1, 34, 2, 'X'); rect(38, 1, 41, 1, 'S'); rect(39, 6, 41, 7, 'X'); rect(31, 6, 32, 7, 'X');
    // ลานหน้าอาคาร
    rect(20, 14, 23, 26, '='); rect(3, 20, 40, 20, '='); rect(6, 14, 6, 19, '='); rect(37, 14, 37, 19, '=');
    rect(8, 16, 12, 16, 'B'); rect(26, 16, 31, 16, 'B'); rect(14, 23, 17, 23, 'B');
    rect(36, 23, 36, 23, 'K'); rect(38, 23, 38, 23, 'K'); rect(40, 23, 40, 23, 'K');
    for (let x = 0; x < W; x += 3) m[26][x] = 'P';[[1, 15], [42, 15], [1, 22], [42, 21], [12, 23], [30, 23]].forEach(([x, y]) => m[y][x] = 'P');
    return m.map(r => r.join(''));
  };
  const CL = {
    out: [ICO('monitor'), 'หน่วยส่งออก (Output)', 'นำผลจากการประมวลผลออกมาให้เห็นหรือได้ยิน เช่น จอภาพ ลำโพง เครื่องพิมพ์ จอภาพต้องได้รับสัญญาณภาพผ่านสายและพอร์ตที่ถูกต้อง เช่น HDMI ถ้าไม่มีสัญญาณ จอจะขึ้นว่า No Signal'],
    inp: [ICO('mic'), 'หน่วยรับเข้า (Input)', 'รับข้อมูลหรือคำสั่งจากภายนอกเข้าสู่คอมพิวเตอร์ เช่น คีย์บอร์ด เมาส์ ไมโครโฟน กล้อง เซนเซอร์ ต้องเลือกอุปกรณ์รับเข้าให้ถูกตัวในระบบด้วย ลำโพงรับเสียงไม่ได้ เพราะเป็นหน่วยส่งออก'],
    sto: [ICO('hard-drive'), 'หน่วยความจำและหน่วยจัดเก็บ', 'RAM เก็บข้อมูลชั่วคราวขณะทำงาน ปิดเครื่องหรือปิดแอปแล้วหาย ส่วนหน่วยจัดเก็บ เช่น SSD หรือการ์ดหน่วยความจำ เก็บไฟล์ถาวร การปิดแอปจึงไม่ได้เพิ่มพื้นที่จัดเก็บ ต้องย้ายหรือลบไฟล์'],
    cpu: [ICO('cpu'), 'หน่วยประมวลผลกลาง (CPU)', 'คำนวณ เปรียบเทียบ และควบคุมการทำงาน ทำงานเป็นวงรอบ: ดึงคำสั่ง (Fetch) → ถอดรหัส (Decode) → ทำตามคำสั่ง (Execute) → เก็บผล (Store) วนซ้ำเร็วมากหลายพันล้านครั้งต่อวินาที'],
    ipo: ['🔁', 'Input → Process → Output', 'งานทุกอย่างของคอมพิวเตอร์เดินทางผ่าน 3 ขั้น รับข้อมูลเข้า ประมวลผล แล้วส่งผลลัพธ์ออก โดยมีหน่วยความจำช่วยเก็บข้อมูลระหว่างทาง'],
    ew: ['♻️', 'ขยะอิเล็กทรอนิกส์', 'แบตเตอรี่และอุปกรณ์ไฟฟ้าที่เสียมีสารอันตราย ต้องทิ้งในถังขยะอันตราย/ขยะอิเล็กทรอนิกส์ เพื่อให้นำไปรีไซเคิลได้อย่างปลอดภัย และควรซ่อมหรือใช้ซ้ำก่อนทิ้ง (เศรษฐกิจหมุนเวียน BCG)']
  };
  const clue = (G, k) => G.clue(k, CL[k][1], CL[k][2], CL[k][0]);
  const need = G => ['q1', 'q2', 'q3'].concat(G.mode() > 1 ? ['q4'] : []).concat(G.mode() === 3 ? ['q5'] : []);
  const allDone = G => need(G).every(q => G.isDone(q));
    const QMAP = { q1: 'tonkhao', q2: 'boss', q3: 'namwan', q4: 'krunid', q5: 'junk' };
  const retarget = G => { Object.values(G.S.quests).forEach(x => x.target = null); const q = need(G).find(q => !G.isDone(q)); if (q && G.S.quests[q]) G.S.quests[q].target = G.flag(q + 'tgt') || QMAP[q]; else if (!q && !G.S.quests.fin) G.quest('fin', 'ทำป้ายหน้าบูธกับปลายฟ้า', 'กลับไปหาปลายฟ้าที่บูธ', 'plai'); G.refresh(); };
  const optsPanel = (G, title, q, opts, done) => G.panel(`<h3>${title}</h3><p>${q}</p><div class="rp-opts">${opts.map((o, i) => `<button data-i="${i}">${o[0]}</button>`).join('')}</div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
    pn.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const o = opts[+b.dataset.i], fb = pn.querySelector('.rp-fb'); fb.style.display = ''; if (o[1]) { b.classList.add('ok'); fb.className = 'rp-fb ok'; fb.innerHTML = '✅ ' + o[2]; pn.querySelectorAll('[data-i]').forEach(x => x.disabled = true); const n = document.createElement('button'); n.className = 'btn'; n.style.marginTop = '10px'; n.textContent = 'ตกลง'; n.onclick = () => close(true); pn.appendChild(n); done && done(); } else { G.S.wrong++; b.classList.add('bad'); fb.className = 'rp-fb bad'; fb.innerHTML = '💡 ' + o[2]; } });
  });

  (window.RPG_LEVELS = window.RPG_LEVELS || {}).l3 = {
    title: 'สัปดาห์วิทยาศาสตร์: บูธห้อง ม.2/5', icon: '🔬', map: build, spawn: [24, 18],
    story: 'พรุ่งนี้เป็นวันจัดบูธ <b>“เทคโนโลยีใกล้ตัว”</b> ของห้องเรา แต่อุปกรณ์หลายอย่างยังมีปัญหา เดินสำรวจโรงเรียน คุยกับเพื่อน ทดลองแก้ปัญหา และค้นคว้าที่ชั้นหนังสือ ความรู้ที่ค้นพบจะถูกเก็บไว้ใน <b>สมุดความรู้</b>',
    get totalClues() { return 6; },
    signs: [{ x: 7.5, y: 9.5, t: '💻 ห้องคอมพิวเตอร์', c: '#2563eb' }, { x: 21.5, y: 9.5, t: '📚 ห้องเรียน ม.2/5', c: '#16a34a' }, { x: 36.5, y: 9.5, t: '📦 ห้องเก็บอุปกรณ์', c: '#b45309' }, { x: 28.5, y: 15.2, t: '🔬 บูธ ม.2/5 เทคโนโลยีใกล้ตัว', c: '#7c3aed' }, { x: 10.5, y: 15.2, t: 'บูธ ม.2/1 หุ่นยนต์', c: '#475569' }, { x: 38, y: 22.2, t: 'จุดคัดแยกขยะ', c: '#0f766e' }],
    zones: [{ id: 'com', x0: 1, x1: 13, y0: 1, y1: 8, t: '💻 เข้าสู่ห้องคอมพิวเตอร์' }, { id: 'cls', x0: 15, x1: 28, y0: 1, y1: 8, t: '📚 ห้องเรียน ม.2/5' }, { id: 'sto', x0: 30, x1: 42, y0: 1, y1: 8, t: '📦 ห้องเก็บอุปกรณ์' }],
    floorUnder: (x, y) => y >= 14 ? ',' : '.',
    pcGlow: (x, y, G) => x === 8 && y === 3 ? G.flag('pcfixed') : !(x === 8 && y === 3),
    intro: async G => {
      await G.say('ปลายฟ้า', `${G.nick ? G.esc(G.nick) + ' ' : ''}มาพอดีเลย! พรุ่งนี้น้อง ๆ ประถมจะมาเที่ยวบูธ “เทคโนโลยีใกล้ตัว” ของห้องเรา แต่ตอนนี้มีปัญหาหลายจุด`);
      await G.say('ปลายฟ้า', 'ต้นข้าวอยู่ห้องคอม จอเปิดสไลด์ไม่ขึ้น บอสอยู่ในห้องเรียน อัดเสียงพากย์ไม่ติด ส่วนน้ำหวานอยู่ตรงนี้ มือถือเต็มจนถ่ายรูปไม่ได้');
      if (G.mode() > 1) await G.say('ปลายฟ้า', 'ครูนิดที่บูธก็อยากให้ช่วยเตรียมคำอธิบายเรื่อง CPU ให้น้อง ๆ ด้วยนะ');
      if (G.mode() === 3) await G.say('ปลายฟ้า', 'อีกอย่าง ห้องเก็บอุปกรณ์มีของเสียกองอยู่ ช่วยคัดแยกทิ้งให้ถูกที่ด้วย');
      await G.say('ปลายฟ้า', G.mode() === 1 ? 'ทำตามลูกศรสีส้มได้เลย ถ้าไม่แน่ใจ ลองไปค้นที่ชั้นหนังสือในห้องคอมนะ' : 'เดินไปคุยกับเพื่อนได้ตามสะดวก ถ้าไม่แน่ใจ ลองไปค้นที่ชั้นหนังสือในห้องคอม');
      G.quest('q1', 'จอของต้นข้าวไม่ขึ้นภาพ', 'ไปที่ห้องคอมพิวเตอร์'); G.quest('q2', 'บอสอัดเสียงไม่ติด', 'ไปที่ห้องเรียน ม.2/5'); G.quest('q3', 'มือถือของน้ำหวานเต็ม', 'คุยกับน้ำหวานที่บูธ');
      if (G.mode() > 1) G.quest('q4', 'ช่วยครูนิดอธิบายเรื่อง CPU', 'คุยกับครูนิดที่บูธ');
      if (G.mode() === 3) G.quest('q5', 'คัดแยกของเสียในห้องเก็บอุปกรณ์', 'หาของเสียในห้องเก็บอุปกรณ์');
      retarget(G);
    },
    stars: G => G.S.wrong <= 1 ? 3 : G.S.wrong <= 4 ? 2 : 1,
    winTitle: 'บูธพร้อมเปิดแล้ว!',
    winHTML: G => `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:6px 0">${G.S.clues.map(c => `<span style="background:#f3f6ff;border-radius:10px;padding:4px 10px;font-size:13.5px">${c.em} ${c.title}</span>`).join('')}</div><p style="text-align:center;font-size:14px;margin:8px 0 0">ทุกปัญหาที่แก้ไปคือหน่วยต่าง ๆ ของระบบคอมพิวเตอร์ ลองเปิดสมุดความรู้เพื่อทบทวน</p>`,
    ents: [
      { id: 'plai', qid: 'fin', name: 'ปลายฟ้า', em: '👧', x: 27, y: 18, lk: lk('#7c3aed', '#1f1a17'), mark: G => allDone(G) && !G.flag('won') ? '!' : null,
        on: async G => {
          if (G.flag('won')) { await G.say('ปลายฟ้า', 'ขอบคุณมาก บูธเราพร้อมแล้ว!'); return; }
          if (!allDone(G)) { const left = need(G).filter(q => !G.isDone(q)).map(q => G.S.quests[q].title); await G.say('ปลายฟ้า', 'ยังเหลือ: ' + left.join(' • ')); return; }
          await G.say('ปลายฟ้า', 'เก่งมาก! ทุกอย่างพร้อมแล้ว ขั้นสุดท้าย ช่วยทำป้ายหน้าบูธอธิบายลำโพงอัจฉริยะให้น้อง ๆ ดูหน่อย');
          const ok = await G.panel(`<h3>🪧 ป้ายหน้าบูธ: ลำโพงอัจฉริยะทำงานอย่างไร?</h3><p>น้องพูดว่า <b>“เปิดเพลงโปรด”</b> แตะการ์ดให้ตรงกับแต่ละขั้น</p>
            <div class="rp-opts" data-pool>${['🎤 ไมโครโฟนรับเสียงพูด', '🧠 CPU แปลงเสียงเป็นคำสั่งและค้นหาเพลง', '🔊 ลำโพงเล่นเพลง', '🗂️ SSD เก็บไฟล์รูปภาพ'].map((t, i) => `<button data-c="${i}">${t}</button>`).join('')}</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px">${['Input', 'Process', 'Output'].map((s, i) => `<div style="background:#f6f8fd;border-radius:12px;padding:8px;min-height:64px;font-size:13.5px" data-s="${i}"><b>${i + 1}. ${s}</b><div></div></div>`).join('')}</div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
            let k = 0;
            pn.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const fb = pn.querySelector('.rp-fb'); fb.style.display = ''; if (+b.dataset.c === k) { pn.querySelector(`[data-s="${k}"] div`).textContent = b.textContent; b.remove(); k++; fb.className = 'rp-fb ok'; fb.textContent = '✅ ถูกต้อง'; if (k === 3) { fb.innerHTML = '🎉 ป้ายเสร็จแล้ว! Input → Process → Output'; const n = document.createElement('button'); n.className = 'btn gold'; n.style.marginTop = '10px'; n.textContent = 'ติดป้ายหน้าบูธ'; n.onclick = () => close(true); pn.appendChild(n); } } else { G.S.wrong++; fb.className = 'rp-fb bad'; fb.textContent = +b.dataset.c === 3 ? '💡 SSD เก็บไฟล์ แต่ไม่ได้อยู่ในเส้นทางของคำสั่งเสียงนี้' : '💡 ลองนึกว่าเสียงต้องเข้ามาก่อน แล้วจึงถูกประมวลผล ก่อนออกเป็นเพลง'; } });
          });
          if (!ok) return;
          clue(G, 'ipo'); G.flag('won', 1); G.done('fin');
          await G.say('ปลายฟ้า', 'สุดยอด! พรุ่งนี้น้อง ๆ ต้องเข้าใจแน่ ขอบคุณที่ช่วยห้องเรานะ'); G.end(); G.win();
        } },
      { id: 'namwan', qid: 'q3', name: 'น้ำหวาน', em: '👩', x: 31, y: 18, lk: lk('#ec4899', '#3b2314'), mark: G => G.isDone('q3') ? null : G.flag('q3a') ? '?' : '!',
        on: async G => {
          if (G.isDone('q3')) { await G.say('น้ำหวาน', 'ถ่ายรูปบูธได้แล้ว รูปกิจกรรมก็ยังอยู่ครบ ขอบคุณนะ 📸'); return; }
          if (!G.flag('q3a')) {
            await G.say('น้ำหวาน', 'จะถ่ายรูปบูธลงเพจห้อง แต่มือถือขึ้นว่า “พื้นที่จัดเก็บเต็ม” เพื่อนบอกให้ปิดแอปที่เปิดค้างทั้งหมด แล้วจะมีที่ว่างเอง จริงไหม?');
            G.flag('q3a', 1); G.quest('q3', 'มือถือของน้ำหวานเต็ม', 'ขอดูหน้าการตั้งค่าพื้นที่จัดเก็บ');
          }
          const c = await G.choose('จะทำอย่างไรดี?', ['📱 ขอดูหน้าการตั้งค่าพื้นที่จัดเก็บ', 'ไว้ก่อน']); if (c) return;
          const ok = await G.panel(`<h3>📱 การตั้งค่า › พื้นที่จัดเก็บ</h3><p style="margin:0 0 6px">ทดลองกดทีละปุ่ม แล้วดูว่าพื้นที่ว่างเปลี่ยนไปอย่างไร ต้องมีที่ว่างอย่างน้อย <b>20 GB</b> โดยไม่ทำให้รูปกิจกรรมหาย</p>
            <div style="font-size:14px">ใช้ไป <b data-u>126</b> / 128 GB • ว่าง <b data-f>2</b> GB • RAM ที่ใช้ <b data-r>5.6</b> / 6 GB</div><div class="meter"><span data-bar style="width:98%;background:#ef4444"></span></div>
            <table class="tbl" style="font-size:14px"><tr><td>🎬 วิดีโอ</td><td>52 GB</td></tr><tr><td>🖼️ รูปภาพ (รูปกิจกรรมห้อง)</td><td>38 GB</td></tr><tr><td>🎮 แอปและเกม</td><td>24 GB</td></tr><tr><td>⚙️ ระบบ</td><td>12 GB</td></tr></table>
            <div class="rp-opts">${[['🧹 ปิดแอปที่เปิดค้างทั้งหมด', 'ram'], ['☁️ สำรองวิดีโอขึ้น Google Drive แล้วลบออกจากเครื่อง', 'vid'], ['🎮 ลบเกม 2 เกมที่ไม่ได้เล่นแล้ว', 'game'], ['🗑️ ลบรูปภาพทั้งหมด', 'pic']].map(o => `<button data-a="${o[1]}">${o[0]}</button>`).join('')}</div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
            let free = 2, ram = 5.6; const fb = pn.querySelector('.rp-fb');
            const upd = () => { pn.querySelector('[data-u]').textContent = 128 - free; pn.querySelector('[data-f]').textContent = free; pn.querySelector('[data-r]').textContent = ram.toFixed(1); const b = pn.querySelector('[data-bar]'); b.style.width = (128 - free) / 1.28 + '%'; b.style.background = free >= 20 ? '#16a34a' : '#ef4444'; };
            pn.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
              const a = b.dataset.a; fb.style.display = '';
              if (a === 'ram') { ram = 1.8; b.disabled = true; fb.className = 'rp-fb bad'; fb.innerHTML = '🔍 สังเกต: RAM ว่างขึ้นจาก 5.6 เหลือ 1.8 GB แต่พื้นที่จัดเก็บ <b>ไม่เปลี่ยนเลย</b> ทำไมนะ?'; G.flag('ramtry', 1); }
              if (a === 'vid') { free += 30; b.disabled = true; b.classList.add('ok'); fb.className = 'rp-fb ok'; fb.innerHTML = '✅ ว่างขึ้น 30 GB และวิดีโอยังอยู่บนคลาวด์'; }
              if (a === 'game') { free += 6; b.disabled = true; b.classList.add('ok'); fb.className = 'rp-fb ok'; fb.innerHTML = '✅ ว่างขึ้น 6 GB'; }
              if (a === 'pic') { G.S.wrong++; b.classList.add('bad'); fb.className = 'rp-fb bad'; fb.innerHTML = '😱 เดี๋ยวก่อน! รูปกิจกรรมของห้องจะหายหมด ไม่ใช่ทางที่ดี ลองวิธีอื่น'; }
              upd();
              if (free >= 20 && !pn.querySelector('.btn')) { const n = document.createElement('button'); n.className = 'btn'; n.style.marginTop = '10px'; n.textContent = 'เรียบร้อย กลับไปคุยกับน้ำหวาน'; n.onclick = () => close(true); pn.appendChild(n); }
            });
          });
          if (!ok) return;
          await G.say('น้ำหวาน', 'ว่างแล้ว 🎉 แต่สงสัยจัง ตอนปิดแอปทำไมพื้นที่ไม่เพิ่มล่ะ?');
          await G.quiz('น้ำหวาน', 'อธิบายให้น้ำหวานฟังว่าอย่างไร?', [
            ['แอปที่เปิดค้างอยู่ใช้ RAM ซึ่งเป็นความจำชั่วคราว แต่ไฟล์รูปและวิดีโอเก็บอยู่ในหน่วยจัดเก็บ', 1, 'ใช่เลย! ปิดแอปช่วยให้เครื่องลื่นขึ้น แต่ถ้าพื้นที่จัดเก็บเต็ม ต้องย้ายหรือลบไฟล์', ''],
            ['ปิดแอปแล้วไฟล์จะถูกลบเองตอนรีสตาร์ต', 0, 'ไม่ใช่ ไฟล์ในหน่วยจัดเก็บไม่ถูกลบเพราะปิดแอป', 'ลองเทียบตัวเลข RAM กับพื้นที่จัดเก็บในหน้าตั้งค่า'],
            ['เพราะมือถือเสีย', 0, 'มือถือไม่ได้เสีย ตัวเลข RAM ยังลดลงตามปกติ', 'ดูว่าปุ่มปิดแอปทำให้ตัวเลขไหนเปลี่ยน']]);
          clue(G, 'sto'); G.done('q3'); retarget(G);
        } },
      { id: 'krunid', qid: 'q4', calm: 1, name: 'ครูนิด', em: '👩‍🏫', x: 24, y: 17, lk: lk('#0f766e', '#111'), mark: G => G.mode() === 1 ? null : G.isDone('q4') ? null : '!',
        on: async G => {
          if (G.mode() === 1) { await G.say('ครูนิด', 'สู้ ๆ นะ ถ้าติดตรงไหน ชั้นหนังสือในห้องคอมมีคำตอบเสมอ'); return; }
          if (G.isDone('q4')) { await G.say('ครูนิด', 'คำอธิบายเรื่อง CPU ชัดเจนมาก น้อง ๆ ต้องชอบแน่'); return; }
          await G.say('ครูนิด', 'บูธเรามีเกมตอบคำถาม ทุกครั้งที่น้องตอบถูก โปรแกรมจะเพิ่มคะแนน 1 แต้ม ครูอยากได้ภาพอธิบายว่า CPU ทำงานตามลำดับอย่างไร');
          G.quest('q4', 'ช่วยครูนิดอธิบายเรื่อง CPU', 'เรียงวงรอบการทำงานของ CPU');
          const ok = await G.panel(`<h3>🧠 CPU เพิ่มคะแนน 1 แต้มอย่างไร?</h3><p>แตะการ์ดตามลำดับที่ CPU ทำงาน${G.mode() === 2 ? ' (ถ้าไม่แน่ใจ ลองค้นที่ชั้นหนังสือก่อน)' : ''}</p><div data-seq style="display:grid;gap:6px;margin:8px 0"></div>
            <div class="rp-opts">${['📥 ดึงคำสั่ง “คะแนน + 1” จากหน่วยความจำ', '🔍 ถอดรหัสว่าคำสั่งนี้ให้บวก', '⚙️ คำนวณ คะแนนเดิม + 1', '🗂️ เก็บคะแนนใหม่กลับไปที่หน่วยความจำ'].map((x, i) => ({ x, i })).sort(() => Math.random() - .5).map(o => `<button data-i="${o.i}">${o.x}</button>`).join('')}</div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
            let k = 0; const fb = pn.querySelector('.rp-fb');
            pn.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { fb.style.display = ''; if (+b.dataset.i === k) { pn.querySelector('[data-seq]').insertAdjacentHTML('beforeend', `<div style="background:#ecfdf3;border-radius:10px;padding:6px 10px">${k + 1}. ${b.textContent}</div>`); b.remove(); k++; fb.className = 'rp-fb ok'; fb.textContent = k === 4 ? '🎉 นี่คือวงรอบเครื่อง (Machine cycle)' : '✅ ถูกต้อง'; if (k === 4) { const n = document.createElement('button'); n.className = 'btn'; n.style.marginTop = '10px'; n.textContent = 'ส่งให้ครูนิด'; n.onclick = () => close(true); pn.appendChild(n); } } else { G.S.wrong++; fb.className = 'rp-fb bad'; fb.textContent = '💡 CPU ต้องได้คำสั่งมาก่อน จึงรู้ว่าต้องทำอะไร'; } });
          });
          if (!ok) return;
          clue(G, 'cpu'); await G.say('ครูนิด', 'เยี่ยมมาก วงรอบนี้เกิดขึ้นหลายพันล้านครั้งต่อวินาที เกมเราจึงเพิ่มคะแนนได้ทันที'); G.done('q4'); retarget(G);
        } },
      { id: 'tonkhao', qid: 'q1', name: 'ต้นข้าว', em: '👦', x: 7, y: 4, lk: lk('#2563eb', '#111'), mark: G => G.isDone('q1') ? null : G.flag('pcfixed') ? '?' : G.flag('q1a') ? null : '!',
        on: async G => {
          if (G.isDone('q1')) { await G.say('ต้นข้าว', 'สไลด์ขึ้นแล้ว พรุ่งนี้พร้อมนำเสนอ!'); return; }
          if (G.flag('pcfixed')) {
            await G.say('ต้นข้าว', 'จอขึ้นแล้ว! ว่าแต่ปัญหาเมื่อกี้เกิดที่หน่วยไหนของคอมพิวเตอร์เหรอ?');
            await G.quiz('ต้นข้าว', 'ตอบต้นข้าวว่า…', [['หน่วยส่งออก เพราะจอภาพไม่ได้รับสัญญาณภาพจากเครื่อง', 1, 'ใช่! เครื่องประมวลผลอยู่ตลอด แต่ผลลัพธ์ส่งไปไม่ถึงจอ'], ['หน่วยประมวลผล เพราะ CPU เสีย', 0, 'ไฟเครื่องติดและพัดลมหมุน แสดงว่าเครื่องยังทำงานอยู่', 'นึกถึงสิ่งที่เห็นตอนตรวจตัวเครื่อง'], ['หน่วยรับเข้า เพราะเมาส์ไม่ได้เสียบ', 0, 'เมาส์ไม่ได้ทำให้จอขึ้นว่า No Signal', 'จอขึ้นข้อความอะไรนะ?']]);
            G.done('q1'); retarget(G); return;
          }
          if (!G.flag('q1a')) { await G.say('ต้นข้าว', 'จะเปิดสไลด์แนะนำบูธ แต่จอมืด ทั้งที่ไฟเครื่องก็ติด กดเปิดใหม่หลายรอบแล้วก็ยังเหมือนเดิม ช่วยดูเครื่องนี้หน่อยได้ไหม'); G.flag('q1a', 1); G.flag('q1tgt', 'pc1'); G.quest('q1', 'จอของต้นข้าวไม่ขึ้นภาพ', 'ตรวจคอมพิวเตอร์เครื่องที่มีเครื่องหมาย'); retarget(G); return; }
          await G.say('ต้นข้าว', G.got('hdmi') ? 'ได้สายมาแล้วเหรอ ลองต่อที่ด้านหลังเครื่องเลย' : G.flag('pcdiag') ? 'ห้องเก็บอุปกรณ์น่าจะมีสายสำรองนะ' : 'ลองตรวจเครื่องตรงนี้ดูก่อนนะ');
        } },
      { id: 'pc1', em: '🖥️', ico: 'monitor', x: 8, y: 4, label: 'คอมของต้นข้าว', mark: G => G.flag('q1a') && !G.flag('pcfixed'),
        on: async G => {
          if (!G.flag('q1a')) { await G.say('ระบบ', 'คอมพิวเตอร์เครื่องนี้จอมืดอยู่ ลองคุยกับต้นข้าวก่อน', { em: '🖥️' }); return; }
          if (G.flag('pcfixed')) { await G.say('ระบบ', 'หน้าจอแสดงสไลด์ “บูธเทคโนโลยีใกล้ตัว” เรียบร้อย', { em: '🖥️' }); return; }
          if (!G.flag('pcdiag')) {
            const ok = await G.panel(`<h3>🔍 ตรวจเครื่องของต้นข้าว</h3><p>แตะเพื่อตรวจทีละจุด แล้วสังเกตหลักฐาน</p><div class="rp-opts">
              <button data-h="0">🔎 ดูตัวเครื่อง (เคส)</button><button data-h="1">🖥️ ดูจอภาพ</button><button data-h="2">🔌 ดูด้านหลังเครื่อง</button></div><div data-log></div>`, (pn, close) => {
              const N = ['ไฟเขียวที่ตัวเครื่องติด ได้ยินเสียงพัดลมหมุน → <b>เครื่องเปิดและประมวลผลอยู่</b>', 'ไฟจอสีส้มติด มีข้อความ <b>“No Signal”</b> → จอเปิดอยู่ แต่ไม่ได้รับสัญญาณภาพ', 'ช่อง HDMI ด้านหลังเครื่อง <b>ว่าง ไม่มีสายต่อไปที่จอ</b> (สายเดิมหายไปไหนนะ?)'], seen = new Set();
              pn.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { seen.add(b.dataset.h); b.classList.add('ok'); pn.querySelector('[data-log]').innerHTML = [...seen].sort().map(i => `<div class="rp-clue" style="margin:6px 0"><span>📝</span><div><p>${N[i]}</p></div></div>`).join(''); if (seen.size === 3 && !pn.querySelector('.btn')) { const n = document.createElement('button'); n.className = 'btn'; n.textContent = 'สรุปสาเหตุ'; n.onclick = () => close(true); pn.appendChild(n); } });
            });
            if (!ok) return;
            await G.quiz('ระบบ', 'จากหลักฐานทั้ง 3 ข้อ สาเหตุน่าจะเป็นอะไร?', [['ไม่มีสายส่งสัญญาณภาพจากเครื่องไปที่จอ', 1, 'ใช่ เครื่องทำงานปกติ แต่ผลลัพธ์ส่งไปไม่ถึงจอ ไปหาสาย HDMI ที่ห้องเก็บอุปกรณ์กัน'], ['จอภาพเสีย', 0, 'จอยังขึ้นข้อความ No Signal ได้ แสดงว่าจอยังทำงานอยู่', 'อ่านหลักฐานข้อ 2 อีกครั้ง'], ['CPU ไหม้', 0, 'ไฟเครื่องติดและพัดลมหมุนปกติ', 'อ่านหลักฐานข้อ 1 อีกครั้ง']]);
            G.flag('pcdiag', 1); G.flag('q1tgt', 'box1'); G.quest('q1', 'จอของต้นข้าวไม่ขึ้นภาพ', 'หาสาย HDMI ที่ห้องเก็บอุปกรณ์'); retarget(G); return;
          }
          if (!G.got('hdmi')) { await G.say('ระบบ', 'ช่อง HDMI ยังว่างอยู่ ต้องหาสายมาก่อน', { em: '🔌' }); return; }
          const ok = await G.panel(`<h3>🔌 ด้านหลังเครื่อง: ต่อสาย HDMI</h3>${PHOTO('hdmi', 130)}<p>สายมีหัวเสียบแบบ HDMI เลือกช่องที่ถูกต้อง</p><div class="rp-opts">
            <button data-p="usb">▭ ช่อง USB (เสียบเมาส์ คีย์บอร์ด แฟลชไดรฟ์)</button><button data-p="lan">▣ ช่อง LAN (สายแลน เชื่อมเครือข่าย)</button><button data-p="hdmi">⬓ ช่อง HDMI (ส่งภาพและเสียง)</button><button data-p="au">◉ ช่องเสียบหูฟัง</button></div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
            const F = { usb: 'หัวสาย HDMI ใส่ช่อง USB ไม่ได้ ช่อง USB ส่วนใหญ่ใช้กับอุปกรณ์รับเข้าและแฟลชไดรฟ์', lan: 'ช่อง LAN ใช้เชื่อมต่อเครือข่าย ไม่ได้ส่งภาพไปที่จอ', au: 'ช่องนี้ส่งเสียงไปหูฟังหรือลำโพง ไม่ใช่ภาพ' };
            pn.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const fb = pn.querySelector('.rp-fb'); fb.style.display = ''; if (b.dataset.p === 'hdmi') { b.classList.add('ok'); fb.className = 'rp-fb ok'; fb.innerHTML = '✅ คลิก! จอสว่างขึ้นและแสดงสไลด์แล้ว'; const n = document.createElement('button'); n.className = 'btn'; n.style.marginTop = '10px'; n.textContent = 'เยี่ยม'; n.onclick = () => close(true); pn.appendChild(n); } else { G.S.wrong++; b.classList.add('bad'); fb.className = 'rp-fb bad'; fb.textContent = '💡 ' + F[b.dataset.p]; } });
          });
          if (!ok) return;
          G.take('hdmi'); G.flag('pcfixed', 1); clue(G, 'out'); G.flag('q1tgt', 'tonkhao'); G.quest('q1', 'จอของต้นข้าวไม่ขึ้นภาพ', 'กลับไปบอกต้นข้าว'); retarget(G);
        } },
      { id: 'shelf', em: '📚', x: 3, y: 2, label: 'ชั้นหนังสือค้นคว้า', verb: 'ค้นคว้า', mark: () => true,
        on: async G => {
          const T = [['inp', 'หน่วยรับเข้า'], ['out', 'หน่วยส่งออก'], ['cpu', 'หน่วยประมวลผลกลาง (CPU)'], ['sto', 'หน่วยความจำ / หน่วยจัดเก็บ']];
          await G.panel(`<h3>📚 ชั้นหนังสือค้นคว้า</h3><p style="margin-top:0">หนังสือเรียนวิทยาการคำนวณ ม.2 บทที่ 4 • เลือกหัวข้อที่อยากรู้</p><div class="rp-opts">${T.map(x => `<button data-k="${x[0]}">📖 ${x[1]}</button>`).join('')}</div><div data-o></div>`, (pn) => {
            pn.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const c = CL[b.dataset.k]; pn.querySelector('[data-o]').innerHTML = `<div class="rp-clue"><span>${c[0]}</span><div><b>${c[1]}</b><p>${c[2]}</p></div></div>${({ inp: PHOTO('mic', 140), cpu: PHOTO('cpu', 140), sto: PHOTO('ssd', 140) })[b.dataset.k] || ''}<p style="font-size:13px;color:var(--muted)">อ่านเพิ่มได้ที่หนังสือเรียน หน้า 76–99</p>`; G.flag('read:' + b.dataset.k, 1); });
          });
        } },
      { id: 'box1', em: '📦', x: 33, y: 3, label: 'กล่องอุปกรณ์', mark: G => G.flag('pcdiag') && !G.got('hdmi') && !G.flag('pcfixed'),
        on: async G => {
          if (!G.flag('pcdiag') || G.flag('pcfixed') || G.got('hdmi')) { await G.say('ระบบ', 'กล่องใส่สายไฟและอุปกรณ์สำรองของโรงเรียน', { em: '📦' }); return; }
          await optsPanel(G, '📦 กล่องอุปกรณ์สำรอง', 'ต้องใช้สายแบบไหนต่อคอมพิวเตอร์เข้ากับจอภาพ?', [['⬓ สาย HDMI', 1, 'ได้สาย HDMI แล้ว กลับไปต่อที่ด้านหลังคอมของต้นข้าว'], ['▣ สาย LAN', 0, 'สาย LAN ใช้เชื่อมต่อเครือข่าย ไม่ได้ส่งภาพ'], ['🔌 สายชาร์จมือถือ', 0, 'สายชาร์จจ่ายไฟให้มือถือ ไม่เกี่ยวกับจอภาพ']], () => { G.give('hdmi', '⬓', 'สาย HDMI'); G.flag('q1tgt', 'pc1'); G.quest('q1', 'จอของต้นข้าวไม่ขึ้นภาพ', 'ต่อสายที่ด้านหลังคอมของต้นข้าว'); retarget(G); });
        } },
      { id: 'boss', qid: 'q2', name: 'บอส', em: '🧑', x: 19, y: 4, lk: lk('#f59e0b', '#2b2118'), mark: G => G.isDone('q2') ? null : G.flag('micok') ? '?' : G.flag('q2a') ? null : '!',
        on: async G => {
          if (G.isDone('q2')) { await G.say('บอส', 'อัดเสียงพากย์เสร็จแล้ว เสียงชัดมาก!'); return; }
          if (G.flag('micok')) {
            await G.say('บอส', 'เสียงเข้าแล้ว! แต่ทำไมตอนเลือก “ลำโพง” มันไม่รับเสียงล่ะ?');
            await G.quiz('บอส', 'ตอบบอสว่า…', [['ลำโพงเป็นหน่วยส่งออก ส่งเสียงออกมาได้แต่รับเสียงเข้าไม่ได้ ต้องเลือกไมโครโฟนซึ่งเป็นหน่วยรับเข้า', 1, 'เข้าใจแล้ว! ต้องเลือกอุปกรณ์รับเข้าให้ถูกตัว'], ['ลำโพงรุ่นนี้เก่าเกินไป', 0, 'ลำโพงทุกรุ่นทำหน้าที่ส่งเสียงออก', 'ลำโพงอยู่หน่วยไหนนะ?'], ['ต้องเปิดเสียงลำโพงให้ดังขึ้น', 0, 'ความดังของลำโพงไม่ช่วยให้รับเสียงพูดได้', 'คิดถึงทิศทางของข้อมูล เข้า หรือ ออก']]);
            G.done('q2'); retarget(G); return;
          }
          if (!G.flag('q2a')) { await G.say('บอส', 'จะอัดเสียงพากย์คลิปแนะนำบูธ เสียบไมค์ USB แล้วนะ แต่พูดไปกราฟเสียงก็แบนราบ ไม่ขึ้นเลย ช่วยลองดูโน้ตบุ๊กหน่อย'); G.flag('q2a', 1); G.flag('q2tgt', 'lap'); G.quest('q2', 'บอสอัดเสียงไม่ติด', 'ทดลองตั้งค่าเสียงที่โน้ตบุ๊ก'); retarget(G); return; }
          await G.say('บอส', 'โน้ตบุ๊กอยู่บนโต๊ะข้าง ๆ นี่เอง');
        } },
      { id: 'lap', em: '💻', ico: 'laptop', x: 20, y: 4, label: 'โน้ตบุ๊กของบอส', mark: G => G.flag('q2a') && !G.flag('micok'),
        on: async G => {
          if (!G.flag('q2a')) { await G.say('ระบบ', 'โน้ตบุ๊กเปิดโปรแกรมอัดเสียงค้างไว้ ลองคุยกับบอสก่อน', { em: '💻' }); return; }
          if (G.flag('micok')) { await G.say('ระบบ', 'โปรแกรมอัดเสียงพร้อมใช้งาน', { em: '💻' }); return; }
          const ok = await G.panel(`<h3>💻 การตั้งค่า › เสียง › อุปกรณ์รับเสียง (Input)</h3><p style="margin-top:0">เลือกอุปกรณ์ แล้วกด “ทดสอบพูด” สังเกตกราฟเสียง</p>
            <div class="rp-opts">${[['spk', '🔊 ลำโพง Realtek'], ['int', '🎙️ ไมโครโฟนในตัว (ปิดเสียงอยู่)'], ['usb', '🎤 ไมโครโฟน USB']].map(o => `<button data-d="${o[0]}">${o[1]}</button>`).join('')}</div>
            <button class="btn" data-t disabled>🗣️ ทดสอบพูด</button><div data-w style="height:46px;display:flex;align-items:center;gap:3px;margin:10px 0;background:#0f172a;border-radius:10px;padding:0 10px"></div><div class="rp-fb" style="display:none"></div>`, (pn, close) => {
            let dev = null; const wv = pn.querySelector('[data-w]'), fb = pn.querySelector('.rp-fb'), flat = () => wv.innerHTML = Array(40).fill('<i style="width:3px;height:2px;background:#475569;display:block"></i>').join(''); flat();
            pn.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { dev = b.dataset.d; pn.querySelectorAll('[data-d]').forEach(x => x.style.borderColor = x === b ? 'var(--blue)' : ''); pn.querySelector('[data-t]').disabled = false; flat(); fb.style.display = 'none'; });
            pn.querySelector('[data-t]').onclick = () => {
              fb.style.display = '';
              if (dev === 'usb') { wv.innerHTML = Array(40).fill(0).map(() => `<i style="width:3px;height:${6 + Math.random() * 30}px;background:#22c55e;display:block;border-radius:2px"></i>`).join(''); fb.className = 'rp-fb ok'; fb.innerHTML = '✅ กราฟเสียงขยับแล้ว! ไมโครโฟน USB รับเสียงเข้าสู่เครื่อง'; if (!pn.querySelector('.btn.gold')) { const n = document.createElement('button'); n.className = 'btn gold'; n.textContent = 'บันทึกการตั้งค่า'; n.onclick = () => close(true); pn.appendChild(n); } }
              else { G.S.wrong++; flat(); fb.className = 'rp-fb bad'; fb.innerHTML = dev === 'spk' ? '🔍 กราฟแบนราบ ลำโพงส่งเสียงออกมา แต่รับเสียงพูดเข้าไม่ได้' : '🔍 กราฟแบนราบ ไมค์ในตัวถูกปิดเสียงไว้ และบอสเสียบไมค์ USB ไว้แล้ว'; }
            };
          });
          if (!ok) return;
          G.flag('micok', 1); clue(G, 'inp'); G.flag('q2tgt', 'boss'); G.quest('q2', 'บอสอัดเสียงไม่ติด', 'กลับไปบอกบอส'); retarget(G);
        } },
      { id: 'junk', em: '🔋', x: 40, y: 5, label: 'ของเสียกองไว้', mark: G => G.mode() === 3 && !G.got('junk') && !G.isDone('q5'),
        on: async G => {
          if (G.mode() !== 3) { await G.say('ระบบ', 'แบตเตอรี่เก่าและเมาส์ที่เสีย วางรอทิ้งอยู่', { em: '🔋' }); return; }
          if (G.isDone('q5') || G.got('junk')) { await G.say('ระบบ', 'เก็บของเสียไปแล้ว', { em: '🔋' }); return; }
          G.give('junk', '🔋', 'แบตเตอรี่เก่าและเมาส์เสีย'); G.flag('q5tgt', 'binE'); G.quest('q5', 'คัดแยกของเสียในห้องเก็บอุปกรณ์', 'นำไปทิ้งที่จุดคัดแยกขยะหน้าอาคาร'); retarget(G);
          await G.say('me', 'แบตเตอรี่บวมกับเมาส์ที่เสีย ต้องเลือกถังให้ถูกนะ');
        } },
      { id: 'binG', em: '🗑️', x: 36, y: 24, label: 'ถังขยะทั่วไป', verb: 'ทิ้ง', mark: () => false, on: async G => { if (!G.got('junk')) return G.say('ระบบ', 'ถังขยะทั่วไป สำหรับเศษอาหารและขยะที่รีไซเคิลไม่ได้', { em: '🗑️' }); G.S.wrong++; await G.say('ระบบ', '💡 แบตเตอรี่มีสารอันตราย ถ้าทิ้งรวมกับขยะทั่วไปอาจรั่วไหลสู่ดินและน้ำ ลองหาถังที่เหมาะกว่า', { em: '🗑️' }); } },
      { id: 'binR', em: '♻️', x: 38, y: 24, label: 'ถังขยะรีไซเคิล', verb: 'ทิ้ง', mark: () => false, on: async G => { if (!G.got('junk')) return G.say('ระบบ', 'ถังรีไซเคิล สำหรับขวดพลาสติก กระดาษ กระป๋อง', { em: '♻️' }); G.S.wrong++; await G.say('ระบบ', '💡 ถังนี้สำหรับขวดและกระดาษ อุปกรณ์อิเล็กทรอนิกส์ต้องแยกจัดการเฉพาะ', { em: '♻️' }); } },
      { id: 'binE', em: '⚡', x: 40, y: 24, label: 'ถังขยะอันตราย/อิเล็กทรอนิกส์', verb: 'ทิ้ง', mark: G => G.got('junk'), on: async G => { if (!G.got('junk')) return G.say('ระบบ', 'ถังสำหรับแบตเตอรี่ หลอดไฟ และอุปกรณ์อิเล็กทรอนิกส์', { em: '⚡' }); G.take('junk'); clue(G, 'ew'); G.done('q5'); retarget(G); await G.say('ระบบ', '✅ ถูกต้อง! ขยะอิเล็กทรอนิกส์จะถูกส่งไปรีไซเคิลอย่างปลอดภัย', { em: '⚡' }); } }
    ]
  };
})();
