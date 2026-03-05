/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * FIX: ใช้ gameplay.runCommand() แทน player.execute()
 *   player.execute() ไม่ใช่ฟังก์ชันที่มีอยู่จริงใน MakeCode Minecraft API
 *   ทำให้เกิด TypeScript compile error → blocks ไม่แสดงใน toolbox
 *
 * คำสั่ง execute ที่ใช้:
 *   execute @e[type=zombie,r=10] ~ ~ ~ tell @p [AgentGuard] พบ zombie!
 *   = ถ้ามี zombie อยู่ในระยะ r บล็อกรอบ @e (entity ใดก็ได้)
 *     → ส่ง tell ถึง player ที่ใกล้ที่สุด
 *   ถ้าไม่มี mob ในระยะ = ไม่มีอะไรเกิดขึ้น
 *
 * ใช้ OLD execute syntax ของ Bedrock/Education Edition:
 *   execute <entity> <x y z> <command>
 * ไม่ใช่ new syntax (as/at/if/run) ที่ Education Edition ไม่รองรับ
 */

//% color=#E63946 weight=100 icon="\uf21a"
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
     * Internal: run detection for all hostile mob types
     *
     * ใช้ gameplay.runCommand() — วิธีที่ถูกต้องในการรัน Minecraft command
     * จาก MakeCode TypeScript (แทน player.execute() ที่ไม่มีอยู่ใน API)
     *
     * execute format (OLD Bedrock syntax ที่ Education Edition รองรับ):
     *   execute @e[type=<mob>,r=<radius>] ~ ~ ~ tell @p <message>
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
            // gameplay.runCommand() คือ API ที่ถูกต้องใน MakeCode Minecraft
            // (ตรงกับ block "run command" ใน category GAMEPLAY)
            gameplay.runCommand(
                `execute @e[type=${mobs[i]},r=${_r}] ~ ~ ~ tell @p [AgentGuard] พบ ${mobs[i]} ในระยะ ${_r} บล็อก!`
            )
        }
    }
}
