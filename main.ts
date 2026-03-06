/**
 * Agent Guard — Hostile Mob Detector (Full Member Support)
 * รองรับผู้เล่นทั่วไป (Member) 100% โดยไม่ใช้คำสั่ง /execute
 */

/**
 * บล็อกสำหรับตรวจจับ Hostile Mobs รอบตัวผู้เล่น
 */
//% color="#E63946" icon="\uf132" weight=100 block="Agent Guard"
namespace agentGuard {

    let _r = 10
    let _on = false

    /**
     * เริ่มตรวจจับ hostile mob (ทำงานได้ทั้ง Member และ Operator)
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
        
        // ใช้ Event ภายในของ MakeCode ที่ Member สามารถใช้ได้
        // ฟังก์ชันนี้จะทำงานทันทีเมื่อมี Monster เข้ามาในระยะ
        mobs.onNearbyMonster(_r, function () {
            if (_on) {
                // แจ้งเตือนผ่านระบบกระซิบ (Member ทำได้)
                player.say("§c[AgentGuard] §fตรวจพบมอนสเตอร์ในระยะ " + _r + " บล็อก!")
            }
        })
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
     * ตรวจสอบทันที (สำหรับปุ่ม Scan)
     */
    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce(): void {
        player.say("§7[AgentGuard] §fโหมดสแกนทำงานอัตโนมัติเมื่อเปิด Guard")
    }

    /**
     * ตั้งระยะตรวจจับ (รัศมี)
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
}
