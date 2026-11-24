/* ไอคอนอุปกรณ์แบบทันสมัย (เส้นจาก Lucide, ISC License) บนแผ่นสีมน • ใช้ได้ทั้งใน HTML และบน canvas */
(function () {
  const X = {
    'memory-stick': '<path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9"/><path d="M16 11V9"/><path d="M12 11V9"/><path d="M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/>',
    speaker: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 6h.01"/><circle cx="12" cy="14" r="4"/><path d="M12 14h.01"/>',
    router: '<rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6.01 18H6"/><path d="M10.01 18H10"/><path d="M15 10v4"/><path d="M17.84 7.17a4 4 0 0 0-5.66 0"/><path d="M20.66 4.34a8 8 0 0 0-11.31 0"/>',
    usb: '<circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12l2 5"/><path d="m10 14 5 2 3.5-3.5"/><path d="m18 12 1-1 1 1-1 1Z"/>',
    projector: '<path d="M5 7 3 5"/><path d="M9 6V3"/><path d="m13 7 2-2"/><circle cx="9" cy="13" r="3"/><path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17"/><path d="M16 16h2"/>'
  };
  if (window.lucide && lucide.i) Object.assign(lucide.i, X);
  const P = n => (window.lucide && lucide.i[n]) || X[n] || '';
  const C = { keyboard: '#16a34a', mic: '#16a34a', camera: '#16a34a', mouse: '#16a34a', cpu: '#2563eb', 'memory-stick': '#7c3aed', 'hard-drive': '#7c3aed', usb: '#7c3aed', monitor: '#ea580c', speaker: '#ea580c', printer: '#ea580c', projector: '#ea580c', laptop: '#0f766e', smartphone: '#0f766e', router: '#0f766e', wifi: '#0f766e', cloud: '#0ea5e9', server: '#0ea5e9' };
  const svg = (n, stroke, w) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${w || 24}" height="${w || 24}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P(n)}</svg>`;
  /* ICO('cpu') → แผ่นสีมนพร้อมไอคอนสีขาว สำหรับวางใน HTML */
  window.ICO = (n, c) => `<span class="ico" style="--ic:${c || C[n] || '#2563eb'}">${svg(n, '#fff', 18)}</span>`;
  /* ICO.img('cpu') → รูปภาพสำหรับวาดบน canvas */
  const cache = {};
  window.ICO.img = (n, c) => {
    const k = n + (c || ''); if (cache[k]) return cache[k];
    const col = c || C[n] || '#2563eb';
    const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96" height="96"><rect x="1" y="1" width="46" height="46" rx="13" fill="${col}"/><rect x="1" y="1" width="46" height="23" rx="13" fill="#fff" opacity=".14"/><g transform="translate(10 10) scale(1.1667)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P(n)}</g></svg>`;
    const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); return cache[k] = im;
  };
})();
