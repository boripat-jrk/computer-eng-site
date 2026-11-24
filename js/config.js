/* เว็บ ม.4 Code Quest ใช้โปรเจกต์ Firebase ของตัวเอง (computer-eng-kw) แยกจากเว็บ ม.2 และ ม.6
   ค่านี้เปิดเผยได้ตามปกติของ Firebase Web ความปลอดภัยควบคุมด้วย Firestore Rules */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDcYyj8BXLKLjKJOAlgzmmJ7HEkoK3uKHU',
  authDomain: 'computer-eng-kw.firebaseapp.com',
  projectId: 'computer-eng-kw',
  storageBucket: 'computer-eng-kw.firebasestorage.app',
  messagingSenderId: '376427093415',
  appId: '1:376427093415:web:6e9e7d762ce4c5e8aeea82'
};
/* อีเมลครูที่เข้าแดชบอร์ดได้ */
window.TEACHER_EMAILS = ['kruboripat.jrk@gmail.com', 'boripat@kw.ac.th'];
/* ห้องเรียนที่ให้นักเรียนเลือก (นักเรียนกลุ่มเตรียมวิศวกรรมคอมพิวเตอร์มาจากหลายห้อง) */
window.ROOMS = ['ม.4/1', 'ม.4/2', 'ม.4/3', 'ม.4/4', 'ม.4/5', 'ม.4/6', 'ม.4/7', 'ม.4/8', 'ม.4/9', 'ม.4/10', 'ม.4/11', 'ม.4/12', 'ม.4/13'];
/* โปรเจกต์ Firebase ของ ม.4 แยกเป็นของตัวเอง จึงไม่ต้องใช้คำนำหน้าชุดข้อมูล */
window.DB_NS = '';
