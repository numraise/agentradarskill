# Agent Guard — MakeCode Extension
### สำหรับ Minecraft Education Edition 1.21.x

Extension นี้เพิ่มความสามารถให้ **agent ตรวจจับ hostile mob** ในระยะที่กำหนดรอบตัวผู้เล่น แล้วส่งข้อความแจ้งเตือนผ่านแชทอัตโนมัติ

---

## วิธีติดตั้ง Extension เข้า MakeCode

1. **อัปโหลดไฟล์ทั้งหมดขึ้น GitHub** (`pxt.json`, `main.ts`, `README.md`)
   - สร้าง repository ใหม่ใน GitHub (เช่น `my-agent-guard`)
   - อัปโหลดไฟล์ทั้ง 3 ไฟล์เข้าไป

2. **เปิด Minecraft Education → MakeCode Editor**

3. **เพิ่ม Extension:**
   - คลิก **Extensions** (ไอคอนรูปฟันเฟือง หรือเมนู Extensions)
   - วางลิงก์ GitHub ของ repository ลงในช่องค้นหา
     ```
     https://github.com/<username>/<repo-name>
     ```
   - กด Enter แล้วคลิก **Add Extension**

4. หมวด **"Agent Guard"** จะปรากฏใน block palette

---

## บล็อกที่ใช้ได้

### กลุ่ม: การควบคุม

| บล็อก | คำอธิบาย |
|-------|----------|
| `เริ่มตรวจจับ hostile mob ในระยะ [10] บล็อก` | เริ่ม loop ตรวจสอบอัตโนมัติ ปรับระยะได้ 1–64 บล็อก |
| `หยุดการตรวจจับ` | หยุด loop ชั่วคราว (ยังไม่ reset) |
| `ตรวจสอบ hostile mob ทันที` | สแกนหา mob ครั้งเดียว ไม่ต้องเปิด loop |

### กลุ่ม: การตั้งค่า

| บล็อก | คำอธิบาย |
|-------|----------|
| `ตรวจสอบทุก [5] วินาที` | ตั้งความถี่การสแกน (1–60 วินาที) |
| `ตั้งระยะตรวจจับเป็น [10] บล็อก` | เปลี่ยนระยะขณะ loop กำลังทำงานได้ |

### กลุ่ม: สถานะ

| บล็อก | คำอธิบาย |
|-------|----------|
| `โหมดเฝ้าระวังกำลังทำงาน` | คืนค่า true/false (ใช้ใน if-condition ได้) |

---

## ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1 — เริ่มตรวจจับเมื่อพิมพ์ "guard"
```
เมื่อได้รับแชท "guard"
    ตั้งความถี่ตรวจสอบทุก 3 วินาที
    เริ่มตรวจจับ hostile mob ในระยะ 15 บล็อก
```

### ตัวอย่างที่ 2 — เปิด/ปิดด้วยคำสั่งแชท
```
เมื่อได้รับแชท "on"
    เริ่มตรวจจับ hostile mob ในระยะ 10 บล็อก

เมื่อได้รับแชท "off"
    หยุดการตรวจจับ
```

### ตัวอย่างที่ 3 — ตรวจสอบครั้งเดียว
```
เมื่อได้รับแชท "scan"
    ตรวจสอบ hostile mob ทันที
```

---

## Mob ที่ตรวจจับได้ (26 ชนิด)

`zombie` · `skeleton` · `creeper` · `spider` · `cave_spider` · `enderman` · `witch` · `drowned` · `husk` · `stray` · `phantom` · `pillager` · `vindicator` · `ravager` · `evoker` · `vex` · `blaze` · `ghast` · `magma_cube` · `slime` · `elder_guardian` · `guardian` · `shulker` · `warden` · `bogged` · `breeze`

> **หมายเหตุ:** ถ้า mob บางชนิดไม่มีในโลกปัจจุบัน คำสั่งจะข้ามโดยอัตโนมัติ ไม่มี error

---

## วิธีทำงาน (เชิงเทคนิค)

Extension ใช้คำสั่ง Minecraft ต่อไปนี้ทุกครั้งที่สแกน:

```
/execute as @a at @s if entity @e[type=<mob>,r=<radius>] run tellraw @s {"rawtext":[{"text":"..."}]}
```

- `as @a at @s` → ทำงานที่ตำแหน่งของผู้เล่น**ทุกคน** ในเกม
- `if entity @e[type=...,r=...]` → ตรวจว่ามี mob ในรัศมีของผู้เล่นคนนั้น
- `tellraw @s` → ส่งข้อความหา**เฉพาะผู้เล่นที่พบ mob** ไม่รบกวนคนอื่น

---

## ความต้องการระบบ

- Minecraft Education Edition **1.21.132** หรือใหม่กว่า
- MakeCode for Minecraft Education

---

## License

MIT
