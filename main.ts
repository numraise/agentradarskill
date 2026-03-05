/**
 * Agent Guard — Hostile Mob Detector
 * Detect hostile mobs near the player and alert via chat
 * For Minecraft Education Edition 1.21.x
 *
 * การแก้ไข Bug:
 *   BUG 1 (blocks ไม่แสดง): //% color="#E63946" ใส่ quotes → แก้เป็น //% color=#E63946
 *   BUG 2 (compile error): gameplay.runCommand() ไม่ใช่ API ที่ถูกต้อง
 *                          → ใช้ player.execute() ซึ่งเป็น Official MakeCode Minecraft API
 *
 * คำสั่ง execute ที่ใช้ (OLD Bedrock syntax ที่ Education Edition รองรับ):
 *   execute @e[type=zombie,r=10] ~ ~ ~ tell @p [AgentGuard] พบ zombie!
 *   = ถ้ามี zombie อยู่ในระยะ r บล็อก → ส่ง tell ถึง player ที่ใกล้ที่สุด
 *   ถ้าไม่มี mob ในระยะ = ไม่มีอะไรเกิดขึ้น
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
     * Internal: run detection for all hostile mob types
     *
     * player.execute(command) = Official MakeCode Minecraft API
     * ทำงานเหมือน player พิมพ์ slash command ใน chat
     *
     * execute format (OLD Bedrock syntax สำหรับ Education Edition):
     *   execute @e[type=<mob>,r=<radius>] ~ ~ ~ tell @p <message>
     *
     * หมายเหตุ: ใช้ tell @p แทน say เพื่อให้ข้อความส่งถึงแค่ผู้เล่นที่ใกล้ที่สุด
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
            // player.execute() = Official MakeCode Minecraft API
            // (ดูที่ https://minecraft.makecode.com/reference/player/execute)
            player.execute(
                `execute @e[type=${mobList[i]},r=${_r}] ~ ~ ~ tell @p [AgentGuard] พบ ${mobList[i]} ในระยะ ${_r} บล็อก!`
            )
        }
    }
}
