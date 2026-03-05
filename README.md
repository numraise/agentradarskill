# Agent Guard — MakeCode Extension
### สำหรับ Minecraft Education Edition 1.21.x

Extension นี้เพิ่มความสามารถให้ **Agent ตรวจจับ hostile mob** ในระยะที่กำหนดรอบตัวผู้เล่น แล้วส่งข้อความแจ้งเตือนผ่านแชทอัตโนมัติ โดยใช้ระบบ Execute Syntax ใหม่ของ Minecraft 1.21

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

4. หมวด **"Agent Guard"** (ไอคอนรูปโล่) จะปรากฏใน block palette

---

## บล็อกที่ใช้ได้

### กลุ่ม: Control (การควบคุม)

| บล็อก | คำอธิบาย |
|-------|----------|
| `เริ่มตรวจจับ hostile mob ในระยะ [10] บล็อก` | เริ่ม loop ตรวจสอบอัตโนมัติ ปรับระยะได้ 1–64 บล็อก |
| `หยุดการตรวจจับ` | หยุดการทำงานของ loop |
| `ตรวจสอบ hostile mob ทันที` | สแกนหา mob ครั้งเดียว ไม่ต้องเปิด loop |

### กลุ่ม: Settings (การตั้งค่า)

| บล็อก | คำอธิบาย |
|-------|----------|
| `ตรวจสอบทุก [5] วินาที` | ตั้งความถี่การสแกน (1–60 วินาที) |
| `ตั้งระยะตรวจจับเป็น [10] บล็อก` | เปลี่ยนระยะตรวจจับ (ปรับเปลี่ยนได้ตลอดเวลา) |

### กลุ่ม: Status (สถานะ)

| บล็อก | คำอธิบาย |
|-------|----------|
| `โหมดเฝ้าระวังกำลังทำงาน` | คืนค่า true/false (ใช้ในเงื่อนไข if ได้) |

---

## ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1 — เริ่มตรวจจับเมื่อพิมพ์ "guard"
```typescript
player.onChat("guard", function () {
    agentGuard.setFrequency(3)
    agentGuard.startGuarding(15)
})
```

### ตัวอย่างที่ 2 — เปิด/ปิดด้วยคำสั่งแชท
```typescript
player.onChat("on", function () {
    agentGuard.startGuarding(10)
})

player.onChat("off", function () {
    agentGuard.stopGuarding()
})
```

---

## วิธีทำงาน (เชิงเทคนิค)

Extension นี้ได้รับการอัปเดตให้รองรับ **Minecraft 1.21.132+** โดยใช้คำสั่ง:

```mcfunction
/execute if entity @e[family=monster,r=<radius>] run tellraw @s {"rawtext":[{"text":"§c[AgentGuard] §fตรวจพบ hostile mob ในระยะ <radius> บล็อก!"}]}
```

- **Efficiency:** ใช้ `family=monster` เพื่อตรวจจับ mob ฝ่ายศัตรูทั้งหมด (Zombies, Skeletons, Creepers, ฯลฯ) ในคำสั่งเดียว
- **New Syntax:** ใช้ `execute if entity` และ `run` ตามมาตรฐานใหม่ของ Minecraft
- **Formatting:** ใช้ `tellraw` พร้อมรหัสสี (§c สีแดง) เพื่อให้ข้อความอ่านง่ายขึ้น

---

## ความต้องการระบบ

- Minecraft Education Edition **1.21.x**
- MakeCode for Minecraft Education

---

## License

MIT
