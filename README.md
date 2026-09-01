# ⚖️ เครื่องชั่งมหัศจรรย์ AR (Magic Scale AR)

สื่อการเรียนรู้คณิตศาสตร์เชิงปฏิสัมพันธ์ (Interactive Math Learning Game) ด้วยเทคโนโลยี **Web AR Hand Tracking** และ **Canvas Physics Simulation**

---

## 🌟 ฟีเจอร์เด่น
1. **ระบบตรวจจับมือ AR (MediaPipe Hands)**: ใช้กล้องหน้าตรวจจับนิ้วชี้และนิ้วโป้ง จีบนิ้ว (Pinch Gesture) เพื่อหยิบผลไม้ชั่งน้ำหนัก
2. **โหมดรองรับเมาส์ & ทัชสกรีน (Simulation Fallback)**: หากไม่มีกล้องหรือปิดกล้อง สามารถใช้เมาส์หรือนิ้วลาก/แตะผลไม้ได้อย่างราบรื่น
3. **ระบบฟิสิกส์คานสมดุล (Spring-Damping Physics)**: เครื่องชั่งเอียงตามผลต่างน้ำหนักของวัตถุทั้งสองฝั่งอย่างสมจริง
4. **ระบบเสียงสังเคราะห์ (Web Audio API)**: มีเสียงเอฟเฟกต์หยิบ, วาง, ตอบถูก (Chime), ตอบผิด (Buzzer) และฉลองจบเกม พร้อมปุ่มเปิด/ปิดเสียง
5. **ระบบตารางอันดับ (Leaderboard & Score System)**: เชื่อมต่อ Google Sheets ผ่าน Google Apps Script Web App และมีระบบสำรองข้อมูลใน LocalStorage เมื่อออฟไลน์

---

## 📁 โครงสร้างโปรเจกต์
- [`index.html`](file:///c:/Users/Admin/Downloads/เกมเครื่องชั่ง%20มหัศจรรย์%20AR/index.html): ตัวเกมทั้งหมดในไฟล์เดียว (HTML5, Tailwind CSS, MediaPipe, Canvas 2D, Web Audio)
- [`Code.gs`](file:///c:/Users/Admin/Downloads/เกมเครื่องชั่ง%20มหัศจรรย์%20AR/Code.gs): โค้ดฝั่ง Backend สำหรับติดตั้งบน **Google Apps Script** เชื่อมกับ Google Sheets

---

## 🚀 วิธีการติดตั้งและรันใช้งาน

### วิธีที่ 1: รันบนเครื่องคอมพิวเตอร์ / เบราว์เซอร์ในเครื่อง (Local)
1. เปิดโฟลเดอร์นี้ด้วย VS Code หรือโปรแกรมเว็บเซิร์ฟเวอร์
2. รันผ่านส่วนขยาย **Live Server** (หรือ `npx serve`)
   > ⚠️ **หมายเหตุสำหรับการใช้กล้อง Web AR**: เบราว์เซอร์จะอนุญาตให้เปิดกล้องได้เมื่อรันผ่าน `http://localhost` หรือ `https://` เท่านั้น

### วิธีที่ 2: ติดตั้งบน Google Sheets + Apps Script (ออนไลน์ 100%)
1. เปิด **Google Sheets** ใหม่ขึ้นมา 1 ไฟล์
2. ตั้งชื่อคอลัมน์ในแถวที่ 1 ของ Sheet1:
   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Timestamp | SessionID | PlayerName | Score | CorrectAnswers | WrongAttempts | HighestLevel | PlayTime |
3. ไปที่เมนู **ส่วนขยาย (Extensions)** -> **Apps Script**
4. ลบโค้ดเดิมใน `Code.gs` แล้วนำโค้ดจากไฟล์ [`Code.gs`](file:///c:/Users/Admin/Downloads/เกมเครื่องชั่ง%20มหัศจรรย์%20AR/Code.gs) ไปวาง
5. กดปุ่ม `+` ข้างหัวข้อไฟล์ เลือก **HTML** ตั้งชื่อไฟล์ว่า `index.html` แล้วนำโค้ดจาก [`index.html`](file:///c:/Users/Admin/Downloads/เกมเครื่องชั่ง%20มหัศจรรย์%20AR/index.html) ไปวาง
6. กดปุ่ม **ทำให้ใช้งานได้ (Deploy)** -> **การจัดการทำให้ใช้งานได้รายการใหม่ (New deployment)**
   - เลือกประเภท: **เว็บแอป (Web app)**
   - ดำเนินการในฐานะ: **ฉัน (Me)**
   - ผู้ที่มีสิทธิ์เข้าถึง: **ทุกคน (Anyone)**
7. กด **ทำให้ใช้งานได้ (Deploy)** และคัดลอกลิงก์ Web App ไปเปิดเล่นหรือแชร์ให้นักเรียนได้ทันที
