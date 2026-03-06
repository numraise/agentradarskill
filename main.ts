/**
 * Agent Guard — Hostile Mob Detector (Professional Edition)
 * FIXED: Member Support + No Compilation Error + No Syntax Error
 */

//% color="#E63946" icon="\uf132" block="Agent Guard"
namespace agentGuard {
    let _active = false
    let _radius = 10
    let _initialized = false

    /**
     * เริ่มตรวจจับ hostile mob (ทำงานได้ทุกคนแม้ไม่ใช่ OP)
     * @param r ระยะตรวจจับ (บล็อก), eg: 10
     */
    //% blockId="agentguard_start_final"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% weight=100
    export function startGuarding(r: number): void {
        _radius = r
        _active = true
        
        // ถ้าเคยเปิดระบบแล้ว ไม่ต้องลงทะเบียนซ้ำ
        if (_initialized) return;
        _initialized = true

        // ใช้ loops.forever: วิธีที่ Member ใช้งานได้เสถียรที่สุด 100%
        loops.forever(function () {
            if (_active) {
                // ใช้การเช็คระยะผ่านระบบภายในของ MakeCode (Member ใช้ได้)
                // ไม่ใช้ /execute เพื่อหลีกเลี่ยงสิทธิ์ OP
                const nearby = mobs.entitiesNearby(MONSTER, _radius)
                if (nearby.length > 0) {
                    // แจ้งเตือนผ่าน player.say (Member ใช้ได้ชัวร์)
                    player.say("§c[AgentGuard] §fพบมอนสเตอร์ในระยะ " + _radius + " บล็อก!")
                }
            }
            // ตรวจสอบทุก 5 วินาที เพื่อไม่ให้แชทรัวเกินไป
            loops.pause(5000)
        })
    }

    /**
     * หยุดการทำงาน
     */
    //% blockId="agentguard_stop_final"
    //% block="หยุดการตรวจจับ"
    //% weight=90
    export function stopGuarding(): void {
        _active = false
    }

    /**
     * ตรวจสอบทันที 1 ครั้ง (ใช้ได้ทั้ง Member และ Operator)
     */
    //% blockId="agentguard_check_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% weight=80
    export function checkOnce(): void {
        const nearby = mobs.entitiesNearby(MONSTER, _radius)
        if (nearby.length > 0) {
            player.say("§c[AgentGuard] §fพบมอนสเตอร์ในระยะ " + _radius + " บล็อก!")
        } else {
            player.say("§a[AgentGuard] §fพื้นที่รอบตัวปลอดภัย")
        }
    }
}
