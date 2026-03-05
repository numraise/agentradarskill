/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * ROOT CAUSE ของ compile error ที่แท้จริง:
 *   mobs.execute() → parameter 1 = TargetSelector type (ไม่ใช่ string)
 *   ❌ mobs.execute("@e[type=zombie,r=10]", ...)
 *      Error: Argument of type 'string' is not assignable to type 'TargetSelector'
 *
 *   player.execute() → parameter = string type ✅
 *   ✅ player.execute("execute @e[family=monster,r=10] ~ ~ ~ tell @p ...")
 *      รัน Minecraft command โดยตรงในฐานะ player — ไม่มี type mismatch
 *
 * ทำไมใช้ family=monster แทน loop 27 mob types:
 *   family=monster = selector ที่จับ hostile mob ทุกประเภทในครั้งเดียว
 *   ลด execute commands จาก 27 ครั้ง → 1 ครั้ง
 */

//% color=#E63946 weight=100
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
     * Internal: detect all hostile mobs using player.execute()
     *
     * player.execute(command: string) ← parameter type = string ✅
     * ไม่เหมือน mobs.execute() ที่ต้องการ TargetSelector type
     *
     * family=monster = Bedrock/Education Edition selector
     * จับ hostile mob ทุกประเภทในครั้งเดียว
     *
     * Command flow:
     *   player.execute("execute @e[family=monster,r=10] ~ ~ ~ tell @p ...")
     *   → player รัน execute command
     *   → ถ้ามี hostile mob ในระยะ r → mob ส่ง tell ถึง @p (nearest player)
     *   → ถ้าไม่มี mob → ไม่มีอะไรเกิดขึ้น
     */
    function detectMobs(): void {
        player.execute(
            "execute @e[family=monster,r=" + _r + "] ~ ~ ~ tell @p [AgentGuard] " +
            "ตรวจพบ hostile mob ในระยะ " + _r + " บล็อก!"
        )
    }
}
