/**
 * Agent Guard Extension สำหรับ Minecraft Education Edition 1.21.x
 * ======================================================================
 * ฟังก์ชัน:
 *   - ตรวจจับ hostile mob ในระยะที่กำหนดรอบตัวผู้เล่นแต่ละคน
 *   - ส่งข้อความแจ้งเตือนผ่านแชทไปยังผู้เล่นที่พบ mob
 *   - รองรับการเปิด/ปิด และปรับระยะ+ความถี่ได้ขณะ runtime
 * ======================================================================
 */

//% color="#E63946"
//% icon="\uf06a"
//% block="Agent Guard"
//% weight=100
namespace agentGuard {

    // ---- ตัวแปร internal ----
    let _radius: number = 10;
    let _intervalMs: number = 5000;
    let _isActive: boolean = false;
    let _loopStarted: boolean = false;

    // รายชื่อ hostile mob ทั้งหมดใน Minecraft Education 1.21
    // (หาก mob ไม่มีในโลก คำสั่งจะ fail เงียบๆ ไม่ error)
    let HOSTILE_MOBS: string[] = [
        "zombie",
        "skeleton",
        "creeper",
        "spider",
        "cave_spider",
        "enderman",
        "witch",
        "drowned",
        "husk",
        "stray",
        "phantom",
        "pillager",
        "vindicator",
        "ravager",
        "evoker",
        "vex",
        "blaze",
        "ghast",
        "magma_cube",
        "slime",
        "elder_guardian",
        "guardian",
        "shulker",
        "warden",
        "bogged",
        "breeze"
    ];

    // ================================================================
    //  กลุ่ม: การควบคุม
    // ================================================================

    /**
     * เริ่มโหมดเฝ้าระวัง — ตรวจจับ hostile mob รอบผู้เล่นอัตโนมัติ
     * @param radius ระยะตรวจจับ (บล็อก) eg: 10
     */
    //% blockId="agentguard_start"
    //% block="เริ่มตรวจจับ hostile mob ในระยะ %radius บล็อก"
    //% radius.min=1 radius.max=64 radius.defl=10
    //% group="การควบคุม"
    //% weight=100
    export function startGuarding(radius: number): void {
        _radius = radius;
        _isActive = true;

        // สร้าง loop เพียงครั้งเดียวเพื่อป้องกัน loop ซ้ำซ้อน
        if (!_loopStarted) {
            _loopStarted = true;
            loops.forever(function () {
                if (_isActive) {
                    _scanAllMobs();
                }
                loops.pause(_intervalMs);
            });
        }
    }

    /**
     * หยุดการตรวจจับ (หยุดชั่วคราว ไม่ต้อง reload)
     */
    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="การควบคุม"
    //% weight=90
    export function stopGuarding(): void {
        _isActive = false;
    }

    /**
     * ตรวจสอบ hostile mob ทันที 1 ครั้ง (ไม่ต้องเปิด loop)
     */
    //% blockId="agentguard_checkOnce"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="การควบคุม"
    //% weight=80
    export function checkOnce(): void {
        _scanAllMobs();
    }

    // ================================================================
    //  กลุ่ม: การตั้งค่า
    // ================================================================

    /**
     * กำหนดความถี่การตรวจสอบ
     * @param seconds ทุกกี่วินาที eg: 5
     */
    //% blockId="agentguard_setInterval"
    //% block="ตรวจสอบทุก %seconds วินาที"
    //% seconds.min=1 seconds.max=60 seconds.defl=5
    //% group="การตั้งค่า"
    //% weight=70
    export function setCheckInterval(seconds: number): void {
        _intervalMs = seconds * 1000;
    }

    /**
     * เปลี่ยนระยะตรวจจับขณะ loop กำลังทำงานได้
     * @param radius ระยะ (บล็อก) eg: 10
     */
    //% blockId="agentguard_setRadius"
    //% block="ตั้งระยะตรวจจับเป็น %radius บล็อก"
    //% radius.min=1 radius.max=64 radius.defl=10
    //% group="การตั้งค่า"
    //% weight=60
    export function setRadius(radius: number): void {
        _radius = radius;
    }

    // ================================================================
    //  กลุ่ม: สถานะ
    // ================================================================

    /**
     * คืนค่า true ถ้าโหมดเฝ้าระวังกำลังทำงานอยู่
     */
    //% blockId="agentguard_isActive"
    //% block="โหมดเฝ้าระวังกำลังทำงาน"
    //% group="สถานะ"
    //% weight=50
    export function isActive(): boolean {
        return _isActive;
    }

    // ================================================================
    //  ฟังก์ชัน internal
    // ================================================================

    /**
     * วนสแกน hostile mob ทุกประเภท
     *
     * หลักการ:
     *   /execute as @a at @s
     *     -> ทำงาน "ในฐานะ" ผู้เล่นแต่ละคน "ที่ตำแหน่ง" ของเขา
     *   if entity @e[type=<mob>,r=<radius>]
     *     -> ถ้าพบ mob ชนิดนั้นในรัศมี (วัดจากตำแหน่งผู้เล่น)
     *   run tellraw @s {...}
     *     -> ส่งข้อความหาผู้เล่นคนนั้น (@s) เท่านั้น
     */
    function _scanAllMobs(): void {
        for (let i = 0; i < HOSTILE_MOBS.length; i++) {
            const mob: string = HOSTILE_MOBS[i];

            // สร้าง JSON message สำหรับ tellraw
            // รูปแบบ: {"rawtext":[{"text":"ข้อความ"}]}
            const jsonMsg: string =
                "{\"rawtext\":[{\"text\":\"" +
                "!! [Agent Guard] " +
                "พบ " + mob + " " +
                "ในระยะ " + _radius + " บล็อก! " +
                "ระวังด้วย!" +
                "\"}]}";

            // รวม command เต็ม
            const cmd: string =
                "/execute as @a at @s " +
                "if entity @e[type=" + mob + ",r=" + _radius + "] " +
                "run tellraw @s " + jsonMsg;

            gameplay.executeCommand(cmd);
        }
    }
}
