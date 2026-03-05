/**
 * Agent Guard — Hostile Mob Detector
 * สำหรับ Minecraft Education Edition 1.21.x (New Execute Syntax)
 */

/**
 * บล็อกสำหรับตรวจจับ Hostile Mobs รอบตัวผู้เล่น
 */
//% color="#E63946" icon="\uf132" weight=100 block="Agent Guard"
namespace agentGuard {

    let _r = 10
    let _on = false
    let _ran = false
    let _ms = 5000

    /**
     * เริ่มตรวจจับ hostile mob ในรัศมีรอบตัวผู้เล่น
     * @param r รัศมีเป็นบล็อก (1-64), eg: 10
     */
    //% blockId="agentguard_start"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Control"
    //% weight=100
    export function startGuarding(r: number): void {
        _r = r
        _on = true
        if (!_ran) {
            _ran = true
            loops.forever(function () {
                if (_on) {
                    detectMobs()
                }
                loops.pause(_ms)
            })
        }
    }

    /**
     * หยุดการทำงานของโหมดเฝ้าระวัง
     */
    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="Control"
    //% weight=90
    export function stopGuarding(): void {
        _on = false
    }

    /**
     * สแกนหา hostile mob ทันที 1 ครั้ง
     */
    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce(): void {
        detectMobs()
    }

    /**
     * ตั้งค่าความถี่ในการตรวจสอบ (วินาที)
     * @param sec ช่วงเวลา (1-60 วินาที), eg: 5
     */
    //% blockId="agentguard_freq"
    //% block="ตรวจสอบทุก %sec วินาที"
    //% sec.min=1 sec.max=60 sec.defl=5
    //% group="Settings"
    //% weight=70
    export function setFrequency(sec: number): void {
        _ms = sec * 1000
    }

    /**
     * เปลี่ยนระยะการตรวจจับขณะทำงาน
     * @param r รัศมีเป็นบล็อก (1-64), eg: 10
     */
    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับเป็น %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Settings"
    //% weight=60
    export function setRadius(r: number): void {
        _r = r
    }

    /**
     * เช็คว่าโหมดเฝ้าระวังกำลังทำงานอยู่หรือไม่
     */
    //% blockId="agentguard_is_active"
    //% block="โหมดเฝ้าระวังกำลังทำงาน"
    //% group="Status"
    //% weight=50
    export function isGuardingActive(): boolean {
        return _on
    }

    /**
     * คำสั่ง Execute ภายในสำหรับตรวจจับ mob (1.21 Syntax)
     */
    function detectMobs(): void {
        player.execute(
            "execute if entity @e[family=monster,r=" + _r + "] run tellraw @s {\"rawtext\":[{\"text\":\"§c[AgentGuard] §fตรวจพบ hostile mob ในระยะ " + _r + " บล็อก!\"}]}"
        )
    }
}
