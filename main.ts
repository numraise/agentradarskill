/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * ใช้ OLD execute syntax ของ Bedrock/Education Edition:
 *   execute <entity> <x y z> <command>
 * ไม่ใช่ new syntax (as/at/if/run) ที่ Education Edition ไม่รองรับ
 */

//% color="#E63946"
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
     * OLD Bedrock execute syntax:
     *   execute <selector> <x> <y> <z> <command>
     *
     * วิธีทำงาน:
     *   execute @e[type=zombie,r=10] ~ ~ ~ tell @p Found zombie!
     *   = "สำหรับ zombie แต่ละตัวในระยะ 10 บล็อก
     *      ให้ส่งข้อความ tell ไปหา player ที่ใกล้ที่สุด"
     *   ถ้าไม่มี zombie ในระยะ = ไม่มีอะไรเกิดขึ้น
     */
    function detectMobs(): void {
        let mobs = [
            "zombie", "skeleton", "creeper", "spider", "cave_spider",
            "enderman", "witch", "drowned", "husk", "stray",
            "phantom", "pillager", "vindicator", "ravager",
            "evoker", "vex", "blaze", "ghast", "magma_cube",
            "slime", "elder_guardian", "guardian", "shulker",
            "warden", "bogged", "breeze"
        ]
        for (let i = 0; i < mobs.length; i++) {
            player.execute(
                `execute @e[type=${mobs[i]},r=${_r}] ~ ~ ~ say Agent Guard - Found ${mobs[i]} within ${_r} blocks`
            )
        }
    }
}
