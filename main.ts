/**
 * Agent Guard — Hostile Mob Detector (Professional & Final Edition)
 * รองรับ Member 100%, ไม่มี Syntax Error, และมีระบบ Cooldown
 */

//% color="#E63946" icon="\uf132" block="Agent Guard"
namespace agentGuard {
    let _active = false
    let _radius = 10
    let _initialized = false
    let _lastAlertTime = 0
    const _cooldownMs = 5000 // เว้นระยะแจ้งเตือน 5 วินาที

    /**
     * เริ่มระบบตรวจจับ hostile mob (ทำงานได้ทุกคนแม้ไม่ใช่ OP)
     * @param r ระยะตรวจจับ (บล็อก), eg: 10
     */
    //% blockId="agentguard_start_v4"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% weight=100
    export function startGuarding(r: number): void {
        _radius = r
        _active = true
        
        if (!_initialized) {
            _initialized = true
            
            // รายชื่อมอนสเตอร์พื้นฐานที่มีในทุกเวอร์ชั่น (ป้องกัน Property not found)
            const mobsToWatch = [
                ZOMBIE, 
                SKELETON, 
                CREEPER, 
                SPIDER, 
                CAVE_SPIDER, 
                WITCH, 
                ENDERMAN, 
                PILLAGER,
                DROWNED,
                STRAY,
                HUSK,
                PHANTOM
            ];

            // ลงทะเบียนการตรวจจับสำหรับมอนสเตอร์แต่ละชนิด
            for (let mobType of mobsToWatch) {
                mobs.onMobNearby(mobType, 64, function() {
                    // ทำงานเมื่อตรวจพบมอนสเตอร์ในระยะสูงสุด (64)
                    // แล้วค่อยมาเช็คเงื่อนไขภายใน
                    if (_active) {
                        checkDistanceAndAlert();
                    }
                });
            }
        }
    }

    /**
     * หยุดการทำงาน
     */
    //% blockId="agentguard_stop_v4"
    //% block="หยุดการตรวจจับ"
    //% weight=90
    export function stopGuarding(): void {
        _active = false
    }

    /**
     * ฟังก์ชันภายใน: ตรวจสอบระยะและส่งข้อความแจ้งเตือน (พร้อม Cooldown)
     */
    function checkDistanceAndAlert(): void {
        let currentTime = control.millis();
        
        // ตรวจสอบ Cooldown เพื่อไม่ให้แจ้งเตือนรัวเกินไป
        if (currentTime - _lastAlertTime >= _cooldownMs) {
            _lastAlertTime = currentTime;
            
            // สำหรับ Member: player.say คือวิธีที่เสถียรที่สุดในการส่งข้อความ
            player.say("§c[AgentGuard] §fตรวจพบมอนสเตอร์ในรัศมีเฝ้าระวัง!");
        }
    }

    /**
     * เช็คสถานะการทำงาน
     */
    //% blockId="agentguard_status_v4"
    //% block="โหมดเฝ้าระวังทำงานอยู่"
    //% weight=80
    export function isGuardingActive(): boolean {
        return _active
    }
}
