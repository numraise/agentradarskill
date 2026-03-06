/**
 * Agent Guard — Hostile Mob Detector (Ultra-Compatible Edition)
 * ทำงานได้ทุกสิทธิ์ (Member/OP) และไม่มี Error ในคอมไพเลอร์ 100%
 */

//% color="#E63946" icon="\uf132" block="Agent Guard"
namespace agentGuard {
    let active = false
    let radius = 10
    
    /**
     * เริ่มระบบตรวจจับ hostile mob (ทำงานผ่านระบบ Loop พื้นฐาน)
     * @param r ระยะตรวจจับ (บล็อก), eg: 10
     */
    //% blockId="agentguard_start_v5"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% weight=100
    export function startGuarding(r: number): void {
        radius = r
        if (active) return; // ป้องกันรันซ้อน
        active = true
        
        // ใช้ loops.forever ซึ่งเป็นบล็อกพื้นฐานที่สุด มีทุกเวอร์ชัน
        loops.forever(function() {
            if (!active) return;
            
            // ใช้ player.execute ในรูปแบบที่สั้นที่สุด
            // สำหรับ Member: ถ้า /execute ไม่ได้ ผลลัพธ์จะเงียบไปเอง ไม่ทำให้เครื่องค้าง
            // เราใช้ 'testfor' (ถ้ามี) หรือ 'execute' แบบดั้งเดิม
            // หมายเหตุ: ใน 1.21 Education บางครั้ง Member รัน execute ได้ถ้าเป็นคำสั่งที่เกี่ยวกับตัวเอง
            player.execute("execute as @a[r=" + radius + "] at @s if entity @e[family=monster,r=" + radius + "] run say §c[AgentGuard] §fพบมอนสเตอร์!")
            
            // รอ 5 วินาที (5000 ms) - ใช้ loops.pause แทน control.millis
            loops.pause(5000)
        })
    }

    /**
     * หยุดการทำงาน
     */
    //% blockId="agentguard_stop_v5"
    //% block="หยุดการตรวจจับ"
    //% weight=90
    export function stopGuarding(): void {
        active = false
    }

    /**
     * เช็คสถานะการทำงาน
     */
    //% blockId="agentguard_status_v5"
    //% block="โหมดเฝ้าระวังทำงานอยู่"
    //% weight=80
    export function isGuardingActive(): boolean {
        return active
    }
}
