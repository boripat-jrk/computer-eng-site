/* ส่วนเสริม v5: ไอเท็มเพิ่ม • ตัวละครเต็มตัว 3D หมุนได้ พร้อมท่าทางและเอฟเฟกต์ (CSS ล้วน ไม่ใช้ canvas วนลูป) */
(function () {
  const T = window.T2, W = window.WARDROBE_SVG, WD = window.WARDROBE;
  const ub = (s, k) => (s.badges || []).includes(k), tbn = s => (s.tb || []).length;

  /* ---------- ไอเท็มเพิ่ม ---------- */
  Object.assign(W.hat, {
    catears: c => `<path d="M40 40 L42 20 L54 32Z M80 40 L78 20 L66 32Z" fill="${c.c2}"/><path d="M43 36 L44 25 L51 32Z M77 36 L76 25 L69 32Z" fill="#FBCFE8"/>`,
    hardhat: () => `<path d="M37 44 Q37 22 60 22 Q83 22 83 44Z" fill="#FACC15"/><rect x="33" y="42" width="54" height="5" rx="2.5" fill="#EAB308"/><rect x="57" y="22" width="6" height="21" fill="#FDE047"/>`,
    antenna: () => `<path d="M60 31 L60 14" stroke="#64748B" stroke-width="3"/><circle cx="60" cy="12" r="5" fill="#22D3EE"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle><rect x="50" y="28" width="20" height="6" rx="3" fill="#94A3B8"/>`,
    flame: () => `<path d="M44 40 Q42 24 52 16 Q52 26 58 22 Q58 10 68 6 Q66 18 74 22 Q80 28 76 40Z" fill="#F97316"/><path d="M52 40 Q52 30 58 26 Q60 32 64 30 Q66 36 68 40Z" fill="#FDE047"/>`
  });
  Object.assign(W.eyes, {
    mask: () => `<path d="M40 52 Q50 46 58 52 Q60 54 62 52 Q70 46 80 52 L80 60 Q70 64 62 58 Q60 57 58 58 Q50 64 40 60Z" fill="#DC2626"/><ellipse cx="51.5" cy="56" rx="4.5" ry="3.5" fill="#fff"/><ellipse cx="68.5" cy="56" rx="4.5" ry="3.5" fill="#fff"/><circle cx="51.5" cy="56" r="2.3" fill="#1F2937"/><circle cx="68.5" cy="56" r="2.3" fill="#1F2937"/>`,
    matrix: () => `<g><rect x="42" y="50" width="16" height="11" rx="2" fill="#052e16" stroke="#22C55E" stroke-width="1.5"/><rect x="62" y="50" width="16" height="11" rx="2" fill="#052e16" stroke="#22C55E" stroke-width="1.5"/><path d="M58 55 L62 55" stroke="#22C55E" stroke-width="2"/><text x="44" y="58" font-size="6" fill="#4ADE80" font-family="monospace">101</text><text x="64" y="58" font-size="6" fill="#4ADE80" font-family="monospace">010</text></g>`
  });
  Object.assign(W.neck, {
    tie: () => `<path d="M57 83 L63 83 L61 88 L65 104 L60 109 L55 104 L59 88Z" fill="#1D4ED8"/><path d="M57 83 L63 83 L61 88 L59 88Z" fill="#1E3A8A"/>`,
    chain: () => `<path d="M48 82 Q60 96 72 82" stroke="#FACC15" stroke-width="2" fill="none" stroke-dasharray="2 2"/><path d="M60 92 L64 98 L60 104 L56 98Z" fill="#22D3EE" stroke="#0E7490"/>`
  });
  Object.assign(W.bg, {
    clouds: () => `<g fill="#fff" opacity=".35"><ellipse cx="22" cy="24" rx="16" ry="7"/><ellipse cx="32" cy="20" rx="10" ry="7"/><ellipse cx="96" cy="40" rx="14" ry="6"/></g>`,
    night: () => `<rect width="120" height="120" fill="#020617" opacity=".55"/><circle cx="94" cy="24" r="10" fill="#FEF9C3"/><circle cx="98" cy="21" r="9" fill="#0b1437" opacity=".9"/><g fill="#fff"><circle cx="16" cy="18" r="1.2"/><circle cx="40" cy="10" r="1"/><circle cx="70" cy="30" r="1.2"/><circle cx="10" cy="50" r="1"/><circle cx="108" cy="58" r="1"/></g>`
  });
  W.aura = {
    fire: () => `<g opacity=".7"><path d="M14 120 Q10 92 22 78 Q22 92 30 88 Q28 70 40 60 Q38 80 46 84 Q52 96 48 120Z" fill="#F97316"/><path d="M106 120 Q110 92 98 78 Q98 92 90 88 Q92 70 80 60 Q82 80 74 84 Q68 96 72 120Z" fill="#F97316"/></g>`,
    hearts: () => `<g fill="#F472B6" opacity=".75"><path d="M18 30 q-5 -6 0 -9 q3 -2 5 1 q2 -3 5 -1 q5 3 0 9 l-5 5z"/><path d="M96 70 q-4 -5 0 -7 q2 -2 4 1 q2 -3 4 -1 q4 2 0 7 l-4 4z"/><path d="M100 20 q-3 -4 0 -6 q2 -1 3 1 q1 -2 3 -1 q3 2 0 6 l-3 3z"/></g>`
  };
  Object.assign(W.pet, {
    penguin: () => `<text x="3" y="115" font-size="22">🐧</text>`, fox: () => `<text x="3" y="115" font-size="22">🦊</text>`, unicorn: () => `<text x="3" y="115" font-size="22">🦄</text>`
  });
  const add = (k, list) => WD[k].items.push(...list);
  add('hat', [['catears', 'หูแมว', 2], ['hardhat', 'หมวกนิรภัยวิศวกร', 3], ['antenna', 'เสาอากาศหุ่นยนต์', 4], ['flame', 'ผมไฟ', null, s => ub(s, 'streak3'), 'เข้าเรียนต่อเนื่อง 3 วัน']]);
  add('eyes', [['mask', 'หน้ากากฮีโร่', 4], ['matrix', 'แว่นโค้ดเดอร์', 5]]);
  add('neck', [['tie', 'เนกไทนักธุรกิจ', 3], ['chain', 'สร้อยพลังงาน', 4]]);
  WD.skin.items.splice(1, 0, ['student', 'ชุดนักเรียน', 0]); add('skin', [['pixel', 'ชุดพิกเซล', 3], ['silk', 'ชุดลายผ้าไหม', 4], ['ninja', 'ชุดนินจาไซเบอร์', 5]]);
  add('bg', [['clouds', 'ท้องฟ้าใส', 1], ['night', 'ท้องฟ้ายามค่ำ', 5]]);
  add('aura', [['hearts', 'ออร่าหัวใจ', 3], ['fire', 'ออร่าไฟ', null, s => ub(s, 'streak3'), 'เข้าเรียนต่อเนื่อง 3 วัน']]);
  add('pet', [['penguin', 'เพนกวินลินุกซ์', 3], ['fox', 'จิ้งจอกไฟ', 5], ['unicorn', 'ยูนิคอร์น', null, s => tbn(s) >= 2, 'ได้เหรียญจากครู 2 เหรียญ']]);
  WD.fx = { t: 'เอฟเฟกต์', em: '🌟', stage: true, items: [['none', 'ไม่มี', 0], ['sparkle', 'ประกายวิบวับ', 1], ['leaf', 'ใบไม้ปลิว', 2], ['code', 'ฝนโค้ด', 3], ['snow', 'หิมะโปรย', 4], ['bubble', 'ฟองสบู่', 5], ['meteor', 'ฝนดาวตก', 6]] };
  window.EMOTES = [['wave', '👋', 'โบกมือ', 0], ['jump', '🦘', 'กระโดด', 0], ['dance', '💃', 'เต้น', 2], ['flex', '💪', 'โชว์พลัง', 3], ['cast', '🪄', 'ร่ายพลัง', 4], ['victory', '🏆', 'ท่าแชมป์', 6]];

  /* ---------- ตัวละครเต็มตัว ---------- */
  const P = window.heroParts, O = HERO_OPTS;
  const handItem = (k, c, lv) => { const g = lv >= 4 ? '#FACC15' : '#CBD5E1';
    switch (k) {
      case 'shield': return `<g transform="translate(-4 -12)"><path d="M12 0 L26 5 L26 18 Q26 30 12 36 Q-2 30 -2 18 L-2 5Z" fill="${c.c2}" stroke="${g}" stroke-width="2.5"/><path d="M12 8 L12 28 M4 16 L20 16" stroke="${c.trim}" stroke-width="3" stroke-linecap="round"/></g>`;
      case 'wrench': return `<g transform="rotate(-20)"><rect x="-3" y="-36" width="6" height="40" rx="3" fill="${g}"/><path d="M-9 -38 Q-9 -46 0 -46 Q9 -46 9 -38 L5 -34 L-5 -34Z" fill="${g}"/></g>`;
      case 'orb': return `<g transform="translate(0 -10)"><circle r="12" fill="${c.c1}" opacity=".35"/><circle r="8" fill="${c.trim}"/><circle cx="-3" cy="-3" r="2.5" fill="#fff"/></g>`;
      case 'staff': return `<g><rect x="-2.5" y="-64" width="5" height="96" rx="2.5" fill="#92400E"/><circle cy="-70" r="10" fill="${c.trim}" opacity=".45"/><circle cy="-70" r="6.5" fill="${c.trim}"/><circle cx="-2" cy="-72" r="1.8" fill="#fff"/></g>`;
      case 'hammer': return `<g transform="rotate(-15)"><rect x="-3" y="-40" width="6" height="44" rx="3" fill="#92400E"/><rect x="-13" y="-52" width="26" height="14" rx="3" fill="${g}"/></g>`;
    } return ''; };
  window.heroFull = (h, lv = 0, back = false, layer = null) => {
    h = Object.assign({ cls: 'mage', skin: 0, style: 0, hc: 0 }, h || {});
    const c = HERO_CLASSES[h.cls] || Object.values(HERO_CLASSES)[0], E = h.eq || {}, sk = O.SKINS[h.skin] || O.SKINS[0], hc = O.HAIRS[h.hc] || O.HAIRS[0], hood = h.style === 3;
    const auto = !h.eq, cape = auto ? lv >= 2 : (E.cape === 'cape' || E.cape === 'gold'), gold = E.cape === 'gold';
    const SK = (window.HERO_SKINSETS || {})[E.skin], outfit = SK ? SK[0] : c.outfit, od = SK ? SK[1] : c.c2, ot = SK ? SK[2] : c.trim;
    const fx = k => (E[k] && W[k] && W[k][E[k]]) ? W[k][E[k]](c, h) : '';
    const band = auto ? lv >= 1 && lv < 4 : E.hat === 'band', crown = auto ? lv >= 4 : E.hat === 'crown';
    const capeP = `<path d="M76 90 Q100 84 124 90 L150 246 Q100 258 50 246Z" fill="${gold ? '#CA8A04' : c.c2}"/><path d="M76 90 Q100 84 124 90" stroke="${gold ? '#FEF08A' : c.trim}" stroke-width="3" fill="none"/>`;
    const pattern = E.skin === 'silk' ? `<g stroke="#FACC15" stroke-width="1.5" fill="none" opacity=".8"><path d="M80 120 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6"/><path d="M80 140 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6"/></g>` : E.skin === 'pixel' ? `<g fill="#A5F3FC" opacity=".8"><rect x="84" y="112" width="6" height="6"/><rect x="108" y="124" width="6" height="6"/><rect x="92" y="138" width="6" height="6"/><rect x="112" y="148" width="6" height="6"/></g>` : '';
    const head = back
      ? `<g transform="translate(40 0)">${hood ? `<path d="M33 58 Q32 22 60 22 Q88 22 87 58 Q88 74 76 80 L44 80 Q32 74 33 58Z" fill="${c.c2}"/>` : `${P.hair(h.style, hc, true)}<circle cx="60" cy="54" r="22" fill="${sk}"/><circle cx="38.5" cy="56" r="4" fill="${sk}"/><circle cx="81.5" cy="56" r="4" fill="${sk}"/><path d="M37 60 Q36 28 60 28 Q84 28 83 60 Q72 70 60 70 Q48 70 37 60Z" fill="${hc}"/>`}${band ? `<path d="M38 46 Q60 38 82 46" stroke="${c.trim}" stroke-width="4" fill="none"/>` : ''}${fx('hat')}</g>`
      : `<g transform="translate(40 0)">${P.hair(h.style, hc, true)}
        ${hood ? `<path d="M33 58 Q32 22 60 22 Q88 22 87 58 Q88 74 76 80 L44 80 Q32 74 33 58Z" fill="${c.c2}"/>` : ''}
        <circle cx="60" cy="54" r="22" fill="${sk}"/><circle cx="38.5" cy="56" r="4" fill="${sk}"/><circle cx="81.5" cy="56" r="4" fill="${sk}"/>
        ${hood ? `<path d="M37 52 Q38 30 60 30 Q82 30 83 52 Q74 38 60 38 Q46 38 37 52Z" fill="${c.c2}"/>` : P.hair(h.style, hc, false)}
        ${band && !hood ? `<path d="M38 46 Q60 38 82 46" stroke="${c.trim}" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}
        ${h.g === 'm' ? `<path d="M46 48.5 Q51 46.5 56 48.5 M64 48.5 Q69 46.5 74 48.5" stroke="#1F2937" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>` : ''}
        <g class="hf-eyes"><ellipse cx="51.5" cy="56" rx="3.4" ry="4.2" fill="#1F2937"/><ellipse cx="68.5" cy="56" rx="3.4" ry="4.2" fill="#1F2937"/><circle cx="52.6" cy="54.4" r="1.3" fill="#fff"/><circle cx="69.6" cy="54.4" r="1.3" fill="#fff"/></g>
        ${h.g === 'f' ? `<path d="M47 52.5 L45 50.5 M48.5 51.6 L47.6 49.2 M73 52.5 L75 50.5 M71.5 51.6 L72.4 49.2" stroke="#1F2937" stroke-width="1.6" stroke-linecap="round"/>${!hood ? `<g transform="translate(73 36)"><path d="M0 4 L-6 0 L-6 8Z M0 4 L6 0 L6 8Z" fill="#F472B6"/><circle cx="0" cy="4" r="2.2" fill="#DB2777"/></g>` : ''}` : ''}
        <ellipse cx="46" cy="63" rx="3.6" ry="2" fill="#F87171" opacity=".35"/><ellipse cx="74" cy="63" rx="3.6" ry="2" fill="#F87171" opacity=".35"/>
        <path class="hf-mouth" d="M54.5 64 Q60 69 65.5 64" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        ${fx('eyes')}
        ${crown ? `<path d="M44 34 L48 22 L54 30 L60 18 L66 30 L72 22 L76 34Z" fill="#FACC15" stroke="#B45309" stroke-width="1.5" stroke-linejoin="round"/><circle cx="60" cy="27" r="2.2" fill="#EF4444"/>` : ''}${fx('hat')}</g>`;
    const arm = (side) => { const L = side === 'L', x0 = L ? 78 : 122, xs = L ? -1 : 1;
      return `<g class="hf-arm${side}"><path d="M${x0} 92 L${x0 + xs * 14} 96 L${x0 + xs * 18} 150 L${x0 + xs * 6} 152Z" fill="${outfit}"/><path d="M${x0 + xs * 18} 150 L${x0 + xs * 6} 152" stroke="${ot}" stroke-width="3"/><circle cx="${x0 + xs * 12}" cy="157" r="7" fill="${sk}"/>${!L && !back ? `<g class="hf-item" transform="translate(${x0 + xs * 12} 157)">${handItem(c.item, c, lv)}</g>` : ''}</g>`; };
    const Ly = (n, str) => (!layer || layer === n) ? str : '';
    return `<svg class="hf-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" aria-label="${c.name}">
      ${layer ? '' : `<ellipse class="hf-shadow" cx="100" cy="270" rx="46" ry="8" fill="#000" opacity=".18"/>`}
      <g class="hf-body">
      ${Ly('cape', cape ? capeP : '')}
      ${Ly('legs', `<g class="hf-legL"><rect x="80" y="172" width="18" height="84" rx="7" fill="${od}"/><ellipse cx="88" cy="259" rx="13" ry="7" fill="#1F2937"/></g>
      <g class="hf-legR"><rect x="102" y="172" width="18" height="84" rx="7" fill="${od}"/><ellipse cx="112" cy="259" rx="13" ry="7" fill="#1F2937"/></g>`)}
      ${Ly('armL', arm('L'))}
      ${Ly('torso', `<rect x="94" y="70" width="12" height="18" rx="5" fill="${sk}"/><path d="M76 92 Q100 82 124 92 L128 176 Q100 182 72 176Z" fill="${outfit}"/>${pattern}
      ${back ? '' : `<path d="M90 86 L100 100 L110 86" fill="none" stroke="${ot}" stroke-width="3" stroke-linejoin="round"/>`}
      <rect x="72" y="164" width="56" height="8" fill="${od}" opacity=".75"/>${back ? '' : `<rect x="95" y="162" width="10" height="12" rx="2" fill="${ot}"/>`}
      ${back ? '' : `<g transform="translate(40 0)">${fx('neck')}</g>`}`)}
      ${Ly('armR', arm('R'))}
      ${Ly('head', head)}
      </g></svg>`;
  };

  /* ---------- เวที: หมุนได้ กดคุยได้ ท่าทาง เอฟเฟกต์ ---------- */
  const FXC = { sparkle: ['✦', '✧', '⋆'], leaf: ['🍃', '🍂'], code: ['0', '1', '{', '}', '<', '/>', 'if', '()'], snow: ['❄', '❅', '•'], bubble: ['◯', '○'], meteor: ['☄'] };
  const lines = (s, c) => { const L = LEVELS[T ? T.lv() : 0], nx = LEVELS[(T ? T.lv() : 0) + 1], car = s.career ? careerOf(s.career, (s.hero || {}).g) : null;
    return [`สวัสดี! ฉันคือ${c.name} ${s.nick || ''}`, nx ? `อีก ${nx.xp - T.xp()} XP ฉันจะเป็น “${nx.name}”!` : 'เราอยู่ระดับสูงสุดแล้ว เยี่ยมมาก!', car ? `วันหนึ่งฉันจะเป็น${car.t} ${car.em}` : 'อนาคตอยากเป็นอะไรดีนะ?', 'วันนี้ทำภารกิจประจำวันหรือยัง? 🗡️', `ตอนนี้เราเป็น ${L.icon} ${L.name}`, 'จิ้มที่สัตว์คู่หูดูสิ!']; };
  /* มุมที่สวย: หน้า เฉียง หลัง (ไม่ค้างด้านข้าง 90° ที่ตัวละครบาง) */
  window.HERO_ANGLES = [0, 35, 145, 180, 215, 325];
  window.heroSnap = a => { const k = Math.floor(a / 360) * 360; let best = a, d = 1e9; [-360, 0, 360].forEach(o => HERO_ANGLES.forEach(x => { const v = k + o + x; if (Math.abs(v - a) < d) { d = Math.abs(v - a); best = v; } })); return best; };
  window.heroStep = (a, dir) => { const k = Math.floor(a / 360) * 360, L = [-360, 0, 360].flatMap(o => HERO_ANGLES.map(x => k + o + x)).sort((p, q) => p - q), cur = heroSnap(a); return dir > 0 ? L.find(v => v > cur + 1) : [...L].reverse().find(v => v < cur - 1); };
  window.heroStage = (el, opt = {}) => {
    const mini = !!opt.mini; let ry = 0, emo = null, state = {};
    el.classList.add('hf-stage'); if (mini) el.classList.add('mini');
    el.innerHTML = `<div class="hf-bg"></div><div class="hf-fx"></div><div class="hf-floor"></div><div class="hf-turn"><div class="hf-anim"><div class="hf-face hf-front"></div><div class="hf-face hf-back"></div></div></div><div class="hf-pet" title="สัตว์คู่หู"></div><div class="hf-bub"></div><div class="hf-tag"></div><div class="hf-burst"></div>`;
    const $ = s => el.querySelector(s), turn = $('.hf-turn');
    const set = (h, lv, name) => {
      const key = JSON.stringify([h, lv, name]); if (key === state.key) return; const prevEq = state.h && JSON.stringify(state.h.eq || {}); state = { key, h, lv, name };
      const c = HERO_CLASSES[(h || {}).cls] || Object.values(HERO_CLASSES)[0], E = (h || {}).eq || {};
      const LF = [['cape', -24], ['legs', -4], ['armL', -8], ['torso', 0, 'edge'], ['torso', 5], ['head', 7, 'edge'], ['head', 13], ['armR', 11]];
      const LB = [['legs', 4], ['armL', 2], ['armR', 2], ['torso', 6], ['torso', 1, 'edge'], ['head', 9], ['head', 3, 'edge'], ['cape', 22]];
      const stack = (L, back) => L.map(([n, z, e]) => `<div class="hf-ly ${e ? 'edge' : ''}" style="transform:translateZ(${z}px)">${heroFull(h, lv, back, n)}</div>`).join('');
      $('.hf-front').innerHTML = stack(LF, false); $('.hf-back').innerHTML = stack(LB, true);
      $('.hf-bg').style.background = `radial-gradient(120% 80% at 50% 20%, ${c.c1}, ${c.c2})`;
      $('.hf-bg').innerHTML = E.bg && W.bg[E.bg] ? `<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">${W.bg[E.bg](c, h)}</svg>` : '';
      const auraOn = (!h.eq && lv >= 5) || E.aura && E.aura !== 'none';
      el.classList.toggle('aura', !!auraOn); el.dataset.aura = (h.eq ? E.aura : lv >= 6 ? 'ring' : lv >= 5 ? 'stars' : '') || '';
      const pid = (E.pet || '').startsWith('p_') && window.petSVG ? E.pet.slice(2) : null, pet = !pid && E.pet && W.pet[E.pet] ? (W.pet[E.pet]().match(/>([^<]+)</) || [])[1] : '';
      $('.hf-pet').innerHTML = pid ? petSVG(pid, E.petSt || 1, mini ? 56 : 84) : T.esc(pet || ''); $('.hf-pet').classList.toggle('svgpet', !!pid); $('.hf-pet').style.display = pid || pet ? '' : 'none';
      const f = E.fx && FXC[E.fx]; $('.hf-fx').className = 'hf-fx fx-' + (E.fx || 'none');
      $('.hf-fx').innerHTML = f ? Array.from({ length: mini ? 7 : 12 }, (_, i) => `<i style="left:${(i * 37 + 7) % 96}%;animation-delay:${-(i * 0.73) % 5}s;animation-duration:${4 + (i % 4)}s">${f[i % f.length]}</i>`).join('') : '';
      $('.hf-tag').innerHTML = name ? `<b>Lv.${lv + 1}</b> ${T.esc(name)}` : '';
      if (prevEq && prevEq !== JSON.stringify(E)) emote('equip');
    };
    const emote = name => { clearTimeout(emo); el.classList.remove(...[...el.classList].filter(k => k.startsWith('em-'))); void el.offsetWidth; el.classList.add('em-' + name);
      if (name === 'equip' || name === 'cast' || name === 'victory' || name === 'levelup') { const b = $('.hf-burst'); b.innerHTML = Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg">${name === 'victory' ? ['🎉', '⭐', '✨'][i % 3] : '✦'}</i>`).join(''); }
      emo = setTimeout(() => el.classList.remove('em-' + name), name === 'dance' ? 2000 : 1400); };
    const say = t => { const b = $('.hf-bub'); b.textContent = t; b.classList.add('on'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('on'), 2600); };
    if (!mini) turn.addEventListener('click', () => { const r = ['wave', 'jump'][Math.random() * 2 | 0]; emote(r); const L = lines(T.state, HERO_CLASSES[(state.h || {}).cls] || Object.values(HERO_CLASSES)[0]); say(L[Math.random() * L.length | 0]); });
    $('.hf-pet').addEventListener('click', () => { const p = $('.hf-pet'); p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); if (!mini) say(['ฟี้~ 💤', 'งับ! 🍪', 'ไปเที่ยวกัน!', '♥'][Math.random() * 4 | 0]); });
    /* หยุดอนิเมชันเมื่อเลื่อนพ้นจอ */
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(x => el.classList.toggle('paused', !x.isIntersecting))).observe(el);
    return { set, emote, say, el, face: () => ry = 0 };
  };

  /* ---------- ประกาศ: ทั้งระดับหรือรายห้อง ---------- */
  T && (T.annsAll = () => { const c = T.cfg || {}; if (Array.isArray(c.anns)) return c.anns; const a = c.announce || {}; return a.text ? [{ id: 'legacy', text: a.text, on: !!a.on, level: a.level, at: a.at || 0, rooms: [] }] : []; });
  T && (T.anns = () => { const now = Date.now(), tch = T.isTeacher(), rm = T.viewRoom ? T.viewRoom() : T.state.room;
    return T.annsAll().filter(a => a.on && a.text && (!a.until || now <= a.until) && (tch || !a.rooms || !a.rooms.length || a.rooms.includes(rm))).sort((x, y) => (y.pin ? 1 : 0) - (x.pin ? 1 : 0) || (y.at || 0) - (x.at || 0)); });
  T && (T.annTarget = a => !a.rooms || !a.rooms.length ? 'ทั้งระดับ ' + COURSE.lv : a.rooms.join(', '));

  /* ---------- บันทึกรูปตัวละคร ---------- */
  T && (T.heroPhoto = (h, lv, name) => { const c = HERO_CLASSES[(h || {}).cls] || Object.values(HERO_CLASSES)[0], E = (h || {}).eq || {};
    const svg = heroFull(h, lv).replace('<svg class="hf-svg" viewBox="0 0 200 300"', `<svg viewBox="0 0 200 300" width="600" height="900"><defs><radialGradient id="pbg" cx="50%" cy="20%" r="90%"><stop offset="0" stop-color="${c.c1}"/><stop offset="1" stop-color="${c.c2}"/></radialGradient></defs><rect width="200" height="300" fill="url(#pbg)"/>${E.bg && W.bg[E.bg] ? `<g transform="scale(2.5) translate(-20 0)">${W.bg[E.bg](c, h)}</g>` : ''}${E.pet && W.pet[E.pet] ? `<text x="140" y="272" font-size="34">${(W.pet[E.pet]().match(/>([^<]+)</) || [])[1]}</text>` : ''}<text x="100" y="292" text-anchor="middle" font-size="11" fill="#fff" font-family="Kanit,sans-serif">Lv.${lv + 1} ${T.esc(name || '')} • เทคโนโลยี 2</text><svg viewBox="0 0 200 300"`).replace(/<\/svg>$/, '</svg></svg>');
    const img = new Image(), cv = document.createElement('canvas'); cv.width = 600; cv.height = 900;
    img.onload = () => { cv.getContext('2d').drawImage(img, 0, 0, 600, 900); const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = `ฮีโร่-${name || 'ของฉัน'}.png`; a.click(); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
})();
