/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * ROOT CAUSE ของ compile error:
 *   ใน Minecraft 1.21.x ต้องใช้ "New Execute Syntax"
 *   ❌ execute @e[family=monster,r=10] ~ ~ ~ tell @p ... (Old Syntax)
 *   ✅ execute if entity @e[family=monster,r=10] run tellraw @s ... (New Syntax)
 *
 * family=monster: selector ที่ครอบคลุม hostile mob ทั้งหมดใน Bedrock/Education
 */

//% color=#E63946 weight=100 icon="\uf132"
namespace agentGuard {

    let _r = 10
    let _on = false
    let _ran = false
    let _ms = 5000

    /**
     * Start guard mode - continuously detect hostile mobs
     * @param r detection radius in blocks, eg: 10
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
     * Stop guard mode
     */
    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="Control"
    //% weight=90
    export function stopGuarding(): void {
        _on = false
    }

    /**
     * Check for hostile mobs once
     */
    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce(): void {
        detectMobs()
    }

    /**
     * Set check frequency
     * @param sec interval in seconds, eg: 5
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
     * Set detection radius
     * @param r radius in blocks, eg: 10
     */
    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Settings"
    //% weight=60
    export function setRadius(r: number): void {
        _r = r
    }

    /**
     * Is guard mode active?
     */
    //% blockId="agentguard_is_active"
    //% block="โหมดเฝ้าระวังกำลังทำงาน"
    //% group="Status"
    //% weight=50
    export function isGuardingActive(): boolean {
        return _on
    }

    /**
     * Internal: detect all hostile mobs using player.execute()
     * Uses New Execute Syntax for Minecraft 1.21.x
     */
    function detectMobs(): void {
        // execute if entity: ตรวจสอบว่ามีตัวใดตัวหนึ่งเข้าเงื่อนไข
        // run tellraw: ส่งข้อความสี (§c = แดง, §f = ขาว) ไปยังผู้เล่น (@s)
        player.execute(
            "execute if entity @e[family=monster,r=" + _r + "] run tellraw @s {\"rawtext\":[{\"text\":\"§c[AgentGuard] §fตรวจพบ hostile mob ในระยะ " + _r + " บล็อก!\"}]}"
        )
    }
}
