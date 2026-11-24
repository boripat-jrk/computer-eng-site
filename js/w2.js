/* ส่วนเสริม w2: เส้นทางเมนู (ไทย/อังกฤษ) • ปุ่มริบบอน • กิจกรรมฝึกโปรแกรมสำนักงาน • เช็กลิสต์ • E-Ticket */
(function () {
  const T = window.T2; if (!T) return;
  const TH = {'Home':'หน้าแรก','Styles':'สไตล์','View':'มุมมอง','Navigation Pane':'บานหน้าต่างนำทาง','Layout':'เค้าโครง','Margins':'ระยะขอบ','Custom Margins':'ระยะขอบแบบกำหนดเอง','Insert':'แทรก','Table':'ตาราง','Pictures':'รูปภาพ','SmartArt':'SmartArt','References':'การอ้างอิง','Insert Caption':'แทรกคำอธิบายภาพ','Table Layout':'เค้าโครงตาราง','Repeat Header Rows':'ทำซ้ำแถวส่วนหัว','Picture Format':'รูปแบบรูปภาพ','Wrap Text':'ตัดข้อความ','Square':'สี่เหลี่ยม','Tight':'ชิดขอบ','Top and Bottom':'บนและล่าง','In Line with Text':'ในบรรทัดเดียวกับข้อความ','Modify':'ปรับเปลี่ยน','File':'ไฟล์','Info':'ข้อมูล','Convert':'แปลง','Compatibility Mode':'โหมดความเข้ากันได้','Normal':'ปกติ','Title':'ชื่อเรื่อง','Heading 1':'หัวเรื่อง 1','Heading 2':'หัวเรื่อง 2','Heading 3':'หัวเรื่อง 3','Process':'กระบวนการ','Hierarchy':'ลำดับชั้น','Cycle':'วงจร','Relationship':'ความสัมพันธ์','List':'รายการ','Merge Cells':'ผสานเซลล์','AutoFit':'ปรับพอดีอัตโนมัติ','Split Table':'แยกตาราง','Text Box':'กล่องข้อความ','Header':'หัวกระดาษ','Numbering':'การใส่ลำดับเลข','Crop':'ครอบตัด','Picture Effects':'ลักษณะพิเศษของรูปภาพ','Paragraph':'ย่อหน้า','Illustrations':'ภาพประกอบ','Tables':'ตาราง','Captions':'คำอธิบายภาพ','Page Setup':'ตั้งค่าหน้ากระดาษ','Show':'แสดง','Arrange':'จัดเรียง','Data':'ข้อมูล','right-click':'คลิกขวา','Through':'ทะลุ','Behind Text':'ด้านหลังข้อความ','In Front of Text':'ด้านหน้าข้อความ','This Device':'อุปกรณ์นี้','Styles Pane':'บานหน้าต่างสไตล์'};
  const ICONS = {"styles": "<path d=\"M19.59 5.08a.8.8 0 0 0-.8.08q-.19.15-.26.37a7.6 7.6 0 0 1-3.17 4.08.75.75 0 0 0 .78 1.28 9 9 0 0 0 2.36-2.14v9.5a.75.75 0 0 0 1.5 0V5.77a.8.8 0 0 0-.41-.69M3.5 5.75a.75.75 0 0 0-1.5 0v12.5a.75.75 0 0 0 1.5 0V12.5H10v5.75a.75.75 0 0 0 1.5 0V5.75a.75.75 0 0 0-1.5 0V11H3.5z\"/>", "modify": "<path d=\"M5.75 2a.75.75 0 0 0-.75.75v11.5c0 1.24 1 2.25 2.25 2.25H9.5v3a2.5 2.5 0 1 0 5 0v-3h2.25c1.24 0 2.25-1 2.25-2.25V2.75a.75.75 0 0 0-.75-.75zm.75 9V3.5h6v1.75a.75.75 0 1 0 1.5 0V3.5h1v2.75a.75.75 0 1 0 1.5 0V3.5h1V11zm0 3.25V12.5h11v1.75c0 .41-.34.75-.75.75h-3a.75.75 0 0 0-.75.75v3.75a1 1 0 0 1-2 0v-3.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 1-.75-.75\"/>", "table": "<path d=\"M3 6.25C3 4.45 4.46 3 6.25 3h11.5C19.55 3 21 4.46 21 6.25v11.5c0 1.8-1.46 3.25-3.25 3.25H6.25A3.25 3.25 0 0 1 3 17.75zM6.25 4.5c-.97 0-1.75.78-1.75 1.75V8.5h4v-4zM4.5 10v4h4v-4zm5.5 0v4h4v-4zm5.5 0v4h4v-4zM14 15.5h-4v4h4zm1.5 4h2.25c.97 0 1.75-.78 1.75-1.75V15.5h-4zm0-11h4V6.25c0-.97-.78-1.75-1.75-1.75H15.5zm-1.5-4h-4v4h4zm-9.5 11v2.25c0 .97.78 1.75 1.75 1.75H8.5v-4z\"/>", "repeat": "<path d=\"M3 6.25C3 4.45 4.46 3 6.25 3h11.5C19.55 3 21 4.46 21 6.25v7.94q-.54-.08-1.04.17a2 2 0 0 0-.46-.83V10h-4v2.03q-.4.42-.48.97h-.52q-.26 0-.5.03V10h-4v4h1.67q-.76.62-1.2 1.5H10v4h.47q.15.3.35.59l.21.28c.33.4.8.6 1.27.63H6.25A3.25 3.25 0 0 1 3 17.75zM6.25 4.5c-.97 0-1.75.78-1.75 1.75V8.5h4v-4zM4.5 10v4h4v-4zm11-1.5h4V6.25c0-.97-.78-1.75-1.75-1.75H15.5zm-1.5-4h-4v4h4zm-9.5 11v2.25c0 .97.78 1.75 1.75 1.75H8.5v-4zm12.78-2.78a.75.75 0 1 0-1.06 1.06l.22.22H14.5a3.5 3.5 0 0 0-2.86 5.51.75.75 0 0 0 1.22-.86 2 2 0 0 1 1.64-3.15h1.94l-.22.22a.75.75 0 1 0 1.06 1.06l1.5-1.5c.3-.3.3-.77 0-1.06zm4.08 2.77a.75.75 0 1 0-1.22.86q.35.5.36 1.15a2 2 0 0 1-2 2h-1.94l.22-.22a.75.75 0 1 0-1.06-1.06l-1.5 1.5c-.3.3-.3.77 0 1.06l1.5 1.5a.75.75 0 1 0 1.06-1.06l-.22-.22h1.94a3.5 3.5 0 0 0 2.86-5.51\"/>", "picture": "<path d=\"M17.75 3C19.55 3 21 4.46 21 6.25v11.5c0 1.8-1.46 3.25-3.25 3.25H6.25A3.25 3.25 0 0 1 3 17.75V6.25C3 4.45 4.46 3 6.25 3zm.58 16.4-5.8-5.69a.75.75 0 0 0-.97-.07l-.08.07-5.81 5.7q.28.09.58.09h11.5q.3 0 .58-.1l-5.8-5.69zm-.58-14.9H6.25c-.97 0-1.75.78-1.75 1.75v11.5q0 .3.1.6l5.83-5.7a2.25 2.25 0 0 1 3.02-.12l.12.11 5.83 5.7q.1-.27.1-.59V6.25c0-.97-.78-1.75-1.75-1.75m-2.5 2a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5m0 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5\"/>", "wrap": "<path d=\"M2.75 5a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5zm0 6.5a.75.75 0 0 0 0 1.5H19a2.5 2.5 0 0 1 0 5h-4.44l.72-.72a.75.75 0 1 0-1.06-1.06l-2 2c-.3.3-.3.77 0 1.06l2 2a.75.75 0 1 0 1.06-1.06l-.72-.72H19a4 4 0 0 0 0-8zM2 18.75c0-.41.34-.75.75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75\"/>", "smartart": "<path d=\"M5.25 3C4 3 3 4 3 5.25v2.5C3 9 4 10 5.25 10h.5v3.71q-.08.04-.13.12l-2.8 2.79a1.25 1.25 0 0 0 0 1.77l2.8 2.79c.48.49 1.28.49 1.76 0l2.8-2.8.11-.13H14v.5C14 20 15.01 21 16.25 21h2.5c1.24 0 2.25-1 2.25-2.25v-2.5c0-1.24-1-2.25-2.25-2.25h-2.5C15.01 14 14 15 14 16.25v.5H10.3q-.04-.07-.12-.13l-2.79-2.8-.13-.11v-3.7h.5C9 10 10 9 10 7.74v-2.5C10 4 9 3 7.75 3zM4.5 5.25c0-.42.33-.75.75-.75h2.5c.42 0 .75.33.75.75v2.5c0 .42-.33.75-.75.75h-2.5a.75.75 0 0 1-.75-.75zM4.06 17.5l2.44-2.44 2.44 2.44-2.44 2.44zm12.2-2h2.49c.41 0 .75.34.75.75v2.5c0 .42-.34.75-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5c0-.41.34-.75.75-.75\"/>", "caption": "<path d=\"M1 3c0-1.1.9-2 2-2h7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm.5 5h1.5v6.75q0 .3.1.6l5.83-5.7a2.25 2.25 0 0 1 3.02-.12l.12.11 5.83 5.7q.1-.27.1-.59V7.25c0-.97-.78-1.75-1.75-1.75H13V4h5.75C20.55 4 22 5.46 22 7.25v11.5c0 1.8-1.46 3.25-3.25 3.25H7.25A3.25 3.25 0 0 1 4 18.75zm15.33 8.4-5.8-5.69a.75.75 0 0 0-.97-.07l-.08.07-5.81 5.7q.28.09.58.09h11.5q.3 0 .58-.1M16.25 7.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5m0 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5\"/>", "tcaption": "<path d=\"M3 6.25C3 4.45 4.46 3 6.25 3h11.5C19.55 3 21 4.46 21 6.25V11h-1.5v-1h-4v1H14v-1h-4v4h1v1.5h-1v4h1v.5a3 3 0 0 0 .17 1H6.25A3.25 3.25 0 0 1 3 17.75zM6.25 4.5c-.97 0-1.75.78-1.75 1.75V8.5h4v-4zM4.5 10v4h4v-4zm11-1.5h4V6.25c0-.97-.78-1.75-1.75-1.75H15.5zm-1.5-4h-4v4h4zm-9.5 11v2.25c0 .97.78 1.75 1.75 1.75H8.5v-4zM14 12a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm0 3.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5\"/>", "nav": "<path d=\"M4.75 8.5c0-.41.34-.75.75-.75h1.25a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75m0 3.5c0-.41.34-.75.75-.75h1.25a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75m0 3.5c0-.41.34-.75.75-.75h1.25a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75M5.25 4A3.25 3.25 0 0 0 2 7.25v9.5C2 18.55 3.46 20 5.25 20h13.5c1.8 0 3.25-1.46 3.25-3.25v-9.5C22 5.45 20.54 4 18.75 4zm13.5 14.5H10v-13h8.75c.97 0 1.75.78 1.75 1.75v9.5c0 .97-.78 1.75-1.75 1.75m-13.5-13H8.5v13H5.25c-.97 0-1.75-.78-1.75-1.75v-9.5c0-.97.78-1.75 1.75-1.75\"/>", "margins": "<path d=\"M4 4.25C4 3.01 5 2 6.25 2h11.5C18.99 2 20 3 20 4.25v15.5c0 1.24-1 2.25-2.25 2.25H6.25C5.01 22 4 21 4 19.75zM17 20.5h.75c.41 0 .75-.34.75-.75V4.25a.75.75 0 0 0-.75-.75H17v2.75a.75.75 0 0 1-1.5 0V3.5h-7v2.75a.75.75 0 0 1-1.5 0V3.5h-.75a.75.75 0 0 0-.75.75v15.5c0 .41.34.75.75.75H7v-2.75a.75.75 0 0 1 1.5 0v2.75h7v-2.75a.75.75 0 0 1 1.5 0zm-9.25-12c.41 0 .75.34.75.75v5.5a.75.75 0 0 1-1.5 0v-5.5c0-.41.34-.75.75-.75m9.25.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0z\"/>", "convert": "<path d=\"M6.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11m5.67-10a2 2 0 0 1 1.42.59L19.4 8.4A2 2 0 0 1 20 9.83V20a2 2 0 0 1-2 2h-6.81q.65-.67 1.08-1.5H18a.5.5 0 0 0 .5-.5V10H14a2 2 0 0 1-2-2V3.5H6a.5.5 0 0 0-.5.5v7.08q-.79.12-1.5.42V4c0-1.1.9-2 2-2zM6.85 14.15a.5.5 0 0 0-.7 0l-2.5 2.5a.5.5 0 1 0 .7.7L6 15.71v4.79a.5.5 0 0 0 1 0v-4.8l1.65 1.65a.5.5 0 1 0 .7-.7zM13.5 8c0 .28.22.5.5.5h3.38L13.5 4.62z\"/>", "font": "<path d=\"M7 2c.31 0 .6.2.7.49l2.96 7.98v.04l.23.6-.83 2.09-.62-1.7H4.56l-1.1 3.01a.75.75 0 0 1-1.42-.52l1.3-3.48v-.04L6.3 2.5c.1-.3.39-.49.7-.49m-1.88 8h3.76L7 4.91zm8.69-3.53a.75.75 0 0 1 1.4 0l5.55 14.03h.49a.75.75 0 1 1 0 1.5h-2.5a.75.75 0 1 1 0-1.5h.4l-1.2-3h-6.9l-1.2 3h.4a.75.75 0 1 1 0 1.5h-2.5a.75.75 0 1 1 0-1.5h.49zM17.36 16 14.5 8.79 11.64 16z\"/>"};
  const IMG = { h1: 'heading1', styles: 'styles', modify: 'stylespane', nav: 'navpane', margins: 'margins', table: 'table', picture: 'pictures', smartart: 'smartart', caption: 'caption', repeat: 'repeat', wrap: 'wrap', font: 'normal' };
  Object.assign(TH, { 'Page Number': 'หมายเลขหน้า', 'Format Page Numbers': 'จัดรูปแบบหมายเลขหน้า', 'Breaks': 'ตัวแบ่ง', 'Section Break': 'ตัวแบ่งส่วน', 'Next Page': 'หน้าถัดไป', 'Link to Previous': 'ลิงก์ไปยังก่อนหน้า', 'Header': 'หัวกระดาษ', 'Footer': 'ท้ายกระดาษ', 'Header & Footer': 'หัวกระดาษและท้ายกระดาษ', 'Table of Contents': 'สารบัญ', 'Custom Table of Contents': 'สารบัญแบบกำหนดเอง', 'Update Table': 'อัปเดตตาราง', 'Insert Footnote': 'แทรกเชิงอรรถ', 'Footnotes': 'เชิงอรรถ', 'Citations & Bibliography': 'การอ้างอิงและบรรณานุกรม', 'Insert Citation': 'แทรกการอ้างอิง', 'Add New Source': 'เพิ่มแหล่งข้อมูลใหม่', 'Manage Sources': 'จัดการแหล่งข้อมูล', 'Bibliography': 'บรรณานุกรม', 'Style': 'ลักษณะ', 'Page Setup': 'ตั้งค่าหน้ากระดาษ', 'Show/Hide ¶': 'แสดง/ซ่อน ¶', 'Different First Page': 'หน้าแรกต่างกัน', 'Start at': 'เริ่มที่', 'Number format': 'รูปแบบตัวเลข', 'Insert Table of Figures': 'แทรกสารบัญภาพ', 'Captions': 'คำอธิบายภาพ', 'Go to Footer': 'ไปที่ท้ายกระดาษ', 'Close Header and Footer': 'ปิดหัวกระดาษและท้ายกระดาษ', 'right-click': 'คลิกขวา', 'Cover Page': 'หน้าปก', 'Blank Page': 'หน้าว่าง', 'File': 'ไฟล์', 'Export': 'ส่งออก', 'Create PDF/XPS': 'สร้าง PDF/XPS', 'Options': 'ตัวเลือก', 'Create bookmarks using Headings': 'สร้างบุ๊กมาร์กโดยใช้หัวเรื่อง' });
  const lang = () => { try { return localStorage.getItem('mp-lang') || 'en'; } catch (e) { return 'en'; } };
  const tr = w => lang() === 'th' ? (TH[w] || w) : w;
  const ic = k => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[k] || ''}</svg>`;
  window.TR = tr;
  /* [[A › B]] = เส้นทางเมนู • {{X}} = ชื่อเมนูเดี่ยว */
  window.MP = s => String(s).replace(/\[\[(.+?)\]\]/g, (_, p) => `<span class="mpath" data-p="${T.esc(p)}">${p.split(' › ').map(tr).join(' › ')}</span>`).replace(/\{\{(.+?)\}\}/g, (_, w) => `<span class="mw" data-w="${T.esc(w)}">${tr(w)}</span>`);
  window.SHOT = k => IMG[k] ? `<img src="img/${IMG[k]}.png" alt="">` : ic(k);
  window.RB = (k, w, hl) => `<span class="rb ${IMG[k] ? 'shot' : ''} ${hl ? 'hl' : ''}">${SHOT(k)}<small class="mw" data-w="${T.esc(w)}">${tr(w)}</small></span>`;
  window.RBI = (k, w) => `<span class="rbi ${IMG[k] ? 'shot' : ''}">${SHOT(k)}<span class="mw" data-w="${T.esc(w)}">${tr(w)}</span></span>`;
  const relabel = () => {
    document.querySelectorAll('.mpath').forEach(e => e.innerHTML = e.dataset.p.split(' › ').map(tr).join(' › '));
    document.querySelectorAll('.mw').forEach(e => e.textContent = tr(e.dataset.w));
    document.querySelectorAll('.mp-lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang()));
  };
  const addToggle = () => {
    if (!document.querySelector('.mpath,.mw') || document.querySelector('.mp-lang')) return;
    const toc = document.querySelector('.toc'); const box = document.createElement('div'); box.className = 'mp-lang';
    box.innerHTML = `<small>ชื่อเมนูในโปรแกรม</small><div><button data-l="en">English</button><button data-l="th">ภาษาไทย</button></div>`;
    (toc || document.querySelector('.lmain') || document.body).appendChild(box);
    box.onclick = e => { const b = e.target.closest('button'); if (!b) return; try { localStorage.setItem('mp-lang', b.dataset.l); } catch (x) { } relabel(); };
    relabel();
  };
  new MutationObserver(() => { if (document.querySelector('.mpath,.mw') && !document.querySelector('.mp-lang')) addToggle(); }).observe(document.documentElement, { childList: true, subtree: true });

  const W = window.WIDGETS; if (!W) return;
  const head = (cfg, icon, label) => `<div class="w-head"><span class="w-tag"><i data-lucide="${icon}"></i>${label}</span>${cfg.title ? `<h4>${cfg.title}</h4>` : ''}${cfg.desc ? `<p>${cfg.desc}</p>` : ''}</div>`;
  const done = key => T.state.wid[key] ? '<span class="w-done">✓ ทำแล้ว</span>' : '';
  const win = (el, key, xp) => { if (T.markWidget(key, xp, el)) { el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 600); } const d = el.querySelector('.w-head'); if (d && !d.querySelector('.w-done')) d.insertAdjacentHTML('beforeend', '<span class="w-done">✓ ทำแล้ว</span>'); };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ----- เครื่องจำลองสไตล์ + Navigation Pane ----- */
  W.stylesim = (el, cfg, key) => {
    const ST = cfg.styles || [['normal', 'Normal'], ['title', 'Title'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3']];
    const st = cfg.doc.map(() => 'normal'); let sel = 0, color = '#1F3B73', tries = 0, t0 = 0;
    const draw = msg => {
      const nav = cfg.doc.map((d, i) => ({ s: st[i], t: d.txt })).filter(x => /^h[123]$/.test(x.s));
      el.innerHTML = head(cfg, 'mouse-pointer-click', 'เครื่องจำลอง') + done(key) + `<div class="sim"><div class="ribbon"><span>${tr('Home')} › ${tr('Styles')}</span><div class="gal">${ST.map(s => `<button class="sb" data-st="${s[0]}">${tr(s[1])}</button>`).join('')}</div><span class="sep"></span>
        <label>${tr('Modify')} ${tr('Heading 1')}: <select class="h1c">${[['#1F3B73', 'น้ำเงินเข้ม'], ['#B91C1C', 'แดง'], ['#15803D', 'เขียว'], ['#7C3AED', 'ม่วง']].map(c => `<option value="${c[0]}" ${c[0] === color ? 'selected' : ''}>${c[1]}</option>`).join('')}</select></label></div>
        <div class="navpane"><b>${ic('nav')}${tr('Navigation Pane')}</b>${nav.length ? nav.map(x => `<div class="n${x.s[1]}">${T.esc(x.t)}</div>`).join('') : '<div class="empty">ยังไม่มีหัวข้อ… ใช้สไตล์ Heading สิ</div>'}</div>
        <div class="page" style="--h1c:${color}">${cfg.doc.map((d, i) => `<p class="s-${st[i]} ${i === sel ? 'sel' : ''}" data-p="${i}"><span class="stag">${tr(ST.find(s => s[0] === st[i])[1])}</span>${T.esc(d.txt)}</p>`).join('')}</div>
        <div class="simbar"><span class="sim-msg">${msg || `เลือกย่อหน้าที่ ${sel + 1} อยู่`}</span><span><button class="btn sm ghost" data-a="reset">เริ่มใหม่</button> <button class="btn sm" data-a="check">ตรวจคำตอบ</button></span></div></div>`;
      T.icons && T.icons();
    };
    el.onclick = e => {
      const p = e.target.closest('[data-p]'), b = e.target.closest('[data-st]'), a = e.target.closest('[data-a]');
      if (!t0) t0 = Date.now();
      if (p) { sel = +p.dataset.p; draw(); }
      else if (b) { st[sel] = b.dataset.st; if (sel < cfg.doc.length - 1) sel++; draw(); }
      else if (a && a.dataset.a === 'reset') { st.fill('normal'); sel = 0; draw(); }
      else if (a && a.dataset.a === 'check') {
        tries++; const bad = cfg.doc.map((d, i) => st[i] === d.want ? -1 : i).filter(i => i >= 0);
        draw(bad.length ? `ยังผิด ${bad.length} ย่อหน้า (ไฮไลต์สีแดง) ลองดูว่าเป็นชื่อเรื่อง ชื่อบท หรือหัวข้อย่อย` : `🎉 ถูกทั้งหมด! ${tries === 1 ? 'ถูกตั้งแต่ครั้งแรก' : ''} ลองเปลี่ยนสี Heading 1 ดูว่าทุกบทเปลี่ยนพร้อมกัน`);
        el.querySelectorAll('.page p').forEach((x, i) => x.classList.add(bad.includes(i) ? 'bad' : 'good'));
        if (!bad.length) { const fast = Date.now() - t0 < 120000; win(el, key, (cfg.xp || 20) + (tries === 1 ? 10 : 0) + (fast ? 5 : 0)); }
      }
    };
    el.onchange = e => { if (e.target.classList.contains('h1c')) { color = e.target.value; el.querySelector('.page').style.setProperty('--h1c', color); } };
    draw();
  };

  /* ----- ภาพจำลอง Wrap Text ----- */
  const WRAPS = [['inline', 'In Line with Text', 'รูปเป็นเหมือนตัวอักษร 1 ตัวในบรรทัด ลากย้ายอิสระไม่ได้ (ค่าเริ่มต้นของ Word)', 'ภาพเล็กในบรรทัด หรือภาพที่ต้องอยู่กับข้อความเสมอ'],
    ['square', 'Square', 'ข้อความไหลรอบกรอบสี่เหลี่ยมของรูป', 'รายงานทั่วไป วางรูปชิดซ้ายหรือขวาของย่อหน้า'],
    ['tight', 'Tight', 'ข้อความไหลชิดตามรูปทรงจริงของภาพ', 'ภาพตัดพื้นหลัง ไอคอน โลโก้ทรงกลม'],
    ['through', 'Through', 'คล้าย Tight แต่ข้อความแทรกเข้าไปในช่องว่างภายในรูปได้', 'รูปทรงที่มีช่องว่างตรงกลาง ใช้น้อย'],
    ['tb', 'Top and Bottom', 'รูปอยู่บรรทัดของตัวเอง ข้อความอยู่เฉพาะด้านบนและล่าง', 'ภาพประกอบใหญ่ แผนภูมิ ภาพที่มี Caption'],
    ['behind', 'Behind Text', 'รูปอยู่ด้านหลังข้อความ ข้อความทับรูป', 'ภาพพื้นหลัง ลายน้ำ'],
    ['front', 'In Front of Text', 'รูปลอยทับข้อความ ข้อความใต้รูปถูกบัง', 'สติกเกอร์ ตราประทับ ลูกศรชี้']];
  W.wrapdemo = (el, cfg, key) => {
    let m = 'inline'; const seen = new Set([m]);
    const txt = cfg.text || 'โรงเรียนกัลยาณวัตรเริ่มโครงการคัดแยกขยะพลาสติกจากโรงอาหาร';
    const draw = () => { const w = WRAPS.find(x => x[0] === m);
      el.innerHTML = head(cfg, 'image', 'ภาพจำลอง') + done(key) + `<div class="wdemo"><div class="opts">${WRAPS.map(o => `<button data-wrap="${o[0]}" class="${m === o[0] ? 'on' : ''}">${tr(o[1])}</button>`).join('')}</div>
      <div><div class="wpage ${m}">${txt} <span class="wimg">♻️</span> นักเรียนแต่ละห้องรับผิดชอบจุดคัดแยกหนึ่งจุด และบันทึกน้ำหนักขยะทุกวันศุกร์ ข้อมูลที่ได้นำมาวิเคราะห์เพื่อหาวิธีลดขยะในเทอมถัดไป ผลการดำเนินงานเดือนแรกพบว่าขวดพลาสติกเป็นขยะที่พบมากที่สุด รองลงมาคือแก้วพลาสติกและหลอด ทางโรงเรียนจึงจัดจุดรับคืนขวดเพื่อนำไปรีไซเคิล และรณรงค์ให้นักเรียนพกแก้วน้ำส่วนตัว</div>
      <div class="wdesc"><b>${tr(w[1])}</b> — ${w[2]}<br><span class="muted">เหมาะกับ: ${w[3]}</span></div><div class="figcap">ลองกดครบทุกแบบ (${seen.size}/${WRAPS.length})</div></div></div>`; };
    el.onclick = e => { const b = e.target.closest('[data-wrap]'); if (!b) return; m = b.dataset.wrap; seen.add(m); draw(); if (seen.size === WRAPS.length) win(el, key); };
    draw();
  };

  /* ----- จับคู่งานกับเมนู (เลือกจากรายการ) ----- */
  W.menumatch = (el, cfg, key) => {
    const order = shuffle(cfg.items.map((_, i) => i)); let tries = 0, t0 = 0;
    const opts = `<option value="">— เลือกเมนู —</option>` + order.map(i => `<option value="${i}">${MP(cfg.items[i][1]).replace(/<[^>]+>/g, '')}</option>`).join('');
    el.innerHTML = head(cfg, 'link', 'จับคู่เมนู') + done(key) + `<div class="match">${cfg.items.map((m, i) => `<div class="mrow"><div>${i + 1}. ${m[0]}</div><select data-m="${i}">${opts}</select><span class="mres"></span></div>`).join('')}</div>
      <div class="row"><button class="btn sm" data-a="chk">ตรวจคำตอบ</button><span class="mm-msg score"></span></div>`;
    el.onchange = () => { if (!t0) t0 = Date.now(); };
    el.querySelector('[data-a="chk"]').onclick = () => {
      tries++; let ok = 0;
      el.querySelectorAll('.mrow').forEach((r, i) => { const v = r.querySelector('select').value; const g = v !== '' && +v === i; ok += g; r.classList.toggle('good', g); r.classList.toggle('bad', !g); r.querySelector('.mres').textContent = g ? '✅' : '❌'; });
      el.querySelector('.mm-msg').textContent = `ถูก ${ok}/${cfg.items.length}`;
      if (ok === cfg.items.length) win(el, key, (cfg.xp || 20) + (tries === 1 ? 10 : 0) + (t0 && Date.now() - t0 < 90000 ? 5 : 0));
    };
  };

  /* ----- เช็กลิสต์ตรวจงาน ----- */
  W.checklist = (el, cfg, key) => {
    T.state.chk = T.state.chk || {}; const cur = T.state.chk[key] = T.state.chk[key] || [];
    const draw = () => { const n = cfg.items.filter((_, i) => cur[i]).length;
      el.innerHTML = head(cfg, 'list-checks', 'เช็กลิสต์') + done(key) + `<div class="cpbar"><i style="width:${n / cfg.items.length * 100}%"></i></div><small class="muted">ผ่านแล้ว ${n}/${cfg.items.length} ข้อ</small>
        <div class="chk">${cfg.items.map((c, i) => `<label class="${cur[i] ? 'on' : ''}"><input type="checkbox" data-c="${i}" ${cur[i] ? 'checked' : ''}><span><b>${i + 1}.</b> ${MP(c)}</span></label>`).join('')}</div>`; };
    el.onchange = e => { const c = e.target.closest('[data-c]'); if (!c) return; cur[+c.dataset.c] = c.checked ? 1 : 0; T.save(); draw(); if (cfg.items.every((_, i) => cur[i])) win(el, key); };
    draw();
  };

  /* ----- ไฟล์ประกอบ + ตัวดูภาพตัวอย่าง ----- */
  W.files = (el, cfg) => {
    el.innerHTML = `<div class="files">${cfg.items.map((f, i) => `<div class="fcard"><div class="th" ${f.pages ? `data-v="${i}"` : ''} style="${f.bg || ''}">${f.thumb ? `<img src="${f.thumb}" alt="">` : (f.em || '📄')}</div><div><h4><span class="ftag" style="background:${f.tc || '#2B579A'}">${f.tag}</span>${f.t}</h4><p>${f.d || ''}</p><div class="row">${f.pages ? `<button class="btn sm ghost" data-v="${i}">👁️ ดูตัวอย่าง</button>` : ''}${f.url ? `<a class="btn sm" href="${f.url}" ${f.dl ? `download="${f.dl}"` : 'target="_blank" rel="noopener"'}>${f.btn || '📂 เปิด'}</a>` : ''}</div></div></div>`).join('')}</div><div class="viewer"></div>`;
    el.onclick = e => { const v = e.target.closest('[data-v]'); if (!v) return; const f = cfg.items[+v.dataset.v], box = el.querySelector('.viewer'); let p = 0;
      const show = () => { box.innerHTML = `<div class="vh"><b>${f.t}</b><span><button class="btn sm ghost" data-pv="-1">‹</button> ${p + 1}/${f.pages.length} <button class="btn sm ghost" data-pv="1">›</button> <button class="btn sm ghost" data-x>✕</button></span></div><img class="big" src="${f.pages[p]}" alt="">`; box.style.display = 'block'; };
      box.onclick = ev => { const b = ev.target.closest('[data-pv]'); if (b) { p = (p + +b.dataset.pv + f.pages.length) % f.pages.length; show(); } if (ev.target.closest('[data-x]')) { box.style.display = 'none'; } };
      show(); box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
  };


  /* ----- เครื่องจำลองเลขหน้าแยก Section ----- */
  const TH_ALPHA = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'];
  W.pagesim = (el, cfg, key) => {
    const P = cfg.pages; const brk = P.map(() => false); let fmt = {}, restart = {}, tries = 0, t0 = 0;
    const secs = () => { const out = []; let cur = [0]; for (let i = 1; i < P.length; i++) { if (brk[i - 1]) { out.push(cur); cur = [i]; } else cur.push(i); } out.push(cur); return out; };
    const nums = () => { const S = secs(), r = []; let n = 0;
      S.forEach((pages, si) => { const f = fmt[si] || 'none'; if (si === 0 || restart[si]) n = 0; pages.forEach(pi => { n++; r[pi] = f === 'none' ? '' : f === 'th' ? (TH_ALPHA[n - 1] || n) : String(n); }); });
      return r; };
    const draw = msg => { const S = secs(), N = nums();
      el.innerHTML = head(cfg, 'mouse-pointer-click', 'เครื่องจำลอง') + done(key) + `<div class="legend"><span><i style="background:#FFFBEB;border:1px solid #FCD34D"></i>Section ที่ 1</span><span><i style="background:#F0F9FF;border:1px solid #7DD3FC"></i>Section ที่ 2</span><span><i style="background:#F0FDF4;border:1px solid #86EFAC"></i>Section ที่ 3</span></div>
        <div class="psim">${P.map((p, i) => { const si = S.findIndex(x => x.includes(i)); return `<div class="pg sc${si % 3}"><b>${p}</b><span class="no">${N[i] || '&nbsp;'}</span></div>${i < P.length - 1 ? `<button class="pbrk ${brk[i] ? 'on' : ''}" data-b="${i}" title="แทรก/ลบ Section Break (Next Page)">${brk[i] ? '✂️' : '＋'}</button>` : ''}`; }).join('')}</div>
        <div class="psec">${S.map((pages, si) => `<div class="sc${si % 3}"><b>Section ${si + 1}</b> <small>(${pages.map(i => P[i]).join(', ')})</small>
          <label>${tr('Number format')}: <select data-f="${si}"><option value="none">ไม่มีเลขหน้า</option><option value="th" ${fmt[si] === 'th' ? 'selected' : ''}>ก, ข, ค…</option><option value="ar" ${fmt[si] === 'ar' ? 'selected' : ''}>1, 2, 3…</option></select></label>
          ${si ? `<label><input type="checkbox" data-r="${si}" ${restart[si] ? 'checked' : ''}> ${tr('Start at')} 1 (เริ่มนับใหม่)</label>` : ''}</div>`).join('')}</div>
        <div class="simbar"><span class="sim-msg">${msg || 'กด ＋ ระหว่างหน้าเพื่อแทรก Section Break แล้วตั้งรูปแบบเลขหน้าของแต่ละ Section'}</span><span><button class="btn sm ghost" data-a="reset">เริ่มใหม่</button> <button class="btn sm" data-a="check">ตรวจคำตอบ</button></span></div>`;
    };
    el.onclick = e => { const b = e.target.closest('[data-b]'), a = e.target.closest('[data-a]'); if (!t0) t0 = Date.now();
      if (b) { brk[+b.dataset.b] = !brk[+b.dataset.b]; fmt = {}; restart = {}; draw(); }
      if (a && a.dataset.a === 'reset') { brk.fill(false); fmt = {}; restart = {}; draw(); }
      if (a && a.dataset.a === 'check') { tries++; const N = nums(); const bad = cfg.want.map((w, i) => (N[i] || '') === w ? -1 : i).filter(i => i >= 0);
        if (!bad.length) { draw(`🎉 ถูกต้อง! ปกไม่มีเลข ส่วนนำใช้ ก ข ค และเนื้อหาเริ่ม 1 ใหม่ ${tries === 1 ? '(ถูกตั้งแต่ครั้งแรก)' : ''}`); win(el, key, (cfg.xp || 20) + (tries === 1 ? 10 : 0) + (Date.now() - t0 < 120000 ? 5 : 0)); }
        else { draw(`ยังไม่ตรง ${bad.length} หน้า: ${bad.map(i => P[i]).join(', ')} • ที่ต้องการ: ${cfg.want.map((w, i) => P[i] + '=' + (w || '–')).join(' · ')}`); el.querySelectorAll('.psim .pg').forEach((x, i) => x.classList.add(bad.includes(i) ? 'bad' : 'good')); } }
    };
    el.onchange = e => { const f = e.target.closest('[data-f]'), r = e.target.closest('[data-r]'); if (f) fmt[+f.dataset.f] = f.value; if (r) restart[+r.dataset.r] = r.checked; draw(); };
    draw();
  };

  /* ----- แบบฝึกเขียนบรรณานุกรม APA (เรียงส่วนประกอบ) ----- */
  W.apa = (el, cfg, key) => {
    let k = 0; const solved = new Set();
    const draw = () => { const it = cfg.items[k]; const pool = it.pool || shuffle(it.parts.map((p, i) => i)); it.pool = pool; it.pick = it.pick || [];
      el.innerHTML = head(cfg, 'quote', 'ฝึกอ้างอิง APA') + done(key) + `<p class="muted" style="margin:0">ข้อ ${k + 1}/${cfg.items.length} • ${it.src}</p>
        <div class="apa-out">${it.pick.map(i => `<span>${it.parts[i]}</span>`).join(' ') || '<i class="muted">กดชิ้นส่วนด้านล่างเรียงตามลำดับ APA</i>'}</div>
        <div class="apa-pool">${pool.filter(i => !it.pick.includes(i)).map(i => `<button data-p="${i}">${it.parts[i]}</button>`).join('')}</div>
        <div class="row"><button class="btn sm ghost" data-a="undo">ย้อน</button><button class="btn sm" data-a="chk">ตรวจ</button>${k < cfg.items.length - 1 ? '<button class="btn sm ghost" data-a="next">ข้อถัดไป →</button>' : ''}<span class="apa-msg score"></span></div>`; };
    el.onclick = e => { const it = cfg.items[k], p = e.target.closest('[data-p]'), a = e.target.closest('[data-a]');
      if (p) { it.pick.push(+p.dataset.p); draw(); }
      if (a && a.dataset.a === 'undo') { it.pick.pop(); draw(); }
      if (a && a.dataset.a === 'next') { k++; draw(); }
      if (a && a.dataset.a === 'chk') { const ok = it.pick.length === it.parts.length && it.pick.every((v, i) => v === i);
        el.querySelector('.apa-msg').textContent = ok ? '✅ ถูกต้อง!' : '❌ ยังไม่ถูก ลองดูลำดับ ผู้แต่ง → ปี → ชื่อเรื่อง → แหล่ง'; if (ok) { solved.add(k); if (solved.size === cfg.items.length) win(el, key, cfg.xp || 20); } } };
    draw();
  };
  /* ----- E-Ticket ก่อนออกจากห้อง (บันทึกในบัญชีนักเรียน ครูดูได้ที่เมนูครู) ----- */
  const CONF = [['😟', 'น้อยมาก'], ['😕', 'น้อย'], ['🙂', 'เข้าใจ'], ['😀', 'มั่นใจ'], ['🤩', 'สอนเพื่อนได้']];
  const today = () => new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
  /* รูปแบบ 3-2-1: 3 สิ่งที่ได้เรียนรู้ • 2 สิ่งที่สนใจ • 1 คำถาม (คำตอบรูปแบบเดิมเก็บไว้ใน old ไม่ลบ) */
  W.eticket = (el, cfg, key) => {
    const ET = () => (T.state.et = T.state.et || {}); ET(); const lid = cfg.lid || key.split(':')[0]; let conf = 0, edit = false;
    const arr = (v, n) => { v = Array.isArray(v) ? v.slice(0, n) : []; while (v.length < n) v.push(''); return v; };
    const inp = (cls, v, ph) => `<input type="text" class="${cls}" maxlength="200" value="${T.esc(v || '')}" placeholder="${ph}">`;
    const draw = () => { const mine = ET()[lid];
      if (mine && !edit) { el.innerHTML = head(cfg, 'ticket', 'E-Ticket') + done(key) + `<div class="result"><div class="em">🎟️</div><div><h4>ส่ง E-Ticket แล้ว</h4><p class="muted" style="margin:0">${T.esc(T.state.room || '')} ${T.state.no ? 'เลขที่ ' + T.esc(T.state.no) : ''} • วันที่เรียน ${T.esc(mine.date)} • ระดับความเข้าใจ ${CONF[mine.conf - 1][0]} ${CONF[mine.conf - 1][1]}</p></div></div><div class="row"><button class="btn sm ghost" data-a="edit">${mine.v === 2 ? 'แก้ไขคำตอบ' : 'ตอบเพิ่มในรูปแบบ 3-2-1'}</button></div>`; return; }
      if (!T.user) { el.innerHTML = head(cfg, 'ticket', 'E-Ticket') + '<p class="muted">เข้าสู่ระบบด้วยบัญชีโรงเรียนก่อน จึงส่ง E-Ticket ได้</p>'; return; }
      const m = mine || {}, v2 = m.v === 2, l3 = arr(v2 ? m.l3 : [], 3), i2 = arr(v2 ? m.i2 : [], 2); conf = m.conf || 0;
      const prev = !v2 && mine ? `<div class="et-old"><b>คำตอบที่ส่งไว้เดิม</b> <small>(ระบบเก็บไว้ให้ครูอ่านเหมือนเดิม)</small><ul><li>สิ่งที่ได้เรียนรู้: ${T.esc(m.learn || '-')}</li><li>การนำไปใช้: ${T.esc(m.apply || '-')}</li><li>สิ่งที่ยังไม่เข้าใจ: ${T.esc(m.ask || '-')}</li></ul></div>` : '';
      el.innerHTML = head(cfg, 'ticket', 'E-Ticket') + done(key) + `<div class="meta-row"><span>📚 ${cfg.mission || ''}</span><span>👤 ${T.esc(T.state.room || '-')} ${T.state.no ? 'เลขที่ ' + T.esc(T.state.no) : ''}</span></div>
        <p class="muted" style="margin:4px 0 0">ตอบให้ครบทุกข้อก่อนออกจากห้อง • ส่งแล้วได้ +${cfg.xp || 20} XP • ครูอ่านคำตอบได้ทันที</p>${prev}
        <label class="f">วันที่เรียน <i>*</i></label><input type="date" class="et-date" value="${m.date || today()}">
        <div class="et321"><div class="et-g"><span class="et-n">3</span><div><label class="f">สิ่งที่ฉันได้เรียนรู้วันนี้ <i>*</i></label>${l3.map((x, i) => inp('et-l3', x, 'ข้อที่ ' + (i + 1))).join('')}</div></div>
          <div class="et-g"><span class="et-n">2</span><div><label class="f">สิ่งที่ฉันสนใจ หรืออยากรู้เพิ่มเติม <i>*</i></label>${i2.map((x, i) => inp('et-i2', x, 'ข้อที่ ' + (i + 1))).join('')}</div></div>
          <div class="et-g"><span class="et-n">1</span><div><label class="f">คำถามที่อยากถามครู หรือสิ่งที่ยังไม่เข้าใจ <i>*</i></label>${inp('et-q1', v2 ? m.q1 : '', 'พิมพ์คำถาม 1 ข้อ')}</div></div></div>
        <label class="f">ระดับความเข้าใจในเรื่องวันนี้ <i>*</i></label><div class="conf">${CONF.map((c, i) => `<button type="button" data-conf="${i + 1}" class="${conf === i + 1 ? 'on' : ''}">${c[0]}<small>${c[1]}</small></button>`).join('')}</div>
        <div class="err et-err"></div><div class="row"><button class="btn gold" data-a="send">🎟️ ส่ง E-Ticket</button></div>`; };
    el.onclick = e => {
      const c = e.target.closest('[data-conf]'), a = e.target.closest('[data-a]');
      if (c) { conf = +c.dataset.conf; el.querySelectorAll('[data-conf]').forEach(b => b.classList.toggle('on', b === c)); }
      if (a && a.dataset.a === 'edit') { edit = true; draw(); }
      if (a && a.dataset.a === 'send') {
        const all = s => [...el.querySelectorAll(s)].map(i => i.value.trim());
        const was = ET()[lid], l3 = all('.et-l3'), i2 = all('.et-i2'), q1 = all('.et-q1')[0] || '';
        /* learn / ask คงชื่อฟิลด์เดิมไว้ เพื่อให้รายงานเดิมของครูอ่านได้ต่อเนื่อง */
        const r = { v: 2, date: el.querySelector('.et-date').value.trim(), l3, i2, q1, learn: l3.filter(Boolean).join(' • '), apply: (was && was.apply) || '', ask: q1, conf, topic: cfg.mission || '', ts: Date.now() };
        if (was && was.v !== 2) r.old = { learn: was.learn || '', apply: was.apply || '', ask: was.ask || '', conf: was.conf || 0, date: was.date || '', ts: was.ts || 0 }; else if (was && was.old) r.old = was.old;
        const miss = []; if (!r.date) miss.push('วันที่');
        if (l3.filter(Boolean).length < 3) miss.push('สิ่งที่ได้เรียนรู้ให้ครบ 3 ข้อ'); if (i2.filter(Boolean).length < 2) miss.push('สิ่งที่สนใจให้ครบ 2 ข้อ'); if (!q1) miss.push('คำถาม 1 ข้อ');
        if (!conf) miss.push('ระดับความเข้าใจ');
        if (miss.length) { el.querySelector('.et-err').textContent = 'ยังไม่ได้ตอบ: ' + miss.join(', '); return; }
        ET()[lid] = r; T.state.sent = T.state.sent || {}; T.state.sent[lid] = T.state.sent[lid] || 0; edit = false; T.save(); T.pushCloud && T.pushCloud();
        win(el, key, cfg.xp || 20); T.toast('🎟️ ส่ง E-Ticket แล้ว', 'ครูจะอ่านคำตอบก่อนคาบหน้า'); draw();
      }
    };
    let wasUser = !!T.user; T.on && T.on(() => { if (!!T.user !== wasUser) { wasUser = !!T.user; draw(); } });
    draw();
  };

  /* ----- เครื่องจำลองวงรอบเครื่องจักร (Fetch • Decode • Execute • Store) ----- */
  W.cyclesim = (el, cfg, key) => {
    const ST = [['fetch', '📥', 'นำคำสั่ง (Fetch)', 'CPU ดึงคำสั่งถัดไปจากหน่วยความจำหลัก (RAM)'], ['decode', '🔍', 'ถอดรหัส (Decode)', 'หน่วยควบคุมแปลความหมายว่าคำสั่งนี้ให้ทำอะไร กับข้อมูลใด'], ['exec', '⚙️', 'กระทำการ (Execute)', 'หน่วยคำนวณและตรรกะ (ALU) ลงมือทำตามคำสั่ง'], ['store', '💾', 'เก็บผล (Store)', 'บันทึกผลลัพธ์ลงรีจิสเตอร์หรือหน่วยความจำ แล้วไปคำสั่งถัดไป']];
    const P = cfg.prog; let pc = 0, st = -1, reg = {}, out = [], busy = false, cycles = 0;
    el.innerHTML = head(cfg, 'cpu', 'จำลองการทำงานของ CPU') + done(key) + `<div class="cy">
      <div class="cy-mem"><small>หน่วยความจำหลัก (RAM)</small>${P.map((x, i) => `<div class="cy-ins" data-i="${i}"><code>${i}</code><span>${x.t}</span></div>`).join('')}</div>
      <div class="cy-cpu"><small>หน่วยประมวลผลกลาง (CPU)</small><div class="cy-stages">${ST.map((x, i) => `<div class="cy-st" data-s="${i}"><b>${x[1]}</b><span>${x[2]}</span></div>`).join('')}</div>
        <div class="cy-reg"></div><div class="cy-say note"></div></div>
      <div class="cy-out"><small>หน่วยส่งออก (จอภาพ)</small><div class="cy-scr"></div></div></div>
      <div class="row"><button class="btn sm gold cy-step">▶ ทีละขั้น</button><button class="btn sm ghost cy-run">⏩ รันทั้งโปรแกรม</button><button class="btn sm ghost cy-reset">↺ เริ่มใหม่</button><span class="muted cy-cnt"></span></div>`;
    const $ = s => el.querySelector(s);
    const val = x => typeof x === 'number' ? x : (reg[x] ?? 0);
    const paint = () => {
      el.querySelectorAll('.cy-ins').forEach((d, i) => { d.classList.toggle('on', i === pc && pc < P.length); d.classList.toggle('ok', i < pc); });
      el.querySelectorAll('.cy-st').forEach((d, i) => d.classList.toggle('on', i === st));
      $('.cy-reg').innerHTML = (cfg.regs || ['A', 'B']).map(r => `<span><small>${r}</small><b>${reg[r] ?? '–'}</b></span>`).join('');
      $('.cy-scr').innerHTML = out.map(o => `<div>${o}</div>`).join('') || '<span class="muted">…</span>';
      $('.cy-cnt').textContent = `วงรอบที่ทำแล้ว ${cycles}/${P.length}`;
    };
    const exec = x => {
      if (x.op === 'IN') { reg[x.r] = x.v; return `รับค่า ${x.v} จาก${x.from || 'แป้นพิมพ์'} ใส่ไว้ในรีจิสเตอร์ ${x.r}`; }
      if (x.op === 'ADD') { reg[x.r] = val(x.r) + val(x.s); return `ALU บวก ${x.r} + ${x.s} ได้ ${reg[x.r]}`; }
      if (x.op === 'SUB') { reg[x.r] = val(x.r) - val(x.s); return `ALU ลบ ${x.r} − ${x.s} ได้ ${reg[x.r]}`; }
      if (x.op === 'MUL') { reg[x.r] = val(x.r) * val(x.s); return `ALU คูณ ${x.r} × ${x.s} ได้ ${reg[x.r]}`; }
      if (x.op === 'CMP') { const ok = val(x.r) >= val(x.s); reg.F = ok ? 'จริง' : 'เท็จ'; return `ALU เปรียบเทียบ ${x.r} ≥ ${x.s} ? ผล: ${reg.F}`; }
      if (x.op === 'OUT') { out.push((x.label || '') + (x.r ? val(x.r) : '') + (x.unit || '')); return `ส่งค่า${x.r ? ' ' + x.r : ''} ไปแสดงที่จอภาพ`; }
      return '';
    };
    let said = '';
    const step = () => {
      if (pc >= P.length) return false;
      st = (st + 1) % 4; const x = P[pc];
      if (st === 0) said = `<b>${ST[0][1]} ${ST[0][2]}</b> ดึงคำสั่ง <code>${x.t}</code> จากตำแหน่ง ${pc}`;
      if (st === 1) said = `<b>${ST[1][1]} ${ST[1][2]}</b> ${x.d || ST[1][3]}`;
      if (st === 2) said = `<b>${ST[2][1]} ${ST[2][2]}</b> ${exec(x)}`;
      if (st === 3) { said = `<b>${ST[3][1]} ${ST[3][2]}</b> ${ST[3][3]}`; pc++; cycles++; }
      $('.cy-say').innerHTML = said; paint();
      if (pc >= P.length && st === 3) { $('.cy-say').insertAdjacentHTML('beforeend', `<div class="good" style="margin-top:6px">🎉 ${cfg.after || 'โปรแกรมทำงานครบแล้ว! CPU ทำวงรอบ นำคำสั่ง–ถอดรหัส–กระทำการ ซ้ำกับทุกคำสั่ง'}</div>`); win(el, key); }
      return true;
    };
    $('.cy-step').onclick = () => { if (!busy) step(); };
    $('.cy-run').onclick = async () => { if (busy) return; busy = true; while (step()) { await new Promise(r => setTimeout(r, 650)); if (pc >= P.length && st === 3) break; } busy = false; };
    $('.cy-reset').onclick = () => { pc = 0; st = -1; reg = {}; out = []; cycles = 0; $('.cy-say').innerHTML = cfg.intro || 'กด ▶ ทีละขั้น เพื่อดูว่า CPU ทำอะไรในแต่ละขั้น'; paint(); };
    $('.cy-reset').onclick();
  };

  /* ----- ศูนย์ช่วยเหลือไอที: เกมวินิจฉัยและแก้ปัญหาทีละขั้น ----- */
  W.helpdesk = (el, cfg, key) => {
    const C = cfg.cases; const res = C.map(() => null); let ci = 0, si = 0, miss = 0;
    const draw = () => {
      const c = C[ci], stp = c.steps[si];
      el.innerHTML = head(cfg, 'life-buoy', 'IT Help Desk') + done(key) + `<div class="hd-tabs">${C.map((x, i) => `<button class="${i === ci ? 'on' : ''} ${res[i] != null ? 'ok' : ''}" data-c="${i}">${x.icon} ${x.title}${res[i] != null ? ' ' + '⭐'.repeat(res[i]) : ''}</button>`).join('')}</div>
        <div class="hd-ticket"><div class="hd-who">${c.icon}<div><b>ใบแจ้งปัญหา: ${c.title}</b><p>${c.story}</p></div></div>
        ${res[ci] != null ? `<div class="good">✅ แก้ปัญหาสำเร็จ ${'⭐'.repeat(res[ci])} ${c.lesson ? '<br><b>หลักคิด:</b> ' + c.lesson : ''}</div>` : `<div class="hd-step"><small>ขั้นที่ ${si + 1}/${c.steps.length}</small><h5>${stp.q}</h5><div class="hd-opts">${(stp._ord || (stp._ord = shuffle(stp.opts.map((_, i) => i)))).map(i => `<button class="btn sm ghost" data-o="${i}">${stp.opts[i].t}</button>`).join('')}</div><div class="hd-fb"></div></div>`}</div>`;
    };
    el.onclick = e => {
      const t = e.target.closest('[data-c]'); if (t) { ci = +t.dataset.c; si = 0; miss = 0; draw(); return; }
      const b = e.target.closest('[data-o]'); if (!b) return;
      const c = C[ci], o = c.steps[si].opts[+b.dataset.o], fb = el.querySelector('.hd-fb');
      if (!o.ok) { miss++; b.classList.add('bad'); b.disabled = true; fb.innerHTML = `<div class="note">🤔 ${o.fb || 'ยังไม่ใช่ ลองคิดถึงสาเหตุที่เป็นไปได้มากที่สุดก่อน'}</div>`; return; }
      fb.innerHTML = `<div class="good">👍 ${o.fb || 'ถูกต้อง'}</div>`; el.querySelectorAll('[data-o]').forEach(x => x.disabled = true);
      setTimeout(() => { si++; if (si >= c.steps.length) { res[ci] = Math.max(1, 3 - miss); const nx = res.findIndex(r => r == null); if (nx < 0) win(el, key); draw(); } else draw(); }, 900);
    };
    draw();
  };

  /* ----- เลือกอุปกรณ์ให้เหมาะกับงาน (อ่านสเปก) ----- */
  W.specpick = (el, cfg, key) => {
    const D = cfg.devices, S = cfg.cases; const ok = S.map(() => false); let ci = 0;
    const draw = () => {
      const c = S[ci];
      el.innerHTML = head(cfg, 'smartphone', 'อ่านสเปก เลือกให้เป็น') + done(key) + `<div class="hd-tabs">${S.map((x, i) => `<button class="${i === ci ? 'on' : ''} ${ok[i] ? 'ok' : ''}" data-c="${i}">${x.icon} ${x.who}${ok[i] ? ' ✓' : ''}</button>`).join('')}</div>
        <div class="note"><b>${c.icon} ${c.who}</b> ${c.need}${c.budget ? `<br><b>งบประมาณ:</b> ไม่เกิน ${c.budget.toLocaleString()} บาท` : ''}</div>
        <div class="sp-grid">${D.map((d, i) => `<button class="sp-card" data-d="${i}"><div class="em">${d.em}</div><b>${d.name}</b>${Object.entries(d.spec).map(([k, v]) => `<div class="sp-row"><small>${k}</small><span>${v}</span></div>`).join('')}<div class="sp-price">${d.price.toLocaleString()} บาท</div></button>`).join('')}</div><div class="hd-fb"></div>`;
      if (ok[ci]) { el.querySelectorAll('.sp-card')[c.best].classList.add('win'); el.querySelector('.hd-fb').innerHTML = `<div class="good">✅ ${c.why}</div>`; }
    };
    el.onclick = e => {
      const t = e.target.closest('[data-c]'); if (t) { ci = +t.dataset.c; draw(); return; }
      const b = e.target.closest('[data-d]'); if (!b || ok[ci]) return;
      const c = S[ci], i = +b.dataset.d, d = D[i];
      if (c.budget && d.price > c.budget) { el.querySelector('.hd-fb').innerHTML = `<div class="note">💸 ${d.name} ราคา ${d.price.toLocaleString()} บาท เกินงบ ${c.budget.toLocaleString()} บาท</div>`; return; }
      if (i !== c.best) { b.classList.add('bad'); el.querySelector('.hd-fb').innerHTML = `<div class="note">🤔 ${(c.hint && c.hint[i]) || 'ใช้ได้ แต่ยังไม่ตรงกับความต้องการที่สุด ลองดูสเปกที่สำคัญกับงานนี้อีกครั้ง'}</div>`; return; }
      ok[ci] = true; draw(); const nx = ok.findIndex(x => !x); if (nx < 0) win(el, key); else setTimeout(() => { ci = nx; draw(); }, 1600);
    };
    draw();
  };

  /* ----- เกมประกอบคอมพิวเตอร์ + ทดลอง Input → Process → Output ----- */
  W.buildpc = (el, cfg, key) => {
    const PARTS = [
      { id: 'cpu', em: '🧠', n: 'CPU', u: 'p', slot: 'cpu', tip: 'หน่วยประมวลผลกลาง ทำงานตามคำสั่ง' },
      { id: 'ram', em: '⚡', n: 'RAM 8 GB', u: 'm', slot: 'ram', tip: 'หน่วยความจำหลัก พักคำสั่งและข้อมูลที่กำลังใช้' },
      { id: 'ssd', em: '💾', n: 'SSD 512 GB', u: 's', slot: 'ssd', tip: 'หน่วยจัดเก็บ เก็บระบบปฏิบัติการและไฟล์ถาวร' },
      { id: 'psu', em: '🔌', n: 'แหล่งจ่ายไฟ (PSU)', u: 'x', slot: 'psu', tip: 'แปลงไฟบ้านเป็นไฟกระแสตรงจ่ายให้ทุกชิ้นส่วน' },
      { id: 'kb', em: '⌨️', n: 'แป้นพิมพ์', u: 'i', slot: 'in', tip: 'อุปกรณ์รับเข้า' },
      { id: 'mouse', em: '🖱️', n: 'เมาส์', u: 'i', slot: 'in', tip: 'อุปกรณ์รับเข้า' },
      { id: 'mic', em: '🎤', n: 'ไมโครโฟน', u: 'i', slot: 'in', tip: 'อุปกรณ์รับเข้า' },
      { id: 'mon', em: '🖥️', n: 'จอภาพ', u: 'o', slot: 'out', tip: 'อุปกรณ์ส่งออก' },
      { id: 'spk', em: '🔊', n: 'ลำโพง', u: 'o', slot: 'out', tip: 'อุปกรณ์ส่งออก' }];
    const SLOTS = [['psu', '🔌 ช่องแหล่งจ่ายไฟ', 1], ['cpu', '🧩 ซ็อกเก็ต CPU บนเมนบอร์ด', 1], ['ram', '▭ ช่องเสียบ RAM', 1], ['ssd', '▤ ช่องต่อหน่วยจัดเก็บ (M.2)', 1], ['in', '⬅️ พอร์ตอุปกรณ์รับเข้า (USB)', 3], ['out', '➡️ พอร์ตอุปกรณ์ส่งออก (HDMI/เสียง)', 2]];
    const placed = {}; let sel = null, booted = false; const tried = new Set();
    const inSlot = s => PARTS.filter(p => placed[p.id] === s);
    const draw = msg => {
      el.innerHTML = head(cfg, 'wrench', 'เกมประกอบคอมพิวเตอร์') + done(key) + `<div class="bp">
        <div class="bp-tray"><small>ชิ้นส่วนที่ยังไม่ได้ประกอบ (แตะเพื่อหยิบ)</small><div>${PARTS.filter(p => !placed[p.id]).map(p => `<button class="bp-part ${sel === p.id ? 'on' : ''}" data-p="${p.id}"><span>${p.em}</span>${p.n}</button>`).join('') || '<span class="muted">ประกอบครบแล้ว 🎉</span>'}</div></div>
        <div class="bp-case ${booted ? 'on' : ''}"><small>เคสคอมพิวเตอร์และพอร์ตเชื่อมต่อ (แตะช่องเพื่อวางชิ้นส่วน)</small>${SLOTS.map(([id, label, cap]) => `<div class="bp-slot" data-s="${id}"><b>${label}</b><span>${inSlot(id).map(p => `<em>${p.em} ${p.n}</em>`).join('') || `<i>ว่าง (${cap} ช่อง)</i>`}</span></div>`).join('')}</div></div>
        <div class="row"><button class="btn sm gold bp-boot">⏻ เปิดเครื่อง</button><button class="btn sm ghost bp-reset">↺ ถอดประกอบใหม่</button></div>
        <div class="note bp-msg">${msg || 'หยิบชิ้นส่วนแล้ววางให้ถูกช่อง จะกดเปิดเครื่องตอนไหนก็ได้ ลองสังเกตว่าถ้าขาดชิ้นส่วนใด เครื่องจะเป็นอย่างไร'}</div>
        ${booted ? `<div class="bp-ipo"><small>ทดลองใช้งาน: เลือกการกระทำ แล้วดูข้อมูลเดินทางผ่าน Input → Process → Output</small><div class="row">${(cfg.tests || TESTS).map((t, i) => `<button class="btn sm ghost" data-t="${i}">${t[0]}</button>`).join('')}</div><div class="bp-flow"></div></div>` : ''}`;
    };
    const TESTS = [
      ['⌨️ พิมพ์ตัวอักษร ก', [['⌨️ แป้นพิมพ์', 'กดปุ่ม ก ส่งรหัสตัวอักษรเข้าเครื่อง', 'i'], ['⚡ RAM', 'พักรหัสตัวอักษรและคำสั่งของโปรแกรมพิมพ์งาน', 'p'], ['🧠 CPU', 'นำคำสั่ง ถอดรหัส แล้วกระทำการวาดตัวอักษร ก', 'p'], ['🖥️ จอภาพ', 'แสดงตัวอักษร ก บนหน้าจอ', 'o']], 'kb', 'mon'],
      ['🖱️ ดับเบิลคลิกเปิดเพลง', [['🖱️ เมาส์', 'ส่งตำแหน่งและการคลิกเข้าเครื่อง', 'i'], ['💾 SSD', 'อ่านไฟล์เพลงจากหน่วยจัดเก็บ', 'p'], ['⚡ RAM', 'โหลดไฟล์เพลงมาพักไว้', 'p'], ['🧠 CPU', 'ถอดรหัสไฟล์เสียงเป็นสัญญาณ', 'p'], ['🔊 ลำโพง', 'เล่นเสียงเพลงออกมา', 'o']], 'mouse', 'spk'],
      ['🎤 สั่งงานด้วยเสียง “เปิดเว็บโรงเรียน”', [['🎤 ไมโครโฟน', 'แปลงเสียงพูดเป็นข้อมูลดิจิทัล', 'i'], ['🧠 CPU', 'ประมวลผลจดจำคำพูดเป็นคำสั่ง', 'p'], ['⚡ RAM', 'พักข้อมูลหน้าเว็บที่ดาวน์โหลดมา', 'p'], ['🖥️ จอภาพ', 'แสดงหน้าเว็บโรงเรียน', 'o']], 'mic', 'mon']];
    const boot = async () => {
      const miss = id => !placed[id];
      const msgs = [];
      if (miss('psu')) { draw('🔇 กดปุ่มแล้วเงียบสนิท ไม่มีไฟเข้า: ยังไม่มี <b>แหล่งจ่ายไฟ</b> ชิ้นส่วนอื่นจึงทำงานไม่ได้'); return; }
      if (miss('cpu')) { draw('💡 พัดลมหมุนแต่จอดำ: ไม่มี <b>CPU</b> ไม่มีใครทำตามคำสั่ง เครื่องจึงประมวลผลไม่ได้'); return; }
      if (miss('ram')) { draw('📢 มีเสียงบี๊บเตือนซ้ำ ๆ: ไม่มี <b>RAM</b> CPU ไม่มีที่พักคำสั่งและข้อมูลระหว่างทำงาน'); return; }
      if (!inSlot('out').some(p => p.id === 'mon')) { draw('🤔 เครื่องเปิดแล้ว แต่ไม่เห็นอะไรเลย: ไม่มี <b>จอภาพ</b> เป็นหน่วยส่งออก ผู้ใช้จึงรับรู้ผลลัพธ์ไม่ได้'); return; }
      if (miss('ssd')) { draw('⚠️ จอขึ้นข้อความ “No bootable device”: ไม่มี <b>หน่วยจัดเก็บ</b> ที่เก็บระบบปฏิบัติการ เครื่องจึงไม่รู้จะเริ่มโปรแกรมจากที่ใด'); return; }
      if (!inSlot('in').length) { draw('🖥️ เข้าสู่หน้าจอได้ แต่สั่งงานไม่ได้เลย: ยังไม่มี <b>อุปกรณ์รับเข้า</b> เช่น แป้นพิมพ์หรือเมาส์'); return; }
      const steps = ['🔌 แหล่งจ่ายไฟจ่ายไฟให้เมนบอร์ด', '🧠 CPU เริ่มทำงาน ตรวจสอบฮาร์ดแวร์ (POST)', '💾 อ่านระบบปฏิบัติการจาก SSD', '⚡ โหลดระบบปฏิบัติการเข้า RAM', '🖥️ แสดงหน้าจอพร้อมใช้งาน'];
      for (let i = 0; i < steps.length; i++) { el.querySelector('.bp-msg').innerHTML = `<b>กำลังเปิดเครื่อง ${i + 1}/${steps.length}</b><br>${steps[i]}`; await new Promise(r => setTimeout(r, 700)); }
      booted = true; draw('✅ เปิดเครื่องสำเร็จ! ฮาร์ดแวร์ครบทุกหน่วยและระบบปฏิบัติการ (ซอฟต์แวร์ระบบ) เริ่มทำงานแล้ว ลองกดทดลองใช้งานด้านล่าง');
    };
    el.onclick = async e => {
      const p = e.target.closest('[data-p]'); if (p) { sel = sel === p.dataset.p ? null : p.dataset.p; draw(sel ? `หยิบ <b>${PARTS.find(x => x.id === sel).n}</b> แล้ว แตะช่องที่ต้องการวาง` : ''); return; }
      const sl = e.target.closest('[data-s]');
      if (sl && sel) { const part = PARTS.find(x => x.id === sel), s = sl.dataset.s, cap = SLOTS.find(x => x[0] === s)[2];
        if (part.slot !== s) { draw(`❌ ${part.em} ${part.n} ไม่ได้อยู่ช่องนี้ ${part.tip} ลองหาช่องที่ตรงกับหน้าที่ของมัน`); return; }
        if (inSlot(s).length >= cap) { draw('ช่องนี้เต็มแล้ว'); return; }
        placed[part.id] = s; sel = null; booted = false; draw(`✅ วาง ${part.em} ${part.n} ถูกต้อง: ${part.tip}`); return; }
      if (e.target.closest('.bp-boot')) { boot(); return; }
      if (e.target.closest('.bp-reset')) { Object.keys(placed).forEach(k => delete placed[k]); sel = null; booted = false; tried.clear(); draw(); return; }
      const t = e.target.closest('[data-t]'); if (t && booted) {
        const T0 = (cfg.tests || TESTS)[+t.dataset.t], box = el.querySelector('.bp-flow');
        if (!placed[T0[2]] || !placed[T0[3]]) { box.innerHTML = `<div class="note">ยังไม่ได้ต่อ ${PARTS.find(x => x.id === (placed[T0[2]] ? T0[3] : T0[2])).n} ลองถอดประกอบแล้วต่อให้ครบ</div>`; return; }
        el.querySelectorAll('[data-t]').forEach(b => b.disabled = true);
        box.innerHTML = `<div class="bp-chain">${T0[1].map((x, i) => `<div class="bp-node u-${x[2]}" data-k="${i}"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('<i>→</i>')}</div>`;
        for (let i = 0; i < T0[1].length; i++) { box.querySelector(`[data-k="${i}"]`).classList.add('lit'); await new Promise(r => setTimeout(r, 650)); }
        box.insertAdjacentHTML('beforeend', '<p class="muted" style="margin:6px 0 0">🟦 รับเข้า (Input) → 🟪 ประมวลผลและหน่วยความจำ (Process) → 🟩 ส่งออก (Output)</p>');
        el.querySelectorAll('[data-t]').forEach(b => b.disabled = false);
        tried.add(+t.dataset.t); if (tried.size >= 2) win(el, key);
      }
    };
    draw();
  };

  /* ----- เกมนำทางแพ็กเก็ต: ค้น DNS แล้วเลือกเส้นทางผ่านเราเตอร์ ----- */
  W.netsim = (el, cfg, key) => {
    const N = cfg.nodes, E = cfg.links; const adj = {}; E.forEach(([a, b, bad]) => { (adj[a] = adj[a] || []).push([b, bad]); (adj[b] = adj[b] || []).push([a, bad]); });
    let stage = 0, path = [cfg.start], round = 0, best = 99;
    const R = cfg.rounds;
    const draw = msg => {
      const r = R[round];
      const lines = E.map(([a, b, bad]) => { const A = N[a], B = N[b]; const on = path.some((x, i) => i && ((path[i - 1] === a && x === b) || (path[i - 1] === b && x === a))); const down = bad || (r.down || []).some(d => (d[0] === a && d[1] === b) || (d[0] === b && d[1] === a));
        return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="${down ? 'down' : on ? 'on' : ''}"/>`; }).join('');
      el.innerHTML = head(cfg, 'route', 'เกมนำทางแพ็กเก็ต') + done(key) + `<div class="hd-tabs">${R.map((x, i) => `<button class="${i === round ? 'on' : ''} ${i < round ? 'ok' : ''}">${i + 1}. ${x.t}</button>`).join('')}</div>
        <div class="note">${stage === 0 ? `<b>ขั้นที่ 1 ถาม DNS:</b> ต้องการไปที่ <code>${r.domain}</code> ที่อยู่ IP คือข้อใด ${cfg.dns ? `<div class="ns-dns"><b>📖 สมุดรายชื่อของเซิร์ฟเวอร์ DNS</b>${cfg.dns.map(d => `<span><code>${d[0]}</code> → ${d[1]}</span>`).join('')}</div>` : ''}<div class="row" style="margin-top:6px">${r.ips.map((ip, i) => `<button class="btn sm ghost" data-ip="${i}">${ip}</button>`).join('')}</div>` : `<b>ขั้นที่ 2 เลือกเส้นทาง:</b> แตะเราเตอร์ทีละตัวจาก 📱 ไปถึง ${N[r.goal].em} ${N[r.goal].n} (IP ${r.ips[r.ip]}) หลีกเลี่ยงเส้นสีแดงที่ขัดข้อง • ใช้แล้ว ${path.length - 1} hop`}</div>
        <div class="ns-map"><svg viewBox="0 0 100 60" preserveAspectRatio="none">${lines}</svg>${Object.entries(N).map(([id, n]) => `<button class="ns-node ${path.includes(id) ? 'on' : ''} ${id === r.goal ? 'goal' : ''}" data-n="${id}" style="left:${n.x}%;top:${n.y / 60 * 100}%"><span>${n.em}</span><small>${n.n}</small></button>`).join('')}</div>
        <div class="row"><button class="btn sm ghost ns-undo">↶ ย้อน 1 ก้าว</button><span class="muted">${msg || ''}</span></div>`;
    };
    el.onclick = e => {
      const r = R[round];
      const ip = e.target.closest('[data-ip]'); if (ip && stage === 0) { if (+ip.dataset.ip === r.ip) { stage = 1; draw('✅ DNS ตอบกลับแล้ว แพ็กเก็ตรู้ที่อยู่ปลายทาง'); } else { ip.classList.add('bad'); el.querySelector('.muted') && (el.querySelector('.row .muted').textContent = '❌ ยังไม่ใช่ ที่อยู่นี้เป็นของเว็บไซต์อื่น'); } return; }
      if (e.target.closest('.ns-undo')) { if (path.length > 1) path.pop(); draw(); return; }
      const nd = e.target.closest('[data-n]'); if (!nd || stage !== 1) return;
      const cur = path[path.length - 1], nx = nd.dataset.n; if (path.includes(nx)) return;
      const l = (adj[cur] || []).find(x => x[0] === nx); const down = l && (l[1] || (r.down || []).some(d => (d[0] === cur && d[1] === nx) || (d[0] === nx && d[1] === cur)));
      if (!l) { draw('⛔ สองจุดนี้ไม่มีสายเชื่อมต่อกันโดยตรง'); return; }
      if (down) { draw('🔴 เส้นทางนี้ขัดข้อง เราเตอร์จะเลือกทางอื่นแทน ลองหาเส้นทางสำรอง'); return; }
      path.push(nx);
      if (nx === r.goal) { const h = path.length - 1; best = Math.min(best, h); const star = h <= r.min ? '⭐⭐⭐' : h <= r.min + 1 ? '⭐⭐' : '⭐';
        draw(`🎉 แพ็กเก็ตถึงปลายทางใน ${h} hop ${star} ${r.after || ''}`);
        setTimeout(() => { if (round < R.length - 1) { round++; stage = 0; path = [cfg.start]; draw(); } else win(el, key); }, 2200); return; }
      draw();
    };
    draw();
  };
})();
