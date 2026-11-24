/* ส่วนเสริม v4: ตู้เสื้อผ้าฮีโร่ (ปลดล็อกตามระดับ) • ข้อมูลหน่วยการเรียนรู้ • รายการให้/หักแต้มตามสมรรถนะ */
(function () {
  const T = window.T2;

  /* ---------- วาดไอเท็ม ---------- */
  window.WARDROBE_SVG = {
    hat: {
      cap: c => `<path d="M37 45 Q37 25 60 25 Q83 25 83 45Z" fill="${c.c2}"/><path d="M37 45 Q37 25 60 25 Q83 25 83 45" fill="none" stroke="${c.trim}" stroke-width="2"/><path d="M81 43 L99 47 Q93 52 79 47Z" fill="${c.c2}"/><circle cx="60" cy="26" r="2.5" fill="${c.trim}"/>`,
      phones: () => `<path d="M35 55 Q35 24 60 24 Q85 24 85 55" stroke="#111827" stroke-width="5" fill="none"/><rect x="29" y="47" width="11" height="17" rx="5" fill="#111827"/><rect x="80" y="47" width="11" height="17" rx="5" fill="#111827"/><rect x="31" y="51" width="3" height="9" rx="1.5" fill="#22D3EE"/><rect x="86" y="51" width="3" height="9" rx="1.5" fill="#22D3EE"/>`,
      beret: () => `<ellipse cx="57" cy="34" rx="24" ry="8.5" fill="#DC2626"/><ellipse cx="57" cy="36" rx="22" ry="3" fill="#991B1B" opacity=".5"/><rect x="57" y="22" width="3" height="6" rx="1.5" fill="#991B1B"/>`,
      wizard: () => `<path d="M38 38 L66 0 L84 38Z" fill="#4C1D95"/><path d="M52 18 L56 22 M70 14 L72 18" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/><ellipse cx="61" cy="38" rx="27" ry="5.5" fill="#5B21B6"/><text x="56" y="31" font-size="9" font-family="monospace" fill="#FDE68A">&lt;/&gt;</text>`,
      star: () => `<path d="M60 14 L64 24 L75 24 L66 31 L70 42 L60 35 L50 42 L54 31 L45 24 L56 24Z" fill="#FACC15" stroke="#B45309" stroke-width="1.5" stroke-linejoin="round"/>`
    },
    eyes: {
      glasses: () => `<g fill="none" stroke="#1F2937" stroke-width="2"><circle cx="51.5" cy="56" r="6.5"/><circle cx="68.5" cy="56" r="6.5"/><path d="M58 56 Q60 54 62 56 M45 55 L39 53 M75 55 L81 53"/></g>`,
      shades: () => `<g><rect x="43" y="51" width="16" height="10" rx="4" fill="#0F172A"/><rect x="61" y="51" width="16" height="10" rx="4" fill="#0F172A"/><path d="M59 55 L61 55 M43 54 L38 52 M77 54 L82 52" stroke="#0F172A" stroke-width="2"/><path d="M46 53 L50 53" stroke="#fff" stroke-width="1.5" opacity=".6"/></g>`,
      vr: () => `<g><rect x="39" y="48" width="42" height="16" rx="7" fill="#111827"/><rect x="42" y="51" width="36" height="10" rx="5" fill="url(#vrg)"/><defs><linearGradient id="vrg"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#A855F7"/></linearGradient></defs></g>`
    },
    neck: {
      scarf: () => `<path d="M43 80 Q60 91 77 80 L77 87 Q60 97 43 87Z" fill="#EF4444"/><path d="M65 87 L70 106 L61 106Z" fill="#DC2626"/>`,
      medal: () => `<path d="M53 81 L60 96 L67 81" stroke="#2563EB" stroke-width="3" fill="none"/><circle cx="60" cy="99" r="6.5" fill="#FACC15" stroke="#B45309" stroke-width="1.5"/><text x="57" y="102" font-size="7" fill="#92400E" font-weight="700">1</text>`,
      bowtie: () => `<path d="M60 87 L49 81 L49 93Z M60 87 L71 81 L71 93Z" fill="#111827"/><circle cx="60" cy="87" r="2.6" fill="#374151"/>`
    },
    bg: {
      code: () => `<g font-family="monospace" font-size="8" fill="#fff" opacity=".2"><text x="4" y="12">01011 print()</text><text x="62" y="24">if x &gt; 0:</text><text x="2" y="36">for i in</text><text x="78" y="46">1101</text><text x="4" y="62">def go():</text></g>`,
      grid: () => `<g opacity=".38"><rect x="0" y="66" width="18" height="60" fill="#0F172A"/><rect x="14" y="80" width="14" height="46" fill="#1E293B"/><rect x="96" y="58" width="24" height="70" fill="#0F172A"/><rect x="88" y="78" width="12" height="50" fill="#1E293B"/></g><g fill="#FDE68A" opacity=".55"><rect x="4" y="72" width="3" height="3"/><rect x="10" y="80" width="3" height="3"/><rect x="101" y="64" width="3" height="3"/><rect x="108" y="72" width="3" height="3"/><rect x="101" y="84" width="3" height="3"/></g>`,
      sunset: () => `<rect width="120" height="120" fill="#F97316" opacity=".22"/><circle cx="96" cy="28" r="16" fill="#FDBA74" opacity=".85"/><path d="M0 40 Q30 32 60 40 T120 38" stroke="#FDE68A" stroke-width="2" fill="none" opacity=".4"/>`
    },
    pet: {
      bot: () => `<text x="3" y="115" font-size="22">🤖</text>`, owl: () => `<text x="3" y="115" font-size="22">🦉</text>`, snake: () => `<text x="3" y="115" font-size="22">🐍</text>`,
      cat: () => `<text x="3" y="115" font-size="22">🐱</text>`, dragon: () => `<text x="1" y="116" font-size="24">🐉</text>`
    }
  };

  /* ---------- แคตตาล็อก: lv = ดัชนีระดับ (0 = Lv.1) หรือ need = เงื่อนไขพิเศษ ---------- */
  const tb = s => (s.tb || []).length, ub = (s, k) => (s.badges || []).includes(k);
  window.WARDROBE = {
    hat: { t: 'หมวก', em: '🎩', items: [['none', 'ไม่สวม', 0], ['band', 'ผ้าคาดผม', 1], ['cap', 'หมวกแก๊ป', 1], ['phones', 'หูฟังโปรเกมเมอร์', 2], ['beret', 'เบเร่ต์นักออกแบบ', 3], ['crown', 'มงกุฎทองคำ', 4], ['wizard', 'หมวกพ่อมดโค้ด', 5], ['star', 'ดาวจากครู', null, s => tb(s) >= 1, 'ได้เหรียญจากครู 1 เหรียญ']] },
    eyes: { t: 'แว่น', em: '👓', items: [['none', 'ไม่สวม', 0], ['glasses', 'แว่นนักคิด', 1], ['shades', 'แว่นกันแดด', 2], ['vr', 'แว่น VR', 3]] },
    neck: { t: 'เครื่องประดับ', em: '🎀', items: [['none', 'ไม่สวม', 0], ['scarf', 'ผ้าพันคอ', 1], ['bowtie', 'หูกระต่าย', 2], ['medal', 'เหรียญแชมป์', null, s => ub(s, 'perfect'), 'ทำแบบทดสอบท้ายบทได้เต็ม']] },
    skin: { t: 'ชุด', em: '👕', items: [['none', 'ชุดประจำอาชีพ', 0], ['space', 'ชุดอวกาศ', 2], ['forest', 'ชุดป่าเขียว', 3], ['neon', 'ชุดนีออน', 4], ['gold', 'ชุดทองคำ', 6]] },
    cape: { t: 'ผ้าคลุม', em: '🦸', items: [['none', 'ไม่สวม', 0], ['cape', 'ผ้าคลุมฮีโร่', 2], ['gold', 'ผ้าคลุมทองคำ', 5]] },
    bg: { t: 'ฉากหลัง', em: '🖼️', items: [['none', 'สีประจำอาชีพ', 0], ['code', 'ฉากโค้ด', 2], ['grid', 'เมืองดิจิทัล', 3], ['sunset', 'พระอาทิตย์ตก', 4]] },
    aura: { t: 'ออร่า', em: '✨', items: [['none', 'ไม่มี', 0], ['stars', 'ประกายดาว', 5], ['ring', 'วงแหวนตำนาน', 6]] },
    pet: { t: 'สัตว์คู่หู', em: '🐾', items: [['none', 'ไม่มี', 0], ['bot', 'หุ่นยนต์จิ๋ว', 2], ['owl', 'นกฮูกปัญญา', 3], ['snake', 'งูไพทอน', 4], ['dragon', 'มังกรน้อย', 6], ['cat', 'แมวไซเบอร์', null, s => ub(s, 'u1'), 'เรียนจบหน่วยที่ 1']] }
  };
  const lvOf = () => T ? T.lv() : 0;
  T && (T.itemOpen = (it, s) => it[2] != null ? lvOf() >= it[2] : !!(it[3] && it[3](s || T.state)));
  T && (T.unlockedIds = () => { const s = T.state, o = []; Object.entries(WARDROBE).forEach(([k, g]) => g.items.forEach(it => { if (it[0] !== 'none' && T.itemOpen(it, s)) o.push(k + ':' + it[0]); })); return o; });
  T && (T.newUnlocks = () => { const seen = T.state.seenEq || []; return T.unlockedIds().filter(x => !seen.includes(x)); });
  const autoEq = lv => ({ hat: lv >= 4 ? 'crown' : lv >= 1 ? 'band' : 'none', cape: lv >= 2 ? 'cape' : 'none', aura: lv >= 6 ? 'ring' : lv >= 5 ? 'stars' : 'none' });

  if (T) T.wardrobe = () => {
    if (!T.user || !T.state.hero) { T.toast('สร้างฮีโร่ก่อน', 'เข้าสู่ระบบแล้วสร้างฮีโร่ประจำตัว', 'err'); return; }
    const s = T.state, eq = Object.assign({}, autoEq(T.lv()), s.hero.eq || {}), fresh = T.newUnlocks();
    let tab = (fresh[0] || 'hat:').split(':')[0];
    const m = T.modal(`<div class="ch-tabs"><b class="on">🎨 แต่งตัว</b><a href="pets.html">🐾 สัตว์เลี้ยง</a></div><div class="wd-wrap"><div class="wd-prev"><div id="wdSvg"></div><b>Lv.${T.lv() + 1} ${LEVELS[T.lv()].name}</b><small class="muted">ปลดล็อกแล้ว ${T.unlockedIds().length} ชิ้น</small>${LEVELS[T.lv() + 1] ? `<small class="muted">อีก ${LEVELS[T.lv() + 1].xp - T.xp()} XP ปลดล็อกไอเท็มระดับถัดไป</small>` : ''}</div>
      <div class="wd-r"><div class="wd-tabs" id="wdTabs"></div><div class="wd-grid" id="wdGrid"></div></div></div>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn ghost" id="wdAuto">↺ แต่งตามระดับอัตโนมัติ</button><button class="btn gold" id="wdSave">💾 บันทึกชุดนี้</button></div>`, { cls: 'wide' });
    let st = null; const prev = () => { const h = Object.assign({}, s.hero, { eq: Object.assign({}, eq) });
      if (window.heroStage) { if (!st) st = heroStage(m.el.querySelector('#wdSvg'), { mini: true, drag: true }); st.set(h, T.lv(), s.nick); }
      else m.el.querySelector('#wdSvg').innerHTML = heroSVG(h, T.lv(), 170); };
    const draw = () => {
      m.el.querySelector('#wdTabs').innerHTML = Object.entries(WARDROBE).map(([k, g]) => `<button class="${k === tab ? 'on' : ''}" data-wt="${k}">${g.em} ${g.t}${fresh.some(x => x.startsWith(k + ':')) ? '<i class="wd-new"></i>' : ''}</button>`).join('');
      m.el.querySelector('#wdGrid').innerHTML = WARDROBE[tab].items.map(it => { const ok = it[0] === 'none' || T.itemOpen(it, s), on = (eq[tab] || 'none') === it[0], nw = fresh.includes(tab + ':' + it[0]);
        const pv = it[0] === 'none' ? '<span class="wd-none">—</span>' : WARDROBE[tab].stage ? `<span class="wd-fxp">${({ sparkle: '✨', leaf: '🍃', code: '💻', snow: '❄️', bubble: '🫧', meteor: '☄️' })[it[0]] || '✨'}</span>` : heroSVG(Object.assign({}, s.hero, { eq: Object.assign({}, eq, { [tab]: it[0] }) }), T.lv(), 64);
        return `<button class="wd-it ${on ? 'on' : ''} ${ok ? '' : 'lock'}" ${ok ? `data-wi="${it[0]}"` : 'disabled'}>${nw ? '<em>ใหม่</em>' : ''}<span class="wd-pv">${pv}</span><b>${it[1]}</b><small>${ok ? (on ? '✓ สวมอยู่' : 'กดเพื่อสวม') : '🔒 ' + (it[2] != null ? `Lv.${it[2] + 1} ${LEVELS[it[2]].name}` : it[4])}</small></button>`; }).join('');
    };
    m.el.addEventListener('click', e => {
      const t = e.target.closest('[data-wt]'); if (t) { tab = t.dataset.wt; draw(); return; }
      const w = e.target.closest('[data-wi]'); if (w) { eq[tab] = w.dataset.wi; prev(); draw(); return; }
      if (e.target.closest('#wdAuto')) { Object.keys(eq).forEach(k => delete eq[k]); Object.assign(eq, autoEq(T.lv())); prev(); draw(); return; }
      if (e.target.closest('#wdSave')) { s.hero = Object.assign({}, s.hero, { eq: Object.assign({}, eq) }); s.seenEq = T.unlockedIds(); T.save(); if (T.pushCloud) T.pushCloud(); m.close(); T.confetti(60); T.toast('✨ แต่งตัวเรียบร้อย', 'เพื่อนจะเห็นชุดใหม่บนหอเกียรติยศ'); }
    });
    prev(); draw();
  };
  /* แจ้งเตือนเมื่อมีไอเท็มใหม่ */
  if (T) {
    let lastN = -1;
    const mark = () => { if (!T.user || !T.state.hero) return; const n = T.newUnlocks().length; document.querySelectorAll('.avatar.hero').forEach(a => a.classList.toggle('has-new', n > 0)); document.querySelectorAll('[data-wardrobe] .wd-cnt').forEach(c => { c.textContent = n || ''; c.style.display = n ? '' : 'none'; });
      if (lastN >= 0 && n > lastN) setTimeout(() => T.toast('🎁 ปลดล็อกไอเท็มใหม่!', 'กด “อัปเกรดตัวละคร” เพื่อแต่งตัว', 'badge'), 1600); lastN = n; };
    T.on(() => { if (T.ready) setTimeout(mark, 0); });
    document.addEventListener('click', e => { if (e.target.closest('[data-wardrobe]')) { e.preventDefault(); T.wardrobe(); } });
  }

  /* ---------- ข้อมูลหน่วยการเรียนรู้ ---------- */
  window.UNIT_INFO = window.UNIT_INFO || {
    1: { q: 'ถ้ารหัสผ่านหลุด หรือมีคนนำรูปของเราไปใช้โดยไม่ขออนุญาต ควรรับมืออย่างไร?', d: 'โลกออนไลน์คือที่ที่เราใช้ชีวิตทุกวัน หน่วยนี้ฝึกให้ใช้เทคโนโลยีอย่างปลอดภัยและรับผิดชอบ ตั้งแต่ดูแลบัญชีของตัวเอง รู้ทันกลโกง ไปจนถึงเคารพและแสดงสิทธิ์ในผลงาน', o: ['ตั้งรหัสผ่านที่แข็งแรง และเปิดการยืนยันตัวตน 2 ชั้น', 'แยกข่าวปลอมและลิงก์หลอกลวงออกจากข้อมูลจริง', 'ใช้และให้เครดิตผลงานคนอื่นด้วยสัญญาอนุญาต Creative Commons'], r: ['กลุ่มไลน์ครอบครัวที่มีลิงก์แปลก ๆ', 'รูปที่โพสต์แล้วอยู่ตลอดไป', 'ภาพจากเน็ตที่จะใส่ในรายงาน'] },
    2: { q: 'มือถือช้า พื้นที่เต็ม ส่งไฟล์ใหญ่ไม่ได้ ควรแก้อย่างไรให้คุ้มค่าทั้งเงิน เวลา และสิ่งแวดล้อม?', d: 'ตามแนวทาง สสวท. บทที่ 4–5: เปิดกล่องดูว่าคอมพิวเตอร์ทำงานอย่างไร เลือกฮาร์ดแวร์และซอฟต์แวร์ให้เหมาะกับงาน แก้ปัญหาการใช้งานเบื้องต้น แล้วติดตามข้อมูลเดินทางผ่านเครือข่าย อินเทอร์เน็ต และคลาวด์ ผ่านเกมประกอบคอม เครื่องจำลอง CPU และเกมนำทางแพ็กเก็ต', o: ['อธิบายองค์ประกอบและหลักการทำงานของคอมพิวเตอร์ (Input–Process–Output และวงรอบเครื่องจักร)', 'เลือกใช้ฮาร์ดแวร์และซอฟต์แวร์ให้เหมาะกับงาน และแก้ปัญหาการใช้งานเบื้องต้นอย่างเป็นขั้นตอน', 'อธิบายองค์ประกอบการสื่อสาร ประเภทเครือข่าย และการทำงานของอินเทอร์เน็ต', 'เลือกและใช้บริการบนเครือข่ายและคลาวด์ทำงานร่วมกันอย่างปลอดภัยและเป็นมิตรต่อสิ่งแวดล้อม'], r: ['มือถือช้าและพื้นที่เต็ม', 'ภาพกีฬาสี 2 GB ที่ต้องแชร์ทั้งคณะ', 'เครื่องในห้องคอมที่ไม่มีเสียง', 'ขยะอิเล็กทรอนิกส์ในบ้าน'] },
    3: { q: 'ถ้าต้องสอนหุ่นยนต์ทำข้าวผัด ต้องเขียนขั้นตอนละเอียดแค่ไหน?', d: 'ฝึกคิดแบบนักแก้ปัญหา แตกปัญหาใหญ่เป็นชิ้นเล็ก หารูปแบบ แล้วเขียนเป็นขั้นตอนที่คอมพิวเตอร์ทำตามได้ จากนั้นเปลี่ยนเป็นโค้ดไพทอนด้วยตัวแปร เงื่อนไข และการวนซ้ำ', o: ['ใช้แนวคิดเชิงคำนวณออกแบบอัลกอริทึม', 'เขียนโปรแกรมไพทอนที่ใช้ตัวแปร เงื่อนไข และตรรกะบูลีน', 'ใช้การวนซ้ำสร้างลวดลายและเกม'], r: ['เครื่องคิดเงินของสหกรณ์', 'เกมเลือกทาง', 'ค่าส่งพัสดุที่ขึ้นกับน้ำหนัก'] },
    4: { q: 'โปรแกรมเล็ก ๆ แบบไหนที่ช่วยแก้ปัญหาในชีวิตประจำวันได้จริง?', d: 'ต่อยอดไพทอนด้วยฟังก์ชันและลิสต์ ใช้วิเคราะห์ข้อมูลจริงของขอนแก่น แล้วทำโครงงานโปรแกรมแก้ปัญหาใกล้ตัวตั้งแต่กำหนดปัญหาจนถึงนำเสนอ', o: ['สร้างและเรียกใช้ฟังก์ชันของตัวเอง', 'ใช้ลิสต์เก็บและวิเคราะห์ข้อมูล', 'พัฒนา ทดสอบ และนำเสนอโครงงานไพทอน'], r: ['ข้อมูลฝุ่น PM2.5 ขอนแก่น', 'กล่องเครื่องมือคำนวณเกรด', 'โปรแกรมช่วยงานในโรงเรียน'] },
    5: { q: 'ถ้ามีเครื่องพิมพ์ 3 มิติ ปัญหาไหนในโรงเรียนที่อยากลงมือแก้?', d: 'เปลี่ยนจากคนใช้มาเป็นนักออกแบบ ใช้กระบวนการออกแบบเชิงวิศวกรรม 6 ขั้น ตั้งแต่ระบุปัญหา หาข้อมูล ออกแบบ สร้างแบบจำลอง 3 มิติ ทดสอบ ปรับปรุง จนถึงนำเสนอ', o: ['ระบุปัญหาและสรุปกรอบของปัญหาในโรงเรียนหรือชุมชน', 'ร่างแนวคิดและสร้างแบบจำลอง 3 มิติด้วย SketchUp for Web', 'ทดสอบ ประเมินผล ปรับปรุง และนำเสนอชิ้นงาน'], r: ['ร่มหายในวันฝนตก', 'ที่วางของในห้องเรียน', 'อุปกรณ์ช่วยเพื่อนในโรงอาหาร'] },
    6: { q: 'อีก 10 ปี เทคโนโลยีอะไรจะเปลี่ยนชีวิตของเรามากที่สุด?', d: 'มองหาสัญญาณของเทคโนโลยีที่กำลังมา วิเคราะห์ปัจจัยที่ทำให้เทคโนโลยีเปลี่ยน แล้วคาดการณ์ห้องเรียนกัลยาณวัตรในอนาคต พร้อมชั่งผลดีผลเสียต่อชีวิต สังคม และสิ่งแวดล้อม', o: ['วิเคราะห์ปัจจัยที่ทำให้เทคโนโลยีเปลี่ยนแปลง', 'คาดการณ์แนวโน้มเทคโนโลยีอย่างมีเหตุผล', 'ประเมินผลกระทบของเทคโนโลยีต่อชีวิต สังคม และสิ่งแวดล้อม'], r: ['AI ในห้องเรียน', 'อาชีพที่จะเกิดใหม่', 'เมืองอัจฉริยะ'] }
  };

  /* ---------- รายการให้แต้ม: 6 สมรรถนะหลัก (หลักสูตรฐานสมรรถนะ) • รายการหักแต้ม: ข้อตกลงห้องเรียน ---------- */
  window.PT_COMP = {
    SELF: { em: '🧘', t: 'การจัดการตนเอง', c: '#0EA5E9' }, THINK: { em: '🧠', t: 'การคิดขั้นสูง', c: '#8B5CF6' }, COMM: { em: '🗣️', t: 'การสื่อสาร', c: '#F59E0B' },
    TEAM: { em: '🤝', t: 'การรวมพลังทำงานเป็นทีม', c: '#22C55E' }, CIT: { em: '🏛️', t: 'การเป็นพลเมืองที่เข้มแข็ง', c: '#2D4FD6' }, SUS: { em: '🌱', t: 'การอยู่ร่วมกับธรรมชาติและวิทยาการอย่างยั่งยืน', c: '#059669' },
    RULE: { em: '📏', t: 'ข้อตกลงห้องเรียน', c: '#DC2626' }
  };
  window.PT_REASONS = [
    ['SELF', 1, 'ตั้งใจเรียนตลอดคาบ'], ['SELF', 1, 'ส่งงานตรงเวลา'], ['SELF', 1, 'เข้าห้องตรงเวลา เตรียมพร้อม'],
    ['THINK', 1, 'ตั้งคำถามที่ดี'], ['THINK', 2, 'หาและแก้บั๊กได้เอง'], ['THINK', 2, 'ไอเดียสร้างสรรค์'],
    ['COMM', 1, 'ตอบคำถามในห้อง'], ['COMM', 1, 'อธิบายให้เพื่อนเข้าใจ'], ['COMM', 2, 'นำเสนองานชัดเจน'],
    ['TEAM', 1, 'ช่วยเหลือเพื่อน'], ['TEAM', 2, 'ทำงานกลุ่มดี แบ่งหน้าที่ชัด'], ['TEAM', 1, 'รับฟังความเห็นต่าง'],
    ['CIT', 1, 'ให้เครดิตแหล่งที่มา'], ['CIT', 1, 'ดูแลอุปกรณ์ห้องคอม'], ['CIT', 2, 'ซื่อสัตย์ ทำงานด้วยตัวเอง'],
    ['SUS', 1, 'ปิดเครื่อง ประหยัดพลังงาน'], ['SUS', 2, 'ใช้เทคโนโลยีแก้ปัญหาใกล้ตัว']
  ];
  window.PT_MINUS = [
    ['RULE', -2, 'เล่นเกม / เปิดเว็บที่ไม่เกี่ยวกับงานในคาบ'], ['RULE', -1, 'ใช้มือถือนอกกิจกรรม'], ['RULE', -1, 'ส่งเสียงรบกวน / ไม่ฟังตอนเพื่อนนำเสนอ'],
    ['RULE', -1, 'เข้าห้องสายโดยไม่มีเหตุผล'], ['RULE', -1, 'นำอาหารหรือเครื่องดื่มเข้าห้องคอม'], ['RULE', -2, 'ใช้อุปกรณ์ผิดวิธี / แก้การตั้งค่าเครื่อง'],
    ['RULE', -3, 'คัดลอกงานเพื่อน'], ['RULE', -3, 'โพสต์หรือแชตไม่เหมาะสม'], ['RULE', 1, 'คืนแต้ม: ปรับปรุงพฤติกรรมแล้ว']
  ];
})();
