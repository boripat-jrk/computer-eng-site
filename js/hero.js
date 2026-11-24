/* ระบบฮีโร่: อาชีพ ตัวละคร SVG ค่าพลัง ภารกิจประจำวัน */
(function () {
  /* อาชีพฮีโร่ ↔ สมรรถนะสำคัญของผู้เรียน (หลักสูตรแกนกลางฯ 2551) ↔ หน่วยการเรียนรู้ตามแผน
     comp = สมรรถนะเด่น, comp2 = สมรรถนะรอง, units = โลกที่ถนัด (ทุกอาชีพได้ XP และแต้มเท่ากัน) */
  window.HERO_CLASSES = window.HERO_CLASSES || {
    guardian: { comp: 'LIF', comp2: 'TEC', name: 'ผู้พิทักษ์ไซเบอร์', en: 'Cyber Guardian', c1: '#3B82F6', c2: '#1E3A8A', outfit: '#2563EB', trim: '#FACC15', units: [1], item: 'shield',
      desc: 'ปกป้องข้อมูล รู้ทันภัยออนไลน์ เคารพสิทธิ์ผู้อื่น', stat: 'DEF',
      why: 'ฝึกรับผิดชอบต่อตนเองและผู้อื่นบนโลกออนไลน์ หลีกเลี่ยงพฤติกรรมเสี่ยง ดูแลร่องรอยดิจิทัล ตั้งรหัสผ่านที่ปลอดภัย และเคารพลิขสิทธิ์ จึงเด่นด้านการใช้ทักษะชีวิต และใช้เทคโนโลยีอย่างมีคุณธรรม' },
    engineer: { comp: 'TEC', comp2: 'SOL', name: 'วิศวกรเครือข่าย', en: 'Net Engineer', c1: '#14B8A6', c2: '#115E59', outfit: '#0F766E', trim: '#FDE68A', units: [2], item: 'wrench',
      desc: 'เชี่ยวชาญฮาร์ดแวร์ เครือข่าย และคลาวด์', stat: 'TEC',
      why: 'ฝึกเลือกและใช้อุปกรณ์ เครือข่าย และบริการคลาวด์ให้เหมาะกับงาน และแก้ปัญหาการเชื่อมต่อเบื้องต้น จึงเด่นด้านการใช้เทคโนโลยี และเสริมการแก้ปัญหา' },
    strategist: { comp: 'THK', comp2: 'SOL', name: 'นักวางกลยุทธ์', en: 'Strategist', c1: '#A855F7', c2: '#581C87', outfit: '#7E22CE', trim: '#F0ABFC', units: [3, 6], item: 'orb',
      desc: 'แตกปัญหา หารูปแบบ วางแผนอย่างเป็นขั้นตอน', stat: 'INT',
      why: 'ฝึกคิดเชิงคำนวณ ได้แก่ แยกย่อยปัญหา หารูปแบบ คิดเชิงนามธรรม และออกแบบอัลกอริทึม รวมถึงคาดการณ์เทคโนโลยีอนาคตอย่างมีเหตุผล จึงเด่นด้านการคิด และเสริมการแก้ปัญหา' },
    mage: { comp: 'SOL', comp2: 'THK', name: 'จอมเวทโค้ด', en: 'Code Mage', c1: '#22C55E', c2: '#14532D', outfit: '#15803D', trim: '#FDE047', units: [4], item: 'staff',
      desc: 'ร่ายคาถาด้วยภาษาไพทอน เปลี่ยนความคิดเป็นโปรแกรม', stat: 'MAG',
      why: 'ฝึกเขียนฟังก์ชัน วิเคราะห์ข้อมูล ทดสอบ และแก้บั๊ก จนได้โปรแกรมแก้ปัญหาใกล้ตัว จึงเด่นด้านการแก้ปัญหา และเสริมการคิด' },
    maker: { comp: 'COM', comp2: 'SOL', name: 'นักประดิษฐ์', en: 'Maker', c1: '#F97316', c2: '#7C2D12', outfit: '#EA580C', trim: '#FEF08A', units: [5], item: 'hammer',
      desc: 'ออกแบบ ร่างภาพ สร้างแบบจำลอง 3 มิติ และนำเสนอนวัตกรรม', stat: 'CRE',
      why: 'ใช้กระบวนการออกแบบเชิงวิศวกรรม ถ่ายทอดแนวคิดด้วยภาพร่างและแบบจำลอง 3 มิติ นำเสนอ และรับข้อเสนอแนะไปปรับปรุง จึงเด่นด้านการสื่อสาร และเสริมการแก้ปัญหา' }
  };
  /* ข้อความทักษะพิเศษสร้างจากหน่วยการเรียนรู้จริง */
  Object.values(window.HERO_CLASSES).forEach(c => {
    const U = window.UNITS || [];
    c.worlds = c.units.map(n => { const u = U.find(x => x.n === n); return u ? `โลกที่ ${n} ${u.short}` : `โลกที่ ${n}`; });
    c.perk = window.SIDE_QUESTS ? 'มีเควสรองเฉพาะสาย 4 เควส • ทุกสายได้ XP เท่ากัน' : `ถนัด${c.worlds.join(' และ ')} • ทุกอาชีพได้ XP เท่ากัน`;
  });
  const SKINS = ['#FFE0C2', '#F5C9A0', '#E0A97A', '#B97F52'];
  const HAIRS = ['#2B2118', '#5B3A1E', '#C2410C', '#1E3A8A', '#E5E7EB', '#DB2777'];
  const STYLES = ['สั้นเท่', 'ยาวสลวย', 'มวยผม', 'หมวกฮู้ด'];
  window.HERO_OPTS = { SKINS, HAIRS, STYLES };
  window.HERO_SKINSETS = { space: ['#E5E7EB', '#64748B', '#38BDF8'], neon: ['#0EA5E9', '#0F172A', '#F0ABFC'], gold: ['#EAB308', '#713F12', '#FEF9C3'], forest: ['#16A34A', '#14532D', '#BBF7D0'], student: ['#F8FAFC', '#1E3A8A', '#1E3A8A'], silk: ['#7E22CE', '#3B0764', '#FACC15'], ninja: ['#1F2937', '#111827', '#EF4444'], pixel: ['#F472B6', '#9D174D', '#A5F3FC'] };
  let uid = 0;

  const item = (k, cls, lv) => {
    const g = lv >= 4 ? '#FACC15' : '#CBD5E1';
    switch (k) {
      case 'shield': return `<g transform="translate(78 70)"><path d="M14 0 L28 5 L28 18 Q28 30 14 37 Q0 30 0 18 L0 5Z" fill="${cls.c2}" stroke="${g}" stroke-width="2.5"/><path d="M14 8 L14 29 M6 16 L22 16" stroke="${cls.trim}" stroke-width="3" stroke-linecap="round"/></g>`;
      case 'wrench': return `<g transform="translate(86 62) rotate(28)"><rect x="5" y="10" width="7" height="34" rx="3" fill="${g}"/><path d="M0 8 Q0 0 8.5 0 Q17 0 17 8 L13 12 L4 12Z" fill="${g}"/><circle cx="8.5" cy="5" r="3" fill="${cls.c2}"/><rect x="5" y="30" width="7" height="14" rx="3" fill="${cls.c2}"/></g>`;
      case 'orb': return `<g transform="translate(84 70)"><circle cx="12" cy="10" r="11" fill="${cls.c1}" opacity=".35"/><circle cx="12" cy="10" r="8" fill="${cls.trim}"/><circle cx="9" cy="7" r="2.5" fill="#fff" opacity=".9"/><path d="M4 22 Q12 28 20 22" stroke="${g}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
      case 'staff': return `<g transform="translate(92 40)"><rect x="3" y="14" width="5" height="62" rx="2.5" fill="#92400E"/><circle cx="5.5" cy="10" r="9" fill="${cls.trim}" opacity=".45"/><circle cx="5.5" cy="10" r="6" fill="${cls.trim}"/><path d="M2.5 9 Q5.5 4 8.5 9 Q5.5 14 2.5 9Z" fill="${cls.c2}"/><circle cx="3.5" cy="7.5" r="1.6" fill="#fff"/></g>`;
      case 'hammer': return `<g transform="translate(84 58) rotate(-18)"><rect x="9" y="12" width="6" height="40" rx="3" fill="#92400E"/><rect x="0" y="2" width="24" height="13" rx="3" fill="${g}"/><rect x="0" y="6" width="24" height="4" fill="${cls.c2}" opacity=".5"/></g>`;
    }
    return '';
  };

  const hair = (st, c, back) => {
    if (back) {
      if (st === 1) return `<path d="M36 50 Q34 82 44 92 L76 92 Q86 82 84 50Z" fill="${c}"/>`;
      if (st === 2) return `<circle cx="60" cy="23" r="9" fill="${c}"/>`;
      return '';
    }
    switch (st) {
      case 0: return `<path d="M37 50 Q36 28 60 27 Q84 28 83 50 L78 44 L74 50 L70 41 L64 47 L58 38 L52 46 L46 40 L42 49Z" fill="${c}"/>`;
      case 1: return `<path d="M37 54 Q35 28 60 28 Q85 28 83 54 Q78 42 66 40 Q56 46 42 44 Q38 48 37 54Z" fill="${c}"/>`;
      case 2: return `<path d="M38 50 Q37 30 60 30 Q83 30 82 50 Q76 40 60 39 Q44 40 38 50Z" fill="${c}"/>`;
      case 3: return '';
    }
    return '';
  };

  window.heroParts = { hair: (st, c, back) => hair(st, c, back), item: (k, cls, lv) => item(k, cls, lv) };
  /* วาดฮีโร่: h = {cls, skin, style, hc}, lv = ดัชนีระดับ */
  window.heroSVG = (h, lv = 0, size = 64) => {
    h = Object.assign({ cls: 'mage', skin: 0, style: 0, hc: 0 }, h || {});
    const cls = HERO_CLASSES[h.cls] || Object.values(HERO_CLASSES)[0];
    const sk = SKINS[h.skin] || SKINS[0], hc = HAIRS[h.hc] || HAIRS[0];
    const id = 'h' + (++uid);
    const hood = h.style === 3, E = h.eq, W = window.WARDROBE_SVG || {};
    /* ไอเทมที่สวมใส่ (ตู้เสื้อผ้า) • ถ้ายังไม่เคยแต่ง ใช้ของรางวัลตามระดับแบบเดิม */
    const G = E ? { stars: E.aura === 'stars', ring: E.aura === 'ring', cape: E.cape === 'cape' || E.cape === 'gold', band: E.hat === 'band', crown: E.hat === 'crown' }
      : { stars: lv >= 5, ring: lv >= 6, cape: lv >= 2, band: lv >= 1 && lv < 4, crown: lv >= 4 };
    const capeC = E && E.cape === 'gold' ? '#CA8A04' : cls.c2, capeT = E && E.cape === 'gold' ? '#FEF08A' : cls.trim;
    const SK = (window.HERO_SKINSETS || {})[E && E.skin];
    const outfit = SK ? SK[0] : cls.outfit, odark = SK ? SK[1] : cls.c2, otrim = SK ? SK[2] : cls.trim;
    const fx = k => (E && E[k] && W[k] && W[k][E[k]]) ? W[k][E[k]](cls, h) : '';
    return `<svg class="hero-svg" width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${cls.name}">
  <defs><radialGradient id="${id}b" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="${cls.c1}"/><stop offset="1" stop-color="${cls.c2}"/></radialGradient>
  <clipPath id="${id}c"><circle cx="60" cy="60" r="60"/></clipPath></defs>
  <g clip-path="url(#${id}c)">
  <rect width="120" height="120" fill="url(#${id}b)"/>
  ${fx('bg')}${fx('aura')}
  ${G.stars ? `<g fill="#FDE68A" opacity=".85"><path d="M18 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M100 18l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/><path d="M104 60l1.3 3.2 3.2 1.3-3.2 1.3-1.3 3.2-1.3-3.2-3.2-1.3 3.2-1.3z"/></g>` : `<circle cx="22" cy="24" r="3" fill="#fff" opacity=".25"/><circle cx="100" cy="30" r="2" fill="#fff" opacity=".25"/>`}
  ${G.ring ? `<circle cx="60" cy="62" r="46" fill="none" stroke="#FDE68A" stroke-width="3" opacity=".6"/>` : ''}
  ${G.cape ? `<path d="M30 80 Q60 70 90 80 L100 122 L20 122Z" fill="${capeC}" opacity=".95"/><path d="M30 80 Q60 70 90 80" stroke="${capeT}" stroke-width="2" fill="none" opacity=".7"/>` : ''}
  ${hair(h.style, hc, true)}
  <path d="M32 124 Q32 84 60 81 Q88 84 88 124Z" fill="${outfit}"/>
  <path d="M52 82 L60 94 L68 82" fill="none" stroke="${otrim}" stroke-width="3" stroke-linejoin="round"/>
  <rect x="34" y="104" width="52" height="5" fill="${odark}" opacity=".6"/><rect x="56" y="102" width="8" height="9" rx="2" fill="${otrim}"/>
  ${fx('neck')}
  <rect x="54" y="72" width="12" height="11" rx="5" fill="${sk}"/>
  ${hood ? `<path d="M33 58 Q32 22 60 22 Q88 22 87 58 Q88 74 76 80 L44 80 Q32 74 33 58Z" fill="${cls.c2}"/>` : ''}
  <circle cx="60" cy="54" r="22" fill="${sk}"/>
  <circle cx="38.5" cy="56" r="4" fill="${sk}"/><circle cx="81.5" cy="56" r="4" fill="${sk}"/>
  ${hood ? `<path d="M37 52 Q38 30 60 30 Q82 30 83 52 Q74 38 60 38 Q46 38 37 52Z" fill="${cls.c2}"/><path d="M37 52 Q38 30 60 30 Q82 30 83 52" fill="none" stroke="${cls.trim}" stroke-width="2"/>` : hair(h.style, hc, false)}
  ${G.band && !hood ? `<path d="M38 46 Q60 38 82 46" stroke="${cls.trim}" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}
  ${h.g === 'm' ? `<path d="M46 48.5 Q51 46.5 56 48.5 M64 48.5 Q69 46.5 74 48.5" stroke="#1F2937" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>` : ''}
  <ellipse cx="51.5" cy="56" rx="3.4" ry="4.2" fill="#1F2937"/><ellipse cx="68.5" cy="56" rx="3.4" ry="4.2" fill="#1F2937"/>
  <circle cx="52.6" cy="54.4" r="1.3" fill="#fff"/><circle cx="69.6" cy="54.4" r="1.3" fill="#fff"/>
  ${h.g === 'f' ? `<path d="M47 52.5 L45 50.5 M48.5 51.6 L47.6 49.2 M73 52.5 L75 50.5 M71.5 51.6 L72.4 49.2" stroke="#1F2937" stroke-width="1.6" stroke-linecap="round"/>${!hood && h.style !== 3 ? `<g transform="translate(73 36)"><path d="M0 4 L-6 0 L-6 8Z M0 4 L6 0 L6 8Z" fill="#F472B6"/><circle cx="0" cy="4" r="2.2" fill="#DB2777"/></g>` : ''}` : ''}
  <ellipse cx="46" cy="63" rx="3.6" ry="2" fill="#F87171" opacity=".35"/><ellipse cx="74" cy="63" rx="3.6" ry="2" fill="#F87171" opacity=".35"/>
  <path d="M54.5 64 Q60 69 65.5 64" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  ${fx('eyes')}
  ${G.crown ? `<path d="M44 34 L48 22 L54 30 L60 18 L66 30 L72 22 L76 34Z" fill="#FACC15" stroke="#B45309" stroke-width="1.5" stroke-linejoin="round"/><circle cx="60" cy="27" r="2.2" fill="#EF4444"/>` : ''}
  ${fx('hat')}
  ${item(cls.item, cls, lv)}
  ${fx('pet')}
  </g></svg>`;
  };

  /* ---------- สมรรถนะสำคัญของผู้เรียน 5 ประการ (หลักสูตรแกนกลางฯ 2551) = ค่าพลังของฮีโร่ ---------- */
  window.COMPETENCIES = {
    COM: { name: 'การสื่อสาร', full: 'ความสามารถในการสื่อสาร', icon: '🗣️', color: '#0EA5E9', stat: 'CHA', def: 'รับและส่งสาร ใช้ภาษาถ่ายทอดความคิด ความรู้ความเข้าใจ เลือกรับข้อมูลอย่างมีเหตุผล และสื่อสารได้อย่างมีประสิทธิภาพ', desc: 'อธิบายอัลกอริทึม โปรแกรม และแนวคิดการออกแบบให้ผู้อื่นเข้าใจ นำเสนอ ให้และรับข้อมูลป้อนกลับ' },
    THK: { name: 'การคิด', full: 'ความสามารถในการคิด', icon: '🧠', color: '#8B5CF6', stat: 'INT', def: 'คิดวิเคราะห์ คิดสังเคราะห์ คิดสร้างสรรค์ คิดอย่างมีวิจารณญาณ และคิดเป็นระบบ เพื่อตัดสินใจได้อย่างเหมาะสม', desc: 'คิดเชิงคำนวณ คิดวิเคราะห์ คิดสร้างสรรค์ และคิดเชิงออกแบบ' },
    SOL: { name: 'การแก้ปัญหา', full: 'ความสามารถในการแก้ปัญหา', icon: '🧩', color: '#F59E0B', stat: 'STR', def: 'แก้ปัญหาและอุปสรรคบนพื้นฐานของเหตุผล ข้อมูลสารสนเทศ และคุณธรรม ประยุกต์ความรู้มาป้องกันและแก้ไขปัญหา', desc: 'ระบุปัญหา วิเคราะห์สาเหตุ ทดสอบ และปรับปรุงวิธีแก้อย่างเป็นขั้นตอน' },
    LIF: { name: 'การใช้ทักษะชีวิต', full: 'ความสามารถในการใช้ทักษะชีวิต', icon: '🌱', color: '#22C55E', stat: 'VIT', def: 'เรียนรู้ด้วยตนเองอย่างต่อเนื่อง ทำงานร่วมกับผู้อื่น จัดการตนเองและความขัดแย้ง และหลีกเลี่ยงพฤติกรรมไม่พึงประสงค์', desc: 'กำกับการเรียนรู้ของตนเอง ทำงานร่วมกับผู้อื่น รับผิดชอบ และใช้เทคโนโลยีอย่างปลอดภัย' },
    TEC: { name: 'การใช้เทคโนโลยี', full: 'ความสามารถในการใช้เทคโนโลยี', icon: '💻', color: '#2D4FD6', stat: 'TEC', def: 'เลือกและใช้เทคโนโลยีอย่างสร้างสรรค์ ถูกต้อง เหมาะสม และมีคุณธรรม เพื่อการเรียนรู้ การสื่อสาร การทำงาน และการแก้ปัญหา', desc: 'เลือกและใช้เทคโนโลยีได้เหมาะสม ปลอดภัย และสร้างสรรค์ผลงานเพื่อแก้ปัญหา' }
  };
  window.COMP_KEYS = ['COM', 'THK', 'SOL', 'LIF', 'TEC'];
  /* ภาพตัวอย่างตอนยังไม่เลือกอาชีพ */
  window.heroBlank = (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="ยังไม่ได้เลือกอาชีพ"><circle cx="60" cy="60" r="60" fill="#E5E9F5"/><circle cx="60" cy="50" r="20" fill="#C7CEE3"/><path d="M24 112 Q26 78 60 76 Q94 78 96 112Z" fill="#C7CEE3"/><text x="60" y="58" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="sans-serif">?</text></svg>`;
  /* กล่องอธิบายว่าอาชีพนี้พัฒนาสมรรถนะใด เพราะอะไร และได้โบนัสอะไร */
  window.heroExplain = k => {
    const c = HERO_CLASSES[k]; if (!c) return '';
    const A = COMPETENCIES[c.comp], B = COMPETENCIES[c.comp2];
    return `<div class="hx">
      <div class="hx-c" style="--c:${A.color}"><span>${A.icon}</span><div><small>สมรรถนะเด่นของอาชีพ</small><b>${A.full}</b><p>${A.def}</p></div></div>
      <div class="hx-c sub" style="--c:${B.color}"><span>${B.icon}</span><div><small>สมรรถนะรองของอาชีพ</small><b>${B.full}</b></div></div>
      <p class="hx-why"><b>ทำไม?</b> ${c.why}</p>
      <p class="hx-perk">⚡ <b>ทักษะพิเศษ:</b> ${c.perk}</p></div>`;
  };

  window.COMP_LEVELS = [
    { min: 0, name: 'เริ่มต้น', icon: '🥚' },
    { min: 15, name: 'ผ่าน', icon: '🥉' },
    { min: 45, name: 'ดี', icon: '🥈' },
    { min: 90, name: 'ดีเยี่ยม', icon: '🥇' }
  ];
  const COMP_MAX = 120;
  /* คำนวณแต้มสมรรถนะจากการเรียนจริง: อ่าน (2) • กิจกรรม (4) • จบด่าน (5) ในสมรรถนะที่แผนนั้นมุ่งพัฒนา
     + แบบทดสอบ (คิด/แก้ปัญหา) + รันโค้ด (เทคโนโลยี/แก้ปัญหา) + เรียนต่อเนื่อง (ทักษะชีวิต) + เหรียญจากครู
     (ทุกอาชีพคิดแต้มเท่ากัน) */
  window.heroComp = (s, tb) => {
    const pts = { COM: 0, THK: 0, SOL: 0, LIF: 0, TEC: 0 };
    const LC = window.LESSON_COMP || {};
    const add = (lid, n) => ((LC[lid] || {}).c || []).forEach(k => pts[k] += n);
    Object.keys(s.sec || {}).forEach(k => add(+(k.match(/^l(\d+)/) || [])[1], 2));
    Object.keys(s.wid || {}).forEach(k => add(+(k.match(/^l(\d+)/) || [])[1], 4));
    Object.keys(s.done || {}).forEach(k => add(+k.slice(1), 5));
    Object.values(s.quiz || {}).forEach(q => { pts.THK += +q || 0; pts.SOL += +q || 0; });
    const runs = Math.min(40, s.codeRuns || 0); pts.TEC += runs; pts.SOL += Math.round(runs / 2);
    pts.LIF += Math.min(30, (s.streak || 0) * 3) + ((s.badges || []).includes('streak3') ? 5 : 0);
    (tb || s.tb || []).forEach(k => ((window.TEACHER_BADGES || {})[k] || {}).comp && TEACHER_BADGES[k].comp.forEach(c => pts[c] += 15));
    return COMP_KEYS.map(k => { const v = pts[k]; let lv = 0; COMP_LEVELS.forEach((l, i) => { if (v >= l.min) lv = i; });
      const nx = COMP_LEVELS[lv + 1]; return Object.assign({ k, v, lv, lvName: COMP_LEVELS[lv].name, lvIcon: COMP_LEVELS[lv].icon, pct: Math.min(100, Math.round(v / COMP_MAX * 100)), next: nx ? nx.min - v : 0 }, COMPETENCIES[k]); });
  };
  /* กราฟเรดาร์ 5 เหลี่ยม */
  window.compRadar = (list, size = 260) => {
    const c = size / 2, R = size / 2 - 42, n = list.length;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    const ring = f => list.map((_, i) => pt(i, R * f).join(',')).join(' ');
    const val = list.map((x, i) => pt(i, R * Math.max(.06, x.pct / 100)).join(',')).join(' ');
    return `<svg viewBox="-40 -6 ${size + 80} ${size + 12}" class="radar" role="img" aria-label="กราฟสมรรถนะ">
      ${[.25, .5, .75, 1].map(f => `<polygon points="${ring(f)}" fill="${f === 1 ? '#F8FAFF' : 'none'}" stroke="#DCE3F5" stroke-width="1"/>`).join('')}
      ${list.map((_, i) => `<line x1="${c}" y1="${c}" x2="${pt(i, R)[0]}" y2="${pt(i, R)[1]}" stroke="#DCE3F5"/>`).join('')}
      <polygon points="${val}" fill="rgba(45,79,214,.22)" stroke="#2D4FD6" stroke-width="2.5" stroke-linejoin="round"/>
      ${list.map((x, i) => { const p = pt(i, R * Math.max(.06, x.pct / 100)); return `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${x.color}" stroke="#fff" stroke-width="2"/>`; }).join('')}
      ${list.map((x, i) => { const p = pt(i, R + 24); return `<text x="${p[0]}" y="${p[1] - 4}" text-anchor="middle" font-size="18">${x.icon}</text><text x="${p[0]}" y="${p[1] + 13}" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">${x.name}</text>`; }).join('')}
    </svg>`;
  };
  /* ใช้กับระบบเดิม */
  window.heroStats = s => heroComp(s).map(x => ({ k: x.stat, name: x.name, icon: x.icon, v: x.pct, tip: x.full }));

  /* ภารกิจประจำวัน */
  window.DAILY = window.DAILY || [
    { k: 'sec', need: 2, name: 'อ่านเนื้อหาให้จบ 2 หัวข้อ', icon: '📖', xp: 15 },
    { k: 'wid', need: 1, name: 'ทำกิจกรรม Interactive 1 ชิ้น', icon: '🎮', xp: 15 },
    { k: 'code', need: 1, name: 'รันโค้ดไพทอน 1 ครั้ง', icon: '🐍', xp: 15 }
  ];
  window.DAILY_CHEST = 30;

  /* เหรียญจากครู (ครูมอบให้เอง) */
  window.TEACHER_BADGES = {
    t_help: { name: 'มีจิตสาธารณะ', icon: '🤝', desc: 'ช่วยเหลือเพื่อนและส่วนรวม', attr: 'มีจิตสาธารณะ', comp: ['LIF', 'COM'] },
    t_brave: { name: 'นักสื่อสาร', icon: '🙋', desc: 'ตอบคำถาม อธิบาย หรือนำเสนอได้ชัดเจน', attr: 'ใฝ่เรียนรู้', comp: ['COM'] },
    t_idea: { name: 'ไอเดียสร้างสรรค์', icon: '💡', desc: 'มีความคิดสร้างสรรค์ในการออกแบบผลงาน', attr: 'มีความคิดสร้างสรรค์', comp: ['THK'] },
    t_focus: { name: 'ใฝ่เรียนรู้', icon: '📚', desc: 'ตั้งใจเรียนและค้นคว้าเพิ่มเติมด้วยตนเอง', attr: 'ใฝ่เรียนรู้', comp: ['THK', 'LIF'] },
    t_time: { name: 'มีวินัย', icon: '⏰', desc: 'ส่งงานตรงเวลาและปฏิบัติตามข้อตกลง', attr: 'มีวินัย', comp: ['LIF'] },
    t_lead: { name: 'มุ่งมั่นในการทำงาน', icon: '👑', desc: 'ทำงานจนสำเร็จ นำทีมได้ดี', attr: 'มุ่งมั่นในการทำงาน', comp: ['LIF', 'COM'] },
    t_debug: { name: 'นักล่าบั๊ก', icon: '🐞', desc: 'หาและแก้ข้อผิดพลาดของโค้ดได้เอง', attr: 'มุ่งมั่นในการทำงาน', comp: ['SOL', 'TEC'] },
    t_honest: { name: 'ซื่อสัตย์สุจริต', icon: '🛡️', desc: 'ทำงานด้วยตนเอง อ้างอิงแหล่งที่มา เคารพสิทธิ์ผู้อื่น', attr: 'ซื่อสัตย์สุจริต', comp: ['LIF', 'TEC'] },
    t_star: { name: 'ดาวประจำสัปดาห์', icon: '🌟', desc: 'ผลงานโดดเด่นประจำสัปดาห์', attr: 'มุ่งมั่นในการทำงาน', comp: ['THK', 'SOL'] }
  };
})();

/* ---------- อาชีพที่สนใจในอนาคต → ไอเท็มประจำตัวของฮีโร่ ---------- */
window.CAREERS = [
 {re:/นักเขียน|บรรณาธิการ|เล่าเรื่อง|นักแปล|storyteller|writer|editor/i,em:'✍️',t:'นักเขียนและนักเล่าเรื่อง',items:['📖','🖋️']},
 {re:/โปรแกรม|developer|coder|software|ซอฟต์แวร์|ไอที|\bit\b|เว็บ|ไซเบอร์|cyber|\bai\b|ปัญญาประดิษฐ์/i,em:'👩‍💻',t:'นักพัฒนาซอฟต์แวร์',items:['💻','⌨️']},
 {re:/ข้อมูล|data|วิเคราะห์|สถิติ|บัญชี|การเงิน|ธนาคาร|เศรษฐ/i,em:'📊',t:'นักวิเคราะห์ข้อมูล',items:['📈','🧮']},
 {re:/ออกแบบ|กราฟิก|design|ux|ui|สถาปนิก|ศิลป|แฟชั่น/i,em:'🎨',t:'นักออกแบบ',items:['🖌️','📐']},
 {re:/หนัง|ภาพยนตร์|วิดีโอ|ยูทูบ|youtube|tiktok|content|คอนเทนต์|ครีเอเตอร์|ช่างภาพ|นักข่าว|ผู้กำกับ|นักแสดง|ดนตรี|นักร้อง/i,em:'🎬',t:'นักสร้างสรรค์สื่อ',items:['🎥','🎙️']},
 {re:/หมอ|แพทย์|พยาบาล|เภสัช|ทันต|สาธารณสุข|กายภาพ/i,em:'🩺',t:'บุคลากรทางการแพทย์',items:['💊','❤️']},
 {re:/วิศว|engineer|ช่าง|หุ่นยนต์|robot|ไฟฟ้า|เครื่องกล|อิเล็ก/i,em:'⚙️',t:'วิศวกร',items:['🔧','🤖']},
 {re:/ครู|อาจารย์|teacher|ติวเตอร์/i,em:'👩‍🏫',t:'นักการศึกษา',items:['📚','🍎']},
 {re:/ธุรกิจ|ผู้ประกอบการ|ขาย|การตลาด|marketing|ceo|ค้าขาย|เจ้าของร้าน/i,em:'💼',t:'นักธุรกิจ',items:['📈','🤝']},
 {re:/ทนาย|กฎหมาย|ตำรวจ|ทหาร|อัยการ|ผู้พิพากษา|ข้าราชการ/i,em:'⚖️',t:'ผู้รักษากฎและความยุติธรรม',items:['📜','🛡️']},
 {re:/นักวิทย|วิจัย|เคมี|ชีว|ฟิสิกส์|ดาราศาสตร์|อวกาศ/i,em:'🔬',t:'นักวิทยาศาสตร์',items:['🧪','🔭']},
 {re:/เกม|game|esport|อีสปอร์ต|แอนิเมชัน|animation|การ์ตูน|วาด/i,em:'🎮',t:'นักสร้างเกมและแอนิเมชัน',items:['🕹️','✨']},
 {re:/นักบิน|แอร์|โฮสเตส|โรงแรม|ท่องเที่ยว|ไกด์/i,em:'✈️',t:'การบินและการท่องเที่ยว',items:['🧳','🗺️']},
 {re:/เชฟ|อาหาร|ขนม|เบเกอรี่|บาริสต้า|กาแฟ/i,em:'👨‍🍳',t:'เชฟและธุรกิจอาหาร',items:['🍳','🧁']},
 {re:/เกษตร|ฟาร์ม|สัตวแพทย์|สัตว์|ประมง/i,em:'🌾',t:'นักเกษตรและสัตวแพทย์',items:['🌱','🐄']},
 {re:/นักกีฬา|กีฬา|ฟุตบอล|โค้ช|ฟิตเนส|เทรนเนอร์/i,em:'🏅',t:'นักกีฬาและโค้ช',items:['⚽','⏱️']}];
window.CAREER_DEF = { em:'🌟', t:'นักสำรวจอนาคต', items:['🧭','🔭'] };
window.CAREER_GEM = { 'นักพัฒนาซอฟต์แวร์': ['👨‍💻', '👩‍💻', '🧑‍💻'], 'นักวิเคราะห์ข้อมูล': ['👨‍💼', '👩‍💼', '🧑‍💼'], 'นักออกแบบ': ['👨‍🎨', '👩‍🎨', '🧑‍🎨'], 'นักสร้างสรรค์สื่อ': ['👨‍🎤', '👩‍🎤', '🧑‍🎤'], 'บุคลากรทางการแพทย์': ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'], 'วิศวกร': ['👨‍🔧', '👩‍🔧', '🧑‍🔧'], 'นักการศึกษา': ['👨‍🏫', '👩‍🏫', '🧑‍🏫'], 'นักธุรกิจ': ['👨‍💼', '👩‍💼', '🧑‍💼'], 'ผู้รักษากฎและความยุติธรรม': ['👨‍⚖️', '👩‍⚖️', '🧑‍⚖️'], 'นักวิทยาศาสตร์': ['👨‍🔬', '👩‍🔬', '🧑‍🔬'], 'นักสร้างเกมและแอนิเมชัน': ['👨‍💻', '👩‍💻', '🧑‍💻'], 'การบินและการท่องเที่ยว': ['👨‍✈️', '👩‍✈️', '🧑‍✈️'], 'เชฟและธุรกิจอาหาร': ['👨‍🍳', '👩‍🍳', '🧑‍🍳'], 'นักเกษตรและสัตวแพทย์': ['👨‍🌾', '👩‍🌾', '🧑‍🌾'], 'นักกีฬาและโค้ช': ['🏃‍♂️', '🏃‍♀️', '🏃'], 'นักสำรวจอนาคต': ['👨‍🚀', '👩‍🚀', '🧑‍🚀'] };
window.careerOf = (txt, g) => { const c = (txt && CAREERS.find(c => c.re.test(txt))) || CAREER_DEF; const v = CAREER_GEM[c.t]; if (!v) return c; return Object.assign({}, c, { em: v[g === 'm' ? 0 : g === 'f' ? 1 : 2] }); };
window.CAREER_SUGG = window.CAREER_SUGG || ['โปรแกรมเมอร์','นักวิเคราะห์ข้อมูล','นักออกแบบกราฟิก','ยูทูบเบอร์','แพทย์ / พยาบาล','วิศวกร','ครู','ผู้ประกอบการ','ตำรวจ / ทนาย','นักวิทยาศาสตร์','นักสร้างเกม','นักบิน','เชฟ','สัตวแพทย์','นักกีฬา'];
