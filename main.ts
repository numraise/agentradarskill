/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * การแก้ไข Bug ทั้งหมด:
 *   BUG 1: //% color="#E63946" ใส่ quotes → blocks ไม่แสดง
 *          FIX: //% color=#E63946 (ไม่มี quotes)
 *
 *   BUG 2: player.execute() และ gameplay.runCommand() ไม่ใช่ API ที่ถูกต้อง
 *          FIX: ใช้ mobs.execute(target, position, command)
 *          → Official MakeCode API: minecraft.makecode.com/reference/mobs/execute
 *
 *   BUG 3: Template literals อาจเป็นปัญหาใน PXT บางเวอร์ชัน
 *          FIX: ใช้ string concatenation แทน
 *
 * mobs.execute() ทำงานอย่างไร:
 *   mobs.execute("@e[type=zombie,r=10]", pos(0,0,0), "tell @p found!")
 *   = execute @e[type=zombie,r=10] ~ ~ ~ tell @p found!
 *   ถ้ามี zombie ในระยะ r บล็อก → ส่ง tell ถึง player ที่ใกล้ที่สุด
 *   ถ้าไม่มี → ไม่มีอะไรเกิดขึ้น
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
            loops.forever(() => {
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
     * Internal: detect hostile mobs using mobs.execute()
     *
     * mobs.execute(target, position, command):
     *   - target: entity selector string "@e[type=zombie,r=10]"
     *   - position: pos(0,0,0) = relative ~ ~ ~ from entity
     *   - command: "tell @p message" = tell nearest player
     *
     * Official API: https://minecraft.makecode.com/reference/mobs/execute
     * Using string concatenation (not template literals) for max compatibility
     */
    function detectMobs(): void {
        let mobList = [
            "zombie", "skeleton", "creeper", "spider", "cave_spider",
            "enderman", "witch", "drowned", "husk", "stray",
            "phantom", "pillager", "vindicator", "ravager",
            "evoker", "vex", "blaze", "ghast", "magma_cube",
            "slime", "elder_guardian", "guardian", "shulker",
            "warden", "bogged", "breeze"
        ]
        for (let i = 0; i < mobList.length; i++) {
            mobs.execute(
                "@e[type=" + mobList[i] + ",r=" + _r + "]",
                pos(0, 0, 0),
                "tell @p [AgentGuard] " + mobList[i] + " (" + _r + " blocks!)"
            )
        }
    }
}
