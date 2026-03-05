/**
 * Agent Guard — ตรวจจับ hostile mob รอบผู้เล่น แจ้งเตือนผ่านแชท
 * Minecraft Education Edition 1.21.x
 */

//% color="#E63946"
//% block="Agent Guard"
//% weight=100
namespace agentGuard {

    let _r = 10;
    let _on = false;
    let _ran = false;
    let _ms = 5000;

    let MOBS = [
        "zombie", "skeleton", "creeper", "spider", "cave_spider",
        "enderman", "witch", "drowned", "husk", "stray", "phantom",
        "pillager", "vindicator", "ravager", "evoker", "vex",
        "blaze", "ghast", "magma_cube", "slime",
        "elder_guardian", "guardian", "shulker",
        "warden", "bogged", "breeze"
    ];

    /**
     * เริ่มตรวจจับ hostile mob รอบผู้เล่นอัตโนมัติ
     * @param r ระยะตรวจจับ (บล็อก) eg: 10
     */
    //% blockId="agentguard_start"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="การควบคุม"
    //% weight=100
    export function startGuarding(r: number) {
        _r = r;
        _on = true;
        if (!_ran) {
            _ran = true;
            loops.forever(function () {
                if (_on) {
                    detectMobs();
                }
                loops.pause(_ms);
            });
        }
    }

    /**
     * หยุดการตรวจจับชั่วคราว
     */
    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="การควบคุม"
    //% weight=90
    export function stopGuarding() {
        _on = false;
    }

    /**
     * ตรวจสอบทันที 1 ครั้ง
     */
    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="การควบคุม"
    //% weight=80
    export function checkOnce() {
        detectMobs();
    }

    /**
     * ตั้งความถี่ในการตรวจสอบ
     * @param sec ทุกกี่วินาที eg: 5
     */
    //% blockId="agentguard_freq"
    //% block="ตรวจสอบทุก %sec วินาที"
    //% sec.min=1 sec.max=60 sec.defl=5
    //% group="การตั้งค่า"
    //% weight=70
    export function setFrequency(sec: number) {
        _ms = sec * 1000;
    }

    /**
     * เปลี่ยนระยะตรวจจับ
     * @param r ระยะ (บล็อก) eg: 10
     */
    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="การตั้งค่า"
    //% weight=60
    export function setRadius(r: number) {
        _r = r;
    }

    // ฟังก์ชัน internal: สแกน mob ทุกชนิด
    function detectMobs() {
        for (let i = 0; i < MOBS.length; i++) {
            let mob = MOBS[i];
            // ใช้ tell แทน tellraw เพื่อหลีกเลี่ยงปัญหา JSON escaping
            // execute as @a at @s = ทำงานที่ตำแหน่งผู้เล่นแต่ละคน
            // tell @s = ส่งข้อความเฉพาะผู้เล่นที่พบ mob เท่านั้น
            gameplay.executeCommand(
                "execute as @a at @s if entity @e[type=" + mob + ",r=" + _r + "] run tell @s [Agent Guard] พบ " + mob + " ในระยะ " + _r + " บล็อก!"
            );
        }
    }
}
