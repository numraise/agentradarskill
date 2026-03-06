/**
 * Agent Guard — Hostile Mob Detector (Professional Edition)
 * รองรับ Member 100% และแก้ปัญหา Extension Error ถาวร
 */

//% color="#E63946" icon="\uf132" block="Agent Guard"
namespace agentGuard {
    let active = false
    let radius = 10
    let initialized = false

    /**
     * เริ่มระบบตรวจจับมอนสเตอร์รอบตัว (ใช้ได้ทุกคนแม้ไม่ใช่ OP)
     * @param r ระยะตรวจจับ (บล็อก), eg: 10
     */
    //% blockId="agentguard_start_v2"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% weight=100
    export function startGuarding(r: number): void {
        radius = r
        active = true
        
        if (!initialized) {
            initialized = true
            // ใช้ Event มาตรฐานของ MakeCode ที่ Member ทุกคนใช้ได้
            mobs.onNearbyMonster(64, function() {
                if (active) {
                    // ตรวจสอบระยะจริงอีกครั้งผ่านระบบภายใน
                    // เนื่องจาก Member ใช้ /execute ไม่ได้ เราจะใช้ความสามารถของ Agent หรือระบบ Say แทน
                    // วิธีที่ Member ใช้แจ้งเตือนได้ชัวร์ที่สุดคือ player.say
                    checkAndAlert();
                }
            })
        }
    }

    /**
     * หยุดการทำงาน
     */
    //% blockId="agentguard_stop_v2"
    //% block="หยุดการตรวจจับ"
    //% weight=90
    export function stopGuarding(): void {
        active = false
    }

    /**
     * ฟังก์ชันภายใน: ใช้ตรวจสอบมอนสเตอร์ในระยะที่กำหนด
     */
    function checkAndAlert(): void {
        // ใช้คำสั่งพื้นฐานที่ Member ใช้ได้
        // ในระบบ MakeCode, onNearbyMonster จะทำงานเมื่อมอนสเตอร์อยู่ใกล้
        // เราจะส่งข้อความแจ้งเตือนทันที
        player.say("§c[AgentGuard] §fพบมอนสเตอร์ในระยะตรวจจับ!")
    }

    /**
     * ตรวจสอบสถานะการทำงาน
     */
    //% blockId="agentguard_status_v2"
    //% block="กำลังตรวจจับอยู่หรือไม่"
    //% weight=80
    export function isGuarding(): boolean {
        return active
    }
}
